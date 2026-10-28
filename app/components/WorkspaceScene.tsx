
"use client";

import ModelAsset from "./ModelAsset";
import { Canvas, useThree } from "@react-three/fiber";
import { CameraControls } from "@react-three/drei";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";

import type {
  DeskId,
  ChairId,
  AccessoryId,
} from "../data/products";

type ViewMode = "iso" | "front";

type FocusTarget =
  | "workspace"
  | "desk"
  | "chair"
  | "monitor"
  | "plant";

type MovableTarget = Exclude<FocusTarget, "workspace">;
type Position3 = [number, number, number];

type WorkspaceSceneProps = {
  selectedDesk: DeskId;
  selectedChair: ChairId;
  selectedAccessories: AccessoryId[];
  onItemSelect: (item: FocusTarget) => void;
};

const cameraPositions: Record<
  FocusTarget,
  { camera: Position3; target: Position3 }
> = {
  workspace: {
    camera: [6, 5, 7],
    target: [0, 1, 0],
  },
  desk: {
    camera: [3.5, 3.4, 4.2],
    target: [0, 1, 0],
  },
  chair: {
    camera: [2.2, 2.5, 4.4],
    target: [0, 1, 1.1],
  },
  monitor: {
    camera: [1.5, 3, 2.5],
    target: [0, 1.7, -0.35],
  },
  plant: {
    camera: [-2.4, 2.8, 2.2],
    target: [-1.2, 1.65, -0.35],
  },
};

// Approximate half-footprint of each model.
// Smaller values allow furniture to move closer to the walls.
const movementBounds: Record<
  MovableTarget,
  { x: number; z: number }
> = {
  desk: { x: 1.45, z: 0.65 },
  chair: { x: 0.5, z: 0.5 },
  monitor: { x: 0.6, z: 0.3 },
  plant: { x: 0.2, z: 0.2 },
};

// The floor surface is at y = -0.04.
const floorPlane = new THREE.Plane(
  new THREE.Vector3(0, 1, 0),
  0.04
);

type DragState = {
  target: MovableTarget;
  pointerId: number;
  offsetX: number;
  offsetZ: number;
  startX: number;
  startY: number;
  moved: boolean;
};

function DragController({
  onMove,
  onEnd,
}: {
  onMove: (event: PointerEvent, hit: THREE.Vector3 | null) => void;
  onEnd: (event: PointerEvent) => void;
}) {
  const { gl, camera } = useThree();

  // Keep the event listeners connected to the latest callbacks.
  const callbacks = useRef({ onMove, onEnd });
  callbacks.current = { onMove, onEnd };

  useEffect(() => {
    const canvas = gl.domElement;
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    function handleMove(event: PointerEvent) {
      const rect = canvas.getBoundingClientRect();

      if (!rect.width || !rect.height) return;

      pointer.set(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -((event.clientY - rect.top) / rect.height) * 2 + 1
      );

      raycaster.setFromCamera(pointer, camera);

      const hit = new THREE.Vector3();
      const intersection = raycaster.ray.intersectPlane(
        floorPlane,
        hit
      );

      callbacks.current.onMove(
        event,
        intersection ? hit.clone() : null
      );
    }

    function handleEnd(event: PointerEvent) {
      callbacks.current.onEnd(event);
    }

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleEnd);
    window.addEventListener("pointercancel", handleEnd);

    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleEnd);
      window.removeEventListener("pointercancel", handleEnd);
    };
  }, [gl, camera]);

  return null;
}

export default function WorkspaceScene({
  selectedDesk,
  selectedChair,
  selectedAccessories,
  onItemSelect,
}: WorkspaceSceneProps) {
  const [view, setView] = useState<ViewMode>("iso");
  const [focusedItem, setFocusedItem] =
    useState<FocusTarget>("workspace");

  // Furniture positions.
  const [deskPosition, setDeskPosition] =
    useState<Position3>([0, 0, 0]);

  const [chairPosition, setChairPosition] =
    useState<Position3>([0, 0, 1.25]);

  const [monitorPosition, setMonitorPosition] =
    useState<Position3>([0, 0, -0.35]);

  const [plantPosition, setPlantPosition] =
    useState<Position3>([-1.1, 0, -0.35]);

  // Furniture rotations, in radians.
  const [deskRotation, setDeskRotation] = useState(0);
  const [chairRotation, setChairRotation] = useState(-1.35);
  const [monitorRotation, setMonitorRotation] = useState(0);
  const [plantRotation, setPlantRotation] = useState(0);

  const controls = useRef<any>(null);
  const initialized = useRef(false);
  const dragRef = useRef<DragState | null>(null);
  const suppressClickRef = useRef(false);
  const intersection = useRef(new THREE.Vector3());

  const setControlsRef = useCallback((instance: any) => {
    controls.current = instance;

    if (instance && !initialized.current) {
      initialized.current = true;

      const { camera, target } = cameraPositions.workspace;

      instance.setLookAt(
        ...camera,
        ...target,
        false
      );
    }
  }, []);

  function setCameraEnabled(enabled: boolean) {
    if (controls.current) {
      controls.current.enabled = enabled;
    }
  }

  function focusItem(target: FocusTarget) {
    setFocusedItem(target);
    onItemSelect(target);
  }

  function switchView(nextView: ViewMode) {
    setView(nextView);
    setFocusedItem("workspace");
    onItemSelect("workspace");

    const destination =
      nextView === "iso"
        ? cameraPositions.workspace
        : {
            camera: [0, 2.8, 10] as Position3,
            target: [0, 0.8, 0] as Position3,
          };

    controls.current?.setLookAt(
      ...destination.camera,
      ...destination.target,
      true
    );
  }

  function updatePosition(
    target: MovableTarget,
    position: Position3
  ) {
    const bounds = movementBounds[target];

    // Get the current rotation of the moving furniture.
    const rotation =
      target === "desk"
        ? deskRotation
        : target === "chair"
          ? chairRotation
          : target === "monitor"
            ? monitorRotation
            : plantRotation;

    // Calculate the rotated footprint's dimensions.
    const cos = Math.abs(Math.cos(rotation));
    const sin = Math.abs(Math.sin(rotation));

    const extentX = cos * bounds.x + sin * bounds.z;
    const extentZ = sin * bounds.x + cos * bounds.z;

    // Keep the rotated furniture inside the floor.
    // The small gap helps prevent visible wall clipping.
    const gap = 0.03;

    const x = THREE.MathUtils.clamp(
      position[0],
      -4 + extentX + gap,
      4 - extentX - gap
    );

    const z = THREE.MathUtils.clamp(
      position[2],
      -4 + extentZ + gap,
      4 - extentZ - gap
    );

    const next: Position3 = [x, 0, z];

    switch (target) {
      case "desk":
        setDeskPosition(next);
        break;
      case "chair":
        setChairPosition(next);
        break;
      case "monitor":
        setMonitorPosition(next);
        break;
      case "plant":
        setPlantPosition(next);
        break;
    }
  }

  function handleDragStart(
    event: ThreeEvent<PointerEvent>,
    target: MovableTarget,
    position: Position3
  ) {
    event.stopPropagation();

    const hit = event.ray.intersectPlane(
      floorPlane,
      intersection.current
    );

    if (!hit) return;

    dragRef.current = {
      target,
      pointerId: event.pointerId,
      offsetX: position[0] - hit.x,
      offsetZ: position[2] - hit.z,
      startX: event.nativeEvent.clientX,
      startY: event.nativeEvent.clientY,
      moved: false,
    };

    suppressClickRef.current = false;

    controls.current?.stop();
    setCameraEnabled(false);
    document.body.style.cursor = "grabbing";
  }

  function handleDragMove(
    event: PointerEvent,
    hit: THREE.Vector3 | null
  ) {
    const drag = dragRef.current;

    if (!drag || drag.pointerId !== event.pointerId || !hit) {
      return;
    }

    const dx = event.clientX - drag.startX;
    const dy = event.clientY - drag.startY;

    if (Math.hypot(dx, dy) > 4) {
      drag.moved = true;
    }

    updatePosition(drag.target, [
      hit.x + drag.offsetX,
      0,
      hit.z + drag.offsetZ,
    ]);
  }

  function handleDragEnd(event: PointerEvent) {
    const drag = dragRef.current;

    if (!drag || drag.pointerId !== event.pointerId) return;

    suppressClickRef.current = drag.moved;
    dragRef.current = null;

    setCameraEnabled(true);
    document.body.style.cursor = "auto";
  }

  function draggableProps(
    target: MovableTarget,
    position: Position3
  ) {
    return {
      position,
      onPointerDown: (event: ThreeEvent<PointerEvent>) =>
        handleDragStart(event, target, position),

      onClick: (event: ThreeEvent<MouseEvent>) => {
        event.stopPropagation();

        // Ignore the click that may follow a completed drag.
        if (suppressClickRef.current) {
          suppressClickRef.current = false;
          return;
        }

        focusItem(target);
      },

      onPointerOver: () => {
        if (!dragRef.current) {
          document.body.style.cursor = "grab";
        }
      },

      onPointerOut: () => {
        if (!dragRef.current) {
          document.body.style.cursor = "auto";
        }
      },
    };
  }

  function rotateFocusedItem() {
    const step = Math.PI / 4; // 45 degrees

    switch (focusedItem) {
      case "desk":
        setDeskRotation((rotation) => rotation + step);
        break;
      case "chair":
        setChairRotation((rotation) => rotation + step);
        break;
      case "monitor":
        setMonitorRotation((rotation) => rotation + step);
        break;
      case "plant":
        setPlantRotation((rotation) => rotation + step);
        break;
      case "workspace":
        break;
    }
  }

  const buttonClass = (mode: ViewMode) =>
    `rounded-lg px-3 py-2 text-sm transition-colors ${
      view === mode
        ? "bg-stone-900 text-white"
        : "text-stone-600 hover:bg-stone-100"
    }`;

  return (
    <div className="absolute inset-0">
      <Canvas
        className="absolute inset-0"
        shadows={{ type: THREE.PCFShadowMap }}
        camera={{
          position: [6, 5, 7],
          fov: 38,
        }}
      >
        <DragController
          onMove={handleDragMove}
          onEnd={handleDragEnd}
        />

        {/* Room background */}
        <color attach="background" args={["#F5F1E9"]} />

        {/* Lighting */}
        <ambientLight intensity={1.8} />

        <directionalLight
          position={[4, 8, 5]}
          intensity={1.2}
          castShadow
        />

        {/* Room floor */}
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -0.04, 0]}
          receiveShadow
        >
          <planeGeometry args={[8, 8]} />
          <meshStandardMaterial
            color="#D8C8B4"
            roughness={0.95}
          />
        </mesh>

        {/* Back wall */}
        <mesh position={[0, 1.71, -4.06]} receiveShadow>
          <boxGeometry args={[8.12, 3.5, 0.12]} />
          <meshStandardMaterial
            color="#F5F0E8"
            roughness={0.95}
          />
        </mesh>

        {/* Left wall */}
        <mesh position={[-4.06, 1.71, 0]} receiveShadow>
          <boxGeometry args={[0.12, 3.5, 8.12]} />
          <meshStandardMaterial
            color="#EAE2D7"
            roughness={0.95}
          />
        </mesh>

        {/* Desk */}
        <group
          {...draggableProps("desk", deskPosition)}
          rotation={[0, deskRotation, 0]}
        >
          <ModelAsset
            url="/models/office-table.glb"
            width={2.9}
            tint={
              selectedDesk === "white"
                ? "#F0EEE8"
                : "#C7A17D"
            }
          />
        </group>

        {/* Chair */}
        <group
          {...draggableProps("chair", chairPosition)}
          rotation={[0, chairRotation, 0]}
        >
          <ModelAsset
            url="/models/office-chair.glb"
            width={1.3}
            tint={
              selectedChair === "black"
                ? "#85888A"
                : "#A69B8D"
            }
          />
        </group>

        {/* Monitor */}
        {selectedAccessories.includes("monitor") && (
          <group
            {...draggableProps("monitor", monitorPosition)}
            rotation={[0, monitorRotation, 0]}
          >
            <group position={[0, 1.55, 0]}>
              <ModelAsset
                url="/models/monitor.glb"
                width={1.25}
              />
            </group>
          </group>
        )}

        {/* Plant */}
        {selectedAccessories.includes("plant") && (
          <group
            {...draggableProps("plant", plantPosition)}
            rotation={[0, plantRotation, 0]}
          >
            <group position={[0, 1.55, 0]} scale={0.5}>
              <ModelAsset
                url="/models/potted-plant.glb"
                width={0.6}
              />
            </group>
          </group>
        )}

        {/* Camera controls */}
        <CameraControls
          ref={setControlsRef}
          makeDefault
          smoothTime={0.7}
          minDistance={2}
          maxDistance={14}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>

      {/* View selector and rotation button */}
      <div className="absolute right-3 top-5 z-20 flex rounded-xl border border-stone-200/70 bg-white/85 p-1 shadow-sm backdrop-blur-md sm:right-6 sm:top-10">
        <button
          type="button"
          onClick={() => switchView("iso")}
          aria-pressed={view === "iso"}
          className={buttonClass("iso")}
        >
          Isometric
        </button>

        <button
          type="button"
          onClick={() => switchView("front")}
          aria-pressed={view === "front"}
          className={buttonClass("front")}
        >
          Front
        </button>
      </div>

      {focusedItem !== "workspace" && (
        <>
          <button
            type="button"
            onClick={rotateFocusedItem}
            className="absolute left-1/2 top-5 z-20 -translate-x-1/2 rounded-xl border border-stone-200/70 bg-white/85 px-3 py-3 text-sm text-stone-700 shadow-sm backdrop-blur-md transition hover:bg-white sm:top-10"
            title="Rotate selected furniture 45 degrees"
            aria-label="Rotate selected furniture 45 degrees"
          >
            ↻ Rotate 45°
          </button>
        </>
      )}

      {/* Interaction hint */}
      <p className="pointer-events-none absolute bottom-5 left-1/2 z-10 -translate-x-1/2 rounded-full border border-stone-200/70 bg-white/75 px-4 py-2 text-center text-xs text-stone-600 backdrop-blur-md">
        Drag furniture to move · Click an item to explore · Drag empty space to rotate
      </p>
    </div>
  );
}


"use client";

import ModelAsset from "./ModelAsset";
import { Canvas } from "@react-three/fiber";
import { CameraControls } from "@react-three/drei";
import { useCallback, useRef, useState } from "react";
import * as THREE from "three";

import type {
  DeskId,
  ChairId,
  AccessoryId,
} from "../data/products";

type ViewMode = "iso" | "front";
type FocusTarget = "workspace" | "desk" | "chair" | "monitor" | "plant";

type WorkspaceSceneProps = {
  selectedDesk: DeskId;
  selectedChair: ChairId;
  selectedAccessories: AccessoryId[];
  onItemSelect: (item: FocusTarget) => void;
};

const cameraPositions: Record<
  FocusTarget,
  {
    camera: [number, number, number];
    target: [number, number, number];
  }
> = {
  workspace: { camera: [6, 5, 7], target: [0, 1, 0] },
  desk: { camera: [3.5, 3.4, 4.2], target: [0, 1.0, 0] },
  chair: { camera: [2.2, 2.5, 4.4], target: [0, 1.0, 1.1] },
  monitor: { camera: [1.5, 3.0, 2.5], target: [0, 1.7, -0.35] },
  plant: { camera: [-2.4, 2.8, 2.2], target: [-1.2, 1.65, -0.35] },
};

function Desk({ variant }: { variant: DeskId }) {
  const isWhite = variant === "white";

  return (
    <group>
      <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.4, 0.16, 1.5]} />
        <meshStandardMaterial color={isWhite ? "#F0EEE8" : "#B88961"} />
      </mesh>

      {[-1.45, 1.45].map((x) =>
        [-0.58, 0.58].map((z) => (
          <mesh
            key={`${x}-${z}`}
            position={[x, 0.72, z]}
            castShadow
          >
            <boxGeometry args={[0.12, 1.4, 0.12]} />
            <meshStandardMaterial
              color={isWhite ? "#D7D4CC" : "#8A6246"}
            />
          </mesh>
        ))
      )}
    </group>
  );
}

function Chair({ variant }: { variant: ChairId }) {
  const isBlack = variant === "black";
  const upholstery = isBlack ? "#34383D" : "#718875";

  return (
    <group position={[0, 0, 1.25]} rotation={[0, Math.PI, 0]}>
      <mesh position={[0, 0.85, 0]} castShadow>
        <boxGeometry args={[0.9, 0.16, 0.8]} />
        <meshStandardMaterial color={upholstery} />
      </mesh>

      <mesh position={[0, 1.3, -0.32]} castShadow>
        <boxGeometry args={[0.85, 0.9, 0.12]} />
        <meshStandardMaterial color={upholstery} />
      </mesh>

      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.07, 0.07, 0.75, 16]} />
        <meshStandardMaterial color="#55565A" metalness={0.5} />
      </mesh>

      <mesh position={[0, 0.08, 0]}>
        <cylinderGeometry args={[0.42, 0.42, 0.08, 5]} />
        <meshStandardMaterial color="#55565A" metalness={0.5} />
      </mesh>
    </group>
  );
}

function Monitor() {
  return (
    <group position={[0, 2.15, -0.35]}>
      <mesh>
        <boxGeometry args={[1.15, 0.7, 0.08]} />
        <meshStandardMaterial color="#292D32" />
      </mesh>

      <mesh position={[0, 0, 0.045]}>
        <boxGeometry args={[1.04, 0.59, 0.015]} />
        <meshStandardMaterial
          color="#B7D5D0"
          emissive="#243B3B"
          emissiveIntensity={0.2}
        />
      </mesh>

      <mesh position={[0, -0.43, -0.02]}>
        <boxGeometry args={[0.08, 0.3, 0.08]} />
        <meshStandardMaterial color="#55565A" />
      </mesh>

      <mesh position={[0, -0.58, 0.02]}>
        <boxGeometry args={[0.42, 0.05, 0.25]} />
        <meshStandardMaterial color="#55565A" />
      </mesh>
    </group>
  );
}

function Plant() {
  return (
    <group position={[-1.2, 1.58, -0.35]}>
      <mesh position={[0, 0.13, 0]}>
        <cylinderGeometry args={[0.13, 0.1, 0.26, 12]} />
        <meshStandardMaterial color="#D99C72" />
      </mesh>

      {[0, 1, 2, 3, 4].map((i) => (
        <mesh
          key={i}
          position={[
            Math.cos((i * Math.PI * 2) / 5) * 0.12,
            0.42 + (i % 2) * 0.12,
            Math.sin((i * Math.PI * 2) / 5) * 0.12,
          ]}
          rotation={[0.2, i, -0.35]}
        >
          <sphereGeometry args={[0.12, 12, 12]} />
          <meshStandardMaterial color="#63836B" />
        </mesh>
      ))}
    </group>
  );
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

  const controls = useRef<any>(null);
  const initialized = useRef(false);

  const setControlsRef = useCallback((instance: any) => {
    controls.current = instance;

    if (instance && !initialized.current) {
      initialized.current = true;
      const { camera, target } = cameraPositions.workspace;
      instance.setLookAt(...camera, ...target, false);
    }
  }, []);

  function focusItem(target: FocusTarget) {
    setFocusedItem(target);
    onItemSelect(target);

    const destination = cameraPositions[target];

    controls.current?.setLookAt(
      ...destination.camera,
      ...destination.target,
      true
    );

    if (target === "workspace") {
      setView("iso");
    }
  }

  function switchView(nextView: ViewMode) {
    setView(nextView);
    setFocusedItem("workspace");
    onItemSelect("workspace");

    const destination =
      nextView === "iso"
        ? cameraPositions.workspace
        : {
            camera: [0, 2.8, 10] as [number, number, number],
            target: [0, 0.8, 0] as [number, number, number],
          };

    controls.current?.setLookAt(
      ...destination.camera,
      ...destination.target,
      true
    );
  }

  const buttonClass = (mode: ViewMode) =>
    `rounded-lg px-3 py-2 text-sm transition-colors ${
      view === mode
        ? "bg-stone-900 text-white"
        : "text-stone-600 hover:bg-stone-100"
    }`;

  function clickableProps(target: FocusTarget) {
    return {
      onClick: (event: { stopPropagation: () => void }) => {
        event.stopPropagation();
        focusItem(target);
      },
      onPointerOver: () => {
        document.body.style.cursor = "pointer";
      },
      onPointerOut: () => {
        document.body.style.cursor = "auto";
      },
    };
  }

  return (
    <div className="absolute inset-0">
      <Canvas
        className="absolute inset-0"
        shadows={{ type: THREE.PCFShadowMap }}
        camera={{ position: [6, 5, 7], fov: 38 }}
      >
        <color attach="background" args={["#F5F1E9"]} />

        <ambientLight intensity={1.5} />

        <directionalLight
          position={[4, 8, 5]}
          intensity={2}
          castShadow
        />

        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -0.04, 0]}
          receiveShadow
        >
          <planeGeometry args={[200, 200]} />
          <meshStandardMaterial color="#E9E2D6" />
        </mesh>

        <group>
          <group {...clickableProps("desk")}>
            <ModelAsset
              url="/models/office-table.glb"
              width={2.9}
              tint={selectedDesk === "white" ? "#F0EEE8" : "#C7A17D"}
          />
          </group>

          <group {...clickableProps("chair")}>
            <group
                position={[0, 0, 1.25]}
                rotation={[0, -1.35, 0]}
            >
            <ModelAsset
              url="/models/office-chair.glb"
              width={1.3}
              tint={selectedChair === "black" ? "#85888A" : "#A69B8D"}
            />
          </group>
        </group>

          {selectedAccessories.includes("monitor") && (
            <group {...clickableProps("monitor")}>
                <group
                    position={[0, 1.55, -0.35]}
                    scale={1}
                >
                <ModelAsset
                    url="/models/monitor.glb"
                    width={1.25}
                />
                </group>
            </group>
          )}

          {selectedAccessories.includes("plant") && (
            <group {...clickableProps("plant")}>
              <group
                  position={[-1.1, 1.55, -0.35]}
                  scale={0.5}
              >
                  <ModelAsset
                  url="/models/potted-plant.glb"
                  width={0.6}
                  />
              </group>
            </group>
          )}
        </group>

        <CameraControls
          ref={setControlsRef}
          makeDefault
          smoothTime={0.7}
          minDistance={2}
          maxDistance={14}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>

      <div className="absolute right-5 top-5 z-20 flex rounded-xl border border-stone-200/70 bg-white/85 p-1 shadow-sm backdrop-blur-md sm:right-10 sm:top-10">
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
        <button
          type="button"
          onClick={() => focusItem("workspace")}
          className="absolute left-1/2 top-5 z-20 -translate-x-1/2 rounded-full border border-stone-200 bg-white/90 px-4 py-2 text-sm text-stone-700 shadow-sm backdrop-blur-md transition hover:bg-white"
        >
          ← Back to workspace
        </button>
      )}

      <p className="pointer-events-none absolute bottom-5 left-1/2 z-10 -translate-x-1/2 rounded-full border border-stone-200/70 bg-white/75 px-4 py-2 text-xs text-stone-600 backdrop-blur-md">
        Click an item to explore · Drag to rotate
      </p>
    </div>
  );
}

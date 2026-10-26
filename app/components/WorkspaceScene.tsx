
"use client";

import { Canvas } from "@react-three/fiber";
import { CameraControls } from "@react-three/drei";
import { useRef, useState } from "react";
import * as THREE from "three";

type ViewMode = "iso" | "front";

function Desk() {
    return (
        <group>
            <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
                <boxGeometry args={[3.4, 0.16, 1.5]} />
                <meshStandardMaterial color="#B88961" />
            </mesh>

            {[-1.45, 1.45].map((x) =>
                [-0.58, 0.58].map((z) => (
                <mesh
                    key={`${x}-${z}`}
                    position={[x, 0.72, z]}
                    castShadow
                >
                    <boxGeometry args={[0.12, 1.4, 0.12]} />
                    <meshStandardMaterial color="#8A6246" />
                </mesh>
                ))
            )}
        </group>
    );
}

function Chair() {
    return (
        <group position={[0, 0, 1.25]} rotation={[0, Math.PI, 0]}>
            <mesh position={[0, 0.85, 0]} castShadow>
                <boxGeometry args={[0.9, 0.16, 0.8]} />
                <meshStandardMaterial color="#718875" />
            </mesh>

            <mesh position={[0, 1.3, -0.32]} castShadow>
                <boxGeometry args={[0.85, 0.9, 0.12]} />
                <meshStandardMaterial color="#718875" />
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

export default function WorkspaceScene() {
    const [view, setView] = useState<ViewMode>("iso");
    const controls = useRef<any>(null);

    function switchView(nextView: ViewMode) {
        setView(nextView);

        if (nextView === "iso") {
            controls.current?.setLookAt(6, 5, 7, 0, 1, 0, true);
        } else {
            controls.current?.setLookAt(0, 3, 10, 0, 1, 0, true);
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
      {/* Full-screen 3D canvas */}
      <Canvas
        className="absolute inset-0"
        shadows={{ type: THREE.PCFShadowMap }}
        camera={{ position: [6, 5, 7], fov: 38 }}
        onCreated={({ camera }) => camera.lookAt(0, 1, 0)}
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

        <Desk />
        <Chair />
        <Monitor />
        <Plant />

        <CameraControls
          ref={controls}
          makeDefault
          smoothTime={0.5}
          minDistance={5}
          maxDistance={14}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>

      {/* Floating camera controls */}
      <div className="absolute right-5 top-5 z-20 flex rounded-xl border border-stone-200/70 bg-white/85 p-1 shadow-sm backdrop-blur-md sm:right-10 sm:top-10">
        <button
          onClick={() => switchView("iso")}
          aria-pressed={view === "iso"}
          className={buttonClass("iso")}
        >
          Isometric
        </button>

        <button
          onClick={() => switchView("front")}
          aria-pressed={view === "front"}
          className={buttonClass("front")}
        >
          Front
        </button>
      </div>

      {/* Small interaction hint */}
      <p className="pointer-events-none absolute bottom-5 left-1/2 z-10 -translate-x-1/2 rounded-full border border-stone-200/70 bg-white/75 px-4 py-2 text-xs text-stone-600 backdrop-blur-md">
        Drag to explore your workspace
      </p>
    </div>
  );
}

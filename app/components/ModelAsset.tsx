
"use client";

import { useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

type ModelAssetProps = {
  url: string;
  width: number;
  tint?: string;
};

export default function ModelAsset({
  url,
  width,
  tint,
}: ModelAssetProps) {
  const { scene } = useGLTF(url);

  const model = useMemo(() => {
    const clone = scene.clone(true);

    const bounds = new THREE.Box3().setFromObject(clone);
    const size = new THREE.Vector3();
    const scale = width / Math.max(size.x, 0.0001);

    bounds.getSize(size);
    const center = bounds.getCenter(new THREE.Vector3());
    const safeScale = width / Math.max(size.x, 0.0001);

    clone.scale.setScalar(safeScale);
    clone.position.set(
      -center.x * safeScale,
      -bounds.min.y * safeScale,
      -center.z * safeScale
    );

    clone.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;

      object.castShadow = true;
      object.receiveShadow = true;

      const tintMaterial = (material: THREE.Material) => {
        const copy = material.clone();

        if (tint && "color" in copy) {
          (copy as THREE.MeshStandardMaterial).color.set(tint);
        }

        return copy;
      };

      object.material = Array.isArray(object.material)
        ? object.material.map(tintMaterial)
        : tintMaterial(object.material);
    });

    return clone;
  }, [scene, width, tint]);

  return <primitive object={model} />;
}

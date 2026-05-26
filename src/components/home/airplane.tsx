"use client";

import { useFBX } from "@react-three/drei";
import { forwardRef } from "react";
import { Group } from "three";

const Airplane = forwardRef<Group>((props, ref) => {
  const model = useFBX("/models/Airbus A330-200.fbx");

  return (
    <group ref={ref} {...props}>
      <primitive object={model} scale={0.01} />
    </group>
  );
});

Airplane.displayName = "Airplane";
export { Airplane };

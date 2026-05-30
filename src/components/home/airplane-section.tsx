"use client";

import { useGSAP } from "@gsap/react";
import { Environment } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Suspense, useEffect, useRef, useState } from "react";
import { Group } from "three";
import { Airplane } from "./airplane";

gsap.registerPlugin(ScrollTrigger);

export function AirplaneSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [airplane, setAirplaneRef] = useState<Group | null>(null);

  useEffect(() => {
    if (!airplane) return;
  }, []);

  useGSAP(() => {
    const ctx = gsap.context(() => {
      if (!airplane) return;
      gsap.to(airplane.rotation, {
        z: 0.15,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(containerRef.current, {
        opacity: 1,
        duration: 0,
        scrollTrigger: {
          trigger: ".box",
          start: "top bottom",
          toggleActions: "play none none none",
        },
      });

      gsap.fromTo(
        airplane.rotation,
        {
          x: -0.5,
        },
        {
          x: -0.2,
          scrollTrigger: {
            trigger: "#how",
            start: "top bottom",
            end: "bottom bottom",
            scrub: true,
          },
        },
      );

      gsap.fromTo(
        airplane.position,
        {
          x: 0,
          y: -45,
          z: -100,
        },
        {
          x: 2,
          y: 18,
          z: 0,
          scrollTrigger: {
            trigger: "#how",
            start: "top bottom",
            end: "bottom bottom",
            scrub: true,
          },
        },
      );

      gsap.fromTo(
        airplane.scale,
        {
          x: 0,
          y: 0,
          z: 0,
        },
        {
          x: 1,
          y: 1,
          z: 1,
          scrollTrigger: {
            trigger: "#how",
            start: "top bottom",
            end: "bottom bottom",
            scrub: true,
          },
        },
      );
    });

    return () => ctx.revert();
  }, [airplane]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-full h-full pointer-events-none opacity-0"
    >
      <Canvas
        camera={{ position: [0, 0, 0], fov: 50 }}
        style={{ pointerEvents: "none" }}
      >
        <ambientLight intensity={1.5} />

        <directionalLight position={[5, 5, 5]} intensity={2} />

        <Suspense fallback={null}>
          <Airplane ref={setAirplaneRef} />
        </Suspense>

        <Environment preset="sunset" />
      </Canvas>
    </div>
  );
}

"use client";
import { useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sphere } from "@react-three/drei";
import * as THREE from "three";

function Shape({
  position, scale, color, distort, speed, rotOffset, geo,
}: {
  position: [number, number, number];
  scale: number;
  color: string;
  distort: number;
  speed: number;
  rotOffset: number;
  geo: "ico" | "torus" | "oct" | "sphere" | "torusKnot";
}) {
  const ref = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const { mouse } = useThree();

  useFrame((state) => {
    if (!ref.current || !meshRef.current) return;
    const t = state.clock.getElapsedTime() + rotOffset;
    
    // Idle rotation
    meshRef.current.rotation.x = Math.sin(t * speed * 0.4) * 0.6;
    meshRef.current.rotation.y = t * speed * 0.3;
    meshRef.current.rotation.z = Math.cos(t * speed * 0.2) * 0.3;
    
    // Mouse parallax and rotation
    const targetX = (mouse.x * 1.5);
    const targetY = (mouse.y * 1.5);
    
    ref.current.position.x = THREE.MathUtils.lerp(ref.current.position.x, position[0] + targetX, 0.05);
    ref.current.position.y = THREE.MathUtils.lerp(ref.current.position.y, position[1] + targetY, 0.05);
    // Depth shift (z-axis illusion)
    ref.current.position.z = THREE.MathUtils.lerp(ref.current.position.z, position[2] + (mouse.x * mouse.y) * 2, 0.05);
    
    meshRef.current.rotation.x += mouse.y * 0.4;
    meshRef.current.rotation.y += mouse.x * 0.4;
  });

  const Geo = () => {
    if (geo === "ico") return <icosahedronGeometry args={[1, 0]} />;
    if (geo === "torus") return <torusGeometry args={[0.7, 0.2, 12, 32]} />;
    if (geo === "oct") return <octahedronGeometry args={[0.9, 0]} />;
    if (geo === "sphere") return <sphereGeometry args={[1, 16, 16]} />;
    return <torusKnotGeometry args={[0.55, 0.18, 64, 8]} />;
  };

  return (
    <group ref={ref} position={position}>
      <Float speed={1.8} rotationIntensity={0.4} floatIntensity={0.6}>
        {/* Glow Aura */}
        <Sphere args={[scale * 1.8, 16, 16]} position={[0, 0, -1]}>
          <meshBasicMaterial color={color} transparent opacity={0.12} blending={THREE.AdditiveBlending} depthWrite={false} />
        </Sphere>
        <mesh ref={meshRef} scale={scale}>
          <Geo />
          <MeshDistortMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.3}
            metalness={0.9}
            roughness={0.1}
            distort={distort}
            speed={speed * 2}
            transparent
            opacity={0.85}
          />
        </mesh>
      </Float>
    </group>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.15} />
      <pointLight position={[6, 4, 4]} intensity={3} color="#8b5cf6" />
      <pointLight position={[-6, -4, 3]} intensity={2} color="#00d4ff" />
      <pointLight position={[0, 0, 6]} intensity={0.8} color="#ec4899" />
      <Shape position={[-4.5, 1.2, -3]} scale={1.2} color="#8b5cf6" distort={0.3} speed={0.5} rotOffset={0} geo="ico" />
      <Shape position={[4.2, -0.8, -4]} scale={0.95} color="#06b6d4" distort={0.2} speed={0.35} rotOffset={2} geo="torusKnot" />
      <Shape position={[-2.8, -2.2, -2]} scale={0.8} color="#7c3aed" distort={0.4} speed={0.65} rotOffset={4} geo="oct" />
      <Shape position={[3.2, 2.4, -5]} scale={1.4} color="#1d4ed8" distort={0.12} speed={0.22} rotOffset={1} geo="sphere" />
      <Shape position={[0.8, -3, -4.5]} scale={0.9} color="#6d28d9" distort={0.28} speed={0.42} rotOffset={3} geo="torus" />
    </>
  );
}

export default function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 55 }}
      dpr={1}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      style={{ background: "transparent" }}
    >
      <Scene />
    </Canvas>
  );
}

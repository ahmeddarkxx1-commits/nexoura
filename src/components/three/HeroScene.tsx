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
    
    // Idle rotation (Slowed down and made more subtle)
    meshRef.current.rotation.x = Math.sin(t * speed * 0.2) * 0.4;
    meshRef.current.rotation.y = t * speed * 0.15;
    meshRef.current.rotation.z = Math.cos(t * speed * 0.1) * 0.2;
    
    // Mouse parallax and rotation
    const targetX = (mouse.x * 1.5);
    const targetY = (mouse.y * 1.5);
    
    ref.current.position.x = THREE.MathUtils.lerp(ref.current.position.x, position[0] + targetX, 0.05);
    ref.current.position.y = THREE.MathUtils.lerp(ref.current.position.y, position[1] + targetY, 0.05);
    // Depth shift (z-axis illusion)
    ref.current.position.z = THREE.MathUtils.lerp(ref.current.position.z, position[2] + (mouse.x * mouse.y) * 2, 0.05);
    
    meshRef.current.rotation.x += mouse.y * 0.2;
    meshRef.current.rotation.y += mouse.x * 0.2;
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
            emissiveIntensity={0.15} /* Reduced from 0.3 */
            metalness={0.8}
            roughness={0.2}
            distort={distort}
            speed={speed * 1.5}
            transparent
            opacity={0.8}
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
      <pointLight position={[6, 4, 4]} intensity={3} color="#0077b6" />
      <pointLight position={[-6, -4, 3]} intensity={2} color="#00b4d8" />
      <pointLight position={[0, 0, 6]} intensity={0.8} color="#023e8a" />
      <Shape position={[-4.8, 1.4, -3.5]} scale={1.2} color="#0077b6" distort={0.2} speed={0.3} rotOffset={0} geo="ico" />
      <Shape position={[4.5, -0.6, -4.5]} scale={0.95} color="#00b4d8" distort={0.15} speed={0.25} rotOffset={2} geo="torusKnot" />
      <Shape position={[-3.2, -2.5, -2.5]} scale={0.8} color="#005f73" distort={0.25} speed={0.4} rotOffset={4} geo="oct" />
      <Shape position={[3.5, 2.8, -5.5]} scale={1.4} color="#023e8a" distort={0.1} speed={0.15} rotOffset={1} geo="sphere" />
      <Shape position={[1.2, -3.4, -5]} scale={0.9} color="#0077b6" distort={0.2} speed={0.3} rotOffset={3} geo="torus" />
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

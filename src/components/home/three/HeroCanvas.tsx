"use client";

import * as React from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment, ContactShadows, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";

function useMouseRotation(speed = 0.18) {
  const target = React.useRef({ x: 0, y: 0 });
  const group = React.useRef<THREE.Group>(null);

  React.useEffect(() => {
    const onMove = (e: MouseEvent) => {
      target.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      target.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useFrame((state, delta) => {
    if (!group.current) return;
    const d = Math.min(delta * speed, 0.08);
    group.current.rotation.y += (target.current.x * 0.5 - group.current.rotation.y) * d * 6;
    group.current.rotation.x += (-target.current.y * 0.25 - group.current.rotation.x) * d * 6;
    const scrollY = window.scrollY;
    group.current.position.y = -scrollY * 0.0004;
  });

  return group;
}

function Panels() {
  const group = useMouseRotation();
  const materialGold = React.useMemo(() => new THREE.MeshStandardMaterial({ color: "#c8a24b", metalness: 0.9, roughness: 0.18 }), []);
  const materialWhite = React.useMemo(() => new THREE.MeshStandardMaterial({ color: "#ece7dc", metalness: 0.05, roughness: 0.6 }), []);
  const materialCharcoal = React.useMemo(() => new THREE.MeshStandardMaterial({ color: "#2a2e35", metalness: 0.4, roughness: 0.4 }), []);

  return (
    <group ref={group} position={[0, -0.4, 0]}>
      {/* Back wall — large PVC panel wall */}
      <mesh position={[0, 1.2, -3.2]} material={materialWhite}>
        <boxGeometry args={[7, 4.4, 0.18]} />
      </mesh>
      <mesh position={[0, 3.1, -2.95]} rotation={[0, 0, 0]} material={materialCharcoal}>
        <boxGeometry args={[7, 0.35, 0.3]} />
      </mesh>

      {/* Vertical PVC slats on the wall */}
      {Array.from({ length: 9 }).map((_, i) => (
        <mesh key={i} position={[-3.2 + i * 0.8, 0.9, -3.05]} material={materialWhite}>
          <boxGeometry args={[0.55, 3.2, 0.06]} />
        </mesh>
      ))}

      {/* False ceiling grid above */}
      <mesh position={[0, 3.6, -0.4]} material={materialCharcoal}>
        <boxGeometry args={[6, 0.12, 4]} />
      </mesh>
      {Array.from({ length: 4 }).map((_, i) => (
        <mesh key={`cg-${i}`} position={[-2.2 + i * 1.5, 3.44, 0.6]} material={materialGold}>
          <boxGeometry args={[0.06, 0.02, 3.4]} />
        </mesh>
      ))}
      {Array.from({ length: 3 }).map((_, i) => (
        <mesh key={`cg2-${i}`} position={[-0.6, 3.44, -1.3 + i * 1.4]} material={materialGold}>
          <boxGeometry args={[5, 0.02, 0.06]} />
        </mesh>
      ))}

      {/* Floating WPC panel — rotating */}
      <Float speed={1.6} rotationIntensity={0.6} floatIntensity={1.2}>
        <mesh position={[2.5, 1.7, -0.4]} material={materialWhite}>
          <boxGeometry args={[1.9, 0.12, 1.3]} />
        </mesh>
        <mesh position={[2.5, 1.7, -0.4]} scale={1.01}>
          <boxGeometry args={[1.9, 0.01, 1.3]} />
          <meshStandardMaterial color="#b98d3f" metalness={0.7} roughness={0.3} transparent opacity={0.9} />
        </mesh>
      </Float>

      {/* Floating panel 2 */}
      <Float speed={2.2} rotationIntensity={0.5} floatIntensity={1.6}>
        <mesh position={[-2.6, 2.1, -1]} rotation={[0.2, 0.5, 0.05]} material={materialCharcoal}>
          <boxGeometry args={[1.4, 0.1, 1.7]} />
        </mesh>
      </Float>

      {/* Floating panel 3 — louver */}
      <Float speed={1.2} rotationIntensity={0.4} floatIntensity={1.0}>
        <mesh position={[-2.2, 0.5, 0.4]} rotation={[0.1, -0.3, 0.1]}>
          <boxGeometry args={[1.2, 0.05, 1.2]} />
          <meshStandardMaterial color="#ece7dc" roughness={0.5} />
        </mesh>
      </Float>

      {/* Gold decorative torus */}
      <Float speed={2.4} rotationIntensity={1} floatIntensity={0.8}>
        <mesh position={[0, 3.15, 1.2]} material={materialGold}>
          <torusGeometry args={[0.5, 0.03, 16, 100]} />
        </mesh>
      </Float>

      {/* Decorative icosahedrons */}
      <Float speed={2} rotationIntensity={1.2} floatIntensity={1}>
        <mesh position={[3.4, 0.3, 0.2]} material={materialGold}>
          <icosahedronGeometry args={[0.24, 0]} />
        </mesh>
      </Float>
      <Float speed={1.4} rotationIntensity={1} floatIntensity={1.2}>
        <mesh position={[-3.6, 0.2, 0.6]} material={materialWhite}>
          <icosahedronGeometry args={[0.18, 0]} />
        </mesh>
      </Float>
      <Float speed={2.6} rotationIntensity={1.4} floatIntensity={1.4}>
        <mesh position={[1.4, 3.2, -2.4]} material={materialGold}>
          <octahedronGeometry args={[0.2, 0]} />
        </mesh>
      </Float>

      {/* Shimmer discs */}
      {Array.from({ length: 3 }).map((_, i) => (
        <Float key={i} speed={1.5 + i * 0.5} floatIntensity={1}>
          <mesh position={[i * 2.6 - 2.6, 0.15 + i * 0.1, 1.8]} rotation={[-Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.42, 0.42, 0.02, 32]} />
            <meshStandardMaterial color="#e3c98a" metalness={0.85} roughness={0.2} />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

function Particles({ count = 600 }) {
  const positions = React.useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 16;
      arr[i * 3 + 1] = Math.random() * 7 - 1.5;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 8 - 1;
    }
    return arr;
  }, [count]);

  const points = React.useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [positions]);

  const ref = React.useRef<THREE.Points>(null);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.02;
    }
  });

  return (
    <points ref={ref}>
      <primitive object={points} attach="geometry" />
      <pointsMaterial
        size={0.035}
        color="#c8a24b"
        transparent
        opacity={0.7}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

function CameraRig() {
  useFrame((state) => {
    const scroll = window.scrollY;
    const t = scroll / window.innerHeight;
    state.camera.position.z = 8.6 + t * 2.2;
    state.camera.position.y = 0.8 + t * 0.6;
    state.camera.lookAt(0, 1.2, 0);
  });
  return null;
}

export default function HeroCanvas() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0.8, 8.6], fov: 42 }}
      style={{ background: "transparent" }}
    >
      <PerspectiveCamera makeDefault position={[0, 0.8, 8.6]} fov={42} />
      <CameraRig />
      <ambientLight intensity={0.5} />
      <directionalLight position={[6, 9, 5]} intensity={1.4} />
      <pointLight position={[-5, 3, 3]} intensity={4} color="#c8a24b" />
      <pointLight position={[4, 4, -3]} intensity={2.2} color="#e3c98a" />
      <Panels />
      <Particles />
      <ContactShadows position={[0, -2.6, 0]} opacity={0.55} scale={14} blur={2.6} far={4} color="#000000" />
      <Environment preset="city" />
    </Canvas>
  );
}

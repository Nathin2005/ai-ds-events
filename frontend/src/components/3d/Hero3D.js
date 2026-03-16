import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial, Float } from '@react-three/drei';
import * as THREE from 'three';

// Animated 3D Sphere Component
const AnimatedSphere = () => {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <Float
      speed={1.5}
      rotationIntensity={1}
      floatIntensity={2}
    >
      <Sphere ref={meshRef} args={[1, 100, 200]} scale={2.5}>
        <MeshDistortMaterial
          color="#3b82f6"
          attach="material"
          distort={0.4}
          speed={2}
          roughness={0.1}
          metalness={0.8}
          transparent
          opacity={0.8}
        />
      </Sphere>
    </Float>
  );
};

// Floating Particles Component
const FloatingParticles = () => {
  const particlesRef = useRef();
  
  const particlesCount = 50;
  const positions = useMemo(() => {
    const positions = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return positions;
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particlesCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#60a5fa"
        size={0.1}
        transparent
        opacity={0.6}
        sizeAttenuation={true}
      />
    </points>
  );
};

// Main Hero3D Component
const Hero3D = () => {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        style={{ background: 'transparent' }}
        dpr={[1, 2]}
      >
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight 
          position={[10, 10, 5]} 
          intensity={1} 
          color="#ffffff"
        />
        <pointLight 
          position={[-10, -10, -5]} 
          intensity={0.5} 
          color="#3b82f6"
        />

        {/* 3D Elements */}
        <AnimatedSphere />
        <FloatingParticles />

        {/* Controls */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableRotate={false}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
};

export default Hero3D;
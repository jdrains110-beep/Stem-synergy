'use client';

import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Grid } from '@react-three/drei';
import * as THREE from 'three';

// Simple house structure component
function HouseModel() {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    // Optional: Uncomment for subtle rotation animation
    // if (meshRef.current) {
    //   meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    // }
  });

  return (
    <group ref={meshRef}>
      {/* Base/Foundation */}
      <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
        <boxGeometry args={[6, 0.2, 5]} />
        <meshStandardMaterial color="#8B7355" />
      </mesh>

      {/* Main Structure/Walls */}
      <mesh position={[0, 1.6, 0]} castShadow receiveShadow>
        <boxGeometry args={[5.8, 3, 4.8]} />
        <meshStandardMaterial color="#E8DCC4" />
      </mesh>

      {/* Roof */}
      <mesh position={[0, 3.5, 0]} castShadow receiveShadow rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[4.5, 1.5, 4]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>

      {/* Door */}
      <mesh position={[0, 1, 2.41]} castShadow>
        <boxGeometry args={[0.8, 1.8, 0.1]} />
        <meshStandardMaterial color="#654321" />
      </mesh>

      {/* Windows - Front */}
      <mesh position={[-1.5, 1.5, 2.41]} castShadow>
        <boxGeometry args={[0.8, 0.8, 0.1]} />
        <meshStandardMaterial color="#87CEEB" opacity={0.7} transparent />
      </mesh>
      <mesh position={[1.5, 1.5, 2.41]} castShadow>
        <boxGeometry args={[0.8, 0.8, 0.1]} />
        <meshStandardMaterial color="#87CEEB" opacity={0.7} transparent />
      </mesh>

      {/* Windows - Side */}
      <mesh position={[2.91, 1.5, 0]} castShadow>
        <boxGeometry args={[0.1, 0.8, 0.8]} />
        <meshStandardMaterial color="#87CEEB" opacity={0.7} transparent />
      </mesh>
      <mesh position={[-2.91, 1.5, 0]} castShadow>
        <boxGeometry args={[0.1, 0.8, 0.8]} />
        <meshStandardMaterial color="#87CEEB" opacity={0.7} transparent />
      </mesh>

      {/* Garage */}
      <group position={[4, 0, 0]}>
        <mesh position={[0, 1.3, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.5, 2.6, 4]} />
          <meshStandardMaterial color="#D3D3D3" />
        </mesh>
        <mesh position={[0, 0.9, 1.51]} castShadow>
          <boxGeometry args={[2, 1.8, 0.1]} />
          <meshStandardMaterial color="#696969" />
        </mesh>
      </group>
    </group>
  );
}

export default function Blueprint3DViewer({ blueprintId }: { blueprintId: string }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="w-full h-[600px] bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-300">Loading 3D viewer...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-[600px] bg-gradient-to-b from-sky-200 to-sky-100 dark:from-gray-800 dark:to-gray-700 relative">
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[10, 8, 10]} fov={50} />
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={5}
          maxDistance={30}
        />

        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[-10, 10, -10]} intensity={0.5} />

        {/* Ground Grid */}
        <Grid 
          args={[20, 20]} 
          cellSize={1} 
          cellThickness={0.5} 
          cellColor="#6b7280" 
          sectionSize={5} 
          sectionThickness={1} 
          sectionColor="#4b5563" 
          fadeDistance={30} 
          fadeStrength={1} 
          followCamera={false}
          infiniteGrid={false}
        />

        {/* Ground Plane */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
          <planeGeometry args={[50, 50]} />
          <meshStandardMaterial color="#90EE90" />
        </mesh>

        {/* House Model */}
        <HouseModel />
      </Canvas>

      {/* Controls Info */}
      <div className="absolute bottom-4 left-4 bg-white dark:bg-gray-800 bg-opacity-90 rounded-lg p-3 shadow-lg">
        <p className="text-xs text-gray-700 dark:text-gray-300 mb-1 font-medium">Controls:</p>
        <p className="text-xs text-gray-600 dark:text-gray-400">🖱️ Left click + drag: Rotate</p>
        <p className="text-xs text-gray-600 dark:text-gray-400">🖱️ Right click + drag: Pan</p>
        <p className="text-xs text-gray-600 dark:text-gray-400">🎡 Scroll: Zoom</p>
      </div>

      {/* Blueprint ID Info */}
      <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 bg-opacity-90 rounded-lg p-3 shadow-lg">
        <p className="text-xs text-gray-600 dark:text-gray-400">Blueprint ID: {blueprintId}</p>
      </div>
    </div>
  );
}

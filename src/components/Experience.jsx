import React, { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom, GodRays } from "@react-three/postprocessing";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { Zeel } from "./Zeel";

// <-- Import our WaterPlane component -->
import { WaterPlane } from "./WaterPlane";

const Experience = () => {
  const portalRefs = [useRef(), useRef(), useRef()];
  const lightRef = useRef();
  const [lightMesh, setLightMesh] = useState(null);

  // UI state for portal light & color
  const [portalColor, setPortalColor] = useState("#8affff");
  const [lightIntensity, setLightIntensity] = useState(1.2);

  useFrame((state) => {
    // Update portal emissive
    portalRefs.forEach((portal) => {
      if (portal.current) {
        portal.current.material.emissive.set(portalColor);
        portal.current.material.emissiveIntensity = lightIntensity;
      }
    });

    // Update extra point light
    if (lightRef.current && lightMesh) {
      lightRef.current.position.copy(lightMesh.position);
      lightRef.current.intensity = lightIntensity * 5;
      lightRef.current.color.set(portalColor);
    }
  });

  return (
    <>
      {/* Camera Controls */}
      <OrbitControls
        enableRotate={false}
        enableZoom={false}
        enablePan={false}
        target={[0, 2, -10]}
      />

      {/* Character Model */}
      <Zeel/>

      {/* Portals */}
      {[
        { position: [-3, 2, -20], size: [2, 8] },
        { position: [0, 2, -20], size: [2, 8] },
        { position: [3, 2, -20], size: [2, 8] },
      ].map(({ position, size }, index) => (
        <mesh key={index} ref={portalRefs[index]} position={position}>
          <planeGeometry args={size} />
          <meshStandardMaterial
            color="#ffffff"
            emissive={portalColor}
            emissiveIntensity={lightIntensity}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}

      {/* Various Lights */}
      <spotLight
        position={[-1, 2, -2.5]}
        intensity={40}
        color="#8affff"
        castShadow
      />
      <ambientLight intensity={0.4} />
      <spotLight position={[0, 2, 0.6]} intensity={8} color="#3293ff" castShadow />
      {/* <spotLight position={[-1, 2, 0.6]} intenity={5} color="#e992ff" castShadow /> */}

      {/* Invisible Light Source for GodRays */}
      <mesh ref={setLightMesh} position={[0, 2.5, -3.8]} visible={false}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshBasicMaterial color={portalColor} />
      </mesh>

      {/* Point Light for the Scene */}
      <pointLight
        ref={lightRef}
        position={[0, 2.5, -13.8]}
        intensity={lightIntensity * 5}
        color={portalColor}
        castShadow
      />

      {/* ------------------------------- */}
      {/* REPLACE Reflector with WaterPlane */}
      {/* ------------------------------- */}
      <WaterPlane />

      {/* Post-processing Effects */}
      <EffectComposer>
        <Bloom intensity={1} luminanceThreshold={0.7} luminanceSmoothing={0.3} />
        {portalRefs.map(
          (portal, index) =>
            portal.current && (
              <GodRays
                key={index}
                sun={portal.current}
                decay={0.9}
                weight={1.0}
                density={1.5}
                exposure={2}
                samples={600}
              />
            )
        )}
      </EffectComposer>
    </>
  );
};

export default Experience;

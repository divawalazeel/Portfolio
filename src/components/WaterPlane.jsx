// WaterPlane.jsx
import React, { useRef, useMemo, useEffect } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { TextureLoader } from "three";
import { Water } from "./Water";

import water from "../assets/water.png";

export function WaterPlane() {
  const waterRef = useRef();

  // Load the normal map for wave detail
  const waterNormals = useLoader(TextureLoader, water);

  // A moderately large plane geometry
  const geometry = useMemo(() => new THREE.PlaneGeometry(50, 50), []);

  // Ensure the normal map repeats in both directions
  useEffect(() => {
    waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping;
  }, [waterNormals]);

  // Water configuration
  const waterConfig = useMemo(() => {
    return {
      textureWidth: 512,
      textureHeight: 512,
      waterNormals: waterNormals,
      /** 
       * We set sunColor=0x000000 so that the built-in "sun shading" in the 
       * Water shader is effectively disabled. 
       */
      sunColor: 0x000000,
      /** 
       * Make the water base color black. 
       * Any reflections will appear on top of this black surface.
       */
      waterColor: 0x08234d,
      /**
       * Very small distortion so reflections are not overly warped. 
       * If you want a perfect mirror, set it to 0.0
       */
      distortionScale: 0.2,
      /** 
       * Fog: set to true if your scene uses fog, false otherwise. 
       * This helps the water blend with scene fog if you have it.
       */
      fog: true,
      /**
       * If you do want to completely remove "sunDirection," you can 
       * set it to (0,0,0). But it’s enough to just set sunColor=0x000000.
       */
      sunDirection: new THREE.Vector3(),
    };
  }, [waterNormals]);

  // Create the Water instance once
  const waterInstance = useMemo(() => {
    return new Water(geometry, waterConfig);
  }, [geometry, waterConfig]);

  // Rotate it into a horizontal plane
  useEffect(() => {
    waterInstance.rotation.x = -Math.PI / 2;
  }, [waterInstance]);

  // Animate the Water's time uniform for wave motion
  useFrame((_, delta) => {
    waterInstance.material.uniforms.time.value += delta;
  });

  return (
    <primitive
      ref={waterRef}
      object={waterInstance}
      position={[0, 0, -1]}
    />
  );
}

import React, { useRef, useEffect } from 'react';
import { useGraph, useFrame } from '@react-three/fiber';
import { useAnimations, useFBX, useGLTF } from '@react-three/drei';
import { SkeletonUtils } from 'three-stdlib';
import * as THREE from 'three';

export function Zeel(props) {
  const group = useRef();
  const mouse = useRef(new THREE.Vector2());
  const { scene } = useGLTF('/model/smile.glb');
  const clone = React.useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { nodes, materials } = useGraph(clone);

  // Load FBX Animation
  const { animations: greetings } = useFBX('/animation/animation.fbx');
  greetings[0].name = 'greetings';
  const { actions } = useAnimations(greetings, group);

  useEffect(() => {
    if (actions.greetings) {
      actions.greetings.play();
    }
  }, [actions.greetings]);

  // **Track Cursor Movement**
  useEffect(() => {
    const handleMouseMove = (event) => {
      mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // **Make Neck Follow Cursor Smoothly**
  useFrame(({ camera }) => {
    if (nodes.Neck) { // Ensure 'Neck' bone exists
      const neck = nodes.Neck;

      // Convert mouse position to 3D world space
      const targetPosition = new THREE.Vector3(
        mouse.current.x * 2,  // Adjust scaling for X movement
        mouse.current.y * 1.5, // Adjust scaling for Y movement
        1.5 // Maintain some depth
      );

      // Convert local space to world space
      neck.parent.updateWorldMatrix(true, false);
      const worldNeckPosition = new THREE.Vector3();
      neck.getWorldPosition(worldNeckPosition);

      // Compute look direction
      const direction = new THREE.Vector3().subVectors(targetPosition, worldNeckPosition).normalize();

      // Compute rotation quaternion
      const lookAtQuaternion = new THREE.Quaternion();
      lookAtQuaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), direction);

      // Apply smooth interpolation for realistic movement
      neck.quaternion.slerp(lookAtQuaternion, 1); // Lower = slower, higher = faster
    }
  });

  return (
    <group {...props} ref={group} dispose={null} rotation-x={4.7}>
      <primitive object={nodes.Hips} />
      <skinnedMesh geometry={nodes.Wolf3D_Hair.geometry} material={materials.Wolf3D_Hair} skeleton={nodes.Wolf3D_Hair.skeleton} />
      <skinnedMesh geometry={nodes.Wolf3D_Body.geometry} material={materials.Wolf3D_Body} skeleton={nodes.Wolf3D_Body.skeleton} />
      <skinnedMesh geometry={nodes.Wolf3D_Outfit_Bottom.geometry} material={materials.Wolf3D_Outfit_Bottom} skeleton={nodes.Wolf3D_Outfit_Bottom.skeleton} />
      <skinnedMesh geometry={nodes.Wolf3D_Outfit_Footwear.geometry} material={materials.Wolf3D_Outfit_Footwear} skeleton={nodes.Wolf3D_Outfit_Footwear.skeleton} />
      <skinnedMesh geometry={nodes.Wolf3D_Outfit_Top.geometry} material={materials.Wolf3D_Outfit_Top} skeleton={nodes.Wolf3D_Outfit_Top.skeleton} />
      <skinnedMesh name="EyeLeft" geometry={nodes.EyeLeft.geometry} material={materials.Wolf3D_Eye} skeleton={nodes.EyeLeft.skeleton} morphTargetDictionary={nodes.EyeLeft.morphTargetDictionary} morphTargetInfluences={nodes.EyeLeft.morphTargetInfluences} />
      <skinnedMesh name="EyeRight" geometry={nodes.EyeRight.geometry} material={materials.Wolf3D_Eye} skeleton={nodes.EyeRight.skeleton} morphTargetDictionary={nodes.EyeRight.morphTargetDictionary} morphTargetInfluences={nodes.EyeRight.morphTargetInfluences} />
      <skinnedMesh name="Wolf3D_Head" geometry={nodes.Wolf3D_Head.geometry} material={materials.Wolf3D_Skin} skeleton={nodes.Wolf3D_Head.skeleton} morphTargetDictionary={nodes.Wolf3D_Head.morphTargetDictionary} morphTargetInfluences={nodes.Wolf3D_Head.morphTargetInfluences} />
      <skinnedMesh name="Wolf3D_Teeth" geometry={nodes.Wolf3D_Teeth.geometry} material={materials.Wolf3D_Teeth} skeleton={nodes.Wolf3D_Teeth.skeleton} morphTargetDictionary={nodes.Wolf3D_Teeth.morphTargetDictionary} morphTargetInfluences={nodes.Wolf3D_Teeth.morphTargetInfluences} />
    </group>
  );
}

useGLTF.preload('/model/sneh.glb');
useFBX.preload('/animation/animation.fbx');

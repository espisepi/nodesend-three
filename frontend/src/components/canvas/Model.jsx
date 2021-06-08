import useStore from '@/helpers/store'
import { A11y } from '@react-three/a11y'
import { Html, useGLTF, OrbitControls } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef, useState } from 'react'

const ModelComponent = ({ src }) => {

  console.log(src)
  const gltf = useGLTF(src)
  console.log(gltf)

  const mesh = useRef()
 
  return (
    <>

    { gltf.scene ?
        (
            <primitive ref={mesh} object={gltf.scene} />
        ) 
        : (
            <mesh
            ref={mesh}
          >
            <boxGeometry args={[1, 1, 1]} />
            <meshBasicMaterial
              color='hotpink'
            />
          </mesh>
        )
    }

    <ambientLight intensity={0.2}/>
    <pointLight />
    <OrbitControls autoRotate={true} />
    </>
      
  )
}
export default ModelComponent

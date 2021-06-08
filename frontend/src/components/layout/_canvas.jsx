import { Canvas } from '@react-three/fiber'
import { Preload } from '@react-three/drei'
import { A11yUserPreferences } from '@react-three/a11y'
import useStore from '@/helpers/store'
import { Suspense } from 'react'

const LCanvas = ({ children }) => {
  const dom = useStore((state) => state.dom)
  return (
    <Canvas
      id='div_canvas'
      mode='concurrent'
      style={{
        position: 'absolute',
        top: 0,
      }}
      onCreated={(state) => state.events.connect(dom.current)}
    >
      <A11yUserPreferences>
        <Preload all />
        <Suspense fallback={null}>
          {children}
        </Suspense>
      </A11yUserPreferences>
    </Canvas>
  )
}

export default LCanvas

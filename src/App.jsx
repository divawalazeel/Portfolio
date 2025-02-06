import { useState } from 'react'
import './App.css'
import Experience from './components/Experience';
import { Canvas } from '@react-three/fiber';
import CustomCursor from './components/CustomCursor';
import Navbar from './components/Navbar';

function App() {
  const [count, setCount] = useState(0)

  return (
          <div className='w-screen h-screen bg-black'>
            <CustomCursor />
            <Navbar />
            <Canvas camera={{ position: [0 , 1.5 , 2], fov: 40 }} shadows>
            <Experience />
            </Canvas>
         </div>
  )
}
 
export default App

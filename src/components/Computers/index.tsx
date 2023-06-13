"use client";
import { Suspense, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";
import CanvasLoader from "../Loader";

const gltfPath = "/Dice3D/scene.gltf";

const Computers = ({
  isMobile,
  rotate: { setRotation, rotation },
}: {
  isMobile: boolean;
  rotate: {
    setRotation: React.Dispatch<React.SetStateAction<number>>;
    rotation: number;
  };
}) => {
  const computer = useGLTF(gltfPath);
  useFrame(() => {
    // Atualize a rotação do dado
    setRotation((prevRotation) => prevRotation + 0.01); // Ajuste o valor de acordo com a velocidade de rotação desejada
  });

  return (
    <mesh rotation={[rotation, rotation, rotation]}>
      <hemisphereLight intensity={0.35} groundColor="black" />
      <spotLight
        position={[rotation, rotation, rotation]}
        angle={0}
        penumbra={0.2}
        intensity={0.2}
        castShadow
        shadow-mapSize={1024}
      />
      <pointLight intensity={0.35} />
      <primitive
        object={computer.scene}
        scale={isMobile ? 0.7 : 1}
        position={[rotation, rotation, rotation]}
      />
    </mesh>
  );
};

const ComputersCanvas = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Add a listener for changes to the screen size
    const mediaQuery = window.matchMedia("(max-width: 500px)");

    // Set the initial value of the `isMobile` state variable
    setIsMobile(mediaQuery.matches);

    // Define a callback function to handle changes to the media query
    const handleMediaQueryChange = (event: any) => {
      setIsMobile(event.matches);
    };

    // Add the callback function as a listener for changes to the media query
    mediaQuery.addEventListener("change", handleMediaQueryChange);

    // Remove the listener when the component is unmounted
    return () => {
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
    };
  }, []);

  const [rotation, setRotation] = useState(0);
  const rollDice = () => {
    // Defina a duração total da animação (em segundos)
    const animationDuration = 4;

    // Defina o número de quadros por segundo (FPS) da animação
    const framesPerSecond = 60;

    // Calcule o ângulo de rotação por quadro
    const rotationPerFrame =
      (Math.PI * 2) / (animationDuration * framesPerSecond);

    // Inicialize a rotação atual dos dados como 0
    setRotation(0);

    // Crie um loop de animação usando requestAnimationFrame
    const animate = (timestamp: number) => {
      const startTime = performance.now();

      // Calcule a rotação atual com base no tempo decorrido
      const elapsedTime = timestamp - startTime;
      const currentRotation = rotationPerFrame * (elapsedTime / 1000);

      // Atualize a rotação dos dados
      setRotation(currentRotation);

      // Verifique se a animação ainda está em andamento
      if (elapsedTime < animationDuration * 1000) {
        requestAnimationFrame(animate);
      }
    };

    // Inicie a animação
    requestAnimationFrame(() => animate(50));
  };
  return (
    <>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={rollDice}
      >
        Rolar Dados
      </button>

      <Canvas
        frameloop="demand"
        shadows
        camera={{ position: [5, 5, 5], fov: 25 }}
        gl={{ preserveDrawingBuffer: true }}
        style={{ width: "800px", height: "600px", border: "1px solid #000" }}
      >
        <Suspense fallback={<CanvasLoader />}>
          <OrbitControls />
          <Computers rotate={{ setRotation, rotation }} isMobile={isMobile} />
        </Suspense>

        <Preload all />
      </Canvas>
    </>
  );
};

export default ComputersCanvas;

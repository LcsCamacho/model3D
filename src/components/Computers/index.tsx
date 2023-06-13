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
    const animationDuration = 2;

    // Defina o número de quadros por segundo (FPS) da animação
    const framesPerSecond = 60;

    // Calcule o ângulo de rotação por quadro
    const rotationPerFrame =
      (Math.PI * 2) / (animationDuration * framesPerSecond);

    // Defina os parâmetros de aceleração e desaceleração
    const accelerationDuration = animationDuration * 0.2; // Duração da aceleração inicial (20% da duração total)
    const decelerationDuration = animationDuration * 0.3; // Duração da desaceleração final (30% da duração total)
    const peakSpeed = 10; // Velocidade máxima de rotação (ajuste de acordo com a velocidade desejada)

    // Inicialize a rotação atual dos dados como 0
    setRotation(0);

    // Crie um loop de animação usando requestAnimationFrame
    const animate = (timestamp: number) => {
      // Calcule o tempo decorrido desde o início da animação
      const elapsedTime = timestamp - startTime;

      // Calcule a rotação atual com base no tempo decorrido e os parâmetros de aceleração e desaceleração
      let currentRotation = 0;
      if (elapsedTime < accelerationDuration * 1000) {
        // Aceleração inicial
        const accelerationTime = elapsedTime / 1000;
        currentRotation =
          (0.5 * accelerationTime * accelerationTime * peakSpeed) /
          accelerationDuration;
      } else if (
        elapsedTime <
        (animationDuration - decelerationDuration) * 1000
      ) {
        // Velocidade máxima de rotação
        currentRotation = peakSpeed;
      } else {
        // Desaceleração final
        const decelerationTime =
          (elapsedTime - (animationDuration - decelerationDuration) * 1000) /
          1000;
        const decelerationProgress = decelerationTime / decelerationDuration;
        currentRotation = (1 - 0.5 * (1 - decelerationProgress)) * peakSpeed;
      }

      // Atualize a rotação dos dados
      setRotation(currentRotation);

      // Verifique se a animação ainda está em andamento
      if (elapsedTime < animationDuration * 1000) {
        requestAnimationFrame(animate);
      }
    };

    // Inicie a animação
    const startTime = performance.now();
    requestAnimationFrame(animate);
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

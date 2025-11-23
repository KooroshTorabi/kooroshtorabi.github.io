import { Text } from "@react-three/drei";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "react-three-fiber";
import * as THREE from "three";

// ----------------------------------------------------------------------
// کامپوننت Three.js برای رندر متن و انیمیشن
// ----------------------------------------------------------------------

type TextMeshProps = {
  text: string;
  locale?: string;
};

function TextMesh({ text, locale }: TextMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const { camera } = useThree();
  const spotlightRef = useRef<THREE.SpotLight>(null!);
  const targetRef = useRef<THREE.Object3D>(null!);

  camera.position.y = -250;

  useFrame((state, delta) => {
    const speed = 20;

    if (spotlightRef.current) {
      spotlightRef.current.position.copy(camera.position);
    }

    camera.position.y -= speed * delta;

    if (camera.position.y < -1050) {
      camera.position.y = -300;
    }
  });

  return (
    <>
      <spotLight
        ref={spotlightRef}
        intensity={2000}
        color="#FFFFFF"
        distance={1500}
        angle={Math.PI / 32}
        penumbra={0.1}
        decay={1}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-bias={-0.0001}
      >
        <object3D ref={targetRef} position={[0, 0, 0]} attach="target" />
      </spotLight>
      <Text
        ref={meshRef}
        rotation={[0, 0, 0]}
        position={[0, -500, 0]}
        font={
          locale !== "fa"
            ? "fonts/PixelifySans/static/PixelifySans-Regular.ttf"
            : "/fonts/Vazirmatn/static/Vazirmatn-Regular.ttf"
        }
        // font={"PixelifySans-Regular.ttf"}
        // font={PixlifyFont.className.toString()}
        fontSize={12}
        lineHeight={1.5}
        color="#FFD700"
        anchorX="center"
        anchorY="middle"
        textAlign="center"
        maxWidth={250}
        material-metalness={0.1}
        material-roughness={0.9}
      >
        {text}
      </Text>
    </>
  );
}

// ----------------------------------------------------------------------
// کامپوننت StarLayer
// ----------------------------------------------------------------------

type StarLayerProps = {
  count: number;
  textHeight: number;
  zMin: number;
  zMax: number;
  sizeMin: number;
  sizeMax: number;
  speed: number;
};

export function StarLayer({
  count,
  textHeight,
  zMin,
  zMax,
  sizeMin,
  sizeMax,
  speed,
}: StarLayerProps) {
  const groupRef = useRef<THREE.Group>(null!);

  const stars = useMemo(() => {
    const arr: {
      id: string;
      position: [number, number, number];
      size: number;
      color: string;
      geometry: THREE.BufferGeometry;
    }[] = [];

    const geometries = [
      new THREE.SphereGeometry(1, 4, 4),
      new THREE.TetrahedronGeometry(1),
      new THREE.OctahedronGeometry(1),
    ];

    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 2000;
      const y = (Math.random() - 0.5) * textHeight;
      const z = -(Math.random() * (zMax - zMin) + zMin);
      const size = Math.random() * (sizeMax - sizeMin) + sizeMin;
      const hue = Math.random() * 60;
      const color = new THREE.Color(`hsl(${hue}, 100%, 80%)`).getStyle();
      const geometry =
        geometries[Math.floor(Math.random() * geometries.length)];
      const id = THREE.MathUtils.generateUUID();

      arr.push({ id, position: [x, y, z], size, color, geometry });
    }
    return arr;
  }, [count, textHeight, zMin, zMax, sizeMin, sizeMax]);

  const fadeMargin = 200;
  const height = textHeight;

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    groupRef.current.position.y += speed * delta * 100; // scale delta to match original speed

    // لوپ
    if (groupRef.current.position.y > height / 2) {
      groupRef.current.position.y = -height / 2;
    }

    // fade-in و fade-out
    const y = groupRef.current.position.y + height / 2;
    let alpha = 1;
    if (y < fadeMargin - 200)
      alpha = y / fadeMargin; // شروع fade-in
    else if (y > height - fadeMargin) alpha = (height - y) / fadeMargin; // پایان fade-out

    groupRef.current.traverse((child: any) => {
      if (child.material) {
        child.material.transparent = true;
        child.material.opacity = THREE.MathUtils.clamp(alpha, 0, 1);
      }
    });
  });

  return (
    <group ref={groupRef}>
      {stars.map((star) => (
        <mesh key={star.id} geometry={star.geometry} position={star.position}>
          <meshBasicMaterial color={star.color} />
          <mesh scale={[star.size, star.size, star.size]} />
        </mesh>
      ))}
    </group>
  );
}

// ----------------------------------------------------------------------
// Canvas اصلی
// ----------------------------------------------------------------------

type TextCrawlCanvasProps = {
  children: React.ReactNode;
  locale?: string;
};

export default function TextCrawlCanvas({
  children,
  locale,
}: TextCrawlCanvasProps) {
  const textContent =
    typeof children?.toString() === "string" ? children.toString() : "";
  if (!textContent) return null;

  const textHeight = 1700;

  return (
    <Canvas
      resize={{ scroll: false, offsetSize: false }}
      camera={{ fov: 45, position: [0, -110, 100] }}
      shadows
      frameloop="always"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        background: "transparent",
      }}
    >
      <EffectComposer>
        <Bloom
          intensity={1.2}
          luminanceThreshold={0.2}
          luminanceSmoothing={0.9}
          mipmapBlur
          height={300}
        />
      </EffectComposer>
      <ambientLight intensity={0.01} />

      {/* سه لایه ستاره با اندازه و سرعت متفاوت */}
      <StarLayer
        count={700}
        textHeight={textHeight}
        zMin={0}
        zMax={200}
        sizeMin={3.2}
        sizeMax={4.8}
        speed={0.5}
      />
      <StarLayer
        count={500}
        textHeight={textHeight}
        zMin={1200}
        zMax={2400}
        sizeMin={0.8}
        sizeMax={1.2}
        speed={0.3}
      />
      <StarLayer
        count={600}
        textHeight={textHeight}
        zMin={2400}
        zMax={3600}
        sizeMin={0.3}
        sizeMax={0.7}
        speed={0.1}
      />

      <TextMesh text={textContent} locale={locale} />
    </Canvas>
  );
}

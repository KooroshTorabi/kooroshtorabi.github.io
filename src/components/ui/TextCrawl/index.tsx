import { Text } from "@react-three/drei";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "react-three-fiber";
// import type * as THREE from "three";
import * as THREE from "three";

// ----------------------------------------------------------------------
// کامپوننت Three.js برای رندر متن و انیمیشن
// ----------------------------------------------------------------------

type TextMeshProps = {
  text: string;
};

function TextMesh({ text }: TextMeshProps) {
  // 1. تعریف رفرنس (ref) برای اتصال به کامپوننت <Text>
  const meshRef = useRef<THREE.Mesh>(null!);
  // 1. رفرنس دوربین را برای حرکت آن لازم داریم

  const { camera } = useThree();
  // تنظیم اولیه موقعیت دوربین

  // 💡 رفرنس برای کنترل نورافکن
  const spotlightRef = useRef<THREE.SpotLight>(null!);
  // ⚠️ رفرنس برای هدف نور (برای دنبال کردن مرکز)
  const targetRef = useRef<THREE.Object3D>(null!);

  camera.position.y = -300;
  // 2. انیمیشن حرکت دوربین به عقب
  useFrame((state, delta) => {
    const speed = 25;

    if (spotlightRef.current) {
      spotlightRef.current.position.copy(camera.position);
      // اگر دوربین به سمت پایین نگاه می‌کند، هدف نور باید کمی پایین‌تر از مرکز باشد
      // هدف نور را ثابت نگه دارید تا به سمت متن نگاه کند
    }

    // 🟢 اصلاح حرکت Y: افزایش سرعت حرکت Y برای حفظ زاویه
    camera.position.y -= speed * delta; // 0.5 یک مقدار تقریبی است

    // // 3. ریست دوربین (برای لوپ شدن)
    if (camera.position.y < -1050) {
      // بازگشت به موقعیت شروع: Y=400, Z=400
      // camera.position.z = 400;
      camera.position.y = -300;
    }
  });
  // 3. رندر کامپوننت <Text> از Drei
  return (
    <>
      {/* 🟢 نورافکن (Projector Light) */}
      <spotLight
        ref={spotlightRef}
        intensity={2000} // شدت بالا خوب است
        color="#FFFFFF"
        distance={1500}
        angle={Math.PI / 32} // زاویه بسیار باریک
        penumbra={0.1} // لبه‌های تیز
        decay={1}
        // 🟢 سایه‌ها را فعال کنید (بسیار مهم!)
        castShadow // 👈 این خط را اضافه کنید
        shadow-mapSize-width={1024} // کیفیت سایه
        shadow-mapSize-height={1024}
        shadow-bias={-0.0001} // برای جلوگیری از artifacts در سایه‌ها
      >
        <object3D ref={targetRef} position={[0, 0, 0]} attach="target" />
      </spotLight>
      <Text
        ref={meshRef} // اتصال رفرنس برای دسترسی در useFrame
        // تنظیم پرسپکتیو: چرخش 60 درجه در محور X
        rotation={[0, 0, 0]}
        //       // تنظیم محل شروع (زیر دوربین)
        position={[0, -500, 0]}
        // تنظیمات مورد نیاز برای متن سه بعدی
        font={"fonts/PixelifySans/static/PixelifySans-Regular.ttf"} // ⚠️ فایل فونت TTF باید در public/fonts باشد
        fontSize={14}
        lineHeight={1.5} // فاصله خطوط
        color="#FFD700" // رنگ زرد Star Wars
        anchorX="center"
        anchorY="middle"
        textAlign="center"
        maxWidth={250} // برای شکستن خطوط طولانی
        material-metalness={0.1}
        material-roughness={0.9}
      >
        {text}
      </Text>
    </>
  );
}

function Stars({ count = 300 }) {
  const pointsRef = useRef<THREE.Points>(null!);

  const positions = useMemo(() => {
    const arr = [];
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 2000;
      const y = (Math.random() - 0.5) * 2000;
      const z = -Math.random() * 2000;
      arr.push(x, y, z);
    }
    return new Float32Array(arr);
  }, [count]);

  useFrame(() => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y += 0.0005;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial color="#ffffff" size={1} sizeAttenuation />
    </points>
  );
}

type StarLayerProps = {
  count: number;
  textHeight: number; // ارتفاع تقریبی متن
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
      const y = (Math.random() - 0.5) * textHeight; // ستاره‌ها کل متن را می‌پوشانند
      const z = -(Math.random() * (zMax - zMin) + zMin);
      const size = Math.random() * (sizeMax - sizeMin) + sizeMin;
      const hue = Math.random() * 60;
      const color = new THREE.Color(`hsl(${hue}, 100%, 80%)`).getStyle();
      const geometry =
        geometries[Math.floor(Math.random() * geometries.length)];

      arr.push({ position: [x, y, z], size, color, geometry });
    }
    return arr;
  }, [count, textHeight, zMin, zMax, sizeMin, sizeMax]);

  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.position.y += speed;
  });

  return (
    <group ref={groupRef}>
      {stars.map((star, i) => (
        <mesh key={i} geometry={star.geometry} position={star.position}>
          <meshBasicMaterial color={star.color} />
          <mesh scale={[star.size, star.size, star.size]} />
        </mesh>
      ))}
    </group>
  );
}
// ----------------------------------------------------------------------
// کامپوننت Canvas اصلی
// ----------------------------------------------------------------------

type TextCrawlCanvasProps = {
  children: React.ReactNode;
};

export default function TextCrawlCanvas({ children }: TextCrawlCanvasProps) {
  // تبدیل children به یک رشته متنی
  const textContent =
    typeof children?.toString() === "string" ? children.toString() : "";
  if (!textContent) return null;
  return (
    <Canvas
      // 🟢 اصلاح Y دوربین: موقعیت شروع را بسیار بالاتر می‌بریم تا Y=0 متن، پایین فریم باشد.
      // Z=400 را برای عمق و FOV 45 را برای پرسپکتیو حفظ می‌کنیم.
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
      {/* نزدیک */}
      <StarLayer
        count={700}
        textHeight={1700}
        zMin={0}
        zMax={200} // افزایش عمق
        sizeMin={3.2}
        sizeMax={4.8}
        speed={0.0005}
      />

      {/* متوسط */}
      <StarLayer
        count={500}
        textHeight={1700}
        zMin={1200}
        zMax={2400} // افزایش عمق
        sizeMin={0.8}
        sizeMax={1.2}
        speed={0.0003}
      />

      {/* دور */}
      <StarLayer
        count={600}
        textHeight={1700}
        zMin={2400}
        zMax={3600} // افزایش عمق
        sizeMin={0.3}
        sizeMax={0.7}
        speed={0.0001}
      />

      <TextMesh text={textContent} />
    </Canvas>
  );
}

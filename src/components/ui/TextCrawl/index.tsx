import { Text } from "@react-three/drei";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { useRef } from "react";
import { Canvas, useFrame, useThree } from "react-three-fiber";
import type * as THREE from "three";

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
          luminanceThreshold={0.1} // آستانه روشنایی (فقط عناصر بسیار روشن درخشان می‌شوند)
          luminanceSmoothing={0.5}
          height={300}
        />
      </EffectComposer>
      <ambientLight intensity={0.01} />
      <TextMesh text={textContent} />
    </Canvas>
  );
}

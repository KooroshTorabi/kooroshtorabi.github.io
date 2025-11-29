// GridCanvas.tsx

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type * as THREE from "three";

// ----------------------------------------------------------------------
// 🌍 GridController: ایجاد Grid و چرخش دوربین
// ----------------------------------------------------------------------

function GridController() {
  const gridRef = useRef<THREE.GridHelper>(null!);
  const cameraRef = useRef<THREE.PerspectiveCamera>(null!);

  // متغیرها برای حرکت و چرخش
  const radius = 150; // شعاع چرخش
  let angle = 0;

  useFrame((state) => {
    // 1. چرخش دوربین حول مرکز (شبیه‌سازی حرکت فضایی)
    angle += 0.005; // سرعت چرخش

    // تنظیم موقعیت دوربین بر اساس سینوس و کسینوس (حرکت دایره‌ای)
    state.camera.position.x = radius * Math.cos(angle);
    state.camera.position.z = radius * Math.sin(angle);
    state.camera.position.y = 80; // ارتفاع دوربین

    // همواره به مرکز (0,0,0) نگاه کن
    state.camera.lookAt(0, 0, 0);
    state.camera.updateProjectionMatrix();

    // 2. چرخش یا حرکت Grid (اگر لازم باشد)
    if (gridRef.current) {
      // gridRef.current.rotation.y += 0.001; // چرخش آرام شبکه (اختیاری)
    }
  });

  return (
    <>
      {/* 💡 Ambient Light */}
      <ambientLight intensity={1.5} />

      {/* 💡 Spot Light برای تأکید بر Grid */}
      <spotLight
        position={[100, 100, 100]}
        intensity={2000}
        angle={0.5}
        penumbra={1}
        decay={0}
        castShadow
      />

      {/* 🖼️ GridHelper: ایجاد شبکه (Grid) */}
      <gridHelper
        ref={gridRef}
        args={[300, 30, 0xff0000, 0xffffff]} // [اندازه کلی, تعداد تقسیمات, رنگ خطوط اصلی, رنگ خطوط فرعی]
        position={[0, 0, 0]} // در کف صحنه
      />

      {/* برای دیدن Grid، یک سطح سه‌بعدی (Plane) برای انعکاس نیاز است */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[300, 300]} />
        <meshStandardMaterial color="#000000" metalness={0.8} roughness={0.2} />
      </mesh>
    </>
  );
}

// ----------------------------------------------------------------------
// 🖼️ Canvas اصلی
// ----------------------------------------------------------------------

export default function GridCanvas() {
  return (
    <Canvas
      shadows
      camera={{ fov: 60, position: [0, 80, 150] }}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        background: "#000000",
      }}
    >
      <GridController />
    </Canvas>
  );
}

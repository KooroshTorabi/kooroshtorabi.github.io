// src/components/TileEffect.tsx

import { useTexture } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react"; // ✅ useEffect حذف شد، useMemo حفظ شد
import * as THREE from "three";

interface TileEffectProps {
  imageUrl: string;
}

const TILE_COUNT = 32;
const TILE_SIZE = 1 / TILE_COUNT;
const WAVE_HEIGHT_FACTOR = 0.15;
const ASPECT_RATIO = 16 / 9;

// کامپوننت اصلی که افکت کاشی را اجرا می‌کند
function TiledImage({ imageUrl }: TileEffectProps) {
  const texture = useTexture(imageUrl);
  const groupRef = useRef<THREE.Group>(null!);
  const time = useRef(0);

  // 🚩 رفرنس‌های جدید برای پیاده‌سازی تضعیف (Decay)
  const lastMoveTime = useRef(performance.now());
  const prevMousePos = useRef({ x: 0, y: 0 }); // برای تشخیص تغییرات ماوس

  useFrame((state, delta) => {
    time.current += delta;

    const { x: mouseX_NDC, y: mouseY_NDC } = state.mouse;

    // --- ۱. تشخیص حرکت ماوس ---
    // اگر مختصات ماوس به میزان قابل توجهی تغییر کرده باشد (بیش از 0.001 در فضای NDC)
    const mouseMoved =
      Math.abs(mouseX_NDC - prevMousePos.current.x) > 0.001 ||
      Math.abs(mouseY_NDC - prevMousePos.current.y) > 0.001;

    if (mouseMoved) {
      lastMoveTime.current = performance.now(); // ریست زمان آخرین حرکت
    }
    prevMousePos.current.x = mouseX_NDC;
    prevMousePos.current.y = mouseY_NDC;

    // --- ۲. محاسبه ضریب تضعیف (Decay Factor) ---
    const timeSinceMove = performance.now() - lastMoveTime.current;
    const decayDuration = 2000; // ۲ ثانیه (بر حسب میلی‌ثانیه)

    // ضریب تضعیف: از ۱ (اثر کامل) تا ۰ (اثر صفر) به صورت خطی در ۲ ثانیه
    // Math.max(0, ...) تضمین می‌کند که ضریب هرگز منفی نشود.
    const decayFactor = Math.max(0, 1 - timeSinceMove / decayDuration);

    if (groupRef.current) {
      groupRef.current.children.forEach((child) => {
        const mesh = child as THREE.Mesh;
        if (!mesh.isMesh) return;

        const { originalX, originalY } = mesh.userData as {
          originalX: number;
          originalY: number;
        };

        const scaledMouseX = mouseX_NDC / 3;
        const scaledMouseY = mouseY_NDC / 3;

        const mouseDist = Math.sqrt(
          (originalX - scaledMouseX) ** 2 + (originalY - scaledMouseY) ** 2,
        );

        // ارتفاع موج پایه (فقط بخش تعاملی)
        const baseWaveHeight = Math.exp(-mouseDist * 6) * WAVE_HEIGHT_FACTOR;

        // --- ۳. اعمال ضریب تضعیف ---
        const waveHeight = baseWaveHeight * decayFactor;

        mesh.position.z = waveHeight;

        const rotationFactor = waveHeight * 2;
        mesh.rotation.x = rotationFactor;
        mesh.rotation.y = rotationFactor;
      });
    }
  });

  const tiles = useMemo(() => {
    // ... (منطق useMemo برای ساخت کاشی‌ها بدون تغییر) ...
    const generatedTiles = [];
    for (let i = 0; i < TILE_COUNT; i++) {
      for (let j = 0; j < TILE_COUNT; j++) {
        const x = j * TILE_SIZE - 0.5 + TILE_SIZE / 2;
        const y = i * TILE_SIZE - 0.5 + TILE_SIZE / 2;

        const uv = [
          j * TILE_SIZE,
          1 - (i + 1) * TILE_SIZE,
          (j + 1) * TILE_SIZE,
          1 - (i + 1) * TILE_SIZE,
          j * TILE_SIZE,
          1 - i * TILE_SIZE,
          (j + 1) * TILE_SIZE,
          1 - i * TILE_SIZE,
        ];

        const tileGeometry = new THREE.PlaneGeometry(TILE_SIZE, TILE_SIZE);
        tileGeometry.setAttribute(
          "uv",
          new THREE.BufferAttribute(new Float32Array(uv), 2),
        );

        const material = new THREE.MeshBasicMaterial({
          map: texture,
          side: THREE.DoubleSide,
        });

        generatedTiles.push(
          <mesh
            key={`${i}-${j}`}
            geometry={tileGeometry}
            material={material}
            position={[x, y, 0]}
            userData={{ originalX: x, originalY: y }}
          />,
        );
      }
    }
    return generatedTiles;
  }, [texture]);

  const scale = 3;

  return (
    <group ref={groupRef} scale={[scale, scale / ASPECT_RATIO, scale]}>
      {tiles}
    </group>
  );
}

export default function TileEffectCanvas(props: TileEffectProps) {
  return (
    <Canvas
      flat
      camera={{ position: [0, 0, 1] }}
      style={{ width: "100%", height: "100%" }}
    >
      <ambientLight intensity={0.5} />
      <TiledImage {...props} />
    </Canvas>
  );
}

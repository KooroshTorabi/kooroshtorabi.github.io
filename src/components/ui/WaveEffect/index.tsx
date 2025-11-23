// src/components/WaveEffect.tsx

import { useTexture } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

interface WaveEffectProps {
  imageUrl: string;
}

const SUBDIVISIONS = 100;
const ASPECT_RATIO = 16 / 9;
const WAVE_SPEED = 0.5;
const MAX_WAVE_STRENGTH = 0.08; // ارتفاع بیشینه موج
const INTERPOLATION_FACTOR = 0.01; // 🚩 ماندگاری موج: هرچه کمتر، ماندگاری بیشتر
const VELOCITY_SCALER = 50; // ضریب حساسیت به سرعت ماوس

// کامپوننت اصلی که افکت موج را اجرا می‌کند
function WavyImage({ imageUrl }: WaveEffectProps) {
  const texture = useTexture(imageUrl);
  const meshRef = useRef<THREE.Mesh>(null!);
  const timeRef = useRef(0);
  const materialRef = useRef<THREE.ShaderMaterial>(null!);

  const mouse3D = useRef(new THREE.Vector2(0, 0));
  const prevMouseNDC = useRef({ x: 0, y: 0 });

  // --- Shader Code ---
  const vertexShader = `
    precision highp float; 

    uniform float uTime;
    uniform float uWaveSpeed;
    uniform float uWaveStrength;
    uniform vec2 uMousePos; // موقعیت ماوس در فضای مش
    
    varying vec2 vUv; 

    void main() {
      vUv = uv; 
      
      vec3 newPosition = position;
      
      vec2 pos_xy = newPosition.xy;
      // فاصله هر راس از نقطه ماوس
      float dist = distance(pos_xy, uMousePos); 
      
      float time_factor = uTime * uWaveSpeed;

      // موج سینوسی بر اساس فاصله از ماوس (dist) و زمان (time_factor)
      // 40.0: فرکانس موج (تعداد حلقه ها)
      float wave = sin(dist * 40.0 - time_factor) * uWaveStrength; 

      // اعمال تابع محوشدگی بر اساس فاصله: هرچه دورتر، موج ضعیف‌تر
      float decay = 1.0 / (dist * 10.0 + 1.0); 
      
      newPosition.z += wave * decay;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
    }
  `;

  const fragmentShader = `
    precision highp float; 
    uniform sampler2D uTexture;
    varying vec2 vUv; 
    void main() {
      // تصحیح نگاشت UV برای نمایش صحیح بافت
      // vec2 uv = vec2(vUv.x, 1.0 - vUv.y); 
      vec4 color = texture2D(uTexture, vUv);
      gl_FragColor = color;
    }
  `;
  // --- پایان Shader Code ---

  // تعریف اولیه یونیفرم‌ها
  const initialUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uTexture: { value: texture },
      uWaveSpeed: { value: WAVE_SPEED },
      uWaveStrength: { value: 0 },
      uMousePos: { value: mouse3D.current },
    }),
    [texture],
  );

  // حلقه رندر: به‌روزرسانی زمان و اعمال تضعیف بر اساس سرعت
  useFrame((state, delta) => {
    const { x: mouseX_NDC, y: mouseY_NDC } = state.mouse;

    // 1. محاسبه سرعت
    const dx = mouseX_NDC - prevMouseNDC.current.x;
    const dy = mouseY_NDC - prevMouseNDC.current.y;
    const distanceMoved = Math.sqrt(dx * dx + dy * dy);
    const velocityStrength = distanceMoved * VELOCITY_SCALER;
    const targetStrength = Math.min(velocityStrength, MAX_WAVE_STRENGTH);

    if (materialRef.current && materialRef.current.uniforms) {
      // 2. کنترل زمان و حرکت موج
      if (
        targetStrength > 0.001 ||
        materialRef.current.uniforms.uWaveStrength.value > 0.001
      ) {
        timeRef.current += delta;
      }
      materialRef.current.uniforms.uTime.value = timeRef.current;

      // 3. اعمال نرمی (Lerp)
      const currentStrength = materialRef.current.uniforms.uWaveStrength.value;
      materialRef.current.uniforms.uWaveStrength.value = THREE.MathUtils.lerp(
        currentStrength,
        targetStrength,
        INTERPOLATION_FACTOR,
      );

      // 4. به‌روزرسانی موقعیت ماوس در فضای مش
      // مقیاس‌بندی مختصات NDC به فضای مش
      mouse3D.current.set(mouseX_NDC / 3.0, mouseY_NDC / (3.0 / ASPECT_RATIO));

      materialRef.current.uniforms.uMousePos.value = mouse3D.current;
    }

    // 5. به‌روزرسانی مختصات فریم قبلی
    prevMouseNDC.current.x = mouseX_NDC;
    prevMouseNDC.current.y = mouseY_NDC;
  });

  const scale = 3;

  return (
    <mesh
      ref={meshRef}
      scale={[scale, scale / ASPECT_RATIO, scale]}
      rotation={[-0.1, 0, 0]}
    >
      <planeGeometry args={[1, 1, SUBDIVISIONS, SUBDIVISIONS]} />

      <shaderMaterial
        ref={materialRef}
        uniforms={initialUniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        glslVersion={THREE.GLSL1}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// کامپوننت Wrapper با Canvas
export default function WaveEffectCanvas(props: WaveEffectProps) {
  return (
    <Canvas
      flat
      camera={{ position: [0, 0, 1] }}
      style={{ width: "100%", height: "100%" }}
    >
      <ambientLight intensity={1} />
      <pointLight position={[1, 1, 1]} intensity={5} color="#fff" />
      <WavyImage {...props} />
    </Canvas>
  );
}

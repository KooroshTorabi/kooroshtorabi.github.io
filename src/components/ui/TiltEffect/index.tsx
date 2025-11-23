// src/components/TiltEffect.tsx

import type React from "react";
import { type ReactNode, useCallback, useRef, useState } from "react";

interface TiltEffectProps {
  children: ReactNode;
  maxTilt?: number; // حداکثر درجه شیب (مثلاً 5 درجه)
}

const TiltEffect: React.FC<TiltEffectProps> = ({
  children,
  maxTilt = 6, // افزایش مقدار پیش‌فرض برای وضوح بیشتر
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [tiltStyle, setTiltStyle] = useState({});

  // 1. هندل کردن حرکت ماوس و محاسبه شیب
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();

      // مرکز Container
      const centerX = containerRect.width / 2;
      const centerY = containerRect.height / 2;

      // موقعیت ماوس نسبت به مرکز Container
      const x = e.clientX - containerRect.left;
      const y = e.clientY - containerRect.top;

      const deltaX = x - centerX;
      const deltaY = y - centerY;

      // --- محاسبه درجه شیب (Tilt) ---

      // محاسبه شیب. (تقسیم بر 80% از مرکز برای حساسیت بیشتر)
      const tiltX = (deltaY / (centerY * 0.8)) * maxTilt;
      const tiltY = -(deltaX / (centerX * 0.8)) * maxTilt; // معکوس برای پرسپکتیو بهتر

      // --- محاسبه موقعیت نور (Shadow/Highlight) ---

      // نور: ایجاد یک هایلایت سفید که با ماوس حرکت می‌کند.
      const lightX = (x / containerRect.width) * 200 - 50;
      const lightY = (y / containerRect.height) * 100;

      // به‌روزرسانی استایل
      setTiltStyle({
        // 1. پرسپکتیو و شیب (Rotation)
        transform: `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
        transition: "transform 0.05s ease-out", // حرکت بسیار نرم و سریع

        // 2. اعمال سایه پویا
        boxShadow: `
        ${-tiltY * 0.5}px ${tiltX * 0.5}px 15px rgba(0, 0, 0, 0.6), /* سایه اصلی */
        inset ${lightX}% ${lightY}% 15px rgba(255, 255, 255, 0.15) /* هایلایت نور */
      `,
      });
    },
    [maxTilt],
  );

  const handleMouseLeave = () => {
    // بازگشت نرم به حالت اولیه (شیب صفر)
    setTiltStyle({
      transform: "perspective(1000px) rotateX(0deg) rotateY(0deg)",
      transition: "transform 0.5s cubic-bezier(.25,.8,.25,1)", // انیمیشن بازگشت نرم‌تر
      boxShadow: "0 5px 15px rgba(0,0,0,0.5)", // سایه پیش فرض
    });
  };

  return (
    <div
      ref={containerRef}
      className="tilt-container"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      // تنظیم استایل اولیه و استایل‌های سه‌بعدی لازم
      style={{
        transformStyle: "preserve-3d", // ضروری برای پرسپکتیو
        transform: "perspective(1000px) rotateX(0deg) rotateY(0deg)",
        transition: "all 0.5s ease-out",
        ...tiltStyle, // اعمال استایل‌های دینامیک (Rotation و Shadow)
        // ⚠️ مهم: مطمئن شوید عنصر داخلی (article) نیز transform-style دارد اگر می‌خواهید عناصر فرزند آن هم پرسپکتیو داشته باشند.
      }}
    >
      {children}
    </div>
  );
};

export default TiltEffect;

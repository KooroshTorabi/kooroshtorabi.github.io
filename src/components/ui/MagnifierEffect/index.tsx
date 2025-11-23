// src/components/Magnifier.tsx

import type React from "react";
import { type ReactNode, useCallback, useRef, useState } from "react";

interface MagnifierProps {
  children: ReactNode;
  magnificationFactor?: number; // ضریب بزرگنمایی (مثلاً 2x)
  radius?: number; // شعاع دایره بزرگنمایی
}

const Magnifier: React.FC<MagnifierProps> = ({
  children,
  magnificationFactor = 2,
  radius = 75,
}) => {
  const containerRef = useRef<HTMLFieldSetElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  // موقعیت ماوس (نسبت به Container)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // 1. منطق کنترل موقعیت ماوس
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLFieldSetElement>) => {
      if (!containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();

      // موقعیت X و Y ماوس نسبت به Container
      const x = e.clientX - containerRect.left;
      const y = e.clientY - containerRect.top;

      setMousePosition({ x, y });
    },
    [],
  );

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  // --- محاسبات استایل Magnifier ---

  // موقعیت مرکزی دایره بزرگنمایی
  const magnifierCenter = {
    x: mousePosition.x,
    y: mousePosition.y,
  };

  // محاسبه Offset برای محتوای بزرگنمایی شده (DIV داخلی)
  // این Offset محتوای بزرگنمایی شده را درست زیر ماوس نگه می‌دارد.
  const contentOffset = {
    x: -mousePosition.x * (magnificationFactor - 1),
    y: -mousePosition.y * (magnificationFactor - 1),
  };

  // محاسبه اندازه دایره
  const size = radius * 2;

  // استایل دایره بزرگنمایی (DIV بیرونی)
  const magnifierStyle = {
    width: size,
    height: size,
    // حرکت دایره به مرکز ماوس (نیاز به translate(-50%, -50%) در CSS دارد)
    left: magnifierCenter.x,
    top: magnifierCenter.y,
    // با استفاده از clip-path دایره را برش می‌دهیم.
    clipPath: `circle(${radius}px at center)`,
    WebkitClipPath: `circle(${radius}px at center)`,
  };

  // استایل محتوای بزرگنمایی شده (DIV داخلی)
  const contentStyle = {
    transform: `translate(${contentOffset.x}px, ${contentOffset.y}px) scale(${magnificationFactor})`,
    // ضروری است که مبدأ تغییر (transform-origin) در گوشه باشد.
    transformOrigin: "0 0",
  };

  return (
    <fieldset
      ref={containerRef}
      aria-label="Magnifier container"
      className="relative magnifier-container"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* 1. محتوای اصلی (DIV اول) */}
      <div className="magnifier-original-content">{children}</div>

      {/* 2. دایره بزرگنمایی (DIV دوم) - فقط در صورت هاور شدن نمایش داده می‌شود */}
      {isHovered && (
        <div
          className="absolute rounded-full overflow-hidden border-2 border-white shadow-xl z-10"
          style={magnifierStyle}
        >
          {/* محتوای کلون شده، بزرگنمایی شده و جابجا شده */}
          <div style={contentStyle}>{children}</div>
        </div>
      )}

      {/* ⚠️ CSS برای قرار دادن دایره در مرکز ماوس و مخفی کردن overflow */}
      <style jsx global>{`
        .magnifier-container {
            /* این خط ضروری است تا محتوای خارج از محدوده اصلی دیده نشود */
            overflow: hidden; 
        }
        .magnifier-container > div:nth-child(2) {
            /* تنظیم مرکز دایره دقیقاً روی مکان ماوس */
            transform: translate(-50%, -50%); 
        }
      `}</style>
    </fieldset>
  );
};

export default Magnifier;

// src/components/NeonButton.tsx

import type { LinkProps } from "next/link";
import Link from "next/link";
import type React from "react";
import type { ReactNode } from "react";

interface NeonButtonProps extends LinkProps {
  children: ReactNode;
  className?: string;
}

const NeonButton: React.FC<NeonButtonProps> = ({
  children,
  href,
  locale,
  className,
}) => {
  const baseClasses = `
    relative inline-block cursor-pointer px-6 py-3 rounded-lg font-semibold transition-all duration-300 
    hover:scale-[1.05] active:scale-[0.95] 
  `; // 🚩 افزایش مقیاس هاور برای وضوح بیشتر

  // استفاده از رنگ Amber-300: rgba(253, 230, 138, X)
  const AMBER_COLOR = "253, 230, 138";

  return (
    <Link href={href} locale={locale} className={`${baseClasses} ${className}`}>
      <span className="relative z-10">{children}</span>

      {/* حاشیه نئونی متحرک */}
      <span className="neon-border" />

      <style jsx>{`
        .neon-border {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          border-radius: 8px;
          pointer-events: none;
          z-index: 5;
          
          /* 💥 افزایش شدت درخشش (Glow Intensity) */
          box-shadow: 
            0 0 8px rgba(${AMBER_COLOR}, 0.8),  /* لایه اول: قوی‌تر و متمرکزتر */
            0 0 20px rgba(${AMBER_COLOR}, 0.5), /* لایه دوم: پخش و عمیق‌تر */
            0 0 35px rgba(${AMBER_COLOR}, 0.2); /* لایه سوم: هاله‌ی بزرگتر */
          
          /* انیمیشن برق زدن */
          animation: neon-pulse 1.2s infinite alternate ease-in-out; // 🚩 سریع‌تر شدن انیمیشن
          opacity: 0.9; 
        }

        /* 💡 انیمیشن برق زدن */
        @keyframes neon-pulse {
          from {
            opacity: 0.7; // 🚩 نوسان از یک مقدار بالاتر
            transform: scale(0.98);
          }
          to {
            opacity: 1.0; // 🚩 نوسان تا روشنایی کامل
            transform: scale(1.01); // 🚩 نوسان مقیاس برای حس "تپش"
          }
        }
        
        /* افکت نئون قوی‌تر هنگام هاور شدن */
        a:hover .neon-border {
             box-shadow: 
                0 0 10px rgba(${AMBER_COLOR}, 1.0), 
                0 0 30px rgba(${AMBER_COLOR}, 0.8),
                0 0 50px rgba(${AMBER_COLOR}, 0.4);
             opacity: 1;
        }

      `}</style>
    </Link>
  );
};

export default NeonButton;

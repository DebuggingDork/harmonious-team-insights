"use client";
import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const TextHoverEffect = ({
  text,
  duration,
  className,
}: {
  text: string;
  duration?: number;
  automatic?: boolean;
  className?: string;
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const [maskPosition, setMaskPosition] = useState({ cx: "50%", cy: "50%" });

  useEffect(() => {
    if (svgRef.current && cursor.x !== null && cursor.y !== null) {
      const svgRect = svgRef.current.getBoundingClientRect();
      const cxPercentage = ((cursor.x - svgRect.left) / svgRect.width) * 100;
      const cyPercentage = ((cursor.y - svgRect.top) / svgRect.height) * 100;
      setMaskPosition({
        cx: `${cxPercentage}%`,
        cy: `${cyPercentage}%`,
      });
    }
  }, [cursor]);

  return (
    <motion.svg
      ref={svgRef}
      width="100%"
      height="100%"
      viewBox="0 0 1000 180"
      xmlns="http://www.w3.org/2000/svg"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={(e) => setCursor({ x: e.clientX, y: e.clientY })}
      className={cn("select-none uppercase cursor-pointer", className)}
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <defs>
        <linearGradient
          id="textGradient"
          gradientUnits="userSpaceOnUse"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="0%"
        >
          <stop offset="0%" stopColor="#3ca2fa">
            <animate
              attributeName="stop-color"
              values="#3ca2fa;#60a5fa;#93c5fd;#60a5fa;#3ca2fa"
              dur="4s"
              repeatCount="indefinite"
            />
          </stop>
          <stop offset="50%" stopColor="#60a5fa">
            <animate
              attributeName="stop-color"
              values="#60a5fa;#93c5fd;#3ca2fa;#93c5fd;#60a5fa"
              dur="4s"
              repeatCount="indefinite"
            />
          </stop>
          <stop offset="100%" stopColor="#93c5fd">
            <animate
              attributeName="stop-color"
              values="#93c5fd;#3ca2fa;#60a5fa;#3ca2fa;#93c5fd"
              dur="4s"
              repeatCount="indefinite"
            />
          </stop>
        </linearGradient>

        <motion.radialGradient
          id="revealMask"
          gradientUnits="userSpaceOnUse"
          r="35%"
          animate={maskPosition}
          transition={{ duration: duration ?? 0.15, ease: "easeOut" }}
        >
          <stop offset="0%" stopColor="white" />
          <stop offset="100%" stopColor="black" />
        </motion.radialGradient>
        <mask id="textMask">
          <rect x="0" y="0" width="100%" height="100%" fill="url(#revealMask)" />
        </mask>
        
        {/* Glow filter */}
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Base outline text with drawing animation */}
      <motion.text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth="0.8"
        className="fill-transparent font-bold"
        stroke="#1e3a5f"
        style={{ 
          fontSize: "130px",
          fontWeight: 800,
          letterSpacing: "0.02em"
        }}
        initial={{ strokeDashoffset: 2000, strokeDasharray: 2000 }}
        whileInView={{
          strokeDashoffset: 0,
          strokeDasharray: 2000,
        }}
        viewport={{ once: true }}
        transition={{
          duration: 2.5,
          ease: "easeInOut",
        }}
      >
        {text}
      </motion.text>
      
      {/* Hover highlight text with glow */}
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth="1.5"
        className="fill-transparent font-bold"
        stroke="url(#textGradient)"
        filter={hovered ? "url(#glow)" : undefined}
        style={{ 
          opacity: hovered ? 1 : 0,
          fontSize: "130px",
          fontWeight: 800,
          letterSpacing: "0.02em",
          transition: "opacity 0.4s ease"
        }}
      >
        {text}
      </text>
      
      {/* Masked reveal text */}
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        stroke="url(#textGradient)"
        strokeWidth="2"
        mask="url(#textMask)"
        className="fill-transparent font-bold"
        style={{ 
          fontSize: "130px",
          fontWeight: 800,
          letterSpacing: "0.02em"
        }}
      >
        {text}
      </text>
    </motion.svg>
  );
};

export const FooterBackgroundGradient = () => {
  return (
    <div className="absolute inset-0 h-full w-full overflow-hidden [mask-image:radial-gradient(ellipse_at_center,transparent_30%,black)]">
      <div
        className="pointer-events-none absolute inset-0 h-full animate-[spin_20s_linear_infinite]"
        style={{
          background:
            "conic-gradient(from 0deg at 50% 50%, rgba(60, 162, 250, 0.1) 0deg, transparent 60deg, transparent 300deg, rgba(60, 162, 250, 0.05) 360deg)",
          filter: "blur(60px)",
        }}
      />
    </div>
  );
};

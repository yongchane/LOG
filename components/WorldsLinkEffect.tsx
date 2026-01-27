"use client";

import { useEffect, useState, useRef } from "react";
import { Player } from "@/types";
import { UserRoster } from "@/types";
import { m as motion } from "framer-motion";

interface Point {
  x: number;
  y: number;
}

interface Connection {
  from: Point;
  to: Point;
}

export default function WorldsLinkEffect({ roster }: { roster: UserRoster }) {
  const [connections, setConnections] = useState<Connection[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateConnections = () => {
      if (!containerRef.current) return;

      const worldsCards = containerRef.current.querySelectorAll('.worlds-card');
      const containerRect = containerRef.current.getBoundingClientRect();
      const points: Point[] = [];

      worldsCards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        points.push({
          x: rect.left + rect.width / 2 - containerRect.left,
          y: rect.top + rect.height / 2 - containerRect.top,
        });
      });

      const newConnections: Connection[] = [];
      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
           newConnections.push({ from: points[i], to: points[j] });
        }
      }
      setConnections(newConnections);
    };

    // Update on mount, resize, and roster change
    updateConnections();
    window.addEventListener('resize', updateConnections);
    
    // Check periodically because layout might shift
    const interval = setInterval(updateConnections, 1000);

    return () => {
      window.removeEventListener('resize', updateConnections);
      clearInterval(interval);
    };
  }, [roster]);

  if (connections.length === 0) return <div ref={containerRef} className="absolute inset-0 pointer-events-none" />;

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none z-0">
      <svg className="w-full h-full overflow-visible">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {connections.map((conn, i) => (
          <motion.g key={i}>
            {/* The main beam */}
            <motion.line
              x1={conn.from.x}
              y1={conn.from.y}
              x2={conn.to.x}
              y2={conn.to.y}
              stroke="rgba(200, 155, 60, 0.6)"
              strokeWidth="2"
              filter="url(#glow)"
              initial={{ strokeDasharray: "0 1000", opacity: 0 }}
              animate={{ strokeDasharray: "1000 0", opacity: 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
            
            {/* Electric jitter lines */}
            <ElectricLine from={conn.from} to={conn.to} />
          </motion.g>
        ))}
      </svg>
    </div>
  );
}

function ElectricLine({ from, to }: { from: Point; to: Point }) {
  return (
    <motion.path
      d={`M ${from.x} ${from.y} L ${to.x} ${to.y}`}
      fill="none"
      stroke="#facc15"
      strokeWidth="1"
      initial={{ opacity: 0 }}
      animate={{ 
        opacity: [0.2, 0.8, 0.4, 1, 0.3],
        pathLength: [0, 1],
      }}
      transition={{ 
        duration: 0.2, 
        repeat: Infinity,
        repeatType: "mirror"
      }}
      style={{
        filter: 'blur(1px)',
        strokeDasharray: "2, 4"
      }}
    />
  );
}

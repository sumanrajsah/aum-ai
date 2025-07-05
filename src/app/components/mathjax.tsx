"use client"
import React, { useEffect, useRef } from "react";

interface MathJaxProps {
  math: any;
}

const MathJax: React.FC<MathJaxProps> = ({ math }) => {
  const mathJaxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && mathJaxRef.current) {
      // Dynamically load MathJax
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js";
      script.async = true;
      document.body.appendChild(script);

      // Render math when MathJax is loaded
      script.onload = () => {
        if (window.MathJax) {
          window.MathJax.typesetPromise([mathJaxRef.current]).catch((err: any) =>
            console.error("MathJax typeset failed:", err)
          );
        }
      };

      return () => {
        document.body.removeChild(script);
      };
    }
  }, [math]);

  return <div ref={mathJaxRef}>{math}</div>;
};

export default MathJax;
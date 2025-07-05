declare module "react-mathjax" {
    import React from "react";
  
    export interface MathJaxProps {
      children: React.ReactNode;
      inline?: boolean;
    }
  
    export interface MathJaxContextProps {
      children: React.ReactNode;
    }
  
    export const MathJax: React.FC<MathJaxProps>;
    export const MathJaxContext: React.FC<MathJaxContextProps>;
  }
  
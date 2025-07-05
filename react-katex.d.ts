declare module 'react-katex' {
  import * as React from 'react';

  export interface InlineMathProps {
    math: any;
  }

  export interface BlockMathProps {
    math: any;
  }

  export class InlineMath extends React.Component<InlineMathProps> { }
  export class BlockMath extends React.Component<BlockMathProps> { }
}
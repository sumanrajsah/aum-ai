declare module 'react-syntax-highlighter' {
    import * as React from 'react';
    export interface SyntaxHighlighterProps {
        language: string;
        style: any;
        children: React.ReactNode;
        // Add other props as needed
    }
    export class SyntaxHighlighter extends React.Component<SyntaxHighlighterProps> { }
}
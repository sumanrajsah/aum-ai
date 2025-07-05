declare module 'solc' {
    export interface CompilerInput {
        language: string;
        sources: {
            [key: string]: {
                content: string;
            };
        };
        settings: {
            outputSelection: {
                [key: string]: {
                    [key: string]: string[];
                };
            };
            remappings?: string[];
        };
    }

    export interface CompilerOutput {
        contracts: {
            [key: string]: {
                [key: string]: {
                    abi: any[];
                    evm: {
                        bytecode: {
                            object: string;
                        };
                    };
                };
            };
        };
        errors?: CompilerError[];
    }

    export interface CompilerError {
        severity: 'error' | 'warning';
        message: string;
    }

    export interface ImportCallback {
        (importPath: string): { contents: string } | { error: string };
    }

    export interface CompileOptions {
        import?: ImportCallback;
    }

    export function compile(input: string, options?: CompileOptions): string;
}
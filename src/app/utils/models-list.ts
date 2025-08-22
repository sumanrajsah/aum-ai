export const llmModels = [
    { value: "codestral-2501-2", label: "Codestral 2501", IP: 5, OP: 10, tools: true, mediaSupport: false },

    { value: "cohere-command-a", label: "Cohere Command A", IP: 30, OP: 105, tools: true, mediaSupport: false },
    { value: "cohere-command-r-08-2024", label: "Cohere Command R", IP: 5, OP: 10, tools: true, mediaSupport: false },
    { value: "cohere-command-r-plus-08-2024", label: "Cohere Command R+", IP: 30, OP: 105, tools: true, mediaSupport: false },

    { value: "deepseek-r1", label: "DeepSeek R1", IP: 20, OP: 65, tools: false, mediaSupport: false },
    { value: "deepseek-r1-0528", label: "DeepSeek R1 0528", IP: 20, OP: 65, tools: false, mediaSupport: false },
    { value: "deepseek-v3", label: "DeepSeek V3", IP: 15, OP: 55, tools: false, mediaSupport: false },
    { value: "deepseek-v3-0324", label: "DeepSeek V3 0324", IP: 15, OP: 55, tools: false, mediaSupport: false },

    { value: "gemini-2.0-flash", label: "Gemini 2.0 Flash", IP: 5, OP: 10, tools: true, mediaSupport: true },
    { value: "gemini-2.0-flash-lite", label: "Gemini 2.0 Flash Lite", IP: 2, OP: 5, tools: true, mediaSupport: true },
    { value: "gemini-2.5-pro", label: "Gemini 2.5 Pro", IP: 30, OP: 160, tools: true, mediaSupport: true },
    { value: "gemini-2.5-flash", label: "Gemini 2.5 Flash", IP: 5, OP: 30, tools: true, mediaSupport: true },

    { value: "gpt-4o-mini", label: "GPT 4o Mini", IP: 5, OP: 10, tools: true, mediaSupport: true },
    { value: "gpt-4o", label: "GPT 4o", IP: 30, OP: 105, tools: true, mediaSupport: true },
    { value: "gpt-4.1-mini", label: "GPT 4.1 Mini", IP: 5, OP: 20, tools: true, mediaSupport: true },
    { value: "gpt-4.1-nano", label: "GPT 4.1 Nano", IP: 5, OP: 5, tools: true, mediaSupport: true },
    { value: "gpt-4.1", label: "GPT 4.1", IP: 25, OP: 100, tools: true, mediaSupport: true },
    { value: "gpt-5-mini", label: "GPT 5 Mini", IP: 5, OP: 20, tools: true, mediaSupport: true },
    { value: "gpt-5-nano", label: "GPT 5 Nano", IP: 5, OP: 5, tools: true, mediaSupport: true },
    { value: "gpt-5", label: "GPT 5", IP: 25, OP: 100, tools: true, mediaSupport: true },
    { value: "gpt-oss-120b", label: "GPT OSS 120B", IP: 25, OP: 100, tools: true, mediaSupport: false },

    { value: "grok-3-mini", label: "Grok 3 Mini", IP: 5, OP: 0, tools: true, mediaSupport: false },
    { value: "grok-3", label: "Grok 3", IP: 35, OP: 160, tools: true, mediaSupport: false },

    { value: "llama-3.1-405b", label: "Llama 3.1 405B", IP: 60, OP: 170, tools: false, mediaSupport: false },
    { value: "llama-4-Maverick-17B-128E", label: "Llama 4 Maverick", IP: 6, OP: 10, tools: false, mediaSupport: true },
    { value: "llama-4-Scout-17B-16E", label: "Llama 4 Scout", IP: 5, OP: 10, tools: false, mediaSupport: true },

    { value: "mai-ds-r1", label: "MAI DeepSeek R1", IP: 20, OP: 65, tools: false, mediaSupport: true },

    { value: "ministral-3b", label: "Ministral 3B", IP: 1, OP: 1, tools: true, mediaSupport: false },
    { value: "mistral-medium-2505", label: "Mistral Medium 2505", IP: 5, OP: 25, tools: true, mediaSupport: false },
    { value: "mistral-small-2503", label: "Mistral Small 2503", IP: 1, OP: 5, tools: true, mediaSupport: false },
    { value: "mistral-nemo", label: "Mistral Nemo", IP: 2, OP: 2, tools: true, mediaSupport: false },

    //{ value: "o1-mini", label: "O1 Mini", IP: 3,OP: 1, tools: true, mediaSupport: true },
    { value: "o3-mini", label: "O3 Mini", IP: 20, OP: 50, tools: true, mediaSupport: true },
    { value: "o4-mini", label: "O4 Mini", IP: 20, OP: 50, tools: true, mediaSupport: true },
    { value: "o1", label: "O1", IP: 160, OP: 650, tools: true, temperature: false, topP: false, mediaSupport: true },

    { value: "phi-4", label: "Phi 4", IP: 2, OP: 5, tools: false, mediaSupport: false },
    { value: "phi-4-mini-reasoning", label: "Phi 4 Mini Reasoning", IP: 1, OP: 5, tools: false, mediaSupport: false },
    { value: "phi-4-reasoning", label: "Phi 4 Reasoning", IP: 2, OP: 5, tools: false, mediaSupport: false },
];
export function getMediaSupportByModelName(modelValue: string): boolean {
    const model = llmModels.find(m => m.value === modelValue);
    return model ? model.mediaSupport : false;
}
export function getTools(value: string) {
    const model = llmModels.find(m => m.value === value);
    return model ? model.tools : undefined;
}

export const imageModels = [
    { value: 'bria-2-3-fast', label: "Bria-2-3 Fast", credits: 1 },
    { value: "dalle-3", label: "DALL-E 3", credits: 4 },
    { value: "imagen-3-fast", label: "Imagen 3 Fast", credits: 2 },
    { value: "imagen-3", label: "Imagen 3", credits: 3 },
    { value: "imagen-4", label: "Imagen 4", credits: 4 },
    { value: "imagen-4-ultra", label: "Imagen 4 Ultra", credits: 5 },
    { value: "stable-image-core", label: "Stable Image Core", credits: 2 },
    { value: "stable-image-ultra", label: "Stable Image Ultra", credits: 3 },
    { value: "stable-diffusion-3-5-large", label: "Stable Diffusion 3.5 Large", credits: 3 },
];

export const vidoeModels = [
    { value: "sora", label: "Sora", credits: 10 },
    { value: "veo-2", label: "Veo 2", credits: 12 },
    { value: "veo-3", label: "Veo 3", credits: 12 },
];
interface LLMStyleParams {
    temperature: number;
    top_p: number;
    frequency_penalty: number;
    presence_penalty: number;
}

const styleConfig: Record<string, LLMStyleParams> = {
    "Formal": {
        temperature: 0.2,
        top_p: 0.7,
        frequency_penalty: 0.1,
        presence_penalty: 0.0
    },
    "Informal": {
        temperature: 0.7,
        top_p: 0.9,
        frequency_penalty: 0.0,
        presence_penalty: 0.1
    },
    "Polite": {
        temperature: 0.3,
        top_p: 0.8,
        frequency_penalty: 0.0,
        presence_penalty: 0.0
    },
    "Sarcastic": {
        temperature: 1.0,
        top_p: 1.0,
        frequency_penalty: 0.2,
        presence_penalty: 0.3
    },
    "Humorous": {
        temperature: 1.0,
        top_p: 1.0,
        frequency_penalty: 0.3,
        presence_penalty: 0.2
    },
    "Empathetic": {
        temperature: 0.6,
        top_p: 0.9,
        frequency_penalty: 0.0,
        presence_penalty: 0.1
    },
    "Neutral": {
        temperature: 0.2,
        top_p: 0.7,
        frequency_penalty: 0.0,
        presence_penalty: 0.0
    },
    "Authoritative": {
        temperature: 0.3,
        top_p: 0.75,
        frequency_penalty: 0.1,
        presence_penalty: 0.0
    },
    "Optimistic": {
        temperature: 0.6,
        top_p: 0.9,
        frequency_penalty: 0.0,
        presence_penalty: 0.1
    },
    "Pessimistic": {
        temperature: 0.4,
        top_p: 0.8,
        frequency_penalty: 0.1,
        presence_penalty: 0.0
    },
    "BulletPoints": {
        temperature: 0.3,
        top_p: 0.7,
        frequency_penalty: 0.2,
        presence_penalty: 0.0
    },
    "StepByStep": {
        temperature: 0.4,
        top_p: 0.75,
        frequency_penalty: 0.1,
        presence_penalty: 0.0
    },
    "Concise": {
        temperature: 0.3,
        top_p: 0.7,
        frequency_penalty: 0.0,
        presence_penalty: 0.0
    },
    "Detailed": {
        temperature: 0.5,
        top_p: 0.85,
        frequency_penalty: 0.0,
        presence_penalty: 0.0
    },
    "Storytelling": {
        temperature: 0.9,
        top_p: 0.95,
        frequency_penalty: 0.3,
        presence_penalty: 0.2
    },
    "Metaphor": {
        temperature: 0.9,
        top_p: 0.95,
        frequency_penalty: 0.2,
        presence_penalty: 0.3
    },
    "Poetic": {
        temperature: 0.9,
        top_p: 0.95,
        frequency_penalty: 0.4,
        presence_penalty: 0.2
    },
    "Philosophical": {
        temperature: 0.8,
        top_p: 0.9,
        frequency_penalty: 0.1,
        presence_penalty: 0.1
    },
    "Technical": {
        temperature: 0.2,
        top_p: 0.7,
        frequency_penalty: 0.0,
        presence_penalty: 0.0
    },
    "Teacher": {
        temperature: 0.4,
        top_p: 0.75,
        frequency_penalty: 0.1,
        presence_penalty: 0.0
    },
    "SupportAgent": {
        temperature: 0.3,
        top_p: 0.75,
        frequency_penalty: 0.0,
        presence_penalty: 0.0
    },
    "Motivational": {
        temperature: 0.8,
        top_p: 0.9,
        frequency_penalty: 0.1,
        presence_penalty: 0.2
    },
    "Comedian": {
        temperature: 1.0,
        top_p: 1.0,
        frequency_penalty: 0.4,
        presence_penalty: 0.3
    },
    "Journalist": {
        temperature: 0.3,
        top_p: 0.7,
        frequency_penalty: 0.0,
        presence_penalty: 0.0
    },
    "LegalAdvisor": {
        temperature: 0.2,
        top_p: 0.7,
        frequency_penalty: 0.0,
        presence_penalty: 0.0
    },
    "Doctor": {
        temperature: 0.2,
        top_p: 0.7,
        frequency_penalty: 0.0,
        presence_penalty: 0.0
    },
    "StreetSlang": {
        temperature: 0.9,
        top_p: 0.95,
        frequency_penalty: 0.2,
        presence_penalty: 0.4
    }
};

export function getLLMParamsByStyle(style: string): LLMStyleParams {
    return styleConfig[style] || { temperature: 0.7, top_p: 0.9 };  // Default to balanced
}
export function getAllLLMStyles(): string[] {
    return Object.keys(styleConfig);
}
export const llmModels = [
    { value: "codestral-2501-2", label: "Codestral 2501", tools: true, mediaSupport: false, inputCredits: 3, outputCredits: 9 },

    { value: "cohere-command-a", label: "Cohere Command A", tools: true, mediaSupport: false, inputCredits: 30, outputCredits: 105 },
    { value: "cohere-command-r-08-2024", label: "Cohere Command R", tools: true, mediaSupport: false, inputCredits: 5, outputCredits: 10 },
    { value: "cohere-command-r-plus-08-2024", label: "Cohere Command R+", tools: true, mediaSupport: false, inputCredits: 30, outputCredits: 105 },

    { value: "deepseek-r1", label: "DeepSeek R1", tools: false, mediaSupport: false, inputCredits: 15, outputCredits: 59 },
    { value: "deepseek-r1-0528", label: "DeepSeek R1 0528", tools: false, mediaSupport: false, inputCredits: 15, outputCredits: 59 },
    { value: "deepseek-v3", label: "DeepSeek V3", tools: false, mediaSupport: false, inputCredits: 12, outputCredits: 50 },
    { value: "deepseek-v3-0324", label: "DeepSeek V3 0324", tools: false, mediaSupport: false, inputCredits: 12, outputCredits: 50 },

    { value: "gemini-2.0-flash", label: "Gemini 2.0 Flash", tools: true, mediaSupport: true, inputCredits: 1, outputCredits: 8 },
    { value: "gemini-2.0-flash-lite", label: "Gemini 2.0 Flash Lite", tools: true, mediaSupport: true, inputCredits: 1, outputCredits: 8 },
    { value: "gemini-2.5-pro", label: "Gemini 2.5 Pro", tools: true, mediaSupport: true, inputCredits: 30, outputCredits: 158 },
    { value: "gemini-2.5-flash", label: "Gemini 2.5 Flash", tools: true, mediaSupport: true, inputCredits: 3, outputCredits: 25 },

    { value: "gpt-4o-mini", label: "GPT 4o Mini", tools: true, mediaSupport: true, inputCredits: 5, outputCredits: 10 },
    { value: "gpt-4o", label: "GPT 4o", tools: true, mediaSupport: true, inputCredits: 30, outputCredits: 105 },
    { value: "gpt-4.1-mini", label: "GPT 4.1 Mini", tools: true, mediaSupport: true, inputCredits: 4, outputCredits: 16 },
    { value: "gpt-4.1-nano", label: "GPT 4.1 Nano", tools: true, mediaSupport: true, inputCredits: 1, outputCredits: 4 },
    { value: "gpt-4.1", label: "GPT 4.1", tools: true, mediaSupport: true, inputCredits: 24, outputCredits: 96 },
    { value: "gpt-5-mini", label: "GPT 5 Mini", tools: true, mediaSupport: true, inputCredits: 4, outputCredits: 19 },
    { value: "gpt-5-nano", label: "GPT 5 Nano", tools: true, mediaSupport: true, inputCredits: 1, outputCredits: 4 },
    { value: "gpt-5", label: "GPT 5", tools: true, mediaSupport: true, inputCredits: 12, outputCredits: 50 },
    { value: "gpt-oss-120b", label: "GPT OSS 120B", tools: true, mediaSupport: false, inputCredits: 4, outputCredits: 19 },

    { value: "grok-3-mini", label: "Grok 3 Mini", tools: true, mediaSupport: false, inputCredits: 3, outputCredits: 4 },
    { value: "grok-3", label: "Grok 3", tools: true, mediaSupport: false, inputCredits: 36, outputCredits: 180 },

    { value: "llama-3.1-405b", label: "Llama 3.1 405B", tools: false, mediaSupport: false, inputCredits: 64, outputCredits: 216 },
    { value: "llama-4-Maverick-17B-128E", label: "Llama 4 Maverick", tools: false, mediaSupport: true, inputCredits: 7, outputCredits: 12 },
    { value: "llama-4-Scout-17B-16E", label: "Llama 4 Scout", tools: false, mediaSupport: true, inputCredits: 3, outputCredits: 11 },

    { value: "mai-ds-r1", label: "MAI DeepSeek R1", tools: false, mediaSupport: true, inputCredits: 15, outputCredits: 59 },

    { value: "ministral-3b", label: "Ministral 3B", tools: true, mediaSupport: false, inputCredits: 1, outputCredits: 1 },
    { value: "mistral-large-2411", label: "Mistral Large 2411", tools: true, mediaSupport: false, inputCredits: 24, outputCredits: 72 },
    { value: "mistral-medium-2505", label: "Mistral Medium 2505", tools: true, mediaSupport: false, inputCredits: 4, outputCredits: 19 },
    { value: "mistral-small-2503", label: "Mistral Small 2503", tools: true, mediaSupport: false, inputCredits: 1, outputCredits: 4 },
    { value: "mistral-nemo", label: "Mistral Nemo", tools: true, mediaSupport: false, inputCredits: 2, outputCredits: 2 },

    { value: "o3-mini", label: "O3 Mini", tools: true, mediaSupport: true, inputCredits: 11, outputCredits: 44 },
    { value: "o4-mini", label: "O4 Mini", tools: true, mediaSupport: true, inputCredits: 11, outputCredits: 44 },
    { value: "o1", label: "O1", tools: true, temperature: false, topP: false, mediaSupport: true, inputCredits: 180, outputCredits: 720 },

    { value: "phi-4", label: "Phi 4", tools: false, mediaSupport: false, inputCredits: 2, outputCredits: 5 },
    { value: "phi-4-mini-reasoning", label: "Phi 4 Mini Reasoning", tools: false, mediaSupport: false, inputCredits: 1, outputCredits: 4 },
    { value: "phi-4-reasoning", label: "Phi 4 Reasoning", tools: false, mediaSupport: false, inputCredits: 2, outputCredits: 5 }
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
    { value: 'bria-2-3-fast', label: "Bria-2-3 Fast", credits: 275 + 50 },
    { value: "dalle-3", label: "DALL-E 3", credits: 0 },
    { value: "imagen-3-fast", label: "Imagen 3 Fast", credits: 200 + 50 },
    { value: "imagen-3", label: "Imagen 3", credits: 400 + 50 },
    { value: "imagen-4", label: "Imagen 4", credits: 400 + 50 },
    { value: "imagen-4-fast", label: "Imagen 4 Fast", credits: 200 + 50 },
    { value: "imagen-4-ultra", label: "Imagen 4 Ultra", credits: 600 + 50 },
    { value: "stable-image-core", label: "Stable Image Core", credits: 1400 + 50 },
    { value: "stable-image-ultra", label: "Stable Image Ultra", credits: 400 + 50 },
    { value: "stable-diffusion-3-5-large", label: "Stable Diffusion 3.5 Large", credits: 800 + 50 },
];

export const vidoeModels = [
    { value: "sora", label: "Sora", credits: 5000 },
    { value: "veo-3-fast", label: "Veo 3 Fast", credits: 2500 },
    { value: "veo-3-fast-audio", label: "Veo 3 Fast Audio", credits: 4000 },
    { value: "veo-3-audio", label: "Veo 3 Audio", credits: 7500 },
    { value: "veo-3", label: "Veo 3", credits: 5000 },
    { value: "veo-2", label: "Veo 2", credits: 5000 },
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
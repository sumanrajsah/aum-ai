type PricingPlan = {
    [model: string]: {
        [resolution: string]: {
            [duration: string]: number; // price per second in USD
        };
    };
};

// Pricing tables (from screenshots)
const soraPricing: Record<string, { range: [number, number]; price: number }[]> = {
    "480-square": [
        { range: [1, 5], price: 0.15 },
        { range: [6, 10], price: 0.15 },
        { range: [11, 15], price: 0.15 },
        { range: [16, 20], price: 0.15 },
    ],
    "480p": [
        { range: [1, 5], price: 0.20 },
        { range: [6, 10], price: 0.20 },
        { range: [11, 15], price: 0.20 },
        { range: [16, 20], price: 0.20 },
    ],
    "720-square": [
        { range: [1, 5], price: 0.30 },
        { range: [6, 10], price: 0.30 },
        { range: [11, 15], price: 0.30 },
        { range: [16, 20], price: 0.30 },
    ],
    "720p": [
        { range: [1, 5], price: 0.45 },
        { range: [6, 10], price: 0.50 },
        { range: [11, 15], price: 0.65 },
        { range: [16, 20], price: 0.75 },
    ],
    "1080-square": [
        { range: [1, 5], price: 0.60 },
        { range: [6, 10], price: 0.75 },
        { range: [11, 15], price: 1.10 },
        { range: [16, 20], price: 1.35 },
    ],
    "1080p": [
        { range: [1, 5], price: 1.30 },
        { range: [6, 10], price: 1.85 },
        { range: [11, 15], price: 2.90 },
        { range: [16, 20], price: 3.60 },
    ],
};

const veoPricing: Record<string, number> = {
    "veo-3-fast": 0.25,
    "veo-3-fast-audio": 0.40,
    "veo-3-audio": 0.75,
    "veo-3": 0.50,
    "veo-2": 0.50,
};

export function calculateVideoPrice(
    model: string,
    resolution: string,
    ratio: string,
    duration: number
): { usd: number; credits: number } {
    let usd = 0;

    if (model.includes("sora")) {
        const key =
            resolution === "480p" && ratio === "1:1"
                ? "480-square"
                : resolution === "720p" && ratio === "1:1"
                    ? "720-square"
                    : resolution === "1080p" && ratio === "1:1"
                        ? "1080-square"
                        : resolution;

        const plans = soraPricing[key.toLowerCase()];
        if (!plans) return { usd: 0, credits: 0 };

        const plan = plans.find(
            (p) => duration >= p.range[0] && duration <= p.range[1]
        );
        if (!plan) return { usd: 0, credits: 0 };

        usd = plan.price * duration;
    } else if (model.includes("veo")) {
        const rate = veoPricing[model];
        if (!rate) return { usd: 0, credits: 0 };
        usd = rate * duration;
    }

    // convert to credits (1 credit = $0.0001)
    const credits = Math.round(usd / 0.0001);

    return { usd, credits };
}
type ImagePricing = {
    [model: string]: {
        base?: number; // flat per-image price
        options?: {
            resolution?: string;
            quality?: string;
            price: number;
        }[];
    };
};
export const videoPricing = {
    sora: {
        "480-square": [
            { range: [1, 5], price: 0.15 },
            { range: [6, 10], price: 0.15 },
            { range: [11, 15], price: 0.15 },
            { range: [16, 20], price: 0.15 },
        ],
        "480p": [
            { range: [1, 5], price: 0.20 },
            { range: [6, 10], price: 0.20 },
            { range: [11, 15], price: 0.20 },
            { range: [16, 20], price: 0.20 },
        ],
        "720-square": [
            { range: [1, 5], price: 0.30 },
            { range: [6, 10], price: 0.30 },
            { range: [11, 15], price: 0.30 },
            { range: [16, 20], price: 0.30 },
        ],
        "720p": [
            { range: [1, 5], price: 0.45 },
            { range: [6, 10], price: 0.50 },
            { range: [11, 15], price: 0.65 },
            { range: [16, 20], price: 0.75 },
        ],
        "1080-square": [
            { range: [1, 5], price: 0.60 },
            { range: [6, 10], price: 0.75 },
            { range: [11, 15], price: 1.10 },
            { range: [16, 20], price: 1.35 },
        ],
        "1080p": [
            { range: [1, 5], price: 1.30 },
            { range: [6, 10], price: 1.85 },
            { range: [11, 15], price: 2.90 },
            { range: [16, 20], price: 3.60 },
        ],
    },
    veo: {
        "veo-3": 0.50,             // Video only, 720p/1080p
        "veo-3-audio": 0.75,       // Video + Audio
        "veo-3-fast": 0.25,        // Fast Video
        "veo-3-fast-audio": 0.40,  // Fast Video + Audio
        "veo-2": 0.50,             // Video only, 720p
    },
};


export const imagePricing: ImagePricing = {
    "imagen-4": { base: 0.04 },
    "imagen-4-ultra": { base: 0.06 },
    "imagen-4-fast": { base: 0.02 },
    "imagen-3": { base: 0.04 },
    "imagen-3-fast": { base: 0.02 },
    "dalle-3": {
        options: [
            { resolution: "1024x1024", quality: "standard", price: 0.04 },
            { resolution: "1024x1792", quality: "standard", price: 0.08 },
            { resolution: "1792x1024", quality: "standard", price: 0.08 },
            { resolution: "1024x1024", quality: "hd", price: 0.08 },
            { resolution: "1024x1792", quality: "hd", price: 0.12 },
            { resolution: "1792x1024", quality: "hd", price: 0.12 },
        ],
    },
    "stable-d-3.5": { base: 0.08 },
    "stable-image-ultra": { base: 0.04 },
    "stable-image-core": { base: 0.14 },
    "bria-2.3-fast": { base: 0.0275 },
};

export function calculateImagePrice(
    model: string,
    resolution?: string,
    quality?: string
): { usd: number; credits: number } {
    let usd = 0;

    const pricing = imagePricing[model.toLowerCase()];
    if (!pricing) return { usd: 0, credits: 0 };

    if (pricing.base) {
        usd = pricing.base;
    } else if (pricing.options) {
        const match = pricing.options.find(
            (o) =>
                (!o.resolution || o.resolution === resolution) &&
                (!o.quality || o.quality === quality)
        );
        if (!match) return { usd: 0, credits: 0 };
        usd = match.price;
    }

    const credits = Math.round(usd / 0.0001); // 1 credit = $0.0001
    return { usd, credits };
}

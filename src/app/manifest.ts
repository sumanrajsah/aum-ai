import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "AUM AI - ASK.CREATE.EARN.",
        short_name: "AUM AI",
        description:
            "AUM AI is an AI platform that lets users interact with 30+ leading LLMs (GPT, Gemini, Grok, etc.), connect MCP servers, and build AI agents with low-code or no-code tools. It also powers AUM AI - ASK.CREATE.EARN., a blockchain explorer enhanced with AI-driven insights.",
        start_url: "/login",
        scope: "/",
        id: "/",
        display: "standalone",
        orientation: "portrait-primary",
        background_color: "#15181D", // matches --prop-dark-bg
        theme_color: "#15181D", // matches --bg-color1
        icons: [
            {
                src: "/android-chrome-192x192.png",
                sizes: "192x192",
                type: "image/png",
                purpose: "any", // better PWA support
            },
            {
                src: "/android-chrome-512x512.png",
                sizes: "512x512",
                type: "image/png",
                purpose: "any",
            },
        ],
        categories: ["social", "chatbot", "AI", "dapp", "blockchain"],
        display_override: ["fullscreen", "window-controls-overlay"],
        shortcuts: [
            {
                name: "Login",
                url: "/login",
                description: "Access your AUM AI account quickly",
            },
        ],
        screenshots: [
            {
                src: "/screenshot-light.png",
                sizes: "1080x1920",
                type: "image/png",
                form_factor: "narrow",
            },
            {
                src: "/screenshot-light.png",
                sizes: "1920x1080",
                type: "image/png",
                form_factor: "wide",
            },
        ],
    };
}

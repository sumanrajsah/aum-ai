import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Poppins } from "next/font/google";
import { headers } from 'next/headers'
import '@fontsource-variable/orbitron';
import Head from "next/head";
import Script from "next/script";
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "600", "700"] });
import { GoogleAnalytics } from '@next/third-parties/google'


import { AppContextProvider } from "../context/ChatContext";
import ThemeP from "./themeProvider";
import { AlertProvider } from "../context/alertContext";
import PageStruct1 from "./components/pagestruct/struct1";
import { AuthProvider } from "@/context/AuthContext";
import SpaceBackground from "./components/bgspace";

export const metadata: Metadata = {
  metadataBase: new URL("https://aum.sitrai.com"),
  title: "AUM AI - ASK.CREATE.EARN.",
  description:
    "AUM AI lets you interact with 30+ LLMs, build AI agents with low-code tools, and connect MCP servers. It also powers 0xXplorer, an AI-driven blockchain explorer for seamless transaction analysis, smart contract insights, and real-time data.",
  keywords:
    "AUM, AUM AI, 0xXplorer, blockchain explorer, AI agents, MCP, sitrai, qubicsquare, openai, claude, gpt, grok, chatbot, artificial intelligence, web3, decentralized, ethereum, polygon, bsc, avalanche, arbitrum, optimism, base, sepolia, amoy, monad, wallet, metamask, etherscan, polygonscan, smart contract, transaction analysis, insights, real-time data",
  applicationName: "AUM AI",
  openGraph: {
    title: "AUM AI - ASK.CREATE.EARN.",
    description:
      "Build AI agents, connect MCP servers, and explore blockchain with AI insights. Powered by AUM AI & 0xXplorer.",
    images: [
      {
        url: "/aum.png",
        width: 1200,
        height: 630,
        alt: "AUM AI Preview",
      },
    ],
    type: "website",
    url: "https://aum.sitrai.com",
    siteName: "AUM AI",
  },
  twitter: {
    card: "summary_large_image",
    site: "@0xxplorerAi",
    title: "AUM AI - ASK.CREATE.EARN.",
    description:
      "AI platform for agents, MCP servers, and blockchain insights. Powered by AUM AI & 0xXplorer.",
    images: ["/aum.png"],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "AUM AI",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersObj = await headers();
  const cookies = headersObj.get('cookie')
  return (
    <html lang="en" suppressHydrationWarning>
      <Head>
        {/* Schema.org JSON-LD */}


        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "AUM AI - ASK. CREATE. EARN.",
              "description":
                "AUM AI is an AI platform that enables users to create, customize, and deploy AI agents for various applications.",
              "url": "https://aum.sitrai.com",
              "image": {
                "@type": "ImageObject",
                "url": "https://aum.sitrai.com/0xai512.png",
                "width": 512,
                "height": 512
              },
              "applicationCategory": ["BlockchainExplorer", "AI", "Chatbot"],
              "operatingSystem": "All",
              "author": {
                "@type": "Organization",
                "name": "Qubicsquare Technologies Private Limited",
                "url": "https://qubicsquare.tech",
                "parentOrganization": {
                  "@type": "Organization",
                  "name": "SquareX Labs"
                }
              },
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD",
                "availability": "https://schema.org/InStock",
                "seller": {
                  "@type": "Organization",
                  "name": "Qubicsquare Technologies Private Limited",
                  "url": "https://qubicsquare.tech",
                  "parentOrganization": {
                    "@type": "Organization",
                    "name": "SquareX Labs"
                  }
                }
              }
            }),
          }}
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "AUM AI - ASK. CREATE. EARN.",
              "url": "https://aum.sitrai.com",
              "description":
                "AUM AI is an AI platform that enables users to create, customize, and deploy AI agents for various applications.",
              "image": "https://aum.sitrai.com/0xai512.png",
              "publisher": {
                "@type": "Organization",
                "name": "Qubicsquare Technologies Private Limited",
                "url": "https://qubicsquare.tech"
              },
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://aum.sitrai.com/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            }),
          }}
        />
        <meta name="msapplication-TileColor" content="#15181D" />
        <meta name="msapplication-tap-highlight" content="no" />

        {/* Mobile Web App */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

        {/* Pinned tabs (Safari) */}
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#4A80EF" />

        {/* Extra SEO */}
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />

        {/* Social fallback */}
        <meta property="og:locale" content="en_US" />
        <meta property="og:updated_time" content="2025-09-05T00:00:00+00:00" />

        {/* Twitter extras */}
        <meta name="twitter:creator" content="@sitrai" />
        <link rel="canonical" href="https://aum.sitrai.com" />

        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-HNRJ1B7WCF"></Script>
        <Script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-HNRJ1B7WCF', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />

      </Head>
      <body className={poppins.className}>
        <AuthProvider>
          <AlertProvider>
            <AppContextProvider>
              <Script
                src="https://accounts.google.com/gsi/client"
                strategy="afterInteractive"
              />
              <ThemeP>
                <PageStruct1>

                  {children}
                </PageStruct1>
              </ThemeP>
            </AppContextProvider>
          </AlertProvider>
        </AuthProvider>
      </body>
      <GoogleAnalytics gaId="G-HNRJ1B7WCF" />
    </html>
  );
}

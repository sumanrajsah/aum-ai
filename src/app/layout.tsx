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
  title: "AUM AI - ASK.CREATE.EARN",
  description: "0xXplorer is an AI-powered blockchain explorer & Chatbot Assitant for seamless transaction analysis, smart contract insights, and real-time data.",
  keywords: ",aum,claude,openai,sitrai,0xxplorer,0xai,0x,explorer,xplorer,0xxai,0ai,xai,qubicsquare,chatgpt,openai,dobby,polygon,english,connect,wallet,metamask,etherscan,polygonscan,monad,testnet,mainnet,web3,chatbot,blockchain,decentralized,ethereum,bsc,avalanche,arbitrum,optimism,sepolia,base,amoy,chain,transaction,smart contract,insights,real-time,data,analysis,assistant,ai,artificial intelligence,web3",
  openGraph: {
    title: "AUM AI - ASK.CREATE.EARN",
    description: "0xXplorer is an AI-powered blockchain explorer & Chatbot Assitant  for seamless transaction analysis, smart contract insights, and real-time data.",
    images: ['/aum.png'],
    type: 'website',
    url: 'https://aum.sitrai.com/'
  }, twitter: {
    title: "AUM AI - ASK.CREATE.EARN",
    description: "0xXplorer is an AI-powered blockchain explorer & Chatbot Assitant  for seamless transaction analysis, smart contract insights, and real-time data.",
    images: ['/aum.png'],
    card: 'summary_large_image',
    site: '@0xxplorerAi'

  }
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "AUM AI- ASK. CREATE. EARN.",
    "url": "https://aum.sitrai.com/",
    "description": "AUM AI is an AI platform that enables users to create, customize, and deploy AI agents for various applications.",
    "image": "https://aum.sitrai.com/0xai512.png",
    "author": {
      "@type": "Organization",
      "name": "Qubicsquare Technologies Private Limited",
      "createdBy": "SquareX Labs",
      "url": "https://qubicsquare.tech/"
    }

  };
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
              "name": "AUM AI- ASK. CREATE. EARN.",
              "description": "AUM AI is an AI platform that enables users to create, customize, and deploy AI agents for various applications.",
              "url": "https://aum.sitrai.com",
              "image": "https://aum.sitrai.com/0xai512.png",
              "applicationCategory": "Blockchain Explorer,Ai,chatbot",
              "operatingSystem": "All",
              "author": {
                "@type": "Organization",
                "name": "Qubicsquare Technologies Private Limited",
                "createdBy": "SquareX Labs",
                "url": "https://qubicsquare.tech"
              },
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD",
                "availability": "https://schema.org/InStock",
                "seller": {
                  "@type": "Organization",
                  "name": "Qubicsquare Technologies Private Limited",
                  "createdBy": "SquareX Labs",
                  "url": "https://qubicsquare.tech"
                }
              }
            }),
          }}
        />

        <script
          type="application/ld+json"
        >
          {JSON.stringify(schemaData)}
        </script>
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
                async
                strategy="afterInteractive"
                src="https://accounts.google.com/gsi/client"
              />
              <ThemeP>
                <PageStruct1>
                  <SpaceBackground />
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

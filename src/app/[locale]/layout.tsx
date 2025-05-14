import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from '@vercel/analytics/next';
import "../globals.css";
import { NextIntlClientProvider } from "next-intl";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Jiyuu Chat - AI-Powered Conversations",
  description: "Jiyuu Chat is an open-source AI-powered chat application built with Next.js. It integrates advanced machine learning models for seamless and engaging conversations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Primary Meta Tags */}
        <meta name="title" content="Jiyuu Chat - AI-Powered Conversations" />
        <meta name="description" content="Jiyuu Chat is an open-source AI-powered chat application built with Next.js. It integrates advanced machine learning models for seamless and engaging conversations." />
        <meta name="keywords" content="AI chat, Jiyuu Chat, machine learning, Next.js, open-source chat, conversational AI, LLM, WebGPU, AI-powered chat, private AI chat, secure chat, offline AI, local processing, privacy-focused chat, secure messaging, no data sharing, user privacy, Rock Can Code" />
        <meta name="author" content="Rock Can Code" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        {/* Meta Tags for Rock Can Code */}
        <meta name="title" content="Rock Can Code - Empowering Developers" />
        <meta property="og:url" content="https://rockcancode.com/" />
        <meta name="description" content="Rock Can Code is a community-driven organization focused on empowering developers through open-source projects, collaboration, and innovation." />
        <meta name="keywords" content="Rock Can Code, developer community, open-source, collaboration, innovation, coding, programming, privacy-first development, secure software" />
        <meta name="author" content="Rock Can Code" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://jiyuu.chat/" />
        <meta property="og:title" content="Jiyuu Chat - AI-Powered Conversations" />
        <meta property="og:description" content="Engage in seamless AI-powered conversations with Jiyuu Chat, an open-source chat application built with Next.js and advanced machine learning models." />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://x.com/rockcancode" />
        <meta property="twitter:title" content="Jiyuu Chat - AI-Powered Conversations" />
        <meta property="twitter:description" content="Engage in seamless AI-powered conversations with Jiyuu Chat, an open-source chat application built with Next.js and advanced machine learning models." />
        <meta property="twitter:image" content="https://x.com/rockcancode/photo" />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />

        {/* Fonts */}
        <link href="https://fonts.googleapis.com/css2?family=Yuji+Mai&display=swap" rel="stylesheet" />
      </head>
      <body
        className={`${inter.variable} antialiased`}
      >
        <NextIntlClientProvider>
          {children}
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  );
}

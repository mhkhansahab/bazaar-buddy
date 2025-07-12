import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bazaar Buddy - AI-Powered Marketplace",
  description: "Discover amazing products with AI-powered shopping assistance",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <style
          dangerouslySetInnerHTML={{
            __html: `
              #dify-chatbot-bubble-button {
                background-color: #1C64F2 !important;
              }
              #dify-chatbot-bubble-window {
                width: 24rem !important;
                height: 40rem !important;
              }
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.difyChatbotConfig = {
                token: 'qfojOzOqEN3C54Dz',
                systemVariables: {
                  // user_id: 'YOU CAN DEFINE USER ID HERE',
                  // conversation_id: 'YOU CAN DEFINE CONVERSATION ID HERE, IT MUST BE A VALID UUID',
                },
                userVariables: {
                  // avatar_url: 'YOU CAN DEFINE USER AVATAR URL HERE',
                  // name: 'YOU CAN DEFINE USER NAME HERE',
                },
              }
            `,
          }}
        />
        <script
          src="https://udify.app/embed.min.js"
          id="qfojOzOqEN3C54Dz"
          defer
        />
      </body>
    </html>
  );
}

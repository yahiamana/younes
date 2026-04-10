import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Younes — Data Scientist & ML/DL Engineer",
  description:
    "Portfolio of Younes, a Data Scientist and Machine Learning / Deep Learning Engineer specializing in building intelligent systems and data-driven solutions.",
  openGraph: {
    title: "Younes — Data Scientist & ML/DL Engineer",
    description:
      "Portfolio of Younes, a Data Scientist and Machine Learning / Deep Learning Engineer.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Younes — Data Scientist & ML/DL Engineer",
    description:
      "Portfolio of Younes, a Data Scientist and Machine Learning / Deep Learning Engineer.",
  },
};

import MobileScrollIndicator from "./components/ui/MobileScrollIndicator";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <MobileScrollIndicator />
        {children}
      </body>
    </html>
  );
}

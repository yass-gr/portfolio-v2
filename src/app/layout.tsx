import type { Metadata, Viewport } from "next";
import { Space_Grotesk } from "next/font/google";
import { BackgroundGrid } from "@/components/background-grid";
import { Header } from "@/components/header";
import { IntroProvider } from "@/components/intro";
import { Menu } from "@/components/menu";
import { SmoothScroll } from "@/components/smooth-scroll";
import { ThemeProvider, themeScript } from "@/components/theme";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin", "latin-ext", "vietnamese"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Portfolio",
};

export const viewport: Viewport = {
  themeColor: "#b2c7ab",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={spaceGrotesk.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <ThemeProvider>
          <SmoothScroll>
            <BackgroundGrid />
            <IntroProvider>
              <Header />
              <Menu />
              <main className="pt-14 md:pt-16">{children}</main>
            </IntroProvider>
          </SmoothScroll>
        </ThemeProvider>
      </body>
    </html>
  );
}

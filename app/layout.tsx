import type { Metadata } from "next";
import { 
  Geist, Geist_Mono, Playfair_Display, Nunito, Inter,
  Cormorant_Garamond, DM_Serif_Display, Anton, Archivo_Black, Space_Grotesk, Syne, Chewy
} from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { CartProvider } from "@/components/cart-context";
import LayoutShell from "@/components/layout-shell";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const playfair = Playfair_Display({ variable: "--font-playfair", subsets: ["latin"] });
const nunito = Nunito({ variable: "--font-nunito", subsets: ["latin"] });
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });

const cormorant = Cormorant_Garamond({ weight: ["400", "700"], variable: "--font-cormorant", subsets: ["latin"] });
const dmSerif = DM_Serif_Display({ weight: "400", variable: "--font-dm-serif", subsets: ["latin"] });
const anton = Anton({ weight: "400", variable: "--font-anton", subsets: ["latin"] });
const archivo = Archivo_Black({ weight: "400", variable: "--font-archivo", subsets: ["latin"] });
const space = Space_Grotesk({ variable: "--font-space", subsets: ["latin"] });
const syne = Syne({ variable: "--font-syne", subsets: ["latin"] });
const chewy = Chewy({ weight: "400", variable: "--font-chewy", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mobile Store - Premium Electronics Destination",
  description: "Nepal's premium electronics shopping hub for genuine laptops, smartphones, and PC components with official warranty.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const fonts = `${geistSans.variable} ${geistMono.variable} ${playfair.variable} ${nunito.variable} ${inter.variable} ${cormorant.variable} ${dmSerif.variable} ${anton.variable} ${archivo.variable} ${space.variable} ${syne.variable} ${chewy.variable}`;
  
  return (
    <html
      lang="en"
      className={`${fonts} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground transition-colors duration-300">
        <ThemeProvider>
          <CartProvider>
            <LayoutShell>
              {children}
            </LayoutShell>
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}


import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Nav, Footer } from "./Chrome";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "BoldSpan Bento Grid | Bento grids for WordPress",
  description: "The easiest way to create highly customizable bento box UIs in WordPress. Free plugin, Pro when you want more.",
  icons: { icon: "/icon-256x256.gif" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${poppins.variable} antialiased`}>
      <body>
        <Nav />
        {children}
        <Footer />
      </body>
    </html>
  );
}

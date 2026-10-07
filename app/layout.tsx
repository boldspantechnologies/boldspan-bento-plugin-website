import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Nav, Footer } from "./Chrome";
import { JsonLd } from "./JsonLd";
import { Tracker } from "./Tracker";
import { freeFeatures, proFeatures, site, siteDescription, siteUrl } from "./site";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "BoldSpan Bento Grid: Bento Grid Plugin for WordPress", template: "%s | BoldSpan Bento Grid" },
  description: siteDescription,
  applicationName: site.name,
  keywords: ["bento grid wordpress", "bento grid plugin", "wordpress bento layout", "gutenberg bento grid", "elementor bento grid", "bento box ui wordpress", "wordpress grid plugin"],
  authors: [{ name: "BoldSpan", url: siteUrl }],
  alternates: { canonical: "/" },
  icons: { icon: "/icon-256x256.gif" },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  openGraph: { type: "website", siteName: site.name, locale: "en_US", url: "/", title: "BoldSpan Bento Grid: Bento Grid Plugin for WordPress", description: siteDescription, images: [{ url: "/banner-1544x500.png", width: 1544, height: 500, alt: "BoldSpan Bento Grid for WordPress" }] },
  twitter: { card: "summary_large_image", title: "BoldSpan Bento Grid: Bento Grid Plugin for WordPress", description: siteDescription, images: ["/banner-1544x500.png"] },
};

const jsonLd = [
  { "@context": "https://schema.org", "@type": "Organization", "@id": `${siteUrl}/#org`, name: "BoldSpan", url: siteUrl, logo: `${siteUrl}/icon-256x256.gif`, email: site.email },
  { "@context": "https://schema.org", "@type": "WebSite", "@id": `${siteUrl}/#website`, url: siteUrl, name: site.name, description: siteDescription, publisher: { "@id": `${siteUrl}/#org` }, inLanguage: "en" },
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${siteUrl}/#app`,
    name: site.name,
    alternateName: "Bento Grid for WordPress",
    description: siteDescription,
    applicationCategory: "DesignApplication",
    applicationSubCategory: "WordPress plugin",
    operatingSystem: "WordPress 6.4+",
    url: siteUrl,
    downloadUrl: site.freeUrl,
    image: `${siteUrl}/banner-1544x500.png`,
    publisher: { "@id": `${siteUrl}/#org` },
    featureList: [...freeFeatures, ...proFeatures],
    offers: [
      { "@type": "Offer", name: "Free", price: 0, priceCurrency: "USD", url: site.freeUrl },
      { "@type": "AggregateOffer", name: "Pro", lowPrice: 5, highPrice: 20, priceCurrency: "USD", offerCount: 3, url: `${siteUrl}/pricing` },
    ],
  },
];

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${poppins.variable} antialiased`}>
      <body>
        <JsonLd data={jsonLd} />
        <Tracker />
        <Nav />
        {children}
        <Footer />
      </body>
    </html>
  );
}

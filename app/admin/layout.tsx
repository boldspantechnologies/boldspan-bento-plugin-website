import type { Metadata } from "next";

// Admin is the only part of the site kept out of search results.
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}

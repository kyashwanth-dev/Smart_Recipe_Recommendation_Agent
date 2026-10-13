import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ChefAI | Cook brilliantly from what you have",
  description: "An intelligent kitchen companion for creative, achievable meals.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

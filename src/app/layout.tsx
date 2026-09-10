import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Games Zoom",
  description: "Sua wishlist da Steam, compartilhada com os amigos.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={geist.variable}>
      <body className="font-sans antialiased">
        {children}
        <Toaster richColors position="top-center" theme="dark" closeButton />
      </body>
    </html>
  );
}

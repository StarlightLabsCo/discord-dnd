import type { Metadata } from "next";

import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

import "./globals.css";
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
    title: "Discord D&D - Admin",
    description: "Created by Starlight Labs",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang='en'>
            <body
                className={cn(
                    "min-h-screen w-full h-screen flex",
                    inter.className
                )}
            >
                <Navbar />
                <div className='p-2 w-full h-full'>{children}</div>
                <Toaster />
            </body>
        </html>
    );
}

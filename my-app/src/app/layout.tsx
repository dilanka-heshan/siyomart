import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "./providers/AuthProvider";
import Header from "./components/layout/Header";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SiyoMart - Handmade Products from Sri Lanka",
  description: "Discover unique handmade products from Sri Lanka, shipped worldwide.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <Header />
          <main>
            {children}
          </main>
          <footer className="bg-amber-800 text-white py-8">
            <div className="container mx-auto px-4">
              <div className="grid md:grid-cols-3 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4">SiyoMart</h3>
                  <p>Connecting Sri Lankan artisans to the world.</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                  <ul className="space-y-2">
                    <li><Link href="/" className="hover:underline">Home</Link></li>
                    <li><Link href="/shop" className="hover:underline">Shop</Link></li>
                    <li><Link href="/about" className="hover:underline">About</Link></li>
                    <li><Link href="/contact" className="hover:underline">Contact</Link></li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">Contact</h3>
                  <p>Email: info@siyomart.com</p>
                  <p>Phone: +94 11 123 4567</p>
                </div>
              </div>
              <div className="border-t border-amber-700 mt-8 pt-4 text-center text-sm">
                <p>&copy; {new Date().getFullYear()} SiyoMart. All rights reserved.</p>
              </div>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}

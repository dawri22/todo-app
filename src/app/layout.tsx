import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import "./globals.css";
import Providers from "./Providers";
import Navbar from "@/components/Navbar";
import { PostProvider } from "@/context/PostContext";

const raleway = Raleway({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TO DO APP",
  description: "Login Register and Post CRUD",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={raleway.className}>
        <Providers>
          <Navbar />
          <PostProvider>{children}</PostProvider>
        </Providers>
      </body>
    </html>
  );
}

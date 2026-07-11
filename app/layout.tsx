import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Briefe, die bleiben",
  description:
    "Anonyme, moderierte Mutmach-Briefe. Lies einen Brief, der dir guttut – oder schreib selbst einen.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Biserica Penticostală Aldești",
  description: "Worship team scheduling app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ro">
      <body>
        <div className="app-shell">{children}</div>
      </body>
    </html>
  );
}

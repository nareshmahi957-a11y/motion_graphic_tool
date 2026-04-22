
import './globals.css'; // Ensure correct import
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AutoAE PRO',
  description: 'AI Motion Graphics Editor',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#0a0a0a] antialiased">
        {children}
      </body>
    </html>
  );
}

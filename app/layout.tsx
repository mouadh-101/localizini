import type { Metadata } from 'next'
import { Inter } from '@next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext' 
import { Toaster } from '@/components/ui/sonner'; // Import Toaster

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Localizini',
  description: 'Discover nearby leisure places, connect with visitors, and share your experiences with Localizini.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans">
        <AuthProvider>
          {children}
          <Toaster richColors position="top-right" closeButton />
        </AuthProvider>
      </body>
    </html>
  )
}

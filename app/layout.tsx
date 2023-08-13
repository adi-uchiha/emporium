import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'
import { Inter } from 'next/font/google'
import { ModalProvider } from '@/providers/modal-provider'
import prismadb from '@/lib/prismadb'
import { ToastProvider } from '@/providers/toast-provider'

const inter = Inter({ subsets: ['latin'],})

export const metadata = {
  title: 'Emporium Admin DashBoard',
  description: 'A dedicated admin access for management of the Multi-store E-commerce Site',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const store = prismadb.store
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <ModalProvider />
          <ToastProvider />
          {children}
          </body>
      </html>
    </ClerkProvider>
  )
}

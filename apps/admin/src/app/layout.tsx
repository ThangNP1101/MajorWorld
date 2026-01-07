import type { Metadata } from 'next'
import './globals.css'
import { Sidebar } from '@/components/layout/Sidebar'
import { QueryProvider } from '@/components/providers/QueryProvider'

export const metadata: Metadata = {
  title: 'MajorWorld Admin',
  description: 'Hybrid App Admin Panel',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          <div className="flex h-screen bg-background">
            <Sidebar />
            <main className="flex-1 overflow-y-auto p-8">
              {children}
            </main>
          </div>
        </QueryProvider>
      </body>
    </html>
  )
}


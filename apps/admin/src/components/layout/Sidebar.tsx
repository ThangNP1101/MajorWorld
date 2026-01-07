'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Palette, 
  Settings, 
  Bell, 
  Image as ImageIcon, 
  BarChart3,
  Zap 
} from 'lucide-react'
import { cn } from '@/lib/utils'

const menuItems = [
  { 
    href: '/app-design', 
    label: 'Set up your app design', 
    icon: Palette 
  },
  { 
    href: '/app-features', 
    label: 'Set up app features', 
    icon: Settings 
  },
  { 
    href: '/push-management', 
    label: 'Push message management', 
    icon: Bell 
  },
  { 
    href: '/splash-image', 
    label: 'Splash image', 
    icon: ImageIcon 
  },
  { 
    href: '/push-statistics', 
    label: 'Push Statistics', 
    icon: BarChart3 
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-white border-r border-border flex flex-col">
      <div className="p-6">
        <button className="w-full bg-black text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-800 transition">
          <Zap className="w-4 h-4" />
          Quick Create
        </button>
      </div>

      <nav className="flex-1 px-3">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition mb-1',
                isActive
                  ? 'bg-gray-100 text-gray-900 font-medium'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}


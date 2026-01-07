interface MenuItem {
  id?: number
  menuName: string
  connectionUrl: string
  iconActive: string | null
  iconInactive: string | null
  sortOrder: number
  isActive?: boolean
}

interface PhoneMockupProps {
  colors: {
    tapMenuBg: string
    statusBarBg: string
    titleBarBg: string
  }
  menus: MenuItem[]
}

export function PhoneMockup({ colors, menus }: PhoneMockupProps) {
  return (
    <div className="relative w-64 h-[550px]">
      {/* Phone Frame */}
      <div className="absolute inset-0 bg-black rounded-[2.5rem] shadow-2xl p-3">
        {/* Screen */}
        <div className="relative w-full h-full bg-white rounded-[2rem] overflow-hidden">
          {/* Status Bar */}
          <div
            className="h-12 flex items-center justify-between px-6"
            style={{ backgroundColor: colors.statusBarBg }}
          >
            <span
              className={`text-sm font-medium ${
                colors.statusBarBg === '#000000' || colors.statusBarBg === '#000'
                  ? 'text-white'
                  : 'text-black'
              }`}
            >
              9:41
            </span>
            <div className="flex gap-1">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-1 h-1 rounded-full bg-current opacity-70"
                />
              ))}
            </div>
          </div>

          {/* Title Bar */}
          <div
            className="h-12 flex items-center justify-center border-b"
            style={{ backgroundColor: colors.titleBarBg }}
          >
            <span className="font-semibold text-gray-900">App Title</span>
          </div>

          {/* Content Area */}
          <div className="flex-1 bg-gray-50" />

          {/* Bottom Tab Bar */}
          <div
            className="absolute bottom-0 left-0 right-0 h-16 flex items-center justify-around border-t"
            style={{ backgroundColor: colors.tapMenuBg }}
          >
            {menus
              .sort((a, b) => a.sortOrder - b.sortOrder)
              .map((menu, index) => {
                // First menu is active by default for preview
                const isActive = index === 0
                const iconUrl = isActive ? menu.iconActive : menu.iconInactive
                
                return (
                  <div
                    key={`${menu.id || 'new'}-${index}-${iconUrl || 'no-icon'}`}
                    className="flex flex-col items-center justify-center gap-1"
                  >
                    {iconUrl ? (
                      <img
                        src={iconUrl}
                        alt={menu.menuName || 'Menu icon'}
                        className="w-6 h-6 object-contain"
                        key={iconUrl}
                      />
                    ) : (
                      <div className="w-6 h-6 bg-white bg-opacity-30 rounded" />
                    )}
                    <span className="text-[10px] text-white opacity-80">
                      {menu.menuName || 'Menu'}
                    </span>
                  </div>
                )
              })}
          </div>
        </div>
      </div>
    </div>
  )
}


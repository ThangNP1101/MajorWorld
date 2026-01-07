'use client'

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { GripVertical, Trash2, Upload, X } from 'lucide-react'
import { api } from '@/lib/api'

interface MenuItem {
  id?: number
  menuName: string
  connectionUrl: string
  iconActive: string | null
  iconInactive: string | null
  sortOrder: number
  isActive?: boolean
}

interface MenuBuilderProps {
  menus: MenuItem[]
  setMenus: (menus: MenuItem[]) => void
}

export function MenuBuilder({ menus, setMenus }: MenuBuilderProps) {
  const queryClient = useQueryClient()
  const [uploading, setUploading] = useState<{
    menuId: number | undefined
    type: 'active' | 'inactive'
  } | null>(null)

  // Upload active icon mutation
  const uploadActiveIconMutation = useMutation({
    mutationFn: async ({ menuId, file }: { menuId: number; file: File }) => {
      const formData = new FormData()
      formData.append('file', file)
      const { data } = await api.post(
        `/admin/bottom-menu/${menuId}/upload/active-icon`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )
      return data
    },
    onSuccess: (data) => {
      // Update local state with the new icon URL immediately
      setMenus((prevMenus) =>
        prevMenus.map((m) =>
          m.id === data.id ? { ...m, iconActive: data.iconActive } : m
        )
      )
      // Update query cache optimistically
      queryClient.setQueryData<MenuItem[]>(['bottomMenus'], (oldData) => {
        if (!oldData) return oldData
        return oldData.map((m) =>
          m.id === data.id ? { ...m, iconActive: data.iconActive } : m
        )
      })
      // Invalidate and refetch to sync with backend (in background)
      queryClient.invalidateQueries({ queryKey: ['bottomMenus'] })
      setUploading(null)
    },
    onError: () => {
      setUploading(null)
    },
  })

  // Upload inactive icon mutation
  const uploadInactiveIconMutation = useMutation({
    mutationFn: async ({ menuId, file }: { menuId: number; file: File }) => {
      const formData = new FormData()
      formData.append('file', file)
      const { data } = await api.post(
        `/admin/bottom-menu/${menuId}/upload/inactive-icon`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )
      return data
    },
    onSuccess: (data) => {
      // Update local state with the new icon URL immediately
      setMenus((prevMenus) =>
        prevMenus.map((m) =>
          m.id === data.id ? { ...m, iconInactive: data.iconInactive } : m
        )
      )
      // Update query cache optimistically
      queryClient.setQueryData<MenuItem[]>(['bottomMenus'], (oldData) => {
        if (!oldData) return oldData
        return oldData.map((m) =>
          m.id === data.id ? { ...m, iconInactive: data.iconInactive } : m
        )
      })
      // Invalidate and refetch to sync with backend (in background)
      queryClient.invalidateQueries({ queryKey: ['bottomMenus'] })
      setUploading(null)
    },
    onError: () => {
      setUploading(null)
    },
  })

  const handleIconUpload = (
    menuId: number | undefined,
    type: 'active' | 'inactive',
    file: File
  ) => {
    if (!menuId) {
      alert('Please save the menu first before uploading icons')
      return
    }

    setUploading({ menuId, type })

    if (type === 'active') {
      uploadActiveIconMutation.mutate({ menuId, file })
    } else {
      uploadInactiveIconMutation.mutate({ menuId, file })
    }
  }

  const handleIconRemove = (
    menuId: number | undefined,
    type: 'active' | 'inactive'
  ) => {
    if (!menuId) return

    setMenus(
      menus.map((m) =>
        m.id === menuId
          ? { ...m, [type === 'active' ? 'iconActive' : 'iconInactive']: null }
          : m
      )
    )
  }

  const addMenu = () => {
    if (menus.length >= 5) {
      alert('Maximum 5 menus allowed')
      return
    }

    setMenus([
      ...menus,
      {
        // No ID for new menu - will be created by backend
        menuName: '',
        connectionUrl: '',
        iconActive: null,
        iconInactive: null,
        sortOrder: menus.length + 1,
      },
    ])
  }

  const removeMenu = (id?: number) => {
    if (id === undefined) return
    setMenus(menus.filter((m) => m.id !== id))
  }

  const updateMenu = (id: number | undefined, field: keyof MenuItem, value: string) => {
    if (id === undefined) return
    setMenus(
      menus.map((m) => (m.id === id ? { ...m, [field]: value } : m))
    )
  }

  return (
    <div className="bg-white rounded-lg border border-border p-6">
      <h2 className="text-lg font-semibold mb-2">Menu icon/link settings</h2>
      <p className="text-sm text-gray-600 mb-6">
        Configure the bottom navigation menu (up to 5)
      </p>

      <div className="space-y-4">
        {menus.map((menu, index) => (
          <div
            key={menu.id || `new-menu-${index}`}
            className="border border-gray-200 rounded-lg p-4 relative"
          >
            {/* Drag Handle */}
            <div className="absolute left-4 top-1/2 -translate-y-1/2 cursor-grab">
              <GripVertical className="w-5 h-5 text-gray-400" />
            </div>

            <div className="ml-8 space-y-4">
              {/* Menu Name & Connection URL */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Menu name
                  </label>
                  <input
                    type="text"
                    value={menu.menuName}
                    onChange={(e) =>
                      updateMenu(menu.id, 'menuName', e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Connection URL
                  </label>
                  <input
                    type="text"
                    value={menu.connectionUrl}
                    onChange={(e) =>
                      updateMenu(menu.id, 'connectionUrl', e.target.value)
                    }
                    placeholder="/"
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                </div>
              </div>

              {/* Icons */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Active icon (ON)
                  </label>
                  {menu.iconActive ? (
                    <div className="space-y-2">
                      <div className="relative inline-block">
                        <img
                          src={menu.iconActive}
                          alt="Active icon"
                          className="w-16 h-16 object-contain border border-gray-300 rounded"
                        />
                        <button
                          onClick={() => handleIconRemove(menu.id, 'active')}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            handleIconUpload(menu.id, 'active', file)
                          }
                        }}
                        disabled={
                          uploading?.menuId === menu.id &&
                          uploading?.type === 'active'
                        }
                      />
                      <div className="w-full px-4 py-2 border border-gray-300 rounded flex items-center justify-center gap-2 hover:bg-gray-50 disabled:opacity-50">
                        <Upload className="w-4 h-4" />
                        {uploading?.menuId === menu.id &&
                        uploading?.type === 'active'
                          ? 'Uploading...'
                          : 'Upload'}
                      </div>
                    </label>
                  )}
                  <span className="text-xs text-gray-500 mt-1 block">
                    140px recommended
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Inactive icon (OFF)
                  </label>
                  {menu.iconInactive ? (
                    <div className="space-y-2">
                      <div className="relative inline-block">
                        <img
                          src={menu.iconInactive}
                          alt="Inactive icon"
                          className="w-16 h-16 object-contain border border-gray-300 rounded"
                        />
                        <button
                          onClick={() => handleIconRemove(menu.id, 'inactive')}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            handleIconUpload(menu.id, 'inactive', file)
                          }
                        }}
                        disabled={
                          uploading?.menuId === menu.id &&
                          uploading?.type === 'inactive'
                        }
                      />
                      <div className="w-full px-4 py-2 border border-gray-300 rounded flex items-center justify-center gap-2 hover:bg-gray-50 disabled:opacity-50">
                        <Upload className="w-4 h-4" />
                        {uploading?.menuId === menu.id &&
                        uploading?.type === 'inactive'
                          ? 'Uploading...'
                          : 'Upload'}
                      </div>
                    </label>
                  )}
                  <span className="text-xs text-gray-500 mt-1 block">
                    140px recommended
                  </span>
                </div>
              </div>
            </div>

            {/* Delete Button */}
            {menus.length > 1 && (
              <button
                onClick={() => removeMenu(menu.id)}
                className="absolute right-4 top-4 text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
          </div>
        ))}
      </div>

      {menus.length < 5 && (
        <button
          onClick={addMenu}
          className="mt-4 text-sm text-gray-600 hover:text-gray-900 flex items-center gap-2"
        >
          <span className="text-lg">+</span> Add a menu
        </button>
      )}
    </div>
  )
}


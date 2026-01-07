"use client";

import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { HexColorPicker } from "react-colorful";
import { api } from "@/lib/api";
import { PhoneMockup } from "@/components/app-design/PhoneMockup";
import { MenuBuilder } from "@/components/app-design/MenuBuilder";

interface AppConfig {
  id: number;
  tapMenuBg: string;
  statusBarBg: string;
  titleBarBg: string;
}

interface MenuItem {
  id?: number;
  menuName: string;
  connectionUrl: string;
  iconActive: string | null;
  iconInactive: string | null;
  sortOrder: number;
  isActive?: boolean;
}

export default function AppDesignPage() {
  const queryClient = useQueryClient();
  const [colors, setColors] = useState({
    tapMenuBg: "#9f7575",
    statusBarBg: "#000000",
    titleBarBg: "#FFFFFF",
  });
  const [openPicker, setOpenPicker] = useState<
    "tapMenuBg" | "statusBarBg" | "titleBarBg" | null
  >(null);
  const [menus, setMenus] = useState<MenuItem[]>([]);

  // Refs for click outside detection
  const tapMenuRef = useRef<HTMLDivElement>(null);
  const statusBarRef = useRef<HTMLDivElement>(null);
  const titleBarRef = useRef<HTMLDivElement>(null);

  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        openPicker === "tapMenuBg" &&
        tapMenuRef.current &&
        !tapMenuRef.current.contains(event.target as Node)
      ) {
        setOpenPicker(null);
      } else if (
        openPicker === "statusBarBg" &&
        statusBarRef.current &&
        !statusBarRef.current.contains(event.target as Node)
      ) {
        setOpenPicker(null);
      } else if (
        openPicker === "titleBarBg" &&
        titleBarRef.current &&
        !titleBarRef.current.contains(event.target as Node)
      ) {
        setOpenPicker(null);
      }
    };

    if (openPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openPicker]);

  // Fetch current config
  const { data: config } = useQuery<AppConfig>({
    queryKey: ["appConfig"],
    queryFn: async () => {
      const { data } = await api.get("/admin/app-design");
      setColors({
        tapMenuBg: data.tapMenuBg,
        statusBarBg: data.statusBarBg,
        titleBarBg: data.titleBarBg,
      });
      return data;
    },
  });

  // Fetch menus
  const { data: fetchedMenus } = useQuery<MenuItem[]>({
    queryKey: ["bottomMenus"],
    queryFn: async () => {
      const { data } = await api.get("/admin/bottom-menu");
      return data;
    },
  });

  // Update local menus state when fetched
  useEffect(() => {
    if (fetchedMenus) {
      setMenus(fetchedMenus);
    }
  }, [fetchedMenus]);

  // Update colors mutation
  const updateColorsMutation = useMutation({
    mutationFn: async (newColors: typeof colors) => {
      const { data } = await api.put("/admin/app-design/colors", newColors);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appConfig"] });
    },
  });

  // Update menus mutation
  const updateMenusMutation = useMutation({
    mutationFn: async (newMenus: MenuItem[]) => {
      // Remove createdAt and updatedAt before sending
      // Also remove temporary IDs (IDs > PostgreSQL INTEGER max = 2147483647)
      const cleanedMenus = newMenus.map((menu) => {
        const { createdAt, updatedAt, id, ...rest } = menu as any;
        // Only include ID if it's a valid database ID (not a temporary timestamp)
        const validId = id && id <= 2147483647 ? id : undefined;
        return validId ? { ...rest, id: validId } : rest;
      });
      const { data } = await api.put("/admin/bottom-menu/bulk", {
        menus: cleanedMenus,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bottomMenus"] });
    },
  });

  const handleSave = async () => {
    try {
      await Promise.all([
        updateColorsMutation.mutateAsync(colors),
        updateMenusMutation.mutateAsync(menus),
      ]);
      alert("Settings saved successfully!");
    } catch (error) {
      alert("Failed to save settings. Please try again.");
      console.error(error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          App design/theme settings
        </h1>
        <p className="text-gray-600 mt-2">
          Change UI colors and menu configuration without redistributing the app
        </p>
      </div>

      {/* Color Settings & Preview */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        {/* Left: Color Settings */}
        <div className="bg-white rounded-lg border border-border p-6">
          <h2 className="text-lg font-semibold mb-2">Color Settings</h2>
          <p className="text-sm text-gray-600 mb-6">
            Set the main color of the app
          </p>

          {/* Tap menu background color */}
          <div className="mb-6" ref={tapMenuRef}>
            <label className="block text-sm font-medium mb-3">
              Tap menu background color
            </label>
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded border border-gray-300 cursor-pointer hover:opacity-80 transition"
                style={{ backgroundColor: colors.tapMenuBg }}
                onClick={() => setOpenPicker("tapMenuBg")}
              />
              <input
                type="text"
                value={colors.tapMenuBg}
                onChange={(e) =>
                  setColors({ ...colors, tapMenuBg: e.target.value })
                }
                className="flex-1 px-3 py-2 border border-gray-300 rounded"
              />
            </div>
            {openPicker === "tapMenuBg" && (
              <div className="mt-3">
                <HexColorPicker
                  color={colors.tapMenuBg}
                  onChange={(color) =>
                    setColors({ ...colors, tapMenuBg: color })
                  }
                />
              </div>
            )}
          </div>

          {/* Status bar background color */}
          <div className="mb-6" ref={statusBarRef}>
            <label className="block text-sm font-medium mb-3">
              Status bar background color
            </label>
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded border border-gray-300 cursor-pointer hover:opacity-80 transition"
                style={{ backgroundColor: colors.statusBarBg }}
                onClick={() => setOpenPicker("statusBarBg")}
              />
              <input
                type="text"
                value={colors.statusBarBg}
                onChange={(e) =>
                  setColors({ ...colors, statusBarBg: e.target.value })
                }
                className="flex-1 px-3 py-2 border border-gray-300 rounded"
              />
            </div>
            {openPicker === "statusBarBg" && (
              <div className="mt-3">
                <HexColorPicker
                  color={colors.statusBarBg}
                  onChange={(color) =>
                    setColors({ ...colors, statusBarBg: color })
                  }
                />
              </div>
            )}
          </div>

          {/* Title bar background color */}
          <div className="mb-6" ref={titleBarRef}>
            <label className="block text-sm font-medium mb-3">
              Title bar background color
            </label>
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded border border-gray-300 cursor-pointer hover:opacity-80 transition"
                style={{ backgroundColor: colors.titleBarBg }}
                onClick={() => setOpenPicker("titleBarBg")}
              />
              <input
                type="text"
                value={colors.titleBarBg}
                onChange={(e) =>
                  setColors({ ...colors, titleBarBg: e.target.value })
                }
                className="flex-1 px-3 py-2 border border-gray-300 rounded"
              />
            </div>
            {openPicker === "titleBarBg" && (
              <div className="mt-3">
                <HexColorPicker
                  color={colors.titleBarBg}
                  onChange={(color) =>
                    setColors({ ...colors, titleBarBg: color })
                  }
                />
              </div>
            )}
          </div>
        </div>

        {/* Right: Preview */}
        <div className="bg-white rounded-lg border border-border p-6">
          <h2 className="text-lg font-semibold mb-2">Preview</h2>
          <p className="text-sm text-gray-600 mb-6">
            See the changed colors in real time
          </p>

          <div className="flex justify-center">
            <PhoneMockup colors={colors} menus={menus} />
          </div>
        </div>
      </div>

      {/* Menu Icon/Link Settings */}
      <MenuBuilder menus={menus} setMenus={setMenus} />

      {/* Save Button */}
      <div className="flex justify-end mt-8">
        <button
          onClick={handleSave}
          disabled={
            updateColorsMutation.isPending || updateMenusMutation.isPending
          }
          className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition disabled:opacity-50"
        >
          {updateColorsMutation.isPending || updateMenusMutation.isPending
            ? "Saving..."
            : "Save your settings"}
        </button>
      </div>
    </div>
  );
}

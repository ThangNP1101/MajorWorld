"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Send, Clock, Upload, Trash2 } from "lucide-react";

interface PushMessage {
  id: number;
  title: string;
  androidMessage?: string;
  androidBigtext?: string;
  iosMessage?: string;
  imageUrl?: string;
  landingUrl?: string;
  target: "all" | "android" | "ios";
  status: "draft" | "scheduled" | "sending" | "sent";
  sendType: "immediate" | "scheduled";
  scheduledAt?: string;
  sentAt?: string;
  totalSent: number;
  totalViews: number;
  createdAt: string;
  updatedAt: string;
}

interface DeviceStats {
  total: number;
  android: number;
  ios: number;
}

interface DeviceToken {
  id: number;
  userId?: number;
  fcmToken: string;
  platform: "android" | "ios";
  appVersion?: string;
  isActive: boolean;
  lastSeenAt?: string;
}

export default function PushManagementPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"compose" | "scheduled">("compose");
  
  // Form state
  const [formData, setFormData] = useState({
    title: "",
    androidMessage: "",
    androidBigtext: "",
    iosMessage: "",
    imageUrl: "",
    landingUrl: "",
    target: "all" as "all" | "android" | "ios",
    sendType: "immediate" as "immediate" | "scheduled",
    scheduledAt: "",
  });

  const [selectedTestDevices, setSelectedTestDevices] = useState<number[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  // Fetch device stats
  const { data: deviceStats } = useQuery<DeviceStats>({
    queryKey: ["pushDeviceStats"],
    queryFn: async () => {
      const { data } = await api.get("/admin/push-messages/stats");
      return data;
    },
  });

  // Fetch scheduled messages
  const { data: scheduledMessages } = useQuery<PushMessage[]>({
    queryKey: ["scheduledPushMessages"],
    queryFn: async () => {
      const { data } = await api.get("/admin/push-messages/scheduled");
      return data;
    },
    enabled: activeTab === "scheduled",
  });

  // Fetch test devices (simplified - using all device tokens for now)
  const { data: testDevices } = useQuery<DeviceToken[]>({
    queryKey: ["testDevices"],
    queryFn: async () => {
      // For now, we'll use a placeholder. In production, you'd have a dedicated test device endpoint
      // For demo purposes, we'll show a message that test devices need to be managed separately
      return [];
    },
  });

  // Create push message mutation
  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const { data: response } = await api.post("/admin/push-messages", data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scheduledPushMessages"] });
      // Reset form
      setFormData({
        title: "",
        androidMessage: "",
        androidBigtext: "",
        iosMessage: "",
        imageUrl: "",
        landingUrl: "",
        target: "all",
        sendType: "immediate",
        scheduledAt: "",
      });
      setImageFile(null);
      setImagePreview("");
      alert("Push message created successfully!");
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || "Failed to create push message");
    },
  });

  // Send push message mutation
  const sendMutation = useMutation({
    mutationFn: async (id: number) => {
      const { data } = await api.post(`/admin/push-messages/${id}/send`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scheduledPushMessages"] });
      alert("Push message sent successfully!");
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || "Failed to send push message");
    },
  });

  // Send test push mutation
  const sendTestMutation = useMutation({
    mutationFn: async ({ id, deviceTokenIds }: { id: number; deviceTokenIds: number[] }) => {
      const { data } = await api.post(`/admin/push-messages/${id}/test`, {
        deviceTokenIds,
      });
      return data;
    },
    onSuccess: () => {
      alert("Test push sent successfully!");
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || "Failed to send test push");
    },
  });

  // Delete scheduled message mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/admin/push-messages/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scheduledPushMessages"] });
      alert("Scheduled message deleted successfully!");
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || "Failed to delete message");
    },
  });

  // Handle image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submit
  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      alert("Title is required");
      return;
    }

    if (!formData.androidMessage && !formData.iosMessage) {
      alert("At least one message (Android or iOS) is required");
      return;
    }

    if (formData.sendType === "scheduled" && !formData.scheduledAt) {
      alert("Scheduled time is required for scheduled messages");
      return;
    }

    try {
      // Convert datetime-local to ISO string
      let scheduledAtISO: string | undefined = undefined;
      if (formData.sendType === "scheduled" && formData.scheduledAt) {
        // datetime-local returns format: "YYYY-MM-DDTHH:mm"
        // Convert to ISO string
        scheduledAtISO = new Date(formData.scheduledAt).toISOString();
      }

      // Clean up empty strings to undefined for optional fields
      const messageData: any = {
        title: formData.title,
        target: formData.target,
        sendType: formData.sendType,
        ...(formData.androidMessage && { androidMessage: formData.androidMessage }),
        ...(formData.androidBigtext && { androidBigtext: formData.androidBigtext }),
        ...(formData.iosMessage && { iosMessage: formData.iosMessage }),
        ...(formData.landingUrl && { landingUrl: formData.landingUrl }),
        ...(scheduledAtISO && { scheduledAt: scheduledAtISO }),
      };

      const createdMessage = await createMutation.mutateAsync(messageData);

      // If image is uploaded, upload it
      if (imageFile && createdMessage.id) {
        const formDataUpload = new FormData();
        formDataUpload.append("file", imageFile);
        await api.post(`/admin/push-messages/${createdMessage.id}/upload/image`, formDataUpload, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      // If immediate send, send it
      if (formData.sendType === "immediate") {
        await sendMutation.mutateAsync(createdMessage.id);
      }
    } catch (error) {
      console.error("Error creating/sending push message:", error);
    }
  };

  // Check if it's nighttime (9 PM - 8 AM)
  const isNightTime = () => {
    const now = new Date();
    const hour = now.getHours();
    return hour >= 21 || hour < 8;
  };

  // Format date for display
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Push message management</h1>
      <p className="text-gray-600 mt-2">
        Send push notifications to your customers
      </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("compose")}
          className={`px-4 py-2 font-medium transition ${
            activeTab === "compose"
              ? "text-gray-900 border-b-2 border-gray-900"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Compose a message
        </button>
        <button
          onClick={() => setActiveTab("scheduled")}
          className={`px-4 py-2 font-medium transition ${
            activeTab === "scheduled"
              ? "text-gray-900 border-b-2 border-gray-900"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Scheduled to be shipped
        </button>
      </div>

      {activeTab === "compose" ? (
        <div className="grid grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="col-span-2 space-y-6">
            {/* Target Selection */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold mb-4">Choose what to send to</h2>
              <div className="flex gap-3">
                <button
                  onClick={() => setFormData({ ...formData, target: "all" })}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    formData.target === "all"
                      ? "bg-gray-900 text-white"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  All ({deviceStats?.total.toLocaleString() || 0} people)
                </button>
                <button
                  onClick={() => setFormData({ ...formData, target: "android" })}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    formData.target === "android"
                      ? "bg-gray-900 text-white"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  Android ({deviceStats?.android.toLocaleString() || 0} people)
                </button>
                <button
                  onClick={() => setFormData({ ...formData, target: "ios" })}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    formData.target === "ios"
                      ? "bg-gray-900 text-white"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  iOS ({deviceStats?.ios.toLocaleString() || 0} people)
                </button>
              </div>
            </div>

            {/* Compose Message */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold mb-4">Compose a message</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter a push notification title"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                    maxLength={100}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Android Messages</label>
                  <textarea
                    value={formData.androidMessage}
                    onChange={(e) => setFormData({ ...formData, androidMessage: e.target.value })}
                    placeholder="Messages to send to Android users"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Expand content (BigText - Android only)
                  </label>
                  <textarea
                    value={formData.androidBigtext}
                    onChange={(e) => setFormData({ ...formData, androidBigtext: e.target.value })}
                    placeholder="Details that will appear when the user expands the notification"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">iPhone Messages</label>
                  <textarea
                    value={formData.iosMessage}
                    onChange={(e) => setFormData({ ...formData, iosMessage: e.target.value })}
                    placeholder="Messages to iOS users"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Attached image</label>
                  <label className="flex items-center gap-3 px-4 py-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition">
                    <Upload className="w-5 h-5 text-gray-600" />
                    <span className="text-sm text-gray-700">
                      {imageFile ? imageFile.name : "Upload an image (800x464 recommended)"}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="mt-3 max-w-full h-auto rounded-lg"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Landing URL (deep link)
                  </label>
                  <input
                    type="text"
                    value={formData.landingUrl}
                    onChange={(e) => setFormData({ ...formData, landingUrl: e.target.value })}
                    placeholder="myapp://products/123 or https://..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    To convert a web URL to a deep link, use the Convert Deep Link menu.
                  </p>
                </div>
              </div>
            </div>

            {/* Shipping Settings */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold mb-4">Shipping settings</h2>
              
              <div className="flex gap-3 mb-4">
                <button
                  onClick={() => setFormData({ ...formData, sendType: "immediate" })}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                    formData.sendType === "immediate"
                      ? "bg-gray-900 text-white"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <Send className="w-4 h-4" />
                  Immediate Dispatch
                </button>
                <button
                  onClick={() => setFormData({ ...formData, sendType: "scheduled" })}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                    formData.sendType === "scheduled"
                      ? "bg-gray-900 text-white"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <Clock className="w-4 h-4" />
                  Send a reservation
                </button>
              </div>

              {formData.sendType === "scheduled" && (
                <div className="mb-4">
                  <input
                    type="datetime-local"
                    value={formData.scheduledAt}
                    onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                  />
                </div>
              )}

              {isNightTime() && formData.sendType === "immediate" && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                  <p className="text-sm text-yellow-800">
                    <strong>Nightly notification limit:</strong> Sending between 9 PM ~ 8 AM may be
                    limited based on the user's incoming settings.
                  </p>
                </div>
              )}

              {/* Test Dispatch */}
              <div className="mt-6">
                <h3 className="text-sm font-medium mb-2">Test Dispatch</h3>
                <p className="text-xs text-gray-600 mb-3">
                  Choose from our registered test devices to send.
                </p>
                <div className="space-y-2 mb-3">
                  <p className="text-sm text-gray-500 italic">
                    Test device management feature coming soon. For now, you can send to all devices.
                  </p>
                </div>
                <button
                  disabled={selectedTestDevices.length === 0}
                  className="px-4 py-2 bg-gray-900 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 transition"
                >
                  Send a test to the selected device ({selectedTestDevices.length})
                </button>
                <p className="text-xs text-gray-500 mt-2">
                  To add a test device, click the "Manage Test Device" menu.
                </p>
              </div>
            </div>

            {/* Send Button */}
            <button
              onClick={handleSubmit}
              disabled={createMutation.isPending || sendMutation.isPending}
              className="w-full bg-gray-900 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
              {createMutation.isPending || sendMutation.isPending
                ? "Sending..."
                : "Shipping"}
            </button>
          </div>

          {/* Preview Sidebar */}
          <div className="col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-6">
              <h2 className="text-lg font-semibold mb-2">Preview</h2>
              <p className="text-sm text-gray-600 mb-6">
                This is what the notification will look like.
              </p>

              {/* Android Preview */}
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-3">Android</h3>
                <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-500 rounded flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-medium text-sm text-gray-900">
                        {formData.title || "Push notification title"}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {formData.androidMessage || "Android message content"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* iOS Preview */}
              <div>
                <h3 className="text-sm font-medium mb-3">iOS</h3>
                <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-500 rounded flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 mb-1">App Name</p>
                      <p className="font-medium text-sm text-gray-900">
                        {formData.title || "Push notification title"}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {formData.iosMessage || "iOS message content"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Scheduled Messages Tab */
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-2">Scheduled Shipment List</h2>
          <p className="text-sm text-gray-600 mb-6">
            View and manage scheduled push messages.
          </p>

          {scheduledMessages && scheduledMessages.length > 0 ? (
            <div className="space-y-4">
              {scheduledMessages.map((message) => (
                <div
                  key={message.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                >
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{message.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {message.target === "all"
                        ? "All"
                        : message.target === "android"
                        ? "Android"
                        : "iOS"}{" "}
                      • {message.scheduledAt ? formatDateTime(message.scheduledAt) : "N/A"}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm font-medium">
                      Booked
                    </span>
                    <button
                      onClick={() => {
                        if (confirm("Are you sure you want to delete this scheduled message?")) {
                          deleteMutation.mutate(message.id);
                        }
                      }}
                      className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No scheduled messages</p>
          )}
        </div>
      )}
    </div>
  );
}

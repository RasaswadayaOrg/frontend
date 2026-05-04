"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { ImageWithFallback } from "@/components/ImageWithFallback";
import { ClipboardList, MapPin, User, Calendar, Package, MessageCircle, X, Send } from "lucide-react";

type SellerOrderItem = {
  id: string;
  quantity: number;
  price: number;
  product: {
    id: string;
    name: string;
    imageUrl: string | null;
  };
};

type SellerOrder = {
  id: string;
  status: string;
  shippingAddress: string;
  createdAt: string;
  totalForStore: number;
  buyer: { id: string; fullName: string; email: string } | null;
  items: SellerOrderItem[];
};

const STATUSES = ["PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"];

const statusStyles: Record<string, string> = {
  PENDING: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300",
  PAID: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  SHIPPED: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300",
  DELIVERED: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  CANCELLED: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300",
};

export default function SellerOrdersPage() {
  const [orders, setOrders] = useState<SellerOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Chat state
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatBuyer, setChatBuyer] = useState<{ id: string; name: string } | null>(null);
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);

  const openChatWithBuyer = async (buyerId: string, buyerName: string) => {
    setChatBuyer({ id: buyerId, name: buyerName });
    setIsChatOpen(true);
    setChatHistory([]);
    setConversationId(null);
    
    try {
      const token = localStorage.getItem("rasas_token");
      if (!token) return;
      const res = await fetch(`http://localhost:3001/api/v1/chat/store-conversations`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        // find conversation for this buyer
        const conv = data.find((c: any) => c.buyerId === buyerId);
        if (conv) {
          setConversationId(conv.id);
          const mappedMessages = conv.messages?.map((msg: any) => ({
            sender: msg.senderId === buyerId ? 'user' : 'seller',
            text: msg.text,
            createdAt: msg.createdAt
          })) || [];
          setChatHistory(mappedMessages);
        } else {
          setChatHistory([{ sender: "system", text: "No existing messages found with this buyer. When they message you, it will appear here." }]);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSendMessage = async () => {
    if (!chatMessage.trim() || !conversationId) return;
    
    setChatHistory([...chatHistory, { sender: 'seller', text: chatMessage }]);
    const currentMessage = chatMessage;
    setChatMessage("");

    try {
      const token = localStorage.getItem("rasas_token");
      if (!token) return;
      await fetch(`http://localhost:3001/api/v1/chat/conversations/${conversationId}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ text: currentMessage })
      });
    } catch (e) {
      console.error(e);
    }
  };

  const load = async () => {
    setLoading(true);
    const res = await apiFetch<SellerOrder[]>("/stores/user/my-store/orders");
    if (res.ok && Array.isArray(res.data)) {
      setOrders(res.data);
    } else {
      setError((res as any).error || "Failed to load orders");
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleStatusChange = async (orderId: string, status: string) => {
    setUpdatingId(orderId);
    const res = await apiFetch(`/orders/${orderId}/status`, {
      method: "PUT",
      json: { status },
    });
    if (res.ok) {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status } : o))
      );
    } else {
      alert(res.error || "Failed to update status");
    }
    setUpdatingId(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 rounded-full border-b-2 border-violet-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white flex items-center gap-2">
          <ClipboardList className="w-6 h-6 text-violet-600" /> Orders
        </h1>
        <p className="text-sm text-neutral-500 mt-1">
          {orders.length} {orders.length === 1 ? "order" : "orders"} for your store.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 text-rose-700 px-4 py-3 text-sm dark:bg-rose-950/30 dark:border-rose-900 dark:text-rose-300">
          {error}
        </div>
      )}

      {orders.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-dashed border-neutral-200 dark:border-neutral-800 p-16 text-center">
          <Package className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-neutral-900 dark:text-white mb-1">
            No orders yet
          </h2>
          <p className="text-sm text-neutral-500">
            Orders that contain your products will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white dark:bg-zinc-900 rounded-2xl border border-neutral-200/60 dark:border-neutral-800/60 overflow-hidden"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-neutral-200/60 dark:border-neutral-800/60">
                <div className="flex items-center gap-4 flex-wrap">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
                      Order
                    </p>
                    <p className="text-sm font-mono text-neutral-900 dark:text-white">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </p>
                  </div>
                  <div className="h-8 w-px bg-neutral-200 dark:bg-neutral-800" />
                  <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(order.createdAt).toLocaleDateString()}
                  </div>
                  {order.buyer && (
                    <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                      <User className="w-3.5 h-3.5" />
                      {order.buyer.fullName || order.buyer.email}
                      <button
                        onClick={() => openChatWithBuyer(order.buyer!.id, order.buyer!.fullName || order.buyer!.email)}
                        className="ml-2 flex items-center justify-center gap-1 p-1 bg-violet-100 hover:bg-violet-200 dark:bg-violet-900/30 dark:hover:bg-violet-900/50 text-violet-600 dark:text-violet-400 rounded transition-colors"
                        title="Message Customer"
                      >
                        <MessageCircle className="w-3.5 h-3.5" /> Chat
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md ${
                      statusStyles[order.status] || statusStyles.PENDING
                    }`}
                  >
                    {order.status}
                  </span>
                  <select
                    value={order.status}
                    disabled={updatingId === order.id}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className="text-xs bg-neutral-50 dark:bg-zinc-800 border border-neutral-200 dark:border-neutral-700 rounded-lg px-2 py-1.5 outline-none focus:border-violet-300 dark:focus:border-violet-700"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="px-5 py-4 space-y-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-neutral-100 dark:bg-zinc-800 flex-shrink-0">
                      <ImageWithFallback
                        src={item.product.imageUrl || "/logo.png"}
                        alt={item.product.name}
                        width={48}
                        height={48}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-neutral-900 dark:text-white line-clamp-1">
                        {item.product.name}
                      </p>
                      <p className="text-xs text-neutral-500">
                        Qty {item.quantity} × LKR {Number(item.price).toFixed(2)}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-neutral-900 dark:text-white">
                      LKR {(Number(item.price) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="px-5 py-3 bg-neutral-50/80 dark:bg-zinc-800/40 border-t border-neutral-200/60 dark:border-neutral-800/60 flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-start gap-1.5 text-xs text-neutral-600 dark:text-neutral-400 max-w-md">
                  <MapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-violet-500" />
                  <span className="line-clamp-2">{order.shippingAddress}</span>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
                    Your earnings
                  </p>
                  <p className="text-base font-bold text-violet-600 dark:text-violet-400">
                    LKR {Number(order.totalForStore || 0).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Chat Modal */}
      {isChatOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl max-w-lg w-full h-[600px] max-h-[80vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-4 bg-violet-600 text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-base font-bold">{chatBuyer?.name}</h2>
                  <p className="text-xs text-violet-200">Customer</p>
                </div>
              </div>
              <button 
                onClick={() => setIsChatOpen(false)} 
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
                title="Close chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-neutral-50 dark:bg-zinc-950">
              {chatHistory.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.sender === 'seller' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                    msg.sender === 'system' 
                      ? 'bg-neutral-200 dark:bg-zinc-800 text-neutral-500 w-full text-center text-xs'
                      : msg.sender === 'seller' 
                        ? 'bg-violet-600 text-white rounded-br-sm' 
                        : 'bg-white dark:bg-zinc-800 text-neutral-800 dark:text-neutral-200 shadow-sm border border-neutral-100 dark:border-neutral-800 rounded-bl-sm'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-zinc-900">
              <div className="flex items-end gap-2">
                <textarea
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder={conversationId ? "Type a reply..." : "Wait for customer to initiate..."}
                  disabled={!conversationId}
                  className="flex-1 bg-neutral-100 dark:bg-zinc-800 border-none rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none max-h-32 min-h-[44px]"
                  rows={1}
                />
                <button 
                  onClick={handleSendMessage}
                  disabled={!chatMessage.trim() || !conversationId}
                  className="p-3 bg-violet-600 text-white rounded-xl hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

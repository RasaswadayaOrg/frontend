"use client";

import { useCart } from "@/context/CartContext";
import { ImageWithFallback } from "@/components/ImageWithFallback";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, ArrowRight, MessageCircle, X, Send } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function CartPage() {
  const { user } = useAuth();
  const { items, itemCount, totalPrice, updateQuantity, removeItem, isLoading, fetchCart } = useCart();
  const router = useRouter();
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null);
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);

  const fetchChatHistory = async (storeId: string) => {
    try {
      const token = localStorage.getItem("rasas_token");
      if (!token) return;
      const res = await fetch(`http://localhost:3001/api/v1/chat/conversations/${storeId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setConversationId(data.id);
        const mappedMessages = data.messages?.map((msg: any) => ({
          sender: msg.senderId === user?.id ? 'user' : 'seller',
          text: msg.text,
          createdAt: msg.createdAt
        })) || [];
        setChatHistory([
          { sender: "system", text: `Connected securely to the store. You can start chatting!` },
          ...mappedMessages
        ]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSendMessage = async () => {
    if (!chatMessage.trim() || !conversationId) return;
    
    // Optimistic UI update
    setChatHistory([...chatHistory, { sender: 'user', text: chatMessage }]);
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
      // Optionally re-fetch chat history after a short delay
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    // Force a fresh cart fetch on load if user exists
    if (user) {
      fetchCart();
    }
  }, [user]);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Please login</h2>
        <p className="text-slate-500 mb-6">You need to be logged in to view your cart.</p>
      </div>
    );
  }

  if (isLoading && itemCount === 0) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
      </div>
    );
  }

  if (itemCount === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-slate-300 dark:border-zinc-700 rounded-2xl bg-white dark:bg-zinc-900 mx-auto max-w-2xl mt-10">
        <div className="w-20 h-20 bg-brand-100 dark:bg-brand-900/30 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="w-10 h-10 text-brand-600 dark:text-brand-400" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Your cart is empty</h2>
        <p className="text-slate-500 dark:text-zinc-400 mb-8 max-w-sm">
          Looks like you haven't added anything to your cart yet. Explore our marketplace to find authentic handicrafts!
        </p>
        <Link 
          href="/marketplace" 
          className="flex items-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-full font-medium transition-colors"
        >
          Explore Marketplace
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto mt-6">
      {/* Header */}
      <div>
        <Link 
          href="/marketplace" 
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-brand-600 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Continue Shopping
        </Link>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
          <ShoppingBag className="w-8 h-8 text-brand-600" />
          Your Cart
        </h1>
        <p className="text-slate-500 mt-1">Review your items before checkout.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items List */}
        <div className="lg:w-2/3 space-y-4">
          {items.map((item) => (
            <div 
              key={item.id} 
              className="flex items-center justify-between p-4 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-slate-100 dark:bg-zinc-800 rounded-xl overflow-hidden relative shrink-0">
                  <ImageWithFallback 
                    src={item.product?.imageUrl || "https://placehold.co/200x200?text=No+Image"} 
                    alt={item.product?.name || "Product"} 
                    fill 
                    className="object-cover" 
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white line-clamp-1">{item.product?.name}</h3>
                  <p className="text-sm text-slate-500 dark:text-zinc-400 mb-1">{item.product?.store?.name}</p>
                  <p className="text-brand-600 font-medium">
                    Rs. {(item.product?.price || 0).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-end gap-3 shrink-0">
                <div className="flex items-center gap-3 bg-slate-100 dark:bg-zinc-800 rounded-full px-3 py-1">
                  <button 
                    onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                    disabled={item.quantity <= 1}
                    className="text-slate-500 hover:text-brand-600 disabled:opacity-50 disabled:hover:text-slate-500 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-medium w-6 text-center text-slate-900 dark:text-white">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    disabled={item.quantity >= item.product.stock}
                    className="text-slate-500 hover:text-brand-600 disabled:opacity-50 disabled:hover:text-slate-500 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                
                <button 
                  onClick={() => removeItem(item.product.id)}
                  className="text-sm text-red-500 hover:text-red-600 flex items-center gap-1 transition-colors group"
                >
                  <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span className="hidden sm:inline">Remove</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary Summary */}
        <div className="lg:w-1/3">
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 sticky top-24">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Order Summary</h2>
            
            <div className="space-y-4 text-sm mb-6">
              <div className="flex justify-between text-slate-600 dark:text-zinc-400">
                <span>Subtotal ({itemCount} items)</span>
                <span className="font-medium text-slate-900 dark:text-white">Rs. {totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-zinc-400">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-zinc-800 mb-6 flex justify-between items-center">
              <span className="font-bold text-slate-900 dark:text-white">Total</span>
              <span className="text-xl font-bold text-brand-600">Rs. {totalPrice.toLocaleString()}</span>
            </div>

            <button 
              onClick={() => setIsChatModalOpen(true)}
              className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-colors shadow-md mb-3 flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              Chat to Buy
            </button>

            <button 
              onClick={() => router.push("/checkout")}
              className="w-full py-3 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 rounded-xl font-medium transition-colors"
            >
              Direct Checkout
            </button>
          </div>
        </div>
      </div>

      {/* Chat Modal */}
      {isChatModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl max-w-2xl w-full max-h-[80vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-zinc-800">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Contact Sellers</h2>
              <button onClick={() => setIsChatModalOpen(false)} className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex flex-1 overflow-hidden">
              {/* Stores List */}
              <div className="w-1/3 border-r border-slate-200 dark:border-zinc-800 overflow-y-auto bg-slate-50 dark:bg-zinc-950 p-2">
                {Object.entries(
                  items.reduce((acc, item) => {
                    const storeId = item.product.store?.id || "unknown";
                    if (!acc[storeId]) {
                      acc[storeId] = { name: item.product.store?.name || "Unknown Store", items: [] };
                    }
                    acc[storeId].items.push(item);
                    return acc;
                  }, {} as Record<string, {name: string, items: typeof items}>)
                ).map(([storeId, storeData]) => (
                  <button
                    key={storeId}
                    onClick={() => {
                      setSelectedStoreId(storeId);
                      fetchChatHistory(storeId);
                    }}
                    className={`w-full text-left p-3 rounded-xl mb-2 transition-colors ${selectedStoreId === storeId ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' : 'hover:bg-slate-200 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300'}`}
                  >
                    <div className="font-semibold text-sm">{storeData.name}</div>
                    <div className="text-xs opacity-70">{storeData.items.length} items</div>
                  </button>
                ))}
              </div>

              {/* Chat Area */}
              <div className="w-2/3 flex flex-col bg-white dark:bg-zinc-900">
                {selectedStoreId ? (
                  <>
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      {chatHistory.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${msg.sender === 'user' ? 'bg-green-600 text-white' : 'bg-slate-100 dark:bg-zinc-800 text-slate-800 dark:text-zinc-200'}`}>
                            {msg.text}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-3 border-t border-slate-200 dark:border-zinc-800 flex gap-2">
                      <input
                        type="text"
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && chatMessage.trim()) {
                            handleSendMessage();
                          }
                        }}
                        placeholder="Type a message..."
                        className="flex-1 bg-slate-100 dark:bg-zinc-800 border-none rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                      <button 
                        onClick={() => {
                          if (chatMessage.trim()) {
                            handleSendMessage();
                          }
                        }}
                        className="p-2 bg-green-600 text-white rounded-full hover:bg-green-700"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-slate-400 dark:text-zinc-500 text-sm">
                    Select a seller to start chatting
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
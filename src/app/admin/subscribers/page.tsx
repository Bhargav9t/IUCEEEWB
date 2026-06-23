"use client";

import { useEffect, useState } from "react";
import { Mail, Loader2 } from "lucide-react";

interface Subscriber {
  id: number;
  email: string;
  is_active: boolean;
  timestamp: string;
}

export default function SubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubscribers = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        const res = await fetch(`${apiUrl}/subscribers`);
        
        if (!res.ok) {
          throw new Error("Failed to fetch subscribers");
        }
        
        const data = await res.json();
        setSubscribers(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchSubscribers();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 to-black p-8 pt-24">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Subscribers</h1>
          <p className="text-zinc-400">View all registered newsletter subscribers</p>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="animate-spin text-emerald-500" size={32} />
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-400">
            <p>Error: {error}</p>
          </div>
        ) : subscribers.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-lg p-8 text-center">
            <Mail size={32} className="mx-auto mb-3 text-zinc-500" />
            <p className="text-zinc-400">No subscribers yet</p>
          </div>
        ) : (
          <div className="bg-white/[0.03] border border-white/10 rounded-lg overflow-hidden">
            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 p-6 border-b border-white/10">
              <div>
                <p className="text-zinc-400 text-sm">Total Subscribers</p>
                <p className="text-3xl font-bold text-white">{subscribers.length}</p>
              </div>
              <div>
                <p className="text-zinc-400 text-sm">Active</p>
                <p className="text-3xl font-bold text-emerald-500">
                  {subscribers.filter((s) => s.is_active).length}
                </p>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5 border-b border-white/10">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-zinc-300">Email</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-zinc-300">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-zinc-300">Subscribed</th>
                  </tr>
                </thead>
                <tbody>
                  {subscribers.map((sub) => (
                    <tr key={sub.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 text-sm text-white">{sub.email}</td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                            sub.is_active
                              ? "bg-emerald-500/20 text-emerald-400"
                              : "bg-zinc-500/20 text-zinc-400"
                          }`}
                        >
                          {sub.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-zinc-400">
                        {new Date(sub.timestamp).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

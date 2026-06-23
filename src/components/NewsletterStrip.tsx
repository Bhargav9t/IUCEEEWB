"use client";

import { useState } from "react";
import { Send, CheckCircle2, Loader2 } from "lucide-react";

export default function NewsletterStrip() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await fetch(`${apiUrl}/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setStatus("success");
        setMessage("You're in! We'll keep you posted.");
        setEmail("");
      } else {
        const data = await res.json();
        setStatus("error");
        setMessage(data.detail || "Something went wrong. Try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Could not connect. Please try again later.");
    }
  };

  return (
    <div className="mb-12 flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-6 rounded-2xl bg-white dark:bg-white/[0.03] border border-zinc-200 dark:border-white/10">
      {/* Left side copy */}
      <div className="shrink-0">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-400 mb-1">
          Stay in the loop
        </p>
        <h4 className="text-sm font-bold text-zinc-900 dark:text-white">
          Subscribe to our Monthly Newsletter
        </h4>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
          Get our upcoming events & project updates delivered to your inbox.
        </p>
      </div>

      {/* Right side form */}
      <div className="w-full sm:max-w-sm">
        {status === "success" ? (
          <div className="flex items-center gap-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 size={16} />
            {message}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex items-stretch gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="flex-1 min-w-0 text-sm px-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold transition-colors duration-200 disabled:opacity-100 disabled:bg-emerald-400 disabled:brightness-110 shrink-0"
            >
              {status === "loading" ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <Send size={14} />
              )}
              Subscribe
            </button>
          </form>
        )}
        {status === "error" && (
          <p className="mt-1.5 text-xs text-red-500">{message}</p>
        )}
      </div>
    </div>
  );
}

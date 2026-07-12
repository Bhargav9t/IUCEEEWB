"use client";

import { useEffect, useState } from "react";
import { 
  Calendar, Mail, Send, Plus, Trash2, Edit2, 
  Sparkles, CheckCircle2, AlertTriangle, Key, 
  History, ArrowRight, Upload, Info, RefreshCw, LogIn
} from "lucide-react";

// Lucide Icon Options for Timeline Nodes
const ICON_OPTIONS = [
  "Flag", "Zap", "Factory", "Code", "BookOpen", "Rocket", "FileText", 
  "Lightbulb", "Upload", "Brain", "School", "Leaf", "Globe", 
  "Wrench", "Trophy", "Sprout", "Medal", "Cpu", "Droplets", 
  "PartyPopper", "Hourglass", "Users"
];

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  image_url?: string;
  location?: string;
  registration_url?: string;
}

interface JourneyNode {
  node_id: string;
  date: string;
  title: string;
  desc: string;
  icon: string;
  image?: string;
  link?: string;
  sort_order: number;
}

export default function AdminDashboard() {
  const [adminKey, setAdminKey] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [activeTab, setActiveTab] = useState<"events" | "journey" | "newsletter">("events");
  
  // Status states
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Data states
  const [events, setEvents] = useState<Event[]>([]);
  const [journeyNodes, setJourneyNodes] = useState<JourneyNode[]>([]);
  const [subscribersCount, setSubscribersCount] = useState({ total: 0, active: 0 });
  const [subscribers, setSubscribers] = useState<any[]>([]);

  // Event Form state
  const [editingEventId, setEditingEventId] = useState<number | null>(null);
  const [eventForm, setEventForm] = useState({
    title: "",
    description: "",
    date: "",
    image_url: "",
    location: "",
    registration_url: ""
  });

  // Journey Node Form state
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);
  const [journeyForm, setJourneyForm] = useState({
    node_id: "",
    date: "",
    title: "",
    desc: "",
    icon: "Flag",
    image: "",
    link: "",
    sort_order: 0
  });

  // Newsletter Form state
  const [newsletterForm, setNewsletterForm] = useState({
    subject: "",
    body: ""
  });
  const [newsletterFile, setNewsletterFile] = useState<File | null>(null);

  // Load admin key from localStorage on mount
  useEffect(() => {
    const savedKey = localStorage.getItem("ewb_admin_secret");
    if (savedKey) {
      setAdminKey(savedKey);
      setIsAuthorized(true);
    }
  }, []);

  // Fetch initial data when authorized
  useEffect(() => {
    if (isAuthorized) {
      fetchEvents();
      fetchJourneyNodes();
      fetchSubscribers();
    }
  }, [isAuthorized]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminKey) {
      localStorage.setItem("ewb_admin_secret", adminKey);
      setIsAuthorized(true);
      setErrorMsg("");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("ewb_admin_secret");
    setIsAuthorized(false);
    setAdminKey("");
  };

  const getHeaders = () => {
    return {
      "X-Admin-Key": adminKey,
      "Content-Type": "application/json"
    };
  };

  // ── API FETCHES ──────────────────────────────────────────────────
  const fetchEvents = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await fetch(`${apiUrl}/admin/events`, {
        headers: { "X-Admin-Key": adminKey }
      });
      if (res.ok) {
        const data = await res.json();
        setEvents(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchJourneyNodes = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await fetch(`${apiUrl}/journey-nodes`);
      if (res.ok) {
        const data = await res.json();
        setJourneyNodes(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSubscribers = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await fetch(`${apiUrl}/subscribers`);
      if (res.ok) {
        const data = await res.json();
        setSubscribers(data);
        setSubscribersCount({
          total: data.length,
          active: data.filter((s: any) => s.is_active).length
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ── EVENT CRUD ACTIONS ───────────────────────────────────────────
  const saveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const url = editingEventId 
        ? `${apiUrl}/admin/events/${editingEventId}` 
        : `${apiUrl}/admin/events`;
      const method = editingEventId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: getHeaders(),
        body: JSON.stringify({
          ...eventForm,
          // Format ISO date
          date: new Date(eventForm.date).toISOString()
        })
      });

      if (res.ok) {
        setSuccessMsg(editingEventId ? "Event updated successfully!" : "Event created successfully!");
        setEventForm({
          title: "",
          description: "",
          date: "",
          image_url: "",
          location: "",
          registration_url: ""
        });
        setEditingEventId(null);
        fetchEvents();
      } else {
        const data = await res.json();
        setErrorMsg(data.detail || "Failed to save event");
      }
    } catch (err) {
      setErrorMsg("Connection error. Could not save event.");
    } finally {
      setActionLoading(false);
    }
  };

  const startEditEvent = (evt: Event) => {
    setEditingEventId(evt.id);
    // Format date string for local datetime picker: "YYYY-MM-DDTHH:MM"
    const localDate = new Date(evt.date);
    const tzOffset = localDate.getTimezoneOffset() * 60000; // in ms
    const localISOTime = (new Date(localDate.getTime() - tzOffset)).toISOString().slice(0, 16);
    
    setEventForm({
      title: evt.title,
      description: evt.description,
      date: localISOTime,
      image_url: evt.image_url || "",
      location: evt.location || "",
      registration_url: evt.registration_url || ""
    });
  };

  const deleteEvent = async (id: number) => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    setActionLoading(true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await fetch(`${apiUrl}/admin/events/${id}`, {
        method: "DELETE",
        headers: { "X-Admin-Key": adminKey }
      });
      if (res.ok) {
        setSuccessMsg("Event deleted successfully.");
        fetchEvents();
      } else {
        setErrorMsg("Failed to delete event.");
      }
    } catch (err) {
      setErrorMsg("Connection error.");
    } finally {
      setActionLoading(false);
    }
  };

  // ── JOURNEY NODE CRUD ACTIONS ─────────────────────────────────────
  const saveJourneyNode = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const url = editingNodeId 
        ? `${apiUrl}/admin/journey-nodes/${editingNodeId}` 
        : `${apiUrl}/admin/journey-nodes`;
      const method = editingNodeId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: getHeaders(),
        body: JSON.stringify(journeyForm)
      });

      if (res.ok) {
        setSuccessMsg(editingNodeId ? "Journey milestone updated!" : "Journey milestone created!");
        setJourneyForm({
          node_id: "",
          date: "",
          title: "",
          desc: "",
          icon: "Flag",
          image: "",
          link: "",
          sort_order: 0
        });
        setEditingNodeId(null);
        fetchJourneyNodes();
      } else {
        const data = await res.json();
        setErrorMsg(data.detail || "Failed to save journey milestone");
      }
    } catch (err) {
      setErrorMsg("Connection error. Could not save journey milestone.");
    } finally {
      setActionLoading(false);
    }
  };

  const startEditJourneyNode = (node: JourneyNode) => {
    setEditingNodeId(node.node_id);
    setJourneyForm({
      node_id: node.node_id,
      date: node.date,
      title: node.title,
      desc: node.desc,
      icon: node.icon,
      image: node.image || "",
      link: node.link || "",
      sort_order: node.sort_order
    });
  };

  const deleteJourneyNode = async (nodeId: string) => {
    if (!confirm(`Are you sure you want to delete milestone: ${nodeId}?`)) return;
    setActionLoading(true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await fetch(`${apiUrl}/admin/journey-nodes/${nodeId}`, {
        method: "DELETE",
        headers: { "X-Admin-Key": adminKey }
      });
      if (res.ok) {
        setSuccessMsg("Journey milestone deleted.");
        fetchJourneyNodes();
      } else {
        setErrorMsg("Failed to delete journey milestone.");
      }
    } catch (err) {
      setErrorMsg("Connection error.");
    } finally {
      setActionLoading(false);
    }
  };

  // Auto-import information from the latest event
  const importFromLatestEvent = () => {
    if (events.length === 0) {
      setErrorMsg("No events found to import from. Please add an event first.");
      return;
    }
    
    // Sort events by date to find the absolute latest event
    const sortedEvents = [...events].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const latest = sortedEvents[0];
    
    // Format date label (e.g. "APR 2026")
    const dateLabel = new Date(latest.date).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric"
    }).toUpperCase();

    // Create a node_id slug
    const generatedSlug = latest.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    setJourneyForm({
      node_id: generatedSlug,
      date: dateLabel,
      title: latest.title.toUpperCase(),
      desc: latest.description,
      icon: "PartyPopper", // Default logo for imported events
      image: latest.image_url || "",
      link: `/events`, // Public events route redirect
      sort_order: journeyNodes.length > 0 ? Math.max(...journeyNodes.map(n => n.sort_order)) + 1 : 1
    });

    setSuccessMsg(`Imported data from event: "${latest.title}"`);
  };

  // ── NEWSLETTER MAILER ─────────────────────────────────────────────
  const sendNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const formData = new FormData();
      formData.append("subject", newsletterForm.subject);
      formData.append("body", newsletterForm.body);
      if (newsletterFile) {
        formData.append("attachment", newsletterFile);
      }

      const res = await fetch(`${apiUrl}/admin/send-newsletter`, {
        method: "POST",
        headers: {
          "X-Admin-Key": adminKey
          // Let browser set content-type with boundary automatically for multipart/form-data
        },
        body: formData
      });

      if (res.ok) {
        const data = await res.json();
        setSuccessMsg(data.message || "Newsletter successfully queued!");
        setNewsletterForm({ subject: "", body: "" });
        setNewsletterFile(null);
        // Clear file input manually
        const fileInput = document.getElementById("newsletter-attachment") as HTMLInputElement;
        if (fileInput) fileInput.value = "";
      } else {
        const data = await res.json();
        setErrorMsg(data.detail || "Failed to dispatch newsletter.");
      }
    } catch (err) {
      setErrorMsg("Connection error while mailing.");
    } finally {
      setActionLoading(false);
    }
  };


  // ── UNAUTHORIZED LOGIN SCREEN ─────────────────────────────────────
  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-[#050505] p-6 text-zinc-900 dark:text-zinc-50">
        <div className="relative w-full max-w-md bg-white/40 dark:bg-white/[0.02] backdrop-blur-xl border border-zinc-200 dark:border-white/10 p-8 rounded-3xl shadow-xl flex flex-col items-center">
          <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 mb-6 border border-emerald-500/20">
            <Key size={22} className="animate-pulse" />
          </div>
          
          <h2 className="text-2xl font-black mb-1 uppercase tracking-tight text-center">Admin Access</h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm text-center mb-6">Enter Secret Admin Key to manage EWB HITAM Portal</p>
          
          <form onSubmit={handleLogin} className="w-full flex flex-col gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5 pl-1">Secret Key</label>
              <input
                type="password"
                placeholder="••••••••"
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                required
                className="w-full text-sm px-4 py-3 rounded-xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all font-mono"
              />
            </div>
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold transition-colors shadow-lg cursor-pointer"
            >
              <LogIn size={16} />
              Unlock Portal
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ── MAIN DASHBOARD VIEW ────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#050505] text-zinc-900 dark:text-zinc-50 pt-28 pb-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        
        {/* Header Block */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-white/[0.02] border border-zinc-200 dark:border-white/10 shadow-sm">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tight">EWB Chapter Dashboard</h1>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">Manage events, journey milestones, and newsletter subscribers dynamically.</p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right hidden md:block">
              <p className="text-[10px] font-bold uppercase text-emerald-500">Authorized Session</p>
              <p className="text-xs text-zinc-400 font-mono">key: dev_secret</p>
            </div>
            <button 
              onClick={handleLogout}
              className="px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 text-xs font-bold uppercase tracking-wider transition-all border border-red-500/20"
            >
              Lock Panel
            </button>
          </div>
        </div>

        {/* Status Messages */}
        {successMsg && (
          <div className="flex items-center gap-2.5 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm font-semibold">
            <CheckCircle2 size={16} />
            {successMsg}
          </div>
        )}
        {errorMsg && (
          <div className="flex items-center gap-2.5 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm font-semibold">
            <AlertTriangle size={16} />
            {errorMsg}
          </div>
        )}

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 bg-white dark:bg-white/[0.02] border border-zinc-200 dark:border-white/10 rounded-2xl">
            <p className="text-zinc-400 text-xs font-bold uppercase tracking-wider">Subscribers (Active / Total)</p>
            <p className="text-3xl font-black mt-2 text-emerald-500">
              {subscribersCount.active} <span className="text-lg text-zinc-400 font-normal">/ {subscribersCount.total}</span>
            </p>
          </div>
          <div className="p-6 bg-white dark:bg-white/[0.02] border border-zinc-200 dark:border-white/10 rounded-2xl">
            <p className="text-zinc-400 text-xs font-bold uppercase tracking-wider">Timeline Milestones</p>
            <p className="text-3xl font-black mt-2 text-emerald-500">{journeyNodes.length}</p>
          </div>
          <div className="p-6 bg-white dark:bg-white/[0.02] border border-zinc-200 dark:border-white/10 rounded-2xl">
            <p className="text-zinc-400 text-xs font-bold uppercase tracking-wider">Total Managed Events</p>
            <p className="text-3xl font-black mt-2 text-emerald-500">{events.length}</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 p-1.5 rounded-2xl bg-zinc-200/50 dark:bg-white/5 border border-zinc-200 dark:border-white/5 self-start">
          <button
            onClick={() => setActiveTab("events")}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === "events" 
                ? "bg-emerald-600 text-white shadow-md" 
                : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            Upcoming Events
          </button>
          <button
            onClick={() => setActiveTab("journey")}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === "journey" 
                ? "bg-emerald-600 text-white shadow-md" 
                : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            Our Journey Milestones
          </button>
          <button
            onClick={() => setActiveTab("newsletter")}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === "newsletter" 
                ? "bg-emerald-600 text-white shadow-md" 
                : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            Newsletter Mailer
          </button>
        </div>

        {/* ── EVENTS MANAGEMENT TAB ──────────────────────────────────── */}
        {activeTab === "events" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-1 p-6 rounded-3xl bg-white dark:bg-white/[0.02] border border-zinc-200 dark:border-white/10 shadow-sm self-start">
              <h2 className="text-xl font-bold mb-4 uppercase tracking-tight flex items-center gap-2">
                <Calendar size={18} className="text-emerald-500" />
                {editingEventId ? "Edit Event" : "Create Event"}
              </h2>
              
              <form onSubmit={saveEvent} className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">Event Title *</label>
                  <input
                    type="text"
                    required
                    value={eventForm.title}
                    onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                    className="w-full text-sm px-3.5 py-2.5 rounded-xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">Description *</label>
                  <textarea
                    required
                    rows={4}
                    value={eventForm.description}
                    onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                    className="w-full text-sm px-3.5 py-2.5 rounded-xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">Event Date & Time *</label>
                  <input
                    type="datetime-local"
                    required
                    value={eventForm.date}
                    onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                    className="w-full text-sm px-3.5 py-2.5 rounded-xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">Poster Image URL (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. /images/events/my-poster.jpg"
                    value={eventForm.image_url}
                    onChange={(e) => setEventForm({ ...eventForm, image_url: e.target.value })}
                    className="w-full text-sm px-3.5 py-2.5 rounded-xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">Google Form Registration Link (Optional)</label>
                  <input
                    type="url"
                    placeholder="e.g. https://forms.gle/..."
                    value={eventForm.registration_url}
                    onChange={(e) => setEventForm({ ...eventForm, registration_url: e.target.value })}
                    className="w-full text-sm px-3.5 py-2.5 rounded-xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">Location / Platform (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Seminar Hall / Zoom"
                    value={eventForm.location}
                    onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                    className="w-full text-sm px-3.5 py-2.5 rounded-xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  />
                </div>

                <div className="flex gap-2 mt-2">
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-400 text-white font-bold text-sm transition-colors text-center cursor-pointer"
                  >
                    {actionLoading ? "Saving..." : editingEventId ? "Save Changes" : "Create Event"}
                  </button>
                  {editingEventId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingEventId(null);
                        setEventForm({ title: "", description: "", date: "", image_url: "", location: "", registration_url: "" });
                      }}
                      className="px-4 py-3 rounded-xl bg-zinc-200 dark:bg-white/10 text-zinc-700 dark:text-zinc-300 font-semibold text-sm transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* List */}
            <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-white/[0.02] border border-zinc-200 dark:border-white/10 shadow-sm flex flex-col gap-4">
              <h2 className="text-xl font-bold uppercase tracking-tight">Active Events list</h2>
              
              {events.length === 0 ? (
                <div className="text-center py-20 text-zinc-500 border border-dashed border-zinc-200 dark:border-white/10 rounded-2xl">
                  No events added yet. Add one in the creation panel.
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {events.map((evt) => (
                    <div 
                      key={evt.id}
                      className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-zinc-100/50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 hover:border-emerald-500/30 transition-all duration-300"
                    >
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1.5">
                          <h3 className="font-bold text-base text-zinc-900 dark:text-white leading-tight">{evt.title}</h3>
                          <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            new Date(evt.date).getTime() >= Date.now()
                              ? "bg-emerald-500/20 text-emerald-400"
                              : "bg-zinc-500/20 text-zinc-400"
                          }`}>
                            {new Date(evt.date).getTime() >= Date.now() ? "Upcoming" : "Past"}
                          </span>
                        </div>
                        <p className="text-zinc-500 dark:text-zinc-400 text-xs leading-relaxed line-clamp-2 max-w-xl mb-2">{evt.description}</p>
                        
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-zinc-400 font-mono">
                          <span>📅 {new Date(evt.date).toLocaleString()}</span>
                          {evt.location && <span>📍 {evt.location}</span>}
                          {evt.registration_url && (
                            <span className="text-emerald-500 max-w-[200px] truncate">🔗 Registration Active</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                        <button
                          onClick={() => startEditEvent(evt)}
                          className="p-2.5 rounded-xl bg-zinc-200 hover:bg-zinc-300 dark:bg-white/10 dark:hover:bg-white/20 text-zinc-700 dark:text-zinc-300 transition-colors"
                          title="Edit Event"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => deleteEvent(evt.id)}
                          className="p-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-colors"
                          title="Delete Event"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── TIMELINE MANAGEMENT TAB ────────────────────────────────── */}
        {activeTab === "journey" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-1 p-6 rounded-3xl bg-white dark:bg-white/[0.02] border border-zinc-200 dark:border-white/10 shadow-sm self-start flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold uppercase tracking-tight flex items-center gap-2">
                  <History size={18} className="text-emerald-500" />
                  {editingNodeId ? "Edit Milestone" : "Add Milestone"}
                </h2>
                {!editingNodeId && events.length > 0 && (
                  <button
                    type="button"
                    onClick={importFromLatestEvent}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-500 text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer"
                    title="Import text, image & date from the latest event"
                  >
                    <RefreshCw size={10} className="animate-spin" style={{ animationDuration: '4s' }} />
                    Import Latest
                  </button>
                )}
              </div>
              
              <form onSubmit={saveJourneyNode} className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">Unique Node ID *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. hackathon-2026 or 01"
                    disabled={editingNodeId !== null}
                    value={journeyForm.node_id}
                    onChange={(e) => setJourneyForm({ ...journeyForm, node_id: e.target.value })}
                    className="w-full text-sm px-3.5 py-2.5 rounded-xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40 disabled:opacity-50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">Date Label *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. MAY 2026 or APR 15, 2026"
                    value={journeyForm.date}
                    onChange={(e) => setJourneyForm({ ...journeyForm, date: e.target.value })}
                    className="w-full text-sm px-3.5 py-2.5 rounded-xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">Name / Title *</label>
                  <input
                    type="text"
                    required
                    value={journeyForm.title}
                    onChange={(e) => setJourneyForm({ ...journeyForm, title: e.target.value })}
                    className="w-full text-sm px-3.5 py-2.5 rounded-xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">Description *</label>
                  <textarea
                    required
                    rows={4}
                    value={journeyForm.desc}
                    onChange={(e) => setJourneyForm({ ...journeyForm, desc: e.target.value })}
                    className="w-full text-sm px-3.5 py-2.5 rounded-xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">Icon/Logo *</label>
                    <select
                      value={journeyForm.icon}
                      onChange={(e) => setJourneyForm({ ...journeyForm, icon: e.target.value })}
                      className="w-full text-sm px-3.5 py-2.5 rounded-xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                    >
                      {ICON_OPTIONS.map((ico) => (
                        <option key={ico} value={ico} className="dark:bg-zinc-950">{ico}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">Sort Order *</label>
                    <input
                      type="number"
                      required
                      value={journeyForm.sort_order}
                      onChange={(e) => setJourneyForm({ ...journeyForm, sort_order: parseInt(e.target.value) || 0 })}
                      className="w-full text-sm px-3.5 py-2.5 rounded-xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">Milestone Poster/Image URL (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. /images/events/hologram.jpg"
                    value={journeyForm.image}
                    onChange={(e) => setJourneyForm({ ...journeyForm, image: e.target.value })}
                    className="w-full text-sm px-3.5 py-2.5 rounded-xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">External Link/Redirect Path (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. /ignite or https://example.com"
                    value={journeyForm.link}
                    onChange={(e) => setJourneyForm({ ...journeyForm, link: e.target.value })}
                    className="w-full text-sm px-3.5 py-2.5 rounded-xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  />
                </div>

                <div className="flex gap-2 mt-2">
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-400 text-white font-bold text-sm transition-colors text-center cursor-pointer"
                  >
                    {actionLoading ? "Saving..." : editingNodeId ? "Save Milestone" : "Add Milestone"}
                  </button>
                  {editingNodeId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingNodeId(null);
                        setJourneyForm({ node_id: "", date: "", title: "", desc: "", icon: "Flag", image: "", link: "", sort_order: 0 });
                      }}
                      className="px-4 py-3 rounded-xl bg-zinc-200 dark:bg-white/10 text-zinc-700 dark:text-zinc-300 font-semibold text-sm transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* List */}
            <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-white/[0.02] border border-zinc-200 dark:border-white/10 shadow-sm flex flex-col gap-4">
              <h2 className="text-xl font-bold uppercase tracking-tight">Timeline Milestones</h2>
              
              {journeyNodes.length === 0 ? (
                <div className="text-center py-20 text-zinc-500 border border-dashed border-zinc-200 dark:border-white/10 rounded-2xl">
                  No timeline milestones added yet. Add one in the dashboard.
                </div>
              ) : (
                <div className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto pr-1">
                  {journeyNodes.map((node) => (
                    <div 
                      key={node.node_id}
                      className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-zinc-100/50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 hover:border-emerald-500/30 transition-all duration-300"
                    >
                      <div className="flex-grow min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="font-mono text-xs px-2 py-0.5 bg-emerald-500/10 text-emerald-500 rounded-lg">{node.date}</span>
                          <h3 className="font-bold text-sm text-zinc-900 dark:text-white truncate">{node.title}</h3>
                        </div>
                        <p className="text-zinc-500 dark:text-zinc-400 text-xs leading-relaxed truncate max-w-xl">{node.desc}</p>
                        <div className="flex gap-4 text-[10px] text-zinc-400 font-mono mt-1">
                          <span>📦 ID: {node.node_id}</span>
                          <span>🎨 Icon: {node.icon}</span>
                          <span>🔢 Sort Order: {node.sort_order}</span>
                          {node.image && <span className="text-emerald-500">🖼️ Image Attached</span>}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => startEditJourneyNode(node)}
                          className="p-2 rounded-lg bg-zinc-200 hover:bg-zinc-300 dark:bg-white/10 dark:hover:bg-white/20 text-zinc-700 dark:text-zinc-300 transition-colors"
                          title="Edit Milestone"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={() => deleteJourneyNode(node.node_id)}
                          className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-colors"
                          title="Delete Milestone"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── NEWSLETTER MAILER TAB ──────────────────────────────────── */}
        {activeTab === "newsletter" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2 p-6 md:p-8 rounded-3xl bg-white dark:bg-white/[0.02] border border-zinc-200 dark:border-white/10 shadow-sm flex flex-col gap-6">
              <div>
                <h2 className="text-2xl font-bold uppercase tracking-tight flex items-center gap-2.5">
                  <Mail size={22} className="text-emerald-500 animate-bounce" style={{ animationDuration: '3s' }} />
                  Send Newsletter
                </h2>
                <p className="text-zinc-400 text-xs mt-1">Compose and send email updates to all active newsletter subscribers in bulk.</p>
              </div>
              
              <form onSubmit={sendNewsletter} className="flex flex-col gap-5">
                <div>
                  <label className="block text-xs font-bold uppercase text-zinc-400 mb-1.5 pl-1">Email Subject *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Exciting New Projects & Updates at EWB HITAM"
                    value={newsletterForm.subject}
                    onChange={(e) => setNewsletterForm({ ...newsletterForm, subject: e.target.value })}
                    className="w-full text-sm px-4 py-3 rounded-xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-zinc-400 mb-1.5 pl-1">Message Body *</label>
                  <textarea
                    required
                    rows={8}
                    placeholder="Type your newsletter message here. Paragraph lines will render correctly..."
                    value={newsletterForm.body}
                    onChange={(e) => setNewsletterForm({ ...newsletterForm, body: e.target.value })}
                    className="w-full text-sm px-4 py-3 rounded-xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40 font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-zinc-400 mb-1.5 pl-1">Attach Document (Optional)</label>
                  <div className="relative border border-dashed border-zinc-300 dark:border-white/10 rounded-2xl p-6 bg-zinc-100/40 dark:bg-white/[0.01] hover:bg-zinc-100/70 dark:hover:bg-white/[0.02] transition-all flex flex-col items-center justify-center text-center">
                    <input
                      id="newsletter-attachment"
                      type="file"
                      onChange={(e) => setNewsletterFile(e.target.files?.[0] || null)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Upload size={24} className="text-zinc-400 mb-2" />
                    <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-300">
                      {newsletterFile ? newsletterFile.name : "Click or Drag & Drop file here"}
                    </p>
                    <p className="text-[10px] text-zinc-400 mt-1">Supports PDF, JPG, PNG, DOCX (Max size: 10MB)</p>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={actionLoading}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-400 text-white font-bold text-sm transition-colors shadow-lg cursor-pointer"
                >
                  <Send size={15} />
                  {actionLoading ? "Sending Bulk Mails..." : "Dispatch Newsletter"}
                </button>
              </form>
            </div>

            {/* Registered Emails Side Panel */}
            <div className="lg:col-span-1 p-6 rounded-3xl bg-white dark:bg-white/[0.02] border border-zinc-200 dark:border-white/10 shadow-sm flex flex-col gap-4 self-start">
              <div>
                <h2 className="text-lg font-bold uppercase tracking-tight">Recipients ({subscribersCount.total})</h2>
                <p className="text-zinc-400 text-xs mt-0.5">Verified subscriber emails that will receive updates.</p>
              </div>

              {subscribers.length === 0 ? (
                <div className="text-center py-12 text-zinc-500 border border-dashed border-zinc-200 dark:border-white/10 rounded-2xl text-xs">
                  No subscribers found.
                </div>
              ) : (
                <div className="flex flex-col gap-2 max-h-[50vh] overflow-y-auto pr-1">
                  {subscribers.map((sub: any) => (
                    <div 
                      key={sub.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-zinc-100/50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-xs"
                    >
                      <span className="font-mono text-zinc-800 dark:text-zinc-200 truncate pr-2" title={sub.email}>
                        {sub.email}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider shrink-0 ${
                        sub.is_active 
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "bg-zinc-500/20 text-zinc-400"
                      }`}>
                        {sub.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

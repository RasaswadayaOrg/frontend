"use client";

import { useState, useEffect, useCallback } from "react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isToday,
  getDay,
} from "date-fns";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Users,
  CalendarDays,
  Plus,
  Pencil,
  Trash2,
  X,
  Loader2,
  Calendar,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

const EVENT_TYPES = [
  { value: "cultural_show", label: "Cultural Show", color: "bg-brand-600" },
  { value: "workshop", label: "Workshop", color: "bg-amber-500" },
  { value: "meeting", label: "Meeting", color: "bg-blue-500" },
  { value: "rehearsal", label: "Rehearsal", color: "bg-emerald-500" },
  { value: "site_visit", label: "Site Visit", color: "bg-orange-500" },
  { value: "other", label: "Other", color: "bg-neutral-400" },
];

interface OrganizerEvent {
  id: string;
  title: string;
  description?: string;
  eventDate: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  type: string;
  artistCount?: number;
}

interface EventFormData {
  title: string;
  description: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  location: string;
  type: string;
  artistCount: string;
}

const defaultForm: EventFormData = {
  title: "",
  description: "",
  eventDate: "",
  startTime: "",
  endTime: "",
  location: "",
  type: "cultural_show",
  artistCount: "",
};

export default function OrganizerSchedulePage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [events, setEvents] = useState<OrganizerEvent[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<OrganizerEvent[]>([]);
  const [loading, setLoading] = useState(false);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<OrganizerEvent | null>(null);
  const [formData, setFormData] = useState<EventFormData>(defaultForm);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const getAuthHeader = (): Record<string, string> => {
    const token = localStorage.getItem("rasas_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // Fetch monthly events
  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const month = currentDate.getMonth() + 1;
      const year = currentDate.getFullYear();
      const res = await fetch(
        `${API_URL}/events/calendar?month=${month}&year=${year}`,
        { headers: { ...getAuthHeader() } }
      );
      if (res.ok) {
        const data = await res.json();
        setEvents(data);
      }
    } catch (e) {
      console.error("Failed to fetch calendar events", e);
    } finally {
      setLoading(false);
    }
  }, [currentDate]);

  // Fetch upcoming events for sidebar
  const fetchUpcoming = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/events/calendar/upcoming`, {
        headers: { ...getAuthHeader() },
      });
      if (res.ok) {
        const data = await res.json();
        setUpcomingEvents(data);
      }
    } catch (e) {
      console.error("Failed to fetch upcoming events", e);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  useEffect(() => {
    fetchUpcoming();
  }, [fetchUpcoming]);

  const days = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate),
  });

  const getEventsForDay = (date: Date) =>
    events.filter((e) => isSameDay(new Date(e.eventDate), date));

  const getEventTypeColor = (type: string) =>
    EVENT_TYPES.find((t) => t.value === type)?.color || "bg-neutral-400";

  const getEventTypeLabel = (type: string) =>
    EVENT_TYPES.find((t) => t.value === type)?.label || type;

  // --- CRUD Handlers ---
  const openCreateModal = (date?: Date) => {
    const targetDate = date || selectedDate || new Date();
    setEditingEvent(null);
    setFormData({
      ...defaultForm,
      eventDate: format(targetDate, "yyyy-MM-dd"),
    });
    setShowModal(true);
  };

  const openEditModal = (event: OrganizerEvent) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description || "",
      eventDate: format(new Date(event.eventDate), "yyyy-MM-dd"),
      startTime: event.startTime || "",
      endTime: event.endTime || "",
      location: event.location || "",
      type: event.type,
      artistCount: event.artistCount?.toString() || "",
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.eventDate) return;
    setSaving(true);

    try {
      const url = editingEvent
        ? `${API_URL}/events/calendar/${editingEvent.id}`
        : `${API_URL}/events/calendar`;

      const res = await fetch(url, {
        method: editingEvent ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save event");
      }

      setShowModal(false);
      setEditingEvent(null);
      setFormData(defaultForm);
      await fetchEvents();
      await fetchUpcoming();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (eventId: string) => {
    if (!confirm("Delete this event?")) return;
    setDeleting(eventId);

    try {
      const res = await fetch(`${API_URL}/events/calendar/${eventId}`, {
        method: "DELETE",
        headers: { ...getAuthHeader() },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete event");
      }

      await fetchEvents();
      await fetchUpcoming();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setDeleting(null);
    }
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">Schedule</h1>
            <p className="text-sm text-neutral-500 mt-1">Your event timeline at a glance.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => openCreateModal()}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Event
            </button>
            <div className="flex items-center gap-2 bg-white dark:bg-zinc-900 border border-neutral-200/80 dark:border-neutral-800/80 rounded-xl p-1 shadow-sm">
              <button
                onClick={() => setCurrentDate(subMonths(currentDate, 1))}
                className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-semibold text-sm min-w-[130px] text-center">
                {format(currentDate, "MMMM yyyy")}
              </span>
              <button
                onClick={() => setCurrentDate(addMonths(currentDate, 1))}
                className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-3 bg-white dark:bg-zinc-900 rounded-2xl border border-neutral-200/60 dark:border-neutral-800/60 overflow-hidden">
            {/* Day headers */}
            <div className="grid grid-cols-7 border-b border-neutral-100 dark:border-neutral-800/60">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="py-3 text-center text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 relative">
              {loading && (
                <div className="absolute inset-0 bg-white/60 dark:bg-zinc-900/60 z-10 flex items-center justify-center">
                  <Loader2 className="w-5 h-5 animate-spin text-brand-600" />
                </div>
              )}

              {/* Padding for first day offset */}
              {Array.from({ length: getDay(startOfMonth(currentDate)) }).map((_, i) => (
                <div key={`pad-${i}`} className="aspect-square border-r border-b border-neutral-50 dark:border-neutral-800/40 bg-neutral-50/30 dark:bg-zinc-900/50" />
              ))}

              {days.map((day, i) => {
                const dailyEvents = getEventsForDay(day);
                const today = isToday(day);
                const isSelected = selectedDate && isSameDay(day, selectedDate);
                return (
                  <button
                    key={i}
                    onClick={() => setSelectedDate(day)}
                    className={`aspect-square border-r border-b border-neutral-50 dark:border-neutral-800/40 p-1.5 sm:p-2 relative group transition-colors duration-200 text-left ${
                      isSelected
                        ? "bg-brand-50/50 dark:bg-brand-900/10"
                        : "hover:bg-brand-50/30 dark:hover:bg-brand-900/5"
                    } ${today ? "bg-brand-50/40 dark:bg-brand-900/10" : ""}`}
                  >
                    <span
                      className={`text-xs font-medium inline-flex items-center justify-center w-6 h-6 rounded-full ${
                        today
                          ? "bg-brand-600 text-white font-bold"
                          : isSelected
                          ? "bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 font-bold"
                          : "text-neutral-500 dark:text-neutral-400"
                      }`}
                    >
                      {format(day, "d")}
                    </span>

                    <div className="mt-0.5 space-y-0.5">
                      {dailyEvents.slice(0, 2).map((evt) => (
                        <div
                          key={evt.id}
                          className={`text-[9px] sm:text-[10px] px-1.5 py-0.5 ${getEventTypeColor(evt.type)} text-white rounded-md truncate font-medium`}
                        >
                          {evt.title}
                        </div>
                      ))}
                      {dailyEvents.length > 2 && (
                        <span className="text-[9px] text-neutral-400">
                          +{dailyEvents.length - 2} more
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sidebar — Selected date events + upcoming */}
          <div className="space-y-6">
            {/* Selected date detail */}
            {selectedDate && (
              <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-neutral-200/60 dark:border-neutral-800/60 overflow-hidden">
                <div className="px-4 py-3 border-b border-neutral-100 dark:border-neutral-800/60 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
                    <Clock className="w-4 h-4 text-brand-600" />
                    {format(selectedDate, "EEEE, MMM do")}
                  </h3>
                  <button
                    onClick={() => openCreateModal(selectedDate)}
                    className="p-1.5 rounded-lg bg-brand-50 dark:bg-brand-900/20 text-brand-600 hover:bg-brand-100 dark:hover:bg-brand-900/40 transition-colors"
                    title="Add event"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="p-4">
                  {getEventsForDay(selectedDate).length === 0 ? (
                    <div className="text-center py-4">
                      <Calendar className="w-7 h-7 text-neutral-200 dark:text-neutral-700 mx-auto mb-2" />
                      <p className="text-xs text-neutral-400 italic mb-2">No events scheduled.</p>
                      <button
                        onClick={() => openCreateModal(selectedDate)}
                        className="text-xs font-semibold text-brand-600 hover:text-brand-700 transition-colors"
                      >
                        + Add an event
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {getEventsForDay(selectedDate).map((evt) => (
                        <div
                          key={evt.id}
                          className="group p-3 rounded-xl bg-brand-50/40 dark:bg-brand-900/10 border border-brand-100/60 dark:border-brand-800/30"
                        >
                          <div className="flex items-center gap-1.5 mb-1">
                            <div className={`w-2 h-2 rounded-full ${getEventTypeColor(evt.type)}`} />
                            <span className="font-semibold text-sm text-neutral-900 dark:text-white truncate">
                              {evt.title}
                            </span>
                          </div>
                          {evt.startTime && (
                            <div className="flex items-center gap-1 text-[11px] text-neutral-500">
                              <Clock className="w-3 h-3" /> {evt.startTime}
                              {evt.endTime && ` – ${evt.endTime}`}
                            </div>
                          )}
                          {evt.location && (
                            <div className="flex items-center gap-1 text-[11px] text-neutral-500 mt-0.5">
                              <MapPin className="w-3 h-3" /> {evt.location}
                            </div>
                          )}
                          {evt.artistCount && (
                            <div className="flex items-center gap-1 text-[11px] text-neutral-500 mt-0.5">
                              <Users className="w-3 h-3" /> {evt.artistCount} Artists
                            </div>
                          )}
                          <span className="inline-block mt-1.5 text-[10px] font-medium px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-zinc-800 text-neutral-500">
                            {getEventTypeLabel(evt.type)}
                          </span>

                          {/* Action buttons */}
                          <div className="flex gap-1.5 mt-2 pt-2 border-t border-brand-100/40 dark:border-brand-800/20 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => openEditModal(evt)}
                              className="flex items-center gap-1 text-[11px] font-medium text-neutral-500 hover:text-brand-600 px-2 py-1 rounded-md hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors"
                            >
                              <Pencil className="w-3 h-3" /> Edit
                            </button>
                            <button
                              onClick={() => handleDelete(evt.id)}
                              disabled={deleting === evt.id}
                              className="flex items-center gap-1 text-[11px] font-medium text-neutral-500 hover:text-rose-600 px-2 py-1 rounded-md hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors disabled:opacity-50"
                            >
                              {deleting === evt.id ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <Trash2 className="w-3 h-3" />
                              )}
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Upcoming */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <CalendarDays className="w-4 h-4 text-brand-600" />
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">Upcoming</h3>
              </div>

              {upcomingEvents.length === 0 ? (
                <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-neutral-200/60 dark:border-neutral-800/60 text-center">
                  <p className="text-xs text-neutral-400 italic">No upcoming events.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {upcomingEvents.map((e) => (
                    <div
                      key={e.id}
                      className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-neutral-200/60 dark:border-neutral-800/60 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all duration-300 hover:shadow-sm"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <div className={`w-2 h-2 rounded-full ${getEventTypeColor(e.type)}`} />
                        <span className="text-[11px] font-semibold text-brand-600">{format(new Date(e.eventDate), "MMM dd, yyyy")}</span>
                      </div>
                      <h4 className="font-semibold text-sm text-neutral-900 dark:text-white mb-2">{e.title}</h4>
                      <div className="space-y-1.5">
                        {e.startTime && (
                          <div className="flex items-center gap-2 text-[11px] text-neutral-500">
                            <Clock className="w-3 h-3" /> {e.startTime}
                            {e.endTime && ` – ${e.endTime}`}
                          </div>
                        )}
                        {e.location && (
                          <div className="flex items-center gap-2 text-[11px] text-neutral-500">
                            <MapPin className="w-3 h-3" /> {e.location}
                          </div>
                        )}
                        {e.artistCount && (
                          <div className="flex items-center gap-2 text-[11px] text-neutral-500">
                            <Users className="w-3 h-3" /> {e.artistCount} Artists
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => openEditModal(e)}
                        className="w-full mt-4 py-2 text-xs font-semibold text-brand-600 hover:text-brand-700 border border-brand-100 dark:border-brand-900/30 rounded-xl hover:bg-brand-50 dark:hover:bg-brand-900/10 transition-all duration-200"
                      >
                        Manage Event
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Legend */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-neutral-200/60 dark:border-neutral-800/60 p-4">
              <h4 className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                Event Types
              </h4>
              <div className="flex flex-wrap gap-2">
                {EVENT_TYPES.map((t) => (
                  <div key={t.value} className="flex items-center gap-1.5">
                    <div className={`w-2 h-2 rounded-full ${t.color}`} />
                    <span className="text-[10px] text-neutral-500">{t.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />

          <div className="relative bg-white dark:bg-zinc-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 fade-in duration-200">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 dark:border-neutral-800">
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                {editingEvent ? "Edit Event" : "Add Event"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Title */}
              <div>
                <label className="block text-xs font-medium text-neutral-500 mb-1.5">
                  Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Summer Jazz Festival"
                  className="w-full bg-neutral-50 dark:bg-zinc-800/50 border border-neutral-200 dark:border-neutral-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-brand-300 dark:focus:border-brand-700 transition-colors"
                />
              </div>

              {/* Date */}
              <div>
                <label className="block text-xs font-medium text-neutral-500 mb-1.5">
                  Date <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={formData.eventDate}
                  onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                  className="w-full bg-neutral-50 dark:bg-zinc-800/50 border border-neutral-200 dark:border-neutral-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-brand-300 dark:focus:border-brand-700 transition-colors"
                />
              </div>

              {/* Time Row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-500 mb-1.5">Start Time</label>
                  <input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-full bg-neutral-50 dark:bg-zinc-800/50 border border-neutral-200 dark:border-neutral-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-brand-300 dark:focus:border-brand-700 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-500 mb-1.5">End Time</label>
                  <input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className="w-full bg-neutral-50 dark:bg-zinc-800/50 border border-neutral-200 dark:border-neutral-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-brand-300 dark:focus:border-brand-700 transition-colors"
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-xs font-medium text-neutral-500 mb-1.5">Venue / Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. Viharamahadevi Park"
                  className="w-full bg-neutral-50 dark:bg-zinc-800/50 border border-neutral-200 dark:border-neutral-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-brand-300 dark:focus:border-brand-700 transition-colors"
                />
              </div>

              {/* Artist Count */}
              <div>
                <label className="block text-xs font-medium text-neutral-500 mb-1.5">Number of Artists</label>
                <input
                  type="number"
                  min="0"
                  value={formData.artistCount}
                  onChange={(e) => setFormData({ ...formData, artistCount: e.target.value })}
                  placeholder="e.g. 12"
                  className="w-full bg-neutral-50 dark:bg-zinc-800/50 border border-neutral-200 dark:border-neutral-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-brand-300 dark:focus:border-brand-700 transition-colors"
                />
              </div>

              {/* Type */}
              <div>
                <label className="block text-xs font-medium text-neutral-500 mb-1.5">Event Type</label>
                <div className="flex flex-wrap gap-2">
                  {EVENT_TYPES.map((t) => (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, type: t.value })}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                        formData.type === t.value
                          ? "border-brand-300 dark:border-brand-700 bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300"
                          : "border-neutral-200 dark:border-neutral-700 text-neutral-500 hover:border-neutral-300"
                      }`}
                    >
                      <div className={`w-2 h-2 rounded-full ${t.color}`} />
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-medium text-neutral-500 mb-1.5">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  placeholder="Optional notes about this event..."
                  className="w-full bg-neutral-50 dark:bg-zinc-800/50 border border-neutral-200 dark:border-neutral-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-brand-300 dark:focus:border-brand-700 transition-colors resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 text-sm font-semibold rounded-xl border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || !formData.title || !formData.eventDate}
                  className="flex-1 py-2.5 text-sm font-semibold rounded-xl bg-brand-600 text-white hover:bg-brand-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingEvent ? "Update Event" : "Add Event"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

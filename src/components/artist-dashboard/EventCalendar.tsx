"use client";

import { useState, useEffect, useCallback } from "react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  getDay,
} from "date-fns";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Plus,
  Pencil,
  Trash2,
  X,
  Loader2,
  Calendar,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

const EVENT_TYPES = [
  { value: "gig", label: "Gig", color: "bg-violet-500" },
  { value: "private", label: "Private", color: "bg-amber-500" },
  { value: "recording", label: "Recording", color: "bg-blue-500" },
  { value: "rehearsal", label: "Rehearsal", color: "bg-emerald-500" },
  { value: "other", label: "Other", color: "bg-neutral-400" },
];

interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  eventDate: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  type: string;
}

interface EventFormData {
  title: string;
  description: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  location: string;
  type: string;
}

const defaultForm: EventFormData = {
  title: "",
  description: "",
  eventDate: "",
  startTime: "",
  endTime: "",
  location: "",
  type: "gig",
};

export function EventCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [artistId, setArtistId] = useState<string | null>(null);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [formData, setFormData] = useState<EventFormData>(defaultForm);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const getAuthHeader = (): Record<string, string> => {
    const token = localStorage.getItem("rasas_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // Fetch artist ID on mount
  useEffect(() => {
    const fetchArtistId = async () => {
      try {
        const res = await fetch(`${API_URL}/artists/me`, {
          headers: { ...getAuthHeader() },
        });
        if (res.ok) {
          const data = await res.json();
          setArtistId(data.id);
        }
      } catch (e) {
        console.error("Failed to fetch artist profile", e);
      }
    };
    fetchArtistId();
  }, []);

  // Fetch events when month changes or artistId is loaded
  const fetchEvents = useCallback(async () => {
    if (!artistId) return;
    setLoading(true);
    try {
      const month = currentDate.getMonth() + 1;
      const year = currentDate.getFullYear();
      const res = await fetch(
        `${API_URL}/artists/${artistId}/calendar?month=${month}&year=${year}`
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
  }, [artistId, currentDate]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const days = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate),
  });

  const getDayEvents = (date: Date) =>
    events.filter((e) => isSameDay(new Date(e.eventDate), date));

  const getEventTypeColor = (type: string) =>
    EVENT_TYPES.find((t) => t.value === type)?.color || "bg-neutral-400";

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

  const openEditModal = (event: CalendarEvent) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description || "",
      eventDate: format(new Date(event.eventDate), "yyyy-MM-dd"),
      startTime: event.startTime || "",
      endTime: event.endTime || "",
      location: event.location || "",
      type: event.type,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!artistId || !formData.title || !formData.eventDate) return;
    setSaving(true);

    try {
      const url = editingEvent
        ? `${API_URL}/artists/${artistId}/calendar/${editingEvent.id}`
        : `${API_URL}/artists/${artistId}/calendar`;

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
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (eventId: string) => {
    if (!artistId) return;
    if (!confirm("Delete this event?")) return;
    setDeleting(eventId);

    try {
      const res = await fetch(
        `${API_URL}/artists/${artistId}/calendar/${eventId}`,
        {
          method: "DELETE",
          headers: { ...getAuthHeader() },
        }
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete event");
      }

      await fetchEvents();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setDeleting(null);
    }
  };

  return (
    <>
      <div className="flex flex-col xl:flex-row gap-6">
        {/* Calendar Grid */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-neutral-200/60 dark:border-neutral-800/60 flex-1 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-100 dark:border-neutral-800/60">
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
              {format(currentDate, "MMMM yyyy")}
            </h2>
            <div className="flex gap-1 bg-neutral-100 dark:bg-zinc-800 rounded-lg p-0.5">
              <button
                onClick={() => setCurrentDate(subMonths(currentDate, 1))}
                className="p-1.5 hover:bg-white dark:hover:bg-zinc-700 rounded-md transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentDate(addMonths(currentDate, 1))}
                className="p-1.5 hover:bg-white dark:hover:bg-zinc-700 rounded-md transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Day labels */}
          <div className="grid grid-cols-7 border-b border-neutral-100 dark:border-neutral-800/60">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="py-3 text-center text-[11px] font-semibold uppercase tracking-wider text-neutral-400"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Days */}
          <div className="grid grid-cols-7 relative">
            {loading && (
              <div className="absolute inset-0 bg-white/60 dark:bg-zinc-900/60 z-10 flex items-center justify-center">
                <Loader2 className="w-5 h-5 animate-spin text-violet-500" />
              </div>
            )}

            {Array.from({ length: getDay(startOfMonth(currentDate)) }).map(
              (_, i) => (
                <div
                  key={`pad-${i}`}
                  className="aspect-square border-r border-b border-neutral-50 dark:border-neutral-800/40 bg-neutral-50/30 dark:bg-zinc-900/50"
                />
              )
            )}

            {days.map((day, i) => {
              const dayEvents = getDayEvents(day);
              const isSelected = selectedDate && isSameDay(day, selectedDate);
              const isCurrentMonth = isSameMonth(day, currentDate);
              const today = isToday(day);

              return (
                <button
                  key={i}
                  onClick={() => setSelectedDate(day)}
                  className={`aspect-square border-r border-b border-neutral-50 dark:border-neutral-800/40 p-1.5 flex flex-col items-start gap-0.5 relative transition-colors duration-200 ${
                    isSelected
                      ? "bg-violet-50/60 dark:bg-violet-900/10"
                      : "hover:bg-neutral-50/80 dark:hover:bg-zinc-800/30"
                  } ${!isCurrentMonth ? "opacity-30" : ""}`}
                >
                  <span
                    className={`text-xs font-medium inline-flex items-center justify-center w-6 h-6 rounded-full ${
                      today
                        ? "bg-violet-600 text-white font-bold"
                        : isSelected
                        ? "bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 font-bold"
                        : "text-neutral-500"
                    }`}
                  >
                    {format(day, "d")}
                  </span>
                  <div className="flex flex-col gap-0.5 w-full mt-auto">
                    {dayEvents.slice(0, 3).map((evt, j) => (
                      <div
                        key={j}
                        className={`h-1 w-full rounded-full ${getEventTypeColor(evt.type)}`}
                      />
                    ))}
                    {dayEvents.length > 3 && (
                      <span className="text-[9px] text-neutral-400 leading-none">
                        +{dayEvents.length - 3}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Detail Panel */}
        <div className="w-full xl:w-80">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-neutral-200/60 dark:border-neutral-800/60 overflow-hidden h-full">
            <div className="px-5 py-4 border-b border-neutral-100 dark:border-neutral-800/60 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-violet-500" />
                {selectedDate
                  ? format(selectedDate, "EEEE, MMMM do")
                  : "Select a date"}
              </h3>
              {selectedDate && (
                <button
                  onClick={() => openCreateModal(selectedDate)}
                  className="p-1.5 rounded-lg bg-violet-50 dark:bg-violet-900/20 text-violet-600 hover:bg-violet-100 dark:hover:bg-violet-900/40 transition-colors"
                  title="Add event"
                >
                  <Plus className="w-4 h-4" />
                </button>
              )}
            </div>

            {selectedDate && (
              <div className="p-5 space-y-5">
                {/* Schedule */}
                <div>
                  <h4 className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 pb-2 mb-3 border-b border-neutral-100 dark:border-neutral-800/60">
                    Schedule
                  </h4>

                  {getDayEvents(selectedDate).length === 0 ? (
                    <div className="text-center py-6">
                      <Calendar className="w-8 h-8 text-neutral-200 dark:text-neutral-700 mx-auto mb-2" />
                      <p className="text-sm text-neutral-400 italic mb-3">
                        No events scheduled.
                      </p>
                      <button
                        onClick={() => openCreateModal(selectedDate)}
                        className="text-xs font-semibold text-violet-600 hover:text-violet-700 transition-colors"
                      >
                        + Add an event
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {getDayEvents(selectedDate).map((evt) => (
                        <div
                          key={evt.id}
                          className="group p-3 rounded-xl bg-violet-50/50 dark:bg-violet-900/10 border border-violet-100/80 dark:border-violet-800/30"
                        >
                          <div className="flex gap-3 items-start">
                            <div className="text-center min-w-[44px] bg-white dark:bg-zinc-800 rounded-lg p-1.5 shadow-sm border border-neutral-100 dark:border-neutral-800">
                              <div className="text-[10px] font-bold text-neutral-500">
                                {evt.startTime || "—"}
                              </div>
                              {evt.endTime && (
                                <div className="text-[9px] text-neutral-400">
                                  {evt.endTime}
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5 mb-0.5">
                                <div
                                  className={`w-2 h-2 rounded-full ${getEventTypeColor(evt.type)}`}
                                />
                                <span className="font-semibold text-sm text-neutral-900 dark:text-white truncate">
                                  {evt.title}
                                </span>
                              </div>
                              {evt.location && (
                                <div className="flex items-center gap-1 text-[11px] text-neutral-500 mt-0.5">
                                  <MapPin className="w-3 h-3" /> {evt.location}
                                </div>
                              )}
                              {evt.description && (
                                <p className="text-[11px] text-neutral-400 mt-1 line-clamp-2">
                                  {evt.description}
                                </p>
                              )}
                              <span className="inline-block mt-1.5 text-[10px] font-medium capitalize px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-zinc-800 text-neutral-500">
                                {evt.type}
                              </span>
                            </div>
                          </div>

                          {/* Action buttons */}
                          <div className="flex gap-1.5 mt-2.5 pt-2 border-t border-violet-100/60 dark:border-violet-800/20 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => openEditModal(evt)}
                              className="flex items-center gap-1 text-[11px] font-medium text-neutral-500 hover:text-violet-600 px-2 py-1 rounded-md hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-colors"
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

                {/* Legend */}
                <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800/60">
                  <h4 className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                    Event Types
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {EVENT_TYPES.map((t) => (
                      <div key={t.value} className="flex items-center gap-1.5">
                        <div className={`w-2 h-2 rounded-full ${t.color}`} />
                        <span className="text-[10px] text-neutral-500 capitalize">
                          {t.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />

          {/* Modal */}
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
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="e.g. Live at Barefoot"
                  className="w-full bg-neutral-50 dark:bg-zinc-800/50 border border-neutral-200 dark:border-neutral-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-violet-300 dark:focus:border-violet-700 transition-colors"
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
                  onChange={(e) =>
                    setFormData({ ...formData, eventDate: e.target.value })
                  }
                  className="w-full bg-neutral-50 dark:bg-zinc-800/50 border border-neutral-200 dark:border-neutral-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-violet-300 dark:focus:border-violet-700 transition-colors"
                />
              </div>

              {/* Time Row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-500 mb-1.5">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) =>
                      setFormData({ ...formData, startTime: e.target.value })
                    }
                    className="w-full bg-neutral-50 dark:bg-zinc-800/50 border border-neutral-200 dark:border-neutral-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-violet-300 dark:focus:border-violet-700 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-500 mb-1.5">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) =>
                      setFormData({ ...formData, endTime: e.target.value })
                    }
                    className="w-full bg-neutral-50 dark:bg-zinc-800/50 border border-neutral-200 dark:border-neutral-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-violet-300 dark:focus:border-violet-700 transition-colors"
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-xs font-medium text-neutral-500 mb-1.5">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  placeholder="e.g. Barefoot Gallery, Colombo"
                  className="w-full bg-neutral-50 dark:bg-zinc-800/50 border border-neutral-200 dark:border-neutral-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-violet-300 dark:focus:border-violet-700 transition-colors"
                />
              </div>

              {/* Type */}
              <div>
                <label className="block text-xs font-medium text-neutral-500 mb-1.5">
                  Event Type
                </label>
                <div className="flex flex-wrap gap-2">
                  {EVENT_TYPES.map((t) => (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, type: t.value })
                      }
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                        formData.type === t.value
                          ? "border-violet-300 dark:border-violet-700 bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300"
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
                <label className="block text-xs font-medium text-neutral-500 mb-1.5">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                  placeholder="Optional notes about this event..."
                  className="w-full bg-neutral-50 dark:bg-zinc-800/50 border border-neutral-200 dark:border-neutral-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-violet-300 dark:focus:border-violet-700 transition-colors resize-none"
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
                  className="flex-1 py-2.5 text-sm font-semibold rounded-xl bg-violet-600 text-white hover:bg-violet-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
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

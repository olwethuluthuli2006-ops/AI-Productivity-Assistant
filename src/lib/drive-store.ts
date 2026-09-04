import { useCallback, useEffect, useState } from "react";

export type Vehicle = {
  nickname: string;
  model: string;
  year: string;
  plate: string;
  vin: string;
  colour: string;
  odometer: number;
};

export type ImportantDate = {
  id: string;
  title: string;
  date: string;
  category: "Service" | "Insurance" | "Licence" | "Tyres" | "Other";
};

export type DiaryEntry = {
  id: string;
  title: string;
  date: string;
  location: string;
  distanceKm: number;
  mood: "Scenic" | "Road trip" | "Commute" | "Track day" | "Errand";
  notes: string;
};

export type DocumentItem = {
  id: string;
  name: string;
  type: "Insurance" | "Service book" | "Licence" | "Warranty" | "Other";
  expires: string;
};

export type Reminder = {
  id: string;
  title: string;
  due: string;
  done: boolean;
};

export type Settings = {
  ownerName: string;
  units: "km" | "mi";
  theme: "light" | "dark";
  serviceAlerts: boolean;
  tripAutoLog: boolean;
  emergencyContact: string;
};

export type DriveState = {
  vehicle: Vehicle;
  dates: ImportantDate[];
  entries: DiaryEntry[];
  documents: DocumentItem[];
  reminders: Reminder[];
  settings: Settings;
};

const STORAGE_KEY = "my-mercedes-drive:v1";

export const defaultState: DriveState = {
  vehicle: {
    nickname: "The Silver Arrow",
    model: "C-Class Saloon",
    year: "2022",
    plate: "MMD 019 GP",
    vin: "WDD•••••••••34821",
    colour: "Iridium Silver",
    odometer: 48250,
  },
  dates: [
    { id: "d1", title: "Annual service", date: "2026-10-14", category: "Service" },
    { id: "d2", title: "Insurance renewal", date: "2026-11-02", category: "Insurance" },
    { id: "d3", title: "Licence disc renewal", date: "2027-01-20", category: "Licence" },
    { id: "d4", title: "Tyre rotation", date: "2026-09-26", category: "Tyres" },
  ],
  entries: [
    {
      id: "e1",
      title: "Coastal run to Hermanus",
      date: "2026-08-22",
      location: "Clarence Drive, R44",
      distanceKm: 186,
      mood: "Scenic",
      notes: "Perfect morning light through the sea cliffs. Averaged 6.4 l/100km.",
    },
    {
      id: "e2",
      title: "First long haul with the family",
      date: "2026-07-05",
      location: "Johannesburg to Dullstroom",
      distanceKm: 268,
      mood: "Road trip",
      notes: "Cabin stayed quiet the whole way. Cruise control did the heavy lifting.",
    },
  ],
  documents: [
    { id: "doc1", name: "Comprehensive insurance policy", type: "Insurance", expires: "2026-11-02" },
    { id: "doc2", name: "Digital service history", type: "Service book", expires: "" },
    { id: "doc3", name: "Extended warranty certificate", type: "Warranty", expires: "2027-04-30" },
  ],
  reminders: [
    { id: "r1", title: "Check tyre pressure before the weekend trip", due: "2026-09-06", done: false },
    { id: "r2", title: "Book wheel alignment", due: "2026-09-18", done: false },
    { id: "r3", title: "Update emergency contact details", due: "2026-09-02", done: true },
  ],
  settings: {
    ownerName: "Olwethu",
    units: "km",
    theme: "light",
    serviceAlerts: true,
    tripAutoLog: false,
    emergencyContact: "+27 82 000 1234",
  },
};

export function useDriveStore() {
  const [state, setState] = useState<DriveState>(defaultState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setState({ ...defaultState, ...(JSON.parse(raw) as DriveState) });
    } catch {
      /* ignore corrupt storage */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    document.documentElement.classList.toggle("dark", state.settings.theme === "dark");
  }, [state.settings.theme, hydrated]);

  const update = useCallback((patch: (prev: DriveState) => DriveState) => setState(patch), []);
  const reset = useCallback(() => setState(defaultState), []);

  return { state, update, reset, hydrated };
}

export const newId = () => Math.random().toString(36).slice(2, 10);

export function daysUntil(iso: string) {
  if (!iso) return null;
  const target = new Date(`${iso}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - today.getTime()) / 86_400_000);
}

export function formatDate(iso: string) {
  if (!iso) return "—";
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-ZA", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

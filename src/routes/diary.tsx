import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { FileText, MapPin, Plus, Route as RouteIcon, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useDrive } from "@/lib/drive-context";
import { formatDate, newId, type DiaryEntry } from "@/lib/drive-store";

export const Route = createFileRoute("/diary")({
  head: () => ({
    meta: [
      { title: "My Diary — Drives, Memories & Documents" },
      {
        name: "description",
        content: "Log every drive, keep your favourite routes and store vehicle documents in one private diary.",
      },
      { property: "og:title", content: "My Diary — Drives, Memories & Documents" },
      {
        property: "og:description",
        content: "A driving diary for logging journeys, memories and vehicle paperwork.",
      },
    ],
  }),
  component: DiaryPage,
});

const emptyEntry: Omit<DiaryEntry, "id"> = {
  title: "",
  date: "",
  location: "",
  distanceKm: 0,
  mood: "Road trip",
  notes: "",
};

function DiaryPage() {
  const { state, update } = useDrive();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(emptyEntry);

  const entries = useMemo(
    () => [...state.entries].sort((a, b) => b.date.localeCompare(a.date)),
    [state.entries],
  );
  const totalKm = entries.reduce((sum, e) => sum + Number(e.distanceKm || 0), 0);

  const addEntry = () => {
    if (!draft.title || !draft.date) return;
    update((prev) => ({
      ...prev,
      entries: [...prev.entries, { ...draft, distanceKm: Number(draft.distanceKm) || 0, id: newId() }],
    }));
    setDraft(emptyEntry);
    setOpen(false);
  };

  const removeEntry = (id: string) =>
    update((prev) => ({ ...prev, entries: prev.entries.filter((e) => e.id !== id) }));

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="My Diary"
        title="Drives & documents"
        description="Your journeys, memories and paperwork, kept together and stored on this device."
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" /> New entry
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Log a drive</DialogTitle>
                <DialogDescription>Capture the route, distance and what made it memorable.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="e-title">Title</Label>
                  <Input
                    id="e-title"
                    value={draft.title}
                    onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                    placeholder="Sunday morning mountain pass"
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="e-date">Date</Label>
                    <Input
                      id="e-date"
                      type="date"
                      value={draft.date}
                      onChange={(e) => setDraft({ ...draft, date: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="e-dist">Distance ({state.settings.units})</Label>
                    <Input
                      id="e-dist"
                      type="number"
                      min={0}
                      value={draft.distanceKm}
                      onChange={(e) => setDraft({ ...draft, distanceKm: Number(e.target.value) })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="e-loc">Route or location</Label>
                  <Input
                    id="e-loc"
                    value={draft.location}
                    onChange={(e) => setDraft({ ...draft, location: e.target.value })}
                    placeholder="Chapman's Peak Drive"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="e-notes">Notes</Label>
                  <Textarea
                    id="e-notes"
                    value={draft.notes}
                    onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
                    placeholder="What made this drive special?"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={addEntry}>Save entry</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <SummaryCard label="Entries logged" value={String(entries.length)} />
        <SummaryCard label={`Distance recorded`} value={`${totalKm.toLocaleString()} ${state.settings.units}`} />
        <SummaryCard label="Documents stored" value={String(state.documents.length)} />
      </div>

      <Tabs defaultValue="drives">
        <TabsList>
          <TabsTrigger value="drives">Drives</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="drives" className="mt-4 space-y-4">
          {entries.map((e) => (
            <article key={e.id} className="surface-card p-5 rise-in">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                <div className="min-w-0">
                  <h2 className="truncate font-display text-lg font-semibold">{e.title}</h2>
                  <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                    <span>{formatDate(e.date)}</span>
                    {e.location && (
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" /> {e.location}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1">
                      <RouteIcon className="h-3.5 w-3.5" /> {e.distanceKm} {state.settings.units}
                    </span>
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Badge variant="secondary">{e.mood}</Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Delete ${e.title}`}
                    onClick={() => removeEntry(e.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {e.notes && <p className="mt-3 text-sm text-muted-foreground">{e.notes}</p>}
            </article>
          ))}
          {entries.length === 0 && (
            <p className="surface-card p-8 text-center text-sm text-muted-foreground">
              No drives logged yet. Add your first memory.
            </p>
          )}
        </TabsContent>

        <TabsContent value="documents" className="mt-4 grid gap-4 sm:grid-cols-2">
          {state.documents.map((d) => (
            <div key={d.id} className="surface-card flex items-start gap-3 p-5">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-secondary">
                <FileText className="h-5 w-5 text-signal" />
              </div>
              <div className="min-w-0">
                <p className="truncate font-medium">{d.name}</p>
                <p className="text-xs text-muted-foreground">
                  {d.type}
                  {d.expires ? ` · expires ${formatDate(d.expires)}` : " · no expiry"}
                </p>
              </div>
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="surface-card p-5">
      <p className="eyebrow">{label}</p>
      <p className="mt-2 font-display text-2xl font-bold">{value}</p>
    </div>
  );
}

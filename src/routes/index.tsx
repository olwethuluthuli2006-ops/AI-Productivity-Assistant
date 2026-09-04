import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  CalendarClock,
  CheckCircle2,
  Fuel,
  Gauge,
  MapPin,
  Phone,
  Plus,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import { useState } from "react";
import { PageHeader } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
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
import { daysUntil, formatDate, newId, type ImportantDate } from "@/lib/drive-store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "My Mercedes Drive — Vehicle Dashboard" },
      {
        name: "description",
        content:
          "Track your vehicle details, service dates, reminders and roadside assistance from one premium dashboard.",
      },
      { property: "og:title", content: "My Mercedes Drive — Vehicle Dashboard" },
      {
        property: "og:description",
        content: "An independent digital car diary and vehicle companion for premium car owners.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const { state, update } = useDrive();
  const { vehicle, dates, reminders, settings } = state;
  const unit = settings.units;
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Omit<ImportantDate, "id">>({
    title: "",
    date: "",
    category: "Service",
  });

  const upcoming = [...dates]
    .filter((d) => d.date)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 4);
  const openReminders = reminders.filter((r) => !r.done);
  const nextService = upcoming.find((d) => d.category === "Service");
  const serviceIn = nextService ? daysUntil(nextService.date) : null;

  const toggleReminder = (id: string) =>
    update((prev) => ({
      ...prev,
      reminders: prev.reminders.map((r) => (r.id === id ? { ...r, done: !r.done } : r)),
    }));

  const addDate = () => {
    if (!draft.title || !draft.date) return;
    update((prev) => ({ ...prev, dates: [...prev.dates, { ...draft, id: newId() }] }));
    setDraft({ title: "", date: "", category: "Service" });
    setOpen(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Dashboard"
        title={`Good day, ${settings.ownerName}`}
        description="Everything about your car, kept in one calm, private place."
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" /> Add date
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add an important date</DialogTitle>
                <DialogDescription>Service, insurance, licence or anything else worth remembering.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="date-title">Title</Label>
                  <Input
                    id="date-title"
                    value={draft.title}
                    onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                    placeholder="Major service"
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="date-when">Date</Label>
                    <Input
                      id="date-when"
                      type="date"
                      value={draft.date}
                      onChange={(e) => setDraft({ ...draft, date: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date-cat">Category</Label>
                    <select
                      id="date-cat"
                      value={draft.category}
                      onChange={(e) =>
                        setDraft({ ...draft, category: e.target.value as ImportantDate["category"] })
                      }
                      className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                    >
                      {["Service", "Insurance", "Licence", "Tyres", "Other"].map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={addDate}>Save date</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <section className="surface-onyx grid gap-6 p-6 rise-in sm:p-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <div className="min-w-0">
          <p className="eyebrow text-[oklch(0.78_0.006_255)]">My vehicle</p>
          <h2 className="mt-2 truncate text-2xl font-bold sm:text-3xl">{vehicle.nickname}</h2>
          <p className="mt-1 text-sm text-[oklch(0.8_0.005_255)]">
            {vehicle.year} · {vehicle.model} · {vehicle.colour}
          </p>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
            <Stat label="Odometer" value={`${vehicle.odometer.toLocaleString()} ${unit}`} icon={Gauge} />
            <Stat label="Registration" value={vehicle.plate} icon={ShieldCheck} />
            <Stat label="Avg. economy" value={`6.4 l/100${unit}`} icon={Fuel} />
          </div>
        </div>
        <div className="rounded-xl bg-[oklch(1_0_0_/_8%)] p-5 backdrop-blur">
          <p className="text-xs font-semibold uppercase tracking-wider text-[oklch(0.82_0.005_255)]">
            Next service
          </p>
          <p className="mt-2 font-display text-xl font-bold">
            {nextService ? nextService.title : "Nothing scheduled"}
          </p>
          <p className="text-sm text-[oklch(0.8_0.005_255)]">
            {nextService ? formatDate(nextService.date) : "Add a service date to start tracking"}
          </p>
          {serviceIn !== null && (
            <div className="mt-4">
              <Progress value={Math.max(0, Math.min(100, 100 - (serviceIn / 180) * 100))} className="h-1.5" />
              <p className="mt-2 text-xs text-[oklch(0.82_0.005_255)]">
                {serviceIn >= 0 ? `${serviceIn} days remaining` : `${Math.abs(serviceIn)} days overdue`}
              </p>
            </div>
          )}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="surface-card p-5 lg:col-span-2">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">Important dates</h2>
            <CalendarClock className="h-5 w-5 shrink-0 text-muted-foreground" />
          </div>
          <ul className="mt-4 divide-y divide-border">
            {upcoming.map((d) => {
              const days = daysUntil(d.date) ?? 0;
              return (
                <li key={d.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{d.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(d.date)} · {d.category}
                    </p>
                  </div>
                  <Badge variant={days < 30 ? "destructive" : "secondary"}>
                    {days < 0 ? "Overdue" : `in ${days}d`}
                  </Badge>
                </li>
              );
            })}
            {upcoming.length === 0 && <li className="py-6 text-sm text-muted-foreground">No dates yet.</li>}
          </ul>
        </section>

        <section className="surface-card p-5">
          <h2 className="text-lg font-semibold">Reminders</h2>
          <p className="text-xs text-muted-foreground">{openReminders.length} open</p>
          <ul className="mt-4 space-y-2">
            {reminders.map((r) => (
              <li key={r.id}>
                <button
                  onClick={() => toggleReminder(r.id)}
                  className="flex w-full items-start gap-3 rounded-lg px-2 py-2 text-left transition-colors hover:bg-accent"
                >
                  <CheckCircle2
                    className={`mt-0.5 h-4.5 w-4.5 shrink-0 ${r.done ? "text-signal" : "text-muted-foreground"}`}
                  />
                  <span className={`min-w-0 text-sm ${r.done ? "text-muted-foreground line-through" : ""}`}>
                    {r.title}
                    <span className="block text-xs text-muted-foreground">Due {formatDate(r.due)}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="grid gap-4 sm:grid-cols-3">
        <QuickCard
          to="/help"
          icon={Phone}
          title="Roadside assistance"
          body="One tap to reach towing, battery and tyre support."
        />
        <QuickCard
          to="/help"
          icon={AlertTriangle}
          title="Emergency services"
          body="Ambulance, police and your personal emergency contact."
        />
        <QuickCard
          to="/diary"
          icon={Wrench}
          title="Documents & diary"
          body="Service history, policies and every memorable drive."
        />
      </section>
    </div>
  );
}

function Stat({ label, value, icon: Icon }: { label: string; value: string; icon: typeof Gauge }) {
  return (
    <div className="min-w-0 rounded-lg bg-[oklch(1_0_0_/_7%)] p-3">
      <Icon className="h-4 w-4 text-[oklch(0.85_0.005_255)]" />
      <p className="mt-2 truncate font-display text-base font-semibold">{value}</p>
      <p className="truncate text-xs text-[oklch(0.8_0.005_255)]">{label}</p>
    </div>
  );
}

function QuickCard({
  to,
  icon: Icon,
  title,
  body,
}: {
  to: "/help" | "/diary";
  icon: typeof Gauge;
  title: string;
  body: string;
}) {
  return (
    <Link to={to} className="surface-card block p-5 hover:-translate-y-0.5">
      <div className="grid h-10 w-10 place-items-center rounded-lg bg-secondary">
        <Icon className="h-5 w-5 text-signal" />
      </div>
      <p className="mt-3 font-display font-semibold">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{body}</p>
      <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-signal">
        <MapPin className="h-3.5 w-3.5" /> Open
      </span>
    </Link>
  );
}

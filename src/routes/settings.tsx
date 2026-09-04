import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { RotateCcw, Save } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useDrive } from "@/lib/drive-context";
import { DISCLAIMER } from "@/lib/constants";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — My Mercedes Drive" },
      {
        name: "description",
        content: "Manage your vehicle profile, units, alerts, appearance and emergency contact details.",
      },
      { property: "og:title", content: "Settings — My Mercedes Drive" },
      {
        property: "og:description",
        content: "Personalise your vehicle profile, preferences and emergency contact.",
      },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { state, update, reset } = useDrive();
  const [vehicle, setVehicle] = useState(state.vehicle);

  useEffect(() => setVehicle(state.vehicle), [state.vehicle]);

  const saveVehicle = () => {
    update((prev) => ({ ...prev, vehicle: { ...vehicle, odometer: Number(vehicle.odometer) || 0 } }));
    toast.success("Vehicle profile updated");
  };

  const setSetting = <K extends keyof typeof state.settings>(key: K, value: (typeof state.settings)[K]) =>
    update((prev) => ({ ...prev, settings: { ...prev.settings, [key]: value } }));

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Settings"
        title="Preferences"
        description="Your data stays on this device. Adjust your vehicle profile and how the app behaves."
      />

      <section className="surface-card p-5 sm:p-6">
        <h2 className="text-lg font-semibold">Vehicle profile</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Nickname" value={vehicle.nickname} onChange={(v) => setVehicle({ ...vehicle, nickname: v })} />
          <Field label="Model" value={vehicle.model} onChange={(v) => setVehicle({ ...vehicle, model: v })} />
          <Field label="Year" value={vehicle.year} onChange={(v) => setVehicle({ ...vehicle, year: v })} />
          <Field label="Colour" value={vehicle.colour} onChange={(v) => setVehicle({ ...vehicle, colour: v })} />
          <Field label="Registration" value={vehicle.plate} onChange={(v) => setVehicle({ ...vehicle, plate: v })} />
          <Field label="VIN" value={vehicle.vin} onChange={(v) => setVehicle({ ...vehicle, vin: v })} />
          <Field
            label={`Odometer (${state.settings.units})`}
            value={String(vehicle.odometer)}
            type="number"
            onChange={(v) => setVehicle({ ...vehicle, odometer: Number(v) })}
          />
        </div>
        <Button className="mt-5 gap-2" onClick={saveVehicle}>
          <Save className="h-4 w-4" /> Save changes
        </Button>
      </section>

      <section className="surface-card p-5 sm:p-6">
        <h2 className="text-lg font-semibold">App preferences</h2>
        <div className="mt-4 space-y-1">
          <Row
            title="Dark mode"
            body="Switch to the charcoal night theme."
            checked={state.settings.theme === "dark"}
            onChange={(v) => setSetting("theme", v ? "dark" : "light")}
          />
          <Separator />
          <Row
            title="Service alerts"
            body="Highlight upcoming services and expiring documents."
            checked={state.settings.serviceAlerts}
            onChange={(v) => setSetting("serviceAlerts", v)}
          />
          <Separator />
          <Row
            title="Auto-log trips"
            body="Pre-fill a diary entry each time you record a journey."
            checked={state.settings.tripAutoLog}
            onChange={(v) => setSetting("tripAutoLog", v)}
          />
          <Separator />
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 py-4">
            <div className="min-w-0">
              <p className="font-medium">Distance units</p>
              <p className="text-sm text-muted-foreground">Used across the dashboard and diary.</p>
            </div>
            <div className="flex shrink-0 gap-2">
              {(["km", "mi"] as const).map((u) => (
                <Button
                  key={u}
                  size="sm"
                  variant={state.settings.units === u ? "default" : "outline"}
                  onClick={() => setSetting("units", u)}
                >
                  {u}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="surface-card p-5 sm:p-6">
        <h2 className="text-lg font-semibold">Owner & emergency</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field
            label="Your name"
            value={state.settings.ownerName}
            onChange={(v) => setSetting("ownerName", v)}
          />
          <Field
            label="Emergency contact"
            value={state.settings.emergencyContact}
            onChange={(v) => setSetting("emergencyContact", v)}
          />
        </div>
      </section>

      <section className="surface-card p-5 sm:p-6">
        <h2 className="text-lg font-semibold">Data</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Everything is stored locally in this browser. Resetting restores the sample garage.
        </p>
        <Button
          variant="outline"
          className="mt-4 gap-2"
          onClick={() => {
            reset();
            toast.success("Data reset to defaults");
          }}
        >
          <RotateCcw className="h-4 w-4" /> Reset app data
        </Button>
      </section>

      <p className="rounded-xl border border-border bg-muted/50 p-5 text-xs leading-relaxed text-muted-foreground">
        {DISCLAIMER}
      </p>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  const id = label.toLowerCase().replace(/[^a-z]+/g, "-");
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} type={type} value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function Row({
  title,
  body,
  checked,
  onChange,
}: {
  title: string;
  body: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 py-4">
      <div className="min-w-0">
        <p className="font-medium">{title}</p>
        <p className="text-sm text-muted-foreground">{body}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

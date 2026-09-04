import { createFileRoute } from "@tanstack/react-router";
import {
  Ambulance,
  BatteryCharging,
  Flame,
  Fuel,
  KeyRound,
  LifeBuoy,
  Phone,
  ShieldAlert,
  Truck,
  type LucideIcon,
} from "lucide-react";
import { PageHeader } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useDrive } from "@/lib/drive-context";

export const Route = createFileRoute("/help")({
  head: () => ({
    meta: [
      { title: "Help — Roadside & Emergency Assistance" },
      {
        name: "description",
        content: "Roadside assistance, emergency numbers and practical vehicle guidance when you need it most.",
      },
      { property: "og:title", content: "Help — Roadside & Emergency Assistance" },
      {
        property: "og:description",
        content: "Fast access to towing, battery help, emergency services and vehicle troubleshooting.",
      },
    ],
  }),
  component: HelpPage,
});

const ROADSIDE: { icon: LucideIcon; title: string; body: string; number: string }[] = [
  { icon: Truck, title: "Towing & recovery", body: "Vehicle immobile after a breakdown or accident.", number: "0800 111 222" },
  { icon: BatteryCharging, title: "Jump start", body: "Flat battery or no crank when starting.", number: "0800 111 223" },
  { icon: LifeBuoy, title: "Tyre assistance", body: "Puncture, blowout or spare wheel fitment.", number: "0800 111 224" },
  { icon: Fuel, title: "Fuel delivery", body: "Ran dry or misfuelled — help comes to you.", number: "0800 111 225" },
  { icon: KeyRound, title: "Key & lockout help", body: "Keys locked inside or lost while travelling.", number: "0800 111 226" },
];

const EMERGENCY: { icon: LucideIcon; title: string; number: string }[] = [
  { icon: Ambulance, title: "Ambulance", number: "10177" },
  { icon: ShieldAlert, title: "Police", number: "10111" },
  { icon: Flame, title: "Fire & rescue", number: "10177" },
];

const FAQ = [
  {
    q: "What should I do immediately after a breakdown?",
    a: "Pull off the road where it is safe, switch on your hazard lights, place a warning triangle behind the vehicle and stay outside the barrier if you are on a highway. Then call roadside assistance with your location.",
  },
  {
    q: "How often should the car be serviced?",
    a: "Follow the interval in your service booklet — typically every 12 months or 15,000–25,000 km, whichever comes first. Log each service under My Diary so nothing is lost.",
  },
  {
    q: "What does a warning light mean?",
    a: "Red lights mean stop safely as soon as possible; amber lights mean have the issue checked soon. Note the symbol and time and add it as a diary entry for your technician.",
  },
  {
    q: "What documents should I keep in the car?",
    a: "Registration papers, proof of insurance, a valid licence disc and roadside assistance details. Keep digital copies in the Documents tab as a backup.",
  },
];

function HelpPage() {
  const { state } = useDrive();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Help"
        title="Assistance & support"
        description="Roadside help, emergency numbers and answers to common vehicle questions."
      />

      <section className="surface-onyx grid gap-5 p-6 rise-in sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:p-8">
        <div className="min-w-0">
          <p className="eyebrow text-[oklch(0.78_0.006_255)]">Personal emergency contact</p>
          <h2 className="mt-2 truncate text-2xl font-bold">{state.settings.emergencyContact}</h2>
          <p className="mt-1 text-sm text-[oklch(0.8_0.005_255)]">
            Update this number any time in Settings so help can reach the right person.
          </p>
        </div>
        <Button asChild variant="destructive" size="lg" className="gap-2">
          <a href={`tel:${state.settings.emergencyContact.replace(/\s/g, "")}`}>
            <Phone className="h-4 w-4" /> Call now
          </a>
        </Button>
      </section>

      <section>
        <h2 className="text-lg font-semibold">Roadside assistance</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ROADSIDE.map(({ icon: Icon, title, body, number }) => (
            <div key={title} className="surface-card flex flex-col p-5">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-secondary">
                <Icon className="h-5 w-5 text-signal" />
              </div>
              <p className="mt-3 font-display font-semibold">{title}</p>
              <p className="mt-1 flex-1 text-sm text-muted-foreground">{body}</p>
              <Button asChild variant="outline" className="mt-4 gap-2">
                <a href={`tel:${number.replace(/\s/g, "")}`}>
                  <Phone className="h-4 w-4" /> {number}
                </a>
              </Button>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold">Emergency services</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {EMERGENCY.map(({ icon: Icon, title, number }) => (
            <a
              key={title}
              href={`tel:${number}`}
              className="surface-card flex items-center gap-4 p-5 hover:-translate-y-0.5"
            >
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-destructive/10">
                <Icon className="h-5 w-5 text-destructive" />
              </div>
              <div className="min-w-0">
                <p className="truncate font-medium">{title}</p>
                <p className="font-display text-lg font-bold">{number}</p>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className="surface-card p-5 sm:p-6">
        <h2 className="text-lg font-semibold">Vehicle help centre</h2>
        <Accordion type="single" collapsible className="mt-2">
          {FAQ.map((item) => (
            <AccordionItem key={item.q} value={item.q}>
              <AccordionTrigger className="text-left">{item.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{item.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </div>
  );
}

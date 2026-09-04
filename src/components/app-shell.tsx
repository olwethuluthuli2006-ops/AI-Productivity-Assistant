import { Link, useRouterState } from "@tanstack/react-router";
import { BookOpen, Gauge, LifeBuoy, Settings2, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { DISCLAIMER } from "@/lib/constants";

type NavItem = { to: "/" | "/diary" | "/help" | "/settings"; label: string; icon: LucideIcon };

const NAV: NavItem[] = [
  { to: "/", label: "Home", icon: Gauge },
  { to: "/diary", label: "My Diary", icon: BookOpen },
  { to: "/help", label: "Help", icon: LifeBuoy },
  { to: "/settings", label: "Settings", icon: Settings2 },
];

function Wordmark() {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl surface-onyx">
        <span className="font-display text-sm font-bold tracking-tight">MD</span>
      </div>
      <div className="min-w-0 leading-tight">
        <p className="truncate font-display text-sm font-bold">My Mercedes Drive</p>
        <p className="truncate text-xs text-muted-foreground">Independent car diary</p>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-sidebar-border bg-sidebar px-4 py-6 lg:flex">
        <Wordmark />
        <nav className="mt-8 flex flex-1 flex-col gap-1">
          {NAV.map(({ to, label, icon: Icon }) => {
            const active = pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                )}
              >
                <Icon className="h-4.5 w-4.5 shrink-0" />
                <span className="truncate">{label}</span>
                {active && <span className="ml-auto h-5 w-1 rounded-full bg-signal" />}
              </Link>
            );
          })}
        </nav>
        <p className="mt-6 text-[11px] leading-relaxed text-muted-foreground">{DISCLAIMER}</p>
      </aside>

      <header className="sticky top-0 z-20 border-b border-border bg-background/85 px-4 py-3 backdrop-blur lg:hidden">
        <Wordmark />
      </header>

      <main className="lg:pl-64">
        <div className="mx-auto w-full max-w-6xl px-4 pb-28 pt-6 sm:px-6 lg:pb-16 lg:pt-10">{children}</div>
        <footer className="hidden border-t border-border px-6 py-6 text-xs text-muted-foreground lg:block">
          {DISCLAIMER}
        </footer>
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-4 border-t border-border bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden">
        {NAV.map(({ to, label, icon: Icon }) => {
          const active = pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={cn(
                "flex flex-col items-center gap-1 px-1 py-2.5 text-[11px] font-medium transition-colors",
                active ? "text-foreground" : "text-muted-foreground",
              )}
            >
              <Icon className={cn("h-5 w-5", active && "text-signal")} />
              <span className="truncate">{label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <header className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4 rise-in sm:flex sm:flex-wrap sm:justify-between">
      <div className="min-w-0">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-1 truncate text-2xl font-bold sm:text-3xl">{title}</h1>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground">{description}</p>
      </div>
      {action}
    </header>
  );
}

import { createContext, useContext, type ReactNode } from "react";
import { useDriveStore } from "./drive-store";

type DriveContextValue = ReturnType<typeof useDriveStore>;

const DriveContext = createContext<DriveContextValue | null>(null);

export function DriveProvider({ children }: { children: ReactNode }) {
  const store = useDriveStore();
  return <DriveContext.Provider value={store}>{children}</DriveContext.Provider>;
}

export function useDrive() {
  const ctx = useContext(DriveContext);
  if (!ctx) throw new Error("useDrive must be used inside DriveProvider");
  return ctx;
}

import { ReactNode } from "react";

interface DashboardHeaderProps {
  title: string;
  subtitle: string;
  /** Optional button/link on the right (e.g. "Go to Favorites"). */
  action?: ReactNode;
  /** Current user — the chip is hidden when there is none. */
  user?: { name?: string | null } | null;
}

/** Page title + optional action + "Logged in as ..." chip. */
export default function DashboardHeader({
  title,
  subtitle,
  action,
  user,
}: DashboardHeaderProps) {
  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-base-content">{title}</h1>
          <p className="text-sm text-base-content/60">{subtitle}</p>
        </div>

        {action}
      </div>

      {user && (
        <div className="mb-4 flex items-center gap-2 text-sm text-base-content/70">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-base-200 text-base-content">
            {user.name?.charAt(0).toUpperCase() || "C"}
          </div>
          <span>Logged in as {user.name}</span>
        </div>
      )}
    </>
  );
}

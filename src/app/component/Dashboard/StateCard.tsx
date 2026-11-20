import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

type StateVariant = "default" | "loading" | "error";

interface StateCardProps {
  icon: LucideIcon;
  /** Heading — omit it for the loading state. */
  title?: string;
  description: string;
  /** Button or link under the text (login, browse, retry...). */
  action?: ReactNode;
  variant?: StateVariant;
}

const STYLES: Record<
  StateVariant,
  { card: string; icon: string; title: string }
> = {
  default: {
    card: "rounded-box border border-base-300 bg-base-100 p-12 text-center shadow-sm",
    icon: "mx-auto mb-4 h-12 w-12 text-base-content/20",
    title: "text-base-content",
  },
  loading: {
    card: "rounded-box border border-base-300 bg-base-100 p-12 text-center shadow-sm",
    icon: "mx-auto h-8 w-8 animate-spin text-primary",
    title: "text-base-content",
  },
  error: {
    card: "rounded-box border border-error/30 bg-error/5 p-8 text-center shadow-sm",
    icon: "mx-auto mb-4 h-8 w-8 text-error/60",
    title: "text-error",
  },
};

/** Shared card for loading / empty / error / login states on dashboard pages. */
export default function StateCard({
  icon: Icon,
  title,
  description,
  action,
  variant = "default",
}: StateCardProps) {
  const style = STYLES[variant];

  return (
    <div className={style.card}>
      <Icon className={style.icon} />

      {title && (
        <h3 className={`text-lg font-medium ${style.title}`}>{title}</h3>
      )}

      <p
        className={`text-sm text-base-content/60 ${title ? "mt-1" : ""}`}
      >
        {description}
      </p>

      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

import { Icon } from 'lucide-react';
import React from 'react';
import { cn } from "@/lib/utils";

type StatusPillProps = {
  label: string;
  value: number;
  icon: React.ElementType;
  color: string;
  dotColor: string;
};

const StatusPill = ({ label, value, icon: Icon, color, dotColor }: StatusPillProps) => {
    return (
        <div className={cn("rounded-xl border px-4 py-3 flex items-center justify-between", color)}>
      <div className="flex items-center gap-2">
        <div className={`h-6 w-6 rounded-full ${dotColor} flex items-center justify-center text-white text-[10px]`}>
          <Icon className="h-3 w-3" />
        </div>
        <p className="text-sm font-semibold">{label}</p>
      </div>
      <span className="text-sm font-bold">{value}</span>
    </div>
    );
};

export default StatusPill;
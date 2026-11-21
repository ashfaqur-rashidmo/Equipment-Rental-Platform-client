import { Icon } from 'lucide-react';
import React from 'react';
import { cn } from "@/lib/utils";


type StatCardProps = {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ElementType;
  iconColor?: string;
};



const StatcardHomeDashboard = ({ title, value, subtitle, icon: Icon, iconColor }: StatCardProps) => {
    return (
        <div className="rounded-xl border border-base-300 bg-base-100 p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-base-content/60 font-medium">{title}</p>
          <p className="mt-1 text-3xl font-bold">{value}</p>
          <p className={cn("text-xs font-medium mt-1", iconColor ?? "text-success")}>
            {subtitle}
          </p>
        </div>
        <div className="h-10 w-10 rounded-lg bg-base-200 flex items-center justify-center">
          <Icon className="h-5 w-5 text-base-content/60" />
        </div>
      </div>
    </div>
    );
};

export default StatcardHomeDashboard;
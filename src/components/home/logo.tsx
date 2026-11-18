import React from 'react';
import Link from 'next/link';
import { Forklift } from 'lucide-react';
import { siteConfig } from '@/config/site';

const Logo = () => {
    return (
         <Link href="/" className="flex items-center gap-2.5">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-content shadow-sm">
        <Forklift className="h-5 w-5" aria-hidden />
      </span>
      <span className="text-xl font-bold tracking-tight text-base-content">
        {siteConfig.name}
      </span>
    </Link>
    );
};

export default Logo;
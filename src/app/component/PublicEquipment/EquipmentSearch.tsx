
"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

interface SearchProps {
  initialSearch: string;
}

const EquipmentSearch = ({ initialSearch }: SearchProps) => {
  const [query, setQuery] = useState(initialSearch);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const params = new URLSearchParams(searchParams.toString());

    if (query.trim()) {
      params.set("search", query.trim());
    } else {
      params.delete("search");
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="mb-8 grid grid-cols-1 gap-4 rounded-box border border-base-300 bg-base-100 p-5 sm:grid-cols-2"
    >
      <div className="form-control sm:col-span-2">
        <label className="label">
          <span className="label-text font-medium">
            Search Equipment
          </span>
        </label>

        <div className="join w-full">
          <input
            type="text"
            placeholder="Search by equipment name or location..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="input input-bordered join-item w-full"
          />

          <button type="submit" className="btn btn-primary join-item">
            <Search size={18} />
            Search
          </button>
        </div>
      </div>
    </form>
  );
};

export default EquipmentSearch;

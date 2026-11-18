"use client";

import React from "react";
import { useSession } from "@/lib/auth-client";
import { Badge } from "@/components/ui/badge";
import { Heart, Eye, Trash2, Image as ImageIcon } from "lucide-react";
import Link from "next/link";

const favorites = [
  {
    id: "1",
    name: "Excavator CAT 320",
    category: "Construction",
    image:
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=400&q=80",
    pricePerDay: "$120/day",
    location: "Dhaka, Bangladesh",
    favoritedAt: "2026-11-10",
  },
  {
    id: "2",
    name: "DJI Mavic 3 Drone",
    category: "Photography",
    image:
      "https://images.unsplash.com/photo-1444436231540-804f065e3d72?auto=format&fit=crop&w=400&q=80",
    pricePerDay: "$45/day",
    location: "Chattogram, Bangladesh",
    favoritedAt: "2026-11-12",
  },
  {
    id: "3",
    name: "Portable Generator 5kW",
    category: "Equipment",
    image:
      "https://images.unsplash.com/photo-1590402342344-99599e8a10d9?auto=format&fit=crop&w=400&q=80",
    pricePerDay: "$35/day",
    location: "Sylhet, Bangladesh",
    favoritedAt: "2026-11-14",
  },
];

export default function FavoritesPage() {
  const { data: session } = useSession();
  const user = session?.user;

  const handleRemoveFavorite = (id: string) => {
    // UI only — no backend functionality wired
    console.log("Remove favorite:", id);
  };

  return (
    <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-base-content">Favorites</h1>
          <p className="text-sm text-base-content/60">
            Your saved equipment listings
          </p>
        </div>
        <Link
          href="/dashboard"
          className="btn btn-outline btn-sm"
        >
          <span>Back to My Rentals</span>
        </Link>
      </div>

      {user && (
        <div className="mb-4 flex items-center gap-2 text-sm text-base-content/70">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-base-200 text-base-content">
            {user.name?.charAt(0).toUpperCase() || "C"}
          </div>
          <span>Logged in as {user.name}</span>
        </div>
      )}

      {favorites.length === 0 ? (
        <div className="rounded-box border border-base-300 bg-base-100 p-12 text-center shadow-sm">
          <Heart className="mx-auto h-12 w-12 text-base-content/20 mb-4" />
          <h3 className="text-lg font-medium text-base-content">No favorites yet</h3>
          <p className="text-sm text-base-content/60 mt-1">
            Save equipment you like to find it easily later.
          </p>
          <Link
            href="/all-equipment"
            className="btn btn-primary btn-sm mt-4"
          >
            Browse Equipment
          </Link>
        </div>
      ) : (
        <div className="rounded-box border border-base-300 bg-base-100 shadow-sm">
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr className="text-base-content/60">
                  <th>Equipment</th>
                  <th>Category</th>
                  <th>Price/Day</th>
                  <th>Location</th>
                  <th>Favorited</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {favorites.map((item) => (
                  <tr key={item.id}>
                    <td className="flex items-center gap-3">
                      <div className="relative h-12 w-12 shrink-0">
                        <ImageIcon className="absolute h-full w-full object-cover rounded-lg" />
                        <img
                          // eslint-disable-next-line @next/next/no-img-element
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover rounded-lg"
                        />
                      </div>
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-xs text-base-content/50">{item.category}</div>
                      </div>
                    </td>
                    <td>{item.category}</td>
                    <td className="font-medium">{item.pricePerDay}</td>
                    <td>{item.location}</td>
                    <td className="text-sm text-base-content/60">
                      {item.favoritedAt}
                    </td>
                    <td className="flex gap-2">
                      <Link
                        href={`/all-equipment/${item.id}`}
                        className="btn btn-ghost btn-xs"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleRemoveFavorite(item.id)}
                        className="btn btn-ghost btn-xs text-destructive"
                        title="Remove Favorite"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

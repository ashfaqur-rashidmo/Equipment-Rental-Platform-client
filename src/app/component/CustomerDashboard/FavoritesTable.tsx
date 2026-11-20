import Link from "next/link";
import { Eye, Trash2, Loader2, Image as ImageIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Favorite } from "@/lib/api/favorites";
import { formatDate } from "@/lib/utils";

interface FavoritesTableProps {
  rows: Favorite[];
  /** Favorite currently being removed (shows a spinner on its button). */
  removingId: string | null;
  onRemove: (favoriteId: string) => void;
}

/** Saved equipment table with "View Details" and "Remove Favorite" actions. */
export default function FavoritesTable({
  rows,
  removingId,
  onRemove,
}: FavoritesTableProps) {
  return (
    <div className="rounded-box border border-base-300 bg-base-100 shadow-sm">
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr className="text-base-content/60">
              <th>Equipment</th>
              <th>Category</th>
              <th>Price</th>
              <th>Location</th>
              <th>Favorited</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((item) => {
              const equipment = item.equipment;
              const equipmentId = equipment?._id;

              return (
                <tr key={item._id}>
                  {/* Equipment */}
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-base-200">
                        {equipment?.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={equipment.image}
                            alt={equipment.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <ImageIcon className="absolute inset-0 m-auto h-5 w-5 text-base-content/40" />
                        )}
                      </div>

                      <div>
                        <div className="font-medium">
                          {equipment?.name || "Unavailable equipment"}
                        </div>
                        <div className="text-xs text-base-content/50">
                          {equipment?.category || "Listing removed"}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td>{equipment?.category || "—"}</td>

                  {/* Price */}
                  <td className="font-medium">
                    {equipment
                      ? `৳${Number(equipment.rentalPrice || 0).toLocaleString(
                          "en-US"
                        )}${
                          equipment.rentalType ? ` / ${equipment.rentalType}` : ""
                        }`
                      : "—"}
                  </td>

                  <td>{equipment?.location || "—"}</td>

                  <td className="text-sm text-base-content/60">
                    {formatDate(item.favoritedAt)}
                  </td>

                  {/* Actions */}
                  <td>
                    <div className="flex gap-2">
                      {equipmentId ? (
                        <Link
                          href={`/all-equipment/${equipmentId}`}
                          className="btn btn-ghost btn-xs"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                      ) : (
                        <span
                          className="btn btn-ghost btn-xs btn-disabled"
                          title="Listing no longer available"
                        >
                          <Eye className="h-4 w-4" />
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={() => onRemove(item._id)}
                        disabled={removingId === item._id}
                        className="btn btn-ghost btn-xs text-error"
                        title="Remove Favorite"
                      >
                        {removingId === item._id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex items-center gap-2 border-t border-base-300 px-4 py-3 text-xs text-base-content/50">
        <Badge variant="outline">{rows.length}</Badge>
        saved item{rows.length !== 1 ? "s" : ""}
      </div>
    </div>
  );
}

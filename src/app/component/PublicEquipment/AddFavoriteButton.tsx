
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { useSession } from "@/lib/auth-client";
import {
  AddFavorite,
  Favorite,
  GetFavorite,
  RemoveFavorite,
} from "@/lib/api/favorites";

interface AddFavoriteButtonProps {
  equipmentId: string;
}

/**
 * Heart toggle used on the equipment details page.
 * Guests are sent to the login page first.
 */
const AddFavoriteButton = ({ equipmentId }: AddFavoriteButtonProps) => {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const userId = session?.user?.id;

  const [favorite, setFavorite] = useState<Favorite | null>(null);
  const [busy, setBusy] = useState(false);

  // Is this equipment already saved by the current user?
  useEffect(() => {
    if (!userId || !equipmentId) return;

    let cancelled = false;

    GetFavorite(userId, equipmentId, session?.session?.token)
      .then((row) => {
        if (!cancelled) setFavorite(row);
      })
      .catch(() => {
        if (!cancelled) setFavorite(null);
      });

    return () => {
      cancelled = true;
    };
  }, [userId, equipmentId, session?.session?.token]);

  const isSaved = Boolean(favorite);

  const handleToggle = async () => {
    // Not logged in -> send to login
    if (!userId) {
      router.push("/login");
      return;
    }

    setBusy(true);

    try {
      if (favorite) {
        await RemoveFavorite(favorite._id, session?.session?.token);
        setFavorite(null);
        toast.success("Removed from favorites");
      } else {
        const created = await AddFavorite(
          userId,
          equipmentId,
          session?.session?.token
        );
        setFavorite(created);
        toast.success("Added to favorites");
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={busy || isPending}
      className={`btn w-full ${isSaved ? "btn-primary" : "btn-outline"}`}
      aria-pressed={isSaved}
    >
      <Heart size={16} className={isSaved ? "fill-current" : ""} />
      {busy ? "Please wait..." : isSaved ? "Saved to Favorites" : "Add to Favorites"}
    </button>
  );
};

export default AddFavoriteButton;

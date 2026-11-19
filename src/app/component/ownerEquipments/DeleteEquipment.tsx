
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface DeleteEquipmentProps {
  equipmentId: string;
  onDeleted: (equipmentId: string) => void;
}

export default function DeleteEquipment({
  equipmentId,
  onDeleted,
}: DeleteEquipmentProps) {
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      const API_BASE_URL =
        process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "");

      if (!API_BASE_URL) {
        throw new Error("API URL is not configured.");
      }

      setDeleting(true);

      const response = await fetch(
        `${API_BASE_URL}/equipment/${equipmentId}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to delete equipment."
        );
      }

      if (result.deletedCount === 0) {
        throw new Error("Equipment not found.");
      }

      toast.success("Equipment deleted successfully!");

      onDeleted(equipmentId);
      setOpen(false);
    } catch (error) {
      console.error("Delete equipment error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-error hover:bg-error/10"
          title="Delete Equipment"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete Equipment?</DialogTitle>

          <DialogDescription>
            Are you sure you want to delete this equipment?
            This action cannot be undone. The equipment listing
            will be permanently removed.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              disabled={deleting}
            >
              Cancel
            </Button>
          </DialogClose>

          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                Delete Equipment
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

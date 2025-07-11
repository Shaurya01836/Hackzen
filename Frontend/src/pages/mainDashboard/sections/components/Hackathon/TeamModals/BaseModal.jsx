"use client";

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "../../../../../../components/DashboardUI/alert-dialog";
import { X } from "lucide-react";
import { Children } from "react";

export default function BaseModal({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirm",
  onConfirm,
  triggerButton,
  content,
}) {
  return (
    <AlertDialog open={open ?? false} onOpenChange={onOpenChange}>
      {triggerButton ? (
        <AlertDialogTrigger asChild>
          {Children.only(triggerButton)}
        </AlertDialogTrigger>
      ) : null}

<AlertDialogContent className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999] max-w-md w-full rounded-md border bg-white p-6 shadow-xl">
        {/* ❌ Small cross button in top-right */}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        <AlertDialogHeader className="pr-6">
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description && (
            <AlertDialogDescription>{description}</AlertDialogDescription>
          )}
        </AlertDialogHeader>

        {content}

        {onConfirm && (
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onConfirm}>
              {confirmLabel}
            </AlertDialogAction>
          </AlertDialogFooter>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
}

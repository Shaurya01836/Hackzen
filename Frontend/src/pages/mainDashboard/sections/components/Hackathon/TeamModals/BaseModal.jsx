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
import { Children } from "react";

/**
 * BaseModal now accepts:
 * - triggerButton: JSX Element to open the modal
 * - content: JSX content inside the modal body (input, textarea, etc.)
 */
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
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      {triggerButton ? (
        <AlertDialogTrigger asChild>
          {Children.only(triggerButton)}
        </AlertDialogTrigger>
      ) : null}

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>

        {content}

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>{confirmLabel}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

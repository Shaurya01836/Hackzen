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

      <AlertDialogContent>
        <AlertDialogHeader>
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

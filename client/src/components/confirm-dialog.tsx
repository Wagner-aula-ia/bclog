import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertTriangle } from "lucide-react";

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "destructive";
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  variant = "default",
}: ConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent data-testid="confirm-dialog">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            {variant === "destructive" && (
              <AlertTriangle className="h-5 w-5 text-destructive" />
            )}
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose} data-testid="button-dialog-cancel">
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className={
              variant === "destructive"
                ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                : ""
            }
            data-testid="button-dialog-confirm"
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

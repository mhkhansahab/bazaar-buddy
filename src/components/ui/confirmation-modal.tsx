"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog";
import { AlertTriangle, X } from "lucide-react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "destructive";
  icon?: React.ReactNode;
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "default",
  icon
}: ConfirmationModalProps) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const getButtonVariant = () => {
    return variant === "destructive" ? "destructive" : "default";
  };

  const getIconColor = () => {
    return variant === "destructive" ? "text-red-500" : "text-blue-500";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="pb-4">
          <div className="flex items-start space-x-4">
            <div className={`flex-shrink-0 ${getIconColor()}`}>
              {icon || <AlertTriangle className="h-6 w-6" />}
            </div>
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-lg font-semibold text-gray-900">
                {title}
              </DialogTitle>
              <DialogDescription className="mt-2 text-sm text-gray-600">
                {description}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end space-y-2 space-y-reverse sm:space-y-0 sm:space-x-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="w-full sm:w-auto"
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            variant={getButtonVariant()}
            onClick={handleConfirm}
            className="w-full sm:w-auto"
          >
            {confirmText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Hook for easier usage
export function useConfirmationModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<{
    title: string;
    description: string;
    onConfirm: () => void;
    confirmText?: string;
    cancelText?: string;
    variant?: "default" | "destructive";
    icon?: React.ReactNode;
  } | null>(null);

  const openModal = (modalConfig: {
    title: string;
    description: string;
    onConfirm: () => void;
    confirmText?: string;
    cancelText?: string;
    variant?: "default" | "destructive";
    icon?: React.ReactNode;
  }) => {
    setConfig(modalConfig);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setConfig(null);
  };

  const ModalComponent = config ? (
    <ConfirmationModal
      isOpen={isOpen}
      onClose={closeModal}
      onConfirm={config.onConfirm}
      title={config.title}
      description={config.description}
      confirmText={config.confirmText}
      cancelText={config.cancelText}
      variant={config.variant}
      icon={config.icon}
    />
  ) : null;

  return {
    openModal,
    closeModal,
    ModalComponent
  };
}

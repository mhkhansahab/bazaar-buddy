"use client";

import { LogOut } from "lucide-react";
import { useConfirmationModal } from "@/components/ui/confirmation-modal";

export function useLogoutConfirmation(onLogout: () => void) {
  const { openModal, ModalComponent } = useConfirmationModal();

  const confirmLogout = () => {
    openModal({
      title: "Confirm Logout",
      description: "Are you sure you want to logout? You will need to sign in again to access your account.",
      confirmText: "Logout",
      cancelText: "Stay Signed In",
      variant: "destructive",
      icon: <LogOut className="h-6 w-6" />,
      onConfirm: onLogout
    });
  };

  return {
    confirmLogout,
    LogoutModalComponent: ModalComponent
  };
}

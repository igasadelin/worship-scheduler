"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import ConfirmSignOutModal from "./confirm-sign-out-modal";

export default function SignOutButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/90 transition backdrop-blur-md hover:border-white/20 hover:bg-white/10"
      >
        Sign out
      </button>

      <ConfirmSignOutModal
        open={open}
        onCancel={() => setOpen(false)}
        onConfirm={() => signOut({ callbackUrl: "/login" })}
      />
    </>
  );
}

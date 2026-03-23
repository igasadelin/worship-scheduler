"use client";

type ConfirmSignOutModalProps = {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmSignOutModal({
  open,
  onConfirm,
  onCancel,
}: ConfirmSignOutModalProps) {
  if (!open) return null;

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-zinc-900 p-6 shadow-2xl">
        <h2 className="text-xl font-semibold text-white mb-2">Sign out</h2>

        <p className="text-zinc-400 mb-6">
          Ești sigur că vrei să te deloghezi?
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10 transition"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-500/20 transition"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}

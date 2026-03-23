"use client";

type ConfirmSubmitButtonProps = {
  children: React.ReactNode;
  message: string;
  className?: string;
};

export default function ConfirmSubmitButton({
  children,
  message,
  className,
}: ConfirmSubmitButtonProps) {
  return (
    <button
      type="submit"
      className={className}
      onClick={(e) => {
        const ok = window.confirm(message);

        if (!ok) {
          e.preventDefault();
        }
      }}
    >
      {children}
    </button>
  );
}

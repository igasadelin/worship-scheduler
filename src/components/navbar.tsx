"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SignOutButton from "./sign-out-button";

type NavbarProps = {
  role?: "ADMIN" | "MEMBER";
};

export default function Navbar({ role = "MEMBER" }: NavbarProps) {
  const pathname = usePathname();

  function isActive(path: string) {
    if (path === "/admin") {
      return pathname === "/admin";
    }

    return pathname.startsWith(path);
  }

  function linkClass(active: boolean) {
    return [
      "rounded-2xl border px-4 py-2 text-sm font-medium transition backdrop-blur-md",
      active
        ? "border-white/20 bg-white/12 text-white shadow-[0_0_0_1px_rgba(255,255,255,0.04)]"
        : "border-white/10 bg-white/5 text-white/90 hover:bg-white/10 hover:border-white/20",
    ].join(" ");
  }

  const memberLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/events", label: "Events" },
    { href: "/dashboard/blackouts", label: "Blackouts" },
  ];

  const adminLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/events", label: "Events" },
    { href: "/dashboard/blackouts", label: "Blackouts" },
    { href: "/admin", label: "Admin" },
  ];

  const links = role === "ADMIN" ? adminLinks : memberLinks;

  return (
    <div className="page-container" style={{ paddingBottom: 0 }}>
      <div
        className="glass-card"
        style={{
          padding: 18,
          display: "flex",
          flexDirection: "column",
          gap: 16,
          borderRadius: 28,
          background:
            "linear-gradient(180deg, rgba(24,24,27,0.88), rgba(24,24,27,0.70))",
          boxShadow:
            "0 12px 40px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.04)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            minWidth: 0,
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 18,
              display: "grid",
              placeItems: "center",
              border: "1px solid rgba(255,255,255,0.08)",
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.03))",
              overflow: "hidden",
              flexShrink: 0,
              boxShadow: "0 6px 24px rgba(0,0,0,0.18)",
            }}
          >
            <Image
              src="/logo.png"
              alt="Logo"
              width={32}
              height={32}
              style={{ objectFit: "contain" }}
            />
          </div>

          <div style={{ minWidth: 0 }}>
            <div
              className="brand-title"
              style={{
                fontSize: 18,
                fontWeight: 700,
                lineHeight: 1.1,
              }}
            >
              Aldești Worship
            </div>
            <div
              className="brand-subtitle"
              style={{
                marginTop: 4,
                color: "rgba(255,255,255,0.68)",
                fontSize: 15,
              }}
            >
              Scheduling Platform
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            alignItems: "center",
          }}
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={linkClass(isActive(link.href))}
            >
              {link.label}
            </Link>
          ))}

          <SignOutButton />
        </div>
      </div>
    </div>
  );
}

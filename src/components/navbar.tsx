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
      "rounded-2xl border px-4 py-2 text-sm font-medium transition",
      active
        ? "border-white/20 bg-white/10 text-white"
        : "border-white/10 bg-white/5 text-white hover:bg-white/10",
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
        className="topbar"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          gap: 16,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            minWidth: 0,
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 16,
              display: "grid",
              placeItems: "center",
              border: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(255,255,255,0.04)",
              overflow: "hidden",
              flexShrink: 0,
            }}
          >
            <Image
              src="/logo.png"
              alt="Logo"
              width={28}
              height={28}
              style={{ objectFit: "contain" }}
            />
          </div>

          <div>
            <div className="brand-title">Aldești Worship</div>
            <div className="brand-subtitle">Scheduling Platform</div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
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

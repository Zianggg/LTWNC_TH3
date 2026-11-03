"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const ORDER = ["system", "light", "dark"] as const;
type ThemeChoice = (typeof ORDER)[number];

const LABELS: Record<ThemeChoice, string> = { system: "Tự động", light: "Sáng", dark: "Tối" };
const ICONS = { system: Monitor, light: Sun, dark: Moon } satisfies Record<ThemeChoice, unknown>;

// Một nút xoay vòng Tự động → Sáng → Tối, gọn đủ cho hàng header trên điện thoại.
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Server không biết lựa chọn đã lưu: giữ chỗ cùng kích thước tới khi hydrate xong.
  if (!mounted) return <span className="inline-block size-10 sm:size-8" aria-hidden="true" />;

  const current: ThemeChoice = ORDER.includes(theme as ThemeChoice) ? (theme as ThemeChoice) : "system";
  const next = ORDER[(ORDER.indexOf(current) + 1) % ORDER.length];
  const Icon = ICONS[current];
  const label = `Giao diện: ${LABELS[current]}. Bấm để chuyển sang ${LABELS[next]}`;

  return (
    <Button type="button" variant="ghost" size="icon" onClick={() => setTheme(next)} aria-label={label} title={label} className="max-sm:size-10">
      <Icon aria-hidden="true" />
    </Button>
  );
}

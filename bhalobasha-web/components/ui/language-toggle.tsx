"use client";

import { Languages } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/components/providers/intl-provider";

export function LanguageToggle() {
  const { locale, setLocale } = useLocale();
  const isBangla = locale === "bn";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Languages className="h-4 w-4" />
          <span className="min-w-8 text-center font-medium">
            {isBangla ? "BN" : "EN"}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onSelect={() => setLocale("en")}>English</DropdownMenuItem>
        <DropdownMenuItem onSelect={() => setLocale("bn")}>বাংলা</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

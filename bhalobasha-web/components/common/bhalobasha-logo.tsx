import Link from "next/link";

type BhalobashaLogoProps = {
  href?: string;
  className?: string;
};

export function BhalobashaLogo({ href = "/", className }: BhalobashaLogoProps) {
  return (
    <Link href={href} className={`flex items-center gap-2 ${className ?? ""}`}>
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-xs font-bold text-white sm:h-9 sm:w-9 sm:text-sm">
        ভা
      </div>
      <div className="leading-tight">
        <span className="block text-base font-bold text-primary sm:text-lg">
          Bhalobasha
        </span>
        <span className="block text-[10px] text-muted sm:text-xs">
          ভালোবাসা
        </span>
      </div>
    </Link>
  );
}

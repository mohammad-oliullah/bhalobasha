import { Home } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

export function CtaBanner() {
  const t = useTranslations("home");

  return (
    <section className="bg-primary px-4 py-12 text-center text-primary-foreground">
      <Home className="mx-auto mb-4 h-10 w-10" />
      <h2 className="text-2xl font-bold">{t("haveProperty")}</h2>
      <p className="mt-2 opacity-90">{t("listYourProperty")}</p>
      <Button
        asChild
        variant="secondary"
        size="lg"
        className="mt-6 bg-card text-primary hover:bg-card/90"
      >
        <a href="/dashboard/listings/new">{t("postListingAction")}</a>
      </Button>
    </section>
  );
}

import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CtaBanner() {
  return (
    <section className="bg-primary px-4 py-12 text-center text-white">
      <Home className="mx-auto mb-4 h-10 w-10" />
      <h2 className="text-2xl font-bold">Have a property to rent?</h2>
      <p className="mt-2 opacity-90">List your flat, room, or mess for free</p>
      <Button
        asChild
        variant="secondary"
        size="lg"
        className="mt-6 bg-white text-primary hover:bg-white/90"
      >
        <a href="/dashboard/listings/new">Post a Listing</a>
      </Button>
    </section>
  );
}

import { Suspense } from "react";
import ListingsPage from "./listings-page";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-muted">Loading...</div>}>
      <ListingsPage />
    </Suspense>
  );
}

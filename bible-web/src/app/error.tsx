"use client";

import { useEffect } from "react";
import { Button } from "@/components/common/Button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="space-y-4 rounded-xl border border-red-300 bg-red-50 p-6">
      <h1 className="text-2xl font-semibold text-red-700">Something went wrong</h1>
      <p className="text-sm text-red-700">{error.message || "Unexpected application error."}</p>
      <Button type="button" onClick={reset}>
        Try again
      </Button>
    </section>
  );
}

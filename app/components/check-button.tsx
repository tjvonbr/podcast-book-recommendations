"use client";

import { useCallback, useState } from "react";

export default function CheckButton() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onClick = useCallback(async () => {
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const res = await fetch("/api/check", { cache: "no-store" });
      const json = await res.json();
      if (!res.ok || json.ok === false) {
        throw new Error(json.error || `Request failed: ${res.status}`);
      }
      setResult(`New episodes: ${json.newCount}`);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Unknown error";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div className="flex flex-col gap-2 items-center sm:items-start">
      <button
        onClick={onClick}
        disabled={loading}
        className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
      >
        {loading ? "Checking…" : "Check podcast feed"}
      </button>
      {result && <span className="text-sm text-green-700 dark:text-green-400">{result}</span>}
      {error && <span className="text-sm text-red-700 dark:text-red-400">{error}</span>}
    </div>
  );
}



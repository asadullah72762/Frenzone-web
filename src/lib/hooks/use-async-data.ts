"use client";

import { useEffect, useState } from "react";

interface AsyncDataState<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useAsyncData<T>(
  fetcher: () => Promise<T> | T,
  deps: unknown[] = [],
  simulatedDelayMs = 600
): AsyncDataState<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [trigger, setTrigger] = useState(0);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setError(null);

    const timer = setTimeout(async () => {
      try {
        const result = await fetcher();
        if (isMounted) {
          setData(result);
          setIsLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error(String(err)));
          setIsLoading(false);
        }
      }
    }, simulatedDelayMs);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [...deps, trigger]);

  const refetch = () => setTrigger((prev) => prev + 1);

  return { data, isLoading, error, refetch };
}

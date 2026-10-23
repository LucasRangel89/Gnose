"use client";

import { useEffect, useRef, useState } from "react";
import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { SessionProvider, useSession } from "next-auth/react";
import { ThemeProvider } from "next-themes";

function UserCacheBoundary({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const userId = session?.user?.id ?? "local";
  const previousUserId = useRef(userId);

  useEffect(() => {
    if (previousUserId.current !== userId) {
      queryClient.clear();
      previousUserId.current = userId;
    }
  }, [queryClient, userId]);

  return children;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60_000,
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      }),
  );

  const staticReadOnly = process.env.NEXT_PUBLIC_GITHUB_PAGES === "true";

  return (
    <SessionProvider session={staticReadOnly ? null : undefined} refetchInterval={0}>
      <QueryClientProvider client={queryClient}>
        {staticReadOnly ? (
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
            {children}
          </ThemeProvider>
        ) : (
          <UserCacheBoundary>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
              {children}
            </ThemeProvider>
          </UserCacheBoundary>
        )}
      </QueryClientProvider>
    </SessionProvider>
  );
}

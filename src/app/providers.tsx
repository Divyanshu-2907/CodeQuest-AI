"use client";

import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import React from "react";

if (typeof window !== "undefined") {
  const token = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com";

  if (token) {
    posthog.init(token, {
      api_host: host,
      person_profiles: 'identified_only',
      capture_pageview: true
    });
  } else {
    // Fail-safe mock if token is missing so app doesn't crash
    console.warn("PostHog project token is missing. Analytics is running in mock mode.");
  }
}

export function PHProvider({ children }: { children: React.ReactNode }) {
  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}

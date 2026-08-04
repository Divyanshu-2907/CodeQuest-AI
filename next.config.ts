import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  /* config options here */
  // Forced restart to clear Next.js cache
};

export default withSentryConfig(nextConfig, {
  org: "codequest-ai",
  project: "codequest-ai",
  silent: true,
  widenClientFileUpload: true,
  automaticVercelMonitors: true,
});

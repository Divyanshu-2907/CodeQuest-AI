import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  /* config options here */
};

export default withSentryConfig(nextConfig, {
  org: "codequest-ai",
  project: "codequest-ai",
  silent: true,
  widenClientFileUpload: true,
  automaticVercelMonitors: true,
});

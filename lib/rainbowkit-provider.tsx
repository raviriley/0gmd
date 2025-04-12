"use client";

import { RainbowKitProvider, getDefaultConfig } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { zeroG } from "../lib/chains";
import { ReactNode } from "react";

// Create a new query client
const queryClient = new QueryClient();

// Prepare wagmi+rainbowkit config
const config = getDefaultConfig({
  appName: "0G MD",
  projectId: "YOUR_PROJECT_ID", // Replace with your WalletConnect project ID
  chains: [zeroG as any],
});

export function RainbowKitProviderWrapper({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider modalSize="compact">{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

import { http, createStorage, cookieStorage } from "wagmi";
import { sepolia, bscTestnet, blastSepolia } from "wagmi/chains";
import { Chain, getDefaultConfig } from "@rainbow-me/rainbowkit";
import * as dotenv from "dotenv";
console.log("Loading environment variables...");
dotenv.config({ path: "certificate/.env" });
console.log("Environment variables loaded:", process.env);
console.log("PROJECT_ID:", process.env.PROJECT_ID);
const opencampus: Chain = {
  id: 656476,
  name: "Open Campus Codex",
  nativeCurrency: {
    name: "Open Campus",
    symbol: "EDU",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.open-campus-codex.gelato.digital"],
    },
    public: {
      http: ["https://rpc.open-campus-codex.gelato.digital"],
    },
  },
  blockExplorers: {
    default: {
      name: "Open Campus Codex Explorer",
      url: "https://opencampus-codex.blockscout.com",
    },
  },
  testnet: true,
};

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID || "";

const supportedChains: Chain[] = [
  sepolia,
  bscTestnet,
  blastSepolia,
  opencampus,
];

export const config = getDefaultConfig({
  appName: "WalletConnection",
  projectId,
  chains: supportedChains as any,
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
  transports: supportedChains.reduce(
    (obj, chain) => ({ ...obj, [chain.id]: http() }),
    {}
  ),
});

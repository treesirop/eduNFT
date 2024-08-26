'use client';

import { http, createStorage, cookieStorage } from 'wagmi'
import { sepolia, bscTestnet, blastSepolia } from 'wagmi/chains'
import { Chain, getDefaultConfig } from '@rainbow-me/rainbowkit'

const customChain: Chain = {
   id: 656476,
   name: 'Open Campus Codex',
   nativeCurrency: {
     name: 'Open Campus',
     symbol: 'EDU',
     decimals: 18,
   },
   rpcUrls: {
     default: {
       http: ['https://rpc.open-campus-codex.gelato.digital'],
     },
     public: {
       http: ['https://rpc.open-campus-codex.gelato.digital'],
     },
   },
   blockExplorers: {
     default: {
       name: 'Open Campus Codex Explorer',
       url: 'https://opencampus-codex.blockscout.com',
     },
   },
   testnet: true,
   custom: {
     settlementLayer: 'Arbitrum Sepolia 421614',
   },
 };

const projectId = 'bc94ee6ebbca89c09b454734c8b29313';

const supportedChains: Chain[] = [sepolia, bscTestnet, blastSepolia,customChain];

export const config = getDefaultConfig({
   appName: 'WalletConnection',
   projectId,
   chains: supportedChains as any,
   ssr: true,
   storage: createStorage({
    storage: cookieStorage,
   }),
  transports: supportedChains.reduce((obj, chain) => ({ ...obj, [chain.id]: http() }), {})
 });
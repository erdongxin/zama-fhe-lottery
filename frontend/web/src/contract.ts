// contract.ts
import { ethers } from "ethers";
import abiJson from "./abi/Lottery.json";
import config from "./config.json";

export const ABI = (abiJson as any).abi || abiJson;

export async function getProvider() {
  // if user has MetaMask, we'll use it when connecting
  if ((window as any).ethereum) {
    const p = new ethers.BrowserProvider((window as any).ethereum);
    return p;
  }
  // fallback to public rpc
  return new ethers.JsonRpcProvider(config.network);
}

// get a read-only contract (provider based)
export async function getContractReadOnly() {
  const provider = await getProvider();
  return new ethers.Contract(config.contractAddress, ABI, provider);
}

// get a contract connected to signer (for write)
export async function getContractWithSigner() {
  if (!(window as any).ethereum) throw new Error("No injected wallet");
  const provider = new ethers.BrowserProvider((window as any).ethereum);
  const signer = await provider.getSigner();
  return new ethers.Contract(config.contractAddress, ABI, signer);
}

// helper: format address lowercase
export function normAddr(a: string) { return a ? a.toLowerCase() : a; }

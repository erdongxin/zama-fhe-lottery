import { ethers as EthersT } from "ethers";
export declare function defaultWallets(initialIndex: number, count: number, path: string, mnemonic?: string, provider?: EthersT.Provider | null): EthersT.HDNodeWallet[];
export declare function defaultWalletsAsMap(initialIndex: number, count: number, path: string, mnemonic?: string, provider?: EthersT.Provider | null): Map<string, EthersT.HDNodeWallet>;
export declare function walletFromMnemonic(index: number, phrase: string, path: string, provider: EthersT.Provider | null): EthersT.HDNodeWallet;
export declare function walletsFromPrivateKeys(privateKeys: string[], addresses?: string[], provider?: EthersT.Provider): {
    wallets: EthersT.Wallet[];
    ignoredPrivateKeys: string[];
};
//# sourceMappingURL=wallet.d.ts.map
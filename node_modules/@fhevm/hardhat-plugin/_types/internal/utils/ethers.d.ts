import { BytesLike, ethers as EthersT } from "ethers";
export declare function assertSignersMatchAddresses(signers: EthersT.Signer[], addresses: string[]): Promise<void>;
export declare function extractEVMErrorData(e: unknown): {
    data: BytesLike;
    txHash: string;
} | undefined;
//# sourceMappingURL=ethers.d.ts.map
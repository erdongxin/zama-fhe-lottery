import type { FhevmDB, FhevmDBEntry, FhevmDBHandleMetadata } from "./FhevmDB.js";
export declare class FhevmDBMap implements FhevmDB {
    #private;
    constructor();
    incRand(): void;
    get randomCounter(): number;
    get fromBlockNumber(): number;
    get countHandles(): number;
    private _get;
    init(fromBlockNumber: number): Promise<boolean>;
    /**
     * Reset can be usefull to test deterministic handles like trivialEncrypt.
     */
    reset(): Promise<void>;
    private _insertHandleBytes32;
    private _queryHandleBytes32;
    insertHandleBytes32(handleBytes32Hex: string, clearText: bigint | string, metadata: FhevmDBHandleMetadata, options?: {
        replace?: boolean;
    }): Promise<void>;
    queryHandleBytes32(handleBytes32Hex: string): Promise<FhevmDBEntry>;
    tryInsertHandleBytes32(handleBytes32Hex: string, clearText: bigint | string, metadata: FhevmDBHandleMetadata, options?: {
        replace?: boolean;
    }): Promise<boolean>;
    tryQueryHandleBytes32(handleBytes32Hex: string): Promise<FhevmDBEntry | undefined>;
}
//# sourceMappingURL=FhevmDBMap.d.ts.map
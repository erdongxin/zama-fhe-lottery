import type { FhevmDBEntry, FhevmDBHandleMetadata } from "./FhevmDB.js";
export declare function checkInsertArgs(handleBytes32Hex: string, clearText: bigint | string, metadata: FhevmDBHandleMetadata): void;
export declare function checkQueryArgs(handleBytes32Hex: string): void;
export declare function fhevmDBEntryToString(entry: FhevmDBEntry): string;
export declare function stringToFhevmDBEntry(str: string): FhevmDBEntry;
//# sourceMappingURL=utils.d.ts.map
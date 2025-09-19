export declare function uint8ArrayToHexNoPrefix(uint8Array: Uint8Array): string;
export declare function numberToHexNoPrefix(num: number): string;
export declare function numberToEvenHexString(num: number): string;
export declare const fromHexString: (hexString: string) => Uint8Array;
export declare const toHexString: (bytes: Uint8Array) => `0x${string}`;
export declare function assertIsHexString(value: unknown, valueName?: string): asserts value is string;
//# sourceMappingURL=hex.d.ts.map
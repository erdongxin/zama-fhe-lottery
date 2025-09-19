export declare function assertFhevm(check: unknown, message?: string): asserts check;
export declare function assertFhevmFailed(message?: string): never;
export declare function assertIsArray(value: unknown, valueName?: string): asserts value is string;
export declare function assertIsArrayProperty<K extends string>(value: unknown, propertyNames: K[], typeName?: string): asserts value is {
    [P in K]: any[];
};
export declare function assertUint8ArrayDeepEqual(a1: Uint8Array, a2: Uint8Array): void;
export declare function assertArrayOfUint8ArrayDeepEqual(a1: Uint8Array[], a2: Uint8Array[]): void;
export declare function assertIsObjectProperty<K extends string>(value: unknown, propertyNames: K[], typeName?: string): asserts value is {
    [P in K]: any[];
};
export declare class FhevmError extends Error {
    private readonly __isFhevmError;
    constructor(message?: string, options?: ErrorOptions);
}
export declare function isHardhatProviderError(other: any): other is Error & {
    code: number;
};
export declare function isHardhatError(other: any): other is Error & {
    number: number;
};
//# sourceMappingURL=error.d.ts.map
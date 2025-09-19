import { type MinimalProvider } from "./provider.js";
/**
 * Determines if a given provider is an Hardhat instance.
 *
 * @param provider - A `MinimalProvider` that supports either `send` or `request` for RPC interaction.
 * @returns A promise that resolves to one of the following:
 * - `{ isHardhat: true, chainId: number }` if the provider is reachable and reports an Hardhat client.
 * - `{ isHardhat: false }` if the provider is reachable but does not report an Hardhat client.
 * - `{ couldNotConnect: true }` if the provider is unreachable (e.g. connection refused, timeout).
 *
 * @throws If the provider fails in an unexpected way the function will propagate the error.
 */
export declare function isHardhatProvider(provider: MinimalProvider): Promise<{
    couldNotConnect: true;
    isHardhat?: undefined;
    chainId?: undefined;
} | {
    couldNotConnect: false;
    isHardhat: true;
    chainId: number;
} | {
    couldNotConnect: false;
    isHardhat: false;
}>;
//# sourceMappingURL=hardhat.d.ts.map
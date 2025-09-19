import { type MinimalProvider } from "./provider.js";
/**
 * Executes the `anvil_nodeInfo` RPC call on a given provider.
 * @param provider - A `MinimalProvider` that supports either `send` or `request` for RPC interaction.
 * @returns A promise that resolves to the RPC call response.
 */
export declare function anvilNodeInfo(provider: MinimalProvider): Promise<any>;
/**
 * Determines if a given provider is an Anvil instance.
 *
 * @param provider - A `MinimalProvider` that supports either `send` or `request` for RPC interaction.
 * @returns A promise that resolves to one of the following:
 * - `{ isAnvil: true, chainId: number }` if the provider is reachable and reports an Anvil client.
 * - `{ isAnvil: false }` if the provider is reachable but does not report an Anvil client.
 * - `{ couldNotConnect: true }` if the provider is unreachable (e.g. connection refused, timeout).
 *
 * @throws If the provider fails in an unexpected way the function will propagate the error.
 */
export declare function isAnvilProvider(provider: MinimalProvider): Promise<{
    couldNotConnect: true;
    isAnvil?: undefined;
    chainId?: undefined;
} | {
    couldNotConnect: false;
    isAnvil: true;
    chainId: number;
} | {
    couldNotConnect: false;
    isAnvil: false;
}>;
//# sourceMappingURL=anvil.d.ts.map
import { ethers as EthersT } from "ethers";
export interface MinimalEthereumProvider {
    send(method: string, params: any[]): Promise<any>;
}
/**
 * A minimal provider abstraction that represents any Ethereum-compatible provider
 * capable of sending JSON-RPC requests.
 *
 * This can be either:
 * - An EIP-1193-compliant provider (e.g., `ethers.Eip1193Provider`)
 * - A lower-level provider interface (e.g., `ethers.JsonRpcApiProvider`) that exposes a `send` method
 * - A custom provider interface (e.g. `HardhatEthersProvider`)
 *
 * Used to generalize RPC interactions without relying on full `ethers.js` provider features.
 */
export type MinimalProvider = MinimalEthereumProvider | EthersT.Eip1193Provider;
/**
 * Sends a JSON-RPC request using a minimal Ethereum-compatible provider.
 *
 * This function abstracts over both `EIP-1193`-style providers (which implement `request({ method, params })`)
 * and legacy or lower-level providers (which implement `send(method, params)`), such as Hardhat or
 * custom ethers.js providers.
 *
 * It attempts to call `send()` first (commonly found in Hardhat or JsonRpcApiProvider), and falls back to
 * `request()` if `send` is not available.
 *
 * @param provider - A `MinimalProvider` that supports either `send` or `request` for RPC interaction.
 * @param method - The name of the JSON-RPC method to invoke (e.g. `"eth_getBalance"`).
 * @param params - An array of parameters to pass to the RPC method.
 * @returns A Promise resolving to the JSON-RPC result.
 *
 * @throws {FhevmError} If the provider does not implement a compatible RPC interface.
 */
export declare function minimalProviderSend(provider: MinimalProvider, method: string, params: any[]): Promise<any>;
/**
 * Retrieves the `chainId` from a given Ethereum provider.
 *
 * Attempts to query the provider using `eth_chainId`. If the provider is unreachable
 * (e.g., connection refused), the function returns `undefined`. For all other
 * unexpected failures (e.g., malformed response, internal provider error), the function throws.
 *
 * @param provider - A `MinimalProvider` that supports either `send` or `request` for RPC interaction.
 *
 * @returns A promise resolving to:
 * - The `chainId` as a number if the provider is reachable and responds correctly.
 * - `undefined` if the provider is unreachable (network failure).
 *
 * @throws If the provider responds unexpectedly or fails.
 */
export declare function connectedChainId(provider: MinimalProvider): Promise<number | undefined>;
/**
 * Retrieves the `chainId` from a given Ethereum provider using `eth_chainId` RPC call.
 * @param provider - A `MinimalProvider` that supports either `send` or `request` for RPC interaction.
 * @returns A promise that resolves to the chain ID as a number.
 */
export declare function getProviderChainId(provider: MinimalProvider): Promise<number | undefined>;
/**
 * Retrieves the web3 client version from a given Ethereum provider.
 *
 * @returns A promise that resolves to one of the following:
 * - `{ client: any, couldNotConnect: false }` if the provider is reachable web3 client.
 * - `{ client: undefined, couldNotConnect: false }` if the provider is reachable but is not a valid web3 client.
 * - `{ client: undefined, couldNotConnect: true }` if the provider is unreachable.
 *
 * @throws If the provider fails in an unexpected way the function will propagate the error.
 */
export declare function connectedWeb3Client(provider: MinimalProvider): Promise<{
    client: any;
    couldNotConnect: boolean;
}>;
/**
 * Executes the `web3_clientVersion` RPC call on a given provider.
 * @param provider - A `MinimalProvider` that supports either `send` or `request` for RPC interaction.
 * @returns A promise that resolves to the RPC call response.
 */
export declare function getWeb3ClientVersion(provider: MinimalProvider): Promise<any>;
export declare function getSignerChainId(signer: EthersT.Signer): Promise<number>;
export declare function canSign(obj: any): boolean;
export declare function isReadonlyContract(contract: EthersT.BaseContract): boolean;
export declare function isReadonlyProvider(obj: any): obj is EthersT.Provider;
//# sourceMappingURL=provider.d.ts.map
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { FhevmProvider } from "../types";
/**
 * Validates the current `HardhatRuntimeEnvironment` hre object to ensure that
 * essential Hardhat plugins and provider bindings are correctly configured.
 *
 * Specifically:
 * - Verifies that the `@nomicfoundation/hardhat-ethers` plugin is loaded.
 * - Checks consistency between `hre.ethers.provider` and `hre.network.provider`.
 *
 * @param hre - The `HardhatRuntimeEnvironment` object
 * @throws Will throw an error if:
 * - The `@nomicfoundation/hardhat-ethers` plugin is not loaded.
 * - The `hre.ethers.provider` object is inconsistent with the `hre.network.provider` object.
 */
export declare function checkHardhatRuntimeEnvironment(hre: HardhatRuntimeEnvironment): void;
export declare function computeDummyAddress(): string;
export declare function resolveNetworkConfigChainId(hre: HardhatRuntimeEnvironment, useEthChainId: boolean): Promise<number>;
export declare function getWeb3ClientVersion(provider: FhevmProvider): Promise<any>;
export declare function isHardhatNode(networkName: string, chainId: number | undefined, provider: FhevmProvider): Promise<boolean>;
export declare function checkSupportedNetwork(hre: HardhatRuntimeEnvironment): Promise<true | undefined>;
//# sourceMappingURL=hh.d.ts.map
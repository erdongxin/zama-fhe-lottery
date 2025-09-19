import { HardhatRuntimeEnvironment } from "hardhat/types";
export declare function isSolidityCoverageRunning(hre: HardhatRuntimeEnvironment): boolean;
/**
 * Check if not enough gas when using solidity-coverage
 * Fix: `SOLIDITY_COVERAGE=true npx hardhat coverage`
 * or set hre.config.networks.hardhat.blockGasLimit.
 */
export declare function checkSolidityCoverageSettings(hre: HardhatRuntimeEnvironment): Promise<void>;
//# sourceMappingURL=solidityCoverage.d.ts.map
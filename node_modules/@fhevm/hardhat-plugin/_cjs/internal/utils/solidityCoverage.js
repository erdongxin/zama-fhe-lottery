"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSolidityCoverageRunning = isSolidityCoverageRunning;
exports.checkSolidityCoverageSettings = checkSolidityCoverageSettings;
const error_1 = require("../../error");
const log_1 = require("./log");
function isSolidityCoverageRunning(hre) {
    return "__SOLIDITY_COVERAGE_RUNNING" in hre ? hre.__SOLIDITY_COVERAGE_RUNNING === true : false;
}
function _getHardhatNetworkForSolidityCoverage() {
    const nomiclabsUtilsId = "solidity-coverage/plugins/resources/nomiclabs.utils";
    const apiId = "solidity-coverage/api";
    try {
        const { configureHardhatEVMGas } = require(nomiclabsUtilsId);
        const SolidityCoverageAPI = require(apiId);
        const api = new SolidityCoverageAPI({});
        const hardhatNetworkForCoverage = {};
        configureHardhatEVMGas(hardhatNetworkForCoverage, api);
        if (!("allowUnlimitedContractSize" in hardhatNetworkForCoverage) ||
            typeof hardhatNetworkForCoverage.allowUnlimitedContractSize !== "boolean") {
            return undefined;
        }
        if (!("blockGasLimit" in hardhatNetworkForCoverage) ||
            typeof hardhatNetworkForCoverage.blockGasLimit !== "number") {
            return undefined;
        }
        if (!("gas" in hardhatNetworkForCoverage) || typeof hardhatNetworkForCoverage.gas !== "number") {
            return undefined;
        }
        if (!("gasPrice" in hardhatNetworkForCoverage) || typeof hardhatNetworkForCoverage.gasPrice !== "number") {
            return undefined;
        }
        if (!("initialBaseFeePerGas" in hardhatNetworkForCoverage) ||
            typeof hardhatNetworkForCoverage.initialBaseFeePerGas !== "number") {
            return undefined;
        }
        return hardhatNetworkForCoverage;
    }
    catch {
        return undefined;
    }
}
async function checkSolidityCoverageSettings(hre) {
    if (!isSolidityCoverageRunning(hre)) {
        return;
    }
    if ("SOLIDITY_COVERAGE" in process.env && process.env["SOLIDITY_COVERAGE"] === "true") {
        return;
    }
    const hardhatNetworkForCoverage = _getHardhatNetworkForSolidityCoverage();
    if (!hardhatNetworkForCoverage) {
        const message = `You are trying to run hardhat using solidity coverage without proper setup.
To solve the problem set SOLIDITY_COVERAGE env variable to 'true':

  SOLIDITY_COVERAGE=true npx hardhat coverage`;
        (0, log_1.logBox)("Wrong Hardhat Network Config for Solidity Coverage.", message, { out: "stderr" });
        throw new error_1.HardhatFhevmError("Wrong hardhat network config for solidity coverage.");
    }
    const blockGasLimit = (await hre.ethers.provider.getBlock("latest"))?.gasLimit;
    let validHardhatNetworkUserConfig = true;
    let actions = "";
    if (hre.userConfig.networks?.hardhat?.allowUnlimitedContractSize !==
        hardhatNetworkForCoverage.allowUnlimitedContractSize) {
        actions += `   - hre.config.networks.hardhat.allowUnlimitedContractSize = ${hardhatNetworkForCoverage.allowUnlimitedContractSize}\n`;
        validHardhatNetworkUserConfig = false;
    }
    if (blockGasLimit !== BigInt(hardhatNetworkForCoverage.blockGasLimit)) {
        actions += `   - hre.config.networks.hardhat.blockGasLimit = 0x${hardhatNetworkForCoverage.blockGasLimit.toString(16)}\n`;
        validHardhatNetworkUserConfig = false;
    }
    if (hre.userConfig.networks?.hardhat?.gas !== hardhatNetworkForCoverage.gas) {
        actions += `   - hre.config.networks.hardhat.gas = 0x${hardhatNetworkForCoverage.gas.toString(16)}\n`;
        validHardhatNetworkUserConfig = false;
    }
    if (hre.userConfig.networks?.hardhat?.gasPrice !== hardhatNetworkForCoverage.gasPrice) {
        actions += `   - hre.config.networks.hardhat.gasPrice = ${hardhatNetworkForCoverage.gasPrice}\n`;
        validHardhatNetworkUserConfig = false;
    }
    if (hre.userConfig?.networks?.hardhat?.initialBaseFeePerGas !== hardhatNetworkForCoverage.initialBaseFeePerGas) {
        actions += `   - hre.config.networks.hardhat.initialBaseFeePerGas = ${hardhatNetworkForCoverage.initialBaseFeePerGas}\n`;
        validHardhatNetworkUserConfig = false;
    }
    if (validHardhatNetworkUserConfig) {
        return;
    }
    const message = `You are running hardhat using solidity coverage with a wrong hardhat network config.
To solve the problem you can do one of the following:

1. set SOLIDITY_COVERAGE env variable to 'true' (the preferred way)
 ex: 'SOLIDITY_COVERAGE=true npx hardhat coverage'
 
2. or manually set the following hardhat network config parameters: 
${actions}`;
    (0, log_1.logBox)("Wrong Hardhat Network Config for Solidity Coverage.", message, { out: "stderr" });
    throw new error_1.HardhatFhevmError("Wrong hardhat network config for solidity coverage.");
}
//# sourceMappingURL=solidityCoverage.js.map
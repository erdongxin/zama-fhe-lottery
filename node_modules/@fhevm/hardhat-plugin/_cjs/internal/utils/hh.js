"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkHardhatRuntimeEnvironment = checkHardhatRuntimeEnvironment;
exports.computeDummyAddress = computeDummyAddress;
exports.resolveNetworkConfigChainId = resolveNetworkConfigChainId;
exports.getWeb3ClientVersion = getWeb3ClientVersion;
exports.isHardhatNode = isHardhatNode;
exports.checkSupportedNetwork = checkSupportedNetwork;
const mock_utils_1 = require("@fhevm/mock-utils");
const ethers_1 = require("ethers");
const error_1 = require("../../error");
const constants_1 = __importDefault(require("../constants"));
function checkHardhatRuntimeEnvironment(hre) {
    if (!("ethers" in hre && hre.ethers !== undefined && hre.ethers !== null)) {
        throw new error_1.HardhatFhevmError(`Missing "@nomicfoundation/hardhat-ethers" plugin. Make sure the "@nomicfoundation/hardhat-ethers" plugin is properly initialized in the hardhat config file.`);
    }
    if (!("provider" in hre.ethers && hre.ethers.provider !== undefined && hre.ethers.provider !== null)) {
        throw new error_1.HardhatFhevmError(`Unexpected "@nomicfoundation/hardhat-ethers" plugin. Unable to access the 'provider' property.`);
    }
    const _hardhatProvider = hre.ethers.provider["_hardhatProvider"];
    if (!_hardhatProvider) {
        return;
    }
    if (_hardhatProvider !== hre.network.provider) {
        throw new error_1.HardhatFhevmError(`hre.ethers.provider._hardhatProvider !== hre.network.provider`);
    }
}
function computeDummyAddress() {
    return ethers_1.ethers.getAddress(ethers_1.ethers.toBeHex((BigInt(ethers_1.ethers.keccak256(ethers_1.ethers.toUtf8Bytes("fhevm-hardhat-plugin.dummy"))) - 1n) &
        0xffffffffffffffffffffffffffffffffffffffffn, 20));
}
async function resolveNetworkConfigChainId(hre, useEthChainId) {
    if (hre.network.config.chainId === undefined) {
        const chainId = useEthChainId ? await (0, mock_utils_1.connectedChainId)(hre.ethers.provider) : undefined;
        if (chainId === undefined) {
            if (hre.network.name === "localhost") {
                return constants_1.default.DEVELOPMENT_NETWORK_CHAINID;
            }
            throw new error_1.HardhatFhevmError(`Unable to resolve network chainId. Network name: ${hre.network.name}`);
        }
        return chainId;
    }
    return hre.network.config.chainId;
}
async function getWeb3ClientVersion(provider) {
    return await provider.send("web3_clientVersion");
}
async function isHardhatNode(networkName, chainId, provider) {
    if (networkName !== "localhost") {
        return false;
    }
    const res = await (0, mock_utils_1.isHardhatProvider)(provider);
    if (res.couldNotConnect) {
        return chainId === constants_1.default.DEVELOPMENT_NETWORK_CHAINID;
    }
    if (!res.isHardhat) {
        return false;
    }
    if (res.chainId !== constants_1.default.DEVELOPMENT_NETWORK_CHAINID) {
        return false;
    }
    return chainId === undefined || res.chainId === chainId;
}
async function checkSupportedNetwork(hre) {
    if (hre.network.name === "hardhat") {
        return;
    }
    if (await isHardhatNode(hre.network.name, hre.network.config.chainId, hre.ethers.provider)) {
        return true;
    }
    if (hre.network.name === "localhost") {
        throw new error_1.HardhatFhevmError(`Unsupported network: The fhevm hardhat plugin only supports the default 'localhost' hardhat node with chainId=${constants_1.default.DEVELOPMENT_NETWORK_CHAINID}. Got network 'localhost' with chainId=${hre.network.config.chainId} instead.`);
    }
    throw new error_1.HardhatFhevmError(`Unsupported network: The fhevm hardhat plugin only supports the 'hardhat' network or the 'localhost' hardhat node with chainId=${constants_1.default.DEVELOPMENT_NETWORK_CHAINID}. Got network '${hre.network.name}' with chainId=${hre.network.config.chainId} instead.`);
}
//# sourceMappingURL=hh.js.map
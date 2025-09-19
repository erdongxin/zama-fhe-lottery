"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertSignersMatchAddresses = assertSignersMatchAddresses;
exports.extractEVMErrorData = extractEVMErrorData;
const ethers_1 = require("ethers");
const errors_1 = require("hardhat/internal/core/providers/errors");
const error_1 = require("../error");
async function assertSignersMatchAddresses(signers, addresses) {
    (0, error_1.assertHHFhevm)(Array.isArray(addresses));
    (0, error_1.assertHHFhevm)(Array.isArray(signers));
    (0, error_1.assertHHFhevm)(addresses.length === signers.length);
    for (let i = 0; i < addresses.length; ++i) {
        (0, error_1.assertHHFhevm)(addresses[i] === (await signers[i].getAddress()));
    }
}
function extractEVMErrorData(e) {
    let data;
    let txHash;
    if (errors_1.ProviderError.isProviderError(e)) {
        if (!e.data || typeof e.data !== "object") {
            return undefined;
        }
        const providerErrorData = e.data;
        if ("data" in providerErrorData && ethers_1.ethers.isBytesLike(providerErrorData.data)) {
            data = providerErrorData.data;
        }
        if ("txHash" in providerErrorData && ethers_1.ethers.isHexString(providerErrorData.txHash)) {
            txHash = providerErrorData.txHash;
        }
    }
    else {
        if (e instanceof Error && "data" in e && ethers_1.ethers.isBytesLike(e.data)) {
            data = e.data;
        }
        if (e instanceof Error && "transactionHash" in e && ethers_1.ethers.isHexString(e.transactionHash)) {
            txHash = e.transactionHash;
        }
    }
    if (data !== undefined) {
        (0, error_1.assertHHFhevm)(txHash !== undefined);
        return { data, txHash };
    }
    return undefined;
}
//# sourceMappingURL=ethers.js.map
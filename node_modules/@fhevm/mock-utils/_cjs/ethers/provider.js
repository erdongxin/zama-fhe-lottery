"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.minimalProviderSend = minimalProviderSend;
exports.connectedChainId = connectedChainId;
exports.getProviderChainId = getProviderChainId;
exports.connectedWeb3Client = connectedWeb3Client;
exports.getWeb3ClientVersion = getWeb3ClientVersion;
exports.getSignerChainId = getSignerChainId;
exports.canSign = canSign;
exports.isReadonlyContract = isReadonlyContract;
exports.isReadonlyProvider = isReadonlyProvider;
const error_js_1 = require("../utils/error.js");
const runtime_js_1 = require("../utils/runtime.js");
async function minimalProviderSend(provider, method, params) {
    let response;
    if ("send" in provider && typeof provider.send === "function") {
        response = await provider.send(method, params);
    }
    else if ("request" in provider && typeof provider.request === "function") {
        response = await provider.request({ method, params });
    }
    else {
        throw new error_js_1.FhevmError("Invalid provider: must implement request() or send()");
    }
    return response;
}
async function connectedChainId(provider) {
    try {
        return await getProviderChainId(provider);
    }
    catch (e) {
        if ((0, error_js_1.isHardhatProviderError)(e)) {
            if (e.code === -32004) {
                throw e;
            }
        }
        else if ((0, error_js_1.isHardhatError)(e)) {
            if (e.number === 108) {
                return undefined;
            }
        }
        else if ((0, runtime_js_1.isNodeRuntime)()) {
            if (e instanceof Error && "code" in e) {
                if (e.code === "ECONNREFUSED") {
                    return undefined;
                }
            }
        }
        throw e;
    }
}
async function getProviderChainId(provider) {
    const chainIdHex = await minimalProviderSend(provider, "eth_chainId", []);
    return Number(BigInt(chainIdHex));
}
async function connectedWeb3Client(provider) {
    try {
        return { client: await getWeb3ClientVersion(provider), couldNotConnect: false };
    }
    catch (e) {
        if ((0, error_js_1.isHardhatProviderError)(e)) {
            if (e.code === -32004) {
                return { client: undefined, couldNotConnect: false };
            }
        }
        else if ((0, error_js_1.isHardhatError)(e)) {
            if (e.number === 108) {
                return { client: undefined, couldNotConnect: true };
            }
        }
        else if ((0, runtime_js_1.isNodeRuntime)()) {
            if (e instanceof Error && "code" in e) {
                if (e.code === "ECONNREFUSED") {
                    return { client: undefined, couldNotConnect: true };
                }
            }
        }
        throw e;
    }
}
async function getWeb3ClientVersion(provider) {
    return minimalProviderSend(provider, "web3_clientVersion", []);
}
async function getSignerChainId(signer) {
    const provider = signer.provider;
    if (!provider) {
        throw new error_js_1.FhevmError("Unable to determine signer provider");
    }
    const network = await provider.getNetwork();
    return Number(network.chainId);
}
function canSign(obj) {
    if (!obj) {
        throw new error_js_1.FhevmError(`Invalid argument`);
    }
    const isDirectSigner = typeof obj.signTransaction === "function";
    const canProduceSigner = typeof obj.getSigner === "function";
    return isDirectSigner || canProduceSigner;
}
function isReadonlyContract(contract) {
    return !canSign(contract.runner);
}
function isReadonlyProvider(obj) {
    if (!obj) {
        throw new error_js_1.FhevmError(`Invalid argument`);
    }
    return (!canSign(obj) &&
        typeof obj.estimateGas === "function" &&
        typeof obj.call === "function" &&
        typeof obj.getBlock === "function" &&
        typeof obj.getNetwork === "function" &&
        typeof obj.getCode === "function");
}
//# sourceMappingURL=provider.js.map
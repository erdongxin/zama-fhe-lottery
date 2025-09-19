"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isHardhatProvider = isHardhatProvider;
const error_js_1 = require("../utils/error.js");
const runtime_js_1 = require("../utils/runtime.js");
const provider_js_1 = require("./provider.js");
async function isHardhatProvider(provider) {
    try {
        const metadata = await (0, provider_js_1.minimalProviderSend)(provider, "hardhat_metadata", []);
        if (!("chainId" in metadata) || metadata.chainId !== 31337) {
            return { couldNotConnect: false, isHardhat: false };
        }
        if (!("instanceId" in metadata) || metadata.instanceId.length !== 66) {
            return { couldNotConnect: false, isHardhat: false };
        }
        return { couldNotConnect: false, isHardhat: true, chainId: Number(BigInt(metadata.chainId)) };
    }
    catch (e) {
        if ((0, error_js_1.isHardhatProviderError)(e)) {
            if (e.code === -32004 || e.code === -32601) {
                return { couldNotConnect: false, isHardhat: false };
            }
        }
        else if ((0, error_js_1.isHardhatError)(e)) {
            if (e.number === 108) {
                return { couldNotConnect: true };
            }
        }
        else if ((0, runtime_js_1.isNodeRuntime)()) {
            if (e instanceof Error && "code" in e) {
                if (e.code === "ECONNREFUSED") {
                    return { couldNotConnect: true };
                }
            }
        }
        throw e;
    }
}
//# sourceMappingURL=hardhat.js.map
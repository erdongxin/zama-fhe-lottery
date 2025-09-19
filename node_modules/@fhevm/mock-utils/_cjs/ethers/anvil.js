"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.anvilNodeInfo = anvilNodeInfo;
exports.isAnvilProvider = isAnvilProvider;
const error_js_1 = require("../utils/error.js");
const runtime_js_1 = require("../utils/runtime.js");
const provider_js_1 = require("./provider.js");
async function anvilNodeInfo(provider) {
    return (0, provider_js_1.minimalProviderSend)(provider, "anvil_nodeInfo", []);
}
async function isAnvilProvider(provider) {
    try {
        const nodeInfo = await anvilNodeInfo(provider);
        if (!("environment" in nodeInfo)) {
            return { isAnvil: false, couldNotConnect: false };
        }
        const env = nodeInfo.environment;
        if (!("chainId" in env)) {
            return { isAnvil: false, couldNotConnect: false };
        }
        return { isAnvil: true, chainId: Number(BigInt(env.chainId)), couldNotConnect: false };
    }
    catch (e) {
        if ((0, error_js_1.isHardhatProviderError)(e)) {
            if (e.code === -32004 || e.code === -32601) {
                return { isAnvil: false, couldNotConnect: false };
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
//# sourceMappingURL=anvil.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.providerExtender = void 0;
const error_1 = require("../error");
const FhevmProviderExtender_1 = require("./provider/FhevmProviderExtender");
const providerExtender = async (provider, config, network) => {
    const firstBlock = await provider.request({ method: "eth_blockNumber" });
    if (typeof firstBlock !== "string") {
        throw new error_1.HardhatFhevmError("Unable to retrieve chain block number.");
    }
    return new FhevmProviderExtender_1.FhevmProviderExtender(provider, config, network, BigInt(firstBlock));
};
exports.providerExtender = providerExtender;
//# sourceMappingURL=ProviderExtender.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyKeypair = verifyKeypair;
const ethers_1 = require("ethers");
const error_js_1 = require("./error.js");
const string_js_1 = require("./string.js");
function verifyKeypair(keyPair) {
    keyPair.publicKey = (0, string_js_1.removePrefix)(keyPair.publicKey, "0x");
    keyPair.privateKey = (0, string_js_1.removePrefix)(keyPair.privateKey, "0x");
    if (!ethers_1.ethers.isHexString("0x" + keyPair.publicKey, 80)) {
        throw new error_js_1.FhevmError(`Invalid key pair's publicKey. Call FhevmInstance.generateKeyPair() to generate a valid FHEVM key pair.`);
    }
    if (!ethers_1.ethers.isHexString("0x" + keyPair.privateKey, 80)) {
        throw new error_js_1.FhevmError(`Invalid key pair's publicKey. Call FhevmInstance.generateKeyPair() to generate a valid FHEVM key pair.`);
    }
}
//# sourceMappingURL=keypair.js.map
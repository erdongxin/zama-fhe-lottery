"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toHexString = exports.fromHexString = void 0;
exports.uint8ArrayToHexNoPrefix = uint8ArrayToHexNoPrefix;
exports.numberToHexNoPrefix = numberToHexNoPrefix;
exports.numberToEvenHexString = numberToEvenHexString;
exports.assertIsHexString = assertIsHexString;
const ethers_1 = require("ethers");
const error_js_1 = require("./error.js");
const string_js_1 = require("./string.js");
function uint8ArrayToHexNoPrefix(uint8Array) {
    return Array.from(uint8Array)
        .map((byte) => byte.toString(16).padStart(2, "0"))
        .join("");
}
function numberToHexNoPrefix(num) {
    const hex = num.toString(16);
    return hex.length % 2 ? "0" + hex : hex;
}
function numberToEvenHexString(num) {
    if (typeof num !== "number" || num < 0) {
        throw new Error("Input should be a non-negative number.");
    }
    let hexString = num.toString(16);
    if (hexString.length % 2 !== 0) {
        hexString = "0" + hexString;
    }
    return hexString;
}
const fromHexString = (hexString) => {
    const arr = hexString.replace(/^(0x)/, "").match(/.{1,2}/g);
    if (!arr)
        return new Uint8Array();
    return Uint8Array.from(arr.map((byte) => parseInt(byte, 16)));
};
exports.fromHexString = fromHexString;
const toHexString = (bytes) => `0x${bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, "0"), "")}`;
exports.toHexString = toHexString;
function assertIsHexString(value, valueName) {
    (0, string_js_1.assertIsString)(value, valueName);
    (0, error_js_1.assertFhevm)(ethers_1.ethers.isHexString(value), `${valueName ?? "value"}: ${value} is not a valid hex string.`);
}
//# sourceMappingURL=hex.js.map
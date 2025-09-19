"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkInsertArgs = checkInsertArgs;
exports.checkQueryArgs = checkQueryArgs;
exports.fhevmDBEntryToString = fhevmDBEntryToString;
exports.stringToFhevmDBEntry = stringToFhevmDBEntry;
const bytes_js_1 = require("../../utils/bytes.js");
const error_js_1 = require("../../utils/error.js");
const hex_js_1 = require("../../utils/hex.js");
const math_js_1 = require("../../utils/math.js");
function checkInsertArgs(handleBytes32Hex, clearText, metadata) {
    (0, bytes_js_1.assertIsBytes32String)(handleBytes32Hex);
    (0, bytes_js_1.assertIsBytes32String)(metadata.transactionHash);
    (0, math_js_1.assertIsUintNumber)(metadata.blockNumber);
    (0, math_js_1.assertIsUintNumber)(metadata.index);
    if (typeof clearText !== "bigint" && typeof clearText !== "string") {
        throw new error_js_1.FhevmError(`Invalid clearText argument, expecting bigint or string, got ${typeof clearText} instead`);
    }
    if (typeof clearText === "string") {
        (0, hex_js_1.assertIsHexString)(clearText, "clearText argument");
    }
}
function checkQueryArgs(handleBytes32Hex) {
    (0, bytes_js_1.assertIsBytes32String)(handleBytes32Hex);
}
function fhevmDBEntryToString(entry) {
    return `${entry.metadata.blockNumber}:${entry.metadata.index}:${entry.metadata.transactionHash}:${entry.clearTextHex}`;
}
function stringToFhevmDBEntry(str) {
    const elements = str.split(":");
    return {
        clearTextHex: elements[3],
        metadata: {
            blockNumber: Number.parseInt(elements[0]),
            index: Number.parseInt(elements[1]),
            transactionHash: elements[2],
        },
    };
}
//# sourceMappingURL=utils.js.map
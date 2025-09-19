"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertHHFhevm = assertHHFhevm;
const error_1 = require("../error");
function assertHHFhevm(cond, message) {
    if (!cond) {
        throw new error_1.HardhatFhevmError(message ?? "Fhevm assertion failed.");
    }
}
//# sourceMappingURL=error.js.map
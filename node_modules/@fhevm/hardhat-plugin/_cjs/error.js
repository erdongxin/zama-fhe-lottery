"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HardhatFhevmError = void 0;
const plugins_1 = require("hardhat/plugins");
const constants_1 = __importDefault(require("./internal/constants"));
class HardhatFhevmError extends plugins_1.HardhatPluginError {
    constructor(message, parent) {
        super(constants_1.default.HARDHAT_PLUGIN_NAME, message, parent);
    }
}
exports.HardhatFhevmError = HardhatFhevmError;
//# sourceMappingURL=error.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.envExtender = exports.fhevmContext = void 0;
const debug_1 = __importDefault(require("debug"));
const plugins_1 = require("hardhat/plugins");
const error_1 = require("../error");
const FhevmEnvironment_1 = require("./FhevmEnvironment");
const error_2 = require("./error");
exports.fhevmContext = {
    fhevmEnv: undefined,
    get: () => {
        if (!exports.fhevmContext.fhevmEnv) {
            throw new error_1.HardhatFhevmError("Unable to initialize HardhatFhevmRuntimeEnvironment");
        }
        return exports.fhevmContext.fhevmEnv;
    },
};
const envExtender = (env) => {
    if (env.hardhatArguments.verbose) {
        debug_1.default.enable("@fhevm/hardhat*");
    }
    (0, error_2.assertHHFhevm)(exports.fhevmContext.fhevmEnv === undefined, "fhevmContext.fhevmEnv already created");
    exports.fhevmContext.fhevmEnv = (0, plugins_1.lazyObject)(() => {
        return new FhevmEnvironment_1.FhevmEnvironment(env);
    });
    env.fhevm = (0, plugins_1.lazyObject)(() => {
        return exports.fhevmContext.get().externalFhevmAPI;
    });
};
exports.envExtender = envExtender;
//# sourceMappingURL=EnvironmentExtender.js.map
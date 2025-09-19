"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logBox = logBox;
exports.jsonStringifyBigInt = jsonStringifyBigInt;
const picocolors = __importStar(require("picocolors"));
const constants_1 = __importDefault(require("../constants"));
function _log(msg, options) {
    if (options?.out === "stderr") {
        process.stderr.write(msg + "\n");
    }
    else if (options?.out === "stdout") {
        process.stdout.write(msg + "\n");
    }
    else if (options?.out === "console") {
        console.log(msg);
    }
    else {
        console.log(msg);
    }
}
function logBox(msg, submsg, options) {
    const left = " ".repeat(1);
    const inner = " ".repeat(2);
    const prefix = constants_1.default.HARDHAT_PLUGIN_NAME + ":";
    let len = msg.length + prefix.length + 1;
    const lines = submsg.split("\n");
    for (let i = 0; i < lines.length; ++i) {
        len = lines[i].length > len ? lines[i].length : len;
    }
    const n = len + inner.length * 2;
    let middle = "";
    for (let i = 0; i < lines.length; ++i) {
        const l = `${lines[i]}`;
        const m = left + "║" + inner + l + inner;
        const extra = " ".repeat(len - lines[i].length);
        middle += m + extra + "║\n";
    }
    const top = left + "╔" + "═".repeat(n) + "╗\n";
    let titleMsg = prefix + " " + msg;
    if (options?.nocolor !== true) {
        if (options?.titleColor === "green" || !options?.titleColor) {
            titleMsg = picocolors.greenBright(picocolors.bold(titleMsg));
        }
        else if (options?.titleColor === "red") {
            titleMsg = picocolors.redBright(picocolors.bold(titleMsg));
        }
        else if (options?.titleColor === "yellow") {
            titleMsg = picocolors.yellowBright(picocolors.bold(titleMsg));
        }
    }
    const extra = " ".repeat(len - msg.length - prefix.length - 1);
    const title = left + "║" + inner + titleMsg + inner + extra + "║\n";
    const horiz = left + "╠" + "═".repeat(n) + "╣\n";
    const bottom = left + "╚" + "═".repeat(n) + "╝";
    let box = top + title + horiz + middle + bottom;
    if (options?.textColor === "green") {
        box = picocolors.greenBright(box);
    }
    else if (options?.textColor === "red") {
        box = picocolors.redBright(box);
    }
    else if (options?.textColor === "yellow") {
        box = picocolors.yellowBright(box);
    }
    _log(picocolors.reset(""), options);
    _log(box, options);
    _log("", options);
}
function jsonStringifyBigInt(value, space) {
    return JSON.stringify(value, (_, v) => (typeof v === "bigint" ? v.toString() : v), space);
}
//# sourceMappingURL=log.js.map
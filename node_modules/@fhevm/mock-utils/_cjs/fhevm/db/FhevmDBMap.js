"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _FhevmDBMap_handleBytes32HexToClearText, _FhevmDBMap_counter, _FhevmDBMap_randomCounter, _FhevmDBMap_fromBlockNumber;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FhevmDBMap = void 0;
const ethers_1 = require("ethers");
const event_js_1 = require("../../ethers/event.js");
const error_js_1 = require("../../utils/error.js");
const utils_js_1 = require("./utils.js");
const __STRICT__ = false;
class FhevmDBMap {
    constructor() {
        _FhevmDBMap_handleBytes32HexToClearText.set(this, void 0);
        _FhevmDBMap_counter.set(this, void 0);
        _FhevmDBMap_randomCounter.set(this, 0);
        _FhevmDBMap_fromBlockNumber.set(this, -1);
    }
    incRand() {
        var _a;
        __classPrivateFieldSet(this, _FhevmDBMap_randomCounter, (_a = __classPrivateFieldGet(this, _FhevmDBMap_randomCounter, "f"), _a++, _a), "f");
    }
    get randomCounter() {
        return __classPrivateFieldGet(this, _FhevmDBMap_randomCounter, "f");
    }
    get fromBlockNumber() {
        return __classPrivateFieldGet(this, _FhevmDBMap_fromBlockNumber, "f");
    }
    get countHandles() {
        if (!__classPrivateFieldGet(this, _FhevmDBMap_handleBytes32HexToClearText, "f")) {
            throw new error_js_1.FhevmError(`FhevmDB not yet initialized`);
        }
        return __classPrivateFieldGet(this, _FhevmDBMap_handleBytes32HexToClearText, "f").size;
    }
    _get() {
        if (!__classPrivateFieldGet(this, _FhevmDBMap_handleBytes32HexToClearText, "f")) {
            throw new error_js_1.FhevmError(`FhevmDB not yet initialized`);
        }
        return __classPrivateFieldGet(this, _FhevmDBMap_handleBytes32HexToClearText, "f");
    }
    async init(fromBlockNumber) {
        if (__classPrivateFieldGet(this, _FhevmDBMap_handleBytes32HexToClearText, "f")) {
            throw new error_js_1.FhevmError(`FhevmDB already initialized`);
        }
        __classPrivateFieldSet(this, _FhevmDBMap_fromBlockNumber, fromBlockNumber, "f");
        __classPrivateFieldSet(this, _FhevmDBMap_counter, new event_js_1.BlockLogCursor(fromBlockNumber), "f");
        __classPrivateFieldSet(this, _FhevmDBMap_handleBytes32HexToClearText, new Map(), "f");
        return true;
    }
    async reset() {
        this._get().clear();
    }
    async _insertHandleBytes32(handleBytes32Hex, clearTextBigIntOrHex, metadata, options) {
        if (!__classPrivateFieldGet(this, _FhevmDBMap_counter, "f")) {
            throw new error_js_1.FhevmError(`FhevmDB not yet initialized`);
        }
        const map = this._get();
        if (__STRICT__) {
            if (options?.replace !== true) {
                if (map.has(handleBytes32Hex)) {
                    throw new error_js_1.FhevmError(`Handle ${handleBytes32Hex} already exists.`);
                }
            }
        }
        if (typeof clearTextBigIntOrHex !== "string") {
            clearTextBigIntOrHex = clearTextBigIntOrHex.toString();
        }
        const entryStr = (0, utils_js_1.fhevmDBEntryToString)({ clearTextHex: clearTextBigIntOrHex, metadata });
        map.set(handleBytes32Hex, entryStr);
        if (metadata.transactionHash !== ethers_1.ethers.ZeroHash) {
            if (__STRICT__) {
                __classPrivateFieldGet(this, _FhevmDBMap_counter, "f").updateForward(metadata.blockNumber, metadata.index);
            }
            else {
                __classPrivateFieldGet(this, _FhevmDBMap_counter, "f").update(metadata.blockNumber, metadata.index);
            }
        }
    }
    async _queryHandleBytes32(handleBytes32Hex) {
        const map = this._get();
        const entryStr = map.get(handleBytes32Hex);
        if (entryStr === undefined) {
            throw new error_js_1.FhevmError(`Handle ${handleBytes32Hex} does not exist.`);
        }
        return (0, utils_js_1.stringToFhevmDBEntry)(entryStr);
    }
    async insertHandleBytes32(handleBytes32Hex, clearText, metadata, options) {
        (0, utils_js_1.checkInsertArgs)(handleBytes32Hex, clearText, metadata);
        await this._insertHandleBytes32(handleBytes32Hex, clearText, metadata, options);
    }
    async queryHandleBytes32(handleBytes32Hex) {
        (0, utils_js_1.checkQueryArgs)(handleBytes32Hex);
        return await this._queryHandleBytes32(handleBytes32Hex);
    }
    async tryInsertHandleBytes32(handleBytes32Hex, clearText, metadata, options) {
        (0, utils_js_1.checkInsertArgs)(handleBytes32Hex, clearText, metadata);
        try {
            await this._insertHandleBytes32(handleBytes32Hex, clearText, metadata, options);
            return true;
        }
        catch {
            return false;
        }
    }
    async tryQueryHandleBytes32(handleBytes32Hex) {
        (0, utils_js_1.checkQueryArgs)(handleBytes32Hex);
        try {
            return await this._queryHandleBytes32(handleBytes32Hex);
        }
        catch {
            return undefined;
        }
    }
}
exports.FhevmDBMap = FhevmDBMap;
_FhevmDBMap_handleBytes32HexToClearText = new WeakMap(), _FhevmDBMap_counter = new WeakMap(), _FhevmDBMap_randomCounter = new WeakMap(), _FhevmDBMap_fromBlockNumber = new WeakMap();
//# sourceMappingURL=FhevmDBMap.js.map
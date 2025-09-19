"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _BlockLogCursor_blockNumber, _BlockLogCursor_blockLogIndex;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockLogCursor = void 0;
exports.assertEventArgIsBigUint8 = assertEventArgIsBigUint8;
exports.assertEventArgIsBigUint256 = assertEventArgIsBigUint256;
exports.assertEventArgIsBytes1String = assertEventArgIsBytes1String;
exports.assertEventArgIsBytes4String = assertEventArgIsBytes4String;
exports.assertEventArgIsBytes8String = assertEventArgIsBytes8String;
exports.assertEventArgIsBytes16String = assertEventArgIsBytes16String;
exports.assertEventArgIsBytes32String = assertEventArgIsBytes32String;
exports.assertEventArgIsBytesString = assertEventArgIsBytesString;
exports.assertEventArgIsAddress = assertEventArgIsAddress;
const address_js_1 = require("../utils/address.js");
const bytes_js_1 = require("../utils/bytes.js");
const error_js_1 = require("../utils/error.js");
const math_js_1 = require("../utils/math.js");
function assertEventArgIsBigUint8(value, eventName, argIndex) {
    (0, math_js_1.assertIsBigUint8)(value, `${eventName} event arg #${argIndex}`);
}
function assertEventArgIsBigUint256(value, eventName, argIndex) {
    (0, math_js_1.assertIsBigUint256)(value, `${eventName} event arg #${argIndex}`);
}
function assertEventArgIsBytes1String(value, eventName, argIndex) {
    _assertEventArgIsBytesString(value, eventName, argIndex, 1);
}
function assertEventArgIsBytes4String(value, eventName, argIndex) {
    _assertEventArgIsBytesString(value, eventName, argIndex, 4);
}
function assertEventArgIsBytes8String(value, eventName, argIndex) {
    _assertEventArgIsBytesString(value, eventName, argIndex, 8);
}
function assertEventArgIsBytes16String(value, eventName, argIndex) {
    _assertEventArgIsBytesString(value, eventName, argIndex, 16);
}
function assertEventArgIsBytes32String(value, eventName, argIndex) {
    _assertEventArgIsBytesString(value, eventName, argIndex, 32);
}
function assertEventArgIsBytesString(value, eventName, argIndex) {
    _assertEventArgIsBytesString(value, eventName, argIndex);
}
function _assertEventArgIsBytesString(value, eventName, argIndex, width) {
    (0, bytes_js_1.assertIsBytesString)(value, width, `${eventName} event arg #${argIndex}`);
}
function assertEventArgIsAddress(value, eventName, argIndex) {
    (0, address_js_1.assertIsAddress)(value, `${eventName} event arg #${argIndex}`);
}
class BlockLogCursor {
    constructor(fromBlockNumber) {
        _BlockLogCursor_blockNumber.set(this, -1);
        _BlockLogCursor_blockLogIndex.set(this, -1);
        __classPrivateFieldSet(this, _BlockLogCursor_blockNumber, fromBlockNumber <= 0 ? -1 : fromBlockNumber - 1, "f");
    }
    static check(blockNumber, blockLogIndex) {
        if (blockNumber < 0 || blockLogIndex < 0) {
            throw new error_js_1.FhevmError(`Invalid event at blockNumber=${blockNumber}, logIndex=${blockLogIndex}.`);
        }
    }
    get isEmpty() {
        const empty = __classPrivateFieldGet(this, _BlockLogCursor_blockNumber, "f") < 0;
        if (empty) {
            (0, error_js_1.assertFhevm)(__classPrivateFieldGet(this, _BlockLogCursor_blockLogIndex, "f") < 0);
        }
        else {
            (0, error_js_1.assertFhevm)(__classPrivateFieldGet(this, _BlockLogCursor_blockLogIndex, "f") >= 0);
        }
        return empty;
    }
    get nextBlockNumber() {
        if (__classPrivateFieldGet(this, _BlockLogCursor_blockNumber, "f") < 0) {
            return 0;
        }
        return __classPrivateFieldGet(this, _BlockLogCursor_blockNumber, "f") + 1;
    }
    get blockNumber() {
        return __classPrivateFieldGet(this, _BlockLogCursor_blockNumber, "f");
    }
    get blockLogIndex() {
        return __classPrivateFieldGet(this, _BlockLogCursor_blockLogIndex, "f");
    }
    gt(blockNumber, blockLogIndex) {
        BlockLogCursor.check(blockNumber, blockLogIndex);
        if (__classPrivateFieldGet(this, _BlockLogCursor_blockNumber, "f") === blockNumber) {
            return __classPrivateFieldGet(this, _BlockLogCursor_blockLogIndex, "f") > blockLogIndex;
        }
        return __classPrivateFieldGet(this, _BlockLogCursor_blockNumber, "f") > blockNumber;
    }
    eq(blockNumber, blockLogIndex) {
        BlockLogCursor.check(blockNumber, blockLogIndex);
        return __classPrivateFieldGet(this, _BlockLogCursor_blockNumber, "f") === blockNumber && __classPrivateFieldGet(this, _BlockLogCursor_blockLogIndex, "f") === blockLogIndex;
    }
    ge(blockNumber, blockLogIndex) {
        return this.gt(blockNumber, blockLogIndex) || this.eq(blockNumber, blockLogIndex);
    }
    updateForward(blockNumber, blockLogIndex) {
        BlockLogCursor.check(blockNumber, blockLogIndex);
        if (this.ge(blockNumber, blockLogIndex)) {
            throw new error_js_1.FhevmError(`Parse event at blockNumber=${blockNumber}, logIndex=${blockLogIndex} in backward order. Current blockNumber=${__classPrivateFieldGet(this, _BlockLogCursor_blockNumber, "f")}, logIndex=${__classPrivateFieldGet(this, _BlockLogCursor_blockLogIndex, "f")}`);
        }
        __classPrivateFieldSet(this, _BlockLogCursor_blockNumber, blockNumber, "f");
        __classPrivateFieldSet(this, _BlockLogCursor_blockLogIndex, blockLogIndex, "f");
    }
    updateForwardOrBackward(blockNumber, blockLogIndex) {
        BlockLogCursor.check(blockNumber, blockLogIndex);
        if (this.eq(blockNumber, blockLogIndex)) {
            throw new error_js_1.FhevmError(`Expecting event at a different position (blockNumber=${blockNumber}, logIndex=${blockLogIndex}).`);
        }
        __classPrivateFieldSet(this, _BlockLogCursor_blockNumber, blockNumber, "f");
        __classPrivateFieldSet(this, _BlockLogCursor_blockLogIndex, blockLogIndex, "f");
    }
    update(blockNumber, blockLogIndex) {
        BlockLogCursor.check(blockNumber, blockLogIndex);
        __classPrivateFieldSet(this, _BlockLogCursor_blockNumber, blockNumber, "f");
        __classPrivateFieldSet(this, _BlockLogCursor_blockLogIndex, blockLogIndex, "f");
    }
}
exports.BlockLogCursor = BlockLogCursor;
_BlockLogCursor_blockNumber = new WeakMap(), _BlockLogCursor_blockLogIndex = new WeakMap();
//# sourceMappingURL=event.js.map
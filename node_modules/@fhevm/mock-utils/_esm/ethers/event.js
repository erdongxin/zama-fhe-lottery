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
import { assertIsAddress } from "../utils/address.js";
import { assertIsBytesString } from "../utils/bytes.js";
import { FhevmError, assertFhevm } from "../utils/error.js";
import { assertIsBigUint8, assertIsBigUint256 } from "../utils/math.js";
export function assertEventArgIsBigUint8(value, eventName, argIndex) {
    assertIsBigUint8(value, `${eventName} event arg #${argIndex}`);
}
export function assertEventArgIsBigUint256(value, eventName, argIndex) {
    assertIsBigUint256(value, `${eventName} event arg #${argIndex}`);
}
export function assertEventArgIsBytes1String(value, eventName, argIndex) {
    _assertEventArgIsBytesString(value, eventName, argIndex, 1);
}
export function assertEventArgIsBytes4String(value, eventName, argIndex) {
    _assertEventArgIsBytesString(value, eventName, argIndex, 4);
}
export function assertEventArgIsBytes8String(value, eventName, argIndex) {
    _assertEventArgIsBytesString(value, eventName, argIndex, 8);
}
export function assertEventArgIsBytes16String(value, eventName, argIndex) {
    _assertEventArgIsBytesString(value, eventName, argIndex, 16);
}
export function assertEventArgIsBytes32String(value, eventName, argIndex) {
    _assertEventArgIsBytesString(value, eventName, argIndex, 32);
}
export function assertEventArgIsBytesString(value, eventName, argIndex) {
    _assertEventArgIsBytesString(value, eventName, argIndex);
}
function _assertEventArgIsBytesString(value, eventName, argIndex, width) {
    assertIsBytesString(value, width, `${eventName} event arg #${argIndex}`);
}
export function assertEventArgIsAddress(value, eventName, argIndex) {
    assertIsAddress(value, `${eventName} event arg #${argIndex}`);
}
export class BlockLogCursor {
    constructor(fromBlockNumber) {
        _BlockLogCursor_blockNumber.set(this, -1);
        _BlockLogCursor_blockLogIndex.set(this, -1);
        // We want the next block number to be `fromBlockNumber`
        // This usually happens when running tests in Anvil. The node is running with
        // plenty of old handles. So we need to start parsing events at a specific block number.
        // All events prior to this block number should be ignored
        __classPrivateFieldSet(this, _BlockLogCursor_blockNumber, fromBlockNumber <= 0 ? -1 : fromBlockNumber - 1, "f");
    }
    static check(blockNumber, blockLogIndex) {
        if (blockNumber < 0 || blockLogIndex < 0) {
            throw new FhevmError(`Invalid event at blockNumber=${blockNumber}, logIndex=${blockLogIndex}.`);
        }
    }
    get isEmpty() {
        const empty = __classPrivateFieldGet(this, _BlockLogCursor_blockNumber, "f") < 0;
        if (empty) {
            assertFhevm(__classPrivateFieldGet(this, _BlockLogCursor_blockLogIndex, "f") < 0);
        }
        else {
            assertFhevm(__classPrivateFieldGet(this, _BlockLogCursor_blockLogIndex, "f") >= 0);
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
    /*
      Returns `true` if this > {blockNumber, blockLogIndex}
    */
    gt(blockNumber, blockLogIndex) {
        BlockLogCursor.check(blockNumber, blockLogIndex);
        if (__classPrivateFieldGet(this, _BlockLogCursor_blockNumber, "f") === blockNumber) {
            return __classPrivateFieldGet(this, _BlockLogCursor_blockLogIndex, "f") > blockLogIndex;
        }
        return __classPrivateFieldGet(this, _BlockLogCursor_blockNumber, "f") > blockNumber;
    }
    /*
      Returns `true` if this == {blockNumber, blockLogIndex}
    */
    eq(blockNumber, blockLogIndex) {
        BlockLogCursor.check(blockNumber, blockLogIndex);
        return __classPrivateFieldGet(this, _BlockLogCursor_blockNumber, "f") === blockNumber && __classPrivateFieldGet(this, _BlockLogCursor_blockLogIndex, "f") === blockLogIndex;
    }
    /*
      Returns `true` if this >= {blockNumber, blockLogIndex}
    */
    ge(blockNumber, blockLogIndex) {
        return this.gt(blockNumber, blockLogIndex) || this.eq(blockNumber, blockLogIndex);
    }
    /*
      throws an error if this >= {blockNumber, blockLogIndex}
    */
    updateForward(blockNumber, blockLogIndex) {
        BlockLogCursor.check(blockNumber, blockLogIndex);
        if (this.ge(blockNumber, blockLogIndex)) {
            throw new FhevmError(`Parse event at blockNumber=${blockNumber}, logIndex=${blockLogIndex} in backward order. Current blockNumber=${__classPrivateFieldGet(this, _BlockLogCursor_blockNumber, "f")}, logIndex=${__classPrivateFieldGet(this, _BlockLogCursor_blockLogIndex, "f")}`);
        }
        __classPrivateFieldSet(this, _BlockLogCursor_blockNumber, blockNumber, "f");
        __classPrivateFieldSet(this, _BlockLogCursor_blockLogIndex, blockLogIndex, "f");
    }
    /*
      throws an error if this == {blockNumber, blockLogIndex}
    */
    updateForwardOrBackward(blockNumber, blockLogIndex) {
        BlockLogCursor.check(blockNumber, blockLogIndex);
        if (this.eq(blockNumber, blockLogIndex)) {
            throw new FhevmError(`Expecting event at a different position (blockNumber=${blockNumber}, logIndex=${blockLogIndex}).`);
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
_BlockLogCursor_blockNumber = new WeakMap(), _BlockLogCursor_blockLogIndex = new WeakMap();
//# sourceMappingURL=event.js.map
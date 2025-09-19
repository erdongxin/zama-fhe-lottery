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
var _CoprocessorEventsIterator_cursor, _CoprocessorEventsIterator_coprocessorContractInterface, _CoprocessorEventsIterator_coprocessorContractAddress, _CoprocessorEventsIterator_readonlyProvider;
import { ethers as EthersT } from "ethers";
import { BlockLogCursor } from "../../ethers/event.js";
import { assertFhevm } from "../../utils/error.js";
import { getCoprocessorEvents } from "./utils.js";
export class CoprocessorEventsIterator {
    constructor(coprocessorContractInterface, coprocessorContractAddress, readonlyProvider, fromBlockNumber) {
        _CoprocessorEventsIterator_cursor.set(this, void 0);
        _CoprocessorEventsIterator_coprocessorContractInterface.set(this, void 0);
        _CoprocessorEventsIterator_coprocessorContractAddress.set(this, void 0);
        _CoprocessorEventsIterator_readonlyProvider.set(this, void 0);
        __classPrivateFieldSet(this, _CoprocessorEventsIterator_coprocessorContractInterface, coprocessorContractInterface, "f");
        __classPrivateFieldSet(this, _CoprocessorEventsIterator_coprocessorContractAddress, coprocessorContractAddress, "f");
        __classPrivateFieldSet(this, _CoprocessorEventsIterator_readonlyProvider, readonlyProvider, "f");
        __classPrivateFieldSet(this, _CoprocessorEventsIterator_cursor, new BlockLogCursor(fromBlockNumber), "f");
    }
    async next() {
        const currentBlockNumber = await __classPrivateFieldGet(this, _CoprocessorEventsIterator_readonlyProvider, "f").getBlockNumber();
        if (currentBlockNumber === __classPrivateFieldGet(this, _CoprocessorEventsIterator_cursor, "f").blockNumber) {
            return [];
        }
        const { events, cursor } = await getCoprocessorEvents(__classPrivateFieldGet(this, _CoprocessorEventsIterator_coprocessorContractInterface, "f"), __classPrivateFieldGet(this, _CoprocessorEventsIterator_coprocessorContractAddress, "f"), __classPrivateFieldGet(this, _CoprocessorEventsIterator_readonlyProvider, "f"), {
            fromBlockNumber: __classPrivateFieldGet(this, _CoprocessorEventsIterator_cursor, "f").nextBlockNumber,
            toBlockNumber: currentBlockNumber,
        });
        if (!cursor.isEmpty) {
            // events can be empty here!
            __classPrivateFieldGet(this, _CoprocessorEventsIterator_cursor, "f").updateForward(cursor.blockNumber, cursor.blockLogIndex);
        }
        else {
            // if the cursor has not progressed, then necessarily the events array
            // must empty.
            assertFhevm(events.length === 0);
        }
        return events;
    }
}
_CoprocessorEventsIterator_cursor = new WeakMap(), _CoprocessorEventsIterator_coprocessorContractInterface = new WeakMap(), _CoprocessorEventsIterator_coprocessorContractAddress = new WeakMap(), _CoprocessorEventsIterator_readonlyProvider = new WeakMap();
//# sourceMappingURL=CoprocessorEventsIterator.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCoprocessorEvents = getCoprocessorEvents;
exports.parseCoprocessorEventsFromLogs = parseCoprocessorEventsFromLogs;
const event_js_1 = require("../../ethers/event.js");
const error_js_1 = require("../../utils/error.js");
const FHEVMExecutor_itf_js_1 = require("../contracts/interfaces/FHEVMExecutor.itf.js");
const CoprocessorEvents_js_1 = require("./CoprocessorEvents.js");
async function getCoprocessorEvents(coprocessorContractInterface, coprocessorContractAddress, readonlyProvider, options) {
    let currentBlockNumber = -1;
    let toBlock;
    if (options.toBlockNumber !== undefined) {
        toBlock = options.toBlockNumber;
    }
    else {
        currentBlockNumber = await readonlyProvider.getBlockNumber();
        toBlock = currentBlockNumber;
    }
    let fromBlock;
    if (options.fromBlockNumber !== undefined) {
        fromBlock = options.fromBlockNumber;
    }
    else {
        fromBlock = toBlock;
    }
    if (fromBlock > toBlock) {
        throw new error_js_1.FhevmError(`Invalid block filter fromBlock=${fromBlock} toBlock=${toBlock}`);
    }
    const filter = {
        address: coprocessorContractAddress,
        fromBlock,
        toBlock,
    };
    const logs = await readonlyProvider.getLogs(filter);
    const cursor = new event_js_1.BlockLogCursor(-1);
    const events = logs
        .map((log) => {
        try {
            cursor.updateForward(log.blockNumber, log.index);
            const parsedLog = coprocessorContractInterface.parseLog(log);
            if (log.blockNumber === fromBlock) {
                if (options.fromBlockLogIndex !== undefined) {
                    if (log.index < options.fromBlockLogIndex) {
                        return null;
                    }
                }
            }
            if (!(0, CoprocessorEvents_js_1.isCoprocessorEventName)(parsedLog.name)) {
                return null;
            }
            const evt = {
                eventName: parsedLog.name,
                args: parsedLog.args,
                index: log.index,
                blockNumber: log.blockNumber,
                transactionHash: log.transactionHash,
                transactionIndex: log.transactionIndex,
            };
            return evt;
        }
        catch {
            return null;
        }
    })
        .filter((event) => event !== null);
    return { events, cursor };
}
function parseCoprocessorEventsFromLogs(logs) {
    if (!logs) {
        return [];
    }
    const events = [];
    for (const log of logs) {
        const event = FHEVMExecutor_itf_js_1.FHEVMExecutorPartialInterface.parseLog(log);
        if (!event) {
            continue;
        }
        if (!(0, CoprocessorEvents_js_1.isCoprocessorEventName)(event.name)) {
            continue;
        }
        const ce = {
            eventName: event.name,
            args: event.args,
            blockNumber: log.blockNumber,
            index: log.index,
            transactionHash: log.transactionHash,
            transactionIndex: log.transactionIndex,
        };
        events.push(ce);
    }
    return events;
}
//# sourceMappingURL=utils.js.map
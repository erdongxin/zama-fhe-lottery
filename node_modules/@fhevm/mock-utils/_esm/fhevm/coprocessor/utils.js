import { ethers as EthersT } from "ethers";
import { BlockLogCursor } from "../../ethers/event.js";
import { FhevmError } from "../../utils/error.js";
import { FHEVMExecutorPartialInterface } from "../contracts/interfaces/FHEVMExecutor.itf.js";
import { isCoprocessorEventName } from "./CoprocessorEvents.js";
export async function getCoprocessorEvents(coprocessorContractInterface, coprocessorContractAddress, readonlyProvider, options) {
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
        throw new FhevmError(`Invalid block filter fromBlock=${fromBlock} toBlock=${toBlock}`);
    }
    // Fetch all events emitted by the contract
    const filter = {
        address: coprocessorContractAddress,
        fromBlock,
        toBlock,
    };
    const logs = await readonlyProvider.getLogs(filter);
    const cursor = new BlockLogCursor(-1);
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
            if (!isCoprocessorEventName(parsedLog.name)) {
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
            // If the log cannot be parsed, skip it
            return null;
        }
    })
        .filter((event) => event !== null);
    return { events, cursor };
}
export function parseCoprocessorEventsFromLogs(logs) {
    // flexible
    if (!logs) {
        return [];
    }
    const events = [];
    for (const log of logs) {
        const event = FHEVMExecutorPartialInterface.parseLog(log);
        if (!event) {
            continue;
        }
        if (!isCoprocessorEventName(event.name)) {
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
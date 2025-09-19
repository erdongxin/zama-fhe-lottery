import { ethers as EthersT } from "ethers";
import { BlockLogCursor } from "../../ethers/event.js";
import { type CoprocessorEvent } from "./CoprocessorEvents.js";
export declare function getCoprocessorEvents(coprocessorContractInterface: EthersT.Interface, coprocessorContractAddress: string, readonlyProvider: EthersT.Provider, options: {
    fromBlockNumber?: number;
    fromBlockLogIndex?: number;
    toBlockNumber?: number;
}): Promise<{
    events: CoprocessorEvent[];
    cursor: BlockLogCursor;
}>;
export declare function parseCoprocessorEventsFromLogs(logs: (EthersT.EventLog | EthersT.Log)[] | null | undefined): CoprocessorEvent[];
//# sourceMappingURL=utils.d.ts.map
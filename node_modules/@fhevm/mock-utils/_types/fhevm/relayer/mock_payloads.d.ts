import { FheType } from "../FheType.js";
import { FhevmType } from "../FhevmType.js";
import type { FhevmDBHandleMetadata } from "../db/FhevmDB.js";
import { type RelayerV1InputProofPayload } from "./payloads.js";
export type MockRelayerData = {
    clearTextValuesBigIntHex: string[];
    metadatas: FhevmDBHandleMetadata[];
    fheTypes: FheType[];
    fhevmTypes: FhevmType[];
    aclContractAddress: string;
    random32List: string[];
};
export type MockRelayerV1InputProofPayload = RelayerV1InputProofPayload & {
    mockData: MockRelayerData;
};
export declare function assertIsMockRelayerV1InputProofPayload(value: unknown): asserts value is MockRelayerV1InputProofPayload;
//# sourceMappingURL=mock_payloads.d.ts.map
import { assertIsArrayProperty, assertIsObjectProperty } from "../../utils/error.js";
import { assertIsStringProperty } from "../../utils/string.js";
import { FheType } from "../FheType.js";
import { FhevmType } from "../FhevmType.js";
import { assertIsRelayerV1InputProofPayload } from "./payloads.js";
export function assertIsMockRelayerV1InputProofPayload(value) {
    const objectKeys = ["mockData"];
    assertIsRelayerV1InputProofPayload(value);
    assertIsObjectProperty(value, objectKeys, "MockRelayerV1InputProofPayload");
    _assertIsMockRelayerData(value.mockData);
}
function _assertIsMockRelayerData(value) {
    const arrayKeys = [
        "clearTextValuesBigIntHex",
        "metadatas",
        "fheTypes",
        "fhevmTypes",
        "random32List",
    ];
    const stringKeys = ["aclContractAddress"];
    assertIsStringProperty(value, stringKeys, "MockRelayerData");
    assertIsArrayProperty(value, arrayKeys, "MockRelayerData");
}
//# sourceMappingURL=mock_payloads.js.map
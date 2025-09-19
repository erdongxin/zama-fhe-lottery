"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertIsMockRelayerV1InputProofPayload = assertIsMockRelayerV1InputProofPayload;
const error_js_1 = require("../../utils/error.js");
const string_js_1 = require("../../utils/string.js");
const payloads_js_1 = require("./payloads.js");
function assertIsMockRelayerV1InputProofPayload(value) {
    const objectKeys = ["mockData"];
    (0, payloads_js_1.assertIsRelayerV1InputProofPayload)(value);
    (0, error_js_1.assertIsObjectProperty)(value, objectKeys, "MockRelayerV1InputProofPayload");
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
    (0, string_js_1.assertIsStringProperty)(value, stringKeys, "MockRelayerData");
    (0, error_js_1.assertIsArrayProperty)(value, arrayKeys, "MockRelayerData");
}
//# sourceMappingURL=mock_payloads.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FhevmError = exports.verifyKeypair = exports.assertIsAddress = exports.timestampNow = exports.toUIntNumber = exports.ensurePrefix = exports.ensureSuffix = exports.removePrefix = void 0;
var string_js_1 = require("./string.js");
Object.defineProperty(exports, "removePrefix", { enumerable: true, get: function () { return string_js_1.removePrefix; } });
Object.defineProperty(exports, "ensureSuffix", { enumerable: true, get: function () { return string_js_1.ensureSuffix; } });
Object.defineProperty(exports, "ensurePrefix", { enumerable: true, get: function () { return string_js_1.ensurePrefix; } });
var math_js_1 = require("./math.js");
Object.defineProperty(exports, "toUIntNumber", { enumerable: true, get: function () { return math_js_1.toUIntNumber; } });
var time_js_1 = require("./time.js");
Object.defineProperty(exports, "timestampNow", { enumerable: true, get: function () { return time_js_1.timestampNow; } });
var address_js_1 = require("./address.js");
Object.defineProperty(exports, "assertIsAddress", { enumerable: true, get: function () { return address_js_1.assertIsAddress; } });
var keypair_js_1 = require("./keypair.js");
Object.defineProperty(exports, "verifyKeypair", { enumerable: true, get: function () { return keypair_js_1.verifyKeypair; } });
var error_js_1 = require("./error.js");
Object.defineProperty(exports, "FhevmError", { enumerable: true, get: function () { return error_js_1.FhevmError; } });
//# sourceMappingURL=index.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isNodeRuntime = isNodeRuntime;
exports.isBunRuntime = isBunRuntime;
function isNodeRuntime() {
    return typeof process !== "undefined" && process.versions != null && process.versions.node != null;
}
function isBunRuntime() {
    return typeof Bun !== "undefined";
}
//# sourceMappingURL=runtime.js.map
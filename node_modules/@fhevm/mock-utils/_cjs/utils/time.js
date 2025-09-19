"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.currentTime = currentTime;
exports.timestampNow = timestampNow;
function currentTime() {
    const now = new Date();
    return now.toLocaleTimeString("en-US", { hour12: true, hour: "numeric", minute: "numeric", second: "numeric" });
}
function timestampNow() {
    return Math.floor(Date.now() / 1000);
}
//# sourceMappingURL=time.js.map
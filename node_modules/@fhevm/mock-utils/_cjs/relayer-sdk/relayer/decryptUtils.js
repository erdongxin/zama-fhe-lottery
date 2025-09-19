"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkEncryptedBits = checkEncryptedBits;
const NumEncryptedBits = {
    0: 2,
    2: 8,
    3: 16,
    4: 32,
    5: 64,
    6: 128,
    7: 160,
    8: 256,
};
function checkEncryptedBits(handles) {
    let total = 0;
    for (const handle of handles) {
        if (handle.length !== 66) {
            throw new Error(`Handle ${handle} is not of valid length`);
        }
        const hexPair = handle.slice(-4, -2).toLowerCase();
        const typeDiscriminant = parseInt(hexPair, 16);
        if (!(typeDiscriminant in NumEncryptedBits)) {
            throw new Error(`Handle ${handle} is not of valid type`);
        }
        total += NumEncryptedBits[typeDiscriminant];
        if (total > 2048) {
            throw new Error("Cannot decrypt more than 2048 encrypted bits in a single request");
        }
    }
    return total;
}
//# sourceMappingURL=decryptUtils.js.map
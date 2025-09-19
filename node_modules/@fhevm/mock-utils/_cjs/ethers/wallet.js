"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultWallets = defaultWallets;
exports.defaultWalletsAsMap = defaultWalletsAsMap;
exports.walletFromMnemonic = walletFromMnemonic;
exports.walletsFromPrivateKeys = walletsFromPrivateKeys;
const ethers_1 = require("ethers");
const constants_js_1 = require("../constants.js");
const error_js_1 = require("../utils/error.js");
const string_js_1 = require("../utils/string.js");
function defaultWallets(initialIndex, count, path, mnemonic, provider) {
    const wallets = [];
    for (let i = 0; i < count; ++i) {
        wallets.push(walletFromMnemonic(i + initialIndex, mnemonic ?? constants_js_1.default.TEST_MNEMONIC, path, provider ?? null));
    }
    return wallets;
}
function defaultWalletsAsMap(initialIndex, count, path, mnemonic, provider) {
    const wallets = new Map();
    for (let i = 0; i < count; ++i) {
        const w = walletFromMnemonic(i + initialIndex, mnemonic ?? constants_js_1.default.TEST_MNEMONIC, path, provider ?? null);
        wallets.set(w.address, w);
    }
    return wallets;
}
function walletFromMnemonic(index, phrase, path, provider) {
    const mnemonic = ethers_1.ethers.Mnemonic.fromPhrase(phrase);
    if (!mnemonic) {
        throw new error_js_1.FhevmError(`Invalid mnemonic phrase: ${phrase}`);
    }
    const rootWallet = ethers_1.ethers.HDNodeWallet.fromMnemonic(mnemonic, path);
    return rootWallet.deriveChild(index).connect(provider);
}
function walletsFromPrivateKeys(privateKeys, addresses, provider) {
    const wallets = [];
    const ignoredPrivateKeys = [];
    if (addresses !== undefined) {
        const s = (0, string_js_1.toLowerCaseSet)(addresses);
        for (let i = 0; i < privateKeys.length; ++i) {
            const pk = privateKeys[i];
            const w = new ethers_1.ethers.Wallet(pk, provider ?? null);
            if (s.has(w.address.toLowerCase())) {
                wallets.push(w);
            }
            else {
                ignoredPrivateKeys.push(pk);
            }
        }
    }
    return { wallets, ignoredPrivateKeys };
}
//# sourceMappingURL=wallet.js.map
import { ethers as EthersT } from "ethers";
import constants from "../constants.js";
import { FhevmError } from "../utils/error.js";
import { toLowerCaseSet } from "../utils/string.js";
export function defaultWallets(initialIndex, count, path, mnemonic, provider) {
    const wallets = [];
    for (let i = 0; i < count; ++i) {
        wallets.push(walletFromMnemonic(i + initialIndex, mnemonic ?? constants.TEST_MNEMONIC, path, provider ?? null));
    }
    return wallets;
}
export function defaultWalletsAsMap(initialIndex, count, path, mnemonic, provider) {
    const wallets = new Map();
    for (let i = 0; i < count; ++i) {
        const w = walletFromMnemonic(i + initialIndex, mnemonic ?? constants.TEST_MNEMONIC, path, provider ?? null);
        wallets.set(w.address, w);
    }
    return wallets;
}
export function walletFromMnemonic(index, phrase, path, provider) {
    const mnemonic = EthersT.Mnemonic.fromPhrase(phrase);
    if (!mnemonic) {
        throw new FhevmError(`Invalid mnemonic phrase: ${phrase}`);
    }
    const rootWallet = EthersT.HDNodeWallet.fromMnemonic(mnemonic, path);
    return rootWallet.deriveChild(index).connect(provider);
}
export function walletsFromPrivateKeys(privateKeys, addresses, provider) {
    const wallets = [];
    const ignoredPrivateKeys = [];
    if (addresses !== undefined) {
        const s = toLowerCaseSet(addresses);
        for (let i = 0; i < privateKeys.length; ++i) {
            const pk = privateKeys[i];
            const w = new EthersT.Wallet(pk, provider ?? null);
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
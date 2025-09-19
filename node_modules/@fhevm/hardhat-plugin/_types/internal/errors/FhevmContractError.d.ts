import { RelayerEncryptedInput } from "@zama-fhe/relayer-sdk/node";
import { ProviderError } from "hardhat/internal/core/providers/errors";
import { RequestArguments } from "hardhat/types";
import { FhevmEnvironment } from "../FhevmEnvironment";
export type FhevmInputVerifierError = {
    type: "InputVerifier";
    name: "InvalidSigner";
    txContractAddress?: string;
    txUserAddress?: string;
    inputContractAddress?: string;
    inputUserAddress?: string;
    shortMessage: string;
    longMessage: string;
};
export type FhevmContractError = FhevmInputVerifierError;
export declare function parseFhevmError(fhevmEnv: FhevmEnvironment, e: unknown, options?: {
    encryptedInput?: RelayerEncryptedInput;
}): Promise<FhevmContractError | undefined>;
/**
 * Mutates an Error object strictly formated as
 * {
 *    data: BytesLike
 *    stackTrace: [{...}, {...}, {...}, { address: Uint8Array }]
 *    message: string
 *    stack: string
 * }
 */
export declare function mutateErrorInPlace(fhevmEnv: FhevmEnvironment, e: Error, args: RequestArguments): Promise<void>;
/**
 * Mutates a HH ProviderError object strictly formated as
 * {
 *    data: {
 *      data: BytesLike,
 *      message: string,
 *      txHash: string,
 *    }
 *    message: string,
 * }
 *
 * or
 *
 * {
 *    data: string
 * }
 */
export declare function mutateProviderErrorInPlace(fhevmEnv: FhevmEnvironment, e: ProviderError, txFromTo?: {
    from: string;
    to: string | null;
}): Promise<void>;
//# sourceMappingURL=FhevmContractError.d.ts.map
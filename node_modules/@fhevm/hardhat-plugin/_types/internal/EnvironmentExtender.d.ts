import { EnvironmentExtender } from "hardhat/types";
import { FhevmEnvironment } from "./FhevmEnvironment";
export declare const fhevmContext: {
    fhevmEnv: FhevmEnvironment | undefined;
    get: () => FhevmEnvironment;
};
/**
 * Hardhat EnvironmentExtender
 * Called at Hardhat initialization
 */
export declare const envExtender: EnvironmentExtender;
//# sourceMappingURL=EnvironmentExtender.d.ts.map
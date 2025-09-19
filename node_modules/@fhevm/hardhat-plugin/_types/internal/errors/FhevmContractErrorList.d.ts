export declare const ERRORS: {
    InputVerifier: {
        InvalidSigner: {
            title: string;
            shortMessage: string;
            longMessage: string;
        };
    };
    ACL: {
        SenderNotAllowed: {
            title: string;
            shortMessage: string;
            longMessage: string;
        };
    };
    KMSVerifier: {
        KMSInvalidSigner: {
            title: string;
            shortMessage: string;
        };
    };
    FHEVMExecutor: {
        ACLNotAllowed: {
            title: string;
            shortMessage: string;
        };
    };
    CustomError: {
        default: string;
    };
};
export declare function applyErrorTemplate(template: string, values?: {
    [templateVar: string]: any;
}): string;
//# sourceMappingURL=FhevmContractErrorList.d.ts.map
export function assertFhevm(check, message) {
    if (!check) {
        const title = "Fhevm assertion failed";
        message = message ? title + ": " + message : title;
        throw new FhevmError(message);
    }
}
export function assertFhevmFailed(message) {
    const title = "Fhevm assertion failed";
    message = message ? title + ": " + message : title;
    throw new FhevmError(message);
}
export function assertIsArray(value, valueName) {
    assertFhevm(Array.isArray(value), `${valueName ?? "value"} is not an array`);
}
export function assertIsArrayProperty(value, propertyNames, typeName) {
    if (typeof value !== "object" || value === null) {
        throw new FhevmError(`${typeName} must be a non-null object.`);
    }
    for (const key of propertyNames) {
        const prop = value[key];
        if (prop === undefined || prop === null) {
            throw new FhevmError(`Invalid ${typeName}. Missing '${key}' property.`);
        }
        if (!Array.isArray(prop)) {
            throw new FhevmError(`Expected '${key}' in ${typeName} to be an array.`);
        }
    }
}
export function assertUint8ArrayDeepEqual(a1, a2) {
    assertFhevm(a1.length === a2.length, "Arrays do not have the same length");
    for (let i = 0; i < a1.length; ++i) {
        assertFhevm(a1[i] === a2[i], `Arrays are different. a1[${i}]=${a1[i]} !== a2[${i}]=${a2[i]}`);
    }
}
export function assertArrayOfUint8ArrayDeepEqual(a1, a2) {
    assertFhevm(a1.length === a2.length, "Arrays do not have the same length");
    for (let i = 0; i < a1.length; ++i) {
        assertUint8ArrayDeepEqual(a1[i], a2[i]);
    }
}
export function assertIsObjectProperty(value, propertyNames, typeName) {
    if (typeof value !== "object" || value === null) {
        throw new FhevmError(`${typeName} must be a non-null object.`);
    }
    for (const key of propertyNames) {
        const prop = value[key];
        if (prop === undefined || prop === null) {
            throw new FhevmError(`Invalid ${typeName}. Missing '${key}' property.`);
        }
        if (typeof prop !== "object") {
            throw new FhevmError(`Expected '${key}' in ${typeName} to be an object. Got ${typeof prop} instead.`);
        }
    }
}
export class FhevmError extends Error {
    constructor(message, options) {
        super(message, options);
        //@ts-ignore
        Object.defineProperty(this, "__isFhevmError", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.__isFhevmError = true;
    }
}
export function isHardhatProviderError(other) {
    if (other === undefined || other === null) {
        return false;
    }
    if (!(other instanceof Error)) {
        return false;
    }
    if (!("code" in other)) {
        return false;
    }
    if (!("_isProviderError" in other)) {
        return false;
    }
    return other._isProviderError === true;
}
export function isHardhatError(other) {
    if (other === undefined || other === null) {
        return false;
    }
    if (!(other instanceof Error)) {
        return false;
    }
    if (!("number" in other)) {
        return false;
    }
    if (!("_isHardhatError" in other)) {
        return false;
    }
    return other._isHardhatError === true;
}
//# sourceMappingURL=error.js.map
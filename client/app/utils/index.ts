export function handleValidationError(error: any): void {
    console.warn('validation failed', error)
}

export function handleGenericError(error: any): void {
    console.error('unexpected error', error)
}

/**
 * Generate an unlikely string of 16 characters, based on Math.random
 * For whatever reason, the uuid npm library causes errors.
 * Could be to do with the method of generating the randomness, which apprently relies on the MAC address of a device.
 * This isn't compatible with at least the android emulator.
 * So, instead use an improvised string key, which isn't acceptable at scale, but OK for adding a key onto a few elements.
*/
export function generatePoorRandomKey() {
    return Math.random().toString(36).substring(2,16)
}

export function keyArray<T>(arr: Array<object>): Array<{ key: string } | T> {
    return arr.map((item) => ({ key: generatePoorRandomKey(), ...item }));
  }
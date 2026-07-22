import { isMspCancelled } from "../msp/mspErrors.js";

/**
 * Log a tab `loadConfig` failure unless it is a benign MSP cancellation: a tab switch or
 * disconnect clears the MSP queue mid-load and rejects the in-flight requests with
 * `MspCancelledError` — the tab is being torn down anyway, so that is expected behaviour,
 * not a load failure. Genuine failures (timeout, CRC, …) are logged.
 * @param {string} subject - what was being loaded, e.g. "Failsafe configuration".
 * @param {unknown} error - the rejection from the tab's load chain.
 * @returns {boolean} true when the error was a genuine failure (and was logged).
 */
export function logTabLoadError(subject, error) {
    if (isMspCancelled(error)) {
        return false;
    }
    console.error(`Failed to load ${subject}`, error);
    return true;
}

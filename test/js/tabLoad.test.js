import { afterEach, describe, expect, it, vi } from "vitest";
import { logTabLoadError } from "../../src/js/utils/tabLoad";
import { MspCancelledError, MspTimeoutError } from "../../src/js/msp/mspErrors";

describe("logTabLoadError", () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("swallows benign MSP cancellations without logging", () => {
        const spy = vi.spyOn(console, "error").mockImplementation(() => {});
        const cancellation = new MspCancelledError("MSP queue cleared", undefined, "cleanup");

        expect(logTabLoadError("Failsafe configuration", cancellation)).toBe(false);
        expect(spy).not.toHaveBeenCalled();
    });

    it("logs genuine MSP failures", () => {
        const spy = vi.spyOn(console, "error").mockImplementation(() => {});
        const timeout = new MspTimeoutError("MSP request timed out");

        expect(logTabLoadError("Failsafe configuration", timeout)).toBe(true);
        expect(spy).toHaveBeenCalledWith("Failed to load Failsafe configuration", timeout);
    });

    it("logs non-MSP errors", () => {
        const spy = vi.spyOn(console, "error").mockImplementation(() => {});
        const error = new Error("boom");

        expect(logTabLoadError("sensor config", error)).toBe(true);
        expect(spy).toHaveBeenCalledWith("Failed to load sensor config", error);
    });
});

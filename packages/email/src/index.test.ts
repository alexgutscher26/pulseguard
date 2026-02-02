import { describe, expect, test, mock, beforeEach } from "bun:test";
import { sendMonitorAlert, MonitorAlertData } from "./index";

const sendMock = mock(() => Promise.resolve({ data: { id: "123" }, error: null }));

mock.module("resend", () => {
  return {
    Resend: class {
      emails = {
        send: sendMock,
      };
      constructor(apiKey: string) {}
    },
  };
});

mock.module("./templates/monitor-alert", () => {
  return {
    renderMonitorAlert: () => Promise.resolve("<html>Mocked Alert</html>"),
  };
});

describe("sendMonitorAlert", () => {
  beforeEach(() => {
    sendMock.mockClear();
  });

  test("uses correct from address", async () => {
    const data: MonitorAlertData = {
      monitorId: "1",
      monitorName: "Test Monitor",
      url: "https://example.com",
      status: "DOWN",
      previousStatus: "UP",
      timestamp: new Date().toISOString(),
    };

    await sendMonitorAlert("test@example.com", data, "test-key");

    expect(sendMock).toHaveBeenCalled();
    const callArgs = sendMock.mock.calls[0][0];
    expect(callArgs.from).toBe("PulseGuard <alerts@pulseguard.com>");
  });
});

import puppeteer from "@cloudflare/puppeteer";

export interface BrowserStep {
  action: "goto" | "click" | "fill" | "wait" | "assert_text";
  value?: string;
  selector?: string;
}

/**
 * Executes a declarative list of browser steps using Cloudflare Browser Rendering (Puppeteer).
 *
 * @param monitor - The monitor object, containing the script string (JSON steps).
 * @param env - Cloudflare Worker environment bindings.
 * @returns Object indicating success status, latency, and any error message.
 */
export async function performBrowserCheck(
  monitor: { script: string | null; timeout?: number },
  env: any,
): Promise<{ status: "UP" | "DOWN"; latency: number; errorReason?: string }> {
  if (!env.BROWSER) {
    console.error("[BrowserRunner] BROWSER binding is missing in worker environment.");
    return { status: "DOWN", latency: 0, errorReason: "BROWSER_BINDING_MISSING" };
  }

  const start = performance.now();
  let browser;

  try {
    console.log("[BrowserRunner] Launching headless browser...");
    browser = await puppeteer.launch(env.BROWSER);
    const page = await browser.newPage();

    // Configure timeouts (default to 15s if not specified)
    const timeoutLimit = (monitor.timeout || 15) * 1000;
    page.setDefaultTimeout(Math.min(timeoutLimit, 30000));

    const steps: BrowserStep[] = JSON.parse(monitor.script || "[]");
    console.log(`[BrowserRunner] Running ${steps.length} steps...`);

    let i = 0;
    for (const step of steps) {
      if (!step) continue;
      console.log(`[BrowserRunner] Step ${i + 1}/${steps.length}: ${step.action}`);

      switch (step.action) {
        case "goto":
          if (!step.value) throw new Error("GOTO action requires a URL value");
          await page.goto(step.value, { waitUntil: "networkidle2" });
          break;

        case "click":
          if (!step.selector) throw new Error("CLICK action requires a CSS selector");
          await page.waitForSelector(step.selector);
          await page.click(step.selector);
          break;

        case "fill":
          if (!step.selector || step.value === undefined) {
            throw new Error("FILL action requires a CSS selector and value");
          }
          await page.waitForSelector(step.selector);
          // Clear current field value before typing
          await page.click(step.selector, { clickCount: 3 });
          await page.keyboard.press("Backspace");
          await page.type(step.selector, step.value);
          break;

        case "wait":
          if (step.selector) {
            await page.waitForSelector(step.selector);
          } else if (step.value) {
            const ms = parseInt(step.value);
            if (!isNaN(ms)) {
              await new Promise((resolve) => setTimeout(resolve, ms));
            }
          }
          break;

        case "assert_text":
          if (!step.value) throw new Error("ASSERT_TEXT action requires a value to check");
          // Wait for text to appear in body using standard page string expression evaluation
          await page.waitForFunction(
            `document.body.innerText.includes(${JSON.stringify(step.value)})`,
            {},
          );
          break;

        default:
          throw new Error(`Unknown step action: ${step.action}`);
      }
      i++;
    }

    const latency = Math.round(performance.now() - start);
    console.log(`[BrowserRunner] Success! Total latency: ${latency}ms`);
    return { status: "UP", latency };
  } catch (err: any) {
    console.error("[BrowserRunner] Execution error:", err);
    const latency = Math.round(performance.now() - start);
    return {
      status: "DOWN",
      latency,
      errorReason: err.message ? err.message.substring(0, 100) : "BROWSER_RUN_FAILED",
    };
  } finally {
    if (browser) {
      try {
        await browser.close();
      } catch (closeErr) {
        console.error("[BrowserRunner] Failed to close browser:", closeErr);
      }
    }
  }
}

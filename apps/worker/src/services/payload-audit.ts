
export async function auditPayload(targetUrl: string, pattern: string) {
  try {
    const response = await fetch(targetUrl, {
      method: "GET",
      headers: {
        "User-Agent": "PulseGuard-Payload-Scanner/1.0",
      },
      redirect: "follow",
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const body = await response.text();
    const truncatedBody = body.length > 200000 ? body.substring(0, 200000) + "\n\n...[TRUNCATED BY PULSEGUARD SENTINEL]..." : body;

    let matches: { index: number, length: number }[] = [];
    let success = false;
    let errorMessage: string | undefined = undefined;

    if (pattern) {
      try {
        const regex = new RegExp(pattern, "gim");
        let match;
        while ((match = regex.exec(truncatedBody)) !== null) {
          matches.push({
            index: match.index,
            length: match[0].length
          });
          // Avoid infinite loops for zero-width matches
          if (match.index === regex.lastIndex) regex.lastIndex++;
          // Limit total matches for performance
          if (matches.length > 500) break;
        }
        success = matches.length > 0;
      } catch (err: any) {
        errorMessage = `INVALID_REGEX: ${err.message}`;
      }
    }

    return {
      url: targetUrl,
      status: response.status,
      byteSize: body.length,
      payload: truncatedBody,
      matches,
      matchCount: matches.length,
      success,
      errorMessage,
      headers: Object.fromEntries(response.headers.entries())
    };
  } catch (error: any) {
    throw new Error(`Failed to extract payload: ${error.message}`);
  }
}

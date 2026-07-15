import { execSync, spawn } from "child_process";

// Interfaces
interface CommitData {
  message: string;
  files: string[];
}

// OS-safe Clipboard Copier
function copyToClipboard(text: string): boolean {
  try {
    const platform = process.platform;
    if (platform === "win32") {
      const proc = spawn("clip");
      proc.stdin.write(text);
      proc.stdin.end();
      return true;
    } else if (platform === "darwin") {
      const proc = spawn("pbcopy");
      proc.stdin.write(text);
      proc.stdin.end();
      return true;
    } else {
      // Linux/WSL check
      try {
        // Check if clip.exe is available (WSL)
        execSync("which clip.exe", { stdio: "ignore" });
        const proc = spawn("clip.exe");
        proc.stdin.write(text);
        proc.stdin.end();
        return true;
      } catch {
        try {
          execSync("which xclip", { stdio: "ignore" });
          const proc = spawn("xclip", ["-selection", "clipboard"]);
          proc.stdin.write(text);
          proc.stdin.end();
          return true;
        } catch {
          try {
            execSync("which xsel", { stdio: "ignore" });
            const proc = spawn("xsel", ["--clipboard", "--input"]);
            proc.stdin.write(text);
            proc.stdin.end();
            return true;
          } catch {
            return false;
          }
        }
      }
    }
  } catch (error) {
    return false;
  }
}

// Fetch Git Commit Data
function getCommitData(): CommitData {
  try {
    const message = execSync("git log -1 --pretty=%B", { encoding: "utf8" }).trim();
    const files = execSync("git diff-tree --no-commit-id --name-only -r HEAD", { encoding: "utf8" })
      .trim()
      .split("\n")
      .filter((f) => f.length > 0);

    return { message, files };
  } catch (error) {
    console.warn("⚠️ Not in a Git repository or no commits found. Using mock data.");
    return getMockData();
  }
}

// Mock Data for Dry Runs
function getMockData(): CommitData {
  return {
    message:
      "feat: implemented Stripe advanced billing subscription mapping to netrunner and hobbyist tiers",
    files: ["apps/web/components/billing-form.tsx", "packages/database/schema.prisma", "TODO.md"],
  };
}

// Categorize files into domain/emoji
function categorizeChanges(files: string[]): { category: string; emoji: string } {
  let frontendCount = 0;
  let backendCount = 0;
  let dbCount = 0;
  let configCount = 0;

  for (const file of files) {
    if (
      file.includes("apps/web") ||
      file.includes("components") ||
      file.includes("styles") ||
      file.endsWith(".tsx") ||
      file.endsWith(".css")
    ) {
      frontendCount++;
    } else if (
      file.includes("prisma") ||
      file.includes("db") ||
      file.includes("schema") ||
      file.endsWith(".sql")
    ) {
      dbCount++;
    } else if (
      file.includes("apps/api") ||
      file.includes("packages") ||
      file.includes("server") ||
      file.endsWith(".ts")
    ) {
      backendCount++;
    } else {
      configCount++;
    }
  }

  const max = Math.max(frontendCount, dbCount, backendCount, configCount);
  if (max === 0) return { category: "Dev Updates", emoji: "🛠️" };
  if (max === frontendCount) return { category: "UI/UX & Frontend", emoji: "🎨" };
  if (max === dbCount) return { category: "Database & Schema", emoji: "🗄️" };
  if (max === backendCount) return { category: "Backend Core", emoji: "⚙️" };
  return { category: "DevOps & Config", emoji: "🧪" };
}

// Clean and format commit message
function cleanCommitMessage(msg: string): string {
  // Take first line, remove conventional commits prefix if present (e.g. "feat: ", "fix: ")
  let firstLine = msg.split("\n")[0].trim();
  firstLine = firstLine.replace(
    /^(feat|fix|docs|style|refactor|test|chore|ci|perf)(\(.+?\))?!?: /,
    "",
  );
  // Capitalize first letter
  return firstLine.charAt(0).toUpperCase() + firstLine.slice(1);
}

// Generate X/Twitter post under 220 chars (for safe margin under 225)
function generatePost(commit: CommitData): string {
  const cleanMsg = cleanCommitMessage(commit.message);
  const { category, emoji } = categorizeChanges(commit.files);

  // Template parts
  const header = `🛠️ Build in public #PulseGuard:\n`;
  const footer = `\n#buildinpublic`;

  // Calculate remaining character budget for dynamic content
  const fixedLength = header.length + footer.length;
  const budget = 220 - fixedLength; // Target strictly under 220 characters

  // Attempt standard detail format
  let mainBody = `${emoji} ${cleanMsg}\n📁 ${category}`;

  if (header.length + mainBody.length + footer.length > 220) {
    // Truncate main message to fit budget
    const categoryLine = `\n📁 ${category}`;
    const messageBudget = budget - categoryLine.length - 4; // 4 for "...\n"
    if (messageBudget > 10) {
      const truncatedMsg = cleanMsg.slice(0, messageBudget) + "...";
      mainBody = `${emoji} ${truncatedMsg}${categoryLine}`;
    } else {
      // Extreme fallback
      mainBody = `${emoji} Working on ${category}`;
    }
  }

  return `${header}${mainBody}${footer}`;
}

// Main execution
function main() {
  const isDryRun = process.argv.includes("--dry-run");
  const commit = isDryRun ? getMockData() : getCommitData();
  const tweet = generatePost(commit);

  console.log("\n=========================================");
  console.log("🚀 GENERATED BUILD IN PUBLIC POST:");
  console.log("=========================================");
  console.log(tweet);
  console.log("=========================================");
  console.log(`Character count: ${tweet.length} / 225 limit`);

  const copied = copyToClipboard(tweet);
  if (copied) {
    console.log("📋 Copied to clipboard successfully!");
  } else {
    console.log(
      "⚠️ Could not automatically copy to clipboard (platform not supported or utility missing).",
    );
  }
  console.log("=========================================\n");
}

main();

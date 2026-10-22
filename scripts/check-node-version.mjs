import { readFileSync } from "node:fs";

const minimumVersion = readFileSync(new URL("../.nvmrc", import.meta.url), "utf8").trim();
const [minimumMajor, minimumMinor, minimumPatch] = minimumVersion.split(".").map(Number);
const [major, minor, patch] = process.versions.node.split(".").map(Number);
const supported =
  !process.versions.node.includes("-") &&
  major === minimumMajor &&
  (minor > minimumMinor || (minor === minimumMinor && patch >= minimumPatch));

if (!supported) {
  console.error(
    `Node.js ${process.versions.node} は使用できません。` +
      `2026年10月のセキュリティ修正を含む ${minimumVersion} 以上の ${minimumMajor} 系に更新してください。`,
  );
  process.exit(1);
}

console.log(`Node.js ${process.versions.node}: バージョン確認済み`);

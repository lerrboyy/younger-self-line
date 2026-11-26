// One Line to Your Younger Self — entry writer.
//
// Holds the single line as a constant, validates it against the bounty
// rules (one line, 1..200 characters counted in Unicode code points),
// writes it to /output/entry.txt, then reads the file back and verifies
// the contents match the line exactly.

import { mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LINE =
  "You will still be awake at 4 a.m. ten years from now — only then, the night will finally be paying you back.";

const OUTPUT_DIR = "/output";
const OUTPUT_FILE = join(OUTPUT_DIR, "entry.txt");

function fail(message) {
  console.error(`error: ${message}`);
  process.exit(1);
}

const length = [...LINE].length;
if (length < 1 || length > 200) {
  fail(`line must be 1..200 characters, got ${length}`);
}

// The entry must be exactly one line: no newline characters, and no
// leading or trailing whitespace that would change what the judge reads.
if (/[\r\n]/.test(LINE)) {
  fail("line must not contain a newline");
}
if (LINE !== LINE.trim()) {
  fail("line must not have leading or trailing whitespace");
}

mkdirSync(OUTPUT_DIR, { recursive: true });

// Clear only the contents of /output. Never remove the directory itself:
// on the grader it is a mount point and deleting it fails the run.
for (const entry of readdirSync(OUTPUT_DIR)) {
  rmSync(join(OUTPUT_DIR, entry), { recursive: true, force: true });
}

writeFileSync(OUTPUT_FILE, LINE, "utf8");

const written = readFileSync(OUTPUT_FILE, "utf8");
if (written !== LINE) {
  fail("read-back verification failed: /output/entry.txt does not match the line");
}
if (Buffer.byteLength(written, "utf8") !== Buffer.byteLength(LINE, "utf8")) {
  fail("read-back verification failed: byte length mismatch");
}
if (written.split("\n").length !== 1) {
  fail("read-back verification failed: output is not exactly one line");
}

console.log(`wrote ${OUTPUT_FILE} (${length} characters, 1 line)`);

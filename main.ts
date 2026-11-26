// Office Joke Open entry: writes one 76-character office joke to
// $MAKEFUN_OUTPUT_DIR/entry.txt (default /output/entry.txt) and verifies it.
//
// The joke: "HR asked for my emergency contact, so I put down the printer
// repair hotline."
// Gate enforced here in code: UTF-8 text, 1-200 characters, exactly one
// line, not whitespace-only. No network, no randomness, no files read from
// outside this repository.

import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const JOKE =
  "HR asked for my emergency contact, so I put down the printer repair hotline.";

function fail(message: string): never {
  throw new Error(`gate check failed: ${message}`);
}

// Gate: 1-200 characters, exactly one line, not whitespace-only.
if (JOKE.length < 1 || JOKE.length > 200) {
  fail(`length ${JOKE.length} is outside 1-200 characters`);
}
if (JOKE.trim().length === 0) {
  fail("entry is only whitespace");
}
if (JOKE.includes("\n") || JOKE.includes("\r")) {
  fail("entry must be exactly one line");
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const outPath = join(outDir, "entry.txt");

mkdirSync(outDir, { recursive: true });
writeFileSync(outPath, JOKE, "utf8");

// Read it back and verify byte-identical output.
const back = readFileSync(outPath, "utf8");
if (back !== JOKE) {
  fail("round-trip mismatch: file content differs from the joke");
}
if (Buffer.byteLength(back, "utf8") !== Buffer.byteLength(JOKE, "utf8")) {
  fail("round-trip byte length mismatch");
}

const sha256 = createHash("sha256").update(back, "utf8").digest("hex");
console.log(`chars: ${JOKE.length}`);
console.log(`sha256: ${sha256}`);
console.log(`wrote: ${outPath}`);

import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const TRANSLATION_CODE = "LSG1910";
const INPUT_ZIP = path.resolve("data/raw/fraLSG_usfm.zip");
const OUTPUT_JSON = path.resolve("data/normalized/lsg1910.json");

const BOOKS = [
  { code: "GEN", slug: "genese", name: "Genèse", testament: "OLD", order: 1 },
  { code: "EXO", slug: "exode", name: "Exode", testament: "OLD", order: 2 },
  { code: "LEV", slug: "levitique", name: "Lévitique", testament: "OLD", order: 3 },
  { code: "NUM", slug: "nombres", name: "Nombres", testament: "OLD", order: 4 },
  { code: "DEU", slug: "deuteronome", name: "Deutéronome", testament: "OLD", order: 5 },
  { code: "JOS", slug: "josue", name: "Josué", testament: "OLD", order: 6 },
  { code: "JDG", slug: "juges", name: "Juges", testament: "OLD", order: 7 },
  { code: "RUT", slug: "ruth", name: "Ruth", testament: "OLD", order: 8 },
  { code: "1SA", slug: "1-samuel", name: "1 Samuel", testament: "OLD", order: 9 },
  { code: "2SA", slug: "2-samuel", name: "2 Samuel", testament: "OLD", order: 10 },
  { code: "1KI", slug: "1-rois", name: "1 Rois", testament: "OLD", order: 11 },
  { code: "2KI", slug: "2-rois", name: "2 Rois", testament: "OLD", order: 12 },
  { code: "1CH", slug: "1-chroniques", name: "1 Chroniques", testament: "OLD", order: 13 },
  { code: "2CH", slug: "2-chroniques", name: "2 Chroniques", testament: "OLD", order: 14 },
  { code: "EZR", slug: "esdras", name: "Esdras", testament: "OLD", order: 15 },
  { code: "NEH", slug: "nehemie", name: "Néhémie", testament: "OLD", order: 16 },
  { code: "EST", slug: "esther", name: "Esther", testament: "OLD", order: 17 },
  { code: "JOB", slug: "job", name: "Job", testament: "OLD", order: 18 },
  { code: "PSA", slug: "psaumes", name: "Psaumes", testament: "OLD", order: 19 },
  { code: "PRO", slug: "proverbes", name: "Proverbes", testament: "OLD", order: 20 },
  { code: "ECC", slug: "ecclesiaste", name: "Ecclésiaste", testament: "OLD", order: 21 },
  { code: "SNG", slug: "cantique-des-cantiques", name: "Cantique des cantiques", testament: "OLD", order: 22 },
  { code: "ISA", slug: "esaie", name: "Ésaïe", testament: "OLD", order: 23 },
  { code: "JER", slug: "jeremie", name: "Jérémie", testament: "OLD", order: 24 },
  { code: "LAM", slug: "lamentations", name: "Lamentations", testament: "OLD", order: 25 },
  { code: "EZK", slug: "ezechiel", name: "Ézéchiel", testament: "OLD", order: 26 },
  { code: "DAN", slug: "daniel", name: "Daniel", testament: "OLD", order: 27 },
  { code: "HOS", slug: "osee", name: "Osée", testament: "OLD", order: 28 },
  { code: "JOL", slug: "joel", name: "Joël", testament: "OLD", order: 29 },
  { code: "AMO", slug: "amos", name: "Amos", testament: "OLD", order: 30 },
  { code: "OBA", slug: "abdias", name: "Abdias", testament: "OLD", order: 31 },
  { code: "JON", slug: "jonas", name: "Jonas", testament: "OLD", order: 32 },
  { code: "MIC", slug: "michee", name: "Michée", testament: "OLD", order: 33 },
  { code: "NAM", slug: "nahum", name: "Nahum", testament: "OLD", order: 34 },
  { code: "HAB", slug: "habacuc", name: "Habacuc", testament: "OLD", order: 35 },
  { code: "ZEP", slug: "sophonie", name: "Sophonie", testament: "OLD", order: 36 },
  { code: "HAG", slug: "aggee", name: "Aggée", testament: "OLD", order: 37 },
  { code: "ZEC", slug: "zacharie", name: "Zacharie", testament: "OLD", order: 38 },
  { code: "MAL", slug: "malachie", name: "Malachie", testament: "OLD", order: 39 },
  { code: "MAT", slug: "matthieu", name: "Matthieu", testament: "NEW", order: 40 },
  { code: "MRK", slug: "marc", name: "Marc", testament: "NEW", order: 41 },
  { code: "LUK", slug: "luc", name: "Luc", testament: "NEW", order: 42 },
  { code: "JHN", slug: "jean", name: "Jean", testament: "NEW", order: 43 },
  { code: "ACT", slug: "actes", name: "Actes", testament: "NEW", order: 44 },
  { code: "ROM", slug: "romains", name: "Romains", testament: "NEW", order: 45 },
  { code: "1CO", slug: "1-corinthiens", name: "1 Corinthiens", testament: "NEW", order: 46 },
  { code: "2CO", slug: "2-corinthiens", name: "2 Corinthiens", testament: "NEW", order: 47 },
  { code: "GAL", slug: "galates", name: "Galates", testament: "NEW", order: 48 },
  { code: "EPH", slug: "ephesiens", name: "Éphésiens", testament: "NEW", order: 49 },
  { code: "PHP", slug: "philippiens", name: "Philippiens", testament: "NEW", order: 50 },
  { code: "COL", slug: "colossiens", name: "Colossiens", testament: "NEW", order: 51 },
  { code: "1TH", slug: "1-thessaloniciens", name: "1 Thessaloniciens", testament: "NEW", order: 52 },
  { code: "2TH", slug: "2-thessaloniciens", name: "2 Thessaloniciens", testament: "NEW", order: 53 },
  { code: "1TI", slug: "1-timothee", name: "1 Timothée", testament: "NEW", order: 54 },
  { code: "2TI", slug: "2-timothee", name: "2 Timothée", testament: "NEW", order: 55 },
  { code: "TIT", slug: "tite", name: "Tite", testament: "NEW", order: 56 },
  { code: "PHM", slug: "philemon", name: "Philémon", testament: "NEW", order: 57 },
  { code: "HEB", slug: "hebreux", name: "Hébreux", testament: "NEW", order: 58 },
  { code: "JAS", slug: "jacques", name: "Jacques", testament: "NEW", order: 59 },
  { code: "1PE", slug: "1-pierre", name: "1 Pierre", testament: "NEW", order: 60 },
  { code: "2PE", slug: "2-pierre", name: "2 Pierre", testament: "NEW", order: 61 },
  { code: "1JN", slug: "1-jean", name: "1 Jean", testament: "NEW", order: 62 },
  { code: "2JN", slug: "2-jean", name: "2 Jean", testament: "NEW", order: 63 },
  { code: "3JN", slug: "3-jean", name: "3 Jean", testament: "NEW", order: 64 },
  { code: "JUD", slug: "jude", name: "Jude", testament: "NEW", order: 65 },
  { code: "REV", slug: "apocalypse", name: "Apocalypse", testament: "NEW", order: 66 },
];

const BOOK_BY_CODE = new Map(BOOKS.map((book) => [book.code, book]));

function requireFile(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing input file: ${filePath}`);
  }
}

function listZipEntries(zipPath) {
  try {
    const output = execFileSync("unzip", ["-Z1", zipPath], { encoding: "utf8" });
    return output.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  } catch (error) {
    throw new Error("Unable to list zip content. Ensure `unzip` is installed and accessible.");
  }
}

function readZipEntry(zipPath, entryPath) {
  return execFileSync("unzip", ["-p", zipPath, entryPath], { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
}

function cleanVerseText(text) {
  let cleaned = text;

  cleaned = cleaned.replace(/\\f\s+.*?\\f\*/g, " ");
  cleaned = cleaned.replace(/\\x\s+.*?\\x\*/g, " ");
  cleaned = cleaned.replace(/\\+?w\s+([^|\\]+?)\|[^\\]*\\+?w\*/g, "$1");
  cleaned = cleaned.replace(/\\zaln-[se].*?\\zaln-[se]\*/g, " ");
  cleaned = cleaned.replace(/\\k\s+([^\\]+?)\\k\*/g, "$1");
  cleaned = cleaned.replace(/\\[A-Za-z0-9+_-]+\*?/g, " ");
  cleaned = cleaned.replace(/[{}|]/g, " ");
  cleaned = cleaned.replace(/\s+/g, " ").trim();

  return cleaned;
}

function parseUsfmVerses(usfmContent) {
  const lines = usfmContent.replace(/\r/g, "").split("\n");
  const verses = [];

  let currentChapter = null;
  let currentVerse = null;
  let currentText = "";

  const flushVerse = () => {
    if (currentChapter === null || currentVerse === null) {
      currentText = "";
      return;
    }

    const text = cleanVerseText(currentText);
    if (text.length > 0) {
      verses.push({
        chapter: currentChapter,
        verse: currentVerse,
        text,
      });
    }

    currentText = "";
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) {
      if (currentVerse !== null) {
        currentText += " ";
      }
      continue;
    }

    const chapterMatch = line.match(/^\\c\s+(\d+)/);
    if (chapterMatch) {
      flushVerse();
      currentChapter = Number(chapterMatch[1]);
      currentVerse = null;
      continue;
    }

    const verseMatch = line.match(/^\\v\s+(\d+)(?:[-–]\d+)?\s*(.*)$/);
    if (verseMatch) {
      flushVerse();
      currentVerse = Number(verseMatch[1]);
      currentText = verseMatch[2] ?? "";
      continue;
    }

    if (currentVerse === null) {
      continue;
    }

    if (line.startsWith("\\")) {
      const markerMatch = line.match(/^\\([A-Za-z0-9+_-]+)\*?\s*(.*)$/);
      if (!markerMatch) {
        continue;
      }

      const marker = markerMatch[1];
      const markerText = markerMatch[2] ?? "";

      if (/^(s|s1|s2|s3|s4|r|d|mt|mt1|mt2|mt3|mt4|ms|ms1|ms2|ms3|mr|cl|cp)$/.test(marker)) {
        continue;
      }

      if (markerText.length > 0) {
        currentText += ` ${markerText}`;
      }
      continue;
    }

    currentText += ` ${line}`;
  }

  flushVerse();
  return verses;
}

function extractBookCode(entryPath) {
  const fileName = path.basename(entryPath);
  const match = fileName.match(/^\d{2}-([A-Z0-9]{3})fraLSG\.usfm$/i);
  return match ? match[1].toUpperCase() : null;
}

function buildNormalizedJson() {
  requireFile(INPUT_ZIP);

  const entries = listZipEntries(INPUT_ZIP)
    .filter((entry) => entry.toLowerCase().endsWith(".usfm"))
    .sort((a, b) => a.localeCompare(b, "en"));

  if (entries.length === 0) {
    throw new Error("No USFM files found in input zip.");
  }

  const books = [];

  for (const entry of entries) {
    const code = extractBookCode(entry);
    if (!code) {
      continue;
    }

    const bookMeta = BOOK_BY_CODE.get(code);
    if (!bookMeta) {
      continue;
    }

    const usfm = readZipEntry(INPUT_ZIP, entry);
    const verses = parseUsfmVerses(usfm);

    books.push({
      slug: bookMeta.slug,
      name: bookMeta.name,
      testament: bookMeta.testament,
      order: bookMeta.order,
      verses: verses.map((verse) => ({
        chapter: verse.chapter,
        verse: verse.verse,
        verseTexts: [
          {
            translationCode: TRANSLATION_CODE,
            text: verse.text,
          },
        ],
      })),
    });
  }

  books.sort((a, b) => a.order - b.order);

  const output = {
    translation: {
      code: TRANSLATION_CODE,
      name: "Louis Segond 1910",
      license: "Public Domain",
      source: "https://ebible.org/find/details.php?id=freLSG",
    },
    books,
  };

  fs.mkdirSync(path.dirname(OUTPUT_JSON), { recursive: true });
  fs.writeFileSync(OUTPUT_JSON, JSON.stringify(output, null, 2), "utf8");

  const verseCount = books.reduce((total, book) => total + book.verses.length, 0);
  console.log(`Normalized JSON generated: ${OUTPUT_JSON}`);
  console.log(`Books: ${books.length}`);
  console.log(`Verses: ${verseCount}`);
}

buildNormalizedJson();

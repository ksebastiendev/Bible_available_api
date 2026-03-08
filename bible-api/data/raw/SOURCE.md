# Raw Dataset Source Record

This file documents the selected raw source for the Louis Segond 1910 import.

## Dataset metadata

- Dataset name: French Louis Segond 1910 Bible
- Translation: Louis Segond 1910 (LSG1910)
- Version/year: 1910
- Language: French (fr)

## Source

- Source URL: https://ebible.org/find/details.php?id=freLSG
- Direct download URL (selected file): https://ebible.org/Scriptures/fraLSG_usfm.zip
- Source provider/organization: eBible.org
- Retrieval date (YYYY-MM-DD): 2026-03-08
- Retrieved by: Bible API project intake

## Legal status

- License: Public Domain (as declared by source page)
- Public domain note: Source page states this Bible is in the public domain and not copyrighted.
- Attribution requirements (if any): None required for the underlying text (keep source traceability in repo).
- Usage constraints (if any): None declared for the underlying text on source page.

## Raw file details

- Original format: USFM (zipped archive)
- Original filename: fraLSG_usfm.zip
- File checksum (SHA256): fafe0040fe98839c93975b3b621e6b99a33e351bcad304dbaa19dcc2d20cfcf5
- Raw file location in repo: data/raw/fraLSG_usfm.zip

## Conversion notes

- Planned conversion target (normalized JSON): single canonical JSON aligned with Translation, Book, Verse, VerseText entities.
- Parsing assumptions: USFM markers \id, \c, \v are authoritative for book/chapter/verse boundaries.
- Book naming/canon mapping notes: Use canonical Protestant 66-book order for V1.
- Character encoding notes: UTF-8 expected.
- Known source issues or anomalies: USFM may include formatting markers and paragraph markers that must be stripped from verse text during normalization.

## Validation checklist

- [x] Source URL is reachable
- [x] License/public-domain status verified
- [x] Retrieval date recorded
- [x] Raw file stored in data/raw/
- [x] Checksum recorded
- [x] Conversion notes updated

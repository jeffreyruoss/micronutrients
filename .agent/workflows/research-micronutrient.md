---
description: Research and verify micronutrient data using credible sources
---

This workflow guides the AI on how to research a specific micronutrient, verify its data against credible medical sources, and update the application's database files.

# 1. Search for Credible Data

Perform a web search for the micronutrient focusing on specific data points.

- **Query Format**: `[Micronutrient Name] RDA storage duration toxicity food sources NIH Harvard`
- **Target Domains**:
  - `nih.gov` (National Institutes of Health)
  - `harvard.edu` (Harvard T.H. Chan School of Public Health)
  - `mayoclinic.org` (Mayo Clinic)
  - `clevelandclinic.org` (Cleveland Clinic)
  - `medlineplus.gov` (MedlinePlus)

# 2. Verify and Compare Data

Compare the search results with the current data in `public/db.json` and `public/food_sources.json`.

- **RDA**: Check if the range matches recent guidelines.
- **Storage**: Look for specific timeframes (e.g., "2-3 weeks", "stored in liver for X days"). _Note: "Not stored" usually means excreted within 24-48h._
- **Toxicity**: Confirm if there is a known Upper Limit (UL) or if it is "low risk".
- **Food Sources**: Verify that listed vegan/vegetarian sources are biologically active sources (e.g., avoid B12 analogues like unfortified Nori).

# 3. Update Database Files

If the searched data is more accurate or detailed than the current files, update them.

## Update `public/db.json`

- **File path**: `/Users/jeffreyruoss/Projects/micronutrients/public/db.json`
- Update fields: `storage`, `toxicity`, `essential`, and `notes` if nuances are found.

## Update `public/food_sources.json`

- **File path**: `/Users/jeffreyruoss/Projects/micronutrients/public/food_sources.json`
- Ensure lists are accurate for `vegan`, `vegetarian`, and `omnivore` categories.
- Add a `notes` field if a specific warning is needed (e.g., "Plant sources are not reliable").

# 4. Add Information Sources

Add the credible sources found to `public/info_sources.json`.

## Update `public/info_sources.json`

- **File path**: `/Users/jeffreyruoss/Projects/micronutrients/public/info_sources.json`
- **Format**:
  ```json
  "MicronutrientID": [
    { "title": "Source Name", "url": "https://source.url" },
    { "title": "Source Name 2", "url": "https://source.url" }
  ]
  ```
- **Requirement**: Include at least 3-5 high-quality links (NIH, Harvard, etc.).

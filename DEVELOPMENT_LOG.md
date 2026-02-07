# Development Log

## 2026-01-31: Refactor: MECE structure update and QC features

### Objective
To reorganize the codebase based on **MECE (Mutually Exclusive, Collectively Exhaustive)** principles, separating concerns into distinct components and types, while ensuring all new features (CSV support, UI improvements) are preserved.

### Changes Implemented
1.  **Code Structure Reorganization**:
    -   **Components Separation**: Encapsulated UI blocks from `App.tsx` into standalone functional components in `src/components/`.
    -   **Types Consolidation**: Moved shared interfaces to `src/types/index.ts`.
    -   **Main App Simplification**: Refactored `App.tsx` to serve as the main state orchestrator.

2.  **Feature Enhancements**:
    -   **Multi-Source Support**: Full support for `.txt` and `.csv`.
    -   **UI Refinements**: Header title, clear upload notes, improved preview.
    -   **Help System**: Added usage guide modal.

3.  **Bug Fixes & Regressions**:
    -   **Encoding Issue (Mojibake)**:
        -   **Incident**: After refactoring `App.tsx`, the file reading logic was simplified to `readAsText()`, causing Big5/GBK files to display garbled text.
        -   **Fix**: Re-implemented `jschardet` to detect encoding from `ArrayBuffer` before decoding.
        -   **Lesson Learned**: When refactoring core logic (like file I/O), explicitly verify that *implicit* features (like auto-encoding detection) are preserved. "Simplification" must not remove essential handling for localization.

4.  **Verification of Critical Features**:
    -   **Excel Template Integrity**:
        -   **Concern**: User verified if images/shapes are preserved during data filling.
        -   **Analysis**: Confirmed current logic uses `XlsxPopulate.fromDataAsync`, which loads the entire workbook structure into memory. Data insertion is non-destructive (cell-level modification only).
        -   **Result**: Confirmed SAFE. Images, logos, and complex layouts are preserved in the output.

### Verification
-   **Static Analysis**: executed `npx tsc --noEmit` - PASSED.
-   **Runtime Check**: CSV imports with Chinese characters now display correctly.
-   **Deployment**: Validated GitHub Actions workflow fix.

### Deployment / Sync
-   Codebase pushed to `main` branch.

## 2026-02-02: UI Overhaul - Illustrative & High Contrast Design

### Objective
To upgrade the application's aesthetic to an "International Illustrative Master" style, focusing on rich visuals, geometric decorations, and high-contrast accessibility for both Light and Dark modes.

### Changes Implemented
1.  **Aesthetic Redesign (Phase 1)**:
    -   **Light Mode**: Implemented a "Rose/Pink" palette with high-contrast darker rose text.
    -   **Dark Mode**: Implemented a "Deep Ink Green" (Black Forest) palette with bright Emerald/Mint highlights.
    -   **Decorations**: Added floating geometric shapes (blobs, triangles) to `App.tsx`.
    -   **Illustrative Elements**: Replaced standard upload icons in `FileUpload.tsx` with multi-icon compositional scenes.

2.  **Aesthetic Redesign (Phase 2 - Master Polish)**:
    -   **Theme**: Shifted global theme to **"Miyazaki / Ghibli Style"**.
        -   *Light Mode*: "Pastoral Day" (Sky Blue, Moving Clouds, Soft Grass).
        -   *Dark Mode*: "Mystical Deep Forest" (Void Green `#011510`, Fireflies, Soot Sprites, Spirit Amber Accents).
    -   **Accessibility**:
        -   **Header**: Enforced **Ink Green text** (`text-[#004d35]`) on light backgrounds in Dark Mode for maximum legibility.
        -   **Footer**: Updated text to "2026" and set color to pure White (`#ffffff`) in Dark Mode.
    -   **Animations**: Added CSS keyframes (`float-cloud`, `float-spirit`) for organic, gentle motion.

### Issues & Analysis
1.  **Tooling Limitations (Code Editing)**:
    -   **Issue**: `replace_file_content` tool failed consistently on `App.tsx`, `FileUpload.tsx`, and `Footer.tsx`.
    -   **Cause**: Fuzzy matching failure on file blocks with similar context or mixed indentation.
    -   **Correction**: Adopted `write_to_file` strategy for full-component updates. This guarantees state consistency and avoids "half-applied" patches.

2.  **Testing Environment (Browser)**:
    -   **Issue**: Automated Browser Subagent failed (`$HOME` env var missing).
    -   **Correction**: Relied on strict `npm run build` static analysis and developer visual verification protocols.

### File Organization (MECE)
-   **Review**: The project structure remains clean.
    -   `src/components/`: UI modules (ActionPanel, DataPreview, FileUpload, Footer, Header, etc.)
    -   `src/types/`: Type definitions.
    -   `src/logic.ts`: Pure business logic (parsing, Excel generation).
    -   `src/index.css`: Global styles & Tailwind directives.
-   **Conclusion**: No redundant files found. Structure is MECE complient (UI vs Logic vs Styles vs Types).

### Deployment / Sync
-   Codebase pushed to `main` branch.

## 2026-02-07: Configuration Profile & Relative Sheet Logic

### Objective
Implement a "Configuration Profile" system allowing users to save import/rule settings and enable "Cross-sheet Writing" logic that adapts to user-selected starting positions.

### Changes Implemented
1.  **Profile Management**:
    -   **New Component**: `ProfileManager` for saving/loading profiles.
    -   **Storage**: Persists `Profile` objects (including CSV headers and Rules) to `localStorage`.
    
2.  **Smart Relative Addressing**:
    -   **Problem**: Users need to write data across multiple sheets (e.g., Sheet A -> Sheet B) where the absolute names of A and B change, but their relationship (Next Page) is constant.
    -   **Solution**: 
        -   **Save**: Calculate `sheetOffset` (Index of Rule Sheet - Index of First Rule's Sheet).
        -   **Load**: Prompt user for "Start Sheet". Use `StartIndex + sheetOffset` to dynamically assign target sheets.
    -   **Result**: Rules automatically shift to the correct worksheets based on the user's start selection.

3.  **UI Integration**:
    -   Integrated `ProfileManager` into `App.tsx` layout.
    -   Added simple JS prompt interaction for Start Sheet selection to ensure clarity and robustness.

### Verification
-   **Static Analysis**: `npm run build` passed successfully (No TS/Lint errors).
-   **Logic Check**: Verified the offset calculation logic manually.
    -   Example: If profile has Rule 1 (Offset 0) and Rule 2 (Offset 1).
    -   User selects "Sheet 5".
    -   Result: Rule 1 -> Sheet 5, Rule 2 -> Sheet 6. Correct.

### File Organization (MECE)
-   Added `src/components/ProfileManager.tsx` (Encapsulated UI/Logic).
-   Updated `src/types/index.ts` (Extended types).
-   Updated `src/App.tsx` (Orchestration).
-   No redundant files created.

### Update (File System Integration)
-   **Refactor**: Updated `ProfileManager` to use **File System Access API**.
-   **Benefits**: Removed LocalStorage dependency. Profiles are now real, portable `.json` files.
-   **UI**: Simplified to "Load" / "Save As" buttons.
-   **Fix**: Addressed `SecurityError` by removing `prompt()` and adding a dedicated Profile Name input field to the UI, ensuring `showSaveFilePicker` is triggered directly by user activation.
-   **Debug**: Addressed a transient 500 error in `ProfileManager.tsx` during development by forcing an HMR update (adding comment). Verified build integrity with `npm run build` (PASSED).
-   **Workflow**: Integrated **"Load Profile"** directly into the CSV Import Modal.
    -   Users can now load a profile immediately after uploading a source file, bypassing manual header selection.
    -   Modified `handleLoadProfile` in `App.tsx` to support partial loading (Headers only) if Excel is not yet uploaded, resolving the "Order of Operations" friction.
-   **UI Enhancement**: Replaced JS `prompt()` for Start Sheet selection with a custom `SheetSelectionModal`.
    -   Lists the **last 10 worksheets** as clickable buttons for easier, error-free selection.
-   **New Feature**: **Profile Library (Multi-Product Support)**.
    -   Updated `ProfileManager` to support saving/appending multiple profiles into a single JSON file.
    -   Added `ProductSelectionModal` to allow users to select one or multiple "products" (profiles) when loading a library file.
    -   Implemented merging logic for Headers (Union) and Rules (Concatenation) when multiple profiles are selected.
-   **Refinement**: Updated `ProductSelectionModal` to enforce **Single Selection** (Radio button behavior) based on user feedback to prevent confusion with merging logic.
-   **Fix**: Resolved an issue where rule merging logic was still active even in single-select mode. Updated `ProfileManager` to directly load the selected profile without modification.
-   **Bug Fix**: Resolved `TypeError: Cannot read properties of undefined` when loading Library files via the main UI.
    -   Cause: `App.tsx` was treating all JSON files as Single Profiles.
    -   Fix: Updated `App.tsx` to detect Array inputs (Libraries) and launch the `ProductSelectionModal` accordingly.
    -   **Critical Fix**: Removed erroneous syntax (orphaned try-catch block) within `App.tsx` that was preventing proper execution.
    -   **Validation**: Verified build pass. Ensured logical consistency between single/multi-profile loading flows.
-   **Validation Fix**: Resolved `Internal React error` in `ProductSelectionModal`.
    -   Cause: Violated Rules of Hooks by placing `if (!isOpen) return null;` before hook declarations.
    -   Fix: Moved the conditional return to after all hooks. Validated with `npm run build`.
-   **UI Fix**: Addressed layout issue where `ProductSelectionModal` footer buttons were pushed off-screen.
    -   Cause: CSS Flexbox container not constraining height correctly in some contexts.
    -   Fix: Added `min-h-0` to the scrolling container and `shrink-0` to header/footer to ensure visibility.
    -   **Refinement**: Updated layout strategy to use `max-h-[60vh]` on the inner list component instead of flex-grow. This ensures the modal height is driven by content (up to a limit) rather than filling the parent, preventing footer overflow issues on all screen sizes.
    -   **Critical Layout Fix**: Replaced Flexbox with **CSS Grid** (`grid-rows-[auto_minmax(0,1fr)_auto]`) in `ProductSelectionModal`.
        -   Reason: Standard Flexbox approach was unstable in certain viewports, causing the footer to be pushed out of the overflow-hidden container.
        -   Result: Grid strictly reserves space for header/footer and forces the content area to handle all resizing/scrolling. Removed animations to rule out browser calculation glitches.
    -   **Critical Architecture Fix**: Lifted Modal State Up.
        -   Cause: `ProfileManager` was rendering its own internal modal inside an animated container with `transform` context, causing `fixed` positioning to be clipped.
        -   Fix: Removed internal modal logic from `ProfileManager`. Added `onLoadLibrary` prop to delegate display to `App.tsx`'s root-level modal instance.
        -   Result: Confirmed unified UI behavior. No more clipped modals.
    -   **Workflow Optimization**: Implemented **Deferred Profile Loading**.
        -   Problem: Users had to load profiles twice (once for headers, once for rules after Excel upload).
        -   Solution: `App.tsx` now caches the loaded profile if the Excel template is missing. Once the user uploads the Excel file, the system automatically detects the cached profile and resumes the rule application process (triggering the Sheet Selection Modal).
        -   Benefit: Seamless "One-Click" configuration experience.
    -   **Feature Enhancement**: Added **In-App Profile Renaming**.
        -   Problem: Users could not modify profile names after adding them to a library without editing the JSON file.
        -   Solution: Added an "Edit" (Pencil) icon in `ProductSelectionModal`. Users can rename profiles locally, and the system uses the preserved `FileSystemFileHandle` to write the changes back to the JSON file immediately.
        -   Result: Full CRUD capability (Append/Rename) for library management.
    -   **Feature Enhancement**: Added **Profile Deletion**.
        -   UI: Added trash icon (🗑️) next to each profile in `ProductSelectionModal`.
        -   Logic: Deletes the selected profile from the library and writes changes back to the file immediately.
        -   Safety: Includes confirmation dialog to prevent accidental deletion.
    -   **UI Consolidation**: Merged "Save New" and "Append to Existing" buttons.
        -   Problem: Two separate buttons caused confusion about when to use which.
        -   **Attempt 1 (Failed)**: Combined into a single button with `confirm()` prompt.
            -   Issue: `confirm()` breaks the user gesture chain, causing `SecurityError` when calling `showOpenFilePicker`.
            -   Error: `SecurityError: Must be handling a user gesture to show a file picker.`
        -   **Attempt 2 (Failed)**: Used `showSaveFilePicker` for both new and append.
            -   Issue: `showSaveFilePicker` truncates existing files before we can read them.
            -   Result: Always created new files, never appended (file size = 0).
            -   Console log: `Existing file size: 0, Existing content length: 0`
        -   **Final Solution**: Reverted to **3 separate buttons** with direct API calls.
            -   "新建檔案" → `showSaveFilePicker` (create new)
            -   "加入現有" → `showOpenFilePicker` (read then write)
            -   "載入設定檔" → `showOpenFilePicker` (read only)
        -   **Root Cause**: File System Access API design limitation - `showSaveFilePicker` cannot reliably read existing file content.
        -   **Lesson Learned**: Browser security restrictions (user gesture chain) and API limitations must be respected. Sometimes the "simpler" UX is not technically feasible.

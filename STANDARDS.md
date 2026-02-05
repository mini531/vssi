# VSSI Project Coding Standards & Design System

## 1. Overview
This document defines the strict coding standards for the VSSI project. All future development must adhere to these rules to maintain design consistency and code quality.

## 2. CSS Architecture
We use a hybrid approach: **Tailwind CSS** for layout/spacing + **Standardized CSS Classes** (`style.css`) for components.

### 2.1. Authentication Screens (Login/Register)
| Component | Class Name | Description |
|-----------|------------|-------------|
### 2.1. Authentication Screens (Login/Register)
| Component | Class Name | Description |
|-----------|------------|-------------|
| **Layout** | `.auth-body` | Base class (font, color, min-height). |
| **Centered Page** | `.auth-page-center` | Flex column centering (Login). |
| **Scroll Page** | `.auth-page-scroll` | Fixed height, hidden overflow (Register). |
| **Scroll View** | `.auth-scroll-view` | Inner scroll container for `.auth-page-scroll`. |
| **Logos/Branding**| `.brand-container`, `.brand-text`, `.brand-sub`, `.brand-desc` | Standard branding block. Do NOT use inline styles or Tailwind text classes. |
| **Login Card** | `.auth-card-login` | Fixed width (400px), relative positioning. |
| **Register Card** | `.auth-card-register` | Responsive max-width (500px), margin handling. |
| **Card Container** | `.glass-card-auth` | The main translucent card theme (Visuals only). |
| **Actions/Links** | `.auth-actions`, `.auth-link-*` | Link container below forms. |
| **Footer** | `.auth-footer` | Distinct, darker background area for Help/CS info. |
| **Footer Internals** | `.auth-help-*`, `.auth-cs-*` | Standard styles for the help text and CS center row. |
| **Header (Card)** | `.auth-card-header`, `.auth-card-title` | Standard card title with border. |
| **Inline Button** | `.btn-inline-check` | Small button next to inputs (e.g. Duplicate Check). |
| **System List** | `.auth-system-box`, `.auth-system-item` | Selection list styled container. |
| **Modals** | `.modal-overlay`, `.modal-dialog` | Standard modal wrapper. MUST be child of Body. |

### 2.2. Form Components
Do NOT use long Tailwind strings for repeated elements. Use these classes:

*   **Labels**: `.form-label`
    *   Validation asterisk: `<span>*</span>` inside the label.
*   **Text Inputs**: `.form-input`
    *   Error state: Add `.error` class (Logic handled by `setError`/`resetError` in JS).
*   **Error Message**: `.form-error` (text-red-400, text-xs).
*   **Primary Button**: `.btn-primary` (Teal gradient/shadow).
*   **Secondary Button**: `.btn-secondary` (Dark slate, bordered).
*   **Checkbox**: `.form-checkbox` (Custom style).

### 2.3. Dashboard & Monitoring Components
*   **Layout**: 
    - Use `.dashboard-body` on `<body>`.
    - Use `.dashboard-main-flex` for the main container below the header.
    - Use `.dashboard-main` and `.dashboard-content` for inner layouts.
    - **Monitoring Standard**: For screens with a scrollable list, use `.dashboard-content-full` and `.dashboard-container-full`. 
    - **Table Layout Standard**: Wrap the table section in `.table-main-wrapper` which contains `.table-scroll-area` and `.table-footer`. This ensures a unified border and zero-gap layout. Column headers (`th`) MUST be `sticky` so they remain visible while scrolling the table body.
*   **Filter Panel**: 
    - Structure: `.search-panel` > `.search-panel-header` > `.search-panel-content` > `.filter-panel-inner`.
    - Controls: `.filter-grid`, `.filter-label`, `.filter-input`, `.filter-select`, `.filter-input-flex`.
    - Buttons: `.filter-actions`, `.filter-btn-common`, `.filter-btn-search`, `.filter-btn-reset`.
*   **Status Cards**: 
    - Structure: `.status-card` > `.status-card-header` > `.status-card-title` + `.status-card-icon`.
    - States: `.status-card-value`, `.status-card-state`, `.status-card-deco`.
*   **Tables & Pagination**:
    - Table: `.table-container`, `.data-table`, `.data-table-body`, `.data-table-row`. 
    - **Uniformity**: All tables in the system MUST share the same attributes and use the `.data-table` class. Do NOT create page-specific table classes.
    - Cells: `.text-cell-*` (primary, secondary, mono, meta, date, number, etc.).
    - Utilities: `.text-center`, `.text-right`.
    - Pagination: `.table-footer`, `.pagination-info`, `.pagination-controls`, `.page-btn`, `.pagination-select`, `.pagination-select-margin`.
*   **Icons**:
    - Standard Icons: Use `.status-card-icon` (16x16), `.trend-icon`/`.pagination-icon` (12x12).
    - Avoid inline sizing (`w-4 h-4`, etc.) in components.

### 2.5. Common Components
*   **System Switcher**:
    *   Use `.system-switcher-overlay` and `.system-switcher-dialog`.
    *   Items use `.system-switcher-item` (supports `.active`).

### 2.4. Modal System
*   Use the standard modal structure in `CM_LG_01_01.html`.
*   **Color Conventions**:
    *   **Warning/Error**: Use **Yellow** (`text-yellow-500`). Do NOT use Red.
    *   **Success**: Use **Teal**.
    *   **Confirm**: Use **Blue**.
*   Z-Index hierarchy:
    *   Content: `z-10`
    *   Header: `z-50`
    *   Modal Backdrop: `z-[250]`
    *   Modal Content: `z-[300]`

## 3. JavaScript Conventions
*   **Modules**: Use `js/include.js` for layout fragments (Header, Sidebar).
*   **Common Logic**: Use `js/common.js` for global utilities (Clock, Icons, Sidebar Toggle).
*   **Strict Mode**: Ensure defensive coding (check if elements exist before manipulating).

## 4. File Structure
*   `screens/`: HTML pages (e.g., `CM_LG_01_01.html`).
*   `components/`: Reusable HTML fragments (`header.html`, `sidebar.html`).
*   `css/style.css`: Global styles and standard classes.
*   `js/`: Logic files.

## 5. Review Checklist
Before finishing a task, verify:
- [ ] Are inputs using `.form-input`?
- [ ] Are buttons using `.btn-*` classes?
- [ ] Is specific page CSS avoided in favor of `style.css`?
- [ ] Does the page use `include.js` for Header/Sidebar?

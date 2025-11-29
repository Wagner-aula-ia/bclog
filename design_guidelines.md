# BCLOG Warehouse Management System - Design Guidelines

## Design Approach: Material Design System
**Justification**: This utility-focused, information-dense internal tool requires clarity, efficiency, and consistency. Material Design provides excellent patterns for data visualization, dashboards, and forms while maintaining professional aesthetics.

## Core Design Elements

### Typography
- **Primary Font**: Roboto (via Google Fonts CDN)
- **Hierarchy**:
  - H1 (Dashboard title): 2xl, font-semibold
  - H2 (Section headers): xl, font-medium  
  - H3 (Block/Level labels): lg, font-medium
  - Body text: base, font-normal
  - Labels/metadata: sm, font-normal
  - Buttons: sm, font-medium, uppercase tracking-wide

### Layout System
**Spacing Primitives**: Tailwind units of 2, 4, 6, and 8
- Consistent padding: p-6 for cards, p-4 for compact elements
- Margins: mb-6 between major sections, mb-4 between related elements
- Grid gaps: gap-4 for warehouse positions, gap-6 for section separation

### Component Architecture

**Dashboard Header**
- Full-width dark navy header (sticky positioning)
- Company name "BCLOG – Sistema de Armazenagem Interno" aligned left
- Indicators in header: compact stat cards showing occupied/free positions and Kanban counts
- Grid layout: 4 columns on desktop, stacked on mobile

**Warehouse Porta-Palete Grid**
- Two-column layout for Bloco 1 and Bloco 2
- Each block displays as a vertical grid: 5 rows (níveis) × 2 columns (AP1, AP2)
- Position cards with clear borders, elevation on hover
- Status indicators: filled positions show product code prominently, empty positions show dashed borders
- Action buttons (view/edit/clear) appear on hover for filled positions
- Click anywhere on position card to add/edit

**Kanban Section**
- Three distinct columns for Verde/Amarelo/Vermelho
- Color-coded column headers with bold background colors
- Pallet cards within each column show product summary
- Drag-drop visual indicators (or simple move buttons between columns)
- "Marcar como Expedido" button prominently displayed on red column items

**Modal Forms**
- Centered overlay with backdrop blur
- Form fields: full-width inputs with Material-style floating labels
- Field order: Product Name → Code → Quantity (number input) → Entry Date (date picker) → Observations (textarea)
- Action buttons aligned right: Cancel (text button) + Save (filled button)

**Cards & Containers**
- Warehouse positions: Subtle border (gray-300), white background, rounded corners (rounded-lg)
- Kanban pallets: Stronger colored left border (4px), white background with subtle shadow
- Dashboard stat cards: Light gray background, larger text for numbers, smaller labels below

### Color Specifications (Functional Only)
**Status Colors for Kanban**:
- Verde (Green): Primary success color for available items
- Amarelo (Yellow): Warning color for attention items  
- Vermelho (Red): Danger/urgent color for immediate action

**Interaction States**:
- Hover: Subtle elevation increase (shadow-md to shadow-lg)
- Active positions: Slightly darker border
- Empty positions: Dashed border style

### Responsive Behavior
**Desktop (lg+)**: 
- Two-column layout for warehouse blocks side-by-side
- Three-column Kanban layout
- Dashboard stats in horizontal row

**Tablet (md)**:
- Single-column warehouse blocks stacked
- Three-column Kanban (narrower)
- Dashboard stats in 2×2 grid

**Mobile (base)**:
- All sections stacked vertically
- Kanban columns stack vertically (Verde → Amarelo → Vermelho)
- Dashboard stats single column
- Touch-friendly button sizes (min-h-12)

### Iconography
**Library**: Material Icons (CDN)
- Add: add_circle_outline
- Edit: edit
- Delete/Clear: delete_outline  
- View details: visibility
- Move/Transfer: arrow_forward
- Check/Complete: check_circle

### Data Visualization
**Empty State Messaging**:
- Empty warehouse positions: "Posição Vazia - Clique para adicionar produto"
- Empty Kanban columns: "Nenhum palete nesta fase"

**Visual Hierarchy**:
- Product code displayed largest in occupied positions
- Quantity shown with unit label
- Entry date in subtle gray
- Observations truncated with ellipsis, full text on hover/click

### No Images Required
This internal dashboard requires no hero images or decorative photography. Focus on clean data presentation and functional iconography.

### Accessibility
- Clear focus states for keyboard navigation
- Adequate color contrast for Kanban colors
- Touch targets minimum 44×44px on mobile
- ARIA labels for icon-only buttons

**Key Principle**: Prioritize information density and scanning efficiency over decorative elements. Every pixel serves a functional purpose in this warehouse management context.
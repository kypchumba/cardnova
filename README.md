## Cardnova

A modern SaaS-style business card generator with real-time editing, drag and drop elements and full design customizations for building polished digital business cards directly in the browser.

Cardnova is a frontend-only React app designed to feel like a simplified Canva-style editor focused on business card creation. Users can customize card backgrounds, typography, layout ratios, shadows, transparency, text layers and image layers while seeing changes instantly in a live preview.

## Highlights

- Real-time business card editing with instant preview updates
- Freeform drag-and-drop canvas for text and image layers
- Draggable and resizable elements
- Background controls for solid colors, gradients and uploaded images
- Typography controls with multiple modern fonts
- Card layout controls for horizontal and vertical formats
- Aspect ratio presets such as `1:1`, `4:5`, `3:4`, `16:9` and `9:16`
- Local persistence with `localStorage`
- Undo and redo support
- Layer ordering controls
- Random style generator
- PNG export flow for the card itself
- Responsive UI with a floating mobile settings drawer

## Tech Stack

- React
- Vite
- Tailwind CSS
- `html-to-image`
- `lucide-react`

## Project Goal

The goal of Cardnova is to provide a professional-grade, no-backend business card design tool with a clean SaaS dashboard experience. It is built for fast experimentation, visual editing and flexible customization without forcing users into rigid templates.

## Core Features

### 1. Live Preview Canvas

The live preview area is the heart of the app.

- The card is displayed inside a square preview stage
- The card scales inside that stage based on the selected ratio
- Only the card itself is intended for export, not the surrounding preview holder
- Text and images can be moved freely inside the card

### 2. Settings Sidebar

The settings panel is organized into accordion sections:

- Background Settings
- Text Settings
- Element Controls
- Card Styling
- Export

On desktop, the settings panel scrolls independently from the preview area. On smaller screens, the settings panel is hidden behind a hamburger button and opens as a floating overlay drawer above the preview.

### 3. Background Customization

Users can style the card background with:

- Solid color fills
- Multi-color gradients
- Uploaded background images
- Blur controls
- Overlay controls
- Opacity controls

### 4. Text Editing

Text layers support:

- Multiple font families
- Font size
- Font weight
- Color
- Letter spacing
- Line height

Text editing on the canvas follows a two-step interaction:

- First click selects the text box for movement
- Second click enters text editing mode


### 5. Image Editing

Image layers support:

- Dragging inside the card
- Corner radius editing from sharp rectangles to rounded shapes
- Ratio resizing for proportional scaling
- Side resizing for width/height changes independently

### 6. Layer Management

Users can:

- Add text layers
- Add image layers
- Select layers
- Delete layers
- Bring layers forward
- Send layers backward

### 7. Export

The export system is designed to export only the business card.

- PNG export
- High-resolution toggle
- Optional watermark toggle

The export logic uses a generated clone of the card itself so the live preview shell is not included in the image output.

## Interaction Model

### Canvas Controls

- Hovering text or images shows a move-style crosshair cursor
- Text and image layers can be dragged around the card
- Resize handles appear on selected elements
- Right-clicking opens quick actions near the cursor
- Keyboard delete and backspace remove the selected layer when not typing

### Notifications

The app includes toast notifications for:

- Added text
- Added images
- Deleted layers
- Background changes
- Style randomization
- Layer ordering
- Export success or failure

## Persistence

Cardnova stores the current design in `localStorage`, so users can refresh the page without losing their latest design state.

## Project Structure

```text
src/
  components/
    AccordionSection.jsx
    BackgroundControls.jsx
    Canvas.jsx
    CardStyleControls.jsx
    DraggableImage.jsx
    DraggableText.jsx
    ElementControls.jsx
    ExportControls.jsx
    FloatingContextMenu.jsx
    Sidebar.jsx
    TextControls.jsx
    ToastStack.jsx
    ToolbarControls.jsx
  App.jsx
  index.css
  main.jsx
  utils.js
```

## Getting Started

### Install dependencies

```bash
npm install
```

### Start the dev server

```bash
npm run dev
```

### Build for production

```bash
npm run build
```

### Preview the production build

```bash
npm run preview
```

## Export Notes

If PNG export behaves differently across environments, the most likely cause is the host runtime rather than React itself. Cardnova already tries to export only the card and uses browser-friendly save flows, but embedded webviews or restricted desktop runtimes may still limit file download behavior.

## Design Direction

Cardnova uses a premium SaaS-inspired interface with:

- Soft glass panels
- Rounded corners
- Smooth transitions
- A clean two-panel workspace
- Responsive behavior for desktop and tablet priority

## Future Improvements

- More export formats such as JPEG and PDF
- Multi-card design pages
- Optional cloud save


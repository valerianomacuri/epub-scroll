# EPUB Reader - Production-Ready Web Application

A modern, performant EPUB reader built with React, TypeScript, Material UI, and epub.js. Features continuous vertical scrolling, customizable reading experience, and clean architecture following SOLID principles.

## Features

- 📚 **Upload & Read EPUB files** directly in the browser
- 📖 **Continuous vertical scroll** reading experience (no pagination)
- 🎨 **Three reading themes**: Light, Dark, and Sepia
- 🔤 **Customizable typography**: Font size and line height adjustment
- 📑 **Table of Contents** navigation with sidebar drawer
- 💾 **Reading progress persistence** using localStorage
- 📱 **Responsive design** optimized for mobile and desktop
- ⚡ **Performance optimized** with lazy loading and efficient rendering
- ♿ **Accessibility** features with ARIA support

## Tech Stack

- **React 18** with TypeScript (strict mode)
- **Vite** for blazing-fast development and optimized builds
- **Material UI (MUI)** for polished, accessible components
- **epub.js** for EPUB parsing and content extraction
- **Vitest** + React Testing Library for unit testing
- **ESLint** for code quality

## Project Structure

```
src/
├── core/                      # Core business logic (domain layer)
│   ├── epub/
│   │   └── EpubService.ts    # EPUB parsing service (wraps epub.js)
│   ├── storage/
│   │   └── StorageService.ts # localStorage abstraction
│   └── types/
│       └── epub.types.ts     # Domain type definitions
├── features/                  # Feature modules
│   ├── uploader/
│   │   └── FileUploader.tsx  # File upload UI (Presentational)
│   └── reader/
│       ├── ReaderContainer.tsx  # Reader logic (Container)
│       ├── ChapterView.tsx      # Chapter rendering (Presentational)
│       ├── TocPanel.tsx         # TOC navigation (Presentational)
│       └── ReaderToolbar.tsx    # Reader controls (Presentational)
├── components/                # Shared components
│   └── ThemeProvider.tsx     # MUI theme management
├── styles/
│   └── theme.ts              # MUI theme configuration
└── test/                     # Unit tests
    ├── setup.ts
    ├── ReaderContainer.test.tsx
    └── ChapterView.test.tsx
```

## Architecture & Design Principles

### SOLID Principles

1. **Single Responsibility Principle (SRP)**
   - `EpubService`: Only handles EPUB parsing
   - `StorageService`: Only handles localStorage operations
   - Each component has one clear purpose

2. **Open/Closed Principle (OCP)**
   - Services are extensible through inheritance
   - Theme system allows adding new themes without modifying core code

3. **Liskov Substitution Principle (LSP)**
   - Service interfaces can be swapped with alternative implementations

4. **Interface Segregation Principle (ISP)**
   - Type definitions are granular and focused
   - Components receive only the props they need

5. **Dependency Inversion Principle (DIP)**
   - High-level components depend on abstractions (types)
   - `EpubService` abstracts epub.js implementation details

### Design Patterns

- **Container/Presentation Pattern**: Logic and UI are separated
  - Containers (`ReaderContainer`): Handle state and business logic
  - Presentational components (`ChapterView`, `TocPanel`): Pure rendering

- **Service Layer Pattern**: Business logic encapsulated in services
  - `EpubService`: EPUB operations
  - `StorageService`: Persistence operations

- **Dependency Injection**: Services injected into containers

### Code Quality

- **DRY (Don't Repeat Yourself)**: Shared logic in services and utilities
- **KISS (Keep It Simple, Stupid)**: Simple, readable implementations
- **Clean Code**: Descriptive names, small functions, clear responsibilities
- **Type Safety**: Strict TypeScript with comprehensive type definitions

## Performance Optimizations

### Current Optimizations

1. **Lazy Chapter Loading**: Chapters loaded on-demand, not all at once
2. **Efficient Re-renders**: React optimization with `useCallback` and proper dependencies
3. **Debounced Progress Saving**: Scroll position saved efficiently
4. **Memory Management**: EPUB resources cleaned up on unmount

### Future Optimizations (for very large files)

1. **Web Workers**: Move EPUB parsing to background thread
   ```typescript
   // Future implementation in src/core/workers/epub.worker.ts
   // Parse EPUB without blocking main thread
   ```

2. **Progressive Rendering**: For extremely large chapters
   ```typescript
   // Use requestIdleCallback or setTimeout for chunked rendering
   // Prevents UI jank on 1000+ page chapters
   ```

3. **Virtual Scrolling**: For TOC with hundreds of items
   ```typescript
   // Use react-window or react-virtualized
   // Only render visible TOC items
   ```

### Trade-offs

- **Continuous scroll vs. Pagination**: Continuous scroll provides better UX but uses more memory. For books with 100MB+ chapters, consider pagination.
- **Client-side parsing vs. Server-side**: All parsing is client-side for privacy and simplicity. For team/enterprise use, consider server-side processing.
- **localStorage vs. Database**: localStorage is simple but limited. For cross-device sync, implement backend storage.

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm test

# Run tests in watch mode
npm test -- --watch
```

### Usage

1. Open the application in your browser
2. Click "Select EPUB File" and choose an EPUB file
3. The book will load and display the first chapter
4. Use the menu icon (☰) to open the Table of Contents
5. Use the settings icon (⚙️) to adjust theme, font size, and line height
6. Your reading position is automatically saved

## Testing

Sample unit tests are included for key components:

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run in watch mode for TDD
npm test -- --watch
```

Tests cover:
- `ReaderContainer`: Business logic and state management
- `ChapterView`: Presentation logic and rendering

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Requires ES2020+ support

## Design Decisions

### Why continuous scroll instead of pagination?

Continuous scroll provides a more natural reading experience similar to scrolling a web article. It's familiar, accessible, and works well on all devices. Pagination can be added as an option in future versions.

### Why epub.js?

epub.js is the most mature and well-maintained EPUB library for JavaScript. It handles complex EPUB specifications and edge cases reliably.

### Why Material UI?

MUI provides accessible, polished components out of the box, reducing development time while maintaining quality. The theming system makes it easy to support light/dark/sepia modes.

### Why no routing?

This is a single-purpose app (EPUB reader). Adding routing would add unnecessary complexity. The app state (upload vs. reading) is managed with simple component state.

## Future Enhancements

- [ ] Web Worker for EPUB parsing
- [ ] Bookmarks and annotations
- [ ] Search within book
- [ ] Multiple book library management
- [ ] Cloud sync (reading progress across devices)
- [ ] Text-to-speech
- [ ] Night mode scheduling
- [ ] Font family selection
- [ ] Highlight and note-taking
- [ ] Export annotations

## License

MIT

## Contributing

Contributions welcome! Please follow the existing code style and architecture patterns.

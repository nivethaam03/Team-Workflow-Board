# Team Workflow Board

A premium, responsive React application for managing team tasks with a custom-built design system.

## 🚀 Tech Stack

- **React 19 & TypeScript**: Core framework and type safety.
- **Tailwind CSS v4**: Advanced styling with a CSS-first approach.
- **Context + useReducer**: Centralized state management using native React hooks.
- **Framer Motion**: Smooth animations and transitions.
- **Hello-Pangea/DnD**: Accessible drag-and-drop functionality.
- **React Hook Form & Zod**: Robust form handling and validation.
- **Lucide React**: Beautiful, consistent iconography.

## 📂 Project Structure

```text
src/
├── components/
│   ├── ui/             # Reusable Design System (Atomic Components)
│   │   ├── Badge       - Status and tag indicators
│   │   ├── Button      - Variants: primary, secondary, ghost, destructive
│   │   ├── Card        - Container for task content
│   │   ├── Modal       - Animated dialogs with focus management
│   │   ├── Toast       - Ephemeral notifications
│   │   └── Inputs      - Textbox, Textarea, and Select components
│   └── board/          # Feature-specific components
│       ├── TaskBoard   - Drag-and-drop board layout
│       ├── TaskCard    - Individual task visualization
│       ├── TaskForm    - Create/Edit logic and validation
│       └── BoardFilters- Search, sort, and visibility toggles
├── context/
│   └── AppContext.tsx  - Centralized state management using Reducer
├── hooks/
│   └── useSyncUrlParams- Synchronizes app state with URL query strings
├── lib/
│   ├── storage.ts      - LocalStorage wrapper with schema migration
│   └── utils.ts        - Utility for merging Tailwind classes (cn)
└── types/
    └── index.ts        - Centralized TypeScript definitions
```

## ✨ Key Features

### 1. Advanced Board Management
- **Drag-and-Drop**: Smoothly move tasks between "Backlog", "In Progress", and "Done" columns.
- **Dynamic Counters**: Real-time task counts per column and total progress stats.

### 2. Powerful Filtering & Sorting
- **URL Synchronization**: Filters and sort orders are reflected in the URL, making the view shareable and persistent across refreshes.
- **Multi-select Status**: Hide or show entire columns.
- **Contextual Search**: High-performance text search across titles and descriptions.

### 3. Task Lifecycle
- **CRUD**: Full Create, Read, Update, and Delete capabilities.
- **Validation**: Strict client-side validation using Zod schemas.
- **Dirty State Protection**: Warns users if they try to close the modal with unsaved changes.

### 4. Data Persistence & Migration
- **LocalStorage**: Tasks are saved locally in the browser.
- **Versioned Schema**: Includes a migration engine that detects older data structures and upgrades them automatically without data loss.

### 5. Premium UI/UX
- **Responsive Design**: Fluid transitions from desktop grid to mobile-optimized stacks.
- **Accessibility**: ARIA labels, keyboard navigation (Esc to close modals), and semantic HTML.
- **White Theme**: A clean, "Product-based" aesthetic with soft shadows and refined typography.

## 🛠️ Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Development Server**:
   ```bash
   npm run dev
   ```

3. **Build for Production**:
   ```bash
   npm run build
   ```

# Team Workflow Board

A responsive React application for managing team tasks with a custom-built design system, drag-and-drop board, and local data persistence.

## Tech Stack

| Layer | Library / Version |
|---|---|
| Framework | React 19 + TypeScript |
| Build Tool | Vite 8 |
| Styling | Tailwind CSS v4 (CSS-first) |
| State Management | Context API + useReducer |
| Animations | Framer Motion 12 |
| Drag & Drop | @hello-pangea/dnd 18 |
| Forms & Validation | React Hook |
| Icons | Lucide React |
| Date Formatting | date-fns 4 |

## Project Structure

src/
├── components/
│   ├── auth/
│   │   └── LoginPage.tsx       # Only Frontend login with form
│   ├── board/
│   │   ├── TaskBoard.tsx        # DnD board with 3 columns
│   │   ├── TaskCard.tsx         # Individual task card with edit/delete
│   │   ├── TaskForm.tsx         # Create/Edit form with Zod validation
│   │   └── BoardFilters.tsx     # Search, priority filter, sort, column toggles
│   └── ui/                      # Reusable design system components
│       ├── Badge.tsx
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── Input.tsx
│       ├── Modal.tsx
│       ├── Select.tsx
│       ├── TextArea.tsx
│       └── Toast.tsx
├── context/
│   └── AppContext.tsx           # Global state: tasks, filters, sort, toasts
├── hooks/
│   └── useSyncUrlParams.ts      # Syncs filter/sort state to URL query params
├── lib/
│   ├── storage.ts               # LocalStorage wrapper with schema migration
│   └── utils.ts                 
├── types/
│   └── index.ts                 # Shared TypeScript types
├── App.tsx                      # Root layout
└── main.tsx
```

## Features

### Authentication
- Only Frontend login gate with simulated async delay
npm install

**Run development server:**
npm run dev

**Build for production:**
npm run build

## Requirements
- Node.js
- npm
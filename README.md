# Task Manager Frontend

A modern, feature-rich task management application built with Next.js 15, TypeScript, and Material-UI. This frontend connects to a Spring Boot backend API to provide comprehensive task management capabilities.

## 🚀 Features

### Core Functionality
- ✅ **Full CRUD Operations** - Create, read, update, and delete tasks
- ✅ **Advanced Filtering & Search** - Filter by status, priority, category, assignee, and search across all fields
- ✅ **Pagination & Sorting** - Efficient handling of large task lists
- ✅ **Real-time Updates** - Optimistic updates and automatic data synchronization
- ✅ **Responsive Design** - Mobile-first design that works on all devices

### Task Management
- ✅ **Task Status Management** - TODO, IN_PROGRESS, ON_HOLD, COMPLETED, CANCELLED
- ✅ **Priority Levels** - LOW, MEDIUM, HIGH, URGENT with visual indicators
- ✅ **Categories & Assignment** - Organize tasks and assign to team members
- ✅ **Due Date Tracking** - Visual indicators for overdue and due-today tasks
- ✅ **Progress Tracking** - Visual progress indicators and completion estimates

### Dashboard & Analytics
- ✅ **Comprehensive Dashboard** - Overview of all task metrics and statistics
- ✅ **Interactive Charts** - Status distribution and priority analysis
- ✅ **Quick Actions** - Fast access to common operations
- ✅ **Recent Tasks** - Quick view of recently updated tasks

### Advanced Features
- ✅ **Bulk Operations** - Select multiple tasks for batch updates or deletions
- ✅ **Global Search** - Search across all task fields with real-time results
- ✅ **Export Capabilities** - Export task data to CSV
- ✅ **Validation & Error Handling** - Form validation and user-friendly error messages

### User Experience
- ✅ **Modern UI** - Clean, intuitive Material Design interface
- ✅ **Dark/Light Theme** - System preference-based theme switching
- ✅ **Keyboard Navigation** - Full keyboard accessibility
- ✅ **Loading States** - Smooth loading indicators and skeletons
- ✅ **Offline Indicators** - Clear error states when backend is unavailable

## 🛠️ Technology Stack

- **Frontend Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **UI Library**: Material-UI (MUI) v6
- **State Management**: TanStack Query (React Query)
- **Form Handling**: React Hook Form with Yup validation
- **Date Handling**: Day.js with MUI Date Pickers
- **HTTP Client**: Axios
- **Styling**: Material-UI + Custom CSS
- **Development Tools**: ESLint, TypeScript

## 📋 Prerequisites

Before running this application, ensure you have:

- **Node.js** 18+ installed
- **npm** or **yarn** package manager
- **Spring Boot Backend** running on `http://localhost:8080`

## 🚀 Getting Started

### 1. Clone and Install

```bash
# Navigate to the project directory
cd task-manager-frontend

# Install dependencies
npm install

# Or with yarn
yarn install
```

### 2. Configure Environment

Create a `.env.local` file in the root directory:

```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1

# Optional: Enable React Query DevTools in production
NEXT_PUBLIC_ENABLE_DEVTOOLS=false
```

### 3. Start Development Server

```bash
# Start the development server
npm run dev

# Or with yarn
yarn dev
```

The application will be available at `http://localhost:3000`.

### 4. Build for Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Dashboard page
│   ├── providers.tsx      # Global providers
│   ├── tasks/             # Task-related pages
│   ├── analytics/         # Analytics page
│   └── search/            # Search page
├── components/            # Reusable UI components
│   ├── dashboard/         # Dashboard-specific components
│   ├── layout/            # Layout components
│   └── tasks/             # Task-related components
├── hooks/                 # Custom React hooks
│   └── use-tasks.ts       # Task management hooks
├── lib/                   # Utility libraries
│   ├── api.ts             # API client
│   ├── query-client.ts    # React Query configuration
│   ├── theme.ts           # Material-UI theme
│   └── utils.ts           # Utility functions
└── types/                 # TypeScript type definitions
    └── task.ts            # Task-related types
```

## 🔧 Configuration

### API Configuration

The frontend connects to the Spring Boot backend API. Update the base URL in `src/lib/api.ts`:

```typescript
const BASE_URL = 'http://localhost:8080/api/v1/tasks';
```

### Theme Customization

Customize the Material-UI theme in `src/lib/theme.ts`:

```typescript
export const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
    // ... other customizations
  },
});
```

## 📱 Features Overview

### Dashboard
- **Overview Cards**: Total tasks, in-progress, overdue, and due today
- **Status Distribution**: Interactive pie chart showing task status breakdown
- **Priority Analysis**: Bar chart displaying priority distribution
- **Recent Tasks**: Quick access to recently updated tasks
- **Quick Actions**: Fast navigation to filtered views

### Task Management
- **List View**: Grid and table views with sorting and filtering
- **Task Cards**: Rich task cards with status, priority, and progress indicators
- **Task Details**: Comprehensive task view with all information and actions
- **Task Form**: Full-featured form with validation for creating/editing tasks

### Search & Filtering
- **Global Search**: Search across title, description, category, and assignee
- **Advanced Filters**: Filter by status, priority, category, dates, and more
- **Real-time Results**: Instant search results as you type
- **Filter Persistence**: URL-based filter state for bookmarking

### Bulk Operations
- **Multi-Select**: Select multiple tasks with checkboxes
- **Batch Updates**: Update status for multiple tasks at once
- **Batch Delete**: Delete multiple tasks with confirmation
- **Clear Selection**: Easy way to clear current selection

## 🎯 Usage Guide

### Creating Tasks
1. Click "Create Task" button or use the floating action button
2. Fill in task details (title, description, priority, etc.)
3. Set due date and assign to team members
4. Save to create the task

### Managing Tasks
- **View Details**: Click on any task card to see full details
- **Edit Tasks**: Use the edit button in task details or card menu
- **Update Status**: Use quick action buttons or edit form
- **Delete Tasks**: Use delete button with confirmation dialog

### Filtering & Search
- **Quick Filters**: Use sidebar navigation for common filters
- **Advanced Filters**: Toggle filter panel for detailed filtering
- **Search**: Use the search page or header search for global search
- **Clear Filters**: Use clear button to reset all filters

### Analytics
- Navigate to Analytics page for detailed insights
- View completion rates, priority distribution, and team performance
- Analyze task trends and identify bottlenecks

## 🔍 API Integration

The frontend integrates with all Spring Boot backend endpoints:

### Core Endpoints
- `GET /api/v1/tasks` - Get all tasks with pagination
- `POST /api/v1/tasks` - Create new task
- `GET /api/v1/tasks/{id}` - Get task by ID
- `PUT /api/v1/tasks/{id}` - Update task
- `DELETE /api/v1/tasks/{id}` - Delete task

### Advanced Endpoints
- `GET /api/v1/tasks/filter` - Advanced filtering
- `GET /api/v1/tasks/search` - Global search
- `GET /api/v1/tasks/statistics` - Task statistics
- `GET /api/v1/tasks/overdue` - Overdue tasks
- `GET /api/v1/tasks/due-today` - Tasks due today

### Bulk Operations
- `POST /api/v1/tasks/bulk-update-status` - Bulk status update
- `DELETE /api/v1/tasks/bulk-delete` - Bulk delete

## 🧪 Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors

# Type checking
npm run type-check   # Run TypeScript compiler check
```

### Code Style

- **TypeScript**: Strict mode enabled with comprehensive type checking
- **ESLint**: Configured with Next.js and TypeScript rules
- **Prettier**: Code formatting (if configured)
- **Material-UI**: Component-based styling with theme system

### Development Guidelines

1. **Components**: Use functional components with hooks
2. **State Management**: Prefer React Query for server state, useState for local state
3. **Error Handling**: Always handle errors gracefully with user feedback
4. **Accessibility**: Use semantic HTML and ARIA attributes
5. **Performance**: Implement proper loading states and optimize re-renders

## 🔧 Troubleshooting

### Common Issues

1. **Backend Connection Issues**
   - Ensure Spring Boot backend is running on port 8080
   - Check CORS configuration in backend
   - Verify API endpoints are accessible

2. **Build Errors**
   - Clear node_modules and reinstall dependencies
   - Check TypeScript errors and fix them
   - Ensure all imports are correct

3. **Development Server Issues**
   - Check if port 3000 is available
   - Clear Next.js cache: `rm -rf .next`
   - Restart development server

### Error Messages

- **"Failed to load tasks"**: Backend API is not accessible
- **"Validation errors"**: Check form input validation
- **"Network Error"**: Check internet connection and backend status

## 🚀 Deployment

### Build for Production

```bash
npm run build
npm start
```

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

### Deploy to Netlify

```bash
npm run build
# Upload 'out' directory to Netlify
```

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License. See the LICENSE file for details.

## 🆘 Support

For support and questions:

- **Documentation**: Check this README and code comments
- **Issues**: Open an issue on GitHub
- **Backend API**: Ensure Spring Boot backend is properly configured

## 🔄 Future Enhancements

- [ ] Real-time notifications with WebSocket
- [ ] Drag-and-drop task management (Kanban board)
- [ ] File attachments for tasks
- [ ] Task comments and collaboration
- [ ] Advanced reporting and analytics
- [ ] Mobile app with React Native
- [ ] Offline support with service workers
- [ ] Integration with external tools (Slack, Trello, etc.)

---

**Built with ❤️ using Next.js, TypeScript, and Material-UI**
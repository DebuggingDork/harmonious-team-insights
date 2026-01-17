# TeamTune - Team Management & Collaboration Platform

A modern, full-featured team management platform built with React, TypeScript, and Vite.

## 🚀 Features

- **Team Management**: Organize teams, assign roles, and manage team members
- **Sprint Planning**: Create and manage sprints with task tracking
- **Task Management**: Assign tasks, track progress, and monitor deadlines
- **GitHub Integration**: Connect GitHub accounts, manage repositories, create branches and PRs
- **Real-time Collaboration**: Seamless team collaboration with live updates
- **Role-based Access**: Admin, Team Lead, Project Manager, and Employee roles
- **Analytics Dashboard**: Track team performance and productivity metrics

## 🛠️ Technologies Used

- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui + Radix UI
- **State Management**: TanStack Query (React Query)
- **Routing**: React Router v6
- **Forms**: React Hook Form + Zod
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Date Handling**: date-fns
- **HTTP Client**: Axios

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Git

## 🏃 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/DebuggingDork/harmonious-team-insights.git
cd harmonious-team-insights
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=https://upea.onrender.com
VITE_TOKEN_STORAGE_KEY=upea_token
```

### 4. Start the development server

```bash
npm run dev
```

The application will be available at `http://localhost:8080`

## 📦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🌐 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import the project in Vercel
3. Configure environment variables:
   - `VITE_API_BASE_URL`
   - `VITE_TOKEN_STORAGE_KEY`
4. Deploy!

### Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist` directory.

## 📁 Project Structure

```
src/
├── api/              # API client and endpoints
├── components/       # Reusable UI components
│   ├── ui/          # shadcn/ui components
│   ├── github/      # GitHub integration components
│   └── ...
├── hooks/           # Custom React hooks
├── pages/           # Page components
├── services/        # API service functions
├── utils/           # Utility functions
├── App.tsx          # Main app component
└── main.tsx         # Entry point
```

## 🔐 Authentication

The app uses JWT-based authentication. Tokens are stored in localStorage and automatically attached to API requests.

## 🐙 GitHub Integration

TeamTune integrates with GitHub to provide:
- Repository management
- Branch creation
- Pull request workflows
- Code review features
- Collaborator management

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is private and proprietary.

## 👥 Team

Built with ❤️ by the TeamTune development team.

## 📞 Support

For support, please contact the development team or open an issue in the repository.

---

**Version**: 1.0.0

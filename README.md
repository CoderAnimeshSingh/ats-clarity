# ResumeATS - Free ATS-Optimized Resume & Cover Letter Builder

<div align="center">

![ResumeATS](https://img.shields.io/badge/ResumeATS-Resume%20Builder-6366f1?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.3-61dafb?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=flat-square&logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

**Create professional, ATS-optimized resumes and cover letters in minutes.**  
No signup required. 100% free. Your data stays on your device.

[Live Demo](https://resumeats.app) • [Report Bug](https://github.com/yourusername/resumeats/issues) • [Request Feature](https://github.com/yourusername/resumeats/issues)

</div>

---

## ✨ Features

### 🎯 ATS Optimization
- **Real-time ATS Scoring** - Get instant feedback on how well your resume performs
- **Smart Suggestions** - Actionable tips to improve your resume's visibility
- **Keyword Optimization** - Ensure your skills and experience are highlighted

### 📄 Resume Builder
- **Step-by-step Wizard** - Easy-to-follow process for creating professional resumes
- **Live Preview** - See changes in real-time as you type
- **Multiple Templates** - Choose from clean, ATS-friendly designs
- **All Sections Included** - Personal info, summary, skills, experience, education, projects

### ✉️ Cover Letter Builder
- **4 Tone Options** - Professional, Confident, Friendly, or Formal
- **Pre-built Templates** - Get started quickly with customizable templates
- **Company Personalization** - Auto-fill company name and job title throughout

### 📥 Export & Storage
- **PDF Export** - Download print-ready PDFs in A4 or US Letter format
- **Offline Storage** - All data stored locally using IndexedDB
- **No Account Required** - Start building immediately without signup
- **Privacy First** - Your data never leaves your device

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/resumeats.git

# Navigate to project directory
cd resumeats

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:8080](http://localhost:8080) to view the app.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 18** | UI Framework |
| **TypeScript** | Type Safety |
| **Vite** | Build Tool |
| **Tailwind CSS** | Styling |
| **shadcn/ui** | UI Components |
| **Zustand** | State Management |
| **Dexie (IndexedDB)** | Local Storage |
| **@react-pdf/renderer** | PDF Generation |
| **Framer Motion** | Animations |
| **React Hook Form + Zod** | Form Handling |

---

## 📁 Project Structure

```
src/
├── components/
│   ├── builder/          # Resume builder components
│   ├── cover-letter/     # Cover letter components
│   ├── ui/               # Reusable UI components (shadcn)
│   └── upgrade/          # Upgrade modal (unused - all features free)
├── hooks/                # Custom React hooks
├── lib/
│   ├── atsEngine.ts      # ATS scoring engine
│   ├── db.ts             # IndexedDB operations
│   ├── templates.ts      # Resume templates
│   └── utils.ts          # Utility functions
├── pages/
│   ├── LandingPage.tsx   # Homepage
│   ├── DashboardPage.tsx # Document management
│   ├── BuilderPage.tsx   # Resume editor
│   └── CoverLetterPage.tsx # Cover letter editor
├── store/
│   ├── resumeStore.ts    # Resume state
│   ├── coverLetterStore.ts # Cover letter state
│   └── appStore.ts       # App-wide state
└── types/
    └── resume.ts         # TypeScript interfaces
```

---

## 🎨 Features Breakdown

### Resume Builder Steps
1. **Personal Info** - Name, contact details, links
2. **Summary** - Professional summary/objective
3. **Skills** - Technical and soft skills
4. **Experience** - Work history with achievements
5. **Education** - Academic background
6. **Projects** - Portfolio projects

### ATS Scoring Rules
- ✅ Contact information completeness
- ✅ Professional summary presence
- ✅ Skills section with keywords
- ✅ Work experience with achievements
- ✅ Education details
- ✅ Action verb usage
- ✅ Quantifiable results

---

## 📦 Deployment

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/resumeats)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Netlify

```bash
# Build for production
npm run build

# Deploy dist folder to Netlify
```

### Docker

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## 🔧 Configuration

### Environment Variables
No environment variables required - the app runs entirely client-side.

### Build Commands
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [Lucide Icons](https://lucide.dev/) - Icon library
- [@react-pdf/renderer](https://react-pdf.org/) - PDF generation
- [Dexie.js](https://dexie.org/) - IndexedDB wrapper

---

<div align="center">

**Made with ❤️ for job seekers everywhere**

[⬆ Back to top](#resumeats---free-ats-optimized-resume--cover-letter-builder)

</div>

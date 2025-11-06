# Productica - AI-Powered Business Analysis Platform

A modern React + TypeScript application for business idea validation, market research, and product-market fit analysis with Supabase authentication and credit system.

## 🚀 Live Demo

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Rawxie/trialll)

## ✨ Features

- **Google OAuth Authentication** with Supabase
- **Credit System** - 5 free credits for new users
- **AI-Powered Analysis Modules**:
  - Idea Validation
  - Market Research
  - Product-Market Fit (PMF)
  - All-in-One Analysis
- **Real-time Credit Tracking** and transaction history
- **Modern UI** with shadcn/ui components
- **Responsive Design** with dark/light theme support
- **Demo Mode** for non-authenticated users

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI Components**: shadcn/ui + Radix UI
- **Styling**: Tailwind CSS
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL
- **State Management**: React Context + Hooks
- **Routing**: React Router v6
- **Icons**: Lucide React

## 🚀 Quick Deploy to Vercel

### Option 1: One-Click Deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Rawxie/trialll)

### Option 2: Manual Deploy

1. **Fork this repository**
2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Import your forked repository
   - Vercel will auto-detect Vite configuration

3. **Set Environment Variables**:
   ```
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Deploy** - Vercel will automatically build and deploy!

## 🔧 Local Development

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Rawxie/trialll.git
   cd trialll
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.template .env
   # Edit .env with your Supabase credentials
   ```

4. **Set up Supabase** (see [SUPABASE_SETUP.md](./SUPABASE_SETUP.md))

5. **Start development server**:
   ```bash
   npm run dev
   ```

6. **Open** http://localhost:8080

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # shadcn/ui components
│   └── ...             # Feature components
├── contexts/           # React contexts
├── hooks/              # Custom hooks
├── lib/                # Utilities and configs
├── pages/              # Page components
└── assets/             # Static assets
```

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🗄️ Database Setup

1. Create a Supabase project
2. Run the SQL from `supabase-schema.sql` in your Supabase SQL editor
3. Configure Google OAuth in Supabase Auth settings

See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for detailed instructions.

## 🎨 Customization

### Theming
- Modify `src/index.css` for global styles
- Update `tailwind.config.ts` for design system
- Customize components in `src/components/ui/`

### Adding New Modules
1. Create component in `src/components/`
2. Add route in `src/App.tsx`
3. Update navigation in `src/components/AppSidebar.tsx`

## 📱 Deployment

### Vercel (Recommended)
- Automatic deployments from GitHub
- Built-in environment variable management
- Global CDN and edge functions

### Other Platforms
- **Netlify**: Works with Vite out of the box
- **Railway**: Supports Node.js applications
- **Render**: Static site deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📖 [Documentation](./SUPABASE_SETUP.md)
- 🐛 [Report Issues](https://github.com/Rawxie/trialll/issues)
- 💬 [Discussions](https://github.com/Rawxie/trialll/discussions)

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for beautiful components
- [Supabase](https://supabase.com/) for backend services
- [Vite](https://vitejs.dev/) for fast development
- [Tailwind CSS](https://tailwindcss.com/) for styling

---

**Made with ❤️ for entrepreneurs and innovators**
# 🎅 Secret Santa Application

A React web application to manage Secret Santa events among friends, with administrative management and participant access via unique codes.

## 📋 Overview

This application allows you to:
- **Organize** multiple Secret Santa events
- **Manage** participants and event rules
- **Draw** matches automatically with a random algorithm
- **Allow participants** to view their match securely
- **Automatically reveal** all matches after the gift opening date

## 🚀 Technologies

- **Frontend**: React + Vite
- **Styling**: CSS Modules
- **State Management**: useState + Context API + useReducer
- **Routing**: React Router
- **Backend**: Supabase (PostgreSQL)
- **Authentication**: 
  - Admin: Supabase Auth (username/password)
  - Participants: Double code (Event Code + Participant Code)
- **Email**: Resend (reset notifications)
- **Deploy**: Vercel

## ✨ Main Features

### For Administrators
- ✅ Protected admin panel with authentication
- ✅ Multiple events management
- ✅ Rules, budget and countdown configuration
- ✅ CRUD participants (add, edit, delete)
- ✅ Automatic extraction with Christmas animation
- ✅ View matches (optional, with toggle)
- ✅ Reset views for participants
- ✅ Receive email for reset requests

### For Participants
- ✅ Access via double code (Event + Participant)
- ✅ View match **ONLY ONCE** (before opening)
- ✅ Request reset via email to admin
- ✅ View complete list of all matches after opening date
- ✅ Global rules panel always accessible

### Design & UX
- 🎄 Christmas theme (red, green, white, gold)
- ❄️ Christmas animations (snowflakes, reveal effects)
- 📱 Mobile-first responsive design
- ⏱️ Dynamic countdown for gift opening

## 📂 Project Structure

```
src/
  ├── components/          # React components
  │   ├── Admin/          # Admin panel components
  │   ├── Participant/    # Participant view components
  │   └── Shared/         # Shared components
  ├── pages/              # Main pages
  ├── hooks/              # Custom React hooks
  ├── utils/              # Utilities (algorithms, encryption, etc.)
  ├── context/            # Context API providers
  └── styles/             # Global CSS and modules
```

## 🗄️ Database (Supabase)

### Main Tables
- **events**: Secret Santa events with configuration
- **participants**: Participants for each event
- **assignments**: Encrypted matches
- **reset_requests**: View reset requests

## 🔐 Security

- Row Level Security (RLS) on Supabase
- Matches masked with hash/encryption in database
- Editable and unique participant codes per event
- Confirmations for destructive operations (deletions)

## 📅 MVP (Minimum Viable Product)

The project is currently in development. MVP features include:
- Complete event and participant management
- Extraction system with validations
- Secure access for participants
- Controlled viewing (once only)
- Email reset system
- Responsive Christmas design

## 🚧 Future Features

- Automatic email delivery with codes
- Exclusions/couples management
- Wish lists for participants
- Past events history
- Anonymous chat between giver and receiver
- Multi-language (i18n)
- Customizable themes

## 👨‍💻 Development

### Prerequisites
- Node.js (v18+)
- Supabase account
- Resend account (for email)

### Local Setup
```bash
# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your Supabase and Resend credentials

# Start development server
npm run dev
```

### Production Build
```bash
npm run build
npm run preview
```

## 📦 Deploy

The application is configured for deployment on Vercel:
```bash
# Automatic deploy by connecting GitHub repository to Vercel
# or
vercel deploy
```

## 📄 License

This project was created for personal use.

## 🎁 Contributions

Contributions, issues and feature requests are welcome!

---

**Happy Secret Santa! 🎅🎄**

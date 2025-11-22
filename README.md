# 🎅 Secret Santa Application

A complete React web application to manage Secret Santa events among friends, with administrative management and participant access via unique codes.

> **✅ IMPLEMENTATION STATUS**: Fully implemented and ready to use!

## 📋 Overview

This application allows you to:
- **Organize** multiple Secret Santa events
- **Manage** participants and event rules  
- **Draw** matches automatically with a random algorithm
- **Allow participants** to view their match securely (one time only)
- **Automatically reveal** all matches after the gift opening date
- **Send email notifications** for view reset requests

## 🚀 Technologies

- **Frontend**: React + Vite
- **Styling**: CSS Modules + Inline Styles
- **State Management**: useState + Context API
- **Routing**: React Router v6
- **Backend**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth (admin) + Double codes (participants)
- **Email**: Resend
- **Encryption**: crypto-js
- **Deploy**: Vercel

## ✨ Main Features

### For Administrators ✅
- ✅ Protected admin panel with authentication
- ✅ Multiple events management
- ✅ Auto-generated codes
- ✅ **Default rules and instructions in Italian** (fully editable)
- ✅ CRUD participants with confirmations
- ✅ Automatic extraction with animations
- ✅ Toggle show/hide matches
- ✅ Reset participant views
- ✅ Email notifications

### For Participants ✅
- ✅ Access via double code
- ✅ One-time view system
- ✅ Warning before reveal
- ✅ Request reset via email
- ✅ Post-event: view all assignments
- ✅ Collapsible rules panel

### Design ✅
- 🎄 Christmas theme
- ❄️ Snowflakes animation
- 🎁 Reveal animations
- 📱 Mobile-first responsive

## 🚀 Quick Start

```bash
# Install
npm install

# Configure .env (see .env.example)
cp .env.example .env

# Run Supabase SQL setup (see SUPABASE_SETUP.md)

# Dev
npm run dev

# Build
npm run build
```

See **SETUP_GUIDE.md** for complete instructions!

## 📚 Documentation

- **SETUP_GUIDE.md**: Complete setup and deployment
- **SUPABASE_SETUP.md**: Database schema and SQL
- **SECRET_SANTA_SPEC.md**: Original specifications

## 📄 License

MIT - Personal use project

---

**Happy Secret Santa! 🎅🎄**

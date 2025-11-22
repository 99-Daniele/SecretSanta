# Supabase Database Schema

## SQL Setup Script

Execute these SQL commands in your Supabase SQL Editor to set up the database:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- EVENTS TABLE
-- ============================================
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome_evento TEXT NOT NULL,
  event_code TEXT UNIQUE NOT NULL,
  anno INTEGER NOT NULL,
  budget_min DECIMAL(10,2),
  budget_max DECIMAL(10,2),
  data_apertura TIMESTAMP WITH TIME ZONE NOT NULL,
  regole_testo TEXT,
  note_admin TEXT,
  is_active BOOLEAN DEFAULT true,
  extraction_done BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster event code lookup
CREATE INDEX idx_events_code ON events(event_code);
CREATE INDEX idx_events_active ON events(is_active);

-- ============================================
-- PARTICIPANTS TABLE
-- ============================================
CREATE TABLE participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  cognome TEXT NOT NULL,
  email TEXT,
  ruolo TEXT,
  access_code TEXT NOT NULL,
  has_viewed BOOLEAN DEFAULT false,
  viewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(event_id, access_code)
);

-- Indexes for faster lookups
CREATE INDEX idx_participants_event ON participants(event_id);
CREATE INDEX idx_participants_code ON participants(event_id, access_code);

-- ============================================
-- ASSIGNMENTS TABLE
-- ============================================
CREATE TABLE assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  giver_id UUID NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
  receiver_name_encrypted TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(event_id, giver_id)
);

-- Indexes
CREATE INDEX idx_assignments_event ON assignments(event_id);
CREATE INDEX idx_assignments_giver ON assignments(giver_id);

-- ============================================
-- RESET REQUESTS TABLE
-- ============================================
CREATE TABLE reset_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  participant_id UUID NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
  requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_resolved BOOLEAN DEFAULT false,
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Indexes
CREATE INDEX idx_reset_requests_event ON reset_requests(event_id);
CREATE INDEX idx_reset_requests_participant ON reset_requests(participant_id);
CREATE INDEX idx_reset_requests_resolved ON reset_requests(is_resolved);

-- ============================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_participants_updated_at BEFORE UPDATE ON participants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reset_requests ENABLE ROW LEVEL SECURITY;

-- Policy: Authenticated users (admin) can do everything
CREATE POLICY "Authenticated users can manage events"
  ON events FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage participants"
  ON participants FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage assignments"
  ON assignments FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage reset requests"
  ON reset_requests FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Policy: Anonymous users can read events by code (for participants)
CREATE POLICY "Anyone can read active events by code"
  ON events FOR SELECT
  USING (is_active = true);

-- Policy: Anonymous users can read participants by event and code
CREATE POLICY "Anyone can read participants with valid codes"
  ON participants FOR SELECT
  USING (true);

-- Policy: Anonymous users can read their own assignment
CREATE POLICY "Participants can read their assignment"
  ON assignments FOR SELECT
  USING (true);

-- Policy: Anonymous users can create reset requests
CREATE POLICY "Anyone can create reset requests"
  ON reset_requests FOR INSERT
  WITH CHECK (true);

```

## Authentication Setup

### Create Admin User

1. Go to Supabase Dashboard > Authentication > Users
2. Click "Add User"
3. Enter email and password for admin
4. Save

### Admin Login Credentials

Store admin credentials securely. Users will log in through the application using Supabase Auth.

## Environment Variables Required

Add these to your `.env` file:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_RESEND_API_KEY=your-resend-key
VITE_ADMIN_EMAIL=admin@example.com
VITE_ENCRYPTION_KEY=your-32-character-key
```

## Notes

- **RLS (Row Level Security)** is enabled to protect data
- Authenticated users (admin) have full access
- Anonymous users can only read public data and create reset requests
- Assignments are encrypted using the receiver_name_encrypted field
- Cascade deletions ensure referential integrity

-- ============================================================
--  Rently Multifamily POC — PostgreSQL Schema
--  Run:  psql $DATABASE_URL -f schema.sql
-- ============================================================

-- Enable pgcrypto for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ── Users & Auth ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email       TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name   TEXT NOT NULL,
  role        TEXT NOT NULL DEFAULT 'manager'  -- admin | manager | maintenance | owner
              CHECK (role IN ('admin','manager','maintenance','owner')),
  org_id      UUID,                            -- future multi-tenant scope
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Communities / Properties ──────────────────────────────
CREATE TABLE IF NOT EXISTS communities (
  id           SERIAL PRIMARY KEY,
  name         TEXT NOT NULL,
  address      TEXT NOT NULL,
  total_units  INT NOT NULL DEFAULT 0,
  occupied_units INT NOT NULL DEFAULT 0,
  org_id       UUID,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS buildings (
  id           TEXT PRIMARY KEY,        -- e.g. 'b1'
  community_id INT NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  name         TEXT NOT NULL,
  total_units  INT NOT NULL DEFAULT 0,
  occupied_units INT NOT NULL DEFAULT 0
);

-- ── Units ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS units (
  id           SERIAL PRIMARY KEY,
  unit_number  TEXT NOT NULL,
  building_id  TEXT REFERENCES buildings(id) ON DELETE SET NULL,
  community_id INT NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  unit_type    TEXT NOT NULL,            -- '1BR/1BA', '2BR/2BA', 'Studio', etc.
  sqft         INT,
  rent         NUMERIC(10,2) NOT NULL,
  market_rent  NUMERIC(10,2),
  status       TEXT NOT NULL DEFAULT 'vacant'
               CHECK (status IN ('occupied','vacant','maintenance','pending')),
  days_vacant  INT,
  tour_score   INT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Tenants ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS tenants (
  id           SERIAL PRIMARY KEY,
  full_name    TEXT NOT NULL,
  email        TEXT,
  phone        TEXT,
  unit_id      INT REFERENCES units(id) ON DELETE SET NULL,
  community_id INT REFERENCES communities(id) ON DELETE CASCADE,
  status       TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','former','applicant')),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Leases ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS leases (
  id           SERIAL PRIMARY KEY,
  unit_id      INT NOT NULL REFERENCES units(id) ON DELETE CASCADE,
  tenant_id    INT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  start_date   DATE NOT NULL,
  end_date     DATE NOT NULL,
  monthly_rent NUMERIC(10,2) NOT NULL,
  deposit      NUMERIC(10,2),
  status       TEXT NOT NULL DEFAULT 'active'
               CHECK (status IN ('active','expired','pending','terminated')),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Rent Payments ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS rent_payments (
  id           SERIAL PRIMARY KEY,
  unit_id      INT NOT NULL REFERENCES units(id) ON DELETE CASCADE,
  tenant_id    INT REFERENCES tenants(id) ON DELETE SET NULL,
  amount_due   NUMERIC(10,2) NOT NULL,
  amount_paid  NUMERIC(10,2) NOT NULL DEFAULT 0,
  status       TEXT NOT NULL DEFAULT 'upcoming'
               CHECK (status IN ('paid','partial','overdue','upcoming')),
  due_date     DATE NOT NULL,
  paid_date    DATE,
  method       TEXT CHECK (method IN ('ACH','Card','Check','Cash', NULL)),
  late_fee     NUMERIC(10,2) NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Expenses ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS expenses (
  id           SERIAL PRIMARY KEY,
  community_id INT NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  category     TEXT NOT NULL,
  amount       NUMERIC(10,2) NOT NULL,
  period_month INT NOT NULL,  -- 1-12
  period_year  INT NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Maintenance ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS maintenance_tickets (
  id           TEXT PRIMARY KEY,          -- e.g. 'MT001'
  unit_id      INT REFERENCES units(id) ON DELETE SET NULL,
  community_id INT REFERENCES communities(id) ON DELETE CASCADE,
  tenant_id    INT REFERENCES tenants(id) ON DELETE SET NULL,
  category     TEXT NOT NULL,
  description  TEXT NOT NULL,
  priority     TEXT NOT NULL DEFAULT 'medium'
               CHECK (priority IN ('urgent','high','medium','low')),
  status       TEXT NOT NULL DEFAULT 'open'
               CHECK (status IN ('open','in-progress','scheduled','resolved')),
  assigned_to  TEXT,
  estimated_cost NUMERIC(10,2),
  actual_cost  NUMERIC(10,2),
  days_open    INT NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Bookings / Leads ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS leads (
  id           SERIAL PRIMARY KEY,
  name         TEXT NOT NULL,
  email        TEXT,
  phone        TEXT,
  source       TEXT,                      -- 'Zillow','Website','Referral', etc.
  status       TEXT NOT NULL DEFAULT 'warm'
               CHECK (status IN ('hot','warm','cold')),
  stage        TEXT NOT NULL DEFAULT 'Inquiry',
  interested_in TEXT,
  budget_min   NUMERIC(10,2),
  budget_max   NUMERIC(10,2),
  tour_date    DATE,
  follow_up_date DATE,
  ai_score     INT,
  notes        TEXT,
  touchpoints  INT NOT NULL DEFAULT 0,
  days_in_pipeline INT NOT NULL DEFAULT 0,
  assigned_to  TEXT,
  community_id INT REFERENCES communities(id) ON DELETE CASCADE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Communications ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS messages (
  id           SERIAL PRIMARY KEY,
  tenant_id    INT REFERENCES tenants(id) ON DELETE CASCADE,
  community_id INT REFERENCES communities(id) ON DELETE CASCADE,
  category     TEXT NOT NULL DEFAULT 'general'
               CHECK (category IN ('general','maintenance','lease','payment')),
  subject      TEXT NOT NULL,
  preview      TEXT,
  body         TEXT,
  is_unread    BOOLEAN NOT NULL DEFAULT true,
  is_priority  BOOLEAN NOT NULL DEFAULT false,
  sent_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── AI Screening Applicants ───────────────────────────────
CREATE TABLE IF NOT EXISTS applicants (
  id              SERIAL PRIMARY KEY,
  name            TEXT NOT NULL,
  email           TEXT,
  unit_id         INT REFERENCES units(id) ON DELETE SET NULL,
  applied_date    DATE NOT NULL DEFAULT CURRENT_DATE,
  credit_score    INT,
  monthly_income  NUMERIC(10,2),
  income_ratio    NUMERIC(5,2),
  rental_history  TEXT,
  employment      TEXT,
  ai_score        INT,
  risk_level      TEXT CHECK (risk_level IN ('low','medium','high')),
  status          TEXT NOT NULL DEFAULT 'pending'
                  CHECK (status IN ('pending','approved','conditional','declined')),
  flags           TEXT[],
  recommendation  TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Equipment Health (Predictive Maintenance) ─────────────
CREATE TABLE IF NOT EXISTS equipment (
  id                   SERIAL PRIMARY KEY,
  name                 TEXT NOT NULL,
  building_id          TEXT REFERENCES buildings(id) ON DELETE SET NULL,
  community_id         INT REFERENCES communities(id) ON DELETE CASCADE,
  equipment_type       TEXT NOT NULL,
  age_years            INT,
  condition_pct        INT,
  last_service_date    DATE,
  next_service_date    DATE,
  failure_probability  INT,
  estimated_fail_date  DATE,
  replacement_cost     NUMERIC(10,2),
  preventive_cost      NUMERIC(10,2),
  status               TEXT NOT NULL DEFAULT 'good'
                       CHECK (status IN ('good','warning','critical')),
  created_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Indexes ───────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_units_community      ON units(community_id);
CREATE INDEX IF NOT EXISTS idx_units_building       ON units(building_id);
CREATE INDEX IF NOT EXISTS idx_tenants_unit         ON tenants(unit_id);
CREATE INDEX IF NOT EXISTS idx_leases_unit          ON leases(unit_id);
CREATE INDEX IF NOT EXISTS idx_leases_tenant        ON leases(tenant_id);
CREATE INDEX IF NOT EXISTS idx_rent_payments_unit   ON rent_payments(unit_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_unit     ON maintenance_tickets(unit_id);
CREATE INDEX IF NOT EXISTS idx_leads_community      ON leads(community_id);
CREATE INDEX IF NOT EXISTS idx_messages_tenant      ON messages(tenant_id);

-- ── updated_at trigger ────────────────────────────────────
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

DO $$
DECLARE t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY['users','communities','units','tenants','leases',
                            'maintenance_tickets','leads','equipment'] LOOP
    EXECUTE format(
      'DROP TRIGGER IF EXISTS trg_updated_at ON %I;
       CREATE TRIGGER trg_updated_at BEFORE UPDATE ON %I
         FOR EACH ROW EXECUTE FUNCTION set_updated_at();', t, t);
  END LOOP;
END $$;

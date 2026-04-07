/**
 * Seed the database with the mock data from the frontend's mockData.js.
 * Usage: node src/db/seed.js
 *
 * Idempotent — truncates and re-inserts on each run.
 */
import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { getClient } from './index.js';

const communities = [
  { id: 1, name: 'Sunset Ridge Apartments', address: '1200 Sunset Blvd, Austin, TX 78701', total_units: 148, occupied_units: 131 },
  { id: 2, name: 'The Grand at Westlake',   address: '890 Westlake Dr, Austin, TX 78746',  total_units: 96,  occupied_units: 89  },
  { id: 3, name: 'Lakeview Commons',        address: '456 Lake Austin Blvd, Austin, TX 78703', total_units: 64, occupied_units: 51 },
];

const buildings = [
  { id: 'b1', community_id: 1, name: 'Building A',  total_units: 52, occupied_units: 48 },
  { id: 'b2', community_id: 1, name: 'Building B',  total_units: 48, occupied_units: 44 },
  { id: 'b3', community_id: 1, name: 'Building C',  total_units: 48, occupied_units: 39 },
  { id: 'b4', community_id: 2, name: 'Tower 1',     total_units: 48, occupied_units: 45 },
  { id: 'b5', community_id: 2, name: 'Tower 2',     total_units: 48, occupied_units: 44 },
  { id: 'b6', community_id: 3, name: 'North Wing',  total_units: 32, occupied_units: 28 },
  { id: 'b7', community_id: 3, name: 'South Wing',  total_units: 32, occupied_units: 23 },
];

const units = [
  { id: 1,  unit_number: '101', building_id: 'b1', community_id: 1, unit_type: '1BR/1BA', sqft: 750,  rent: 1450, market_rent: 1520, status: 'occupied',    days_vacant: null, tour_score: 92 },
  { id: 2,  unit_number: '102', building_id: 'b1', community_id: 1, unit_type: '2BR/2BA', sqft: 1050, rent: 1950, market_rent: 1880, status: 'vacant',      days_vacant: 12,   tour_score: 65 },
  { id: 3,  unit_number: '103', building_id: 'b1', community_id: 1, unit_type: 'Studio',  sqft: 520,  rent: 1100, market_rent: 1150, status: 'occupied',    days_vacant: null, tour_score: 88 },
  { id: 4,  unit_number: '201', building_id: 'b1', community_id: 1, unit_type: '2BR/1BA', sqft: 980,  rent: 1800, market_rent: 1830, status: 'pending',     days_vacant: 5,    tour_score: 78 },
  { id: 5,  unit_number: '202', building_id: 'b1', community_id: 1, unit_type: '1BR/1BA', sqft: 750,  rent: 1475, market_rent: 1520, status: 'occupied',    days_vacant: null, tour_score: 85 },
  { id: 6,  unit_number: '203', building_id: 'b2', community_id: 1, unit_type: '3BR/2BA', sqft: 1320, rent: 2400, market_rent: 2500, status: 'maintenance', days_vacant: 3,    tour_score: 45 },
  { id: 7,  unit_number: '301', building_id: 'b2', community_id: 1, unit_type: '1BR/1BA', sqft: 750,  rent: 1500, market_rent: 1520, status: 'occupied',    days_vacant: null, tour_score: 91 },
  { id: 8,  unit_number: '302', building_id: 'b2', community_id: 1, unit_type: '2BR/2BA', sqft: 1050, rent: 2000, market_rent: 1880, status: 'vacant',      days_vacant: 22,   tour_score: 52 },
  { id: 9,  unit_number: '303', building_id: 'b3', community_id: 1, unit_type: 'Studio',  sqft: 520,  rent: 1150, market_rent: 1150, status: 'occupied',    days_vacant: null, tour_score: 94 },
  { id: 10, unit_number: '401', building_id: 'b3', community_id: 1, unit_type: '2BR/1BA', sqft: 980,  rent: 1850, market_rent: 1830, status: 'occupied',    days_vacant: null, tour_score: 87 },
];

const tenants = [
  { id: 1, full_name: 'Sarah Johnson', unit_id: 1,  community_id: 1, status: 'active' },
  { id: 2, full_name: 'Mike Chen',     unit_id: 3,  community_id: 1, status: 'active' },
  { id: 3, full_name: 'James Wilson',  unit_id: 5,  community_id: 1, status: 'active' },
  { id: 4, full_name: 'Anna Garcia',   unit_id: 7,  community_id: 1, status: 'active' },
  { id: 5, full_name: 'Tom Brown',     unit_id: 9,  community_id: 1, status: 'active' },
  { id: 6, full_name: 'Emily Davis',   unit_id: 10, community_id: 1, status: 'active' },
];

const leases = [
  { unit_id: 1,  tenant_id: 1, start_date: '2025-07-01', end_date: '2026-06-30', monthly_rent: 1450, deposit: 2900, status: 'active' },
  { unit_id: 3,  tenant_id: 2, start_date: '2025-04-16', end_date: '2026-04-15', monthly_rent: 1100, deposit: 2200, status: 'active' },
  { unit_id: 5,  tenant_id: 3, start_date: '2025-09-01', end_date: '2026-08-31', monthly_rent: 1475, deposit: 2950, status: 'active' },
  { unit_id: 7,  tenant_id: 4, start_date: '2025-05-21', end_date: '2026-05-20', monthly_rent: 1500, deposit: 3000, status: 'active' },
  { unit_id: 9,  tenant_id: 5, start_date: '2026-01-01', end_date: '2026-12-31', monthly_rent: 1150, deposit: 2300, status: 'active' },
  { unit_id: 10, tenant_id: 6, start_date: '2025-07-16', end_date: '2026-07-15', monthly_rent: 1850, deposit: 3700, status: 'active' },
];

const rentPayments = [
  { unit_id: 1,  tenant_id: 1, amount_due: 1450, amount_paid: 1450, status: 'paid',     due_date: '2026-04-01', paid_date: '2026-03-30', method: 'ACH',  late_fee: 0 },
  { unit_id: 3,  tenant_id: 2, amount_due: 1100, amount_paid: 1100, status: 'paid',     due_date: '2026-04-01', paid_date: '2026-03-29', method: 'Card', late_fee: 0 },
  { unit_id: 5,  tenant_id: 3, amount_due: 1475, amount_paid: 1475, status: 'paid',     due_date: '2026-04-01', paid_date: '2026-04-01', method: 'ACH',  late_fee: 0 },
  { unit_id: 7,  tenant_id: 4, amount_due: 1500, amount_paid: 750,  status: 'partial',  due_date: '2026-04-01', paid_date: '2026-04-01', method: 'Card', late_fee: 0 },
  { unit_id: 9,  tenant_id: 5, amount_due: 1150, amount_paid: 0,    status: 'overdue',  due_date: '2026-03-01', paid_date: null,         method: null,   late_fee: 75 },
  { unit_id: 10, tenant_id: 6, amount_due: 1850, amount_paid: 0,    status: 'upcoming', due_date: '2026-04-05', paid_date: null,         method: null,   late_fee: 0 },
];

const expenses = [
  { community_id: 1, category: 'Maintenance', amount: 28400, period_month: 3, period_year: 2026 },
  { community_id: 1, category: 'Utilities',   amount: 18600, period_month: 3, period_year: 2026 },
  { community_id: 1, category: 'Management',  amount: 14200, period_month: 3, period_year: 2026 },
  { community_id: 1, category: 'Insurance',   amount: 9800,  period_month: 3, period_year: 2026 },
  { community_id: 1, category: 'Taxes',       amount: 7600,  period_month: 3, period_year: 2026 },
  { community_id: 1, category: 'Marketing',   amount: 4200,  period_month: 3, period_year: 2026 },
  { community_id: 1, category: 'Other',       amount: 3400,  period_month: 3, period_year: 2026 },
];

const maintenanceTickets = [
  { id: 'MT001', unit_id: 1,  community_id: 1, tenant_id: 1, category: 'HVAC',      description: 'AC not cooling properly',          priority: 'high',   status: 'in-progress', assigned_to: 'Carlos M.', estimated_cost: 380,  actual_cost: null, days_open: 3 },
  { id: 'MT002', unit_id: 6,  community_id: 1, tenant_id: null, category: 'HVAC',   description: 'HVAC unit replacement needed',     priority: 'urgent', status: 'open',        assigned_to: 'Carlos M.', estimated_cost: 2400, actual_cost: null, days_open: 6 },
  { id: 'MT003', unit_id: 8,  community_id: 1, tenant_id: null, category: 'Plumbing', description: 'Leaky faucet in bathroom',        priority: 'medium', status: 'open',        assigned_to: 'Tom R.',    estimated_cost: 120,  actual_cost: null, days_open: 2 },
  { id: 'MT004', unit_id: 5,  community_id: 1, tenant_id: 3, category: 'Electrical', description: 'Outlet sparking in kitchen',      priority: 'urgent', status: 'resolved',    assigned_to: 'Mike P.',   estimated_cost: 200,  actual_cost: 185,  days_open: 1 },
  { id: 'MT005', unit_id: 7,  community_id: 1, tenant_id: 4, category: 'Appliance', description: 'Dishwasher not draining',           priority: 'low',    status: 'in-progress', assigned_to: 'Tom R.',    estimated_cost: 150,  actual_cost: null, days_open: 3 },
  { id: 'MT006', unit_id: 3,  community_id: 1, tenant_id: 2, category: 'Painting',  description: 'Wall damage repair before renewal', priority: 'medium', status: 'scheduled',   assigned_to: 'Maria L.',  estimated_cost: 350,  actual_cost: null, days_open: 4 },
  { id: 'MT007', unit_id: 10, community_id: 1, tenant_id: 6, category: 'Plumbing',  description: 'Garbage disposal broken',           priority: 'medium', status: 'resolved',    assigned_to: 'Tom R.',    estimated_cost: 180,  actual_cost: 165,  days_open: 1 },
  { id: 'MT008', unit_id: 9,  community_id: 1, tenant_id: 5, category: 'General',   description: 'Door lock sticking',                priority: 'low',    status: 'open',        assigned_to: 'Unassigned',estimated_cost: 80,   actual_cost: null, days_open: 1 },
];

const leads = [
  { name: 'David Kim',      email: 'david.kim@email.com',  phone: '(512) 555-0142', source: 'Zillow',         status: 'hot',  stage: 'Tour Completed',       interested_in: 'Unit 102 - 2BR/2BA', budget_min: 1800, budget_max: 2100, ai_score: 92,  notes: 'Loved the unit, asking about pet policy',         touchpoints: 4, days_in_pipeline: 6,  community_id: 1 },
  { name: 'Rachel Torres',  email: 'rachel.t@email.com',   phone: '(512) 555-0198', source: 'Website',        status: 'hot',  stage: 'Application Submitted', interested_in: 'Unit 201 - 2BR/1BA', budget_min: 1700, budget_max: 1900, ai_score: 88,  notes: 'Application under review, credit check pending',  touchpoints: 5, days_in_pipeline: 10, community_id: 1 },
  { name: 'Marcus Johnson', email: 'marcus.j@email.com',   phone: '(512) 555-0267', source: 'Apartments.com', status: 'warm', stage: 'Tour Scheduled',        interested_in: 'Unit 302 - 2BR/2BA', budget_min: 1900, budget_max: 2200, ai_score: 71,  notes: 'Relocating from Dallas, starts new job Apr 15',   touchpoints: 3, days_in_pipeline: 4,  community_id: 1 },
  { name: 'Priya Patel',    email: 'priya.p@email.com',    phone: '(512) 555-0334', source: 'Referral',       status: 'warm', stage: 'Tour Completed',        interested_in: 'Unit 103 - Studio',  budget_min: 1000, budget_max: 1200, ai_score: 65,  notes: 'Comparing with 2 other properties, price sensitive', touchpoints: 3, days_in_pipeline: 8,  community_id: 1 },
  { name: 'James Wright',   email: 'j.wright@email.com',   phone: '(512) 555-0411', source: 'Walk-in',        status: 'hot',  stage: 'Negotiating',           interested_in: 'Unit 203 - 3BR/2BA', budget_min: 2200, budget_max: 2500, ai_score: 85,  notes: 'Wants 14-month lease, negotiating on parking',    touchpoints: 6, days_in_pipeline: 14, community_id: 1 },
  { name: 'Sophie Chen',    email: 'sophie.c@email.com',   phone: '(512) 555-0488', source: 'Website',        status: 'cold', stage: 'Inquiry',               interested_in: '1BR any building',   budget_min: 1300, budget_max: 1500, ai_score: 32,  notes: 'No response to first email',                      touchpoints: 1, days_in_pipeline: 3,  community_id: 1 },
  { name: 'Alex Rivera',    email: 'alex.r@email.com',     phone: '(512) 555-0555', source: 'Zillow',         status: 'warm', stage: 'Tour Scheduled',        interested_in: 'Unit 302 - 2BR/2BA', budget_min: 1800, budget_max: 2100, ai_score: 58,  notes: 'Young professional, first apartment',             touchpoints: 2, days_in_pipeline: 5,  community_id: 1 },
  { name: 'Nina Williams',  email: 'nina.w@email.com',     phone: '(512) 555-0622', source: 'Referral',       status: 'hot',  stage: 'Application Submitted', interested_in: 'Unit 401 - 2BR/1BA', budget_min: 1700, budget_max: 1900, ai_score: 90,  notes: 'Referred by current tenant Emily Davis',          touchpoints: 5, days_in_pipeline: 12, community_id: 1 },
  { name: 'Tom Fischer',    email: 'tom.f@email.com',      phone: '(512) 555-0699', source: 'Apartments.com', status: 'cold', stage: 'No Response',           interested_in: '2BR any building',   budget_min: 1600, budget_max: 1800, ai_score: 18,  notes: '2 emails sent, no opens',                         touchpoints: 2, days_in_pipeline: 15, community_id: 1 },
  { name: 'Lauren Hayes',   email: 'lauren.h@email.com',   phone: '(512) 555-0766', source: 'Website',        status: 'warm', stage: 'Tour Completed',        interested_in: 'Unit 102 - 2BR/2BA', budget_min: 1900, budget_max: 2100, ai_score: 74,  notes: 'Very interested but checking with partner',       touchpoints: 3, days_in_pipeline: 2,  community_id: 1 },
];

async function seed() {
  const client = await getClient();
  try {
    await client.query('BEGIN');

    // Clear existing data (order respects FK constraints)
    await client.query(`TRUNCATE equipment, applicants, messages, leads,
      maintenance_tickets, expenses, rent_payments, leases,
      tenants, units, buildings, communities, users
      RESTART IDENTITY CASCADE`);

    // Users — seed a demo admin + property manager
    const adminHash = await bcrypt.hash('Admin1234!', 10);
    const managerHash = await bcrypt.hash('Manager1234!', 10);
    await client.query(
      `INSERT INTO users (email, password_hash, full_name, role) VALUES
        ('admin@rently.com',   $1, 'Platform Admin',  'admin'),
        ('manager@rently.com', $2, 'Jane Doe',        'manager'),
        ('maint@rently.com',   $2, 'Carlos M.',       'maintenance')`,
      [adminHash, managerHash]
    );

    // Communities
    for (const c of communities) {
      await client.query(
        `INSERT INTO communities (id, name, address, total_units, occupied_units)
         VALUES ($1,$2,$3,$4,$5)`,
        [c.id, c.name, c.address, c.total_units, c.occupied_units]
      );
    }
    await client.query(`SELECT setval('communities_id_seq', (SELECT MAX(id) FROM communities))`);

    // Buildings
    for (const b of buildings) {
      await client.query(
        `INSERT INTO buildings (id, community_id, name, total_units, occupied_units)
         VALUES ($1,$2,$3,$4,$5)`,
        [b.id, b.community_id, b.name, b.total_units, b.occupied_units]
      );
    }

    // Units
    for (const u of units) {
      await client.query(
        `INSERT INTO units (id, unit_number, building_id, community_id, unit_type, sqft, rent, market_rent, status, days_vacant, tour_score)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
        [u.id, u.unit_number, u.building_id, u.community_id, u.unit_type, u.sqft, u.rent, u.market_rent, u.status, u.days_vacant, u.tour_score]
      );
    }
    await client.query(`SELECT setval('units_id_seq', (SELECT MAX(id) FROM units))`);

    // Tenants
    for (const t of tenants) {
      await client.query(
        `INSERT INTO tenants (id, full_name, unit_id, community_id, status)
         VALUES ($1,$2,$3,$4,$5)`,
        [t.id, t.full_name, t.unit_id, t.community_id, t.status]
      );
    }
    await client.query(`SELECT setval('tenants_id_seq', (SELECT MAX(id) FROM tenants))`);

    // Leases
    for (const l of leases) {
      await client.query(
        `INSERT INTO leases (unit_id, tenant_id, start_date, end_date, monthly_rent, deposit, status)
         VALUES ($1,$2,$3,$4,$5,$6,$7)`,
        [l.unit_id, l.tenant_id, l.start_date, l.end_date, l.monthly_rent, l.deposit, l.status]
      );
    }

    // Rent payments
    for (const p of rentPayments) {
      await client.query(
        `INSERT INTO rent_payments (unit_id, tenant_id, amount_due, amount_paid, status, due_date, paid_date, method, late_fee)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
        [p.unit_id, p.tenant_id, p.amount_due, p.amount_paid, p.status, p.due_date, p.paid_date, p.method, p.late_fee]
      );
    }

    // Expenses
    for (const e of expenses) {
      await client.query(
        `INSERT INTO expenses (community_id, category, amount, period_month, period_year)
         VALUES ($1,$2,$3,$4,$5)`,
        [e.community_id, e.category, e.amount, e.period_month, e.period_year]
      );
    }

    // Maintenance tickets
    for (const m of maintenanceTickets) {
      await client.query(
        `INSERT INTO maintenance_tickets (id, unit_id, community_id, tenant_id, category, description, priority, status, assigned_to, estimated_cost, actual_cost, days_open)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`,
        [m.id, m.unit_id, m.community_id, m.tenant_id, m.category, m.description, m.priority, m.status, m.assigned_to, m.estimated_cost, m.actual_cost, m.days_open]
      );
    }

    // Leads
    for (const l of leads) {
      await client.query(
        `INSERT INTO leads (name, email, phone, source, status, stage, interested_in, budget_min, budget_max, ai_score, notes, touchpoints, days_in_pipeline, community_id)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)`,
        [l.name, l.email, l.phone, l.source, l.status, l.stage, l.interested_in, l.budget_min, l.budget_max, l.ai_score, l.notes, l.touchpoints, l.days_in_pipeline, l.community_id]
      );
    }

    await client.query('COMMIT');
    console.log('Seed complete.');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Seed failed:', err);
    throw err;
  } finally {
    client.release();
    process.exit(0);
  }
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});

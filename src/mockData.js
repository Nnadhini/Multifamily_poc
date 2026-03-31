export const communities = [
  {
    id: 1, name: 'Sunset Ridge Apartments', address: '1200 Sunset Blvd, Austin, TX 78701',
    totalUnits: 148, occupiedUnits: 131,
    buildings: [
      { id: 'b1', name: 'Building A', units: 52, occupied: 48 },
      { id: 'b2', name: 'Building B', units: 48, occupied: 44 },
      { id: 'b3', name: 'Building C', units: 48, occupied: 39 },
    ],
  },
  {
    id: 2, name: 'The Grand at Westlake', address: '890 Westlake Dr, Austin, TX 78746',
    totalUnits: 96, occupiedUnits: 89,
    buildings: [
      { id: 'b4', name: 'Tower 1', units: 48, occupied: 45 },
      { id: 'b5', name: 'Tower 2', units: 48, occupied: 44 },
    ],
  },
  {
    id: 3, name: 'Lakeview Commons', address: '456 Lake Austin Blvd, Austin, TX 78703',
    totalUnits: 64, occupiedUnits: 51,
    buildings: [
      { id: 'b6', name: 'North Wing', units: 32, occupied: 28 },
      { id: 'b7', name: 'South Wing', units: 32, occupied: 23 },
    ],
  },
];

export const kpiData = {
  occupancyRate: 88.5, occupancyChange: 2.3,
  monthlyRevenue: 284750, revenueChange: 5.1,
  activeTours: 42, toursChange: -8.2,
  tourConversion: 34.2, conversionChange: 4.7,
  pendingMaintenance: 12, maintenanceChange: -15.0,
  avgDaysVacant: 18, daysVacantChange: -3.5,
};

export const occupancyTrend = [
  { month: 'Oct', occupied: 82, vacant: 18 },
  { month: 'Nov', occupied: 84, vacant: 16 },
  { month: 'Dec', occupied: 83, vacant: 17 },
  { month: 'Jan', occupied: 86, vacant: 14 },
  { month: 'Feb', occupied: 87, vacant: 13 },
  { month: 'Mar', occupied: 88.5, vacant: 11.5 },
];

export const tourFunnelData = [
  { stage: 'Tours Scheduled', value: 142, color: '#3B82F6' },
  { stage: 'Tours Completed', value: 98, color: '#8B5CF6' },
  { stage: 'Applications', value: 52, color: '#F59E0B' },
  { stage: 'Approved', value: 41, color: '#10B981' },
  { stage: 'Leases Signed', value: 34, color: '#059669' },
];

export const revenueTrend = [
  { month: 'Oct', revenue: 261000, projected: 258000 },
  { month: 'Nov', revenue: 268000, projected: 265000 },
  { month: 'Dec', revenue: 265000, projected: 270000 },
  { month: 'Jan', revenue: 272000, projected: 275000 },
  { month: 'Feb', revenue: 279000, projected: 280000 },
  { month: 'Mar', revenue: 284750, projected: 285000 },
];

export const leaseExpirations = [
  { month: 'Apr', count: 8, risk: 'medium' },
  { month: 'May', count: 14, risk: 'high' },
  { month: 'Jun', count: 11, risk: 'high' },
  { month: 'Jul', count: 6, risk: 'low' },
  { month: 'Aug', count: 9, risk: 'medium' },
  { month: 'Sep', count: 4, risk: 'low' },
];

export const units = [
  { id: 1, unit: '101', building: 'Building A', type: '1BR/1BA', sqft: 750, rent: 1450, marketRent: 1520, status: 'occupied', tenant: 'Sarah Johnson', leaseEnd: '2026-06-30', daysVacant: null, tourScore: 92 },
  { id: 2, unit: '102', building: 'Building A', type: '2BR/2BA', sqft: 1050, rent: 1950, marketRent: 1880, status: 'vacant', tenant: null, leaseEnd: null, daysVacant: 12, tourScore: 65 },
  { id: 3, unit: '103', building: 'Building A', type: 'Studio', sqft: 520, rent: 1100, marketRent: 1150, status: 'occupied', tenant: 'Mike Chen', leaseEnd: '2026-04-15', daysVacant: null, tourScore: 88 },
  { id: 4, unit: '201', building: 'Building A', type: '2BR/1BA', sqft: 980, rent: 1800, marketRent: 1830, status: 'pending', tenant: 'Lisa Park (applying)', leaseEnd: null, daysVacant: 5, tourScore: 78 },
  { id: 5, unit: '202', building: 'Building A', type: '1BR/1BA', sqft: 750, rent: 1475, marketRent: 1520, status: 'occupied', tenant: 'James Wilson', leaseEnd: '2026-08-31', daysVacant: null, tourScore: 85 },
  { id: 6, unit: '203', building: 'Building B', type: '3BR/2BA', sqft: 1320, rent: 2400, marketRent: 2500, status: 'maintenance', tenant: null, leaseEnd: null, daysVacant: 3, tourScore: 45 },
  { id: 7, unit: '301', building: 'Building B', type: '1BR/1BA', sqft: 750, rent: 1500, marketRent: 1520, status: 'occupied', tenant: 'Anna Garcia', leaseEnd: '2026-05-20', daysVacant: null, tourScore: 91 },
  { id: 8, unit: '302', building: 'Building B', type: '2BR/2BA', sqft: 1050, rent: 2000, marketRent: 1880, status: 'vacant', tenant: null, leaseEnd: null, daysVacant: 22, tourScore: 52 },
  { id: 9, unit: '303', building: 'Building C', type: 'Studio', sqft: 520, rent: 1150, marketRent: 1150, status: 'occupied', tenant: 'Tom Brown', leaseEnd: '2026-12-31', daysVacant: null, tourScore: 94 },
  { id: 10, unit: '401', building: 'Building C', type: '2BR/1BA', sqft: 980, rent: 1850, marketRent: 1830, status: 'occupied', tenant: 'Emily Davis', leaseEnd: '2026-07-15', daysVacant: null, tourScore: 87 },
];

export const aiInsights = [
  {
    id: 1, type: 'revenue', priority: 'high', icon: 'money',
    title: 'Revenue Opportunity Detected',
    description: '3 units are priced 6-8% below market rate. Adjusting to market price could generate an additional $2,840/month ($34,080/year).',
    action: 'Review Pricing',
    impact: '+$34,080/yr',
    units: ['101', '203', '401'],
  },
  {
    id: 2, type: 'vacancy', priority: 'critical', icon: 'alert',
    title: 'Unit #302 Needs Attention',
    description: 'Vacant for 22 days (avg is 18). AI suggests a 4% rent reduction ($2,000 to $1,920) could fill it 11 days faster based on market demand.',
    action: 'Adjust Price',
    impact: 'Save $1,760 vacancy loss',
    units: ['302'],
  },
  {
    id: 3, type: 'retention', priority: 'high', icon: 'people',
    title: 'Renewal Risk: 3 Leases Expiring',
    description: 'Anna Garcia (Unit 301), Mike Chen (Unit 103), and Sarah Johnson (Unit 101) leases expire within 90 days. Historical data shows 40% non-renewal risk without early engagement.',
    action: 'Start Renewal Campaign',
    impact: 'Prevent $15,600 turnover cost',
    units: ['301', '103', '101'],
  },
  {
    id: 4, type: 'conversion', priority: 'medium', icon: 'tour',
    title: 'Tour-to-Lease Conversion Below Target',
    description: 'Building C has 22% conversion vs 38% portfolio avg. Top issue: prospects cite outdated unit photos. Updating photos historically improves conversion by 15%.',
    action: 'Update Photos',
    impact: '+15% conversion',
    units: [],
  },
  {
    id: 5, type: 'maintenance', priority: 'medium', icon: 'tool',
    title: 'Maintenance Impacting Showings',
    description: 'Unit 203 has an open maintenance ticket (HVAC) for 3 days. 2 scheduled tours were cancelled citing "unit not ready". Prioritizing repair could recover $4,800 in potential rent.',
    action: 'Escalate Repair',
    impact: 'Recover $4,800',
    units: ['203'],
  },
];

export const recentActivity = [
  { id: 1, type: 'tour', message: 'Sarah Miller completed self-guided tour of Unit 102', time: '15 min ago', icon: 'tour' },
  { id: 2, type: 'lease', message: 'Lisa Park submitted application for Unit 201', time: '1 hour ago', icon: 'lease' },
  { id: 3, type: 'maintenance', message: 'Maintenance resolved for Unit 203 - HVAC repair', time: '2 hours ago', icon: 'maintenance' },
  { id: 4, type: 'payment', message: 'Rent payment received from James Wilson - Unit 202', time: '3 hours ago', icon: 'payment' },
  { id: 5, type: 'tour', message: 'New tour scheduled: David Kim for Unit 302 tomorrow 2PM', time: '4 hours ago', icon: 'tour' },
  { id: 6, type: 'alert', message: 'Unit 302 vacant for 22 days - consider adjusting price', time: '5 hours ago', icon: 'alert' },
];

export const marketComps = [
  { name: 'Your Portfolio', avgRent: 1650, occupancy: 88.5, conversion: 34.2, isYours: true },
  { name: 'Market Average', avgRent: 1720, occupancy: 91.2, conversion: 31.0, isYours: false },
  { name: 'Top Performers', avgRent: 1810, occupancy: 95.1, conversion: 42.5, isYours: false },
];

export const predictedOccupancy = [
  { month: 'Apr', actual: null, predicted: 89.2, lower: 87.5, upper: 91.0 },
  { month: 'May', actual: null, predicted: 87.1, lower: 84.0, upper: 90.2 },
  { month: 'Jun', actual: null, predicted: 85.5, lower: 82.0, upper: 89.0 },
  { month: 'Jul', actual: null, predicted: 88.0, lower: 85.5, upper: 90.5 },
];

export const revenueOpportunities = {
  underpriced: 3,
  underpricedRevenue: 2840,
  vacancyLoss: 5200,
  turnoverCost: 15600,
  totalOpportunity: 23640,
  annualImpact: 283680,
};

export const crmLeads = [
  { id: 1, name: 'David Kim', email: 'david.kim@email.com', phone: '(512) 555-0142', source: 'Zillow', status: 'hot', stage: 'Tour Completed', interestedIn: 'Unit 102 - 2BR/2BA', budget: '$1,800-2,100', tourDate: '2026-03-28', followUpDate: '2026-03-31', score: 92, notes: 'Loved the unit, asking about pet policy', touchpoints: 4, daysInPipeline: 6, assignedTo: 'Jane Doe' },
  { id: 2, name: 'Rachel Torres', email: 'rachel.t@email.com', phone: '(512) 555-0198', source: 'Website', status: 'hot', stage: 'Application Submitted', interestedIn: 'Unit 201 - 2BR/1BA', budget: '$1,700-1,900', tourDate: '2026-03-25', followUpDate: '2026-03-30', score: 88, notes: 'Application under review, credit check pending', touchpoints: 5, daysInPipeline: 10, assignedTo: 'Jane Doe' },
  { id: 3, name: 'Marcus Johnson', email: 'marcus.j@email.com', phone: '(512) 555-0267', source: 'Apartments.com', status: 'warm', stage: 'Tour Scheduled', interestedIn: 'Unit 302 - 2BR/2BA', budget: '$1,900-2,200', tourDate: '2026-04-01', followUpDate: '2026-04-02', score: 71, notes: 'Relocating from Dallas, starts new job Apr 15', touchpoints: 3, daysInPipeline: 4, assignedTo: 'Jane Doe' },
  { id: 4, name: 'Priya Patel', email: 'priya.p@email.com', phone: '(512) 555-0334', source: 'Referral', status: 'warm', stage: 'Tour Completed', interestedIn: 'Unit 103 - Studio', budget: '$1,000-1,200', tourDate: '2026-03-27', followUpDate: '2026-04-01', score: 65, notes: 'Comparing with 2 other properties, price sensitive', touchpoints: 3, daysInPipeline: 8, assignedTo: 'Jane Doe' },
  { id: 5, name: 'James Wright', email: 'j.wright@email.com', phone: '(512) 555-0411', source: 'Walk-in', status: 'hot', stage: 'Negotiating', interestedIn: 'Unit 203 - 3BR/2BA', budget: '$2,200-2,500', tourDate: '2026-03-22', followUpDate: '2026-03-30', score: 85, notes: 'Wants 14-month lease, negotiating on parking', touchpoints: 6, daysInPipeline: 14, assignedTo: 'Jane Doe' },
  { id: 6, name: 'Sophie Chen', email: 'sophie.c@email.com', phone: '(512) 555-0488', source: 'Website', status: 'cold', stage: 'Inquiry', interestedIn: '1BR any building', budget: '$1,300-1,500', tourDate: null, followUpDate: '2026-04-02', score: 32, notes: 'Submitted web inquiry, no response to first email', touchpoints: 1, daysInPipeline: 3, assignedTo: 'Jane Doe' },
  { id: 7, name: 'Alex Rivera', email: 'alex.r@email.com', phone: '(512) 555-0555', source: 'Zillow', status: 'warm', stage: 'Tour Scheduled', interestedIn: 'Unit 302 - 2BR/2BA', budget: '$1,800-2,100', tourDate: '2026-04-02', followUpDate: '2026-04-03', score: 58, notes: 'Young professional, first apartment', touchpoints: 2, daysInPipeline: 5, assignedTo: 'Jane Doe' },
  { id: 8, name: 'Nina Williams', email: 'nina.w@email.com', phone: '(512) 555-0622', source: 'Referral', status: 'hot', stage: 'Application Submitted', interestedIn: 'Unit 401 - 2BR/1BA', budget: '$1,700-1,900', tourDate: '2026-03-24', followUpDate: '2026-03-30', score: 90, notes: 'Referred by current tenant Emily Davis, excellent credit', touchpoints: 5, daysInPipeline: 12, assignedTo: 'Jane Doe' },
  { id: 9, name: 'Tom Fischer', email: 'tom.f@email.com', phone: '(512) 555-0699', source: 'Apartments.com', status: 'cold', stage: 'No Response', interestedIn: '2BR any building', budget: '$1,600-1,800', tourDate: null, followUpDate: '2026-04-03', score: 18, notes: '2 emails sent, no opens. Consider removing.', touchpoints: 2, daysInPipeline: 15, assignedTo: 'Jane Doe' },
  { id: 10, name: 'Lauren Hayes', email: 'lauren.h@email.com', phone: '(512) 555-0766', source: 'Website', status: 'warm', stage: 'Tour Completed', interestedIn: 'Unit 102 - 2BR/2BA', budget: '$1,900-2,100', tourDate: '2026-03-29', followUpDate: '2026-03-31', score: 74, notes: 'Toured yesterday, very interested but checking with partner', touchpoints: 3, daysInPipeline: 2, assignedTo: 'Jane Doe' },
];

export const crmPipelineSummary = {
  totalLeads: 10,
  hotLeads: 4,
  warmLeads: 4,
  coldLeads: 2,
  avgScore: 67.3,
  avgDaysInPipeline: 7.9,
  conversionRate: 34.2,
  estimatedRevenue: 18450,
};

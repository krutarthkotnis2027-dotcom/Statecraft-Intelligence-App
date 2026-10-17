import { DemoOrganizationAccount, UserSession } from '../types/auth';

export const AUTH_STORAGE_KEY = 'statecraft_user_session';
export const REGISTERED_USERS_KEY = 'statecraft_registered_users';

export const PRESET_ORGANIZATION_ACCOUNTS: DemoOrganizationAccount[] = [
  {
    organizationId: 'MH-CEO-2024',
    organizationName: 'State Election Commission (Maharashtra)',
    department: 'Electoral Rolls & Form 20 Verification Wing',
    defaultEmail: 'org.user@ceo.maharashtra.gov.in',
    defaultName: 'Organisational user',
    defaultPassword: 'AdminPassword@2024',
    role: 'ELECTION_OFFICER',
    roleTitle: 'Chief Electoral Officer / State Observer',
    clearanceLevel: 'LEVEL_3_CONFIDENTIAL',
    assignedConstituency: 'Statewide (All 288 ACs)',
    badgeColor: 'bg-emerald-600',
    description: 'ECI Form 20 Statutory Audit & Constituency Certification clearance'
  },
  {
    organizationId: 'CHANAKYA-PR-99',
    organizationName: 'Chanakya Policy & Demographic Research',
    department: 'Quantitative Analytics & Caste Census Division',
    defaultEmail: 'ananya.sen@chanakya-analytics.org',
    defaultName: 'Dr. Ananya Sen',
    defaultPassword: 'Chanakya@2024',
    role: 'CHIEF_ANALYST',
    roleTitle: 'Principal Electoral Data Scientist',
    clearanceLevel: 'LEVEL_3_CONFIDENTIAL',
    assignedConstituency: '227 - Karjat Jamkhed & Western MH',
    badgeColor: 'bg-blue-600',
    description: 'Demographic stratification, swing models & caste clustering algorithms'
  },
  {
    organizationId: 'WARROOM-KJ-227',
    organizationName: 'Karjat-Jamkhed Campaign Strategy Cell',
    department: 'Constituency Ground Mobilization & Booth Ops',
    defaultEmail: 'vikram.d@campaign-warroom.in',
    defaultName: 'Vikram Deshmukh',
    defaultPassword: 'Karjat@2024',
    role: 'CAMPAIGN_DIRECTOR',
    roleTitle: 'Constituency Campaign Director',
    clearanceLevel: 'LEVEL_2_RESTRICTED',
    assignedConstituency: '227 - Karjat Jamkhed',
    badgeColor: 'bg-amber-600',
    description: 'Booth-level targetting, turnout stimulation & margin projections'
  },
  {
    organizationId: 'SAHYADRI-FIELD-04',
    organizationName: 'Sahyadri Ground Intelligence & Polling',
    department: 'Tehsil Sampling & Enumeration Unit',
    defaultEmail: 'snehal.g@sahyadri-surveys.co.in',
    defaultName: 'Snehal Gaikwad',
    defaultPassword: 'Survey@2024',
    role: 'FIELD_SURVEYOR',
    roleTitle: 'Senior Field Enumeration Lead',
    clearanceLevel: 'LEVEL_1_OPERATIONAL',
    assignedConstituency: 'Ahilya Nagar (Ahmednagar) District',
    badgeColor: 'bg-purple-600',
    description: 'Field sampling data verification and local ward validation'
  }
];

export function getStoredSession(): UserSession | null {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw) as UserSession;
    if (session && (session.name === 'Rajeshwar Kulkarni (IAS)' || !session.name)) {
      session.name = 'Organisational user';
      saveSession(session);
    }
    return session;
  } catch {
    return null;
  }
}

export function saveSession(session: UserSession): void {
  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
  } catch (e) {
    console.error('Failed to save session to localStorage', e);
  }
}

export function clearSession(): void {
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  } catch (e) {
    console.error('Failed to clear session', e);
  }
}

export function getRegisteredUsers(): Record<string, { password: string; session: UserSession }> {
  try {
    const raw = localStorage.getItem(REGISTERED_USERS_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export function saveRegisteredUser(orgId: string, password: string, session: UserSession): void {
  try {
    const users = getRegisteredUsers();
    users[orgId.trim().toUpperCase()] = { password, session };
    localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));
  } catch (e) {
    console.error('Failed to persist registered user', e);
  }
}

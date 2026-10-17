export type UserRole = 
  | 'CHIEF_ANALYST' 
  | 'ELECTION_OFFICER' 
  | 'CAMPAIGN_DIRECTOR' 
  | 'FIELD_SURVEYOR' 
  | 'SECURITY_ADMIN';

export type ClearanceLevel = 
  | 'LEVEL_3_CONFIDENTIAL' 
  | 'LEVEL_2_RESTRICTED' 
  | 'LEVEL_1_OPERATIONAL';

export interface UserSession {
  userId: string;
  name: string;
  email: string;
  organizationId: string;
  organizationName: string;
  role: UserRole;
  roleTitle: string;
  clearanceLevel: ClearanceLevel;
  department: string;
  avatarUrl?: string;
  assignedConstituency?: string;
  loginTimestamp: string;
  sessionToken: string;
  isDemoAccount?: boolean;
}

export interface DemoOrganizationAccount {
  organizationId: string;
  organizationName: string;
  department: string;
  defaultEmail: string;
  defaultName: string;
  defaultPassword: string;
  role: UserRole;
  roleTitle: string;
  clearanceLevel: ClearanceLevel;
  assignedConstituency?: string;
  badgeColor: string;
  description: string;
}

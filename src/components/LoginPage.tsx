import React, { useState } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  Lock, 
  KeyRound, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle,
  BarChart3,
  Users,
  Vote,
  Sparkles,
  Layers,
  ChevronRight,
  Fingerprint
} from 'lucide-react';
import { UserSession, UserRole, ClearanceLevel } from '../types/auth';
import { 
  PRESET_ORGANIZATION_ACCOUNTS, 
  saveSession, 
  saveRegisteredUser, 
  getRegisteredUsers 
} from '../data/mockAuthData';

interface LoginPageProps {
  onLoginSuccess: (session: UserSession) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [activeTab, setActiveTab] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  
  // Login Form State
  const [orgId, setOrgId] = useState<string>('MH-CEO-2024');
  const [password, setPassword] = useState<string>('AdminPassword@2024');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Register Form State
  const [regOrgId, setRegOrgId] = useState<string>('');
  const [regOrgName, setRegOrgName] = useState<string>('');
  const [regFullName, setRegFullName] = useState<string>('');
  const [regEmail, setRegEmail] = useState<string>('');
  const [regPassword, setRegPassword] = useState<string>('');
  const [regRole, setRegRole] = useState<UserRole>('CHIEF_ANALYST');
  const [regDepartment, setRegDepartment] = useState<string>('Policy & Data Cell');

  // Handle preset demo account quick fill
  const handleSelectPreset = (preset: typeof PRESET_ORGANIZATION_ACCOUNTS[0]) => {
    setOrgId(preset.organizationId);
    setPassword(preset.defaultPassword);
    setErrorMessage(null);
  };

  // Direct login with preset
  const handleDirectPresetLogin = (preset: typeof PRESET_ORGANIZATION_ACCOUNTS[0]) => {
    setIsLoading(true);
    setErrorMessage(null);

    setTimeout(() => {
      const session: UserSession = {
        userId: `usr_${Date.now()}_${preset.organizationId.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
        name: preset.organizationId === 'MH-CEO-2024' ? 'Organisational user' : preset.defaultName,
        email: preset.defaultEmail,
        organizationId: preset.organizationId,
        organizationName: preset.organizationName,
        role: preset.role,
        roleTitle: preset.roleTitle,
        clearanceLevel: preset.clearanceLevel,
        department: preset.department,
        assignedConstituency: preset.assignedConstituency,
        loginTimestamp: new Date().toISOString(),
        sessionToken: `token_sec_${Math.random().toString(36).substring(2, 15)}`,
        isDemoAccount: true
      };

      if (rememberMe) {
        saveSession(session);
      }
      setIsLoading(false);
      onLoginSuccess(session);
    }, 450);
  };

  // Submit Login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanOrgId = orgId.trim().toUpperCase();
    if (!cleanOrgId) {
      setErrorMessage('Please enter your Organizational ID.');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your access password.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      // 1. Check presets
      const matchedPreset = PRESET_ORGANIZATION_ACCOUNTS.find(
        p => p.organizationId.toUpperCase() === cleanOrgId
      );

      if (matchedPreset) {
        if (password !== matchedPreset.defaultPassword && password !== 'admin' && password.length < 4) {
          setIsLoading(false);
          setErrorMessage(`Invalid credentials for ${matchedPreset.organizationName}. Default password is: ${matchedPreset.defaultPassword}`);
          return;
        }

        const session: UserSession = {
          userId: `usr_${Date.now()}_${cleanOrgId.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
          name: matchedPreset.organizationId === 'MH-CEO-2024' ? 'Organisational user' : matchedPreset.defaultName,
          email: matchedPreset.defaultEmail,
          organizationId: matchedPreset.organizationId,
          organizationName: matchedPreset.organizationName,
          role: matchedPreset.role,
          roleTitle: matchedPreset.roleTitle,
          clearanceLevel: matchedPreset.clearanceLevel,
          department: matchedPreset.department,
          assignedConstituency: matchedPreset.assignedConstituency,
          loginTimestamp: new Date().toISOString(),
          sessionToken: `token_sec_${Math.random().toString(36).substring(2, 15)}`,
          isDemoAccount: true
        };

        if (rememberMe) saveSession(session);
        setIsLoading(false);
        onLoginSuccess(session);
        return;
      }

      // 2. Check locally registered accounts
      const registeredUsers = getRegisteredUsers();
      const customAccount = registeredUsers[cleanOrgId];

      if (customAccount) {
        if (customAccount.password !== password) {
          setIsLoading(false);
          setErrorMessage('Invalid password for this registered Organization ID.');
          return;
        }

        const updatedSession: UserSession = {
          ...customAccount.session,
          loginTimestamp: new Date().toISOString(),
          sessionToken: `token_sec_${Math.random().toString(36).substring(2, 15)}`
        };

        if (rememberMe) saveSession(updatedSession);
        setIsLoading(false);
        onLoginSuccess(updatedSession);
        return;
      }

      // 3. Fallback: Seamlessly provision custom organizational ID session
      // (Allows any custom org ID like "ORG-MYCOMPANY-2024" if password is at least 4 characters)
      if (password.length >= 4) {
        const session: UserSession = {
          userId: `usr_${Date.now()}_${cleanOrgId.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
          name: 'Organisational user',
          email: `user@${cleanOrgId.toLowerCase().replace(/[^a-z0-9]/g, '')}.gov.in`,
          organizationId: cleanOrgId,
          organizationName: `${cleanOrgId} Operations Division`,
          role: 'CHIEF_ANALYST',
          roleTitle: 'Certified Electoral Officer',
          clearanceLevel: 'LEVEL_2_RESTRICTED',
          department: 'Electoral Analytics Group',
          loginTimestamp: new Date().toISOString(),
          sessionToken: `token_sec_${Math.random().toString(36).substring(2, 15)}`,
          isDemoAccount: false
        };

        saveRegisteredUser(cleanOrgId, password, session);
        if (rememberMe) saveSession(session);
        setIsLoading(false);
        onLoginSuccess(session);
        return;
      } else {
        setIsLoading(false);
        setErrorMessage('Password must be at least 4 characters long.');
      }
    }, 500);
  };

  // Submit Registration
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanOrgId = regOrgId.trim().toUpperCase();
    if (!cleanOrgId) {
      setErrorMessage('Organizational ID is required.');
      return;
    }
    if (!regOrgName.trim()) {
      setErrorMessage('Organization Name is required.');
      return;
    }
    if (!regFullName.trim()) {
      setErrorMessage('Full Name is required.');
      return;
    }
    if (!regPassword || regPassword.length < 4) {
      setErrorMessage('Password must be at least 4 characters long.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const clearance: ClearanceLevel = 
        regRole === 'ELECTION_OFFICER' ? 'LEVEL_3_CONFIDENTIAL' :
        regRole === 'CHIEF_ANALYST' ? 'LEVEL_3_CONFIDENTIAL' :
        regRole === 'CAMPAIGN_DIRECTOR' ? 'LEVEL_2_RESTRICTED' : 'LEVEL_1_OPERATIONAL';

      const roleTitleMap: Record<UserRole, string> = {
        'ELECTION_OFFICER': 'Constituency Returning Officer / Observer',
        'CHIEF_ANALYST': 'Senior Electoral Data Analyst',
        'CAMPAIGN_DIRECTOR': 'Campaign Strategy Director',
        'FIELD_SURVEYOR': 'Field Demographic Surveyor',
        'SECURITY_ADMIN': 'System & Compliance Administrator'
      };

      const session: UserSession = {
        userId: `usr_${Date.now()}_${cleanOrgId.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
        name: regFullName.trim(),
        email: regEmail.trim() || `${cleanOrgId.toLowerCase()}@org-secure.in`,
        organizationId: cleanOrgId,
        organizationName: regOrgName.trim(),
        role: regRole,
        roleTitle: roleTitleMap[regRole],
        clearanceLevel: clearance,
        department: regDepartment.trim() || 'Operations & Research',
        loginTimestamp: new Date().toISOString(),
        sessionToken: `token_sec_${Math.random().toString(36).substring(2, 15)}`,
        isDemoAccount: false
      };

      saveRegisteredUser(cleanOrgId, regPassword, session);
      if (rememberMe) saveSession(session);

      setIsLoading(false);
      onLoginSuccess(session);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-amber-500/30 selection:text-amber-200 relative overflow-hidden">
      {/* Background Institutional Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Banner / Secure Gateway Identity */}
      <header className="w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md px-6 py-4 z-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center shadow-inner">
            <Building2 className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-white tracking-tight">Statecraft Intelligence</h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-blue-950 text-blue-300 border border-blue-800">
                v2.4 SECURE
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono hidden sm:block">
              Electoral Data & Demographic Intelligence System
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-950/80 border border-emerald-800/80 rounded-full text-xs text-emerald-400 font-medium font-mono">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>256-Bit Encrypted Gateway</span>
          </div>
        </div>
      </header>

      {/* Center Container: Login Card & Demo Selector */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 z-10">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch my-auto">
          
          {/* Left Column: Platform Brief & Pre-approved Institutional Organizations */}
          <div className="lg:col-span-5 flex flex-col justify-between bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-7 shadow-2xl backdrop-blur-sm">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight mb-2">
                Secure Electoral Intelligence Portal
              </h2>
              <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                Log in with your official Organizational ID and password to access consolidated ECI Form 20 booth metrics, caste censuses, and live swing models.
              </p>

              {/* Instant Test Profiles Heading */}
              <div className="border-t border-slate-800 pt-5 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
                    Instant Demo Organizations
                  </span>
                  <span className="text-[11px] text-amber-400/80 font-mono">Click to test instant login</span>
                </div>

                <div className="space-y-2.5">
                  {PRESET_ORGANIZATION_ACCOUNTS.map((preset) => (
                    <button
                      key={preset.organizationId}
                      type="button"
                      onClick={() => handleDirectPresetLogin(preset)}
                      className={`w-full text-left p-3 rounded-xl border transition-all flex items-start gap-3 cursor-pointer group ${
                        orgId === preset.organizationId
                          ? 'bg-slate-800 border-amber-500/50 shadow-md ring-1 ring-amber-500/30'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg ${preset.badgeColor} text-white flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs shadow-xs`}>
                        {preset.organizationId.substring(0, 2)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-xs font-bold text-slate-200 group-hover:text-white truncate">
                            {preset.organizationName}
                          </span>
                          <span className="font-mono text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded shrink-0">
                            {preset.organizationId}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">
                          {preset.defaultName} • <span className="text-slate-300">{preset.roleTitle}</span>
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-amber-400 transition-colors shrink-0 self-center" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500 font-mono">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                ECI Form 20 Audit Ready
              </span>
              <span>288 ACs Verified</span>
            </div>
          </div>

          {/* Right Column: Authentication Card (Login or Register) */}
          <div className="lg:col-span-7 bg-slate-900/95 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl flex flex-col justify-between backdrop-blur-md">
            
            {/* Top Switcher Tabs */}
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
                  <button
                    type="button"
                    onClick={() => { setActiveTab('LOGIN'); setErrorMessage(null); }}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      activeTab === 'LOGIN'
                        ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Organizational Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => { setActiveTab('REGISTER'); setErrorMessage(null); }}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      activeTab === 'REGISTER'
                        ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Register New Organization
                  </button>
                </div>

                <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                  Restricted Gateway
                </span>
              </div>

              {/* Alerts */}
              {errorMessage && (
                <div className="mb-5 p-3.5 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-200 text-xs flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div className="flex-1">{errorMessage}</div>
                </div>
              )}

              {successNotice && (
                <div className="mb-5 p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-200 text-xs flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="flex-1">{successNotice}</div>
                </div>
              )}

              {/* TAB 1: SIGN IN WITH ORGANIZATIONAL ID */}
              {activeTab === 'LOGIN' && (
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  {/* Org ID Field */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
                        Organizational ID <span className="text-amber-400">*</span>
                      </label>
                      <span className="text-[11px] text-slate-400 font-mono">e.g. MH-CEO-2024, CHANAKYA-PR-99</span>
                    </div>
                    <div className="relative">
                      <Building2 className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      <input
                        type="text"
                        value={orgId}
                        onChange={(e) => setOrgId(e.target.value.toUpperCase())}
                        placeholder="ENTER YOUR ORGANIZATIONAL ID"
                        className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl pl-10 pr-4 py-3 text-sm text-white font-mono placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-colors uppercase"
                        required
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
                        Security Passcode / Password <span className="text-amber-400">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          const matched = PRESET_ORGANIZATION_ACCOUNTS.find(p => p.organizationId === orgId);
                          if (matched) {
                            setPassword(matched.defaultPassword);
                          } else {
                            setPassword('AdminPassword@2024');
                          }
                        }}
                        className="text-[11px] text-amber-400 hover:underline font-mono cursor-pointer"
                      >
                        Auto-fill Preset Passcode
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password..."
                        className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl pl-10 pr-11 py-3 text-sm text-white font-mono placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-colors"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                        title={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Options row */}
                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-amber-500 focus:ring-amber-500 focus:ring-offset-slate-900"
                      />
                      <span className="text-xs text-slate-300">Remember organizational session</span>
                    </label>

                    <span className="text-xs text-slate-400">
                      Standard Token Expiry: 12h
                    </span>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-3 py-3.5 px-5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-amber-500/20 active:scale-[0.99] cursor-pointer disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                        <span>Verifying Security Clearance...</span>
                      </>
                    ) : (
                      <>
                        <KeyRound className="w-4 h-4" />
                        <span>Sign In to Statecraft Platform</span>
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* TAB 2: REGISTER NEW ORGANIZATION */}
              {activeTab === 'REGISTER' && (
                <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 font-mono mb-1">
                        New Organizational ID <span className="text-amber-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={regOrgId}
                        onChange={(e) => setRegOrgId(e.target.value.toUpperCase())}
                        placeholder="e.g. MH-ANALYTICS-2024"
                        className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono uppercase focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 font-mono mb-1">
                        Organization / Agency Name <span className="text-amber-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={regOrgName}
                        onChange={(e) => setRegOrgName(e.target.value)}
                        placeholder="e.g. Pune Policy Research Centre"
                        className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 font-mono mb-1">
                        Representative Full Name <span className="text-amber-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={regFullName}
                        onChange={(e) => setRegFullName(e.target.value)}
                        placeholder="e.g. Sachin Jadhav"
                        className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 font-mono mb-1">
                        Official Institutional Email
                      </label>
                      <input
                        type="email"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="e.g. s.jadhav@analytics.org"
                        className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 font-mono mb-1">
                        Functional Role <span className="text-amber-400">*</span>
                      </label>
                      <select
                        value={regRole}
                        onChange={(e) => setRegRole(e.target.value as UserRole)}
                        className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
                      >
                        <option value="CHIEF_ANALYST">Senior Electoral Data Analyst</option>
                        <option value="ELECTION_OFFICER">Election Returning Officer / Observer</option>
                        <option value="CAMPAIGN_DIRECTOR">Campaign War Room Director</option>
                        <option value="FIELD_SURVEYOR">Field Demographic Enumerator</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 font-mono mb-1">
                        Department / Cell
                      </label>
                      <input
                        type="text"
                        value={regDepartment}
                        onChange={(e) => setRegDepartment(e.target.value)}
                        placeholder="e.g. Vidhan Sabha Analytics Wing"
                        className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 font-mono mb-1">
                      Create Password <span className="text-amber-400">*</span>
                    </label>
                    <input
                      type="password"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Minimum 4 characters..."
                      className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-2 py-3 px-5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-lg cursor-pointer"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                        <span>Provisioning Organization...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>Register & Sign In Organization</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Security notice footer in right column */}
            <div className="pt-4 mt-6 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span className="flex items-center gap-1.5">
                <Lock className="w-3 h-3 text-amber-400" />
                ECI Certified Access
              </span>
              <span>All sessions logged & audited</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer System Meta */}
      <footer className="w-full border-t border-slate-800/80 bg-slate-950/90 py-3 px-6 text-center text-xs text-slate-400 font-mono flex flex-col sm:flex-row items-center justify-between gap-2">
        <div>
          Statecraft Electoral Analytics Platform &bull; Government & Certified Research Use Only
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <span>Security Protocol: TLS 1.3</span>
          <span>&bull;</span>
          <span>Form 20 Audited</span>
        </div>
      </footer>
    </div>
  );
};

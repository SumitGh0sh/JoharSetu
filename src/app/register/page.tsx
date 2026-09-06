'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User,
  Phone,
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Building,
  GraduationCap,
  Briefcase,
  MapPin,
  CheckCircle2
} from 'lucide-react';

const JHARKHAND_DISTRICTS = [
  'Ranchi', 'Dhanbad', 'East Singhbhum (Jamshedpur)', 'Bokaro', 'Hazaribagh',
  'Dumka', 'Deoghar', 'Palamu', 'Giridih', 'West Singhbhum (Chaibasa)',
  'Ramgarh', 'Saraikela Kharsawan', 'Khunti', 'Lohardaga', 'Gumla',
  'Simdega', 'Latehar', 'Garhwa', 'Chatra', 'Koderma',
  'Jamtara', 'Godda', 'Pakur', 'Sahebganj'
];

const JHARKHAND_UNIVERSITIES = [
  { code: 'IITISM', name: 'IIT (ISM) Dhanbad' },
  { code: 'BITMESRA', name: 'BIT Mesra, Ranchi' },
  { code: 'NITJSR', name: 'NIT Jamshedpur' },
  { code: 'BAUKANKE', name: 'Birsa Agricultural University (BAU)' },
  { code: 'AIIMSDEO', name: 'AIIMS Deoghar' },
  { code: 'RANCHIUNIV', name: 'Ranchi University' },
];

export default function RegisterPage() {
  const router = useRouter();

  // Role Selection
  const [selectedRole, setSelectedRole] = useState<'CITIZEN' | 'STUDENT' | 'FACULTY_MENTOR' | 'INDUSTRY_CSR' | 'GOVT_OFFICER'>('CITIZEN');

  // Form fields
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [district, setDistrict] = useState('Khunti');
  const [block, setBlock] = useState('');
  const [universityCode, setUniversityCode] = useState('BITMESRA');
  const [organization, setOrganization] = useState('');
  const [designation, setDesignation] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName || !phone || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          phone,
          email: email || undefined,
          password,
          role: selectedRole,
          district: ['CITIZEN', 'GOVT_OFFICER'].includes(selectedRole) ? district : undefined,
          block: selectedRole === 'CITIZEN' ? block : undefined,
          universityCode: ['STUDENT', 'FACULTY_MENTOR'].includes(selectedRole) ? universityCode : undefined,
          organization: selectedRole === 'INDUSTRY_CSR' ? organization : undefined,
          designation: ['GOVT_OFFICER', 'INDUSTRY_CSR', 'FACULTY_MENTOR'].includes(selectedRole) ? designation : undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Registration failed. Please try again.');
      }

      // Automatically redirect to assigned role portal
      router.push(data.redirectUrl || '/portal/citizen');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'An error occurred during registration.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-canvas py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-2xl bg-terracotta text-white flex items-center justify-center font-black text-2xl shadow-md shadow-terracotta/20 group-hover:scale-105 transition-transform">
              जो
            </div>
            <div className="text-left">
              <span className="text-2xl font-black tracking-tight text-charcoal flex items-center gap-1.5">
                JoharSetu
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-sand-100 text-sand-800 border border-sand-300">
                  SIH 2026
                </span>
              </span>
              <p className="text-xs text-charcoal-muted">Dept of Higher & Technical Education, Jharkhand</p>
            </div>
          </Link>
          <h1 className="mt-4 text-3xl font-extrabold text-charcoal">Create Your Portal Account</h1>
          <p className="mt-1 text-sm text-charcoal-muted">
            Select your role to access your designated workspace across Jharkhand
          </p>
        </div>

        <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl shadow-soft border border-charcoal-border/70">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3 text-red-700 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          {/* Role Card Selector */}
          <div className="mb-8">
            <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-muted mb-3">
              1. Choose Your Institutional Role (RBAC)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { role: 'CITIZEN', title: 'Citizen', subtitle: 'Panchayat & Rural', icon: '🏡' },
                { role: 'STUDENT', title: 'Student', subtitle: 'NEP 2020 Capstone', icon: '🎓' },
                { role: 'FACULTY_MENTOR', title: 'Faculty', subtitle: 'Academic Mentor', icon: '👨‍🏫' },
                { role: 'GOVT_OFFICER', title: 'Govt Admin', subtitle: '24-District Officer', icon: '🏛️' },
              ].map((item) => (
                <button
                  key={item.role}
                  type="button"
                  onClick={() => setSelectedRole(item.role as any)}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    selectedRole === item.role
                      ? 'border-terracotta bg-terracotta-50/70 shadow-sm ring-2 ring-terracotta/20'
                      : 'border-charcoal-border hover:border-charcoal-muted bg-canvas/40'
                  }`}
                >
                  <div className="text-xl mb-1.5">{item.icon}</div>
                  <div className="font-bold text-xs text-charcoal">{item.title}</div>
                  <div className="text-[10px] text-charcoal-muted leading-tight">{item.subtitle}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form className="space-y-4" onSubmit={handleRegister}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-muted mb-1.5">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-3.5 text-charcoal-muted/60 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Ramesh Hansda"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-charcoal-border bg-canvas/40 text-sm focus:outline-none focus:ring-2 focus:ring-terracotta focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-muted mb-1.5">
                  Phone Number (10 digits) *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3.5 top-3.5 text-charcoal-muted/60 pointer-events-none" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="9431182910"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-charcoal-border bg-canvas/40 text-sm focus:outline-none focus:ring-2 focus:ring-terracotta focus:bg-white"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-muted mb-1.5">
                Email Address (Optional)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-charcoal-muted/60 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.gov.in or email@ac.in"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-charcoal-border bg-canvas/40 text-sm focus:outline-none focus:ring-2 focus:ring-terracotta focus:bg-white"
                />
              </div>
            </div>

            {/* Dynamic Role Fields */}
            {['CITIZEN', 'GOVT_OFFICER'].includes(selectedRole) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-muted mb-1.5">
                    Jharkhand District
                  </label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-charcoal-border bg-canvas/40 text-sm focus:outline-none focus:ring-2 focus:ring-terracotta focus:bg-white"
                  >
                    {JHARKHAND_DISTRICTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-muted mb-1.5">
                    Block / Panchayat / Tola
                  </label>
                  <input
                    type="text"
                    value={block}
                    onChange={(e) => setBlock(e.target.value)}
                    placeholder="e.g. Torpa Block, Tola 3"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-charcoal-border bg-canvas/40 text-sm focus:outline-none focus:ring-2 focus:ring-terracotta focus:bg-white"
                  />
                </div>
              </div>
            )}

            {['STUDENT', 'FACULTY_MENTOR'].includes(selectedRole) && (
              <div className="pt-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-muted mb-1.5">
                  Affiliated Higher Education Institution (HEI)
                </label>
                <select
                  value={universityCode}
                  onChange={(e) => setUniversityCode(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-charcoal-border bg-canvas/40 text-sm focus:outline-none focus:ring-2 focus:ring-terracotta focus:bg-white"
                >
                  {JHARKHAND_UNIVERSITIES.map((u) => (
                    <option key={u.code} value={u.code}>
                      {u.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Passwords */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-muted mb-1.5">
                  Password (Min 6 chars) *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-charcoal-muted/60 pointer-events-none" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-charcoal-border bg-canvas/40 text-sm focus:outline-none focus:ring-2 focus:ring-terracotta focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-muted mb-1.5">
                  Confirm Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-charcoal-muted/60 pointer-events-none" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-charcoal-border bg-canvas/40 text-sm focus:outline-none focus:ring-2 focus:ring-terracotta focus:bg-white"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-4 py-3.5 px-4 rounded-xl bg-terracotta hover:bg-terracotta-600 text-white font-bold text-sm shadow-md shadow-terracotta/20 hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isLoading ? (
                <span>Creating your account...</span>
              ) : (
                <>
                  <span>Create Account & Access Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-charcoal-border/50 text-center">
            <p className="text-sm text-charcoal-muted">
              Already have an account?{' '}
              <Link href="/login" className="font-bold text-terracotta hover:underline">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  motion, 
  AnimatePresence 
} from 'motion/react';
import { 
  Cpu, 
  Trophy, 
  Calendar, 
  MapPin, 
  Clock, 
  ChevronRight, 
  ShieldCheck, 
  Rocket, 
  Zap, 
  Smartphone, 
  Code, 
  Briefcase, 
  BookOpen, 
  CheckCircle2, 
  AlertCircle,
  Menu,
  X,
  CreditCard,
  UserPlus,
  Users,
  LogOut,
  LayoutDashboard,
  Search,
  Filter,
  Download,
  Trash2,
  RefreshCw,
  Mail,
  Moon
} from 'lucide-react';
import { db, auth, OperationType, handleFirestoreError, loginWithGoogle, logout } from './lib/firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  where, 
  serverTimestamp, 
  updateDoc, 
  deleteDoc, 
  doc,
  Timestamp
} from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import logo from './assets/images/Photo.png';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Constants & Data ---

const EVENT_DETAILS = [
  { 
    id: "lfr", 
    name: "Line Following Robot (LFR)", 
    icon: Cpu, 
    price: 200, 
    desc: "Autonomous precision racing on track.",
    tag: "Hardware · Autonomous"
  },
  { 
    id: "soccer", 
    name: "Mini Robo Soccer", 
    icon: Zap, 
    price: 200, 
    desc: "Fast-paced robotic sports strategy.",
    tag: "Robotics · Strategy"
  },
  { 
    id: "showcase", 
    name: "Project Showcase", 
    icon: Code, 
    price: 100, 
    desc: "Demonstrate your engineering marvels.",
    tag: "Innovation · Demo"
  },
  { 
    id: "biz", 
    name: "Business Idea Presentation", 
    icon: Briefcase, 
    price: 100, 
    desc: "Pitch the next big tech startup.",
    tag: "Entrepeneurship · Pitch"
  },
  { 
    id: "thesis", 
    name: "3 Minutes Thesis", 
    icon: BookOpen, 
    price: 100, 
    desc: "Concise academic research defense.",
    tag: "Research · Academic"
  },
];

const ADMIN_EMAIL = 'zunaidhossain39@gmail.com';

const DEPARTMENTS = [
  "Department of Internet of Things and Robotics Engineering",
  "Department of Educational Technology and Engineering",
  "Department of Software Engineering",
  "Department of Data Science and Engineering",
  "Department of Cyber Security Engineering"
];

const SEMESTERS = [
  "1st Semester", "2nd Semester", "3rd Semester", "4th Semester",
  "5th Semester", "6th Semester", "7th Semester", "8th Semester"
];

const PAYMENT_METHODS = ["bKash", "Nagad", "Rocket", "Upay"];

// --- Types ---

interface TeamMember {
  name: string;
  studentId: string;
  department: string;
  email: string;
}

interface Registration {
  id?: string;
  firstName: string;
  lastName: string;
  studentId: string;
  email: string;
  phone: string;
  department: string;
  semester: string;
  teamName: string;
  teamSize: number;
  teamMembers: TeamMember[];
  selectedEvents: string[];
  isClubMember: boolean;
  paymentMethod: string;
  transactionId: string;
  totalAmount: number;
  projectTitle: string;
  message: string;
  status: 'pending' | 'confirmed' | 'rejected';
  createdAt: any;
  updatedAt: any;
}

// --- Components ---

const Navbar = ({ isAdmin, onAdminClick, user, onLogout, clubLogo, onHomeClick }: { isAdmin: boolean; onAdminClick: () => void; user: User | null; onLogout: () => void; clubLogo?: string | null; onHomeClick: () => void }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300 h-20 flex items-center justify-between px-6 md:px-12 border-b border-white/5",
      scrolled ? "bg-[#000814]/90 backdrop-blur-xl" : "bg-transparent"
    )}>
      <div className="flex items-center gap-6">
        <div 
          onClick={onHomeClick}
          className="font-display text-white font-black tracking-tight text-sm uppercase flex items-center gap-2 group cursor-pointer"
        >
          <img src={logo} alt="RoboFusion Logo" className="h-8 w-auto object-contain" />
          <span className="ml-2 font-display text-white font-black tracking-tight text-[10px] md:text-xs">UFTB <span className="text-primary italic">·</span> ROBOTICS CLUB</span>
        </div>
      </div>

      <div className="hidden lg:flex items-center gap-8">
        {['About', 'Events', 'Schedule', 'Prizes', 'FAQ'].map(item => (
          <a key={item} href={`#${item.toLowerCase()}`} onClick={onHomeClick} className="nav-link text-[9px]">
            {item}
          </a>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <button 
          onClick={onAdminClick}
          className="hidden md:flex items-center gap-2 px-4 py-1.5 border border-orange-500/30 text-[9px] font-black text-orange-500 uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-all rounded-sm"
        >
          <LayoutDashboard className="w-3 h-3" /> Admin
        </button>
        {user ? (
          <button 
            onClick={onLogout}
            className="hidden md:flex items-center gap-2 px-4 py-1.5 border border-slate-700 text-[9px] font-black text-slate-400 uppercase tracking-widest hover:border-white hover:text-white transition-all rounded-sm"
          >
            <LogOut className="w-3 h-3" />
          </button>
        ) : (
          <a 
            href="#register" 
            onClick={onHomeClick}
            className="hidden md:block px-6 py-1.5 border border-primary text-[9px] font-black text-primary uppercase tracking-widest hover:bg-primary hover:text-white transition-all rounded-sm"
          >
            Register Now
          </a>
        )}
        <button 
          className="lg:hidden text-primary p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-20 left-0 right-0 bg-[#000814] border-b border-white/5 p-8 flex flex-col gap-6 lg:hidden"
          >
            {['About', 'Events', 'Schedule', 'Prizes', 'FAQ'].map(item => (
              <a 
                key={item} 
                href={`#${item.toLowerCase()}`} 
                onClick={() => { onHomeClick(); setMobileMenuOpen(false); }}
                className="nav-link text-xs"
              >
                {item}
              </a>
            ))}
            <div className="pt-6 border-t border-white/5 flex flex-col gap-4">
              <button 
                onClick={() => { onAdminClick(); setMobileMenuOpen(false); }}
                className="w-full py-3 border border-orange-500/30 text-[10px] font-black text-orange-500 uppercase tracking-widest"
              >
                Admin Panel
              </button>
              <a 
                href="#register" 
                onClick={() => { onHomeClick(); setMobileMenuOpen(false); }}
                className="w-full py-3 bg-primary text-[#000814] text-[10px] font-black text-center uppercase tracking-widest"
              >
                Register Now
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Countdown = () => {
  const targetDate = new Date('2026-06-08T09:00:00').getTime();
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          mins: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          secs: Math.floor((difference % (1000 * 60)) / 1000),
        });
      }
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex gap-8 md:gap-16 my-12">
      <div className="countdown-item">
        <span className="countdown-value">{String(timeLeft.days).padStart(2, '0')}</span>
        <span className="countdown-label">Days</span>
      </div>
      <div className="countdown-item">
        <span className="countdown-value">{String(timeLeft.hours).padStart(2, '0')}</span>
        <span className="countdown-label">Hours</span>
      </div>
      <div className="countdown-item">
        <span className="countdown-value">{String(timeLeft.mins).padStart(2, '0')}</span>
        <span className="countdown-label">Mins</span>
      </div>
      <div className="countdown-item">
        <span className="countdown-value">{String(timeLeft.secs).padStart(2, '0')}</span>
        <span className="countdown-label">Secs</span>
      </div>
    </div>
  );
};

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [clubLogo, setClubLogo] = useState<string | null>(localStorage.getItem('clubLogo') || logo); // Default to new logo
  const [adminPassword, setAdminPassword] = useState('');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === 'Bdu#6601') {
      try {
        if (!user) {
          try {
            const loginResult = await loginWithGoogle();
            console.log("Admin Login Success", loginResult.user.email);
          } catch (loginErr: any) {
            console.error("Google Login Error:", loginErr);
            if (loginErr.code === 'auth/unauthorized-domain') {
              setError(`AUTH_RESTRICTED: Domain "${window.location.hostname}" not authorized in Firebase Console > Authentication > Settings.`);
              return;
            }
            if (loginErr.code === 'auth/popup-blocked') {
              setError('AUTH_BLOCKED: Login popup blocked. Please allow popups for this site.');
              return;
            }
            if (loginErr.code === 'auth/cancelled-popup-request' || loginErr.code === 'auth/popup-closed-by-user') {
              setError('AUTH_CANCELLED: Login cancelled. Data access will be limited.');
              setIsAdminAuthenticated(true);
              return;
            }
            setError(`SIGNAL_LOST: ${loginErr.message}`);
            setIsAdminAuthenticated(true);
            return;
          }
        }
        setIsAdminAuthenticated(true);
        setError(null);
      } catch (err: any) {
        setError('CRITICAL: Matrix Signal Interrupted.');
        setIsAdminAuthenticated(true);
      }
    } else {
      setError('Invalid Access Key. Signal Terminated.');
    }
  };

  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    studentId: '',
    email: '',
    phone: '',
    department: '',
    semester: '',
    teamName: '',
    teamSize: 0,
    isClubMember: false,
    paymentMethod: 'bKash',
    transactionId: '',
    projectTitle: '',
    message: '',
  });

  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (!u) {
        setIsAdminAuthenticated(false);
        setIsAdminMode(false);
      }
    });
  }, []);

  const isAdmin = user?.email === ADMIN_EMAIL;

  useEffect(() => {
    if (isAdminMode && (isAdmin || isAdminAuthenticated)) {
      fetchRegistrations();
    }
  }, [isAdminMode, isAdmin, isAdminAuthenticated]);

  const fetchRegistrations = async () => {
    if (!auth.currentUser && !isAdminAuthenticated) return;
    
    // Check if we have password access but no firebase auth
    if (!auth.currentUser && isAdminAuthenticated) {
      setError("ADMIN BYPASS ACTIVE: Database access restricted without Google Login.");
    }

    setLoading(true);
    try {
      const q = query(collection(db, 'registrations'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Registration));
      setRegistrations(data);
      if (auth.currentUser) setError(null);
    } catch (err: any) {
      console.error("Fetch Error:", err);
      setError("DATABASE ACCESS DENIED: Missing or insufficient permissions.");
      // handleFirestoreError(err, OperationType.LIST, 'registrations');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = useMemo(() => {
    let total = selectedEvents.reduce((acc, eventId) => {
      const event = EVENT_DETAILS.find(ed => ed.name === eventId);
      return acc + (event?.price || 0);
    }, 0);

    if (formData.isClubMember) {
      total = Math.floor(total * 0.5); // 50% discount
    }
    return total;
  }, [selectedEvents, formData.isClubMember]);

  const handleEventToggle = (eventName: string) => {
    setSelectedEvents(prev => 
      prev.includes(eventName) 
        ? prev.filter(e => e !== eventName)
        : [...prev, eventName]
    );
  };

  const handleTeamSizeChange = (size: number) => {
    setFormData(prev => ({ ...prev, teamSize: size }));
    const newMembers = Array(size).fill(null).map((_, i) => ({
      name: teamMembers[i]?.name || '',
      studentId: teamMembers[i]?.studentId || '',
      department: teamMembers[i]?.department || '',
      email: teamMembers[i]?.email || '',
    }));
    setTeamMembers(newMembers);
  };

  const handleMemberChange = (index: number, field: keyof TeamMember, value: string) => {
    const updated = [...teamMembers];
    updated[index] = { ...updated[index], [field]: value };
    setTeamMembers(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const data: Omit<Registration, 'id'> = {
      ...formData,
      teamMembers,
      selectedEvents,
      totalAmount: calculateTotal,
      status: 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    try {
      await addDoc(collection(db, 'registrations'), data);
      setSubmitSuccess(`RF1-${Math.random().toString(36).substring(2, 9).toUpperCase()}`);
      // Reset form
      setFormData({
        firstName: '', lastName: '', studentId: '', email: '', phone: '',
        department: '', semester: '', teamName: '', teamSize: 0,
        isClubMember: false, paymentMethod: 'bKash', transactionId: '',
        projectTitle: '', message: '',
      });
      setSelectedEvents([]);
      setTeamMembers([]);
    } catch (err) {
      setError("Registration failed. Please check your connection and try again.");
      handleFirestoreError(err, OperationType.CREATE, 'registrations');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (regId: string, status: Registration['status']) => {
    try {
      await updateDoc(doc(db, 'registrations', regId), {
        status,
        updatedAt: serverTimestamp()
      });
      setRegistrations(prev => prev.map(r => r.id === regId ? { ...r, status } : r));
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `registrations/${regId}`);
    }
  };

  const handleDelete = async (regId: string) => {
    if (!confirm("Are you sure you want to delete this registration?")) return;
    try {
      await deleteDoc(doc(db, 'registrations', regId));
      setRegistrations(prev => prev.filter(r => r.id !== regId));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `registrations/${regId}`);
    }
  };

  const exportToCSV = () => {
    if (registrations.length === 0) return;

    const headers = [
      "Registration ID", "First Name", "Last Name", "Student ID", "Email", 
      "Phone", "Department", "Semester", "Team Name", "Team Size", 
      "Team Members", "Selected Events", "Club Member", "Payment Method", 
      "Transaction ID", "Total Amount", "Status", "Created At"
    ];

    const rows = registrations.map(reg => [
      reg.id, reg.firstName, reg.lastName, reg.studentId, reg.email,
      reg.phone, reg.department, reg.semester, reg.teamName, reg.teamSize,
      reg.teamMembers.map(m => `${m.name} (${m.studentId})`).join('; '),
      reg.selectedEvents.join('; '),
      reg.isClubMember ? "Yes" : "No",
      reg.paymentMethod,
      reg.transactionId,
      reg.totalAmount,
      reg.status,
      reg.createdAt instanceof Timestamp ? reg.createdAt.toDate().toLocaleString() : reg.createdAt
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `robofusion_registrations_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-950 grid-bg relative selection:bg-primary selection:text-white">
      <div className="scanline" />
      
      {/* Background Robotics Decorations */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/4 -left-20 w-64 h-64 border border-primary/5 rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 border border-primary/5 rounded-full animate-pulse opacity-50" />
        <div className="absolute top-20 right-40 w-4 h-[500px] bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
        <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/10 to-transparent" />
        
        {/* Floating Data Bits */}
        {[...Array(10)].map((_, i) => (
          <div 
            key={i} 
            className="floating-data"
            style={{ 
              left: `${Math.random() * 100}%`, 
              animationDelay: `${Math.random() * 20}s`,
              opacity: Math.random() * 0.1
            }}
          >
            {Math.random().toString(36).substring(2, 20).toUpperCase()}
          </div>
        ))}
      </div>

      <Navbar 
        isAdmin={isAdmin} 
        onAdminClick={() => setIsAdminMode(true)} 
        user={user}
        onLogout={logout}
        clubLogo={clubLogo}
        onHomeClick={() => setIsAdminMode(false)}
      />

      {!isAdminMode ? (
        <main>
          {/* Hero Section */}
          <section id="about" className="min-h-screen flex flex-col items-center justify-center relative pt-24 px-6 text-center overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0 pointer-events-none">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-20" />
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="border border-primary/30 px-6 py-1.5 text-[8px] md:text-[10px] font-black tracking-[0.4em] mb-10 text-primary uppercase bg-primary/5"
            >
              UFTB ROBOTICS CLUB PRESENTS
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-primary text-[10px] md:text-sm font-black tracking-[0.2em] mb-6 uppercase"
            >
              Intra University Robotics & Innovation Fest 2026
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="relative text-white text-6xl md:text-[140px] font-black mb-4 tracking-tighter font-display glitch-text glitch-active uppercase leading-[0.8] py-4"
              data-text="RoboFusion"
            >
              RoboFusion
            </motion.h1>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-[#f59e0b] text-xl md:text-5xl font-black tracking-[0.2em] mb-4 font-display uppercase"
            >
              BATTLE OF INNOVATION
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
              className="text-primary/60 text-[10px] md:text-xs font-black tracking-[0.8em] mb-8 uppercase"
            >
              INNOVATE · CREATE · AUTOMATE
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-slate-500 text-xs md:text-sm font-medium tracking-wide mb-12 max-w-lg"
            >
              Where circuits spark dreams, and innovation wins battles.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap justify-center gap-4 mb-12"
            >
              {[
                { icon: Calendar, label: "June 8, 2026", color: "#ff003c" },
                { icon: MapPin, label: "UFTB Campus", color: "#ff003c" },
                { icon: Clock, label: "9:00 AM Onwards", color: "#ff003c" }
              ].map((item, i) => (
                <div key={i} className="border border-white/5 bg-white/5 backdrop-blur-md px-6 py-2.5 flex items-center gap-3 text-[10px] font-black text-slate-300 uppercase tracking-widest">
                   <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }} />
                   {item.label}
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <Countdown />
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-wrap justify-center gap-6 mt-6"
            >
              <a href="#register" className="skew-button bg-cyan-400 text-slate-950 glow-cyan">
                <span>⚡ Register Now</span>
              </a>
              <a href="#events" className="skew-button border border-cyan-400 text-cyan-400 hover:bg-cyan-400/10 active:scale-95 transition-all">
                <span>Explore Events</span>
              </a>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
              className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
            >
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em]">Scroll</span>
              <div className="w-px h-12 bg-gradient-to-b from-primary to-transparent" />
            </motion.div>
          </section>

          {/* Events Section */}
          <section id="events" className="py-32 px-6 max-w-7xl mx-auto">
            <div className="font-mono text-primary/50 text-[10px] tracking-[0.4em] mb-4 uppercase">System Modules · 002</div>
            <h2 className="text-5xl font-black mb-16 tracking-tighter text-white font-display uppercase">Battle <span className="text-primary italic">Matrix</span></h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {EVENT_DETAILS.map((event, idx) => (
                <motion.div 
                  key={event.id}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="cyber-panel p-10 relative group overflow-hidden"
                >
                  <div className="hud-corner hud-corner-tl opacity-50" />
                  <div className="hud-corner hud-corner-br opacity-50" />
                  <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 -mr-12 -mt-12 rounded-full transition-all duration-300 group-hover:scale-150 group-hover:bg-primary/10" />
                  <div className="flex justify-between items-start mb-8 relative z-10">
                    <div className="bg-primary/20 p-4 rounded-xl border border-primary/30 shadow-[0_0_15px_rgba(14,165,233,0.2)]">
                      <event.icon className="w-8 h-8 text-primary" />
                    </div>
                    <span className="font-mono text-xs text-slate-600 font-bold">MODE_00{idx + 1}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-white font-display tracking-tight group-hover:text-primary transition-colors">{event.name}</h3>
                  <p className="text-sm text-slate-400 mb-8 leading-relaxed font-medium">{event.desc}</p>
                  <div className="flex justify-between items-center mt-auto border-t border-slate-800 pt-6">
                    <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">{event.tag}</span>
                    <span className="text-primary text-2xl font-black font-display font-mono">{event.price} <span className="text-xs">BDT</span></span>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Schedule Section */}
          <section id="schedule" className="py-32 px-6 max-w-7xl mx-auto">
            <div className="font-mono text-primary/50 text-[10px] tracking-[0.4em] mb-4 uppercase">Timeline · 003</div>
            <h2 className="text-5xl font-black mb-16 tracking-tighter text-white font-display uppercase">Event <span className="text-primary italic">Timeline</span></h2>
            <div className="grid gap-6">
              {[
                { time: "09:00 AM", task: "Opening Ceremony & Logistics Briefing", icon: Zap },
                { time: "10:30 AM", task: "LFR & Mini Soccer Prelims", icon: Cpu },
                { time: "01:00 PM", task: "Strategic Recharging (Lunch Break)", icon: Moon },
                { time: "02:30 PM", task: "Project Showcase & Pitch Deck Battle", icon: Code },
                { time: "05:30 PM", task: "Final Combat & Award Synchronization", icon: Trophy }
              ].map((item, i) => (
                <div key={i} className="cyber-panel p-6 flex items-center gap-8 group hover:border-primary/50 transition-all">
                  <div className="text-primary font-mono font-black text-xs min-w-[100px]">{item.time}</div>
                  <div className="w-px h-10 bg-slate-800" />
                  <div className="flex-1 text-slate-300 font-bold tracking-wide group-hover:text-white">{item.task}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Prizes Section */}
          <section id="prizes" className="py-32 px-6 max-w-7xl mx-auto">
            <div className="font-mono text-primary/50 text-[10px] tracking-[0.4em] mb-4 uppercase">Rewards · 004</div>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
              <h2 className="text-5xl font-black tracking-tighter text-white font-display uppercase">Glory <span className="text-primary italic">Rewards</span></h2>
              <div className="px-4 py-1.5 border-2 border-primary bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.4em] inline-block animate-pulse">
                Exciting Prizes Await
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { rank: "Champion", prize: "Ultimate Tech Bundle", desc: "Premium Kit + 25k BDT Value", color: "from-amber-400 to-yellow-600" },
                { rank: "Runner Up", prize: "Innovation Gear Set", desc: "Pro Tools + 15k BDT Value", color: "from-slate-300 to-slate-500" },
                { rank: "Third Place", prize: "Essential Maker Kit", desc: "Gear Box + 10k BDT Value", color: "from-orange-400 to-orange-700" }
              ].map((p, i) => (
                <div key={i} className="cyber-panel p-10 text-center relative group">
                  <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r ${p.color}`} />
                  <Trophy className="w-12 h-12 text-slate-500 mx-auto mb-6 group-hover:text-primary transition-colors" />
                  <h3 className="text-2xl font-black text-white mb-2">{p.rank}</h3>
                  <div className="text-primary text-2xl font-black mb-4 font-display uppercase leading-tight tracking-tight">{p.prize}</div>
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-12 text-center">
              <div className="inline-flex items-center gap-3 text-slate-500 font-bold text-[9px] uppercase tracking-[0.4em]">
                <div className="w-12 h-px bg-slate-800" />
                Special Recognition Awards for Top 10
                <div className="w-12 h-px bg-slate-800" />
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section id="faq" className="py-32 px-6 max-w-4xl mx-auto">
             <div className="font-mono text-primary/50 text-[10px] tracking-[0.4em] mb-4 uppercase">Knowledge · 006</div>
             <h2 className="text-5xl font-black mb-16 tracking-tighter text-white font-display uppercase">Frequent <span className="text-primary italic">Syncs</span></h2>
             <div className="space-y-6">
                {[
                  { q: "Who can register for RoboFusion?", a: "This is an intra-university event open to all students of UFTB." },
                  { q: "Can I participate in multiple events?", a: "Yes, you can register for multiple modules as long as the schedule allows." },
                  { q: "Is there a team size limit?", a: "Most events support teams up to 4 members. Check specific module details." },
                  { q: "What should I bring to the fest?", a: "Participants should bring their robots, project components, and university ID cards." }
                ].map((item, i) => (
                  <div key={i} className="cyber-panel p-8 border-slate-800 bg-slate-900/40">
                    <h4 className="text-primary font-black text-sm mb-4 flex items-center gap-3">
                      <Zap className="w-4 h-4" /> {item.q}
                    </h4>
                    <p className="text-slate-400 text-sm leading-relaxed">{item.a}</p>
                  </div>
                ))}
             </div>
          </section>

          {/* Registration Section */}
          <section id="register" className="py-32 px-6 max-w-5xl mx-auto">
            <div className="font-mono text-primary/50 text-[10px] tracking-[0.4em] mb-4 uppercase">Direct Interface · 005</div>
            <h2 className="text-5xl font-black mb-16 tracking-tighter text-white font-display uppercase">Registration <span className="text-primary italic">Portal</span></h2>
            
            <div className="cyber-panel p-0 overflow-hidden border-slate-800 bg-slate-900/40 relative">
              <div className="hud-corner hud-corner-tl" />
              <div className="hud-corner hud-corner-tr" />
              <div className="hud-corner hud-corner-bl" />
              <div className="hud-corner hud-corner-br" />
              {submitSuccess ? (
                <motion.div 
                   initial={{ opacity: 0, scale: 0.95 }}
                   animate={{ opacity: 1, scale: 1 }}
                   className="text-center py-32 px-12"
                >
                  <div className="w-24 h-24 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
                    <CheckCircle2 className="w-12 h-12 text-emerald-400" />
                  </div>
                  <h3 className="text-3xl font-black mb-4 text-white font-display uppercase tracking-tight">Access Granted</h3>
                  <p className="text-slate-400 mb-12 font-medium max-w-sm mx-auto">Your registration signal has been successfully broadcasted and logged in our secure matrix.</p>
                  <div className="max-w-xs mx-auto bg-slate-950 border border-slate-800 p-6 rounded-2xl">
                    <div className="text-[10px] font-black text-primary uppercase tracking-widest mb-2 font-mono">Reference_ID</div>
                    <div className="font-mono text-white font-black text-2xl tracking-widest">
                      {submitSuccess}
                    </div>
                  </div>
                  <button 
                    onClick={() => setSubmitSuccess(null)}
                    className="mt-12 cyber-button bg-white text-slate-950 px-10 py-3 text-[11px] font-black uppercase tracking-widest hover:scale-105 transition-all"
                  >
                    New Registration
                  </button>
                </motion.div>
              ) : (
                <div className="flex flex-col lg:flex-row">
                  {/* Left Column: Form */}
                  <div className="flex-1 p-8 md:p-14 border-r border-slate-800">
                    <form onSubmit={handleSubmit} className="space-y-12">
                      {/* Personal Info */}
                      <div className="space-y-8">
                        <label className="block text-[11px] font-black uppercase tracking-[0.3em] text-primary mb-8 whitespace-nowrap opacity-70">01. Identity_Metrics</label>
                        <div className="grid md:grid-cols-2 gap-8">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 font-mono">First Name //</label>
                            <input 
                              required value={formData.firstName}
                              onChange={e => setFormData({...formData, firstName: e.target.value})}
                              className="w-full h-12 bg-slate-950/50 border border-slate-800 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-primary/50 transition-all font-medium"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 font-mono">Last Name //</label>
                            <input 
                              required value={formData.lastName}
                              onChange={e => setFormData({...formData, lastName: e.target.value})}
                              className="w-full h-12 bg-slate-950/50 border border-slate-800 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-primary/50 transition-all font-medium"
                            />
                          </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-8">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 font-mono">Student ID //</label>
                            <input 
                              required value={formData.studentId}
                              onChange={e => setFormData({...formData, studentId: e.target.value})}
                              placeholder="202X-XXX-XXX"
                              className="w-full h-12 bg-slate-950/50 border border-slate-800 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-primary/50 transition-all font-mono placeholder:text-slate-800"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 font-mono">Signal_Email //</label>
                            <input 
                              type="email" required value={formData.email}
                              onChange={e => setFormData({...formData, email: e.target.value})}
                              className="w-full h-12 bg-slate-950/50 border border-slate-800 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-primary/50 transition-all font-medium"
                            />
                          </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-8">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 font-mono">Contact_Comms //</label>
                            <input 
                              required value={formData.phone}
                              onChange={e => setFormData({...formData, phone: e.target.value})}
                              className="w-full h-12 bg-slate-950/50 border border-slate-800 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-primary/50 transition-all font-medium"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 font-mono">Department</label>
                            <select 
                              required value={formData.department}
                              onChange={e => setFormData({...formData, department: e.target.value})}
                              className="w-full h-12 bg-slate-950/50 border border-slate-800 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-primary/50 transition-all font-medium appearance-none"
                            >
                              <option value="" className="bg-slate-900">— Select Department —</option>
                              {DEPARTMENTS.map(d => <option key={d} value={d} className="bg-slate-900 text-white">{d}</option>)}
                            </select>
                          </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-8">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 font-mono">Semester</label>
                            <select 
                              required value={formData.semester}
                              onChange={e => setFormData({...formData, semester: e.target.value})}
                              className="w-full h-12 bg-slate-950/50 border border-slate-800 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-primary/50 transition-all font-medium appearance-none"
                            >
                              <option value="" className="bg-slate-900">— Select Semester —</option>
                              {SEMESTERS.map(s => <option key={s} value={s} className="bg-slate-900 text-white">{s}</option>)}
                            </select>
                          </div>
                          <div className="flex items-center h-12 bg-emerald-500/5 border-2 border-emerald-500/20 rounded-xl px-5 mt-6 group hover:bg-emerald-500/10 transition-all cursor-pointer">
                            <input 
                              type="checkbox" id="clubMember"
                              checked={formData.isClubMember}
                              onChange={e => setFormData({...formData, isClubMember: e.target.checked})}
                              className="w-5 h-5 text-emerald-500 rounded-lg border-2 border-emerald-500/30 focus:ring-emerald-500/20 bg-slate-900"
                            />
                            <label htmlFor="clubMember" className="ml-4 text-[11px] font-black text-emerald-400 uppercase tracking-widest cursor-pointer group-hover:text-emerald-300 transition-colors">Club_Member Activation (-50%)</label>
                          </div>
                        </div>
                      </div>

                      {/* Team Info */}
                      <div className="space-y-8 pt-6">
                        <label className="block text-[11px] font-black uppercase tracking-[0.3em] text-primary mb-8 whitespace-nowrap opacity-70">02. Squadron_formation</label>
                        <div className="grid md:grid-cols-2 gap-8">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 font-mono">Squad_ID //</label>
                            <input 
                              value={formData.teamName}
                              onChange={e => setFormData({...formData, teamName: e.target.value})}
                              className="w-full h-12 bg-slate-950/50 border border-slate-800 rounded-xl px-4 text-sm text-white focus:outline-none"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 font-mono">Unit_Capacity //</label>
                            <select 
                              value={formData.teamSize}
                              onChange={e => handleTeamSizeChange(Number(e.target.value))}
                              className="w-full h-12 bg-slate-950/50 border border-slate-800 rounded-xl px-4 text-sm text-white appearance-none font-medium"
                            >
                              <option value="0" className="bg-slate-900">Solo Operative</option>
                              <option value="1" className="bg-slate-900">1 Squad Mate</option>
                              <option value="2" className="bg-slate-900">2 Squad Mates</option>
                              <option value="3" className="bg-slate-900">3 Squad Mates</option>
                            </select>
                          </div>
                        </div>

                        {teamMembers.map((member, idx) => (
                          <div key={idx} className="p-8 border border-slate-800 bg-slate-950/50 rounded-2xl space-y-8 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-primary/30" />
                            <div className="text-[10px] font-black text-primary uppercase tracking-[0.2em] font-mono">// UNIT_00{idx + 1}</div>
                            <div className="grid md:grid-cols-2 gap-6">
                              <input 
                                 placeholder="Full_Name*" required
                                 value={member.name}
                                 onChange={e => handleMemberChange(idx, 'name', e.target.value)}
                                 className="bg-slate-900/50 border border-slate-800 rounded-xl h-11 px-4 text-sm text-white focus:outline-none focus:border-primary/30"
                              />
                              <input 
                                 placeholder="Student_ID*" required
                                 value={member.studentId}
                                 onChange={e => handleMemberChange(idx, 'studentId', e.target.value)}
                                 className="bg-slate-900/50 border border-slate-800 rounded-xl h-11 px-4 text-sm text-white focus:outline-none focus:border-primary/30 font-mono"
                              />
                            </div>
                            <div className="grid md:grid-cols-2 gap-6">
                              <input 
                                 placeholder="Signal_Email"
                                 value={member.email}
                                 onChange={e => handleMemberChange(idx, 'email', e.target.value)}
                                 className="bg-slate-900/50 border border-slate-800 rounded-xl h-11 px-4 text-sm text-white focus:outline-none focus:border-primary/30"
                              />
                              <select 
                                required value={member.department}
                                onChange={e => handleMemberChange(idx, 'department', e.target.value)}
                                className="bg-slate-900/50 border border-slate-800 rounded-xl h-11 px-4 text-sm text-white focus:outline-none appearance-none"
                              >
                                <option value="" className="bg-slate-900">— Branch —</option>
                                {DEPARTMENTS.map(d => <option key={d} value={d} className="bg-slate-900">{d}</option>)}
                              </select>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Events Selection */}
                      <div className="space-y-8 pt-6">
                        <label className="block text-[11px] font-black uppercase tracking-[0.3em] text-primary mb-8 whitespace-nowrap opacity-70">03. Mission_Selection</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {EVENT_DETAILS.map(event => (
                            <label 
                              key={event.id}
                              className={cn(
                                "flex items-center gap-5 p-5 border rounded-2xl transition-all cursor-pointer group",
                                selectedEvents.includes(event.name) ? "border-primary bg-primary/10 shadow-[0_0_20px_rgba(14,165,233,0.1)]" : "border-slate-800 bg-slate-950/30 hover:border-slate-700"
                              )}
                            >
                              <input 
                                type="checkbox" className="hidden"
                                checked={selectedEvents.includes(event.name)}
                                onChange={() => handleEventToggle(event.name)}
                              />
                              <div className={cn(
                                "p-3 rounded-xl transition-all duration-300", 
                                selectedEvents.includes(event.name) ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-slate-900 text-slate-600 group-hover:text-slate-400"
                              )}>
                                <event.icon className="w-5 h-5" />
                              </div>
                              <div className="flex-1">
                                <div className={cn("text-sm font-black font-display uppercase tracking-tight", selectedEvents.includes(event.name) ? "text-white" : "text-slate-500")}>{event.name}</div>
                                <div className="text-[11px] font-mono font-bold text-primary opacity-60 mt-0.5">{event.price} BDT</div>
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Payment */}
                      <div className="space-y-8 pt-6">
                        <label className="block text-[11px] font-black uppercase tracking-[0.3em] text-primary mb-8 whitespace-nowrap opacity-70">04. Resource_Transfer</label>
                        <div className="grid md:grid-cols-2 gap-8">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 font-mono">Transfer_Method //</label>
                            <div className="grid grid-cols-2 gap-3">
                              {PAYMENT_METHODS.map(m => (
                                <button 
                                  key={m} type="button"
                                  onClick={() => setFormData({...formData, paymentMethod: m})}
                                  className={cn(
                                    "h-11 rounded-xl text-[11px] font-black transition-all border uppercase tracking-wider",
                                    formData.paymentMethod === m ? "bg-primary text-white border-primary-dark shadow-lg shadow-primary/10" : "bg-slate-950/50 text-slate-500 border-slate-800 hover:border-slate-700"
                                  )}
                                >
                                  {m}
                                </button>
                              ))}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 font-mono">Transaction_Hash //</label>
                            <input 
                              required value={formData.transactionId}
                              onChange={e => setFormData({...formData, transactionId: e.target.value})}
                              placeholder="TXN-SIGNAL-LXR"
                              className="w-full h-11 bg-slate-950/50 border border-slate-800 rounded-xl px-4 text-sm text-white font-mono placeholder:text-slate-900"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6 pt-12 border-t border-slate-800">
                        {error && (
                          <div className="flex items-center gap-3 text-red-400 text-xs font-black p-5 rounded-2xl bg-red-500/5 border border-red-500/20 uppercase tracking-widest">
                            <AlertCircle className="w-5 h-5" /> {error}
                          </div>
                        )}
                        <div className="flex flex-col md:flex-row gap-4">
                          <button 
                            type="submit" disabled={loading || selectedEvents.length === 0}
                            className="flex-1 cyber-button bg-primary text-white h-14 font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-2xl shadow-primary/20 hover:scale-[1.02] transition-all disabled:opacity-30"
                          >
                            {loading ? <RefreshCw className="w-6 h-6 animate-spin text-white" /> : <>Submit Button</>}
                          </button>
                          <button 
                            type="button" 
                            onClick={() => {
                              setFormData({
                                firstName: '', lastName: '', studentId: '', email: '', phone: '',
                                department: '', semester: '', teamName: '', teamSize: 0,
                                isClubMember: false, paymentMethod: 'bKash', transactionId: '',
                                projectTitle: '', message: '',
                              });
                              setSelectedEvents([]);
                              setTeamMembers([]);
                            }}
                            className="px-10 h-14 bg-slate-900 border border-slate-800 text-slate-500 font-black text-[11px] uppercase tracking-widest rounded-xl hover:bg-slate-800 transition-all"
                          >
                            Reset Button
                          </button>
                        </div>
                        {selectedEvents.length === 0 && <p className="text-[10px] text-center font-black text-red-500 uppercase tracking-[0.3em] opacity-80">!! UNABLE TO COMPILE: SELECT MISSION_PARAM !!</p>}
                      </div>
                    </form>
                  </div>

                  {/* Right Column: Order Summary */}
                  <div className="w-full lg:w-[380px] bg-slate-950/50 p-8 md:p-12 relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full" />
                    <div className="sticky top-28 space-y-10 relative z-10">
                      <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-primary opacity-70 font-mono">05. Summary_Digest</h3>
                      
                      <div className="cyber-panel p-8 border-slate-800 bg-slate-900/60 space-y-8">
                        <div className="space-y-5">
                          {selectedEvents.length > 0 ? (
                            selectedEvents.map(eventName => {
                              const event = EVENT_DETAILS.find(ed => ed.name === eventName);
                              return (
                                <div key={eventName} className="flex justify-between items-start text-xs group">
                                  <div className="flex flex-col gap-1">
                                    <span className="font-black text-white uppercase tracking-tight group-hover:text-primary transition-colors">{eventName}</span>
                                    <span className="text-[9px] text-slate-600 font-black uppercase tracking-widest">Access_Key</span>
                                  </div>
                                  <span className="font-mono text-slate-400 font-bold">{event?.price}.00</span>
                                </div>
                              );
                            })
                          ) : (
                            <div className="py-12 text-center text-[10px] text-slate-700 font-black uppercase tracking-widest italic border-2 border-dashed border-slate-800 rounded-2xl">Buffer Empty // Awaiting Input</div>
                          )}
                        </div>

                        <div className="pt-8 border-t border-slate-800 space-y-4">
                          <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest">
                            <span>Sub_Total</span>
                            <span className="text-slate-300 font-mono">{selectedEvents.reduce((acc, ev) => acc + (EVENT_DETAILS.find(d => d.name === ev)?.price || 0), 0)}.00</span>
                          </div>
                          {formData.isClubMember && (
                            <div className="flex justify-between text-[11px] font-black text-emerald-400 uppercase tracking-tight">
                              <span>Signal_Discount (-50%)</span>
                              <span className="font-mono">-{Math.floor(selectedEvents.reduce((acc, ev) => acc + (EVENT_DETAILS.find(d => d.name === ev)?.price || 0), 0) * 0.5)}.00</span>
                            </div>
                          )}
                          <div className="flex justify-between font-black pt-6 text-white border-t border-slate-800 mt-2">
                            <span className="text-xs uppercase tracking-[0.2em]">Total_Payload</span>
                            <span className="text-primary text-3xl font-display font-black font-mono">{calculateTotal}.00</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-6 bg-slate-950 border border-slate-800 rounded-2xl text-white">
                        <div className="flex items-center gap-3 text-primary text-[10px] font-black uppercase tracking-[0.3em] mb-4 font-mono">
                          <CheckCircle2 className="w-4 h-4" /> // Transmission_Notes
                        </div>
                        <p className="text-[11px] leading-relaxed text-slate-400 font-medium tracking-tight">
                          Please ensure your <strong className="text-white">Transaction_Hash</strong> matches your statement for network verification. Registrations are persistent and non-refundable.
                        </p>
                      </div>

                      <div className="flex flex-col gap-3">
                         <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium">
                           <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Database Connection Live
                         </div>
                         <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium">
                           <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Verified Secure Registration
                         </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
        </main>
      ) : (
        // Admin Dashboard
        <div className="pt-24 px-6 max-w-7xl mx-auto pb-20">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div>
              <div className="font-mono text-primary text-[10px] tracking-[0.5em] mb-2 uppercase">COMMAND CENTER // ADMIN_TERMINAL</div>
              <h2 className="text-5xl font-black tracking-tighter text-white font-display uppercase">Data <span className="text-primary italic">Terminal</span></h2>
            </div>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={exportToCSV}
                className="flex items-center gap-2 bg-primary text-white border border-primary-dark px-6 py-2.5 text-xs font-black rounded-lg shadow-lg shadow-primary/20 hover:scale-105 transition-all uppercase"
              >
                <Download className="w-4 h-4" /> Export CSV
              </button>
              <button 
                onClick={fetchRegistrations}
                className="flex items-center gap-2 bg-slate-900 border border-slate-800 text-slate-300 px-6 py-2.5 text-xs font-black rounded-lg hover:bg-slate-800 transition-all uppercase"
              >
                <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} /> Re-Scan
              </button>
              <button 
                onClick={() => setIsAdminMode(false)}
                className="flex items-center gap-2 bg-white text-slate-950 px-6 py-2.5 text-xs font-black rounded-lg transition-all uppercase"
              >
                <X className="w-4 h-4" /> Close
              </button>
            </div>
          </div>

          {(!isAdminAuthenticated && !isAdmin) ? (
            <div className="cyber-panel p-24 text-center max-w-md mx-auto">
              <div className="hud-corner hud-corner-tl" />
              <div className="hud-corner hud-corner-br" />
              <div className="w-20 h-20 bg-slate-900/50 border-4 border-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-8 rotate-3 shadow-[8px_8px_0px_0px_rgba(14,165,233,0.3)]">
                <ShieldCheck className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-2xl font-black mb-4 text-white font-display uppercase tracking-tighter">System Lock</h3>
              <p className="text-slate-500 mb-10 text-xs font-bold leading-relaxed uppercase tracking-widest">Input Secure Access Key to decrypt registration matrix.</p>
              
              <form onSubmit={handleAdminLogin} className="space-y-6">
                <input 
                  type="password"
                  placeholder="ACCESS_KEY"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full bg-slate-950 border-4 border-slate-800 rounded-xl p-4 text-center text-white font-mono tracking-[0.5em] focus:border-primary transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)]"
                  autoFocus
                />
                
                {error && (
                  <p className="text-red-500 text-[10px] font-black uppercase tracking-widest animate-shake">{error}</p>
                )}

                <button 
                  type="submit"
                  className="w-full bg-primary text-white py-4 rounded-xl font-black text-sm uppercase tracking-[0.2em] shadow-[8px_8px_0px_0px_rgba(2,132,199,1)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
                >
                  Decrypt Matrix
                </button>
              </form>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Club Identity Management */}
              <div className="cyber-panel p-8 border-primary/20 bg-primary/5 relative overflow-hidden group">
                <div className="hud-corner hud-corner-tl" />
                <div className="hud-corner hud-corner-tr" />
                <div className="hud-corner hud-corner-bl" />
                <div className="hud-corner hud-corner-br" />
                <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-primary mb-6 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" /> Club_Identity_Configuration
                </h3>
                
                <div className="flex flex-col md:flex-row items-end gap-6 relative z-10">
                  <div className="flex-1 space-y-2 w-full">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 font-mono">Logo_Resource_URL //</label>
                    <input 
                      type="text"
                      placeholder="https://example.com/logo.png"
                      value={clubLogo || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setClubLogo(val);
                        if (val) localStorage.setItem('clubLogo', val);
                        else localStorage.removeItem('clubLogo');
                      }}
                      className="w-full h-11 bg-slate-950 border border-slate-800 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-primary/50 transition-all"
                    />
                  </div>
                  <div className="w-20 h-20 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-center overflow-hidden">
                    {clubLogo ? (
                      <img src={clubLogo} alt="Preview" className="w-full h-full object-contain p-2" />
                    ) : (
                      <div className="text-[10px] font-black text-slate-800">EMPTY</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-2 lg:grid-cols-7 gap-6">
                <div className="cyber-panel p-6 border-primary/20 bg-primary/5 relative">
                  <div className="hud-corner hud-corner-tl opacity-50" />
                  <div className="hud-corner hud-corner-br opacity-50" />
                  <div className="uppercase font-bold text-[10px] tracking-widest text-primary mb-2">Total Entries</div>
                  <div className="text-4xl font-black text-white leading-none font-display">{registrations.length}</div>
                </div>
                {EVENT_DETAILS.map(ed => (
                  <div key={ed.id} className="cyber-panel p-6">
                    <div className="uppercase font-bold text-[9px] tracking-tight text-slate-500 mb-2 truncate" title={ed.name}>{ed.id}</div>
                    <div className="text-3xl font-black text-white leading-none font-display">
                      {registrations.filter(r => r.selectedEvents.includes(ed.name)).length}
                    </div>
                  </div>
                ))}
                <div className="lg:col-span-1 flex items-stretch">
                  <button 
                    onClick={exportToCSV}
                    className="w-full cyber-button bg-emerald-500 text-white flex flex-col items-center justify-center p-6 group"
                  >
                    <Download className="w-6 h-6 mb-2 group-hover:animate-bounce" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Download_CSV</span>
                  </button>
                </div>
              </div>

              {/* Data Grid */}
              <div className="cyber-panel overflow-hidden overflow-x-auto border-slate-800">
                <table className="w-full text-left font-sans text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-900/80 text-slate-400 border-b border-slate-800 uppercase tracking-widest font-bold text-[10px]">
                      <th className="p-6">Participant Details</th>
                      <th className="p-6">Registered Modules</th>
                      <th className="p-6">Payment Record</th>
                      <th className="p-6">Amount</th>
                      <th className="p-6">Sync Status</th>
                      <th className="p-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {registrations.map(reg => (
                      <tr key={reg.id} className="border-b border-slate-900 hover:bg-white/5 transition-colors">
                        <td className="p-6">
                          <div className="font-bold text-white text-base font-display">{reg.firstName} {reg.lastName}</div>
                          <div className="text-primary font-mono text-[11px] mt-1 tracking-wider">{reg.studentId}</div>
                          <div className="text-slate-500 text-[11px] mt-1">{reg.phone}</div>
                        </td>
                        <td className="p-6">
                          <div className="flex flex-wrap gap-2">
                            {reg.selectedEvents.map(e => (
                              <span key={e} className="bg-primary/10 text-primary border border-primary/30 px-3 py-1 rounded-full font-black text-[9px] uppercase tracking-tighter">{e}</span>
                            ))}
                          </div>
                        </td>
                        <td className="p-6">
                          <div className="text-[11px] text-white font-black uppercase tracking-widest">{reg.paymentMethod}</div>
                          <div className="font-mono text-slate-500 text-[10px] mt-1 select-all">{reg.transactionId}</div>
                        </td>
                        <td className="p-6">
                          <span className="font-black text-white text-sm font-mono">{reg.totalAmount}.00</span>
                        </td>
                        <td className="p-6">
                           <span className={cn(
                             "px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border",
                             reg.status === 'confirmed' ? "text-emerald-400 border-emerald-500/20 bg-emerald-500/10" :
                             reg.status === 'rejected' ? "text-red-400 border-red-500/20 bg-red-500/10" :
                             "text-amber-400 border-amber-500/20 bg-amber-500/10"
                           )}>
                             {reg.status}
                           </span>
                        </td>
                        <td className="p-6 text-right">
                          <div className="flex justify-end gap-2">
                            {reg.status === 'pending' && (
                              <>
                                <button 
                                  onClick={() => handleStatusChange(reg.id!, 'confirmed')}
                                  className="w-10 h-10 flex items-center justify-center text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-xl hover:bg-emerald-500/20 transition-all shadow-lg shadow-emerald-500/5"
                                ><CheckCircle2 className="w-5 h-5" /></button>
                                <button 
                                  onClick={() => handleStatusChange(reg.id!, 'rejected')}
                                  className="w-10 h-10 flex items-center justify-center text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl hover:bg-red-500/20 transition-all shadow-lg shadow-red-500/5"
                                ><X className="w-5 h-5" /></button>
                              </>
                            )}
                            <button 
                              onClick={() => handleDelete(reg.id!)}
                              className="w-10 h-10 flex items-center justify-center text-slate-600 hover:text-red-500 hover:bg-red-500/10 border border-slate-800 hover:border-red-500/20 rounded-xl transition-all"
                            ><Trash2 className="w-5 h-5" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {registrations.length === 0 && !loading && (
                   <div className="py-32 text-center text-slate-700 uppercase tracking-[1em] font-black text-xs italic">No Signals Found</div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <footer className="py-32 border-t-4 border-primary/20 px-6 text-center bg-[#000814] relative overflow-hidden">
        {/* Abstract Background Element */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center justify-center gap-6 mb-12">
            <div className="flex items-center gap-4">
              <img src={logo} alt="RoboFusion Logo" className="h-16 w-auto object-contain" />
              <div className="text-left">
                <div className="text-white font-black text-2xl tracking-tighter font-display uppercase leading-none">UFTB ROBOTICS CLUB</div>
                <div className="text-primary font-black text-sm tracking-[0.4em] uppercase italic opacity-70">Robofusion</div>
              </div>
            </div>
            <div className="text-[10px] font-black text-slate-500 uppercase tracking-[1em] opacity-40">Innovate · Create · Automate</div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-20">
             {['About', 'Events', 'Schedule', 'Prizes', 'Register', 'FAQ'].map(item => (
               <a key={item} href={`#${item.toLowerCase()}`} className="group flex flex-col items-center">
                 <span className="text-[10px] font-black text-slate-600 group-hover:text-primary transition-all uppercase tracking-widest mb-1 italic">{item}</span>
                 <div className="w-0 group-hover:w-8 h-px bg-primary transition-all" />
               </a>
             ))}
          </div>

          <div className="pt-12 border-t border-slate-900/50 flex flex-col md:flex-row items-center justify-between gap-8">
            <p className="text-[9px] text-slate-600 font-bold uppercase tracking-[0.3em] font-mono">
              © 2026 UFTB Robotics Club · RoboFusion
            </p>

          </div>
        </div>
      </footer>
    </div>
  );
}


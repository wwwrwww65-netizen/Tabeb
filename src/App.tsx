import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar, TabId } from './components/Sidebar';
import { PortalSwitcherBanner } from './components/PortalSwitcherBanner';
import { MobileBottomNav } from './components/MobileBottomNav';
import { CoolMindOverviewBanner } from './components/CoolMindOverviewBanner';
import { ScaleRunnerModal } from './components/ScaleRunnerModal';
import { PrescriptionGeneratorModal } from './components/PrescriptionGeneratorModal';
import { ClinicalFormModal } from './components/ClinicalFormModal';
import { ClientBookingFlowModal } from './components/ClientBookingFlowModal';
import { SelfDiagnosticTriageModal } from './components/SelfDiagnosticTriageModal';
import { StaffAuthModal } from './components/StaffAuthModal';
import { JoinTeamModal } from './components/JoinTeamModal';
import { DoctorPatientFileModal } from './components/DoctorPatientFileModal';

import { PatientPortalView } from './views/PatientPortalView';
import { AdminPortalView } from './views/AdminPortalView';
import { DashboardView } from './views/DashboardView';
import { PsychiatryView } from './views/PsychiatryView';
import { ScalesView } from './views/ScalesView';
import { PrescriptionsView } from './views/PrescriptionsView';
import { ClinicalFormsView } from './views/ClinicalFormsView';
import { NutritionSocialView } from './views/NutritionSocialView';
import { HandbookView } from './views/HandbookView';
import { AccessControlView } from './views/AccessControlView';

import { DoctorAppointmentsTab } from './components/DoctorAppointmentsTab';
import { DoctorChatsTab } from './components/DoctorChatsTab';
import { DoctorScheduleTab } from './components/DoctorScheduleTab';
import { DoctorFinancialsTab } from './components/DoctorFinancialsTab';
import { DoctorPeerConsultationsTab } from './components/DoctorPeerConsultationsTab';
import { DoctorReportsTab } from './components/DoctorReportsTab';

import { 
  Patient, 
  Doctor, 
  UserRole, 
  PortalType, 
  ThemeMode, 
  ScaleAssessmentResult, 
  Prescription, 
  Appointment, 
  ChatMessage, 
  TherapyExercise, 
  AuditLog, 
  ClinicAnalytics,
  AppNotification,
  ClinicSettings,
  StaffUser,
  SavedClinicalRecord
} from './types';

import { 
  api, 
  INITIAL_DOCTORS, 
  INITIAL_APPOINTMENTS, 
  INITIAL_EXERCISES, 
  INITIAL_MESSAGES, 
  INITIAL_AUDIT_LOGS, 
  INITIAL_ANALYTICS,
  INITIAL_NOTIFICATIONS,
  INITIAL_SETTINGS
} from './services/api';
import { INITIAL_PATIENTS, INITIAL_ASSESSMENT_RESULTS, INITIAL_PRESCRIPTIONS } from './data/mockPatients';
import { Department, CLINICAL_DEPARTMENTS } from './data/departments';
import { DepartmentManagementModal } from './components/DepartmentManagementModal';
import { staffAuthService } from './services/staffAuth';
import { Megaphone, UserCheck, Zap, Award, Stethoscope, Lock } from 'lucide-react';

export default function App() {
  // Theme state: dark / light
  const [theme, setTheme] = useState<ThemeMode>(() => {
    return (localStorage.getItem('coolmind_theme') as ThemeMode) || 'light';
  });

  // Active Portal: 'patient' | 'doctor' | 'admin'
  const [activePortal, setActivePortal] = useState<PortalType>('patient');

  // Staff User authentication state
  const [currentStaff, setCurrentStaff] = useState<StaffUser | null>(() => {
    return staffAuthService.getCurrentStaff();
  });
  const [isStaffAuthModalOpen, setIsStaffAuthModalOpen] = useState(false);
  const [isJoinTeamModalOpen, setIsJoinTeamModalOpen] = useState(false);

  // Doctor tab state
  const [currentTab, setCurrentTab] = useState<TabId>('dashboard');
  const currentRole: UserRole = currentStaff?.role || 'psychiatrist';

  // Data Collections
  const [clinicSettings, setClinicSettings] = useState<ClinicSettings>(INITIAL_SETTINGS);
  const [departments, setDepartments] = useState<Department[]>(CLINICAL_DEPARTMENTS);
  const [patients, setPatients] = useState<Patient[]>(INITIAL_PATIENTS);
  const [activePatientId, setActivePatientId] = useState<string>(INITIAL_PATIENTS[0].id);
  const [doctors, setDoctors] = useState<Doctor[]>(INITIAL_DOCTORS);
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [scaleResults, setScaleResults] = useState<ScaleAssessmentResult[]>(INITIAL_ASSESSMENT_RESULTS);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(INITIAL_PRESCRIPTIONS);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [exercises, setExercises] = useState<TherapyExercise[]>(INITIAL_EXERCISES);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);
  const [analytics, setAnalytics] = useState<ClinicAnalytics>(INITIAL_ANALYTICS);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);

  // Modals state
  const [isDepartmentModalOpen, setIsDepartmentModalOpen] = useState<boolean>(false);
  const [departmentToEdit, setDepartmentToEdit] = useState<Department | null>(null);
  const [isOverviewModalOpen, setIsOverviewModalOpen] = useState<boolean>(false);
  const [isScaleRunnerModalOpen, setIsScaleRunnerModalOpen] = useState<boolean>(false);
  const [runnerScaleId, setRunnerScaleId] = useState<string>('phq-9');
  
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState<boolean>(false);
  const [selectedPrescriptionForView, setSelectedPrescriptionForView] = useState<Prescription | null>(null);

  const [isClinicalFormModalOpen, setIsClinicalFormModalOpen] = useState<boolean>(false);
  const [clinicalFormType, setClinicalFormType] = useState<'mse' | 'suicide_risk' | 'soap_note'>('mse');

  const [isPatientFileModalOpen, setIsPatientFileModalOpen] = useState(false);
  const [selectedPatientForFile, setSelectedPatientForFile] = useState<Patient>(INITIAL_PATIENTS[0]);

  const [isBookingModalOpen, setIsBookingModalOpen] = useState<boolean>(false);
  const [bookingInitialDeptId, setBookingInitialDeptId] = useState<string>('psychiatry');
  const [bookingInitialDoctorId, setBookingInitialDoctorId] = useState<string>('');
  const [bookingInitialPathway, setBookingInitialPathway] = useState<any>('individual');
  const [bookingInitialFormat, setBookingInitialFormat] = useState<any>('video');
  const [bookingInitialStep, setBookingInitialStep] = useState<1 | 2>(1);
  const [isSelfDiagnosticModalOpen, setIsSelfDiagnosticModalOpen] = useState<boolean>(false);
  const [patientTab, setPatientTab] = useState<any>('departments');

  // Sync theme with document element
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('coolmind_theme', theme);
  }, [theme]);

  // Load from local storage on mount
  useEffect(() => {
    const loadData = async () => {
      const sets = await api.settings.get();
      const depts = await api.departments.getAll();
      const p = await api.patients.getAll();
      const d = await api.doctors.getAll();
      const a = await api.appointments.getAll();
      const rx = await api.prescriptions.getAll();
      const sr = await api.scales.getResults();
      const m = await api.messages.getAll();
      const ex = await api.exercises.getAll();
      const logs = await api.auditLogs.getAll();
      const kpis = await api.analytics.getKPIs();
      const notifs = await api.notifications.getAll();

      if (sets) setClinicSettings(sets);
      if (depts.length) setDepartments(depts);
      if (p.length) setPatients(p);
      if (d.length) setDoctors(d);
      if (a.length) setAppointments(a);
      if (rx.length) setPrescriptions(rx);
      if (sr.length) setScaleResults(sr);
      if (m.length) setMessages(m);
      if (ex.length) setExercises(ex);
      if (logs.length) setAuditLogs(logs);
      if (notifs.length) {
        const seen = new Set<string>();
        const deduped: AppNotification[] = [];
        for (const n of notifs) {
          if (!seen.has(n.id)) {
            seen.add(n.id);
            deduped.push(n);
          }
        }
        setNotifications(deduped);
      }
    };
    loadData();
  }, []);

  const activePatient = patients.find(p => p.id === activePatientId) || patients[0];

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleSelectPatient = (patient: Patient) => {
    setActivePatientId(patient.id);
    setSelectedPatientForFile(patient);
  };

  const handleOpenScaleRunner = (scaleId?: string) => {
    setRunnerScaleId(scaleId || 'phq-9');
    setIsScaleRunnerModalOpen(true);
  };

  const handleOpenClinicalForm = (formType: 'mse' | 'suicide_risk' | 'soap_note') => {
    setClinicalFormType(formType);
    setIsClinicalFormModalOpen(true);
  };

  const handleMarkAllNotificationsRead = async () => {
    await api.notifications.markAllAsRead();
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const handleSaveScaleResult = async (result: ScaleAssessmentResult) => {
    await api.scales.saveResult(result);
    setScaleResults([result, ...scaleResults]);

    setPatients(prev => prev.map(p => {
      if (p.id === result.patientId) {
        return { ...p, completedScalesCount: p.completedScalesCount + 1 };
      }
      return p;
    }));

    await api.auditLogs.log({
      actorName: currentStaff?.name || 'د. طارق الحكيم',
      actorRole: currentStaff?.specialty || 'طبيب نفسي',
      action: `إتمام وتصحيح ${result.scaleName}`,
      target: `${result.patientName} (${result.totalScore} نقطة)`,
      ipAddress: '192.168.1.15',
      status: 'نجاح'
    });
  };

  const handleSavePrescription = async (prescription: Prescription) => {
    await api.prescriptions.create(prescription);
    setPrescriptions([prescription, ...prescriptions]);

    setPatients(prev => prev.map(p => {
      if (p.id === prescription.patientId) {
        return { ...p, activeMedsCount: p.activeMedsCount + prescription.items.length };
      }
      return p;
    }));

    await api.auditLogs.log({
      actorName: currentStaff?.name || 'د. طارق الحكيم',
      actorRole: 'طبيب نفسي',
      action: `إصدار وصفة طبية نفسية معتمدة رقم ${prescription.prescriptionNumber || prescription.id}`,
      target: `${prescription.patientName} - ${prescription.diagnosis}`,
      ipAddress: '192.168.1.15',
      status: 'نجاح'
    });
  };

  const handleRecordSaved = async (record: SavedClinicalRecord) => {
    await api.auditLogs.log({
      actorName: record.doctorName,
      actorRole: 'توثيق إكلينيكي',
      action: `اعتماد وحفظ نموذج ${record.titleAr} رقم ${record.recordNumber}`,
      target: `${record.patientName} (${record.patientFileNumber})`,
      ipAddress: '192.168.1.15',
      status: 'نجاح'
    });
  };

  const handleBookAppointment = async (newApt: Omit<Appointment, 'id'>) => {
    const createdApt = await api.appointments.create(newApt);
    setAppointments(prev => [createdApt, ...prev]);

    const notif = await api.notifications.add({
      title: 'تم تأكيد حجز موعد استشارة جديد',
      description: `تم حجز موعد مع ${createdApt.doctorName} بتاريخ ${createdApt.date} الساعة ${createdApt.time}`,
      type: 'appointment',
      isRead: false,
      meetUrl: createdApt.meetUrl
    });

    setNotifications(prev => [notif, ...prev]);

    await api.auditLogs.log({
      actorName: createdApt.patientName,
      actorRole: 'مريض',
      action: `حجز موعد استشارة وسداد إلكتروني (${createdApt.paymentMethod})`,
      target: `${createdApt.doctorName} - ${createdApt.date}`,
      ipAddress: '192.168.1.100',
      status: 'نجاح'
    });
  };

  const handleSendMessage = async (text: string, overridePatientId?: string) => {
    const pId = overridePatientId || activePatient.id;
    const isDoctorSender = activePortal === 'doctor';
    
    const senderRole = isDoctorSender ? 'doctor' : 'patient';
    const senderName = isDoctorSender 
      ? (currentStaff?.name || 'د. طارق الحكيم') 
      : activePatient.name;

    const newMsg = await api.messages.send({
      senderId: isDoctorSender ? (currentStaff?.doctorId || 'doc-hakim') : pId,
      senderName,
      senderRole,
      doctorId: currentStaff?.doctorId || 'doc-hakim',
      doctorName: currentStaff?.name || 'د. طارق الحكيم',
      patientId: pId,
      text,
      isRead: isDoctorSender
    });

    setMessages(prev => [...prev, newMsg]);
  };

  const handleToggleExercise = async (id: string) => {
    const updated = await api.exercises.toggleComplete(id);
    setExercises(updated);
  };

  const handleUpdateAppointmentStatus = async (id: string, status: Appointment['status'], notes?: string) => {
    await api.appointments.updateStatus(id, status);
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status, notes: notes || a.notes } : a));
    
    await api.auditLogs.log({
      actorName: currentStaff?.name || 'د. طارق الحكيم',
      actorRole: 'المختص المعالج',
      action: `تحديث حالة موعد الجلسة الإكلينيكية إلى: ${status} (${notes || ''})`,
      target: `جلسة ${id}`,
      ipAddress: '192.168.1.15',
      status: 'نجاح'
    });
  };

  // Admin handlers
  const handleAddNewDoctor = async (doc: Omit<Doctor, 'id'>) => {
    const newDoc = await api.doctors.create(doc);
    setDoctors(prev => [newDoc, ...prev]);
  };
  const handleUpdateDoctor = async (id: string, updatedData: Partial<Doctor>) => {
    const updated = await api.doctors.update(id, updatedData);
    setDoctors(prev => prev.map(d => d.id === id ? updated : d));
  };
  const handleDeleteDoctor = async (id: string) => {
    await api.doctors.delete(id);
    setDoctors(prev => prev.filter(d => d.id !== id));
  };

  const handleAddNewPatient = async (pData: Omit<Patient, 'id'>) => {
    const newPat = await api.patients.create(pData);
    setPatients(prev => [newPat, ...prev]);
  };
  const handleUpdatePatient = async (id: string, updatedData: Partial<Patient>) => {
    const updated = await api.patients.update(id, updatedData);
    setPatients(prev => prev.map(p => p.id === id ? updated : p));
  };
  const handleDeletePatient = async (id: string) => {
    await api.patients.delete(id);
    setPatients(prev => prev.filter(p => p.id !== id));
  };

  const handleUpdateAppointment = async (id: string, updatedData: Partial<Appointment>) => {
    const updated = await api.appointments.update(id, updatedData);
    setAppointments(prev => prev.map(a => a.id === id ? updated : a));
  };
  const handleDeleteAppointment = async (id: string) => {
    await api.appointments.delete(id);
    setAppointments(prev => prev.filter(a => a.id !== id));
  };

  const handleAddExercise = async (ex: Omit<TherapyExercise, 'id'>) => {
    const newEx = await api.exercises.create(ex);
    setExercises(prev => [...prev, newEx]);
  };
  const handleUpdateExercise = async (id: string, updatedData: Partial<TherapyExercise>) => {
    const updated = await api.exercises.update(id, updatedData);
    setExercises(prev => prev.map(e => e.id === id ? updated : e));
  };
  const handleDeleteExercise = async (id: string) => {
    await api.exercises.delete(id);
    setExercises(prev => prev.filter(e => e.id !== id));
  };

  const handleUpdateSettings = async (sets: Partial<ClinicSettings>) => {
    const updated = await api.settings.update(sets);
    setClinicSettings(updated);
  };
  const handleResetSettings = async () => {
    const res = await api.settings.reset();
    setClinicSettings(res);
  };

  const handleCreateDepartment = async (dept: Omit<Department, 'id'> & { id?: string }) => {
    const newDept = await api.departments.create(dept);
    setDepartments(prev => [...prev, newDept]);
  };
  const handleUpdateDepartment = async (id: string, updatedData: Partial<Department>) => {
    const updated = await api.departments.update(id, updatedData);
    setDepartments(prev => prev.map(d => d.id === id ? updated : d));
  };
  const handleDeleteDepartment = async (id: string) => {
    await api.departments.delete(id);
    setDepartments(prev => prev.filter(d => d.id !== id));
  };
  const handleResetDepartments = async () => {
    const res = await api.departments.resetToDefault();
    setDepartments(res);
  };
  const handleOpenDepartmentManager = (dept?: Department) => {
    setDepartmentToEdit(dept || null);
    setIsDepartmentModalOpen(true);
  };

  const pendingRiskCount = patients.filter(p => p.riskLevel === 'حرج' || p.riskLevel === 'مرتفع').length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans text-slate-800 dark:text-slate-100 selection:bg-teal-500 selection:text-white transition-colors pb-16 md:pb-0 overflow-x-hidden w-full max-w-full" dir="rtl">
      
      {/* Top Application Header */}
      <Header
        currentRole={currentRole}
        setCurrentRole={() => setIsStaffAuthModalOpen(true)}
        activePortal={activePortal}
        setActivePortal={setActivePortal}
        theme={theme}
        onToggleTheme={toggleTheme}
        activePatient={activePatient}
        patients={patients}
        notifications={notifications}
        onMarkAllNotificationsRead={handleMarkAllNotificationsRead}
        onOpenChat={() => {
          if (activePortal === 'doctor') {
            setCurrentTab('chats');
          } else {
            setActivePortal('patient');
            setPatientTab('messages');
          }
        }}
        onOpenAppointments={() => {
          if (activePortal === 'doctor') {
            setCurrentTab('appointments');
          } else {
            setActivePortal('patient');
            setPatientTab('appointments');
          }
        }}
        onSelectPatient={handleSelectPatient}
        onOpenOverview={() => setIsOverviewModalOpen(true)}
        onOpenQuickScale={() => handleOpenScaleRunner('phq-9')}
        onOpenNewPrescription={() => setIsPrescriptionModalOpen(true)}
      />

      {/* Dynamic Announcement Banner */}
      {clinicSettings.showAnnouncementBanner && clinicSettings.announcementText && (
        <div className={`w-full py-2 px-4 text-xs font-bold text-center border-b transition-colors flex items-center justify-center gap-2 ${
          clinicSettings.announcementType === 'warning'
            ? 'bg-amber-500 text-slate-950 border-amber-600'
            : clinicSettings.announcementType === 'success'
            ? 'bg-emerald-600 text-white border-emerald-700'
            : 'bg-teal-700 text-white border-teal-800'
        }`}>
          <Megaphone className="w-3.5 h-3.5 shrink-0" />
          <span>{clinicSettings.announcementText}</span>
        </div>
      )}

      {/* Portal Switcher Banner */}
      <PortalSwitcherBanner
        activePortal={activePortal}
        setActivePortal={setActivePortal}
      />

      {/* Doctor Workspace Top Staff Strip (OBS-D-002, ADD-D-007) */}
      {activePortal === 'doctor' && (
        <div className="bg-slate-900 text-white border-b border-teal-900/40 px-4 py-2.5">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            
            <div className="flex items-center gap-3">
              <img
                src={currentStaff?.avatar || 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&auto=format&fit=crop&q=80'}
                alt={currentStaff?.name || 'طبيب'}
                className="w-8 h-8 rounded-xl object-cover border border-teal-500/40 shrink-0"
              />
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <strong className="font-bold text-white text-xs truncate">
                    {currentStaff?.name || 'د. طارق الحكيم'}
                  </strong>
                  <span className="px-2 py-0.5 rounded-full bg-teal-900 text-teal-300 font-mono font-bold text-[10px] border border-teal-700">
                    {currentStaff?.licenseNumber || 'MD-PSY-98442'}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 truncate">
                  {currentStaff?.specialty || 'استشاري أول الطب النفسي'} · جلسة مشفرة ومحمية
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  const newStatus = staffAuthService.toggleOnDuty(currentStaff?.doctorId || 'doc-hakim');
                  alert(newStatus ? 'تم تفعيل وضع المناوبة الفورية لاستقبال الحالات العاجلة ✓' : 'تم إيقاف المناوبة الفورية.');
                }}
                className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                title="تفعيل وضع الاستشارات الفورية العاجلة"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>مناوب الآن</span>
              </button>

              <button
                type="button"
                onClick={() => setIsStaffAuthModalOpen(true)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 border border-slate-700 cursor-pointer"
              >
                <UserCheck className="w-3.5 h-3.5 text-teal-400" />
                <span>تبديل حساب المختص</span>
              </button>

              <button
                type="button"
                onClick={() => setIsJoinTeamModalOpen(true)}
                className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Award className="w-3.5 h-3.5" />
                <span>انضم لفريقنا</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Main Container Area */}
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto overflow-hidden">
        
        {/* If Active Portal is DOCTOR: Show Workspace Sidebar */}
        {activePortal === 'doctor' && (
          <Sidebar
            currentTab={currentTab}
            setCurrentTab={setCurrentTab}
            currentRole={currentRole}
            currentStaff={currentStaff}
            pendingRiskCount={pendingRiskCount}
          />
        )}

        {/* Dynamic Portal View Container */}
        <main className="flex-1 p-3 sm:p-6 lg:p-8 overflow-y-auto max-w-full overflow-x-hidden">
          
          {/* 1. PATIENT / CLIENT PORTAL */}
          {activePortal === 'patient' && (
            <PatientPortalView
              patient={activePatient}
              patients={patients}
              onSelectPatient={handleSelectPatient}
              doctors={doctors}
              departments={departments}
              settings={clinicSettings}
              appointments={appointments}
              prescriptions={prescriptions}
              scaleResults={scaleResults}
              messages={messages}
              exercises={exercises}
              notifications={notifications}
              activeTab={patientTab}
              onTabChange={setPatientTab}
              onBookAppointmentClick={(docId, deptId, pathway, format) => {
                if (docId) setBookingInitialDoctorId(docId);
                if (deptId) setBookingInitialDeptId(deptId);
                if (pathway) setBookingInitialPathway(pathway);
                if (format) setBookingInitialFormat(format);
                setBookingInitialStep(docId ? 2 : 1);
                setIsBookingModalOpen(true);
              }}
              onBookDepartmentClick={(deptId) => {
                setBookingInitialDeptId(deptId);
                setBookingInitialStep(2);
                setIsBookingModalOpen(true);
              }}
              onOpenSelfDiagnostic={() => setIsSelfDiagnosticModalOpen(true)}
              onTakeScaleClick={(scaleId) => handleOpenScaleRunner(scaleId)}
              onSendMessage={handleSendMessage}
              onToggleExercise={handleToggleExercise}
              onViewPrescription={(rx) => {
                setSelectedPrescriptionForView(rx);
                setIsPrescriptionModalOpen(true);
              }}
              onCancelAppointment={async (aptId) => {
                await api.appointments.updateStatus(aptId, 'ملغي');
                setAppointments(prev => prev.map(a => a.id === aptId ? { ...a, status: 'ملغي' } : a));
                alert('تم إلغاء الموعد وتطبيق سياسة الاسترداد.');
              }}
              onDoctorRated={(doctorId, rating, comment) => {
                setDoctors(prev => prev.map(d => {
                  if (d.id === doctorId) {
                    const newCount = d.reviewsCount + 1;
                    const newRating = Number(((d.rating * d.reviewsCount + rating) / newCount).toFixed(2));
                    return { ...d, rating: newRating, reviewsCount: newCount };
                  }
                  return d;
                }));
              }}
            />
          )}

          {/* 2. DOCTOR / CLINICIAN PORTAL */}
          {activePortal === 'doctor' && (
            <div>
              {currentTab === 'dashboard' && (
                <DashboardView
                  patients={patients}
                  activePatient={activePatient}
                  onSelectPatient={handleSelectPatient}
                  scaleResults={scaleResults}
                  prescriptions={prescriptions}
                  appointments={appointments}
                  onUpdateAppointmentStatus={handleUpdateAppointmentStatus}
                  onOpenQuickScale={handleOpenScaleRunner}
                  onOpenNewPrescription={() => setIsPrescriptionModalOpen(true)}
                  onOpenClinicalForm={handleOpenClinicalForm}
                  onOpenOverviewModal={() => setIsOverviewModalOpen(true)}
                  onNavigateTab={(tab) => setCurrentTab(tab)}
                  currentRole={currentRole}
                  currentStaff={currentStaff}
                  onOpenPatientFileModal={(p) => {
                    setSelectedPatientForFile(p);
                    setIsPatientFileModalOpen(true);
                  }}
                  onOpenSendScaleModal={(p) => {
                    handleSelectPatient(p);
                    handleOpenScaleRunner('phq-9');
                  }}
                  onOpenChatWithPatient={(p) => {
                    handleSelectPatient(p);
                    setCurrentTab('chats');
                  }}
                />
              )}

              {currentTab === 'appointments' && (
                <DoctorAppointmentsTab
                  appointments={appointments}
                  patients={patients}
                  currentStaff={currentStaff}
                  onUpdateAppointmentStatus={handleUpdateAppointmentStatus}
                  onSelectPatient={handleSelectPatient}
                  onOpenChatWithPatient={(p) => {
                    handleSelectPatient(p);
                    setCurrentTab('chats');
                  }}
                />
              )}

              {currentTab === 'chats' && (
                <DoctorChatsTab
                  patients={patients}
                  activePatient={activePatient}
                  onSelectPatient={handleSelectPatient}
                  messages={messages}
                  onSendMessage={handleSendMessage}
                  currentStaff={currentStaff}
                  onOpenSendScaleModal={(p) => {
                    handleSelectPatient(p);
                    handleOpenScaleRunner('phq-9');
                  }}
                  onOpenSendExerciseModal={(p) => {
                    handleSelectPatient(p);
                    alert(`تم إسناد تمرين معرفي سلوكي للمريض ${p.name} بنجاح.`);
                  }}
                />
              )}

              {currentTab === 'schedule' && (
                <DoctorScheduleTab
                  currentStaff={currentStaff}
                  onScheduleUpdated={() => {
                    alert('تم تحديث جدول أوقاتك في نظام الحجز بنجاح.');
                  }}
                />
              )}

              {currentTab === 'psychiatry' && (
                <PsychiatryView
                  onOpenQuickScale={handleOpenScaleRunner}
                  onOpenNewPrescription={() => setIsPrescriptionModalOpen(true)}
                />
              )}

              {currentTab === 'scales' && (
                <ScalesView
                  activePatient={activePatient}
                  scaleResults={scaleResults}
                  onLaunchScale={handleOpenScaleRunner}
                />
              )}

              {currentTab === 'prescriptions' && (
                <PrescriptionsView
                  prescriptions={prescriptions}
                  activePatient={activePatient}
                  onOpenNewPrescription={() => setIsPrescriptionModalOpen(true)}
                  currentRole={currentRole}
                  currentStaff={currentStaff}
                />
              )}

              {currentTab === 'clinical_forms' && (
                <ClinicalFormsView
                  activePatient={activePatient}
                  onOpenClinicalForm={handleOpenClinicalForm}
                  currentStaff={currentStaff}
                />
              )}

              {currentTab === 'reports' && (
                <DoctorReportsTab
                  currentStaff={currentStaff}
                  patients={patients}
                  activePatient={activePatient}
                />
              )}

              {currentTab === 'peer_consult' && (
                <DoctorPeerConsultationsTab
                  currentStaff={currentStaff}
                  patients={patients}
                />
              )}

              {currentTab === 'financials' && (
                <DoctorFinancialsTab
                  currentStaff={currentStaff}
                />
              )}

              {currentTab === 'nutrition_social' && (
                <NutritionSocialView
                  activePatient={activePatient}
                  currentStaff={currentStaff}
                />
              )}

              {currentTab === 'handbook' && (
                <HandbookView />
              )}

              {currentTab === 'access_control' && (
                <AccessControlView
                  currentRole={currentRole}
                  setCurrentRole={(r) => {
                    if (currentStaff) {
                      setCurrentStaff({ ...currentStaff, role: r });
                    }
                  }}
                  auditLogs={auditLogs}
                  currentStaff={currentStaff}
                />
              )}
            </div>
          )}

          {/* 3. ADMIN & CLINIC MANAGEMENT PORTAL */}
          {activePortal === 'admin' && (
            <AdminPortalView
              analytics={analytics}
              doctors={doctors}
              patients={patients}
              departments={departments}
              appointments={appointments}
              exercises={exercises}
              settings={clinicSettings}
              auditLogs={auditLogs}
              onAddNewDoctor={handleAddNewDoctor}
              onUpdateDoctor={handleUpdateDoctor}
              onDeleteDoctor={handleDeleteDoctor}
              onAddNewPatient={handleAddNewPatient}
              onUpdatePatient={handleUpdatePatient}
              onDeletePatient={handleDeletePatient}
              onUpdateAppointment={handleUpdateAppointment}
              onDeleteAppointment={handleDeleteAppointment}
              onAddExercise={handleAddExercise}
              onUpdateExercise={handleUpdateExercise}
              onDeleteExercise={handleDeleteExercise}
              onUpdateSettings={handleUpdateSettings}
              onResetSettings={handleResetSettings}
              onCreateDepartment={handleCreateDepartment}
              onUpdateDepartment={handleUpdateDepartment}
              onDeleteDepartment={handleDeleteDepartment}
              onResetDepartments={handleResetDepartments}
              onOpenDepartmentManagerModal={handleOpenDepartmentManager}
            />
          )}

        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav
        activePortal={activePortal}
        setActivePortal={setActivePortal}
        patientTab={patientTab}
        onSelectPatientTab={(tab) => {
          setActivePortal('patient');
          setPatientTab(tab);
        }}
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenBooking={() => {
          setBookingInitialDeptId(departments[0]?.id || 'psychiatry');
          setBookingInitialStep(1);
          setIsBookingModalOpen(true);
        }}
        unreadChatCount={messages.filter(m => !m.isRead && m.senderRole === 'doctor').length}
      />

      {/* Modals & Dialogs */}
      <StaffAuthModal
        isOpen={isStaffAuthModalOpen}
        onClose={() => setIsStaffAuthModalOpen(false)}
        currentStaff={currentStaff}
        onStaffLogin={(user) => {
          setCurrentStaff(user);
        }}
        onOpenJoinTeamModal={() => setIsJoinTeamModalOpen(true)}
      />

      <JoinTeamModal
        isOpen={isJoinTeamModalOpen}
        onClose={() => setIsJoinTeamModalOpen(false)}
      />

      <DoctorPatientFileModal
        isOpen={isPatientFileModalOpen}
        onClose={() => setIsPatientFileModalOpen(false)}
        patient={selectedPatientForFile}
        scaleResults={scaleResults}
        prescriptions={prescriptions}
        onOpenNewSOAP={() => handleOpenClinicalForm('soap_note')}
        onOpenNewScale={() => handleOpenScaleRunner('phq-9')}
        onOpenNewRx={() => setIsPrescriptionModalOpen(true)}
      />

      <DepartmentManagementModal
        isOpen={isDepartmentModalOpen}
        onClose={() => {
          setIsDepartmentModalOpen(false);
          setDepartmentToEdit(null);
        }}
        departments={departments}
        doctors={doctors}
        onCreateDepartment={handleCreateDepartment}
        onUpdateDepartment={handleUpdateDepartment}
        onDeleteDepartment={handleDeleteDepartment}
        onResetDepartments={handleResetDepartments}
        initialEditDepartment={departmentToEdit}
      />

      <CoolMindOverviewBanner
        isOpen={isOverviewModalOpen}
        onClose={() => setIsOverviewModalOpen(false)}
        onNavigateToTab={(tab) => {
          setActivePortal('doctor');
          setCurrentTab(tab as TabId);
          setIsOverviewModalOpen(false);
        }}
      />

      <ScaleRunnerModal
        isOpen={isScaleRunnerModalOpen}
        onClose={() => setIsScaleRunnerModalOpen(false)}
        activePatient={activePatient}
        preselectedScaleId={runnerScaleId}
        onSaveResult={handleSaveScaleResult}
      />

      <PrescriptionGeneratorModal
        isOpen={isPrescriptionModalOpen}
        onClose={() => {
          setIsPrescriptionModalOpen(false);
          setSelectedPrescriptionForView(null);
        }}
        activePatient={activePatient}
        currentStaff={currentStaff}
        onSavePrescription={handleSavePrescription}
      />

      <ClinicalFormModal
        isOpen={isClinicalFormModalOpen}
        onClose={() => setIsClinicalFormModalOpen(false)}
        activePatient={activePatient}
        formType={clinicalFormType}
        currentStaff={currentStaff}
        onRecordSaved={handleRecordSaved}
      />

      <ClientBookingFlowModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        activePatient={activePatient}
        doctors={doctors}
        departments={departments}
        initialDeptId={bookingInitialDeptId}
        initialDoctorId={bookingInitialDoctorId}
        initialPathway={bookingInitialPathway}
        initialFormat={bookingInitialFormat}
        initialStep={bookingInitialStep}
        onCompleteBooking={handleBookAppointment}
        onOpenSelfDiagnostic={() => setIsSelfDiagnosticModalOpen(true)}
        onOpenChatWithDoctor={() => {
          setActivePortal('patient');
          setPatientTab('messages');
        }}
        onOpenDiagnosticScale={(scaleId) => handleOpenScaleRunner(scaleId)}
      />

      <SelfDiagnosticTriageModal
        isOpen={isSelfDiagnosticModalOpen}
        onClose={() => setIsSelfDiagnosticModalOpen(false)}
        onSelectRecommendedDoctor={(deptId) => {
          setBookingInitialDeptId(deptId);
          setBookingInitialStep(2);
          setIsBookingModalOpen(true);
        }}
        onLaunchRecommendedScale={(scaleId) => {
          handleOpenScaleRunner(scaleId);
        }}
      />

    </div>
  );
}

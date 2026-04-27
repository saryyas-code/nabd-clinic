import React, { useEffect, useMemo, useState } from 'react';

const SUPABASE_URL = 'https://kjdsxlofisxvargruvdr.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtqZHN4bG9maXN4dmFyZ3J1dmRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcxNTA5NzgsImV4cCI6MjA5MjcyNjk3OH0.x84oyhi7uDoeDtAhZZWuKLPEFDFyJNFCujnuguJu1Ko';

const today = () => new Date().toISOString().slice(0, 10);
const makeId = (prefix) => `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
const fmt = (n) => Number(n || 0).toLocaleString('en-US');

const services = ['كشف', 'تنظيف', 'حشوة', 'سحب عصب', 'خلع', 'تبييض', 'تقويم', 'زراعة', 'مراجعة'];

const statusClass = {
  Pending: 'bg-amber-100 text-amber-700',
  Confirmed: 'bg-emerald-100 text-emerald-700',
  Done: 'bg-blue-100 text-blue-700',
  'No Show': 'bg-rose-100 text-rose-700',
  Cancelled: 'bg-slate-100 text-slate-600',
};

const i18n = {
  ar: {
    dir: 'rtl', developed: 'تم التطوير من قبل Sary Yasin', local: 'حفظ محلي', auto: 'مزامنة تلقائية', today: 'اليوم', patients: 'المرضى', reports: 'تقارير', settings: 'إعدادات', search: 'ابحث عن مريض أو خدمة...', clinicName: 'اسم العيادة', language: 'لغة الواجهة', todayMap: 'خريطة اليوم', appointmentList: 'قائمة المواعيد', noAppointments: 'لا توجد مواعيد.', add: 'إضافة', addPatient: 'إضافة مريض', editPatient: 'تعديل مريض', addAppointment: 'إضافة موعد', addPayment: 'إضافة دفعة', patient: 'المريض', patientName: 'اسم المريض', phone: 'رقم الهاتف', plan: 'الخطة العلاجية', totalCost: 'إجمالي التكلفة بالليرة', notes: 'ملاحظات', date: 'التاريخ', time: 'الوقت', service: 'الخدمة', save: 'حفظ', saveAppointment: 'حفظ الموعد', savePayment: 'حفظ الدفعة', confirm: 'تأكيد', done: 'تم', noShow: 'لم يحضر', delete: 'حذف', close: 'إغلاق', payment: 'دفعة', note: 'ملاحظة', edit: 'تعديل', visits: 'زيارات', balance: 'المتبقي', total: 'الإجمالي', paid: 'المدفوع', payments: 'الدفعات', visitHistory: 'الزيارات', appointmentCount: 'مواعيد اليوم', confirmed: 'مؤكد', todayCash: 'كاش اليوم', tapProfile: 'اضغط لفتح الملف', reportTitle: 'التقارير والكاش فلو', mode: 'طريقة الاستعراض', day: 'يوم محدد', range: 'نطاق زمني', reportDate: 'تاريخ التقرير', from: 'من تاريخ', to: 'إلى تاريخ', result: 'نتيجة التقرير', period: 'الفترة', export: 'تصدير PDF', appCount: 'عدد المواعيد', completed: 'زيارات مكتملة', patientCount: 'عدد المرضى', paidPeriod: 'مدفوع بالفترة', totalPaid: 'إجمالي مدفوع', totalBalance: 'ذمم متبقية', appsInPeriod: 'المواعيد ضمن الفترة', paysInPeriod: 'الدفعات ضمن الفترة', noPayments: 'لا توجد دفعات.', amountSyp: 'المبلغ بالليرة السورية', method: 'طريقة الدفع', choosePatient: 'اختر مريض', status: { Pending: 'بانتظار', Confirmed: 'مؤكد', Done: 'تم', 'No Show': 'لم يحضر', Cancelled: 'ملغي' },
  },
  en: {
    dir: 'ltr', developed: 'Developed by Sary Yasin', local: 'Local save', auto: 'Auto sync', today: 'Today', patients: 'Patients', reports: 'Reports', settings: 'Settings', search: 'Search patient or service...', clinicName: 'Clinic name', language: 'Interface language', todayMap: 'Today map', appointmentList: 'Appointments list', noAppointments: 'No appointments.', add: 'Add', addPatient: 'Add patient', editPatient: 'Edit patient', addAppointment: 'Add appointment', addPayment: 'Add payment', patient: 'Patient', patientName: 'Patient name', phone: 'Phone', plan: 'Treatment plan', totalCost: 'Total cost in SYP', notes: 'Notes', date: 'Date', time: 'Time', service: 'Service', save: 'Save', saveAppointment: 'Save appointment', savePayment: 'Save payment', confirm: 'Confirm', done: 'Done', noShow: 'No show', delete: 'Delete', close: 'Close', payment: 'Payment', note: 'Note', edit: 'Edit', visits: 'Visits', balance: 'Balance', total: 'Total', paid: 'Paid', payments: 'Payments', visitHistory: 'Visits', appointmentCount: 'Today appointments', confirmed: 'Confirmed', todayCash: 'Today cash', tapProfile: 'Tap to open profile', reportTitle: 'Reports & cash flow', mode: 'Report mode', day: 'Single day', range: 'Date range', reportDate: 'Report date', from: 'From', to: 'To', result: 'Report result', period: 'Period', export: 'Export PDF', appCount: 'Appointments', completed: 'Completed visits', patientCount: 'Patients', paidPeriod: 'Paid in period', totalPaid: 'Total paid', totalBalance: 'Outstanding', appsInPeriod: 'Appointments in period', paysInPeriod: 'Payments in period', noPayments: 'No payments.', amountSyp: 'Amount in SYP', method: 'Payment method', choosePatient: 'Choose patient', status: { Pending: 'Pending', Confirmed: 'Confirmed', Done: 'Done', 'No Show': 'No Show', Cancelled: 'Cancelled' },
  },
};

const demoPatients = [
  { id: 'P-001', name: 'أحمد العمر', phone: '0999 111 222', plan: 'تنظيف + تبييض', notes: 'يفضل مواعيد صباحية', totalSyp: 2500000, paidSyp: 1000000, balanceSyp: 1500000, visits: 3, lastVisit: today() },
  { id: 'P-002', name: 'سارة خالد', phone: '0988 222 333', plan: 'حشوة + مراجعة', notes: 'حساسية أسنان', totalSyp: 800000, paidSyp: 300000, balanceSyp: 500000, visits: 1, lastVisit: today() },
  { id: 'P-003', name: 'محمد نور', phone: '0977 333 444', plan: 'تقويم 12 شهر', notes: 'متابعة شهرية', totalSyp: 6000000, paidSyp: 2000000, balanceSyp: 4000000, visits: 4, lastVisit: today() },
];

const demoAppointments = [
  { id: 'A-001', date: today(), time: '09:30', patientId: 'P-001', patient: 'أحمد العمر', phone: '0999 111 222', service: 'تنظيف', status: 'Confirmed', notes: 'زيارة أولى' },
  { id: 'A-002', date: today(), time: '10:15', patientId: 'P-002', patient: 'سارة خالد', phone: '0988 222 333', service: 'حشوة', status: 'Pending', notes: 'ألم سن' },
  { id: 'A-003', date: today(), time: '11:00', patientId: 'P-003', patient: 'محمد نور', phone: '0977 333 444', service: 'مراجعة', status: 'Done', notes: 'متابعة تقويم' },
];

const demoPayments = [
  { id: 'PAY-001', patientId: 'P-001', patientName: 'أحمد العمر', date: today(), amountSyp: 1000000, method: 'Cash', note: 'دفعة أولى' },
  { id: 'PAY-002', patientId: 'P-002', patientName: 'سارة خالد', date: today(), amountSyp: 300000, method: 'Cash', note: 'جزء من الحشوة' },
  { id: 'PAY-003', patientId: 'P-003', patientName: 'محمد نور', date: today(), amountSyp: 2000000, method: 'Transfer', note: 'دفعة تقويم' },
];

function load(key, fallback) { try { if (typeof window === 'undefined') return fallback; const raw = window.localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback; } catch { return fallback; } }
function save(key, value) { try { if (typeof window !== 'undefined') window.localStorage.setItem(key, JSON.stringify(value)); } catch {} }

function toDbPatient(p) { return { id: p.id, name: p.name, phone: p.phone, plan: p.plan || '', notes: p.notes || '', total_syp: Number(p.totalSyp || 0), paid_syp: Number(p.paidSyp || 0), balance_syp: Number(p.balanceSyp || 0), visits: Number(p.visits || 0), last_visit: p.lastVisit || '-' }; }
function fromDbPatient(r) { return { id: r.id, name: r.name || '', phone: r.phone || '', plan: r.plan || '', notes: r.notes || '', totalSyp: Number(r.total_syp || 0), paidSyp: Number(r.paid_syp || 0), balanceSyp: Number(r.balance_syp || 0), visits: Number(r.visits || 0), lastVisit: r.last_visit || '-' }; }
function toDbAppointment(a) { return { id: a.id, patient_id: a.patientId, date: a.date, time: a.time, service: a.service, status: a.status, notes: a.notes || '' }; }
function fromDbAppointment(r, patients) { const p = patients.find((x) => x.id === r.patient_id); return { id: r.id, patientId: r.patient_id, patient: p?.name || 'Unknown', phone: p?.phone || '', date: r.date || today(), time: r.time || '', service: r.service || services[0], status: r.status || 'Pending', notes: r.notes || '' }; }
function toDbPayment(p) { return { id: p.id, patient_id: p.patientId, date: p.date, amount_syp: Number(p.amountSyp || 0), method: p.method || 'Cash', note: p.note || '' }; }
function fromDbPayment(r, patients) { const p = patients.find((x) => x.id === r.patient_id); return { id: r.id, patientId: r.patient_id, patientName: p?.name || 'Unknown', date: r.date || today(), amountSyp: Number(r.amount_syp || 0), method: r.method || 'Cash', note: r.note || '' }; }

async function sb(table, { method = 'GET', query = '', body } = {}) {
  const safeQuery = query && query.startsWith('?') ? query : query ? `?${query}` : '';
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}${safeQuery}`, {
    method,
    headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}`, 'Content-Type': 'application/json', Prefer: 'return=representation' },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${method} ${table}: ${res.status} ${text}`);
  return text ? JSON.parse(text) : [];
}

function runInlineTests() {
  try {
    console.assert(fmt(1000) === '1,000', 'fmt formats thousands');
    console.assert(inRange('2026-04-10', '2026-04-01', '2026-04-30') === true, 'inRange includes middle date');
    console.assert(inRange('2026-05-01', '2026-04-01', '2026-04-30') === false, 'inRange excludes outside date');
    console.assert(toDbPayment({ id: 'PAY-T', patientId: 'P-T', date: '2026-04-27', amountSyp: 500, method: 'Cash', note: '' }).amount_syp === 500, 'toDbPayment maps SYP amount');
    console.assert(!('amountUsd' in demoPayments[0]), 'payments do not include USD field');
  } catch (error) { console.warn('Inline tests failed:', error); }
}
runInlineTests();

function Button({ children, variant = 'dark', className = '', ...props }) { const variants = { dark: 'bg-slate-900 text-white', light: 'bg-white text-slate-900 border border-slate-200', soft: 'bg-slate-100 text-slate-800', green: 'bg-emerald-50 text-emerald-700', blue: 'bg-blue-50 text-blue-700', red: 'bg-rose-50 text-rose-700' }; return <button {...props} className={`rounded-2xl px-4 py-3 font-bold active:scale-[0.98] disabled:opacity-40 ${variants[variant]} ${className}`}>{children}</button>; }
function Field({ label, children }) { return <label className="block space-y-1"><span className="text-xs font-bold text-slate-500">{label}</span>{children}</label>; }
function Input(props) { return <input {...props} className={`w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none text-slate-900 ${props.className || ''}`} />; }
function Select(props) { return <select {...props} className={`w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none text-slate-900 ${props.className || ''}`} />; }
function Textarea(props) { return <textarea {...props} className={`w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none min-h-24 text-slate-900 ${props.className || ''}`} />; }
function Modal({ title, onClose, children, dir = 'rtl' }) { return <div className="fixed inset-0 z-50 bg-slate-950/40 flex items-end justify-center p-3" dir={dir}><div className="bg-white w-full max-w-md rounded-t-[2rem] p-5 max-h-[92vh] overflow-y-auto shadow-2xl"><div className="flex items-center justify-between mb-4"><h2 className="font-black text-lg">{title}</h2><button onClick={onClose} className="w-10 h-10 rounded-full bg-slate-100 text-xl">×</button></div><div className="space-y-3">{children}</div></div></div>; }
function Badge({ status, t }) {
  return (
    <span className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-bold whitespace-nowrap min-w-[72px] h-7 shrink-0 ${statusClass[status] || statusClass.Pending}`}>
      {t.status[status] || status}
    </span>
  );
}
function Stat({ icon, label, value }) { return <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-sm text-slate-900"><div className="text-xl">{icon}</div><div className="font-black mt-1">{value}</div><div className="text-xs text-slate-500">{label}</div></div>; }
function inRange(date, from, to) { return date >= from && date <= to; }

export default function App() {
  const [lang, setLang] = useState(() => load('nabd_lang', 'ar'));
  const [theme, setTheme] = useState(() => load('nabd_theme', 'light'));
  const t = i18n[lang] || i18n.ar;
  const [tab, setTab] = useState('today');
  const [clinicName, setClinicName] = useState(() => load('nabd_clinic_name', 'عيادة الدكتور بلال'));
  const [patients, setPatients] = useState(() => load('nabd_patients', demoPatients));
  const [appointments, setAppointments] = useState(() => load('nabd_appointments', demoAppointments));
  const [payments, setPayments] = useState(() => load('nabd_payments', demoPayments));
  const [date, setDate] = useState(today());
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [modal, setModal] = useState(null);
  const [actionMenuOpen, setActionMenuOpen] = useState(false);
  const [sync, setSync] = useState(t.auto);
  const [error, setError] = useState('');
  const [last, setLast] = useState('');
  const [editingPatient, setEditingPatient] = useState(null);
  const [editingPayment, setEditingPayment] = useState(null);
  const [reportMode, setReportMode] = useState('day');
  const [reportFrom, setReportFrom] = useState(today());
  const [reportTo, setReportTo] = useState(today());
  const emptyPatient = { name: '', phone: '', plan: '', totalSyp: '', notes: '' };
  const emptyAppointment = { patientId: '', date: today(), time: '', service: services[0], notes: '' };
  const emptyPayment = { patientId: '', date: today(), amountSyp: '', method: 'Cash', note: '' };
  const [patientForm, setPatientForm] = useState(emptyPatient);
  const [appointmentForm, setAppointmentForm] = useState(emptyAppointment);
  const [paymentForm, setPaymentForm] = useState(emptyPayment);

  useEffect(() => { save('nabd_lang', lang);
    save('nabd_theme', theme); save('nabd_clinic_name', clinicName); save('nabd_patients', patients); save('nabd_appointments', appointments); save('nabd_payments', payments); setLast(new Date().toLocaleTimeString()); }, [lang, theme, clinicName, patients, appointments, payments]);
  useEffect(() => { if (!selected) return; const updated = patients.find((p) => p.id === selected.id); if (updated) setSelected(updated); }, [patients, selected]);
  useEffect(() => { const timer = setInterval(() => syncNow(false), 30000); return () => clearInterval(timer); }, []);

  const todayAppointments = useMemo(() => appointments.filter((a) => a.date === date).filter((a) => !query || `${a.patient} ${a.phone} ${a.service}`.toLowerCase().includes(query.toLowerCase())).sort((a, b) => a.time.localeCompare(b.time)), [appointments, date, query]);
  const todayPays = payments.filter((p) => p.date === date);
  const cashSyp = todayPays.reduce((s, p) => s + Number(p.amountSyp || 0), 0);

  async function syncNow(showLoading = true) {
    if (showLoading) setSync('Syncing...');
    setError('');
    try {
      const ps = await sb('patients', { query: '?select=*&order=name.asc' });
      const as = await sb('appointments', { query: '?select=*&order=date.asc,time.asc' });
      const pays = await sb('payments', { query: '?select=*&order=date.desc' });
      const mappedPatients = ps.map(fromDbPatient);
      const mappedAppointments = as.map((r) => fromDbAppointment(r, mappedPatients));
      const mappedPayments = pays.map((r) => fromDbPayment(r, mappedPatients));
      setPatients(mappedPatients); setAppointments(mappedAppointments); setPayments(mappedPayments);
      setSync(`${t.auto} · ${mappedPatients.length}`);
    } catch (e) { setError(e.message); setSync('Local only'); }
  }

  function openAddPatient() { setEditingPatient(null); setPatientForm(emptyPatient); setModal('patient'); }
  function openEditPatient(p) { setEditingPatient(p); setPatientForm({ name: p.name, phone: p.phone, plan: p.plan, totalSyp: p.totalSyp, notes: p.notes }); setModal('patient'); }
  function openPayment(p = selected) { setEditingPayment(null); setPaymentForm({ ...emptyPayment, patientId: p?.id || '' }); setModal('payment'); }
  function openEditPayment(payment) { setEditingPayment(payment); setPaymentForm({ patientId: payment.patientId || '', date: payment.date || today(), amountSyp: String(payment.amountSyp || ''), method: payment.method || 'Cash', note: payment.note || '' }); setModal('payment'); }

  async function savePatient() {
    if (!patientForm.name || !patientForm.phone) return;
    if (editingPatient) {
      const total = Number(patientForm.totalSyp || 0);
      const updated = { ...editingPatient, name: patientForm.name, phone: patientForm.phone, plan: patientForm.plan, notes: patientForm.notes, totalSyp: total, balanceSyp: Math.max(total - Number(editingPatient.paidSyp || 0), 0) };
      setPatients((prev) => prev.map((p) => p.id === updated.id ? updated : p)); setSelected(updated); setModal(null);
      try { await sb('patients', { method: 'PATCH', query: `?id=eq.${encodeURIComponent(updated.id)}`, body: toDbPatient(updated) }); } catch (e) { setError(e.message); }
      return;
    }
    const total = Number(patientForm.totalSyp || 0);
    const p = { id: makeId('P'), name: patientForm.name, phone: patientForm.phone, plan: patientForm.plan, notes: patientForm.notes, totalSyp: total, paidSyp: 0, balanceSyp: total, visits: 0, lastVisit: '-' };
    setPatients((prev) => [...prev, p]); setSelected(p); setModal(null);
    try { await sb('patients', { method: 'POST', body: toDbPatient(p) }); } catch (e) { setError(e.message); }
  }

  async function saveAppointment() {
    const p = patients.find((x) => x.id === appointmentForm.patientId); if (!p || !appointmentForm.time) return;
    const a = { id: makeId('A'), patientId: p.id, patient: p.name, phone: p.phone, date: appointmentForm.date, time: appointmentForm.time, service: appointmentForm.service, status: 'Pending', notes: appointmentForm.notes };
    const up = { ...p, visits: Number(p.visits || 0) + 1, lastVisit: a.date };
    setAppointments((prev) => [...prev, a]); setPatients((prev) => prev.map((x) => x.id === p.id ? up : x)); setModal(null);
    try { await sb('appointments', { method: 'POST', body: toDbAppointment(a) }); await sb('patients', { method: 'PATCH', query: `?id=eq.${encodeURIComponent(p.id)}`, body: { visits: up.visits, last_visit: up.lastVisit } }); } catch (e) { setError(e.message); }
  }

  async function savePayment() {
    const p = patients.find((x) => x.id === paymentForm.patientId);
    const syp = Number(paymentForm.amountSyp || 0);
    if (!p || !syp) return;

    if (editingPayment) {
      const oldPayment = editingPayment;
      const oldPatient = patients.find((x) => x.id === oldPayment.patientId);
      const targetPatient = patients.find((x) => x.id === paymentForm.patientId);
      if (!targetPatient) return;

      const updatedPayment = {
        ...oldPayment,
        patientId: targetPatient.id,
        patientName: targetPatient.name,
        date: paymentForm.date,
        amountSyp: syp,
        method: paymentForm.method,
        note: paymentForm.note,
      };

      const oldPayments = payments;
      const oldPatients = patients;

      let nextPatients = patients;
      if (oldPatient && oldPatient.id === targetPatient.id) {
        const paidSyp = Number(oldPatient.paidSyp || 0) - Number(oldPayment.amountSyp || 0) + syp;
        nextPatients = patients.map((x) => x.id === oldPatient.id ? { ...x, paidSyp, balanceSyp: Math.max(Number(x.totalSyp || 0) - paidSyp, 0) } : x);
      } else {
        nextPatients = patients.map((x) => {
          if (oldPatient && x.id === oldPatient.id) {
            const paidSyp = Math.max(Number(x.paidSyp || 0) - Number(oldPayment.amountSyp || 0), 0);
            return { ...x, paidSyp, balanceSyp: Math.max(Number(x.totalSyp || 0) - paidSyp, 0) };
          }
          if (x.id === targetPatient.id) {
            const paidSyp = Number(x.paidSyp || 0) + syp;
            return { ...x, paidSyp, balanceSyp: Math.max(Number(x.totalSyp || 0) - paidSyp, 0) };
          }
          return x;
        });
      }

      setPayments((prev) => prev.map((x) => x.id === oldPayment.id ? updatedPayment : x));
      setPatients(nextPatients);
      setSelected(nextPatients.find((x) => x.id === targetPatient.id) || null);
      setEditingPayment(null);
      setModal(null);

      try {
        await sb('payments', { method: 'PATCH', query: `?id=eq.${encodeURIComponent(updatedPayment.id)}`, body: toDbPayment(updatedPayment) });
        for (const patient of nextPatients) {
          const oldMatch = oldPatients.find((x) => x.id === patient.id);
          if (oldMatch && (oldMatch.paidSyp !== patient.paidSyp || oldMatch.balanceSyp !== patient.balanceSyp)) {
            await sb('patients', { method: 'PATCH', query: `?id=eq.${encodeURIComponent(patient.id)}`, body: { paid_syp: patient.paidSyp, balance_syp: patient.balanceSyp } });
          }
        }
      } catch (e) {
        setPayments(oldPayments);
        setPatients(oldPatients);
        setSelected(oldPatient || targetPatient);
        setSelectedPayment(oldPayment);
        setError(e.message);
      }
      return;
    }

    const pay = { id: makeId('PAY'), patientId: p.id, patientName: p.name, date: paymentForm.date, amountSyp: syp, method: paymentForm.method, note: paymentForm.note };
    const up = { ...p, paidSyp: Number(p.paidSyp || 0) + syp, balanceSyp: Math.max(Number(p.totalSyp || 0) - Number(p.paidSyp || 0) - syp, 0) };
    setPayments((prev) => [...prev, pay]); setPatients((prev) => prev.map((x) => x.id === p.id ? up : x)); setSelected(up); setModal(null);
    try { await sb('payments', { method: 'POST', body: toDbPayment(pay) }); await sb('patients', { method: 'PATCH', query: `?id=eq.${encodeURIComponent(p.id)}`, body: { paid_syp: up.paidSyp, balance_syp: up.balanceSyp } }); } catch (e) { setError(e.message); }
  }

  async function deletePaymentRecord(payment) {
    if (!payment) return;
    const ok = window.confirm(`${t.delete} ${fmt(payment.amountSyp)} ل.س؟`);
    if (!ok) return;

    const patient = patients.find((x) => x.id === payment.patientId);
    const oldPayments = payments;
    const oldPatients = patients;
    const updatedPatient = patient ? { ...patient, paidSyp: Math.max(Number(patient.paidSyp || 0) - Number(payment.amountSyp || 0), 0) } : null;
    if (updatedPatient) updatedPatient.balanceSyp = Math.max(Number(updatedPatient.totalSyp || 0) - Number(updatedPatient.paidSyp || 0), 0);

    setPayments((prev) => prev.filter((x) => x.id !== payment.id));
    setSelectedPayment(null);
    if (updatedPatient) {
      setPatients((prev) => prev.map((x) => x.id === updatedPatient.id ? updatedPatient : x));
      setSelected(updatedPatient);
    }

    try {
      await sb('payments', { method: 'DELETE', query: `?id=eq.${encodeURIComponent(payment.id)}` });
      if (updatedPatient) {
        await sb('patients', { method: 'PATCH', query: `?id=eq.${encodeURIComponent(updatedPatient.id)}`, body: { paid_syp: updatedPatient.paidSyp, balance_syp: updatedPatient.balanceSyp } });
      }
    } catch (e) {
      setPayments(oldPayments);
      setPatients(oldPatients);
      setSelected(patient || null);
      setSelectedPayment(payment);
      setError(e.message);
    }
  }

  async function setStatus(a, status) { const up = { ...a, status }; setAppointments((prev) => prev.map((x) => x.id === a.id ? up : x)); try { await sb('appointments', { method: 'PATCH', query: `?id=eq.${encodeURIComponent(a.id)}`, body: { status } }); } catch (e) { setError(e.message); } }
  async function deleteAppointment(a) { setAppointments((prev) => prev.filter((x) => x.id !== a.id)); try { await sb('appointments', { method: 'DELETE', query: `?id=eq.${encodeURIComponent(a.id)}` }); } catch (e) { setError(e.message); } }

  async function deletePatientRecord(patient) {
    if (!patient) return;
    const ok = window.confirm(`${t.delete} ${patient.name}?`);
    if (!ok) return;

    const oldPatients = patients;
    const oldAppointments = appointments;
    const oldPayments = payments;

    setPatients((prev) => prev.filter((x) => x.id !== patient.id));
    setAppointments((prev) => prev.filter((x) => x.patientId !== patient.id));
    setPayments((prev) => prev.filter((x) => x.patientId !== patient.id));
    setSelected(null);

    try {
      await sb('appointments', { method: 'DELETE', query: `?patient_id=eq.${encodeURIComponent(patient.id)}` });
      await sb('payments', { method: 'DELETE', query: `?patient_id=eq.${encodeURIComponent(patient.id)}` });
      await sb('patients', { method: 'DELETE', query: `?id=eq.${encodeURIComponent(patient.id)}` });
    } catch (e) {
      setPatients(oldPatients);
      setAppointments(oldAppointments);
      setPayments(oldPayments);
      setSelected(patient);
      setError(e.message);
    }
  }
  function addNote() { if (!selected) return; const value = window.prompt(t.note, ''); if (!value) return; const up = { ...selected, notes: selected.notes ? `${selected.notes} | ${value}` : value }; setPatients((prev) => prev.map((p) => p.id === up.id ? up : p)); setSelected(up); }

  const nav = [['today', '📅', t.today], ['patients', '👥', t.patients], ['payments', '💵', t.payments], ['reports', '📊', t.reports], ['settings', '⚙️', t.settings]];

  return <main data-theme={theme} className={`min-h-screen pb-28 ${theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-950'}`} dir={t.dir}>
    <style>{`
      [data-theme="dark"] { background:#020617 !important; color:#f8fafc !important; }
      [data-theme="dark"] .bg-white { background:#0f172a !important; color:#f8fafc !important; }
      [data-theme="dark"] .bg-slate-50 { background:#111827 !important; color:#f8fafc !important; }
      [data-theme="dark"] .bg-slate-100 { background:#1e293b !important; color:#f8fafc !important; }
      [data-theme="dark"] .border-slate-200 { border-color:#334155 !important; }
      [data-theme="dark"] .text-slate-950,
      [data-theme="dark"] .text-slate-900,
      [data-theme="dark"] .text-slate-800,
      [data-theme="dark"] .text-slate-700 { color:#f8fafc !important; }
      [data-theme="dark"] .text-slate-600,
      [data-theme="dark"] .text-slate-500,
      [data-theme="dark"] .text-slate-400 { color:#cbd5e1 !important; }
      [data-theme="dark"] input,
      [data-theme="dark"] select,
      [data-theme="dark"] textarea { background:#0f172a !important; color:#f8fafc !important; border-color:#334155 !important; }
      [data-theme="dark"] input::placeholder,
      [data-theme="dark"] textarea::placeholder { color:#94a3b8 !important; }
      [data-theme="dark"] nav { background:#0f172a !important; border-color:#334155 !important; color:#f8fafc !important; }
      [data-theme="dark"] button.bg-white { background:#1e293b !important; color:#f8fafc !important; }
      [data-theme="dark"] .shadow-sm,
      [data-theme="dark"] .shadow-xl,
      [data-theme="dark"] .shadow-md { box-shadow:0 10px 30px rgba(0,0,0,.35) !important; }
    `}</style>
    <div className="max-w-md mx-auto p-4 space-y-5">
      <header className="flex items-center justify-between gap-3"><div><p className="text-xs text-slate-500 font-semibold">Powered by SY Systems</p><h1 className="font-black text-xl">{clinicName}</h1><p className="text-[11px] text-slate-400">{t.local} {last ? `· ${last}` : ''} · {sync}</p>{error && <p className="text-[11px] text-rose-600">{error}</p>}</div><div className="w-[170px] h-[70px] sm:w-[220px] sm:h-[82px] flex items-center justify-center shrink-0 overflow-visible">
  <img
    src={theme === 'dark' ? '/logo-dark.png' : '/logo-light.png'}
    alt="SY Systems Logo"
    className="w-full h-full object-contain scale-[2] origin-center"
  />
</div></header>

      {tab === 'today' && <section className="space-y-4"><div className="flex gap-2"><Input type="date" value={date} onChange={(e) => setDate(e.target.value)} /><Button onClick={() => setModal('appointment')}>＋</Button></div><Input placeholder={t.search} value={query} onChange={(e) => setQuery(e.target.value)} /><div className="grid grid-cols-2 gap-3"><Stat icon="📅" label={t.appointmentCount} value={todayAppointments.length} /><Stat icon="✅" label={t.confirmed} value={todayAppointments.filter((a) => a.status === 'Confirmed').length} /><Stat icon="🦷" label={t.done} value={todayAppointments.filter((a) => a.status === 'Done').length} /><Stat icon="💰" label={t.todayCash} value={`${fmt(cashSyp)} ل.س`} /></div><div className="bg-white rounded-[2rem] border border-slate-200 p-4 space-y-3"><div className="flex justify-between"><h2 className="font-black">{t.todayMap}</h2><span className="text-sm text-slate-500">{todayAppointments.length}</span></div>{todayAppointments.length ? todayAppointments.map((a) => <button key={a.id} onClick={() => setSelected(patients.find((p) => p.id === a.patientId) || null)} className="w-full flex items-center gap-3 text-right bg-slate-50 rounded-2xl p-3"><b className="bg-slate-900 text-white rounded-2xl p-2 w-16 text-center">{a.time}</b><span className="flex-1"><b className="block">{a.patient}</b><small className="text-slate-500">{a.service} · {t.tapProfile}</small></span><Badge status={a.status} t={t} /></button>) : <p className="text-center text-slate-500 py-8">{t.noAppointments}</p>}</div>{selected && <PatientCard p={selected} payments={payments} appointments={appointments} onClose={() => setSelected(null)} onPay={() => openPayment(selected)} onEdit={() => openEditPatient(selected)} onDelete={() => deletePatientRecord(selected)} t={t} />}<div className="space-y-3"><h2 className="font-black">{t.appointmentList}</h2>{todayAppointments.map((a) => <article key={a.id} className="bg-white rounded-3xl border border-slate-200 p-4 space-y-3"><div className="flex justify-between gap-3"><div><b className="text-xl">{a.time}</b><h3 className="font-black">{a.patient}</h3><p className="text-sm text-slate-500">{a.service}</p>{a.notes && <p className="text-xs text-slate-400">{a.notes}</p>}</div><Badge status={a.status} t={t} /></div><div className="grid grid-cols-2 gap-2"><Button variant="green" onClick={() => setStatus(a, 'Confirmed')} className="py-2 text-sm">{t.confirm}</Button><Button variant="blue" onClick={() => setStatus(a, 'Done')} className="py-2 text-sm">{t.done}</Button><Button variant="red" onClick={() => setStatus(a, 'No Show')} className="py-2 text-sm">{t.noShow}</Button><Button variant="red" onClick={() => deleteAppointment(a)} className="py-2 text-sm">{t.delete}</Button></div></article>)}</div></section>}

      {tab === 'patients' && <section className="space-y-3"><div className="flex justify-between items-center"><h2 className="font-black text-lg">{t.patients}</h2><Button onClick={openAddPatient} className="py-2">{t.add}</Button></div>{selected && <PatientCard p={selected} payments={payments} appointments={appointments} onClose={() => setSelected(null)} onPay={() => openPayment(selected)} onEdit={() => openEditPatient(selected)} onDelete={() => deletePatientRecord(selected)} t={t} />}{patients.map((p) => <article key={p.id} onClick={() => setSelected(p)} className="bg-white rounded-3xl border border-slate-200 p-4 active:scale-[.99]"><div className="flex justify-between"><div><h3 className="font-black">{p.name}</h3><p className="text-sm text-slate-500">{p.phone}</p></div><span className="bg-slate-100 px-3 py-1 rounded-full text-xs">{p.visits} {t.visits}</span></div><p className="text-sm mt-3">{t.plan}: {p.plan || '-'}</p><p className="text-sm text-rose-700">{t.balance}: {fmt(p.balanceSyp)} ل.س</p></article>)}</section>}
      {tab === 'payments' && <PaymentsSection t={t} payments={payments} patients={patients} selectedPayment={selectedPayment} setSelectedPayment={setSelectedPayment} onAddPayment={() => { setEditingPayment(null); setPaymentForm(emptyPayment); setModal('payment'); }} onEditPayment={openEditPayment} onDeletePayment={deletePaymentRecord} />}
      {tab === 'reports' && <ReportsSection t={t} reportMode={reportMode} setReportMode={setReportMode} reportFrom={reportFrom} setReportFrom={setReportFrom} reportTo={reportTo} setReportTo={setReportTo} appointments={appointments} payments={payments} patients={patients} />}
      {tab === 'settings' && <section className="space-y-4"><h2 className="font-black text-lg">{t.settings}</h2><div className="bg-white rounded-3xl border border-slate-200 p-4 space-y-3"><Field label={t.clinicName}><Input value={clinicName} onChange={(e) => setClinicName(e.target.value)} /></Field><Field label={t.language}><Select value={lang} onChange={(e) => setLang(e.target.value)}><option value="ar">العربية</option><option value="en">English</option></Select></Field><Field label="Theme"><Select value={theme} onChange={(e) => setTheme(e.target.value)}><option value="light">Light</option><option value="dark">Dark</option></Select></Field></div></section>}
    </div>

    <div className="fixed bottom-24 right-1/2 translate-x-1/2 z-40 flex flex-col items-center gap-3">
      {actionMenuOpen && <div className="bg-white border border-slate-200 rounded-3xl shadow-xl p-2 w-48 space-y-2 text-sm">
        <button onClick={() => { setModal('appointment'); setActionMenuOpen(false); }} className="w-full flex items-center justify-between rounded-2xl px-4 py-3 bg-slate-50 font-bold"><span>{t.addAppointment}</span><span>📅</span></button>
        <button onClick={() => { openAddPatient(); setActionMenuOpen(false); }} className="w-full flex items-center justify-between rounded-2xl px-4 py-3 bg-slate-50 font-bold"><span>{t.addPatient}</span><span>👤</span></button>
        <button onClick={() => { openPayment(selected || null); setActionMenuOpen(false); }} className="w-full flex items-center justify-between rounded-2xl px-4 py-3 bg-slate-50 font-bold"><span>{t.addPayment}</span><span>💰</span></button>
      </div>}
      <button onClick={() => setActionMenuOpen((v) => !v)} className="w-16 h-16 rounded-full bg-slate-900 text-white text-3xl shadow-xl active:scale-95 transition">{actionMenuOpen ? '×' : '＋'}</button>
    </div>
    <nav className="fixed bottom-0 inset-x-0 bg-white border-t z-30 p-2"><div className="max-w-md mx-auto grid grid-cols-5 gap-1">{nav.map((n) => <button key={n[0]} onClick={() => setTab(n[0])} className={`rounded-2xl py-2 text-xs flex flex-col items-center ${tab === n[0] ? 'bg-slate-100 font-black' : 'text-slate-500'}`}><span>{n[1]}</span><span>{n[2]}</span></button>)}</div></nav>

    {modal === 'patient' && <Modal title={editingPatient ? t.editPatient : t.addPatient} onClose={() => setModal(null)} dir={t.dir}><Field label={t.patientName}><Input value={patientForm.name} onChange={(e) => setPatientForm({ ...patientForm, name: e.target.value })} /></Field><Field label={t.phone}><Input value={patientForm.phone} onChange={(e) => setPatientForm({ ...patientForm, phone: e.target.value })} /></Field><Field label={t.plan}><Input value={patientForm.plan} onChange={(e) => setPatientForm({ ...patientForm, plan: e.target.value })} /></Field><Field label={t.totalCost}><Input inputMode="numeric" value={patientForm.totalSyp} onChange={(e) => setPatientForm({ ...patientForm, totalSyp: e.target.value })} /></Field><Field label={t.notes}><Textarea value={patientForm.notes} onChange={(e) => setPatientForm({ ...patientForm, notes: e.target.value })} /></Field><Button onClick={savePatient} disabled={!patientForm.name || !patientForm.phone} className="w-full">{t.save}</Button></Modal>}
    {modal === 'appointment' && <Modal title={t.addAppointment} onClose={() => setModal(null)} dir={t.dir}><Field label={t.patient}><Select value={appointmentForm.patientId} onChange={(e) => setAppointmentForm({ ...appointmentForm, patientId: e.target.value })}><option value="">{t.choosePatient}</option>{patients.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</Select></Field><Field label={t.date}><Input type="date" value={appointmentForm.date} onChange={(e) => setAppointmentForm({ ...appointmentForm, date: e.target.value })} /></Field><Field label={t.time}><Input type="time" value={appointmentForm.time} onChange={(e) => setAppointmentForm({ ...appointmentForm, time: e.target.value })} /></Field><Field label={t.service}><Select value={appointmentForm.service} onChange={(e) => setAppointmentForm({ ...appointmentForm, service: e.target.value })}>{services.map((s) => <option key={s} value={s}>{s}</option>)}</Select></Field><Field label={t.notes}><Textarea value={appointmentForm.notes} onChange={(e) => setAppointmentForm({ ...appointmentForm, notes: e.target.value })} /></Field><Button onClick={saveAppointment} disabled={!appointmentForm.patientId || !appointmentForm.time} className="w-full">{t.saveAppointment}</Button></Modal>}
    {modal === 'payment' && <Modal title={t.addPayment} onClose={() => setModal(null)} dir={t.dir}><Field label={t.patient}><Select value={paymentForm.patientId} onChange={(e) => setPaymentForm({ ...paymentForm, patientId: e.target.value })}><option value="">{t.choosePatient}</option>{patients.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</Select></Field><Field label={t.date}><Input type="date" value={paymentForm.date} onChange={(e) => setPaymentForm({ ...paymentForm, date: e.target.value })} /></Field><Field label={t.amountSyp}><Input inputMode="numeric" value={paymentForm.amountSyp} onChange={(e) => setPaymentForm({ ...paymentForm, amountSyp: e.target.value })} /></Field><Field label={t.method}><Select value={paymentForm.method} onChange={(e) => setPaymentForm({ ...paymentForm, method: e.target.value })}><option>Cash</option><option>Transfer</option><option>Card</option><option>Other</option></Select></Field><Field label={t.note}><Textarea value={paymentForm.note} onChange={(e) => setPaymentForm({ ...paymentForm, note: e.target.value })} /></Field><Button onClick={savePayment} disabled={!paymentForm.patientId || !paymentForm.amountSyp} className="w-full">{t.savePayment}</Button></Modal>}
  </main>;
}

function PaymentsSection({ t, payments, patients, selectedPayment, setSelectedPayment, onAddPayment, onEditPayment, onDeletePayment }) {
  const sortedPayments = [...payments].sort((a, b) => b.date.localeCompare(a.date));
  const totalSyp = sortedPayments.reduce((sum, payment) => sum + Number(payment.amountSyp || 0), 0);

  return <section className="space-y-4">
    <div className="flex items-center justify-between">
      <div>
        <h2 className="font-black text-lg">{t.payments}</h2>
        <p className="text-sm text-slate-500">{sortedPayments.length} {t.payments} · {fmt(totalSyp)} ل.س</p>
      </div>
      <Button onClick={onAddPayment} className="py-2">{t.add}</Button>
    </div>

    {selectedPayment && <PaymentDetails payment={selectedPayment} t={t} onClose={() => setSelectedPayment(null)} onEdit={() => onEditPayment(selectedPayment)} onDelete={() => onDeletePayment(selectedPayment)} />}

    <div className="space-y-3">
      {sortedPayments.length ? sortedPayments.map((payment) => {
        const patient = patients.find((p) => p.id === payment.patientId);
        return <article key={payment.id} onClick={() => setSelectedPayment(payment)} className="bg-white rounded-3xl border border-slate-200 p-4 active:scale-[.99] cursor-pointer shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="font-black truncate">{payment.patientName || patient?.name || 'Unknown'}</h3>
              <p className="text-sm text-slate-500">{payment.date} · {payment.method}</p>
              {payment.note ? <p className="text-xs text-slate-400 mt-1 line-clamp-2">{payment.note}</p> : null}
            </div>
            <div className="text-left shrink-0">
              <b className="text-lg">{fmt(payment.amountSyp)}</b>
              <p className="text-xs text-slate-500">ل.س</p>
            </div>
          </div>
        </article>;
      }) : <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-8 text-center text-slate-500">{t.noPayments}</div>}
    </div>
  </section>;
}

function PaymentDetails({ payment, t, onClose, onEdit, onDelete }) {
  return <section className="bg-slate-900 text-white rounded-[2rem] p-5 space-y-4 shadow-xl">
    <div className="flex justify-between gap-3">
      <div>
        <h3 className="font-black text-xl">{payment.patientName}</h3>
        <p className="text-sm text-slate-300">{payment.date} · {payment.method}</p>
      </div>
      <button onClick={onClose} className="bg-white/10 rounded-full px-3 py-1 text-sm">{t.close}</button>
    </div>
    <div className="bg-white/10 rounded-2xl p-4">
      <p className="text-sm text-slate-300">{t.payment}</p>
      <p className="font-black text-2xl">{fmt(payment.amountSyp)} ل.س</p>
    </div>
    {payment.note ? <div className="bg-white/10 rounded-2xl p-4 text-sm"><b>{t.note}: </b>{payment.note}</div> : null}
    <div className="grid grid-cols-2 gap-2">
      <Button variant="light" onClick={onEdit} className="py-2 text-sm">{t.edit}</Button>
      <Button variant="red" onClick={onDelete} className="py-2 text-sm">{t.delete}</Button>
    </div>
  </section>;
}

function ReportsSection({ t, reportMode, setReportMode, reportFrom, setReportFrom, reportTo, setReportTo, appointments, payments, patients }) {
  const from = reportFrom;
  const to = reportMode === 'day' ? reportFrom : reportTo;
  const periodAppointments = appointments.filter((a) => inRange(a.date, from, to));
  const periodPayments = payments.filter((p) => inRange(p.date, from, to));
  const periodSyp = periodPayments.reduce((s, p) => s + Number(p.amountSyp || 0), 0);
  const done = periodAppointments.filter((a) => a.status === 'Done').length;
  const noShow = periodAppointments.filter((a) => a.status === 'No Show').length;
  const totalPaid = patients.reduce((s, p) => s + Number(p.paidSyp || 0), 0);
  const totalBalance = patients.reduce((s, p) => s + Number(p.balanceSyp || 0), 0);

  function exportReport() {
    const rowsAppointments = periodAppointments.map((a) => `<tr><td>${a.date}</td><td>${a.time}</td><td>${a.patient}</td><td>${a.service}</td><td>${t.status[a.status] || a.status}</td></tr>`).join('');
    const rowsPayments = periodPayments.map((p) => `<tr><td>${p.date}</td><td>${p.patientName}</td><td>${fmt(p.amountSyp)} SYP</td><td>${p.method}</td></tr>`).join('');
    const html = `<!doctype html><html dir="${t.dir}"><head><meta charset="utf-8"><title>Clinic Report</title><style>body{font-family:Arial,Tahoma,sans-serif;padding:24px;color:#0f172a}h1{margin-bottom:4px}.muted{color:#64748b}.grid{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin:20px 0}.card{border:1px solid #e2e8f0;border-radius:14px;padding:12px}table{width:100%;border-collapse:collapse;margin-top:10px}td,th{border-bottom:1px solid #e2e8f0;padding:8px;text-align:${t.dir === 'rtl' ? 'right' : 'left'}}@media print{@page{size:A4;margin:14mm}}</style></head><body><h1>${t.result}</h1><p class="muted">${t.period}: ${from} - ${to}</p><div class="grid"><div class="card">${t.appCount}: <b>${periodAppointments.length}</b></div><div class="card">${t.completed}: <b>${done}</b></div><div class="card">${t.noShow}: <b>${noShow}</b></div><div class="card">${t.patientCount}: <b>${patients.length}</b></div><div class="card">${t.paidPeriod}: <b>${fmt(periodSyp)} SYP</b></div><div class="card">${t.totalPaid}: <b>${fmt(totalPaid)} SYP</b></div><div class="card">${t.totalBalance}: <b>${fmt(totalBalance)} SYP</b></div></div><h2>${t.appsInPeriod}</h2><table><thead><tr><th>${t.date}</th><th>${t.time}</th><th>${t.patient}</th><th>${t.service}</th><th>Status</th></tr></thead><tbody>${rowsAppointments || `<tr><td colspan="5">${t.noAppointments}</td></tr>`}</tbody></table><h2>${t.paysInPeriod}</h2><table><thead><tr><th>${t.date}</th><th>${t.patient}</th><th>SYP</th><th>${t.method}</th></tr></thead><tbody>${rowsPayments || `<tr><td colspan="4">${t.noPayments}</td></tr>`}</tbody></table><script>window.onload=function(){window.print()}</script></body></html>`;
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `clinic-report-${from}-to-${to}.html`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return <section className="space-y-4"><h2 className="font-black text-lg">{t.reportTitle}</h2><div className="bg-white rounded-3xl border border-slate-200 p-4 space-y-3"><Field label={t.mode}><Select value={reportMode} onChange={(e) => setReportMode(e.target.value)}><option value="day">{t.day}</option><option value="range">{t.range}</option></Select></Field><div className="grid grid-cols-2 gap-2"><Field label={reportMode === 'day' ? t.reportDate : t.from}><Input type="date" value={reportFrom} onChange={(e) => setReportFrom(e.target.value)} /></Field>{reportMode === 'range' && <Field label={t.to}><Input type="date" value={reportTo} onChange={(e) => setReportTo(e.target.value)} /></Field>}</div></div><div className="bg-white rounded-3xl border border-slate-200 p-4"><div className="flex items-center justify-between gap-3"><div><h3 className="font-black">{t.result}</h3><p className="text-sm text-slate-500">{t.period}: {from} - {to}</p></div><Button onClick={exportReport} className="py-2 px-4">{t.export}</Button></div></div><div className="grid grid-cols-2 gap-3"><Stat icon="📅" label={t.appCount} value={periodAppointments.length} /><Stat icon="✅" label={t.completed} value={done} /><Stat icon="⚠️" label={t.noShow} value={noShow} /><Stat icon="👥" label={t.patientCount} value={patients.length} /><Stat icon="💰" label={t.paidPeriod} value={`${fmt(periodSyp)} ل.س`} /><Stat icon="📈" label={t.totalPaid} value={`${fmt(totalPaid)} ل.س`} /><Stat icon="📌" label={t.totalBalance} value={`${fmt(totalBalance)} ل.س`} /></div><div className="bg-white rounded-3xl border border-slate-200 p-4"><h3 className="font-black mb-2">{t.appsInPeriod}</h3>{periodAppointments.length ? periodAppointments.map((a) => <div key={a.id} className="border-b last:border-0 py-2 text-sm"><div className="flex justify-between"><span>{a.date} · {a.time}</span><b>{a.patient}</b></div><p className="text-xs text-slate-500">{a.service} · {t.status[a.status] || a.status}</p></div>) : <p className="text-sm text-slate-500">{t.noAppointments}</p>}</div><div className="bg-white rounded-3xl border border-slate-200 p-4"><h3 className="font-black mb-2">{t.paysInPeriod}</h3>{periodPayments.length ? periodPayments.map((p) => <div key={p.id} className="border-b last:border-0 py-2 text-sm"><div className="flex justify-between"><span>{p.date} · {p.patientName}</span><b>{fmt(p.amountSyp)} ل.س</b></div><p className="text-xs text-slate-500">{p.method} {p.note ? `· ${p.note}` : ''}</p></div>) : <p className="text-sm text-slate-500">{t.noPayments}</p>}</div></section>;
}

function PatientCard({ p, payments, appointments, onClose, onPay, onEdit, onDelete, t }) {
  const pays = payments.filter((x) => x.patientId === p.id).sort((a, b) => b.date.localeCompare(a.date));
  const apps = appointments.filter((x) => x.patientId === p.id).sort((a, b) => b.date.localeCompare(a.date));
  return <section className="bg-slate-900 text-white rounded-[2rem] p-5 space-y-4 shadow-xl"><div className="flex justify-between gap-3"><div><h3 className="font-black text-xl">{p.name}</h3><p className="text-sm text-slate-300">{p.phone}</p></div><button onClick={onClose} className="bg-white/10 rounded-full px-3 py-1 text-sm">{t.close}</button></div><div className="grid grid-cols-2 gap-2 text-sm"><div className="bg-white/10 rounded-2xl p-3">{t.plan}: {p.plan || '-'}</div><div className="bg-white/10 rounded-2xl p-3">{t.visits}: {p.visits || 0}</div><div className="bg-white/10 rounded-2xl p-3">{t.total}: {fmt(p.totalSyp)} ل.س</div><div className="bg-white/10 rounded-2xl p-3">{t.balance}: {fmt(p.balanceSyp)} ل.س</div></div><div className="grid grid-cols-3 gap-2"><Button variant="light" onClick={onPay} className="py-2 text-sm">{t.payment}</Button><Button variant="light" onClick={onEdit} className="py-2 text-sm">{t.edit}</Button><Button variant="red" onClick={onDelete} className="py-2 text-sm">{t.delete}</Button></div>{p.notes && <p className="bg-white/10 rounded-2xl p-3 text-sm">{p.notes}</p>}<div><h4 className="font-black mb-2">{t.payments}</h4>{pays.length ? pays.map((x) => <div key={x.id} className="bg-white/10 rounded-2xl p-3 text-sm mb-2"><div className="flex justify-between"><span>{x.date}</span><b>{fmt(x.amountSyp)} ل.س</b></div><small className="text-slate-300">{x.method} {x.note ? `· ${x.note}` : ''}</small></div>) : <p className="text-sm text-slate-300">{t.noPayments}</p>}</div><div><h4 className="font-black mb-2">{t.visitHistory}</h4>{apps.length ? apps.map((x) => <div key={x.id} className="bg-white/10 rounded-2xl p-3 text-sm mb-2"><div className="flex justify-between"><span>{x.date} · {x.time}</span><b>{x.service}</b></div><small className="text-slate-300">{t.status[x.status] || x.status}</small></div>) : <p className="text-sm text-slate-300">{t.noAppointments}</p>}</div></section>;
}

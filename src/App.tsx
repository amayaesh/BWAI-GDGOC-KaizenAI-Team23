import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Trash2, 
  Plus, 
  Clock, 
  Brain, 
  Calendar, 
  AlertCircle, 
  CheckCircle2, 
  Target, 
  ChevronRight, 
  BookOpen, 
  Coffee, 
  Flame, 
  RotateCcw,
  User,
  Lightbulb,
  Heart,
  Smile,
  Zap
} from 'lucide-react';

interface Task {
  id: string;
  nama: string;
  deadline: string; // YYYY-MM-DD
  difficulty: 'Low' | 'Medium' | 'High';
}

interface PrioritasTugas {
  nama_tugas: string;
  skala_prioritas: 'Tinggi' | 'Sedang' | 'Rendah' | string;
  alasan: string;
}

interface JadwalRekomendasi {
  waktu: string;
  aktivitas: string;
}

interface AnalysisResponse {
  error?: string;
  status_analisis?: string;
  prioritas_tugas?: PrioritasTugas[];
  jadwal_rekomendasi?: JadwalRekomendasi[];
  strategi_anti_prokrastinasi?: string;
  pesan_semangat?: string;
  catatan_error?: string;
}

export default function App() {
  // Application states
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskName, setTaskName] = useState('');
  const [taskDeadline, setTaskDeadline] = useState('');
  const [taskDifficulty, setTaskDifficulty] = useState<'Low' | 'Medium' | 'High'>('Medium');
  
  const [emotionalState, setEmotionalState] = useState<string>('');
  const [focusLevel, setFocusLevel] = useState<number>(5);
  const [isDailyReflection, setIsDailyReflection] = useState<boolean>(false);
  const [customText, setCustomText] = useState<string>('');
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null);
  const [checkedTasks, setCheckedTasks] = useState<Record<string, boolean>>({});

  // Loading statements rotator
  useEffect(() => {
    if (!isLoading) return;
    const statements = [
      "🧸 Menganalisis beban tugas kuliahmu...",
      "🧭 Menyusun skala prioritas dengan Eisenhower Matrix...",
      "💡 Merancang strategi anti-prokrastinasi yang ramah...",
      "🧁 Mempersiapkan study planner yang pas buat energimu...",
      "✨ Meramu pesan motivasi pembakar semangat akademikmu..."
    ];
    let i = 0;
    setLoadingStep(statements[0]);
    const interval = setInterval(() => {
      i = (i + 1) % statements.length;
      setLoadingStep(statements[i]);
    }, 2800);
    return () => clearInterval(interval);
  }, [isLoading]);

  // Load state from localStorage on init
  useEffect(() => {
    const savedTasks = localStorage.getItem('coach_tasks');
    const savedResult = localStorage.getItem('coach_analysis');
    const savedChecked = localStorage.getItem('coach_checked_tasks');
    
    if (savedTasks) {
      try {
        setTasks(JSON.parse(savedTasks));
      } catch (e) {
        console.error(e);
      }
    } else {
      // Set some initial friendly starter tasks
      const starterTasks: Task[] = [
        { id: '1', nama: 'Makalah Komunikasi Massa tingkat lanjut', deadline: '2026-05-26', difficulty: 'High' },
        { id: '2', nama: 'Revisi Bab 1 Proposal Skripsi', deadline: '2026-05-30', difficulty: 'Medium' }
      ];
      setTasks(starterTasks);
      localStorage.setItem('coach_tasks', JSON.stringify(starterTasks));
    }

    if (savedResult) {
      try {
        setAnalysisResult(JSON.parse(savedResult));
      } catch (e) {
        console.error(e);
      }
    }
    
    if (savedChecked) {
      try {
        setCheckedTasks(JSON.parse(savedChecked));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Sync state helpers
  const saveTasksState = (newTasks: Task[]) => {
    setTasks(newTasks);
    localStorage.setItem('coach_tasks', JSON.stringify(newTasks));
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskName.trim()) return;

    const newTask: Task = {
      id: Date.now().toString(),
      nama: taskName.trim(),
      deadline: taskDeadline || new Date().toISOString().split('T')[0],
      difficulty: taskDifficulty
    };

    const updated = [...tasks, newTask];
    saveTasksState(updated);
    
    // Reset inputs
    setTaskName('');
    setTaskDeadline('');
    setTaskDifficulty('Medium');
  };

  const handleDeleteTask = (id: string) => {
    const updated = tasks.filter(t => t.id !== id);
    saveTasksState(updated);
    
    // Clear check state
    const updatedChecked = { ...checkedTasks };
    delete updatedChecked[id];
    setCheckedTasks(updatedChecked);
    localStorage.setItem('coach_checked_tasks', JSON.stringify(updatedChecked));
  };

  const toggleTaskCheck = (id: string) => {
    const updated = {
      ...checkedTasks,
      [id]: !checkedTasks[id]
    };
    setCheckedTasks(updated);
    localStorage.setItem('coach_checked_tasks', JSON.stringify(updated));
  };

  const handleResetAll = () => {
    if (window.confirm('Kamu yakin ingin mengosongkan asisten ini untuk sesi baru?')) {
      setTasks([]);
      setTaskName('');
      setTaskDeadline('');
      setEmotionalState('');
      setFocusLevel(5);
      setIsDailyReflection(false);
      setCustomText('');
      setAnalysisResult(null);
      setCheckedTasks({});
      localStorage.removeItem('coach_tasks');
      localStorage.removeItem('coach_analysis');
      localStorage.removeItem('coach_checked_tasks');
    }
  };

  // Preset Injector
  const injectPreset = (type: 'burnout' | 'skripsi' | 'fullSchedule') => {
    if (type === 'burnout') {
      const pTasks: Task[] = [
        { id: 'p1', nama: 'Persiapan Kuis Struktur Aljabar', deadline: '2026-05-25', difficulty: 'High' },
        { id: 'p2', nama: 'Kirim tugas resume sosiologi pembangunan', deadline: '2026-05-24', difficulty: 'Low' }
      ];
      saveTasksState(pTasks);
      setEmotionalState('Lelah / Burnout');
      setFocusLevel(2);
      setCustomText('Sudah 3 hari begadang ngerjain tugas kelompok, rasanya otak buntu dan gak bisa fokus belajar matematika.');
    } else if (type === 'skripsi') {
      const pTasks: Task[] = [
        { id: 'p3', nama: 'Revisi Metode Penelitian Bab 3', deadline: '2026-05-29', difficulty: 'High' },
        { id: 'p4', nama: 'Email dosen pembimbing untuk jadwal bimbingan', deadline: '2026-05-26', difficulty: 'Medium' }
      ];
      saveTasksState(pTasks);
      setEmotionalState('Bingung Mulai');
      setFocusLevel(4);
      setCustomText('Masukan dari reviewer bener-bener rombak total Bab 3, aku bingung metode analisis datanya salah terus di mana.');
    } else {
      const pTasks: Task[] = [
        { id: 'p5', nama: 'Kumpul praktikum pemrograman web', deadline: '2026-05-24', difficulty: 'High' },
        { id: 'p6', nama: 'Beli bahan maket arsitektur kelompok', deadline: '2026-05-25', difficulty: 'Low' },
        { id: 'p7', nama: 'Belajar ujian tengah semester Bahasa Inggris', deadline: '2026-05-27', difficulty: 'Medium' }
      ];
      saveTasksState(pTasks);
      setEmotionalState('Malas / Prokrastinasi');
      setFocusLevel(6);
      setCustomText('Banyak banget deadline berjejer di minggu ini, karena liat daftarnya malah pengen buka sosmed seharian.');
    }
  };

  // POST Request to backend
  const handleAnalyze = async () => {
    setIsLoading(true);
    setAnalysisResult(null);
    
    const localTimeString = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });
    
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          tasks,
          emotionalState,
          focusLevel,
          isDailyReflection,
          customText,
          currentLocalTime: localTimeString
        })
      });

      const data = await response.json();
      setAnalysisResult(data);
      localStorage.setItem('coach_analysis', JSON.stringify(data));
    } catch (error) {
      console.error(error);
      setAnalysisResult({
        error: "Waduh, koneksi ke asisten coach terputus. Pastikan server berjalan dan coba lagi ya!"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="app_root" className="min-h-screen bg-[#FAF7F2] pb-16 selection:bg-[#EBE2F9]">
      
      {/* Soft Pastel Accent Top Bar */}
      <div className="h-2 bg-gradient-to-r from-[#FCE6E2] via-[#FDF3DA] to-[#E2F5EC]" id="accent-top-bar"></div>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-4 pt-8" id="main_container">
        
        {/* Header App */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#EDE8DF]" id="app_header">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 text-xs rounded-full bg-[#EBE2F9] text-[#705096] font-semibold tracking-wider flex items-center gap-1">
                <Brain className="w-3.5 h-3.5" /> AI BEHAVIORAL COACH
              </span>
              <span className="px-3 py-1 text-xs rounded-full bg-[#E2F5EC] text-[#347A57] font-semibold tracking-wider flex items-center gap-1">
                🏡 Your Assistant
              </span>
            </div>
            <h1 className="text-3xl font-extrabold font-display tracking-tight text-[#2B2A27] flex items-center gap-2">
              Kaizen <span className="text-xl font-normal text-[#8A857D]">| Mentor Produktivitasmu</span>
            </h1>
            <p className="text-[#6E6B64] mt-1 text-sm md:text-md">
              Membantumu memecah burnout, memilah prioritas kuliah, & mengatasi kebiasaan menunda-nunda dengan bimbingan bersahabat.
            </p>
          </div>
          
          <div className="flex items-center gap-2 self-start md:self-center bg-white border border-[#EBE6DD] p-2 rounded-xl" id="date-widget">
            <Calendar className="w-4 h-4 text-[#8A857D]" />
            <div className="text-xs">
              <div className="font-semibold text-[#2B2A27]">Minggu, 24 Mei 2026</div>
              <div className="text-[#8A857D]">Waktu Akademik (WIB)</div>
            </div>
          </div>
        </header>

        {/* Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="grid_layout">
          
          {/* LEFT COLUMN: Input Panels */}
          <section className="lg:col-span-5 flex flex-col gap-6" id="input_panels">
            
            {/* Template Presets */}
            <div className="bg-white/85 backdrop-blur-sm p-4 rounded-2xl border border-[#EDE8DF] shadow-sm" id="preset_card">
              <h3 className="text-xs font-bold text-[#8A857D] uppercase tracking-wider mb-2.5 flex items-center gap-1">
                <Lightbulb className="w-3.5 h-3.5 text-[#E6AF2E]" /> Butuh Contoh Kasus? Klik Mock Skenario:
              </h3>
              <div className="grid grid-cols-3 gap-2 text-xs" id="preset_buttons">
                <button 
                  onClick={() => injectPreset('burnout')}
                  className="p-2 py-1.5 rounded-xl bg-[#FCE6E2] text-[#8C3A2E] hover:bg-[#FAD3CD] transition-colors text-left font-medium border border-[#F5C7C1]"
                  id="preset_burnout_btn"
                >
                  😫 Burnout UTS
                </button>
                <button 
                  onClick={() => injectPreset('skripsi')}
                  className="p-2 py-1.5 rounded-xl bg-[#EBE2F9] text-[#553675] hover:bg-[#DDD0F5] transition-colors text-left font-medium border border-[#D5C2F1]"
                  id="preset_skripsi_btn"
                >
                  📝 Bab Skripsi
                </button>
                <button 
                  onClick={() => injectPreset('fullSchedule')}
                  className="p-2 py-1.5 rounded-xl bg-[#E2F0FD] text-[#305E8E] hover:bg-[#C8E1FA] transition-colors text-left font-medium border border-[#B7D7FA]"
                  id="preset_schedule_btn"
                >
                  🏃 Menimbun Tugas
                </button>
              </div>
            </div>

            {/* Smart Study Task Input Block */}
            <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#EDE8DF] shadow-sm flex flex-col gap-4" id="task_manager_card">
              <div className="flex items-center justify-between pb-2 border-b border-[#FAF7F2]">
                <h2 className="font-bold text-lg font-display text-[#2B2A27] flex items-center gap-2">
                  <span className="w-2.5 h-6 rounded-full bg-[#EBE2F9]"></span>
                  1. Input Daftar Tugas Kuliah
                </h2>
                {tasks.length > 0 && (
                  <button 
                    onClick={() => saveTasksState([])}
                    className="text-xs text-[#C95240] hover:underline font-medium flex items-center gap-0.5"
                    id="clear_tasks_btn"
                  >
                    Kosongkan List
                  </button>
                )}
              </div>

              {/* Form Input */}
              <form onSubmit={handleAddTask} className="flex flex-col gap-3" id="add_task_form">
                <div>
                  <label className="block text-xs font-semibold text-[#8A857D] mb-1">Nama Tugas / Buku / Proyek</label>
                  <input 
                    type="text" 
                    value={taskName}
                    onChange={(e) => setTaskName(e.target.value)}
                    placeholder="Contoh: Belajar Bab Array & Object Pemrograman"
                    className="w-full p-2.5 rounded-xl border border-[#E1DCD3] bg-[#FCFAF5] focus:ring-2 focus:ring-[#C3ACDB] focus:outline-none text-sm"
                    id="input_task_name"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#8A857D] mb-1">Tenggat Waktu (Deadline)</label>
                    <input 
                      type="date" 
                      value={taskDeadline}
                      onChange={(e) => setTaskDeadline(e.target.value)}
                      className="w-full p-2 rounded-xl border border-[#E1DCD3] bg-[#FCFAF5] text-xs focus:ring-2 focus:ring-[#C3ACDB] focus:outline-none"
                      id="input_task_deadline"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#8A857D] mb-1">Tingkat Kesulitan</label>
                    <select 
                      value={taskDifficulty}
                      onChange={(e) => setTaskDifficulty(e.target.value as any)}
                      className="w-full p-2 rounded-xl border border-[#E1DCD3] bg-[#FCFAF5] text-xs focus:ring-2 focus:ring-[#C3ACDB] focus:outline-none"
                      id="input_task_difficulty"
                    >
                      <option value="Low">Rendah / Cepat</option>
                      <option value="Medium">Sedang / Menengah</option>
                      <option value="High">Tinggi / Kompleks</option>
                    </select>
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full py-2 bg-[#EBE2F9] text-[#553675] hover:bg-[#DFD4F6] font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 border border-[#DCD0F2]"
                  id="add_task_submit_btn"
                >
                  <Plus className="w-4 h-4" /> Tambah ke Checklist Saya
                </button>
              </form>

              {/* Tasks Checklist */}
              <div className="my-1" id="task_list_container">
                <span className="text-xs font-bold text-[#8A857D] block mb-2">Checklist Sesi Ini ({tasks.length} Tugas):</span>
                {tasks.length === 0 ? (
                  <div className="p-4 text-center rounded-xl bg-[#FAF7F2] border border-dashed border-[#E3DEC3] text-xs text-[#A8A49A]" id="empty_tasks_list">
                    Belum ada tugas dimasukkan. Isi form di atas atau klik salah satu skenario di atas! 😊
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 max-h-52 overflow-y-auto pr-1" id="scrollable_tasks">
                    {tasks.map((task) => {
                      const isChecked = !!checkedTasks[task.id];
                      return (
                        <div 
                          key={task.id} 
                          className={`flex items-start justify-between p-2.5 rounded-xl border transition-all ${
                            isChecked 
                              ? 'bg-[#E2F5EC]/50 border-[#C5EAD6] opacity-75' 
                              : 'bg-white border-[#EDE8DF] hover:border-[#D1CBBF]'
                          }`}
                          id={`task_row_${task.id}`}
                        >
                          <div className="flex items-start gap-2.5">
                            <input 
                              type="checkbox" 
                              checked={isChecked}
                              onChange={() => toggleTaskCheck(task.id)}
                              className="w-4 h-4 rounded-md accent-[#347A57] mt-0.5"
                              id={`checkbox_task_${task.id}`}
                            />
                            <div>
                              <p className={`text-sm font-medium ${isChecked ? 'line-through text-[#627C6C]' : 'text-[#2B2A27]'}`}>
                                {task.nama}
                              </p>
                              <div className="flex items-center gap-2 mt-1 text-[10px]">
                                <span className={`px-1.5 py-0.5 rounded font-semibold ${
                                  task.difficulty === 'High' ? 'bg-[#FCE6E2] text-[#A84232]' :
                                  task.difficulty === 'Medium' ? 'bg-[#FDF3DA] text-[#8C6D27]' :
                                  'bg-[#E2F0FD] text-[#3E6F92]'
                                }`}>
                                  Sulit: {task.difficulty}
                                </span>
                                <span className="text-[#8A857D] flex items-center gap-0.5">
                                  <Clock className="w-3 h-3" /> DL: {task.deadline}
                                </span>
                              </div>
                            </div>
                          </div>
                          <button 
                            onClick={() => handleDeleteTask(task.id)}
                            className="p-1 text-[#C95240] hover:bg-[#FCE6E2] rounded-lg transition-colors"
                            title="Hapus"
                            id={`delete_task_${task.id}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Emotional and Focus Check In Panel */}
            <div className="bg-white p-5 rounded-2xl border border-[#EDE8DF] shadow-sm flex flex-col gap-4" id="emotional_state_card">
              <h2 className="font-bold text-lg font-display text-[#2B2A27] flex items-center gap-2 pb-2 border-b border-[#FAF7F2]">
                <span className="w-2.5 h-6 rounded-full bg-[#E2F5EC]"></span>
                2. Fokus & Kondisi Emosional
              </h2>

              {/* Grid Quick Feel */}
              <div>
                <label className="block text-xs font-semibold text-[#8A857D] mb-1.5">Bagaimana perasaan akademikmu saat ini?</label>
                <div className="grid grid-cols-2 gap-2" id="feeling_grid">
                  {[
                    { val: 'Lelah / Burnout', emo: '😫 Lelah / Burnout', bg: 'hover:bg-[#FCE6E2] border-[#F5C7C1]', actBg: 'bg-[#FCE6E2] border-[#A84232] text-[#A84232]' },
                    { val: 'Malas / Prokrastinasi', emo: '😴 Menunda / Malas', bg: 'hover:bg-[#FDF3DA] border-[#F2DEAC]', actBg: 'bg-[#FDF3DA] border-[#8C6D27] text-[#8C6D27]' },
                    { val: 'Bingung Mulai', emo: '😵‍💫 Bingung Mulai', bg: 'hover:bg-[#EBE2F9] border-[#D1BEE8]', actBg: 'bg-[#EBE2F9] border-[#553675] text-[#553675]' },
                    { val: 'Fokus / Bersemangat', emo: '☀️ Fokus & Produktif', bg: 'hover:bg-[#E2F5EC] border-[#B9EAD0]', actBg: 'bg-[#E2F5EC] border-[#1C5D33] text-[#1C5D33]' }
                  ].map((item) => {
                    const isActive = emotionalState === item.val;
                    return (
                      <button
                        key={item.val}
                        type="button"
                        onClick={() => setEmotionalState(isActive ? '' : item.val)}
                        className={`p-2.5 text-xs text-left rounded-xl border font-medium transition-all ${
                          isActive ? item.actBg + ' scale-[1.02] shadow-sm' : 'bg-[#FCFAF5] border-[#E1DCD3] ' + item.bg
                        }`}
                        id={`feel_btn_${item.val.toLowerCase().replace(/[^a-z]/g, '')}`}
                      >
                        {item.emo}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Slider Focus Level */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-semibold text-[#8A857D]">Tingkat Fokus saat ini (1-10)</label>
                  <span className="px-2 py-0.5 rounded text-xs font-bold bg-[#E2F0FD] text-[#245D8F]" id="focus_level_label">
                     Level {focusLevel}
                  </span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="10" 
                  value={focusLevel}
                  onChange={(e) => setFocusLevel(Number(e.target.value))}
                  className="w-full h-2 rounded-lg bg-[#EBE6DD] accent-[#245D8F] cursor-pointer"
                  id="input_focus_slider"
                />
                <div className="flex justify-between text-[10px] text-[#A8A49A] mt-1">
                  <span>Sangat Drop / Kelelahan</span>
                  <span>Sangat Siap Tancap Gas</span>
                </div>
              </div>

              {/* Toggle Daily Reflection */}
              <div className="p-3 bg-gradient-to-r from-[#FAF3E2] to-[#FAF8ED] border border-[#ECDDB6] rounded-xl flex items-start gap-2.5">
                <input 
                  type="checkbox" 
                  checked={isDailyReflection}
                  onChange={(e) => setIsDailyReflection(e.target.checked)}
                  className="w-4 h-4 rounded mt-0.5 accent-[#8C6D27]"
                  id="checkbox_daily_reflection"
                />
                <div>
                  <label htmlFor="checkbox_daily_reflection" className="block text-xs font-bold text-[#6B5115] cursor-pointer">
                    Aktifkan Evaluasi & Refleksi Harian
                  </label>
                  <span className="text-[10px] text-[#8F743E] block mt-0.5 leading-relaxed">
                    Ceklis opsi ini jika kamu ingin menghitung Skor Produktivitas akademik harianmu (skala 1-10) beserta saran evaluasi malam hari.
                  </span>
                </div>
              </div>

              {/* Custom Complaints text area */}
              <div>
                <label className="block text-xs font-semibold text-[#8A857D] mb-1">Tambah curhatan atau keluhan psikologis belajarmu:</label>
                <textarea
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  placeholder="Ceritakan kendala, keluh kesah, atau mengapa kamu terus menunda pekerjaan ini..."
                  className="w-full p-2.5 rounded-xl border border-[#E1DCD3] bg-[#FCFAF5] focus:ring-2 focus:ring-[#C3ACDB] focus:outline-none text-xs h-16 resize-none"
                  id="input_custom_complaint"
                />
              </div>

              {/* CTA Action Buttons */}
              <div className="flex gap-2">
                <button 
                  onClick={handleResetAll}
                  className="px-3.5 py-3 rounded-xl border border-[#E1DCD3] bg-[#FCFAF5] hover:bg-[#F2EDE2] text-[#6E6B64] transition-all"
                  title="Reset Semua"
                  id="reset_session_btn"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleAnalyze}
                  disabled={isLoading}
                  className={`flex-1 py-3 px-4 font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 border text-sm ${
                    isLoading 
                      ? 'bg-[#EAE6DF] text-[#A09C94] border-[#DCD8D0] cursor-not-allowed'
                      : 'bg-gradient-to-r from-[#705096] to-[#553675] text-[#FAF7F2] hover:opacity-95 active:scale-[0.99] border-[#553675]'
                  }`}
                  id="start_analysis_btn"
                >
                  <Sparkles className="w-4 h-4 text-[#FDF3DA] fill-[#FDF3DA]" />
                  {isLoading ? 'Mengolah Rencana Aksi...' : 'Minta Analisis AI Coach ✨'}
                </button>
              </div>
            </div>

          </section>

          {/* RIGHT COLUMN: Output AI Panel */}
          <section className="lg:col-span-7" id="output_panel_container">
            
            {/* 1. STATE: LOADING SCREEN */}
            {isLoading && (
              <div className="bg-white rounded-3xl p-8 border border-[#EDE8DF] shadow-md flex flex-col items-center justify-center text-center py-20 min-h-[500px]" id="loading_screen">
                <div className="relative w-16 h-16 mb-6" id="spinner-container">
                  <div className="absolute inset-0 rounded-full border-4 border-t-[#C3ACDB] border-r-[#F6D0C9] border-b-[#EAE6DF] border-l-[#D2EBDE] animate-spin"></div>
                  <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
                    <Brain className="w-5 h-5 text-[#705096] animate-bounce" />
                  </div>
                </div>
                <h3 className="font-bold text-lg text-[#2B2A27] font-display mb-2">Coach Sedang Berpikir...</h3>
                <div className="px-6 py-2 bg-[#FAF7F2] border border-[#EDE8DF] rounded-full text-xs text-[#553675] font-semibold animate-pulse" id="loading_status_text">
                  {loadingStep}
                </div>
                <p className="text-xs text-[#A8A49A] mt-8 max-w-sm leading-relaxed">
                  Kami memproses kendala psikologismu dan membangun pemecahan waktu memakai metode Eisenhower & Coach Psikologi Belajar.
                </p>
              </div>
            )}

            {/* 2. STATE: EMPTY / INITIAL PLACEHOLDER */}
            {!isLoading && !analysisResult && (
              <div className="bg-white rounded-3xl p-8 border border-[#EDE8DF] shadow-sm flex flex-col items-center justify-center text-center py-16 min-h-[500px]" id="empty_placeholder">
                <div className="w-20 h-20 rounded-full bg-[#FCF4DD] text-[#8C6D27] flex items-center justify-center mb-6 border-4 border-[#FBF9F1] shadow-inner animate-pulse">
                  <User className="w-10 h-10" />
                </div>
                <h3 className="font-extrabold text-xl text-[#2B2A27] font-display mb-2">Selamat Datang di CampusMate!</h3>
                <p className="text-sm text-[#6E6B64] max-w-md leading-relaxed mb-6">
                  Kenalkan, ini adalah area analisis asisten produktivitas belajarmu. Tuliskan beban tugas kuliahmu, tentukan beban kesulitan, serta ceritakan burnout atau rasa malas yang kamu rasakan di panel samping.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-lg text-left" id="feature_highlights">
                  <div className="p-3.5 rounded-xl bg-[#FCE6E2] border border-[#FAD3CD] flex items-start gap-2.5">
                    <span className="text-xl">📊</span>
                    <div>
                      <h4 className="text-xs font-bold text-[#8C3A2E] mb-0.5">Prioritizer Eisenhower</h4>
                      <p className="text-[11px] text-[#A65B4F]">Tugaskan kategori Urgent vs Important secara otomatis agar kamu tak bingung memulai.</p>
                    </div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#E2F5EC] border border-[#B9EAD0] flex items-start gap-2.5">
                    <span className="text-xl">⏰</span>
                    <div>
                      <h4 className="text-xs font-bold text-[#1C5D33] mb-0.5">Smart Study Steps</h4>
                      <p className="text-[11px] text-[#297C47]">Alokasi jadwal belajar & jeda istirahat harian yang realistis, proporsional, dan sehat.</p>
                    </div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#EBE2F9] border border-[#D1BEE8] flex items-start gap-2.5">
                    <span className="text-xl">🧠</span>
                    <div>
                      <h4 className="text-xs font-bold text-[#553675] mb-0.5">Behavioral Anti-Stress</h4>
                      <p className="text-[11px] text-[#6E5092]">Instruksi spesifik (Aturan 5 Menit, Pomodoro) disesuaikan dengan mood harianmu.</p>
                    </div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#E2F0FD] border border-[#C6DCFD] flex items-start gap-2.5">
                    <span className="text-xl">🏆</span>
                    <div>
                      <h4 className="text-xs font-bold text-[#1F548A] mb-0.5">Daily Reflector Score</h4>
                      <p className="text-[11px] text-[#346EA8]">Catat evaluasi harianmu di sore/malam hari dan pantau skor produktivitas harianmu!</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 3. STATE: ERROR COMPILER DISPLAY */}
            {analysisResult && analysisResult.error && (
              <div className="bg-[#FCE6E2] border border-[#F5C7C1] rounded-3xl p-6 flex flex-col items-center justify-center text-center min-h-[400px]" id="error_display">
                <div className="w-14 h-14 rounded-full bg-white/75 text-[#C95240] flex items-center justify-center mb-4">
                  <AlertCircle className="w-8 h-8" />
                </div>
                <h3 className="font-extrabold text-[#8C3A2E] text-lg font-display mb-2">Pemberitahuan Asisten</h3>
                <p className="text-sm text-[#A84232] max-w-md leading-relaxed mb-6">
                  {analysisResult.error}
                </p>
                <div className="bg-white/60 p-4 rounded-xl border border-white text-xs text-[#2B2A27] text-left max-w-md">
                  <span className="font-bold flex items-center gap-1 text-[#553675] mb-1">
                     💡 Tips Cepat Mengatasinya:
                  </span>
                  <ul className="list-disc list-inside space-y-1 text-[#5E5C57]">
                    <li>Tambahkan minimal 1 tugas yang sedang kamu kerjakan saat ini.</li>
                    <li>Sebutkan ujian, tugas kelompok, atau laporan praktikum.</li>
                    <li>Ceritakan keluhan akademismu atau perasaan malasmu dengan lebih detail.</li>
                  </ul>
                </div>
              </div>
            )}

            {/* 4. STATE: SUCCESS AI ANALYZED COMPONENT */}
            {analysisResult && !analysisResult.error && (
              <div className="flex flex-col gap-6" id="analysis_result_dashboard">
                
                {/* Visual Coach Bio / status_analisis Header */}
                <div className="bg-white rounded-3xl border border-[#EDE8DF] shadow-sm overflow-hidden" id="summary_analysis_card">
                  {/* Avatar Banner */}
                  <div className="p-5 bg-gradient-to-r from-[#EBE2F9] via-[#FAF7F2] to-[#E2F5EC] flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#EDE8DF]" id="summary_banner">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-[#EBE2F9] border-2 border-white flex items-center justify-center text-xl shadow-sm">
                        🧸
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#705096]">COACH ANALYSIS</div>
                        <h4 className="font-extrabold text-[#2B2A27] font-display">Rencana Aksi & Produktivitasmu</h4>
                      </div>
                    </div>
                    {/* Date badge */}
                    <div className="px-3 py-1 bg-white/95 rounded-full border border-[#EDE8DF] text-[11px] font-bold text-[#6E6B64] flex items-center gap-1.5 self-start">
                      <Clock className="w-3.5 h-3.5 text-[#705096]" /> Tinjauan Khusus Mahasiswa
                    </div>
                  </div>

                  {/* status_analisis Content Text */}
                  <div className="p-6">
                    <div className="bg-[#FAF7F2] p-4.5 rounded-2xl border border-[#EDE8DF] relative">
                      <div className="absolute top-3 right-3 text-[#A8A49A] text-xs font-semibold flex items-center gap-0.5">
                        <Smile className="w-3.5 h-3.5 text-[#8A6D27]" /> Supportive Mentor
                      </div>
                      <h5 className="text-xs font-bold uppercase tracking-wider text-[#8A857D] mb-1">Analisis Coach Terhadap Kondisimu:</h5>
                      <p className="text-[#3E3D39] text-sm leading-relaxed whitespace-pre-wrap">
                        {analysisResult.status_analisis}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Overdue/Past Date Warning Banner (catatan_error) */}
                {analysisResult.catatan_error && (
                  <div className="bg-[#FDF3DA] border border-[#ECDDB6] p-4.5 rounded-2xl flex items-start gap-3" id="catatan_error_banner">
                    <AlertCircle className="w-5 h-5 text-[#8C6D27] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-extrabold text-[#6B5115] mb-0.5">Catatan Penting Deadline:</h4>
                      <p className="text-xs text-[#8F743E] leading-relaxed">
                        {analysisResult.catatan_error}
                      </p>
                    </div>
                  </div>
                )}

                {/* AI To-Do Prioritizer Grid (Using Eisenhower Mindset in Pastels) */}
                <div className="bg-white rounded-3xl p-6 border border-[#EDE8DF] shadow-sm flex flex-col gap-4" id="priority_matrix_section">
                  <h3 className="font-extrabold text-md font-display text-[#2B2A27] flex items-center gap-2">
                    <Target className="w-5 h-5 text-[#E6AF2E]" /> AI To-Do Prioritizer (Eisenhower Matrix)
                  </h3>
                  <p className="text-xs text-[#6E6B64] -mt-2 leading-relaxed">
                    Tugas kuliahmu dikelompokkan secara cerdas untuk menyelamatkanmu dari rasa cemas dan bingung yang memicu prokrastinasi.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-1" id="matrix_cards_grid">
                    
                    {/* HIGH PRIORITY */}
                    <div className="bg-[#FCE6E2] border border-[#FAD3CD] rounded-2xl p-4 flex flex-col gap-3" id="high_priority_box">
                      <div className="flex items-center justify-between pb-2 border-b border-[#F5C7C1]">
                        <span className="px-2.5 py-1 text-[10px] font-extrabold rounded bg-[#FEFAF9] text-[#A84232] flex items-center gap-0.5">
                          🔥 PRIORITAS TINGGI
                        </span>
                        <span className="text-[10px] text-[#A84232] font-semibold">Do First!</span>
                      </div>
                      <div className="flex flex-col gap-2 min-h-24">
                        {analysisResult.prioritas_tugas?.filter(t => t.skala_prioritas === 'Tinggi').length === 0 ? (
                          <div className="text-[11px] text-[#A84232]/60 italic text-center py-6">
                            Tidak ada tugas berprioritas tinggi di sesi ini. Bagus!
                          </div>
                        ) : (
                          analysisResult.prioritas_tugas?.filter(t => t.skala_prioritas === 'Tinggi').map((task, i) => (
                            <div key={i} className="bg-[#FFFDFB]/90 p-2.5 rounded-xl border border-[#F9DDD9] text-xs">
                              <p className="font-bold text-[#2B2A27]">{task.nama_tugas}</p>
                              <p className="text-[10px] text-[#91463C] mt-1 leading-relaxed bg-[#FFF2F0] p-1.5 rounded border border-[#F7E0DD]">
                                💡 <strong>Alasan:</strong> {task.alasan}
                              </p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* MEDIUM PRIORITY */}
                    <div className="bg-[#FDF3DA] border border-[#F2DEAC] rounded-2xl p-4 flex flex-col gap-3" id="medium_priority_box">
                      <div className="flex items-center justify-between pb-2 border-b border-[#EAD29C]">
                        <span className="px-2.5 py-1 text-[10px] font-extrabold rounded bg-[#FFFDF7] text-[#8C6D27] flex items-center gap-0.5">
                          ⏳ PRIORITAS SEDANG
                        </span>
                        <span className="text-[10px] text-[#8C6D27] font-semibold">Schedule!</span>
                      </div>
                      <div className="flex flex-col gap-2 min-h-24">
                        {analysisResult.prioritas_tugas?.filter(t => t.skala_prioritas === 'Sedang').length === 0 ? (
                          <div className="text-[11px] text-[#8C6D27]/60 italic text-center py-6">
                            Kosong. Atur jadwal secara bertahap jika ada tugas baru.
                          </div>
                        ) : (
                          analysisResult.prioritas_tugas?.filter(t => t.skala_prioritas === 'Sedang').map((task, i) => (
                            <div key={i} className="bg-[#FFFDF9]/90 p-2.5 rounded-xl border border-[#F5EAD2] text-xs">
                              <p className="font-bold text-[#2B2A27]">{task.nama_tugas}</p>
                              <p className="text-[10px] text-[#7A5B1D] mt-1 leading-relaxed bg-[#FAF5EB] p-1.5 rounded border border-[#EDE0CE]">
                                ⏳ <strong>Alasan:</strong> {task.alasan}
                              </p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* LOW PRIORITY */}
                    <div className="bg-[#EBE2F9] border border-[#DCD0F2] rounded-2xl p-4 flex flex-col gap-3" id="low_priority_box">
                      <div className="flex items-center justify-between pb-2 border-b border-[#D4C4EF]">
                        <span className="px-2.5 py-1 text-[10px] font-extrabold rounded bg-[#FAF7FD] text-[#553675] flex items-center gap-0.5">
                          🌈 PRIORITAS RENDAH
                        </span>
                        <span className="text-[10px] text-[#553675] font-semibold">Simplify!</span>
                      </div>
                      <div className="flex flex-col gap-2 min-h-24">
                        {analysisResult.prioritas_tugas?.filter(t => t.skala_prioritas === 'Rendah' || (t.skala_prioritas !== 'Tinggi' && t.skala_prioritas !== 'Sedang')).length === 0 ? (
                          <div className="text-[11px] text-[#553675]/60 italic text-center py-6">
                            Tidak ada tugas prioritas rendah di list.
                          </div>
                        ) : (
                          analysisResult.prioritas_tugas?.filter(t => t.skala_prioritas === 'Rendah' || (t.skala_prioritas !== 'Tinggi' && t.skala_prioritas !== 'Sedang')).map((task, i) => (
                            <div key={i} className="bg-[#FDFAFF]/90 p-2.5 rounded-xl border border-[#EBE3FA] text-xs">
                              <p className="font-bold text-[#2B2A27]">{task.nama_tugas}</p>
                              <p className="text-[10px] text-[#5D3F7D] mt-1 leading-relaxed bg-[#F5EEFB] p-1.5 rounded border border-[#E7DEFA]">
                                🪁 <strong>Alasan:</strong> {task.alasan}
                              </p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                  </div>
                </div>

                {/* Smart Study Planner Block */}
                <div className="bg-white rounded-3xl p-6 border border-[#EDE8DF] shadow-sm flex flex-col gap-4" id="timetable_section">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-xl bg-[#E2F0FD] text-[#245D8F]">
                      <Clock className="w-5 h-5" />
                    </span>
                    <div>
                      <h3 className="font-extrabold text-md font-display text-[#2B2A27]">
                        Smart Study Planner
                      </h3>
                      <p className="text-xs text-[#6E6B64] leading-relaxed">
                        Pembagian porsi waktu belajar dan jeda istirahat harian yang berimbang demi menjagamu dari burnout.
                      </p>
                    </div>
                  </div>

                  {/* Recommendations Table / Grid */}
                  <div className="mt-1 border border-[#EDE8DF] rounded-2xl overflow-hidden bg-[#FCFAF5]" id="timetable_content">
                    {analysisResult.jadwal_rekomendasi && analysisResult.jadwal_rekomendasi.length > 0 ? (
                      <div className="divide-y divide-[#EDE8DF]" id="timetable_list">
                        {analysisResult.jadwal_rekomendasi.map((schedule, i) => (
                          <div 
                            key={i} 
                            className="p-3.5 px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-white transition-colors"
                            id={`timetable_row_${i}`}
                          >
                            <div className="flex items-center gap-3">
                              <span className="w-7 h-7 rounded-full bg-[#E2F5EC] text-[#347A57] text-xs font-bold font-display flex items-center justify-center border border-[#B9EAD0]">
                                {i + 1}
                              </span>
                              <p className="text-sm font-semibold text-[#2B2A27]">
                                {schedule.aktivitas}
                              </p>
                            </div>
                            <span className="px-3 py-1 bg-[#E2F0FD] hover:bg-[#D5E6FA] text-[#245D8F] text-xs font-bold rounded-full tracking-wider self-start sm:self-center border border-[#C6DCFD]">
                              ⏱️ {schedule.waktu}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-6 text-center text-xs text-[#8A857D] italic">
                        Jadwal otomatis tidak dapat dimuat. Coba analisa ulang kembali tugas-tugasmu.
                      </div>
                    )}
                  </div>
                </div>

                {/* Anti-Procrastination Coach Strategy Speechbox */}
                <div className="bg-[#E2F5EC] border border-[#B9EAD0] p-6 rounded-3xl" id="anti_procrastination_section">
                  <div className="flex items-start gap-4" id="procrastination_balloon">
                    <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center border-4 border-[#B9EAD0] text-xl shadow-sm shrink-0">
                      🦉
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-extrabold text-sm text-[#1C5D33] font-display">Taktik Anti-Prokrastinasi Coach</h4>
                        <span className="px-2 py-0.5 rounded bg-white text-[10px] font-bold text-[#1C5D33] border border-[#B9EAD0]">
                          1-2 Strategi Fokus
                        </span>
                      </div>
                      <p className="text-xs text-[#2A653E] leading-relaxed whitespace-pre-wrap font-medium">
                        {analysisResult.strategi_anti_prokrastinasi}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Message Banner for Student / Motivasi sticker */}
                <div className="bg-gradient-to-r from-[#FAF7F2] via-[#FFFBF0] to-[#FAF7F2] p-5.5 rounded-2xl border border-[#EDE8DF] text-center shadow-sm relative overflow-hidden" id="motivation_sticker">
                  <div className="absolute -top-3 -left-3 text-2xl opacity-10">🎓</div>
                  <div className="absolute -bottom-3 -right-3 text-2xl opacity-10">🚀</div>
                  <span className="text-xs uppercase font-extrabold text-[#8C6D27] tracking-widest block mb-1">💌 PESAN SEMANGAT KAMPUS</span>
                  <p className="text-[#3E3D39] text-sm font-semibold italic">
                    "{analysisResult.pesan_semangat}"
                  </p>
                </div>

              </div>
            )}

          </section>

        </div>

      </div>

      {/* Styled Footer */}
      <footer className="max-w-6xl mx-auto px-4 mt-16 pt-6 border-t border-[#EDE8DF] text-center text-xs text-[#8A857D]" id="app_footer_container">
        <p className="mb-1 font-semibold text-[#6E6B64]">CampusMate Pastel Behavioral Assistant — Built for Students 🎓</p>
        <p>Membantu mengorganisasi prioritas menggunakan Eisenhower Grid, Pomodoro, dan Coach Motivasi secara real-time.</p>
      </footer>

    </div>
  );
}

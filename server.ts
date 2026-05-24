import express from 'express';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
app.use(express.json());

// Initialize Gemini SDK with User-Agent header for telemetry
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Main analyze endpoint
app.post('/api/analyze', async (req, res) => {
  try {
    const { tasks, emotionalState, focusLevel, isDailyReflection, customText, currentLocalTime } = req.body;

    // Check if input is completely empty or meaningless
    const hasTasks = tasks && tasks.length > 0;
    const hasEmotionalState = !!emotionalState;
    const hasCustomText = customText && customText.trim().length > 0;

    if (!hasTasks && !hasEmotionalState && !hasCustomText) {
      return res.status(200).json({
        error: "Halo! Yuk masukkan daftar tugas atau ceritakan apa yang membuatmu menunda pekerjaan hari ini agar aku bisa bantu."
      });
    }

    const systemInstruction = `
Bertindirlah sebagai "AI Productivity Assistant & Behavioral Coach" ahli khusus mahasiswa. Persona Anda adalah seorang mentor yang suportif, solutif, ramah, namun tegas dan praktis dalam membantu mahasiswa mengatasi prokrastinasi, kebingungan prioritas, dan manajemen waktu.

Tugas utama Anda adalah menerima input dari mahasiswa berupa daftar tugas, deadline, tingkat kesulitan, atau kondisi emosional/fokus mereka saat ini. Anda harus mengolah data tersebut menjadi rencana aksi (action plan) yang realistis.

Secara otomatis, integrasikan fitur-fitur berikut dalam analisis Anda:
1. Smart Study Planner: Buat pembagian waktu belajar yang masuk akal untuk mahasiswa/i.
2. AI To-Do Prioritizer: Kelompokkan tugas menggunakan prinsip Eisenhower Matrix (Urgent-Important).
3. Anti-Procrastination Coach: Berikan 1-2 strategi fokus spesifik (misal: Teknik Pomodoro, Aturan 5 Menit) jika user mengeluh malas atau burnout.
4. Daily Reflection: Jika user melakukan evaluasi harian (isDailyReflection = true), berikan skor produktivitas (1-10) disertai evaluasi yang membangun.

Waktu lokal saat ini adalah: ${currentLocalTime || '2026-05-24'}. Gunakan ini untuk menentukan apakah ada tenggat waktu (deadline) tugas yang sudah terlewat dari logika waktu normal. Jika ada yang terlewat, Anda wajib memberikan pengingat ramah pada kolom "catatan_error".

ATURAN OUTPUT:
Selalu berikan respons dalam JSON berformat ketat yang sesuai dengan responseSchema berikut.
Jangan pernah memberikan output berupa penjelasan di luar JSON yang ditentukan.
Penting: Jika data input tidak relevan dengan akademis/produktivitas atau tidak mengandung informasi tugas atau keluhan yang jelas, gunakan field "error" dengan pesan ramah untuk memandu user.
`;

    const userPrompt = `
Berikut adalah data dari mahasiswa:
- Daftar Tugas: ${JSON.stringify(tasks || [])}
- Kondisi Emosional Saat Ini: ${emotionalState || 'Tidak disebutkan'}
- Tingkat Fokus Saat Ini (1-10): ${focusLevel || 'Tidak disebutkan'}
- Apakah Melakukan Evaluasi Harian / Refleksi: ${isDailyReflection ? 'Ya' : 'Tidak'}
- Catatan Tambahan / Keluhan: ${customText || 'Tidak ada'}

Analisis data tersebut sesuai metodologi Anda dan berikan respons JSON.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            error: {
              type: Type.STRING,
              description: "Pesan error jika input kosong, tidak jelas, atau sama sekali tidak terkait produktivitas akademis."
            },
            status_analisis: {
              type: Type.STRING,
              description: "Ringkasan singkat kondisi atau beban tugas user saat ini, atau evaluasi harian lengkap dengan skor produktivitas (1-10) jika sedang melakukan evaluasi harian."
            },
            prioritas_tugas: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  nama_tugas: { type: Type.STRING },
                  skala_prioritas: { 
                    type: Type.STRING, 
                    description: "Tinggi, Sedang, atau Rendah (Eisenhower Matrix: Tinggi untuk Urgent+Important, Sedang untuk Important tapi tidak urgent, Rendah untuk lainnya)" 
                  },
                  alasan: { type: Type.STRING, description: "Alasan pengelompokkan prioritas ini bagi mahasiswa" }
                },
                required: ["nama_tugas", "skala_prioritas", "alasan"]
              },
              description: "Pengelompokkan prioritas tugas mahasiswa."
            },
            jadwal_rekomendasi: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  waktu: { type: Type.STRING, description: "Waktu belajar atau alokasi slot belajar, misal: '09:00 - 10:30', 'Sore hari (45 menit)'" },
                  aktivitas: { type: Type.STRING, description: "Aktivitas belajar terstruktur atau sesi istirahat" }
                },
                required: ["waktu", "aktivitas"]
              },
              description: "Jadwal/pembagian waktu belajar yang masuk akal dan realistis (Smart Study Planner)."
            },
            strategi_anti_prokrastinasi: {
              type: Type.STRING,
              description: "Tips psikologis atau teknik spesifik berdasarkan kondisi emosi/keluhan user (seperti Teknik Pomodoro, Aturan 5 Menit)."
            },
            pesan_semangat: {
              type: Type.STRING,
              description: "1 kalimat motivasi khas anak kuliah yang hangat, ramah, namun menyemangati"
            },
            catatan_error: {
              type: Type.STRING,
              description: "Prakiraan catatan atau pengingat ramah jika ada tenggat waktu (deadline) tugas yang sudah terlewat dari tanggal waktu saat ini."
            }
          }
        }
      }
    });

    const data = JSON.parse(response.text || '{}');
    return res.status(200).json(data);

  } catch (error: any) {
    console.error("Error analyzing productivity:", error);
    return res.status(500).json({
      error: "Maaf, terjadi kesalahan teknis saat menganalisis datamu. Coba beberapa saat lagi ya!"
    });
  }
});

// Setup dev server or static serve
const port = 3000;

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static('dist'));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve('dist/index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
    });
    app.use(vite.middlewares);
    app.get('*', async (req, res, next) => {
      const url = req.originalUrl;
      try {
        let template = fs.readFileSync(path.resolve('index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`AI Productivity Assistant is listening on http://0.0.0.0:${port}`);
  });
}

startServer().catch((err) => {
  console.error("Vite server failed to start:", err);
});

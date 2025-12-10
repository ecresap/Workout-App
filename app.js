/**
 * StrengthOS - Complete Mobile PWA v30
 * Updates: Layout Rescue, Cache Busting, SVG Nav Fixes
 */

const STORAGE_KEY = 'strengthOS_data_v2';
const DRAFT_KEY = 'strengthOS_active_draft';
const APP_VERSION = 'v30.0';

// --- ICONS ---
const Icons = {
    home: `<svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>`,
    workout: `<svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><line x1="12" y1="4" x2="12" y2="20"></line><line x1="4" y1="12" x2="20" y2="12"></line></svg>`,
    library: `<svg viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>`,
    guide: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`,
    settings: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>`,
    refresh: `<svg viewBox="0 0 24 24"><polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>`
};

// --- EXERCISE DATA (Same as v29) ---
const DEFAULT_EXERCISES = [
    { id: 'db_bench', name: 'DB Chest Press', muscle: 'chest', pattern: 'push_horiz', type: 'dumbbell', joint: 'shoulder' },
    { id: 'db_incline', name: 'Incline DB Press', muscle: 'chest', pattern: 'push_horiz', type: 'dumbbell', joint: 'shoulder' },
    { id: 'db_fly', name: 'DB Chest Fly', muscle: 'chest', pattern: 'iso_chest', type: 'dumbbell', joint: 'shoulder' },
    { id: 'pushup', name: 'Pushups', muscle: 'chest', pattern: 'push_horiz', type: 'bodyweight', joint: 'wrist' },
    { id: 'db_row', name: 'One-Arm DB Row', muscle: 'back', pattern: 'pull_horiz', type: 'dumbbell', joint: 'low_back' },
    { id: 'renegade_row', name: 'Renegade Row', muscle: 'back', pattern: 'pull_horiz', type: 'dumbbell', joint: 'wrist' },
    { id: 'db_pullover', name: 'DB Pullover', muscle: 'back', pattern: 'pull_vert', type: 'dumbbell', joint: 'shoulder' },
    { id: 'pullup', name: 'Pull-Ups (or Assisted)', muscle: 'back', pattern: 'pull_vert', type: 'bodyweight', joint: 'shoulder' },
    { id: 'ohp', name: 'DB Overhead Press', muscle: 'shoulders', pattern: 'push_vert', type: 'dumbbell', joint: 'shoulder' },
    { id: 'arnold', name: 'Arnold Press', muscle: 'shoulders', pattern: 'push_vert', type: 'dumbbell', joint: 'shoulder' },
    { id: 'lat_raise', name: 'DB Lateral Raise', muscle: 'shoulders', pattern: 'iso_lat', type: 'dumbbell', joint: 'shoulder' },
    { id: 'rear_fly', name: 'Rear Delt Fly', muscle: 'shoulders', pattern: 'iso_rear', type: 'dumbbell', joint: 'shoulder' },
    { id: 'goblet', name: 'Goblet Squat', muscle: 'quads', pattern: 'squat', type: 'dumbbell', joint: 'knee' },
    { id: 'split_squat', name: 'Bulgarian Split Squat', muscle: 'quads', pattern: 'lunge', type: 'dumbbell', joint: 'knee' },
    { id: 'step_up', name: 'DB Step Ups', muscle: 'quads', pattern: 'lunge', type: 'dumbbell', joint: 'knee' },
    { id: 'rdl', name: 'DB RDL', muscle: 'hamstrings', pattern: 'hinge', type: 'dumbbell', joint: 'low_back' },
    { id: 'glute_bridge', name: 'Glute Bridge', muscle: 'glutes', pattern: 'hinge', type: 'bodyweight', joint: 'low_back' },
    { id: 'calf_raise', name: 'DB Calf Raise', muscle: 'calves', pattern: 'iso_calf', type: 'dumbbell', joint: 'ankle' },
    { id: 'db_curl', name: 'Standing DB Curl', muscle: 'biceps', pattern: 'pull_iso', type: 'dumbbell', joint: 'wrist' },
    { id: 'hammer', name: 'Hammer Curl', muscle: 'biceps', pattern: 'pull_iso', type: 'dumbbell', joint: 'wrist' },
    { id: 'incline_curl', name: 'Incline DB Curl', muscle: 'biceps', pattern: 'pull_iso', type: 'dumbbell', joint: 'shoulder' },
    { id: 'conc_curl', name: 'Concentration Curl', muscle: 'biceps', pattern: 'pull_iso', type: 'dumbbell', joint: 'elbow' },
    { id: 'skullcrusher', name: 'DB Skullcrushers', muscle: 'triceps', pattern: 'push_iso', type: 'dumbbell', joint: 'elbow' },
    { id: 'kickback', name: 'Tricep Kickbacks', muscle: 'triceps', pattern: 'push_iso', type: 'dumbbell', joint: 'elbow' },
    { id: 'bench_dip', name: 'Bench Dips', muscle: 'triceps', pattern: 'push_iso', type: 'bodyweight', joint: 'shoulder' },
    { id: 'plank', name: 'Plank', muscle: 'core', pattern: 'iso_core', type: 'bodyweight', joint: 'shoulder' },
    { id: 'russian', name: 'Russian Twist', muscle: 'core', pattern: 'iso_core', type: 'dumbbell', joint: 'low_back' },
    { id: 'leg_raise', name: 'Leg Raises', muscle: 'core', pattern: 'iso_core', type: 'bodyweight', joint: 'hip' },
    { id: 'dead_bug', name: 'Dead Bugs', muscle: 'core', pattern: 'iso_core', type: 'bodyweight', joint: 'core' },
    { id: 'mtn_climber', name: 'Mountain Climbers', muscle: 'core', pattern: 'iso_core', type: 'bodyweight', joint: 'shoulder' },
    { id: 'bicycle', name: 'Bicycle Crunches', muscle: 'core', pattern: 'iso_core', type: 'bodyweight', joint: 'core' },
    { id: 'side_plank', name: 'Side Plank', muscle: 'core', pattern: 'iso_core', type: 'bodyweight', joint: 'shoulder' },
    { id: 'superman', name: 'Supermans', muscle: 'core', pattern: 'iso_core', type: 'bodyweight', joint: 'low_back' },
    { id: 'bird_dog', name: 'Bird Dogs', muscle: 'core', pattern: 'iso_core', type: 'bodyweight', joint: 'low_back' },
    { id: 'hollow_hold', name: 'Hollow Body Hold', muscle: 'core', pattern: 'iso_core', type: 'bodyweight', joint: 'core' },
    { id: 'flutter_kicks', name: 'Flutter Kicks', muscle: 'core', pattern: 'iso_core', type: 'bodyweight', joint: 'hip' },
    { id: 'reverse_snow', name: 'Rev. Snow Angels', muscle: 'core', pattern: 'iso_core', type: 'bodyweight', joint: 'shoulder' },
    { id: 'v_ups', name: 'V-Ups', muscle: 'core', pattern: 'iso_core', type: 'bodyweight', joint: 'core' }
];

const initialState = {
    profile: { age: 40, frequency: 3, emphasis: 'upper', wristPain: false },
    history: [],
    progression: {}, 
    activeExercises: {}, 
    exercises: DEFAULT_EXERCISES
};

const Store = {
    data: null,
    init() {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            this.data = JSON.parse(stored);
            if (!this.data.exercises || this.data.exercises.length < 40) {
                this.data.exercises = DEFAULT_EXERCISES; 
            }
            if (!this.data.activeExercises) this.data.activeExercises = {};
        } else {
            this.data = initialState;
            this.save();
        }
    },
    save() { localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data)); },
    logSession(session) { this.data.history.push(session); Coach.updateProgression(session); this.save(); localStorage.removeItem(DRAFT_KEY); },
    updateHistorySession(index, updatedSession) { this.data.history[index] = updatedSession; if (index === this.data.history.length - 1) Coach.updateProgression(updatedSession); this.save(); },
    deleteSession(index) { this.data.history.splice(index, 1); this.save(); },
    saveDraft(planData) { localStorage.setItem(DRAFT_KEY, JSON.stringify(planData)); },
    getDraft() { const d = localStorage.getItem(DRAFT_KEY); return d ? JSON.parse(d) : null; }
};

const Coach = {
    generateWeeklyFocus() {
        const h = Store.data.history;
        const items = [];
        const last7 = h.filter(s => new Date(s.date) > new Date(Date.now() - 7*86400000));
        const freqTarget = Store.data.profile.frequency;
        const liftingSessions = last7.filter(s => s.type !== 'cardio' && s.type !== 'core').length;
        if (liftingSessions < freqTarget) { items.push("📅 Consistency: You missed a target session recently."); } 
        else { items.push("🔥 Streak: You are consistent! Keep this momentum."); }
        return items.slice(0, 1);
    },

    generateCalendarData() {
        const h = Store.data.history;
        const freq = Store.data.profile.frequency; 
        const patterns = { 2: [1, 4], 3: [1, 3, 5], 4: [1, 2, 4, 5], 5: [1, 2, 3, 4, 5] };
        const schedule = patterns[freq] || [1, 3, 5];
        const today = new Date();
        const dayOfWeek = today.getDay(); 
        const daysSinceLastMonday = dayOfWeek + 6; 
        const startDate = new Date(today);
        startDate.setDate(today.getDate() - daysSinceLastMonday);
        startDate.setHours(0,0,0,0);
        const calendarWeeks = [];
        
        for (let w = 0; w < 3; w++) {
            const weekDays = [];
            let weekLabel = w === 0 ? "Past Week" : (w === 1 ? "Current Week" : "Future Week");
            for (let d = 0; d < 7; d++) {
                const currentDate = new Date(startDate);
                currentDate.setDate(startDate.getDate() + (w * 7) + d);
                const dateStr = currentDate.toDateString();
                const isToday = dateStr === today.toDateString();
                const isPast = currentDate < today;
                const actual = h.find(s => new Date(s.date).toDateString() === dateStr);
                const dayNum = currentDate.getDay(); 
                const isScheduledDay = schedule.includes(dayNum);
                let status = 'rest';
                let label = ''; 
                if (actual) {
                    if (actual.type === 'cardio') { status = 'cardio'; label = 'C'; }
                    else if (actual.type === 'core') { status = 'core'; label = 'F'; }
                    else if (actual.type === 'upper') { status = 'done'; label = 'U'; }
                    else if (actual.type === 'lower') { status = 'done'; label = 'L'; }
                    else { status = 'done'; label = '✓'; }
                } else if (isScheduledDay) {
                    if (isPast && !isToday) status = 'missed';
                    else status = 'sched';
                }
                weekDays.push({ day: ['S','M','T','W','T','F','S'][dayNum], status: status, label: label, isToday: isToday });
            }
            calendarWeeks.push({ label: weekLabel, days: weekDays });
        }
        return calendarWeeks;
    },

    getExerciseName(id) { const ex = Store.data.exercises.find(e => e.id === id); return ex ? ex.name : 'Unknown Exercise'; },
    detectPlateau(exId) { const hist = Store.data.history.filter(h => h.exercises.some(e => e.id === exId)).slice(-3); if (hist.length < 3) return null; const efforts = hist.map(session => { const ex = session.exercises.find(e => e.id === exId); const bestSet = ex.sets.reduce((p, c) => (c.weight * c.reps > p.weight * p.reps) ? c : p, {weight:0, reps:0}); return { weight: bestSet.weight, reps: bestSet.reps }; }); const stalled = (efforts[2].weight <= efforts[1].weight && efforts[1].weight <= efforts[0].weight) && (efforts[2].reps <= efforts[1].reps && efforts[1].reps <= efforts[0].reps); return stalled ? "Plateau Detected" : null; },
    getHistoryString(exId) { const hist = Store.data.history; for (let i = hist.length - 1; i >= 0; i--) { const exData = hist[i].exercises.find(e => e.id === exId); if (exData && exData.sets && exData.sets.length > 0) { const weight = exData.sets[0].weight; const repsStr = exData.sets.map(s => s.reps).join(' x '); return `Last: ${weight}lbs x ${repsStr}`; } } return "New Exercise"; },
    getChartData(exId) { return Store.data.history.map(s => { const ex = s.exercises.find(e => e.id === exId); if (!ex) return null; const best = ex.sets.reduce((p, c) => (c.weight * c.reps > p.weight * p.reps) ? c : p, {weight:0, reps:0}); const e1rm = best.weight * (1 + (best.reps / 30)); return { date: s.date, val: Math.round(e1rm) }; }).filter(x => x !== null).slice(-10); },
    getAllExercisesGrouped() { const groups = { 'Chest': [], 'Back': [], 'Shoulders': [], 'Legs': [], 'Arms': [], 'Core': [] }; const getGroup = (m) => { if (['chest'].includes(m)) return 'Chest'; if (['back'].includes(m)) return 'Back'; if (['shoulders'].includes(m)) return 'Shoulders'; if (['quads','hamstrings','glutes','calves'].includes(m)) return 'Legs'; if (['biceps','triceps'].includes(m)) return 'Arms'; return 'Core'; }; Store.data.exercises.forEach(ex => { if (!Store.data.profile.wristPain || ex.joint !== 'wrist') { const g = getGroup(ex.muscle); groups[g].push(ex); } }); return groups; },
    getAlternatives(exId) { const current = Store.data.exercises.find(e => e.id === exId); if(!current) return []; return Store.data.exercises.filter(e => e.muscle === current.muscle && e.id !== exId && (!Store.data.profile.wristPain || e.joint !== 'wrist')); },
    
    generateWorkout(forcedType = null, readinessScore = 5) {
        const { frequency, wristPain } = Store.data.profile;
        let type = forcedType || 'full';
        const sessionCount = Store.data.history.length;
        const isDeload = (sessionCount > 0 && sessionCount % 18 === 0);
        let muscles = [];
        if (type === 'upper') muscles = ['chest', 'back', 'shoulders', 'biceps', 'triceps', 'core'];
        if (type === 'lower') muscles = ['quads', 'hamstrings', 'glutes', 'calves', 'core'];
        if (type === 'full') muscles = ['chest', 'back', 'quads', 'hamstrings', 'shoulders'];

        let selected = [];
        muscles.forEach(m => {
            let exId = Store.data.activeExercises[m];
            let ex = Store.data.exercises.find(e => e.id === exId);
            if (!ex || (wristPain && ex.joint === 'wrist')) {
                const pool = Store.data.exercises.filter(e => e.muscle === m && (!wristPain || e.joint !== 'wrist'));
                if (pool.length > 0) { ex = pool[Math.floor(Math.random() * pool.length)]; Store.data.activeExercises[m] = ex.id; }
            }
            if (ex) selected.push(ex);
        });
        Store.save();
        let setVolume = 3; if (readinessScore <= 3) setVolume = 2; if (isDeload) setVolume = 2;
        return { type: type, isDeload: isDeload, exercises: selected.map(ex => { const prog = Store.data.progression[ex.id] || { weight: 10, nextReps: '8-12' }; const workingWeight = isDeload ? Math.round(prog.weight * 0.7) : prog.weight; const plateauMsg = this.detectPlateau(ex.id); return { ...ex, targetWeight: workingWeight, targetReps: prog.nextReps, sets: setVolume, note: plateauMsg }; }) };
    },

    generateCoreWorkout() {
        const coreEx = Store.data.exercises.filter(e => e.muscle === 'core');
        const shuffled = coreEx.sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 5);
        return selected.map(ex => ({ ...ex, targetWeight: 0, targetReps: '45 sec', sets: 2, note: 'Circuit Mode' }));
    },

    updateProgression(session) {
        if (session.type === 'cardio' || session.type === 'core') return;
        session.exercises.forEach(res => {
            const lastSet = res.sets[res.sets.length - 1];
            const actualWeight = lastSet.weight || 0;
            const reps = lastSet.reps || 0;
            let newWeight = actualWeight;
            if (reps >= 10 && lastSet.rir >= 3) {
                const smallMuscles = ['biceps', 'triceps', 'shoulders', 'calves', 'core'];
                const exDef = Store.data.exercises.find(e => e.id === res.id);
                const isSmall = exDef ? smallMuscles.includes(exDef.muscle) : false;
                if (res.type === 'dumbbell') { newWeight += isSmall ? 2.5 : 5; }
            }
            Store.data.progression[res.id] = { weight: newWeight, nextReps: '8-12' };
        });
    }
};

const UI = {
    timerInterval: null, editingHistoryIndex: null, pendingWorkoutType: null,

    init() {
        this.container = document.getElementById('main-container');
        this.navBtns = document.querySelectorAll('.nav-btn');
        this.pageTitle = document.getElementById('page-title');
        
        const oldTimer = document.getElementById('timer-overlay'); const oldModal = document.getElementById('readiness-modal'); const oldSwap = document.getElementById('swap-modal'); const oldSummary = document.getElementById('summary-modal');
        if(oldTimer) oldTimer.remove(); if(oldModal) oldModal.remove(); if(oldSwap) oldSwap.remove(); if(oldSummary) oldSummary.remove();

        const timerHtml = `<div id="timer-overlay"><span id="timer-val">00:00</span> <div class="timer-close" onclick="UI.stopTimer()">X</div></div>`;
        const modalHtml = `<div id="readiness-modal" class="modal-overlay"><div class="modal-content"><h3>How do you feel?</h3><p style="color:#666; margin-bottom:20px;">The Coach will adjust volume.</p><div class="readiness-options"><button class="readiness-btn" onclick="UI.confirmReadiness(2)">😫<br><small>Tired</small></button><button class="readiness-btn" onclick="UI.confirmReadiness(3)">😐<br><small>Okay</small></button><button class="readiness-btn" onclick="UI.confirmReadiness(5)">💪<br><small>Great</small></button></div></div></div>`;
        const summaryHtml = `<div id="summary-modal" class="modal-overlay"><div class="modal-content"><div style="width:100%; display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;"><h3 id="summary-title" style="margin:0;">Workout</h3><div class="timer-close" style="background:#eee; color:#333;" onclick="document.getElementById('summary-modal').classList.remove('active')">X</div></div><div id="summary-list" class="session-summary-list"></div></div></div>`;
        const swapHtml = `<div id="swap-modal" class="modal-overlay"><div class="modal-content" style="text-align:left; padding:0; overflow:hidden; display:flex; flex-direction:column; max-height:80vh;"><div style="padding:15px; border-bottom:1px solid #eee; display:flex; justify-content:space-between; align-items:center;"><h3 style="margin:0; font-size:1.1rem;">Swap Exercise</h3><div class="timer-close" style="background:#eee; color:#333;" onclick="document.getElementById('swap-modal').classList.remove('active')">X</div></div><div id="swap-list-container" class="swap-list" style="overflow-y:auto;"></div></div></div>`;
        const footerHtml = `<div class="version-footer">StrengthOS ${APP_VERSION}</div>`;
        
        document.body.insertAdjacentHTML('beforeend', timerHtml + modalHtml + summaryHtml + swapHtml + footerHtml);

        this.navBtns.forEach(b => b.addEventListener('click', () => this.nav(b.dataset.target)));
        this.nav('dashboard');
        this.container.addEventListener('input', (e) => { if (this.currentMode === 'workout' && this.editingHistoryIndex === null) this.scrapeAndSaveDraft(); });
    },

    nav(view) {
        this.navBtns.forEach(b => b.classList.remove('active'));
        const btn = document.querySelector(`[data-target="${view}"]`);
        
        // --- NEW: INJECT SVG ICONS INTO NAV BUTTONS ---
        this.navBtns.forEach(b => {
             const key = b.dataset.target;
             const holder = b.querySelector('.icon-holder');
             if(holder) holder.innerHTML = Icons[key] || '';
        });

        if (btn) btn.classList.add('active');
        this.currentMode = view; this.editingHistoryIndex = null; this.container.innerHTML = '';
        if(view === 'dashboard') this.renderDash();
        if(view === 'workout') this.renderWorkoutIntro();
        if(view === 'exercises') this.renderLib();
        if(view === 'guide') this.renderGuide();
        if(view === 'settings') this.renderSettings();
    },

    renderDash() {
        this.pageTitle.innerText = 'Dashboard';
        const h = Store.data.history; const count = h.length;
        const lastUpIndex = h.map((s, i) => s.type === 'upper' ? i : -1).filter(i => i !== -1).pop();
        const lastLowIndex = h.map((s, i) => s.type === 'lower' ? i : -1).filter(i => i !== -1).pop();
        const lastUp = lastUpIndex !== undefined ? h[lastUpIndex] : null;
        const lastLow = lastLowIndex !== undefined ? h[lastLowIndex] : null;
        const formatDate = (d) => d ? new Date(d).toLocaleDateString() : '--';

        const goals = Coach.generateWeeklyFocus();
        const clipboardHtml = goals.map(text => `<div class="clipboard-item"><div class="check-circle" onclick="this.classList.toggle('checked')"></div><div>${text}</div></div>`).join('');
        
        const calData = Coach.generateCalendarData();
        const calHtml = calData.map(week => `
            <div class="cal-week"><div class="cal-title">${week.label}</div><div class="cal-days">${week.days.map(d => `<div class="cal-day ${d.isToday ? 'today' : ''}"><span>${d.day}</span><div class="cal-dot ${d.status}">${d.label || ''}</div></div>`).join('')}</div></div>`).join('');

        const last7Days = [...Array(7)].map((_, i) => { const d = new Date(); d.setDate(d.getDate() - (6 - i)); return d; });
        const bars = last7Days.map(date => { const dateString = date.toDateString(); const dayName = date.toLocaleDateString('en-US', { weekday: 'narrow' }); const trained = h.some(session => new Date(session.date).toDateString() === dateString); return `<div style="flex:1; display:flex; flex-direction:column; align-items:center; gap:5px;"><div style="width:100%; background:${trained ? 'var(--text-main)' : '#e2e8f0'}; height:${trained ? '100%' : '20%'}; border-radius:4px;"></div><span style="font-size:0.6rem; color:#888">${dayName}</span></div>`; }).join('');

        this.container.innerHTML = `
            <div class="card focus-card"><div class="clipboard-header">📋 Coach's Focus</div>${clipboardHtml}</div>
            <div class="card"><h2>Activity Calendar</h2><div class="cal-grid">${calHtml}</div></div>
            <div class="card"><h2>History</h2><div class="summary-grid"><div class="summary-box"><span class="summary-label">Last Upper</span><div class="summary-val clickable" onclick="UI.showSessionSummary(${lastUpIndex})">${formatDate(lastUp?.date)}</div></div><div class="summary-box"><span class="summary-label">Last Lower</span><div class="summary-val clickable" onclick="UI.showSessionSummary(${lastLowIndex})">${formatDate(lastLow?.date)}</div></div></div><p style="color:var(--text-muted)">Total Workouts: <strong>${count}</strong></p></div>`;
    },

    showSessionSummary(index) {
        if (index === undefined || index === -1) return;
        const s = Store.data.history[index];
        const title = document.getElementById('summary-title');
        const list = document.getElementById('summary-list');
        const modal = document.getElementById('summary-modal');
        title.innerText = `${s.type.toUpperCase()} - ${new Date(s.date).toLocaleDateString()}`;
        if (s.type === 'cardio') { list.innerHTML = `<div class="session-summary-item"><strong>Cardio Session</strong><span>Completed</span></div>`; }
        else if (s.type === 'core') { list.innerHTML = `<div class="session-summary-item"><strong>Core Workout</strong><span>Completed</span></div>`; }
        else { list.innerHTML = s.exercises.map(ex => { const name = Coach.getExerciseName(ex.id); const setsInfo = ex.sets.map(set => `${set.reps}`).join(' x '); const weight = ex.sets[0]?.weight || 0; return `<div class="session-summary-item"><strong>${name}</strong><span>${weight}lbs x ${setsInfo}</span></div>`; }).join(''); }
        modal.classList.add('active');
    },

    renderWorkoutIntro() {
        this.pageTitle.innerText = 'Workout';
        const draft = Store.getDraft();
        if (draft) { this.container.innerHTML = `<div class="card"><h2 style="color:var(--warning)">Paused Session</h2><p style="color:#666">Resume your workout from ${new Date(draft.startTime).toLocaleTimeString()}?</p><button class="btn-primary" onclick="UI.resumeSession()">Resume Workout</button><button class="btn-secondary" onclick="UI.clearDraft()">Discard</button></div>`; } 
        else { this.container.innerHTML = `
            <div style="text-align:center; margin-top:20px;">
                <button class="btn-primary" onclick="UI.triggerReadiness('upper')">${Icons.workout} Upper Body</button>
                <button class="btn-primary" onclick="UI.triggerReadiness('lower')">${Icons.workout} Lower Body</button>
                <div style="display:flex; gap:10px; margin-top:15px;">
                    <button class="btn-core" onclick="UI.triggerReadiness('core')">${Icons.fire} Core</button>
                    <button class="btn-cardio" onclick="UI.finishCardioSession()">${Icons.heart} Cardio</button>
                </div>
            </div>`; }
    },
    
    // ... (Remainder of functions are standard, re-included to ensure file completeness)
    finishCardioSession() { if(!confirm("Log Cardio Day?")) return; Store.logSession({ date: new Date().toISOString(), type: 'cardio', exercises: [] }); alert("Logged!"); this.nav('dashboard'); },
    clearDraft() { localStorage.removeItem(DRAFT_KEY); this.renderWorkoutIntro(); },
    resumeSession() { const d = Store.getDraft(); this.currentPlan = d.plan; this.currentStartTime = d.startTime; this.currentType = d.type; this.renderActiveSession(true); },
    triggerReadiness(type) { this.pendingWorkoutType = type; document.getElementById('readiness-modal').classList.add('active'); },
    confirmReadiness(score) { document.getElementById('readiness-modal').classList.remove('active'); this.startNewSession(this.pendingWorkoutType, score); },
    startNewSession(type, readiness) { 
        let g; if (type === 'core') { g = { exercises: Coach.generateCoreWorkout(), type: 'core', isDeload: false }; } else { g = Coach.generateWorkout(type, readiness); }
        this.currentPlan = g.exercises; this.currentType = g.type; this.isDeload = g.isDeload; this.currentStartTime = new Date().toISOString(); this.renderActiveSession(false);
    },
    renderActiveSession(isResumeOrEdit) {
        const isHistoryEdit = this.editingHistoryIndex !== null;
        let dataMap = {}; if (isResumeOrEdit && !isHistoryEdit) { const draft = Store.getDraft(); dataMap = draft?.inputs || {}; }
        let topHtml = this.isDeload ? `<div class="deload-banner">⚠️ Deload Week: Weights -30%</div>` : '';
        let dateHeader = isHistoryEdit ? `<div class="card" style="border:1px solid var(--warning);"><label>Editing Date:</label><input type="date" id="edit-date-input" value="${new Date(Store.data.history[this.editingHistoryIndex].date).toISOString().split('T')[0]}"></div>` : '';

        const exercisesHtml = this.currentPlan.map((ex, i) => {
            let weightVal = ex.targetWeight;
            if (isHistoryEdit) { if (ex.sets && ex.sets[0]) weightVal = ex.sets[0].weight; } else if (dataMap[`weight-${i}`]) { weightVal = dataMap[`weight-${i}`]; }
            const setRows = Array.from({length: ex.sets}, (_, k) => k + 1).map(s => {
                let repVal = '', rirVal = 2;
                if (isHistoryEdit) { const setObj = ex.sets[s-1]; if (setObj) { repVal = setObj.reps; rirVal = setObj.rir; } } else { repVal = dataMap[`reps-${i}-${s}`] || ''; rirVal = dataMap[`rir-${i}-${s}`] !== undefined ? dataMap[`rir-${i}-${s}`] : 2; }
                return `<div class="set-row"><span style="font-size:0.8rem; color:#8E8E93">Set ${s}</span><input type="number" placeholder="Reps" id="reps-${i}-${s}" value="${repVal}" ${!isHistoryEdit ? 'onchange="UI.scrapeAndSaveDraft()"' : ''} class="mono"><div class="rir-bar">${[0,1,2,3].map(r => `<div class="rir-chip ${rirVal == r ? 'selected' : ''}" onclick="UI.setRir(${i},${s},${r})">${r}${r==3?'+':''}</div>`).join('')}</div><input type="hidden" id="rir-${i}-${s}" value="${rirVal}"></div>`;
            }).join('');
            return `<div class="card" id="card-${i}">${!isHistoryEdit && !ex.isBonus ? `<div class="swap-btn" onclick="UI.swapExercise(${i})">${Icons.refresh}</div>` : ''}${ex.note ? `<div class="toast">${ex.note}</div>` : ''}<h3>${ex.name} ${ex.isBonus ? '(Bonus)' : ''}</h3><div class="history-text mono">${!isHistoryEdit ? Coach.getHistoryString(ex.id) : ''}</div><div class="weight-input-group"><label>Working Weight</label><input type="number" id="weight-${i}" value="${weightVal}" ${!isHistoryEdit ? 'onchange="UI.scrapeAndSaveDraft()"' : ''} class="mono"></div><p style="color:#8E8E93; font-size:0.8rem; margin-bottom:15px;">Target: ${ex.targetReps} reps</p>${setRows}</div>`;
        }).join('');
        
        let actionBtn = `<button class="btn-bonus" onclick="UI.addBonusExercise()">+ Bonus Exercise</button><br><button class="btn-primary" onclick="UI.finishSession()">Finish Workout</button>`;
        if (isHistoryEdit) actionBtn = `<button class="btn-primary" onclick="UI.saveEditedHistory()">Save Changes</button><button class="btn-secondary" onclick="UI.renderHistoryManager()">Cancel</button>`;
        this.container.innerHTML = `${topHtml}${dateHeader}${exercisesHtml}${actionBtn}`;
        window.scrollTo(0,0);
    },
    swapExercise(index) { this.scrapeAndSaveDraft(); const oldEx = this.currentPlan[index]; const allGrouped = Coach.getAllExercisesGrouped(); let listHtml = ''; for (const [group, exercises] of Object.entries(allGrouped)) { if (exercises.length > 0) { listHtml += `<div class="swap-header">${group}</div>` + exercises.map(ex => `<div class="swap-item" onclick="UI.selectSwap(${index}, '${ex.id}', '${oldEx.muscle}')"><div><strong>${ex.name}</strong></div><span class="swap-select-btn">Select</span></div>`).join(''); } } const modal = document.getElementById('swap-modal'); document.getElementById('swap-list-container').innerHTML = listHtml; modal.classList.add('active'); },
    selectSwap(index, newId, oldMuscle) { document.getElementById('swap-modal').classList.remove('active'); const newEx = Store.data.exercises.find(e => e.id === newId); if (newEx.muscle === oldMuscle) { Store.data.activeExercises[oldMuscle] = newId; Store.save(); } const prog = Store.data.progression[newId] || { weight: 10, nextReps: '8-12' }; this.currentPlan[index] = { ...newEx, targetWeight: prog.weight, targetReps: prog.nextReps, sets: 3, note: 'Swapped' }; this.renderActiveSession(true); },
    addBonusExercise() { this.scrapeAndSaveDraft(); const type = this.currentType; let validMuscles = type === 'upper' ? ['biceps', 'triceps', 'shoulders', 'chest'] : ['calves', 'glutes', 'quads', 'hamstrings']; const pool = Store.data.exercises.filter(e => validMuscles.includes(e.muscle)); if (pool.length > 0) { const randomEx = pool[Math.floor(Math.random() * pool.length)]; const newExObj = { ...randomEx, targetWeight: 10, targetReps: '10-15', sets: 2, note: 'Bonus Pump!', isBonus: true }; this.currentPlan.push(newExObj); this.renderActiveSession(true); } else { alert("No bonus exercises found."); } },
    setRir(exIdx, setNum, val) { document.querySelectorAll(`#card-${exIdx} input[id^="rir-${exIdx}-${setNum}"]`).forEach(el => el.value = val); const chips = document.querySelectorAll(`#card-${exIdx} .rir-bar`)[setNum-1].children; Array.from(chips).forEach(c => c.classList.remove('selected')); chips[val].classList.add('selected'); if (this.editingHistoryIndex === null) { this.scrapeAndSaveDraft(); this.startTimer(120); } },
    startTimer(seconds) { const overlay = document.getElementById('timer-overlay'); const display = document.getElementById('timer-val'); overlay.classList.add('active'); if (this.timerInterval) clearInterval(this.timerInterval); let rem = seconds; const tick = () => { const m = Math.floor(rem / 60).toString().padStart(2,'0'); const s = (rem % 60).toString().padStart(2,'0'); display.innerText = `${m}:${s}`; if (rem <= 0) { clearInterval(this.timerInterval); display.innerText = "Ready!"; if (navigator.vibrate) navigator.vibrate([200, 100, 200]); } rem--; }; tick(); this.timerInterval = setInterval(tick, 1000); },
    stopTimer() { clearInterval(this.timerInterval); document.getElementById('timer-overlay').classList.remove('active'); },
    scrapeAndSaveDraft() { const inputs = {}; document.querySelectorAll('input').forEach(inp => { if (inp.id) inputs[inp.id] = inp.value; }); Store.saveDraft({ startTime: this.currentStartTime, plan: this.currentPlan, type: this.currentType, inputs: inputs }); },
    pauseSession() { this.scrapeAndSaveDraft(); this.nav('workout'); },
    finishSession() { if(!confirm("Finish and save?")) return; const sessionExercises = this.currentPlan.filter(e => !e.isBonus).map((ex, i) => { const w = Number(document.getElementById(`weight-${i}`).value) || ex.targetWeight; const setsData = []; for(let s=1; s<=ex.sets; s++) { setsData.push({ reps: Number(document.getElementById(`reps-${i}-${s}`).value) || 0, rir: Number(document.getElementById(`rir-${i}-${s}`).value), weight: w }); } return { id: ex.id, type: ex.type, sets: setsData }; }); const results = { date: new Date().toISOString(), type: this.currentType, exercises: sessionExercises }; Store.logSession(results); this.stopTimer(); alert("Saved!"); this.nav('dashboard'); },
    renderLib() { this.pageTitle.innerText = 'Library'; const groups = { 'Chest': ['chest'], 'Back': ['back'], 'Shoulders': ['shoulders'], 'Legs': ['quads', 'hamstrings', 'glutes', 'calves', 'legs'], 'Arms': ['biceps', 'triceps', 'arms'], 'Core': ['core'] }; let html = '<p style="color:#666; font-size:0.9rem; margin-bottom:15px;">Tap an exercise to view progress.</p>'; for (const [category, muscles] of Object.entries(groups)) { const exercises = Store.data.exercises.filter(e => muscles.includes(e.muscle)); if (exercises.length > 0) { html += `<h3 class="lib-header">${category}</h3>` + exercises.map(e => `<div class="card clickable" onclick="UI.toggleChart(this, '${e.id}')"><div><strong>${e.name}</strong></div><div class="chart-container" id="chart-${e.id}"></div></div>`).join(''); } } this.container.innerHTML = html; },
    toggleChart(card, exId) { const container = card.querySelector('.chart-container'); if (card.classList.contains('expanded')) { card.classList.remove('expanded'); } else { document.querySelectorAll('.card.expanded').forEach(c => c.classList.remove('expanded')); card.classList.add('expanded'); this.renderChart(exId, container); } },
    renderChart(exId, container) { const data = Coach.getChartData(exId); if (data.length < 2) { container.innerHTML = '<p style="text-align:center; padding:40px; color:#8E8E93;">Keep training to see data.</p>'; return; } const h = 150, w = container.offsetWidth || 300; const vals = data.map(d => d.val); const min = Math.min(...vals) * 0.9; const max = Math.max(...vals) * 1.1; const range = max - min; const points = data.map((d, i) => `${(i / (data.length - 1)) * w},${h - ((d.val - min) / range) * h}`).join(' '); container.innerHTML = `<svg class="chart-svg" viewBox="0 0 ${w} ${h}"><polyline class="chart-line" points="${points}" />${data.map((d, i) => `<circle cx="${(i / (data.length - 1)) * w}" cy="${h - ((d.val - min) / range) * h}" r="4" class="chart-dot" />`).join('')}</svg>`; },
    renderSettings() { this.pageTitle.innerText = 'Settings'; const p = Store.data.profile; this.container.innerHTML = `<div class="card"><h2>Account</h2><button class="btn-secondary" onclick="UI.renderHistoryManager()">Manage History</button><br><button class="btn-secondary" onclick="UI.export()">Export JSON</button></div><div class="card"><h2>Profile</h2><label>Frequency (Days/Week)</label><select id="s-freq"><option value="2" ${p.frequency==2?'selected':''}>2</option><option value="3" ${p.frequency==3?'selected':''}>3</option><option value="4" ${p.frequency==4?'selected':''}>4</option></select><label>Emphasis</label><select id="s-emph"><option value="upper" ${p.emphasis=='upper'?'selected':''}>Upper Body</option><option value="lower" ${p.emphasis=='lower'?'selected':''}>Lower Body</option></select><button class="btn-primary" style="margin-top:15px" onclick="UI.saveSet()">Save</button></div>`; },
    renderHistoryManager() { this.pageTitle.innerText = 'History'; const recent = Store.data.history.map((h, i) => ({...h, origIndex: i})).reverse().slice(0, 3); const html = recent.map(item => `<div class="list-item"><div><strong>${new Date(item.date).toLocaleDateString()}</strong><br><small style="color:#8E8E93">${item.type.toUpperCase()}</small></div><div style="display:flex; gap:10px;"><button class="btn-secondary" style="padding:8px 12px; font-size:0.8rem;" onclick="UI.editWorkout(${item.origIndex})">Edit</button><button class="btn-secondary" style="padding:8px 12px; font-size:0.8rem; color:var(--danger); border-color:var(--danger);" onclick="UI.deleteHistory(${item.origIndex})">Delete</button></div></div>`).join(''); this.container.innerHTML = `<div class="card">${html}</div><button class="btn-secondary" onclick="UI.nav(\'settings\')">Back</button>`; },
    deleteHistory(index) { if(confirm("Delete this workout?")) { Store.deleteSession(index); this.renderHistoryManager(); }},
    editWorkout(index) { const s = Store.data.history[index]; this.editingHistoryIndex = index; this.currentPlan = s.exercises; this.currentType = s.type; this.renderActiveSession(true); },
    saveEditedHistory() { const index = this.editingHistoryIndex; if (index === null) return; const newDate = document.getElementById('edit-date-input').value ? new Date(document.getElementById('edit-date-input').value).toISOString() : Store.data.history[index].date; const updatedSession = { date: newDate, type: this.currentType, exercises: this.currentPlan.map((ex, i) => ({ id: ex.id, type: ex.type, sets: ex.sets.map((_, sIdx) => ({ reps: Number(document.getElementById(`reps-${i}-${sIdx+1}`).value) || 0, rir: Number(document.getElementById(`rir-${i}-${sIdx+1}`).value), weight: Number(document.getElementById(`weight-${i}`).value) || 0 })) })) }; Store.updateHistorySession(index, updatedSession); alert("Saved!"); this.nav('settings'); },
    saveSet() { Store.data.profile.frequency = Number(document.getElementById('s-freq').value); Store.data.profile.emphasis = document.getElementById('s-emph').value; Store.save(); alert("Saved!"); },
    export() { const data = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(Store.data)); const a = document.createElement('a'); a.href = data; a.download = 'strengthos_backup.json'; document.body.appendChild(a); a.click(); a.remove(); },
    renderGuide() { this.pageTitle.innerText = 'Guide'; this.container.innerHTML = `<div class="card"><div class="guide-block"><h3>${Icons.guide} Philosophy</h3><p>StrengthOS focuses on consistency and longevity. We use auto-regulation to keep you safe.</p></div><div class="guide-block"><h3>📈 Progression</h3><p>Weights only increase if you hit 10+ reps with an RIR of 3 (Easy). Otherwise, we maintain.</p></div></div>`; }
};

window.addEventListener('DOMContentLoaded', () => { Store.init(); UI.init(); });

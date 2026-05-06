/**
 * StrengthOS - Complete Mobile PWA v38
 * Updates: 4-Day Block Program Architecture, Native Myo-Reps
 */

const STORAGE_KEY = 'strengthOS_data_v3'; // Bumped DB to clean slate for new plan
const DRAFT_KEY = 'strengthOS_active_draft';
const APP_VERSION = 'v38.0';

// --- 1. EXERCISE LIBRARY (Adapted for 4-Day Plan) ---
const DEFAULT_EXERCISES = [
    { id: 'db_bench', name: 'Dumbbell Bench Press', muscle: 'chest' },
    { id: 'dead_bug', name: 'Dead Bug', muscle: 'core' },
    { id: 'db_incline', name: 'Incline Dumbbell Press', muscle: 'chest' },
    { id: 'plank', name: 'Plank', muscle: 'core' },
    { id: 'squeeze_press', name: 'Dumbbell Squeeze Press', muscle: 'chest' },
    { id: 'oh_tricep_ext', name: 'Overhead DB Triceps Ext.', muscle: 'triceps' },
    { id: 'cg_pushup', name: 'Close-Grip Push-Ups', muscle: 'triceps' },
    { id: 'one_arm_row', name: 'One-Arm DB Row', muscle: 'back' },
    { id: 'goblet_squat', name: 'Goblet Squat', muscle: 'legs' },
    { id: 'rear_delt_raise', name: 'Rear Delt Raise', muscle: 'shoulders' },
    { id: 'rev_lunge', name: 'Reverse Lunge', muscle: 'legs' },
    { id: 'db_curl', name: 'Dumbbell Curl', muscle: 'biceps' },
    { id: 'side_plank', name: 'Side Plank', muscle: 'core' },
    { id: 'sup_db_curl', name: 'Supinated DB Curl', muscle: 'biceps' },
    { id: 'hammer_curl', name: 'Hammer Curl', muscle: 'biceps' },
    { id: 'rev_crunch', name: 'Reverse Crunch', muscle: 'core' },
    { id: 'flat_db_press', name: 'Flat Dumbbell Press', muscle: 'chest' },
    { id: 'conc_curl', name: 'Concentration Curl', muscle: 'biceps' },
    { id: 'cg_db_press', name: 'Close-Grip DB Press', muscle: 'chest' },
    { id: 'db_skullcrusher', name: 'Dumbbell Skull Crusher', muscle: 'triceps' },
    { id: 'alt_db_curl', name: 'Alternating DB Curl', muscle: 'biceps' },
    { id: 'db_shoulder_press', name: 'Dumbbell Shoulder Press', muscle: 'shoulders' },
    { id: 'step_up', name: 'Step-Ups / Walking Lunges', muscle: 'legs' },
    { id: 'farmer_carry', name: 'Farmer Carry', muscle: 'core' },
    { id: 'bicycle', name: 'Bicycle Crunches', muscle: 'core' },
    { id: 'lat_raise', name: 'Lateral Raise', muscle: 'shoulders' },
    { id: 'tricep_ext', name: 'Triceps Kickback', muscle: 'triceps' }
];

// --- 2. THE 4-DAY BLOCK PLAN ---
const WORKOUT_PLANS = {
    day1: [
        { id: 'db_bench', block: 'A', role: 'A', sets: 4, targetReps: '6-10', mode: 'normal' },
        { id: 'dead_bug', block: 'A', role: 'B', sets: 4, targetReps: '8-12', mode: 'normal' },
        { id: 'db_incline', block: 'B', role: 'A', sets: 3, targetReps: '8-12', mode: 'normal' },
        { id: 'plank', block: 'B', role: 'B', sets: 3, targetReps: '30-60s', mode: 'normal' },
        { id: 'squeeze_press', block: 'C', role: 'A', sets: 5, targetReps: 'Myo-Reps', mode: 'myo' },
        { id: 'oh_tricep_ext', block: 'D', role: 'A', sets: 5, targetReps: 'Myo-Reps', mode: 'myo' },
        { id: 'cg_pushup', block: 'E', role: 'A', sets: 2, targetReps: 'Near Fail', mode: 'normal' }
    ],
    day2: [
        { id: 'one_arm_row', block: 'A', role: 'A', sets: 4, targetReps: '8-12', mode: 'normal' },
        { id: 'goblet_squat', block: 'A', role: 'B', sets: 4, targetReps: '15-25', mode: 'normal' },
        { id: 'rear_delt_raise', block: 'B', role: 'A', sets: 3, targetReps: '12-20', mode: 'normal' },
        { id: 'rev_lunge', block: 'B', role: 'B', sets: 3, targetReps: '12-20', mode: 'normal' },
        { id: 'db_curl', block: 'C', role: 'A', sets: 2, targetReps: '8-12', mode: 'normal' },
        { id: 'side_plank', block: 'C', role: 'B', sets: 3, targetReps: 'Hold', mode: 'normal' },
        { id: 'sup_db_curl', block: 'D', role: 'A', sets: 2, targetReps: '10-12', mode: 'normal' },
        { id: 'hammer_curl', block: 'E', role: 'A', sets: 5, targetReps: 'Myo-Reps', mode: 'myo' }
    ],
    day3: [
        { id: 'db_incline', block: 'A', role: 'A', sets: 4, targetReps: '8-12', mode: 'normal' },
        { id: 'rev_crunch', block: 'A', role: 'B', sets: 4, targetReps: '10-20', mode: 'normal' },
        { id: 'flat_db_press', block: 'B', role: 'A', sets: 3, targetReps: '8-12', mode: 'normal' },
        { id: 'conc_curl', block: 'B', role: 'B', sets: 2, targetReps: '10-15', mode: 'normal' },
        { id: 'cg_db_press', block: 'C', role: 'A', sets: 3, targetReps: '8-12', mode: 'normal' },
        { id: 'db_skullcrusher', block: 'D', role: 'A', sets: 5, targetReps: 'Myo-Reps', mode: 'myo' },
        { id: 'alt_db_curl', block: 'E', role: 'A', sets: 5, targetReps: 'Myo-Reps', mode: 'myo' }
    ],
    day4: [
        { id: 'db_shoulder_press', block: 'A', role: 'A', sets: 3, targetReps: '8-12', mode: 'normal' },
        { id: 'one_arm_row', block: 'A', role: 'B', sets: 3, targetReps: '10-15', mode: 'normal' },
        { id: 'rear_delt_raise', block: 'B', role: 'A', sets: 3, targetReps: '12-20', mode: 'normal' },
        { id: 'step_up', block: 'B', role: 'B', sets: 3, targetReps: '15-25', mode: 'normal' },
        { id: 'farmer_carry', block: 'C', role: 'A', sets: 4, targetReps: '30-60s', mode: 'normal' },
        { id: 'bicycle', block: 'C', role: 'B', sets: 3, targetReps: 'Max', mode: 'normal' },
        { id: 'lat_raise', block: 'D', role: 'A', sets: 5, targetReps: 'Myo-Reps', mode: 'myo' },
        { id: 'hammer_curl', block: 'E', role: 'A (Optional)', sets: 5, targetReps: 'Myo-Reps', mode: 'myo', isBonus: true },
        { id: 'tricep_ext', block: 'F', role: 'A (Optional)', sets: 5, targetReps: 'Myo-Reps', mode: 'myo', isBonus: true }
    ]
};

const initialState = {
    profile: { age: 40, frequency: 4, timerDuration: 60 },
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
            if (!this.data.exercises || this.data.exercises.length < 20) { this.data.exercises = DEFAULT_EXERCISES; }
            if (!this.data.activeExercises) this.data.activeExercises = {};
            if (!this.data.profile.timerDuration) this.data.profile.timerDuration = 60;
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
        const last7 = h.filter(s => new Date(s.date) > new Date(Date.now() - 7*86400000)).length;
        if (last7 < Store.data.profile.frequency) { return ["📅 Consistency: You missed a target session recently."]; } 
        return ["🔥 Streak: You are consistent! Keep this momentum."];
    },

    generateCalendarData() {
        const h = Store.data.history;
        const schedule = [1, 2, 4, 5]; // Mon, Tue, Thu, Fri (Standard 4-day)
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
                const isScheduledDay = schedule.includes(currentDate.getDay());
                
                let status = 'rest';
                let label = ''; 
                if (actual) {
                    if (actual.type === 'day1') { status = 'done'; label = 'D1'; }
                    else if (actual.type === 'day2') { status = 'done'; label = 'D2'; }
                    else if (actual.type === 'day3') { status = 'done'; label = 'D3'; }
                    else if (actual.type === 'day4') { status = 'done'; label = 'D4'; }
                    else { status = 'done'; label = '✓'; }
                } else if (isScheduledDay) {
                    if (isPast && !isToday) status = 'missed';
                    else status = 'sched';
                }
                weekDays.push({ day: ['S','M','T','W','T','F','S'][currentDate.getDay()], status: status, label: label, isToday: isToday });
            }
            calendarWeeks.push({ label: weekLabel, days: weekDays });
        }
        return calendarWeeks;
    },

    getExerciseName(id) { const ex = Store.data.exercises.find(e => e.id === id); return ex ? ex.name : 'Unknown Exercise'; },
    
    getHistoryString(exId) {
        const hist = Store.data.history;
        let found = [];
        for (let i = hist.length - 1; i >= 0; i--) {
            const exData = hist[i].exercises.find(e => e.id === exId);
            if (exData && exData.sets && exData.sets.length > 0) {
                const date = new Date(hist[i].date).toLocaleDateString(undefined, {month:'numeric', day:'numeric'});
                const weight = exData.sets[0].weight;
                const repsStr = exData.sets.map(s => s.reps).join(' x ');
                found.push(`${date}: ${weight}lbs x ${repsStr}`);
            }
            if (found.length >= 2) break;
        }
        return found.length > 0 ? found.join('<br>') : "New Exercise";
    },

    getAllExercisesGrouped() {
        const groups = { 'Chest': [], 'Back': [], 'Shoulders': [], 'Legs': [], 'Arms': [], 'Core': [] };
        const getGroup = (m) => {
            if (['chest'].includes(m)) return 'Chest';
            if (['back'].includes(m)) return 'Back';
            if (['shoulders'].includes(m)) return 'Shoulders';
            if (['legs','quads','hamstrings','glutes','calves'].includes(m)) return 'Legs';
            if (['biceps','triceps'].includes(m)) return 'Arms';
            return 'Core';
        };
        Store.data.exercises.forEach(ex => {
            const g = getGroup(ex.muscle);
            if (groups[g]) groups[g].push(ex);
        });
        return groups;
    },

    generateWorkout(dayType) {
        const plan = WORKOUT_PLANS[dayType];
        if(!plan) return { type: 'day1', exercises: [] };

        return {
            type: dayType,
            isDeload: false,
            exercises: plan.map(item => {
                // Check if user swapped this slot permanently
                const activeId = Store.data.activeExercises[`${dayType}-${item.block}-${item.role}`] || item.id;
                const exDef = Store.data.exercises.find(e => e.id === activeId) || Store.data.exercises.find(e => e.id === item.id);
                
                const prog = Store.data.progression[exDef.id] || { weight: 10 };
                return { 
                    ...exDef, 
                    ...item, // injects block, role, sets, targetReps, mode
                    id: exDef.id, 
                    targetWeight: prog.weight
                };
            }) 
        };
    },

    updateProgression(session) {
        session.exercises.forEach(res => {
            const actualWeight = res.sets[0]?.weight || 0;
            const mode = res.mode || 'normal';
            let newWeight = actualWeight;
            let shouldIncrease = false;

            if (mode === 'myo') {
                // MYO-REPS: Check Activation Set (Index 1)
                if (res.sets.length >= 2) {
                    const activationReps = res.sets[1].reps || 0;
                    if (activationReps >= 10) shouldIncrease = true;
                }
            } else {
                // NORMAL: Check if last set hit upper bound of target range and felt easy
                const lastSet = res.sets[res.sets.length - 1];
                const reps = lastSet?.reps || 0;
                const targetMatch = res.targetReps ? res.targetReps.match(/(\d+)/g) : null;
                let upperLimit = 10;
                if (targetMatch && targetMatch.length > 0) upperLimit = parseInt(targetMatch[targetMatch.length - 1]);
                
                if (reps >= upperLimit && lastSet.rir >= 3) shouldIncrease = true;
            }

            if (shouldIncrease) {
                const smallMuscles = ['biceps', 'triceps', 'shoulders', 'calves', 'core'];
                const exDef = Store.data.exercises.find(e => e.id === res.id);
                const isSmall = exDef ? smallMuscles.includes(exDef.muscle) : false;
                newWeight += isSmall ? 2.5 : 5;
            }
            Store.data.progression[res.id] = { weight: newWeight };
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
        const summaryHtml = `<div id="summary-modal" class="modal-overlay"><div class="modal-content"><div style="width:100%; display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;"><h3 id="summary-title" style="margin:0;">Workout</h3><div class="timer-close" style="background:#eee; color:#333;" onclick="document.getElementById('summary-modal').classList.remove('active')">X</div></div><div id="summary-list" class="session-summary-list"></div></div></div>`;
        const swapHtml = `<div id="swap-modal" class="modal-overlay"><div class="modal-content" style="text-align:left; padding:0; overflow:hidden; display:flex; flex-direction:column; max-height:80vh;"><div style="padding:15px; border-bottom:1px solid #eee; display:flex; justify-content:space-between; align-items:center;"><h3 style="margin:0; font-size:1.1rem;">Swap Exercise</h3><div class="timer-close" style="background:#eee; color:#333;" onclick="document.getElementById('swap-modal').classList.remove('active')">X</div></div><div id="swap-list-container" class="swap-list" style="overflow-y:auto;"></div></div></div>`;
        const footerHtml = `<div class="version-footer">StrengthOS ${APP_VERSION}</div>`;
        
        document.body.insertAdjacentHTML('beforeend', timerHtml + summaryHtml + swapHtml + footerHtml);

        this.navBtns.forEach(b => b.addEventListener('click', () => this.nav(b.dataset.target)));
        this.nav('dashboard');
        this.container.addEventListener('input', (e) => { if (this.currentMode === 'workout' && this.editingHistoryIndex === null) this.scrapeAndSaveDraft(); });
    },

    nav(view) {
        this.navBtns.forEach(b => b.classList.remove('active'));
        const btn = document.querySelector(`[data-target="${view}"]`);
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
        
        const lastD1 = h.map((s, i) => s.type === 'day1' ? i : -1).filter(i => i !== -1).pop();
        const lastD2 = h.map((s, i) => s.type === 'day2' ? i : -1).filter(i => i !== -1).pop();
        const lastD3 = h.map((s, i) => s.type === 'day3' ? i : -1).filter(i => i !== -1).pop();
        const lastD4 = h.map((s, i) => s.type === 'day4' ? i : -1).filter(i => i !== -1).pop();
        const formatDate = (idx) => idx !== undefined && h[idx] ? new Date(h[idx].date).toLocaleDateString() : '--';

        const goals = Coach.generateWeeklyFocus();
        const clipboardHtml = goals.map(text => `<div class="clipboard-item"><div class="clipboard-check" onclick="this.classList.toggle('checked')"></div><div>${text}</div></div>`).join('');
        
        const calData = Coach.generateCalendarData();
        const calHtml = calData.map(week => `
            <div class="cal-week"><div class="cal-title">${week.label}</div><div class="cal-days">${week.days.map(d => `<div class="cal-day ${d.isToday ? 'today' : ''}"><span>${d.day}</span><div class="cal-dot ${d.status}">${d.label || ''}</div></div>`).join('')}</div></div>`).join('');

        this.container.innerHTML = `
            <div class="card clipboard-card"><div class="clipboard-header">📋 Coach's Focus</div>${clipboardHtml}</div>
            <div class="card"><h2>Activity Calendar</h2><div class="calendar-wrapper">${calHtml}</div></div>
            <div class="card">
                <h2>History</h2>
                <div class="summary-grid">
                    <div class="summary-box"><div class="summary-label">Last Day 1</div><div class="summary-val clickable" onclick="UI.showSessionSummary(${lastD1})">${formatDate(lastD1)}</div></div>
                    <div class="summary-box"><div class="summary-label">Last Day 2</div><div class="summary-val clickable" onclick="UI.showSessionSummary(${lastD2})">${formatDate(lastD2)}</div></div>
                    <div class="summary-box"><div class="summary-label">Last Day 3</div><div class="summary-val clickable" onclick="UI.showSessionSummary(${lastD3})">${formatDate(lastD3)}</div></div>
                    <div class="summary-box"><div class="summary-label">Last Day 4</div><div class="summary-val clickable" onclick="UI.showSessionSummary(${lastD4})">${formatDate(lastD4)}</div></div>
                </div>
                <p style="color:var(--text-muted); text-align:center;">Total Workouts: <strong>${count}</strong></p>
            </div>
            <div style="text-align:center; color:#9ca3af; font-size:0.75rem; margin: 20px 0;">StrengthOS ${APP_VERSION}</div>`;
    },

    showSessionSummary(index) {
        if (index === undefined || index === -1) return;
        const s = Store.data.history[index];
        const list = document.getElementById('summary-list');
        document.getElementById('summary-title').innerText = `${s.type.toUpperCase()} - ${new Date(s.date).toLocaleDateString()}`;
        list.innerHTML = s.exercises.map(ex => { 
            const name = Coach.getExerciseName(ex.id); 
            const setsInfo = ex.sets.map(set => `${set.reps}`).join(' x '); 
            const weight = ex.sets[0]?.weight || 0; 
            return `<div class="session-summary-item"><strong>${name}</strong><span>${weight}lbs x ${setsInfo}</span></div>`; 
        }).join('');
        document.getElementById('summary-modal').classList.add('active');
    },

    renderWorkoutIntro() {
        this.pageTitle.innerText = 'Workout';
        const draft = Store.getDraft(); 
        if (draft) { 
            this.container.innerHTML = `<div style="padding:20px 0;"><div class="card" style="border: 2px solid var(--warning);"><h3>Paused Session Found</h3><p style="margin-bottom:10px; font-size:0.9rem;">From: ${new Date(draft.startTime).toLocaleString()}</p><button class="btn-primary" style="background:var(--warning)" onclick="UI.resumeSession()">Resume Workout</button><button class="btn-secondary" onclick="UI.clearDraft()">Discard</button></div></div>`; 
        } else { 
            this.container.innerHTML = `
            <div style="padding:20px 0;">
                <div class="card" style="text-align:center; padding: 30px 20px;">
                    <div style="font-size:3rem; margin-bottom:10px;">💪</div>
                    <button class="btn-primary" onclick="UI.startNewSession('day1')">Day 1: Chest + Tri + Core</button>
                    <button class="btn-primary" onclick="UI.startNewSession('day2')">Day 2: Back + Bi + Legs</button>
                    <button class="btn-primary" onclick="UI.startNewSession('day3')">Day 3: Chest + Arms Spec.</button>
                    <button class="btn-primary" onclick="UI.startNewSession('day4')">Day 4: Shoulders + Back</button>
                </div>
            </div>`; 
        }
    },

    clearDraft() { localStorage.removeItem(DRAFT_KEY); this.renderWorkoutIntro(); },
    resumeSession() { const d = Store.getDraft(); this.currentPlan = d.plan; this.currentStartTime = d.startTime; this.currentType = d.type; this.renderActiveSession(true); },
    
    startNewSession(type) { 
        if (Notification.permission === "default") Notification.requestPermission();
        const g = Coach.generateWorkout(type);
        this.currentPlan = g.exercises;
        this.currentType = g.type;
        this.isDeload = g.isDeload;
        this.currentStartTime = new Date().toISOString();
        this.renderActiveSession(false);
    },

    renderActiveSession(isResumeOrEdit) {
        const isHistoryEdit = this.editingHistoryIndex !== null;
        let dataMap = {}; if (isResumeOrEdit && !isHistoryEdit) { const draft = Store.getDraft(); dataMap = draft?.inputs || {}; }
        const legend = `<div class="rir-legend-box"><span class="rir-legend-title">RIR Scale</span>0 = Failure | 1 = Hard | 2 = Sweet Spot | 3+ = Easy</div>`;
        let dateHeader = isHistoryEdit ? `<div class="card" style="background:#fff3cd; border:1px solid #ffeeba;"><label style="font-size:0.8rem; font-weight:bold;">Editing Date:</label><input type="date" id="edit-date-input" value="${new Date(Store.data.history[this.editingHistoryIndex].date).toISOString().split('T')[0]}" style="margin-bottom:0;"></div>` : '';

        const exercisesHtml = this.currentPlan.map((ex, i) => {
            let weightVal = ex.targetWeight;
            if (isHistoryEdit) { if (ex.sets && ex.sets[0]) weightVal = ex.sets[0].weight; } else if (dataMap[`weight-${i}`]) { weightVal = dataMap[`weight-${i}`]; }
            
            const isMyo = ex.mode === 'myo';
            
            let badges = `<span class="block-badge">Block ${ex.block}</span>`;
            if (isMyo) badges += `<span class="myo-badge">⚡ Myo-Reps</span>`;

            let setRows = '';
            if (isMyo) {
                // Custom 5-set Myo structure
                const labels = ["Warm-up (12)", "Activation (10-15)", "Mini 1 (3-5)", "Mini 2 (3-5)", "Mini 3 (2-4)"];
                setRows = labels.map((label, sIdx) => {
                    const s = sIdx + 1;
                    let repVal = dataMap[`reps-${i}-${s}`] || '';
                    if (isHistoryEdit) { const setObj = ex.sets[s-1]; if (setObj) repVal = setObj.reps; }
                    
                    return `<div class="myo-set-row">
                        <span style="font-size:0.85rem; color:#888; font-weight:700;">${label}</span>
                        <input type="number" placeholder="Reps" id="reps-${i}-${s}" value="${repVal}" ${!isHistoryEdit ? 'onchange="UI.scrapeAndSaveDraft()"' : ''} style="margin:0; text-align:center;">
                        <input type="hidden" id="rir-${i}-${s}" value="0">
                    </div>`;
                }).join('');
            } else {
                // Standard RIR logic
                setRows = Array.from({length: ex.sets}, (_, k) => k + 1).map(s => {
                    let repVal = '', rirVal = 2;
                    if (isHistoryEdit) { const setObj = ex.sets[s-1]; if (setObj) { repVal = setObj.reps; rirVal = setObj.rir; } } else { repVal = dataMap[`reps-${i}-${s}`] || ''; rirVal = dataMap[`rir-${i}-${s}`] !== undefined ? dataMap[`rir-${i}-${s}`] : 2; }
                    
                    return `<div class="set-row">
                        <span style="font-size:0.8rem; color:#888">Set ${s}</span>
                        <input type="number" placeholder="Reps" id="reps-${i}-${s}" value="${repVal}" ${!isHistoryEdit ? 'onchange="UI.scrapeAndSaveDraft()"' : ''}>
                        <div class="rir-container">
                            <div class="rir-header-row"><span class="rir-label">F</span><span class="rir-label">H</span><span class="rir-label">SP</span><span class="rir-label">E</span></div>
                            <div class="rir-selector" id="rir-box-${i}-${s}">${[0,1,2,3].map(r => `<div class="rir-btn ${rirVal == r ? 'selected' : ''}" onclick="UI.setRir(${i},${s},${r})">${r}${r==3?'+':''}</div>`).join('')}</div>
                        </div>
                        <input type="hidden" id="rir-${i}-${s}" value="${rirVal}">
                    </div>`;
                }).join('');
            }

            return `<div class="card" id="card-${i}">
                ${!isHistoryEdit ? `<div class="swap-btn" onclick="UI.swapExercise(${i})">🔄</div>` : ''}
                <h3 style="margin-bottom:8px;">${badges} ${ex.name} ${ex.isBonus ? '<small style="color:#888; font-weight:normal;">(Optional)</small>' : ''}</h3>
                <div class="history-text">${!isHistoryEdit ? Coach.getHistoryString(ex.id) : ''}</div>
                <div class="weight-input-group"><label>Working Weight:</label><input type="number" id="weight-${i}" value="${weightVal}" ${!isHistoryEdit ? 'onchange="UI.scrapeAndSaveDraft()"' : ''}><span>lbs</span></div>
                <p style="color:var(--text-muted); font-size:0.85rem; margin-bottom:15px; font-weight:600;">Target: ${ex.targetReps}</p>
                ${setRows}
            </div>`;
        }).join('');
        
        let actionBtn = `<button class="btn-primary" onclick="UI.finishSession()">Finish Workout</button> <button class="btn-warning" onclick="UI.pauseSession()">Pause & Save</button>`;
        if (isHistoryEdit) actionBtn = `<button class="btn-primary" onclick="UI.saveEditedHistory()">Save Changes</button> <button class="btn-secondary" onclick="UI.renderHistoryManager()">Cancel</button>`;
        this.container.innerHTML = `${dateHeader}${legend}${exercisesHtml}${actionBtn}`;
        window.scrollTo(0,0);
    },

    swapExercise(index) { 
        this.scrapeAndSaveDraft(); 
        const oldEx = this.currentPlan[index]; 
        const allGrouped = Coach.getAllExercisesGrouped(); 
        let listHtml = ''; 
        for (const [group, exercises] of Object.entries(allGrouped)) { 
            if (exercises.length > 0) { 
                listHtml += `<div class="swap-header">${group}</div>` + exercises.map(ex => `<div class="swap-item" onclick="UI.selectSwap(${index}, '${ex.id}', '${oldEx.block}', '${oldEx.role}')"><div><strong>${ex.name}</strong></div><span class="swap-select-btn">Select</span></div>`).join(''); 
            } 
        } 
        const modal = document.getElementById('swap-modal'); 
        document.getElementById('swap-list-container').innerHTML = listHtml; 
        modal.classList.add('active'); 
    },
    
    selectSwap(index, newId, block, role) { 
        document.getElementById('swap-modal').classList.remove('active'); 
        const newEx = Store.data.exercises.find(e => e.id === newId); 
        Store.data.activeExercises[`${this.currentType}-${block}-${role}`] = newId; 
        Store.save(); 
        
        // Preserve block, role, and mode logic of the old slot
        const oldEx = this.currentPlan[index];
        const prog = Store.data.progression[newId] || { weight: 10 }; 
        this.currentPlan[index] = { 
            ...newEx, 
            block: oldEx.block, role: oldEx.role, sets: oldEx.sets, targetReps: oldEx.targetReps, mode: oldEx.mode, isBonus: oldEx.isBonus,
            targetWeight: prog.weight, note: 'Swapped' 
        }; 
        this.renderActiveSession(true); 
    },

    setRir(exIdx, setNum, val) { document.querySelectorAll(`#rir-box-${exIdx}-${setNum} .rir-btn`).forEach(b => b.classList.remove('selected')); document.querySelectorAll(`#rir-box-${exIdx}-${setNum} .rir-btn`)[val].classList.add('selected'); document.getElementById(`rir-${exIdx}-${setNum}`).value = val; if (this.editingHistoryIndex === null) { this.scrapeAndSaveDraft(); this.startTimer(Store.data.profile.timerDuration); } },
    startTimer(seconds) { const overlay = document.getElementById('timer-overlay'); const display = document.getElementById('timer-val'); overlay.classList.add('active'); if (this.timerInterval) clearInterval(this.timerInterval); let rem = seconds; const tick = () => { const m = Math.floor(rem / 60).toString().padStart(2,'0'); const s = (rem % 60).toString().padStart(2,'0'); display.innerText = `${m}:${s}`; if (rem <= 0) { clearInterval(this.timerInterval); display.innerText = "Ready!"; if (navigator.vibrate) navigator.vibrate([200, 100, 200]); if (Notification.permission === "granted") new Notification("🔔 Rest Finished!"); } rem--; }; tick(); this.timerInterval = setInterval(tick, 1000); },
    stopTimer() { clearInterval(this.timerInterval); document.getElementById('timer-overlay').classList.remove('active'); },
    scrapeAndSaveDraft() { const inputs = {}; document.querySelectorAll('input').forEach(inp => { if (inp.id) inputs[inp.id] = inp.value; }); Store.saveDraft({ startTime: this.currentStartTime, plan: this.currentPlan, type: this.currentType, inputs: inputs }); },
    pauseSession() { this.scrapeAndSaveDraft(); this.nav('workout'); },
    finishSession() { if(!confirm("Finish and save workout?")) return; const sessionExercises = this.currentPlan.filter(e => !e.isBonus || document.getElementById(`reps-${this.currentPlan.indexOf(e)}-1`)?.value).map((ex, i) => { const w = Number(document.getElementById(`weight-${i}`).value) || ex.targetWeight; const setsData = []; for(let s=1; s<=ex.sets; s++) { setsData.push({ reps: Number(document.getElementById(`reps-${i}-${s}`).value) || 0, rir: Number(document.getElementById(`rir-${i}-${s}`).value) || 0, weight: w }); } return { id: ex.id, type: ex.type, sets: setsData, mode: ex.mode || 'normal' }; }); const results = { date: new Date().toISOString(), type: this.currentType, exercises: sessionExercises }; Store.logSession(results); this.stopTimer(); alert("Great job!"); this.nav('dashboard'); },
    renderLib() { this.pageTitle.innerText = 'Exercise Library'; const groups = { 'Chest': ['chest'], 'Back': ['back'], 'Shoulders': ['shoulders'], 'Legs': ['legs','quads', 'hamstrings', 'glutes', 'calves'], 'Arms': ['biceps', 'triceps'], 'Core': ['core'] }; let html = '<p style="color:#666; font-size:0.9rem; margin-bottom:15px;">Tap an exercise to view progress.</p>'; for (const [category, muscles] of Object.entries(groups)) { const exercises = Store.data.exercises.filter(e => muscles.includes(e.muscle)); if (exercises.length > 0) { html += `<h3 class="lib-header">${category}</h3>` + exercises.map(e => `<div class="card clickable" onclick="UI.toggleChart(this, '${e.id}')"><div style="display:flex; justify-content:space-between;"><strong>${e.name}</strong><span style="font-size:0.7rem; background:#eee; padding:2px 6px; border-radius:4px;">${e.muscle}</span></div><div class="chart-container" id="chart-${e.id}"></div></div>`).join(''); } } this.container.innerHTML = html; },
    toggleChart(card, exId) { const container = card.querySelector('.chart-container'); if (card.classList.contains('expanded')) { card.classList.remove('expanded'); } else { document.querySelectorAll('.card.expanded').forEach(c => c.classList.remove('expanded')); card.classList.add('expanded'); this.renderChart(exId, container); } },
    renderChart(exId, container) { const data = Coach.getChartData(exId); if (data.length < 2) { container.innerHTML = '<p style="text-align:center; padding-top:40px; color:#888;">Not enough data yet.</p>'; return; } const h = 150, w = container.offsetWidth || 300; const vals = data.map(d => d.val); const min = Math.min(...vals) * 0.9; const max = Math.max(...vals) * 1.1; const range = max - min; const points = data.map((d, i) => `${(i / (data.length - 1)) * w},${h - ((d.val - min) / range) * h}`).join(' '); container.innerHTML = `<svg class="chart-svg" viewBox="0 0 ${w} ${h}"><polyline class="chart-line" points="${points}" />${data.map((d, i) => `<circle cx="${(i / (data.length - 1)) * w}" cy="${h - ((d.val - min) / range) * h}" r="4" class="chart-dot" /><text x="${(i / (data.length - 1)) * w}" y="${h - ((d.val - min) / range) * h - 10}" text-anchor="middle" class="chart-label">${d.val}</text>`).join('')}</svg>`; },
    renderSettings() { this.pageTitle.innerText = 'Settings'; const p = Store.data.profile; const timerVal = p.timerDuration || 60; this.container.innerHTML = `<div class="card"><h2>Account</h2><button class="btn-secondary" onclick="UI.renderHistoryManager()">Manage Recent History (Edit/Delete)</button></div><div class="card"><h2>Profile</h2><label>Frequency (Days/Week)</label><select id="s-freq"><option value="2" ${p.frequency==2?'selected':''}>2</option><option value="3" ${p.frequency==3?'selected':''}>3</option><option value="4" ${p.frequency==4?'selected':''}>4</option></select><label>Rest Timer (Seconds)</label><input type="number" id="s-timer" value="${timerVal}" style="margin-bottom:15px;"><button class="btn-primary" style="margin-top:15px" onclick="UI.saveSet()">Save Profile</button></div><div class="card"><button class="btn-secondary" onclick="UI.export()">Export Data</button></div>`; },
    renderHistoryManager() { this.pageTitle.innerText = 'History Manager'; const recent = Store.data.history.map((h, i) => ({...h, origIndex: i})).reverse().slice(0, 3); if (recent.length === 0) { this.container.innerHTML = '<div class="card"><p>No history found.</p><button class="btn-secondary" onclick="UI.nav(\'settings\')">Back</button></div>'; return; } const html = recent.map(item => `<div class="history-item"><div class="history-info"><strong>${new Date(item.date).toLocaleDateString()}</strong><span style="font-size:0.8rem; color:#666;">${item.type.toUpperCase()} • ${item.exercises.length} Exercises</span></div><div class="history-actions"><button class="btn-sm" onclick="UI.editWorkout(${item.origIndex})">Edit Workout</button><button class="btn-sm btn-danger" onclick="UI.deleteHistory(${item.origIndex})">Delete</button></div></div>`).join(''); this.container.innerHTML = `<div style="margin-bottom:20px;">${html}</div><button class="btn-secondary" onclick="UI.nav(\'settings\')">Back to Settings</button>`; },
    deleteHistory(index) { if(confirm("Are you sure?")) { Store.deleteSession(index); this.renderHistoryManager(); }},
    editWorkout(index) { const s = Store.data.history[index]; this.editingHistoryIndex = index; this.currentPlan = s.exercises; this.currentType = s.type; this.renderActiveSession(true); },
    saveEditedHistory() { const index = this.editingHistoryIndex; if (index === null) return; const newDate = document.getElementById('edit-date-input').value ? new Date(document.getElementById('edit-date-input').value).toISOString() : Store.data.history[index].date; const updatedSession = { date: newDate, type: this.currentType, exercises: this.currentPlan.map((ex, i) => ({ id: ex.id, type: ex.type, sets: ex.sets.map((_, sIdx) => ({ reps: Number(document.getElementById(`reps-${i}-${sIdx+1}`).value) || 0, rir: Number(document.getElementById(`rir-${i}-${sIdx+1}`).value), weight: Number(document.getElementById(`weight-${i}`).value) || 0 })) })) }; Store.updateHistorySession(index, updatedSession); alert("Updated!"); this.nav('settings'); },
    saveSet() { Store.data.profile.frequency = Number(document.getElementById('s-freq').value); Store.data.profile.timerDuration = Number(document.getElementById('s-timer').value) || 60; Store.save(); alert("Saved!"); },
    export() { const data = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(Store.data)); const a = document.createElement('a'); a.href = data; a.download = 'strengthos_backup.json'; document.body.appendChild(a); a.click(); a.remove(); },
    renderGuide() { this.pageTitle.innerText = 'Coach Logic'; this.container.innerHTML = `<div class="card"><div class="guide-block"><h3>🧠 Routine Format</h3><p>This is a strict 4-day block program. Perform Exercise A, then immediately Exercise B before resting.</p></div><div class="guide-block"><h3>⚡ Myo-Reps</h3><p>Perform the Warm-up. Then do the Activation set to failure. Rest 15 seconds, do a Mini set, rest 15s, etc. Weights only increase if you get 10+ reps on the Activation set.</p></div><div class="guide-block"><h3>📈 Progression</h3><p>For standard sets, weights increase if you hit the top end of the rep range AND rate the last set as Easy (RIR 3).</p></div></div>`; }
};

window.addEventListener('DOMContentLoaded', () => { Store.init(); UI.init(); });

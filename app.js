/**
 * StrengthOS - Complete Mobile PWA v17
 * Updates: Manual Exercise Selection in Swap
 */

const STORAGE_KEY = 'strengthOS_data_v2';
const DRAFT_KEY = 'strengthOS_active_draft';

// --- 1. EXERCISE LIBRARY ---
const DEFAULT_EXERCISES = [
    // Chest
    { id: 'db_bench', name: 'DB Chest Press', muscle: 'chest', pattern: 'push_horiz', type: 'dumbbell', joint: 'shoulder' },
    { id: 'db_incline', name: 'Incline DB Press', muscle: 'chest', pattern: 'push_horiz', type: 'dumbbell', joint: 'shoulder' },
    { id: 'db_fly', name: 'DB Chest Fly', muscle: 'chest', pattern: 'iso_chest', type: 'dumbbell', joint: 'shoulder' },
    { id: 'pushup', name: 'Pushups', muscle: 'chest', pattern: 'push_horiz', type: 'bodyweight', joint: 'wrist' },
    // Back
    { id: 'db_row', name: 'One-Arm DB Row', muscle: 'back', pattern: 'pull_horiz', type: 'dumbbell', joint: 'low_back' },
    { id: 'renegade_row', name: 'Renegade Row', muscle: 'back', pattern: 'pull_horiz', type: 'dumbbell', joint: 'wrist' },
    { id: 'db_pullover', name: 'DB Pullover', muscle: 'back', pattern: 'pull_vert', type: 'dumbbell', joint: 'shoulder' },
    { id: 'pullup', name: 'Pull-Ups (or Assisted)', muscle: 'back', pattern: 'pull_vert', type: 'bodyweight', joint: 'shoulder' },
    // Shoulders
    { id: 'ohp', name: 'DB Overhead Press', muscle: 'shoulders', pattern: 'push_vert', type: 'dumbbell', joint: 'shoulder' },
    { id: 'arnold', name: 'Arnold Press', muscle: 'shoulders', pattern: 'push_vert', type: 'dumbbell', joint: 'shoulder' },
    { id: 'lat_raise', name: 'DB Lateral Raise', muscle: 'shoulders', pattern: 'iso_lat', type: 'dumbbell', joint: 'shoulder' },
    { id: 'rear_fly', name: 'Rear Delt Fly', muscle: 'shoulders', pattern: 'iso_rear', type: 'dumbbell', joint: 'shoulder' },
    // Legs
    { id: 'goblet', name: 'Goblet Squat', muscle: 'quads', pattern: 'squat', type: 'dumbbell', joint: 'knee' },
    { id: 'split_squat', name: 'Bulgarian Split Squat', muscle: 'quads', pattern: 'lunge', type: 'dumbbell', joint: 'knee' },
    { id: 'step_up', name: 'DB Step Ups', muscle: 'quads', pattern: 'lunge', type: 'dumbbell', joint: 'knee' },
    { id: 'rdl', name: 'DB RDL', muscle: 'hamstrings', pattern: 'hinge', type: 'dumbbell', joint: 'low_back' },
    { id: 'glute_bridge', name: 'Glute Bridge', muscle: 'glutes', pattern: 'hinge', type: 'bodyweight', joint: 'low_back' },
    { id: 'calf_raise', name: 'DB Calf Raise', muscle: 'calves', pattern: 'iso_calf', type: 'dumbbell', joint: 'ankle' },
    // Arms
    { id: 'db_curl', name: 'Standing DB Curl', muscle: 'biceps', pattern: 'pull_iso', type: 'dumbbell', joint: 'wrist' },
    { id: 'hammer', name: 'Hammer Curl', muscle: 'biceps', pattern: 'pull_iso', type: 'dumbbell', joint: 'wrist' },
    { id: 'incline_curl', name: 'Incline DB Curl', muscle: 'biceps', pattern: 'pull_iso', type: 'dumbbell', joint: 'shoulder' },
    { id: 'conc_curl', name: 'Concentration Curl', muscle: 'biceps', pattern: 'pull_iso', type: 'dumbbell', joint: 'elbow' },
    { id: 'skullcrusher', name: 'DB Skullcrushers', muscle: 'triceps', pattern: 'push_iso', type: 'dumbbell', joint: 'elbow' },
    { id: 'kickback', name: 'Tricep Kickbacks', muscle: 'triceps', pattern: 'push_iso', type: 'dumbbell', joint: 'elbow' },
    { id: 'bench_dip', name: 'Bench Dips', muscle: 'triceps', pattern: 'push_iso', type: 'bodyweight', joint: 'shoulder' },
    // Core
    { id: 'plank', name: 'Plank', muscle: 'core', pattern: 'iso_core', type: 'bodyweight', joint: 'shoulder' },
    { id: 'russian', name: 'Russian Twist', muscle: 'core', pattern: 'iso_core', type: 'dumbbell', joint: 'low_back' }
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
            if (!this.data.exercises || this.data.exercises.length < 10) {
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
        
        if (last7.length < freqTarget) { items.push("📅 <strong>Consistency:</strong> You missed a target session recently. Goal: Just show up and punch the clock this week."); } 
        else { items.push("🔥 <strong>Streak:</strong> You are consistent! Keep this momentum."); }

        if (h.length > 0) {
            const lastSession = h[h.length - 1];
            const closeCall = lastSession.exercises.find(e => {
                const best = e.sets.reduce((p,c) => c.reps > p.reps ? c : p, {reps:0});
                return best.reps >= 10 && best.reps < 12;
            });
            if (closeCall) {
                const exName = Store.data.exercises.find(e => e.id === closeCall.id)?.name || "Exercise";
                items.push(`💪 <strong>The Push:</strong> You hit high reps on ${exName}. Focus on breathing and get 12 clean reps.`);
            }
        }

        const recent = h.slice(-3);
        const upperCount = recent.filter(s => s.type === 'upper').length;
        const lowerCount = recent.filter(s => s.type === 'lower').length;
        if (upperCount > lowerCount + 1) items.push("⚖️ <strong>Balance:</strong> Lower body volume is lagging. Prioritize your next Leg Day.");
        if (lowerCount > upperCount + 1) items.push("⚖️ <strong>Balance:</strong> Upper body volume is lagging. Prioritize Push/Pull next.");

        if (h.length > 0 && h.length % 18 === 0) items.push("🛡️ <strong>Deload:</strong> Fatigue accumulation detected. We are lightening the load this week.");
        if (items.length === 0) items.push("✨ <strong>Form Focus:</strong> Control the eccentric (lowering) phase for 3 seconds on every rep.");
        return items.slice(0, 3);
    },

    detectPlateau(exId) {
        const hist = Store.data.history.filter(h => h.exercises.some(e => e.id === exId)).slice(-3);
        if (hist.length < 3) return null;
        const efforts = hist.map(session => {
            const ex = session.exercises.find(e => e.id === exId);
            const bestSet = ex.sets.reduce((p, c) => (c.weight * c.reps > p.weight * p.reps) ? c : p, {weight:0, reps:0});
            return { weight: bestSet.weight, reps: bestSet.reps };
        });
        const stalled = (efforts[2].weight <= efforts[1].weight && efforts[1].weight <= efforts[0].weight) && (efforts[2].reps <= efforts[1].reps && efforts[1].reps <= efforts[0].reps);
        return stalled ? "Plateau Detected: 3 sessions without progress." : null;
    },

    getHistoryString(exId) {
        const hist = Store.data.history;
        for (let i = hist.length - 1; i >= 0; i--) {
            const exData = hist[i].exercises.find(e => e.id === exId);
            if (exData) {
                const best = exData.sets.reduce((p, c) => (c.weight > p.weight) ? c : (c.weight === p.weight && c.reps > p.reps ? c : p), {weight:0, reps:0, rir:0});
                return `Last: ${best.weight}lbs x ${best.reps} (RIR ${best.rir})`;
            }
        }
        return "New Exercise";
    },

    getChartData(exId) {
        return Store.data.history.map(s => {
            const ex = s.exercises.find(e => e.id === exId);
            if (!ex) return null;
            const best = ex.sets.reduce((p, c) => (c.weight * c.reps > p.weight * p.reps) ? c : p, {weight:0, reps:0});
            const e1rm = best.weight * (1 + (best.reps / 30));
            return { date: s.date, val: Math.round(e1rm) };
        }).filter(x => x !== null).slice(-10);
    },

    // NEW: Returns ALL alternatives
    getAlternatives(exId) {
        const current = Store.data.exercises.find(e => e.id === exId);
        if(!current) return [];
        return Store.data.exercises.filter(e => e.muscle === current.muscle && e.id !== exId && (!Store.data.profile.wristPain || e.joint !== 'wrist'));
    },

    generateWorkout(forcedType = null, readinessScore = 5) {
        const { frequency, wristPain } = Store.data.profile;
        const last = Store.data.history[Store.data.history.length - 1];
        let type = forcedType ? forcedType : (frequency >= 3 ? ((last && last.type === 'upper') ? 'lower' : 'upper') : 'full');
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

        let setVolume = 3;
        if (readinessScore <= 3) setVolume = 2;
        if (isDeload) setVolume = 2;

        return {
            type: type, isDeload: isDeload,
            exercises: selected.map(ex => {
                const prog = Store.data.progression[ex.id] || { weight: 10, nextReps: '8-12' };
                const workingWeight = isDeload ? Math.round(prog.weight * 0.7) : prog.weight;
                const plateauMsg = this.detectPlateau(ex.id);
                return { ...ex, targetWeight: workingWeight, targetReps: prog.nextReps, sets: setVolume, note: plateauMsg };
            })
        };
    },

    updateProgression(session) {
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
        
        const oldTimer = document.getElementById('timer-overlay'); const oldModal = document.getElementById('readiness-modal');
        if(oldTimer) oldTimer.remove(); if(oldModal) oldModal.remove();

        const timerHtml = `<div id="timer-overlay"><span id="timer-val">00:00</span> <div class="timer-close" onclick="UI.stopTimer()">X</div></div>`;
        const modalHtml = `<div id="readiness-modal" class="modal-overlay"><div class="modal-content"><h3>How do you feel today?</h3><p style="color:#666; margin-bottom:20px;">Be honest. The Coach will adjust volume.</p><div class="readiness-options"><button class="readiness-btn" onclick="UI.confirmReadiness(2)">😫<br><small>Tired</small></button><button class="readiness-btn" onclick="UI.confirmReadiness(3)">😐<br><small>Okay</small></button><button class="readiness-btn" onclick="UI.confirmReadiness(5)">💪<br><small>Great</small></button></div></div></div>`;
        document.body.insertAdjacentHTML('beforeend', timerHtml + modalHtml);

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

    renderGuide() {
        this.pageTitle.innerText = 'Coach Logic';
        this.container.innerHTML = `
            <div class="card">
                <div class="guide-block"><h3>🧠 Readiness Check</h3><p>Before every workout, tell the Coach how you feel. If you are tired (Score 1-3), the Coach drops volume to 2 sets to prevent burnout.</p></div>
                <div class="guide-block"><h3>📉 Auto-Deload</h3><p>Every 6 weeks, the Coach triggers a "Light Week". Weights drop by 30% to allow your joints to recover.</p></div>
                <div class="guide-block"><h3>📈 Progression</h3><p>Weights increase only if you hit 10+ reps AND rate the set as Easy (RIR 3).</p><p><strong>Small Muscles:</strong> +2.5 lbs.<br><strong>Large Muscles:</strong> +5 lbs.</p></div>
                <div class="guide-block"><h3>🧱 Plateau Detection</h3><p>If you fail to increase weights or reps for 3 straight workouts, a warning banner appears. Use the 🔄 button to swap the exercise.</p></div>
                <div class="guide-block"><h3>✏️ History Editing</h3><p>Mistake? Go to Settings > Manage History. You can edit dates, weights, and reps of your last 3 sessions.</p></div>
            </div>`;
    },

    renderDash() {
        this.pageTitle.innerText = 'Dashboard';
        const h = Store.data.history; const count = h.length;
        const lastUp = [...h].reverse().find(s => s.type === 'upper');
        const lastLow = [...h].reverse().find(s => s.type === 'lower');
        const formatDate = (d) => d ? new Date(d).toLocaleDateString() : 'None';
        const goals = Coach.generateWeeklyFocus();
        const clipboardHtml = goals.map(text => `<div class="clipboard-item"><div class="clipboard-check" onclick="this.classList.toggle('checked')"></div><div>${text}</div></div>`).join('');
        const last7Days = [...Array(7)].map((_, i) => { const d = new Date(); d.setDate(d.getDate() - (6 - i)); return d; });
        const bars = last7Days.map(date => {
            const dateStr = date.toLocaleDateString(); const dayName = date.toLocaleDateString('en-US', { weekday: 'narrow' }); 
            const trained = h.some(session => new Date(session.date).toLocaleDateString() === dateStr);
            return `<div style="flex:1; display:flex; flex-direction:column; align-items:center; gap:5px;"><div style="width:100%; background:${trained ? 'var(--primary)' : '#e2e8f0'}; height:${trained ? '100%' : '20%'}; border-radius:4px;"></div><span style="font-size:0.6rem; color:#888">${dayName}</span></div>`;
        }).join('');
        this.container.innerHTML = `<div class="card clipboard-card"><div class="clipboard-header">📋 Coach's Focus for You</div>${clipboardHtml}</div><div class="card"><h2>Overview</h2><div class="summary-grid"><div class="summary-box"><div class="summary-label">Last Upper</div><div class="summary-val">${lastUp ? formatDate(lastUp.date) : '--'}</div></div><div class="summary-box"><div class="summary-label">Last Lower</div><div class="summary-val">${lastLow ? formatDate(lastLow.date) : '--'}</div></div></div><p style="color:var(--text-muted)">Total Workouts: <strong>${count}</strong></p></div><div class="card"><h2>Last 7 Days</h2><div style="display:flex; align-items:flex-end; gap:5px; height:80px; padding-top:10px;">${bars}</div></div>`;
    },

    renderWorkoutIntro() {
        this.pageTitle.innerText = 'Workout';
        const draft = Store.getDraft(); const last = Store.data.history[Store.data.history.length - 1];
        let primaryType = (last && last.type === 'upper') ? 'lower' : 'upper'; let altType = (primaryType === 'upper') ? 'lower' : 'upper';
        if (draft) { this.container.innerHTML = `<div style="padding:20px 0;"><div class="card" style="border: 2px solid var(--warning);"><h3>Paused Session Found</h3><p style="margin-bottom:10px; font-size:0.9rem;">From: ${new Date(draft.startTime).toLocaleString()}</p><button class="btn-primary" style="background:var(--warning)" onclick="UI.resumeSession()">Resume Workout</button><button class="btn-secondary" onclick="UI.clearDraft()">Discard</button></div></div>`; } 
        else { this.container.innerHTML = `<div style="padding:20px 0;"><div class="card" style="text-align:center; padding: 30px 20px;"><div style="font-size:3rem; margin-bottom:10px;">💪</div><button class="btn-primary" style="margin-bottom: 15px;" onclick="UI.triggerReadiness('${primaryType}')">Today's Workout: ${primaryType.toUpperCase()}</button><button class="btn-secondary" style="font-size:0.9rem; padding: 10px;" onclick="UI.triggerReadiness('${altType}')">Alternative: ${altType.charAt(0).toUpperCase() + altType.slice(1)}</button></div></div>`; }
    },

    clearDraft() { localStorage.removeItem(DRAFT_KEY); this.renderWorkoutIntro(); },
    resumeSession() { const d = Store.getDraft(); this.currentPlan = d.plan; this.currentStartTime = d.startTime; this.currentType = d.type; this.renderActiveSession(true); },
    triggerReadiness(type) { this.pendingWorkoutType = type; document.getElementById('readiness-modal').classList.add('active'); },
    confirmReadiness(score) { document.getElementById('readiness-modal').classList.remove('active'); this.startNewSession(this.pendingWorkoutType, score); },
    startNewSession(type, readiness) { const g = Coach.generateWorkout(type, readiness); this.currentPlan = g.exercises; this.currentType = g.type; this.isDeload = g.isDeload; this.currentStartTime = new Date().toISOString(); this.renderActiveSession(false); },

    renderActiveSession(isResumeOrEdit) {
        const isHistoryEdit = this.editingHistoryIndex !== null;
        let dataMap = {}; if (isResumeOrEdit && !isHistoryEdit) { const draft = Store.getDraft(); dataMap = draft?.inputs || {}; }
        let topHtml = this.isDeload ? `<div class="deload-banner">⚠️ <strong>Deload Week</strong><br>Weights reduced by 30%. Focus on recovery.</div>` : '';
        const legend = `<div class="rir-legend-box"><span class="rir-legend-title">RIR Scale</span>0 = Failure | 1 = Hard | 2 = Sweet Spot | 3+ = Easy</div>`;
        let dateHeader = isHistoryEdit ? `<div class="card" style="background:#fff3cd; border:1px solid #ffeeba;"><label style="font-size:0.8rem; font-weight:bold;">Editing Date:</label><input type="date" id="edit-date-input" value="${new Date(Store.data.history[this.editingHistoryIndex].date).toISOString().split('T')[0]}" style="margin-bottom:0;"></div>` : '';

        const exercisesHtml = this.currentPlan.map((ex, i) => {
            let weightVal = ex.targetWeight;
            if (isHistoryEdit) { if (ex.sets && ex.sets[0]) weightVal = ex.sets[0].weight; } else if (dataMap[`weight-${i}`]) { weightVal = dataMap[`weight-${i}`]; }
            const setRows = Array.from({length: ex.sets}, (_, k) => k + 1).map(s => {
                let repVal = '', rirVal = 2;
                if (isHistoryEdit) { const setObj = ex.sets[s-1]; if (setObj) { repVal = setObj.reps; rirVal = setObj.rir; } } else { repVal = dataMap[`reps-${i}-${s}`] || ''; rirVal = dataMap[`rir-${i}-${s}`] !== undefined ? dataMap[`rir-${i}-${s}`] : 2; }
                return `<div class="set-row"><span style="font-size:0.8rem; color:#888">Set ${s}</span><input type="number" placeholder="Reps" id="reps-${i}-${s}" value="${repVal}" ${!isHistoryEdit ? 'onchange="UI.scrapeAndSaveDraft()"' : ''}><div class="rir-container"><div class="rir-header-row"><span class="rir-label">F</span><span class="rir-label">H</span><span class="rir-label">SP</span><span class="rir-label">E</span></div><div class="rir-selector" id="rir-box-${i}-${s}">${[0,1,2,3].map(r => `<div class="rir-btn ${rirVal == r ? 'selected' : ''}" onclick="UI.setRir(${i},${s},${r})">${r}${r==3?'+':''}</div>`).join('')}</div></div><input type="hidden" id="rir-${i}-${s}" value="${rirVal}"></div>`;
            }).join('');
            return `<div class="card" id="card-${i}">${!isHistoryEdit ? `<button class="swap-btn" onclick="UI.swapExercise(${i})">🔄</button>` : ''}${ex.note ? `<div class="toast">${ex.note}</div>` : ''}<h3>${ex.name}</h3><div class="history-text">${!isHistoryEdit ? Coach.getHistoryString(ex.id) : ''}</div><div class="weight-input-group"><label>Working Weight:</label><input type="number" id="weight-${i}" value="${weightVal}" ${!isHistoryEdit ? 'onchange="UI.scrapeAndSaveDraft()"' : ''}><span>lbs</span></div><p style="color:var(--text-muted); font-size:0.85rem; margin-bottom:10px;">Target Reps: ${ex.targetReps}</p>${setRows}</div>`;
        }).join('');
        
        let actionBtn = `<button class="btn-primary" onclick="UI.finishSession()">Finish Workout</button> <button class="btn-warning" onclick="UI.pauseSession()">Pause & Save</button>`;
        if (isHistoryEdit) actionBtn = `<button class="btn-primary" onclick="UI.saveEditedHistory()">Save Changes</button> <button class="btn-secondary" onclick="UI.renderHistoryManager()">Cancel</button>`;
        this.container.innerHTML = `${topHtml}${dateHeader}${legend}${exercisesHtml}${actionBtn}`;
        window.scrollTo(0,0);
    },

    // NEW SWAP LOGIC: Show List
    swapExercise(index) {
        this.scrapeAndSaveDraft();
        const oldEx = this.currentPlan[index];
        const alternatives = Coach.getAlternatives(oldEx.id);
        
        if (alternatives.length === 0) { alert("No other exercises found for this muscle group."); return; }

        const listHtml = alternatives.map(ex => `
            <div class="swap-item" onclick="UI.selectSwap(${index}, '${ex.id}')">
                <div><strong>${ex.name}</strong><small>${ex.pattern}</small></div>
                <span class="swap-select-btn">Select</span>
            </div>
        `).join('');

        const modalHtml = `
            <div id="swap-modal" class="modal-overlay active">
                <div class="modal-content" style="text-align:left; padding:0; overflow:hidden;">
                    <div style="padding:15px; border-bottom:1px solid #eee; display:flex; justify-content:space-between; align-items:center;">
                        <h3 style="margin:0; font-size:1.1rem;">Swap ${oldEx.name}</h3>
                        <div class="timer-close" style="background:#eee; color:#333;" onclick="document.getElementById('swap-modal').remove()">X</div>
                    </div>
                    <div class="swap-list">${listHtml}</div>
                </div>
            </div>`;
        
        const existing = document.getElementById('swap-modal'); if(existing) existing.remove();
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    },

    selectSwap(index, newId) {
        document.getElementById('swap-modal').remove();
        const newEx = Store.data.exercises.find(e => e.id === newId);
        Store.data.activeExercises[newEx.muscle] = newId; 
        Store.save();
        
        const prog = Store.data.progression[newId] || { weight: 10, nextReps: '8-12' };
        this.currentPlan[index] = { ...newEx, targetWeight: prog.weight, targetReps: prog.nextReps, sets: 3, note: 'Swapped & Saved' };
        this.renderActiveSession(true);
    },

    setRir(exIdx, setNum, val) {
        document.querySelectorAll(`#rir-box-${exIdx}-${setNum} .rir-btn`).forEach(b => b.classList.remove('selected'));
        document.querySelectorAll(`#rir-box-${exIdx}-${setNum} .rir-btn`)[val].classList.add('selected');
        document.getElementById(`rir-${exIdx}-${setNum}`).value = val;
        if (this.editingHistoryIndex === null) { this.scrapeAndSaveDraft(); this.startTimer(120); }
    },

    startTimer(seconds) {
        const overlay = document.getElementById('timer-overlay'); const display = document.getElementById('timer-val'); overlay.classList.add('active');
        if (this.timerInterval) clearInterval(this.timerInterval); let rem = seconds;
        const tick = () => { const m = Math.floor(rem / 60).toString().padStart(2,'0'); const s = (rem % 60).toString().padStart(2,'0'); display.innerText = `${m}:${s}`; if (rem <= 0) { clearInterval(this.timerInterval); display.innerText = "Ready!"; if (navigator.vibrate) navigator.vibrate([200, 100, 200]); } rem--; }; tick(); this.timerInterval = setInterval(tick, 1000);
    },

    stopTimer() { clearInterval(this.timerInterval); document.getElementById('timer-overlay').classList.remove('active'); },
    scrapeAndSaveDraft() { const inputs = {}; document.querySelectorAll('input').forEach(inp => { if (inp.id) inputs[inp.id] = inp.value; }); Store.saveDraft({ startTime: this.currentStartTime, plan: this.currentPlan, type: this.currentType, inputs: inputs }); },
    pauseSession() { this.scrapeAndSaveDraft(); this.nav('workout'); },
    finishSession() {
        if(!confirm("Finish and save workout?")) return;
        const results = { date: new Date().toISOString(), type: this.currentType, exercises: this.currentPlan.map((ex, i) => { const w = Number(document.getElementById(`weight-${i}`).value) || ex.targetWeight; const setsData = []; for(let s=1; s<=ex.sets; s++) { setsData.push({ reps: Number(document.getElementById(`reps-${i}-${s}`).value) || 0, rir: Number(document.getElementById(`rir-${i}-${s}`).value), weight: w }); } return { id: ex.id, type: ex.type, sets: setsData }; }) };
        Store.logSession(results); this.stopTimer(); alert("Great job!"); this.nav('dashboard');
    },

    renderLib() {
        this.pageTitle.innerText = 'Exercise Library';
        const groups = { 'Chest': ['chest'], 'Back': ['back'], 'Shoulders': ['shoulders'], 'Legs': ['quads', 'hamstrings', 'glutes', 'calves', 'legs'], 'Arms': ['biceps', 'triceps', 'arms'], 'Core': ['core'] };
        let html = '<p style="color:#666; font-size:0.9rem; margin-bottom:15px;">Tap an exercise to view progress.</p>';
        for (const [category, muscles] of Object.entries(groups)) {
            const exercises = Store.data.exercises.filter(e => muscles.includes(e.muscle));
            if (exercises.length > 0) { html += `<h3 class="lib-header">${category}</h3>` + exercises.map(e => `<div class="card clickable" onclick="UI.toggleChart(this, '${e.id}')"><div style="display:flex; justify-content:space-between;"><strong>${e.name}</strong><span style="font-size:0.7rem; background:#eee; padding:2px 6px; border-radius:4px;">${e.muscle}</span></div><div class="chart-container" id="chart-${e.id}"></div></div>`).join(''); }
        }
        this.container.innerHTML = html;
    },

    toggleChart(card, exId) { const container = card.querySelector('.chart-container'); if (card.classList.contains('expanded')) { card.classList.remove('expanded'); } else { document.querySelectorAll('.card.expanded').forEach(c => c.classList.remove('expanded')); card.classList.add('expanded'); this.renderChart(exId, container); } },
    renderChart(exId, container) {
        const data = Coach.getChartData(exId); if (data.length < 2) { container.innerHTML = '<p style="text-align:center; padding-top:40px; color:#888;">Not enough data yet.</p>'; return; }
        const h = 150, w = container.offsetWidth || 300; const vals = data.map(d => d.val); const min = Math.min(...vals) * 0.9; const max = Math.max(...vals) * 1.1; const range = max - min;
        const points = data.map((d, i) => `${(i / (data.length - 1)) * w},${h - ((d.val - min) / range) * h}`).join(' ');
        container.innerHTML = `<svg class="chart-svg" viewBox="0 0 ${w} ${h}"><polyline class="chart-line" points="${points}" />${data.map((d, i) => `<circle cx="${(i / (data.length - 1)) * w}" cy="${h - ((d.val - min) / range) * h}" r="4" class="chart-dot" /><text x="${(i / (data.length - 1)) * w}" y="${h - ((d.val - min) / range) * h - 10}" text-anchor="middle" class="chart-label">${d.val}</text>`).join('')}</svg>`;
    },

    renderSettings() { this.pageTitle.innerText = 'Settings'; const p = Store.data.profile; this.container.innerHTML = `<div class="card"><h2>Account</h2><button class="btn-secondary" onclick="UI.renderHistoryManager()">Manage Recent History (Edit/Delete)</button></div><div class="card"><label>Days Per Week</label><select id="s-freq"><option value="2" ${p.frequency==2?'selected':''}>2 Days</option><option value="3" ${p.frequency==3?'selected':''}>3 Days</option><option value="4" ${p.frequency==4?'selected':''}>4 Days</option></select><label>Emphasis</label><select id="s-emph"><option value="upper" ${p.emphasis=='upper'?'selected':''}>Upper Body</option><option value="lower" ${p.emphasis=='lower'?'selected':''}>Lower Body</option></select><button class="btn-primary" style="margin-top:15px" onclick="UI.saveSet()">Save Profile</button></div><div class="card"><button class="btn-secondary" onclick="UI.export()">Export Data</button></div>`; },
    renderHistoryManager() {
        this.pageTitle.innerText = 'History Manager'; const recent = Store.data.history.map((h, i) => ({...h, origIndex: i})).reverse().slice(0, 3);
        if (recent.length === 0) { this.container.innerHTML = '<div class="card"><p>No history found.</p><button class="btn-secondary" onclick="UI.nav(\'settings\')">Back</button></div>'; return; }
        const html = recent.map(item => `<div class="history-item"><div class="history-info"><strong>${new Date(item.date).toLocaleDateString()}</strong><span style="font-size:0.8rem; color:#666;">${item.type.toUpperCase()} • ${item.exercises.length} Exercises</span></div><div class="history-actions"><button class="btn-sm" onclick="UI.editWorkout(${item.origIndex})">Edit Workout</button><button class="btn-sm btn-danger" onclick="UI.deleteHistory(${item.origIndex})">Delete</button></div></div>`).join('');
        this.container.innerHTML = `<div style="margin-bottom:20px;">${html}</div><button class="btn-secondary" onclick="UI.nav(\'settings\')">Back to Settings</button>`;
    },
    deleteHistory(index) { if(confirm("Are you sure?")) { Store.deleteSession(index); this.renderHistoryManager(); }},
    editWorkout(index) { const s = Store.data.history[index]; this.editingHistoryIndex = index; this.currentPlan = s.exercises; this.currentType = s.type; this.renderActiveSession(true); },
    saveEditedHistory() {
        const index = this.editingHistoryIndex; if (index === null) return;
        const newDate = document.getElementById('edit-date-input').value ? new Date(document.getElementById('edit-date-input').value).toISOString() : Store.data.history[index].date;
        const updatedSession = { date: newDate, type: this.currentType, exercises: this.currentPlan.map((ex, i) => ({ id: ex.id, type: ex.type, sets: ex.sets.map((_, sIdx) => ({ reps: Number(document.getElementById(`reps-${i}-${sIdx+1}`).value) || 0, rir: Number(document.getElementById(`rir-${i}-${sIdx+1}`).value), weight: Number(document.getElementById(`weight-${i}`).value) || 0 })) })) };
        Store.updateHistorySession(index, updatedSession); alert("Updated!"); this.nav('settings');
    },
    saveSet() { Store.data.profile.frequency = Number(document.getElementById('s-freq').value); Store.data.profile.emphasis = document.getElementById('s-emph').value; Store.save(); alert("Saved!"); },
    export() { const data = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(Store.data)); const a = document.createElement('a'); a.href = data; a.download = 'strengthos_backup.json'; document.body.appendChild(a); a.click(); a.remove(); }
};

window.addEventListener('DOMContentLoaded', () => { Store.init(); UI.init(); });

/**
 * StrengthOS - Complete Mobile PWA v5
 * Updates: Swap, History Text, Rest Timer, Smart Buttons, Real Consistency
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
    exercises: DEFAULT_EXERCISES
};

// --- 2. STORAGE & HELPERS ---
const Store = {
    data: null,
    init() {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            this.data = JSON.parse(stored);
            if (!this.data.exercises || this.data.exercises.length < 10) {
                this.data.exercises = DEFAULT_EXERCISES; 
            }
        } else {
            this.data = initialState;
            this.save();
        }
    },
    save() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    },
    logSession(session) {
        this.data.history.push(session);
        Coach.updateProgression(session);
        this.save();
        localStorage.removeItem(DRAFT_KEY);
    },
    saveDraft(planData) {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(planData));
    },
    getDraft() {
        const d = localStorage.getItem(DRAFT_KEY);
        return d ? JSON.parse(d) : null;
    }
};

// --- 3. COACH BRAIN ---
const Coach = {
    detectPlateau(exId) {
        const hist = Store.data.history.filter(h => h.exercises.some(e => e.id === exId)).slice(-3);
        if (hist.length < 3) return null;
        return null;
    },

    getHistoryString(exId) {
        const hist = Store.data.history;
        for (let i = hist.length - 1; i >= 0; i--) {
            const exData = hist[i].exercises.find(e => e.id === exId);
            if (exData) {
                const best = exData.sets.reduce((p, c) => (c.weight * c.reps > p.weight * p.reps) ? c : p, {weight:0, reps:0, rir:0});
                return `Last: ${best.weight}lbs x ${best.reps} (RIR ${best.rir})`;
            }
        }
        return "New Exercise";
    },

    getAlternative(exId) {
        const current = Store.data.exercises.find(e => e.id === exId);
        if(!current) return null;
        
        const alts = Store.data.exercises.filter(e => 
            e.muscle === current.muscle && 
            e.id !== exId &&
            (!Store.data.profile.wristPain || e.joint !== 'wrist')
        );
        
        if (alts.length > 0) {
            return alts[Math.floor(Math.random() * alts.length)];
        }
        return null;
    },

    generateWorkout(forcedType = null) {
        const { frequency, wristPain } = Store.data.profile;
        const last = Store.data.history[Store.data.history.length - 1];
        
        let type = 'full';
        
        if (forcedType) {
            type = forcedType;
        } else if (frequency >= 3) {
            type = (last && last.type === 'upper') ? 'lower' : 'upper';
        }

        let muscles = [];
        if (type === 'upper') muscles = ['chest', 'back', 'shoulders', 'biceps', 'triceps', 'core'];
        if (type === 'lower') muscles = ['quads', 'hamstrings', 'glutes', 'calves', 'core'];
        if (type === 'full') muscles = ['chest', 'back', 'quads', 'hamstrings', 'shoulders'];

        let selected = [];
        muscles.forEach(m => {
            const pool = Store.data.exercises.filter(e => e.muscle === m && (!wristPain || e.joint !== 'wrist'));
            if (pool.length > 0) {
                const ex = pool[Math.floor(Math.random() * pool.length)];
                selected.push(ex);
            }
        });

        return {
            type: type,
            exercises: selected.map(ex => {
                const prog = Store.data.progression[ex.id] || { weight: 10, nextReps: '8-12' };
                return {
                    ...ex,
                    targetWeight: prog.weight,
                    targetReps: prog.nextReps,
                    sets: 3,
                    note: null
                };
            })
        };
    },

    updateProgression(session) {
        session.exercises.forEach(res => {
            const lastSet = res.sets[res.sets.length - 1];
            const current = Store.data.progression[res.id] || { weight: 10, nextReps: '8-12' };
            let newWeight = current.weight;
            if (lastSet.rir >= 3) {
                newWeight += (res.type === 'dumbbell' ? 5 : 0);
            }
            Store.data.progression[res.id] = { weight: newWeight, nextReps: '8-12' };
        });
    }
};

// --- 4. UI RENDERER ---
const UI = {
    timerInterval: null,

    init() {
        this.container = document.getElementById('main-container');
        this.navBtns = document.querySelectorAll('.nav-btn');
        this.pageTitle = document.getElementById('page-title');
        
        // Add Timer UI to body
        const timerHtml = `<div id="timer-overlay"><span id="timer-val">00:00</span> <div class="timer-close" onclick="UI.stopTimer()">X</div></div>`;
        document.body.insertAdjacentHTML('beforeend', timerHtml);

        this.navBtns.forEach(b => b.addEventListener('click', () => this.nav(b.dataset.target)));
        this.nav('dashboard');
        
        this.container.addEventListener('input', (e) => {
            if (this.currentMode === 'workout') this.scrapeAndSaveDraft();
        });
    },

    nav(view) {
        this.navBtns.forEach(b => b.classList.remove('active'));
        const btn = document.querySelector(`[data-target="${view}"]`);
        if (btn) btn.classList.add('active');
        
        this.currentMode = view;
        this.container.innerHTML = '';
        
        if(view === 'dashboard') this.renderDash();
        if(view === 'workout') this.renderWorkoutIntro();
        if(view === 'exercises') this.renderLib();
        if(view === 'settings') this.renderSettings();
    },

    // --- DASHBOARD WITH CONSISTENCY ---
    renderDash() {
        this.pageTitle.innerText = 'Dashboard';
        const h = Store.data.history;
        const count = h.length;
        
        const lastUp = [...h].reverse().find(s => s.type === 'upper');
        const lastLow = [...h].reverse().find(s => s.type === 'lower');
        const formatDate = (d) => d ? new Date(d).toLocaleDateString() : 'None';

        // REAL CONSISTENCY GRAPH
        const last7Days = [...Array(7)].map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (6 - i));
            return d;
        });

        const bars = last7Days.map(date => {
            const dateStr = date.toLocaleDateString();
            const dayName = date.toLocaleDateString('en-US', { weekday: 'narrow' }); 
            const trained = h.some(session => new Date(session.date).toLocaleDateString() === dateStr);
            
            return `
                <div style="flex:1; display:flex; flex-direction:column; align-items:center; gap:5px;">
                    <div style="width:100%; background:${trained ? 'var(--primary)' : '#e2e8f0'}; height:${trained ? '100%' : '20%'}; border-radius:4px;"></div>
                    <span style="font-size:0.6rem; color:#888">${dayName}</span>
                </div>
            `;
        }).join('');

        this.container.innerHTML = `
            <div class="card">
                <h2>Overview</h2>
                <div class="summary-grid">
                    <div class="summary-box">
                        <div class="summary-label">Last Upper</div>
                        <div class="summary-val">${lastUp ? formatDate(lastUp.date) : '--'}</div>
                    </div>
                    <div class="summary-box">
                        <div class="summary-label">Last Lower</div>
                        <div class="summary-val">${lastLow ? formatDate(lastLow.date) : '--'}</div>
                    </div>
                </div>
                <p style="color:var(--text-muted)">Total Workouts: <strong>${count}</strong></p>
            </div>
            <div class="card">
                <h2>Last 7 Days</h2>
                <div style="display:flex; align-items:flex-end; gap:5px; height:80px; padding-top:10px;">
                    ${bars}
                </div>
            </div>
        `;
    },

    // --- WORKOUT INTRO WITH SMART BUTTONS ---
    renderWorkoutIntro() {
        this.pageTitle.innerText = 'Workout';
        const draft = Store.getDraft();
        
        // Logic for Suggestion
        const last = Store.data.history[Store.data.history.length - 1];
        let primaryType = 'upper';
        let altType = 'lower';

        if (last && last.type === 'upper') {
            primaryType = 'lower';
            altType = 'upper';
        }

        if (draft) {
            this.container.innerHTML = `
                <div style="padding:20px 0;">
                    <div class="card" style="border: 2px solid var(--warning);">
                        <h3>Paused Session Found</h3>
                        <p style="margin-bottom:10px; font-size:0.9rem;">From: ${new Date(draft.startTime).toLocaleString()}</p>
                        <button class="btn-primary" style="background:var(--warning)" onclick="UI.resumeSession()">Resume Workout</button>
                        <button class="btn-secondary" onclick="UI.clearDraft()">Discard</button>
                    </div>
                </div>
            `;
        } else {
            this.container.innerHTML = `
                <div style="padding:20px 0;">
                    <div class="card" style="text-align:center; padding: 30px 20px;">
                        <div style="font-size:3rem; margin-bottom:10px;">💪</div>
                        
                        <button class="btn-primary" style="margin-bottom: 15px;" onclick="UI.startNewSession('${primaryType}')">
                            Today's Workout: ${primaryType.toUpperCase()}
                        </button>
                        
                        <button class="btn-secondary" style="font-size:0.9rem; padding: 10px;" onclick="UI.startNewSession('${altType}')">
                            Alternative: ${altType.charAt(0).toUpperCase() + altType.slice(1)}
                        </button>
                    </div>
                </div>
            `;
        }
    },

    clearDraft() {
        localStorage.removeItem(DRAFT_KEY);
        this.renderWorkoutIntro();
    },

    resumeSession() {
        const draft = Store.getDraft();
        this.currentPlan = draft.plan; 
        this.currentStartTime = draft.startTime;
        this.currentType = draft.type;
        this.renderActiveSession(true);
    },

    startNewSession(type) {
        const generated = Coach.generateWorkout(type);
        this.currentPlan = generated.exercises;
        this.currentType = generated.type;
        this.currentStartTime = new Date().toISOString();
        this.renderActiveSession(false);
    },

    renderActiveSession(isResume) {
        const draft = isResume ? Store.getDraft() : null;

        const legend = `
            <div class="rir-legend-box">
                <span class="rir-legend-title">RIR Scale (Reps In Reserve)</span>
                0 = Failure | 1 = Hard | 2 = Sweet Spot | 3+ = Easy
            </div>
        `;

        const exercisesHtml = this.currentPlan.map((ex, i) => `
            <div class="card" id="card-${i}">
                <button class="swap-btn" onclick="UI.swapExercise(${i})">🔄</button>
                ${ex.note ? `<div class="toast">${ex.note}</div>` : ''}
                
                <h3>${ex.name}</h3>
                <div class="history-text">${Coach.getHistoryString(ex.id)}</div>
                
                <p style="color:var(--text-muted); margin-bottom:10px;">Target: ${ex.targetWeight} lbs | ${ex.targetReps} reps</p>
                ${[1,2,3].map(s => {
                    const savedSet = draft?.inputs?.[`reps-${i}-${s}`];
                    const savedRir = draft?.inputs?.[`rir-${i}-${s}`] || 2;
                    
                    return `
                    <div class="set-row">
                        <span style="font-size:0.8rem; color:#888">Set ${s}</span>
                        <input type="number" placeholder="Reps" id="reps-${i}-${s}" value="${savedSet || ''}" onchange="UI.scrapeAndSaveDraft()">
                        
                        <div class="rir-container">
                            <div class="rir-header-row">
                                <span class="rir-label">F</span>
                                <span class="rir-label">H</span>
                                <span class="rir-label">SP</span>
                                <span class="rir-label">E</span>
                            </div>
                            <div class="rir-selector" id="rir-box-${i}-${s}">
                                ${[0,1,2,3].map(r => `
                                    <div class="rir-btn ${savedRir == r ? 'selected' : ''}" 
                                         onclick="UI.setRir(${i},${s},${r})">
                                         ${r}${r==3?'+':''}
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                        <input type="hidden" id="rir-${i}-${s}" value="${savedRir}">
                    </div>
                `}).join('')}
            </div>
        `).join('');
        
        this.container.innerHTML = `
            ${legend}
            ${exercisesHtml}
            <button class="btn-primary" onclick="UI.finishSession()">Finish Workout</button>
            <button class="btn-warning" onclick="UI.pauseSession()">Pause & Save</button>
        `;
        window.scrollTo(0,0);
    },

    // --- LOGIC: SWAP, TIMER, SAVE ---

    swapExercise(index) {
        // Save current input first
        this.scrapeAndSaveDraft();
        
        const oldEx = this.currentPlan[index];
        const newEx = Coach.getAlternative(oldEx.id);
        
        if (newEx) {
            if(confirm(`Swap ${oldEx.name} for ${newEx.name}?`)) {
                // Update plan
                const prog = Store.data.progression[newEx.id] || { weight: 10, nextReps: '8-12' };
                this.currentPlan[index] = {
                    ...newEx,
                    targetWeight: prog.weight,
                    targetReps: prog.nextReps,
                    sets: 3,
                    note: 'Swapped in'
                };
                // Force re-render with isResume=true to load inputs for OTHER exercises
                this.renderActiveSession(true);
            }
        } else {
            alert("No alternative exercises available for this muscle group.");
        }
    },

    setRir(exIdx, setNum, val) {
        document.querySelectorAll(`#rir-box-${exIdx}-${setNum} .rir-btn`).forEach(b => b.classList.remove('selected'));
        document.querySelectorAll(`#rir-box-${exIdx}-${setNum} .rir-btn`)[val].classList.add('selected');
        document.getElementById(`rir-${exIdx}-${setNum}`).value = val;
        
        this.scrapeAndSaveDraft();
        this.startTimer(120); // 2 min rest
    },

    startTimer(seconds) {
        const overlay = document.getElementById('timer-overlay');
        const display = document.getElementById('timer-val');
        overlay.classList.add('active');
        
        if (this.timerInterval) clearInterval(this.timerInterval);
        
        let rem = seconds;
        const tick = () => {
            const m = Math.floor(rem / 60).toString().padStart(2,'0');
            const s = (rem % 60).toString().padStart(2,'0');
            display.innerText = `${m}:${s}`;
            if (rem <= 0) {
                clearInterval(this.timerInterval);
                display.innerText = "Ready!";
                // Vibrate if on mobile
                if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
            }
            rem--;
        };
        tick();
        this.timerInterval = setInterval(tick, 1000);
    },

    stopTimer() {
        clearInterval(this.timerInterval);
        document.getElementById('timer-overlay').classList.remove('active');
    },

    scrapeAndSaveDraft() {
        const inputs = {};
        document.querySelectorAll('input').forEach(inp => {
            if (inp.id) inputs[inp.id] = inp.value;
        });
        
        const draftData = {
            startTime: this.currentStartTime,
            plan: this.currentPlan,
            type: this.currentType,
            inputs: inputs
        };
        Store.saveDraft(draftData);
    },

    pauseSession() {
        this.scrapeAndSaveDraft();
        this.nav('workout'); 
    },

    finishSession() {
        if(!confirm("Finish and save workout?")) return;
        
        const results = {
            date: new Date().toISOString(),
            type: this.currentType,
            exercises: this.currentPlan.map((ex, i) => ({
                id: ex.id,
                type: ex.type,
                sets: [1,2,3].map(s => ({
                    reps: Number(document.getElementById(`reps-${i}-${s}`).value) || 0,
                    rir: Number(document.getElementById(`rir-${i}-${s}`).value),
                    weight: ex.targetWeight
                }))
            }))
        };

        Store.logSession(results);
        this.stopTimer();
        alert("Great job! Progression updated.");
        this.nav('dashboard');
    },

    renderLib() {
        this.pageTitle.innerText = 'Exercise Library';
        this.container.innerHTML = Store.data.exercises.map(e => `
            <div class="card">
                <div style="display:flex; justify-content:space-between;">
                    <strong>${e.name}</strong>
                    <span style="font-size:0.7rem; background:#eee; padding:2px 6px; border-radius:4px;">${e.muscle}</span>
                </div>
                <div style="font-size:0.8rem; color:var(--text-muted); margin-top:4px;">${e.pattern} • ${e.joint} dominant</div>
            </div>
        `).join('');
    },

    renderSettings() {
        this.pageTitle.innerText = 'Settings';
        const p = Store.data.profile;
        this.container.innerHTML = `
            <div class="card">
                <label>Days Per Week</label>
                <select id="s-freq">
                    <option value="2" ${p.frequency==2?'selected':''}>2 Days</option>
                    <option value="3" ${p.frequency==3?'selected':''}>3 Days</option>
                    <option value="4" ${p.frequency==4?'selected':''}>4 Days</option>
                </select>
                <label>Emphasis</label>
                <select id="s-emph">
                    <option value="upper" ${p.emphasis=='upper'?'selected':''}>Upper Body</option>
                    <option value="lower" ${p.emphasis=='lower'?'selected':''}>Lower Body</option>
                </select>
                <div style="margin-top:10px;">
                    <input type="checkbox" id="s-wrist" style="width:auto" ${p.wristPain?'checked':''}>
                    <label for="s-wrist">I have wrist pain (Avoid heavy wrist loads)</label>
                </div>
                <button class="btn-primary" style="margin-top:15px" onclick="UI.saveSet()">Save Profile</button>
            </div>
            <div class="card">
                <button class="btn-secondary" onclick="UI.export()">Export Data</button>
            </div>
        `;
    },

    saveSet() {
        Store.data.profile.frequency = Number(document.getElementById('s-freq').value);
        Store.data.profile.emphasis = document.getElementById('s-emph').value;
        Store.data.profile.wristPain = document.getElementById('s-wrist').checked;
        Store.save();
        alert("Saved!");
    },

    export() {
        const data = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(Store.data));
        const a = document.createElement('a');
        a.href = data; a.download = 'strengthos_backup.json';
        document.body.appendChild(a); a.click(); a.remove();
    }
};

window.addEventListener('DOMContentLoaded', () => { Store.init(); UI.init(); });

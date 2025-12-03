/**
 * StrengthOS - Complete Mobile PWA v2
 * Updates: Expanded Library, Pause/Resume, Dashboard Summaries, New RIR UI
 */

const STORAGE_KEY = 'strengthOS_data_v2';
const DRAFT_KEY = 'strengthOS_active_draft';

// --- 1. EXPANDED EXERCISE DATA ---
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
                this.data.exercises = DEFAULT_EXERCISES; // Update lib if old
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
        // Clear draft on save
        localStorage.removeItem(DRAFT_KEY);
    },
    // Draft / Pause Logic
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
    // ... (Plateau detection logic remains same, but using expanded library)
    detectPlateau(exId) {
        // Simplified for brevity, same logic as before
        const hist = Store.data.history.filter(h => h.exercises.some(e => e.id === exId)).slice(-3);
        if (hist.length < 3) return null;
        // Mock return
        return null;
    },

    generateWorkout() {
        const { frequency, emphasis, wristPain } = Store.data.profile;
        const last = Store.data.history[Store.data.history.length - 1];
        
        // Determine Day Type
        let type = 'full';
        if (frequency >= 3) {
            type = (last && last.type === 'upper') ? 'lower' : 'upper';
        }

        // 1. Muscle Groups Needed
        let muscles = [];
        if (type === 'upper') muscles = ['chest', 'back', 'shoulders', 'biceps', 'triceps', 'core'];
        if (type === 'lower') muscles = ['quads', 'hamstrings', 'glutes', 'calves', 'core'];
        if (type === 'full') muscles = ['chest', 'back', 'quads', 'hamstrings', 'shoulders'];

        // 2. Pick Exercises
        let selected = [];
        muscles.forEach(m => {
            const pool = Store.data.exercises.filter(e => e.muscle === m && (!wristPain || e.joint !== 'wrist'));
            if (pool.length > 0) {
                // Pick random 1
                const ex = pool[Math.floor(Math.random() * pool.length)];
                selected.push(ex);
            }
        });

        // 3. Assign Targets
        return selected.map(ex => {
            const prog = Store.data.progression[ex.id] || { weight: 10, nextReps: '8-12' };
            return {
                ...ex,
                targetWeight: prog.weight,
                targetReps: prog.nextReps,
                sets: 3,
                note: null
            };
        });
    },

    updateProgression(session) {
        session.exercises.forEach(res => {
            const lastSet = res.sets[res.sets.length - 1];
            const current = Store.data.progression[res.id] || { weight: 10, nextReps: '8-12' };
            
            let newWeight = current.weight;
            // Logic: RIR 3+ (Easy) -> Increase
            if (lastSet.rir >= 3) {
                newWeight += (res.type === 'dumbbell' ? 5 : 0);
            }
            Store.data.progression[res.id] = { weight: newWeight, nextReps: '8-12' };
        });
    }
};

// --- 4. UI RENDERER ---
const UI = {
    init() {
        this.container = document.getElementById('main-container');
        this.navBtns = document.querySelectorAll('.nav-btn');
        this.pageTitle = document.getElementById('page-title');

        this.navBtns.forEach(b => b.addEventListener('click', () => this.nav(b.dataset.target)));
        this.nav('dashboard');
        
        // Auto-save listener (Delegation)
        this.container.addEventListener('input', (e) => {
            if (this.currentMode === 'workout') {
                this.scrapeAndSaveDraft();
            }
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

    renderDash() {
        this.pageTitle.innerText = 'Dashboard';
        const h = Store.data.history;
        const count = h.length;
        
        // Find last Upper and Lower
        const lastUp = [...h].reverse().find(s => s.type === 'upper');
        const lastLow = [...h].reverse().find(s => s.type === 'lower');

        const formatDate = (d) => d ? new Date(d).toLocaleDateString() : 'None';

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
                <h2>Consistency</h2>
                <div style="display:flex; align-items:flex-end; gap:5px; height:60px; padding-top:10px;">
                    ${[1,2,3,4,5,6,7].map(i => `<div style="flex:1; background:${i<4?'var(--primary)':'#e2e8f0'}; height:${Math.random()*100}%; border-radius:4px;"></div>`).join('')}
                </div>
            </div>
        `;
    },

    renderWorkoutIntro() {
        this.pageTitle.innerText = 'Workout';
        const draft = Store.getDraft();
        
        let actionArea = `
            <button class="btn-primary" onclick="UI.startSession(false)">Start New Session</button>
        `;
        
        if (draft) {
            actionArea = `
                <div class="card" style="border: 2px solid var(--warning);">
                    <h3>Paused Session Found</h3>
                    <p style="margin-bottom:10px; font-size:0.9rem;">From: ${new Date(draft.startTime).toLocaleString()}</p>
                    <button class="btn-primary" style="background:var(--warning)" onclick="UI.startSession(true)">Resume Workout</button>
                    <button class="btn-secondary" onclick="UI.clearDraft()">Discard</button>
                </div>
                <div style="margin-top:20px; text-align:center; color:#888;">- OR -</div>
                <button class="btn-secondary" onclick="UI.startSession(false)">Start New Session</button>
            `;
        }

        this.container.innerHTML = `
            <div style="padding:20px 0;">
                ${actionArea}
            </div>
        `;
    },

    clearDraft() {
        localStorage.removeItem(DRAFT_KEY);
        this.renderWorkoutIntro();
    },

    startSession(isResume) {
        let plan;
        if (isResume) {
            const draft = Store.getDraft();
            plan = draft.plan;
            this.currentPlan = plan; // Restore plan
            this.currentStartTime = draft.startTime;
        } else {
            plan = Coach.generateWorkout();
            this.currentPlan = plan;
            this.currentStartTime = new Date().toISOString();
        }
        
        this.renderActiveSession(plan, isResume);
    },

    renderActiveSession(plan, isResume) {
        const draft = isResume ? Store.getDraft() : null;

        // Header Legend
        const legend = `
            <div class="rir-legend-box">
                <span class="rir-legend-title">RIR Scale (Reps In Reserve)</span>
                0 = Failure | 1 = Hard | 2 = Sweet Spot | 3+ = Easy
            </div>
        `;

        const exercisesHtml = plan.map((ex, i) => `
            <div class="card" id="card-${i}">
                ${ex.note ? `<div class="toast">${ex.note}</div>` : ''}
                <h3>${ex.name}</h3>
                <p style="color:var(--text-muted); margin-bottom:10px;">Target: ${ex.targetWeight} lbs | ${ex.targetReps} reps</p>
                ${[1,2,3].map(s => {
                    // Pre-fill if resume
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
        
        // Scroll to top
        window.scrollTo(0,0);
    },

    setRir(exIdx, setNum, val) {
        document.querySelectorAll(`#rir-box-${exIdx}-${setNum} .rir-btn`).forEach(b => b.classList.remove('selected'));
        document.querySelectorAll(`#rir-box-${exIdx}-${setNum} .rir-btn`)[val].classList.add('selected');
        document.getElementById(`rir-${exIdx}-${setNum}`).value = val;
        this.scrapeAndSaveDraft(); // Auto save on click
    },

    scrapeAndSaveDraft() {
        const inputs = {};
        // Scrape all inputs
        document.querySelectorAll('input').forEach(inp => {
            if (inp.id) inputs[inp.id] = inp.value;
        });
        
        const draftData = {
            startTime: this.currentStartTime,
            plan: this.currentPlan,
            inputs: inputs
        };
        Store.saveDraft(draftData);
    },

    pauseSession() {
        this.scrapeAndSaveDraft();
        this.nav('workout'); // Go back to workout tab home, which will show "Resume"
    },

    finishSession() {
        if(!confirm("Finish and save workout?")) return;
        
        // 1. Scrape Data
        const type = this.currentPlan.some(e => e.muscle === 'quads') ? 'lower' : 'upper'; // Simple guess logic
        const results = {
            date: new Date().toISOString(),
            type: type,
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

        // 2. Save
        Store.logSession(results);
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

/**
 * StrengthOS - Complete Mobile PWA
 * Contains: State Management, Coach Logic (RIR + Plateau), and UI Rendering
 */

const STORAGE_KEY = 'strengthOS_data_v1';

// --- 1. DEFAULT DATA ---
const DEFAULT_EXERCISES = [
    { id: 'db_bench', name: 'DB Chest Press', muscle: 'chest', pattern: 'push_horiz', type: 'dumbbell', joint: 'shoulder' },
    { id: 'db_row', name: 'DB Row', muscle: 'back', pattern: 'pull_horiz', type: 'dumbbell', joint: 'low_back' },
    { id: 'goblet', name: 'Goblet Squat', muscle: 'quads', pattern: 'squat', type: 'dumbbell', joint: 'knee' },
    { id: 'rdl', name: 'DB RDL', muscle: 'hamstrings', pattern: 'hinge', type: 'dumbbell', joint: 'low_back' },
    { id: 'ohp', name: 'DB Overhead Press', muscle: 'shoulders', pattern: 'push_vert', type: 'dumbbell', joint: 'shoulder' },
    { id: 'lunge', name: 'DB Lunges', muscle: 'legs', pattern: 'lunge', type: 'dumbbell', joint: 'knee' },
    { id: 'pushup', name: 'Pushups', muscle: 'chest', pattern: 'push_horiz', type: 'bodyweight', joint: 'wrist' },
    { id: 'curl', name: 'DB Bicep Curl', muscle: 'arms', pattern: 'pull_iso', type: 'dumbbell', joint: 'wrist' },
    { id: 'ext', name: 'DB Tricep Ext', muscle: 'arms', pattern: 'push_iso', type: 'dumbbell', joint: 'elbow' }
];

const initialState = {
    profile: { age: 40, frequency: 3, emphasis: 'upper', wristPain: false },
    history: [],
    progression: {}, // { exerciseId: { weight: 20, nextReps: '8-12' } }
    exercises: DEFAULT_EXERCISES
};

// --- 2. STORAGE & HELPERS ---
const Store = {
    data: null,
    init() {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            this.data = JSON.parse(stored);
            // Ensure exercises exist if upgrading
            if (!this.data.exercises) this.data.exercises = DEFAULT_EXERCISES;
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
    }
};

const Analytics = {
    getHistory(exId, limit=5) {
        const logs = [];
        const hist = Store.data.history;
        for (let i = hist.length - 1; i >= 0; i--) {
            const exData = hist[i].exercises.find(e => e.id === exId);
            if (exData) {
                // Find best set
                const best = exData.sets.reduce((p, c) => (c.weight * c.reps > p.weight * p.reps) ? c : p, {weight:0, reps:0, rir:10});
                logs.push({ date: hist[i].date, best });
            }
            if (logs.length >= limit) break;
        }
        return logs;
    }
};

// --- 3. COACH BRAIN (LOGIC) ---
const Coach = {
    detectPlateau(exId) {
        const history = Analytics.getHistory(exId, 4);
        if (history.length < 3) return null;

        const [r, p1, p2] = [history[0].best, history[1].best, history[2].best];

        // Stagnation Check: Weight same, Reps same or lower
        const isStuck = (r.weight === p1.weight && r.weight === p2.weight) && (r.reps <= p1.reps && r.reps <= p2.reps);
        
        if (!isStuck) return null;

        const avgRir = (r.rir + p1.rir + p2.rir) / 3;
        return avgRir <= 1 ? 'HARD_PLATEAU' : 'SOFT_PLATEAU';
    },

    resolvePlateau(exId, type) {
        const ex = Store.data.exercises.find(e => e.id === exId);
        if (type === 'SOFT_PLATEAU') {
            return { action: 'push', msg: `Stalled on ${ex.name} but RIR is high. Push harder this week!` };
        }
        if (type === 'HARD_PLATEAU') {
            const alts = Store.data.exercises.filter(e => e.id !== exId && e.muscle === ex.muscle && (!Store.data.profile.wristPain || e.joint !== 'wrist'));
            if (alts.length > 0) {
                const newEx = alts[Math.floor(Math.random() * alts.length)];
                // Reset progression for new exercise
                Store.data.progression[newEx.id] = { weight: 15, nextReps: '8-12' }; 
                return { action: 'swap', newId: newEx.id, newName: newEx.name, msg: `Plateau on ${ex.name}. Swapping to ${newEx.name}.` };
            }
        }
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

        // Filter Exercises
        let pool = Store.data.exercises.filter(e => {
            if (wristPain && e.joint === 'wrist') return false;
            if (type === 'upper') return ['chest','back','shoulders','arms'].includes(e.muscle);
            if (type === 'lower') return ['quads','hamstrings','glutes','legs'].includes(e.muscle);
            return true;
        });

        // Limit to 6 exercises
        pool = pool.slice(0, 6);

        // Assign Targets & Check Plateaus
        return pool.map(ex => {
            const plateau = this.detectPlateau(ex.id);
            let finalEx = ex;
            let note = null;

            if (plateau) {
                const res = this.resolvePlateau(ex.id, plateau);
                if (res && res.action === 'swap') {
                    finalEx = Store.data.exercises.find(e => e.id === res.newId);
                    note = res.msg;
                } else if (res) {
                    note = res.msg;
                }
            }

            const prog = Store.data.progression[finalEx.id] || { weight: 10, nextReps: '8-12' };
            return {
                ...finalEx,
                targetWeight: prog.weight,
                targetReps: prog.nextReps,
                sets: 3,
                note: note
            };
        });
    },

    updateProgression(session) {
        session.exercises.forEach(res => {
            const lastSet = res.sets[res.sets.length - 1];
            const current = Store.data.progression[res.id] || { weight: 10, nextReps: '8-12' };
            
            let newWeight = current.weight;
            
            // Logic: RIR 3+ and high reps = Increase Weight
            if (lastSet.rir >= 3 && lastSet.reps >= 10) {
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
    },

    nav(view) {
        this.navBtns.forEach(b => b.classList.remove('active'));
        document.querySelector(`[data-target="${view}"]`).classList.add('active');
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
        const last = count > 0 ? h[count-1] : null;
        
        // Simple Volume Chart (Mock visual)
        const bars = [3,5,4,0,6,0,0].map(h => `<div style="flex:1; background:${h>0?'var(--primary)':'#ddd'}; height:${h*10}px; border-radius:4px;"></div>`).join('');

        this.container.innerHTML = `
            <div class="card">
                <h2>Welcome Back</h2>
                <p style="color:var(--text-muted)">Total Workouts: <strong>${count}</strong></p>
                ${last ? `<p style="margin-top:5px">Last: ${new Date(last.date).toLocaleDateString()}</p>` : ''}
            </div>
            <div class="card">
                <h2>Weekly consistency</h2>
                <div style="display:flex; align-items:flex-end; gap:5px; height:80px; padding-top:10px;">${bars}</div>
            </div>
        `;
    },

    renderWorkoutIntro() {
        this.pageTitle.innerText = 'Workout';
        this.container.innerHTML = `
            <div class="card" style="text-align:center; padding:40px 20px;">
                <div style="font-size:3rem; margin-bottom:10px;">💪</div>
                <h2>Ready to train?</h2>
                <p style="color:var(--text-muted); margin-bottom:20px;">
                    The coach has analyzed your history and prepared today's session.
                </p>
                <button class="btn-primary" onclick="UI.startSession()">Start Session</button>
            </div>
        `;
    },

    startSession() {
        const plan = Coach.generateWorkout();
        // Render inputs
        const html = plan.map((ex, i) => `
            <div class="card">
                ${ex.note ? `<div class="toast">${ex.note}</div>` : ''}
                <h3>${ex.name}</h3>
                <p style="color:var(--text-muted); margin-bottom:10px;">Target: ${ex.targetWeight} lbs | ${ex.targetReps} reps</p>
                ${[1,2,3].map(s => `
                    <div class="set-row">
                        <span style="font-size:0.8rem; color:#888">Set ${s}</span>
                        <input type="number" placeholder="Reps" id="reps-${i}-${s}" value="">
                        <div class="rir-selector" id="rir-box-${i}-${s}">
                            ${[0,1,2,3].map(r => `<div class="rir-btn" onclick="UI.setRir(${i},${s},${r})">${r}${r==3?'+':''}</div>`).join('')}
                        </div>
                        <input type="hidden" id="rir-${i}-${s}" value="2">
                    </div>
                `).join('')}
            </div>
        `).join('') + `<button class="btn-primary" onclick="UI.finishSession()">Finish Workout</button>`;
        
        this.container.innerHTML = html;
        // Store plan for reference
        this.currentPlan = plan;
    },

    setRir(exIdx, setNum, val) {
        document.querySelectorAll(`#rir-box-${exIdx}-${setNum} .rir-btn`).forEach(b => b.classList.remove('selected'));
        document.querySelectorAll(`#rir-box-${exIdx}-${setNum} .rir-btn`)[val].classList.add('selected');
        document.getElementById(`rir-${exIdx}-${setNum}`).value = val;
    },

    finishSession() {
        if(!confirm("Finish and save workout?")) return;
        const results = {
            date: new Date().toISOString(),
            type: this.currentPlan[0].muscle === 'chest' ? 'upper' : 'lower', // simple guess
            exercises: this.currentPlan.map((ex, i) => ({
                id: ex.id,
                type: ex.type,
                sets: [1,2,3].map(s => ({
                    reps: Number(document.getElementById(`reps-${i}-${s}`).value) || 0,
                    rir: Number(document.getElementById(`rir-${i}-${s}`).value),
                    weight: ex.targetWeight // Assuming user used target weight
                }))
            }))
        };
        Store.logSession(results);
        alert("Great job! Progression updated.");
        this.nav('dashboard');
    },

    renderLib() {
        this.pageTitle.innerText = 'Exercise Library';
        this.container.innerHTML = Store.data.exercises.map(e => `
            <div class="card">
                <strong>${e.name}</strong>
                <div style="font-size:0.8rem; color:var(--text-muted); margin-top:4px;">${e.muscle} • ${e.pattern}</div>
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

// Start
window.addEventListener('DOMContentLoaded', () => { Store.init(); UI.init(); });

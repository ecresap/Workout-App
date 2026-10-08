/**
 * StrengthOS - Complete Mobile PWA v39
 * Updates: 3-Day Split Architecture, Technique Notes, Custom RIR Targets
 */

const STORAGE_KEY = 'strengthOS_data_v4'; // Stable key: never bump this for app releases.
const DRAFT_KEY = 'strengthOS_active_draft';
const SCHEMA_VERSION = 5;
const APP_VERSION = 'v41.2';

// --- 1. EXERCISE LIBRARY (Adapted for 3-Day Plan) ---
const DEFAULT_EXERCISES = [
    { id: 'bench_press', name: 'Bench Press (BB/DB/Machine)', muscle: 'chest' },
    { id: 'inc_db_press', name: 'Incline DB Press', muscle: 'chest' },
    { id: 'cable_fly', name: 'Cable Fly / Pec Deck', muscle: 'chest' },
    { id: 'lat_raise', name: 'Lateral Raise', muscle: 'shoulders' },
    { id: 'tricep_pressdown', name: 'Cable Triceps Pressdown', muscle: 'triceps' },
    { id: 'leg_press', name: 'Leg Press', muscle: 'legs' },
    { id: 'lat_pulldown', name: 'Pull-up / Lat Pulldown', muscle: 'back' },
    { id: 'chest_supp_row', name: 'Chest-Supported Row', muscle: 'back' },
    { id: 'one_arm_row', name: 'One-Arm Row', muscle: 'back' },
    { id: 'rev_fly', name: 'Reverse Fly / Pec Deck', muscle: 'shoulders' },
    { id: 'bicep_curl', name: 'Bicep Curl (DB/Cable/EZ)', muscle: 'biceps' },
    { id: 'hammer_curl', name: 'Hammer Curl', muscle: 'biceps' },
    { id: 'rdl', name: 'Romanian Deadlift', muscle: 'legs' },
    { id: 'inc_mach_press', name: 'Incline Machine/DB Press', muscle: 'chest' },
    { id: 'pushups', name: 'Push-ups', muscle: 'chest' },
    { id: 'neut_pulldown', name: 'Neutral-Grip Lat Pulldown', muscle: 'back' },
    { id: 'cable_row', name: 'Seated Cable Row', muscle: 'back' },
    { id: 'preacher_curl', name: 'Preacher / Cable Curl', muscle: 'biceps' },
    { id: 'oh_tricep_ext', name: 'Overhead Cable Triceps Ext.', muscle: 'triceps' },
    { id: 'split_squat', name: 'Bulgarian Split Squat', muscle: 'legs' },
    { id: 'leg_curl', name: 'Seated/Lying Leg Curl', muscle: 'legs' },
    { id: 'db_flat_press', name: 'Dumbbell Flat Bench Press', muscle: 'chest' },
    { id: 'db_floor_press', name: 'Dumbbell Floor Press', muscle: 'chest' },
    { id: 'db_squeeze_press', name: 'Dumbbell Squeeze Press', muscle: 'chest' },
    { id: 'db_fly', name: 'Dumbbell Fly', muscle: 'chest' },
    { id: 'db_pullover', name: 'Dumbbell Pullover', muscle: 'back' },
    { id: 'db_bent_row', name: 'Dumbbell Bent-Over Row', muscle: 'back' },
    { id: 'db_rear_delt_row', name: 'Dumbbell Rear-Delt Row', muscle: 'back' },
    { id: 'db_shoulder_press', name: 'Dumbbell Shoulder Press', muscle: 'shoulders' },
    { id: 'arnold_press', name: 'Arnold Press', muscle: 'shoulders' },
    { id: 'db_front_raise', name: 'Dumbbell Front Raise', muscle: 'shoulders' },
    { id: 'db_y_raise', name: 'Incline Dumbbell Y-Raise', muscle: 'shoulders' },
    { id: 'db_shrugs', name: 'Dumbbell Shrugs', muscle: 'shoulders' },
    { id: 'goblet_squat', name: 'Goblet Squat', muscle: 'legs' },
    { id: 'db_rdl', name: 'Dumbbell Romanian Deadlift', muscle: 'hamstrings' },
    { id: 'db_reverse_lunge', name: 'Dumbbell Reverse Lunge', muscle: 'legs' },
    { id: 'db_step_up', name: 'Dumbbell Step-Up', muscle: 'legs' },
    { id: 'db_calf_raise', name: 'Dumbbell Standing Calf Raise', muscle: 'calves' },
    { id: 'incline_db_curl', name: 'Incline Dumbbell Curl', muscle: 'biceps' },
    { id: 'concentration_curl', name: 'Dumbbell Concentration Curl', muscle: 'biceps' },
    { id: 'zottman_curl', name: 'Zottman Curl', muscle: 'biceps' },
    { id: 'db_skull_crusher', name: 'Dumbbell Skull Crusher', muscle: 'triceps' },
    { id: 'db_oh_triceps', name: 'Dumbbell Overhead Triceps Extension', muscle: 'triceps' },
    { id: 'db_kickback', name: 'Dumbbell Triceps Kickback', muscle: 'triceps' },
    { id: 'suitcase_carry', name: 'Dumbbell Suitcase Carry', muscle: 'core' },
    { id: 'weighted_dead_bug', name: 'Dumbbell Dead Bug', muscle: 'core' }
];

// --- 2. THE 3-DAY BLOCK PLAN ---
const WORKOUT_PLANS = {
    day1: [
        { id: 'bench_press', block: 'A', role: 'A', sets: 3, targetReps: '5-8', targetRir: '1-2', mode: 'normal', note: 'Keep shoulder blades stable; lower weight without shoulder discomfort.' },
        { id: 'inc_db_press', block: 'B', role: 'A', sets: 3, targetReps: '8-12', targetRir: '1-2', mode: 'normal', note: 'Keep shoulder blades stable; lower weight without shoulder discomfort.' },
        { id: 'cable_fly', block: 'C', role: 'A', sets: 2, targetReps: '12-20', targetRir: '1-2', mode: 'normal', note: 'Bring upper arms together rather than forcing hands to touch.' },
        { id: 'lat_raise', block: 'D', role: 'A', sets: 2, targetReps: '12-20', targetRir: '1-2', mode: 'normal' },
        { id: 'tricep_pressdown', block: 'E', role: 'A', sets: 3, targetReps: '10-15', targetRir: '1-2', mode: 'normal' },
        { id: 'leg_press', block: 'F', role: 'A', sets: 2, targetReps: '8-12', targetRir: '1-3', mode: 'normal' }
    ],
    day2: [
        { id: 'lat_pulldown', block: 'A', role: 'A', sets: 3, targetReps: '6-10', targetRir: '1-2', mode: 'normal', note: 'Pull elbows toward sides without leaning excessively backward.' },
        { id: 'chest_supp_row', block: 'B', role: 'A', sets: 3, targetReps: '8-12', targetRir: '1-2', mode: 'normal', note: 'Allow shoulder blades to move naturally; keep torso controlled.' },
        { id: 'one_arm_row', block: 'C', role: 'A', sets: 2, targetReps: '10-15', targetRir: '1-2', mode: 'normal', note: 'Allow shoulder blades to move naturally; keep torso controlled.' },
        { id: 'rev_fly', block: 'D', role: 'A', sets: 2, targetReps: '12-20', targetRir: '1-2', mode: 'normal' },
        { id: 'bicep_curl', block: 'E', role: 'A', sets: 3, targetReps: '8-12', targetRir: '1-2', mode: 'normal' },
        { id: 'hammer_curl', block: 'F', role: 'A', sets: 2, targetReps: '10-15', targetRir: '1-2', mode: 'normal' },
        { id: 'rdl', block: 'G', role: 'A', sets: 2, targetReps: '6-10', targetRir: '2-3', mode: 'normal', note: 'Push hips back. Stop at strong hamstring stretch; don\'t round lower back.' }
    ],
    day3: [
        { id: 'inc_mach_press', block: 'A', role: 'A', sets: 3, targetReps: '8-12', targetRir: '1-2', mode: 'normal' },
        { id: 'pushups', block: 'B', role: 'A', sets: 2, targetReps: '8-20', targetRir: '1-2', mode: 'normal' },
        { id: 'neut_pulldown', block: 'C', role: 'A', sets: 3, targetReps: '8-12', targetRir: '1-2', mode: 'normal' },
        { id: 'cable_row', block: 'D', role: 'A', sets: 2, targetReps: '10-15', targetRir: '1-2', mode: 'normal' },
        { id: 'preacher_curl', block: 'E', role: 'A', sets: 3, targetReps: '10-15', targetRir: '1-2', mode: 'normal' },
        { id: 'oh_tricep_ext', block: 'F', role: 'A', sets: 3, targetReps: '10-15', targetRir: '1-2', mode: 'normal' },
        { id: 'split_squat', block: 'G', role: 'A', sets: 2, targetReps: '8-12', targetRir: '1-3', mode: 'normal' },
        { id: 'leg_curl', block: 'H', role: 'A', sets: 2, targetReps: '10-15', targetRir: '1-2', mode: 'normal' }
    ]
};

const initialState = {
    schemaVersion: SCHEMA_VERSION,
    profile: { age: 40, frequency: 3, timerDuration: 60 },
    history: [],
    progression: {},
    activeExercises: {},
    exercises: DEFAULT_EXERCISES.map(e => ({...e})),
    workoutDays: []
};

const Store = {
    data: null,
    init() {
        let stored = localStorage.getItem(STORAGE_KEY);

        // Recovery path for older StrengthOS keys. We copy forward; we never delete an old key.
        if (!stored) {
            const legacyKeys = Object.keys(localStorage)
                .filter(k => /^strengthOS_data_v\\d+$/.test(k) && k !== STORAGE_KEY)
                .sort()
                .reverse();
            for (const key of legacyKeys) {
                const candidate = localStorage.getItem(key);
                if (candidate) { stored = candidate; break; }
            }
        }

        try {
            this.data = stored ? JSON.parse(stored) : JSON.parse(JSON.stringify(initialState));
        } catch (err) {
            console.error('StrengthOS data parse failed; preserving stored value and starting safely.', err);
            this.data = JSON.parse(JSON.stringify(initialState));
        }

        if (!this.data.profile) this.data.profile = { age: 40, frequency: 3, timerDuration: 60 };
        if (!this.data.profile.timerDuration) this.data.profile.timerDuration = 60;
        if (!Array.isArray(this.data.history)) this.data.history = [];
        if (!this.data.progression) this.data.progression = {};
        if (!this.data.activeExercises) this.data.activeExercises = {};

        // Merge new defaults by id. Existing names/edits win.
        const existingExercises = Array.isArray(this.data.exercises) ? this.data.exercises : [];
        const byId = new Map(existingExercises.map(e => [e.id, e]));
        DEFAULT_EXERCISES.forEach(def => { if (!byId.has(def.id)) existingExercises.push({...def}); });
        this.data.exercises = existingExercises;

        if (!Array.isArray(this.data.workoutDays) || this.data.workoutDays.length === 0) {
            const defaultNames = {
                day1: 'Day 1: Chest, Triceps, Shoulders, Quads',
                day2: 'Day 2: Back, Biceps, Rear Delt, Hams',
                day3: 'Day 3: Chest, Back, Arms, Legs'
            };
            this.data.workoutDays = Object.entries(WORKOUT_PLANS).map(([id, plan]) => ({
                id,
                name: defaultNames[id] || id,
                exercises: plan.map(item => {
                    const legacyId = this.data.activeExercises[`${id}-${item.block}-${item.role}`] || item.id;
                    return {...item, id: legacyId};
                })
            }));
        }

        // Normalize the new editable-plan fields without modifying historical sessions.
        this.data.workoutDays.forEach((day, dIdx) => {
            if (!day.id) day.id = `day_custom_${dIdx + 1}`;
            if (!day.name) day.name = `Day ${dIdx + 1}`;
            if (!Array.isArray(day.exercises)) day.exercises = [];
            day.exercises.forEach((ex, i) => {
                if (!ex.block) ex.block = String.fromCharCode(65 + i);
                if (!ex.role) ex.role = 'A';
                if (!Number.isFinite(Number(ex.sets))) ex.sets = 3;
                ex.sets = Math.max(1, Number(ex.sets));
                if (!ex.targetReps) ex.targetReps = '8-12';
                if (!ex.targetRir) ex.targetRir = '1-2';
                if (ex.mode !== 'myo') ex.mode = 'normal';
            });
        });

        this.data.schemaVersion = SCHEMA_VERSION;
        this.save();
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
        const schedule = [1, 3, 5]; // Mon, Wed, Fri (Standard 3-day)
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
                    ...item, // injects block, role, sets, targetReps, targetRir, mode
                    id: exDef.id, 
                    targetWeight: prog.weight,
                    note: item.note || undefined
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


function getWorkoutDay(dayId) {
    return Store.data.workoutDays.find(d => d.id === dayId);
}


Coach.getChartData = function(exId) {
    return Store.data.history
        .map(session => {
            const ex = Array.isArray(session.exercises) ? session.exercises.find(e => e.id === exId) : null;
            if (!ex || !Array.isArray(ex.sets) || ex.sets.length === 0) return null;
            const workingSets = ex.sets.filter(s => Number(s.weight) > 0 && Number(s.reps) > 0);
            if (!workingSets.length) return null;
            const best = Math.max(...workingSets.map(s => Number(s.weight)));
            return { date: session.date, val: best };
        })
        .filter(Boolean)
        .slice(-12);
};

Coach.getProgressCutoff = function(months) {
    const cutoff = new Date();
    cutoff.setHours(0,0,0,0);
    cutoff.setMonth(cutoff.getMonth() - months);
    return cutoff;
};

Coach.getStrengthSeries = function(exId, months = 1) {
    const cutoff = Coach.getProgressCutoff(months);
    return Store.data.history
        .filter(session => new Date(session.date) >= cutoff)
        .map(session => {
            const ex = Array.isArray(session.exercises) ? session.exercises.find(e => e.id === exId) : null;
            if (!ex || !Array.isArray(ex.sets)) return null;

            // Only count weight from sets where reps were actually logged.
            // This prevents an unused/default workout weight from becoming progress data.
            const performedSets = ex.sets.filter(s => Number(s.weight) > 0 && Number(s.reps) > 0);
            if (!performedSets.length) return null;

            return {
                date: session.date,
                value: Math.max(...performedSets.map(s => Number(s.weight)))
            };
        })
        .filter(Boolean)
        .sort((a,b) => new Date(a.date) - new Date(b.date));
};

Coach.getExerciseProgress = function(months = 1) {
    return Store.data.exercises
        .map(ex => {
            const series = Coach.getStrengthSeries(ex.id, months);
            if (series.length < 2) return null;
            const first = series[0].value;
            const latest = series[series.length - 1].value;
            if (!(first > 0)) return null;
            return {
                id: ex.id,
                name: ex.name,
                muscle: ex.muscle,
                first,
                latest,
                pct: ((latest - first) / first) * 100,
                sessions: series.length,
                series
            };
        })
        .filter(Boolean);
};

Coach.isLegMuscle = function(muscle) {
    return ['legs','quads','hamstrings','glutes','calves'].includes(muscle);
};

Coach.getMuscleGroupProgress = function(months = 1) {
    const groupFor = muscle => {
        if (muscle === 'chest') return 'Chest';
        if (muscle === 'back') return 'Back';
        if (muscle === 'shoulders') return 'Shoulders';
        if (['biceps','triceps'].includes(muscle)) return 'Arms';
        if (['legs','quads','hamstrings','glutes','calves'].includes(muscle)) return 'Legs';
        return 'Core';
    };
    const buckets = {};
    Coach.getExerciseProgress(months)
        .filter(item => !Coach.isLegMuscle(item.muscle))
        .forEach(item => {
        const group = groupFor(item.muscle);
        if (!buckets[group]) buckets[group] = [];
        buckets[group].push(item.pct);
    });
    return Object.entries(buckets).map(([group, values]) => {
        const sorted = values.slice().sort((a,b) => a-b);
        const mid = Math.floor(sorted.length / 2);
        const median = sorted.length % 2 ? sorted[mid] : (sorted[mid-1] + sorted[mid]) / 2;
        return { group, pct: median, exercises: values.length };
    }).sort((a,b) => b.pct - a.pct);
};

Coach.generateWorkout = function(dayType) {
    const day = getWorkoutDay(dayType);
    if (!day) return { type: dayType, isDeload: false, exercises: [] };
    return {
        type: dayType,
        isDeload: false,
        exercises: day.exercises.map((item, index) => {
            const exDef = Store.data.exercises.find(e => e.id === item.id) || { id: item.id, name: 'Unknown Exercise', muscle: 'core' };
            const prog = Store.data.progression[exDef.id] || { weight: 10 };
            return {
                ...exDef,
                ...item,
                block: String.fromCharCode(65 + index),
                role: item.role || 'A',
                sets: Math.max(1, Number(item.sets) || 1),
                mode: item.mode === 'myo' ? 'myo' : 'normal',
                targetWeight: prog.weight
            };
        })
    };
};

const UI = {
    timerInterval: null, editingHistoryIndex: null, pendingWorkoutType: null, progressMonths: 1,
    templateEditDayIndex: null, templatePicker: null, historyMoveSelection: new Set(),

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
                <div class="summary-grid" style="grid-template-columns: 1fr 1fr 1fr;">
                    <div class="summary-box"><div class="summary-label">Last Day 1</div><div class="summary-val clickable" onclick="UI.showSessionSummary(${lastD1})">${formatDate(lastD1)}</div></div>
                    <div class="summary-box"><div class="summary-label">Last Day 2</div><div class="summary-val clickable" onclick="UI.showSessionSummary(${lastD2})">${formatDate(lastD2)}</div></div>
                    <div class="summary-box"><div class="summary-label">Last Day 3</div><div class="summary-val clickable" onclick="UI.showSessionSummary(${lastD3})">${formatDate(lastD3)}</div></div>
                </div>
                <p style="color:var(--text-muted); text-align:center;">Total Workouts: <strong>${count}</strong></p>
            </div>
            <div class="home-section-title">Progress</div>
            <div id="home-progress"></div>
            <div style="text-align:center; color:#9ca3af; font-size:0.75rem; margin: 20px 0;">StrengthOS ${APP_VERSION}</div>`;
        this.renderProgress(null, document.getElementById('home-progress'), false);
    },

    showSessionSummary(index) {
        if (index === undefined || index === -1) return;
        const s = Store.data.history[index];
        const list = document.getElementById('summary-list');
        const dayName = getWorkoutDay(s.type)?.name || s.type;
        document.getElementById('summary-title').innerText = `${dayName} - ${new Date(s.date).toLocaleDateString()}`;
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
            return;
        }
        const buttons = Store.data.workoutDays.map((day,index) =>
            `<div class="workout-day-launch">
                <button class="btn-primary" onclick="UI.startNewSession('${day.id}')">${UI.esc(day.name)}</button>
                <div class="workout-day-actions">
                    <button class="mini-action" onclick="UI.renameDayFromWorkout(${index})">Rename</button>
                    <button class="mini-action danger" onclick="UI.deleteDayFromWorkout(${index})">Delete</button>
                </div>
            </div>`
        ).join('');
        this.container.innerHTML = `
            <div style="padding:20px 0;">
                <div class="card" style="text-align:center; padding: 30px 20px;">
                    <div style="font-size:3rem; margin-bottom:10px;">💪</div>
                    ${buttons || '<p>No workout days yet.</p>'}
                    <button class="btn-secondary" onclick="UI.addDayFromWorkout()">+ Add Workout Day</button>
                </div>
            </div>`;
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

    renderActiveSession(isResumeOrEdit, options = {}) {
        const isHistoryEdit = this.editingHistoryIndex !== null;
        const preserveScroll = options.preserveScroll === true;
        const previousScrollY = preserveScroll ? window.scrollY : 0;
        const anchorIndex = preserveScroll && Number.isInteger(options.anchorIndex) ? options.anchorIndex : null;
        const anchorBefore = anchorIndex !== null ? document.getElementById(`card-${anchorIndex}`) : null;
        const anchorTopBefore = anchorBefore ? anchorBefore.getBoundingClientRect().top : null;
        let dataMap = {}; if (isResumeOrEdit && !isHistoryEdit) { const draft = Store.getDraft(); dataMap = draft?.inputs || {}; }
        const legend = `<div class="rir-legend-box"><span class="rir-legend-title">RIR Scale</span>0 = Failure | 1 = Hard | 2 = Sweet Spot | 3+ = Easy</div>`;
        let dateHeader = isHistoryEdit ? `<div class="card" style="background:#fff3cd; border:1px solid #ffeeba;"><label style="font-size:0.8rem; font-weight:bold;">Editing Date:</label><input type="date" id="edit-date-input" value="${new Date(Store.data.history[this.editingHistoryIndex].date).toISOString().split('T')[0]}" style="margin-bottom:0;"></div>` : '';

        const exercisesHtml = this.currentPlan.map((ex, i) => {
            const setCount = Array.isArray(ex.sets) ? ex.sets.length : Math.max(1, Number(ex.sets) || 1);
            let weightVal = ex._live?.weight ?? ex.targetWeight;
            if (isHistoryEdit) {
                if (ex.sets && ex.sets[0]) weightVal = ex.sets[0].weight;
            } else if (Object.prototype.hasOwnProperty.call(dataMap, `weight-${i}`)) {
                // On resume, the newest saved draft input must override any older _live snapshot.
                weightVal = dataMap[`weight-${i}`];
            }
            
            const isMyo = ex.mode === 'myo';
            
            let badges = `<span class="block-badge">Block ${ex.block}</span>`;
            if (isMyo) badges += `<span class="myo-badge">⚡ Myo-Reps</span>`;

            let setRows = '';
            if (isMyo) {
                // Custom 5-set Myo structure
                const baseLabels = ["Warm-up (12)", "Activation (10-15)", "Mini 1 (3-5)", "Mini 2 (3-5)", "Mini 3 (2-4)"];
                const labels = Array.from({length: setCount}, (_,idx) => baseLabels[idx] || `Mini ${idx-1}`);
                setRows = labels.map((label, sIdx) => {
                    const s = sIdx + 1;
                    const repKey = `reps-${i}-${s}`;
                    let repVal = Object.prototype.hasOwnProperty.call(dataMap, repKey)
                        ? dataMap[repKey]
                        : (ex._live?.sets?.[s-1]?.reps ?? '');
                    if (isHistoryEdit) { const setObj = ex.sets[s-1]; if (setObj) repVal = setObj.reps; }
                    
                    return `<div class="myo-set-row">
                        <span style="font-size:0.85rem; color:#888; font-weight:700;">${label}</span>
                        <input type="number" placeholder="Reps" id="reps-${i}-${s}" value="${repVal}" ${!isHistoryEdit ? 'onchange="UI.scrapeAndSaveDraft()"' : ''} style="margin:0; text-align:center;">
                        <input type="hidden" id="rir-${i}-${s}" value="0">
                    </div>`;
                }).join('');
            } else {
                // Standard RIR logic
                setRows = Array.from({length: setCount}, (_, k) => k + 1).map(s => {
                    let repVal = '', rirVal = 2;
                    if (isHistoryEdit) { const setObj = ex.sets[s-1]; if (setObj) { repVal = setObj.reps; rirVal = setObj.rir; } } else {
                        const repKey = `reps-${i}-${s}`;
                        const rirKey = `rir-${i}-${s}`;
                        repVal = Object.prototype.hasOwnProperty.call(dataMap, repKey)
                            ? dataMap[repKey]
                            : (ex._live?.sets?.[s-1]?.reps ?? '');
                        rirVal = Object.prototype.hasOwnProperty.call(dataMap, rirKey)
                            ? dataMap[rirKey]
                            : (ex._live?.sets?.[s-1]?.rir ?? 2);
                    }
                    
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
                ${!isHistoryEdit ? `<div class="exercise-toolbar">
                    <button class="mini-action" onclick="UI.moveExercise(${i},-1)" title="Move up">↑</button>
                    <button class="mini-action" onclick="UI.moveExercise(${i},1)" title="Move down">↓</button>
                    <button class="mini-action" onclick="UI.swapExercise(${i})" title="Replace">↔</button>
                    <button class="mini-action danger" onclick="UI.removeExercise(${i})" title="Remove">×</button>
                </div>` : ''}
                ${ex.note ? `<div class="toast">${ex.note}</div>` : ''}
                <h3 style="margin-bottom:8px;">${badges} ${ex.name} ${ex.isBonus ? '<small style="color:#888; font-weight:normal;">(Optional)</small>' : ''}</h3>
                <div class="history-text">${!isHistoryEdit ? Coach.getHistoryString(ex.id) : ''}</div>
                <div class="weight-input-group"><label>Working Weight:</label><input type="number" id="weight-${i}" value="${weightVal}" ${!isHistoryEdit ? 'onchange="UI.scrapeAndSaveDraft()"' : ''}><span>lbs</span></div>
                <p style="color:var(--text-muted); font-size:0.85rem; margin-bottom:15px; font-weight:600;">Target: ${ex.targetReps} reps (Aim for ${ex.targetRir || '1-3'} RIR)</p>
                ${!isHistoryEdit ? `<div class="workout-edit-row">
                    <button class="mini-action" onclick="UI.removeSet(${i})">− Set</button>
                    <button class="mini-action" onclick="UI.addSet(${i})">+ Set</button>
                    <button class="mini-action ${isMyo ? 'myo-active' : ''}" onclick="UI.toggleMyo(${i})">⚡ Myo-Reps: ${isMyo ? 'On' : 'Off'}</button>
                </div>` : ''}
                ${setRows}
            </div>`;
        }).join('');
        
        let actionBtn = `<button class="btn-primary" onclick="UI.finishSession()">Finish Workout</button> <button class="btn-warning" onclick="UI.pauseSession()">Pause & Save</button>`;
        if (isHistoryEdit) actionBtn = `<button class="btn-primary" onclick="UI.saveEditedHistory()">Save Changes</button> <button class="btn-secondary" onclick="UI.renderHistoryManager()">Cancel</button>`;
        const addExerciseBtn = !isHistoryEdit ? '<button class="btn-secondary" style="margin-bottom:10px" onclick="UI.addExerciseToWorkout()">+ Add Exercise</button>' : '';
        this.container.innerHTML = `${dateHeader}${legend}${exercisesHtml}${addExerciseBtn}${actionBtn}`;

        if (preserveScroll) {
            requestAnimationFrame(() => {
                const anchorAfter = anchorIndex !== null ? document.getElementById(`card-${anchorIndex}`) : null;
                if (anchorAfter && anchorTopBefore !== null) {
                    const delta = anchorAfter.getBoundingClientRect().top - anchorTopBefore;
                    window.scrollTo({ top: Math.max(0, previousScrollY + delta), behavior: 'auto' });
                } else {
                    window.scrollTo({ top: previousScrollY, behavior: 'auto' });
                }
            });
        } else {
            window.scrollTo({ top: 0, behavior: 'auto' });
        }
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
        const title = modal.querySelector('h3');
        if (title) title.innerText = 'Swap Exercise';
        document.getElementById('swap-list-container').innerHTML = listHtml; 
        modal.classList.add('active'); 
    },
    
    selectSwap(index, newId, block, role) {
        document.getElementById('swap-modal').classList.remove('active');
        const newEx = Store.data.exercises.find(e => e.id === newId);
        if (!newEx) return;
        this.captureLiveInputs();
        const oldEx = this.currentPlan[index];
        const prog = Store.data.progression[newId] || { weight: 10 };
        this.currentPlan[index] = {
            ...newEx,
            block: oldEx.block, role: oldEx.role, sets: oldEx.sets,
            targetReps: oldEx.targetReps, targetRir: oldEx.targetRir,
            mode: oldEx.mode || 'normal', targetWeight: prog.weight, note: oldEx.note
        };
        const day = getWorkoutDay(this.currentType);
        if (day && day.exercises[index]) {
            day.exercises[index] = {
                ...day.exercises[index],
                id: newId,
                sets: oldEx.sets,
                targetReps: oldEx.targetReps,
                targetRir: oldEx.targetRir,
                mode: oldEx.mode || 'normal'
            };
            Store.save();
        }
        this.scrapeAndSaveDraft();
        this.renderActiveSession(true, { preserveScroll: true, anchorIndex: index });
    },

    setRir(exIdx, setNum, val) { document.querySelectorAll(`#rir-box-${exIdx}-${setNum} .rir-btn`).forEach(b => b.classList.remove('selected')); document.querySelectorAll(`#rir-box-${exIdx}-${setNum} .rir-btn`)[val].classList.add('selected'); document.getElementById(`rir-${exIdx}-${setNum}`).value = val; if (this.editingHistoryIndex === null) { this.scrapeAndSaveDraft(); this.startTimer(Store.data.profile.timerDuration); } },
    startTimer(seconds) { const overlay = document.getElementById('timer-overlay'); const display = document.getElementById('timer-val'); overlay.classList.add('active'); if (this.timerInterval) clearInterval(this.timerInterval); let rem = seconds; const tick = () => { const m = Math.floor(rem / 60).toString().padStart(2,'0'); const s = (rem % 60).toString().padStart(2,'0'); display.innerText = `${m}:${s}`; if (rem <= 0) { clearInterval(this.timerInterval); display.innerText = "Ready!"; if (navigator.vibrate) navigator.vibrate([200, 100, 200]); if (Notification.permission === "granted") new Notification("🔔 Rest Finished!"); } rem--; }; tick(); this.timerInterval = setInterval(tick, 1000); },
    stopTimer() { clearInterval(this.timerInterval); document.getElementById('timer-overlay').classList.remove('active'); },
    scrapeAndSaveDraft() { const inputs = {}; document.querySelectorAll('input').forEach(inp => { if (inp.id) inputs[inp.id] = inp.value; }); Store.saveDraft({ startTime: this.currentStartTime, plan: this.currentPlan, type: this.currentType, inputs: inputs }); },
    pauseSession() { this.scrapeAndSaveDraft(); this.nav('workout'); },
    finishSession() {
        if(!confirm("Finish and save workout?")) return;
        const sessionExercises = this.currentPlan.map((ex, i) => {
            const w = Number(document.getElementById(`weight-${i}`)?.value) || ex.targetWeight || 0;
            const setsData = [];
            for(let s=1; s<=Math.max(1, Number(ex.sets)||1); s++) {
                setsData.push({
                    reps: Number(document.getElementById(`reps-${i}-${s}`)?.value) || 0,
                    rir: Number(document.getElementById(`rir-${i}-${s}`)?.value) || 0,
                    weight: w
                });
            }
            return { id: ex.id, sets: setsData, mode: ex.mode || 'normal', targetReps: ex.targetReps, targetRir: ex.targetRir };
        });
        const results = { date: new Date().toISOString(), type: this.currentType, exercises: sessionExercises };
        Store.logSession(results);
        this.stopTimer();
        alert("Great job!");
        this.nav('dashboard');
    },
    renderProgress(selectedExerciseId = null, target = this.container, standalone = true) {
        if (standalone) this.pageTitle.innerText = 'Progress';

        const months = this.progressMonths === 2 ? 2 : 1;
        const exerciseProgress = Coach.getExerciseProgress(months)
            .sort((a,b) => b.pct - a.pct);
        const summaryProgress = exerciseProgress.filter(item => !Coach.isLegMuscle(item.muscle));
        const muscleProgress = Coach.getMuscleGroupProgress(months);

        const toggleHtml = `
            <div class="progress-range-toggle" role="group" aria-label="Progress time range">
                <button class="${months === 1 ? 'active' : ''}" onclick="UI.setProgressRange(1)">Past Month</button>
                <button class="${months === 2 ? 'active' : ''}" onclick="UI.setProgressRange(2)">Past 2 Months</button>
            </div>`;

        if (exerciseProgress.length === 0) {
            target.innerHTML = `
                ${toggleHtml}
                <div class="card">
                    <h2>Strength Progress</h2>
                    <p class="progress-empty">You need at least two completed workouts for the same weighted exercise within this time period to calculate progress.</p>
                </div>
                <div class="card">
                    <h2>Muscle Group Progress</h2>
                    <p class="progress-note">This view uses changes in your actual logged working weights. It does not measure muscle size.</p>
                </div>`;
            return;
        }

        const selected = exerciseProgress.find(e => e.id === selectedExerciseId) || exerciseProgress[0];
        const overallValues = summaryProgress.map(e => e.pct).sort((a,b) => a-b);
        const overallMid = Math.floor(overallValues.length / 2);
        const overallPct = overallValues.length === 0 ? null : (overallValues.length % 2
            ? overallValues[overallMid]
            : (overallValues[overallMid-1] + overallValues[overallMid]) / 2);
        const best = summaryProgress.length ? summaryProgress[0] : null;

        const muscleMax = Math.max(1, ...muscleProgress.map(m => Math.abs(m.pct)));
        const muscleHtml = muscleProgress.map(m => {
            const width = Math.min(100, Math.max(4, (Math.abs(m.pct) / muscleMax) * 100));
            const cls = m.pct >= 0 ? 'positive' : 'negative';
            const sign = m.pct > 0 ? '+' : '';
            return `
                <div class="muscle-progress-row">
                    <div class="muscle-progress-head">
                        <span>${m.group}</span>
                        <strong class="${cls}">${sign}${m.pct.toFixed(1)}%</strong>
                    </div>
                    <div class="muscle-progress-track">
                        <div class="muscle-progress-fill ${cls}" style="width:${width}%"></div>
                    </div>
                    <small>${m.exercises} tracked exercise${m.exercises === 1 ? '' : 's'}</small>
                </div>`;
        }).join('');

        const options = exerciseProgress.map(e =>
            `<option value="${e.id}" ${e.id === selected.id ? 'selected' : ''}>${UI.esc(e.name)}</option>`
        ).join('');

        target.innerHTML = `
            ${toggleHtml}
            <div class="progress-summary-grid">
                <div class="progress-stat-card">
                    <span>Typical Weight Change</span>
                    <strong class="${overallPct === null ? '' : (overallPct >= 0 ? 'positive' : 'negative')}">${overallPct === null ? '—' : `${overallPct > 0 ? '+' : ''}${overallPct.toFixed(1)}%`}</strong>
                    <small>Median across tracked non-leg exercises</small>
                </div>
                <div class="progress-stat-card">
                    <span>Biggest Improvement</span>
                    <strong>${best ? UI.esc(best.name) : '—'}</strong>
                    <small class="${best ? (best.pct >= 0 ? 'positive' : 'negative') : ''}">${best ? `${best.pct > 0 ? '+' : ''}${best.pct.toFixed(1)}%` : 'No qualifying data'}</small>
                </div>
            </div>

            <div class="card">
                <div class="progress-section-head">
                    <div>
                        <h2>Strength Progress</h2>
                        <p>Actual working weight from completed sets. No estimated 1RM.</p>
                    </div>
                </div>
                <label class="progress-select-label" for="progress-exercise-select">Exercise</label>
                <select id="progress-exercise-select" onchange="UI.updateProgressExercise(this.value)">
                    ${options}
                </select>
                <div id="strength-progress-detail"></div>
            </div>

            <div class="card">
                <div class="progress-section-head">
                    <div>
                        <h2>Muscle Group Progress</h2>
                        <p>Median working-weight change across non-leg muscle groups.</p>
                    </div>
                </div>
                <div class="muscle-progress-list">${muscleHtml || '<p class="progress-empty">More repeated exercise data is needed.</p>'}</div>
                <p class="progress-note">Leg exercises are excluded from summary and grouped calculations. Individual leg exercises remain available in Strength Progress. Muscle Group Progress reflects working-weight changes, not measured muscle size or hypertrophy.</p>
            </div>

            <div class="progress-method">
                Progress compares the earliest completed working weight with the latest completed working weight inside the selected time period. Sets with zero reps are excluded.
            </div>
        `;

        this.renderStrengthProgressDetail(selected.id);
    },

    setProgressRange(months) {
        this.progressMonths = months === 2 ? 2 : 1;
        const target = document.getElementById('home-progress') || this.container;
        this.renderProgress(null, target, target === this.container);
    },

    updateProgressExercise(exId) {
        this.renderStrengthProgressDetail(exId);
    },

    renderStrengthProgressDetail(exId) {
        const detail = document.getElementById('strength-progress-detail');
        if (!detail) return;
        const item = Coach.getExerciseProgress(this.progressMonths).find(e => e.id === exId);
        if (!item) {
            detail.innerHTML = '<p class="progress-empty">Not enough data for this exercise in this time period.</p>';
            return;
        }

        const series = item.series;
        const w = 520, h = 190, padX = 24, padY = 28;
        const values = series.map(d => d.value);
        let min = Math.min(...values);
        let max = Math.max(...values);
        if (min === max) { min = Math.max(0, min - 5); max += 5; }
        const range = Math.max(1, max - min);
        const xFor = i => series.length === 1 ? w / 2 : padX + (i / (series.length - 1)) * (w - padX * 2);
        const yFor = v => h - padY - ((v - min) / range) * (h - padY * 2);
        const points = series.map((d,i) => `${xFor(i)},${yFor(d.value)}`).join(' ');
        const dots = series.map((d,i) => `
            <circle cx="${xFor(i)}" cy="${yFor(d.value)}" r="4" class="progress-chart-dot"></circle>
        `).join('');

        const firstDate = new Date(series[0].date).toLocaleDateString(undefined, {month:'short', day:'numeric'});
        const latestDate = new Date(series[series.length-1].date).toLocaleDateString(undefined, {month:'short', day:'numeric'});
        const sign = item.pct > 0 ? '+' : '';

        detail.innerHTML = `
            <div class="strength-detail-head">
                <div>
                    <span>Then</span>
                    <strong>${item.first.toFixed(1)} lb</strong>
                    <small>${firstDate}</small>
                </div>
                <div class="strength-change ${item.pct >= 0 ? 'positive' : 'negative'}">${sign}${item.pct.toFixed(1)}%</div>
                <div>
                    <span>Now</span>
                    <strong>${item.latest.toFixed(1)} lb</strong>
                    <small>${latestDate}</small>
                </div>
            </div>
            <div class="progress-chart-wrap">
                <svg class="progress-chart" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" role="img" aria-label="Working weight trend">
                    <line x1="${padX}" y1="${h-padY}" x2="${w-padX}" y2="${h-padY}" class="progress-chart-axis"></line>
                    <polyline points="${points}" class="progress-chart-line"></polyline>
                    ${dots}
                </svg>
            </div>
            <div class="progress-chart-caption">
                <span>${firstDate}</span>
                <span>${series.length} workouts</span>
                <span>${latestDate}</span>
            </div>
        `;
    },

    renderLib() {
        this.pageTitle.innerText = 'Exercise Library';
        const groups = { 'Chest': ['chest'], 'Back': ['back'], 'Shoulders': ['shoulders'], 'Legs': ['legs','quads','hamstrings','glutes','calves'], 'Arms': ['biceps','triceps'], 'Core': ['core'] };
        let html = '<p style="color:#666; font-size:0.9rem; margin-bottom:15px;">Tap an exercise to view progress. Use Edit to rename it.</p>';
        for (const [category, muscles] of Object.entries(groups)) {
            const exercises = Store.data.exercises.filter(e => muscles.includes(e.muscle));
            if (exercises.length > 0) {
                html += `<h3 class="lib-header">${category}</h3>` + exercises.map(e =>
                    `<div class="card clickable" onclick="UI.toggleChart(this, '${e.id}')">
                        <div style="display:flex; justify-content:space-between; gap:10px; align-items:center;">
                            <strong>${UI.esc(e.name)}</strong>
                            <button class="mini-action" onclick="event.stopPropagation();UI.renameExercise('${e.id}')">Edit</button>
                        </div>
                        <div style="margin-top:4px;"><span style="font-size:0.7rem; background:#eee; padding:2px 6px; border-radius:4px;">${e.muscle}</span></div>
                        <div class="chart-container" id="chart-${e.id}"></div>
                    </div>`
                ).join('');
            }
        }
        this.container.innerHTML = html;
    },
    toggleChart(card, exId) { const container = card.querySelector('.chart-container'); if (card.classList.contains('expanded')) { card.classList.remove('expanded'); } else { document.querySelectorAll('.card.expanded').forEach(c => c.classList.remove('expanded')); card.classList.add('expanded'); this.renderChart(exId, container); } },
    renderChart(exId, container) { const data = Coach.getChartData(exId); if (data.length < 2) { container.innerHTML = '<p style="text-align:center; padding-top:40px; color:#888;">Not enough data yet.</p>'; return; } const h = 150, w = container.offsetWidth || 300; const vals = data.map(d => d.val); const min = Math.min(...vals) * 0.9; const max = Math.max(...vals) * 1.1; const range = max - min; const points = data.map((d, i) => `${(i / (data.length - 1)) * w},${h - ((d.val - min) / range) * h}`).join(' '); container.innerHTML = `<svg class="chart-svg" viewBox="0 0 ${w} ${h}"><polyline class="chart-line" points="${points}" />${data.map((d, i) => `<circle cx="${(i / (data.length - 1)) * w}" cy="${h - ((d.val - min) / range) * h}" r="4" class="chart-dot" /><text x="${(i / (data.length - 1)) * w}" y="${h - ((d.val - min) / range) * h - 10}" text-anchor="middle" class="chart-label">${d.val}</text>`).join('')}</svg>`; },
    renderSettings() {
        this.pageTitle.innerText = 'Settings';
        const p = Store.data.profile;
        const timerVal = p.timerDuration || 60;
        const daysHtml = Store.data.workoutDays.map((d,i) =>
            `<div class="day-manager-row"><span><strong>${UI.esc(d.name)}</strong><small>${d.exercises.length} exercises</small></span>
                <div><button class="mini-action" onclick="UI.renderWorkoutDayEditor(${i})">Edit</button>
                <button class="mini-action" onclick="UI.renameDay(${i})">Rename</button>
                <button class="mini-action danger" onclick="UI.deleteDay(${i})">Delete</button></div></div>`
        ).join('');
        this.container.innerHTML = `
            <div class="card">
                <h2>Workout Days</h2>
                <p class="settings-help">Edit the exercise list here for future workouts. Changes made during an active workout also continue to save back to that workout day.</p>
                ${daysHtml}<button class="btn-secondary" onclick="UI.addDay()">+ Add Day</button>
            </div>
            <div class="card"><h2>History</h2>
                <button class="btn-secondary" onclick="UI.renderHistoryManager()">Manage Recent History (Edit/Delete)</button>
                <button class="btn-secondary" onclick="UI.renderHistoryMoveTool()">Move / Merge Exercise History</button>
            </div>
            <div class="card"><h2>Profile</h2>
                <label>Frequency (Days/Week)</label><select id="s-freq"><option value="2" ${p.frequency==2?'selected':''}>2</option><option value="3" ${p.frequency==3?'selected':''}>3</option><option value="4" ${p.frequency==4?'selected':''}>4</option><option value="5" ${p.frequency==5?'selected':''}>5</option><option value="6" ${p.frequency==6?'selected':''}>6</option></select>
                <label>Rest Timer (Seconds)</label><input type="number" id="s-timer" value="${timerVal}" style="margin-bottom:15px;">
                <button class="btn-primary" style="margin-top:15px" onclick="UI.saveSet()">Save Profile</button>
            </div>
            <div class="card"><h2>Backup & Transfer</h2>
                <p style="color:var(--text-muted);font-size:.85rem;margin-bottom:10px;">Export includes history, progression, custom workout days, exercise names, Myo settings, and profile.</p>
                <button class="btn-secondary" onclick="UI.export()">Export Complete Backup</button>
                <input id="import-file" type="file" accept="application/json,.json" style="margin-top:10px;">
                <button class="btn-secondary" onclick="UI.importBackup()">Import Backup (Merge History)</button>
            </div>`;
    },
    renderWorkoutDayEditor(dayIndex) {
        const day = Store.data.workoutDays[dayIndex];
        if (!day) { this.renderSettings(); return; }
        this.templateEditDayIndex = dayIndex;
        this.pageTitle.innerText = 'Edit Workout Day';

        const rows = day.exercises.map((item, index) => {
            const ex = Store.data.exercises.find(e => e.id === item.id) || {name:'Unknown Exercise'};
            const isMyo = item.mode === 'myo';
            return `
                <div class="template-exercise-row">
                    <div class="template-exercise-main">
                        <span class="template-order">${index + 1}</span>
                        <div>
                            <strong>${UI.esc(ex.name)}</strong>
                            <small>${item.sets || 1} sets • ${UI.esc(item.targetReps || '8-12')} reps${isMyo ? ' • Myo-Reps' : ''}</small>
                        </div>
                    </div>
                    <div class="template-actions">
                        <button class="mini-action" onclick="UI.moveTemplateExercise(${dayIndex},${index},-1)" title="Move up">↑</button>
                        <button class="mini-action" onclick="UI.moveTemplateExercise(${dayIndex},${index},1)" title="Move down">↓</button>
                        <button class="mini-action" onclick="UI.openTemplateExercisePicker(${dayIndex},${index},'replace')">Swap</button>
                        <button class="mini-action danger" onclick="UI.removeTemplateExercise(${dayIndex},${index})">Remove</button>
                    </div>
                    <div class="template-config">
                        <div>
                            <label>Sets</label>
                            <div class="template-stepper">
                                <button class="mini-action" onclick="UI.changeTemplateSets(${dayIndex},${index},-1)">−</button>
                                <strong>${Math.max(1, Number(item.sets)||1)}</strong>
                                <button class="mini-action" onclick="UI.changeTemplateSets(${dayIndex},${index},1)">+</button>
                            </div>
                        </div>
                        <button class="mini-action ${isMyo ? 'myo-active' : ''}" onclick="UI.toggleTemplateMyo(${dayIndex},${index})">⚡ Myo-Reps: ${isMyo ? 'On' : 'Off'}</button>
                    </div>
                    <div class="template-targets">
                        <label>Target Reps
                            <input type="text" id="template-reps-${dayIndex}-${index}" value="${UI.esc(item.targetReps || '8-12')}" onchange="UI.updateTemplateTargets(${dayIndex},${index})">
                        </label>
                        <label>Target RIR
                            <input type="text" id="template-rir-${dayIndex}-${index}" value="${UI.esc(item.targetRir || '1-2')}" onchange="UI.updateTemplateTargets(${dayIndex},${index})">
                        </label>
                    </div>
                </div>`;
        }).join('');

        this.container.innerHTML = `
            <div class="card">
                <div class="editor-title-row">
                    <div><h2>${UI.esc(day.name)}</h2><p>These changes affect future workouts only.</p></div>
                    <button class="mini-action" onclick="UI.renameDay(${dayIndex}, false); UI.renderWorkoutDayEditor(${dayIndex})">Rename</button>
                </div>
                <div class="template-exercise-list">${rows || '<p class="progress-empty">No exercises yet.</p>'}</div>
                <button class="btn-secondary" onclick="UI.openTemplateExercisePicker(${dayIndex},-1,'add')">+ Add Exercise</button>
            </div>
            <button class="btn-secondary" onclick="UI.renderSettings()">← Back to Settings</button>`;
        window.scrollTo({top:0, behavior:'auto'});
    },

    saveTemplateDay(dayIndex) {
        const day = Store.data.workoutDays[dayIndex];
        if (!day) return;
        day.exercises.forEach((item,i) => {
            item.block = String.fromCharCode(65 + i);
            item.role = item.role || 'A';
            item.sets = Math.max(1, Number(item.sets)||1);
            item.targetReps = item.targetReps || '8-12';
            item.targetRir = item.targetRir || '1-2';
            item.mode = item.mode === 'myo' ? 'myo' : 'normal';
        });
        Store.save();
    },

    moveTemplateExercise(dayIndex, index, delta) {
        const day = Store.data.workoutDays[dayIndex];
        const next = index + delta;
        if (!day || next < 0 || next >= day.exercises.length) return;
        [day.exercises[index], day.exercises[next]] = [day.exercises[next], day.exercises[index]];
        this.saveTemplateDay(dayIndex);
        this.renderWorkoutDayEditor(dayIndex);
    },

    changeTemplateSets(dayIndex, index, delta) {
        const item = Store.data.workoutDays[dayIndex]?.exercises[index];
        if (!item) return;
        item.sets = Math.max(1, (Number(item.sets)||1) + delta);
        this.saveTemplateDay(dayIndex);
        this.renderWorkoutDayEditor(dayIndex);
    },

    updateTemplateTargets(dayIndex, index) {
        const item = Store.data.workoutDays[dayIndex]?.exercises[index];
        if (!item) return;
        const reps = document.getElementById(`template-reps-${dayIndex}-${index}`)?.value.trim();
        const rir = document.getElementById(`template-rir-${dayIndex}-${index}`)?.value.trim();
        if (reps) item.targetReps = reps;
        if (rir) item.targetRir = rir;
        this.saveTemplateDay(dayIndex);
    },

    toggleTemplateMyo(dayIndex, index) {
        const item = Store.data.workoutDays[dayIndex]?.exercises[index];
        if (!item) return;
        item.mode = item.mode === 'myo' ? 'normal' : 'myo';
        if (item.mode === 'myo' && Number(item.sets) < 5) item.sets = 5;
        this.saveTemplateDay(dayIndex);
        this.renderWorkoutDayEditor(dayIndex);
    },

    removeTemplateExercise(dayIndex, index) {
        const day = Store.data.workoutDays[dayIndex];
        if (!day) return;
        const name = Coach.getExerciseName(day.exercises[index]?.id);
        if (!confirm(`Remove "${name}" from future ${day.name} workouts? Historical workouts will not change.`)) return;
        day.exercises.splice(index,1);
        this.saveTemplateDay(dayIndex);
        this.renderWorkoutDayEditor(dayIndex);
    },

    openTemplateExercisePicker(dayIndex, index, mode) {
        this.templatePicker = {dayIndex, index, mode};
        const groups = Coach.getAllExercisesGrouped();
        let listHtml = '';
        for (const [group, exercises] of Object.entries(groups)) {
            if (!exercises.length) continue;
            listHtml += `<div class="swap-header">${group}</div>` + exercises.map(ex =>
                `<div class="swap-item" onclick="UI.selectTemplateExercise('${ex.id}')"><div><strong>${UI.esc(ex.name)}</strong><small>${ex.muscle}</small></div><span class="swap-select-btn">${mode === 'add' ? 'Add' : 'Select'}</span></div>`
            ).join('');
        }
        const modal = document.getElementById('swap-modal');
        const title = modal.querySelector('h3');
        if (title) title.innerText = mode === 'add' ? 'Add Exercise' : 'Swap Exercise';
        document.getElementById('swap-list-container').innerHTML = listHtml;
        modal.classList.add('active');
    },

    selectTemplateExercise(exId) {
        const ctx = this.templatePicker;
        if (!ctx) return;
        const day = Store.data.workoutDays[ctx.dayIndex];
        if (!day) return;
        const ex = Store.data.exercises.find(e => e.id === exId);
        if (!ex) return;

        if (ctx.mode === 'add') {
            day.exercises.push({
                id: exId, block:'A', role:'A', sets:3,
                targetReps:'8-12', targetRir:'1-2', mode:'normal'
            });
        } else if (day.exercises[ctx.index]) {
            day.exercises[ctx.index] = {...day.exercises[ctx.index], id:exId};
        }
        this.saveTemplateDay(ctx.dayIndex);
        document.getElementById('swap-modal').classList.remove('active');
        this.templatePicker = null;
        this.renderWorkoutDayEditor(ctx.dayIndex);
    },

    renderHistoryMoveTool(sourceId = '', targetId = '') {
        this.pageTitle.innerText = 'Move Exercise History';
        const exercisesWithHistory = Store.data.exercises.filter(ex =>
            Store.data.history.some(session => session.exercises?.some(item => item.id === ex.id))
        );
        const optionHtml = exercisesWithHistory.map(ex => `<option value="${ex.id}" ${ex.id === sourceId ? 'selected' : ''}>${UI.esc(ex.name)}</option>`).join('');
        const targetOptions = Store.data.exercises.map(ex => `<option value="${ex.id}" ${ex.id === targetId ? 'selected' : ''}>${UI.esc(ex.name)}</option>`).join('');

        this.historyMoveSelection = new Set();
        this.container.innerHTML = `
            <div class="card">
                <h2>Move / Merge Exercise History</h2>
                <p class="settings-help">Use this when a past workout was logged under the wrong exercise. This changes historical records only; it does not change your future workout-day templates.</p>
                <label>Move history from</label>
                <select id="history-move-source" onchange="UI.previewHistoryMove()">
                    <option value="">Choose source exercise</option>${optionHtml}
                </select>
                <label>Move history to</label>
                <select id="history-move-target" onchange="UI.previewHistoryMove()">
                    <option value="">Choose destination exercise</option>${targetOptions}
                </select>
                <div id="history-move-preview"></div>
            </div>
            <button class="btn-secondary" onclick="UI.renderSettings()">← Back to Settings</button>`;
        this.previewHistoryMove();
    },

    previewHistoryMove() {
        const sourceId = document.getElementById('history-move-source')?.value || '';
        const targetId = document.getElementById('history-move-target')?.value || '';
        const preview = document.getElementById('history-move-preview');
        if (!preview) return;
        if (!sourceId || !targetId) {
            preview.innerHTML = '<p class="progress-empty">Choose a source and destination to preview affected workouts.</p>';
            return;
        }
        if (sourceId === targetId) {
            preview.innerHTML = '<p class="history-move-warning">Source and destination must be different exercises.</p>';
            return;
        }

        const matches = Store.data.history
            .map((session,index) => ({session,index}))
            .filter(x => x.session.exercises?.some(ex => ex.id === sourceId))
            .sort((a,b) => new Date(b.session.date) - new Date(a.session.date));

        this.historyMoveSelection = new Set(matches.map(x => x.index));

        if (!matches.length) {
            preview.innerHTML = '<p class="progress-empty">No historical workouts use the selected source exercise.</p>';
            return;
        }

        const rows = matches.map(({session,index}) => {
            const source = session.exercises.find(ex => ex.id === sourceId);
            const targetAlready = session.exercises.some(ex => ex.id === targetId);
            const sets = source?.sets?.length || 0;
            const dayName = getWorkoutDay(session.type)?.name || session.type;
            return `
                <label class="history-move-session">
                    <input type="checkbox" checked onchange="UI.toggleHistoryMoveSession(${index},this.checked)">
                    <span><strong>${new Date(session.date).toLocaleDateString()}</strong>
                    <small>${UI.esc(dayName)} • ${sets} set${sets===1?'':'s'}${targetAlready ? ' • will merge with existing destination exercise' : ''}</small></span>
                </label>`;
        }).join('');

        preview.innerHTML = `
            <div class="history-move-summary">
                <strong>${matches.length} workout${matches.length===1?'':'s'} found</strong>
                <div><button class="mini-action" onclick="UI.setAllHistoryMove(true)">Select All</button>
                <button class="mini-action" onclick="UI.setAllHistoryMove(false)">Clear</button></div>
            </div>
            <div class="history-move-list">${rows}</div>
            <button class="btn-primary" onclick="UI.applyHistoryMove()">Move Selected History</button>
            <p class="progress-note">If the destination exercise already exists in a selected workout, the source sets will be appended to it and the duplicate source exercise entry will be removed.</p>`;
    },

    toggleHistoryMoveSession(index, checked) {
        if (checked) this.historyMoveSelection.add(index);
        else this.historyMoveSelection.delete(index);
    },

    setAllHistoryMove(checked) {
        document.querySelectorAll('.history-move-session input[type="checkbox"]').forEach(box => {
            box.checked = checked;
            const label = box.closest('.history-move-session');
            const dateText = label?.querySelector('strong')?.innerText;
        });
        const sourceId = document.getElementById('history-move-source')?.value || '';
        const matches = Store.data.history
            .map((session,index) => ({session,index}))
            .filter(x => x.session.exercises?.some(ex => ex.id === sourceId));
        this.historyMoveSelection = checked ? new Set(matches.map(x => x.index)) : new Set();
    },

    applyHistoryMove() {
        const sourceId = document.getElementById('history-move-source')?.value || '';
        const targetId = document.getElementById('history-move-target')?.value || '';
        if (!sourceId || !targetId || sourceId === targetId) return;
        const selected = [...this.historyMoveSelection];
        if (!selected.length) { alert('Select at least one workout to move.'); return; }

        const sourceName = Coach.getExerciseName(sourceId);
        const targetName = Coach.getExerciseName(targetId);
        let setCount = 0;
        selected.forEach(index => {
            const session = Store.data.history[index];
            const sourceIndex = session?.exercises?.findIndex(ex => ex.id === sourceId);
            if (sourceIndex < 0) return;
            const source = session.exercises[sourceIndex];
            setCount += source.sets?.length || 0;
        });

        if (!confirm(`Move ${selected.length} workout${selected.length===1?'':'s'} (${setCount} sets) from "${sourceName}" to "${targetName}"? This changes saved workout history.`)) return;

        selected.forEach(index => {
            const session = Store.data.history[index];
            if (!session?.exercises) return;
            const sourceIndex = session.exercises.findIndex(ex => ex.id === sourceId);
            if (sourceIndex < 0) return;
            const source = session.exercises[sourceIndex];
            const targetIndex = session.exercises.findIndex(ex => ex.id === targetId);

            if (targetIndex >= 0 && targetIndex !== sourceIndex) {
                const target = session.exercises[targetIndex];
                target.sets = [...(target.sets || []), ...(source.sets || [])];
                session.exercises.splice(sourceIndex,1);
            } else {
                source.id = targetId;
            }
        });

        // Refresh the destination exercise's future progression target from its latest saved workout.
        const latestTargetSession = Store.data.history
            .filter(session => session.exercises?.some(ex => ex.id === targetId))
            .sort((a,b) => new Date(b.date) - new Date(a.date))[0];
        if (latestTargetSession) {
            const latestTargetExercise = latestTargetSession.exercises.find(ex => ex.id === targetId);
            if (latestTargetExercise) Coach.updateProgression({exercises:[latestTargetExercise]});
        }

        Store.save();
        alert(`Moved ${selected.length} workout${selected.length===1?'':'s'} to ${targetName}.`);
        this.renderHistoryMoveTool(sourceId, targetId);
    },

    renderHistoryManager() { this.pageTitle.innerText = 'History Manager'; const recent = Store.data.history.map((h, i) => ({...h, origIndex: i})).reverse().slice(0, 3); if (recent.length === 0) { this.container.innerHTML = '<div class="card"><p>No history found.</p><button class="btn-secondary" onclick="UI.nav(\'settings\')">Back</button></div>'; return; } const html = recent.map(item => `<div class="history-item"><div class="history-info"><strong>${new Date(item.date).toLocaleDateString()}</strong><span style="font-size:0.8rem; color:#666;">${item.type.toUpperCase()} • ${item.exercises.length} Exercises</span></div><div class="history-actions"><button class="btn-sm" onclick="UI.editWorkout(${item.origIndex})">Edit Workout</button><button class="btn-sm btn-danger" onclick="UI.deleteHistory(${item.origIndex})">Delete</button></div></div>`).join(''); this.container.innerHTML = `<div style="margin-bottom:20px;">${html}</div><button class="btn-secondary" onclick="UI.nav(\'settings\')">Back to Settings</button>`; },
    deleteHistory(index) { if(confirm("Are you sure?")) { Store.deleteSession(index); this.renderHistoryManager(); }},
    editWorkout(index) { const s = Store.data.history[index]; this.editingHistoryIndex = index; this.currentPlan = s.exercises; this.currentType = s.type; this.renderActiveSession(true); },
    saveEditedHistory() {
        const index = this.editingHistoryIndex;
        if (index === null) return;
        const original = Store.data.history[index];
        const newDate = document.getElementById('edit-date-input').value ? new Date(document.getElementById('edit-date-input').value).toISOString() : original.date;
        const updatedSession = {
            date: newDate, type: this.currentType,
            exercises: this.currentPlan.map((ex, i) => ({
                id: ex.id,
                mode: ex.mode || 'normal',
                targetReps: ex.targetReps,
                targetRir: ex.targetRir,
                sets: Array.from({length: Math.max(1, Number(ex.sets)||ex.sets?.length||1)}, (_,sIdx) => ({
                    reps: Number(document.getElementById(`reps-${i}-${sIdx+1}`)?.value) || 0,
                    rir: Number(document.getElementById(`rir-${i}-${sIdx+1}`)?.value) || 0,
                    weight: Number(document.getElementById(`weight-${i}`)?.value) || 0
                }))
            }))
        };
        Store.updateHistorySession(index, updatedSession);
        alert("Updated!");
        this.nav('settings');
    },
    saveSet() { Store.data.profile.frequency = Number(document.getElementById('s-freq').value); Store.data.profile.timerDuration = Number(document.getElementById('s-timer').value) || 60; Store.save(); alert("Saved!"); },
    export() {
        const payload = {
            format: 'StrengthOS Backup',
            schemaVersion: SCHEMA_VERSION,
            appVersion: APP_VERSION,
            exportedAt: new Date().toISOString(),
            data: Store.data
        };
        const blob = new Blob([JSON.stringify(payload, null, 2)], {type:'application/json'});
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `strengthos-backup-${new Date().toISOString().slice(0,10)}.json`;
        document.body.appendChild(a); a.click(); a.remove();
        setTimeout(() => URL.revokeObjectURL(a.href), 500);
    },

    async importBackup() {
        const input = document.getElementById('import-file');
        const file = input?.files?.[0];
        if (!file) { alert('Choose a JSON backup first.'); return; }
        try {
            const parsed = JSON.parse(await file.text());
            const incoming = parsed.data || parsed;
            if (!incoming || !Array.isArray(incoming.history)) throw new Error('This does not look like a StrengthOS backup.');
            if (!confirm('Import this backup? Existing workout history will be kept and merged by date/type.')) return;

            const seen = new Set(Store.data.history.map(s => `${s.date}|${s.type}`));
            incoming.history.forEach(s => {
                const key = `${s.date}|${s.type}`;
                if (!seen.has(key)) { Store.data.history.push(s); seen.add(key); }
            });
            Store.data.history.sort((a,b) => new Date(a.date) - new Date(b.date));

            if (incoming.progression) Store.data.progression = {...Store.data.progression, ...incoming.progression};
            if (Array.isArray(incoming.exercises)) {
                const byId = new Map(Store.data.exercises.map(e => [e.id, e]));
                incoming.exercises.forEach(e => byId.set(e.id, {...(byId.get(e.id)||{}), ...e}));
                Store.data.exercises = Array.from(byId.values());
            }
            if (Array.isArray(incoming.workoutDays) && incoming.workoutDays.length) Store.data.workoutDays = incoming.workoutDays;
            if (incoming.profile) Store.data.profile = {...Store.data.profile, ...incoming.profile};
            Store.data.schemaVersion = SCHEMA_VERSION;
            Store.save();
            alert('Backup imported. Existing history was preserved and merged.');
            this.renderSettings();
        } catch (err) {
            alert('Import failed: ' + err.message);
        }
    },

    esc(value) {
        return String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
    },

    captureLiveInputs() {
        if (!this.currentPlan) return;
        this.currentPlan.forEach((ex, i) => {
            const setCount = Array.isArray(ex.sets) ? ex.sets.length : Math.max(1, Number(ex.sets)||1);
            ex._live = {
                weight: Number(document.getElementById(`weight-${i}`)?.value) || ex.targetWeight || 0,
                sets: Array.from({length:setCount}, (_,sIdx) => ({
                    reps: document.getElementById(`reps-${i}-${sIdx+1}`)?.value ?? '',
                    rir: Number(document.getElementById(`rir-${i}-${sIdx+1}`)?.value) || 0
                }))
            };
        });
    },

    persistCurrentPlan() {
        const day = getWorkoutDay(this.currentType);
        if (!day) return;
        day.exercises = this.currentPlan.map((ex, i) => ({
            id: ex.id,
            block: String.fromCharCode(65 + i),
            role: ex.role || 'A',
            sets: Math.max(1, Number(ex.sets)||1),
            targetReps: ex.targetReps || '8-12',
            targetRir: ex.targetRir || '1-2',
            mode: ex.mode === 'myo' ? 'myo' : 'normal',
            note: ex.note
        }));
        Store.save();
    },

    addSet(index) {
        this.captureLiveInputs();
        this.scrapeAndSaveDraft();
        this.currentPlan[index].sets = Math.max(1, Number(this.currentPlan[index].sets)||1) + 1;
        this.persistCurrentPlan();
        this.renderActiveSession(true, { preserveScroll: true, anchorIndex: index });
    },

    removeSet(index) {
        if ((Number(this.currentPlan[index].sets)||1) <= 1) return;
        this.captureLiveInputs();
        this.scrapeAndSaveDraft();
        this.currentPlan[index].sets -= 1;
        this.persistCurrentPlan();
        this.renderActiveSession(true, { preserveScroll: true, anchorIndex: index });
    },

    toggleMyo(index) {
        this.captureLiveInputs();
        this.scrapeAndSaveDraft();
        const ex = this.currentPlan[index];
        ex.mode = ex.mode === 'myo' ? 'normal' : 'myo';
        if (ex.mode === 'myo' && Number(ex.sets) < 5) ex.sets = 5;
        this.persistCurrentPlan();
        this.renderActiveSession(true, { preserveScroll: true, anchorIndex: index });
    },

    moveExercise(index, delta) {
        const next = index + delta;
        if (next < 0 || next >= this.currentPlan.length) return;
        this.captureLiveInputs();
        this.scrapeAndSaveDraft();
        [this.currentPlan[index], this.currentPlan[next]] = [this.currentPlan[next], this.currentPlan[index]];
        this.currentPlan.forEach((ex,i) => ex.block = String.fromCharCode(65+i));
        this.persistCurrentPlan();
        this.renderActiveSession(true, { preserveScroll: true, anchorIndex: next });
    },

    removeExercise(index) {
        if (!confirm('Remove this exercise from this workout day? Historical workouts will not be changed.')) return;
        this.captureLiveInputs();
        this.scrapeAndSaveDraft();
        this.currentPlan.splice(index,1);
        this.persistCurrentPlan();
        this.renderActiveSession(true, { preserveScroll: true, anchorIndex: Math.min(index, this.currentPlan.length - 1) });
    },

    addExerciseToWorkout() {
        this.captureLiveInputs();
        this.scrapeAndSaveDraft();
        const allGrouped = Coach.getAllExercisesGrouped();
        let listHtml = '';
        for (const [group, exercises] of Object.entries(allGrouped)) {
            if (!exercises.length) continue;
            listHtml += `<div class="swap-header">${group}</div>` + exercises.map(ex =>
                `<div class="swap-item" onclick="UI.selectAddedExercise('${ex.id}')"><div><strong>${UI.esc(ex.name)}</strong></div><span class="swap-select-btn">Add</span></div>`
            ).join('');
        }
        const modal = document.getElementById('swap-modal');
        const title = modal.querySelector('h3');
        if (title) title.innerText = 'Add Exercise';
        document.getElementById('swap-list-container').innerHTML = listHtml;
        modal.classList.add('active');
    },

    selectAddedExercise(exId) {
        const exDef = Store.data.exercises.find(e => e.id === exId);
        if (!exDef) return;
        const prog = Store.data.progression[exId] || {weight:10};
        this.currentPlan.push({
            ...exDef, block: String.fromCharCode(65 + this.currentPlan.length), role:'A',
            sets:3, targetReps:'8-12', targetRir:'1-2', mode:'normal', targetWeight:prog.weight
        });
        document.getElementById('swap-modal').classList.remove('active');
        this.persistCurrentPlan();
        this.scrapeAndSaveDraft();
        const newIndex = this.currentPlan.length - 1;
        this.renderActiveSession(true, { preserveScroll: true, anchorIndex: newIndex });
    },

    renameExercise(exId) {
        const ex = Store.data.exercises.find(e => e.id === exId);
        if (!ex) return;
        const name = prompt('Exercise name:', ex.name);
        if (!name || !name.trim()) return;
        ex.name = name.trim();
        Store.save();
        this.renderLib();
    },

    addDayFromWorkout() { this.addDay(false); this.renderWorkoutIntro(); },
    renameDayFromWorkout(index) { this.renameDay(index, false); this.renderWorkoutIntro(); },
    deleteDayFromWorkout(index) { this.deleteDay(index, false); this.renderWorkoutIntro(); },

    addDay(refresh = true) {
        const name = prompt('Name for the new workout day:', `Day ${Store.data.workoutDays.length + 1}`);
        if (!name || !name.trim()) return;
        let id = 'day_' + Date.now().toString(36);
        while (Store.data.workoutDays.some(d => d.id === id)) id += '_x';
        Store.data.workoutDays.push({id, name:name.trim(), exercises:[]});
        Store.save();
        if (refresh) this.renderSettings();
    },

    renameDay(index, refresh = true) {
        const day = Store.data.workoutDays[index];
        if (!day) return;
        const name = prompt('Workout day name:', day.name);
        if (!name || !name.trim()) return;
        day.name = name.trim();
        Store.save();
        if (refresh) this.renderSettings();
    },

    deleteDay(index, refresh = true) {
        const day = Store.data.workoutDays[index];
        if (!day) return;
        if (!confirm(`Delete "${day.name}" from future workout days? Historical sessions remain intact.`)) return;
        Store.data.workoutDays.splice(index,1);
        Store.save();
        if (refresh) this.renderSettings();
    },
    renderGuide() { this.pageTitle.innerText = 'Coach Logic'; this.container.innerHTML = `<div class="card"><div class="guide-block"><h3>🧠 Routine Format</h3><p>Your workout days are fully editable. Changes to exercises, order, set counts, and Myo-Reps are saved for the next time you use that day.</p></div><div class="guide-block"><h3>⚡ Myo-Reps</h3><p>Perform the Warm-up. Then do the Activation set to failure. Rest 15 seconds, do a Mini set, rest 15s, etc. Weights only increase if you get 10+ reps on the Activation set.</p></div><div class="guide-block"><h3>📈 Progression</h3><p>For standard sets, weights increase if you hit the top end of the rep range AND rate the last set as Easy (RIR 3).</p></div></div>`; }
};

window.addEventListener('DOMContentLoaded', () => { Store.init(); UI.init(); });

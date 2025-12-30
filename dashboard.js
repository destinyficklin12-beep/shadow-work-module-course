const modules = [
    {
        id: 1,
        title: 'Understanding the Shadow',
        duration: '45 min',
        lessons: 4,
        meditation: 'Body Awareness (10 min)',
        description: 'Discover what the shadow is, how it forms, and why exploring it matters.'
    },
    {
        id: 2,
        title: 'Preparing for Shadow Work',
        duration: '40 min',
        lessons: 4,
        meditation: 'Self-Compassion Practice (12 min)',
        description: 'Create safety, develop self-compassion, and build grounding practices.'
    },
    {
        id: 3,
        title: 'Identifying Your Shadow',
        duration: '50 min',
        lessons: 4,
        meditation: 'Meeting Your Disowned Self (15 min)',
        description: 'Use projection, triggers, and patterns to discover your shadow aspects.'
    },
    {
        id: 4,
        title: 'Dialoguing with the Shadow',
        duration: '55 min',
        lessons: 4,
        meditation: 'Active Imagination Journey (18 min)',
        description: 'Learn techniques for communicating with your shadow parts.'
    },
    {
        id: 5,
        title: 'Feeling the Shadow',
        duration: '60 min',
        lessons: 4,
        meditation: 'Emotional Release & Integration (20 min)',
        description: 'Process difficult emotions safely and release stored energy.'
    },
    {
        id: 6,
        title: 'Reclaiming Your Power',
        duration: '50 min',
        lessons: 4,
        meditation: 'Reclaiming Your Power (16 min)',
        description: 'Retrieve lost parts and reclaim disowned strengths and gifts.'
    },
    {
        id: 7,
        title: 'Shadow Work in Relationships',
        duration: '45 min',
        lessons: 4,
        meditation: 'None (practical exercises)',
        description: 'Transform relationship dynamics through shadow awareness.'
    },
    {
        id: 8,
        title: 'Integration and Wholeness',
        duration: '50 min',
        lessons: 4,
        meditation: 'Integration & Wholeness (17 min)',
        description: 'Create a sustainable practice and live from wholeness.'
    }
];

let currentUser = null;
let completedModules = [];

// Check authentication
auth.onAuthStateChanged(async (user) => {
    if (user) {
        currentUser = user;
        document.getElementById('userEmail').textContent = `Welcome, ${user.displayName || user.email}`;
        await loadProgress();
        displayModules();
    } else {
        window.location.href = 'auth.html';
    }
});

// Sign out
document.getElementById('signOutBtn').addEventListener('click', async () => {
    await auth.signOut();
    window.location.href = 'index.html';
});

// Load user progress
async function loadProgress() {
    try {
        const docRef = db.collection('userProgress').doc(currentUser.uid);
        const doc = await docRef.get();
        
        if (doc.exists) {
            completedModules = doc.data().completedModules || [];
        } else {
            completedModules = [];
        }
        updateProgressBar();
    } catch (error) {
        console.error('Error loading progress:', error);
    }
}

// Save progress
async function saveProgress() {
    try {
        await db.collection('userProgress').doc(currentUser.uid).set({
            completedModules: completedModules,
            lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
        });
    } catch (error) {
        console.error('Error saving progress:', error);
    }
}

// Toggle module completion
async function toggleModule(moduleId) {
    const index = completedModules.indexOf(moduleId);
    if (index > -1) {
        completedModules.splice(index, 1);
    } else {
        completedModules.push(moduleId);
    }
    await saveProgress();
    displayModules();
    updateProgressBar();
}

// Display modules
function displayModules() {
    const container = document.getElementById('modulesGrid');
    container.innerHTML = '';

    modules.forEach(module => {
        const isCompleted = completedModules.includes(module.id);
        const isLocked = module.id > 1 && !completedModules.includes(module.id - 1);
        
        const moduleCard = document.createElement('div');
        moduleCard.className = `module-card ${isCompleted ? 'completed' : ''} ${isLocked ? 'locked' : ''}`;
        
        if (!isLocked) {
            moduleCard.onclick = () => toggleModule(module.id);
        }
        
        let icon = '📖';
        if (isCompleted) icon = '✅';
        if (isLocked) icon = '🔒';
        
        moduleCard.innerHTML = `
            <div class="module-header">
                <div class="module-icon">${icon}</div>
                <div class="module-info">
                    <h3>${module.title}</h3>
                    <p class="module-number">Module ${module.id}</p>
                </div>
            </div>
            <p class="module-description">${module.description}</p>
            <div class="module-meta">
                <span>⏱️ ${module.duration}</span>
                <span>📚 ${module.lessons} lessons</span>
            </div>
            ${module.meditation !== 'None (practical exercises)' ? 
                `<div class="module-meditation">▶️ ${module.meditation}</div>` : 
                '<div class="module-meditation">✍️ Practical exercises</div>'
            }
            ${isLocked ? 
                `<p class="lock-message">Complete Module ${module.id - 1} to unlock</p>` : 
                ''
            }
        `;
        
        container.appendChild(moduleCard);
    });
}

// Update progress bar
function updateProgressBar() {
    const completed = completedModules.length;
    const total = modules.length;
    const percentage = Math.round((completed / total) * 100);
    
    document.getElementById('progressBar').style.width = percentage + '%';
    document.getElementById('progressBar').textContent = percentage + '%';
    document.getElementById('progressText').textContent = 
        `You've completed ${completed} of ${total} modules`;
}

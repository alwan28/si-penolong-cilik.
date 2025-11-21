// --- DATA APLIKASI ---
const STATE = {
    screen: 'intro', // intro, menu, materi, misi, score
    name: '',
    score: 0,
    missionScore: 0,
    audioEnabled: true,
    
    // Materi State
    materiStep: 0,
    materiVideoType: 'youtube',
    
    // Misi State
    level: 1,
    selectedTools: [], // Level 1
    orderStep: [],     // Level 2
    quizIndex: 0,      // Level 3
    woundState: 0,     // Level 4 (0:Kotor, 1:Bersih, 2:Obat, 3:Tutup)
    emotion: null      // Level 5
};

const MATERI_STEPS = [
    {
        id: 1, title: "Tonton Video", desc: "Tonton video ini agar kamu tahu cara merawat luka.", icon: "video", color: "bg-purple-100",
        videoChoices: [
            { type: 'youtube', label: 'YouTube', url: 'https://www.youtube.com/embed/NoxdS4eXy18?si=tYl3GjU8j3jKj7Z_' },
            { type: 'mp4', label: 'Video MP4', url: 'https://www.w3schools.com/html/mov_bbb.mp4' }
        ]
    },
    { id: 2, title: "1. Cuci Tangan", desc: "Cuci tangan dengan sabun dan air mengalir.", icon: "soap", color: "bg-blue-100" },
    { id: 3, title: "2. Basuh Luka", desc: "Basuh luka pelan-pelan dengan air bersih.", icon: "droplets", color: "bg-cyan-100" },
    { id: 4, title: "3. Beri Kasa", desc: "Tutup luka dengan kassa steril.", icon: "square", color: "bg-gray-100" },
    { id: 5, title: "4. Tempel Plester", desc: "Rekatkan plester agar kassa tidak jatuh.", icon: "bandage", color: "bg-pink-100" }
];

const TOOLS_DATA = [
    { id: 'air', name: 'Air', icon: 'droplets', correct: true },
    { id: 'betadine', name: 'Betadine', icon: 'flask-conical', correct: true },
    { id: 'permen', name: 'Permen', icon: 'candy', correct: false },
    { id: 'kassa', name: 'Kassa', icon: 'square', correct: true },
    { id: 'palu', name: 'Palu', icon: 'hammer', correct: false },
    { id: 'plester', name: 'Plester', icon: 'bandage', correct: true },
];

const QUIZ_DATA = [
    { q: "Apa yang pertama dilakukan saat teman terluka?", opts: [{ t: "Menolong", i: "hand-heart", c: true }, { t: "Tertawa", i: "laugh", c: false }] },
    { q: "Kenapa luka harus dibersihkan?", opts: [{ t: "Biar bersih", i: "sparkles", c: true }, { t: "Biar berdarah", i: "droplet", c: false }] }
];

// --- CORE FUNCTIONS ---

const app = document.getElementById('app');
const avatarContainer = document.getElementById('avatar-container');

function render() {
    app.innerHTML = ''; // Clear screen
    
    // Selalu render Header (kecuali Intro & Score)
    if (STATE.screen !== 'intro' && STATE.screen !== 'score') {
        renderHeader();
    }

    switch (STATE.screen) {
        case 'intro': renderIntro(); break;
        case 'menu': renderMenu(); break;
        case 'materi': renderMateri(); break;
        case 'misi': renderMisi(); break;
        case 'score': renderScore(); break;
    }
    
    // Re-initialize icons
    lucide.createIcons();
}

function updateAvatar(mood, message) {
    let emoji = '🐻';
    if (mood === 'success') emoji = '🌟';
    else if (mood === 'error') emoji = '🤔';
    else if (mood === 'happy') emoji = '😊';

    avatarContainer.innerHTML = `
        <div class="w-20 h-20 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full border-4 border-white shadow-xl flex items-center justify-center text-5xl relative overflow-hidden animate-bounce-slow">
            ${emoji}
        </div>
        ${message ? `
        <div class="bg-white p-4 rounded-2xl rounded-bl-none shadow-xl border-2 border-blue-50 max-w-[200px] mb-8 animate-fade-in-up">
            <p class="text-gray-700 font-bold leading-tight text-lg">${message}</p>
        </div>` : ''}
    `;
}

// --- SCREEN RENDERERS ---

function renderHeader() {
    const header = document.createElement('div');
    header.className = "w-full max-w-md flex justify-between items-center mb-6 bg-white/80 backdrop-blur-sm p-3 rounded-2xl border border-white shadow-sm sticky top-2 z-40 mt-4 mx-4";
    header.innerHTML = `
        <div class="flex items-center gap-2">
            <div class="bg-blue-100 p-2 rounded-full"><i data-lucide="user" class="text-blue-600 w-5 h-5"></i></div>
            <div class="flex flex-col"><span class="text-xs text-gray-500 font-bold uppercase">Nama</span><span class="text-blue-800 font-bold text-lg leading-none">${STATE.name || 'Teman'}</span></div>
        </div>
        <div class="flex items-center gap-2">
            <div class="flex flex-col items-end"><span class="text-xs text-gray-500 font-bold uppercase">Score</span><span class="text-yellow-600 font-bold text-lg leading-none">${STATE.score + STATE.missionScore}</span></div>
            <div class="bg-yellow-100 p-2 rounded-full border-2 border-yellow-300"><i data-lucide="star" class="text-yellow-500 w-5 h-5 fill-current"></i></div>
        </div>
    `;
    app.appendChild(header);
}

function renderIntro() {
    const container = document.createElement('div');
    container.className = "flex flex-col items-center justify-center min-h-screen w-full p-6 text-center relative overflow-hidden";
    
    if (!STATE.introStep || STATE.introStep === 1) {
        container.innerHTML = `
            <div class="absolute top-0 left-0 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
            <div class="z-10 max-w-md w-full flex flex-col items-center">
                <div class="bg-white p-8 rounded-[3rem] shadow-2xl border-8 border-white mb-8 transform rotate-2 hover:rotate-0 transition-transform duration-500">
                    <span class="text-9xl">🏃‍♂️💥</span>
                </div>
                <h1 class="text-3xl font-extrabold text-blue-800 mb-2">Aduh! Temanmu Jatuh!</h1>
                <p class="text-lg text-gray-600 mb-8 font-medium">Dia butuh bantuanmu untuk mengobati lukanya.</p>
                <button id="btn-start-help" class="btn-press bg-orange-400 text-white rounded-2xl font-bold py-4 px-8 text-xl shadow-lg w-full max-w-xs flex items-center justify-center gap-2">
                    <i data-lucide="play" fill="white"></i> AYO MENOLONG
                </button>
            </div>
        `;
        updateAvatar('error', 'Oh tidak! Temanmu jatuh dan kesakitan!');
    } else {
        container.innerHTML = `
             <div class="z-10 w-full max-w-md">
                <div class="mb-6 animate-bounce mx-auto text-center">
                    <i data-lucide="heart" class="text-red-500 w-20 h-20 mx-auto fill-red-500"></i>
                </div>
                <h2 class="text-2xl font-bold text-blue-600 mb-6 text-center">Siapa Nama Penolong Kecil?</h2>
                <div class="bg-white p-6 rounded-3xl shadow-xl border-2 border-blue-100">
                    <input type="text" id="input-name" placeholder="Ketik namamu..." class="w-full p-4 text-center text-2xl font-bold border-2 border-blue-100 rounded-2xl mb-6 focus:border-blue-500 outline-none bg-blue-50 text-blue-800">
                    <button id="btn-enter-name" class="btn-press bg-blue-500 text-white rounded-2xl font-bold py-4 w-full text-lg shadow-lg" disabled>MASUK</button>
                </div>
             </div>
        `;
        updateAvatar('waiting', 'Siapa nama pahlawan cilik ini?');
    }
    app.appendChild(container);

    // Event Listeners Intro
    if (!STATE.introStep || STATE.introStep === 1) {
        document.getElementById('btn-start-help').onclick = () => { STATE.introStep = 2; render(); };
    } else {
        const input = document.getElementById('input-name');
        const btn = document.getElementById('btn-enter-name');
        input.addEventListener('input', (e) => {
            STATE.name = e.target.value;
            btn.disabled = !STATE.name;
            btn.classList.toggle('opacity-50', !STATE.name);
        });
        btn.onclick = () => { STATE.screen = 'menu'; render(); };
    }
}

function renderMenu() {
    const menu = document.createElement('div');
    menu.className = "flex-1 flex flex-col justify-center items-center w-full max-w-md mx-auto gap-6 z-10 pb-20 p-6";
    
    const menuItems = [
        { id: 'materi', label: 'Belajar', sub: 'Tonton video & langkah', icon: 'video', color: 'blue' },
        { id: 'misi', label: 'Misi', sub: 'Selesaikan tantangan', icon: 'star', color: 'green' },
        { id: 'score', label: 'Pialaku', sub: 'Lihat prestasimu', icon: 'award', color: 'purple' }
    ];

    menu.innerHTML = `
        <div class="text-center mb-2">
            <h2 class="text-3xl font-extrabold text-gray-800">Menu Utama</h2>
            <p class="text-gray-500">Pilih kegiatanmu</p>
        </div>
        ${menuItems.map(item => `
            <button onclick="navigateTo('${item.id}')" class="btn-press w-full bg-white hover:bg-${item.color}-50 border-2 border-${item.color}-100 p-6 rounded-[2rem] shadow-lg group relative overflow-hidden text-left">
                <div class="absolute top-0 right-0 bg-${item.color}-100 w-24 h-24 rounded-bl-[4rem] -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                <div class="flex items-center gap-6 relative z-10">
                    <div class="bg-${item.color}-500 text-white p-5 rounded-2xl shadow-lg"><i data-lucide="${item.icon}" class="w-8 h-8"></i></div>
                    <div>
                        <h3 class="text-2xl font-bold text-${item.color}-800">${item.label}</h3>
                        <p class="text-${item.color}-400 text-sm font-medium">${item.sub}</p>
                    </div>
                </div>
            </button>
        `).join('')}
    `;
    app.appendChild(menu);
    updateAvatar('happy', `Halo ${STATE.name}, mau belajar apa?`);
}

function renderMateri() {
    const stepData = MATERI_STEPS[STATE.materiStep];
    const isLast = STATE.materiStep === MATERI_STEPS.length - 1;
    
    const container = document.createElement('div');
    container.className = "flex-1 flex flex-col items-center w-full p-4 pb-32";
    
    let visualContent = '';
    if (stepData.videoChoices) {
        // Video Logic
        const activeVid = stepData.videoChoices.find(v => v.type === STATE.materiVideoType) || stepData.videoChoices[0];
        visualContent = `
            <div class="flex gap-2 mb-4 justify-center bg-blue-100 p-1 rounded-xl">
                ${stepData.videoChoices.map(v => `
                    <button onclick="setVideoType('${v.type}')" class="px-4 py-2 rounded-lg font-bold transition-all flex items-center gap-2 ${STATE.materiVideoType === v.type ? 'bg-white text-blue-600 shadow-sm' : 'text-blue-400'}">
                        <i data-lucide="${v.type === 'youtube' ? 'youtube' : 'file-video'}" class="w-4 h-4"></i> ${v.label}
                    </button>
                `).join('')}
            </div>
            <div class="w-full aspect-video rounded-3xl overflow-hidden shadow-2xl border-[6px] border-white bg-black relative">
                ${activeVid.type === 'youtube' 
                    ? `<iframe width="100%" height="100%" src="${activeVid.url}" frameborder="0" allowfullscreen></iframe>`
                    : `<video width="100%" height="100%" controls><source src="${activeVid.url}" type="video/mp4"></video>`
                }
            </div>
        `;
    } else {
        // Icon Logic
        visualContent = `
            <div class="w-full aspect-square ${stepData.color} rounded-[3rem] shadow-xl flex items-center justify-center text-9xl mb-6 border-[6px] border-white relative overflow-hidden">
                <div class="absolute inset-0 bg-white opacity-30 rounded-full transform scale-150 translate-y-10"></div>
                <i data-lucide="${stepData.icon}" class="w-32 h-32 text-gray-800 relative z-10"></i>
            </div>
        `;
    }

    container.innerHTML = `
        <div class="flex items-center mb-6 w-full">
            <button onclick="navigateTo('menu')" class="btn-press bg-white border-2 border-gray-200 p-3 rounded-2xl text-gray-700"><i data-lucide="home"></i></button>
            <div class="ml-4 bg-white px-4 py-2 rounded-xl shadow-sm">
                <span class="text-sm text-gray-400 font-bold uppercase">Langkah</span>
                <div class="text-2xl font-black text-blue-600 leading-none">${STATE.materiStep + 1}<span class="text-gray-300 text-lg">/${MATERI_STEPS.length}</span></div>
            </div>
        </div>
        
        <div class="w-full max-w-md mb-6">${visualContent}</div>

        <div class="bg-white p-6 rounded-[2rem] shadow-lg w-full max-w-md mb-6 border border-gray-100">
            <h3 class="text-2xl font-extrabold text-gray-800 mb-2 text-center">${stepData.title}</h3>
            <p class="text-lg text-center text-gray-500 font-medium">${stepData.desc}</p>
        </div>

        <div class="flex gap-4 w-full max-w-md">
            <button onclick="changeMateriStep(-1)" class="btn-press flex-1 bg-white border-2 border-gray-300 text-gray-700 py-4 rounded-2xl font-bold flex justify-center" ${STATE.materiStep === 0 ? 'disabled style="opacity:0.5"' : ''}><i data-lucide="arrow-left"></i></button>
            <button onclick="${isLast ? "finishMateri()" : "changeMateriStep(1)"}" class="btn-press flex-[2] ${isLast ? 'bg-green-500 border-green-600' : 'bg-orange-400 border-orange-600'} text-white border-b-4 py-4 rounded-2xl font-bold flex justify-center items-center gap-2">
                ${isLast ? 'Ambil Lencana <i data-lucide="check-circle"></i>' : 'Lanjut <i data-lucide="arrow-right"></i>'}
            </button>
        </div>
    `;
    app.appendChild(container);
    updateAvatar('waiting', `Belajar: ${stepData.title}`);
}

function renderMisi() {
    const container = document.createElement('div');
    container.className = "flex-1 flex flex-col items-center w-full p-4 pb-32";
    
    // Progress Bar
    const progressHTML = `
        <div class="w-full max-w-md mb-6">
            <div class="flex justify-between items-center mb-2 px-2">
                <span class="text-xs font-bold text-gray-400 uppercase">Misi</span>
                <span class="text-xs font-bold text-blue-500">${STATE.level}/5</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div class="bg-blue-500 h-full transition-all duration-500" style="width: ${(STATE.level / 5) * 100}%"></div>
            </div>
        </div>
    `;

    let content = '';
    
    // LEVEL 1: SELECT TOOLS
    if (STATE.level === 1) {
        content = `
            <h3 class="text-lg font-bold text-blue-800 text-center bg-white px-4 py-2 rounded-xl mb-4">Pilih alat perawatan luka</h3>
            <div class="grid grid-cols-2 gap-4 w-full max-w-md mb-6">
                ${TOOLS_DATA.map(t => {
                    const isSel = STATE.selectedTools.includes(t.id);
                    return `<button onclick="toggleTool('${t.id}')" class="btn-press py-4 rounded-2xl border-2 flex flex-col items-center gap-2 ${isSel ? 'bg-green-50 border-green-400 text-green-800' : 'bg-white border-blue-100 text-gray-800'}">
                        <i data-lucide="${t.icon}" class="w-8 h-8"></i><span class="font-bold">${t.name}</span>
                    </button>`
                }).join('')}
            </div>
            <button onclick="checkLevel1()" class="btn-press w-full max-w-md bg-orange-400 text-white font-bold py-4 rounded-2xl border-b-4 border-orange-600" ${STATE.selectedTools.length === 0 ? 'disabled' : ''}>Cek Alat</button>
        `;
    } 
    // LEVEL 2: ORDER STEPS
    else if (STATE.level === 2) {
        const steps = [
            { id: 'cuci', txt: 'Cuci', icon: 'soap' }, { id: 'air', txt: 'Bersihkan', icon: 'droplets' },
            { id: 'obat', txt: 'Obat', icon: 'flask-conical' }, { id: 'tutup', txt: 'Tutup', icon: 'bandage' }
        ];
        content = `
            <h3 class="text-lg font-bold text-blue-800 text-center bg-white px-4 py-2 rounded-xl mb-4">Urutkan langkahnya</h3>
            <div class="flex gap-2 mb-8 w-full justify-center bg-blue-100/50 p-4 rounded-2xl border-2 border-dashed border-blue-200">
                ${[0,1,2,3].map(i => `
                    <div class="w-16 h-20 bg-white rounded-xl flex items-center justify-center shadow-sm border border-blue-50">
                        ${STATE.orderStep[i] ? `<i data-lucide="${STATE.orderStep[i].icon}" class="w-8 h-8 text-blue-600 animate-pop-in"></i>` : `<span class="text-gray-200 font-bold text-xl">${i+1}</span>`}
                    </div>
                `).join('')}
            </div>
            <div class="grid grid-cols-2 gap-3 w-full max-w-md">
                ${steps.map(s => {
                    const disabled = STATE.orderStep.find(x => x.id === s.id);
                    return `<button onclick="addOrder('${s.id}')" ${disabled ? 'disabled' : ''} class="btn-press p-4 rounded-2xl border-b-4 font-bold flex flex-col items-center gap-1 ${disabled ? 'bg-gray-100 text-gray-400' : 'bg-white border-blue-200 text-blue-700'}">
                        <i data-lucide="${s.icon}" class="w-8 h-8"></i><span>${s.txt}</span>
                    </button>`
                }).join('')}
            </div>
            <button onclick="resetOrder()" class="mt-6 text-blue-400 font-bold underline flex items-center gap-1"><i data-lucide="refresh-cw" class="w-4 h-4"></i> Ulangi</button>
        `;
    }
    // LEVEL 3: QUIZ
    else if (STATE.level === 3) {
        const q = QUIZ_DATA[STATE.quizIndex];
        content = `
            <div class="bg-white p-6 rounded-[2rem] shadow-lg border border-blue-50 mb-6 w-full max-w-md">
                <h3 class="text-xl font-bold text-blue-900 text-center">${q.q}</h3>
            </div>
            <div class="space-y-4 w-full max-w-md">
                ${q.opts.map((o, idx) => `
                    <button onclick="answerQuiz(${o.c})" class="btn-press w-full bg-white border-2 border-gray-200 p-4 rounded-2xl flex items-center gap-4 hover:border-blue-400">
                        <div class="bg-blue-50 p-3 rounded-xl"><i data-lucide="${o.i}" class="w-8 h-8 text-blue-600"></i></div>
                        <span class="text-lg font-bold text-gray-700">${o.t}</span>
                    </button>
                `).join('')}
            </div>
        `;
    }
    // LEVEL 4: DRAG & DROP
    else if (STATE.level === 4) {
        // Wound visualization helper
        let woundContent = '';
        if(STATE.woundState === 0) woundContent = `<div class="w-16 h-16 bg-red-600 rounded-full animate-pulse border-4 border-red-800 flex items-center justify-center shadow-lg"><span class="text-[10px] text-white font-bold">LUKA</span></div>`;
        else if(STATE.woundState === 1) woundContent = `<div class="w-14 h-14 bg-red-400 rounded-full border-2 border-red-500 opacity-80 shadow-sm"></div>`;
        else if(STATE.woundState === 2) woundContent = `<div class="w-14 h-14 bg-amber-700 rounded-full border-2 border-amber-800 opacity-80 scale-90 shadow-sm"></div>`;
        else if(STATE.woundState === 3) woundContent = `<div class="w-24 h-24 bg-white border-4 border-blue-100 shadow-md flex items-center justify-center rounded-2xl transform -rotate-3"><i data-lucide="bandage" class="w-12 h-12 text-pink-400"></i></div>`;

        content = `
            <h3 class="text-lg font-bold text-blue-800 mb-4 text-center bg-white/50 px-4 py-2 rounded-xl">Tarik alat ke arah luka!</h3>
            <div id="drop-zone" class="relative w-64 h-72 bg-pink-50 rounded-[3rem] border-4 border-pink-200 mb-8 overflow-hidden flex items-center justify-center shadow-inner transition-all">
                <div class="w-36 h-full bg-orange-200 rounded-full relative pointer-events-none flex justify-center">
                    <div class="absolute top-1/3 z-10 transition-all duration-500">${woundContent}</div>
                </div>
            </div>
            <div class="flex gap-3 p-3 bg-white/60 backdrop-blur-md rounded-3xl shadow-xl border border-white z-10 w-full justify-center">
                <div class="tool-draggable relative w-20 h-24 bg-blue-100 border-b-4 border-blue-400 rounded-2xl flex flex-col items-center justify-center cursor-grab active:cursor-grabbing" data-tool="water">
                    <i data-lucide="droplets" class="w-8 h-8 pointer-events-none"></i><span class="text-xs font-bold pointer-events-none">Air</span>
                </div>
                <div class="tool-draggable relative w-20 h-24 bg-yellow-100 border-b-4 border-yellow-400 rounded-2xl flex flex-col items-center justify-center cursor-grab active:cursor-grabbing" data-tool="med">
                    <i data-lucide="flask-conical" class="w-8 h-8 pointer-events-none"></i><span class="text-xs font-bold pointer-events-none">Obat</span>
                </div>
                <div class="tool-draggable relative w-20 h-24 bg-pink-100 border-b-4 border-pink-400 rounded-2xl flex flex-col items-center justify-center cursor-grab active:cursor-grabbing" data-tool="bandage">
                    <i data-lucide="bandage" class="w-8 h-8 pointer-events-none"></i><span class="text-xs font-bold pointer-events-none">Plester</span>
                </div>
            </div>
        `;
    }
    // LEVEL 5: EMOTION
    else if (STATE.level === 5) {
        const emos = [
            {id:'sad', i:'frown', l:'Sedih'}, {id:'neutral', i:'meh', l:'Biasa'},
            {id:'happy', i:'smile', l:'Senang'}, {id:'love', i:'heart', l:'Bangga'}
        ];
        content = `
            <h3 class="text-2xl font-black text-blue-800 mb-2 text-center">Bagaimana Perasaanmu?</h3>
            <p class="text-gray-500 mb-8 text-center">Setelah berhasil menolong teman.</p>
            <div class="grid grid-cols-2 gap-6 w-full max-w-md">
                ${emos.map(e => `
                    <button onclick="finishMission()" class="btn-press p-4 rounded-[2rem] bg-white border-4 border-gray-100 hover:border-yellow-400 flex flex-col items-center gap-2">
                        <i data-lucide="${e.i}" class="w-12 h-12 text-yellow-500"></i><span class="font-bold text-gray-600">${e.l}</span>
                    </button>
                `).join('')}
            </div>
        `;
    }

    container.innerHTML = `
        <div class="flex items-center mb-4 w-full">
            <button onclick="navigateTo('menu')" class="btn-press bg-white border-2 border-gray-200 p-2 rounded-full text-gray-500"><i data-lucide="x-circle"></i></button>
        </div>
        ${progressHTML}
        ${content}
    `;
    app.appendChild(container);

    if(STATE.level === 4) initDragAndDrop();
}

function renderScore() {
    const container = document.createElement('div');
    container.className = "min-h-screen bg-yellow-50 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden w-full";
    container.innerHTML = `
        <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/confetti.png')] opacity-20"></div>
        <div class="mb-8 animate-bounce relative z-10">
            <i data-lucide="award" class="w-32 h-32 text-yellow-500 fill-yellow-400 mx-auto"></i>
        </div>
        <h2 class="text-4xl font-black text-yellow-700 mb-2 relative z-10">Luar Biasa!</h2>
        <p class="text-xl text-gray-600 mb-8 relative z-10 font-medium">Kamu adalah Si Penolong Hebat.</p>
        <div class="bg-white p-8 rounded-[3rem] shadow-2xl w-full max-w-xs mb-8 border-4 border-yellow-200 relative z-10">
            <div class="text-gray-400 font-bold uppercase text-xs tracking-widest mb-2">Total Poin</div>
            <div class="text-7xl font-black text-blue-600 drop-shadow-sm">${STATE.score + STATE.missionScore}</div>
        </div>
        <div class="space-y-4 w-full max-w-xs relative z-10">
            <button onclick="navigateTo('menu')" class="btn-press w-full bg-orange-400 text-white font-bold py-4 rounded-2xl shadow-xl flex justify-center gap-2"><i data-lucide="home"></i> Menu Utama</button>
        </div>
    `;
    app.appendChild(container);
    updateAvatar('success', 'Aku bangga sekali padamu!');
}

// --- LOGIC HANDLERS ---

window.navigateTo = (screen) => {
    STATE.screen = screen;
    render();
};

window.setVideoType = (type) => {
    STATE.materiVideoType = type;
    render(); // Re-render to show new video
};

window.changeMateriStep = (delta) => {
    STATE.materiStep += delta;
    render();
};

window.finishMateri = () => {
    // Show Badge Modal manually
    const modal = document.createElement('div');
    modal.className = "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6";
    modal.innerHTML = `
        <div class="bg-white rounded-[3rem] p-8 w-full max-w-sm text-center animate-pop-in shadow-2xl border-4 border-yellow-300">
            <div class="mb-6 relative"><i data-lucide="award" class="w-24 h-24 text-yellow-500 mx-auto fill-yellow-300"></i></div>
            <h2 class="text-2xl font-black text-yellow-600 mb-2 uppercase tracking-wide">Lencana Baru!</h2>
            <h3 class="text-3xl font-bold text-gray-800 mb-4">"Si Penolong"</h3>
            <button onclick="this.parentElement.parentElement.remove(); navigateTo('menu')" class="btn-press w-full bg-green-500 text-white font-bold py-4 rounded-2xl shadow-lg text-xl flex justify-center gap-2">TERIMA <i data-lucide="check-circle"></i></button>
        </div>
    `;
    document.body.appendChild(modal);
    lucide.createIcons();
};

// Misi Logic
window.toggleTool = (id) => {
    if(STATE.selectedTools.includes(id)) STATE.selectedTools = STATE.selectedTools.filter(x => x !== id);
    else STATE.selectedTools.push(id);
    render();
};

window.checkLevel1 = () => {
    const correctIds = TOOLS_DATA.filter(t => t.correct).map(t => t.id);
    const allCorrect = correctIds.every(id => STATE.selectedTools.includes(id)) && STATE.selectedTools.every(id => correctIds.includes(id));
    if(allCorrect) advanceLevel(20, "Benar! Alatnya sudah lengkap.");
    else updateAvatar('error', 'Hmm, ada yang kurang tepat.');
};

window.addOrder = (id) => {
    const step = [{id:'cuci',icon:'soap'},{id:'air',icon:'droplets'},{id:'obat',icon:'flask-conical'},{id:'tutup',icon:'bandage'}].find(x=>x.id===id);
    STATE.orderStep.push(step);
    
    // Check correctness immediately
    const correctOrder = ['cuci', 'air', 'obat', 'tutup'];
    const idx = STATE.orderStep.length - 1;
    
    if(STATE.orderStep[idx].id !== correctOrder[idx]) {
        updateAvatar('error', 'Ups, urutannya salah. Ulangi ya!');
        setTimeout(() => { STATE.orderStep = []; render(); }, 1000);
    } else if(STATE.orderStep.length === 4) {
        advanceLevel(25, "Hebat! Urutannya benar.");
    } else {
        render();
    }
};

window.resetOrder = () => { STATE.orderStep = []; render(); };

window.answerQuiz = (isCorrect) => {
    if(isCorrect) {
        if(STATE.quizIndex < QUIZ_DATA.length - 1) {
            STATE.quizIndex++;
            updateAvatar('happy', 'Benar! Satu lagi...');
            render();
        } else {
            advanceLevel(5, "Pintar sekali!");
        }
    } else {
        updateAvatar('error', 'Kurang tepat. Coba lagi.');
    }
};

window.finishMission = () => {
    advanceLevel(5, "Terima kasih sudah menolong!");
};

function advanceLevel(points, msg) {
    STATE.missionScore += points;
    updateAvatar('success', msg);
    setTimeout(() => {
        if(STATE.level < 5) {
            STATE.level++;
            updateAvatar('waiting', 'Lanjut tahap berikutnya!');
            render();
        } else {
            STATE.score += STATE.missionScore;
            navigateTo('score');
        }
    }, 1500);
}

// DRAG & DROP LOGIC (Vanilla JS)
function initDragAndDrop() {
    const draggables = document.querySelectorAll('.tool-draggable');
    const dropZone = document.getElementById('drop-zone');
    
    draggables.forEach(el => {
        // Touch Support
        el.addEventListener('touchstart', handleStart, {passive: false});
        el.addEventListener('touchmove', handleMove, {passive: false});
        el.addEventListener('touchend', handleEnd);
        
        // Mouse Support
        el.addEventListener('mousedown', handleStart);
    });
    
    let activeDrag = null;
    let ghostEl = null;

    function handleStart(e) {
        e.preventDefault();
        const toolType = this.dataset.tool;
        const touch = e.touches ? e.touches[0] : e;
        
        activeDrag = toolType;
        
        // Create Ghost
        ghostEl = document.createElement('div');
        ghostEl.className = 'draggable-ghost';
        ghostEl.innerHTML = this.innerHTML;
        ghostEl.style.left = touch.clientX + 'px';
        ghostEl.style.top = touch.clientY + 'px';
        document.body.appendChild(ghostEl);
        
        document.addEventListener('mousemove', handleMove);
        document.addEventListener('mouseup', handleEnd);
    }

    function handleMove(e) {
        if(!ghostEl) return;
        e.preventDefault();
        const touch = e.touches ? e.touches[0] : e;
        ghostEl.style.left = touch.clientX + 'px';
        ghostEl.style.top = touch.clientY + 'px';
    }

    function handleEnd(e) {
        if(!activeDrag || !ghostEl) return;
        
        // Collision Detection
        const dropRect = dropZone.getBoundingClientRect();
        const ghostRect = ghostEl.getBoundingClientRect();
        const centerX = ghostRect.left + ghostRect.width/2;
        const centerY = ghostRect.top + ghostRect.height/2;
        
        const isInside = centerX > dropRect.left && centerX < dropRect.right && centerY > dropRect.top && centerY < dropRect.bottom;
        
        if(isInside) {
            processDrop(activeDrag);
        }
        
        // Cleanup
        ghostEl.remove();
        ghostEl = null;
        activeDrag = null;
        document.removeEventListener('mousemove', handleMove);
        document.removeEventListener('mouseup', handleEnd);
    }
    
    function processDrop(tool) {
        if (tool === 'water' && STATE.woundState === 0) {
            STATE.woundState = 1;
            updateAvatar('happy', 'Segar! Kuman hilang.');
        } else if (tool === 'med' && STATE.woundState === 1) {
            STATE.woundState = 2;
            updateAvatar('happy', 'Kuman mati kena obat!');
        } else if (tool === 'bandage' && STATE.woundState === 2) {
            STATE.woundState = 3;
            advanceLevel(45, "Luka tertutup aman!");
            return; // Stop re-render loop via logic
        } else {
            updateAvatar('error', 'Alat itu tidak dipakai sekarang.');
        }
        render(); // Re-render to show wound state change
    }
}

// Audio Toggle
document.getElementById('audio-btn').onclick = function() {
    STATE.audioEnabled = !STATE.audioEnabled;
    this.innerHTML = STATE.audioEnabled ? '<i data-lucide="volume-2"></i>' : '<i data-lucide="volume-x"></i>';
    lucide.createIcons();
};

// Start App
render();
// js/script.js  v52 - JSON完全対応 + タグ診断 + 名前検索
let currentSource = "fanza";
let savedVideos = [];
let allVideos = [];

// localStorage
try {
  const saved = localStorage.getItem('savedVideos');
  if (saved) savedVideos = JSON.parse(saved);
} catch(e) {
  console.warn("localStorage blocked");
}

// JSON読み込み
async function loadVideos() {
  try {
    const res = await fetch('/data/videos.json');
    allVideos = await res.json();
    console.log(`✅ ${allVideos.length}本の作品を読み込みました`);
  } catch(e) {
    console.error("JSON読み込み失敗", e);
    allVideos = [];
  }
}

function setSource(src) {
  currentSource = src;
  document.querySelectorAll('.source-btn').forEach(btn => btn.classList.remove('active'));
  const btn = document.getElementById(src + 'Btn');
  if (btn) btn.classList.add('active');
  initRecommend();
}

function saveVideo(title) {
  if (savedVideos.find(v => v.title === title)) {
    alert("すでに保存済みです");
    return;
  }
  const video = { title: title, source: currentSource || "FANZA" };
  savedVideos.push(video);
  try { localStorage.setItem('savedVideos', JSON.stringify(savedVideos)); } catch(e) {}
  alert(title + " をマイリストに保存しました");
  if (document.getElementById('page14') && !document.getElementById('page14').classList.contains('hidden')) renderMyList();
}

function renderMyList() {
  const grid = document.getElementById('myListTab');
  if (!grid) return;
  if (savedVideos.length === 0) {
    grid.innerHTML = `<p class="text-zinc-400 col-span-full text-center py-12">まだ保存した動画はありません</p>`;
    return;
  }
  grid.innerHTML = savedVideos.map(v => createCard(v)).join('');
}

function renderEveryoneList() {
  const grid = document.getElementById('everyoneListTab');
  if (!grid) return;
  const mock = [{title: "清楚系人気の最新作", source: "FANZA"}];
  grid.innerHTML = mock.map(v => createCard(v)).join('');
}

function switchLaterTab(n) {
  document.getElementById('myListTab').classList.toggle('hidden', n !== 0);
  document.getElementById('everyoneListTab').classList.toggle('hidden', n !== 1);
  document.querySelectorAll('.later-tab').forEach((t, i) => t.classList.toggle('active', i === n));
}

function createCard(v) {
  const link = v.link || '#';
  const image = v.image || "https://picsum.photos/id/1015/600/400";
  return `<div class="card bg-zinc-900 rounded-3xl overflow-hidden">
    <div class="relative aspect-video">
      <a href="${link}" target="_blank">
        <img src="${image}" class="w-full h-full object-cover" alt="${v.title}">
      </a>
    </div>
    <div class="p-4">
      <div class="text-rose-400 text-xs mb-1">${v.source}</div>
      <h3 class="font-medium text-base leading-tight line-clamp-2">${v.title}</h3>
      <div class="text-zinc-400 text-xs mt-1">${v.actress || ''}</div>
      <div class="flex gap-3 mt-4">
        <a href="${link}" target="_blank" class="flex-1 text-center bg-zinc-800 hover:bg-rose-600 py-3 rounded-2xl text-sm font-medium transition-colors">今すぐ見る</a>
        <button onclick="saveVideo('${v.title}')" class="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-2xl text-sm font-medium">保存</button>
      </div>
    </div>
  </div>`;
}

async function initRecommend() {
  const grid = document.getElementById('recommendGrid');
  if (!grid) return;
  if (allVideos.length === 0) await loadVideos();

  let videos = allVideos.filter(v => v.source === currentSource.toUpperCase());
  if (videos.length === 0) videos = allVideos; // 仮データがなければ全部表示

  grid.innerHTML = videos.map(v => createCard(v)).join('');
}

// タグ診断（選択されたタグを含む作品だけ表示）
function fullDiagnose() {
  const selected = Array.from(document.querySelectorAll('#mode1 input[type="checkbox"]:checked'))
    .map(cb => cb.value);

  if (selected.length === 0) {
    initRecommend();
    return;
  }

  const filtered = allVideos.filter(v => {
    return selected.every(tag => v.tags && v.tags.includes(tag));
  });

  showResults(filtered);
}

function quickDiagnose() {
  initRecommend();
}

function randomPick() {
  initRecommend();
}

function showResults(videos) {
  const area = document.getElementById('resultArea');
  const grid = document.getElementById('resultsGrid');
  if (!grid) return;
  grid.innerHTML = videos.map(v => createCard(v)).join('');
  if (area) {
    area.classList.remove('hidden');
    area.scrollIntoView({behavior: "smooth"});
  }
}

// 名前検索
function searchActress() {
  const keyword = document.getElementById('actressSearch').value.trim();
  if (!keyword) {
    initRecommend();
    return;
  }
  const filtered = allVideos.filter(v => 
    v.actress && v.actress.includes(keyword)
  );
  showResults(filtered);
}

function switchTab(n) {
  document.querySelectorAll('.tab').forEach((t, i) => t.classList.toggle('active', i === n));
  document.getElementById('mode0').classList.toggle('hidden', n !== 0);
  document.getElementById('mode1').classList.toggle('hidden', n !== 1);
  document.getElementById('mode2').classList.toggle('hidden', n !== 2);
}

function switchPage(n) {
  document.querySelectorAll('#page0,#page1,#page2,#page3,#page5,#page6,#page14').forEach(p => p.classList.add('hidden'));
  const target = document.getElementById('page' + n);
  if (target) target.classList.remove('hidden');

  document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
  const activeBtn = document.getElementById('nav' + n);
  if (activeBtn) activeBtn.classList.add('active');

  if (n === 14) {
    renderMyList();
    renderEveryoneList();
  }
}

function switchRankTab(n) {
  document.querySelectorAll('.rank-tab').forEach((t, i) => t.classList.toggle('active', i === n));
}

// 起動
loadVideos().then(() => {
  initRecommend();
  switchTab(0);
  switchPage(0);
});

// js/script.js  v48 - 本物FANZAリンク3つ追加
let currentSource = "fanza";
let savedVideos = [];

try {
  const saved = localStorage.getItem('savedVideos');
  if (saved) savedVideos = JSON.parse(saved);
} catch(e) {
  console.warn("localStorage is blocked");
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
  const mock = [
    {title: "清楚系人気の最新作", source: "FANZA", image: "https://pics.dmm.co.jp/digital/video/scdc00010/scdc00010pl.jpg", link: "https://al.fanza.co.jp/?lurl=https%3A%2F%2Fvideo.dmm.co.jp%2Fav%2Fcontent%2F%3Fid%3Dscdc00010&af_id=eromood-004&ch=search_link&ch_id=package"},
    {title: "巨乳VR高評価作品", source: "MGS"},
    {title: "騎乗位特化新作", source: "DUGA"},
    {title: "素人系月額見放題", source: "SOKMIL"}
  ];
  grid.innerHTML = mock.map(v => createCard(v)).join('');
}

function switchLaterTab(n) {
  document.getElementById('myListTab').classList.toggle('hidden', n !== 0);
  document.getElementById('everyoneListTab').classList.toggle('hidden', n !== 1);
  document.querySelectorAll('.later-tab').forEach((t, i) => t.classList.toggle('active', i === n));
}

// 本物FANZAリンク3つ（v48で追加）
const sampleVideosFANZA = [
  {
    title: "清楚系OLの秘密",
    duration: "??",
    source: "FANZA",
    image: "https://pics.dmm.co.jp/digital/video/scdc00010/scdc00010pl.jpg",
    link: "https://al.fanza.co.jp/?lurl=https%3A%2F%2Fvideo.dmm.co.jp%2Fav%2Fcontent%2F%3Fid%3Dscdc00010&af_id=eromood-004&ch=search_link&ch_id=package"
  },
  {
    title: "爆乳美女の誘惑",
    duration: "??",
    source: "FANZA",
    image: "https://pics.dmm.co.jp/digital/video/ebwh00296/ebwh00296pl.jpg",
    link: "https://al.fanza.co.jp/?lurl=https%3A%2F%2Fvideo.dmm.co.jp%2Fav%2Fcontent%2F%3Fid%3Debwh00296&af_id=eromood-004&ch=search_link&ch_id=package"
  },
  {
    title: "人妻の欲情",
    duration: "??",
    source: "FANZA",
    image: "https://pics.dmm.co.jp/digital/video/meyd00654/meyd00654pl.jpg",
    link: "https://al.fanza.co.jp/?lurl=https%3A%2F%2Fvideo.dmm.co.jp%2Fav%2Fcontent%2F%3Fid%3Dmeyd00654&af_id=eromood-004&ch=search_link&ch_id=package"
  },
  {title: "素人巨乳フェラ特化", duration: "08:45", source: "FANZA"},
  {title: "美少女VR体験", duration: "20:11", source: "FANZA"}
];

const sampleVideosMGS = [{title: "プレステージ新作 騎乗位", duration: "15:22", source: "MGS"}];
const sampleVideosDUGA = [{title: "DUGA SOD新作", duration: "18:45", source: "DUGA"}];
const sampleVideosSOKMIL = [{title: "SOKMIL 月額見放題", duration: "22:30", source: "SOKMIL"}];

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
      <h3 class="font-medium text-base leading-tight">${v.title}</h3>
      <div class="flex gap-3 mt-4">
        <a href="${link}" target="_blank" class="flex-1 text-center bg-zinc-800 hover:bg-rose-600 py-3 rounded-2xl text-sm font-medium transition-colors">今すぐ見る</a>
        <button onclick="saveVideo('${v.title}')" class="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-2xl text-sm font-medium">保存</button>
      </div>
    </div>
  </div>`;
}

function initRecommend() {
  const grid = document.getElementById('recommendGrid');
  if (!grid) return;
  let videos = [];
  if (currentSource === "fanza") videos = sampleVideosFANZA;
  else if (currentSource === "mgs") videos = sampleVideosMGS;
  else if (currentSource === "duga") videos = sampleVideosDUGA;
  else if (currentSource === "sokmil") videos = sampleVideosSOKMIL;
  grid.innerHTML = videos.map(v => createCard(v)).join('');
}

// 以下は前回と同じ（quickDiagnose, fullDiagnose, randomPick, showResults, switchTab, switchPage, switchRankTab）
function quickDiagnose() {
  let videos = currentSource === "fanza" ? sampleVideosFANZA : currentSource === "mgs" ? sampleVideosMGS : currentSource === "duga" ? sampleVideosDUGA : sampleVideosSOKMIL;
  const shuffled = [...videos].sort(() => Math.random() - 0.5);
  showResults(shuffled);
}

function fullDiagnose() {
  let videos = currentSource === "fanza" ? sampleVideosFANZA : currentSource === "mgs" ? sampleVideosMGS : currentSource === "duga" ? sampleVideosDUGA : sampleVideosSOKMIL;
  const shuffled = [...videos].sort(() => Math.random() - 0.5);
  showResults(shuffled);
}

function randomPick() {
  let videos = currentSource === "fanza" ? sampleVideosFANZA : currentSource === "mgs" ? sampleVideosMGS : currentSource === "duga" ? sampleVideosDUGA : sampleVideosSOKMIL;
  const shuffled = [...videos].sort(() => Math.random() - 0.5);
  showResults(shuffled);
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
initRecommend();
switchTab(0);
switchPage(0);

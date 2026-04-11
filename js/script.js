// js/script.js  v55 - 診断ページ完全復活版
let currentSource = "fanza";
let savedVideos = [];

// localStorage
try {
  const saved = localStorage.getItem('savedVideos');
  if (saved) savedVideos = JSON.parse(saved);
} catch(e) {
  console.warn("localStorage blocked");
}

// 作品データ（4本）
const allVideos = [
  {
    title: "ブリブリガンギマリDJ媚薬ハブ酒オーバードーズキメセク SEASON21 胡桃さくら",
    actress: "胡桃さくら",
    image: "https://pics.dmm.co.jp/digital/video/bab00186/bab00186pl.jpg",
    link: "https://al.fanza.co.jp/?lurl=https%3A%2F%2Fvideo.dmm.co.jp%2Fav%2Fcontent%2F%3Fid%3Dbab00186&af_id=eromood-004&ch=search_link&ch_id=package",
    source: "FANZA"
  },
  {
    title: "リアル乳袋Iカップ×デカ乳輪清楚系ビッチ美少女レイヤー19歳豪華2篇SP",
    actress: "愛瀬ゆう",
    image: "https://pics.dmm.co.jp/digital/video/scdc00010/scdc00010pl.jpg",
    link: "https://al.fanza.co.jp/?lurl=https%3A%2F%2Fvideo.dmm.co.jp%2Fav%2Fcontent%2F%3Fid%3Dscdc00010&af_id=eromood-004&ch=search_link&ch_id=package",
    source: "FANZA"
  },
  {
    title: "極悪ジムトレーナーに媚薬プロテインを仕込まれ 力強マッスルピストンでドーピングアクメが止まらないぴちむち女子大生 桜野桃",
    actress: "桜野桃",
    image: "https://pics.dmm.co.jp/digital/video/ebwh00296/ebwh00296pl.jpg",
    link: "https://al.fanza.co.jp/?lurl=https%3A%2F%2Fvideo.dmm.co.jp%2Fav%2Fcontent%2F%3Fid%3Debwh00296&af_id=eromood-004&ch=search_link&ch_id=package",
    source: "FANZA"
  },
  {
    title: "義母奴●-特別編- 山口珠理",
    actress: "山口珠理",
    image: "https://pics.dmm.co.jp/digital/video/meyd00654/meyd00654pl.jpg",
    link: "https://al.fanza.co.jp/?lurl=https%3A%2F%2Fvideo.dmm.co.jp%2Fav%2Fcontent%2F%3Fid%3Dmeyd00654&af_id=eromood-004&ch=search_link&ch_id=package",
    source: "FANZA"
  }
];

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
  grid.innerHTML = allVideos.map(v => createCard(v)).join('');
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

function initRecommend() {
  const grid = document.getElementById('recommendGrid');
  if (!grid) return;
  grid.innerHTML = allVideos.map(v => createCard(v)).join('');
}

// 検索診断・タグ診断・ランダム（すべて診断結果エリアに表示）
function quickDiagnose() {
  showResults(allVideos);
}

function fullDiagnose() {
  const selected = Array.from(document.querySelectorAll('#mode1 input[type="checkbox"]:checked'))
    .map(cb => cb.value);
  if (selected.length === 0) {
    showResults(allVideos);
    return;
  }
  const filtered = allVideos.filter(v => 
    v.tags && selected.every(tag => v.tags.includes(tag))
  );
  showResults(filtered);
}

function randomPick() {
  const shuffled = [...allVideos].sort(() => Math.random() - 0.5);
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

function searchActress() {
  const keyword = document.getElementById('actressSearch').value.trim();
  const resultsArea = document.getElementById('actressResults');
  if (!resultsArea) return;

  if (!keyword) {
    resultsArea.innerHTML = `<p class="text-zinc-400 text-center py-12">女優名を入力してください</p>`;
    return;
  }

  const filtered = allVideos.filter(v => 
    v.actress && v.actress.toLowerCase().includes(keyword.toLowerCase())
  );

  if (filtered.length === 0) {
    resultsArea.innerHTML = `<p class="text-zinc-400 text-center py-12">該当する作品が見つかりませんでした</p>`;
    return;
  }

  resultsArea.innerHTML = filtered.map(v => createCard(v)).join('');
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

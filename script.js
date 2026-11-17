/* ==========================================================================
   ANNIVERSARY ENVELOPE - JAVASCRIPT LOGIC & INTERACTIONS
   ========================================================================== */

/* 
  💌 คุณสามารถแก้ไขข้อความ วันที่ และรูปภาพได้ที่ส่วนนี้โดยตรง:
  -------------------------------------------------------------
*/
const ANNIVERSARY_CONFIG = {
  // 1. ชื่อแฟน (ผู้รับ)
  receiverName: "น้องอ้วน",

  // 2. ชื่อของคุณ (ผู้ส่ง)
  senderName: "จากน้องอามเอง",

  // 3. หัวข้อจดหมาย
  letterTitle: "Happy Anniversary 3Y9M นะจ๊ะ 💕",

  // 4. วันที่เริ่มคบกัน (รูปแบบ: ปี-เดือน-วัน ค.ศ. เช่น "2025-02-14")
  startDate: "2026-11-17",

  // 5. ข้อความในจดหมาย (สามารถกด Enter ขึ้นบรรทัดใหม่ได้ตามต้องการ)
  letterBody: `สุขสันต์วันครบรอบนะอ้วน อามมีความสุขมากๆนะที่เรายังอยู่ด้วยกันจนถึงวันนี้ อามหวังว่าเราจะอยู่ด้วยกันเรื่อยๆ คอยจับมือกันจนเรียนจบไปด้วยกัน ขอบคุณที่คอยเข้าใจอาม

ขอบคุณที่แฟนคอยสร้างรอยยิ้มให้ตลอด เราสองคนเองบางทีอาจจะมีทะเลาะกันบ้าง แต่ก็ยังอยากให้คุยกันให้เข้าใจ จับมือกันให้แน่น อามจะคอยซัพพอตอ้วนอยู่ข้างหลัง

ขอให้ความรักเราราบรื่นไปตลอด ขอให้อยู่ด้วยกันไปนานๆ รักอ้วนมากนะ แฟนก็ต้องรักอามมากๆ  `,

  // 6. รูปภาพโพลารอยด์ 3 รูป (ใส่ลิงก์รูปภาพ หรือวางไฟล์รูปไว้ในโฟลเดอร์เดียวกันแล้วใส่ชื่อไฟล์ เช่น "photo1.jpg")
  photo1: "1.jpg",
  caption1: "เอ๋อ",

  photo2: "2.jpg",
  caption2: "เอ๋อเหมือนกัน",

  photo3: "3.jpg",
  caption3: "หล่ออยู่"
};

// State
let hugCount = 0;
let audioContext = null;

// DOM Elements
const envelopeWrapper = document.getElementById("envelopeWrapper");
const waxSeal = document.getElementById("waxSeal");
const letterModal = document.getElementById("letterModal");
const closeLetterBtn = document.getElementById("closeLetterBtn");
const packBackBtn = document.getElementById("packBackBtn");
const hugBtn = document.getElementById("hugBtn");
const hugCountSpan = document.getElementById("hugCount");

// UI Displays
const receiverNameEl = document.getElementById("receiverName");
const senderNameEl = document.getElementById("senderName");
const letterTitleEl = document.getElementById("letterTitle");
const miniLetterTitleEl = document.getElementById("miniLetterTitle");
const letterBodyEl = document.getElementById("letterBody");
const dateTextDisplay = document.getElementById("dateTextDisplay");
const photo1El = document.getElementById("photo1");
const photo2El = document.getElementById("photo2");
const photo3El = document.getElementById("photo3");
const caption1El = document.getElementById("caption1");
const caption2El = document.getElementById("caption2");
const caption3El = document.getElementById("caption3");



// ==========================================================================
// 1. Initial Load & Render
// ==========================================================================
function renderDataToUI() {
  receiverNameEl.textContent = ANNIVERSARY_CONFIG.receiverName;
  senderNameEl.textContent = ANNIVERSARY_CONFIG.senderName;
  letterTitleEl.textContent = ANNIVERSARY_CONFIG.letterTitle;
  miniLetterTitleEl.textContent = ANNIVERSARY_CONFIG.letterTitle;

  // Format Letter Body with paragraphs and love quote
  const paragraphs = ANNIVERSARY_CONFIG.letterBody.split("\n").filter(p => p.trim() !== "");
  let bodyHtml = "";
  paragraphs.forEach(p => {
    bodyHtml += `<p>${p}</p>`;
  });
  bodyHtml += `<p class="letter-love-quote"> อ้วนจะมีอามอยู่ตรงนี้เสมอ 🌷</p>`;
  letterBodyEl.innerHTML = bodyHtml;

  // Format Date Tag to Thai format
  if (ANNIVERSARY_CONFIG.startDate) {
    const parts = ANNIVERSARY_CONFIG.startDate.split("-");
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10);
      const day = parseInt(parts[2], 10);
      const monthsThai = [
        "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
        "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
      ];
      dateTextDisplay.textContent = `${day} ${monthsThai[month - 1] || ""} ${year + 543}`;
    }
  }

  // Photos & Captions
  if (ANNIVERSARY_CONFIG.photo1) photo1El.src = ANNIVERSARY_CONFIG.photo1;
  if (ANNIVERSARY_CONFIG.photo2) photo2El.src = ANNIVERSARY_CONFIG.photo2;
  if (ANNIVERSARY_CONFIG.photo3) photo3El.src = ANNIVERSARY_CONFIG.photo3;
  if (ANNIVERSARY_CONFIG.caption1) caption1El.textContent = ANNIVERSARY_CONFIG.caption1;
  if (ANNIVERSARY_CONFIG.caption2) caption2El.textContent = ANNIVERSARY_CONFIG.caption2;
  if (ANNIVERSARY_CONFIG.caption3) caption3El.textContent = ANNIVERSARY_CONFIG.caption3;

  // Load Saved Hugs
  const savedHugs = localStorage.getItem("anniversary_envelope_hugs");
  if (savedHugs) {
    hugCount = parseInt(savedHugs, 10) || 0;
    hugCountSpan.textContent = hugCount;
  }
}



// ==========================================================================
// 3. Envelope Interactive Opening & Folding Logic
// ==========================================================================
let isEnvelopeOpen = false;

function openEnvelope() {
  if (isEnvelopeOpen) {
    letterModal.classList.add("active");
    return;
  }

  isEnvelopeOpen = true;
  playOpenSound();
  burstHeartsAtElement(waxSeal, 15);

  envelopeWrapper.classList.add("is-open");

  // Smooth delay: flap opens -> sheet pops up -> modal expands
  setTimeout(() => {
    letterModal.classList.add("active");
  }, 900);
}

function packBackEnvelope() {
  letterModal.classList.remove("active");

  setTimeout(() => {
    envelopeWrapper.classList.remove("is-open");
    isEnvelopeOpen = false;
    playFoldSound();
  }, 350);
}

// Event Listeners for Envelope
envelopeWrapper.addEventListener("click", () => {
  openEnvelope();
});

closeLetterBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  packBackEnvelope();
});

packBackBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  packBackEnvelope();
});

// Click outside letter paper to close modal
letterModal.addEventListener("click", (e) => {
  if (e.target === letterModal) {
    packBackEnvelope();
  }
});

// ==========================================================================
// 4. Hug & Love Reaction Eruption
// ==========================================================================
hugBtn.addEventListener("click", (e) => {
  hugCount++;
  hugCountSpan.textContent = hugCount;
  localStorage.setItem("anniversary_envelope_hugs", hugCount);

  playChimeTone();

  // Burst floating love emojis around the button
  const rect = hugBtn.getBoundingClientRect();
  const emojis = ["💖", "💕", "🥰", "🫂", "✨", "🌸", "🫶", "💌", "❤️", "🌹"];
  
  for (let i = 0; i < 14; i++) {
    createBurstEmoji(rect.left + rect.width / 2, rect.top + rect.height / 2, emojis);
  }
});

function createBurstEmoji(originX, originY, emojis) {
  const emojiEl = document.createElement("div");
  emojiEl.className = "floating-burst-emoji";
  emojiEl.textContent = emojis[Math.floor(Math.random() * emojis.length)];

  const randomAngle = Math.random() * Math.PI * 2;
  const distance = 80 + Math.random() * 120;
  const twX = Math.cos(randomAngle) * distance;
  const twY = Math.sin(randomAngle) * distance - 80;
  const twRot = (Math.random() - 0.5) * 60;

  emojiEl.style.left = `${originX}px`;
  emojiEl.style.top = `${originY}px`;
  emojiEl.style.setProperty("--tw-x", `${twX}px`);
  emojiEl.style.setProperty("--tw-y", `${twY}px`);
  emojiEl.style.setProperty("--tw-rot", `${twRot}deg`);

  document.body.appendChild(emojiEl);

  setTimeout(() => {
    emojiEl.remove();
  }, 1200);
}

function burstHeartsAtElement(element, count = 10) {
  const rect = element.getBoundingClientRect();
  const originX = rect.left + rect.width / 2;
  const originY = rect.top + rect.height / 2;
  const emojis = ["❤️", "💖", "✨", "🌸"];
  for (let i = 0; i < count; i++) {
    createBurstEmoji(originX, originY, emojis);
  }
}

// ==========================================================================
// 5. Sound Effects (Web Audio API)
// ==========================================================================
function getAudioContext() {
  if (!audioContext) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    audioContext = new AudioContextClass();
  }
  if (audioContext.state === "suspended") {
    audioContext.resume();
  }
  return audioContext;
}

// Open envelope rustle / whoosh sound
function playOpenSound() {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(320, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(740, ctx.currentTime + 0.35);

    gain.gain.setValueAtTime(0.01, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.4);
  } catch (err) {}
}

// Fold sound
function playFoldSound() {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(620, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(280, ctx.currentTime + 0.3);

    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  } catch (err) {}
}

// Chime tone for hug button
function playChimeTone() {
  try {
    const ctx = getAudioContext();
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    const note = notes[Math.floor(Math.random() * notes.length)];

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(note, ctx.currentTime);

    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  } catch (e) {}
}

// ==========================================================================
// 6. Floating Hearts & Twinkles Canvas Animation
// ==========================================================================
const canvas = document.getElementById("heartCanvas");
const ctx = canvas.getContext("2d");
let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

class FloatingParticle {
  constructor() {
    this.reset();
    this.y = Math.random() * canvas.height;
  }

  reset() {
    this.x = Math.random() * canvas.width;
    this.y = canvas.height + 20;
    this.size = Math.random() * 14 + 10;
    this.speed = Math.random() * 1.2 + 0.6;
    this.angle = Math.random() * Math.PI * 2;
    this.angleSpeed = Math.random() * 0.03 + 0.01;
    this.swing = Math.random() * 2 + 1;
    this.type = Math.random() > 0.4 ? "heart" : "sparkle";
    this.opacity = Math.random() * 0.45 + 0.25;
    this.color = Math.random() > 0.5 ? "rgba(255, 107, 139," : "rgba(255, 182, 193,";
  }

  update() {
    this.y -= this.speed;
    this.angle += this.angleSpeed;
    this.x += Math.sin(this.angle) * this.swing;

    if (this.y < -30) {
      this.reset();
    }
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.fillStyle = `${this.color} ${this.opacity})`;

    if (this.type === "heart") {
      ctx.beginPath();
      const topCurveHeight = this.size * 0.3;
      ctx.moveTo(0, topCurveHeight);
      ctx.bezierCurveTo(
        -this.size / 2, -topCurveHeight,
        -this.size, topCurveHeight,
        0, this.size
      );
      ctx.bezierCurveTo(
        this.size, topCurveHeight,
        this.size / 2, -topCurveHeight,
        0, topCurveHeight
      );
      ctx.fill();
    } else {
      ctx.beginPath();
      const r = this.size * 0.5;
      for (let i = 0; i < 4; i++) {
        ctx.lineTo(Math.cos((i * Math.PI) / 2) * r, Math.sin((i * Math.PI) / 2) * r);
        ctx.lineTo(
          Math.cos((i * Math.PI) / 2 + Math.PI / 4) * (r * 0.28),
          Math.sin((i * Math.PI) / 2 + Math.PI / 4) * (r * 0.28)
        );
      }
      ctx.closePath();
      ctx.fill();
    }

    ctx.restore();
  }
}

for (let i = 0; i < 35; i++) {
  particles.push(new FloatingParticle());
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    p.update();
    p.draw();
  });
  requestAnimationFrame(animateParticles);
}
animateParticles();

// Initialize on page ready
window.addEventListener("DOMContentLoaded", () => {
  renderDataToUI();
});

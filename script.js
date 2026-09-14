// === 1. إعدادات Firebase الحقيقية لمشروعك ===
const firebaseConfig = {
  apiKey: "AIzaSyA464kjckGCVgNe6YhHTXw5lF6bwQv-iqo",
  authDomain: "ahmed-amani-wedding-invitation.firebaseapp.com",
  projectId: "ahmed-amani-wedding-invitation",
  storageBucket: "ahmed-amani-wedding-invitation.firebasestorage.app",
  messagingSenderId: "155063922431",
  appId: "1:155063922431:web:3bf92ba6c6771d183f26ca"
};

// تهيئة الفايربيز
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

document.addEventListener('DOMContentLoaded', () => {

  // === 2. خلفية النجوم المتحركة ===
  const canvas = document.getElementById('starsCanvas');
  const ctx = canvas.getContext('2d');

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  const stars = Array.from({ length: 85 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: Math.random() * 1.5 + 0.5,
    alpha: Math.random(),
    speed: Math.random() * 0.02 + 0.005
  }));

  function animateStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(star => {
      star.alpha += star.speed;
      if (star.alpha > 1 || star.alpha < 0) star.speed = -star.speed;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(243, 198, 35, ${Math.abs(star.alpha)})`;
      ctx.fill();
    });
    requestAnimationFrame(animateStars);
  }
  animateStars();

  // === 3. العداد التنازلي ===
  const targetDate = new Date('November 11, 2026 19:00:00').getTime();

  function updateCountdown() {
    const now = new Date().getTime();
    const diff = targetDate - now;

    if (diff > 0) {
      document.getElementById('days').textContent = String(Math.floor(diff / (1000 * 60 * 60 * 24))).padStart(2, '0');
      document.getElementById('hours').textContent = String(Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, '0');
      document.getElementById('minutes').textContent = String(Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
      document.getElementById('seconds').textContent = String(Math.floor((diff % (1000 * 60)) / 1000)).padStart(2, '0');
    }
  }
  setInterval(updateCountdown, 1000);
  updateCountdown();

  // === 4. تأثير الظهور عند السكرول ===
  const reveals = document.querySelectorAll('.reveal');
  function checkScroll() {
    const triggerBottom = window.innerHeight * 0.88;
    reveals.forEach(el => {
      if (el.getBoundingClientRect().top < triggerBottom) {
        el.classList.add('active');
      }
    });
  }
  window.addEventListener('scroll', checkScroll);
  checkScroll();

  // === 5. توجيه الصور والملفات مباشرة لـ الواتساب (01094414467) ===
  const photoUploader = document.getElementById('photoUploader');
  const whatsappNumber = "201094414467";

  if (photoUploader) {
    photoUploader.addEventListener('change', (e) => {
      const files = e.target.files;
      if (files.length > 0) {
        alert(`تم اختيار ${files.length} ملفات! سيتم تحويلك للواتساب لإرسالها مباشرة إلى العروسين 📸`);
        const whatsappText = encodeURIComponent(`أهلاً أحمد وأماني 🤍، حابب أشارككم اللقطات والصور دي من حفل الزفاف!`);
        window.open(`https://wa.me/${whatsappNumber}?text=${whatsappText}`, '_blank');
      }
    });
  }

  // === 6. حفظ المباركات في Firebase وعرضها فوراً على الموقع ===
  const guestbookForm = document.getElementById('guestbookForm');
  const messagesFeed = document.getElementById('messagesFeed');
  const submitBtn = document.getElementById('submitBtn');

  if (guestbookForm) {
    guestbookForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('guestName').value.trim();
      const message = document.getElementById('guestMessage').value.trim();

      if (name && message) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'جاري الإرسال...';

        try {
          await db.collection('wishes').add({
            name: name,
            message: message,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
          });

          guestbookForm.reset();
          alert('شكراً لك! تم نشر مباركتك بنجاح ✨');
        } catch (error) {
          console.error("Error adding document: ", error);
          alert('حدث خطأ أثناء حفظ المباركة، يرجى المحاولة مرة أخرى.');
        } finally {
          submitBtn.disabled = false;
          submitBtn.textContent = 'نشر المباركة 💌';
        }
      }
    });
  }

  // جلب المباركات من الفايربيز وتحديث الحائط لحظياً
  db.collection('wishes').orderBy('timestamp', 'desc').onSnapshot((snapshot) => {
    messagesFeed.innerHTML = '';
    snapshot.forEach((doc) => {
      const data = doc.data();
      const card = document.createElement('div');
      card.className = 'message-card';
      card.innerHTML = `
        <div class="message-header">
          <span class="message-author">${escapeHtml(data.name)}</span>
        </div>
        <p class="message-text">${escapeHtml(data.message)}</p>
      `;
      messagesFeed.appendChild(card);
    });
  });

  function escapeHtml(str) {
    return str ? str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;") : '';
  }

});
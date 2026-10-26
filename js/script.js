document.addEventListener("DOMContentLoaded", () => {
  console.log("Wedding Invitation Script Initialized.");

  const urlParams = new URLSearchParams(window.location.search);
  const guestNameParam =
    urlParams.get("to") || urlParams.get("u") || urlParams.get("name");
  const guestNameEl = document.getElementById("guest-name");

  if (guestNameParam && guestNameEl) {
    guestNameEl.textContent = decodeURIComponent(
      guestNameParam.replace(/\+/g, " "),
    );
  }

  const btnOpen = document.getElementById("btn-open-invitation");
  const cover = document.getElementById("cover");

  btnOpen.addEventListener("click", () => {
    document.body.classList.remove("locked");
    cover.classList.add("opened");
  });

  const targetDate = new Date("November 15, 2026 08:00:00").getTime();

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance > 0) {
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      document.getElementById("days").textContent = String(days).padStart(
        2,
        "0",
      );
      document.getElementById("hours").textContent = String(hours).padStart(
        2,
        "0",
      );
      document.getElementById("minutes").textContent = String(minutes).padStart(
        2,
        "0",
      );
      document.getElementById("seconds").textContent = String(seconds).padStart(
        2,
        "0",
      );
    } else {
      document.getElementById("days").textContent = "00";
      document.getElementById("hours").textContent = "00";
      document.getElementById("minutes").textContent = "00";
      document.getElementById("seconds").textContent = "00";
    }
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  const rsvpForm = document.getElementById("rsvp-form");
  const wishesList = document.getElementById("wishes-list");
  const wishesCounter = document.getElementById("wishes-counter");

  let guestWishes = [
    {
      name: "Cilla & Keluarga",
      status: "Hadir",
      guestCount: "2",
      message:
        "Selamat menempuh hidup baru untuk Romeo dan Juliet! Semoga menjadi keluarga yang sakinah, mawaddah, warahmah.",
      time: "2 jam yang lalu",
    },
    {
      name: "Siggy",
      status: "Hadir",
      guestCount: "1",
      message:
        "Barakallah lakuma! Semoga senantiasa dipenuhi cinta dan kebahagiaan hingga maut memisahkan.",
      time: "4 jam yang lalu",
    },
    {
      name: "Danya",
      status: "Ragu-ragu",
      guestCount: "1",
      message:
        "Happy wedding kalian berdua! Semoga lancar sampai hari H yaa, doa terbaik selalu.",
      time: "1 hari yang lalu",
    },
  ];

  const storedWishes = localStorage.getItem("wedding_wishes");
  if (storedWishes) {
    try {
      guestWishes = JSON.parse(storedWishes);
    } catch (e) {
      console.error("Gagal memuat wishes dari localStorage", e);
    }
  }

  function renderWishes() {
    wishesList.innerHTML = "";
    wishesCounter.textContent = `${guestWishes.length} Pesan`;

    guestWishes.forEach((item) => {
      let badgeClass = "bg-success";
      if (item.status === "Ragu-ragu") badgeClass = "bg-warning text-dark";
      if (item.status === "Tidak Hadir") badgeClass = "bg-secondary";

      const card = document.createElement("div");
      card.className = "wish-item";
      card.innerHTML = `
        <div class="wish-header">
          <span class="wish-name"><i class="bi bi-person-circle me-1"></i> ${escapeHTML(item.name)}</span>
          <span class="badge ${badgeClass} wish-badge">${escapeHTML(item.status)}</span>
        </div>
        <p class="mb-1 text-secondary small">${escapeHTML(item.message)}</p>
        <div class="text-end">
          <small class="text-muted fst-italic" style="font-size:0.75rem;">${item.time}</small>
        </div>
      `;
      wishesList.appendChild(card);
    });
  }

  function escapeHTML(str) {
    return str.replace(
      /[&<>'"]/g,
      (tag) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          "'": "&#39;",
          '"': "&quot;",
        })[tag] || tag,
    );
  }

  rsvpForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const nameInput = document.getElementById("input-nama").value.trim();
    const guestCount = document.getElementById("select-jumlah").value;
    const messageInput = document.getElementById("input-pesan").value.trim();
    const statusRadio = document.querySelector(
      'input[name="status-hadir"]:checked',
    );

    if (!nameInput) {
      alert("Silakan masukkan nama lengkap Anda!");
      return;
    }
    if (!messageInput) {
      alert("Silakan tulis ucapan atau doa restu!");
      return;
    }

    const newWish = {
      name: nameInput,
      status: statusRadio ? statusRadio.value : "Hadir",
      guestCount: guestCount,
      message: messageInput,
      time: "Baru saja",
    };

    guestWishes.unshift(newWish);
    localStorage.setItem("wedding_wishes", JSON.stringify(guestWishes));
    renderWishes();

    rsvpForm.reset();
    alert(
      `Terima kasih, ${nameInput}! Konfirmasi dan doa Anda telah berhasil dikirim.`,
    );
  });

  renderWishes();

  setupPetals();
});

function copyToClipboard(text, btnElement) {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      const originalContent = btnElement.innerHTML;
      btnElement.innerHTML = `<i class="bi bi-check-circle-fill text-success me-1"></i> Tersalin!`;
      setTimeout(() => {
        btnElement.innerHTML = originalContent;
      }, 2000);
    })
    .catch(() => {
      const tempInput = document.createElement("input");
      tempInput.value = text;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand("copy");
      document.body.removeChild(tempInput);
      btnElement.innerHTML = `<i class="bi bi-check-circle-fill text-success me-1"></i> Tersalin!`;
      setTimeout(() => {
        btnElement.innerHTML = `<i class="bi bi-clipboard me-1"></i> Salin No. Rekening`;
      }, 2000);
    });
}

const petalColor = "rgba(180, 133, 209, 0.45)";

function setupPetals() {
  const canvas = document.getElementById("petals-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const petals = [];
  const petalCount = 28;

  for (let i = 0; i < petalCount; i++) {
    petals.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 8 + 6,
      speedX: Math.random() * 1.5 - 0.75,
      speedY: Math.random() * 1.2 + 0.6,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: Math.random() * 0.02 - 0.01,
    });
  }

  function drawPetals() {
    ctx.clearRect(0, 0, width, height);

    petals.forEach((p) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);

      ctx.fillStyle = petalColor;
      ctx.beginPath();
      ctx.ellipse(0, 0, p.size, p.size * 1.6, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      p.x += p.speedX;
      p.y += p.speedY;
      p.rotation += p.rotationSpeed;

      if (p.y > height + 20) {
        p.y = -20;
        p.x = Math.random() * width;
      }
      if (p.x > width + 20) p.x = -20;
      if (p.x < -20) p.x = width + 20;
    });

    requestAnimationFrame(drawPetals);
  }

  drawPetals();
}

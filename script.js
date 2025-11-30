const envelope = document.getElementById("envelope");
const hint = document.getElementById("hint");
const hearts = document.querySelectorAll(".heart");
const GROOM_NAME = "Mạnh Hùng";
const BRIDE_NAME = "Vân Anh";
// Thông tin tiệc nhà trai
const GROOM_EVENT = {
  time: "10:00, THỨ BẢY",
  locationLabel: "HÔN LỄ ĐƯỢC CỬ HÀNH TẠI",
  location: "Nhà Văn Hóa Khu Dân Cư Bằng B, Hoàng Liệt, Hà Nội",
};

// Thông tin tiệc nhà gái
const BRIDE_EVENT = {
  time: "15:00, THỨ SÁU",
  locationLabel: "TẠI",
  location: "Tư Gia Nhà Gái, Thôn Hương Vinh, Gia Bình, Bắc Ninh",
};

const GROOM_LETTER_DATE = "13.12.2025"; // ngày in trên thiệp nhà trai
const BRIDE_LETTER_DATE = "12.12.2025"; // ví dụ, sửa lại theo ngày nhà gái

const GROOM_CALENDAR_DAY = 13; // ngày cưới nhà trai
const BRIDE_CALENDAR_DAY = 12; // ngày cưới nhà gái (ví dụ)
function playHearts() {
  const delays = [0.15, 0.35, 0.55]; // thời gian xuất hiện: tim 1, tim 2, tim 3

  hearts.forEach((heart, index) => {
    heart.classList.remove("fly");

    // reset animation
    void heart.offsetWidth;

    // set delay khác nhau cho từng trái tim
    heart.style.animationDelay = `${delays[index] || 0}s`;

    heart.classList.add("fly");
  });
}
function openEnvelope() {
  if (!envelope) return;

  // Nếu đang mở dở (opening) hoặc đã mở (open) rồi thì bỏ qua
  if (
    envelope.classList.contains("opening") ||
    envelope.classList.contains("open")
  ) {
    return;
  }
  if(isPlaying === false){
    musicToggle.click(); // tự động bật nhạc khi mở thiệp
  }

  applyUrlParams(); // áp dụng tham số URL khi mở thiệp
  // Bước 1: Đánh dấu là ĐANG MỞ → chỉ có nắp xoay
  envelope.classList.add("opening");

  playHearts();

  // Bước 2: Sau khi flap xoay xong (1s), chuyển sang trạng thái ĐÃ MỞ
  setTimeout(() => {
    envelope.classList.remove("opening"); // bỏ state đang mở
    envelope.classList.add("open"); // thêm state đã mở (lúc này thư mới trượt lên + tăng z-index)
    const inviteBody = document.querySelector(".invite-body");
  if (inviteBody) {
    inviteBody.style.display = "block";               // bắt đầu hiển thị
    inviteBody.style.animation = "slideFadeIn 0.7s ease forwards"; // chạy animation
  }

  // setupScrollReveal();
  }, 450); // match với transition: 1s của .front.flap
}

if (envelope) {
  envelope.addEventListener("click", openEnvelope);
}

if (hint) {
  hint.addEventListener("click", openEnvelope);
}

const music = document.getElementById("bgMusic");
music.volume = 0.6 
const musicToggle = document.getElementById("musicToggle");
let isPlaying = false;

function playMusic() {
  if (!music) return;

  music
    .play()
    .then(() => {
      isPlaying = true;
      musicToggle?.classList.add("playing");
    })
    .catch(() => {});
}

function pauseMusic() {
  if (!music) return;
  music.pause();
  isPlaying = false;
  musicToggle?.classList.remove("playing");
}

musicToggle?.addEventListener("click", () => {
  if (isPlaying) {
    pauseMusic();
  } else {
    playMusic();
  }
});

// --- Đọc name & side từ URL và cập nhật nội dung thiệp ---
function applyUrlParams() {
  if (!window.URLSearchParams) return;

  const params = new URLSearchParams(window.location.search);

  // 1. Đổi tên khách mời theo ?name=
  const guestName = params.get("name");
  const guestNameEl = document.getElementById("guestName");
  const letterGuestNameEl = document.getElementById("letterGuestName");
  if (guestName && guestNameEl) {
    guestNameEl.textContent = guestName.trim();
    letterGuestNameEl.textContent = guestName.trim();
  }

  // 2. Xác định thiệp nhà trai / nhà gái theo ?side=
  //    side hỗ trợ một số giá trị:
  //    - nhà trai: groom, nhatrai, nha-trai, nt
  //    - nhà gái: bride, nhagai, nha-gai, ng
  const sideParam = params.get("side");
  const sideLineEl = document.getElementById("sideLine");
  const guestSideEl = document.getElementById("guestSide");

  if (sideParam) {
    const normalized = sideParam.toLowerCase();
    let familyLineText = "";
    let sideLabel = "";
    let isGroomSide = null;
    if (["groom", "nhatrai", "nha-trai", "nt"].includes(normalized)) {
      familyLineText = "CỦA GIA ĐÌNH NHÀ TRAI";
      sideLabel = "Thiệp nhà trai";
      isGroomSide = true;
    } else if (["bride", "nhagai", "nha-gai", "ng"].includes(normalized)) {
      familyLineText = "CỦA GIA ĐÌNH NHÀ GÁI";
      sideLabel = "Thiệp nhà gái";
      isGroomSide = false;
    }

    // Cập nhật dòng "CỦA GIA ĐÌNH..."
    if (familyLineText && sideLineEl) {
      sideLineEl.textContent = familyLineText;
    }

    // Cập nhật label nhỏ dưới "TRÂN TRỌNG KÍNH MỜI"
    if (sideLabel && guestSideEl) {
      guestSideEl.textContent = sideLabel.toUpperCase();

    }
    if (isGroomSide !== null) {
      updateCoupleOrder(isGroomSide);
      updateEventInfo(isGroomSide);   // đổi giờ + địa điểm
      // updateLetterDate(isGroomSide);   
      updateCalendarDay(isGroomSide);
    }
  }
}

let scrollRevealInitialized = false;

function setupScrollReveal() {
  if (scrollRevealInitialized) return;
  scrollRevealInitialized = true;

  // Tất cả các phần cần reveal trong invite-body
  const sections = document.querySelectorAll(".invite-body .reveal-section");
  if (!sections.length) return;

  // Scroll container chính là .invite-card
  const scrollRoot = document.querySelector(".invite-card") || null;

  const options = {
    root: scrollRoot,           // observe theo khung cuộn của thiệp
    threshold: 0.15,            // tối thiểu 15% xuất hiện
    rootMargin: "0px 0px -10% 0px", // cho phép trigger sớm hơn 1 chút
  };

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          obs.unobserve(entry.target); // chỉ animate 1 lần
        }
      });
    }, options);

    sections.forEach((sec) => observer.observe(sec));
  } else {
    // fallback cho browser rất cũ: hiện luôn
    sections.forEach((sec) => sec.classList.add("revealed"));
  }
}

function updateCoupleOrder(isGroomSide) {
  const letterGroom = document.getElementById("letterGroomName");
  const letterBride = document.getElementById("letterBrideName");
  const mainGroom = document.getElementById("mainGroomName");
  const mainBride = document.getElementById("mainBrideName");

  if (!letterGroom || !letterBride || !mainGroom || !mainBride) return;

  if (isGroomSide) {
    // Nhà trai: chú rể trước, cô dâu sau
    letterGroom.textContent = GROOM_NAME;
    letterBride.textContent = BRIDE_NAME;
    mainGroom.textContent = GROOM_NAME;
    mainBride.textContent = BRIDE_NAME;
  } else {
    // Nhà gái: cô dâu trước, chú rể sau
    letterGroom.textContent = BRIDE_NAME;
    letterBride.textContent = GROOM_NAME;
    mainGroom.textContent = BRIDE_NAME;
    mainBride.textContent = GROOM_NAME;
  }
}

function updateEventInfo(isGroomSide) {
  const mainTimeEl = document.getElementById("mainTime");
  const mainLocationLabelEl = document.getElementById("mainLocationLabel");
  const mainLocationEl = document.getElementById("mainLocation");

  if (!mainTimeEl || !mainLocationLabelEl || !mainLocationEl) return;

  const eventInfo = isGroomSide ? GROOM_EVENT : BRIDE_EVENT;

  mainTimeEl.textContent = eventInfo.time;
  mainLocationLabelEl.textContent = eventInfo.locationLabel;
  mainLocationEl.textContent = eventInfo.location;
}

// function updateLetterDate(isGroomSide) {
//   const letterDateEl = document.getElementById("letterDate");
//   if (!letterDateEl) return;

//   letterDateEl.textContent = isGroomSide
//     ? GROOM_LETTER_DATE
//     : BRIDE_LETTER_DATE;
// }

function updateCalendarDay(isGroomSide) {
  const days = document.querySelectorAll(".calendar-day");
  if (!days.length) return;

  // 1. Bỏ class trái tim ở tất cả các ngày
  days.forEach((d) => d.classList.remove("calendar-day-heart"));

  // 2. Xác định ngày cần highlight
  const targetDay = isGroomSide ? GROOM_CALENDAR_DAY : BRIDE_CALENDAR_DAY;

  // 3. Tìm span có text = targetDay và thêm lại class
  days.forEach((d) => {
    const dayNumber = parseInt(d.textContent.trim(), 10);
    if (dayNumber === targetDay) {
      d.classList.add("calendar-day-heart");
    }
  });
}
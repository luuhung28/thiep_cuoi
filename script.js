const envelope = document.getElementById("envelope");
const hint = document.getElementById("hint");
const hearts = document.querySelectorAll(".heart");

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
  musicToggle.click(); // tự động bật nhạc khi mở thiệp
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


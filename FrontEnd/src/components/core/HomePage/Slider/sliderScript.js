document.addEventListener("DOMContentLoaded", () => {
  const cardList = document.querySelector(".cardList .cards__wrapper");
  const infoList = document.querySelector(".infoList .info__wrapper");
  const bgImages = document.querySelectorAll(".app__bg__image");

  const leftBtn = document.querySelector(".cardList__btn.btn--left");
  const rightBtn = document.querySelector(".cardList__btn.btn--right");

  const cards = document.querySelectorAll(".card");
  const infos = document.querySelectorAll(".info");

  let currentIndex = 0;
  const total = cards.length;

  function updateSlider(index) {
    // Cards
    cards.forEach((card, i) => {
      card.classList.remove("previous--card", "next--card", "current--card");
      if (i === index) {
        card.classList.add("current--card");
      } else if (i === (index + 1) % total) {
        card.classList.add("next--card");
      } else if (i === (index - 1 + total) % total) {
        card.classList.add("previous--card");
      }
    });

    // Infos
    infos.forEach((info, i) => {
      info.classList.remove("previous--info", "next--info", "current--info");
      if (i === index) {
        info.classList.add("current--info");
      } else if (i === (index + 1) % total) {
        info.classList.add("next--info");
      } else if (i === (index - 1 + total) % total) {
        info.classList.add("previous--info");
      }
    });

    // Background images
    bgImages.forEach((img, i) => {
      img.classList.remove("previous--image", "next--image", "current--image");
      if (i === index) {
        img.classList.add("current--image");
      } else if (i === (index + 1) % total) {
        img.classList.add("next--image");
      } else if (i === (index - 1 + total) % total) {
        img.classList.add("previous--image");
      }
    });
  }

  function navigate(direction) {
    if (direction === "left") {
      currentIndex = (currentIndex - 1 + total) % total;
    } else if (direction === "right") {
      currentIndex = (currentIndex + 1) % total;
    }
    updateSlider(currentIndex);
  }

  leftBtn.addEventListener("click", () => navigate("left"));
  rightBtn.addEventListener("click", () => navigate("right"));

  // Initial setup
  updateSlider(currentIndex);

  // Optional: keyboard nav
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") navigate("left");
    if (e.key === "ArrowRight") navigate("right");
  });
});

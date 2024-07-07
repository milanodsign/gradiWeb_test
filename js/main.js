document.addEventListener("DOMContentLoaded", async () => {
  let slideIndex = 1;
  const carousel = document.querySelector(".carousel");
  let slides = [];

  try {
    const response = await fetch(
      "https://gradistore-spi.herokuapp.com/products/all"
    );
    const data = await response.json();

    slides = data?.products?.nodes?.map((product, index) => {
      const { estrellas, totalTag } = calcularEstrellas(product.tags);

      const formatAmount = (amount) => {
        return parseFloat(amount).toLocaleString("de-DE", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      };

      const slide = document.createElement("div");
      slide.classList.add("slide");
      slide.innerHTML = `
        <span class="contImg">
            <img src="${product.featuredImage.url}" alt="${product.title}">
            <button class="addCart">${index % 2 === 0 ? "ADD TO CART" : "SEE MORE"}</button>
        </span>
        <div class="caption">
          <span class="productTitle">${product.title}</span>
          <div class="info">
            <span class="productStars"><span class="stars">${"★".repeat(estrellas)}</span> (${totalTag})</span>
            <span class="productAmount">
                <span>
                    ${product.prices.min.currencyCode === "EUR" ? "€" : "$"}
                    ${formatAmount(product.prices.min.amount)}
                </span>
                <span>
                    ${product.prices.max.currencyCode === "EUR" ? "€" : "$"}
                    ${formatAmount(product.prices.max.amount)}
                </span>
            </span>
          </div>
          <p></p>
        </div>
      `;
      return slide;
    });

    slides.forEach((slide) => {
      carousel.appendChild(slide);
    });

    setupCarousel();
  } catch (error) {
    console.error("Error fetching data:", error);
  }

  const setupCarousel = () => {
    const slideWidth = carousel.querySelector(".slide").offsetWidth;

    const firstSlides = Array.from(carousel.querySelectorAll(".slide")).slice(
      0,
      slides.length
    );
    firstSlides.forEach((slide) => carousel.appendChild(slide.cloneNode(true)));

    carousel.style.overflowX = "hidden";
    carousel.style.display = "flex";

    slides.forEach((slide) => {
      slide.style.flex = `0 0 ${slideWidth}px`;
    });

    showSlides();
  };

  const showSlides = () => {
    const slideWidth = carousel.querySelector(".slide").offsetWidth;
    carousel.scrollTo({
      left: slideIndex * slideWidth,
      behavior: "smooth",
    });
  };

  document.querySelector(".prev").addEventListener("click", () => {
    slideIndex = Math.max(slideIndex - 1, 1);
    if (slideIndex <= 0) {
      slideIndex = slides.length;
    }
    showSlides();
  });

  document.querySelector(".next").addEventListener("click", () => {
    slideIndex = Math.min(slideIndex + 1, slides.length);
    if (slideIndex > slides.length) {
      slideIndex = 1;
    }
    showSlides();
  });

  carousel.addEventListener("transitionend", () => {
    if (slideIndex === slides.length + 1) {
      carousel.style.transition = "none";
      slideIndex = 1;
      carousel.scrollTo({
        left: slideIndex * carousel.querySelector(".slide").offsetWidth,
        behavior: "auto",
      });
    } else if (slideIndex === 0) {
      carousel.style.transition = "none";
      slideIndex = slides.length;
      carousel.scrollTo({
        left: slideIndex * carousel.querySelector(".slide").offsetWidth,
        behavior: "auto",
      });
    }
  });
});

const calcularEstrellas = (tags) => {
  let total = 0;

  const valorNumerico = tags
    .filter((tag) => !isNaN(tag))
    .map((tag) => parseInt(tag));

  if (valorNumerico.length === 0) {
    return { estrellas: 0, totalTag: 0 };
  }

  total = Math.round(
    valorNumerico.reduce((acc, val) => acc + val, 0) / valorNumerico.length
  );

  let estrellas = 0;

  if (total >= 0 && total < 100) {
    estrellas = 1;
  } else if (total >= 100 && total < 200) {
    estrellas = 2;
  } else if (total >= 200 && total < 300) {
    estrellas = 3;
  } else if (total >= 300 && total < 400) {
    estrellas = 4;
  } else if (total >= 400 && total <= 500) {
    estrellas = 5;
  } else {
    estrellas = 0;
  }

  return { estrellas, totalTag: total };
};

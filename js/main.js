document.addEventListener("DOMContentLoaded", async () => {
  let slideIndex = 1; // Comenzar en 1 para evitar el primer slide vacío
  const carousel = document.querySelector(".carousel");
  let slides = []; // Declarar slides fuera del bloque try

  try {
    const response = await fetch(
      "https://gradistore-spi.herokuapp.com/products/all"
    );
    const data = await response.json();

    slides = data?.products?.nodes?.map((product) => {
      const slide = document.createElement("div");
      slide.classList.add("slide");
      slide.innerHTML = `
        <span class="contImg">
            <img src="${product.featuredImage.url}" alt="${product.title}">
            <button class="addCart">ADD CART</button>
        </span>
        <div class="caption">
          <h3>${product.title}</h3>
          <div class="info"></div>
          <p>${product.prices.min.amount}</p>
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

    // Clonar slides al inicio y al final para hacer el carrusel infinito
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

  // Opcional: Resetear el índice y desplazamiento para mantener el ciclo infinito al cargar
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

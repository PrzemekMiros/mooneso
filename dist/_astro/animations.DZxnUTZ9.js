function animationMain() {
  // wymagane biblioteki muszą być załadowane
  if (!window.gsap || !window.ScrollTrigger || !window.SplitText || !window.Lenis) return;

  // cleanup po poprzednich nawigacjach (swup)
  if (window.__lenisRaf) {
    window.gsap.ticker.remove(window.__lenisRaf);
    window.__lenisRaf = null;
  }
  if (window.__lenisInstance) {
    try { window.__lenisInstance.destroy(); } catch (_) {}
    window.__lenisInstance = null;
  }
  window.ScrollTrigger.getAll().forEach((st) => st.kill());

  window.scrollTo(0, 0);
  gsap.registerPlugin(ScrollTrigger);

  // Inicjalizacja Lenis do płynnego przewijania
  const lenis = new Lenis({
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    lerp: 0.1,
    smooth: true,
    smoothTouch: false,
    touchMultiplier: 1.5,
    wheelMultiplier: 1,
    infinite: false,
    autoResize: true
  });
  window.__lenisInstance = lenis;
  const lenisRaf = (time) => lenis.raf(time * 1000);
  window.__lenisRaf = lenisRaf;

  // Funkcja do przewijania do sekcji
  const scrollToSection = (targetPosition) => {
    lenis.scrollTo(targetPosition);
  };

  // Obsługa kliknięć w linki przewijające (unikamy duplikatów)
  const anchorHandler = function (e) {
    e.preventDefault();
    const targetId = this.getAttribute("href").substring(1);
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
      const currentScroll = window.scrollY;
      let offsetPosition = elementPosition > currentScroll ? elementPosition - 35 : elementPosition - 115;
      scrollToSection(offsetPosition);
    }
  };
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    if (anchor.__lenisAnchorHandler) {
      anchor.removeEventListener("click", anchor.__lenisAnchorHandler);
    }
    anchor.__lenisAnchorHandler = anchorHandler;
    anchor.addEventListener("click", anchorHandler);
  });

  // Synchronizacja Lenis z ScrollTrigger
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add(lenisRaf);

  // Animacje dla dużych ekranów
  if (window.matchMedia("(min-width: 767px)").matches) {
    // Animacje dla tekstu podzielonego na linie
    const splitTextLines = document.querySelectorAll(".split-lines");
    splitTextLines.forEach((element) => {
      const mySplitText = new SplitText(element, { type: "lines", linesClass: "line" });
      new SplitText(element, { type: "lines", linesClass: "line-parent" });

      gsap.from(mySplitText.lines, {
        duration: 0.65,
        delay: 0.4,
        stagger: 0.05,
        yPercent: 105,
        ease: "power2",
        scrollTrigger: {
          trigger: element,
          start: "top 95%",
        },
      });
    });

    let splitTextChars = [...document.querySelectorAll(".split-chars")];
    splitTextChars.forEach((element) => {
      new SplitText(element, {
        type: "words, chars",
        wordsClass: "word",
        charsClass: "char-perspective",
      });
      let mySplitText = new SplitText(element, {
        type: "chars",
        charsClass: "char",
      });

      gsap.from(mySplitText.chars, {
        autoAlpha: 0,
        opacity: 0,
        rotateY: "90",
        transform: "translateZ(-0.5em)",
        scale: 1.2,
        x: "100%",
        duration: 2,
        delay: 0.3,
        ease: Expo.easeOut,
        stagger: {
          amount: 0.5,
          from: "0",
        },
        scrollTrigger: {
          trigger: element,
        },
      });
    });

    // Handwrite --------------------------------------------------------------
    let splitTextLetters = [...document.querySelectorAll(".split-letters")];
    splitTextLetters.forEach((element) => {
      new SplitText(element, {
        type: "words, chars",
        wordsClass: "word",
        charsClass: "char-perspective",
      });
      let mySplitText = new SplitText(element, {
        type: "chars",
        charsClass: "char",
      });

      gsap.from(mySplitText.chars, {
        autoAlpha: 0,
        opacity: 0,
        duration: 2,
        delay: 0.8,
        ease: Expo.easeOut,
        stagger: {
          amount: 0.5,
          from: "0",
        },
        scrollTrigger: {
          trigger: element,
        },
      });
    });

    // Animacje dla podświetlenia tekstu
    const textHighlights = document.querySelectorAll(".text-highlight");
    textHighlights.forEach((textHighlight) => {
      const splitText = new SplitText(textHighlight, { type: "lines, chars", charsClass: "char-highlight" });
      const tlh = gsap.timeline({
        scrollTrigger: {
          trigger: textHighlight,
          scrub: 1,
          start: "top 70%",
          end: "bottom 80%",
        },
      });
      tlh.from(".char-highlight", { opacity: 0.2, stagger: 0.3 });
    });

    // Animacje fade-in
    const boxes = gsap.utils.toArray(".fade-in");
    boxes.forEach((fadeElement) => {
      const anim = gsap.fromTo(fadeElement, { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.75, delay: 0.4 });
      ScrollTrigger.create({ trigger: fadeElement, animation: anim, once: true });
    });

    // Animacje linii
    const lineX = gsap.utils.toArray(".line-x");
    lineX.forEach((lineXItem) => {
      gsap.from(lineXItem, {
        width: "0",
        duration: 0.75,
        delay: 0.4,
        ease: "power2.inOut",
        scrollTrigger: { trigger: lineXItem, start: "top 90%" },
      });
    });

    // Reveal images
    function imageReveal() {
      const revealContainers = document.querySelectorAll(".reveal");
      revealContainers.forEach((container) => {
        let clipPath;
        if (container.classList.contains("reveal--left")) clipPath = "inset(0 0 0 100%)";
        if (container.classList.contains("reveal--right")) clipPath = "inset(0 100% 0 0)";
        if (container.classList.contains("reveal--top")) clipPath = "inset(0 0 100% 0)";
        if (container.classList.contains("reveal--bottom")) clipPath = "inset(100% 0 0 0)";

        const image = container.querySelector("img");
        const tl = gsap.timeline({
          scrollTrigger: { trigger: container, start: "top bottom", end: "bottom top" },
        });

        tl.set(container, { autoAlpha: 1 });
        tl.from(container, { clipPath, duration: 1, delay: 0.2, ease: Power4.easeInOut });
        if (container.classList.contains("reveal--overlay")) {
          tl.from(image, { clipPath, duration: 0.6, ease: Power4.easeOut });
        }
        tl.from(image, { scale: 1.3, duration: 1.2, delay: -1, ease: Power2.easeOut });
      });
      ScrollTrigger.refresh();
    }
    imageReveal();

    // Animacje parallax
    gsap.utils.toArray(".parallax-wrap").forEach((container) => {
      const image = container.querySelector("img");
      gsap.set(container, { overflow: "hidden" });
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          scrub: true,
          pin: false,
        },
      });
      tl.from(image, { yPercent: -9, ease: "none" }).to(image, { yPercent: 9, ease: "none" });
    });

    // Animacje parallax dla stopki
    gsap.from(".footer-parallax", {
      opacity: 0,
      y: "-25%",
      scrollTrigger: {
        trigger: ".footer-parallax",
        start: "top bottom",
        end: "bottom 85%",
        scrub: true,
      },
    });

    // Animacje magnetyczne (bez duplikacji listenerów)
    const magnets = document.querySelectorAll(".magnetic");
    magnets.forEach((magnet) => {
      const moveMagnet = (event) => {
        const bounding = magnet.getBoundingClientRect();
        const magnetsStrength = magnet.getAttribute("data-strength") || 100;
        const magnetText = magnet.querySelector(".btn-text");

        gsap.to(magnet, {
          x: (((event.clientX - bounding.left) / magnet.offsetWidth) - 0.5) * magnetsStrength,
          y: (((event.clientY - bounding.top) / magnet.offsetHeight) - 0.5) * magnetsStrength,
          duration: 0.5,
          ease: "Power2.easeOut",
        });

        if (magnetText) {
          gsap.to(magnetText, {
            x: (((event.clientX - bounding.left) / magnet.offsetWidth) - 0.5) * magnetsStrength,
            y: (((event.clientY - bounding.top) / magnet.offsetHeight) - 0.5) * magnetsStrength,
            duration: 0.5,
            ease: "Power2.easeOut",
          });
        }
      };

      const leaveMagnet = () => {
        gsap.to(magnet, 1.5, { x: 0, y: 0, ease: "Elastic.easeOut" });
        const magnetText = magnet.querySelector(".btn-text");
        if (magnetText) {
          gsap.to(magnetText, 1.5, { x: 0, y: 0, ease: "Elastic.easeOut" });
        }
      };

      if (magnet.__magMove) {
        magnet.removeEventListener("mousemove", magnet.__magMove);
        magnet.removeEventListener("mouseleave", magnet.__magLeave);
      }
      magnet.__magMove = moveMagnet;
      magnet.__magLeave = leaveMagnet;
      magnet.addEventListener("mousemove", moveMagnet);
      magnet.addEventListener("mouseleave", leaveMagnet);
    });
  }

  ScrollTrigger.refresh();
}

// expose globally
window.animationMain = animationMain;

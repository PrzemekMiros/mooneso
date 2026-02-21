function animationMain() {
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

  // Funkcja do przewijania do sekcji
  function scrollToSection(targetPosition) {
    lenis.scrollTo(targetPosition);
  }

  // Obsługa kliknięć w linki przewijające
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function(e) {
      e.preventDefault();
      const targetId = this.getAttribute("href").substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
        const currentScroll = window.scrollY;
        let offsetPosition = elementPosition > currentScroll ? elementPosition - 35 : elementPosition - 115;
        scrollToSection(offsetPosition);
      }
    });
  });

  // Synchronizacja Lenis z ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));

  // Animacje dla dużych ekranów
  if (window.matchMedia("(min-width: 767px)").matches) {
    // Animacje dla tekstu podzielonego na linie
    const splitTextLines = document.querySelectorAll(".split-lines");
    splitTextLines.forEach(element => {
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


    
let splitTextChars = [...document.querySelectorAll('.split-chars')];

splitTextChars.forEach(element =>{
  new SplitText(element, { 
    type: "words, chars",
    wordsClass: "word",
    charsClass: "char-perspective" 
  });
  let mySplitText = new SplitText(element, {
    type:"chars",
    charsClass: "char"
  });
  
   gsap.from(mySplitText.chars, {
       autoAlpha: 0,
       opacity: 0,
       rotateY: "90",
       transform: 'translateZ(-0.5em)',
       scale: 1.2,
       x: "100%",
       duration: 2,
       delay: 0.3,
       ease: Expo.easeOut,
       stagger: {
         amount: 0.5,
         from: "0"
       },
       scrollTrigger: { 
         trigger: element,
         //toggleActions: 'restart pause reverse pause',
       },
   })
});


// Handwrite --------------------------------------------------------------

let splitTextLetters = [...document.querySelectorAll('.split-letters')];

splitTextLetters.forEach(element =>{
  new SplitText(element, { 
    type: "words, chars",
    wordsClass: "word",
    charsClass: "char-perspective" 
  });
  let mySplitText = new SplitText(element, {
    type:"chars",
    charsClass: "char"
  });
  
   gsap.from(mySplitText.chars, {
       autoAlpha: 0,
       opacity: 0,
       duration: 2,
       delay: 0.8,
       ease: Expo. easeOut,
       stagger: {
         amount: 0.5,
         from: "0"
       },
       scrollTrigger: { 
         trigger: element,
         //toggleActions: 'restart pause reverse pause',
       },
   })
});


    // Animacje dla podświetlenia tekstu
    const textHighlights = document.querySelectorAll(".text-highlight");
    textHighlights.forEach(textHighlight => {
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
    const boxes = gsap.utils.toArray('.fade-in');
    boxes.forEach(fadeElement => {
      const anim = gsap.fromTo(fadeElement, { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.75, delay: 0.4 });
      ScrollTrigger.create({ trigger: fadeElement, animation: anim, once: true });
    });

    // Animacje linii
    const lineX = gsap.utils.toArray(".line-x");
    lineX.forEach(lineXItem => {
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
    // Left to right
    if (container.classList.contains("reveal--left")) {
      clipPath = "inset(0 0 0 100%)";
    }
    // Right to left
    if (container.classList.contains("reveal--right")) {
      clipPath = "inset(0 100% 0 0)";
    }
    // Top to bottom
    if (container.classList.contains("reveal--top")) {
      clipPath = "inset(0 0 100% 0)";
    }
    // Bottom to top
    if (container.classList.contains("reveal--bottom")) {
      clipPath = "inset(100% 0 0 0)";
    }

    const image = container.querySelector("img");

    // Animation trigger
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top bottom",
        end: "bottom top",
      }
    });

    // Animation timeline
    tl.set(container, { autoAlpha: 1 });
    tl.from(container, {
      clipPath,
      duration: 1,
      delay: 0.2,
      ease: Power4.easeInOut
    });
    if (container.classList.contains("reveal--overlay")) {
      tl.from(image, { clipPath, duration: 0.6, ease: Power4.easeOut });
    }
    tl.from(image, {
      scale: 1.3,
      duration: 1.2,
      delay: -1,
      ease: Power2.easeOut
    });
  });

  ScrollTrigger.refresh();
}
imageReveal();


    // Animacje parallax
    gsap.utils.toArray(".parallax-wrap").forEach(container => {
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

    // Animacje magnetyczne
    const magnets = document.querySelectorAll('.magnetic');
    const strength = 100;

    magnets.forEach(magnet => {
      magnet.addEventListener('mousemove', moveMagnet);
      magnet.addEventListener('mouseleave', () => {
        gsap.to(magnet, 1.5, { x: 0, y: 0, ease: 'Elastic.easeOut' });
        gsap.to(magnet.querySelector(".btn-text"), 1.5, { x: 0, y: 0, ease: 'Elastic.easeOut' });
      });
    });

    function moveMagnet(event) {
      const magnetButton = event.currentTarget;
      const bounding = magnetButton.getBoundingClientRect();
      const magnetsStrength = magnetButton.getAttribute("data-strength");
      const magnetText = magnetButton.querySelector(".btn-text");

      gsap.to(magnetButton, {
        x: (((event.clientX - bounding.left) / magnetButton.offsetWidth) - 0.5) * magnetsStrength,
        y: (((event.clientY - bounding.top) / magnetButton.offsetHeight) - 0.5) * magnetsStrength,
        duration: 0.5,
        ease: 'Power2.easeOut',
      });

      gsap.to(magnetText, {
        x: (((event.clientX - bounding.left) / magnetButton.offsetWidth) - 0.5) * magnetsStrength,
        y: (((event.clientY - bounding.top) / magnetButton.offsetHeight) - 0.5) * magnetsStrength,
        duration: 0.5,
        ease: 'Power2.easeOut',
      });
    }

    // Animacje postępu przewijania
    gsap.to(".scrollprogress", {
      height: "100vh",
      ease: 'none',
      scrollTrigger: {
        trigger: ".scrollContainer",
        start: "top 0%",
        end: "bottom 99%",
        scrub: true,
      },
    });
  }

}

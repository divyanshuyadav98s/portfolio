// --- 1. SMOOTH SCROLL (LENIS) ---
let lenis;
if (typeof Lenis !== "undefined") {
  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  });

  function raf(time) {
    lenis.raf(time);
    ScrollTrigger.update();
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
} else {
  console.warn("Lenis not defined - scrolling will be standard");
  document.documentElement.style.scrollBehavior = "smooth";
}

// --- 2. MOBILE MENU LOGIC ---
const menuBtn = document.getElementById("menu-btn");
const mobileMenu = document.getElementById("mobile-menu");
const burgerTop = document.getElementById("burger-top");
const burgerBot = document.getElementById("burger-bot");
let isMenuOpen = false;

function toggleMenu() {
  isMenuOpen = !isMenuOpen;
  if (isMenuOpen) {
    gsap.to(mobileMenu, { x: 0, duration: 0.6, ease: "expo.out" });
    gsap.to(burgerTop, { rotation: 45, y: 3, duration: 0.3 });
    gsap.to(burgerBot, { rotation: -45, y: -3, duration: 0.3 });
  } else {
    closeMenu();
  }
}

function closeMenu() {
  isMenuOpen = false;
  gsap.to(mobileMenu, { x: "100%", duration: 0.6, ease: "expo.in" });
  gsap.to(burgerTop, { rotation: 0, y: 0, duration: 0.3 });
  gsap.to(burgerBot, { rotation: 0, y: 0, duration: 0.3 });
}

menuBtn.addEventListener("click", toggleMenu);

// --- 3. NAV LINK SMOOTH SCROLLING ---
document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const targetId = link.getAttribute("data-target");
    if (targetId && lenis) {
      lenis.scrollTo(targetId);
    } else {
      // Fallback
      document
        .querySelector(targetId)
        .scrollIntoView({ behavior: "smooth" });
    }
  });
});

// --- 4. CURSOR LOGIC & MAGNETIC EFFECT ---
const cursorDot = document.querySelector(".cursor-dot");
const cursorCircle = document.querySelector(".cursor-circle");

// Initialize cursor position
gsap.set([cursorDot, cursorCircle], { xPercent: -50, yPercent: -50 });

let mouseX = 0;
let mouseY = 0;
let cursorX = 0;
let cursorY = 0;

document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

// Smooth cursor animation loop
gsap.ticker.add(() => {
  // Lerp for smooth trailing
  cursorX += (mouseX - cursorX) * 0.15;
  cursorY += (mouseY - cursorY) * 0.15;

  gsap.set(cursorDot, { x: mouseX, y: mouseY });
  gsap.set(cursorCircle, { x: cursorX, y: cursorY });
});

// Advanced Magnetic & Sticky Effect
const allInteractives = document.querySelectorAll("a, button, .magnetic, .creative-letter, .nav-link");

allInteractives.forEach((el) => {
  el.addEventListener("mousemove", (e) => {
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    // Move the element towards the mouse (Magnetic)
    gsap.to(el, { 
      x: x * 0.4, 
      y: y * 0.4, 
      duration: 0.3, 
      ease: "power2.out" 
    });

    // Optional: Make cursor stick to the element slightly
    // We can scale the cursor or change its color here
  });

  el.addEventListener("mouseenter", () => {
    document.body.classList.add("hovering");
    
    // Scale up cursor
    gsap.to(cursorCircle, { 
      scale: 2, 
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      borderColor: "transparent",
      duration: 0.3 
    });
    gsap.to(cursorDot, { scale: 0, duration: 0.3 });
  });

  el.addEventListener("mouseleave", () => {
    document.body.classList.remove("hovering");

    // Reset element position
    gsap.to(el, { 
      x: 0, 
      y: 0, 
      duration: 0.5, 
      ease: "elastic.out(1, 0.3)" 
    });

    // Reset cursor
    gsap.to(cursorCircle, { 
      scale: 1, 
      backgroundColor: "transparent",
      borderColor: "rgba(255, 255, 255, 0.5)",
      duration: 0.3 
    });
    gsap.to(cursorDot, { scale: 1, duration: 0.3 });
  });
});

// Special interaction for Images (Project Cards)
const projectImages = document.querySelectorAll(".img-overflow");
const cursorText = document.querySelector(".cursor-text");

projectImages.forEach((imgContainer) => {
  imgContainer.addEventListener("mouseenter", () => {
    gsap.to(cursorCircle, { 
      scale: 3, 
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      mixBlendMode: "difference",
      duration: 0.3 
    });
    gsap.to(cursorText, { opacity: 1, duration: 0.3 });
  });
  
  imgContainer.addEventListener("mouseleave", () => {
    gsap.to(cursorCircle, { 
      scale: 1, 
      backgroundColor: "transparent",
      mixBlendMode: "difference",
      duration: 0.3 
    });
    gsap.to(cursorText, { opacity: 0, duration: 0.3 });
  });
});

// Hero Title Interaction
const heroTitle = document.querySelector(".hero-title");
if (heroTitle) {
  heroTitle.addEventListener("mouseenter", () => {
    gsap.to(cursorCircle, { scale: 4, backgroundColor: "rgba(255,255,255,0.1)", duration: 0.3 });
  });
  heroTitle.addEventListener("mouseleave", () => {
    gsap.to(cursorCircle, { scale: 1, backgroundColor: "transparent", duration: 0.3 });
  });
}

// --- 5. LOADING SEQUENCE ---
window.addEventListener("load", () => {
  const loaderText = document.getElementById("loader-text");
  const loaderBar = document.getElementById("loader-bar");
  const loader = document.getElementById("loader");

  setTimeout(() => {
    loaderText.style.transform = "translateY(0)";
  }, 300);

  setTimeout(() => {
    loaderBar.style.width = "100%";
    loaderBar.style.transition = "width 1.5s ease-in-out";
  }, 800);

  setTimeout(() => {
    loader.style.transform = "translateY(-100%)";
    loader.style.transition =
      "transform 1s cubic-bezier(0.76, 0, 0.24, 1)";
    initHeroAnimations();
  }, 2500);
});

function initHeroAnimations() {
  gsap.to(".hero-title span", {
    y: 0,
    duration: 1.5,
    stagger: 0.1,
    ease: "power4.out",
    delay: 0.2,
  });
  gsap.to(".hero-sub span", {
    y: 0,
    duration: 1.5,
    stagger: 0.1,
    ease: "power4.out",
    delay: 0.6,
  });
}

// --- 6. SCROLL & ANIMATIONS (GSAP + SCROLLTRIGGER) ---
gsap.registerPlugin(ScrollTrigger);

// FADE OUT 3D CANVAS ON SCROLL
gsap.to("#canvas-container", {
  opacity: 0,
  scrollTrigger: {
    trigger: "#hero",
    start: "center top", // Start fading when center of hero hits top
    end: "bottom top", // Completely gone when hero leaves view
    scrub: true,
  },
});

// MATCHMEDIA for Responsive ScrollTrigger
ScrollTrigger.matchMedia({
  // DESKTOP ONLY: Horizontal Scroll
  "(min-width: 768px)": function () {
    const galleryWrapper = document.getElementById("gallery-wrapper");
    const workSection = document.getElementById("works");

    let scrollTween = gsap.to(galleryWrapper, {
      xPercent: -75,
      ease: "none",
      scrollTrigger: {
        trigger: workSection,
        pin: true,
        scrub: 1,
        end: "+=3000",
      },
    });

    // Parallax inside horizontal
    const images = document.querySelectorAll(".img-overflow img");
    images.forEach((img) => {
      gsap.to(img, {
        scale: 1,
        scrollTrigger: {
          trigger: img.parentElement,
          containerAnimation: scrollTween,
          start: "left center",
          end: "right center",
          scrub: true,
        },
      });
    });
  },

  // MOBILE ONLY: Vertical Parallax
  "(max-width: 767px)": function () {
    // Simple parallax for images on scroll
    const images = document.querySelectorAll(".img-overflow img");
    images.forEach((img) => {
      gsap.to(img, {
        scale: 1,
        scrollTrigger: {
          trigger: img.parentElement,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    });
  },
});

// Text Reveal in About Section
gsap.from(".reveal-type", {
  y: 50,
  opacity: 0,
  duration: 1,
  scrollTrigger: {
    trigger: "#about",
    start: "top 70%",
    toggleActions: "play none none reverse",
  },
});

// --- 7. THREE.JS SHATTERED GLASS EFFECT (Optimized for Readability) ---
const initThree = () => {
  const container = document.getElementById("canvas-container");
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 4.5; // Pulled back to create room

  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambientLight);

  const pointLight = new THREE.PointLight(0xffffff, 1.2);
  pointLight.position.set(5, 5, 5);
  scene.add(pointLight);

  const blueLight = new THREE.PointLight(0x88aaff, 0.8);
  blueLight.position.set(-5, -2, 2);
  scene.add(blueLight);

  // --- Glass Material ---
  const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: 0.1,
    roughness: 0.05,
    transmission: 0.9,
    thickness: 0.8,
    clearcoat: 1.0,
    clearcoatRoughness: 0.0,
    ior: 1.5,
    opacity: 0.6, // Slightly more transparent
    transparent: true,
  });

  const wireframeMaterial = new THREE.MeshBasicMaterial({
    color: 0xaaaaaa,
    wireframe: true,
    transparent: true,
    opacity: 0.05,
  });

  // --- Generate Shards ---
  const shards = [];
  const shardGroup = new THREE.Group();
  shardGroup.position.z = -1; // Push entire group behind text plane
  scene.add(shardGroup);

  const shardCount = 140;
  const sphereRadius = 2.5; // Expanded radius to clear center

  // Geometries to pick from
  const geometries = [
    new THREE.TetrahedronGeometry(0.15),
    new THREE.OctahedronGeometry(0.1),
    new THREE.TetrahedronGeometry(0.2),
  ];

  for (let i = 0; i < shardCount; i++) {
    // 1. Pick random geometry
    const geo = geometries[Math.floor(Math.random() * geometries.length)];
    const mesh = new THREE.Mesh(geo, glassMaterial);

    // 2. Distribution - Avoid Center
    let x, y, z;
    let valid = false;
    // Simple rejection sampling to keep center clear for text
    while (!valid) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = Math.cbrt(Math.random()) * sphereRadius + 1.5; // +1.5 ensures a hole in middle

      x = r * Math.sin(phi) * Math.cos(theta);
      y = r * Math.sin(phi) * Math.sin(theta);
      z = r * Math.cos(phi);

      // Keep mostly in background if Z is positive (camera is at +4.5)
      // We want them drifting around
      valid = true;
    }

    mesh.position.set(x, y, z);
    mesh.rotation.set(
      Math.random() * Math.PI,
      Math.random() * Math.PI,
      Math.random() * Math.PI
    );

    // Store metadata for animation
    mesh.userData = {
      originalPos: new THREE.Vector3(x, y, z),
      originalRot: new THREE.Euler(
        mesh.rotation.x,
        mesh.rotation.y,
        mesh.rotation.z
      ),
      randomSpeed: 0.002 + Math.random() * 0.005,
      driftAxis: new THREE.Vector3(
        Math.random() - 0.5,
        Math.random() - 0.5,
        Math.random() - 0.5
      ).normalize(),
    };

    if (Math.random() > 0.8) {
      const wire = new THREE.Mesh(geo, wireframeMaterial);
      wire.scale.set(1.05, 1.05, 1.05);
      mesh.add(wire);
    }

    shardGroup.add(mesh);
    shards.push(mesh);
  }

        // Mouse interaction logic
        let mouse = new THREE.Vector2();
        let targetMouse = new THREE.Vector2();

        document.addEventListener("mousemove", (e) => {
          // Normalized coords -1 to 1
          targetMouse.x = (e.clientX / window.innerWidth) * 2 - 1;
          targetMouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
        });

        const clock = new THREE.Clock();

        // Reusable vectors to prevent GC
        const repulsionPoint = new THREE.Vector3();
        const worldPos = new THREE.Vector3();
        const direction = new THREE.Vector3();
        const targetPos = new THREE.Vector3();

        function animate() {
          const time = clock.getElapsedTime();

          // Smooth mouse lerp
          mouse.x += (targetMouse.x - mouse.x) * 0.1;
          mouse.y += (targetMouse.y - mouse.y) * 0.1;

          repulsionPoint.set(mouse.x * 6, mouse.y * 6, 0);

          // Rotate the entire group slowly
          shardGroup.rotation.y = time * 0.05;
          shardGroup.rotation.z = time * 0.02;

          shards.forEach((shard) => {
            const originalPos = shard.userData.originalPos;
            
            // Calculate world position without cloning
            worldPos.copy(originalPos).applyMatrix4(shardGroup.matrixWorld);
            
            const dist = worldPos.distanceTo(repulsionPoint);

            const maxDist = 4.0;
            let force = 0;

            if (dist < maxDist) {
              force = Math.pow(1 - dist / maxDist, 2) * 2.0;
            }

            // Calculate direction and target position without cloning
            direction.copy(worldPos).sub(repulsionPoint).normalize();
            targetPos.copy(originalPos).add(direction.multiplyScalar(force));

            shard.position.lerp(targetPos, 0.05);

            shard.rotation.x += shard.userData.randomSpeed + force * 0.01;
            shard.rotation.y += shard.userData.randomSpeed + force * 0.01;
          });

          renderer.render(scene, camera);
          requestAnimationFrame(animate);
        }

        animate();

  // Debounced resize
  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }, 100);
  });
};

// --- 8. BRAND TYPING ANIMATION ---
function initBrandAnimation() {
  const container = document.getElementById('brand-link');
  if (!container) return;
  
  // Clear initial content
  container.innerHTML = '';
  
  const spanBefore = document.createElement('span');
  const spanCursor = document.createElement('span');
  const spanAfter = document.createElement('span');
  
  spanCursor.textContent = '_';
  spanCursor.className = 'cursor-blink text-white ml-1'; 
  
  container.appendChild(spanBefore);
  container.appendChild(spanCursor);
  container.appendChild(spanAfter);
  
  const cycle = async () => {
      // Reset State
      spanBefore.textContent = "DIVYANSHUYADAV";
      spanAfter.textContent = "";
      
      await wait(2000);
      
      // Move cursor to middle (between U and Y)
      // "DIVYANSHU" | "YADAV"
      for (let i = 0; i < 5; i++) { // Length of YADAV
           spanAfter.textContent = spanBefore.textContent.slice(-1) + spanAfter.textContent;
           spanBefore.textContent = spanBefore.textContent.slice(0, -1);
           await wait(100);
      }
      
      await wait(500);
      
      // Insert Space
      spanBefore.textContent += " ";
      await wait(500);
      
      // Move cursor to end
      for (let i = 0; i < 5; i++) {
           spanBefore.textContent += spanAfter.textContent.slice(0, 1);
           spanAfter.textContent = spanAfter.textContent.slice(1);
           await wait(100);
      }
      
      await wait(500);
      
      // Type .DEV
      const suffix = ".DEV";
      for (let char of suffix) {
          spanBefore.textContent += char;
          await wait(150);
      }
      
      await wait(1000);

      // Move cursor back to the space to remove it
      // Current: "DIVYANSHU YADAV.DEV"
      // Move back 9 chars (4 for .DEV + 5 for YADAV)
      for (let i = 0; i < 9; i++) {
           spanAfter.textContent = spanBefore.textContent.slice(-1) + spanAfter.textContent;
           spanBefore.textContent = spanBefore.textContent.slice(0, -1);
           await wait(50);
      }

      // Remove the space
      if (spanBefore.textContent.endsWith(" ")) {
          spanBefore.textContent = spanBefore.textContent.slice(0, -1);
          await wait(200);
      }

      // Move cursor back to end
      for (let i = 0; i < 9; i++) {
           spanBefore.textContent += spanAfter.textContent.slice(0, 1);
           spanAfter.textContent = spanAfter.textContent.slice(1);
           await wait(50);
      }
      
      await wait(4000);
      
      // Restart loop
      cycle();
  };
  
  cycle();
}

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Initialize Brand Animation
initBrandAnimation();

initThree();

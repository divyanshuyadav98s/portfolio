// --- 1. SMOOTH SCROLL (LENIS) ---
let lenis;
// Check if Lenis is available globally or via module
const LenisClass = typeof Lenis !== "undefined" ? Lenis : window.Lenis;

if (LenisClass) {
  lenis = new LenisClass({
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

// Brand Link Interaction (Similar to Works)
const brandLink = document.getElementById("brand-link");
if (brandLink) {
  brandLink.addEventListener("mouseenter", () => {
    cursorText.textContent = "HOME";
    gsap.to(cursorCircle, { 
      scale: 3, 
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      mixBlendMode: "difference",
      duration: 0.3,
      overwrite: true
    });
    gsap.to(cursorText, { opacity: 1, duration: 0.3 });
  });
  
  brandLink.addEventListener("mouseleave", () => {
    gsap.to(cursorCircle, { 
      scale: 1, 
      backgroundColor: "transparent",
      mixBlendMode: "normal",
      duration: 0.3,
      overwrite: true
    });
    gsap.to(cursorText, { opacity: 0, duration: 0.3, onComplete: () => { cursorText.textContent = "VIEW"; } });
  });
}

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
  const heroTitleSpans = document.querySelectorAll(".hero-title span");
  const heroSubSpans = document.querySelectorAll(".hero-sub span");

  if (heroTitleSpans.length > 0) {
    gsap.to(heroTitleSpans, {
      y: 0,
      duration: 1.5,
      stagger: 0.1,
      ease: "power4.out",
      delay: 0.2,
    });
  }

  if (heroSubSpans.length > 0) {
    gsap.to(heroSubSpans, {
      y: 0,
      duration: 1.5,
      stagger: 0.1,
      ease: "power4.out",
      delay: 0.6,
    });
  }
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
    thickness: 0.8, // Note: This might warn in older Three.js versions, but is valid in newer ones
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

        let animationId;
        let totalTime = 0;

        function animate() {
          const delta = clock.getDelta();
          totalTime += delta;

          // Smooth mouse lerp
          mouse.x += (targetMouse.x - mouse.x) * 0.1;
          mouse.y += (targetMouse.y - mouse.y) * 0.1;

          repulsionPoint.set(mouse.x * 6, mouse.y * 6, 0);

          // Rotate the entire group slowly
          shardGroup.rotation.y = totalTime * 0.05;
          shardGroup.rotation.z = totalTime * 0.02;

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
          animationId = requestAnimationFrame(animate);
        }

        // Optimization: Only animate when visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    clock.start();
                    if (!animationId) animate();
                } else {
                    if (animationId) {
                        cancelAnimationFrame(animationId);
                        animationId = null;
                    }
                }
            });
        });
        observer.observe(container);

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

// --- 9. AI TERMINAL LOGIC ---
const input = document.getElementById('terminal-input');
const output = document.getElementById('terminal-output');
const terminalBody = document.getElementById('terminal-body');
const promptPath = document.getElementById('terminal-prompt-path');

// Command History Logic
let commandHistory = [];
let historyIndex = -1;

// File System Simulation
const fileSystem = {
    "~": {
        "about.md": "Divyanshu Yadav is a 20-year-old Software Engineering student and developer from Mau, India. He specializes in building immersive digital experiences.",
        "skills.json": JSON.stringify({
            core: ["HTML/CSS", "JavaScript", "React", "Tailwind", "Three.js"],
            tools: ["Git", "GitHub", "VS Code"],
            other: ["PC Software Dev", "Content Creation"]
        }, null, 2),
        "contact.txt": "Email: hello@divyanshu.com\nGitHub: github.com/divyanshuyadav98s\nLinkedIn: linkedin.com/in/divyanshu",
        "projects": "dir", // Marker for directory
        ".env": "PERMISSION DENIED"
    },
    "~/projects": {
        "project_alpha.txt": "A responsive web application built with React and Tailwind CSS.",
        "system_tool.exe": "Binary file not shown.",
        "youtube_shorts.mp4": "Video file not shown."
    }
};

let currentPath = "~";

const NEOFETCH_ART = `
            .-/+oossssoo+/-.               guest@divyanshu.dev
        :\`:+ssssssssssssssssss+:\`           -------------------
      -+sssssssssssssssssssyyssss+-         OS: KODE_OS 1.0 LTS x86_64
    .ossssssssssssssssssdMMMNysssso.       Host: Portfolio Web
   /ssssssssssshdmmNNmmyNMMMMhssssss/      Kernel: 5.15.0-91-generic
  +ssssssssshmydMMMMMMMNddddyssssssss+     Uptime: Forever
 /sssssssshNMMMyhhyyyyhmNMMMNhssssssss/    Packages: 1 (npm)
.ssssssssdMMMNhsssssssssshNMMMdssssssss.   Shell: bash 5.1.16
+sssshhhyNMMNyssssssssssssyNMMMysssssss+   Resolution: ${window.innerWidth}x${window.innerHeight}
ossyNMMMNyMMhsssssssssssssshmmmhssssssso   Theme: Brutalist Dark
ossyNMMMNyMMhsssssssssssssshmmmhssssssso   Font: Space Mono / Consolas
+sssshhhyNMMNyssssssssssssyNMMMysssssss+   CPU: Creative Flow (100%)
.ssssssssdMMMNhsssssssssshNMMMdssssssss.   GPU: WebGL Renderer
 /sssssssshNMMMyhhyyyyhmNMMMNhssssssss/    Memory: 128MB / 16GB
  +ssssssssshmydMMMMMMMNddddyssssssss+
   /ssssssssssshdmmNNmmyNMMMMhssssss/
    .ossssssssssssssssssdMMMNysssso.
      -+sssssssssssssssssssyyssss+-
        \`:+ssssssssssssssssss+:\`
            .-/+oossssoo+/-.
`;

const commands = {
    help: () => "Available commands:\n  who, skills, projects, contact\n  ls, cat, cd, pwd, clear\n  git, sudo, uname, date, neofetch, exit",
    ls: () => {
        const dirContent = fileSystem[currentPath];
        return dirContent 
            ? Object.keys(dirContent).map(item => dirContent[item] === "dir" ? item + "/" : item).join("  ")
            : "Directory not found.";
    },
    cat: (args) => {
        if (!args.length) return "cat: missing operand";
        const fileName = args[0];
        const currentDir = fileSystem[currentPath];
        if (!currentDir || !currentDir[fileName]) return `cat: ${fileName}: No such file or directory`;
        if (currentDir[fileName] === "dir") return `cat: ${fileName}: Is a directory`;
        if (fileName === ".env") return "bash: .env: Permission denied";
        return currentDir[fileName];
    },
    cd: (args) => {
        if (!args.length || args[0] === "~") currentPath = "~";
        else if (args[0] === "..") currentPath = "~";
        else if (args[0] === "projects" && currentPath === "~") currentPath = "~/projects";
        else return `bash: cd: ${args[0]}: No such file or directory`;
        
        if (promptPath) promptPath.textContent = currentPath;
        return "";
    },
    pwd: () => `/home/guest/${currentPath.replace('~', '')}`,
    whoami: () => "guest",
    sudo: () => "guest is not in the sudoers file. This incident will be reported.",
    git: (args) => {
        if (args[0] === "status") return "On branch main\nYour branch is up to date with 'origin/main'.\n\nworking tree clean";
        if (args[0] === "log") return "commit 8f5d2a1 (HEAD -> main)\nAuthor: Divyanshu <hello@divyanshu.com>\nDate:   " + new Date().toDateString() + "\n\n    Initial commit: Created portfolio";
        return "git: usage: git [status|log]";
    },
    uname: (args) => args[0] === "-a" ? "Linux divyanshu-dev 5.15.0-91-generic #101-Ubuntu SMP Tue Nov 14 13:30:08 UTC 2023 x86_64 x86_64 x86_64 GNU/Linux" : "Linux",
    date: () => new Date().toString(),
    exit: () => { if (btnClose) btnClose.click(); return ""; },
    clear: () => {
        output.innerHTML = '<div class="text-[#cccccc] mb-2">Welcome to KODE_OS 1.0 LTS (GNU/Linux 5.15.0-91-generic x86_64)</div>';
        return "";
    },
    neofetch: () => NEOFETCH_ART,
    // Aliases
    who: () => fileSystem["~"]["about.md"],
    about: () => fileSystem["~"]["about.md"],
    skills: () => fileSystem["~"]["skills.json"],
    stack: () => fileSystem["~"]["skills.json"],
    projects: () => "List of projects: Project Alpha, System Tool, YouTube Shorts. Type 'cd projects' then 'ls' to see files.",
    work: () => "List of projects: Project Alpha, System Tool, YouTube Shorts. Type 'cd projects' then 'ls' to see files.",
    contact: () => fileSystem["~"]["contact.txt"],
    email: () => fileSystem["~"]["contact.txt"]
};

if (input && output) {
  // History Navigation
  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex > 0) {
        historyIndex--;
        input.value = commandHistory[historyIndex];
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        historyIndex++;
        input.value = commandHistory[historyIndex];
      } else {
        historyIndex = commandHistory.length;
        input.value = '';
      }
    }
  });

  input.addEventListener('keypress', async (e) => {
    if (e.key === 'Enter') {
      const fullCommand = input.value.trim();
      const args = fullCommand.split(' ').filter(arg => arg.length > 0);
      const cmd = args[0] ? args[0].toLowerCase() : '';
      
      // Add to history if not empty
      if (fullCommand) {
        commandHistory.push(fullCommand);
        historyIndex = commandHistory.length;
      }

      // Always add the command line to history, even if empty
      addMessage(input.value, true);
      input.value = '';

      if (!cmd) {
         scrollToBottom();
         return;
      }

      await processCommand(cmd, args.slice(1));
      scrollToBottom();
    }
  });
}

async function processCommand(cmd, args) {
    const commandFunc = commands[cmd];
    let response = "";
    
    if (commandFunc) {
        response = commandFunc(args);
    } else {
        response = `bash: ${cmd}: command not found`;
    }
    
    if (response) await typeResponse(response);
}

function scrollToBottom() {
    if(terminalBody) {
        terminalBody.scrollTop = terminalBody.scrollHeight;
    }
}

function addMessage(text, isCommand = false) {
  const div = document.createElement('div');
  
  if (isCommand) {
    div.className = 'flex items-center gap-2 mb-1';
    div.innerHTML = `
        <div class="shrink-0">
            <span class="text-[#C9C1FC]">guest@divyanshu.dev</span><span class="text-white">:</span><span class="text-[#4c89c4]">${currentPath}</span><span class="text-white">$</span>
        </div>
        <div class="text-[#cccccc]">${text}</div>
    `;
  } else {
    div.className = 'text-[#cccccc] mb-2 whitespace-pre-wrap'; // Added whitespace-pre-wrap for formatting
    div.textContent = text;
  }
  
  output.appendChild(div);
}

async function typeResponse(text) {
  const div = document.createElement('div');
  div.className = 'text-[#cccccc] mb-4 leading-relaxed whitespace-pre-wrap font-mono'; // Added whitespace-pre-wrap
  output.appendChild(div);
  
  // If text is very long (like neofetch), type faster or just show it
  if (text.length > 100) {
      div.textContent = text;
      scrollToBottom();
  } else {
      // Typing effect
      for (let i = 0; i < text.length; i++) {
        div.textContent += text[i];
        scrollToBottom();
        await wait(5); // Fast typing
      }
  }
}

// --- 10. TERMINAL WINDOW CONTROLS ---
const terminalContainer = document.getElementById('terminal-container');
const btnMinimize = document.getElementById('terminal-minimize');
const btnMaximize = document.getElementById('terminal-maximize');
const btnClose = document.getElementById('terminal-close');
const rebootContainer = document.getElementById('reboot-container');
const rebootBtn = document.getElementById('reboot-btn');
const nav = document.querySelector('nav');

if (terminalContainer && btnMinimize && btnMaximize && btnClose) {
  
  // Minimize: Toggle body visibility
  let isMinimized = false;
  btnMinimize.addEventListener('click', () => {
    isMinimized = !isMinimized;
    if (isMinimized) {
      terminalBody.style.display = 'none';
      terminalContainer.style.height = 'auto'; // Shrink to header height
    } else {
      terminalBody.style.display = 'block';
      terminalContainer.style.height = isMaximized ? '100vh' : '60vh';
    }
  });

  // Maximize: Toggle full screen
  let isMaximized = false;
  btnMaximize.addEventListener('click', () => {
    isMaximized = !isMaximized;
    if (isMaximized) {
      terminalContainer.classList.add('fixed', 'inset-0', 'z-[9999]', 'h-screen', 'w-screen', 'rounded-none');
      terminalContainer.classList.remove('h-[60vh]', 'rounded-lg', 'relative');
      if (nav) nav.style.display = 'none'; // Hide Navbar
      
      // Ensure body is visible if maximized from minimized state
      if (isMinimized) {
        isMinimized = false;
        terminalBody.style.display = 'block';
      }
    } else {
      terminalContainer.classList.remove('fixed', 'inset-0', 'z-[9999]', 'h-screen', 'w-screen', 'rounded-none');
      terminalContainer.classList.add('h-[60vh]', 'rounded-lg', 'relative');
      if (nav) nav.style.display = 'flex'; // Show Navbar
    }
  });

  // Close: Hide container (with fade out) and show Reboot button
  btnClose.addEventListener('click', () => {
    gsap.to(terminalContainer, { 
      opacity: 0, 
      scale: 0.9, 
      duration: 0.3, 
      onComplete: () => {
        terminalContainer.style.display = 'none';
        
        // Reset Maximize State on Close
        if (isMaximized) {
            isMaximized = false;
            terminalContainer.classList.remove('fixed', 'inset-0', 'z-[9999]', 'h-screen', 'w-screen', 'rounded-none');
            terminalContainer.classList.add('h-[60vh]', 'rounded-lg', 'relative');
            if (nav) nav.style.display = 'flex';
        }

        if (rebootContainer) {
            rebootContainer.classList.remove('hidden');
            gsap.fromTo(rebootContainer, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.4 });
        }
      }
    });
  });
}

// Reboot Logic
if (rebootBtn && rebootContainer && terminalContainer) {
    rebootBtn.addEventListener('click', () => {
        gsap.to(rebootContainer, {
            opacity: 0,
            scale: 0.95,
            duration: 0.3,
            onComplete: () => {
                rebootContainer.classList.add('hidden');
                terminalContainer.style.display = 'flex';
                gsap.to(terminalContainer, { opacity: 1, scale: 1, duration: 0.4 });
                
                // Reset terminal state
                output.innerHTML = '<div class="text-[#cccccc] mb-2">Welcome to KODE_OS 1.0 LTS (GNU/Linux 5.15.0-91-generic x86_64)</div>';
                input.value = '';
                input.focus();
            }
        });
    });
}

initThree();

// Force scroll to top on load
if (history.scrollRestoration) {
  history.scrollRestoration = "manual";
}
window.scrollTo(0, 0);

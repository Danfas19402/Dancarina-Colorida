document.addEventListener("DOMContentLoaded", () => {

  const container = document.querySelector(".video-stack");
  const videos = document.querySelectorAll(".layer");

  const offsetBetweenStart = 0.07;
  const maxOffset = 200;

  const green = document.querySelector(".layer-green");
  const red   = document.querySelector(".layer-red");
  const blue  = document.querySelector(".layer-blue");

  let loaded = 0;
  let target = 0;
  let current = 0;
  let animating = false;

  /* =========================
     SINCRONIZAÇÃO DOS VÍDEOS
  ========================== */
  videos.forEach((v) => {
    v.addEventListener("loadeddata", () => {
      loaded++;
      if (loaded === videos.length) {
        videos.forEach((v) => v.currentTime = 0);

        requestAnimationFrame(() => {
          videos.forEach((v, i) => {
            v.pause();
            setTimeout(() => {
              v.play().catch(() => {});
            }, i * offsetBetweenStart * 1000);
          });
        });
      }
    });
  });

  /* =========================
     ANIMAÇÃO SUAVE
  ========================== */
  function animate() {
    if (!animating) return;

    current += (target - current) * 0.08;

    red.style.transform   = `translateX(${current * maxOffset}px)`;
    green.style.transform = `translateX(${current * maxOffset * 0.6}px)`;
    blue.style.transform  = `translateX(${current * maxOffset * 0.4}px)`;

    if (Math.abs(target - current) > 0.001) {
      requestAnimationFrame(animate);
    } else {
      animating = false;
    }
  }

  function updateTarget(x) {
    const rect = container.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const dx = x - centerX;

    target = Math.max(-1, Math.min(1, dx / (rect.width / 2)));

    if (!animating) {
      animating = true;
      requestAnimationFrame(animate);
    }
  }

  function reset() {
    target = 0;
    if (!animating) {
      animating = true;
      requestAnimationFrame(animate);
    }
  }

  /* =========================
     EVENTOS
  ========================== */
  container.addEventListener("mousemove", (e) => {
    updateTarget(e.clientX);
  });

  container.addEventListener("mouseleave", reset);

  container.addEventListener("touchmove", (e) => {
    updateTarget(e.touches[0].clientX);
  }, { passive: true });

  container.addEventListener("touchend", reset);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) reset();
  });

});

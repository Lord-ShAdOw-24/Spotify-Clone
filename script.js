document.addEventListener("DOMContentLoaded", () => {
  // Sidebar / menu hamburger
  const menuBtn = document.getElementById("menu-btn");
  const sidebar = document.getElementById("sidebar");
  const closeBtn = document.getElementById("close-btn");

  if (menuBtn && sidebar) {
    menuBtn.addEventListener("click", () => {
      sidebar.classList.add("open");
    });
  }
  if (closeBtn && sidebar) {
    closeBtn.addEventListener("click", () => {
      sidebar.classList.remove("open");
    });
  }

  document.addEventListener("click", (e) => {
    if (sidebar && menuBtn) {
      if (!sidebar.contains(e.target) && e.target !== menuBtn) {
        sidebar.classList.remove("open");
      }
    }
  });

  // Mini lecteur / fermeture / réouverture
  const closePlayerBtn = document.getElementById("close-player-btn");
  const mediaPlayer = document.getElementById("media-player");
  // (note : j'ai utilisé getElementById pour mediaPlayer)
  // Si tu veux réouvrir, il te faudra un bouton "show-player-btn" ou autre

  if (closePlayerBtn && mediaPlayer) {
    closePlayerBtn.addEventListener("click", () => {
      // cacher le lecteur
      mediaPlayer.style.display = "none";
    });
  }

  // Si tu avais un bouton pour réouvrir (non présent dans l’HTML fourni), ce code serait utile :
  const showPlayerBtn = document.getElementById("show-player-btn");
  if (showPlayerBtn && mediaPlayer) {
    showPlayerBtn.addEventListener("click", () => {
      mediaPlayer.style.display = "flex";
    });
  }

  // Média & playlist
  const media = document.getElementById("media");
  const playBtn = document.getElementById("play-btn");
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");

  const playlistContainer = document.getElementById("playlist-container");
  const playlistElement = document.getElementById("playlist");
  const searchInput = document.getElementById("playlist-search");

  let playlist = [
    { src: "media/sample.mp4", title: "Vidéo 1", cover: "images/cover.jpg" },
    { src: "media/sample2.mp4", title: "Vidéo 2", cover: "images/cover2.jpg" },
    { src: "media/sample3.mp4", title: "Vidéo 3", cover: "images/cover3.jpg" }
  ];
  let currentTrack = 0;

  function loadTrack(index) {
    const track = playlist[index];
    if (!track) return;
    media.src = track.src;
    const titleEl = document.querySelector(".media-title");
    const coverEl = document.querySelector(".media-cover");
    if (titleEl) titleEl.textContent = track.title;
    if (coverEl) coverEl.src = track.cover;
    media.load();
  }

  function populatePlaylist() {
    if (!playlistElement) return;
    playlistElement.innerHTML = "";
    playlist.forEach((track, i) => {
      const li = document.createElement("li");
      li.textContent = track.title;
      li.dataset.index = i;
      playlistElement.appendChild(li);
    });
  }

  if (playlistElement) {
    playlistElement.addEventListener("click", (e) => {
      if (e.target.tagName === "LI") {
        currentTrack = parseInt(e.target.dataset.index, 10);
        loadTrack(currentTrack);
        media.play();
        if (playBtn) playBtn.textContent = "⏸";
        expandPlayer();
      }
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", () => {
      const filter = searchInput.value.toLowerCase();
      playlistElement.querySelectorAll("li").forEach(item => {
        const match = item.textContent.toLowerCase().includes(filter);
        item.style.display = match ? "" : "none";
      });
    });
  }

  playBtn?.addEventListener("click", () => {
    if (!media) return;
    if (media.paused) {
      media.play();
      playBtn.textContent = "⏸";
      expandPlayer();
    } else {
      media.pause();
      playBtn.textContent = "▶️";
    }
  });

  prevBtn?.addEventListener("click", () => {
    currentTrack = (currentTrack - 1 + playlist.length) % playlist.length;
    loadTrack(currentTrack);
    media.play();
    playBtn.textContent = "⏸";
    expandPlayer();
  });

  nextBtn?.addEventListener("click", () => {
    currentTrack = (currentTrack + 1) % playlist.length;
    loadTrack(currentTrack);
    media.play();
    playBtn.textContent = "⏸";
    expandPlayer();
  });

  media?.addEventListener("ended", () => {
    nextBtn?.click();
  });

  function expandPlayer() {
    mediaPlayer.classList.remove("minimized");
    playlistContainer?.classList.add("active");
  }
  function minimizePlayer() {
    mediaPlayer.classList.add("minimized");
    playlistContainer?.classList.remove("active");
  }

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      minimizePlayer();
    } else {
      expandPlayer();
    }
  });

  // initialisation
  loadTrack(currentTrack);
  populatePlaylist();
  minimizePlayer();

  // Carrousels auto-scroll
  function setupBounceAutoCarousel(carouselId) {
    const carousel = document.getElementById(carouselId);
    if (!carousel) return;

    let isDragging = false;
    let startX = 0;
    let scrollStart = 0;
    let direction = 1;
    const speed = 0.7;
    let autoInterval;
    let resumeTimeout;

    function autoStep() {
      carousel.scrollLeft += direction * speed;
      if (carousel.scrollLeft + carousel.clientWidth >= carousel.scrollWidth) {
        direction = -1;
      }
      if (carousel.scrollLeft <= 0) {
        direction = 1;
      }
    }

    function startAuto() {
      stopAuto();
      autoInterval = setInterval(autoStep, 20);
    }
    function stopAuto() {
      clearInterval(autoInterval);
    }
    function scheduleResume() {
      clearTimeout(resumeTimeout);
      resumeTimeout = setTimeout(() => {
        startAuto();
      }, 5000);
    }

    carousel.addEventListener("mousedown", (e) => {
      isDragging = true;
      startX = e.pageX - carousel.offsetLeft;
      scrollStart = carousel.scrollLeft;
      stopAuto();
      clearTimeout(resumeTimeout);
      e.preventDefault();
    });
    carousel.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      const x = e.pageX - carousel.offsetLeft;
      carousel.scrollLeft = scrollStart - (x - startX);
    });
    carousel.addEventListener("mouseup", () => {
      if (isDragging) {
        isDragging = false;
        scheduleResume();
      }
    });
    carousel.addEventListener("mouseleave", () => {
      if (isDragging) {
        isDragging = false;
        scheduleResume();
      }
    });

    carousel.addEventListener("touchstart", (e) => {
      isDragging = true;
      startX = e.touches[0].pageX - carousel.offsetLeft;
      scrollStart = carousel.scrollLeft;
      stopAuto();
      clearTimeout(resumeTimeout);
    });
    carousel.addEventListener("touchmove", (e) => {
      if (!isDragging) return;
      const x = e.touches[0].pageX - carousel.offsetLeft;
      carousel.scrollLeft = scrollStart - (x - startX);
    });
    carousel.addEventListener("touchend", () => {
      if (isDragging) {
        isDragging = false;
        scheduleResume();
      }
    });

    startAuto();
  }

  setupBounceAutoCarousel("trending-carousel");
  setupBounceAutoCarousel("artists-carousel");
  setupBounceAutoCarousel("charts-carousel");

  // Focus sur la barre de recherche via le nav
  const navSearch = document.getElementById("nav-search");
  navSearch?.addEventListener("click", (e) => {
    e.preventDefault();
    document.getElementById("search-input")?.focus();
  });

  // Ripple effect
  document.addEventListener("click", (e) => {
    const rippleContainer = document.getElementById("ripple-container");
    if (!rippleContainer) return;
    const ripple = document.createElement("div");
    ripple.className = "ripple";
    ripple.style.left = `${e.clientX}px`;
    ripple.style.top = `${e.clientY}px`;
    rippleContainer.appendChild(ripple);
    setTimeout(() => {
      ripple.remove();
    }, 1000);
  });
});
  nextBtn?.addEventListener("click", () => {
    currentTrack = (currentTrack + 1) % playlist.length;
    loadTrack(currentTrack);
    media.play();
    playBtn.textContent = "⏸";
    expandPlayer();
  });

  media?.addEventListener("ended", () => {
    nextBtn.click();
  });

  function expandPlayer() {
    mediaPlayer.classList.remove("minimized");
    playlistContainer.classList.add("active");
  }
  function minimizePlayer() {
    mediaPlayer.classList.add("minimized");
    playlistContainer.classList.remove("active");
  }

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      minimizePlayer();
    }
  });

  // initialisation playlist + lecteur
  loadTrack(currentTrack);
  populatePlaylist();
  minimizePlayer();

  // Carrousels auto-scroll
  function setupBounceAutoCarousel(carouselId) {
  const carousel = document.getElementById(carouselId);
  if (!carousel) return;

  let isDragging = false;
  let startX = 0;
  let scrollStart = 0;
  let direction = 1; // 1 = vers la droite, -1 = vers la gauche
  const speed = 0.7; // ajustable:pixels par tick
  let autoInterval;
  let resumeTimeout;

  function autoStep() {
    carousel.scrollLeft += direction * speed;

    // when right limit is attained
    if (carousel.scrollLeft + carousel.clientWidth >= carousel.scrollWidth) {
      direction = -1;
    }
    // condition when the left limit is attained
    if (carousel.scrollLeft <= 0) {
      direction = 1;
    }
  }

  function startAuto() {
    stopAuto();
    autoInterval = setInterval(autoStep, 20);
  }

  function stopAuto() {
    clearInterval(autoInterval);
  }

  function scheduleResume() {
    clearTimeout(resumeTimeout);
    resumeTimeout = setTimeout(() => {
      startAuto();
    }, 5000);
  }

  // Événements de drag souris
  carousel.addEventListener("mousedown", (e) => {
    isDragging = true;
    startX = e.pageX - carousel.offsetLeft;
    scrollStart = carousel.scrollLeft;
    stopAuto();
    clearTimeout(resumeTimeout);
    e.preventDefault();
  });
  carousel.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    const x = e.pageX - carousel.offsetLeft;
    carousel.scrollLeft = scrollStart - (x - startX);
  });
  carousel.addEventListener("mouseup", () => {
    if (isDragging) {
      isDragging = false;
      scheduleResume();
    }
  });
  carousel.addEventListener("mouseleave", () => {
    if (isDragging) {
      isDragging = false;
      scheduleResume();
    }
  });

  // Événements tactiles
  carousel.addEventListener("touchstart", (e) => {
    isDragging = true;
    startX = e.touches[0].pageX - carousel.offsetLeft;
    scrollStart = carousel.scrollLeft;
    stopAuto();
    clearTimeout(resumeTimeout);
  });
  carousel.addEventListener("touchmove", (e) => {
    if (!isDragging) return;
    const x = e.touches[0].pageX - carousel.offsetLeft;
    carousel.scrollLeft = scrollStart - (x - startX);
  });
  carousel.addEventListener("touchend", () => {
    if (isDragging) {
      isDragging = false;
      scheduleResume();
    }
  });

  // Lancer l’auto-scroll initial
  startAuto();
}

  setupBounceAutoCarousel("trending-carousel");
  setupBounceAutoCarousel("artists-carousel");
  setupBounceAutoCarousel("charts-carousel");

  // Focus barre de recherche via nav 
  const navSearch = document.getElementById("nav-search");
  navSearch?.addEventListener("click", (e) => {
    e.preventDefault();
    document.getElementById("search-input").focus();
  });

});
document.addEventListener("DOMContentLoaded", () => {
  document.addEventListener("click", function (e) {
    const rippleContainer = document.getElementById("ripple-container");
    if (!rippleContainer) return;

    const ripple = document.createElement("div");
    ripple.className = "ripple";
    // placer le centre du cercle à l’endroit du clic
    ripple.style.left = `${e.clientX}px`;
    ripple.style.top = `${e.clientY}px`;
    rippleContainer.appendChild(ripple);

    // enlever après anim
    setTimeout(() => {
      ripple.remove();
    }, 1000);  // doit correspondre à durée de l’animation CSS
  });
});

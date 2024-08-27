let player = null;
const setFn = {
  onYouTubeIframeAPIReady() {
    (function loadYoutubeIFrameApiScript() {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";

      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      tag.onload = setupPlayer;
    })();

    function setupPlayer() {
      window.YT.ready(function () {
        player = new window.YT.Player("youtube-frame", {
          height: "390",
          width: "640",
          videoId: "GN9sCn1S7Dg",
          playerVars: {
            playlist: "GN9sCn1S7Dg",
            controls: 0,
            autoplay: 1,
            muted: 1,
            disablekb: 1,
            loop: 1,
          },
          events: {
            onReady: onPlayerReady,
            onStateChange: onPlayerStateChange,
          },
        });
      });
    }

    function onPlayerReady(event) {
      player.playVideo();
      player.mute();
    }

    function onPlayerStateChange(event) {
      var videoStatuses = Object.entries(window.YT.PlayerState);

      if (event.data === YT.PlayerState.ENDED) {
        player.playVideo();
      }
    }
  },

  mainFn() {
    let featureSwiper = null;
    let isSwiperInitialized = false;
    let resizeTimeout;
    const progress = document.querySelector(".progress-bar");

    function initSwiper() {
      if (window.innerWidth >= 768 && !isSwiperInitialized) {
        featureSwiper = new Swiper(".feature-swiper", {
          slidesPerView: 1.5,
          centeredSlides: true,
          spaceBetween: 65,
          loop: true,
          // autoplay: {
          //   delay: 5000,
          // },
          scrollbar: {
            el: ".swiper-scrollbar",
          },
        });
        isSwiperInitialized = true;
        featureSwiper.on("transitionStart", function (e) {
          const activeIndex = e.wrapperEl.querySelector(".swiper-slide-active").dataset.swiperSlideIndex;
          const progressWidth = 20 * activeIndex;
          progress.style.left = `${progressWidth}%`;
        });
      } else if (window.innerWidth < 768 && isSwiperInitialized) {
        featureSwiper.destroy(true, true);
        featureSwiper = null;
        isSwiperInitialized = false;
      }
    }

    // Initialize Swiper on page load
    initSwiper();
    if (window.innerWidth >= 768) {
      progress.closest(".progress-bar-wrapper").style.width = featureSwiper.slidesSizesGrid[0] + "px";
    }

    // Reinitialize Swiper on window resize with debounce
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        const currentWidth = window.innerWidth;
        if ((currentWidth >= 768 && !isSwiperInitialized) || (currentWidth < 768 && isSwiperInitialized)) {
          initSwiper();
        }
        if (window.innerWidth >= 768) {
          progress.closest(".progress-bar-wrapper").style.width = featureSwiper.slidesSizesGrid[0] + "px";
        }
      }, 50); // Adjust the debounce delay as needed
    });
    gsap.to(".main-visual-wrapper .motion-box, .main-visual-wrapper img", 0.8, {
      delay: 0.8,
      y: 0,
      ease: "power4.out",
      stagger: 0.1,
      onComplete() {
        gsap.to(".main-visual-wrapper .btn-area", 0.4, {
          y: 0,
          alpha: 1,
          ease: "power4.out",
        });
      },
    });
  },
  dialog(options) {
    const opt = {
      confirm: () => {},
      cancel: () => {},
      ...options,
    };

    const dialog = `
<div class="dialog-container">
  <div class="dimmed" aria-hidden="true"></div>
  <div class="dialog-frame">
    <div class="dialog-content f-bar-md">${opt.message}</div>
    <div class="dialog-footer">
      <button type="button" class="btn grey cancle">
        <span class="txt">CANCEL</span>
      </button>
      <button type="button" class="btn confirm">
        <span class="txt">CONTINUE</span>
      </button>
    </div>
  </div>
</div>
`;
    const layerWrap = document.querySelector(".layer-wrap");
    layerWrap.insertAdjacentHTML("beforeend", dialog);
    const dialogContainer = document.querySelector(".dialog-container");
    const dialogContent = dialogContainer.querySelector(".dialog-content");
    const dialogFrame = dialogContainer.querySelector(".dialog-frame");
    const dialogFooter = dialogContainer.querySelector(".dialog-footer");
    const confirmBtn = dialogFooter.querySelector(".confirm");
    const cancelBtn = dialogFooter.querySelector(".cancle");
    const dimmed = dialogContainer.querySelector(".dimmed");

    confirmBtn.addEventListener("click", () => {
      opt.confirm();
      close();
    });
    cancelBtn.addEventListener("click", () => {
      opt.cancel();
      close();
    });

    dimmed.addEventListener("click", () => {
      close();
    });

    function open() {
      gsap.fromTo(
        dialogContainer,
        0.5,
        {
          alpha: 0,
          display: "none",
          overwrite: true,
        },
        {
          alpha: 1,
          display: "flex",
          ease: "power4.out",
          overwrite: true,
        },
      );
      gsap.to(dialogFrame, 0.3, {
        delay: 0.1,
        scale: 1,
        ease: "back.out(2.2)",
        overwrite: true,
      });
    }
    function close() {
      gsap.to(dialogFrame, 0.3, {
        scale: 0.8,
        ease: "power4.out",
        overwrite: true,
        onComplete() {
          dialogContainer.classList.remove("active");
          dialogContent.innerHTML = "";
        },
      });
      gsap.to(dialogContainer, 0.3, {
        delay: 0.05,
        alpha: 0,
        ease: "power4.out",
        overwrite: true,
        onComplete() {
          dialogContainer.style.display = "none";
          dialogFrame.remove();
        },
      });
    }

    return {
      open,
      close,
    };
  },
  header() {
    const header = document.querySelector(".header");
    const nav = header.querySelector(".header-nav");
    const btnAllmenu = header.querySelector(".btn-allmenu");
    const btnClose = header.querySelector(".close-btn");
    const dimmed = header.querySelector(".dimmed");
    const body = document.body;
    let isMenuOpen = false;

    btnAllmenu.addEventListener("click", () => {
      open();
    });
    btnClose.addEventListener("click", () => {
      close();
    });
    dimmed.addEventListener("click", () => {
      close();
    });
    let isChanged = true;
    if (window.innerWidth < 768) {
      isChanged = false;
    } else {
      isChanged = true;
    }
    window.addEventListener("resize", () => {
      if (window.innerWidth >= 768 && !isChanged) {
        close(0);
        isChanged = true;
      }

      if (window.innerWidth < 768 && isChanged) {
        isChanged = false;
      }
    });
    function open() {
      nav.style.display = "block";
      gsap.to(nav, 0.3, {
        x: 0,
        ease: "power4.out",
        overwhite: true,
        onComplete() {
          isMenuOpen = true;
          body.style.overflow = "hidden";
        },
      });
      dimmed.style.display = "block";
      gsap.to(dimmed, 0.3, {
        alpha: 1,
        overwhite: true,
        ease: "power4.out",
      });
    }
    function close(_duration = 0.3) {
      gsap.to(nav, _duration, {
        x: "-100%",
        ease: "power4.out",
        overwhite: true,
        onComplete() {
          isMenuOpen = false;
          nav.style = "";
          dimmed.style = "";
          body.style.overflow = "";
        },
      });
      gsap.to(dimmed, 0.3, {
        alpha: 0,
        overwhite: true,
        ease: "power4.out",
        onComplete() {
          dimmed.style.display = "none";
        },
      });
    }
  },
  gotop() {
    const gotop = document.querySelector(".btn-gotop");
    gotop.addEventListener("click", () => {
      gsap.to("body,html", 0.8, {
        scrollTop: 0,
        ease: "power4.inOut",
      });
    });
  },
};
document.addEventListener("DOMContentLoaded", function () {
  setFn.onYouTubeIframeAPIReady();
  if (document.querySelector(".main-container-page")) {
    setFn.mainFn();
  }
  if (document.querySelector(".header")) {
    setFn.header();
  }

  if (document.querySelector(".btn-gotop")) {
    setFn.gotop();
  }
  // swiper feature-swiper init
});

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
};
document.addEventListener("DOMContentLoaded", function () {
  setFn.onYouTubeIframeAPIReady();
  if (document.querySelector(".main-container-page")) {
    setFn.mainFn();
  }

  // swiper feature-swiper init
});

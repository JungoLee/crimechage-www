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
      } else if (window.innerWidth < 768 && isSwiperInitialized) {
        featureSwiper.destroy(true, true);
        featureSwiper = null;
        isSwiperInitialized = false;
      }
    }

    // Initialize Swiper on page load
    initSwiper();

    // Reinitialize Swiper on window resize with debounce
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        const currentWidth = window.innerWidth;
        if ((currentWidth >= 768 && !isSwiperInitialized) || (currentWidth < 768 && isSwiperInitialized)) {
          initSwiper();
        }
      }, 50); // Adjust the debounce delay as needed
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

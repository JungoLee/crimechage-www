let player = null;
const setFn = {
  onYouTubeIframeAPIReady() {
    console.info(`loadVideo called`);

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
      // document.querySelector("#youtube-frame").style.width = document.querySelector(".video-area").clientWidth + "px";
      // // width padding-top 56 값 만큼 고정 16/9 로
      // document.querySelector("#youtube-frame").style.height = document.querySelector(".video-area").clientWidth * 0.5625 + "px
      // document.querySelector("#youtube-frame").setAttribute("allowfullscreen", "true");
      // document.querySelector("#youtube-frame").setAttribute("allow", "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture");

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
};
document.addEventListener("DOMContentLoaded", function () {
  console.info(`DOMContentLoaded ==>`, document.readyState);
  setFn.onYouTubeIframeAPIReady();
  // swiper feature-swiper init
  const featureSwiper = new Swiper(".feature-swiper", {
    slidesPerView: 1,
    spaceBetween: 10,
    loop: true,
    autoplay: {
      delay: 5000,
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
  });
});

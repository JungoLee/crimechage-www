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
      onClose: () => {},
      confirmText: "CONTINUE",
      cancelText: "CANCEL",
      customHTML: false,
      classAdd: "",
      confirmDisabled: false,
      dimmClose: true,
      ...options,
    };
    const dialog = document.createElement("div");

    dialog.innerHTML = `
      <div class="dimmed" aria-hidden="true"></div>
      <div class="dialog-frame">
        <div class="dialog-content f-bar-md">
          ${
            opt.customHTML
              ? opt.customHTML
              : `
                <p class="message">
                  ${opt.message}
                </p>
                ${
                  opt.img
                    ? `<div class="img-box">
                        <img src="${opt.img}" alt="img">
                      </div>`
                    : ``
                }
              `
          }
        </div>
        <div class="dialog-footer" style="${!opt.cancelText && !opt.confirmText ? "display:none;" : ""}">
          ${
            opt.cancelText
              ? `<button type="button" class="btn grey cancel">
                  <span class="txt">${opt.cancelText}</span>
                </button>`
              : ``
          }
          ${
            opt.confirmText
              ? `<button type="button" class="btn confirm" ${opt.confirmDisabled ? `disabled` : ``}>
                  <span class="txt">${opt.confirmText}</span>
                </button>`
              : ``
          }
        </div>
      </div>
    `;
    let layerWrap = document.querySelector(".layer-wrap");
    if (!layerWrap) {
      document.body.insertAdjacentHTML("beforeend", `<div class="layer-wrap"></div>`);
      layerWrap = document.querySelector(".layer-wrap");
    }

    dialog.classList.add("dialog-container");
    if (opt.classAdd) {
      dialog.classList.add(opt.classAdd);
    }

    const dialogContainer = dialog;
    const dialogContent = dialogContainer.querySelector(".dialog-content");
    const dialogFrame = dialogContainer.querySelector(".dialog-frame");
    const dialogFooter = dialogContainer.querySelector(".dialog-footer");
    const confirmBtn = dialogFooter.querySelector(".confirm");
    const cancelBtn = dialogFooter.querySelector(".cancel");
    const dimmed = dialogContainer.querySelector(".dimmed");

    const messageBox = dialogContent.querySelector(".message");

    if (confirmBtn && !opt.confirmDisabled) {
      confirmBtn.addEventListener("click", () => {
        opt.confirm();
      });
    }

    if (cancelBtn) {
      cancelBtn.addEventListener("click", () => {
        opt.cancel();
      });
    }

    if (dimmed && opt.dimmClose) {
      dimmed.addEventListener("click", () => {
        opt.onClose();
        close();
      });
    }
    function open(options) {
      layerWrap.append(dialog);
      if (options?.massage) {
        messageBox.textContent = options?.massage;
      }
      if (options?.img) {
        dialogContent.querySelector(".img-box img").src = options?.img;
      }
      if (options?.customHTML) {
        dialogContent.innerHTML = options?.customHTML;
      }
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
        },
      });
      gsap.to(dialogContainer, 0.3, {
        delay: 0.05,
        alpha: 0,
        ease: "power4.out",
        overwrite: true,
        onComplete() {
          dialogContainer.style.display = "none";
          dialog.remove();
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

    const loginInfo = header.querySelectorAll(".login-info");
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
    if (document.querySelector(".logout-btn-box")) {
      loginInfo.forEach((btn) => {
        btn.addEventListener("click", () => {
          const logoutBtnBox = btn.closest(".login-info-wrapper").querySelector(".logout-btn-box");
          if (logoutBtnBox.isOpen) {
            logoutBtnBox.isOpen = false;
            gsap.to(logoutBtnBox, 0.3, {
              y: 10,
              alpha: 0,
              overwrite: true,
              onComplete() {
                logoutBtnBox.style.display = "none";
              },
            });
          } else if (!logoutBtnBox.isOpen) {
            logoutBtnBox.isOpen = true;
            logoutBtnBox.style.display = "block";
            gsap.to(logoutBtnBox, 0.3, {
              alpha: 1,
              y: 0,
              overwrite: true,
              onComplete() {},
            });
          }
        });
      });
      body.addEventListener("click", (e) => {
        if (e.target.closest(".login-info-wrapper")) return;
        document.querySelectorAll(".logout-btn-box").forEach((box) => {
          box.isOpen = false;
        });
        gsap.to(".logout-btn-box", 0.3, {
          y: 10,
          alpha: 0,
          overwrite: true,
          onComplete(e) {
            document.querySelectorAll(".logout-btn-box").forEach((box2) => {
              box2.style.display = "none";
            });
          },
        });
      });
    }

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
  visualText() {
    const scope = document.querySelector(".container-visual-area");
    const publicTexts = scope.querySelectorAll(".public-txt");
    const line = `
    <div class="line" style="position:absolute; left:0;
    width:0; height:3px; background-color:#fff; bottom: -10px;"></div>
    `;
    scope.querySelector(".title").insertAdjacentHTML("beforeend", line);

    publicTexts.forEach((publicText) => {
      publicText.innerHTML.split("").forEach((text, idx) => {
        if (idx === 0) {
          publicText.innerHTML = "";
        }
        const html = `
        <span class="wrapper">
          <span class="txt">
          ${text}
          </span>
        </span>
        `;
        //
        publicText.innerHTML += html;
      });
      publicText.style.opacity = 1;
    });
    gsap.to(scope.querySelectorAll(".txt"), 1, {
      stagger: 0.05,
      ease: "power3.out",
      y: 0,
    });
    const tl = gsap.timeline();
    tl.to(".line", 1, {
      width: "100%",
      left: 0,
      ease: "power3.out",
    }).to(
      ".line",
      0.5,
      {
        width: 0,
        left: "100%",
        ease: "power3.out",
      },
      "-=0.5",
    );
  },
  draw(options) {
    const opt = {
      onEnded() {},
      ...options,
    };
    const drawVideo = document.querySelector(".draw-video");
    const getDraw = document.querySelector(".get-draw");
    let message = "Draw your own path";
    let img = "https://via.placeholder.com/150";

    function play() {
      const paused = drawVideo.paused;
      if (paused) {
        drawVideo.play();
        gsap.to(drawVideo, 0.5, {
          alpha: 1,
          ease: "power4.out",
        });
        drawVideo.closest(".draw-box").classList.add("active");
      }

      return {
        paused: paused,
        playing: !paused,
      };
    }

    function end() {
      drawVideo.currentTime = 0;
      drawVideo.pause();
      gsap.to(drawVideo, 0.5, {
        alpha: 0,
        ease: "power4.out",
        onComplete() {
          drawVideo.closest(".draw-box").classList.remove("active");
        },
      });
    }
    drawVideo.addEventListener("ended", () => {
      end();
      opt.onEnded();
    });
    return {
      play,
      end,
    };
  },
  tooltip(el) {
    const tooltip = el;
    const btn = tooltip.querySelector(".tooltip-btn");
    const content = tooltip.querySelector(".tooltip-detail");
    btn.addEventListener("click", () => {
      if (tooltip.isOpen) {
        tooltip.isOpen = false;
        gsap.to(content, 0.3, {
          y: 10,
          alpha: 0,
          overwrite: true,
          onComplete() {
            content.style.display = "none";
          },
        });
      } else if (!tooltip.isOpen) {
        tooltip.isOpen = true;
        content.style.display = "block";
        gsap.to(content, 0.3, {
          alpha: 1,
          y: 0,
          overwrite: true,
          onComplete() {},
        });
      }
    });
    document.body.addEventListener("click", (e) => {
      if (e.target.closest(".tooltip-area") === tooltip) return;
      if (tooltip.isOpen) {
        tooltip.isOpen = false;
        gsap.to(content, 0.3, {
          y: 10,
          alpha: 0,
          overwrite: true,
          onComplete(e) {
            content.style.display = "none";
          },
        });
      }
    });
  },
  merge() {
    const $scope = document.querySelector(".merge-container");
    const inputs = $scope.querySelectorAll("input");
    const mergeBtn = $scope.querySelector(".merge-btn");
    const removeBtn = $scope.querySelectorAll(".remove-btn");

    const confrimDialog = setFn.dialog({
      cancelText: false,
      confirmText: "CONFIRM",
      confirm() {
        dialog.close();
        confrimDialog.close();
        $scope.querySelector(".result-img-box img").src = "https://png.pngtree.com/png-vector/20231215/ourmid/pngtree-black-gaming-character-png-image_11253666.png";
        $scope.querySelector(".result-img-box img").style.opacity = 1;
      },
      onClose() {
        dialog.close();
        confrimDialog.close();
      },
    });

    const dialog = setFn.dialog({
      confirmText: "MERGE",
      cancelText: "CLOSE",
      customHTML: `
<div class="caution-wrap">
  <div class="caution-head f-22">NFT BADGE MERGE</div>
  <div class="caution-content">
    <p class="txt">
      Are you sure you want to<br/>use a badge to perform the Merge?

    </p>
  </div>
</div>`,
      confirm() {
        confrimDialog.open({
          customHTML: `
      <div class="dialog-box">
        <div class="dialog-head">
          <h3 class="public-txt f-40 public-title">CONGRATULATIONS!</h3>
        </div>
        <div class="dialog-body">
          <div class="img-box">
            <img src="https://png.pngtree.com/png-vector/20231215/ourmid/pngtree-black-gaming-character-png-image_11253666.png" alt="">
          </div>
          <p class="public-txt f-16 f-bar-md legendary">Legendary</p>
          <p class="public-txt f-16 f-bar-md rare">Rare</p>
          <p class="public-txt f-16 f-bar-md epic">Epic</p>
          <p class="public-txt f-16 f-bar-md common">Common</p>
          <p class="public-txt f-22 f-bar-md">Matilda #002</p>
          <p class="public-txt f-14 f-bar-md">You can check the bedges you hava camed in My Asset</p>
        </div>
      </div>

          `,
        });
      },
      cancel() {
        dialog.close();
      },
    });

    inputs.forEach((input, idx) => {
      input.addEventListener("change", (e) => {
        const { src } = input.closest(".item").querySelector("img");

        let alreadyTrue;
        if (input.checked) {
          const checkedAllEnter = checkAllEnter();
          if (checkedAllEnter) {
            input.checked = false;
            return;
          } else {
          }
        }
        $scope.querySelectorAll(".merge-group img").forEach((img) => {
          if (input.checked) {
            if (alreadyTrue) return;
            if (!img.getAttribute("src")) {
              img.src = src;
              img.classList.add("checked");
              gsap.to(img, 0.2, {
                x: 0,
                ease: "power2.inOut",
                overwrite: true,
              });
              alreadyTrue = true;
            }
          } else {
            if (img.src === src) {
              img.classList.remove("checked");
              gsap.to(img, 0.2, {
                x: "100%",
                ease: "power2.inOut",
                overwrite: true,
                onComplete() {
                  img.src = "";
                },
              });
            }
          }
        });
        const checkedAllEnter = checkAllEnter();
        if (checkedAllEnter) {
          mergeBtn.disabled = false;
          return;
        } else {
          mergeBtn.disabled = true;
        }
      });
    });

    removeBtn.forEach((remove) => {
      remove.addEventListener("click", (btn) => {
        const img = remove.closest(".merge-item").querySelector("img");
        mergeBtn.disabled = true;
        inputs.forEach((input, idx) => {
          const { src } = input.closest(".item").querySelector("img");

          if (img.src === src) {
            input.checked = false;
          }
        });
        img.classList.remove("checked");
        gsap.to(img, 0.2, {
          x: "100%",
          ease: "power2.inOut",
          overwrite: true,
          onComplete() {
            img.src = "";
          },
        });
      });
    });
    mergeBtn.addEventListener("click", () => {
      const checkedAllEnter = checkAllEnter();
      if (checkedAllEnter) {
        dialog.open();
      }
    });

    function checkAllEnter() {
      if ($scope.querySelectorAll(".merge-group img.checked").length === $scope.querySelectorAll(".merge-group img").length) {
        return true;
      }
    }
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
  if (document.querySelector(".container-visual-area")) {
    setFn.visualText();
  }
  // swiper feature-swiper init
});

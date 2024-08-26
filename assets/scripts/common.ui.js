const etUI = {}
window.etUI = etUI
;


/**
 * Check if the value is an array
 * @param value {any}
 * @returns {arg is any[]}
 */
function isArray(value) {
  return Array.isArray(value);
}
;


// boolean 관련 기능
;


// 날짜 관련 기능
;


// ex) string to querySelector convert logic

/**
 * 기능 설명 들어감
 */

/**
 * set attribute
 * @param { Element } parent
 * @param opts
 */
function setProperty(parent, ...opts) {
  if(opts.length === 2){
    const [property, value] = opts;

    parent?.setAttribute(property, value);
  }else if(opts.length === 3){
    const [selector, property, value] = opts;

    parent.querySelector(selector)?.setAttribute(property, value);
  }
}

/**
 * get attribute
 * @param { Element } parent
 * @param { String } selector
 * @param { String } property
 */
function getProperty(parent, selector, property) {
  parent.querySelector(selector)?.getAttribute(property);
}

/**
 * set style
 * @param { Element } parent
 * @param { String } selector
 * @param { String } property
 * @param { any } value
 */
function setStyle(parent, selector, property, value) {
  if (parent.querySelector(selector)) {
    parent.querySelector(selector).style[property] = value;
  }
}

/**
 * gsap의 SplitText를 활용하여 문자를 분리하여 마스크 가능하게 해준다.
 * @param selector  {string}
 * @param type  {'lines'|'words'|'chars'}
 * @returns [HTMLElement[], HTMLElement[]]
 */
function splitTextMask(selector, type = 'lines'){
  function wrap(el, wrapper) {
    el.parentNode.insertBefore(wrapper, el);
    wrapper.appendChild(el);
  }

  const $quote = document.querySelector(selector),
    mySplitText = new SplitText($quote, {type})

  const $splitted = mySplitText[type];
  const $lineWrap = [];
  $splitted.forEach(($el, index) => {
    const $div = document.createElement('div');
    $div.style.overflow = 'hidden';
    $div.style.position = 'relative';
    $div.style.display = 'inline-block';
    wrap($el, $div);
    $lineWrap.push($div);
  })

  return [$splitted, $lineWrap]
}
;


// 연산 관련 (자료형Number + number)
function getBlendOpacity(opacity, length) {
  if(length === 1){
    return opacity
  }

  return 1 - Math.pow(1 - opacity, 1/length)
}
;


// object 관련 기능

/**
 * compare obj
 * @param { Object } obj1
 * @param { Object } obj2
 * @returns Boolean
 */
function shallowCompare(obj1, obj2) {
  const keys = [...Object.keys(obj1), Object.keys(obj2)];

  for (const key of keys) {
    if (typeof obj1[key] === "object" && typeof obj2[key] === "object") {
      if (!etUI.utils.shallowCompare(obj1[key], obj2[key])) {
        return false;
      }
    } else {
      const role = !obj2[key] || typeof obj1[key] === "function";
      if (!role && obj1[key] !== obj2[key]) {
        return false;
      }
    }
  }
  return true;
}
;


/**
 * Reverse a string
 * @param str {string}
 * @returns {string}
 */
function reverseString(str) {
  return str.split('').reverse().join('');
}

/**
 * Get a random id
 * @returns {string}
 */
function getRandomId() {
  return Math.random().toString(36).substring(2);
}

/**
 *
 * @param prefix
 * @returns {string}
 */
function getRandomUIID(prefix = 'ui') {
  return `${prefix}-${getRandomId()}`;
}

/**
 * 첫글자만 대문자로 변환
 * @param word
 * @returns {string}
 */
function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1)
}

/**
 * 첫글자만 소문자로 변환
 * @param word
 * @returns {string}
 */
function uncapitalize(word) {
  return word.charAt(0).toLowerCase() + word.slice(1)
}

function addPrefixCamelString(str, prefix){
  // dimmClick => propsDimmClick
  return prefix + etUI.utils.capitalize(str)
}

function removePrefixCamelString(str, prefix){
  const regExp = new RegExp(`^${prefix}`, 'g')
  return etUI.utils.uncapitalize(str.replaceAll(regExp, ''))

}

;



etUI.utils = {
	isArray,
	setProperty,
	getProperty,
	setStyle,
	splitTextMask,
	getBlendOpacity,
	shallowCompare,
	reverseString,
	getRandomId,
	getRandomUIID,
	capitalize,
	uncapitalize,
	addPrefixCamelString,
	removePrefixCamelString
}
;


/**
 * target)의 외부를 클릭했을 때 콜백 함수를 실행
 * 예외적으로 클릭을 허용할 요소들의 선택자를 포함하는 배열을 옵션으로 받을 수 있습니다.
 *
 * @param {Element} target - 클릭 이벤트의 외부 클릭 감지를 수행할 대상 DOM 요소입니다.(필수)
 * @param {Function} callback - 외부 클릭이 감지되었을 때 실행할 콜백 함수입니다.(필수)
 * @param {Array<string>} exceptions - 외부 클릭 감지에서 예외 처리할 요소들의 선택자를 포함하는 배열입니다.(옵션)
 */

// blur 도 염두
function useClickOutside(target, callback, exceptions = []) {
  document.addEventListener("click", (event) => {
    let isClickInsideException = exceptions.some((selector) => {
      const exceptionElement = document.querySelector(selector);
      return exceptionElement && exceptionElement.contains(event.target);
    });

    if (!target.contains(event.target) && !isClickInsideException) {
      callback(target);
    }
  });
}

// 부모 요소는 parents
// 선택 요
;


function useCore(
  initialProps = {},
  initialValue = {},
  render,
  options = {
    dataset: true
}) {
  const actions = {};
  let $target;
  const cleanups = [];
  const NO_BUBBLING_EVENTS = [
    'blur',
    'focus',
    'focusin',
    'focusout',
    'pointerleave'
  ];

  const props = new Proxy(initialProps, {
    set: (target, key, value) => {
      Reflect.set(target, key, value);
    }
  });

  const state = new Proxy(initialValue, {
    set: (target, key, value) => {
      Reflect.set(target, key, value);
    },
  });

  function setTarget(_$target) {
    $target = _$target;

    if(options.dataset){
      const { getPropsFromDataset } = etUI.hooks.useDataset($target);
      const datasetProps = getPropsFromDataset();

      setProps({ ...props, ...datasetProps });
    }
  }

  function setProps(newProps) {
    Object.keys(newProps).forEach((key) => {
      props[key] = newProps[key];
    });
  }

  function setState(newState) {
    if(etUI.utils.shallowCompare(state, newState)) return;

    Object.keys(newState).forEach((key) => {
      state[key] = newState[key];
    });

    if (render) {
      render();
    }

    if (options.dataset) {
      const { setVarsFromDataset } = etUI.hooks.useDataset($target);
      setVarsFromDataset(state);
    }
  }

  function addEvent(eventType, selector, callback) {
    const $eventTarget = selector ? $target.querySelector(selector) : $target;

    if (NO_BUBBLING_EVENTS.includes(eventType)) {
      const cleanup = etUI.hooks.useEventListener($eventTarget, eventType, callback);
      return cleanups.push(cleanup);
    }

    const eventHandler = (event) => {
      let $eventTarget = event.target.closest(selector);

      if (!selector) {
        $eventTarget = event.target;
      }

      if ($eventTarget) {
        callback(event);
      }
    };

    $target.addEventListener(eventType, eventHandler);
    const cleanup = () => $target.removeEventListener(eventType, eventHandler);
    cleanups.push(cleanup);
  }

  function removeEvent() {
    cleanups.forEach((cleanup) => cleanup());
  }

  return {
    setTarget,
    actions,
    state,
    props,
    setState,
    setProps,
    addEvent,
    removeEvent,
  };
}
;


/**
 * useDataset
 * @param $target {HTMLElement}
 */
function useDataset($target) {
  let datasetProps = {},
    datasetVars = {};

  function getDatasetByPrefix(prefix) {
    const dataset = {};
    Object.keys($target.dataset).forEach((key) => {
      let value = $target.dataset[key];

      if (value === 'true') {
        value = true;
      } else if (value === 'false') {
        value = false;
      } else if(typeof value === 'string' && value.includes('{')){
        value = JSON.parse(value);
      }

      dataset[etUI.utils.removePrefixCamelString(key, prefix)] = value;
    });

    return dataset;
  }

  function getDatasetExceptPrefix(prefix) {
    const dataset = {};
    Object.keys($target.dataset).forEach((key) => {
      let value = $target.dataset[key];

      if (value === 'true') {
        value = true;
      } else if (value === 'false') {
        value = false;
      }

      dataset[etUI.utils.removePrefixCamelString(key, prefix)] = value;
    });

    return dataset;
  }

  function setDatasetByPrefix(data, prefix) {
    Object.keys(data).forEach((key) => {
      if(prefix){
        $target.dataset[`${prefix}${etUI.utils.capitalize(key)}`] = data[key];
      }else{
        $target.dataset[key] = data[key];
      }
    });
  }

  function getPropsFromDataset() {
    datasetProps = getDatasetByPrefix('props');

    return datasetProps;
  }

  function getVarsFromDataset() {
    datasetVars = getDatasetExceptPrefix('props');

    return datasetVars;
  }

  function setPropsFromDataset(props) {
    setDatasetByPrefix(props, 'props');
  }

  function setVarsFromDataset(vars) {
    setDatasetByPrefix(vars, '');
  }

  function setStringToObject(props) {
    // dataset에서 객체 형태인 스트링값 타입 객체로 바꿔줌
    for (const key in props) {
      if (!(typeof props[key] === 'boolean') && props[key].includes('{')) {
        props[key] = JSON.parse(props[key]);
      }
    }

    return props;
  }

  return {
    getPropsFromDataset,
    setPropsFromDataset,
    getVarsFromDataset,
    setVarsFromDataset,
    setStringToObject,
  };
}
;


function useDialog() {
  const alert = (...opts) => {
    const $layerWrap = document.querySelector('.layer-wrap');
    const dialog = new etUI.components.Dialog();

    if(typeof opts[0] === 'string'){
      dialog.core.init($layerWrap, { dialogType: 'alert', message: opts[0], callback: opts[1] });
    }else if(typeof opts[0] === 'object'){
      dialog.core.init($layerWrap, { dialogType: 'alert', ...opts[0] });
    }

    dialog.open();
  };

  const confirm = (...opts) => {
    const $layerWrap = document.querySelector('.layer-wrap');
    const dialog = new etUI.components.Dialog();

    if(typeof opts[0] === 'string'){
      dialog.core.init($layerWrap, { dialogType: 'confirm', message: opts[0], positiveCallback: opts[1] });
    }else if(typeof opts[0] === 'object'){
      dialog.core.init($layerWrap, { dialogType: 'confirm', ...opts[0] });
    }

    dialog.open();
  };

  const previewImage = (...opts) => {
    const $layerWrap = document.querySelector('.layer-wrap');
    const dialog = new etUI.components.Dialog();


    dialog.core.init($layerWrap, { dialogType: 'previewImage', ...opts[0] });

    dialog.open();
  }

  return {
    alert,
    confirm,
    previewImage
  };
}
;


function useDialogTmpl() {
  const $templateHTML = ({ dialogType, type, title, message, positiveText, negativeText }) => `
      <div class="dialog-dimm"></div>
      <div class="dialog-frame">
        <div class="dialog-container">
          <div class="dialog-header">
            ${title ? `<h3 class="dialog-tit">${title}</h3>` : ''}
          </div>
          <div class="dialog-content">
            ${dialogType === 'alert' ? `<span class="${type}">icon</span>` : ''}
            
            <p class="dialog-info">${message.replace(/\n/g, '<br>')}</p>
          </div>
          <div class="btn-group">
            ${dialogType === 'confirm' ? `<button type="button" class="btn dialog-negative">${negativeText}</button>` : ''}
            ${positiveText ? `<button type="button" class="btn dialog-positive btn-primary">${positiveText}</button>` : ''}
          </div>
        </div>
      </div>
    `;

    const $templatePreviewImageHTML = ({dialogType, images, title}) => `
      <div class="dialog-dimm"></div>
      <div class="dialog-frame">
        <div class="dialog-container">
          <div class="dialog-header">
            ${title ? `<h3 class="dialog-tit">${title}</h3>` : ''}
          </div>
          <div class="dialog-content">
            <div class="component-swiper" data-component="swiper">
              <!-- Additional required wrapper -->
              <div class="swiper-wrapper">
                ${images.map((image) => (`
                  <div class="swiper-slide">
                    <img src="${image.src}" alt="${image.alt}" />
                  </div>
                `)).join('')}
              </div>
            </div>
          </div>
        </div>
      </div>
    `

    return {
      $templateHTML,
      $templatePreviewImageHTML
    }
}
;


/**
 * useEventListener
 * @param target  {HTMLElement}
 * @param type  {string}
 * @param listener  {function}
 * @param options {object}
 * @returns {function(): *}
 */
function useEventListener(target, type, listener, options = {}){
  target.addEventListener(type, listener, options);
  return () => target.removeEventListener(type, listener, options);
}
;


/**
 * getBoundingClientRect
 * @param { Element } parent
 * @param { String } selector
 * @returns
 */
function useGetClientRect(parent, selector) {
  const rect = parent.querySelector(selector)?.getBoundingClientRect();
  if (!rect) return {};
  else
    return {
      width: rect.width,
      height: rect.height,
      top: rect.top,
      bottom: rect.bottom,
      left: rect.left,
      right: rect.right,
    };
}
;


function useLayer(type = 'modal'){
  function getVisibleLayer(){
    const $layerComponents = Array.from(document.querySelector('.layer-wrap').children).filter(($el) => {
      const isModalComponent = $el.classList.contains('component-modal')
      const isDialogComponent = $el.classList.contains('component-dialog')

      return isModalComponent || isDialogComponent
    })

    return $layerComponents.filter(($el) => {
      const style = window.getComputedStyle($el);
      return style.display !== 'none'
    })
  }

  function getTopDepth(){
    const $visibleLayerComponents = getVisibleLayer()
    return 100 + $visibleLayerComponents.length
  }

  function setLayerOpacity(defaultOpacity = 0.5){
    const $visibleLayerComponents = getVisibleLayer()
    $visibleLayerComponents.forEach(($el, index) => {

      const opacity = etUI.utils.getBlendOpacity(defaultOpacity, $visibleLayerComponents.length)

      if($el.querySelector(`.modal-dimm`)){
        $el.querySelector(`.modal-dimm`).style.backgroundColor = `rgba(0, 0, 0, ${opacity})`
      }

      if($el.querySelector(`.dialog-dimm`)){
        $el.querySelector(`.dialog-dimm`).style.backgroundColor = `rgba(0, 0, 0, ${opacity})`
      }
    })
  }

  return {
    getVisibleLayer,
    getTopDepth,
    setLayerOpacity
  }
}
;


function useMutationState(){
  let $target, $ref = {
    $state: {}
  }, mutationObserver, render;

  function initMutationState(_$target, _render){
    $target = _$target
    render = _render;

    setMutationObserver()
    setStateByDataset()
  }

  function setStateByDataset(){
    const filteredDataset = {};
    const dataset = $target.dataset;

    Object.keys(dataset).forEach((key) => {
      if(key.startsWith('vars')){
        filteredDataset[key.replace('vars', '').toLowerCase()] = dataset[key];
      }
    })

    setState(filteredDataset)
    render();
  }

  function setMutationObserver(){
    const config = { attributes: true, childList: false, subtree: false };

    const callback = (mutationList, observer) => {
      for (const mutation of mutationList) {
        if (mutation.type === "attributes"
          && mutation.attributeName !== 'style'
          && mutation.attributeName !== 'class'
        ) {
          setStateByDataset()
        }
      }
    };

    mutationObserver = new MutationObserver(callback);
    mutationObserver.observe($target, config);
  }

  function setState(newState){
    $ref.$state = { ...$ref.$state, ...newState };
  }

  function setDataState(newState) {
    const $newState = { ...$ref.$state, ...newState };

    Object.keys($newState).forEach((key) => {
      $target.dataset[`vars${etUI.utils.capitalize(key)}`] = $newState[key];
    })
  }

  return {
    $ref,
    setState,
    setDataState,
    initMutationState
  }
}
;


function useSelectBoxTemp() {
  const $templateCustomHTML = {
    label(text) {
      return `
        <div id="combo1-label" class="combo-label">${text}</div>
      `;
    },
    selectBtn(text) {
      return `
      <button type="button" id="combo1" class="select-box" role="combobox" aria-controls="listbox1" aria-expanded="false" aria-labelledby="combo1-label" aria-activedescendant="">
        <span style="pointer-events: none;">${text}</span>
      </button>
      `;
    },
    itemsWrap(itemsHTML) {
      return `
        <ul id="listbox1" class="select-options" role="listbox" aria-labelledby="combo1-label" tabindex="-1">
          ${itemsHTML}
        </ul>
      `;
    },
    items(item, selected = false) {
      return `
        <li role="option" class="option" aria-selected="${selected}" data-value="${item.value}">
          ${item.text}
        </li>
      `;
    },
  };

  const $templateBasicHTML = {
    label(text) {
      return `
        <div id="combo1-label" class="combo-label">${text}</div>
      `;
    },
    selectBtn(text) {
      return `
        <option value="" selected disabled hidden>${text}</option>
      `;
    },
    itemsWrap(itemsHTML) {
      return `
        <select class="select-list" required>
          ${itemsHTML}
        </select>
      `;
    },
    items(item, selected = false) {
      return `
        <option value="${item.value}">${item.text}</option>
      `;
    },
  };

  return {
    $templateCustomHTML,
    $templateBasicHTML,
  };
}
;


function useState(initialValue = {}, callback) {
  const state = new Proxy(initialValue, {
    set: (target, key, value) => {
      target[key] = value;

      if (callback) {
        callback(target);
      }
    }
  });

  const setState = (newState) => {
    Object.keys(newState).forEach((key) => {
      state[key] = newState[key];
    })
  }

  return [state, setState];
}
;


function useSwiperTmpl() {
  const $templateHTML = {
    navigation() {
      return `
        <button type="button" class="swiper-button-prev">이전</button>
        <button type="button" class="swiper-button-next">다음</button>
      `;
    },
    pagination() {
      return `
        <div class="swiper-pagination"></div>
      `;
    },
    autoplay() {
      return `
      <button type="button" class="swiper-autoplay play"></button>
      `;
    },
  };

  return {
    $templateHTML,
  };
}
;


/**
 * temp timeline
 * @returns
 */
function useTransition() {
  // select
  const useSelectShow = (target, type, option) => {
    if (!target) return;

    const timeline = gsap.timeline({ paused: true });

    const optionList = {
      fast: { duration: 0.1 },
      normal: { duration: 0.3 },
      slow: { duration: 0.7 },
    };
    let gsapOption = { ...optionList[type], ...option };

    timeline.to(target, {
      alpha: 0,
      ease: "linear",
      onComplete() {
        target.style.display = "none";
      },
      ...gsapOption,
    });

    return {
      timelineEl: timeline._recent.vars,
      timeline: (state) => {
        state ? ((target.style.display = "block"), timeline.reverse()) : timeline.play();
      },
    };
  };

  return {
    useSelectShow,
  };
}
;



etUI.hooks = {
	useClickOutside,
	useCore,
	useDataset,
	useDialog,
	useDialogTmpl,
	useEventListener,
	useGetClientRect,
	useLayer,
	useMutationState,
	useSelectBoxTemp,
	useState,
	useSwiperTmpl,
	useTransition
}
;


/**
 * @typedef {Object} PropsConfig
 * @property {boolean} disabled - 요소가 비활성화 상태인지를 나타냅니다.
 * @property {boolean} once - 이벤트나 액션을 한 번만 실행할지 여부를 결정합니다.
 * @property {false | number} duration - 애니메이션 또는 이벤트 지속 시간을 밀리초 단위로 설정합니다. 'false'일 경우 지속 시간을 무시합니다.
 * @property {Object} origin - 원점 또는 시작 지점을 나타내는 객체입니다.
 */

/**
 * @typedef {Object} StateConfig
 * @property {'close' | 'open'} state - 아코디언의 상태값. close, open 둘 중에 하나입니다.
 */

/** @type {PropsConfig} */
/** @type {StateConfig} */

function Accordion() {
  const { actions, props, state, setProps, setState, setTarget, addEvent, removeEvent } = etUI.hooks.useCore(
    {
      defaultValue: 0,
      collapsible: false,
      animation: {
        duration: 0.5,
        easing: "power4.out",
      },
      type: "multiple",
    },
    {},
    render,
  );

  // constant

  // variable
  const name = "accordion";
  let component = {};
  // element, selector
  let accordionToggleBtn, accordionItem;
  let $target, $accordionContents, $accordionItem;

  {
    function init(_$target, _props) {
      if (typeof _$target === "string") {
        $target = document.querySelector(_$target);
      } else {
        $target = _$target;
      }

      if (!$target) {
        throw Error("target이 존재하지 않습니다.");
      }

      setTarget($target);
      setProps({ ...props, ..._props });

      if ($target.ui) return;
      $target.ui = component;

      setup();
      setEvent();

      $target.setAttribute("data-init", "true");

      console.log($target);
    }

    function setup() {
      setupSelector();
      setupElement();
      setupActions();

      // state
      setState({ setting: "custom" });
    }

    /**
     * update
     * @param _props
     */
    function update(_props) {
      if (_props && etUI.utils.shallowCompare(props, _props) && !$target.getAttribute("data-init")) return;
      destroy();

      setProps({ ...props, ..._props });
      setup();
      setEvent();
    }

    function destroy() {
      removeEvent();
      $target.ui = null;
      $target.removeAttribute("data-init");
    }
  }

  function setupSelector() {
    // selector
    accordionToggleBtn = ".accordion-tit";
    accordionItem = ".accordion-item";

    // element
    $accordionItem = $target.querySelector(accordionItem);
    $accordionContents = $target.querySelector(".accordion-content");
  }

  function setupElement() {
    // id
    const id = etUI.utils.getRandomUIID(name);

    $target.setAttribute("aria-expanded", false);
    $accordionContents.setAttribute("aria-hidden", true);
    $accordionContents.setAttribute("role", "region");
    $target.setAttribute("id", id);
    $target.setAttribute("aria-labelledby", id);
  }

  function setupActions() {
    const isCustom = props.setting === "custom";
    const { duration, easeing } = props.animation;

    actions.open = (target = $accordionItem) => {
      target.setAttribute("aria-expanded", true);
      if (!isCustom) {
        target.classList.add("show");
      } else {
        gsap.timeline().to(target, { duration: duration, ease: easeing, padding: "3rem" });
      }
    };

    actions.close = (target = $accordionItem) => {
      target.setAttribute("aria-expanded", false);
      if (!isCustom) {
        target.classList.remove("show");
      } else {
        gsap.timeline().to(target, { duration: duration, padding: "0 3rem" });
      }
    };

    actions.arrowUp = () => {
      console.log("keyup 콜백");
    };

    actions.arrowDown = () => {
      console.log("keyup 콜백");
    };
  }

  function setEvent() {
    const { type } = props;
    if (type === "single") {
      addEvent("click", accordionToggleBtn, ({ target }) => {
        const { parentElement } = target;
        singleToggleAccordion(parentElement);
      });
    } else {
      addEvent("click", accordionToggleBtn, ({ target }) => {
        toggleAccordion(target.parentElement);
      });
    }
  }

  function toggleAccordion(ele) {
    console.log(ele);
    const isOpen = state.state === "open";
    if (isOpen) {
      actions.close(ele);
      close();
    } else {
      actions.open(ele);
      open();
    }
  }

  function singleToggleAccordion(target) {
    const $clickedItem = target.parentElement;
    const $allTitles = $clickedItem.querySelectorAll(accordionToggleBtn);
    const $allItems = Array.from($allTitles).map((title) => title.parentElement);

    $allItems.forEach(($item) => {
      const $title = $item.querySelector(accordionToggleBtn);
      const $content = $title.nextElementSibling;
      if ($item === target) {
        if ($content.getAttribute("aria-hidden") === "true") {
          $content.setAttribute("aria-hidden", "false");
          $title.setAttribute("aria-expanded", "true");
          $item.classList.add("show");
          open();
        } else {
          $content.setAttribute("aria-hidden", "true");
          $title.setAttribute("aria-expanded", "false");
          $item.classList.remove("show");
          close();
        }
      } else {
        $content.setAttribute("aria-hidden", "true");
        $title.setAttribute("aria-expanded", "false");
        $item.classList.remove("show");
      }
    });
  }

  function render() {
    const isShow = state.state === "open";
    // etUI.utils.setProperty($target, accordionItem, "aria-expanded", isShow);
    isShow ? open() : close();
  }

  function open() {
    setState({ state: "open" });
  }

  function close() {
    setState({ state: "close" });
  }

  component = {
    core: {
      state,
      props,
      init,
      removeEvent,
      destroy,
    },

    update,
    open,
    close,
  };

  return component;
}
;


/**
 *  Modal
 */
function Dialog() {
  const {
    actions, props, state, setProps, setState, setTarget, addEvent, removeEvent
  } = etUI.hooks.useCore({
      // props
      dimmClick: true,
      esc: true,
      title: null,
      message: '',
      type: 'alert',
      positiveText: '확인',
      negativeText: '취소',
    }, {
      state: 'close',
      trigger: null
    }, render, {
      dataset: false,
    },
  );

  // constant
  const DIMM_OPACITY = 0.6;

  // variable
  const name = 'dialog';
  let component = {};
  let modalDimmSelector,
    modalCloseBtnSelector,
    modalBtnPositive,
    modalBtnNegative;
  let $target,
    $modal,
    $modalTitle, $modalContainer, $modalDimm,
    $modalBtnPositive, $modalBtnNegative,
    focusTrapInstance,
    callback;

  {
    /**
     * init
     * @param _$target
     * @param _props
     */
    function init(_$target, _props) {
      if (typeof _$target === 'string') {
        $target = document.querySelector(_$target);
      } else {
        $target = _$target;
      }

      if (!$target) {
        throw Error('target이 존재하지 않습니다.');
      }

      setTarget($target);
      setProps({ ...props, ..._props });

      if ($target.ui) return;
      $target.ui = component;

      setup();
      setEvent();

      // $target.setAttribute('data-init', 'true');
    }

    function setup() {
      setupTemplate();
      setupSelector();
      setupElement();
      setupActions();

      // focus trap
      focusTrapInstance = focusTrap.createFocusTrap($target, {
        escapeDeactivates: props.esc,
        onActivate: actions.focusActivate,
        onDeactivate: actions.focusDeactivate
      });

      // state
      // setState({ state: props.state });
    }

    /**
     * update
     * @param _props
     */
    function update(_props) {
      if (_props && etUI.utils.shallowCompare(props, _props) && !$target.getAttribute('data-init')) return;
      destroy();

      setProps({ ...props, ..._props });
      setup();
      setEvent();
    }

    function destroy() {
      removeEvent();
      $target.ui = null;
    }
  }

  // frequency
  function setupTemplate() {
    const { $templateHTML, $templatePreviewImageHTML } = etUI.hooks.useDialogTmpl()
    const template = document.createElement('div');


    if(props.dialogType === 'alert' || props.dialogType === 'confirm'){
      template.classList.add('component-dialog');
      template.innerHTML = $templateHTML(props);
    }else if(props.dialogType === 'previewImage'){
      template.classList.add('component-dialog');
      template.classList.add('dialog-preview-image');
      template.innerHTML = $templatePreviewImageHTML(props);
    }

    $modal = template;
    $target.appendChild(template);
    // $target.innerHTML = ``;
  }

  function setupSelector() {
    // selector
    modalCloseBtnSelector = '.dialog-close';
    modalDimmSelector = '.dialog-dimm';

    // element
    $modalTitle = $modal.querySelector('.dialog-tit');
    $modalDimm = $modal.querySelector(modalDimmSelector);
    $modalContainer = $modal.querySelector('.dialog-container');

    modalBtnPositive = '.dialog-positive';
    modalBtnNegative = '.dialog-negative';
    $modalBtnPositive = $modal.querySelector('.dialog-positive');
    $modalBtnNegative = $modal.querySelector('.dialog-negative');
  }

  function setupElement() {
    // set id
    const id = etUI.utils.getRandomUIID(name);
    const titleId = etUI.utils.getRandomUIID(name + '-tit');
    // // a11y

    if(props.dialogType === 'alert' || props.dialogType === 'confirm'){
      etUI.utils.setProperty($modal, 'role', 'alertdialog');
    }else if(props.dialogType === 'previewImage'){
      etUI.utils.setProperty($modal, 'role', 'dialog');

      const $swiper = $modal.querySelector('.component-swiper')
      const swiper = new etUI.components.SwiperComp();
      swiper.core.init($swiper, {
        navigation: true,
        pagination: true
      })
    }

    etUI.utils.setProperty($modal, 'aria-modal', 'true');
    etUI.utils.setProperty($modal, 'id', id);
    if ($modalTitle) etUI.utils.setProperty($modalTitle, 'id', titleId);
    etUI.utils.setProperty($modal, 'aria-labelledby', titleId);
    etUI.utils.setProperty($modal, 'tabindex', '-1');
  }

  function setupActions() {
    const { getTopDepth, setLayerOpacity } = etUI.hooks.useLayer('dialog');

    actions.focusActivate = () => {
    }

    actions.focusDeactivate = () => {
      if(!state.trigger){
        callback = props.negativeCallback
      }
      actions.close();
    }

    actions.open = () => {
      const zIndex = getTopDepth();

      $modal.style.display = 'block';
      $modal.style.zIndex = zIndex

      setLayerOpacity(DIMM_OPACITY);

      gsap.timeline().to($modalDimm, { duration: 0, display: 'block', opacity: 0 }).to($modalDimm, {
        duration: 0.15,
        opacity: 1,
      });

      gsap
        .timeline()
        .to($modalContainer, {
          duration: 0,
          display: 'block',
          opacity: 0,
          scale: 0.95,
          yPercent: 2,
        })
        .to($modalContainer, { duration: 0.15, opacity: 1, scale: 1, yPercent: 0, ease: 'Power2.easeOut' });
    };

    actions.close = () => {
      gsap.timeline().to($modalDimm, {
        duration: 0.15,
        opacity: 0,
        onComplete() {
          $modalDimm.style.display = 'none';
        },
      });

      gsap.timeline().to($modalContainer, {
        duration: 0.15,
        opacity: 0,
        scale: 0.95,
        yPercent: 2,
        ease: 'Power2.easeOut',
        onComplete() {
          $modalContainer.style.display = 'none';
          $modal.style.display = 'none';
          $modal.style.zIndex = null

          setLayerOpacity(DIMM_OPACITY);

          if (callback) {
            callback();
          }
          destroy();

          $target.removeChild($modal);
        },
      });
    };
  }

  function setEvent() {
    addEvent('click', modalCloseBtnSelector, close);

    if (props.dimmClick) {
      addEvent('click', modalDimmSelector, close);
    }

    addEvent('click', modalBtnPositive, () => {
      if (props.callback) {
        callback = props.callback;
      } else if (props.positiveCallback) {
        callback = props.positiveCallback;
      }

      close('btnPositive');
    });
    addEvent('click', modalBtnNegative, () => {
      callback = props.negativeCallback;

      close('btnNegative');
    });
  }

  function render() {
    const isOpened = state.state === 'open';

    if (isOpened) {
      actions.open();

      focusTrapInstance.activate();
    } else {
      focusTrapInstance.deactivate();
    }
  }

  function open() {
    setState({ state: 'open' });
  }

  function close(trigger) {
    setState({ state: 'close', trigger });
  }

  component = {
    core: {
      state,
      props,

      init,
      removeEvent,
      destroy,
    },
    update,
    open,
    close,
  };

  return component;
}
;


/**
 *  Modal
 */
function Modal() {
  const {
    actions, props, state, setProps, setState, setTarget, addEvent, removeEvent
  } = etUI.hooks.useCore({
    // props
    dimmClick: true,
    esc: true,
  }, {
    // state

  }, render);

  // constant
  const DIMM_OPACITY = 0.6;

  // variable
  const name = 'modal';
  let component = {};

  let focusTrapInstance,
    modalDimmSelector, modalCloseBtnSelector;
  let $target, $html,
    $modalTitle, $modalContainer, $modalDimm;

  {
    /**
     * init
     * @param _$target
     * @param _props
     */
    function init(_$target, _props) {
      if(typeof _$target === 'string'){
        $target = document.querySelector(_$target)
      }else{
        $target = _$target;
      }

      if(!$target){
        throw Error('target이 존재하지 않습니다.');
      }

      setTarget($target)
      setProps({...props, ..._props});

      if ($target.ui) return;
      $target.ui = component;

      setup();
      setEvent();

      $target.setAttribute('data-init', 'true');
    }

    function setup() {
      setupTemplate();
      setupSelector();
      setupElement();
      setupActions();

      // focus trap
      focusTrapInstance = focusTrap.createFocusTrap($target, {
        escapeDeactivates: props.esc,
        onActivate: actions.focusActivate,
        onDeactivate: actions.focusDeactivate
      });

      // state
      // setState({ state: props.state });
    }

    /**
     * update
     * @param _props
     */
    function update(_props) {
      if (_props && etUI.utils.shallowCompare(props, _props) && !$target.getAttribute('data-init')) return;
      destroy();

      setProps({ ...props, ..._props });
      setup();
      setEvent();
    }

    function destroy() {
      removeEvent();
      $target.ui = null;
      $target.removeAttribute('data-init');
    }
  }

  // frequency
  function setupTemplate() {
    // $target.innerHTML = ``;
  }

  function setupSelector(){
    // selector
    modalCloseBtnSelector = '.modal-close'
    modalDimmSelector = '.modal-dimm'

    // element
    $modalTitle = $target.querySelector('.modal-tit')
    $modalDimm = $target.querySelector(modalDimmSelector)
    $modalContainer = $target.querySelector('.modal-container')
    $html = document.documentElement;
  }

  function setupElement() {
    // set id
    const id = etUI.utils.getRandomUIID(name);
    const titleId = etUI.utils.getRandomUIID(name + '-tit')

    // a11y
    etUI.utils.setProperty($target, 'role', 'dialog');
    etUI.utils.setProperty($target, 'aria-modal', 'true');
    etUI.utils.setProperty($target, 'id', id);
    if($modalTitle) etUI.utils.setProperty($modalTitle, 'id', titleId);
    etUI.utils.setProperty($target, 'aria-labelledby', titleId);
    etUI.utils.setProperty($target, 'tabindex', '-1');
  }

  function setupActions(){
    const { getTopDepth, setLayerOpacity } = etUI.hooks.useLayer('modal');

    actions.focusActivate = () => {
    }

    actions.focusDeactivate = () => {
      close();
      // actions.close();
    }

    actions.open = () => {
      const zIndex = getTopDepth();

      $target.style.display = 'block'
      $target.style.zIndex = zIndex

      setLayerOpacity(DIMM_OPACITY);

      gsap.timeline()
        .to($modalDimm, {duration: 0, display: 'block', opacity: 0})
        .to($modalDimm, {duration: 0.15, opacity: 1})

      gsap.timeline()
        .to($modalContainer, {duration: 0, display: 'block', opacity: 0, scale: 0.95, yPercent: 2})
        .to($modalContainer, {duration: 0.15, opacity: 1, scale: 1, yPercent: 0, ease: 'Power2.easeOut'})
    }

    actions.close = () => {
      gsap.timeline()
        .to($modalDimm, {duration: 0.15, opacity: 0, onComplete(){
            $modalDimm.style.display = 'none';
          }})

      gsap.timeline()
        .to($modalContainer, {duration: 0.15, opacity: 0, scale: 0.95, yPercent: 2, ease: 'Power2.easeOut', onComplete(){
            $modalContainer.style.display = 'none';
            $target.style.display = 'none';
            $target.style.zIndex = null

            setLayerOpacity(DIMM_OPACITY);
          }})
    }
  }

  function setEvent() {
    addEvent('click', modalCloseBtnSelector, close);

    if(props.dimmClick){
      addEvent('click', modalDimmSelector, close);
    }
  }

  function render() {
    const isOpened = state.state === 'open';

    if(isOpened){
      actions.open()

      focusTrapInstance.activate();
    }else{
      actions.close()

      focusTrapInstance.deactivate();
    }
  }

  function open(){
    setState({state: 'open'});
  }

  function close(){
    setState({state: 'close'});
  }

  component = {
    core: {
      state,
      props,

      init,
      removeEvent,
      destroy,
    },
    update,
    open,
    close,
  };

  return component;
}
;


function SelectBox() {
  const { actions, props, state, setProps, setState, setTarget, addEvent, removeEvent } = etUI.hooks.useCore(
    {
      type: "custom",
      label: "",
      default: "",
      items: [],
      selectedIndex: 0,
      transition: "normal",
      scrollTo: false,
      gsapOption: {},
      state: "close",
    },
    {},
    render,
  );
  const { $templateCustomHTML, $templateBasicHTML } = useSelectBoxTemp();
  const { useSelectShow } = useTransition();

  // constant
  const MARGIN = 20;

  // variable
  const name = "select";
  // eslint-disable-next-line prefer-const
  let component = {};
  let $target,
    // 요소관련 변수들
    selectLabel,
    selectComboBox,
    selectListBox,
    selectOption,
    timeline;

  {
    function init(_$target, _props) {
      if (typeof _$target === "string") {
        $target = document.querySelector(_$target);
      } else {
        $target = _$target;
      }

      if (!$target) {
        throw Error("target이 존재하지 않습니다.");
      }

      setTarget($target);
      setProps({ ...props, ..._props });

      if ($target.ui) return;
      $target.ui = component;

      setup();
      setEvent();

      $target.setAttribute("data-init", "true");
    }

    function setup() {
      setupTemplate();

      if (props.type === "basic") return;

      setupSelector();
      setupElement();
      setupActions();

      // effect
      timeline = useSelectShow($target.querySelector(selectListBox), props.transition, props.gsapOption).timeline;

      // state
      actions[props.state || state.state]?.();
    }

    function update(_props) {
      if (_props && etUI.utils.shallowCompare(props, _props) && !$target.getAttribute("data-init")) return;
      destroy();
      setProps({ ...props, ..._props });
      setup();
      setEvent();
    }

    function destroy() {
      removeEvent();
      $target.ui = null;
      $target.removeAttribute("data-init");
    }
  }

  // frequency
  function setupTemplate() {
    if (props.items.length < 1) return;
    if (props.type === "custom") {
      const { selectedIndex } = props;
      const itemListTemp = props.items.map((item) => $templateCustomHTML.items(item)).join("");

      $target.innerHTML = `
        ${props.label && $templateCustomHTML.label(props.label)}
        ${props.default ? $templateCustomHTML.selectBtn(props.default) : $templateCustomHTML.selectBtn(props.items.find((item) => item.value == props.items[selectedIndex].value).text)}
        ${props.items && $templateCustomHTML.itemsWrap(itemListTemp)}
      `;
    } else {
      const selectBtnTemp = $templateBasicHTML.selectBtn(props.default);
      const itemListTemp = props.items.map((item) => $templateBasicHTML.items(item)).join("");

      $target.innerHTML = `
        ${props.label && $templateBasicHTML.label(props.label)}
        ${props.items && $templateBasicHTML.itemsWrap(selectBtnTemp + itemListTemp)}
      `;
    }
  }
  function setupSelector() {
    selectLabel = ".combo-label";
    selectComboBox = ".select-box";
    selectListBox = ".select-options";
    selectOption = ".option";
  }

  function setupElement() {
    // id
    const labelId = etUI.utils.getRandomUIID(name);
    const comboBoxId = etUI.utils.getRandomUIID("combobox");
    const listBoxId = etUI.utils.getRandomUIID("listbox");

    // a11y
    etUI.utils.setProperty($target, selectLabel, "id", labelId);
    etUI.utils.setProperty($target, selectComboBox, "id", comboBoxId);
    etUI.utils.setProperty($target, selectComboBox, "role", "combobox");
    etUI.utils.setProperty($target, selectComboBox, "aria-labelledby", labelId);
    etUI.utils.setProperty($target, selectComboBox, "aria-controls", listBoxId);
    etUI.utils.setProperty($target, selectListBox, "id", listBoxId);
    etUI.utils.setProperty($target, selectListBox, "role", "listbox");
    etUI.utils.setProperty($target, selectListBox, "aria-labelledby", labelId);
    etUI.utils.setProperty($target, selectListBox, "tabindex", -1);

    // select property
    const options = $target.querySelectorAll(selectOption);
    options.forEach((el, index) => {
      const optionId = etUI.utils.getRandomUIID("option");

      $target[index] = el;
      el["index"] = index;
      el.setAttribute("id", optionId);
      el.setAttribute("role", "option");
      el.setAttribute("aria-selected", false);

      props.items[index]?.disabled && el.setAttribute("disabled", "");

      if (!$target["options"]) $target["options"] = [];
      $target["options"][index] = el;
    });

    !props.default && selectItem(options[props.selectedIndex]);
  }

  function setupActions() {
    let selectIndex = isNaN($target.selectedIndex) ? -1 : $target.selectedIndex;

    function updateIndex(state) {
      if (!state) return;
      selectIndex = isNaN($target.selectedIndex) ? -1 : $target.selectedIndex;
      updateCurrentClass($target[selectIndex]);
    }

    function keyEventCallback() {
      updateCurrentClass($target[selectIndex]);
      etUI.utils.setProperty($target, selectComboBox, "aria-activedescendant", $target[selectIndex].id);
      $target.querySelector(`${selectComboBox} :last-child`).textContent = $target[selectIndex].textContent;
    }

    actions.open = () => {
      $target.querySelector(selectComboBox)?.focus();
      openState();
      updateIndex(true);
    };
    actions.close = () => {
      $target.querySelector(`${selectComboBox} :last-child`).textContent = $target["options"][$target.selectedIndex]?.textContent ?? props.default;
      closeState();
    };
    actions.select = () => {
      const currentEl = $target.querySelector(".current");
      selectItem(currentEl);
      closeState();
    };

    actions.first = () => {
      selectIndex = 0;
      keyEventCallback();
    };
    actions.last = () => {
      selectIndex = $target["options"].length - 1;
      keyEventCallback();
    };
    actions.up = () => {
      selectIndex = Math.max(--selectIndex, 0);
      keyEventCallback();
    };
    actions.down = () => {
      selectIndex = Math.min(++selectIndex, $target["options"].length - 1);
      keyEventCallback();
    };

    component.open = actions.open;
    component.close = actions.close;
  }

  function setEvent() {
    if (props.type === "basic") return;

    // a11y
    const actionList = {
      up: ["ArrowUp"],
      down: ["ArrowDown"],
      first: ["Home", "PageUp"],
      last: ["End", "PageDown"],
      close: ["Escape"],
      select: ["Enter", " "],
    };

    addEvent("blur", selectComboBox, (e) => {
      if (e.relatedTarget?.role === "listbox") return;
      actions.close();
    });

    addEvent("click", selectComboBox, ({ target }) => {
      const toggleState = state.state === "open" ? "close" : "open";
      actions[toggleState]?.();
    });

    // a11y
    addEvent("keydown", selectComboBox, (e) => {
      if (state.state === "close") return;

      const { key } = e;
      const action = Object.entries(actionList).find(([_, keys]) => keys.includes(key));

      if (action) {
        e.preventDefault();
        const [actionName] = action;
        actions[actionName]?.();
      }
    });

    addEvent("click", selectListBox, ({ target }) => {
      if (!target.role === "option") return;
      updateCurrentClass(target);
      actions.select();
    });
  }

  function render() {
    const isOpened = state.state === "open";

    props.transition && timeline(isOpened);
    checkOpenDir(isOpened);

    etUI.utils.setProperty($target, selectComboBox, "aria-expanded", isOpened);

    const selectedEl = $target.querySelector('[aria-selected="true"]');
    if (isOpened) etUI.utils.setProperty($target, selectComboBox, "aria-activedescendant", selectedEl?.id ?? "");
    else etUI.utils.setProperty($target, selectComboBox, "aria-activedescendant", "");
  }

  // custom
  function checkOpenDir(state) {
    if (!state || props.scrollTo) return; // false이거나 scrollTo 기능 있을 때 - 아래로 열림

    const { height: listHeight } = etUI.hooks.useGetClientRect($target, selectListBox);
    const { height: comboHeight, bottom: comboBottom } = etUI.hooks.useGetClientRect($target, selectComboBox);
    const role = window.innerHeight - MARGIN < comboBottom + listHeight;

    etUI.utils.setStyle($target, selectListBox, "bottom", role ? comboHeight + "px" : "");
  }

  // update .current class
  function updateCurrentClass(addClassEl) {
    $target.querySelector(".current")?.classList.remove("current");
    addClassEl?.classList.add("current");
  }

  // select item
  function selectItem(target) {
    const targetOption = target?.closest(selectOption);

    if (!targetOption) return;

    $target.selectedIndex = targetOption["index"];
    $target.value = targetOption.getAttribute("data-value");

    etUI.utils.setProperty($target, '[aria-selected="true"]', "aria-selected", false);
    targetOption.setAttribute("aria-selected", true);

    updateCurrentClass($target.querySelector('[aria-selected="true"]'));
    $target.querySelector(`${selectComboBox} :last-child`).textContent = targetOption.textContent;
  }

  // select state
  function openState() {
    setState({ state: "open" });
  }

  function closeState() {
    setState({ state: "close" });
  }

  component = {
    core: {
      state,
      props,

      init,
      removeEvent,
      destroy,
    },

    update,
    open,
    close,
  };

  return component;
}
;


/**
 * Skel
 * // init, setup, update, destroy
 * // setupTemplate, setupSelector, setupElement, setupActions,
 *      setEvent, render, customFn, callable
 *
 *      dom만 이용해서 ui 초기화
 *        data-props-opt1, data-props-opt2, data-props-opt3
 *      고급옵션
 *        data-init=false
 *        const instance = new Skel();
 *        instance.core.init('.selector', { opt1: 'value' })
 *
 *      data-init 처리
 */
function Skel() {
  const {
    actions, props, state, setProps, setState, setTarget, addEvent, removeEvent
  } = etUI.hooks.useCore({
    // props

  }, {
    // state

  }, render);

  // constant
  const MARGIN = 20;

  // variable
  const name = 'skel';
  // eslint-disable-next-line prefer-const
  let component = {};
    // element, selector
  let $target,
    someSelector, otherSelector,
    $targetEls1, $targetEls2

  {
    /**
     * init
     * @param _$target
     * @param _props
     */
    function init(_$target, _props) {
      if(typeof _$target === 'string'){
        $target = document.querySelector(_$target)
      }else{
        $target = _$target;
      }

      if(!$target){
        throw Error('target이 존재하지 않습니다.');
      }

      setTarget($target)
      setProps({...props, ..._props});

      if ($target.ui) return;
      $target.ui = component;

      setup();
      setEvent();

      $target.setAttribute('data-init', 'true');
    }

    function setup() {
      // template, selector, element, actions
      setupTemplate();
      setupSelector()
      setupElement();
      setupActions();

      // state
      setState({ state: props.state });
    }

    /**
     * update
     * @param _props
     */
    function update(_props) {
      if (_props && etUI.utils.shallowCompare(props, _props) && !$target.getAttribute('data-init')) return;
      destroy();

      setProps({ ...props, ..._props });
      setup();
      setEvent();
    }

    function destroy() {
      removeEvent();
      $target.ui = null;
      $target.removeAttribute('data-init');
    }
  }

  // frequency
  function setupTemplate() {
    // $target.innerHTML = ``;
  }

  function setupSelector(){
    $targetEls2 = '.el2';
    $targetEls1 = '.el1';
  }

  function setupElement() {
    // id
    const labelId = etUI.utils.getRandomUIID(name);

    // a11y
    utils.setProperty($target, $selectLabel, 'id', labelId);

    // component custom element
  }

  function setupActions(){
    actions.open = () => {

    }

    actions.close = () => {

    }
  }

  function setEvent() {
    addEvent('click', $targetEls1, ({ target }) => {
      // handler
    });
  }

  function render() {
    // render
  }

  function open() {
  }

  function close() {
  }

  component = {
    core: {
      state,
      props,
      init,
      removeEvent,
      destroy,
    },

    // callable
    update,
    open,
    close,
  }

  return component;
}
;


function SwiperComp() {
  const {
    actions, props, state, setState, setProps, setTarget, addEvent, removeEvent
  } = etUI.hooks.useCore(
    {
      loop: true,
      on: {
        slideChangeTransitionEnd() {
          // console.log(`${this.realIndex + 1}번 째 slide`);
          setState({ activeIndex: this.realIndex + 1 });
        },
      },
    },
    {
      state: "",
      running: "",
      activeIndex: 0,
    },
    render,
  );

  /**
   * data-props 리스트
   */

    // constant
  const MARGIN = 20;

  // variable
  const name = "swiper";
  let component = {};
  // element, selector
  let $target, $swiper, $swiperNavigation, $swiperPagination, $swiperAutoplay, $swiperSlideToButton;

  {
    /**
     * init
     * @param _$target
     * @param _props
     */
    function init(_$target, _props) {
      if (typeof _$target === "string") {
        $target = document.querySelector(_$target);
      } else {
        $target = _$target;
      }

      if (!$target) {
        throw Error("target이 존재하지 않습니다.");
      }

      setTarget($target);
      setProps({ ...props, ..._props });

      if ($target.ui) return;
      $target.ui = component;

      setup();
      setEvent();

      $target.setAttribute("data-init", "true");
    }

    function setup() {
      // template, selector, element, actions
      setupTemplate();
      setupSelector();
      setupElement();
      setupActions();

      // state
      setState({ state: props.state });
    }

    /**
     * update
     * @param _props
     */
    function update(_props) {
      if (props && utils.shallowCompare(props, _props) && !$target.getAttribute("data-init")) return;
      destroy();

      setProps({ ...props, ..._props });
      setup();
      setEvent();
    }

    function destroy() {
      removeEvent();
      $target.ui = null;
      $target.removeAttribute("data-init");
    }
  }

  // frequency
  function setupTemplate() {
    const { navigation, pagination, autoplay } = props;
    const { $templateHTML } = useSwiperTmpl();
    let navigationEl, paginationEl, autoplayEl;

    function createHTMLElement(_className, htmlString) {
      const template = document.createElement("div");
      template.classList.add(_className);
      template.innerHTML = htmlString;
      return template;
    }

    if (navigation) {
      navigationEl = createHTMLElement("swiper-navigation", $templateHTML.navigation());
      $target.querySelector(".swiper-wrapper").after(navigationEl);
      typeof navigation === "boolean" &&
      setProps({
        navigation: {
          prevEl: ".swiper-button-prev",
          nextEl: ".swiper-button-next",
        },
      });
    }

    if (pagination) {
      paginationEl = createHTMLElement("swiper-pagination-wrap", $templateHTML.pagination());
      $target.querySelector(".swiper-wrapper").after(paginationEl);
      typeof pagination === "boolean" &&
      setProps({
        pagination: {
          el: ".swiper-pagination",
        },
      });
    }

    if (autoplay) {
      autoplayEl = createHTMLElement("swiper-autoplay-wrap", $templateHTML.autoplay());
      $target.querySelector(".swiper-wrapper").after(autoplayEl);
    }
  }

  function setupSelector() {
    $swiperPagination = ".swiper-pagination";
    $swiperNavigation = ".swiper-navigation";
    $swiperAutoplay = ".swiper-autoplay";
  }

  function setupElement() {
    // id

    // a11y

    // new Swiper 생성
    $swiper = new Swiper($target, { ...props });
  }

  function setupActions() {
    // actions.start = () => {
    //   play();
    // };
    //
    // actions.stop = () => {
    //   stop();
    // };
  }

  function setEvent() {
    // autoplay 버튼
    if (props.autoplay) {
      addEvent("click", $swiperAutoplay, (event) => {
        const $eventTarget = event.target.closest($swiperAutoplay);
        handleAutoplay($eventTarget);
      });
    }
  }

  function render() {
    // render
  }

  // autoplay 관련 커스텀 함수
  function handleAutoplay($target) {
    $target.classList.toggle("play");
    $target.classList.toggle("stop");

    if ($target.classList.contains("stop")) {
      stop();
    } else if ($target.classList.contains("play")) {
      play();
    }
  }

  function play() {
    $swiper.autoplay.start();
  }

  function stop() {
    $swiper.autoplay.stop();
  }

  // 특정 슬라이드로 이동
  function moveToSlide(index, speed, runCallbacks) {
    if (props.loop) {
      $swiper.slideToLoop(index, speed, runCallbacks);
    } else {
      $swiper.slideTo(index);
    }
  }

  component = {
    core: {
      state,
      props,
      init,
      removeEvent,
      destroy,
    },
    // callable
    update,
    getSwiperInstance() {
      return $swiper; // $swiper 인스턴스 반환
    },
  };

  return component;
}
;


/**
 * Skel
 * // init, setup, update, destroy
 * // setupTemplate, setupSelector, setupElement, setupActions,
 *      setEvent, render, customFn, callable
 */
function Tab() {
  const { actions, props, state, setProps, setState, setTarget, addEvent, removeEvent } = etUI.hooks.useCore(
    {
      // props
    },
    {
      // state
    },
    render,
  );

  // variable
  const name = "tab";
  // eslint-disable-next-line prefer-const
  let component = {};
  // element, selector
  let $target, tabHead, $tabHeadEl, tabBtn, $tabBtnEl, tabContent, $tabContentEl;

  {
    /**
     * init
     * @param _$target
     * @param _props
     */
    function init(_$target, _props) {
      if (typeof _$target === "string") {
        $target = document.querySelector(_$target);
      } else {
        $target = _$target;
      }

      if (!$target) {
        throw Error("target이 존재하지 않습니다.");
      }

      setTarget($target);
      setProps({ ...props, ..._props });

      if ($target.ui) return;
      $target.ui = component;

      setup();
      setEvent();

      $target.setAttribute("data-init", "true");
    }

    function setup() {
      setupTemplate();
      setupSelector();
      setupElement();
      setupActions();

      // effect
      props.sticky && stickyTab();

      // state
      setState({ activeValue: props.active ?? $tabBtnEl[0].getAttribute("data-tab-value") });
    }

    /**
     * update
     * @param _props
     */
    function update(_props) {
      if (_props && etUI.utils.shallowCompare(props, _props) && !$target.getAttribute("data-init")) return;
      destroy();

      setProps({ ...props, ..._props });
      setup();
      setEvent();
    }

    function destroy() {
      removeEvent();
      $target.ui = null;
      $target.removeAttribute("data-init");
    }
  }

  // frequency
  function setupTemplate() {
    // $target.innerHTML = ``;
  }

  function setupSelector() {
    // selector
    tabHead = ".tab-head";
    tabBtn = ".tab-label";
    tabContent = ".tab-content";

    // element
    $tabHeadEl = $target.querySelector(tabHead);
    $tabBtnEl = $target.querySelectorAll(tabBtn);
    $tabContentEl = $target.querySelectorAll(tabContent);
  }

  function setupElement() {
    // id
    // a11y
    etUI.utils.setProperty($target, tabHead, "role", "tablist");

    // component custom element
    $tabHeadEl.style.touchAction = "none";
    $tabBtnEl.forEach((tab, index) => {
      const tabBtnId = etUI.utils.getRandomUIID(name);
      const tabContentId = etUI.utils.getRandomUIID("tabpanel");

      tab.setAttribute("id", tabBtnId);
      tab.setAttribute("role", "tab");
      tab.setAttribute("aria-selected", false);

      if ($tabContentEl[index]) {
        $tabContentEl[index].setAttribute("id", tabContentId);
        $tabContentEl[index].setAttribute("role", "tabpanel");
      }

      const tabValue = tab.getAttribute("data-tab-value");
      const tabContentValue = $tabContentEl[index].getAttribute("data-tab-value");
      etUI.utils.setProperty($target, `${tabContent}[data-tab-value="${tabValue}"]`, "aria-labelledby", tab.id);
      etUI.utils.setProperty($target, `${tabBtn}[data-tab-value="${tabContentValue}"]`, "aria-controls", $tabContentEl[index].id);
    });
  }

  function setupActions() {
    let startX = 0;
    let endX = 0;
    let moveX = 0;
    let scrollLeft = 0;
    let isReadyMove = false;
    let clickable = true;

    actions.select = (e) => {
      e.stopPropagation();
      const targetBtn = e.target.closest(tabBtn);
      if (!targetBtn) return;
      if (!clickable) return;
      setState({ activeValue: targetBtn.getAttribute("data-tab-value") });
      gsap.to($tabHeadEl, {
        duration: 0.5,
        scrollLeft: targetBtn.offsetLeft,
        overwrite: true,
      });
    };

    actions.dragStart = (e) => {
      e.stopPropagation();
      if (isReadyMove) return;
      isReadyMove = true;
      startX = e.x;
      scrollLeft = $tabHeadEl.scrollLeft;
    };
    actions.dragMove = (e) => {
      e.stopPropagation();
      if (!isReadyMove) return;
      moveX = e.x;
      $tabHeadEl.scrollLeft = scrollLeft + (startX - moveX);
    };
    actions.dragEnd = (e) => {
      e.stopPropagation();
      if (!isReadyMove) return;
      endX = e.x;
      if (Math.abs(startX - endX) < 10) clickable = true;
      else clickable = false;
      isReadyMove = false;
    };
    actions.dragLeave = (e) => {
      e.stopPropagation();
      if (!isReadyMove) return;

      // gsap.to($tabHeadEl, {
      //   scrollLeft: $target.querySelector('[aria-selected="true"]').offsetLeft,
      //   overwrite: true,
      // });

      clickable = true;
      isReadyMove = false;
    };

    actions.up = (e) => {
      if (!e.target.previousElementSibling) return;
      setState({ activeValue: e.target.previousElementSibling.getAttribute("data-tab-value") });
      focusTargetValue(tabBtn, state.activeValue);
    };
    actions.down = (e) => {
      if (!e.target.nextElementSibling) return;
      setState({ activeValue: e.target.nextElementSibling.getAttribute("data-tab-value") });
      focusTargetValue(tabBtn, state.activeValue);
    };
    actions.first = () => {
      setState({ activeValue: $tabBtnEl[0].getAttribute("data-tab-value") });
      focusTargetValue(tabBtn, state.activeValue);
    };
    actions.last = () => {
      setState({ activeValue: $tabBtnEl[$tabBtnEl.length - 1].getAttribute("data-tab-value") });
      focusTargetValue(tabBtn, state.activeValue);
    };

    function focusTargetValue(el, value) {
      const focusTarget = $target.querySelector(`${el}[data-tab-value="${value}"]`);
      focusTarget?.focus();
    }
  }

  function setEvent() {
    const actionList = {
      up: ["ArrowLeft"],
      down: ["ArrowRight"],
      first: ["Home"],
      last: ["End"],
      select: ["Enter", " "],
    };

    addEvent("click", tabHead, actions.select);
    addEvent("pointerdown", tabHead, actions.dragStart);
    addEvent("pointermove", tabHead, actions.dragMove);
    addEvent("pointerup", tabHead, actions.dragEnd);
    addEvent("pointerleave", tabHead, actions.dragLeave);

    addEvent("keydown", tabHead, (e) => {
      const { key } = e;
      const action = Object.entries(actionList).find(([_, keys]) => keys.includes(key));

      if (action) {
        e.preventDefault();
        e.stopPropagation();
        const [actionName] = action;
        actions[actionName]?.(e);
      }
    });
  }

  function render() {
    const getId = $target.querySelector(`${tabBtn}[aria-selected="true"]`)?.id;

    etUI.utils.setProperty($target, '[aria-selected="true"]', "aria-selected", false);
    etUI.utils.setProperty($target, `${tabBtn}[data-tab-value="${state.activeValue}"]`, "aria-selected", true);

    $target.querySelector(`${tabContent}[aria-labelledby="${getId}"]`)?.classList.remove("show");
    $target.querySelector(`${tabContent}[data-tab-value="${state.activeValue}"]`)?.classList.add("show");
  }

  // custom
  function stickyTab() {
    const { bottom } = etUI.hooks.useGetClientRect(document, props.sticky);

    $target.style.position = "relative";
    $tabHeadEl.style.position = "sticky";
    if (!bottom) $tabHeadEl.style.top = 0 + "px";
    else $tabHeadEl.style.top = bottom + "px";
  }

  component = {
    core: {
      state,
      props,
      init,
      removeEvent,
      destroy,
    },
    update,
  };

  return component;
}

/*
document.addEventListener("DOMContentLoaded", function () {
  const $tabBox = document.querySelectorAll('[data-component="tab"]');
  $tabBox.forEach((tabBox) => {
    const tab = Tab();
    tab.core.init(tabBox);
  });
});
*/
;


// props는 유저(작업자)가 정의할 수 있는 옵션
// state는 내부 로직에서 작동되는 로직 (ex: state open close aria 등등.... )

// 타입 정의

/**
 * @typedef {Object} TooltipPropsConfig
 * @property {boolean} disabled - 요소가 비활성화 상태인지를 나타냅니다.
 * @property {boolean} once - 이벤트나 액션을 한 번만 실행할지 여부를 결정합니다.
 * @property {false | number} duration - 애니메이션 또는 이벤트 지속 시간을 밀리초 단위로 설정합니다. 'false'일 경우 지속 시간을 무시합니다.
 * @property {Object} origin - 원점 또는 시작 지점을 나타내는 객체입니다.
 */

/**
 * @typedef {Object} TooltipStateConfig
 * @property {'close' | 'open'} state - 툴팁의 상태값. close, open 둘 중에 하나입니다.
 * @property {'bottom' | 'top' | 'left' | 'right'} position - 툴팁의 위치값. bottom, top, left, right 중에 하나입니다.
 */

function Tooltip() {
  const {
    props, state, setProps, setState, setTarget, addEvent, removeEvent
  } = etUI.hooks.useCore({

  }, {

  }, render);

  // state 변경 시 랜더 재호출
  const name = 'tooltip';
  let component = {};
    /** @type {TooltipPropsConfig} */
    /** @type {TooltipStateConfig} */
    // 요소관련 변수들
  let $target,
    $tooltipTriggerBtn,
    $tooltipCloseBtn,
    $tooltipContainer;

  {
    /**
     * init
     * @param _$target
     * @param _props
     */
    function init(_$target, _props) {
      if (typeof _$target === 'string') {
        $target = document.querySelector(_$target);
      } else {
        $target = _$target;
      }

      if (!$target) {
        throw Error('target이 존재하지 않습니다.');
      }

      setTarget($target);
      setProps({ ...props, ..._props });

      if ($target.ui) return;
      $target.ui = this;

      setup();
      setEvent();

      $target.setAttribute('data-init', 'true');
    }

    function setup() {
      setupSelector();
      setupElement();

      // focus trap
      focusTrapInstance = focusTrap.createFocusTrap($target, {
        onActivate: () => {},
        onDeactivate: () => {
          close();
        },
      });

      // state
      setState({ state: props.state });
    }

    /**
     * update
     * @param _props
     */
    function update(_props) {
      if (_props && etUI.utils.shallowCompare(props, _props) && !$target.getAttribute('data-init')) return;
      destroy();

      setProps({ ...props, ..._props });
      setup();
      setEvent();
    }

    function destroy() {
      removeEvent();
    }
  }

  // frequency
  function setupSelector() {
    // element
    $tooltipContainer = $target.querySelector('.tooltip-container');

    // selecotr
    $tooltipTriggerBtn = '.tooltip-btn';
    $tooltipCloseBtn = '.btn-close';
  }

  function setupElement() {
    // set id
    const id = etUI.utils.getRandomUIID(name);
    const titleId = etUI.utils.getRandomUIID(name + '-tit');

    // a11y
    $target.setAttribute('id', id);
    $target.setAttribute('aria-expanded', 'false');
    $target.setAttribute('aria-controls', titleId);
  }

  function setEvent() {
    addEvent('click', $tooltipTriggerBtn, open);
    addEvent('click', $tooltipCloseBtn, close);
  }

  function render() {
    const { type } = props;
    const isShow = state.state === 'open';
    const expanded = $tooltipContainer.getAttribute('aria-expanded') === 'true';
    const $closeBtn = $target.querySelector($tooltipCloseBtn);

    $tooltipContainer.setAttribute('aria-expanded', !expanded);
    $tooltipContainer.setAttribute('aria-hidden', expanded);
    if (isShow) {
      handleOpenAnimation(type);
      $closeBtn.focus();
    } else {
      handleCloseAnimation(type);
      $closeBtn.setAttribute('aria-expanded', 'false');
      $tooltipContainer.setAttribute('aria-hidden', 'true');
    }
  }

  function handleOpenAnimation(type) {
    const setAnimation = { duration: 0, display: 'none', opacity: 0 };
    const scale = props.transform.scale.x;
    if (type === 'default') {
      gsap.timeline().to($tooltipContainer, setAnimation).to($tooltipContainer, { duration: props.duration, display: 'block', opacity: 1 });
    }

    if (type === 'custom') {
      gsap.timeline().to($tooltipContainer, setAnimation).to($tooltipContainer, { duration: props.duration, scale: 1, display: 'block', opacity: 1 });
    }
  }

  function handleCloseAnimation(type) {
    const scale = props.transform.scale.x;
    if (type === 'default') {
      gsap.timeline().to($tooltipContainer, { duration: props.duration, display: 'none', opacity: 0 });
    }
    if (type === 'custom') {
      gsap.timeline().to($tooltipContainer, { duration: props.duration, scale: scale, display: 'none', opacity: 0 });
    }
  }

  function open() {
    if (state.state !== 'open') {
      setState({ state: 'open' });
    }
  }

  function close() {
    if (state.state !== 'close') {
      setState({ state: 'close' });
    }
  }

  component = {
    core: {
      init,
      destroy,
      removeEvent,
    },

    update,
    open,
    close,
  }

  return component;
}

// document.addEventListener("DOMContentLoaded", function () {
//   const $tooltipSelector = document?.querySelectorAll(".component-tooltip");
//   $tooltipSelector.forEach((tooltip) => {
//     const tooltipComponent = Tooltip();
//     tooltipComponent.init(tooltip);
//   });
// });

// 기타 옵션들...
// duration: 300,
// height: 200,
// transform: {
//   scale: {
//     x: 1,
//     y: 1,
//   },
//   translate: {
//     x: 0,
//     y: 90,
//   },
//   delay: 0,
//   easeing: "ease-out",
// },

/**
 * Skel
 * // init, setup, update, addEvent, removeEvent, destroy
 * // template, setupSelector, setupElement, setEvent, render, customFn, callable
 */
;


;


// init js
function initUI() {
  const componentList = [
    {
      selector: ".component-modal",
      fn: etUI.components.Modal,
    },
    {
      selector: ".component-accordion",
      fn: etUI.components.Accordion,
    },
    {
      selector: ".component-tooltip",
      fn: etUI.components.Tooltip,
    },
    {
      selector: '[data-component="tab"]',
      fn: etUI.components.Tab,
    },
    {
      selector: '[data-component="select-box"]',
      fn: etUI.components.SelectBox,
    },
    {
      selector: '[data-component="swiper"]',
      fn: etUI.components.SwiperComp,
    },
  ];

  componentList.forEach(({ selector, fn }) => {
    // console.log(fn);
    document.querySelectorAll(selector).forEach((el) => {
      if (el.dataset.init) {
        return;
      }

      const component = new fn();
      component.core.init(el, {}, selector);
    });
  });

  etUI.dialog = etUI.hooks.useDialog();
}

etUI.initUI = initUI;

(function autoInit() {
  const $scriptBlock = document.querySelector("[data-init]");
  if ($scriptBlock) {
    document.addEventListener("DOMContentLoaded", function () {
      initUI();
    });
  }
})();

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNldHVwLmpzIiwidXRpbHMvYXJyYXkuanMiLCJ1dGlscy9ib29sZWFuLmpzIiwidXRpbHMvZGF0ZS5qcyIsInV0aWxzL2RvbS5qcyIsInV0aWxzL21hdGguanMiLCJ1dGlscy9vYmplY3QuanMiLCJ1dGlscy9zdHJpbmcuanMiLCJ1dGlscy9pbmRleC5janMiLCJob29rcy91c2VDbGlja091dHNpZGUuanMiLCJob29rcy91c2VDb3JlLmpzIiwiaG9va3MvdXNlRGF0YXNldC5qcyIsImhvb2tzL3VzZURpYWxvZy5qcyIsImhvb2tzL3VzZURpYWxvZ1RtcGwuanMiLCJob29rcy91c2VFdmVudExpc3RlbmVyLmpzIiwiaG9va3MvdXNlR2V0Q2xpZW50UmVjdC5qcyIsImhvb2tzL3VzZUxheWVyLmpzIiwiaG9va3MvdXNlTXV0YXRpb25TdGF0ZS5qcyIsImhvb2tzL3VzZVNlbGVjdEJveFRtcGwuanMiLCJob29rcy91c2VTdGF0ZS5qcyIsImhvb2tzL3VzZVN3aXBlclRtcGwuanMiLCJob29rcy91c2VUcmFuc2l0aW9uLmpzIiwiaG9va3MvaW5kZXguY2pzIiwiY29tcG9uZW50cy9BY2NvcmRpb24uanMiLCJjb21wb25lbnRzL0RpYWxvZy5qcyIsImNvbXBvbmVudHMvTW9kYWwuanMiLCJjb21wb25lbnRzL1NlbGVjdGJveC5qcyIsImNvbXBvbmVudHMvU2tlbC5qcyIsImNvbXBvbmVudHMvU3dpcGVyLmpzIiwiY29tcG9uZW50cy9UYWIuanMiLCJjb21wb25lbnRzL1Rvb2x0aXAuanMiLCJjb21wb25lbnRzL2luZGV4LmNqcyIsImluaXQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBOzs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ1JBO0FBQ0E7OztBQ0RBO0FBQ0E7OztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDMUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ3ZEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUN4R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQzdGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUMzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDakRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNoRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQzVEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDdkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDdk9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUN6U0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUN2TkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDbFVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDaktBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDN05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDelJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDaE9BOzs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJhc3NldHMvc2NyaXB0cy9jb21tb24udWkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBldFVJID0ge31cclxud2luZG93LmV0VUkgPSBldFVJXHJcbiIsIi8qKlxyXG4gKiBDaGVjayBpZiB0aGUgdmFsdWUgaXMgYW4gYXJyYXlcclxuICogQHBhcmFtIHZhbHVlIHthbnl9XHJcbiAqIEByZXR1cm5zIHthcmcgaXMgYW55W119XHJcbiAqL1xyXG5mdW5jdGlvbiBpc0FycmF5KHZhbHVlKSB7XHJcbiAgcmV0dXJuIEFycmF5LmlzQXJyYXkodmFsdWUpO1xyXG59XHJcbiIsIi8vIGJvb2xlYW4g6rSA66CoIOq4sOuKpVxyXG4iLCIvLyDrgqDsp5wg6rSA66CoIOq4sOuKpVxyXG4iLCIvLyBleCkgc3RyaW5nIHRvIHF1ZXJ5U2VsZWN0b3IgY29udmVydCBsb2dpY1xyXG5cclxuLyoqXHJcbiAqIOq4sOuKpSDshKTrqoUg65Ok7Ja06rCQXHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqIHNldCBhdHRyaWJ1dGVcclxuICogQHBhcmFtIHsgRWxlbWVudCB9IHBhcmVudFxyXG4gKiBAcGFyYW0gb3B0c1xyXG4gKi9cclxuZnVuY3Rpb24gc2V0UHJvcGVydHkocGFyZW50LCAuLi5vcHRzKSB7XHJcbiAgaWYob3B0cy5sZW5ndGggPT09IDIpe1xyXG4gICAgY29uc3QgW3Byb3BlcnR5LCB2YWx1ZV0gPSBvcHRzO1xyXG5cclxuICAgIHBhcmVudD8uc2V0QXR0cmlidXRlKHByb3BlcnR5LCB2YWx1ZSk7XHJcbiAgfWVsc2UgaWYob3B0cy5sZW5ndGggPT09IDMpe1xyXG4gICAgY29uc3QgW3NlbGVjdG9yLCBwcm9wZXJ0eSwgdmFsdWVdID0gb3B0cztcclxuXHJcbiAgICBwYXJlbnQucXVlcnlTZWxlY3RvcihzZWxlY3Rvcik/LnNldEF0dHJpYnV0ZShwcm9wZXJ0eSwgdmFsdWUpO1xyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIGdldCBhdHRyaWJ1dGVcclxuICogQHBhcmFtIHsgRWxlbWVudCB9IHBhcmVudFxyXG4gKiBAcGFyYW0geyBTdHJpbmcgfSBzZWxlY3RvclxyXG4gKiBAcGFyYW0geyBTdHJpbmcgfSBwcm9wZXJ0eVxyXG4gKi9cclxuZnVuY3Rpb24gZ2V0UHJvcGVydHkocGFyZW50LCBzZWxlY3RvciwgcHJvcGVydHkpIHtcclxuICBwYXJlbnQucXVlcnlTZWxlY3RvcihzZWxlY3Rvcik/LmdldEF0dHJpYnV0ZShwcm9wZXJ0eSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBzZXQgc3R5bGVcclxuICogQHBhcmFtIHsgRWxlbWVudCB9IHBhcmVudFxyXG4gKiBAcGFyYW0geyBTdHJpbmcgfSBzZWxlY3RvclxyXG4gKiBAcGFyYW0geyBTdHJpbmcgfSBwcm9wZXJ0eVxyXG4gKiBAcGFyYW0geyBhbnkgfSB2YWx1ZVxyXG4gKi9cclxuZnVuY3Rpb24gc2V0U3R5bGUocGFyZW50LCBzZWxlY3RvciwgcHJvcGVydHksIHZhbHVlKSB7XHJcbiAgaWYgKHBhcmVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKSkge1xyXG4gICAgcGFyZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpLnN0eWxlW3Byb3BlcnR5XSA9IHZhbHVlO1xyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIGdzYXDsnZggU3BsaXRUZXh066W8IO2ZnOyaqe2VmOyXrCDrrLjsnpDrpbwg67aE66as7ZWY7JesIOuniOyKpO2BrCDqsIDriqXtlZjqsowg7ZW07KSA64ukLlxyXG4gKiBAcGFyYW0gc2VsZWN0b3IgIHtzdHJpbmd9XHJcbiAqIEBwYXJhbSB0eXBlICB7J2xpbmVzJ3wnd29yZHMnfCdjaGFycyd9XHJcbiAqIEByZXR1cm5zIFtIVE1MRWxlbWVudFtdLCBIVE1MRWxlbWVudFtdXVxyXG4gKi9cclxuZnVuY3Rpb24gc3BsaXRUZXh0TWFzayhzZWxlY3RvciwgdHlwZSA9ICdsaW5lcycpe1xyXG4gIGZ1bmN0aW9uIHdyYXAoZWwsIHdyYXBwZXIpIHtcclxuICAgIGVsLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKHdyYXBwZXIsIGVsKTtcclxuICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQoZWwpO1xyXG4gIH1cclxuXHJcbiAgY29uc3QgJHF1b3RlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3RvciksXHJcbiAgICBteVNwbGl0VGV4dCA9IG5ldyBTcGxpdFRleHQoJHF1b3RlLCB7dHlwZX0pXHJcblxyXG4gIGNvbnN0ICRzcGxpdHRlZCA9IG15U3BsaXRUZXh0W3R5cGVdO1xyXG4gIGNvbnN0ICRsaW5lV3JhcCA9IFtdO1xyXG4gICRzcGxpdHRlZC5mb3JFYWNoKCgkZWwsIGluZGV4KSA9PiB7XHJcbiAgICBjb25zdCAkZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAkZGl2LnN0eWxlLm92ZXJmbG93ID0gJ2hpZGRlbic7XHJcbiAgICAkZGl2LnN0eWxlLnBvc2l0aW9uID0gJ3JlbGF0aXZlJztcclxuICAgICRkaXYuc3R5bGUuZGlzcGxheSA9ICdpbmxpbmUtYmxvY2snO1xyXG4gICAgd3JhcCgkZWwsICRkaXYpO1xyXG4gICAgJGxpbmVXcmFwLnB1c2goJGRpdik7XHJcbiAgfSlcclxuXHJcbiAgcmV0dXJuIFskc3BsaXR0ZWQsICRsaW5lV3JhcF1cclxufVxyXG4iLCIvLyDsl7DsgrAg6rSA66CoICjsnpDro4ztmJVOdW1iZXIgKyBudW1iZXIpXHJcbmZ1bmN0aW9uIGdldEJsZW5kT3BhY2l0eShvcGFjaXR5LCBsZW5ndGgpIHtcclxuICBpZihsZW5ndGggPT09IDEpe1xyXG4gICAgcmV0dXJuIG9wYWNpdHlcclxuICB9XHJcblxyXG4gIHJldHVybiAxIC0gTWF0aC5wb3coMSAtIG9wYWNpdHksIDEvbGVuZ3RoKVxyXG59XHJcbiIsIi8vIG9iamVjdCDqtIDroKgg6riw64qlXHJcblxyXG4vKipcclxuICogY29tcGFyZSBvYmpcclxuICogQHBhcmFtIHsgT2JqZWN0IH0gb2JqMVxyXG4gKiBAcGFyYW0geyBPYmplY3QgfSBvYmoyXHJcbiAqIEByZXR1cm5zIEJvb2xlYW5cclxuICovXHJcbmZ1bmN0aW9uIHNoYWxsb3dDb21wYXJlKG9iajEsIG9iajIpIHtcclxuICBjb25zdCBrZXlzID0gWy4uLk9iamVjdC5rZXlzKG9iajEpLCBPYmplY3Qua2V5cyhvYmoyKV07XHJcblxyXG4gIGZvciAoY29uc3Qga2V5IG9mIGtleXMpIHtcclxuICAgIGlmICh0eXBlb2Ygb2JqMVtrZXldID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBvYmoyW2tleV0gPT09IFwib2JqZWN0XCIpIHtcclxuICAgICAgaWYgKCFldFVJLnV0aWxzLnNoYWxsb3dDb21wYXJlKG9iajFba2V5XSwgb2JqMltrZXldKSkge1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgY29uc3Qgcm9sZSA9ICFvYmoyW2tleV0gfHwgdHlwZW9mIG9iajFba2V5XSA9PT0gXCJmdW5jdGlvblwiO1xyXG4gICAgICBpZiAoIXJvbGUgJiYgb2JqMVtrZXldICE9PSBvYmoyW2tleV0pIHtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIHRydWU7XHJcbn1cclxuIiwiLyoqXHJcbiAqIFJldmVyc2UgYSBzdHJpbmdcclxuICogQHBhcmFtIHN0ciB7c3RyaW5nfVxyXG4gKiBAcmV0dXJucyB7c3RyaW5nfVxyXG4gKi9cclxuZnVuY3Rpb24gcmV2ZXJzZVN0cmluZyhzdHIpIHtcclxuICByZXR1cm4gc3RyLnNwbGl0KCcnKS5yZXZlcnNlKCkuam9pbignJyk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBHZXQgYSByYW5kb20gaWRcclxuICogQHJldHVybnMge3N0cmluZ31cclxuICovXHJcbmZ1bmN0aW9uIGdldFJhbmRvbUlkKCkge1xyXG4gIHJldHVybiBNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKDM2KS5zdWJzdHJpbmcoMik7XHJcbn1cclxuXHJcbi8qKlxyXG4gKlxyXG4gKiBAcGFyYW0gcHJlZml4XHJcbiAqIEByZXR1cm5zIHtzdHJpbmd9XHJcbiAqL1xyXG5mdW5jdGlvbiBnZXRSYW5kb21VSUlEKHByZWZpeCA9ICd1aScpIHtcclxuICByZXR1cm4gYCR7cHJlZml4fS0ke2dldFJhbmRvbUlkKCl9YDtcclxufVxyXG5cclxuLyoqXHJcbiAqIOyyq+q4gOyekOunjCDrjIDrrLjsnpDroZwg67OA7ZmYXHJcbiAqIEBwYXJhbSB3b3JkXHJcbiAqIEByZXR1cm5zIHtzdHJpbmd9XHJcbiAqL1xyXG5mdW5jdGlvbiBjYXBpdGFsaXplKHdvcmQpIHtcclxuICByZXR1cm4gd29yZC5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHdvcmQuc2xpY2UoMSlcclxufVxyXG5cclxuLyoqXHJcbiAqIOyyq+q4gOyekOunjCDshozrrLjsnpDroZwg67OA7ZmYXHJcbiAqIEBwYXJhbSB3b3JkXHJcbiAqIEByZXR1cm5zIHtzdHJpbmd9XHJcbiAqL1xyXG5mdW5jdGlvbiB1bmNhcGl0YWxpemUod29yZCkge1xyXG4gIHJldHVybiB3b3JkLmNoYXJBdCgwKS50b0xvd2VyQ2FzZSgpICsgd29yZC5zbGljZSgxKVxyXG59XHJcblxyXG5mdW5jdGlvbiBhZGRQcmVmaXhDYW1lbFN0cmluZyhzdHIsIHByZWZpeCl7XHJcbiAgLy8gZGltbUNsaWNrID0+IHByb3BzRGltbUNsaWNrXHJcbiAgcmV0dXJuIHByZWZpeCArIGV0VUkudXRpbHMuY2FwaXRhbGl6ZShzdHIpXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlbW92ZVByZWZpeENhbWVsU3RyaW5nKHN0ciwgcHJlZml4KXtcclxuICBjb25zdCByZWdFeHAgPSBuZXcgUmVnRXhwKGBeJHtwcmVmaXh9YCwgJ2cnKVxyXG4gIHJldHVybiBldFVJLnV0aWxzLnVuY2FwaXRhbGl6ZShzdHIucmVwbGFjZUFsbChyZWdFeHAsICcnKSlcclxuXHJcbn1cclxuXHJcbiIsIlxuZXRVSS51dGlscyA9IHtcblx0aXNBcnJheSxcblx0c2V0UHJvcGVydHksXG5cdGdldFByb3BlcnR5LFxuXHRzZXRTdHlsZSxcblx0c3BsaXRUZXh0TWFzayxcblx0Z2V0QmxlbmRPcGFjaXR5LFxuXHRzaGFsbG93Q29tcGFyZSxcblx0cmV2ZXJzZVN0cmluZyxcblx0Z2V0UmFuZG9tSWQsXG5cdGdldFJhbmRvbVVJSUQsXG5cdGNhcGl0YWxpemUsXG5cdHVuY2FwaXRhbGl6ZSxcblx0YWRkUHJlZml4Q2FtZWxTdHJpbmcsXG5cdHJlbW92ZVByZWZpeENhbWVsU3RyaW5nXG59XG4iLCIvKipcclxuICogdGFyZ2V0KeydmCDsmbjrtoDrpbwg7YG066at7ZaI7J2EIOuVjCDsvZzrsLEg7ZWo7IiY66W8IOyLpO2WiVxyXG4gKiDsmIjsmbjsoIHsnLzroZwg7YG066at7J2EIO2XiOyaqe2VoCDsmpTshozrk6TsnZgg7ISg7YOd7J6Q66W8IO2PrO2VqO2VmOuKlCDrsLDsl7TsnYQg7Ji17IWY7Jy866GcIOuwm+ydhCDsiJgg7J6I7Iq164uI64ukLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0VsZW1lbnR9IHRhcmdldCAtIO2BtOumrSDsnbTrsqTtirjsnZgg7Jm467aAIO2BtOumrSDqsJDsp4Drpbwg7IiY7ZaJ7ZWgIOuMgOyDgSBET00g7JqU7IaM7J6F64uI64ukLijtlYTsiJgpXHJcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIC0g7Jm467aAIO2BtOumreydtCDqsJDsp4DrkJjsl4jsnYQg65WMIOyLpO2Wie2VoCDsvZzrsLEg7ZWo7IiY7J6F64uI64ukLijtlYTsiJgpXHJcbiAqIEBwYXJhbSB7QXJyYXk8c3RyaW5nPn0gZXhjZXB0aW9ucyAtIOyZuOu2gCDtgbTrpq0g6rCQ7KeA7JeQ7IScIOyYiOyZuCDsspjrpqztlaAg7JqU7IaM65Ok7J2YIOyEoO2DneyekOulvCDtj6ztlajtlZjripQg67Cw7Je07J6F64uI64ukLijsmLXshZgpXHJcbiAqL1xyXG5cclxuLy8gYmx1ciDrj4Qg7Je865GQXHJcbmZ1bmN0aW9uIHVzZUNsaWNrT3V0c2lkZSh0YXJnZXQsIGNhbGxiYWNrLCBleGNlcHRpb25zID0gW10pIHtcclxuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGV2ZW50KSA9PiB7XHJcbiAgICBsZXQgaXNDbGlja0luc2lkZUV4Y2VwdGlvbiA9IGV4Y2VwdGlvbnMuc29tZSgoc2VsZWN0b3IpID0+IHtcclxuICAgICAgY29uc3QgZXhjZXB0aW9uRWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpO1xyXG4gICAgICByZXR1cm4gZXhjZXB0aW9uRWxlbWVudCAmJiBleGNlcHRpb25FbGVtZW50LmNvbnRhaW5zKGV2ZW50LnRhcmdldCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBpZiAoIXRhcmdldC5jb250YWlucyhldmVudC50YXJnZXQpICYmICFpc0NsaWNrSW5zaWRlRXhjZXB0aW9uKSB7XHJcbiAgICAgIGNhbGxiYWNrKHRhcmdldCk7XHJcbiAgICB9XHJcbiAgfSk7XHJcbn1cclxuXHJcbi8vIOu2gOuqqCDsmpTshozripQgcGFyZW50c1xyXG4vLyDshKDtg50g7JqUXHJcbiIsImZ1bmN0aW9uIHVzZUNvcmUoXHJcbiAgaW5pdGlhbFByb3BzID0ge30sXHJcbiAgaW5pdGlhbFZhbHVlID0ge30sXHJcbiAgcmVuZGVyLFxyXG4gIG9wdGlvbnMgPSB7XHJcbiAgICBkYXRhc2V0OiB0cnVlXHJcbn0pIHtcclxuICBjb25zdCBhY3Rpb25zID0ge307XHJcbiAgbGV0ICR0YXJnZXQ7XHJcbiAgY29uc3QgY2xlYW51cHMgPSBbXTtcclxuICBjb25zdCBOT19CVUJCTElOR19FVkVOVFMgPSBbXHJcbiAgICAnYmx1cicsXHJcbiAgICAnZm9jdXMnLFxyXG4gICAgJ2ZvY3VzaW4nLFxyXG4gICAgJ2ZvY3Vzb3V0JyxcclxuICAgICdwb2ludGVybGVhdmUnXHJcbiAgXTtcclxuXHJcbiAgY29uc3QgcHJvcHMgPSBuZXcgUHJveHkoaW5pdGlhbFByb3BzLCB7XHJcbiAgICBzZXQ6ICh0YXJnZXQsIGtleSwgdmFsdWUpID0+IHtcclxuICAgICAgUmVmbGVjdC5zZXQodGFyZ2V0LCBrZXksIHZhbHVlKTtcclxuICAgIH1cclxuICB9KTtcclxuXHJcbiAgY29uc3Qgc3RhdGUgPSBuZXcgUHJveHkoaW5pdGlhbFZhbHVlLCB7XHJcbiAgICBzZXQ6ICh0YXJnZXQsIGtleSwgdmFsdWUpID0+IHtcclxuICAgICAgUmVmbGVjdC5zZXQodGFyZ2V0LCBrZXksIHZhbHVlKTtcclxuICAgIH0sXHJcbiAgfSk7XHJcblxyXG4gIGZ1bmN0aW9uIHNldFRhcmdldChfJHRhcmdldCkge1xyXG4gICAgJHRhcmdldCA9IF8kdGFyZ2V0O1xyXG5cclxuICAgIGlmKG9wdGlvbnMuZGF0YXNldCl7XHJcbiAgICAgIGNvbnN0IHsgZ2V0UHJvcHNGcm9tRGF0YXNldCB9ID0gZXRVSS5ob29rcy51c2VEYXRhc2V0KCR0YXJnZXQpO1xyXG4gICAgICBjb25zdCBkYXRhc2V0UHJvcHMgPSBnZXRQcm9wc0Zyb21EYXRhc2V0KCk7XHJcblxyXG4gICAgICBzZXRQcm9wcyh7IC4uLnByb3BzLCAuLi5kYXRhc2V0UHJvcHMgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBzZXRQcm9wcyhuZXdQcm9wcykge1xyXG4gICAgT2JqZWN0LmtleXMobmV3UHJvcHMpLmZvckVhY2goKGtleSkgPT4ge1xyXG4gICAgICBwcm9wc1trZXldID0gbmV3UHJvcHNba2V5XTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gc2V0U3RhdGUobmV3U3RhdGUpIHtcclxuICAgIGlmKGV0VUkudXRpbHMuc2hhbGxvd0NvbXBhcmUoc3RhdGUsIG5ld1N0YXRlKSkgcmV0dXJuO1xyXG5cclxuICAgIE9iamVjdC5rZXlzKG5ld1N0YXRlKS5mb3JFYWNoKChrZXkpID0+IHtcclxuICAgICAgc3RhdGVba2V5XSA9IG5ld1N0YXRlW2tleV07XHJcbiAgICB9KTtcclxuXHJcbiAgICBpZiAocmVuZGVyKSB7XHJcbiAgICAgIHJlbmRlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChvcHRpb25zLmRhdGFzZXQpIHtcclxuICAgICAgY29uc3QgeyBzZXRWYXJzRnJvbURhdGFzZXQgfSA9IGV0VUkuaG9va3MudXNlRGF0YXNldCgkdGFyZ2V0KTtcclxuICAgICAgc2V0VmFyc0Zyb21EYXRhc2V0KHN0YXRlKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGFkZEV2ZW50KGV2ZW50VHlwZSwgc2VsZWN0b3IsIGNhbGxiYWNrKSB7XHJcbiAgICBjb25zdCAkZXZlbnRUYXJnZXQgPSBzZWxlY3RvciA/ICR0YXJnZXQucXVlcnlTZWxlY3RvcihzZWxlY3RvcikgOiAkdGFyZ2V0O1xyXG5cclxuICAgIGlmIChOT19CVUJCTElOR19FVkVOVFMuaW5jbHVkZXMoZXZlbnRUeXBlKSkge1xyXG4gICAgICBjb25zdCBjbGVhbnVwID0gZXRVSS5ob29rcy51c2VFdmVudExpc3RlbmVyKCRldmVudFRhcmdldCwgZXZlbnRUeXBlLCBjYWxsYmFjayk7XHJcbiAgICAgIHJldHVybiBjbGVhbnVwcy5wdXNoKGNsZWFudXApO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGV2ZW50SGFuZGxlciA9IChldmVudCkgPT4ge1xyXG4gICAgICBsZXQgJGV2ZW50VGFyZ2V0ID0gZXZlbnQudGFyZ2V0LmNsb3Nlc3Qoc2VsZWN0b3IpO1xyXG5cclxuICAgICAgaWYgKCFzZWxlY3Rvcikge1xyXG4gICAgICAgICRldmVudFRhcmdldCA9IGV2ZW50LnRhcmdldDtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKCRldmVudFRhcmdldCkge1xyXG4gICAgICAgIGNhbGxiYWNrKGV2ZW50KTtcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICAkdGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnRUeXBlLCBldmVudEhhbmRsZXIpO1xyXG4gICAgY29uc3QgY2xlYW51cCA9ICgpID0+ICR0YXJnZXQucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudFR5cGUsIGV2ZW50SGFuZGxlcik7XHJcbiAgICBjbGVhbnVwcy5wdXNoKGNsZWFudXApO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gcmVtb3ZlRXZlbnQoKSB7XHJcbiAgICBjbGVhbnVwcy5mb3JFYWNoKChjbGVhbnVwKSA9PiBjbGVhbnVwKCkpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIHNldFRhcmdldCxcclxuICAgIGFjdGlvbnMsXHJcbiAgICBzdGF0ZSxcclxuICAgIHByb3BzLFxyXG4gICAgc2V0U3RhdGUsXHJcbiAgICBzZXRQcm9wcyxcclxuICAgIGFkZEV2ZW50LFxyXG4gICAgcmVtb3ZlRXZlbnQsXHJcbiAgfTtcclxufVxyXG4iLCIvKipcclxuICogdXNlRGF0YXNldFxyXG4gKiBAcGFyYW0gJHRhcmdldCB7SFRNTEVsZW1lbnR9XHJcbiAqL1xyXG5mdW5jdGlvbiB1c2VEYXRhc2V0KCR0YXJnZXQpIHtcclxuICBsZXQgZGF0YXNldFByb3BzID0ge30sXHJcbiAgICBkYXRhc2V0VmFycyA9IHt9O1xyXG5cclxuICBmdW5jdGlvbiBnZXREYXRhc2V0QnlQcmVmaXgocHJlZml4KSB7XHJcbiAgICBjb25zdCBkYXRhc2V0ID0ge307XHJcbiAgICBPYmplY3Qua2V5cygkdGFyZ2V0LmRhdGFzZXQpLmZvckVhY2goKGtleSkgPT4ge1xyXG4gICAgICBsZXQgdmFsdWUgPSAkdGFyZ2V0LmRhdGFzZXRba2V5XTtcclxuXHJcbiAgICAgIGlmICh2YWx1ZSA9PT0gJ3RydWUnKSB7XHJcbiAgICAgICAgdmFsdWUgPSB0cnVlO1xyXG4gICAgICB9IGVsc2UgaWYgKHZhbHVlID09PSAnZmFsc2UnKSB7XHJcbiAgICAgICAgdmFsdWUgPSBmYWxzZTtcclxuICAgICAgfSBlbHNlIGlmKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycgJiYgdmFsdWUuaW5jbHVkZXMoJ3snKSl7XHJcbiAgICAgICAgdmFsdWUgPSBKU09OLnBhcnNlKHZhbHVlKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgZGF0YXNldFtldFVJLnV0aWxzLnJlbW92ZVByZWZpeENhbWVsU3RyaW5nKGtleSwgcHJlZml4KV0gPSB2YWx1ZTtcclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiBkYXRhc2V0O1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gZ2V0RGF0YXNldEV4Y2VwdFByZWZpeChwcmVmaXgpIHtcclxuICAgIGNvbnN0IGRhdGFzZXQgPSB7fTtcclxuICAgIE9iamVjdC5rZXlzKCR0YXJnZXQuZGF0YXNldCkuZm9yRWFjaCgoa2V5KSA9PiB7XHJcbiAgICAgIGxldCB2YWx1ZSA9ICR0YXJnZXQuZGF0YXNldFtrZXldO1xyXG5cclxuICAgICAgaWYgKHZhbHVlID09PSAndHJ1ZScpIHtcclxuICAgICAgICB2YWx1ZSA9IHRydWU7XHJcbiAgICAgIH0gZWxzZSBpZiAodmFsdWUgPT09ICdmYWxzZScpIHtcclxuICAgICAgICB2YWx1ZSA9IGZhbHNlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBkYXRhc2V0W2V0VUkudXRpbHMucmVtb3ZlUHJlZml4Q2FtZWxTdHJpbmcoa2V5LCBwcmVmaXgpXSA9IHZhbHVlO1xyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIGRhdGFzZXQ7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBzZXREYXRhc2V0QnlQcmVmaXgoZGF0YSwgcHJlZml4KSB7XHJcbiAgICBPYmplY3Qua2V5cyhkYXRhKS5mb3JFYWNoKChrZXkpID0+IHtcclxuICAgICAgaWYocHJlZml4KXtcclxuICAgICAgICAkdGFyZ2V0LmRhdGFzZXRbYCR7cHJlZml4fSR7ZXRVSS51dGlscy5jYXBpdGFsaXplKGtleSl9YF0gPSBkYXRhW2tleV07XHJcbiAgICAgIH1lbHNle1xyXG4gICAgICAgICR0YXJnZXQuZGF0YXNldFtrZXldID0gZGF0YVtrZXldO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGdldFByb3BzRnJvbURhdGFzZXQoKSB7XHJcbiAgICBkYXRhc2V0UHJvcHMgPSBnZXREYXRhc2V0QnlQcmVmaXgoJ3Byb3BzJyk7XHJcblxyXG4gICAgcmV0dXJuIGRhdGFzZXRQcm9wcztcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGdldFZhcnNGcm9tRGF0YXNldCgpIHtcclxuICAgIGRhdGFzZXRWYXJzID0gZ2V0RGF0YXNldEV4Y2VwdFByZWZpeCgncHJvcHMnKTtcclxuXHJcbiAgICByZXR1cm4gZGF0YXNldFZhcnM7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBzZXRQcm9wc0Zyb21EYXRhc2V0KHByb3BzKSB7XHJcbiAgICBzZXREYXRhc2V0QnlQcmVmaXgocHJvcHMsICdwcm9wcycpO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gc2V0VmFyc0Zyb21EYXRhc2V0KHZhcnMpIHtcclxuICAgIHNldERhdGFzZXRCeVByZWZpeCh2YXJzLCAnJyk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBzZXRTdHJpbmdUb09iamVjdChwcm9wcykge1xyXG4gICAgLy8gZGF0YXNldOyXkOyEnCDqsJ3ssrQg7ZiV7YOc7J24IOyKpO2KuOungeqwkiDtg4DsnoUg6rCd7LK066GcIOuwlOq/lOykjFxyXG4gICAgZm9yIChjb25zdCBrZXkgaW4gcHJvcHMpIHtcclxuICAgICAgaWYgKCEodHlwZW9mIHByb3BzW2tleV0gPT09ICdib29sZWFuJykgJiYgcHJvcHNba2V5XS5pbmNsdWRlcygneycpKSB7XHJcbiAgICAgICAgcHJvcHNba2V5XSA9IEpTT04ucGFyc2UocHJvcHNba2V5XSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gcHJvcHM7XHJcbiAgfVxyXG5cclxuICByZXR1cm4ge1xyXG4gICAgZ2V0UHJvcHNGcm9tRGF0YXNldCxcclxuICAgIHNldFByb3BzRnJvbURhdGFzZXQsXHJcbiAgICBnZXRWYXJzRnJvbURhdGFzZXQsXHJcbiAgICBzZXRWYXJzRnJvbURhdGFzZXQsXHJcbiAgICBzZXRTdHJpbmdUb09iamVjdCxcclxuICB9O1xyXG59XHJcbiIsImZ1bmN0aW9uIHVzZURpYWxvZygpIHtcclxuICBjb25zdCBhbGVydCA9ICguLi5vcHRzKSA9PiB7XHJcbiAgICBjb25zdCAkbGF5ZXJXcmFwID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmxheWVyLXdyYXAnKTtcclxuICAgIGNvbnN0IGRpYWxvZyA9IG5ldyBldFVJLmNvbXBvbmVudHMuRGlhbG9nKCk7XHJcblxyXG4gICAgaWYodHlwZW9mIG9wdHNbMF0gPT09ICdzdHJpbmcnKXtcclxuICAgICAgZGlhbG9nLmNvcmUuaW5pdCgkbGF5ZXJXcmFwLCB7IGRpYWxvZ1R5cGU6ICdhbGVydCcsIG1lc3NhZ2U6IG9wdHNbMF0sIGNhbGxiYWNrOiBvcHRzWzFdIH0pO1xyXG4gICAgfWVsc2UgaWYodHlwZW9mIG9wdHNbMF0gPT09ICdvYmplY3QnKXtcclxuICAgICAgZGlhbG9nLmNvcmUuaW5pdCgkbGF5ZXJXcmFwLCB7IGRpYWxvZ1R5cGU6ICdhbGVydCcsIC4uLm9wdHNbMF0gfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZGlhbG9nLm9wZW4oKTtcclxuICB9O1xyXG5cclxuICBjb25zdCBjb25maXJtID0gKC4uLm9wdHMpID0+IHtcclxuICAgIGNvbnN0ICRsYXllcldyYXAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubGF5ZXItd3JhcCcpO1xyXG4gICAgY29uc3QgZGlhbG9nID0gbmV3IGV0VUkuY29tcG9uZW50cy5EaWFsb2coKTtcclxuXHJcbiAgICBpZih0eXBlb2Ygb3B0c1swXSA9PT0gJ3N0cmluZycpe1xyXG4gICAgICBkaWFsb2cuY29yZS5pbml0KCRsYXllcldyYXAsIHsgZGlhbG9nVHlwZTogJ2NvbmZpcm0nLCBtZXNzYWdlOiBvcHRzWzBdLCBwb3NpdGl2ZUNhbGxiYWNrOiBvcHRzWzFdIH0pO1xyXG4gICAgfWVsc2UgaWYodHlwZW9mIG9wdHNbMF0gPT09ICdvYmplY3QnKXtcclxuICAgICAgZGlhbG9nLmNvcmUuaW5pdCgkbGF5ZXJXcmFwLCB7IGRpYWxvZ1R5cGU6ICdjb25maXJtJywgLi4ub3B0c1swXSB9KTtcclxuICAgIH1cclxuXHJcbiAgICBkaWFsb2cub3BlbigpO1xyXG4gIH07XHJcblxyXG4gIGNvbnN0IHByZXZpZXdJbWFnZSA9ICguLi5vcHRzKSA9PiB7XHJcbiAgICBjb25zdCAkbGF5ZXJXcmFwID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmxheWVyLXdyYXAnKTtcclxuICAgIGNvbnN0IGRpYWxvZyA9IG5ldyBldFVJLmNvbXBvbmVudHMuRGlhbG9nKCk7XHJcblxyXG5cclxuICAgIGRpYWxvZy5jb3JlLmluaXQoJGxheWVyV3JhcCwgeyBkaWFsb2dUeXBlOiAncHJldmlld0ltYWdlJywgLi4ub3B0c1swXSB9KTtcclxuXHJcbiAgICBkaWFsb2cub3BlbigpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIGFsZXJ0LFxyXG4gICAgY29uZmlybSxcclxuICAgIHByZXZpZXdJbWFnZVxyXG4gIH07XHJcbn1cclxuIiwiZnVuY3Rpb24gdXNlRGlhbG9nVG1wbCgpIHtcclxuICBjb25zdCAkdGVtcGxhdGVIVE1MID0gKHsgZGlhbG9nVHlwZSwgdHlwZSwgdGl0bGUsIG1lc3NhZ2UsIHBvc2l0aXZlVGV4dCwgbmVnYXRpdmVUZXh0IH0pID0+IGBcclxuICAgICAgPGRpdiBjbGFzcz1cImRpYWxvZy1kaW1tXCI+PC9kaXY+XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJkaWFsb2ctZnJhbWVcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiZGlhbG9nLWNvbnRhaW5lclwiPlxyXG4gICAgICAgICAgPGRpdiBjbGFzcz1cImRpYWxvZy1oZWFkZXJcIj5cclxuICAgICAgICAgICAgJHt0aXRsZSA/IGA8aDMgY2xhc3M9XCJkaWFsb2ctdGl0XCI+JHt0aXRsZX08L2gzPmAgOiAnJ31cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPGRpdiBjbGFzcz1cImRpYWxvZy1jb250ZW50XCI+XHJcbiAgICAgICAgICAgICR7ZGlhbG9nVHlwZSA9PT0gJ2FsZXJ0JyA/IGA8c3BhbiBjbGFzcz1cIiR7dHlwZX1cIj5pY29uPC9zcGFuPmAgOiAnJ31cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIDxwIGNsYXNzPVwiZGlhbG9nLWluZm9cIj4ke21lc3NhZ2UucmVwbGFjZSgvXFxuL2csICc8YnI+Jyl9PC9wPlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzPVwiYnRuLWdyb3VwXCI+XHJcbiAgICAgICAgICAgICR7ZGlhbG9nVHlwZSA9PT0gJ2NvbmZpcm0nID8gYDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuIGRpYWxvZy1uZWdhdGl2ZVwiPiR7bmVnYXRpdmVUZXh0fTwvYnV0dG9uPmAgOiAnJ31cclxuICAgICAgICAgICAgJHtwb3NpdGl2ZVRleHQgPyBgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG4gZGlhbG9nLXBvc2l0aXZlIGJ0bi1wcmltYXJ5XCI+JHtwb3NpdGl2ZVRleHR9PC9idXR0b24+YCA6ICcnfVxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgYDtcclxuXHJcbiAgICBjb25zdCAkdGVtcGxhdGVQcmV2aWV3SW1hZ2VIVE1MID0gKHtkaWFsb2dUeXBlLCBpbWFnZXMsIHRpdGxlfSkgPT4gYFxyXG4gICAgICA8ZGl2IGNsYXNzPVwiZGlhbG9nLWRpbW1cIj48L2Rpdj5cclxuICAgICAgPGRpdiBjbGFzcz1cImRpYWxvZy1mcmFtZVwiPlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJkaWFsb2ctY29udGFpbmVyXCI+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzPVwiZGlhbG9nLWhlYWRlclwiPlxyXG4gICAgICAgICAgICAke3RpdGxlID8gYDxoMyBjbGFzcz1cImRpYWxvZy10aXRcIj4ke3RpdGxlfTwvaDM+YCA6ICcnfVxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzPVwiZGlhbG9nLWNvbnRlbnRcIj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbXBvbmVudC1zd2lwZXJcIiBkYXRhLWNvbXBvbmVudD1cInN3aXBlclwiPlxyXG4gICAgICAgICAgICAgIDwhLS0gQWRkaXRpb25hbCByZXF1aXJlZCB3cmFwcGVyIC0tPlxyXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJzd2lwZXItd3JhcHBlclwiPlxyXG4gICAgICAgICAgICAgICAgJHtpbWFnZXMubWFwKChpbWFnZSkgPT4gKGBcclxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInN3aXBlci1zbGlkZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxpbWcgc3JjPVwiJHtpbWFnZS5zcmN9XCIgYWx0PVwiJHtpbWFnZS5hbHR9XCIgLz5cclxuICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICBgKSkuam9pbignJyl9XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgYFxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICR0ZW1wbGF0ZUhUTUwsXHJcbiAgICAgICR0ZW1wbGF0ZVByZXZpZXdJbWFnZUhUTUxcclxuICAgIH1cclxufVxyXG4iLCIvKipcclxuICogdXNlRXZlbnRMaXN0ZW5lclxyXG4gKiBAcGFyYW0gdGFyZ2V0ICB7SFRNTEVsZW1lbnR9XHJcbiAqIEBwYXJhbSB0eXBlICB7c3RyaW5nfVxyXG4gKiBAcGFyYW0gbGlzdGVuZXIgIHtmdW5jdGlvbn1cclxuICogQHBhcmFtIG9wdGlvbnMge29iamVjdH1cclxuICogQHJldHVybnMge2Z1bmN0aW9uKCk6ICp9XHJcbiAqL1xyXG5mdW5jdGlvbiB1c2VFdmVudExpc3RlbmVyKHRhcmdldCwgdHlwZSwgbGlzdGVuZXIsIG9wdGlvbnMgPSB7fSl7XHJcbiAgdGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIodHlwZSwgbGlzdGVuZXIsIG9wdGlvbnMpO1xyXG4gIHJldHVybiAoKSA9PiB0YXJnZXQucmVtb3ZlRXZlbnRMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lciwgb3B0aW9ucyk7XHJcbn1cclxuIiwiLyoqXHJcbiAqIGdldEJvdW5kaW5nQ2xpZW50UmVjdFxyXG4gKiBAcGFyYW0geyBFbGVtZW50IH0gcGFyZW50XHJcbiAqIEBwYXJhbSB7IFN0cmluZyB9IHNlbGVjdG9yXHJcbiAqIEByZXR1cm5zXHJcbiAqL1xyXG5mdW5jdGlvbiB1c2VHZXRDbGllbnRSZWN0KHBhcmVudCwgc2VsZWN0b3IpIHtcclxuICBjb25zdCByZWN0ID0gcGFyZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpPy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuICBpZiAoIXJlY3QpIHJldHVybiB7fTtcclxuICBlbHNlXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB3aWR0aDogcmVjdC53aWR0aCxcclxuICAgICAgaGVpZ2h0OiByZWN0LmhlaWdodCxcclxuICAgICAgdG9wOiByZWN0LnRvcCxcclxuICAgICAgYm90dG9tOiByZWN0LmJvdHRvbSxcclxuICAgICAgbGVmdDogcmVjdC5sZWZ0LFxyXG4gICAgICByaWdodDogcmVjdC5yaWdodCxcclxuICAgIH07XHJcbn1cclxuIiwiZnVuY3Rpb24gdXNlTGF5ZXIodHlwZSA9ICdtb2RhbCcpe1xyXG4gIGZ1bmN0aW9uIGdldFZpc2libGVMYXllcigpe1xyXG4gICAgY29uc3QgJGxheWVyQ29tcG9uZW50cyA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmxheWVyLXdyYXAnKS5jaGlsZHJlbikuZmlsdGVyKCgkZWwpID0+IHtcclxuICAgICAgY29uc3QgaXNNb2RhbENvbXBvbmVudCA9ICRlbC5jbGFzc0xpc3QuY29udGFpbnMoJ2NvbXBvbmVudC1tb2RhbCcpXHJcbiAgICAgIGNvbnN0IGlzRGlhbG9nQ29tcG9uZW50ID0gJGVsLmNsYXNzTGlzdC5jb250YWlucygnY29tcG9uZW50LWRpYWxvZycpXHJcblxyXG4gICAgICByZXR1cm4gaXNNb2RhbENvbXBvbmVudCB8fCBpc0RpYWxvZ0NvbXBvbmVudFxyXG4gICAgfSlcclxuXHJcbiAgICByZXR1cm4gJGxheWVyQ29tcG9uZW50cy5maWx0ZXIoKCRlbCkgPT4ge1xyXG4gICAgICBjb25zdCBzdHlsZSA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKCRlbCk7XHJcbiAgICAgIHJldHVybiBzdHlsZS5kaXNwbGF5ICE9PSAnbm9uZSdcclxuICAgIH0pXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBnZXRUb3BEZXB0aCgpe1xyXG4gICAgY29uc3QgJHZpc2libGVMYXllckNvbXBvbmVudHMgPSBnZXRWaXNpYmxlTGF5ZXIoKVxyXG4gICAgcmV0dXJuIDEwMCArICR2aXNpYmxlTGF5ZXJDb21wb25lbnRzLmxlbmd0aFxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gc2V0TGF5ZXJPcGFjaXR5KGRlZmF1bHRPcGFjaXR5ID0gMC41KXtcclxuICAgIGNvbnN0ICR2aXNpYmxlTGF5ZXJDb21wb25lbnRzID0gZ2V0VmlzaWJsZUxheWVyKClcclxuICAgICR2aXNpYmxlTGF5ZXJDb21wb25lbnRzLmZvckVhY2goKCRlbCwgaW5kZXgpID0+IHtcclxuXHJcbiAgICAgIGNvbnN0IG9wYWNpdHkgPSBldFVJLnV0aWxzLmdldEJsZW5kT3BhY2l0eShkZWZhdWx0T3BhY2l0eSwgJHZpc2libGVMYXllckNvbXBvbmVudHMubGVuZ3RoKVxyXG5cclxuICAgICAgaWYoJGVsLnF1ZXJ5U2VsZWN0b3IoYC5tb2RhbC1kaW1tYCkpe1xyXG4gICAgICAgICRlbC5xdWVyeVNlbGVjdG9yKGAubW9kYWwtZGltbWApLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IGByZ2JhKDAsIDAsIDAsICR7b3BhY2l0eX0pYFxyXG4gICAgICB9XHJcblxyXG4gICAgICBpZigkZWwucXVlcnlTZWxlY3RvcihgLmRpYWxvZy1kaW1tYCkpe1xyXG4gICAgICAgICRlbC5xdWVyeVNlbGVjdG9yKGAuZGlhbG9nLWRpbW1gKS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBgcmdiYSgwLCAwLCAwLCAke29wYWNpdHl9KWBcclxuICAgICAgfVxyXG4gICAgfSlcclxuICB9XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBnZXRWaXNpYmxlTGF5ZXIsXHJcbiAgICBnZXRUb3BEZXB0aCxcclxuICAgIHNldExheWVyT3BhY2l0eVxyXG4gIH1cclxufVxyXG4iLCJmdW5jdGlvbiB1c2VNdXRhdGlvblN0YXRlKCl7XHJcbiAgbGV0ICR0YXJnZXQsICRyZWYgPSB7XHJcbiAgICAkc3RhdGU6IHt9XHJcbiAgfSwgbXV0YXRpb25PYnNlcnZlciwgcmVuZGVyO1xyXG5cclxuICBmdW5jdGlvbiBpbml0TXV0YXRpb25TdGF0ZShfJHRhcmdldCwgX3JlbmRlcil7XHJcbiAgICAkdGFyZ2V0ID0gXyR0YXJnZXRcclxuICAgIHJlbmRlciA9IF9yZW5kZXI7XHJcblxyXG4gICAgc2V0TXV0YXRpb25PYnNlcnZlcigpXHJcbiAgICBzZXRTdGF0ZUJ5RGF0YXNldCgpXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBzZXRTdGF0ZUJ5RGF0YXNldCgpe1xyXG4gICAgY29uc3QgZmlsdGVyZWREYXRhc2V0ID0ge307XHJcbiAgICBjb25zdCBkYXRhc2V0ID0gJHRhcmdldC5kYXRhc2V0O1xyXG5cclxuICAgIE9iamVjdC5rZXlzKGRhdGFzZXQpLmZvckVhY2goKGtleSkgPT4ge1xyXG4gICAgICBpZihrZXkuc3RhcnRzV2l0aCgndmFycycpKXtcclxuICAgICAgICBmaWx0ZXJlZERhdGFzZXRba2V5LnJlcGxhY2UoJ3ZhcnMnLCAnJykudG9Mb3dlckNhc2UoKV0gPSBkYXRhc2V0W2tleV07XHJcbiAgICAgIH1cclxuICAgIH0pXHJcblxyXG4gICAgc2V0U3RhdGUoZmlsdGVyZWREYXRhc2V0KVxyXG4gICAgcmVuZGVyKCk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBzZXRNdXRhdGlvbk9ic2VydmVyKCl7XHJcbiAgICBjb25zdCBjb25maWcgPSB7IGF0dHJpYnV0ZXM6IHRydWUsIGNoaWxkTGlzdDogZmFsc2UsIHN1YnRyZWU6IGZhbHNlIH07XHJcblxyXG4gICAgY29uc3QgY2FsbGJhY2sgPSAobXV0YXRpb25MaXN0LCBvYnNlcnZlcikgPT4ge1xyXG4gICAgICBmb3IgKGNvbnN0IG11dGF0aW9uIG9mIG11dGF0aW9uTGlzdCkge1xyXG4gICAgICAgIGlmIChtdXRhdGlvbi50eXBlID09PSBcImF0dHJpYnV0ZXNcIlxyXG4gICAgICAgICAgJiYgbXV0YXRpb24uYXR0cmlidXRlTmFtZSAhPT0gJ3N0eWxlJ1xyXG4gICAgICAgICAgJiYgbXV0YXRpb24uYXR0cmlidXRlTmFtZSAhPT0gJ2NsYXNzJ1xyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgc2V0U3RhdGVCeURhdGFzZXQoKVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBtdXRhdGlvbk9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoY2FsbGJhY2spO1xyXG4gICAgbXV0YXRpb25PYnNlcnZlci5vYnNlcnZlKCR0YXJnZXQsIGNvbmZpZyk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBzZXRTdGF0ZShuZXdTdGF0ZSl7XHJcbiAgICAkcmVmLiRzdGF0ZSA9IHsgLi4uJHJlZi4kc3RhdGUsIC4uLm5ld1N0YXRlIH07XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBzZXREYXRhU3RhdGUobmV3U3RhdGUpIHtcclxuICAgIGNvbnN0ICRuZXdTdGF0ZSA9IHsgLi4uJHJlZi4kc3RhdGUsIC4uLm5ld1N0YXRlIH07XHJcblxyXG4gICAgT2JqZWN0LmtleXMoJG5ld1N0YXRlKS5mb3JFYWNoKChrZXkpID0+IHtcclxuICAgICAgJHRhcmdldC5kYXRhc2V0W2B2YXJzJHtldFVJLnV0aWxzLmNhcGl0YWxpemUoa2V5KX1gXSA9ICRuZXdTdGF0ZVtrZXldO1xyXG4gICAgfSlcclxuICB9XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICAkcmVmLFxyXG4gICAgc2V0U3RhdGUsXHJcbiAgICBzZXREYXRhU3RhdGUsXHJcbiAgICBpbml0TXV0YXRpb25TdGF0ZVxyXG4gIH1cclxufVxyXG4iLCJmdW5jdGlvbiB1c2VTZWxlY3RCb3hUZW1wKCkge1xyXG4gIGNvbnN0ICR0ZW1wbGF0ZUN1c3RvbUhUTUwgPSB7XHJcbiAgICBsYWJlbCh0ZXh0KSB7XHJcbiAgICAgIHJldHVybiBgXHJcbiAgICAgICAgPGRpdiBpZD1cImNvbWJvMS1sYWJlbFwiIGNsYXNzPVwiY29tYm8tbGFiZWxcIj4ke3RleHR9PC9kaXY+XHJcbiAgICAgIGA7XHJcbiAgICB9LFxyXG4gICAgc2VsZWN0QnRuKHRleHQpIHtcclxuICAgICAgcmV0dXJuIGBcclxuICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgaWQ9XCJjb21ibzFcIiBjbGFzcz1cInNlbGVjdC1ib3hcIiByb2xlPVwiY29tYm9ib3hcIiBhcmlhLWNvbnRyb2xzPVwibGlzdGJveDFcIiBhcmlhLWV4cGFuZGVkPVwiZmFsc2VcIiBhcmlhLWxhYmVsbGVkYnk9XCJjb21ibzEtbGFiZWxcIiBhcmlhLWFjdGl2ZWRlc2NlbmRhbnQ9XCJcIj5cclxuICAgICAgICA8c3BhbiBzdHlsZT1cInBvaW50ZXItZXZlbnRzOiBub25lO1wiPiR7dGV4dH08L3NwYW4+XHJcbiAgICAgIDwvYnV0dG9uPlxyXG4gICAgICBgO1xyXG4gICAgfSxcclxuICAgIGl0ZW1zV3JhcChpdGVtc0hUTUwpIHtcclxuICAgICAgcmV0dXJuIGBcclxuICAgICAgICA8dWwgaWQ9XCJsaXN0Ym94MVwiIGNsYXNzPVwic2VsZWN0LW9wdGlvbnNcIiByb2xlPVwibGlzdGJveFwiIGFyaWEtbGFiZWxsZWRieT1cImNvbWJvMS1sYWJlbFwiIHRhYmluZGV4PVwiLTFcIj5cclxuICAgICAgICAgICR7aXRlbXNIVE1MfVxyXG4gICAgICAgIDwvdWw+XHJcbiAgICAgIGA7XHJcbiAgICB9LFxyXG4gICAgaXRlbXMoaXRlbSwgc2VsZWN0ZWQgPSBmYWxzZSkge1xyXG4gICAgICByZXR1cm4gYFxyXG4gICAgICAgIDxsaSByb2xlPVwib3B0aW9uXCIgY2xhc3M9XCJvcHRpb25cIiBhcmlhLXNlbGVjdGVkPVwiJHtzZWxlY3RlZH1cIiBkYXRhLXZhbHVlPVwiJHtpdGVtLnZhbHVlfVwiPlxyXG4gICAgICAgICAgJHtpdGVtLnRleHR9XHJcbiAgICAgICAgPC9saT5cclxuICAgICAgYDtcclxuICAgIH0sXHJcbiAgfTtcclxuXHJcbiAgY29uc3QgJHRlbXBsYXRlQmFzaWNIVE1MID0ge1xyXG4gICAgbGFiZWwodGV4dCkge1xyXG4gICAgICByZXR1cm4gYFxyXG4gICAgICAgIDxkaXYgaWQ9XCJjb21ibzEtbGFiZWxcIiBjbGFzcz1cImNvbWJvLWxhYmVsXCI+JHt0ZXh0fTwvZGl2PlxyXG4gICAgICBgO1xyXG4gICAgfSxcclxuICAgIHNlbGVjdEJ0bih0ZXh0KSB7XHJcbiAgICAgIHJldHVybiBgXHJcbiAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIlwiIHNlbGVjdGVkIGRpc2FibGVkIGhpZGRlbj4ke3RleHR9PC9vcHRpb24+XHJcbiAgICAgIGA7XHJcbiAgICB9LFxyXG4gICAgaXRlbXNXcmFwKGl0ZW1zSFRNTCkge1xyXG4gICAgICByZXR1cm4gYFxyXG4gICAgICAgIDxzZWxlY3QgY2xhc3M9XCJzZWxlY3QtbGlzdFwiIHJlcXVpcmVkPlxyXG4gICAgICAgICAgJHtpdGVtc0hUTUx9XHJcbiAgICAgICAgPC9zZWxlY3Q+XHJcbiAgICAgIGA7XHJcbiAgICB9LFxyXG4gICAgaXRlbXMoaXRlbSwgc2VsZWN0ZWQgPSBmYWxzZSkge1xyXG4gICAgICByZXR1cm4gYFxyXG4gICAgICAgIDxvcHRpb24gdmFsdWU9XCIke2l0ZW0udmFsdWV9XCI+JHtpdGVtLnRleHR9PC9vcHRpb24+XHJcbiAgICAgIGA7XHJcbiAgICB9LFxyXG4gIH07XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICAkdGVtcGxhdGVDdXN0b21IVE1MLFxyXG4gICAgJHRlbXBsYXRlQmFzaWNIVE1MLFxyXG4gIH07XHJcbn1cclxuIiwiZnVuY3Rpb24gdXNlU3RhdGUoaW5pdGlhbFZhbHVlID0ge30sIGNhbGxiYWNrKSB7XHJcbiAgY29uc3Qgc3RhdGUgPSBuZXcgUHJveHkoaW5pdGlhbFZhbHVlLCB7XHJcbiAgICBzZXQ6ICh0YXJnZXQsIGtleSwgdmFsdWUpID0+IHtcclxuICAgICAgdGFyZ2V0W2tleV0gPSB2YWx1ZTtcclxuXHJcbiAgICAgIGlmIChjYWxsYmFjaykge1xyXG4gICAgICAgIGNhbGxiYWNrKHRhcmdldCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9KTtcclxuXHJcbiAgY29uc3Qgc2V0U3RhdGUgPSAobmV3U3RhdGUpID0+IHtcclxuICAgIE9iamVjdC5rZXlzKG5ld1N0YXRlKS5mb3JFYWNoKChrZXkpID0+IHtcclxuICAgICAgc3RhdGVba2V5XSA9IG5ld1N0YXRlW2tleV07XHJcbiAgICB9KVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIFtzdGF0ZSwgc2V0U3RhdGVdO1xyXG59XHJcbiIsImZ1bmN0aW9uIHVzZVN3aXBlclRtcGwoKSB7XHJcbiAgY29uc3QgJHRlbXBsYXRlSFRNTCA9IHtcclxuICAgIG5hdmlnYXRpb24oKSB7XHJcbiAgICAgIHJldHVybiBgXHJcbiAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJzd2lwZXItYnV0dG9uLXByZXZcIj7snbTsoIQ8L2J1dHRvbj5cclxuICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInN3aXBlci1idXR0b24tbmV4dFwiPuuLpOydjDwvYnV0dG9uPlxyXG4gICAgICBgO1xyXG4gICAgfSxcclxuICAgIHBhZ2luYXRpb24oKSB7XHJcbiAgICAgIHJldHVybiBgXHJcbiAgICAgICAgPGRpdiBjbGFzcz1cInN3aXBlci1wYWdpbmF0aW9uXCI+PC9kaXY+XHJcbiAgICAgIGA7XHJcbiAgICB9LFxyXG4gICAgYXV0b3BsYXkoKSB7XHJcbiAgICAgIHJldHVybiBgXHJcbiAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwic3dpcGVyLWF1dG9wbGF5IHBsYXlcIj48L2J1dHRvbj5cclxuICAgICAgYDtcclxuICAgIH0sXHJcbiAgfTtcclxuXHJcbiAgcmV0dXJuIHtcclxuICAgICR0ZW1wbGF0ZUhUTUwsXHJcbiAgfTtcclxufVxyXG4iLCIvKipcclxuICogdGVtcCB0aW1lbGluZVxyXG4gKiBAcmV0dXJuc1xyXG4gKi9cclxuZnVuY3Rpb24gdXNlVHJhbnNpdGlvbigpIHtcclxuICAvLyBzZWxlY3RcclxuICBjb25zdCB1c2VTZWxlY3RTaG93ID0gKHRhcmdldCwgdHlwZSwgb3B0aW9uKSA9PiB7XHJcbiAgICBpZiAoIXRhcmdldCkgcmV0dXJuO1xyXG5cclxuICAgIGNvbnN0IHRpbWVsaW5lID0gZ3NhcC50aW1lbGluZSh7IHBhdXNlZDogdHJ1ZSB9KTtcclxuXHJcbiAgICBjb25zdCBvcHRpb25MaXN0ID0ge1xyXG4gICAgICBmYXN0OiB7IGR1cmF0aW9uOiAwLjEgfSxcclxuICAgICAgbm9ybWFsOiB7IGR1cmF0aW9uOiAwLjMgfSxcclxuICAgICAgc2xvdzogeyBkdXJhdGlvbjogMC43IH0sXHJcbiAgICB9O1xyXG4gICAgbGV0IGdzYXBPcHRpb24gPSB7IC4uLm9wdGlvbkxpc3RbdHlwZV0sIC4uLm9wdGlvbiB9O1xyXG5cclxuICAgIHRpbWVsaW5lLnRvKHRhcmdldCwge1xyXG4gICAgICBhbHBoYTogMCxcclxuICAgICAgZWFzZTogXCJsaW5lYXJcIixcclxuICAgICAgb25Db21wbGV0ZSgpIHtcclxuICAgICAgICB0YXJnZXQuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gICAgICB9LFxyXG4gICAgICAuLi5nc2FwT3B0aW9uLFxyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdGltZWxpbmVFbDogdGltZWxpbmUuX3JlY2VudC52YXJzLFxyXG4gICAgICB0aW1lbGluZTogKHN0YXRlKSA9PiB7XHJcbiAgICAgICAgc3RhdGUgPyAoKHRhcmdldC5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiKSwgdGltZWxpbmUucmV2ZXJzZSgpKSA6IHRpbWVsaW5lLnBsYXkoKTtcclxuICAgICAgfSxcclxuICAgIH07XHJcbiAgfTtcclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIHVzZVNlbGVjdFNob3csXHJcbiAgfTtcclxufVxyXG4iLCJcbmV0VUkuaG9va3MgPSB7XG5cdHVzZUNsaWNrT3V0c2lkZSxcblx0dXNlQ29yZSxcblx0dXNlRGF0YXNldCxcblx0dXNlRGlhbG9nLFxuXHR1c2VEaWFsb2dUbXBsLFxuXHR1c2VFdmVudExpc3RlbmVyLFxuXHR1c2VHZXRDbGllbnRSZWN0LFxuXHR1c2VMYXllcixcblx0dXNlTXV0YXRpb25TdGF0ZSxcblx0dXNlU2VsZWN0Qm94VGVtcCxcblx0dXNlU3RhdGUsXG5cdHVzZVN3aXBlclRtcGwsXG5cdHVzZVRyYW5zaXRpb25cbn1cbiIsIi8qKlxyXG4gKiBAdHlwZWRlZiB7T2JqZWN0fSBQcm9wc0NvbmZpZ1xyXG4gKiBAcHJvcGVydHkge2Jvb2xlYW59IGRpc2FibGVkIC0g7JqU7IaM6rCAIOu5hO2ZnOyEse2ZlCDsg4Htg5zsnbjsp4Drpbwg64KY7YOA64OF64uI64ukLlxyXG4gKiBAcHJvcGVydHkge2Jvb2xlYW59IG9uY2UgLSDsnbTrsqTtirjrgpgg7JWh7IWY7J2EIO2VnCDrsojrp4wg7Iuk7ZaJ7ZWg7KeAIOyXrOu2gOulvCDqsrDsoJXtlanri4jri6QuXHJcbiAqIEBwcm9wZXJ0eSB7ZmFsc2UgfCBudW1iZXJ9IGR1cmF0aW9uIC0g7JWg64uI66mU7J207IWYIOuYkOuKlCDsnbTrsqTtirgg7KeA7IaNIOyLnOqwhOydhCDrsIDrpqzstIgg64uo7JyE66GcIOyEpOygle2VqeuLiOuLpC4gJ2ZhbHNlJ+ydvCDqsr3smrAg7KeA7IaNIOyLnOqwhOydhCDrrLTsi5ztlanri4jri6QuXHJcbiAqIEBwcm9wZXJ0eSB7T2JqZWN0fSBvcmlnaW4gLSDsm5DsoJAg65iQ64qUIOyLnOyekSDsp4DsoJDsnYQg64KY7YOA64K064qUIOqwneyytOyeheuLiOuLpC5cclxuICovXHJcblxyXG4vKipcclxuICogQHR5cGVkZWYge09iamVjdH0gU3RhdGVDb25maWdcclxuICogQHByb3BlcnR5IHsnY2xvc2UnIHwgJ29wZW4nfSBzdGF0ZSAtIOyVhOy9lOuUlOyWuOydmCDsg4Htg5zqsJIuIGNsb3NlLCBvcGVuIOuRmCDspJHsl5Ag7ZWY64KY7J6F64uI64ukLlxyXG4gKi9cclxuXHJcbi8qKiBAdHlwZSB7UHJvcHNDb25maWd9ICovXHJcbi8qKiBAdHlwZSB7U3RhdGVDb25maWd9ICovXHJcblxyXG5mdW5jdGlvbiBBY2NvcmRpb24oKSB7XHJcbiAgY29uc3QgeyBhY3Rpb25zLCBwcm9wcywgc3RhdGUsIHNldFByb3BzLCBzZXRTdGF0ZSwgc2V0VGFyZ2V0LCBhZGRFdmVudCwgcmVtb3ZlRXZlbnQgfSA9IGV0VUkuaG9va3MudXNlQ29yZShcclxuICAgIHtcclxuICAgICAgZGVmYXVsdFZhbHVlOiAwLFxyXG4gICAgICBjb2xsYXBzaWJsZTogZmFsc2UsXHJcbiAgICAgIGFuaW1hdGlvbjoge1xyXG4gICAgICAgIGR1cmF0aW9uOiAwLjUsXHJcbiAgICAgICAgZWFzaW5nOiBcInBvd2VyNC5vdXRcIixcclxuICAgICAgfSxcclxuICAgICAgdHlwZTogXCJtdWx0aXBsZVwiLFxyXG4gICAgfSxcclxuICAgIHt9LFxyXG4gICAgcmVuZGVyLFxyXG4gICk7XHJcblxyXG4gIC8vIGNvbnN0YW50XHJcblxyXG4gIC8vIHZhcmlhYmxlXHJcbiAgY29uc3QgbmFtZSA9IFwiYWNjb3JkaW9uXCI7XHJcbiAgbGV0IGNvbXBvbmVudCA9IHt9O1xyXG4gIC8vIGVsZW1lbnQsIHNlbGVjdG9yXHJcbiAgbGV0IGFjY29yZGlvblRvZ2dsZUJ0biwgYWNjb3JkaW9uSXRlbTtcclxuICBsZXQgJHRhcmdldCwgJGFjY29yZGlvbkNvbnRlbnRzLCAkYWNjb3JkaW9uSXRlbTtcclxuXHJcbiAge1xyXG4gICAgZnVuY3Rpb24gaW5pdChfJHRhcmdldCwgX3Byb3BzKSB7XHJcbiAgICAgIGlmICh0eXBlb2YgXyR0YXJnZXQgPT09IFwic3RyaW5nXCIpIHtcclxuICAgICAgICAkdGFyZ2V0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihfJHRhcmdldCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgJHRhcmdldCA9IF8kdGFyZ2V0O1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoISR0YXJnZXQpIHtcclxuICAgICAgICB0aHJvdyBFcnJvcihcInRhcmdldOydtCDsobTsnqztlZjsp4Ag7JWK7Iq164uI64ukLlwiKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgc2V0VGFyZ2V0KCR0YXJnZXQpO1xyXG4gICAgICBzZXRQcm9wcyh7IC4uLnByb3BzLCAuLi5fcHJvcHMgfSk7XHJcblxyXG4gICAgICBpZiAoJHRhcmdldC51aSkgcmV0dXJuO1xyXG4gICAgICAkdGFyZ2V0LnVpID0gY29tcG9uZW50O1xyXG5cclxuICAgICAgc2V0dXAoKTtcclxuICAgICAgc2V0RXZlbnQoKTtcclxuXHJcbiAgICAgICR0YXJnZXQuc2V0QXR0cmlidXRlKFwiZGF0YS1pbml0XCIsIFwidHJ1ZVwiKTtcclxuXHJcbiAgICAgIGNvbnNvbGUubG9nKCR0YXJnZXQpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHNldHVwKCkge1xyXG4gICAgICBzZXR1cFNlbGVjdG9yKCk7XHJcbiAgICAgIHNldHVwRWxlbWVudCgpO1xyXG4gICAgICBzZXR1cEFjdGlvbnMoKTtcclxuXHJcbiAgICAgIC8vIHN0YXRlXHJcbiAgICAgIHNldFN0YXRlKHsgc2V0dGluZzogXCJjdXN0b21cIiB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIHVwZGF0ZVxyXG4gICAgICogQHBhcmFtIF9wcm9wc1xyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiB1cGRhdGUoX3Byb3BzKSB7XHJcbiAgICAgIGlmIChfcHJvcHMgJiYgZXRVSS51dGlscy5zaGFsbG93Q29tcGFyZShwcm9wcywgX3Byb3BzKSAmJiAhJHRhcmdldC5nZXRBdHRyaWJ1dGUoXCJkYXRhLWluaXRcIikpIHJldHVybjtcclxuICAgICAgZGVzdHJveSgpO1xyXG5cclxuICAgICAgc2V0UHJvcHMoeyAuLi5wcm9wcywgLi4uX3Byb3BzIH0pO1xyXG4gICAgICBzZXR1cCgpO1xyXG4gICAgICBzZXRFdmVudCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGRlc3Ryb3koKSB7XHJcbiAgICAgIHJlbW92ZUV2ZW50KCk7XHJcbiAgICAgICR0YXJnZXQudWkgPSBudWxsO1xyXG4gICAgICAkdGFyZ2V0LnJlbW92ZUF0dHJpYnV0ZShcImRhdGEtaW5pdFwiKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIHNldHVwU2VsZWN0b3IoKSB7XHJcbiAgICAvLyBzZWxlY3RvclxyXG4gICAgYWNjb3JkaW9uVG9nZ2xlQnRuID0gXCIuYWNjb3JkaW9uLXRpdFwiO1xyXG4gICAgYWNjb3JkaW9uSXRlbSA9IFwiLmFjY29yZGlvbi1pdGVtXCI7XHJcblxyXG4gICAgLy8gZWxlbWVudFxyXG4gICAgJGFjY29yZGlvbkl0ZW0gPSAkdGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoYWNjb3JkaW9uSXRlbSk7XHJcbiAgICAkYWNjb3JkaW9uQ29udGVudHMgPSAkdGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoXCIuYWNjb3JkaW9uLWNvbnRlbnRcIik7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBzZXR1cEVsZW1lbnQoKSB7XHJcbiAgICAvLyBpZFxyXG4gICAgY29uc3QgaWQgPSBldFVJLnV0aWxzLmdldFJhbmRvbVVJSUQobmFtZSk7XHJcblxyXG4gICAgJHRhcmdldC5zZXRBdHRyaWJ1dGUoXCJhcmlhLWV4cGFuZGVkXCIsIGZhbHNlKTtcclxuICAgICRhY2NvcmRpb25Db250ZW50cy5zZXRBdHRyaWJ1dGUoXCJhcmlhLWhpZGRlblwiLCB0cnVlKTtcclxuICAgICRhY2NvcmRpb25Db250ZW50cy5zZXRBdHRyaWJ1dGUoXCJyb2xlXCIsIFwicmVnaW9uXCIpO1xyXG4gICAgJHRhcmdldC5zZXRBdHRyaWJ1dGUoXCJpZFwiLCBpZCk7XHJcbiAgICAkdGFyZ2V0LnNldEF0dHJpYnV0ZShcImFyaWEtbGFiZWxsZWRieVwiLCBpZCk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBzZXR1cEFjdGlvbnMoKSB7XHJcbiAgICBjb25zdCBpc0N1c3RvbSA9IHByb3BzLnNldHRpbmcgPT09IFwiY3VzdG9tXCI7XHJcbiAgICBjb25zdCB7IGR1cmF0aW9uLCBlYXNlaW5nIH0gPSBwcm9wcy5hbmltYXRpb247XHJcblxyXG4gICAgYWN0aW9ucy5vcGVuID0gKHRhcmdldCA9ICRhY2NvcmRpb25JdGVtKSA9PiB7XHJcbiAgICAgIHRhcmdldC5zZXRBdHRyaWJ1dGUoXCJhcmlhLWV4cGFuZGVkXCIsIHRydWUpO1xyXG4gICAgICBpZiAoIWlzQ3VzdG9tKSB7XHJcbiAgICAgICAgdGFyZ2V0LmNsYXNzTGlzdC5hZGQoXCJzaG93XCIpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGdzYXAudGltZWxpbmUoKS50byh0YXJnZXQsIHsgZHVyYXRpb246IGR1cmF0aW9uLCBlYXNlOiBlYXNlaW5nLCBwYWRkaW5nOiBcIjNyZW1cIiB9KTtcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBhY3Rpb25zLmNsb3NlID0gKHRhcmdldCA9ICRhY2NvcmRpb25JdGVtKSA9PiB7XHJcbiAgICAgIHRhcmdldC5zZXRBdHRyaWJ1dGUoXCJhcmlhLWV4cGFuZGVkXCIsIGZhbHNlKTtcclxuICAgICAgaWYgKCFpc0N1c3RvbSkge1xyXG4gICAgICAgIHRhcmdldC5jbGFzc0xpc3QucmVtb3ZlKFwic2hvd1wiKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBnc2FwLnRpbWVsaW5lKCkudG8odGFyZ2V0LCB7IGR1cmF0aW9uOiBkdXJhdGlvbiwgcGFkZGluZzogXCIwIDNyZW1cIiB9KTtcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBhY3Rpb25zLmFycm93VXAgPSAoKSA9PiB7XHJcbiAgICAgIGNvbnNvbGUubG9nKFwia2V5dXAg7L2c67CxXCIpO1xyXG4gICAgfTtcclxuXHJcbiAgICBhY3Rpb25zLmFycm93RG93biA9ICgpID0+IHtcclxuICAgICAgY29uc29sZS5sb2coXCJrZXl1cCDsvZzrsLFcIik7XHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gc2V0RXZlbnQoKSB7XHJcbiAgICBjb25zdCB7IHR5cGUgfSA9IHByb3BzO1xyXG4gICAgaWYgKHR5cGUgPT09IFwic2luZ2xlXCIpIHtcclxuICAgICAgYWRkRXZlbnQoXCJjbGlja1wiLCBhY2NvcmRpb25Ub2dnbGVCdG4sICh7IHRhcmdldCB9KSA9PiB7XHJcbiAgICAgICAgY29uc3QgeyBwYXJlbnRFbGVtZW50IH0gPSB0YXJnZXQ7XHJcbiAgICAgICAgc2luZ2xlVG9nZ2xlQWNjb3JkaW9uKHBhcmVudEVsZW1lbnQpO1xyXG4gICAgICB9KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGFkZEV2ZW50KFwiY2xpY2tcIiwgYWNjb3JkaW9uVG9nZ2xlQnRuLCAoeyB0YXJnZXQgfSkgPT4ge1xyXG4gICAgICAgIHRvZ2dsZUFjY29yZGlvbih0YXJnZXQucGFyZW50RWxlbWVudCk7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gdG9nZ2xlQWNjb3JkaW9uKGVsZSkge1xyXG4gICAgY29uc29sZS5sb2coZWxlKTtcclxuICAgIGNvbnN0IGlzT3BlbiA9IHN0YXRlLnN0YXRlID09PSBcIm9wZW5cIjtcclxuICAgIGlmIChpc09wZW4pIHtcclxuICAgICAgYWN0aW9ucy5jbG9zZShlbGUpO1xyXG4gICAgICBjbG9zZSgpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgYWN0aW9ucy5vcGVuKGVsZSk7XHJcbiAgICAgIG9wZW4oKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIHNpbmdsZVRvZ2dsZUFjY29yZGlvbih0YXJnZXQpIHtcclxuICAgIGNvbnN0ICRjbGlja2VkSXRlbSA9IHRhcmdldC5wYXJlbnRFbGVtZW50O1xyXG4gICAgY29uc3QgJGFsbFRpdGxlcyA9ICRjbGlja2VkSXRlbS5xdWVyeVNlbGVjdG9yQWxsKGFjY29yZGlvblRvZ2dsZUJ0bik7XHJcbiAgICBjb25zdCAkYWxsSXRlbXMgPSBBcnJheS5mcm9tKCRhbGxUaXRsZXMpLm1hcCgodGl0bGUpID0+IHRpdGxlLnBhcmVudEVsZW1lbnQpO1xyXG5cclxuICAgICRhbGxJdGVtcy5mb3JFYWNoKCgkaXRlbSkgPT4ge1xyXG4gICAgICBjb25zdCAkdGl0bGUgPSAkaXRlbS5xdWVyeVNlbGVjdG9yKGFjY29yZGlvblRvZ2dsZUJ0bik7XHJcbiAgICAgIGNvbnN0ICRjb250ZW50ID0gJHRpdGxlLm5leHRFbGVtZW50U2libGluZztcclxuICAgICAgaWYgKCRpdGVtID09PSB0YXJnZXQpIHtcclxuICAgICAgICBpZiAoJGNvbnRlbnQuZ2V0QXR0cmlidXRlKFwiYXJpYS1oaWRkZW5cIikgPT09IFwidHJ1ZVwiKSB7XHJcbiAgICAgICAgICAkY29udGVudC5zZXRBdHRyaWJ1dGUoXCJhcmlhLWhpZGRlblwiLCBcImZhbHNlXCIpO1xyXG4gICAgICAgICAgJHRpdGxlLnNldEF0dHJpYnV0ZShcImFyaWEtZXhwYW5kZWRcIiwgXCJ0cnVlXCIpO1xyXG4gICAgICAgICAgJGl0ZW0uY2xhc3NMaXN0LmFkZChcInNob3dcIik7XHJcbiAgICAgICAgICBvcGVuKCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICRjb250ZW50LnNldEF0dHJpYnV0ZShcImFyaWEtaGlkZGVuXCIsIFwidHJ1ZVwiKTtcclxuICAgICAgICAgICR0aXRsZS5zZXRBdHRyaWJ1dGUoXCJhcmlhLWV4cGFuZGVkXCIsIFwiZmFsc2VcIik7XHJcbiAgICAgICAgICAkaXRlbS5jbGFzc0xpc3QucmVtb3ZlKFwic2hvd1wiKTtcclxuICAgICAgICAgIGNsb3NlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgICRjb250ZW50LnNldEF0dHJpYnV0ZShcImFyaWEtaGlkZGVuXCIsIFwidHJ1ZVwiKTtcclxuICAgICAgICAkdGl0bGUuc2V0QXR0cmlidXRlKFwiYXJpYS1leHBhbmRlZFwiLCBcImZhbHNlXCIpO1xyXG4gICAgICAgICRpdGVtLmNsYXNzTGlzdC5yZW1vdmUoXCJzaG93XCIpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIHJlbmRlcigpIHtcclxuICAgIGNvbnN0IGlzU2hvdyA9IHN0YXRlLnN0YXRlID09PSBcIm9wZW5cIjtcclxuICAgIC8vIGV0VUkudXRpbHMuc2V0UHJvcGVydHkoJHRhcmdldCwgYWNjb3JkaW9uSXRlbSwgXCJhcmlhLWV4cGFuZGVkXCIsIGlzU2hvdyk7XHJcbiAgICBpc1Nob3cgPyBvcGVuKCkgOiBjbG9zZSgpO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gb3BlbigpIHtcclxuICAgIHNldFN0YXRlKHsgc3RhdGU6IFwib3BlblwiIH0pO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gY2xvc2UoKSB7XHJcbiAgICBzZXRTdGF0ZSh7IHN0YXRlOiBcImNsb3NlXCIgfSk7XHJcbiAgfVxyXG5cclxuICBjb21wb25lbnQgPSB7XHJcbiAgICBjb3JlOiB7XHJcbiAgICAgIHN0YXRlLFxyXG4gICAgICBwcm9wcyxcclxuICAgICAgaW5pdCxcclxuICAgICAgcmVtb3ZlRXZlbnQsXHJcbiAgICAgIGRlc3Ryb3ksXHJcbiAgICB9LFxyXG5cclxuICAgIHVwZGF0ZSxcclxuICAgIG9wZW4sXHJcbiAgICBjbG9zZSxcclxuICB9O1xyXG5cclxuICByZXR1cm4gY29tcG9uZW50O1xyXG59XHJcbiIsIi8qKlxyXG4gKiAgTW9kYWxcclxuICovXHJcbmZ1bmN0aW9uIERpYWxvZygpIHtcclxuICBjb25zdCB7XHJcbiAgICBhY3Rpb25zLCBwcm9wcywgc3RhdGUsIHNldFByb3BzLCBzZXRTdGF0ZSwgc2V0VGFyZ2V0LCBhZGRFdmVudCwgcmVtb3ZlRXZlbnRcclxuICB9ID0gZXRVSS5ob29rcy51c2VDb3JlKHtcclxuICAgICAgLy8gcHJvcHNcclxuICAgICAgZGltbUNsaWNrOiB0cnVlLFxyXG4gICAgICBlc2M6IHRydWUsXHJcbiAgICAgIHRpdGxlOiBudWxsLFxyXG4gICAgICBtZXNzYWdlOiAnJyxcclxuICAgICAgdHlwZTogJ2FsZXJ0JyxcclxuICAgICAgcG9zaXRpdmVUZXh0OiAn7ZmV7J24JyxcclxuICAgICAgbmVnYXRpdmVUZXh0OiAn7Leo7IaMJyxcclxuICAgIH0sIHtcclxuICAgICAgc3RhdGU6ICdjbG9zZScsXHJcbiAgICAgIHRyaWdnZXI6IG51bGxcclxuICAgIH0sIHJlbmRlciwge1xyXG4gICAgICBkYXRhc2V0OiBmYWxzZSxcclxuICAgIH0sXHJcbiAgKTtcclxuXHJcbiAgLy8gY29uc3RhbnRcclxuICBjb25zdCBESU1NX09QQUNJVFkgPSAwLjY7XHJcblxyXG4gIC8vIHZhcmlhYmxlXHJcbiAgY29uc3QgbmFtZSA9ICdkaWFsb2cnO1xyXG4gIGxldCBjb21wb25lbnQgPSB7fTtcclxuICBsZXQgbW9kYWxEaW1tU2VsZWN0b3IsXHJcbiAgICBtb2RhbENsb3NlQnRuU2VsZWN0b3IsXHJcbiAgICBtb2RhbEJ0blBvc2l0aXZlLFxyXG4gICAgbW9kYWxCdG5OZWdhdGl2ZTtcclxuICBsZXQgJHRhcmdldCxcclxuICAgICRtb2RhbCxcclxuICAgICRtb2RhbFRpdGxlLCAkbW9kYWxDb250YWluZXIsICRtb2RhbERpbW0sXHJcbiAgICAkbW9kYWxCdG5Qb3NpdGl2ZSwgJG1vZGFsQnRuTmVnYXRpdmUsXHJcbiAgICBmb2N1c1RyYXBJbnN0YW5jZSxcclxuICAgIGNhbGxiYWNrO1xyXG5cclxuICB7XHJcbiAgICAvKipcclxuICAgICAqIGluaXRcclxuICAgICAqIEBwYXJhbSBfJHRhcmdldFxyXG4gICAgICogQHBhcmFtIF9wcm9wc1xyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBpbml0KF8kdGFyZ2V0LCBfcHJvcHMpIHtcclxuICAgICAgaWYgKHR5cGVvZiBfJHRhcmdldCA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICAkdGFyZ2V0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihfJHRhcmdldCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgJHRhcmdldCA9IF8kdGFyZ2V0O1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoISR0YXJnZXQpIHtcclxuICAgICAgICB0aHJvdyBFcnJvcigndGFyZ2V07J20IOyhtOyerO2VmOyngCDslYrsirXri4jri6QuJyk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHNldFRhcmdldCgkdGFyZ2V0KTtcclxuICAgICAgc2V0UHJvcHMoeyAuLi5wcm9wcywgLi4uX3Byb3BzIH0pO1xyXG5cclxuICAgICAgaWYgKCR0YXJnZXQudWkpIHJldHVybjtcclxuICAgICAgJHRhcmdldC51aSA9IGNvbXBvbmVudDtcclxuXHJcbiAgICAgIHNldHVwKCk7XHJcbiAgICAgIHNldEV2ZW50KCk7XHJcblxyXG4gICAgICAvLyAkdGFyZ2V0LnNldEF0dHJpYnV0ZSgnZGF0YS1pbml0JywgJ3RydWUnKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBzZXR1cCgpIHtcclxuICAgICAgc2V0dXBUZW1wbGF0ZSgpO1xyXG4gICAgICBzZXR1cFNlbGVjdG9yKCk7XHJcbiAgICAgIHNldHVwRWxlbWVudCgpO1xyXG4gICAgICBzZXR1cEFjdGlvbnMoKTtcclxuXHJcbiAgICAgIC8vIGZvY3VzIHRyYXBcclxuICAgICAgZm9jdXNUcmFwSW5zdGFuY2UgPSBmb2N1c1RyYXAuY3JlYXRlRm9jdXNUcmFwKCR0YXJnZXQsIHtcclxuICAgICAgICBlc2NhcGVEZWFjdGl2YXRlczogcHJvcHMuZXNjLFxyXG4gICAgICAgIG9uQWN0aXZhdGU6IGFjdGlvbnMuZm9jdXNBY3RpdmF0ZSxcclxuICAgICAgICBvbkRlYWN0aXZhdGU6IGFjdGlvbnMuZm9jdXNEZWFjdGl2YXRlXHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgLy8gc3RhdGVcclxuICAgICAgLy8gc2V0U3RhdGUoeyBzdGF0ZTogcHJvcHMuc3RhdGUgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiB1cGRhdGVcclxuICAgICAqIEBwYXJhbSBfcHJvcHNcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gdXBkYXRlKF9wcm9wcykge1xyXG4gICAgICBpZiAoX3Byb3BzICYmIGV0VUkudXRpbHMuc2hhbGxvd0NvbXBhcmUocHJvcHMsIF9wcm9wcykgJiYgISR0YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLWluaXQnKSkgcmV0dXJuO1xyXG4gICAgICBkZXN0cm95KCk7XHJcblxyXG4gICAgICBzZXRQcm9wcyh7IC4uLnByb3BzLCAuLi5fcHJvcHMgfSk7XHJcbiAgICAgIHNldHVwKCk7XHJcbiAgICAgIHNldEV2ZW50KCk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZGVzdHJveSgpIHtcclxuICAgICAgcmVtb3ZlRXZlbnQoKTtcclxuICAgICAgJHRhcmdldC51aSA9IG51bGw7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyBmcmVxdWVuY3lcclxuICBmdW5jdGlvbiBzZXR1cFRlbXBsYXRlKCkge1xyXG4gICAgY29uc3QgeyAkdGVtcGxhdGVIVE1MLCAkdGVtcGxhdGVQcmV2aWV3SW1hZ2VIVE1MIH0gPSBldFVJLmhvb2tzLnVzZURpYWxvZ1RtcGwoKVxyXG4gICAgY29uc3QgdGVtcGxhdGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuXHJcblxyXG4gICAgaWYocHJvcHMuZGlhbG9nVHlwZSA9PT0gJ2FsZXJ0JyB8fCBwcm9wcy5kaWFsb2dUeXBlID09PSAnY29uZmlybScpe1xyXG4gICAgICB0ZW1wbGF0ZS5jbGFzc0xpc3QuYWRkKCdjb21wb25lbnQtZGlhbG9nJyk7XHJcbiAgICAgIHRlbXBsYXRlLmlubmVySFRNTCA9ICR0ZW1wbGF0ZUhUTUwocHJvcHMpO1xyXG4gICAgfWVsc2UgaWYocHJvcHMuZGlhbG9nVHlwZSA9PT0gJ3ByZXZpZXdJbWFnZScpe1xyXG4gICAgICB0ZW1wbGF0ZS5jbGFzc0xpc3QuYWRkKCdjb21wb25lbnQtZGlhbG9nJyk7XHJcbiAgICAgIHRlbXBsYXRlLmNsYXNzTGlzdC5hZGQoJ2RpYWxvZy1wcmV2aWV3LWltYWdlJyk7XHJcbiAgICAgIHRlbXBsYXRlLmlubmVySFRNTCA9ICR0ZW1wbGF0ZVByZXZpZXdJbWFnZUhUTUwocHJvcHMpO1xyXG4gICAgfVxyXG5cclxuICAgICRtb2RhbCA9IHRlbXBsYXRlO1xyXG4gICAgJHRhcmdldC5hcHBlbmRDaGlsZCh0ZW1wbGF0ZSk7XHJcbiAgICAvLyAkdGFyZ2V0LmlubmVySFRNTCA9IGBgO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gc2V0dXBTZWxlY3RvcigpIHtcclxuICAgIC8vIHNlbGVjdG9yXHJcbiAgICBtb2RhbENsb3NlQnRuU2VsZWN0b3IgPSAnLmRpYWxvZy1jbG9zZSc7XHJcbiAgICBtb2RhbERpbW1TZWxlY3RvciA9ICcuZGlhbG9nLWRpbW0nO1xyXG5cclxuICAgIC8vIGVsZW1lbnRcclxuICAgICRtb2RhbFRpdGxlID0gJG1vZGFsLnF1ZXJ5U2VsZWN0b3IoJy5kaWFsb2ctdGl0Jyk7XHJcbiAgICAkbW9kYWxEaW1tID0gJG1vZGFsLnF1ZXJ5U2VsZWN0b3IobW9kYWxEaW1tU2VsZWN0b3IpO1xyXG4gICAgJG1vZGFsQ29udGFpbmVyID0gJG1vZGFsLnF1ZXJ5U2VsZWN0b3IoJy5kaWFsb2ctY29udGFpbmVyJyk7XHJcblxyXG4gICAgbW9kYWxCdG5Qb3NpdGl2ZSA9ICcuZGlhbG9nLXBvc2l0aXZlJztcclxuICAgIG1vZGFsQnRuTmVnYXRpdmUgPSAnLmRpYWxvZy1uZWdhdGl2ZSc7XHJcbiAgICAkbW9kYWxCdG5Qb3NpdGl2ZSA9ICRtb2RhbC5xdWVyeVNlbGVjdG9yKCcuZGlhbG9nLXBvc2l0aXZlJyk7XHJcbiAgICAkbW9kYWxCdG5OZWdhdGl2ZSA9ICRtb2RhbC5xdWVyeVNlbGVjdG9yKCcuZGlhbG9nLW5lZ2F0aXZlJyk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBzZXR1cEVsZW1lbnQoKSB7XHJcbiAgICAvLyBzZXQgaWRcclxuICAgIGNvbnN0IGlkID0gZXRVSS51dGlscy5nZXRSYW5kb21VSUlEKG5hbWUpO1xyXG4gICAgY29uc3QgdGl0bGVJZCA9IGV0VUkudXRpbHMuZ2V0UmFuZG9tVUlJRChuYW1lICsgJy10aXQnKTtcclxuICAgIC8vIC8vIGExMXlcclxuXHJcbiAgICBpZihwcm9wcy5kaWFsb2dUeXBlID09PSAnYWxlcnQnIHx8IHByb3BzLmRpYWxvZ1R5cGUgPT09ICdjb25maXJtJyl7XHJcbiAgICAgIGV0VUkudXRpbHMuc2V0UHJvcGVydHkoJG1vZGFsLCAncm9sZScsICdhbGVydGRpYWxvZycpO1xyXG4gICAgfWVsc2UgaWYocHJvcHMuZGlhbG9nVHlwZSA9PT0gJ3ByZXZpZXdJbWFnZScpe1xyXG4gICAgICBldFVJLnV0aWxzLnNldFByb3BlcnR5KCRtb2RhbCwgJ3JvbGUnLCAnZGlhbG9nJyk7XHJcblxyXG4gICAgICBjb25zdCAkc3dpcGVyID0gJG1vZGFsLnF1ZXJ5U2VsZWN0b3IoJy5jb21wb25lbnQtc3dpcGVyJylcclxuICAgICAgY29uc3Qgc3dpcGVyID0gbmV3IGV0VUkuY29tcG9uZW50cy5Td2lwZXJDb21wKCk7XHJcbiAgICAgIHN3aXBlci5jb3JlLmluaXQoJHN3aXBlciwge1xyXG4gICAgICAgIG5hdmlnYXRpb246IHRydWUsXHJcbiAgICAgICAgcGFnaW5hdGlvbjogdHJ1ZVxyXG4gICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIGV0VUkudXRpbHMuc2V0UHJvcGVydHkoJG1vZGFsLCAnYXJpYS1tb2RhbCcsICd0cnVlJyk7XHJcbiAgICBldFVJLnV0aWxzLnNldFByb3BlcnR5KCRtb2RhbCwgJ2lkJywgaWQpO1xyXG4gICAgaWYgKCRtb2RhbFRpdGxlKSBldFVJLnV0aWxzLnNldFByb3BlcnR5KCRtb2RhbFRpdGxlLCAnaWQnLCB0aXRsZUlkKTtcclxuICAgIGV0VUkudXRpbHMuc2V0UHJvcGVydHkoJG1vZGFsLCAnYXJpYS1sYWJlbGxlZGJ5JywgdGl0bGVJZCk7XHJcbiAgICBldFVJLnV0aWxzLnNldFByb3BlcnR5KCRtb2RhbCwgJ3RhYmluZGV4JywgJy0xJyk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBzZXR1cEFjdGlvbnMoKSB7XHJcbiAgICBjb25zdCB7IGdldFRvcERlcHRoLCBzZXRMYXllck9wYWNpdHkgfSA9IGV0VUkuaG9va3MudXNlTGF5ZXIoJ2RpYWxvZycpO1xyXG5cclxuICAgIGFjdGlvbnMuZm9jdXNBY3RpdmF0ZSA9ICgpID0+IHtcclxuICAgIH1cclxuXHJcbiAgICBhY3Rpb25zLmZvY3VzRGVhY3RpdmF0ZSA9ICgpID0+IHtcclxuICAgICAgaWYoIXN0YXRlLnRyaWdnZXIpe1xyXG4gICAgICAgIGNhbGxiYWNrID0gcHJvcHMubmVnYXRpdmVDYWxsYmFja1xyXG4gICAgICB9XHJcbiAgICAgIGFjdGlvbnMuY2xvc2UoKTtcclxuICAgIH1cclxuXHJcbiAgICBhY3Rpb25zLm9wZW4gPSAoKSA9PiB7XHJcbiAgICAgIGNvbnN0IHpJbmRleCA9IGdldFRvcERlcHRoKCk7XHJcblxyXG4gICAgICAkbW9kYWwuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XHJcbiAgICAgICRtb2RhbC5zdHlsZS56SW5kZXggPSB6SW5kZXhcclxuXHJcbiAgICAgIHNldExheWVyT3BhY2l0eShESU1NX09QQUNJVFkpO1xyXG5cclxuICAgICAgZ3NhcC50aW1lbGluZSgpLnRvKCRtb2RhbERpbW0sIHsgZHVyYXRpb246IDAsIGRpc3BsYXk6ICdibG9jaycsIG9wYWNpdHk6IDAgfSkudG8oJG1vZGFsRGltbSwge1xyXG4gICAgICAgIGR1cmF0aW9uOiAwLjE1LFxyXG4gICAgICAgIG9wYWNpdHk6IDEsXHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgZ3NhcFxyXG4gICAgICAgIC50aW1lbGluZSgpXHJcbiAgICAgICAgLnRvKCRtb2RhbENvbnRhaW5lciwge1xyXG4gICAgICAgICAgZHVyYXRpb246IDAsXHJcbiAgICAgICAgICBkaXNwbGF5OiAnYmxvY2snLFxyXG4gICAgICAgICAgb3BhY2l0eTogMCxcclxuICAgICAgICAgIHNjYWxlOiAwLjk1LFxyXG4gICAgICAgICAgeVBlcmNlbnQ6IDIsXHJcbiAgICAgICAgfSlcclxuICAgICAgICAudG8oJG1vZGFsQ29udGFpbmVyLCB7IGR1cmF0aW9uOiAwLjE1LCBvcGFjaXR5OiAxLCBzY2FsZTogMSwgeVBlcmNlbnQ6IDAsIGVhc2U6ICdQb3dlcjIuZWFzZU91dCcgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgIGFjdGlvbnMuY2xvc2UgPSAoKSA9PiB7XHJcbiAgICAgIGdzYXAudGltZWxpbmUoKS50bygkbW9kYWxEaW1tLCB7XHJcbiAgICAgICAgZHVyYXRpb246IDAuMTUsXHJcbiAgICAgICAgb3BhY2l0eTogMCxcclxuICAgICAgICBvbkNvbXBsZXRlKCkge1xyXG4gICAgICAgICAgJG1vZGFsRGltbS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG4gICAgICAgIH0sXHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgZ3NhcC50aW1lbGluZSgpLnRvKCRtb2RhbENvbnRhaW5lciwge1xyXG4gICAgICAgIGR1cmF0aW9uOiAwLjE1LFxyXG4gICAgICAgIG9wYWNpdHk6IDAsXHJcbiAgICAgICAgc2NhbGU6IDAuOTUsXHJcbiAgICAgICAgeVBlcmNlbnQ6IDIsXHJcbiAgICAgICAgZWFzZTogJ1Bvd2VyMi5lYXNlT3V0JyxcclxuICAgICAgICBvbkNvbXBsZXRlKCkge1xyXG4gICAgICAgICAgJG1vZGFsQ29udGFpbmVyLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcbiAgICAgICAgICAkbW9kYWwuc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuICAgICAgICAgICRtb2RhbC5zdHlsZS56SW5kZXggPSBudWxsXHJcblxyXG4gICAgICAgICAgc2V0TGF5ZXJPcGFjaXR5KERJTU1fT1BBQ0lUWSk7XHJcblxyXG4gICAgICAgICAgaWYgKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBkZXN0cm95KCk7XHJcblxyXG4gICAgICAgICAgJHRhcmdldC5yZW1vdmVDaGlsZCgkbW9kYWwpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgIH0pO1xyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIHNldEV2ZW50KCkge1xyXG4gICAgYWRkRXZlbnQoJ2NsaWNrJywgbW9kYWxDbG9zZUJ0blNlbGVjdG9yLCBjbG9zZSk7XHJcblxyXG4gICAgaWYgKHByb3BzLmRpbW1DbGljaykge1xyXG4gICAgICBhZGRFdmVudCgnY2xpY2snLCBtb2RhbERpbW1TZWxlY3RvciwgY2xvc2UpO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZEV2ZW50KCdjbGljaycsIG1vZGFsQnRuUG9zaXRpdmUsICgpID0+IHtcclxuICAgICAgaWYgKHByb3BzLmNhbGxiYWNrKSB7XHJcbiAgICAgICAgY2FsbGJhY2sgPSBwcm9wcy5jYWxsYmFjaztcclxuICAgICAgfSBlbHNlIGlmIChwcm9wcy5wb3NpdGl2ZUNhbGxiYWNrKSB7XHJcbiAgICAgICAgY2FsbGJhY2sgPSBwcm9wcy5wb3NpdGl2ZUNhbGxiYWNrO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBjbG9zZSgnYnRuUG9zaXRpdmUnKTtcclxuICAgIH0pO1xyXG4gICAgYWRkRXZlbnQoJ2NsaWNrJywgbW9kYWxCdG5OZWdhdGl2ZSwgKCkgPT4ge1xyXG4gICAgICBjYWxsYmFjayA9IHByb3BzLm5lZ2F0aXZlQ2FsbGJhY2s7XHJcblxyXG4gICAgICBjbG9zZSgnYnRuTmVnYXRpdmUnKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gcmVuZGVyKCkge1xyXG4gICAgY29uc3QgaXNPcGVuZWQgPSBzdGF0ZS5zdGF0ZSA9PT0gJ29wZW4nO1xyXG5cclxuICAgIGlmIChpc09wZW5lZCkge1xyXG4gICAgICBhY3Rpb25zLm9wZW4oKTtcclxuXHJcbiAgICAgIGZvY3VzVHJhcEluc3RhbmNlLmFjdGl2YXRlKCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBmb2N1c1RyYXBJbnN0YW5jZS5kZWFjdGl2YXRlKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBvcGVuKCkge1xyXG4gICAgc2V0U3RhdGUoeyBzdGF0ZTogJ29wZW4nIH0pO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gY2xvc2UodHJpZ2dlcikge1xyXG4gICAgc2V0U3RhdGUoeyBzdGF0ZTogJ2Nsb3NlJywgdHJpZ2dlciB9KTtcclxuICB9XHJcblxyXG4gIGNvbXBvbmVudCA9IHtcclxuICAgIGNvcmU6IHtcclxuICAgICAgc3RhdGUsXHJcbiAgICAgIHByb3BzLFxyXG5cclxuICAgICAgaW5pdCxcclxuICAgICAgcmVtb3ZlRXZlbnQsXHJcbiAgICAgIGRlc3Ryb3ksXHJcbiAgICB9LFxyXG4gICAgdXBkYXRlLFxyXG4gICAgb3BlbixcclxuICAgIGNsb3NlLFxyXG4gIH07XHJcblxyXG4gIHJldHVybiBjb21wb25lbnQ7XHJcbn1cclxuIiwiLyoqXHJcbiAqICBNb2RhbFxyXG4gKi9cclxuZnVuY3Rpb24gTW9kYWwoKSB7XHJcbiAgY29uc3Qge1xyXG4gICAgYWN0aW9ucywgcHJvcHMsIHN0YXRlLCBzZXRQcm9wcywgc2V0U3RhdGUsIHNldFRhcmdldCwgYWRkRXZlbnQsIHJlbW92ZUV2ZW50XHJcbiAgfSA9IGV0VUkuaG9va3MudXNlQ29yZSh7XHJcbiAgICAvLyBwcm9wc1xyXG4gICAgZGltbUNsaWNrOiB0cnVlLFxyXG4gICAgZXNjOiB0cnVlLFxyXG4gIH0sIHtcclxuICAgIC8vIHN0YXRlXHJcblxyXG4gIH0sIHJlbmRlcik7XHJcblxyXG4gIC8vIGNvbnN0YW50XHJcbiAgY29uc3QgRElNTV9PUEFDSVRZID0gMC42O1xyXG5cclxuICAvLyB2YXJpYWJsZVxyXG4gIGNvbnN0IG5hbWUgPSAnbW9kYWwnO1xyXG4gIGxldCBjb21wb25lbnQgPSB7fTtcclxuXHJcbiAgbGV0IGZvY3VzVHJhcEluc3RhbmNlLFxyXG4gICAgbW9kYWxEaW1tU2VsZWN0b3IsIG1vZGFsQ2xvc2VCdG5TZWxlY3RvcjtcclxuICBsZXQgJHRhcmdldCwgJGh0bWwsXHJcbiAgICAkbW9kYWxUaXRsZSwgJG1vZGFsQ29udGFpbmVyLCAkbW9kYWxEaW1tO1xyXG5cclxuICB7XHJcbiAgICAvKipcclxuICAgICAqIGluaXRcclxuICAgICAqIEBwYXJhbSBfJHRhcmdldFxyXG4gICAgICogQHBhcmFtIF9wcm9wc1xyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBpbml0KF8kdGFyZ2V0LCBfcHJvcHMpIHtcclxuICAgICAgaWYodHlwZW9mIF8kdGFyZ2V0ID09PSAnc3RyaW5nJyl7XHJcbiAgICAgICAgJHRhcmdldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXyR0YXJnZXQpXHJcbiAgICAgIH1lbHNle1xyXG4gICAgICAgICR0YXJnZXQgPSBfJHRhcmdldDtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYoISR0YXJnZXQpe1xyXG4gICAgICAgIHRocm93IEVycm9yKCd0YXJnZXTsnbQg7KG07J6s7ZWY7KeAIOyViuyKteuLiOuLpC4nKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgc2V0VGFyZ2V0KCR0YXJnZXQpXHJcbiAgICAgIHNldFByb3BzKHsuLi5wcm9wcywgLi4uX3Byb3BzfSk7XHJcblxyXG4gICAgICBpZiAoJHRhcmdldC51aSkgcmV0dXJuO1xyXG4gICAgICAkdGFyZ2V0LnVpID0gY29tcG9uZW50O1xyXG5cclxuICAgICAgc2V0dXAoKTtcclxuICAgICAgc2V0RXZlbnQoKTtcclxuXHJcbiAgICAgICR0YXJnZXQuc2V0QXR0cmlidXRlKCdkYXRhLWluaXQnLCAndHJ1ZScpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHNldHVwKCkge1xyXG4gICAgICBzZXR1cFRlbXBsYXRlKCk7XHJcbiAgICAgIHNldHVwU2VsZWN0b3IoKTtcclxuICAgICAgc2V0dXBFbGVtZW50KCk7XHJcbiAgICAgIHNldHVwQWN0aW9ucygpO1xyXG5cclxuICAgICAgLy8gZm9jdXMgdHJhcFxyXG4gICAgICBmb2N1c1RyYXBJbnN0YW5jZSA9IGZvY3VzVHJhcC5jcmVhdGVGb2N1c1RyYXAoJHRhcmdldCwge1xyXG4gICAgICAgIGVzY2FwZURlYWN0aXZhdGVzOiBwcm9wcy5lc2MsXHJcbiAgICAgICAgb25BY3RpdmF0ZTogYWN0aW9ucy5mb2N1c0FjdGl2YXRlLFxyXG4gICAgICAgIG9uRGVhY3RpdmF0ZTogYWN0aW9ucy5mb2N1c0RlYWN0aXZhdGVcclxuICAgICAgfSk7XHJcblxyXG4gICAgICAvLyBzdGF0ZVxyXG4gICAgICAvLyBzZXRTdGF0ZSh7IHN0YXRlOiBwcm9wcy5zdGF0ZSB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIHVwZGF0ZVxyXG4gICAgICogQHBhcmFtIF9wcm9wc1xyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiB1cGRhdGUoX3Byb3BzKSB7XHJcbiAgICAgIGlmIChfcHJvcHMgJiYgZXRVSS51dGlscy5zaGFsbG93Q29tcGFyZShwcm9wcywgX3Byb3BzKSAmJiAhJHRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtaW5pdCcpKSByZXR1cm47XHJcbiAgICAgIGRlc3Ryb3koKTtcclxuXHJcbiAgICAgIHNldFByb3BzKHsgLi4ucHJvcHMsIC4uLl9wcm9wcyB9KTtcclxuICAgICAgc2V0dXAoKTtcclxuICAgICAgc2V0RXZlbnQoKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBkZXN0cm95KCkge1xyXG4gICAgICByZW1vdmVFdmVudCgpO1xyXG4gICAgICAkdGFyZ2V0LnVpID0gbnVsbDtcclxuICAgICAgJHRhcmdldC5yZW1vdmVBdHRyaWJ1dGUoJ2RhdGEtaW5pdCcpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gZnJlcXVlbmN5XHJcbiAgZnVuY3Rpb24gc2V0dXBUZW1wbGF0ZSgpIHtcclxuICAgIC8vICR0YXJnZXQuaW5uZXJIVE1MID0gYGA7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBzZXR1cFNlbGVjdG9yKCl7XHJcbiAgICAvLyBzZWxlY3RvclxyXG4gICAgbW9kYWxDbG9zZUJ0blNlbGVjdG9yID0gJy5tb2RhbC1jbG9zZSdcclxuICAgIG1vZGFsRGltbVNlbGVjdG9yID0gJy5tb2RhbC1kaW1tJ1xyXG5cclxuICAgIC8vIGVsZW1lbnRcclxuICAgICRtb2RhbFRpdGxlID0gJHRhcmdldC5xdWVyeVNlbGVjdG9yKCcubW9kYWwtdGl0JylcclxuICAgICRtb2RhbERpbW0gPSAkdGFyZ2V0LnF1ZXJ5U2VsZWN0b3IobW9kYWxEaW1tU2VsZWN0b3IpXHJcbiAgICAkbW9kYWxDb250YWluZXIgPSAkdGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoJy5tb2RhbC1jb250YWluZXInKVxyXG4gICAgJGh0bWwgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBzZXR1cEVsZW1lbnQoKSB7XHJcbiAgICAvLyBzZXQgaWRcclxuICAgIGNvbnN0IGlkID0gZXRVSS51dGlscy5nZXRSYW5kb21VSUlEKG5hbWUpO1xyXG4gICAgY29uc3QgdGl0bGVJZCA9IGV0VUkudXRpbHMuZ2V0UmFuZG9tVUlJRChuYW1lICsgJy10aXQnKVxyXG5cclxuICAgIC8vIGExMXlcclxuICAgIGV0VUkudXRpbHMuc2V0UHJvcGVydHkoJHRhcmdldCwgJ3JvbGUnLCAnZGlhbG9nJyk7XHJcbiAgICBldFVJLnV0aWxzLnNldFByb3BlcnR5KCR0YXJnZXQsICdhcmlhLW1vZGFsJywgJ3RydWUnKTtcclxuICAgIGV0VUkudXRpbHMuc2V0UHJvcGVydHkoJHRhcmdldCwgJ2lkJywgaWQpO1xyXG4gICAgaWYoJG1vZGFsVGl0bGUpIGV0VUkudXRpbHMuc2V0UHJvcGVydHkoJG1vZGFsVGl0bGUsICdpZCcsIHRpdGxlSWQpO1xyXG4gICAgZXRVSS51dGlscy5zZXRQcm9wZXJ0eSgkdGFyZ2V0LCAnYXJpYS1sYWJlbGxlZGJ5JywgdGl0bGVJZCk7XHJcbiAgICBldFVJLnV0aWxzLnNldFByb3BlcnR5KCR0YXJnZXQsICd0YWJpbmRleCcsICctMScpO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gc2V0dXBBY3Rpb25zKCl7XHJcbiAgICBjb25zdCB7IGdldFRvcERlcHRoLCBzZXRMYXllck9wYWNpdHkgfSA9IGV0VUkuaG9va3MudXNlTGF5ZXIoJ21vZGFsJyk7XHJcblxyXG4gICAgYWN0aW9ucy5mb2N1c0FjdGl2YXRlID0gKCkgPT4ge1xyXG4gICAgfVxyXG5cclxuICAgIGFjdGlvbnMuZm9jdXNEZWFjdGl2YXRlID0gKCkgPT4ge1xyXG4gICAgICBjbG9zZSgpO1xyXG4gICAgICAvLyBhY3Rpb25zLmNsb3NlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgYWN0aW9ucy5vcGVuID0gKCkgPT4ge1xyXG4gICAgICBjb25zdCB6SW5kZXggPSBnZXRUb3BEZXB0aCgpO1xyXG5cclxuICAgICAgJHRhcmdldC5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJ1xyXG4gICAgICAkdGFyZ2V0LnN0eWxlLnpJbmRleCA9IHpJbmRleFxyXG5cclxuICAgICAgc2V0TGF5ZXJPcGFjaXR5KERJTU1fT1BBQ0lUWSk7XHJcblxyXG4gICAgICBnc2FwLnRpbWVsaW5lKClcclxuICAgICAgICAudG8oJG1vZGFsRGltbSwge2R1cmF0aW9uOiAwLCBkaXNwbGF5OiAnYmxvY2snLCBvcGFjaXR5OiAwfSlcclxuICAgICAgICAudG8oJG1vZGFsRGltbSwge2R1cmF0aW9uOiAwLjE1LCBvcGFjaXR5OiAxfSlcclxuXHJcbiAgICAgIGdzYXAudGltZWxpbmUoKVxyXG4gICAgICAgIC50bygkbW9kYWxDb250YWluZXIsIHtkdXJhdGlvbjogMCwgZGlzcGxheTogJ2Jsb2NrJywgb3BhY2l0eTogMCwgc2NhbGU6IDAuOTUsIHlQZXJjZW50OiAyfSlcclxuICAgICAgICAudG8oJG1vZGFsQ29udGFpbmVyLCB7ZHVyYXRpb246IDAuMTUsIG9wYWNpdHk6IDEsIHNjYWxlOiAxLCB5UGVyY2VudDogMCwgZWFzZTogJ1Bvd2VyMi5lYXNlT3V0J30pXHJcbiAgICB9XHJcblxyXG4gICAgYWN0aW9ucy5jbG9zZSA9ICgpID0+IHtcclxuICAgICAgZ3NhcC50aW1lbGluZSgpXHJcbiAgICAgICAgLnRvKCRtb2RhbERpbW0sIHtkdXJhdGlvbjogMC4xNSwgb3BhY2l0eTogMCwgb25Db21wbGV0ZSgpe1xyXG4gICAgICAgICAgICAkbW9kYWxEaW1tLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcbiAgICAgICAgICB9fSlcclxuXHJcbiAgICAgIGdzYXAudGltZWxpbmUoKVxyXG4gICAgICAgIC50bygkbW9kYWxDb250YWluZXIsIHtkdXJhdGlvbjogMC4xNSwgb3BhY2l0eTogMCwgc2NhbGU6IDAuOTUsIHlQZXJjZW50OiAyLCBlYXNlOiAnUG93ZXIyLmVhc2VPdXQnLCBvbkNvbXBsZXRlKCl7XHJcbiAgICAgICAgICAgICRtb2RhbENvbnRhaW5lci5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG4gICAgICAgICAgICAkdGFyZ2V0LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcbiAgICAgICAgICAgICR0YXJnZXQuc3R5bGUuekluZGV4ID0gbnVsbFxyXG5cclxuICAgICAgICAgICAgc2V0TGF5ZXJPcGFjaXR5KERJTU1fT1BBQ0lUWSk7XHJcbiAgICAgICAgICB9fSlcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIHNldEV2ZW50KCkge1xyXG4gICAgYWRkRXZlbnQoJ2NsaWNrJywgbW9kYWxDbG9zZUJ0blNlbGVjdG9yLCBjbG9zZSk7XHJcblxyXG4gICAgaWYocHJvcHMuZGltbUNsaWNrKXtcclxuICAgICAgYWRkRXZlbnQoJ2NsaWNrJywgbW9kYWxEaW1tU2VsZWN0b3IsIGNsb3NlKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIHJlbmRlcigpIHtcclxuICAgIGNvbnN0IGlzT3BlbmVkID0gc3RhdGUuc3RhdGUgPT09ICdvcGVuJztcclxuXHJcbiAgICBpZihpc09wZW5lZCl7XHJcbiAgICAgIGFjdGlvbnMub3BlbigpXHJcblxyXG4gICAgICBmb2N1c1RyYXBJbnN0YW5jZS5hY3RpdmF0ZSgpO1xyXG4gICAgfWVsc2V7XHJcbiAgICAgIGFjdGlvbnMuY2xvc2UoKVxyXG5cclxuICAgICAgZm9jdXNUcmFwSW5zdGFuY2UuZGVhY3RpdmF0ZSgpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gb3Blbigpe1xyXG4gICAgc2V0U3RhdGUoe3N0YXRlOiAnb3Blbid9KTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGNsb3NlKCl7XHJcbiAgICBzZXRTdGF0ZSh7c3RhdGU6ICdjbG9zZSd9KTtcclxuICB9XHJcblxyXG4gIGNvbXBvbmVudCA9IHtcclxuICAgIGNvcmU6IHtcclxuICAgICAgc3RhdGUsXHJcbiAgICAgIHByb3BzLFxyXG5cclxuICAgICAgaW5pdCxcclxuICAgICAgcmVtb3ZlRXZlbnQsXHJcbiAgICAgIGRlc3Ryb3ksXHJcbiAgICB9LFxyXG4gICAgdXBkYXRlLFxyXG4gICAgb3BlbixcclxuICAgIGNsb3NlLFxyXG4gIH07XHJcblxyXG4gIHJldHVybiBjb21wb25lbnQ7XHJcbn1cclxuIiwiZnVuY3Rpb24gU2VsZWN0Qm94KCkge1xyXG4gIGNvbnN0IHsgYWN0aW9ucywgcHJvcHMsIHN0YXRlLCBzZXRQcm9wcywgc2V0U3RhdGUsIHNldFRhcmdldCwgYWRkRXZlbnQsIHJlbW92ZUV2ZW50IH0gPSBldFVJLmhvb2tzLnVzZUNvcmUoXHJcbiAgICB7XHJcbiAgICAgIHR5cGU6IFwiY3VzdG9tXCIsXHJcbiAgICAgIGxhYmVsOiBcIlwiLFxyXG4gICAgICBkZWZhdWx0OiBcIlwiLFxyXG4gICAgICBpdGVtczogW10sXHJcbiAgICAgIHNlbGVjdGVkSW5kZXg6IDAsXHJcbiAgICAgIHRyYW5zaXRpb246IFwibm9ybWFsXCIsXHJcbiAgICAgIHNjcm9sbFRvOiBmYWxzZSxcclxuICAgICAgZ3NhcE9wdGlvbjoge30sXHJcbiAgICAgIHN0YXRlOiBcImNsb3NlXCIsXHJcbiAgICB9LFxyXG4gICAge30sXHJcbiAgICByZW5kZXIsXHJcbiAgKTtcclxuICBjb25zdCB7ICR0ZW1wbGF0ZUN1c3RvbUhUTUwsICR0ZW1wbGF0ZUJhc2ljSFRNTCB9ID0gdXNlU2VsZWN0Qm94VGVtcCgpO1xyXG4gIGNvbnN0IHsgdXNlU2VsZWN0U2hvdyB9ID0gdXNlVHJhbnNpdGlvbigpO1xyXG5cclxuICAvLyBjb25zdGFudFxyXG4gIGNvbnN0IE1BUkdJTiA9IDIwO1xyXG5cclxuICAvLyB2YXJpYWJsZVxyXG4gIGNvbnN0IG5hbWUgPSBcInNlbGVjdFwiO1xyXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBwcmVmZXItY29uc3RcclxuICBsZXQgY29tcG9uZW50ID0ge307XHJcbiAgbGV0ICR0YXJnZXQsXHJcbiAgICAvLyDsmpTshozqtIDroKgg67OA7IiY65OkXHJcbiAgICBzZWxlY3RMYWJlbCxcclxuICAgIHNlbGVjdENvbWJvQm94LFxyXG4gICAgc2VsZWN0TGlzdEJveCxcclxuICAgIHNlbGVjdE9wdGlvbixcclxuICAgIHRpbWVsaW5lO1xyXG5cclxuICB7XHJcbiAgICBmdW5jdGlvbiBpbml0KF8kdGFyZ2V0LCBfcHJvcHMpIHtcclxuICAgICAgaWYgKHR5cGVvZiBfJHRhcmdldCA9PT0gXCJzdHJpbmdcIikge1xyXG4gICAgICAgICR0YXJnZXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKF8kdGFyZ2V0KTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICAkdGFyZ2V0ID0gXyR0YXJnZXQ7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICghJHRhcmdldCkge1xyXG4gICAgICAgIHRocm93IEVycm9yKFwidGFyZ2V07J20IOyhtOyerO2VmOyngCDslYrsirXri4jri6QuXCIpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBzZXRUYXJnZXQoJHRhcmdldCk7XHJcbiAgICAgIHNldFByb3BzKHsgLi4ucHJvcHMsIC4uLl9wcm9wcyB9KTtcclxuXHJcbiAgICAgIGlmICgkdGFyZ2V0LnVpKSByZXR1cm47XHJcbiAgICAgICR0YXJnZXQudWkgPSBjb21wb25lbnQ7XHJcblxyXG4gICAgICBzZXR1cCgpO1xyXG4gICAgICBzZXRFdmVudCgpO1xyXG5cclxuICAgICAgJHRhcmdldC5zZXRBdHRyaWJ1dGUoXCJkYXRhLWluaXRcIiwgXCJ0cnVlXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHNldHVwKCkge1xyXG4gICAgICBzZXR1cFRlbXBsYXRlKCk7XHJcblxyXG4gICAgICBpZiAocHJvcHMudHlwZSA9PT0gXCJiYXNpY1wiKSByZXR1cm47XHJcblxyXG4gICAgICBzZXR1cFNlbGVjdG9yKCk7XHJcbiAgICAgIHNldHVwRWxlbWVudCgpO1xyXG4gICAgICBzZXR1cEFjdGlvbnMoKTtcclxuXHJcbiAgICAgIC8vIGVmZmVjdFxyXG4gICAgICB0aW1lbGluZSA9IHVzZVNlbGVjdFNob3coJHRhcmdldC5xdWVyeVNlbGVjdG9yKHNlbGVjdExpc3RCb3gpLCBwcm9wcy50cmFuc2l0aW9uLCBwcm9wcy5nc2FwT3B0aW9uKS50aW1lbGluZTtcclxuXHJcbiAgICAgIC8vIHN0YXRlXHJcbiAgICAgIGFjdGlvbnNbcHJvcHMuc3RhdGUgfHwgc3RhdGUuc3RhdGVdPy4oKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiB1cGRhdGUoX3Byb3BzKSB7XHJcbiAgICAgIGlmIChfcHJvcHMgJiYgZXRVSS51dGlscy5zaGFsbG93Q29tcGFyZShwcm9wcywgX3Byb3BzKSAmJiAhJHRhcmdldC5nZXRBdHRyaWJ1dGUoXCJkYXRhLWluaXRcIikpIHJldHVybjtcclxuICAgICAgZGVzdHJveSgpO1xyXG4gICAgICBzZXRQcm9wcyh7IC4uLnByb3BzLCAuLi5fcHJvcHMgfSk7XHJcbiAgICAgIHNldHVwKCk7XHJcbiAgICAgIHNldEV2ZW50KCk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZGVzdHJveSgpIHtcclxuICAgICAgcmVtb3ZlRXZlbnQoKTtcclxuICAgICAgJHRhcmdldC51aSA9IG51bGw7XHJcbiAgICAgICR0YXJnZXQucmVtb3ZlQXR0cmlidXRlKFwiZGF0YS1pbml0XCIpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gZnJlcXVlbmN5XHJcbiAgZnVuY3Rpb24gc2V0dXBUZW1wbGF0ZSgpIHtcclxuICAgIGlmIChwcm9wcy5pdGVtcy5sZW5ndGggPCAxKSByZXR1cm47XHJcbiAgICBpZiAocHJvcHMudHlwZSA9PT0gXCJjdXN0b21cIikge1xyXG4gICAgICBjb25zdCB7IHNlbGVjdGVkSW5kZXggfSA9IHByb3BzO1xyXG4gICAgICBjb25zdCBpdGVtTGlzdFRlbXAgPSBwcm9wcy5pdGVtcy5tYXAoKGl0ZW0pID0+ICR0ZW1wbGF0ZUN1c3RvbUhUTUwuaXRlbXMoaXRlbSkpLmpvaW4oXCJcIik7XHJcblxyXG4gICAgICAkdGFyZ2V0LmlubmVySFRNTCA9IGBcclxuICAgICAgICAke3Byb3BzLmxhYmVsICYmICR0ZW1wbGF0ZUN1c3RvbUhUTUwubGFiZWwocHJvcHMubGFiZWwpfVxyXG4gICAgICAgICR7cHJvcHMuZGVmYXVsdCA/ICR0ZW1wbGF0ZUN1c3RvbUhUTUwuc2VsZWN0QnRuKHByb3BzLmRlZmF1bHQpIDogJHRlbXBsYXRlQ3VzdG9tSFRNTC5zZWxlY3RCdG4ocHJvcHMuaXRlbXMuZmluZCgoaXRlbSkgPT4gaXRlbS52YWx1ZSA9PSBwcm9wcy5pdGVtc1tzZWxlY3RlZEluZGV4XS52YWx1ZSkudGV4dCl9XHJcbiAgICAgICAgJHtwcm9wcy5pdGVtcyAmJiAkdGVtcGxhdGVDdXN0b21IVE1MLml0ZW1zV3JhcChpdGVtTGlzdFRlbXApfVxyXG4gICAgICBgO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgY29uc3Qgc2VsZWN0QnRuVGVtcCA9ICR0ZW1wbGF0ZUJhc2ljSFRNTC5zZWxlY3RCdG4ocHJvcHMuZGVmYXVsdCk7XHJcbiAgICAgIGNvbnN0IGl0ZW1MaXN0VGVtcCA9IHByb3BzLml0ZW1zLm1hcCgoaXRlbSkgPT4gJHRlbXBsYXRlQmFzaWNIVE1MLml0ZW1zKGl0ZW0pKS5qb2luKFwiXCIpO1xyXG5cclxuICAgICAgJHRhcmdldC5pbm5lckhUTUwgPSBgXHJcbiAgICAgICAgJHtwcm9wcy5sYWJlbCAmJiAkdGVtcGxhdGVCYXNpY0hUTUwubGFiZWwocHJvcHMubGFiZWwpfVxyXG4gICAgICAgICR7cHJvcHMuaXRlbXMgJiYgJHRlbXBsYXRlQmFzaWNIVE1MLml0ZW1zV3JhcChzZWxlY3RCdG5UZW1wICsgaXRlbUxpc3RUZW1wKX1cclxuICAgICAgYDtcclxuICAgIH1cclxuICB9XHJcbiAgZnVuY3Rpb24gc2V0dXBTZWxlY3RvcigpIHtcclxuICAgIHNlbGVjdExhYmVsID0gXCIuY29tYm8tbGFiZWxcIjtcclxuICAgIHNlbGVjdENvbWJvQm94ID0gXCIuc2VsZWN0LWJveFwiO1xyXG4gICAgc2VsZWN0TGlzdEJveCA9IFwiLnNlbGVjdC1vcHRpb25zXCI7XHJcbiAgICBzZWxlY3RPcHRpb24gPSBcIi5vcHRpb25cIjtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIHNldHVwRWxlbWVudCgpIHtcclxuICAgIC8vIGlkXHJcbiAgICBjb25zdCBsYWJlbElkID0gZXRVSS51dGlscy5nZXRSYW5kb21VSUlEKG5hbWUpO1xyXG4gICAgY29uc3QgY29tYm9Cb3hJZCA9IGV0VUkudXRpbHMuZ2V0UmFuZG9tVUlJRChcImNvbWJvYm94XCIpO1xyXG4gICAgY29uc3QgbGlzdEJveElkID0gZXRVSS51dGlscy5nZXRSYW5kb21VSUlEKFwibGlzdGJveFwiKTtcclxuXHJcbiAgICAvLyBhMTF5XHJcbiAgICBldFVJLnV0aWxzLnNldFByb3BlcnR5KCR0YXJnZXQsIHNlbGVjdExhYmVsLCBcImlkXCIsIGxhYmVsSWQpO1xyXG4gICAgZXRVSS51dGlscy5zZXRQcm9wZXJ0eSgkdGFyZ2V0LCBzZWxlY3RDb21ib0JveCwgXCJpZFwiLCBjb21ib0JveElkKTtcclxuICAgIGV0VUkudXRpbHMuc2V0UHJvcGVydHkoJHRhcmdldCwgc2VsZWN0Q29tYm9Cb3gsIFwicm9sZVwiLCBcImNvbWJvYm94XCIpO1xyXG4gICAgZXRVSS51dGlscy5zZXRQcm9wZXJ0eSgkdGFyZ2V0LCBzZWxlY3RDb21ib0JveCwgXCJhcmlhLWxhYmVsbGVkYnlcIiwgbGFiZWxJZCk7XHJcbiAgICBldFVJLnV0aWxzLnNldFByb3BlcnR5KCR0YXJnZXQsIHNlbGVjdENvbWJvQm94LCBcImFyaWEtY29udHJvbHNcIiwgbGlzdEJveElkKTtcclxuICAgIGV0VUkudXRpbHMuc2V0UHJvcGVydHkoJHRhcmdldCwgc2VsZWN0TGlzdEJveCwgXCJpZFwiLCBsaXN0Qm94SWQpO1xyXG4gICAgZXRVSS51dGlscy5zZXRQcm9wZXJ0eSgkdGFyZ2V0LCBzZWxlY3RMaXN0Qm94LCBcInJvbGVcIiwgXCJsaXN0Ym94XCIpO1xyXG4gICAgZXRVSS51dGlscy5zZXRQcm9wZXJ0eSgkdGFyZ2V0LCBzZWxlY3RMaXN0Qm94LCBcImFyaWEtbGFiZWxsZWRieVwiLCBsYWJlbElkKTtcclxuICAgIGV0VUkudXRpbHMuc2V0UHJvcGVydHkoJHRhcmdldCwgc2VsZWN0TGlzdEJveCwgXCJ0YWJpbmRleFwiLCAtMSk7XHJcblxyXG4gICAgLy8gc2VsZWN0IHByb3BlcnR5XHJcbiAgICBjb25zdCBvcHRpb25zID0gJHRhcmdldC5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdE9wdGlvbik7XHJcbiAgICBvcHRpb25zLmZvckVhY2goKGVsLCBpbmRleCkgPT4ge1xyXG4gICAgICBjb25zdCBvcHRpb25JZCA9IGV0VUkudXRpbHMuZ2V0UmFuZG9tVUlJRChcIm9wdGlvblwiKTtcclxuXHJcbiAgICAgICR0YXJnZXRbaW5kZXhdID0gZWw7XHJcbiAgICAgIGVsW1wiaW5kZXhcIl0gPSBpbmRleDtcclxuICAgICAgZWwuc2V0QXR0cmlidXRlKFwiaWRcIiwgb3B0aW9uSWQpO1xyXG4gICAgICBlbC5zZXRBdHRyaWJ1dGUoXCJyb2xlXCIsIFwib3B0aW9uXCIpO1xyXG4gICAgICBlbC5zZXRBdHRyaWJ1dGUoXCJhcmlhLXNlbGVjdGVkXCIsIGZhbHNlKTtcclxuXHJcbiAgICAgIHByb3BzLml0ZW1zW2luZGV4XT8uZGlzYWJsZWQgJiYgZWwuc2V0QXR0cmlidXRlKFwiZGlzYWJsZWRcIiwgXCJcIik7XHJcblxyXG4gICAgICBpZiAoISR0YXJnZXRbXCJvcHRpb25zXCJdKSAkdGFyZ2V0W1wib3B0aW9uc1wiXSA9IFtdO1xyXG4gICAgICAkdGFyZ2V0W1wib3B0aW9uc1wiXVtpbmRleF0gPSBlbDtcclxuICAgIH0pO1xyXG5cclxuICAgICFwcm9wcy5kZWZhdWx0ICYmIHNlbGVjdEl0ZW0ob3B0aW9uc1twcm9wcy5zZWxlY3RlZEluZGV4XSk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBzZXR1cEFjdGlvbnMoKSB7XHJcbiAgICBsZXQgc2VsZWN0SW5kZXggPSBpc05hTigkdGFyZ2V0LnNlbGVjdGVkSW5kZXgpID8gLTEgOiAkdGFyZ2V0LnNlbGVjdGVkSW5kZXg7XHJcblxyXG4gICAgZnVuY3Rpb24gdXBkYXRlSW5kZXgoc3RhdGUpIHtcclxuICAgICAgaWYgKCFzdGF0ZSkgcmV0dXJuO1xyXG4gICAgICBzZWxlY3RJbmRleCA9IGlzTmFOKCR0YXJnZXQuc2VsZWN0ZWRJbmRleCkgPyAtMSA6ICR0YXJnZXQuc2VsZWN0ZWRJbmRleDtcclxuICAgICAgdXBkYXRlQ3VycmVudENsYXNzKCR0YXJnZXRbc2VsZWN0SW5kZXhdKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBrZXlFdmVudENhbGxiYWNrKCkge1xyXG4gICAgICB1cGRhdGVDdXJyZW50Q2xhc3MoJHRhcmdldFtzZWxlY3RJbmRleF0pO1xyXG4gICAgICBldFVJLnV0aWxzLnNldFByb3BlcnR5KCR0YXJnZXQsIHNlbGVjdENvbWJvQm94LCBcImFyaWEtYWN0aXZlZGVzY2VuZGFudFwiLCAkdGFyZ2V0W3NlbGVjdEluZGV4XS5pZCk7XHJcbiAgICAgICR0YXJnZXQucXVlcnlTZWxlY3RvcihgJHtzZWxlY3RDb21ib0JveH0gOmxhc3QtY2hpbGRgKS50ZXh0Q29udGVudCA9ICR0YXJnZXRbc2VsZWN0SW5kZXhdLnRleHRDb250ZW50O1xyXG4gICAgfVxyXG5cclxuICAgIGFjdGlvbnMub3BlbiA9ICgpID0+IHtcclxuICAgICAgJHRhcmdldC5xdWVyeVNlbGVjdG9yKHNlbGVjdENvbWJvQm94KT8uZm9jdXMoKTtcclxuICAgICAgb3BlblN0YXRlKCk7XHJcbiAgICAgIHVwZGF0ZUluZGV4KHRydWUpO1xyXG4gICAgfTtcclxuICAgIGFjdGlvbnMuY2xvc2UgPSAoKSA9PiB7XHJcbiAgICAgICR0YXJnZXQucXVlcnlTZWxlY3RvcihgJHtzZWxlY3RDb21ib0JveH0gOmxhc3QtY2hpbGRgKS50ZXh0Q29udGVudCA9ICR0YXJnZXRbXCJvcHRpb25zXCJdWyR0YXJnZXQuc2VsZWN0ZWRJbmRleF0/LnRleHRDb250ZW50ID8/IHByb3BzLmRlZmF1bHQ7XHJcbiAgICAgIGNsb3NlU3RhdGUoKTtcclxuICAgIH07XHJcbiAgICBhY3Rpb25zLnNlbGVjdCA9ICgpID0+IHtcclxuICAgICAgY29uc3QgY3VycmVudEVsID0gJHRhcmdldC5xdWVyeVNlbGVjdG9yKFwiLmN1cnJlbnRcIik7XHJcbiAgICAgIHNlbGVjdEl0ZW0oY3VycmVudEVsKTtcclxuICAgICAgY2xvc2VTdGF0ZSgpO1xyXG4gICAgfTtcclxuXHJcbiAgICBhY3Rpb25zLmZpcnN0ID0gKCkgPT4ge1xyXG4gICAgICBzZWxlY3RJbmRleCA9IDA7XHJcbiAgICAgIGtleUV2ZW50Q2FsbGJhY2soKTtcclxuICAgIH07XHJcbiAgICBhY3Rpb25zLmxhc3QgPSAoKSA9PiB7XHJcbiAgICAgIHNlbGVjdEluZGV4ID0gJHRhcmdldFtcIm9wdGlvbnNcIl0ubGVuZ3RoIC0gMTtcclxuICAgICAga2V5RXZlbnRDYWxsYmFjaygpO1xyXG4gICAgfTtcclxuICAgIGFjdGlvbnMudXAgPSAoKSA9PiB7XHJcbiAgICAgIHNlbGVjdEluZGV4ID0gTWF0aC5tYXgoLS1zZWxlY3RJbmRleCwgMCk7XHJcbiAgICAgIGtleUV2ZW50Q2FsbGJhY2soKTtcclxuICAgIH07XHJcbiAgICBhY3Rpb25zLmRvd24gPSAoKSA9PiB7XHJcbiAgICAgIHNlbGVjdEluZGV4ID0gTWF0aC5taW4oKytzZWxlY3RJbmRleCwgJHRhcmdldFtcIm9wdGlvbnNcIl0ubGVuZ3RoIC0gMSk7XHJcbiAgICAgIGtleUV2ZW50Q2FsbGJhY2soKTtcclxuICAgIH07XHJcblxyXG4gICAgY29tcG9uZW50Lm9wZW4gPSBhY3Rpb25zLm9wZW47XHJcbiAgICBjb21wb25lbnQuY2xvc2UgPSBhY3Rpb25zLmNsb3NlO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gc2V0RXZlbnQoKSB7XHJcbiAgICBpZiAocHJvcHMudHlwZSA9PT0gXCJiYXNpY1wiKSByZXR1cm47XHJcblxyXG4gICAgLy8gYTExeVxyXG4gICAgY29uc3QgYWN0aW9uTGlzdCA9IHtcclxuICAgICAgdXA6IFtcIkFycm93VXBcIl0sXHJcbiAgICAgIGRvd246IFtcIkFycm93RG93blwiXSxcclxuICAgICAgZmlyc3Q6IFtcIkhvbWVcIiwgXCJQYWdlVXBcIl0sXHJcbiAgICAgIGxhc3Q6IFtcIkVuZFwiLCBcIlBhZ2VEb3duXCJdLFxyXG4gICAgICBjbG9zZTogW1wiRXNjYXBlXCJdLFxyXG4gICAgICBzZWxlY3Q6IFtcIkVudGVyXCIsIFwiIFwiXSxcclxuICAgIH07XHJcblxyXG4gICAgYWRkRXZlbnQoXCJibHVyXCIsIHNlbGVjdENvbWJvQm94LCAoZSkgPT4ge1xyXG4gICAgICBpZiAoZS5yZWxhdGVkVGFyZ2V0Py5yb2xlID09PSBcImxpc3Rib3hcIikgcmV0dXJuO1xyXG4gICAgICBhY3Rpb25zLmNsb3NlKCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBhZGRFdmVudChcImNsaWNrXCIsIHNlbGVjdENvbWJvQm94LCAoeyB0YXJnZXQgfSkgPT4ge1xyXG4gICAgICBjb25zdCB0b2dnbGVTdGF0ZSA9IHN0YXRlLnN0YXRlID09PSBcIm9wZW5cIiA/IFwiY2xvc2VcIiA6IFwib3BlblwiO1xyXG4gICAgICBhY3Rpb25zW3RvZ2dsZVN0YXRlXT8uKCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBhMTF5XHJcbiAgICBhZGRFdmVudChcImtleWRvd25cIiwgc2VsZWN0Q29tYm9Cb3gsIChlKSA9PiB7XHJcbiAgICAgIGlmIChzdGF0ZS5zdGF0ZSA9PT0gXCJjbG9zZVwiKSByZXR1cm47XHJcblxyXG4gICAgICBjb25zdCB7IGtleSB9ID0gZTtcclxuICAgICAgY29uc3QgYWN0aW9uID0gT2JqZWN0LmVudHJpZXMoYWN0aW9uTGlzdCkuZmluZCgoW18sIGtleXNdKSA9PiBrZXlzLmluY2x1ZGVzKGtleSkpO1xyXG5cclxuICAgICAgaWYgKGFjdGlvbikge1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICBjb25zdCBbYWN0aW9uTmFtZV0gPSBhY3Rpb247XHJcbiAgICAgICAgYWN0aW9uc1thY3Rpb25OYW1lXT8uKCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIGFkZEV2ZW50KFwiY2xpY2tcIiwgc2VsZWN0TGlzdEJveCwgKHsgdGFyZ2V0IH0pID0+IHtcclxuICAgICAgaWYgKCF0YXJnZXQucm9sZSA9PT0gXCJvcHRpb25cIikgcmV0dXJuO1xyXG4gICAgICB1cGRhdGVDdXJyZW50Q2xhc3ModGFyZ2V0KTtcclxuICAgICAgYWN0aW9ucy5zZWxlY3QoKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gcmVuZGVyKCkge1xyXG4gICAgY29uc3QgaXNPcGVuZWQgPSBzdGF0ZS5zdGF0ZSA9PT0gXCJvcGVuXCI7XHJcblxyXG4gICAgcHJvcHMudHJhbnNpdGlvbiAmJiB0aW1lbGluZShpc09wZW5lZCk7XHJcbiAgICBjaGVja09wZW5EaXIoaXNPcGVuZWQpO1xyXG5cclxuICAgIGV0VUkudXRpbHMuc2V0UHJvcGVydHkoJHRhcmdldCwgc2VsZWN0Q29tYm9Cb3gsIFwiYXJpYS1leHBhbmRlZFwiLCBpc09wZW5lZCk7XHJcblxyXG4gICAgY29uc3Qgc2VsZWN0ZWRFbCA9ICR0YXJnZXQucXVlcnlTZWxlY3RvcignW2FyaWEtc2VsZWN0ZWQ9XCJ0cnVlXCJdJyk7XHJcbiAgICBpZiAoaXNPcGVuZWQpIGV0VUkudXRpbHMuc2V0UHJvcGVydHkoJHRhcmdldCwgc2VsZWN0Q29tYm9Cb3gsIFwiYXJpYS1hY3RpdmVkZXNjZW5kYW50XCIsIHNlbGVjdGVkRWw/LmlkID8/IFwiXCIpO1xyXG4gICAgZWxzZSBldFVJLnV0aWxzLnNldFByb3BlcnR5KCR0YXJnZXQsIHNlbGVjdENvbWJvQm94LCBcImFyaWEtYWN0aXZlZGVzY2VuZGFudFwiLCBcIlwiKTtcclxuICB9XHJcblxyXG4gIC8vIGN1c3RvbVxyXG4gIGZ1bmN0aW9uIGNoZWNrT3BlbkRpcihzdGF0ZSkge1xyXG4gICAgaWYgKCFzdGF0ZSB8fCBwcm9wcy5zY3JvbGxUbykgcmV0dXJuOyAvLyBmYWxzZeydtOqxsOuCmCBzY3JvbGxUbyDquLDriqUg7J6I7J2EIOuVjCAtIOyVhOuemOuhnCDsl7TrprxcclxuXHJcbiAgICBjb25zdCB7IGhlaWdodDogbGlzdEhlaWdodCB9ID0gZXRVSS5ob29rcy51c2VHZXRDbGllbnRSZWN0KCR0YXJnZXQsIHNlbGVjdExpc3RCb3gpO1xyXG4gICAgY29uc3QgeyBoZWlnaHQ6IGNvbWJvSGVpZ2h0LCBib3R0b206IGNvbWJvQm90dG9tIH0gPSBldFVJLmhvb2tzLnVzZUdldENsaWVudFJlY3QoJHRhcmdldCwgc2VsZWN0Q29tYm9Cb3gpO1xyXG4gICAgY29uc3Qgcm9sZSA9IHdpbmRvdy5pbm5lckhlaWdodCAtIE1BUkdJTiA8IGNvbWJvQm90dG9tICsgbGlzdEhlaWdodDtcclxuXHJcbiAgICBldFVJLnV0aWxzLnNldFN0eWxlKCR0YXJnZXQsIHNlbGVjdExpc3RCb3gsIFwiYm90dG9tXCIsIHJvbGUgPyBjb21ib0hlaWdodCArIFwicHhcIiA6IFwiXCIpO1xyXG4gIH1cclxuXHJcbiAgLy8gdXBkYXRlIC5jdXJyZW50IGNsYXNzXHJcbiAgZnVuY3Rpb24gdXBkYXRlQ3VycmVudENsYXNzKGFkZENsYXNzRWwpIHtcclxuICAgICR0YXJnZXQucXVlcnlTZWxlY3RvcihcIi5jdXJyZW50XCIpPy5jbGFzc0xpc3QucmVtb3ZlKFwiY3VycmVudFwiKTtcclxuICAgIGFkZENsYXNzRWw/LmNsYXNzTGlzdC5hZGQoXCJjdXJyZW50XCIpO1xyXG4gIH1cclxuXHJcbiAgLy8gc2VsZWN0IGl0ZW1cclxuICBmdW5jdGlvbiBzZWxlY3RJdGVtKHRhcmdldCkge1xyXG4gICAgY29uc3QgdGFyZ2V0T3B0aW9uID0gdGFyZ2V0Py5jbG9zZXN0KHNlbGVjdE9wdGlvbik7XHJcblxyXG4gICAgaWYgKCF0YXJnZXRPcHRpb24pIHJldHVybjtcclxuXHJcbiAgICAkdGFyZ2V0LnNlbGVjdGVkSW5kZXggPSB0YXJnZXRPcHRpb25bXCJpbmRleFwiXTtcclxuICAgICR0YXJnZXQudmFsdWUgPSB0YXJnZXRPcHRpb24uZ2V0QXR0cmlidXRlKFwiZGF0YS12YWx1ZVwiKTtcclxuXHJcbiAgICBldFVJLnV0aWxzLnNldFByb3BlcnR5KCR0YXJnZXQsICdbYXJpYS1zZWxlY3RlZD1cInRydWVcIl0nLCBcImFyaWEtc2VsZWN0ZWRcIiwgZmFsc2UpO1xyXG4gICAgdGFyZ2V0T3B0aW9uLnNldEF0dHJpYnV0ZShcImFyaWEtc2VsZWN0ZWRcIiwgdHJ1ZSk7XHJcblxyXG4gICAgdXBkYXRlQ3VycmVudENsYXNzKCR0YXJnZXQucXVlcnlTZWxlY3RvcignW2FyaWEtc2VsZWN0ZWQ9XCJ0cnVlXCJdJykpO1xyXG4gICAgJHRhcmdldC5xdWVyeVNlbGVjdG9yKGAke3NlbGVjdENvbWJvQm94fSA6bGFzdC1jaGlsZGApLnRleHRDb250ZW50ID0gdGFyZ2V0T3B0aW9uLnRleHRDb250ZW50O1xyXG4gIH1cclxuXHJcbiAgLy8gc2VsZWN0IHN0YXRlXHJcbiAgZnVuY3Rpb24gb3BlblN0YXRlKCkge1xyXG4gICAgc2V0U3RhdGUoeyBzdGF0ZTogXCJvcGVuXCIgfSk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBjbG9zZVN0YXRlKCkge1xyXG4gICAgc2V0U3RhdGUoeyBzdGF0ZTogXCJjbG9zZVwiIH0pO1xyXG4gIH1cclxuXHJcbiAgY29tcG9uZW50ID0ge1xyXG4gICAgY29yZToge1xyXG4gICAgICBzdGF0ZSxcclxuICAgICAgcHJvcHMsXHJcblxyXG4gICAgICBpbml0LFxyXG4gICAgICByZW1vdmVFdmVudCxcclxuICAgICAgZGVzdHJveSxcclxuICAgIH0sXHJcblxyXG4gICAgdXBkYXRlLFxyXG4gICAgb3BlbixcclxuICAgIGNsb3NlLFxyXG4gIH07XHJcblxyXG4gIHJldHVybiBjb21wb25lbnQ7XHJcbn1cclxuIiwiLyoqXHJcbiAqIFNrZWxcclxuICogLy8gaW5pdCwgc2V0dXAsIHVwZGF0ZSwgZGVzdHJveVxyXG4gKiAvLyBzZXR1cFRlbXBsYXRlLCBzZXR1cFNlbGVjdG9yLCBzZXR1cEVsZW1lbnQsIHNldHVwQWN0aW9ucyxcclxuICogICAgICBzZXRFdmVudCwgcmVuZGVyLCBjdXN0b21GbiwgY2FsbGFibGVcclxuICpcclxuICogICAgICBkb23rp4wg7J207Jqp7ZW07IScIHVpIOy0iOq4sO2ZlFxyXG4gKiAgICAgICAgZGF0YS1wcm9wcy1vcHQxLCBkYXRhLXByb3BzLW9wdDIsIGRhdGEtcHJvcHMtb3B0M1xyXG4gKiAgICAgIOqzoOq4ieyYteyFmFxyXG4gKiAgICAgICAgZGF0YS1pbml0PWZhbHNlXHJcbiAqICAgICAgICBjb25zdCBpbnN0YW5jZSA9IG5ldyBTa2VsKCk7XHJcbiAqICAgICAgICBpbnN0YW5jZS5jb3JlLmluaXQoJy5zZWxlY3RvcicsIHsgb3B0MTogJ3ZhbHVlJyB9KVxyXG4gKlxyXG4gKiAgICAgIGRhdGEtaW5pdCDsspjrpqxcclxuICovXHJcbmZ1bmN0aW9uIFNrZWwoKSB7XHJcbiAgY29uc3Qge1xyXG4gICAgYWN0aW9ucywgcHJvcHMsIHN0YXRlLCBzZXRQcm9wcywgc2V0U3RhdGUsIHNldFRhcmdldCwgYWRkRXZlbnQsIHJlbW92ZUV2ZW50XHJcbiAgfSA9IGV0VUkuaG9va3MudXNlQ29yZSh7XHJcbiAgICAvLyBwcm9wc1xyXG5cclxuICB9LCB7XHJcbiAgICAvLyBzdGF0ZVxyXG5cclxuICB9LCByZW5kZXIpO1xyXG5cclxuICAvLyBjb25zdGFudFxyXG4gIGNvbnN0IE1BUkdJTiA9IDIwO1xyXG5cclxuICAvLyB2YXJpYWJsZVxyXG4gIGNvbnN0IG5hbWUgPSAnc2tlbCc7XHJcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHByZWZlci1jb25zdFxyXG4gIGxldCBjb21wb25lbnQgPSB7fTtcclxuICAgIC8vIGVsZW1lbnQsIHNlbGVjdG9yXHJcbiAgbGV0ICR0YXJnZXQsXHJcbiAgICBzb21lU2VsZWN0b3IsIG90aGVyU2VsZWN0b3IsXHJcbiAgICAkdGFyZ2V0RWxzMSwgJHRhcmdldEVsczJcclxuXHJcbiAge1xyXG4gICAgLyoqXHJcbiAgICAgKiBpbml0XHJcbiAgICAgKiBAcGFyYW0gXyR0YXJnZXRcclxuICAgICAqIEBwYXJhbSBfcHJvcHNcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gaW5pdChfJHRhcmdldCwgX3Byb3BzKSB7XHJcbiAgICAgIGlmKHR5cGVvZiBfJHRhcmdldCA9PT0gJ3N0cmluZycpe1xyXG4gICAgICAgICR0YXJnZXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKF8kdGFyZ2V0KVxyXG4gICAgICB9ZWxzZXtcclxuICAgICAgICAkdGFyZ2V0ID0gXyR0YXJnZXQ7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmKCEkdGFyZ2V0KXtcclxuICAgICAgICB0aHJvdyBFcnJvcigndGFyZ2V07J20IOyhtOyerO2VmOyngCDslYrsirXri4jri6QuJyk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHNldFRhcmdldCgkdGFyZ2V0KVxyXG4gICAgICBzZXRQcm9wcyh7Li4ucHJvcHMsIC4uLl9wcm9wc30pO1xyXG5cclxuICAgICAgaWYgKCR0YXJnZXQudWkpIHJldHVybjtcclxuICAgICAgJHRhcmdldC51aSA9IGNvbXBvbmVudDtcclxuXHJcbiAgICAgIHNldHVwKCk7XHJcbiAgICAgIHNldEV2ZW50KCk7XHJcblxyXG4gICAgICAkdGFyZ2V0LnNldEF0dHJpYnV0ZSgnZGF0YS1pbml0JywgJ3RydWUnKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBzZXR1cCgpIHtcclxuICAgICAgLy8gdGVtcGxhdGUsIHNlbGVjdG9yLCBlbGVtZW50LCBhY3Rpb25zXHJcbiAgICAgIHNldHVwVGVtcGxhdGUoKTtcclxuICAgICAgc2V0dXBTZWxlY3RvcigpXHJcbiAgICAgIHNldHVwRWxlbWVudCgpO1xyXG4gICAgICBzZXR1cEFjdGlvbnMoKTtcclxuXHJcbiAgICAgIC8vIHN0YXRlXHJcbiAgICAgIHNldFN0YXRlKHsgc3RhdGU6IHByb3BzLnN0YXRlIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogdXBkYXRlXHJcbiAgICAgKiBAcGFyYW0gX3Byb3BzXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIHVwZGF0ZShfcHJvcHMpIHtcclxuICAgICAgaWYgKF9wcm9wcyAmJiBldFVJLnV0aWxzLnNoYWxsb3dDb21wYXJlKHByb3BzLCBfcHJvcHMpICYmICEkdGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS1pbml0JykpIHJldHVybjtcclxuICAgICAgZGVzdHJveSgpO1xyXG5cclxuICAgICAgc2V0UHJvcHMoeyAuLi5wcm9wcywgLi4uX3Byb3BzIH0pO1xyXG4gICAgICBzZXR1cCgpO1xyXG4gICAgICBzZXRFdmVudCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGRlc3Ryb3koKSB7XHJcbiAgICAgIHJlbW92ZUV2ZW50KCk7XHJcbiAgICAgICR0YXJnZXQudWkgPSBudWxsO1xyXG4gICAgICAkdGFyZ2V0LnJlbW92ZUF0dHJpYnV0ZSgnZGF0YS1pbml0Jyk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyBmcmVxdWVuY3lcclxuICBmdW5jdGlvbiBzZXR1cFRlbXBsYXRlKCkge1xyXG4gICAgLy8gJHRhcmdldC5pbm5lckhUTUwgPSBgYDtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIHNldHVwU2VsZWN0b3IoKXtcclxuICAgICR0YXJnZXRFbHMyID0gJy5lbDInO1xyXG4gICAgJHRhcmdldEVsczEgPSAnLmVsMSc7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBzZXR1cEVsZW1lbnQoKSB7XHJcbiAgICAvLyBpZFxyXG4gICAgY29uc3QgbGFiZWxJZCA9IGV0VUkudXRpbHMuZ2V0UmFuZG9tVUlJRChuYW1lKTtcclxuXHJcbiAgICAvLyBhMTF5XHJcbiAgICB1dGlscy5zZXRQcm9wZXJ0eSgkdGFyZ2V0LCAkc2VsZWN0TGFiZWwsICdpZCcsIGxhYmVsSWQpO1xyXG5cclxuICAgIC8vIGNvbXBvbmVudCBjdXN0b20gZWxlbWVudFxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gc2V0dXBBY3Rpb25zKCl7XHJcbiAgICBhY3Rpb25zLm9wZW4gPSAoKSA9PiB7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGFjdGlvbnMuY2xvc2UgPSAoKSA9PiB7XHJcblxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gc2V0RXZlbnQoKSB7XHJcbiAgICBhZGRFdmVudCgnY2xpY2snLCAkdGFyZ2V0RWxzMSwgKHsgdGFyZ2V0IH0pID0+IHtcclxuICAgICAgLy8gaGFuZGxlclxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiByZW5kZXIoKSB7XHJcbiAgICAvLyByZW5kZXJcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIG9wZW4oKSB7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBjbG9zZSgpIHtcclxuICB9XHJcblxyXG4gIGNvbXBvbmVudCA9IHtcclxuICAgIGNvcmU6IHtcclxuICAgICAgc3RhdGUsXHJcbiAgICAgIHByb3BzLFxyXG4gICAgICBpbml0LFxyXG4gICAgICByZW1vdmVFdmVudCxcclxuICAgICAgZGVzdHJveSxcclxuICAgIH0sXHJcblxyXG4gICAgLy8gY2FsbGFibGVcclxuICAgIHVwZGF0ZSxcclxuICAgIG9wZW4sXHJcbiAgICBjbG9zZSxcclxuICB9XHJcblxyXG4gIHJldHVybiBjb21wb25lbnQ7XHJcbn1cclxuIiwiZnVuY3Rpb24gU3dpcGVyQ29tcCgpIHtcclxuICBjb25zdCB7XHJcbiAgICBhY3Rpb25zLCBwcm9wcywgc3RhdGUsIHNldFN0YXRlLCBzZXRQcm9wcywgc2V0VGFyZ2V0LCBhZGRFdmVudCwgcmVtb3ZlRXZlbnRcclxuICB9ID0gZXRVSS5ob29rcy51c2VDb3JlKFxyXG4gICAge1xyXG4gICAgICBsb29wOiB0cnVlLFxyXG4gICAgICBvbjoge1xyXG4gICAgICAgIHNsaWRlQ2hhbmdlVHJhbnNpdGlvbkVuZCgpIHtcclxuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGAke3RoaXMucmVhbEluZGV4ICsgMX3rsogg7Ke4IHNsaWRlYCk7XHJcbiAgICAgICAgICBzZXRTdGF0ZSh7IGFjdGl2ZUluZGV4OiB0aGlzLnJlYWxJbmRleCArIDEgfSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIHN0YXRlOiBcIlwiLFxyXG4gICAgICBydW5uaW5nOiBcIlwiLFxyXG4gICAgICBhY3RpdmVJbmRleDogMCxcclxuICAgIH0sXHJcbiAgICByZW5kZXIsXHJcbiAgKTtcclxuXHJcbiAgLyoqXHJcbiAgICogZGF0YS1wcm9wcyDrpqzsiqTtirhcclxuICAgKi9cclxuXHJcbiAgICAvLyBjb25zdGFudFxyXG4gIGNvbnN0IE1BUkdJTiA9IDIwO1xyXG5cclxuICAvLyB2YXJpYWJsZVxyXG4gIGNvbnN0IG5hbWUgPSBcInN3aXBlclwiO1xyXG4gIGxldCBjb21wb25lbnQgPSB7fTtcclxuICAvLyBlbGVtZW50LCBzZWxlY3RvclxyXG4gIGxldCAkdGFyZ2V0LCAkc3dpcGVyLCAkc3dpcGVyTmF2aWdhdGlvbiwgJHN3aXBlclBhZ2luYXRpb24sICRzd2lwZXJBdXRvcGxheSwgJHN3aXBlclNsaWRlVG9CdXR0b247XHJcblxyXG4gIHtcclxuICAgIC8qKlxyXG4gICAgICogaW5pdFxyXG4gICAgICogQHBhcmFtIF8kdGFyZ2V0XHJcbiAgICAgKiBAcGFyYW0gX3Byb3BzXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGluaXQoXyR0YXJnZXQsIF9wcm9wcykge1xyXG4gICAgICBpZiAodHlwZW9mIF8kdGFyZ2V0ID09PSBcInN0cmluZ1wiKSB7XHJcbiAgICAgICAgJHRhcmdldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXyR0YXJnZXQpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgICR0YXJnZXQgPSBfJHRhcmdldDtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKCEkdGFyZ2V0KSB7XHJcbiAgICAgICAgdGhyb3cgRXJyb3IoXCJ0YXJnZXTsnbQg7KG07J6s7ZWY7KeAIOyViuyKteuLiOuLpC5cIik7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHNldFRhcmdldCgkdGFyZ2V0KTtcclxuICAgICAgc2V0UHJvcHMoeyAuLi5wcm9wcywgLi4uX3Byb3BzIH0pO1xyXG5cclxuICAgICAgaWYgKCR0YXJnZXQudWkpIHJldHVybjtcclxuICAgICAgJHRhcmdldC51aSA9IGNvbXBvbmVudDtcclxuXHJcbiAgICAgIHNldHVwKCk7XHJcbiAgICAgIHNldEV2ZW50KCk7XHJcblxyXG4gICAgICAkdGFyZ2V0LnNldEF0dHJpYnV0ZShcImRhdGEtaW5pdFwiLCBcInRydWVcIik7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gc2V0dXAoKSB7XHJcbiAgICAgIC8vIHRlbXBsYXRlLCBzZWxlY3RvciwgZWxlbWVudCwgYWN0aW9uc1xyXG4gICAgICBzZXR1cFRlbXBsYXRlKCk7XHJcbiAgICAgIHNldHVwU2VsZWN0b3IoKTtcclxuICAgICAgc2V0dXBFbGVtZW50KCk7XHJcbiAgICAgIHNldHVwQWN0aW9ucygpO1xyXG5cclxuICAgICAgLy8gc3RhdGVcclxuICAgICAgc2V0U3RhdGUoeyBzdGF0ZTogcHJvcHMuc3RhdGUgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiB1cGRhdGVcclxuICAgICAqIEBwYXJhbSBfcHJvcHNcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gdXBkYXRlKF9wcm9wcykge1xyXG4gICAgICBpZiAocHJvcHMgJiYgdXRpbHMuc2hhbGxvd0NvbXBhcmUocHJvcHMsIF9wcm9wcykgJiYgISR0YXJnZXQuZ2V0QXR0cmlidXRlKFwiZGF0YS1pbml0XCIpKSByZXR1cm47XHJcbiAgICAgIGRlc3Ryb3koKTtcclxuXHJcbiAgICAgIHNldFByb3BzKHsgLi4ucHJvcHMsIC4uLl9wcm9wcyB9KTtcclxuICAgICAgc2V0dXAoKTtcclxuICAgICAgc2V0RXZlbnQoKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBkZXN0cm95KCkge1xyXG4gICAgICByZW1vdmVFdmVudCgpO1xyXG4gICAgICAkdGFyZ2V0LnVpID0gbnVsbDtcclxuICAgICAgJHRhcmdldC5yZW1vdmVBdHRyaWJ1dGUoXCJkYXRhLWluaXRcIik7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyBmcmVxdWVuY3lcclxuICBmdW5jdGlvbiBzZXR1cFRlbXBsYXRlKCkge1xyXG4gICAgY29uc3QgeyBuYXZpZ2F0aW9uLCBwYWdpbmF0aW9uLCBhdXRvcGxheSB9ID0gcHJvcHM7XHJcbiAgICBjb25zdCB7ICR0ZW1wbGF0ZUhUTUwgfSA9IHVzZVN3aXBlclRtcGwoKTtcclxuICAgIGxldCBuYXZpZ2F0aW9uRWwsIHBhZ2luYXRpb25FbCwgYXV0b3BsYXlFbDtcclxuXHJcbiAgICBmdW5jdGlvbiBjcmVhdGVIVE1MRWxlbWVudChfY2xhc3NOYW1lLCBodG1sU3RyaW5nKSB7XHJcbiAgICAgIGNvbnN0IHRlbXBsYXRlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgdGVtcGxhdGUuY2xhc3NMaXN0LmFkZChfY2xhc3NOYW1lKTtcclxuICAgICAgdGVtcGxhdGUuaW5uZXJIVE1MID0gaHRtbFN0cmluZztcclxuICAgICAgcmV0dXJuIHRlbXBsYXRlO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChuYXZpZ2F0aW9uKSB7XHJcbiAgICAgIG5hdmlnYXRpb25FbCA9IGNyZWF0ZUhUTUxFbGVtZW50KFwic3dpcGVyLW5hdmlnYXRpb25cIiwgJHRlbXBsYXRlSFRNTC5uYXZpZ2F0aW9uKCkpO1xyXG4gICAgICAkdGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoXCIuc3dpcGVyLXdyYXBwZXJcIikuYWZ0ZXIobmF2aWdhdGlvbkVsKTtcclxuICAgICAgdHlwZW9mIG5hdmlnYXRpb24gPT09IFwiYm9vbGVhblwiICYmXHJcbiAgICAgIHNldFByb3BzKHtcclxuICAgICAgICBuYXZpZ2F0aW9uOiB7XHJcbiAgICAgICAgICBwcmV2RWw6IFwiLnN3aXBlci1idXR0b24tcHJldlwiLFxyXG4gICAgICAgICAgbmV4dEVsOiBcIi5zd2lwZXItYnV0dG9uLW5leHRcIixcclxuICAgICAgICB9LFxyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAocGFnaW5hdGlvbikge1xyXG4gICAgICBwYWdpbmF0aW9uRWwgPSBjcmVhdGVIVE1MRWxlbWVudChcInN3aXBlci1wYWdpbmF0aW9uLXdyYXBcIiwgJHRlbXBsYXRlSFRNTC5wYWdpbmF0aW9uKCkpO1xyXG4gICAgICAkdGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoXCIuc3dpcGVyLXdyYXBwZXJcIikuYWZ0ZXIocGFnaW5hdGlvbkVsKTtcclxuICAgICAgdHlwZW9mIHBhZ2luYXRpb24gPT09IFwiYm9vbGVhblwiICYmXHJcbiAgICAgIHNldFByb3BzKHtcclxuICAgICAgICBwYWdpbmF0aW9uOiB7XHJcbiAgICAgICAgICBlbDogXCIuc3dpcGVyLXBhZ2luYXRpb25cIixcclxuICAgICAgICB9LFxyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoYXV0b3BsYXkpIHtcclxuICAgICAgYXV0b3BsYXlFbCA9IGNyZWF0ZUhUTUxFbGVtZW50KFwic3dpcGVyLWF1dG9wbGF5LXdyYXBcIiwgJHRlbXBsYXRlSFRNTC5hdXRvcGxheSgpKTtcclxuICAgICAgJHRhcmdldC5xdWVyeVNlbGVjdG9yKFwiLnN3aXBlci13cmFwcGVyXCIpLmFmdGVyKGF1dG9wbGF5RWwpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gc2V0dXBTZWxlY3RvcigpIHtcclxuICAgICRzd2lwZXJQYWdpbmF0aW9uID0gXCIuc3dpcGVyLXBhZ2luYXRpb25cIjtcclxuICAgICRzd2lwZXJOYXZpZ2F0aW9uID0gXCIuc3dpcGVyLW5hdmlnYXRpb25cIjtcclxuICAgICRzd2lwZXJBdXRvcGxheSA9IFwiLnN3aXBlci1hdXRvcGxheVwiO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gc2V0dXBFbGVtZW50KCkge1xyXG4gICAgLy8gaWRcclxuXHJcbiAgICAvLyBhMTF5XHJcblxyXG4gICAgLy8gbmV3IFN3aXBlciDsg53shLFcclxuICAgICRzd2lwZXIgPSBuZXcgU3dpcGVyKCR0YXJnZXQsIHsgLi4ucHJvcHMgfSk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBzZXR1cEFjdGlvbnMoKSB7XHJcbiAgICAvLyBhY3Rpb25zLnN0YXJ0ID0gKCkgPT4ge1xyXG4gICAgLy8gICBwbGF5KCk7XHJcbiAgICAvLyB9O1xyXG4gICAgLy9cclxuICAgIC8vIGFjdGlvbnMuc3RvcCA9ICgpID0+IHtcclxuICAgIC8vICAgc3RvcCgpO1xyXG4gICAgLy8gfTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIHNldEV2ZW50KCkge1xyXG4gICAgLy8gYXV0b3BsYXkg67KE7Yq8XHJcbiAgICBpZiAocHJvcHMuYXV0b3BsYXkpIHtcclxuICAgICAgYWRkRXZlbnQoXCJjbGlja1wiLCAkc3dpcGVyQXV0b3BsYXksIChldmVudCkgPT4ge1xyXG4gICAgICAgIGNvbnN0ICRldmVudFRhcmdldCA9IGV2ZW50LnRhcmdldC5jbG9zZXN0KCRzd2lwZXJBdXRvcGxheSk7XHJcbiAgICAgICAgaGFuZGxlQXV0b3BsYXkoJGV2ZW50VGFyZ2V0KTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiByZW5kZXIoKSB7XHJcbiAgICAvLyByZW5kZXJcclxuICB9XHJcblxyXG4gIC8vIGF1dG9wbGF5IOq0gOugqCDsu6TsiqTthYAg7ZWo7IiYXHJcbiAgZnVuY3Rpb24gaGFuZGxlQXV0b3BsYXkoJHRhcmdldCkge1xyXG4gICAgJHRhcmdldC5jbGFzc0xpc3QudG9nZ2xlKFwicGxheVwiKTtcclxuICAgICR0YXJnZXQuY2xhc3NMaXN0LnRvZ2dsZShcInN0b3BcIik7XHJcblxyXG4gICAgaWYgKCR0YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKFwic3RvcFwiKSkge1xyXG4gICAgICBzdG9wKCk7XHJcbiAgICB9IGVsc2UgaWYgKCR0YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKFwicGxheVwiKSkge1xyXG4gICAgICBwbGF5KCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBwbGF5KCkge1xyXG4gICAgJHN3aXBlci5hdXRvcGxheS5zdGFydCgpO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gc3RvcCgpIHtcclxuICAgICRzd2lwZXIuYXV0b3BsYXkuc3RvcCgpO1xyXG4gIH1cclxuXHJcbiAgLy8g7Yq57KCVIOyKrOudvOydtOuTnOuhnCDsnbTrj5lcclxuICBmdW5jdGlvbiBtb3ZlVG9TbGlkZShpbmRleCwgc3BlZWQsIHJ1bkNhbGxiYWNrcykge1xyXG4gICAgaWYgKHByb3BzLmxvb3ApIHtcclxuICAgICAgJHN3aXBlci5zbGlkZVRvTG9vcChpbmRleCwgc3BlZWQsIHJ1bkNhbGxiYWNrcyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAkc3dpcGVyLnNsaWRlVG8oaW5kZXgpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgY29tcG9uZW50ID0ge1xyXG4gICAgY29yZToge1xyXG4gICAgICBzdGF0ZSxcclxuICAgICAgcHJvcHMsXHJcbiAgICAgIGluaXQsXHJcbiAgICAgIHJlbW92ZUV2ZW50LFxyXG4gICAgICBkZXN0cm95LFxyXG4gICAgfSxcclxuICAgIC8vIGNhbGxhYmxlXHJcbiAgICB1cGRhdGUsXHJcbiAgICBnZXRTd2lwZXJJbnN0YW5jZSgpIHtcclxuICAgICAgcmV0dXJuICRzd2lwZXI7IC8vICRzd2lwZXIg7J247Iqk7YS07IqkIOuwmO2ZmFxyXG4gICAgfSxcclxuICB9O1xyXG5cclxuICByZXR1cm4gY29tcG9uZW50O1xyXG59XHJcbiIsIi8qKlxyXG4gKiBTa2VsXHJcbiAqIC8vIGluaXQsIHNldHVwLCB1cGRhdGUsIGRlc3Ryb3lcclxuICogLy8gc2V0dXBUZW1wbGF0ZSwgc2V0dXBTZWxlY3Rvciwgc2V0dXBFbGVtZW50LCBzZXR1cEFjdGlvbnMsXHJcbiAqICAgICAgc2V0RXZlbnQsIHJlbmRlciwgY3VzdG9tRm4sIGNhbGxhYmxlXHJcbiAqL1xyXG5mdW5jdGlvbiBUYWIoKSB7XHJcbiAgY29uc3QgeyBhY3Rpb25zLCBwcm9wcywgc3RhdGUsIHNldFByb3BzLCBzZXRTdGF0ZSwgc2V0VGFyZ2V0LCBhZGRFdmVudCwgcmVtb3ZlRXZlbnQgfSA9IGV0VUkuaG9va3MudXNlQ29yZShcclxuICAgIHtcclxuICAgICAgLy8gcHJvcHNcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIC8vIHN0YXRlXHJcbiAgICB9LFxyXG4gICAgcmVuZGVyLFxyXG4gICk7XHJcblxyXG4gIC8vIHZhcmlhYmxlXHJcbiAgY29uc3QgbmFtZSA9IFwidGFiXCI7XHJcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHByZWZlci1jb25zdFxyXG4gIGxldCBjb21wb25lbnQgPSB7fTtcclxuICAvLyBlbGVtZW50LCBzZWxlY3RvclxyXG4gIGxldCAkdGFyZ2V0LCB0YWJIZWFkLCAkdGFiSGVhZEVsLCB0YWJCdG4sICR0YWJCdG5FbCwgdGFiQ29udGVudCwgJHRhYkNvbnRlbnRFbDtcclxuXHJcbiAge1xyXG4gICAgLyoqXHJcbiAgICAgKiBpbml0XHJcbiAgICAgKiBAcGFyYW0gXyR0YXJnZXRcclxuICAgICAqIEBwYXJhbSBfcHJvcHNcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gaW5pdChfJHRhcmdldCwgX3Byb3BzKSB7XHJcbiAgICAgIGlmICh0eXBlb2YgXyR0YXJnZXQgPT09IFwic3RyaW5nXCIpIHtcclxuICAgICAgICAkdGFyZ2V0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihfJHRhcmdldCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgJHRhcmdldCA9IF8kdGFyZ2V0O1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoISR0YXJnZXQpIHtcclxuICAgICAgICB0aHJvdyBFcnJvcihcInRhcmdldOydtCDsobTsnqztlZjsp4Ag7JWK7Iq164uI64ukLlwiKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgc2V0VGFyZ2V0KCR0YXJnZXQpO1xyXG4gICAgICBzZXRQcm9wcyh7IC4uLnByb3BzLCAuLi5fcHJvcHMgfSk7XHJcblxyXG4gICAgICBpZiAoJHRhcmdldC51aSkgcmV0dXJuO1xyXG4gICAgICAkdGFyZ2V0LnVpID0gY29tcG9uZW50O1xyXG5cclxuICAgICAgc2V0dXAoKTtcclxuICAgICAgc2V0RXZlbnQoKTtcclxuXHJcbiAgICAgICR0YXJnZXQuc2V0QXR0cmlidXRlKFwiZGF0YS1pbml0XCIsIFwidHJ1ZVwiKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBzZXR1cCgpIHtcclxuICAgICAgc2V0dXBUZW1wbGF0ZSgpO1xyXG4gICAgICBzZXR1cFNlbGVjdG9yKCk7XHJcbiAgICAgIHNldHVwRWxlbWVudCgpO1xyXG4gICAgICBzZXR1cEFjdGlvbnMoKTtcclxuXHJcbiAgICAgIC8vIGVmZmVjdFxyXG4gICAgICBwcm9wcy5zdGlja3kgJiYgc3RpY2t5VGFiKCk7XHJcblxyXG4gICAgICAvLyBzdGF0ZVxyXG4gICAgICBzZXRTdGF0ZSh7IGFjdGl2ZVZhbHVlOiBwcm9wcy5hY3RpdmUgPz8gJHRhYkJ0bkVsWzBdLmdldEF0dHJpYnV0ZShcImRhdGEtdGFiLXZhbHVlXCIpIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogdXBkYXRlXHJcbiAgICAgKiBAcGFyYW0gX3Byb3BzXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIHVwZGF0ZShfcHJvcHMpIHtcclxuICAgICAgaWYgKF9wcm9wcyAmJiBldFVJLnV0aWxzLnNoYWxsb3dDb21wYXJlKHByb3BzLCBfcHJvcHMpICYmICEkdGFyZ2V0LmdldEF0dHJpYnV0ZShcImRhdGEtaW5pdFwiKSkgcmV0dXJuO1xyXG4gICAgICBkZXN0cm95KCk7XHJcblxyXG4gICAgICBzZXRQcm9wcyh7IC4uLnByb3BzLCAuLi5fcHJvcHMgfSk7XHJcbiAgICAgIHNldHVwKCk7XHJcbiAgICAgIHNldEV2ZW50KCk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZGVzdHJveSgpIHtcclxuICAgICAgcmVtb3ZlRXZlbnQoKTtcclxuICAgICAgJHRhcmdldC51aSA9IG51bGw7XHJcbiAgICAgICR0YXJnZXQucmVtb3ZlQXR0cmlidXRlKFwiZGF0YS1pbml0XCIpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gZnJlcXVlbmN5XHJcbiAgZnVuY3Rpb24gc2V0dXBUZW1wbGF0ZSgpIHtcclxuICAgIC8vICR0YXJnZXQuaW5uZXJIVE1MID0gYGA7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBzZXR1cFNlbGVjdG9yKCkge1xyXG4gICAgLy8gc2VsZWN0b3JcclxuICAgIHRhYkhlYWQgPSBcIi50YWItaGVhZFwiO1xyXG4gICAgdGFiQnRuID0gXCIudGFiLWxhYmVsXCI7XHJcbiAgICB0YWJDb250ZW50ID0gXCIudGFiLWNvbnRlbnRcIjtcclxuXHJcbiAgICAvLyBlbGVtZW50XHJcbiAgICAkdGFiSGVhZEVsID0gJHRhcmdldC5xdWVyeVNlbGVjdG9yKHRhYkhlYWQpO1xyXG4gICAgJHRhYkJ0bkVsID0gJHRhcmdldC5xdWVyeVNlbGVjdG9yQWxsKHRhYkJ0bik7XHJcbiAgICAkdGFiQ29udGVudEVsID0gJHRhcmdldC5xdWVyeVNlbGVjdG9yQWxsKHRhYkNvbnRlbnQpO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gc2V0dXBFbGVtZW50KCkge1xyXG4gICAgLy8gaWRcclxuICAgIC8vIGExMXlcclxuICAgIGV0VUkudXRpbHMuc2V0UHJvcGVydHkoJHRhcmdldCwgdGFiSGVhZCwgXCJyb2xlXCIsIFwidGFibGlzdFwiKTtcclxuXHJcbiAgICAvLyBjb21wb25lbnQgY3VzdG9tIGVsZW1lbnRcclxuICAgICR0YWJIZWFkRWwuc3R5bGUudG91Y2hBY3Rpb24gPSBcIm5vbmVcIjtcclxuICAgICR0YWJCdG5FbC5mb3JFYWNoKCh0YWIsIGluZGV4KSA9PiB7XHJcbiAgICAgIGNvbnN0IHRhYkJ0bklkID0gZXRVSS51dGlscy5nZXRSYW5kb21VSUlEKG5hbWUpO1xyXG4gICAgICBjb25zdCB0YWJDb250ZW50SWQgPSBldFVJLnV0aWxzLmdldFJhbmRvbVVJSUQoXCJ0YWJwYW5lbFwiKTtcclxuXHJcbiAgICAgIHRhYi5zZXRBdHRyaWJ1dGUoXCJpZFwiLCB0YWJCdG5JZCk7XHJcbiAgICAgIHRhYi5zZXRBdHRyaWJ1dGUoXCJyb2xlXCIsIFwidGFiXCIpO1xyXG4gICAgICB0YWIuc2V0QXR0cmlidXRlKFwiYXJpYS1zZWxlY3RlZFwiLCBmYWxzZSk7XHJcblxyXG4gICAgICBpZiAoJHRhYkNvbnRlbnRFbFtpbmRleF0pIHtcclxuICAgICAgICAkdGFiQ29udGVudEVsW2luZGV4XS5zZXRBdHRyaWJ1dGUoXCJpZFwiLCB0YWJDb250ZW50SWQpO1xyXG4gICAgICAgICR0YWJDb250ZW50RWxbaW5kZXhdLnNldEF0dHJpYnV0ZShcInJvbGVcIiwgXCJ0YWJwYW5lbFwiKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgY29uc3QgdGFiVmFsdWUgPSB0YWIuZ2V0QXR0cmlidXRlKFwiZGF0YS10YWItdmFsdWVcIik7XHJcbiAgICAgIGNvbnN0IHRhYkNvbnRlbnRWYWx1ZSA9ICR0YWJDb250ZW50RWxbaW5kZXhdLmdldEF0dHJpYnV0ZShcImRhdGEtdGFiLXZhbHVlXCIpO1xyXG4gICAgICBldFVJLnV0aWxzLnNldFByb3BlcnR5KCR0YXJnZXQsIGAke3RhYkNvbnRlbnR9W2RhdGEtdGFiLXZhbHVlPVwiJHt0YWJWYWx1ZX1cIl1gLCBcImFyaWEtbGFiZWxsZWRieVwiLCB0YWIuaWQpO1xyXG4gICAgICBldFVJLnV0aWxzLnNldFByb3BlcnR5KCR0YXJnZXQsIGAke3RhYkJ0bn1bZGF0YS10YWItdmFsdWU9XCIke3RhYkNvbnRlbnRWYWx1ZX1cIl1gLCBcImFyaWEtY29udHJvbHNcIiwgJHRhYkNvbnRlbnRFbFtpbmRleF0uaWQpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBzZXR1cEFjdGlvbnMoKSB7XHJcbiAgICBsZXQgc3RhcnRYID0gMDtcclxuICAgIGxldCBlbmRYID0gMDtcclxuICAgIGxldCBtb3ZlWCA9IDA7XHJcbiAgICBsZXQgc2Nyb2xsTGVmdCA9IDA7XHJcbiAgICBsZXQgaXNSZWFkeU1vdmUgPSBmYWxzZTtcclxuICAgIGxldCBjbGlja2FibGUgPSB0cnVlO1xyXG5cclxuICAgIGFjdGlvbnMuc2VsZWN0ID0gKGUpID0+IHtcclxuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgY29uc3QgdGFyZ2V0QnRuID0gZS50YXJnZXQuY2xvc2VzdCh0YWJCdG4pO1xyXG4gICAgICBpZiAoIXRhcmdldEJ0bikgcmV0dXJuO1xyXG4gICAgICBpZiAoIWNsaWNrYWJsZSkgcmV0dXJuO1xyXG4gICAgICBzZXRTdGF0ZSh7IGFjdGl2ZVZhbHVlOiB0YXJnZXRCdG4uZ2V0QXR0cmlidXRlKFwiZGF0YS10YWItdmFsdWVcIikgfSk7XHJcbiAgICAgIGdzYXAudG8oJHRhYkhlYWRFbCwge1xyXG4gICAgICAgIGR1cmF0aW9uOiAwLjUsXHJcbiAgICAgICAgc2Nyb2xsTGVmdDogdGFyZ2V0QnRuLm9mZnNldExlZnQsXHJcbiAgICAgICAgb3ZlcndyaXRlOiB0cnVlLFxyXG4gICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgYWN0aW9ucy5kcmFnU3RhcnQgPSAoZSkgPT4ge1xyXG4gICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICBpZiAoaXNSZWFkeU1vdmUpIHJldHVybjtcclxuICAgICAgaXNSZWFkeU1vdmUgPSB0cnVlO1xyXG4gICAgICBzdGFydFggPSBlLng7XHJcbiAgICAgIHNjcm9sbExlZnQgPSAkdGFiSGVhZEVsLnNjcm9sbExlZnQ7XHJcbiAgICB9O1xyXG4gICAgYWN0aW9ucy5kcmFnTW92ZSA9IChlKSA9PiB7XHJcbiAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgIGlmICghaXNSZWFkeU1vdmUpIHJldHVybjtcclxuICAgICAgbW92ZVggPSBlLng7XHJcbiAgICAgICR0YWJIZWFkRWwuc2Nyb2xsTGVmdCA9IHNjcm9sbExlZnQgKyAoc3RhcnRYIC0gbW92ZVgpO1xyXG4gICAgfTtcclxuICAgIGFjdGlvbnMuZHJhZ0VuZCA9IChlKSA9PiB7XHJcbiAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgIGlmICghaXNSZWFkeU1vdmUpIHJldHVybjtcclxuICAgICAgZW5kWCA9IGUueDtcclxuICAgICAgaWYgKE1hdGguYWJzKHN0YXJ0WCAtIGVuZFgpIDwgMTApIGNsaWNrYWJsZSA9IHRydWU7XHJcbiAgICAgIGVsc2UgY2xpY2thYmxlID0gZmFsc2U7XHJcbiAgICAgIGlzUmVhZHlNb3ZlID0gZmFsc2U7XHJcbiAgICB9O1xyXG4gICAgYWN0aW9ucy5kcmFnTGVhdmUgPSAoZSkgPT4ge1xyXG4gICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICBpZiAoIWlzUmVhZHlNb3ZlKSByZXR1cm47XHJcblxyXG4gICAgICAvLyBnc2FwLnRvKCR0YWJIZWFkRWwsIHtcclxuICAgICAgLy8gICBzY3JvbGxMZWZ0OiAkdGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoJ1thcmlhLXNlbGVjdGVkPVwidHJ1ZVwiXScpLm9mZnNldExlZnQsXHJcbiAgICAgIC8vICAgb3ZlcndyaXRlOiB0cnVlLFxyXG4gICAgICAvLyB9KTtcclxuXHJcbiAgICAgIGNsaWNrYWJsZSA9IHRydWU7XHJcbiAgICAgIGlzUmVhZHlNb3ZlID0gZmFsc2U7XHJcbiAgICB9O1xyXG5cclxuICAgIGFjdGlvbnMudXAgPSAoZSkgPT4ge1xyXG4gICAgICBpZiAoIWUudGFyZ2V0LnByZXZpb3VzRWxlbWVudFNpYmxpbmcpIHJldHVybjtcclxuICAgICAgc2V0U3RhdGUoeyBhY3RpdmVWYWx1ZTogZS50YXJnZXQucHJldmlvdXNFbGVtZW50U2libGluZy5nZXRBdHRyaWJ1dGUoXCJkYXRhLXRhYi12YWx1ZVwiKSB9KTtcclxuICAgICAgZm9jdXNUYXJnZXRWYWx1ZSh0YWJCdG4sIHN0YXRlLmFjdGl2ZVZhbHVlKTtcclxuICAgIH07XHJcbiAgICBhY3Rpb25zLmRvd24gPSAoZSkgPT4ge1xyXG4gICAgICBpZiAoIWUudGFyZ2V0Lm5leHRFbGVtZW50U2libGluZykgcmV0dXJuO1xyXG4gICAgICBzZXRTdGF0ZSh7IGFjdGl2ZVZhbHVlOiBlLnRhcmdldC5uZXh0RWxlbWVudFNpYmxpbmcuZ2V0QXR0cmlidXRlKFwiZGF0YS10YWItdmFsdWVcIikgfSk7XHJcbiAgICAgIGZvY3VzVGFyZ2V0VmFsdWUodGFiQnRuLCBzdGF0ZS5hY3RpdmVWYWx1ZSk7XHJcbiAgICB9O1xyXG4gICAgYWN0aW9ucy5maXJzdCA9ICgpID0+IHtcclxuICAgICAgc2V0U3RhdGUoeyBhY3RpdmVWYWx1ZTogJHRhYkJ0bkVsWzBdLmdldEF0dHJpYnV0ZShcImRhdGEtdGFiLXZhbHVlXCIpIH0pO1xyXG4gICAgICBmb2N1c1RhcmdldFZhbHVlKHRhYkJ0biwgc3RhdGUuYWN0aXZlVmFsdWUpO1xyXG4gICAgfTtcclxuICAgIGFjdGlvbnMubGFzdCA9ICgpID0+IHtcclxuICAgICAgc2V0U3RhdGUoeyBhY3RpdmVWYWx1ZTogJHRhYkJ0bkVsWyR0YWJCdG5FbC5sZW5ndGggLSAxXS5nZXRBdHRyaWJ1dGUoXCJkYXRhLXRhYi12YWx1ZVwiKSB9KTtcclxuICAgICAgZm9jdXNUYXJnZXRWYWx1ZSh0YWJCdG4sIHN0YXRlLmFjdGl2ZVZhbHVlKTtcclxuICAgIH07XHJcblxyXG4gICAgZnVuY3Rpb24gZm9jdXNUYXJnZXRWYWx1ZShlbCwgdmFsdWUpIHtcclxuICAgICAgY29uc3QgZm9jdXNUYXJnZXQgPSAkdGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoYCR7ZWx9W2RhdGEtdGFiLXZhbHVlPVwiJHt2YWx1ZX1cIl1gKTtcclxuICAgICAgZm9jdXNUYXJnZXQ/LmZvY3VzKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBzZXRFdmVudCgpIHtcclxuICAgIGNvbnN0IGFjdGlvbkxpc3QgPSB7XHJcbiAgICAgIHVwOiBbXCJBcnJvd0xlZnRcIl0sXHJcbiAgICAgIGRvd246IFtcIkFycm93UmlnaHRcIl0sXHJcbiAgICAgIGZpcnN0OiBbXCJIb21lXCJdLFxyXG4gICAgICBsYXN0OiBbXCJFbmRcIl0sXHJcbiAgICAgIHNlbGVjdDogW1wiRW50ZXJcIiwgXCIgXCJdLFxyXG4gICAgfTtcclxuXHJcbiAgICBhZGRFdmVudChcImNsaWNrXCIsIHRhYkhlYWQsIGFjdGlvbnMuc2VsZWN0KTtcclxuICAgIGFkZEV2ZW50KFwicG9pbnRlcmRvd25cIiwgdGFiSGVhZCwgYWN0aW9ucy5kcmFnU3RhcnQpO1xyXG4gICAgYWRkRXZlbnQoXCJwb2ludGVybW92ZVwiLCB0YWJIZWFkLCBhY3Rpb25zLmRyYWdNb3ZlKTtcclxuICAgIGFkZEV2ZW50KFwicG9pbnRlcnVwXCIsIHRhYkhlYWQsIGFjdGlvbnMuZHJhZ0VuZCk7XHJcbiAgICBhZGRFdmVudChcInBvaW50ZXJsZWF2ZVwiLCB0YWJIZWFkLCBhY3Rpb25zLmRyYWdMZWF2ZSk7XHJcblxyXG4gICAgYWRkRXZlbnQoXCJrZXlkb3duXCIsIHRhYkhlYWQsIChlKSA9PiB7XHJcbiAgICAgIGNvbnN0IHsga2V5IH0gPSBlO1xyXG4gICAgICBjb25zdCBhY3Rpb24gPSBPYmplY3QuZW50cmllcyhhY3Rpb25MaXN0KS5maW5kKChbXywga2V5c10pID0+IGtleXMuaW5jbHVkZXMoa2V5KSk7XHJcblxyXG4gICAgICBpZiAoYWN0aW9uKSB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgY29uc3QgW2FjdGlvbk5hbWVdID0gYWN0aW9uO1xyXG4gICAgICAgIGFjdGlvbnNbYWN0aW9uTmFtZV0/LihlKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiByZW5kZXIoKSB7XHJcbiAgICBjb25zdCBnZXRJZCA9ICR0YXJnZXQucXVlcnlTZWxlY3RvcihgJHt0YWJCdG59W2FyaWEtc2VsZWN0ZWQ9XCJ0cnVlXCJdYCk/LmlkO1xyXG5cclxuICAgIGV0VUkudXRpbHMuc2V0UHJvcGVydHkoJHRhcmdldCwgJ1thcmlhLXNlbGVjdGVkPVwidHJ1ZVwiXScsIFwiYXJpYS1zZWxlY3RlZFwiLCBmYWxzZSk7XHJcbiAgICBldFVJLnV0aWxzLnNldFByb3BlcnR5KCR0YXJnZXQsIGAke3RhYkJ0bn1bZGF0YS10YWItdmFsdWU9XCIke3N0YXRlLmFjdGl2ZVZhbHVlfVwiXWAsIFwiYXJpYS1zZWxlY3RlZFwiLCB0cnVlKTtcclxuXHJcbiAgICAkdGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoYCR7dGFiQ29udGVudH1bYXJpYS1sYWJlbGxlZGJ5PVwiJHtnZXRJZH1cIl1gKT8uY2xhc3NMaXN0LnJlbW92ZShcInNob3dcIik7XHJcbiAgICAkdGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoYCR7dGFiQ29udGVudH1bZGF0YS10YWItdmFsdWU9XCIke3N0YXRlLmFjdGl2ZVZhbHVlfVwiXWApPy5jbGFzc0xpc3QuYWRkKFwic2hvd1wiKTtcclxuICB9XHJcblxyXG4gIC8vIGN1c3RvbVxyXG4gIGZ1bmN0aW9uIHN0aWNreVRhYigpIHtcclxuICAgIGNvbnN0IHsgYm90dG9tIH0gPSBldFVJLmhvb2tzLnVzZUdldENsaWVudFJlY3QoZG9jdW1lbnQsIHByb3BzLnN0aWNreSk7XHJcblxyXG4gICAgJHRhcmdldC5zdHlsZS5wb3NpdGlvbiA9IFwicmVsYXRpdmVcIjtcclxuICAgICR0YWJIZWFkRWwuc3R5bGUucG9zaXRpb24gPSBcInN0aWNreVwiO1xyXG4gICAgaWYgKCFib3R0b20pICR0YWJIZWFkRWwuc3R5bGUudG9wID0gMCArIFwicHhcIjtcclxuICAgIGVsc2UgJHRhYkhlYWRFbC5zdHlsZS50b3AgPSBib3R0b20gKyBcInB4XCI7XHJcbiAgfVxyXG5cclxuICBjb21wb25lbnQgPSB7XHJcbiAgICBjb3JlOiB7XHJcbiAgICAgIHN0YXRlLFxyXG4gICAgICBwcm9wcyxcclxuICAgICAgaW5pdCxcclxuICAgICAgcmVtb3ZlRXZlbnQsXHJcbiAgICAgIGRlc3Ryb3ksXHJcbiAgICB9LFxyXG4gICAgdXBkYXRlLFxyXG4gIH07XHJcblxyXG4gIHJldHVybiBjb21wb25lbnQ7XHJcbn1cclxuXHJcbi8qXHJcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsIGZ1bmN0aW9uICgpIHtcclxuICBjb25zdCAkdGFiQm94ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtY29tcG9uZW50PVwidGFiXCJdJyk7XHJcbiAgJHRhYkJveC5mb3JFYWNoKCh0YWJCb3gpID0+IHtcclxuICAgIGNvbnN0IHRhYiA9IFRhYigpO1xyXG4gICAgdGFiLmNvcmUuaW5pdCh0YWJCb3gpO1xyXG4gIH0pO1xyXG59KTtcclxuKi9cclxuIiwiLy8gcHJvcHPripQg7Jyg7KCAKOyekeyXheyekCnqsIAg7KCV7J2Y7ZWgIOyImCDsnojripQg7Ji17IWYXHJcbi8vIHN0YXRl64qUIOuCtOu2gCDroZzsp4Hsl5DshJwg7J6R64+Z65CY64qUIOuhnOyngSAoZXg6IHN0YXRlIG9wZW4gY2xvc2UgYXJpYSDrk7Hrk7EuLi4uIClcclxuXHJcbi8vIO2DgOyehSDsoJXsnZhcclxuXHJcbi8qKlxyXG4gKiBAdHlwZWRlZiB7T2JqZWN0fSBUb29sdGlwUHJvcHNDb25maWdcclxuICogQHByb3BlcnR5IHtib29sZWFufSBkaXNhYmxlZCAtIOyalOyGjOqwgCDruYTtmZzshLHtmZQg7IOB7YOc7J247KeA66W8IOuCmO2DgOuDheuLiOuLpC5cclxuICogQHByb3BlcnR5IHtib29sZWFufSBvbmNlIC0g7J2067Kk7Yq464KYIOyVoeyFmOydhCDtlZwg67KI66eMIOyLpO2Wie2VoOyngCDsl6zrtoDrpbwg6rKw7KCV7ZWp64uI64ukLlxyXG4gKiBAcHJvcGVydHkge2ZhbHNlIHwgbnVtYmVyfSBkdXJhdGlvbiAtIOyVoOuLiOuplOydtOyFmCDrmJDripQg7J2067Kk7Yq4IOyngOyGjSDsi5zqsITsnYQg67CA66as7LSIIOuLqOychOuhnCDshKTsoJXtlanri4jri6QuICdmYWxzZSfsnbwg6rK97JqwIOyngOyGjSDsi5zqsITsnYQg66y07Iuc7ZWp64uI64ukLlxyXG4gKiBAcHJvcGVydHkge09iamVjdH0gb3JpZ2luIC0g7JuQ7KCQIOuYkOuKlCDsi5zsnpEg7KeA7KCQ7J2EIOuCmO2DgOuCtOuKlCDqsJ3ssrTsnoXri4jri6QuXHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqIEB0eXBlZGVmIHtPYmplY3R9IFRvb2x0aXBTdGF0ZUNvbmZpZ1xyXG4gKiBAcHJvcGVydHkgeydjbG9zZScgfCAnb3Blbid9IHN0YXRlIC0g7Yi07YyB7J2YIOyDge2DnOqwki4gY2xvc2UsIG9wZW4g65GYIOykkeyXkCDtlZjrgpjsnoXri4jri6QuXHJcbiAqIEBwcm9wZXJ0eSB7J2JvdHRvbScgfCAndG9wJyB8ICdsZWZ0JyB8ICdyaWdodCd9IHBvc2l0aW9uIC0g7Yi07YyB7J2YIOychOy5mOqwki4gYm90dG9tLCB0b3AsIGxlZnQsIHJpZ2h0IOykkeyXkCDtlZjrgpjsnoXri4jri6QuXHJcbiAqL1xyXG5cclxuZnVuY3Rpb24gVG9vbHRpcCgpIHtcclxuICBjb25zdCB7XHJcbiAgICBwcm9wcywgc3RhdGUsIHNldFByb3BzLCBzZXRTdGF0ZSwgc2V0VGFyZ2V0LCBhZGRFdmVudCwgcmVtb3ZlRXZlbnRcclxuICB9ID0gZXRVSS5ob29rcy51c2VDb3JlKHtcclxuXHJcbiAgfSwge1xyXG5cclxuICB9LCByZW5kZXIpO1xyXG5cclxuICAvLyBzdGF0ZSDrs4Dqsr0g7IucIOuenOuNlCDsnqztmLjstpxcclxuICBjb25zdCBuYW1lID0gJ3Rvb2x0aXAnO1xyXG4gIGxldCBjb21wb25lbnQgPSB7fTtcclxuICAgIC8qKiBAdHlwZSB7VG9vbHRpcFByb3BzQ29uZmlnfSAqL1xyXG4gICAgLyoqIEB0eXBlIHtUb29sdGlwU3RhdGVDb25maWd9ICovXHJcbiAgICAvLyDsmpTshozqtIDroKgg67OA7IiY65OkXHJcbiAgbGV0ICR0YXJnZXQsXHJcbiAgICAkdG9vbHRpcFRyaWdnZXJCdG4sXHJcbiAgICAkdG9vbHRpcENsb3NlQnRuLFxyXG4gICAgJHRvb2x0aXBDb250YWluZXI7XHJcblxyXG4gIHtcclxuICAgIC8qKlxyXG4gICAgICogaW5pdFxyXG4gICAgICogQHBhcmFtIF8kdGFyZ2V0XHJcbiAgICAgKiBAcGFyYW0gX3Byb3BzXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGluaXQoXyR0YXJnZXQsIF9wcm9wcykge1xyXG4gICAgICBpZiAodHlwZW9mIF8kdGFyZ2V0ID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgICR0YXJnZXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKF8kdGFyZ2V0KTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICAkdGFyZ2V0ID0gXyR0YXJnZXQ7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICghJHRhcmdldCkge1xyXG4gICAgICAgIHRocm93IEVycm9yKCd0YXJnZXTsnbQg7KG07J6s7ZWY7KeAIOyViuyKteuLiOuLpC4nKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgc2V0VGFyZ2V0KCR0YXJnZXQpO1xyXG4gICAgICBzZXRQcm9wcyh7IC4uLnByb3BzLCAuLi5fcHJvcHMgfSk7XHJcblxyXG4gICAgICBpZiAoJHRhcmdldC51aSkgcmV0dXJuO1xyXG4gICAgICAkdGFyZ2V0LnVpID0gdGhpcztcclxuXHJcbiAgICAgIHNldHVwKCk7XHJcbiAgICAgIHNldEV2ZW50KCk7XHJcblxyXG4gICAgICAkdGFyZ2V0LnNldEF0dHJpYnV0ZSgnZGF0YS1pbml0JywgJ3RydWUnKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBzZXR1cCgpIHtcclxuICAgICAgc2V0dXBTZWxlY3RvcigpO1xyXG4gICAgICBzZXR1cEVsZW1lbnQoKTtcclxuXHJcbiAgICAgIC8vIGZvY3VzIHRyYXBcclxuICAgICAgZm9jdXNUcmFwSW5zdGFuY2UgPSBmb2N1c1RyYXAuY3JlYXRlRm9jdXNUcmFwKCR0YXJnZXQsIHtcclxuICAgICAgICBvbkFjdGl2YXRlOiAoKSA9PiB7fSxcclxuICAgICAgICBvbkRlYWN0aXZhdGU6ICgpID0+IHtcclxuICAgICAgICAgIGNsb3NlKCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgfSk7XHJcblxyXG4gICAgICAvLyBzdGF0ZVxyXG4gICAgICBzZXRTdGF0ZSh7IHN0YXRlOiBwcm9wcy5zdGF0ZSB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIHVwZGF0ZVxyXG4gICAgICogQHBhcmFtIF9wcm9wc1xyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiB1cGRhdGUoX3Byb3BzKSB7XHJcbiAgICAgIGlmIChfcHJvcHMgJiYgZXRVSS51dGlscy5zaGFsbG93Q29tcGFyZShwcm9wcywgX3Byb3BzKSAmJiAhJHRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtaW5pdCcpKSByZXR1cm47XHJcbiAgICAgIGRlc3Ryb3koKTtcclxuXHJcbiAgICAgIHNldFByb3BzKHsgLi4ucHJvcHMsIC4uLl9wcm9wcyB9KTtcclxuICAgICAgc2V0dXAoKTtcclxuICAgICAgc2V0RXZlbnQoKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBkZXN0cm95KCkge1xyXG4gICAgICByZW1vdmVFdmVudCgpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gZnJlcXVlbmN5XHJcbiAgZnVuY3Rpb24gc2V0dXBTZWxlY3RvcigpIHtcclxuICAgIC8vIGVsZW1lbnRcclxuICAgICR0b29sdGlwQ29udGFpbmVyID0gJHRhcmdldC5xdWVyeVNlbGVjdG9yKCcudG9vbHRpcC1jb250YWluZXInKTtcclxuXHJcbiAgICAvLyBzZWxlY290clxyXG4gICAgJHRvb2x0aXBUcmlnZ2VyQnRuID0gJy50b29sdGlwLWJ0bic7XHJcbiAgICAkdG9vbHRpcENsb3NlQnRuID0gJy5idG4tY2xvc2UnO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gc2V0dXBFbGVtZW50KCkge1xyXG4gICAgLy8gc2V0IGlkXHJcbiAgICBjb25zdCBpZCA9IGV0VUkudXRpbHMuZ2V0UmFuZG9tVUlJRChuYW1lKTtcclxuICAgIGNvbnN0IHRpdGxlSWQgPSBldFVJLnV0aWxzLmdldFJhbmRvbVVJSUQobmFtZSArICctdGl0Jyk7XHJcblxyXG4gICAgLy8gYTExeVxyXG4gICAgJHRhcmdldC5zZXRBdHRyaWJ1dGUoJ2lkJywgaWQpO1xyXG4gICAgJHRhcmdldC5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCAnZmFsc2UnKTtcclxuICAgICR0YXJnZXQuc2V0QXR0cmlidXRlKCdhcmlhLWNvbnRyb2xzJywgdGl0bGVJZCk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBzZXRFdmVudCgpIHtcclxuICAgIGFkZEV2ZW50KCdjbGljaycsICR0b29sdGlwVHJpZ2dlckJ0biwgb3Blbik7XHJcbiAgICBhZGRFdmVudCgnY2xpY2snLCAkdG9vbHRpcENsb3NlQnRuLCBjbG9zZSk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiByZW5kZXIoKSB7XHJcbiAgICBjb25zdCB7IHR5cGUgfSA9IHByb3BzO1xyXG4gICAgY29uc3QgaXNTaG93ID0gc3RhdGUuc3RhdGUgPT09ICdvcGVuJztcclxuICAgIGNvbnN0IGV4cGFuZGVkID0gJHRvb2x0aXBDb250YWluZXIuZ2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJykgPT09ICd0cnVlJztcclxuICAgIGNvbnN0ICRjbG9zZUJ0biA9ICR0YXJnZXQucXVlcnlTZWxlY3RvcigkdG9vbHRpcENsb3NlQnRuKTtcclxuXHJcbiAgICAkdG9vbHRpcENvbnRhaW5lci5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCAhZXhwYW5kZWQpO1xyXG4gICAgJHRvb2x0aXBDb250YWluZXIuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsIGV4cGFuZGVkKTtcclxuICAgIGlmIChpc1Nob3cpIHtcclxuICAgICAgaGFuZGxlT3BlbkFuaW1hdGlvbih0eXBlKTtcclxuICAgICAgJGNsb3NlQnRuLmZvY3VzKCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBoYW5kbGVDbG9zZUFuaW1hdGlvbih0eXBlKTtcclxuICAgICAgJGNsb3NlQnRuLnNldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsICdmYWxzZScpO1xyXG4gICAgICAkdG9vbHRpcENvbnRhaW5lci5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGhhbmRsZU9wZW5BbmltYXRpb24odHlwZSkge1xyXG4gICAgY29uc3Qgc2V0QW5pbWF0aW9uID0geyBkdXJhdGlvbjogMCwgZGlzcGxheTogJ25vbmUnLCBvcGFjaXR5OiAwIH07XHJcbiAgICBjb25zdCBzY2FsZSA9IHByb3BzLnRyYW5zZm9ybS5zY2FsZS54O1xyXG4gICAgaWYgKHR5cGUgPT09ICdkZWZhdWx0Jykge1xyXG4gICAgICBnc2FwLnRpbWVsaW5lKCkudG8oJHRvb2x0aXBDb250YWluZXIsIHNldEFuaW1hdGlvbikudG8oJHRvb2x0aXBDb250YWluZXIsIHsgZHVyYXRpb246IHByb3BzLmR1cmF0aW9uLCBkaXNwbGF5OiAnYmxvY2snLCBvcGFjaXR5OiAxIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0eXBlID09PSAnY3VzdG9tJykge1xyXG4gICAgICBnc2FwLnRpbWVsaW5lKCkudG8oJHRvb2x0aXBDb250YWluZXIsIHNldEFuaW1hdGlvbikudG8oJHRvb2x0aXBDb250YWluZXIsIHsgZHVyYXRpb246IHByb3BzLmR1cmF0aW9uLCBzY2FsZTogMSwgZGlzcGxheTogJ2Jsb2NrJywgb3BhY2l0eTogMSB9KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGhhbmRsZUNsb3NlQW5pbWF0aW9uKHR5cGUpIHtcclxuICAgIGNvbnN0IHNjYWxlID0gcHJvcHMudHJhbnNmb3JtLnNjYWxlLng7XHJcbiAgICBpZiAodHlwZSA9PT0gJ2RlZmF1bHQnKSB7XHJcbiAgICAgIGdzYXAudGltZWxpbmUoKS50bygkdG9vbHRpcENvbnRhaW5lciwgeyBkdXJhdGlvbjogcHJvcHMuZHVyYXRpb24sIGRpc3BsYXk6ICdub25lJywgb3BhY2l0eTogMCB9KTtcclxuICAgIH1cclxuICAgIGlmICh0eXBlID09PSAnY3VzdG9tJykge1xyXG4gICAgICBnc2FwLnRpbWVsaW5lKCkudG8oJHRvb2x0aXBDb250YWluZXIsIHsgZHVyYXRpb246IHByb3BzLmR1cmF0aW9uLCBzY2FsZTogc2NhbGUsIGRpc3BsYXk6ICdub25lJywgb3BhY2l0eTogMCB9KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIG9wZW4oKSB7XHJcbiAgICBpZiAoc3RhdGUuc3RhdGUgIT09ICdvcGVuJykge1xyXG4gICAgICBzZXRTdGF0ZSh7IHN0YXRlOiAnb3BlbicgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBjbG9zZSgpIHtcclxuICAgIGlmIChzdGF0ZS5zdGF0ZSAhPT0gJ2Nsb3NlJykge1xyXG4gICAgICBzZXRTdGF0ZSh7IHN0YXRlOiAnY2xvc2UnIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgY29tcG9uZW50ID0ge1xyXG4gICAgY29yZToge1xyXG4gICAgICBpbml0LFxyXG4gICAgICBkZXN0cm95LFxyXG4gICAgICByZW1vdmVFdmVudCxcclxuICAgIH0sXHJcblxyXG4gICAgdXBkYXRlLFxyXG4gICAgb3BlbixcclxuICAgIGNsb3NlLFxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGNvbXBvbmVudDtcclxufVxyXG5cclxuLy8gZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgZnVuY3Rpb24gKCkge1xyXG4vLyAgIGNvbnN0ICR0b29sdGlwU2VsZWN0b3IgPSBkb2N1bWVudD8ucXVlcnlTZWxlY3RvckFsbChcIi5jb21wb25lbnQtdG9vbHRpcFwiKTtcclxuLy8gICAkdG9vbHRpcFNlbGVjdG9yLmZvckVhY2goKHRvb2x0aXApID0+IHtcclxuLy8gICAgIGNvbnN0IHRvb2x0aXBDb21wb25lbnQgPSBUb29sdGlwKCk7XHJcbi8vICAgICB0b29sdGlwQ29tcG9uZW50LmluaXQodG9vbHRpcCk7XHJcbi8vICAgfSk7XHJcbi8vIH0pO1xyXG5cclxuLy8g6riw7YOAIOyYteyFmOuTpC4uLlxyXG4vLyBkdXJhdGlvbjogMzAwLFxyXG4vLyBoZWlnaHQ6IDIwMCxcclxuLy8gdHJhbnNmb3JtOiB7XHJcbi8vICAgc2NhbGU6IHtcclxuLy8gICAgIHg6IDEsXHJcbi8vICAgICB5OiAxLFxyXG4vLyAgIH0sXHJcbi8vICAgdHJhbnNsYXRlOiB7XHJcbi8vICAgICB4OiAwLFxyXG4vLyAgICAgeTogOTAsXHJcbi8vICAgfSxcclxuLy8gICBkZWxheTogMCxcclxuLy8gICBlYXNlaW5nOiBcImVhc2Utb3V0XCIsXHJcbi8vIH0sXHJcblxyXG4vKipcclxuICogU2tlbFxyXG4gKiAvLyBpbml0LCBzZXR1cCwgdXBkYXRlLCBhZGRFdmVudCwgcmVtb3ZlRXZlbnQsIGRlc3Ryb3lcclxuICogLy8gdGVtcGxhdGUsIHNldHVwU2VsZWN0b3IsIHNldHVwRWxlbWVudCwgc2V0RXZlbnQsIHJlbmRlciwgY3VzdG9tRm4sIGNhbGxhYmxlXHJcbiAqL1xyXG4iLCJcbmV0VUkuY29tcG9uZW50cyA9IHtcblx0QWNjb3JkaW9uLFxuXHREaWFsb2csXG5cdE1vZGFsLFxuXHRTZWxlY3RCb3gsXG5cdFNrZWwsXG5cdFN3aXBlckNvbXAsXG5cdFRhYixcblx0VG9vbHRpcFxufVxuIiwiLy8gaW5pdCBqc1xyXG5mdW5jdGlvbiBpbml0VUkoKSB7XHJcbiAgY29uc3QgY29tcG9uZW50TGlzdCA9IFtcclxuICAgIHtcclxuICAgICAgc2VsZWN0b3I6IFwiLmNvbXBvbmVudC1tb2RhbFwiLFxyXG4gICAgICBmbjogZXRVSS5jb21wb25lbnRzLk1vZGFsLFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgc2VsZWN0b3I6IFwiLmNvbXBvbmVudC1hY2NvcmRpb25cIixcclxuICAgICAgZm46IGV0VUkuY29tcG9uZW50cy5BY2NvcmRpb24sXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBzZWxlY3RvcjogXCIuY29tcG9uZW50LXRvb2x0aXBcIixcclxuICAgICAgZm46IGV0VUkuY29tcG9uZW50cy5Ub29sdGlwLFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgc2VsZWN0b3I6ICdbZGF0YS1jb21wb25lbnQ9XCJ0YWJcIl0nLFxyXG4gICAgICBmbjogZXRVSS5jb21wb25lbnRzLlRhYixcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIHNlbGVjdG9yOiAnW2RhdGEtY29tcG9uZW50PVwic2VsZWN0LWJveFwiXScsXHJcbiAgICAgIGZuOiBldFVJLmNvbXBvbmVudHMuU2VsZWN0Qm94LFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgc2VsZWN0b3I6ICdbZGF0YS1jb21wb25lbnQ9XCJzd2lwZXJcIl0nLFxyXG4gICAgICBmbjogZXRVSS5jb21wb25lbnRzLlN3aXBlckNvbXAsXHJcbiAgICB9LFxyXG4gIF07XHJcblxyXG4gIGNvbXBvbmVudExpc3QuZm9yRWFjaCgoeyBzZWxlY3RvciwgZm4gfSkgPT4ge1xyXG4gICAgLy8gY29uc29sZS5sb2coZm4pO1xyXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChzZWxlY3RvcikuZm9yRWFjaCgoZWwpID0+IHtcclxuICAgICAgaWYgKGVsLmRhdGFzZXQuaW5pdCkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgY29uc3QgY29tcG9uZW50ID0gbmV3IGZuKCk7XHJcbiAgICAgIGNvbXBvbmVudC5jb3JlLmluaXQoZWwsIHt9LCBzZWxlY3Rvcik7XHJcbiAgICB9KTtcclxuICB9KTtcclxuXHJcbiAgZXRVSS5kaWFsb2cgPSBldFVJLmhvb2tzLnVzZURpYWxvZygpO1xyXG59XHJcblxyXG5ldFVJLmluaXRVSSA9IGluaXRVSTtcclxuXHJcbihmdW5jdGlvbiBhdXRvSW5pdCgpIHtcclxuICBjb25zdCAkc2NyaXB0QmxvY2sgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiW2RhdGEtaW5pdF1cIik7XHJcbiAgaWYgKCRzY3JpcHRCbG9jaykge1xyXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgZnVuY3Rpb24gKCkge1xyXG4gICAgICBpbml0VUkoKTtcclxuICAgIH0pO1xyXG4gIH1cclxufSkoKTtcclxuIl19

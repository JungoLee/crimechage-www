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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNldHVwLmpzIiwidXRpbHMvYXJyYXkuanMiLCJ1dGlscy9ib29sZWFuLmpzIiwidXRpbHMvZGF0ZS5qcyIsInV0aWxzL2RvbS5qcyIsInV0aWxzL21hdGguanMiLCJ1dGlscy9vYmplY3QuanMiLCJ1dGlscy9zdHJpbmcuanMiLCJ1dGlscy9pbmRleC5janMiLCJob29rcy91c2VDbGlja091dHNpZGUuanMiLCJob29rcy91c2VDb3JlLmpzIiwiaG9va3MvdXNlRGF0YXNldC5qcyIsImhvb2tzL3VzZURpYWxvZy5qcyIsImhvb2tzL3VzZURpYWxvZ1RtcGwuanMiLCJob29rcy91c2VFdmVudExpc3RlbmVyLmpzIiwiaG9va3MvdXNlR2V0Q2xpZW50UmVjdC5qcyIsImhvb2tzL3VzZUxheWVyLmpzIiwiaG9va3MvdXNlTXV0YXRpb25TdGF0ZS5qcyIsImhvb2tzL3VzZVNlbGVjdEJveFRtcGwuanMiLCJob29rcy91c2VTdGF0ZS5qcyIsImhvb2tzL3VzZVN3aXBlclRtcGwuanMiLCJob29rcy91c2VUcmFuc2l0aW9uLmpzIiwiaG9va3MvaW5kZXguY2pzIiwiY29tcG9uZW50cy9BY2NvcmRpb24uanMiLCJjb21wb25lbnRzL0RpYWxvZy5qcyIsImNvbXBvbmVudHMvTW9kYWwuanMiLCJjb21wb25lbnRzL1NlbGVjdGJveC5qcyIsImNvbXBvbmVudHMvU2tlbC5qcyIsImNvbXBvbmVudHMvU3dpcGVyLmpzIiwiY29tcG9uZW50cy9UYWIuanMiLCJjb21wb25lbnRzL1Rvb2x0aXAuanMiLCJjb21wb25lbnRzL2luZGV4LmNqcyIsImluaXQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBOzs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ1JBO0FBQ0E7OztBQ0RBO0FBQ0E7OztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDMUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ3ZEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUN4R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQzdGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUMzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDakRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNoRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQzVEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDdkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDdk9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUN6U0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUN2TkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDbFVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDaktBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDN05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDelJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDaE9BOzs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJhc3NldHMvc2NyaXB0cy9jb21tb24udWkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBldFVJID0ge31cbndpbmRvdy5ldFVJID0gZXRVSVxuIiwiLyoqXHJcbiAqIENoZWNrIGlmIHRoZSB2YWx1ZSBpcyBhbiBhcnJheVxyXG4gKiBAcGFyYW0gdmFsdWUge2FueX1cclxuICogQHJldHVybnMge2FyZyBpcyBhbnlbXX1cclxuICovXHJcbmZ1bmN0aW9uIGlzQXJyYXkodmFsdWUpIHtcclxuICByZXR1cm4gQXJyYXkuaXNBcnJheSh2YWx1ZSk7XHJcbn1cclxuIiwiLy8gYm9vbGVhbiDqtIDroKgg6riw64qlXHJcbiIsIi8vIOuCoOynnCDqtIDroKgg6riw64qlXHJcbiIsIi8vIGV4KSBzdHJpbmcgdG8gcXVlcnlTZWxlY3RvciBjb252ZXJ0IGxvZ2ljXHJcblxyXG4vKipcclxuICog6riw64qlIOyEpOuqhSDrk6TslrTqsJBcclxuICovXHJcblxyXG4vKipcclxuICogc2V0IGF0dHJpYnV0ZVxyXG4gKiBAcGFyYW0geyBFbGVtZW50IH0gcGFyZW50XHJcbiAqIEBwYXJhbSBvcHRzXHJcbiAqL1xyXG5mdW5jdGlvbiBzZXRQcm9wZXJ0eShwYXJlbnQsIC4uLm9wdHMpIHtcclxuICBpZihvcHRzLmxlbmd0aCA9PT0gMil7XHJcbiAgICBjb25zdCBbcHJvcGVydHksIHZhbHVlXSA9IG9wdHM7XHJcblxyXG4gICAgcGFyZW50Py5zZXRBdHRyaWJ1dGUocHJvcGVydHksIHZhbHVlKTtcclxuICB9ZWxzZSBpZihvcHRzLmxlbmd0aCA9PT0gMyl7XHJcbiAgICBjb25zdCBbc2VsZWN0b3IsIHByb3BlcnR5LCB2YWx1ZV0gPSBvcHRzO1xyXG5cclxuICAgIHBhcmVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKT8uc2V0QXR0cmlidXRlKHByb3BlcnR5LCB2YWx1ZSk7XHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICogZ2V0IGF0dHJpYnV0ZVxyXG4gKiBAcGFyYW0geyBFbGVtZW50IH0gcGFyZW50XHJcbiAqIEBwYXJhbSB7IFN0cmluZyB9IHNlbGVjdG9yXHJcbiAqIEBwYXJhbSB7IFN0cmluZyB9IHByb3BlcnR5XHJcbiAqL1xyXG5mdW5jdGlvbiBnZXRQcm9wZXJ0eShwYXJlbnQsIHNlbGVjdG9yLCBwcm9wZXJ0eSkge1xyXG4gIHBhcmVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKT8uZ2V0QXR0cmlidXRlKHByb3BlcnR5KTtcclxufVxyXG5cclxuLyoqXHJcbiAqIHNldCBzdHlsZVxyXG4gKiBAcGFyYW0geyBFbGVtZW50IH0gcGFyZW50XHJcbiAqIEBwYXJhbSB7IFN0cmluZyB9IHNlbGVjdG9yXHJcbiAqIEBwYXJhbSB7IFN0cmluZyB9IHByb3BlcnR5XHJcbiAqIEBwYXJhbSB7IGFueSB9IHZhbHVlXHJcbiAqL1xyXG5mdW5jdGlvbiBzZXRTdHlsZShwYXJlbnQsIHNlbGVjdG9yLCBwcm9wZXJ0eSwgdmFsdWUpIHtcclxuICBpZiAocGFyZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpKSB7XHJcbiAgICBwYXJlbnQucXVlcnlTZWxlY3RvcihzZWxlY3Rvcikuc3R5bGVbcHJvcGVydHldID0gdmFsdWU7XHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICogZ3NhcOydmCBTcGxpdFRleHTrpbwg7Zmc7Jqp7ZWY7JesIOusuOyekOulvCDrtoTrpqztlZjsl6wg66eI7Iqk7YGsIOqwgOuKpe2VmOqyjCDtlbTspIDri6QuXHJcbiAqIEBwYXJhbSBzZWxlY3RvciAge3N0cmluZ31cclxuICogQHBhcmFtIHR5cGUgIHsnbGluZXMnfCd3b3Jkcyd8J2NoYXJzJ31cclxuICogQHJldHVybnMgW0hUTUxFbGVtZW50W10sIEhUTUxFbGVtZW50W11dXHJcbiAqL1xyXG5mdW5jdGlvbiBzcGxpdFRleHRNYXNrKHNlbGVjdG9yLCB0eXBlID0gJ2xpbmVzJyl7XHJcbiAgZnVuY3Rpb24gd3JhcChlbCwgd3JhcHBlcikge1xyXG4gICAgZWwucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUod3JhcHBlciwgZWwpO1xyXG4gICAgd3JhcHBlci5hcHBlbmRDaGlsZChlbCk7XHJcbiAgfVxyXG5cclxuICBjb25zdCAkcXVvdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKSxcclxuICAgIG15U3BsaXRUZXh0ID0gbmV3IFNwbGl0VGV4dCgkcXVvdGUsIHt0eXBlfSlcclxuXHJcbiAgY29uc3QgJHNwbGl0dGVkID0gbXlTcGxpdFRleHRbdHlwZV07XHJcbiAgY29uc3QgJGxpbmVXcmFwID0gW107XHJcbiAgJHNwbGl0dGVkLmZvckVhY2goKCRlbCwgaW5kZXgpID0+IHtcclxuICAgIGNvbnN0ICRkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICRkaXYuc3R5bGUub3ZlcmZsb3cgPSAnaGlkZGVuJztcclxuICAgICRkaXYuc3R5bGUucG9zaXRpb24gPSAncmVsYXRpdmUnO1xyXG4gICAgJGRpdi5zdHlsZS5kaXNwbGF5ID0gJ2lubGluZS1ibG9jayc7XHJcbiAgICB3cmFwKCRlbCwgJGRpdik7XHJcbiAgICAkbGluZVdyYXAucHVzaCgkZGl2KTtcclxuICB9KVxyXG5cclxuICByZXR1cm4gWyRzcGxpdHRlZCwgJGxpbmVXcmFwXVxyXG59XHJcbiIsIi8vIOyXsOyCsCDqtIDroKggKOyekOujjO2YlU51bWJlciArIG51bWJlcilcclxuZnVuY3Rpb24gZ2V0QmxlbmRPcGFjaXR5KG9wYWNpdHksIGxlbmd0aCkge1xyXG4gIGlmKGxlbmd0aCA9PT0gMSl7XHJcbiAgICByZXR1cm4gb3BhY2l0eVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIDEgLSBNYXRoLnBvdygxIC0gb3BhY2l0eSwgMS9sZW5ndGgpXHJcbn1cclxuIiwiLy8gb2JqZWN0IOq0gOugqCDquLDriqVcclxuXHJcbi8qKlxyXG4gKiBjb21wYXJlIG9ialxyXG4gKiBAcGFyYW0geyBPYmplY3QgfSBvYmoxXHJcbiAqIEBwYXJhbSB7IE9iamVjdCB9IG9iajJcclxuICogQHJldHVybnMgQm9vbGVhblxyXG4gKi9cclxuZnVuY3Rpb24gc2hhbGxvd0NvbXBhcmUob2JqMSwgb2JqMikge1xyXG4gIGNvbnN0IGtleXMgPSBbLi4uT2JqZWN0LmtleXMob2JqMSksIE9iamVjdC5rZXlzKG9iajIpXTtcclxuXHJcbiAgZm9yIChjb25zdCBrZXkgb2Yga2V5cykge1xyXG4gICAgaWYgKHR5cGVvZiBvYmoxW2tleV0gPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIG9iajJba2V5XSA9PT0gXCJvYmplY3RcIikge1xyXG4gICAgICBpZiAoIWV0VUkudXRpbHMuc2hhbGxvd0NvbXBhcmUob2JqMVtrZXldLCBvYmoyW2tleV0pKSB7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBjb25zdCByb2xlID0gIW9iajJba2V5XSB8fCB0eXBlb2Ygb2JqMVtrZXldID09PSBcImZ1bmN0aW9uXCI7XHJcbiAgICAgIGlmICghcm9sZSAmJiBvYmoxW2tleV0gIT09IG9iajJba2V5XSkge1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4gdHJ1ZTtcclxufVxyXG4iLCIvKipcclxuICogUmV2ZXJzZSBhIHN0cmluZ1xyXG4gKiBAcGFyYW0gc3RyIHtzdHJpbmd9XHJcbiAqIEByZXR1cm5zIHtzdHJpbmd9XHJcbiAqL1xyXG5mdW5jdGlvbiByZXZlcnNlU3RyaW5nKHN0cikge1xyXG4gIHJldHVybiBzdHIuc3BsaXQoJycpLnJldmVyc2UoKS5qb2luKCcnKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEdldCBhIHJhbmRvbSBpZFxyXG4gKiBAcmV0dXJucyB7c3RyaW5nfVxyXG4gKi9cclxuZnVuY3Rpb24gZ2V0UmFuZG9tSWQoKSB7XHJcbiAgcmV0dXJuIE1hdGgucmFuZG9tKCkudG9TdHJpbmcoMzYpLnN1YnN0cmluZygyKTtcclxufVxyXG5cclxuLyoqXHJcbiAqXHJcbiAqIEBwYXJhbSBwcmVmaXhcclxuICogQHJldHVybnMge3N0cmluZ31cclxuICovXHJcbmZ1bmN0aW9uIGdldFJhbmRvbVVJSUQocHJlZml4ID0gJ3VpJykge1xyXG4gIHJldHVybiBgJHtwcmVmaXh9LSR7Z2V0UmFuZG9tSWQoKX1gO1xyXG59XHJcblxyXG4vKipcclxuICog7LKr6riA7J6Q66eMIOuMgOusuOyekOuhnCDrs4DtmZhcclxuICogQHBhcmFtIHdvcmRcclxuICogQHJldHVybnMge3N0cmluZ31cclxuICovXHJcbmZ1bmN0aW9uIGNhcGl0YWxpemUod29yZCkge1xyXG4gIHJldHVybiB3b3JkLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgd29yZC5zbGljZSgxKVxyXG59XHJcblxyXG4vKipcclxuICog7LKr6riA7J6Q66eMIOyGjOusuOyekOuhnCDrs4DtmZhcclxuICogQHBhcmFtIHdvcmRcclxuICogQHJldHVybnMge3N0cmluZ31cclxuICovXHJcbmZ1bmN0aW9uIHVuY2FwaXRhbGl6ZSh3b3JkKSB7XHJcbiAgcmV0dXJuIHdvcmQuY2hhckF0KDApLnRvTG93ZXJDYXNlKCkgKyB3b3JkLnNsaWNlKDEpXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGFkZFByZWZpeENhbWVsU3RyaW5nKHN0ciwgcHJlZml4KXtcclxuICAvLyBkaW1tQ2xpY2sgPT4gcHJvcHNEaW1tQ2xpY2tcclxuICByZXR1cm4gcHJlZml4ICsgZXRVSS51dGlscy5jYXBpdGFsaXplKHN0cilcclxufVxyXG5cclxuZnVuY3Rpb24gcmVtb3ZlUHJlZml4Q2FtZWxTdHJpbmcoc3RyLCBwcmVmaXgpe1xyXG4gIGNvbnN0IHJlZ0V4cCA9IG5ldyBSZWdFeHAoYF4ke3ByZWZpeH1gLCAnZycpXHJcbiAgcmV0dXJuIGV0VUkudXRpbHMudW5jYXBpdGFsaXplKHN0ci5yZXBsYWNlQWxsKHJlZ0V4cCwgJycpKVxyXG5cclxufVxyXG5cclxuIiwiXG5ldFVJLnV0aWxzID0ge1xuXHRpc0FycmF5LFxuXHRzZXRQcm9wZXJ0eSxcblx0Z2V0UHJvcGVydHksXG5cdHNldFN0eWxlLFxuXHRzcGxpdFRleHRNYXNrLFxuXHRnZXRCbGVuZE9wYWNpdHksXG5cdHNoYWxsb3dDb21wYXJlLFxuXHRyZXZlcnNlU3RyaW5nLFxuXHRnZXRSYW5kb21JZCxcblx0Z2V0UmFuZG9tVUlJRCxcblx0Y2FwaXRhbGl6ZSxcblx0dW5jYXBpdGFsaXplLFxuXHRhZGRQcmVmaXhDYW1lbFN0cmluZyxcblx0cmVtb3ZlUHJlZml4Q2FtZWxTdHJpbmdcbn1cbiIsIi8qKlxuICogdGFyZ2V0KeydmCDsmbjrtoDrpbwg7YG066at7ZaI7J2EIOuVjCDsvZzrsLEg7ZWo7IiY66W8IOyLpO2WiVxuICog7JiI7Jm47KCB7Jy866GcIO2BtOumreydhCDtl4jsmqntlaAg7JqU7IaM65Ok7J2YIOyEoO2DneyekOulvCDtj6ztlajtlZjripQg67Cw7Je07J2EIOyYteyFmOycvOuhnCDrsJvsnYQg7IiYIOyeiOyKteuLiOuLpC5cbiAqXG4gKiBAcGFyYW0ge0VsZW1lbnR9IHRhcmdldCAtIO2BtOumrSDsnbTrsqTtirjsnZgg7Jm467aAIO2BtOumrSDqsJDsp4Drpbwg7IiY7ZaJ7ZWgIOuMgOyDgSBET00g7JqU7IaM7J6F64uI64ukLijtlYTsiJgpXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayAtIOyZuOu2gCDtgbTrpq3snbQg6rCQ7KeA65CY7JeI7J2EIOuVjCDsi6TtlontlaAg7L2c67CxIO2VqOyImOyeheuLiOuLpC4o7ZWE7IiYKVxuICogQHBhcmFtIHtBcnJheTxzdHJpbmc+fSBleGNlcHRpb25zIC0g7Jm467aAIO2BtOumrSDqsJDsp4Dsl5DshJwg7JiI7Jm4IOyymOumrO2VoCDsmpTshozrk6TsnZgg7ISg7YOd7J6Q66W8IO2PrO2VqO2VmOuKlCDrsLDsl7TsnoXri4jri6QuKOyYteyFmClcbiAqL1xuXG4vLyBibHVyIOuPhCDsl7zrkZBcbmZ1bmN0aW9uIHVzZUNsaWNrT3V0c2lkZSh0YXJnZXQsIGNhbGxiYWNrLCBleGNlcHRpb25zID0gW10pIHtcbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChldmVudCkgPT4ge1xuICAgIGxldCBpc0NsaWNrSW5zaWRlRXhjZXB0aW9uID0gZXhjZXB0aW9ucy5zb21lKChzZWxlY3RvcikgPT4ge1xuICAgICAgY29uc3QgZXhjZXB0aW9uRWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpO1xuICAgICAgcmV0dXJuIGV4Y2VwdGlvbkVsZW1lbnQgJiYgZXhjZXB0aW9uRWxlbWVudC5jb250YWlucyhldmVudC50YXJnZXQpO1xuICAgIH0pO1xuXG4gICAgaWYgKCF0YXJnZXQuY29udGFpbnMoZXZlbnQudGFyZ2V0KSAmJiAhaXNDbGlja0luc2lkZUV4Y2VwdGlvbikge1xuICAgICAgY2FsbGJhY2sodGFyZ2V0KTtcbiAgICB9XG4gIH0pO1xufVxuXG4vLyDrtoDrqqgg7JqU7IaM64qUIHBhcmVudHNcbi8vIOyEoO2DnSDsmpRcbiIsImZ1bmN0aW9uIHVzZUNvcmUoXG4gIGluaXRpYWxQcm9wcyA9IHt9LFxuICBpbml0aWFsVmFsdWUgPSB7fSxcbiAgcmVuZGVyLFxuICBvcHRpb25zID0ge1xuICAgIGRhdGFzZXQ6IHRydWVcbn0pIHtcbiAgY29uc3QgYWN0aW9ucyA9IHt9O1xuICBsZXQgJHRhcmdldDtcbiAgY29uc3QgY2xlYW51cHMgPSBbXTtcbiAgY29uc3QgTk9fQlVCQkxJTkdfRVZFTlRTID0gW1xuICAgICdibHVyJyxcbiAgICAnZm9jdXMnLFxuICAgICdmb2N1c2luJyxcbiAgICAnZm9jdXNvdXQnLFxuICAgICdwb2ludGVybGVhdmUnXG4gIF07XG5cbiAgY29uc3QgcHJvcHMgPSBuZXcgUHJveHkoaW5pdGlhbFByb3BzLCB7XG4gICAgc2V0OiAodGFyZ2V0LCBrZXksIHZhbHVlKSA9PiB7XG4gICAgICBSZWZsZWN0LnNldCh0YXJnZXQsIGtleSwgdmFsdWUpO1xuICAgIH1cbiAgfSk7XG5cbiAgY29uc3Qgc3RhdGUgPSBuZXcgUHJveHkoaW5pdGlhbFZhbHVlLCB7XG4gICAgc2V0OiAodGFyZ2V0LCBrZXksIHZhbHVlKSA9PiB7XG4gICAgICBSZWZsZWN0LnNldCh0YXJnZXQsIGtleSwgdmFsdWUpO1xuICAgIH0sXG4gIH0pO1xuXG4gIGZ1bmN0aW9uIHNldFRhcmdldChfJHRhcmdldCkge1xuICAgICR0YXJnZXQgPSBfJHRhcmdldDtcblxuICAgIGlmKG9wdGlvbnMuZGF0YXNldCl7XG4gICAgICBjb25zdCB7IGdldFByb3BzRnJvbURhdGFzZXQgfSA9IGV0VUkuaG9va3MudXNlRGF0YXNldCgkdGFyZ2V0KTtcbiAgICAgIGNvbnN0IGRhdGFzZXRQcm9wcyA9IGdldFByb3BzRnJvbURhdGFzZXQoKTtcblxuICAgICAgc2V0UHJvcHMoeyAuLi5wcm9wcywgLi4uZGF0YXNldFByb3BzIH0pO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHNldFByb3BzKG5ld1Byb3BzKSB7XG4gICAgT2JqZWN0LmtleXMobmV3UHJvcHMpLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgcHJvcHNba2V5XSA9IG5ld1Byb3BzW2tleV07XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBzZXRTdGF0ZShuZXdTdGF0ZSkge1xuICAgIGlmKGV0VUkudXRpbHMuc2hhbGxvd0NvbXBhcmUoc3RhdGUsIG5ld1N0YXRlKSkgcmV0dXJuO1xuXG4gICAgT2JqZWN0LmtleXMobmV3U3RhdGUpLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgc3RhdGVba2V5XSA9IG5ld1N0YXRlW2tleV07XG4gICAgfSk7XG5cbiAgICBpZiAocmVuZGVyKSB7XG4gICAgICByZW5kZXIoKTtcbiAgICB9XG5cbiAgICBpZiAob3B0aW9ucy5kYXRhc2V0KSB7XG4gICAgICBjb25zdCB7IHNldFZhcnNGcm9tRGF0YXNldCB9ID0gZXRVSS5ob29rcy51c2VEYXRhc2V0KCR0YXJnZXQpO1xuICAgICAgc2V0VmFyc0Zyb21EYXRhc2V0KHN0YXRlKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBhZGRFdmVudChldmVudFR5cGUsIHNlbGVjdG9yLCBjYWxsYmFjaykge1xuICAgIGNvbnN0ICRldmVudFRhcmdldCA9IHNlbGVjdG9yID8gJHRhcmdldC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKSA6ICR0YXJnZXQ7XG5cbiAgICBpZiAoTk9fQlVCQkxJTkdfRVZFTlRTLmluY2x1ZGVzKGV2ZW50VHlwZSkpIHtcbiAgICAgIGNvbnN0IGNsZWFudXAgPSBldFVJLmhvb2tzLnVzZUV2ZW50TGlzdGVuZXIoJGV2ZW50VGFyZ2V0LCBldmVudFR5cGUsIGNhbGxiYWNrKTtcbiAgICAgIHJldHVybiBjbGVhbnVwcy5wdXNoKGNsZWFudXApO1xuICAgIH1cblxuICAgIGNvbnN0IGV2ZW50SGFuZGxlciA9IChldmVudCkgPT4ge1xuICAgICAgbGV0ICRldmVudFRhcmdldCA9IGV2ZW50LnRhcmdldC5jbG9zZXN0KHNlbGVjdG9yKTtcblxuICAgICAgaWYgKCFzZWxlY3Rvcikge1xuICAgICAgICAkZXZlbnRUYXJnZXQgPSBldmVudC50YXJnZXQ7XG4gICAgICB9XG5cbiAgICAgIGlmICgkZXZlbnRUYXJnZXQpIHtcbiAgICAgICAgY2FsbGJhY2soZXZlbnQpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICAkdGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnRUeXBlLCBldmVudEhhbmRsZXIpO1xuICAgIGNvbnN0IGNsZWFudXAgPSAoKSA9PiAkdGFyZ2V0LnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnRUeXBlLCBldmVudEhhbmRsZXIpO1xuICAgIGNsZWFudXBzLnB1c2goY2xlYW51cCk7XG4gIH1cblxuICBmdW5jdGlvbiByZW1vdmVFdmVudCgpIHtcbiAgICBjbGVhbnVwcy5mb3JFYWNoKChjbGVhbnVwKSA9PiBjbGVhbnVwKCkpO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBzZXRUYXJnZXQsXG4gICAgYWN0aW9ucyxcbiAgICBzdGF0ZSxcbiAgICBwcm9wcyxcbiAgICBzZXRTdGF0ZSxcbiAgICBzZXRQcm9wcyxcbiAgICBhZGRFdmVudCxcbiAgICByZW1vdmVFdmVudCxcbiAgfTtcbn1cbiIsIi8qKlxuICogdXNlRGF0YXNldFxuICogQHBhcmFtICR0YXJnZXQge0hUTUxFbGVtZW50fVxuICovXG5mdW5jdGlvbiB1c2VEYXRhc2V0KCR0YXJnZXQpIHtcbiAgbGV0IGRhdGFzZXRQcm9wcyA9IHt9LFxuICAgIGRhdGFzZXRWYXJzID0ge307XG5cbiAgZnVuY3Rpb24gZ2V0RGF0YXNldEJ5UHJlZml4KHByZWZpeCkge1xuICAgIGNvbnN0IGRhdGFzZXQgPSB7fTtcbiAgICBPYmplY3Qua2V5cygkdGFyZ2V0LmRhdGFzZXQpLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgbGV0IHZhbHVlID0gJHRhcmdldC5kYXRhc2V0W2tleV07XG5cbiAgICAgIGlmICh2YWx1ZSA9PT0gJ3RydWUnKSB7XG4gICAgICAgIHZhbHVlID0gdHJ1ZTtcbiAgICAgIH0gZWxzZSBpZiAodmFsdWUgPT09ICdmYWxzZScpIHtcbiAgICAgICAgdmFsdWUgPSBmYWxzZTtcbiAgICAgIH0gZWxzZSBpZih0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnICYmIHZhbHVlLmluY2x1ZGVzKCd7Jykpe1xuICAgICAgICB2YWx1ZSA9IEpTT04ucGFyc2UodmFsdWUpO1xuICAgICAgfVxuXG4gICAgICBkYXRhc2V0W2V0VUkudXRpbHMucmVtb3ZlUHJlZml4Q2FtZWxTdHJpbmcoa2V5LCBwcmVmaXgpXSA9IHZhbHVlO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIGRhdGFzZXQ7XG4gIH1cblxuICBmdW5jdGlvbiBnZXREYXRhc2V0RXhjZXB0UHJlZml4KHByZWZpeCkge1xuICAgIGNvbnN0IGRhdGFzZXQgPSB7fTtcbiAgICBPYmplY3Qua2V5cygkdGFyZ2V0LmRhdGFzZXQpLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgbGV0IHZhbHVlID0gJHRhcmdldC5kYXRhc2V0W2tleV07XG5cbiAgICAgIGlmICh2YWx1ZSA9PT0gJ3RydWUnKSB7XG4gICAgICAgIHZhbHVlID0gdHJ1ZTtcbiAgICAgIH0gZWxzZSBpZiAodmFsdWUgPT09ICdmYWxzZScpIHtcbiAgICAgICAgdmFsdWUgPSBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgZGF0YXNldFtldFVJLnV0aWxzLnJlbW92ZVByZWZpeENhbWVsU3RyaW5nKGtleSwgcHJlZml4KV0gPSB2YWx1ZTtcbiAgICB9KTtcblxuICAgIHJldHVybiBkYXRhc2V0O1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0RGF0YXNldEJ5UHJlZml4KGRhdGEsIHByZWZpeCkge1xuICAgIE9iamVjdC5rZXlzKGRhdGEpLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgaWYocHJlZml4KXtcbiAgICAgICAgJHRhcmdldC5kYXRhc2V0W2Ake3ByZWZpeH0ke2V0VUkudXRpbHMuY2FwaXRhbGl6ZShrZXkpfWBdID0gZGF0YVtrZXldO1xuICAgICAgfWVsc2V7XG4gICAgICAgICR0YXJnZXQuZGF0YXNldFtrZXldID0gZGF0YVtrZXldO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0UHJvcHNGcm9tRGF0YXNldCgpIHtcbiAgICBkYXRhc2V0UHJvcHMgPSBnZXREYXRhc2V0QnlQcmVmaXgoJ3Byb3BzJyk7XG5cbiAgICByZXR1cm4gZGF0YXNldFByb3BzO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0VmFyc0Zyb21EYXRhc2V0KCkge1xuICAgIGRhdGFzZXRWYXJzID0gZ2V0RGF0YXNldEV4Y2VwdFByZWZpeCgncHJvcHMnKTtcblxuICAgIHJldHVybiBkYXRhc2V0VmFycztcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldFByb3BzRnJvbURhdGFzZXQocHJvcHMpIHtcbiAgICBzZXREYXRhc2V0QnlQcmVmaXgocHJvcHMsICdwcm9wcycpO1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0VmFyc0Zyb21EYXRhc2V0KHZhcnMpIHtcbiAgICBzZXREYXRhc2V0QnlQcmVmaXgodmFycywgJycpO1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0U3RyaW5nVG9PYmplY3QocHJvcHMpIHtcbiAgICAvLyBkYXRhc2V07JeQ7IScIOqwneyytCDtmJXtg5zsnbgg7Iqk7Yq466eB6rCSIO2DgOyehSDqsJ3ssrTroZwg67CU6r+U7KSMXG4gICAgZm9yIChjb25zdCBrZXkgaW4gcHJvcHMpIHtcbiAgICAgIGlmICghKHR5cGVvZiBwcm9wc1trZXldID09PSAnYm9vbGVhbicpICYmIHByb3BzW2tleV0uaW5jbHVkZXMoJ3snKSkge1xuICAgICAgICBwcm9wc1trZXldID0gSlNPTi5wYXJzZShwcm9wc1trZXldKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcHJvcHM7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGdldFByb3BzRnJvbURhdGFzZXQsXG4gICAgc2V0UHJvcHNGcm9tRGF0YXNldCxcbiAgICBnZXRWYXJzRnJvbURhdGFzZXQsXG4gICAgc2V0VmFyc0Zyb21EYXRhc2V0LFxuICAgIHNldFN0cmluZ1RvT2JqZWN0LFxuICB9O1xufVxuIiwiZnVuY3Rpb24gdXNlRGlhbG9nKCkge1xuICBjb25zdCBhbGVydCA9ICguLi5vcHRzKSA9PiB7XG4gICAgY29uc3QgJGxheWVyV3JhcCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5sYXllci13cmFwJyk7XG4gICAgY29uc3QgZGlhbG9nID0gbmV3IGV0VUkuY29tcG9uZW50cy5EaWFsb2coKTtcblxuICAgIGlmKHR5cGVvZiBvcHRzWzBdID09PSAnc3RyaW5nJyl7XG4gICAgICBkaWFsb2cuY29yZS5pbml0KCRsYXllcldyYXAsIHsgZGlhbG9nVHlwZTogJ2FsZXJ0JywgbWVzc2FnZTogb3B0c1swXSwgY2FsbGJhY2s6IG9wdHNbMV0gfSk7XG4gICAgfWVsc2UgaWYodHlwZW9mIG9wdHNbMF0gPT09ICdvYmplY3QnKXtcbiAgICAgIGRpYWxvZy5jb3JlLmluaXQoJGxheWVyV3JhcCwgeyBkaWFsb2dUeXBlOiAnYWxlcnQnLCAuLi5vcHRzWzBdIH0pO1xuICAgIH1cblxuICAgIGRpYWxvZy5vcGVuKCk7XG4gIH07XG5cbiAgY29uc3QgY29uZmlybSA9ICguLi5vcHRzKSA9PiB7XG4gICAgY29uc3QgJGxheWVyV3JhcCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5sYXllci13cmFwJyk7XG4gICAgY29uc3QgZGlhbG9nID0gbmV3IGV0VUkuY29tcG9uZW50cy5EaWFsb2coKTtcblxuICAgIGlmKHR5cGVvZiBvcHRzWzBdID09PSAnc3RyaW5nJyl7XG4gICAgICBkaWFsb2cuY29yZS5pbml0KCRsYXllcldyYXAsIHsgZGlhbG9nVHlwZTogJ2NvbmZpcm0nLCBtZXNzYWdlOiBvcHRzWzBdLCBwb3NpdGl2ZUNhbGxiYWNrOiBvcHRzWzFdIH0pO1xuICAgIH1lbHNlIGlmKHR5cGVvZiBvcHRzWzBdID09PSAnb2JqZWN0Jyl7XG4gICAgICBkaWFsb2cuY29yZS5pbml0KCRsYXllcldyYXAsIHsgZGlhbG9nVHlwZTogJ2NvbmZpcm0nLCAuLi5vcHRzWzBdIH0pO1xuICAgIH1cblxuICAgIGRpYWxvZy5vcGVuKCk7XG4gIH07XG5cbiAgY29uc3QgcHJldmlld0ltYWdlID0gKC4uLm9wdHMpID0+IHtcbiAgICBjb25zdCAkbGF5ZXJXcmFwID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmxheWVyLXdyYXAnKTtcbiAgICBjb25zdCBkaWFsb2cgPSBuZXcgZXRVSS5jb21wb25lbnRzLkRpYWxvZygpO1xuXG5cbiAgICBkaWFsb2cuY29yZS5pbml0KCRsYXllcldyYXAsIHsgZGlhbG9nVHlwZTogJ3ByZXZpZXdJbWFnZScsIC4uLm9wdHNbMF0gfSk7XG5cbiAgICBkaWFsb2cub3BlbigpO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBhbGVydCxcbiAgICBjb25maXJtLFxuICAgIHByZXZpZXdJbWFnZVxuICB9O1xufVxuIiwiZnVuY3Rpb24gdXNlRGlhbG9nVG1wbCgpIHtcbiAgY29uc3QgJHRlbXBsYXRlSFRNTCA9ICh7IGRpYWxvZ1R5cGUsIHR5cGUsIHRpdGxlLCBtZXNzYWdlLCBwb3NpdGl2ZVRleHQsIG5lZ2F0aXZlVGV4dCB9KSA9PiBgXG4gICAgICA8ZGl2IGNsYXNzPVwiZGlhbG9nLWRpbW1cIj48L2Rpdj5cbiAgICAgIDxkaXYgY2xhc3M9XCJkaWFsb2ctZnJhbWVcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cImRpYWxvZy1jb250YWluZXJcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwiZGlhbG9nLWhlYWRlclwiPlxuICAgICAgICAgICAgJHt0aXRsZSA/IGA8aDMgY2xhc3M9XCJkaWFsb2ctdGl0XCI+JHt0aXRsZX08L2gzPmAgOiAnJ31cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwiZGlhbG9nLWNvbnRlbnRcIj5cbiAgICAgICAgICAgICR7ZGlhbG9nVHlwZSA9PT0gJ2FsZXJ0JyA/IGA8c3BhbiBjbGFzcz1cIiR7dHlwZX1cIj5pY29uPC9zcGFuPmAgOiAnJ31cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgPHAgY2xhc3M9XCJkaWFsb2ctaW5mb1wiPiR7bWVzc2FnZS5yZXBsYWNlKC9cXG4vZywgJzxicj4nKX08L3A+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cImJ0bi1ncm91cFwiPlxuICAgICAgICAgICAgJHtkaWFsb2dUeXBlID09PSAnY29uZmlybScgPyBgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG4gZGlhbG9nLW5lZ2F0aXZlXCI+JHtuZWdhdGl2ZVRleHR9PC9idXR0b24+YCA6ICcnfVxuICAgICAgICAgICAgJHtwb3NpdGl2ZVRleHQgPyBgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG4gZGlhbG9nLXBvc2l0aXZlIGJ0bi1wcmltYXJ5XCI+JHtwb3NpdGl2ZVRleHR9PC9idXR0b24+YCA6ICcnfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIGA7XG5cbiAgICBjb25zdCAkdGVtcGxhdGVQcmV2aWV3SW1hZ2VIVE1MID0gKHtkaWFsb2dUeXBlLCBpbWFnZXMsIHRpdGxlfSkgPT4gYFxuICAgICAgPGRpdiBjbGFzcz1cImRpYWxvZy1kaW1tXCI+PC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzPVwiZGlhbG9nLWZyYW1lXCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJkaWFsb2ctY29udGFpbmVyXCI+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cImRpYWxvZy1oZWFkZXJcIj5cbiAgICAgICAgICAgICR7dGl0bGUgPyBgPGgzIGNsYXNzPVwiZGlhbG9nLXRpdFwiPiR7dGl0bGV9PC9oMz5gIDogJyd9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cImRpYWxvZy1jb250ZW50XCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29tcG9uZW50LXN3aXBlclwiIGRhdGEtY29tcG9uZW50PVwic3dpcGVyXCI+XG4gICAgICAgICAgICAgIDwhLS0gQWRkaXRpb25hbCByZXF1aXJlZCB3cmFwcGVyIC0tPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwic3dpcGVyLXdyYXBwZXJcIj5cbiAgICAgICAgICAgICAgICAke2ltYWdlcy5tYXAoKGltYWdlKSA9PiAoYFxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInN3aXBlci1zbGlkZVwiPlxuICAgICAgICAgICAgICAgICAgICA8aW1nIHNyYz1cIiR7aW1hZ2Uuc3JjfVwiIGFsdD1cIiR7aW1hZ2UuYWx0fVwiIC8+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICBgKSkuam9pbignJyl9XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgYFxuXG4gICAgcmV0dXJuIHtcbiAgICAgICR0ZW1wbGF0ZUhUTUwsXG4gICAgICAkdGVtcGxhdGVQcmV2aWV3SW1hZ2VIVE1MXG4gICAgfVxufVxuIiwiLyoqXG4gKiB1c2VFdmVudExpc3RlbmVyXG4gKiBAcGFyYW0gdGFyZ2V0ICB7SFRNTEVsZW1lbnR9XG4gKiBAcGFyYW0gdHlwZSAge3N0cmluZ31cbiAqIEBwYXJhbSBsaXN0ZW5lciAge2Z1bmN0aW9ufVxuICogQHBhcmFtIG9wdGlvbnMge29iamVjdH1cbiAqIEByZXR1cm5zIHtmdW5jdGlvbigpOiAqfVxuICovXG5mdW5jdGlvbiB1c2VFdmVudExpc3RlbmVyKHRhcmdldCwgdHlwZSwgbGlzdGVuZXIsIG9wdGlvbnMgPSB7fSl7XG4gIHRhcmdldC5hZGRFdmVudExpc3RlbmVyKHR5cGUsIGxpc3RlbmVyLCBvcHRpb25zKTtcbiAgcmV0dXJuICgpID0+IHRhcmdldC5yZW1vdmVFdmVudExpc3RlbmVyKHR5cGUsIGxpc3RlbmVyLCBvcHRpb25zKTtcbn1cbiIsIi8qKlxuICogZ2V0Qm91bmRpbmdDbGllbnRSZWN0XG4gKiBAcGFyYW0geyBFbGVtZW50IH0gcGFyZW50XG4gKiBAcGFyYW0geyBTdHJpbmcgfSBzZWxlY3RvclxuICogQHJldHVybnNcbiAqL1xuZnVuY3Rpb24gdXNlR2V0Q2xpZW50UmVjdChwYXJlbnQsIHNlbGVjdG9yKSB7XG4gIGNvbnN0IHJlY3QgPSBwYXJlbnQucXVlcnlTZWxlY3RvcihzZWxlY3Rvcik/LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICBpZiAoIXJlY3QpIHJldHVybiB7fTtcbiAgZWxzZVxuICAgIHJldHVybiB7XG4gICAgICB3aWR0aDogcmVjdC53aWR0aCxcbiAgICAgIGhlaWdodDogcmVjdC5oZWlnaHQsXG4gICAgICB0b3A6IHJlY3QudG9wLFxuICAgICAgYm90dG9tOiByZWN0LmJvdHRvbSxcbiAgICAgIGxlZnQ6IHJlY3QubGVmdCxcbiAgICAgIHJpZ2h0OiByZWN0LnJpZ2h0LFxuICAgIH07XG59XG4iLCJmdW5jdGlvbiB1c2VMYXllcih0eXBlID0gJ21vZGFsJyl7XG4gIGZ1bmN0aW9uIGdldFZpc2libGVMYXllcigpe1xuICAgIGNvbnN0ICRsYXllckNvbXBvbmVudHMgPSBBcnJheS5mcm9tKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5sYXllci13cmFwJykuY2hpbGRyZW4pLmZpbHRlcigoJGVsKSA9PiB7XG4gICAgICBjb25zdCBpc01vZGFsQ29tcG9uZW50ID0gJGVsLmNsYXNzTGlzdC5jb250YWlucygnY29tcG9uZW50LW1vZGFsJylcbiAgICAgIGNvbnN0IGlzRGlhbG9nQ29tcG9uZW50ID0gJGVsLmNsYXNzTGlzdC5jb250YWlucygnY29tcG9uZW50LWRpYWxvZycpXG5cbiAgICAgIHJldHVybiBpc01vZGFsQ29tcG9uZW50IHx8IGlzRGlhbG9nQ29tcG9uZW50XG4gICAgfSlcblxuICAgIHJldHVybiAkbGF5ZXJDb21wb25lbnRzLmZpbHRlcigoJGVsKSA9PiB7XG4gICAgICBjb25zdCBzdHlsZSA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKCRlbCk7XG4gICAgICByZXR1cm4gc3R5bGUuZGlzcGxheSAhPT0gJ25vbmUnXG4gICAgfSlcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldFRvcERlcHRoKCl7XG4gICAgY29uc3QgJHZpc2libGVMYXllckNvbXBvbmVudHMgPSBnZXRWaXNpYmxlTGF5ZXIoKVxuICAgIHJldHVybiAxMDAgKyAkdmlzaWJsZUxheWVyQ29tcG9uZW50cy5sZW5ndGhcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldExheWVyT3BhY2l0eShkZWZhdWx0T3BhY2l0eSA9IDAuNSl7XG4gICAgY29uc3QgJHZpc2libGVMYXllckNvbXBvbmVudHMgPSBnZXRWaXNpYmxlTGF5ZXIoKVxuICAgICR2aXNpYmxlTGF5ZXJDb21wb25lbnRzLmZvckVhY2goKCRlbCwgaW5kZXgpID0+IHtcblxuICAgICAgY29uc3Qgb3BhY2l0eSA9IGV0VUkudXRpbHMuZ2V0QmxlbmRPcGFjaXR5KGRlZmF1bHRPcGFjaXR5LCAkdmlzaWJsZUxheWVyQ29tcG9uZW50cy5sZW5ndGgpXG5cbiAgICAgIGlmKCRlbC5xdWVyeVNlbGVjdG9yKGAubW9kYWwtZGltbWApKXtcbiAgICAgICAgJGVsLnF1ZXJ5U2VsZWN0b3IoYC5tb2RhbC1kaW1tYCkuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gYHJnYmEoMCwgMCwgMCwgJHtvcGFjaXR5fSlgXG4gICAgICB9XG5cbiAgICAgIGlmKCRlbC5xdWVyeVNlbGVjdG9yKGAuZGlhbG9nLWRpbW1gKSl7XG4gICAgICAgICRlbC5xdWVyeVNlbGVjdG9yKGAuZGlhbG9nLWRpbW1gKS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBgcmdiYSgwLCAwLCAwLCAke29wYWNpdHl9KWBcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBnZXRWaXNpYmxlTGF5ZXIsXG4gICAgZ2V0VG9wRGVwdGgsXG4gICAgc2V0TGF5ZXJPcGFjaXR5XG4gIH1cbn1cbiIsImZ1bmN0aW9uIHVzZU11dGF0aW9uU3RhdGUoKXtcbiAgbGV0ICR0YXJnZXQsICRyZWYgPSB7XG4gICAgJHN0YXRlOiB7fVxuICB9LCBtdXRhdGlvbk9ic2VydmVyLCByZW5kZXI7XG5cbiAgZnVuY3Rpb24gaW5pdE11dGF0aW9uU3RhdGUoXyR0YXJnZXQsIF9yZW5kZXIpe1xuICAgICR0YXJnZXQgPSBfJHRhcmdldFxuICAgIHJlbmRlciA9IF9yZW5kZXI7XG5cbiAgICBzZXRNdXRhdGlvbk9ic2VydmVyKClcbiAgICBzZXRTdGF0ZUJ5RGF0YXNldCgpXG4gIH1cblxuICBmdW5jdGlvbiBzZXRTdGF0ZUJ5RGF0YXNldCgpe1xuICAgIGNvbnN0IGZpbHRlcmVkRGF0YXNldCA9IHt9O1xuICAgIGNvbnN0IGRhdGFzZXQgPSAkdGFyZ2V0LmRhdGFzZXQ7XG5cbiAgICBPYmplY3Qua2V5cyhkYXRhc2V0KS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgIGlmKGtleS5zdGFydHNXaXRoKCd2YXJzJykpe1xuICAgICAgICBmaWx0ZXJlZERhdGFzZXRba2V5LnJlcGxhY2UoJ3ZhcnMnLCAnJykudG9Mb3dlckNhc2UoKV0gPSBkYXRhc2V0W2tleV07XG4gICAgICB9XG4gICAgfSlcblxuICAgIHNldFN0YXRlKGZpbHRlcmVkRGF0YXNldClcbiAgICByZW5kZXIoKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldE11dGF0aW9uT2JzZXJ2ZXIoKXtcbiAgICBjb25zdCBjb25maWcgPSB7IGF0dHJpYnV0ZXM6IHRydWUsIGNoaWxkTGlzdDogZmFsc2UsIHN1YnRyZWU6IGZhbHNlIH07XG5cbiAgICBjb25zdCBjYWxsYmFjayA9IChtdXRhdGlvbkxpc3QsIG9ic2VydmVyKSA9PiB7XG4gICAgICBmb3IgKGNvbnN0IG11dGF0aW9uIG9mIG11dGF0aW9uTGlzdCkge1xuICAgICAgICBpZiAobXV0YXRpb24udHlwZSA9PT0gXCJhdHRyaWJ1dGVzXCJcbiAgICAgICAgICAmJiBtdXRhdGlvbi5hdHRyaWJ1dGVOYW1lICE9PSAnc3R5bGUnXG4gICAgICAgICAgJiYgbXV0YXRpb24uYXR0cmlidXRlTmFtZSAhPT0gJ2NsYXNzJ1xuICAgICAgICApIHtcbiAgICAgICAgICBzZXRTdGF0ZUJ5RGF0YXNldCgpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgbXV0YXRpb25PYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKGNhbGxiYWNrKTtcbiAgICBtdXRhdGlvbk9ic2VydmVyLm9ic2VydmUoJHRhcmdldCwgY29uZmlnKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldFN0YXRlKG5ld1N0YXRlKXtcbiAgICAkcmVmLiRzdGF0ZSA9IHsgLi4uJHJlZi4kc3RhdGUsIC4uLm5ld1N0YXRlIH07XG4gIH1cblxuICBmdW5jdGlvbiBzZXREYXRhU3RhdGUobmV3U3RhdGUpIHtcbiAgICBjb25zdCAkbmV3U3RhdGUgPSB7IC4uLiRyZWYuJHN0YXRlLCAuLi5uZXdTdGF0ZSB9O1xuXG4gICAgT2JqZWN0LmtleXMoJG5ld1N0YXRlKS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgICR0YXJnZXQuZGF0YXNldFtgdmFycyR7ZXRVSS51dGlscy5jYXBpdGFsaXplKGtleSl9YF0gPSAkbmV3U3RhdGVba2V5XTtcbiAgICB9KVxuICB9XG5cbiAgcmV0dXJuIHtcbiAgICAkcmVmLFxuICAgIHNldFN0YXRlLFxuICAgIHNldERhdGFTdGF0ZSxcbiAgICBpbml0TXV0YXRpb25TdGF0ZVxuICB9XG59XG4iLCJmdW5jdGlvbiB1c2VTZWxlY3RCb3hUZW1wKCkge1xuICBjb25zdCAkdGVtcGxhdGVDdXN0b21IVE1MID0ge1xuICAgIGxhYmVsKHRleHQpIHtcbiAgICAgIHJldHVybiBgXG4gICAgICAgIDxkaXYgaWQ9XCJjb21ibzEtbGFiZWxcIiBjbGFzcz1cImNvbWJvLWxhYmVsXCI+JHt0ZXh0fTwvZGl2PlxuICAgICAgYDtcbiAgICB9LFxuICAgIHNlbGVjdEJ0bih0ZXh0KSB7XG4gICAgICByZXR1cm4gYFxuICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgaWQ9XCJjb21ibzFcIiBjbGFzcz1cInNlbGVjdC1ib3hcIiByb2xlPVwiY29tYm9ib3hcIiBhcmlhLWNvbnRyb2xzPVwibGlzdGJveDFcIiBhcmlhLWV4cGFuZGVkPVwiZmFsc2VcIiBhcmlhLWxhYmVsbGVkYnk9XCJjb21ibzEtbGFiZWxcIiBhcmlhLWFjdGl2ZWRlc2NlbmRhbnQ9XCJcIj5cbiAgICAgICAgPHNwYW4gc3R5bGU9XCJwb2ludGVyLWV2ZW50czogbm9uZTtcIj4ke3RleHR9PC9zcGFuPlxuICAgICAgPC9idXR0b24+XG4gICAgICBgO1xuICAgIH0sXG4gICAgaXRlbXNXcmFwKGl0ZW1zSFRNTCkge1xuICAgICAgcmV0dXJuIGBcbiAgICAgICAgPHVsIGlkPVwibGlzdGJveDFcIiBjbGFzcz1cInNlbGVjdC1vcHRpb25zXCIgcm9sZT1cImxpc3Rib3hcIiBhcmlhLWxhYmVsbGVkYnk9XCJjb21ibzEtbGFiZWxcIiB0YWJpbmRleD1cIi0xXCI+XG4gICAgICAgICAgJHtpdGVtc0hUTUx9XG4gICAgICAgIDwvdWw+XG4gICAgICBgO1xuICAgIH0sXG4gICAgaXRlbXMoaXRlbSwgc2VsZWN0ZWQgPSBmYWxzZSkge1xuICAgICAgcmV0dXJuIGBcbiAgICAgICAgPGxpIHJvbGU9XCJvcHRpb25cIiBjbGFzcz1cIm9wdGlvblwiIGFyaWEtc2VsZWN0ZWQ9XCIke3NlbGVjdGVkfVwiIGRhdGEtdmFsdWU9XCIke2l0ZW0udmFsdWV9XCI+XG4gICAgICAgICAgJHtpdGVtLnRleHR9XG4gICAgICAgIDwvbGk+XG4gICAgICBgO1xuICAgIH0sXG4gIH07XG5cbiAgY29uc3QgJHRlbXBsYXRlQmFzaWNIVE1MID0ge1xuICAgIGxhYmVsKHRleHQpIHtcbiAgICAgIHJldHVybiBgXG4gICAgICAgIDxkaXYgaWQ9XCJjb21ibzEtbGFiZWxcIiBjbGFzcz1cImNvbWJvLWxhYmVsXCI+JHt0ZXh0fTwvZGl2PlxuICAgICAgYDtcbiAgICB9LFxuICAgIHNlbGVjdEJ0bih0ZXh0KSB7XG4gICAgICByZXR1cm4gYFxuICAgICAgICA8b3B0aW9uIHZhbHVlPVwiXCIgc2VsZWN0ZWQgZGlzYWJsZWQgaGlkZGVuPiR7dGV4dH08L29wdGlvbj5cbiAgICAgIGA7XG4gICAgfSxcbiAgICBpdGVtc1dyYXAoaXRlbXNIVE1MKSB7XG4gICAgICByZXR1cm4gYFxuICAgICAgICA8c2VsZWN0IGNsYXNzPVwic2VsZWN0LWxpc3RcIiByZXF1aXJlZD5cbiAgICAgICAgICAke2l0ZW1zSFRNTH1cbiAgICAgICAgPC9zZWxlY3Q+XG4gICAgICBgO1xuICAgIH0sXG4gICAgaXRlbXMoaXRlbSwgc2VsZWN0ZWQgPSBmYWxzZSkge1xuICAgICAgcmV0dXJuIGBcbiAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIiR7aXRlbS52YWx1ZX1cIj4ke2l0ZW0udGV4dH08L29wdGlvbj5cbiAgICAgIGA7XG4gICAgfSxcbiAgfTtcblxuICByZXR1cm4ge1xuICAgICR0ZW1wbGF0ZUN1c3RvbUhUTUwsXG4gICAgJHRlbXBsYXRlQmFzaWNIVE1MLFxuICB9O1xufVxuIiwiZnVuY3Rpb24gdXNlU3RhdGUoaW5pdGlhbFZhbHVlID0ge30sIGNhbGxiYWNrKSB7XG4gIGNvbnN0IHN0YXRlID0gbmV3IFByb3h5KGluaXRpYWxWYWx1ZSwge1xuICAgIHNldDogKHRhcmdldCwga2V5LCB2YWx1ZSkgPT4ge1xuICAgICAgdGFyZ2V0W2tleV0gPSB2YWx1ZTtcblxuICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgIGNhbGxiYWNrKHRhcmdldCk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcblxuICBjb25zdCBzZXRTdGF0ZSA9IChuZXdTdGF0ZSkgPT4ge1xuICAgIE9iamVjdC5rZXlzKG5ld1N0YXRlKS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgIHN0YXRlW2tleV0gPSBuZXdTdGF0ZVtrZXldO1xuICAgIH0pXG4gIH1cblxuICByZXR1cm4gW3N0YXRlLCBzZXRTdGF0ZV07XG59XG4iLCJmdW5jdGlvbiB1c2VTd2lwZXJUbXBsKCkge1xuICBjb25zdCAkdGVtcGxhdGVIVE1MID0ge1xuICAgIG5hdmlnYXRpb24oKSB7XG4gICAgICByZXR1cm4gYFxuICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInN3aXBlci1idXR0b24tcHJldlwiPuydtOyghDwvYnV0dG9uPlxuICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInN3aXBlci1idXR0b24tbmV4dFwiPuuLpOydjDwvYnV0dG9uPlxuICAgICAgYDtcbiAgICB9LFxuICAgIHBhZ2luYXRpb24oKSB7XG4gICAgICByZXR1cm4gYFxuICAgICAgICA8ZGl2IGNsYXNzPVwic3dpcGVyLXBhZ2luYXRpb25cIj48L2Rpdj5cbiAgICAgIGA7XG4gICAgfSxcbiAgICBhdXRvcGxheSgpIHtcbiAgICAgIHJldHVybiBgXG4gICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInN3aXBlci1hdXRvcGxheSBwbGF5XCI+PC9idXR0b24+XG4gICAgICBgO1xuICAgIH0sXG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICAkdGVtcGxhdGVIVE1MLFxuICB9O1xufVxuIiwiLyoqXG4gKiB0ZW1wIHRpbWVsaW5lXG4gKiBAcmV0dXJuc1xuICovXG5mdW5jdGlvbiB1c2VUcmFuc2l0aW9uKCkge1xuICAvLyBzZWxlY3RcbiAgY29uc3QgdXNlU2VsZWN0U2hvdyA9ICh0YXJnZXQsIHR5cGUsIG9wdGlvbikgPT4ge1xuICAgIGlmICghdGFyZ2V0KSByZXR1cm47XG5cbiAgICBjb25zdCB0aW1lbGluZSA9IGdzYXAudGltZWxpbmUoeyBwYXVzZWQ6IHRydWUgfSk7XG5cbiAgICBjb25zdCBvcHRpb25MaXN0ID0ge1xuICAgICAgZmFzdDogeyBkdXJhdGlvbjogMC4xIH0sXG4gICAgICBub3JtYWw6IHsgZHVyYXRpb246IDAuMyB9LFxuICAgICAgc2xvdzogeyBkdXJhdGlvbjogMC43IH0sXG4gICAgfTtcbiAgICBsZXQgZ3NhcE9wdGlvbiA9IHsgLi4ub3B0aW9uTGlzdFt0eXBlXSwgLi4ub3B0aW9uIH07XG5cbiAgICB0aW1lbGluZS50byh0YXJnZXQsIHtcbiAgICAgIGFscGhhOiAwLFxuICAgICAgZWFzZTogXCJsaW5lYXJcIixcbiAgICAgIG9uQ29tcGxldGUoKSB7XG4gICAgICAgIHRhcmdldC5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICB9LFxuICAgICAgLi4uZ3NhcE9wdGlvbixcbiAgICB9KTtcblxuICAgIHJldHVybiB7XG4gICAgICB0aW1lbGluZUVsOiB0aW1lbGluZS5fcmVjZW50LnZhcnMsXG4gICAgICB0aW1lbGluZTogKHN0YXRlKSA9PiB7XG4gICAgICAgIHN0YXRlID8gKCh0YXJnZXQuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIiksIHRpbWVsaW5lLnJldmVyc2UoKSkgOiB0aW1lbGluZS5wbGF5KCk7XG4gICAgICB9LFxuICAgIH07XG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICB1c2VTZWxlY3RTaG93LFxuICB9O1xufVxuIiwiXG5ldFVJLmhvb2tzID0ge1xuXHR1c2VDbGlja091dHNpZGUsXG5cdHVzZUNvcmUsXG5cdHVzZURhdGFzZXQsXG5cdHVzZURpYWxvZyxcblx0dXNlRGlhbG9nVG1wbCxcblx0dXNlRXZlbnRMaXN0ZW5lcixcblx0dXNlR2V0Q2xpZW50UmVjdCxcblx0dXNlTGF5ZXIsXG5cdHVzZU11dGF0aW9uU3RhdGUsXG5cdHVzZVNlbGVjdEJveFRlbXAsXG5cdHVzZVN0YXRlLFxuXHR1c2VTd2lwZXJUbXBsLFxuXHR1c2VUcmFuc2l0aW9uXG59XG4iLCIvKipcbiAqIEB0eXBlZGVmIHtPYmplY3R9IFByb3BzQ29uZmlnXG4gKiBAcHJvcGVydHkge2Jvb2xlYW59IGRpc2FibGVkIC0g7JqU7IaM6rCAIOu5hO2ZnOyEse2ZlCDsg4Htg5zsnbjsp4Drpbwg64KY7YOA64OF64uI64ukLlxuICogQHByb3BlcnR5IHtib29sZWFufSBvbmNlIC0g7J2067Kk7Yq464KYIOyVoeyFmOydhCDtlZwg67KI66eMIOyLpO2Wie2VoOyngCDsl6zrtoDrpbwg6rKw7KCV7ZWp64uI64ukLlxuICogQHByb3BlcnR5IHtmYWxzZSB8IG51bWJlcn0gZHVyYXRpb24gLSDslaDri4jrqZTsnbTshZgg65iQ64qUIOydtOuypO2KuCDsp4Dsho0g7Iuc6rCE7J2EIOuwgOumrOy0iCDri6jsnITroZwg7ISk7KCV7ZWp64uI64ukLiAnZmFsc2Un7J28IOqyveyasCDsp4Dsho0g7Iuc6rCE7J2EIOustOyLnO2VqeuLiOuLpC5cbiAqIEBwcm9wZXJ0eSB7T2JqZWN0fSBvcmlnaW4gLSDsm5DsoJAg65iQ64qUIOyLnOyekSDsp4DsoJDsnYQg64KY7YOA64K064qUIOqwneyytOyeheuLiOuLpC5cbiAqL1xuXG4vKipcbiAqIEB0eXBlZGVmIHtPYmplY3R9IFN0YXRlQ29uZmlnXG4gKiBAcHJvcGVydHkgeydjbG9zZScgfCAnb3Blbid9IHN0YXRlIC0g7JWE7L2U65SU7Ja47J2YIOyDge2DnOqwki4gY2xvc2UsIG9wZW4g65GYIOykkeyXkCDtlZjrgpjsnoXri4jri6QuXG4gKi9cblxuLyoqIEB0eXBlIHtQcm9wc0NvbmZpZ30gKi9cbi8qKiBAdHlwZSB7U3RhdGVDb25maWd9ICovXG5cbmZ1bmN0aW9uIEFjY29yZGlvbigpIHtcbiAgY29uc3QgeyBhY3Rpb25zLCBwcm9wcywgc3RhdGUsIHNldFByb3BzLCBzZXRTdGF0ZSwgc2V0VGFyZ2V0LCBhZGRFdmVudCwgcmVtb3ZlRXZlbnQgfSA9IGV0VUkuaG9va3MudXNlQ29yZShcbiAgICB7XG4gICAgICBkZWZhdWx0VmFsdWU6IDAsXG4gICAgICBjb2xsYXBzaWJsZTogZmFsc2UsXG4gICAgICBhbmltYXRpb246IHtcbiAgICAgICAgZHVyYXRpb246IDAuNSxcbiAgICAgICAgZWFzaW5nOiBcInBvd2VyNC5vdXRcIixcbiAgICAgIH0sXG4gICAgICB0eXBlOiBcIm11bHRpcGxlXCIsXG4gICAgfSxcbiAgICB7fSxcbiAgICByZW5kZXIsXG4gICk7XG5cbiAgLy8gY29uc3RhbnRcblxuICAvLyB2YXJpYWJsZVxuICBjb25zdCBuYW1lID0gXCJhY2NvcmRpb25cIjtcbiAgbGV0IGNvbXBvbmVudCA9IHt9O1xuICAvLyBlbGVtZW50LCBzZWxlY3RvclxuICBsZXQgYWNjb3JkaW9uVG9nZ2xlQnRuLCBhY2NvcmRpb25JdGVtO1xuICBsZXQgJHRhcmdldCwgJGFjY29yZGlvbkNvbnRlbnRzLCAkYWNjb3JkaW9uSXRlbTtcblxuICB7XG4gICAgZnVuY3Rpb24gaW5pdChfJHRhcmdldCwgX3Byb3BzKSB7XG4gICAgICBpZiAodHlwZW9mIF8kdGFyZ2V0ID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICR0YXJnZXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKF8kdGFyZ2V0KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICR0YXJnZXQgPSBfJHRhcmdldDtcbiAgICAgIH1cblxuICAgICAgaWYgKCEkdGFyZ2V0KSB7XG4gICAgICAgIHRocm93IEVycm9yKFwidGFyZ2V07J20IOyhtOyerO2VmOyngCDslYrsirXri4jri6QuXCIpO1xuICAgICAgfVxuXG4gICAgICBzZXRUYXJnZXQoJHRhcmdldCk7XG4gICAgICBzZXRQcm9wcyh7IC4uLnByb3BzLCAuLi5fcHJvcHMgfSk7XG5cbiAgICAgIGlmICgkdGFyZ2V0LnVpKSByZXR1cm47XG4gICAgICAkdGFyZ2V0LnVpID0gY29tcG9uZW50O1xuXG4gICAgICBzZXR1cCgpO1xuICAgICAgc2V0RXZlbnQoKTtcblxuICAgICAgJHRhcmdldC5zZXRBdHRyaWJ1dGUoXCJkYXRhLWluaXRcIiwgXCJ0cnVlXCIpO1xuXG4gICAgICBjb25zb2xlLmxvZygkdGFyZ2V0KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzZXR1cCgpIHtcbiAgICAgIHNldHVwU2VsZWN0b3IoKTtcbiAgICAgIHNldHVwRWxlbWVudCgpO1xuICAgICAgc2V0dXBBY3Rpb25zKCk7XG5cbiAgICAgIC8vIHN0YXRlXG4gICAgICBzZXRTdGF0ZSh7IHNldHRpbmc6IFwiY3VzdG9tXCIgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogdXBkYXRlXG4gICAgICogQHBhcmFtIF9wcm9wc1xuICAgICAqL1xuICAgIGZ1bmN0aW9uIHVwZGF0ZShfcHJvcHMpIHtcbiAgICAgIGlmIChfcHJvcHMgJiYgZXRVSS51dGlscy5zaGFsbG93Q29tcGFyZShwcm9wcywgX3Byb3BzKSAmJiAhJHRhcmdldC5nZXRBdHRyaWJ1dGUoXCJkYXRhLWluaXRcIikpIHJldHVybjtcbiAgICAgIGRlc3Ryb3koKTtcblxuICAgICAgc2V0UHJvcHMoeyAuLi5wcm9wcywgLi4uX3Byb3BzIH0pO1xuICAgICAgc2V0dXAoKTtcbiAgICAgIHNldEV2ZW50KCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZGVzdHJveSgpIHtcbiAgICAgIHJlbW92ZUV2ZW50KCk7XG4gICAgICAkdGFyZ2V0LnVpID0gbnVsbDtcbiAgICAgICR0YXJnZXQucmVtb3ZlQXR0cmlidXRlKFwiZGF0YS1pbml0XCIpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHNldHVwU2VsZWN0b3IoKSB7XG4gICAgLy8gc2VsZWN0b3JcbiAgICBhY2NvcmRpb25Ub2dnbGVCdG4gPSBcIi5hY2NvcmRpb24tdGl0XCI7XG4gICAgYWNjb3JkaW9uSXRlbSA9IFwiLmFjY29yZGlvbi1pdGVtXCI7XG5cbiAgICAvLyBlbGVtZW50XG4gICAgJGFjY29yZGlvbkl0ZW0gPSAkdGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoYWNjb3JkaW9uSXRlbSk7XG4gICAgJGFjY29yZGlvbkNvbnRlbnRzID0gJHRhcmdldC5xdWVyeVNlbGVjdG9yKFwiLmFjY29yZGlvbi1jb250ZW50XCIpO1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0dXBFbGVtZW50KCkge1xuICAgIC8vIGlkXG4gICAgY29uc3QgaWQgPSBldFVJLnV0aWxzLmdldFJhbmRvbVVJSUQobmFtZSk7XG5cbiAgICAkdGFyZ2V0LnNldEF0dHJpYnV0ZShcImFyaWEtZXhwYW5kZWRcIiwgZmFsc2UpO1xuICAgICRhY2NvcmRpb25Db250ZW50cy5zZXRBdHRyaWJ1dGUoXCJhcmlhLWhpZGRlblwiLCB0cnVlKTtcbiAgICAkYWNjb3JkaW9uQ29udGVudHMuc2V0QXR0cmlidXRlKFwicm9sZVwiLCBcInJlZ2lvblwiKTtcbiAgICAkdGFyZ2V0LnNldEF0dHJpYnV0ZShcImlkXCIsIGlkKTtcbiAgICAkdGFyZ2V0LnNldEF0dHJpYnV0ZShcImFyaWEtbGFiZWxsZWRieVwiLCBpZCk7XG4gIH1cblxuICBmdW5jdGlvbiBzZXR1cEFjdGlvbnMoKSB7XG4gICAgY29uc3QgaXNDdXN0b20gPSBwcm9wcy5zZXR0aW5nID09PSBcImN1c3RvbVwiO1xuICAgIGNvbnN0IHsgZHVyYXRpb24sIGVhc2VpbmcgfSA9IHByb3BzLmFuaW1hdGlvbjtcblxuICAgIGFjdGlvbnMub3BlbiA9ICh0YXJnZXQgPSAkYWNjb3JkaW9uSXRlbSkgPT4ge1xuICAgICAgdGFyZ2V0LnNldEF0dHJpYnV0ZShcImFyaWEtZXhwYW5kZWRcIiwgdHJ1ZSk7XG4gICAgICBpZiAoIWlzQ3VzdG9tKSB7XG4gICAgICAgIHRhcmdldC5jbGFzc0xpc3QuYWRkKFwic2hvd1wiKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGdzYXAudGltZWxpbmUoKS50byh0YXJnZXQsIHsgZHVyYXRpb246IGR1cmF0aW9uLCBlYXNlOiBlYXNlaW5nLCBwYWRkaW5nOiBcIjNyZW1cIiB9KTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgYWN0aW9ucy5jbG9zZSA9ICh0YXJnZXQgPSAkYWNjb3JkaW9uSXRlbSkgPT4ge1xuICAgICAgdGFyZ2V0LnNldEF0dHJpYnV0ZShcImFyaWEtZXhwYW5kZWRcIiwgZmFsc2UpO1xuICAgICAgaWYgKCFpc0N1c3RvbSkge1xuICAgICAgICB0YXJnZXQuY2xhc3NMaXN0LnJlbW92ZShcInNob3dcIik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBnc2FwLnRpbWVsaW5lKCkudG8odGFyZ2V0LCB7IGR1cmF0aW9uOiBkdXJhdGlvbiwgcGFkZGluZzogXCIwIDNyZW1cIiB9KTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgYWN0aW9ucy5hcnJvd1VwID0gKCkgPT4ge1xuICAgICAgY29uc29sZS5sb2coXCJrZXl1cCDsvZzrsLFcIik7XG4gICAgfTtcblxuICAgIGFjdGlvbnMuYXJyb3dEb3duID0gKCkgPT4ge1xuICAgICAgY29uc29sZS5sb2coXCJrZXl1cCDsvZzrsLFcIik7XG4gICAgfTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldEV2ZW50KCkge1xuICAgIGNvbnN0IHsgdHlwZSB9ID0gcHJvcHM7XG4gICAgaWYgKHR5cGUgPT09IFwic2luZ2xlXCIpIHtcbiAgICAgIGFkZEV2ZW50KFwiY2xpY2tcIiwgYWNjb3JkaW9uVG9nZ2xlQnRuLCAoeyB0YXJnZXQgfSkgPT4ge1xuICAgICAgICBjb25zdCB7IHBhcmVudEVsZW1lbnQgfSA9IHRhcmdldDtcbiAgICAgICAgc2luZ2xlVG9nZ2xlQWNjb3JkaW9uKHBhcmVudEVsZW1lbnQpO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFkZEV2ZW50KFwiY2xpY2tcIiwgYWNjb3JkaW9uVG9nZ2xlQnRuLCAoeyB0YXJnZXQgfSkgPT4ge1xuICAgICAgICB0b2dnbGVBY2NvcmRpb24odGFyZ2V0LnBhcmVudEVsZW1lbnQpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gdG9nZ2xlQWNjb3JkaW9uKGVsZSkge1xuICAgIGNvbnNvbGUubG9nKGVsZSk7XG4gICAgY29uc3QgaXNPcGVuID0gc3RhdGUuc3RhdGUgPT09IFwib3BlblwiO1xuICAgIGlmIChpc09wZW4pIHtcbiAgICAgIGFjdGlvbnMuY2xvc2UoZWxlKTtcbiAgICAgIGNsb3NlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFjdGlvbnMub3BlbihlbGUpO1xuICAgICAgb3BlbigpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHNpbmdsZVRvZ2dsZUFjY29yZGlvbih0YXJnZXQpIHtcbiAgICBjb25zdCAkY2xpY2tlZEl0ZW0gPSB0YXJnZXQucGFyZW50RWxlbWVudDtcbiAgICBjb25zdCAkYWxsVGl0bGVzID0gJGNsaWNrZWRJdGVtLnF1ZXJ5U2VsZWN0b3JBbGwoYWNjb3JkaW9uVG9nZ2xlQnRuKTtcbiAgICBjb25zdCAkYWxsSXRlbXMgPSBBcnJheS5mcm9tKCRhbGxUaXRsZXMpLm1hcCgodGl0bGUpID0+IHRpdGxlLnBhcmVudEVsZW1lbnQpO1xuXG4gICAgJGFsbEl0ZW1zLmZvckVhY2goKCRpdGVtKSA9PiB7XG4gICAgICBjb25zdCAkdGl0bGUgPSAkaXRlbS5xdWVyeVNlbGVjdG9yKGFjY29yZGlvblRvZ2dsZUJ0bik7XG4gICAgICBjb25zdCAkY29udGVudCA9ICR0aXRsZS5uZXh0RWxlbWVudFNpYmxpbmc7XG4gICAgICBpZiAoJGl0ZW0gPT09IHRhcmdldCkge1xuICAgICAgICBpZiAoJGNvbnRlbnQuZ2V0QXR0cmlidXRlKFwiYXJpYS1oaWRkZW5cIikgPT09IFwidHJ1ZVwiKSB7XG4gICAgICAgICAgJGNvbnRlbnQuc2V0QXR0cmlidXRlKFwiYXJpYS1oaWRkZW5cIiwgXCJmYWxzZVwiKTtcbiAgICAgICAgICAkdGl0bGUuc2V0QXR0cmlidXRlKFwiYXJpYS1leHBhbmRlZFwiLCBcInRydWVcIik7XG4gICAgICAgICAgJGl0ZW0uY2xhc3NMaXN0LmFkZChcInNob3dcIik7XG4gICAgICAgICAgb3BlbigpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICRjb250ZW50LnNldEF0dHJpYnV0ZShcImFyaWEtaGlkZGVuXCIsIFwidHJ1ZVwiKTtcbiAgICAgICAgICAkdGl0bGUuc2V0QXR0cmlidXRlKFwiYXJpYS1leHBhbmRlZFwiLCBcImZhbHNlXCIpO1xuICAgICAgICAgICRpdGVtLmNsYXNzTGlzdC5yZW1vdmUoXCJzaG93XCIpO1xuICAgICAgICAgIGNsb3NlKCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICRjb250ZW50LnNldEF0dHJpYnV0ZShcImFyaWEtaGlkZGVuXCIsIFwidHJ1ZVwiKTtcbiAgICAgICAgJHRpdGxlLnNldEF0dHJpYnV0ZShcImFyaWEtZXhwYW5kZWRcIiwgXCJmYWxzZVwiKTtcbiAgICAgICAgJGl0ZW0uY2xhc3NMaXN0LnJlbW92ZShcInNob3dcIik7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgY29uc3QgaXNTaG93ID0gc3RhdGUuc3RhdGUgPT09IFwib3BlblwiO1xuICAgIC8vIGV0VUkudXRpbHMuc2V0UHJvcGVydHkoJHRhcmdldCwgYWNjb3JkaW9uSXRlbSwgXCJhcmlhLWV4cGFuZGVkXCIsIGlzU2hvdyk7XG4gICAgaXNTaG93ID8gb3BlbigpIDogY2xvc2UoKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG9wZW4oKSB7XG4gICAgc2V0U3RhdGUoeyBzdGF0ZTogXCJvcGVuXCIgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBjbG9zZSgpIHtcbiAgICBzZXRTdGF0ZSh7IHN0YXRlOiBcImNsb3NlXCIgfSk7XG4gIH1cblxuICBjb21wb25lbnQgPSB7XG4gICAgY29yZToge1xuICAgICAgc3RhdGUsXG4gICAgICBwcm9wcyxcbiAgICAgIGluaXQsXG4gICAgICByZW1vdmVFdmVudCxcbiAgICAgIGRlc3Ryb3ksXG4gICAgfSxcblxuICAgIHVwZGF0ZSxcbiAgICBvcGVuLFxuICAgIGNsb3NlLFxuICB9O1xuXG4gIHJldHVybiBjb21wb25lbnQ7XG59XG4iLCIvKipcbiAqICBNb2RhbFxuICovXG5mdW5jdGlvbiBEaWFsb2coKSB7XG4gIGNvbnN0IHtcbiAgICBhY3Rpb25zLCBwcm9wcywgc3RhdGUsIHNldFByb3BzLCBzZXRTdGF0ZSwgc2V0VGFyZ2V0LCBhZGRFdmVudCwgcmVtb3ZlRXZlbnRcbiAgfSA9IGV0VUkuaG9va3MudXNlQ29yZSh7XG4gICAgICAvLyBwcm9wc1xuICAgICAgZGltbUNsaWNrOiB0cnVlLFxuICAgICAgZXNjOiB0cnVlLFxuICAgICAgdGl0bGU6IG51bGwsXG4gICAgICBtZXNzYWdlOiAnJyxcbiAgICAgIHR5cGU6ICdhbGVydCcsXG4gICAgICBwb3NpdGl2ZVRleHQ6ICftmZXsnbgnLFxuICAgICAgbmVnYXRpdmVUZXh0OiAn7Leo7IaMJyxcbiAgICB9LCB7XG4gICAgICBzdGF0ZTogJ2Nsb3NlJyxcbiAgICAgIHRyaWdnZXI6IG51bGxcbiAgICB9LCByZW5kZXIsIHtcbiAgICAgIGRhdGFzZXQ6IGZhbHNlLFxuICAgIH0sXG4gICk7XG5cbiAgLy8gY29uc3RhbnRcbiAgY29uc3QgRElNTV9PUEFDSVRZID0gMC42O1xuXG4gIC8vIHZhcmlhYmxlXG4gIGNvbnN0IG5hbWUgPSAnZGlhbG9nJztcbiAgbGV0IGNvbXBvbmVudCA9IHt9O1xuICBsZXQgbW9kYWxEaW1tU2VsZWN0b3IsXG4gICAgbW9kYWxDbG9zZUJ0blNlbGVjdG9yLFxuICAgIG1vZGFsQnRuUG9zaXRpdmUsXG4gICAgbW9kYWxCdG5OZWdhdGl2ZTtcbiAgbGV0ICR0YXJnZXQsXG4gICAgJG1vZGFsLFxuICAgICRtb2RhbFRpdGxlLCAkbW9kYWxDb250YWluZXIsICRtb2RhbERpbW0sXG4gICAgJG1vZGFsQnRuUG9zaXRpdmUsICRtb2RhbEJ0bk5lZ2F0aXZlLFxuICAgIGZvY3VzVHJhcEluc3RhbmNlLFxuICAgIGNhbGxiYWNrO1xuXG4gIHtcbiAgICAvKipcbiAgICAgKiBpbml0XG4gICAgICogQHBhcmFtIF8kdGFyZ2V0XG4gICAgICogQHBhcmFtIF9wcm9wc1xuICAgICAqL1xuICAgIGZ1bmN0aW9uIGluaXQoXyR0YXJnZXQsIF9wcm9wcykge1xuICAgICAgaWYgKHR5cGVvZiBfJHRhcmdldCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgJHRhcmdldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXyR0YXJnZXQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgJHRhcmdldCA9IF8kdGFyZ2V0O1xuICAgICAgfVxuXG4gICAgICBpZiAoISR0YXJnZXQpIHtcbiAgICAgICAgdGhyb3cgRXJyb3IoJ3RhcmdldOydtCDsobTsnqztlZjsp4Ag7JWK7Iq164uI64ukLicpO1xuICAgICAgfVxuXG4gICAgICBzZXRUYXJnZXQoJHRhcmdldCk7XG4gICAgICBzZXRQcm9wcyh7IC4uLnByb3BzLCAuLi5fcHJvcHMgfSk7XG5cbiAgICAgIGlmICgkdGFyZ2V0LnVpKSByZXR1cm47XG4gICAgICAkdGFyZ2V0LnVpID0gY29tcG9uZW50O1xuXG4gICAgICBzZXR1cCgpO1xuICAgICAgc2V0RXZlbnQoKTtcblxuICAgICAgLy8gJHRhcmdldC5zZXRBdHRyaWJ1dGUoJ2RhdGEtaW5pdCcsICd0cnVlJyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2V0dXAoKSB7XG4gICAgICBzZXR1cFRlbXBsYXRlKCk7XG4gICAgICBzZXR1cFNlbGVjdG9yKCk7XG4gICAgICBzZXR1cEVsZW1lbnQoKTtcbiAgICAgIHNldHVwQWN0aW9ucygpO1xuXG4gICAgICAvLyBmb2N1cyB0cmFwXG4gICAgICBmb2N1c1RyYXBJbnN0YW5jZSA9IGZvY3VzVHJhcC5jcmVhdGVGb2N1c1RyYXAoJHRhcmdldCwge1xuICAgICAgICBlc2NhcGVEZWFjdGl2YXRlczogcHJvcHMuZXNjLFxuICAgICAgICBvbkFjdGl2YXRlOiBhY3Rpb25zLmZvY3VzQWN0aXZhdGUsXG4gICAgICAgIG9uRGVhY3RpdmF0ZTogYWN0aW9ucy5mb2N1c0RlYWN0aXZhdGVcbiAgICAgIH0pO1xuXG4gICAgICAvLyBzdGF0ZVxuICAgICAgLy8gc2V0U3RhdGUoeyBzdGF0ZTogcHJvcHMuc3RhdGUgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogdXBkYXRlXG4gICAgICogQHBhcmFtIF9wcm9wc1xuICAgICAqL1xuICAgIGZ1bmN0aW9uIHVwZGF0ZShfcHJvcHMpIHtcbiAgICAgIGlmIChfcHJvcHMgJiYgZXRVSS51dGlscy5zaGFsbG93Q29tcGFyZShwcm9wcywgX3Byb3BzKSAmJiAhJHRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtaW5pdCcpKSByZXR1cm47XG4gICAgICBkZXN0cm95KCk7XG5cbiAgICAgIHNldFByb3BzKHsgLi4ucHJvcHMsIC4uLl9wcm9wcyB9KTtcbiAgICAgIHNldHVwKCk7XG4gICAgICBzZXRFdmVudCgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGRlc3Ryb3koKSB7XG4gICAgICByZW1vdmVFdmVudCgpO1xuICAgICAgJHRhcmdldC51aSA9IG51bGw7XG4gICAgfVxuICB9XG5cbiAgLy8gZnJlcXVlbmN5XG4gIGZ1bmN0aW9uIHNldHVwVGVtcGxhdGUoKSB7XG4gICAgY29uc3QgeyAkdGVtcGxhdGVIVE1MLCAkdGVtcGxhdGVQcmV2aWV3SW1hZ2VIVE1MIH0gPSBldFVJLmhvb2tzLnVzZURpYWxvZ1RtcGwoKVxuICAgIGNvbnN0IHRlbXBsYXRlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cblxuICAgIGlmKHByb3BzLmRpYWxvZ1R5cGUgPT09ICdhbGVydCcgfHwgcHJvcHMuZGlhbG9nVHlwZSA9PT0gJ2NvbmZpcm0nKXtcbiAgICAgIHRlbXBsYXRlLmNsYXNzTGlzdC5hZGQoJ2NvbXBvbmVudC1kaWFsb2cnKTtcbiAgICAgIHRlbXBsYXRlLmlubmVySFRNTCA9ICR0ZW1wbGF0ZUhUTUwocHJvcHMpO1xuICAgIH1lbHNlIGlmKHByb3BzLmRpYWxvZ1R5cGUgPT09ICdwcmV2aWV3SW1hZ2UnKXtcbiAgICAgIHRlbXBsYXRlLmNsYXNzTGlzdC5hZGQoJ2NvbXBvbmVudC1kaWFsb2cnKTtcbiAgICAgIHRlbXBsYXRlLmNsYXNzTGlzdC5hZGQoJ2RpYWxvZy1wcmV2aWV3LWltYWdlJyk7XG4gICAgICB0ZW1wbGF0ZS5pbm5lckhUTUwgPSAkdGVtcGxhdGVQcmV2aWV3SW1hZ2VIVE1MKHByb3BzKTtcbiAgICB9XG5cbiAgICAkbW9kYWwgPSB0ZW1wbGF0ZTtcbiAgICAkdGFyZ2V0LmFwcGVuZENoaWxkKHRlbXBsYXRlKTtcbiAgICAvLyAkdGFyZ2V0LmlubmVySFRNTCA9IGBgO1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0dXBTZWxlY3RvcigpIHtcbiAgICAvLyBzZWxlY3RvclxuICAgIG1vZGFsQ2xvc2VCdG5TZWxlY3RvciA9ICcuZGlhbG9nLWNsb3NlJztcbiAgICBtb2RhbERpbW1TZWxlY3RvciA9ICcuZGlhbG9nLWRpbW0nO1xuXG4gICAgLy8gZWxlbWVudFxuICAgICRtb2RhbFRpdGxlID0gJG1vZGFsLnF1ZXJ5U2VsZWN0b3IoJy5kaWFsb2ctdGl0Jyk7XG4gICAgJG1vZGFsRGltbSA9ICRtb2RhbC5xdWVyeVNlbGVjdG9yKG1vZGFsRGltbVNlbGVjdG9yKTtcbiAgICAkbW9kYWxDb250YWluZXIgPSAkbW9kYWwucXVlcnlTZWxlY3RvcignLmRpYWxvZy1jb250YWluZXInKTtcblxuICAgIG1vZGFsQnRuUG9zaXRpdmUgPSAnLmRpYWxvZy1wb3NpdGl2ZSc7XG4gICAgbW9kYWxCdG5OZWdhdGl2ZSA9ICcuZGlhbG9nLW5lZ2F0aXZlJztcbiAgICAkbW9kYWxCdG5Qb3NpdGl2ZSA9ICRtb2RhbC5xdWVyeVNlbGVjdG9yKCcuZGlhbG9nLXBvc2l0aXZlJyk7XG4gICAgJG1vZGFsQnRuTmVnYXRpdmUgPSAkbW9kYWwucXVlcnlTZWxlY3RvcignLmRpYWxvZy1uZWdhdGl2ZScpO1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0dXBFbGVtZW50KCkge1xuICAgIC8vIHNldCBpZFxuICAgIGNvbnN0IGlkID0gZXRVSS51dGlscy5nZXRSYW5kb21VSUlEKG5hbWUpO1xuICAgIGNvbnN0IHRpdGxlSWQgPSBldFVJLnV0aWxzLmdldFJhbmRvbVVJSUQobmFtZSArICctdGl0Jyk7XG4gICAgLy8gLy8gYTExeVxuXG4gICAgaWYocHJvcHMuZGlhbG9nVHlwZSA9PT0gJ2FsZXJ0JyB8fCBwcm9wcy5kaWFsb2dUeXBlID09PSAnY29uZmlybScpe1xuICAgICAgZXRVSS51dGlscy5zZXRQcm9wZXJ0eSgkbW9kYWwsICdyb2xlJywgJ2FsZXJ0ZGlhbG9nJyk7XG4gICAgfWVsc2UgaWYocHJvcHMuZGlhbG9nVHlwZSA9PT0gJ3ByZXZpZXdJbWFnZScpe1xuICAgICAgZXRVSS51dGlscy5zZXRQcm9wZXJ0eSgkbW9kYWwsICdyb2xlJywgJ2RpYWxvZycpO1xuXG4gICAgICBjb25zdCAkc3dpcGVyID0gJG1vZGFsLnF1ZXJ5U2VsZWN0b3IoJy5jb21wb25lbnQtc3dpcGVyJylcbiAgICAgIGNvbnN0IHN3aXBlciA9IG5ldyBldFVJLmNvbXBvbmVudHMuU3dpcGVyQ29tcCgpO1xuICAgICAgc3dpcGVyLmNvcmUuaW5pdCgkc3dpcGVyLCB7XG4gICAgICAgIG5hdmlnYXRpb246IHRydWUsXG4gICAgICAgIHBhZ2luYXRpb246IHRydWVcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgZXRVSS51dGlscy5zZXRQcm9wZXJ0eSgkbW9kYWwsICdhcmlhLW1vZGFsJywgJ3RydWUnKTtcbiAgICBldFVJLnV0aWxzLnNldFByb3BlcnR5KCRtb2RhbCwgJ2lkJywgaWQpO1xuICAgIGlmICgkbW9kYWxUaXRsZSkgZXRVSS51dGlscy5zZXRQcm9wZXJ0eSgkbW9kYWxUaXRsZSwgJ2lkJywgdGl0bGVJZCk7XG4gICAgZXRVSS51dGlscy5zZXRQcm9wZXJ0eSgkbW9kYWwsICdhcmlhLWxhYmVsbGVkYnknLCB0aXRsZUlkKTtcbiAgICBldFVJLnV0aWxzLnNldFByb3BlcnR5KCRtb2RhbCwgJ3RhYmluZGV4JywgJy0xJyk7XG4gIH1cblxuICBmdW5jdGlvbiBzZXR1cEFjdGlvbnMoKSB7XG4gICAgY29uc3QgeyBnZXRUb3BEZXB0aCwgc2V0TGF5ZXJPcGFjaXR5IH0gPSBldFVJLmhvb2tzLnVzZUxheWVyKCdkaWFsb2cnKTtcblxuICAgIGFjdGlvbnMuZm9jdXNBY3RpdmF0ZSA9ICgpID0+IHtcbiAgICB9XG5cbiAgICBhY3Rpb25zLmZvY3VzRGVhY3RpdmF0ZSA9ICgpID0+IHtcbiAgICAgIGlmKCFzdGF0ZS50cmlnZ2VyKXtcbiAgICAgICAgY2FsbGJhY2sgPSBwcm9wcy5uZWdhdGl2ZUNhbGxiYWNrXG4gICAgICB9XG4gICAgICBhY3Rpb25zLmNsb3NlKCk7XG4gICAgfVxuXG4gICAgYWN0aW9ucy5vcGVuID0gKCkgPT4ge1xuICAgICAgY29uc3QgekluZGV4ID0gZ2V0VG9wRGVwdGgoKTtcblxuICAgICAgJG1vZGFsLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgJG1vZGFsLnN0eWxlLnpJbmRleCA9IHpJbmRleFxuXG4gICAgICBzZXRMYXllck9wYWNpdHkoRElNTV9PUEFDSVRZKTtcblxuICAgICAgZ3NhcC50aW1lbGluZSgpLnRvKCRtb2RhbERpbW0sIHsgZHVyYXRpb246IDAsIGRpc3BsYXk6ICdibG9jaycsIG9wYWNpdHk6IDAgfSkudG8oJG1vZGFsRGltbSwge1xuICAgICAgICBkdXJhdGlvbjogMC4xNSxcbiAgICAgICAgb3BhY2l0eTogMSxcbiAgICAgIH0pO1xuXG4gICAgICBnc2FwXG4gICAgICAgIC50aW1lbGluZSgpXG4gICAgICAgIC50bygkbW9kYWxDb250YWluZXIsIHtcbiAgICAgICAgICBkdXJhdGlvbjogMCxcbiAgICAgICAgICBkaXNwbGF5OiAnYmxvY2snLFxuICAgICAgICAgIG9wYWNpdHk6IDAsXG4gICAgICAgICAgc2NhbGU6IDAuOTUsXG4gICAgICAgICAgeVBlcmNlbnQ6IDIsXG4gICAgICAgIH0pXG4gICAgICAgIC50bygkbW9kYWxDb250YWluZXIsIHsgZHVyYXRpb246IDAuMTUsIG9wYWNpdHk6IDEsIHNjYWxlOiAxLCB5UGVyY2VudDogMCwgZWFzZTogJ1Bvd2VyMi5lYXNlT3V0JyB9KTtcbiAgICB9O1xuXG4gICAgYWN0aW9ucy5jbG9zZSA9ICgpID0+IHtcbiAgICAgIGdzYXAudGltZWxpbmUoKS50bygkbW9kYWxEaW1tLCB7XG4gICAgICAgIGR1cmF0aW9uOiAwLjE1LFxuICAgICAgICBvcGFjaXR5OiAwLFxuICAgICAgICBvbkNvbXBsZXRlKCkge1xuICAgICAgICAgICRtb2RhbERpbW0uc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICBnc2FwLnRpbWVsaW5lKCkudG8oJG1vZGFsQ29udGFpbmVyLCB7XG4gICAgICAgIGR1cmF0aW9uOiAwLjE1LFxuICAgICAgICBvcGFjaXR5OiAwLFxuICAgICAgICBzY2FsZTogMC45NSxcbiAgICAgICAgeVBlcmNlbnQ6IDIsXG4gICAgICAgIGVhc2U6ICdQb3dlcjIuZWFzZU91dCcsXG4gICAgICAgIG9uQ29tcGxldGUoKSB7XG4gICAgICAgICAgJG1vZGFsQ29udGFpbmVyLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgICAgJG1vZGFsLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgICAgJG1vZGFsLnN0eWxlLnpJbmRleCA9IG51bGxcblxuICAgICAgICAgIHNldExheWVyT3BhY2l0eShESU1NX09QQUNJVFkpO1xuXG4gICAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBkZXN0cm95KCk7XG5cbiAgICAgICAgICAkdGFyZ2V0LnJlbW92ZUNoaWxkKCRtb2RhbCk7XG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9O1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0RXZlbnQoKSB7XG4gICAgYWRkRXZlbnQoJ2NsaWNrJywgbW9kYWxDbG9zZUJ0blNlbGVjdG9yLCBjbG9zZSk7XG5cbiAgICBpZiAocHJvcHMuZGltbUNsaWNrKSB7XG4gICAgICBhZGRFdmVudCgnY2xpY2snLCBtb2RhbERpbW1TZWxlY3RvciwgY2xvc2UpO1xuICAgIH1cblxuICAgIGFkZEV2ZW50KCdjbGljaycsIG1vZGFsQnRuUG9zaXRpdmUsICgpID0+IHtcbiAgICAgIGlmIChwcm9wcy5jYWxsYmFjaykge1xuICAgICAgICBjYWxsYmFjayA9IHByb3BzLmNhbGxiYWNrO1xuICAgICAgfSBlbHNlIGlmIChwcm9wcy5wb3NpdGl2ZUNhbGxiYWNrKSB7XG4gICAgICAgIGNhbGxiYWNrID0gcHJvcHMucG9zaXRpdmVDYWxsYmFjaztcbiAgICAgIH1cblxuICAgICAgY2xvc2UoJ2J0blBvc2l0aXZlJyk7XG4gICAgfSk7XG4gICAgYWRkRXZlbnQoJ2NsaWNrJywgbW9kYWxCdG5OZWdhdGl2ZSwgKCkgPT4ge1xuICAgICAgY2FsbGJhY2sgPSBwcm9wcy5uZWdhdGl2ZUNhbGxiYWNrO1xuXG4gICAgICBjbG9zZSgnYnRuTmVnYXRpdmUnKTtcbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICBjb25zdCBpc09wZW5lZCA9IHN0YXRlLnN0YXRlID09PSAnb3Blbic7XG5cbiAgICBpZiAoaXNPcGVuZWQpIHtcbiAgICAgIGFjdGlvbnMub3BlbigpO1xuXG4gICAgICBmb2N1c1RyYXBJbnN0YW5jZS5hY3RpdmF0ZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBmb2N1c1RyYXBJbnN0YW5jZS5kZWFjdGl2YXRlKCk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gb3BlbigpIHtcbiAgICBzZXRTdGF0ZSh7IHN0YXRlOiAnb3BlbicgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBjbG9zZSh0cmlnZ2VyKSB7XG4gICAgc2V0U3RhdGUoeyBzdGF0ZTogJ2Nsb3NlJywgdHJpZ2dlciB9KTtcbiAgfVxuXG4gIGNvbXBvbmVudCA9IHtcbiAgICBjb3JlOiB7XG4gICAgICBzdGF0ZSxcbiAgICAgIHByb3BzLFxuXG4gICAgICBpbml0LFxuICAgICAgcmVtb3ZlRXZlbnQsXG4gICAgICBkZXN0cm95LFxuICAgIH0sXG4gICAgdXBkYXRlLFxuICAgIG9wZW4sXG4gICAgY2xvc2UsXG4gIH07XG5cbiAgcmV0dXJuIGNvbXBvbmVudDtcbn1cbiIsIi8qKlxuICogIE1vZGFsXG4gKi9cbmZ1bmN0aW9uIE1vZGFsKCkge1xuICBjb25zdCB7XG4gICAgYWN0aW9ucywgcHJvcHMsIHN0YXRlLCBzZXRQcm9wcywgc2V0U3RhdGUsIHNldFRhcmdldCwgYWRkRXZlbnQsIHJlbW92ZUV2ZW50XG4gIH0gPSBldFVJLmhvb2tzLnVzZUNvcmUoe1xuICAgIC8vIHByb3BzXG4gICAgZGltbUNsaWNrOiB0cnVlLFxuICAgIGVzYzogdHJ1ZSxcbiAgfSwge1xuICAgIC8vIHN0YXRlXG5cbiAgfSwgcmVuZGVyKTtcblxuICAvLyBjb25zdGFudFxuICBjb25zdCBESU1NX09QQUNJVFkgPSAwLjY7XG5cbiAgLy8gdmFyaWFibGVcbiAgY29uc3QgbmFtZSA9ICdtb2RhbCc7XG4gIGxldCBjb21wb25lbnQgPSB7fTtcblxuICBsZXQgZm9jdXNUcmFwSW5zdGFuY2UsXG4gICAgbW9kYWxEaW1tU2VsZWN0b3IsIG1vZGFsQ2xvc2VCdG5TZWxlY3RvcjtcbiAgbGV0ICR0YXJnZXQsICRodG1sLFxuICAgICRtb2RhbFRpdGxlLCAkbW9kYWxDb250YWluZXIsICRtb2RhbERpbW07XG5cbiAge1xuICAgIC8qKlxuICAgICAqIGluaXRcbiAgICAgKiBAcGFyYW0gXyR0YXJnZXRcbiAgICAgKiBAcGFyYW0gX3Byb3BzXG4gICAgICovXG4gICAgZnVuY3Rpb24gaW5pdChfJHRhcmdldCwgX3Byb3BzKSB7XG4gICAgICBpZih0eXBlb2YgXyR0YXJnZXQgPT09ICdzdHJpbmcnKXtcbiAgICAgICAgJHRhcmdldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXyR0YXJnZXQpXG4gICAgICB9ZWxzZXtcbiAgICAgICAgJHRhcmdldCA9IF8kdGFyZ2V0O1xuICAgICAgfVxuXG4gICAgICBpZighJHRhcmdldCl7XG4gICAgICAgIHRocm93IEVycm9yKCd0YXJnZXTsnbQg7KG07J6s7ZWY7KeAIOyViuyKteuLiOuLpC4nKTtcbiAgICAgIH1cblxuICAgICAgc2V0VGFyZ2V0KCR0YXJnZXQpXG4gICAgICBzZXRQcm9wcyh7Li4ucHJvcHMsIC4uLl9wcm9wc30pO1xuXG4gICAgICBpZiAoJHRhcmdldC51aSkgcmV0dXJuO1xuICAgICAgJHRhcmdldC51aSA9IGNvbXBvbmVudDtcblxuICAgICAgc2V0dXAoKTtcbiAgICAgIHNldEV2ZW50KCk7XG5cbiAgICAgICR0YXJnZXQuc2V0QXR0cmlidXRlKCdkYXRhLWluaXQnLCAndHJ1ZScpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNldHVwKCkge1xuICAgICAgc2V0dXBUZW1wbGF0ZSgpO1xuICAgICAgc2V0dXBTZWxlY3RvcigpO1xuICAgICAgc2V0dXBFbGVtZW50KCk7XG4gICAgICBzZXR1cEFjdGlvbnMoKTtcblxuICAgICAgLy8gZm9jdXMgdHJhcFxuICAgICAgZm9jdXNUcmFwSW5zdGFuY2UgPSBmb2N1c1RyYXAuY3JlYXRlRm9jdXNUcmFwKCR0YXJnZXQsIHtcbiAgICAgICAgZXNjYXBlRGVhY3RpdmF0ZXM6IHByb3BzLmVzYyxcbiAgICAgICAgb25BY3RpdmF0ZTogYWN0aW9ucy5mb2N1c0FjdGl2YXRlLFxuICAgICAgICBvbkRlYWN0aXZhdGU6IGFjdGlvbnMuZm9jdXNEZWFjdGl2YXRlXG4gICAgICB9KTtcblxuICAgICAgLy8gc3RhdGVcbiAgICAgIC8vIHNldFN0YXRlKHsgc3RhdGU6IHByb3BzLnN0YXRlIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHVwZGF0ZVxuICAgICAqIEBwYXJhbSBfcHJvcHNcbiAgICAgKi9cbiAgICBmdW5jdGlvbiB1cGRhdGUoX3Byb3BzKSB7XG4gICAgICBpZiAoX3Byb3BzICYmIGV0VUkudXRpbHMuc2hhbGxvd0NvbXBhcmUocHJvcHMsIF9wcm9wcykgJiYgISR0YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLWluaXQnKSkgcmV0dXJuO1xuICAgICAgZGVzdHJveSgpO1xuXG4gICAgICBzZXRQcm9wcyh7IC4uLnByb3BzLCAuLi5fcHJvcHMgfSk7XG4gICAgICBzZXR1cCgpO1xuICAgICAgc2V0RXZlbnQoKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBkZXN0cm95KCkge1xuICAgICAgcmVtb3ZlRXZlbnQoKTtcbiAgICAgICR0YXJnZXQudWkgPSBudWxsO1xuICAgICAgJHRhcmdldC5yZW1vdmVBdHRyaWJ1dGUoJ2RhdGEtaW5pdCcpO1xuICAgIH1cbiAgfVxuXG4gIC8vIGZyZXF1ZW5jeVxuICBmdW5jdGlvbiBzZXR1cFRlbXBsYXRlKCkge1xuICAgIC8vICR0YXJnZXQuaW5uZXJIVE1MID0gYGA7XG4gIH1cblxuICBmdW5jdGlvbiBzZXR1cFNlbGVjdG9yKCl7XG4gICAgLy8gc2VsZWN0b3JcbiAgICBtb2RhbENsb3NlQnRuU2VsZWN0b3IgPSAnLm1vZGFsLWNsb3NlJ1xuICAgIG1vZGFsRGltbVNlbGVjdG9yID0gJy5tb2RhbC1kaW1tJ1xuXG4gICAgLy8gZWxlbWVudFxuICAgICRtb2RhbFRpdGxlID0gJHRhcmdldC5xdWVyeVNlbGVjdG9yKCcubW9kYWwtdGl0JylcbiAgICAkbW9kYWxEaW1tID0gJHRhcmdldC5xdWVyeVNlbGVjdG9yKG1vZGFsRGltbVNlbGVjdG9yKVxuICAgICRtb2RhbENvbnRhaW5lciA9ICR0YXJnZXQucXVlcnlTZWxlY3RvcignLm1vZGFsLWNvbnRhaW5lcicpXG4gICAgJGh0bWwgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XG4gIH1cblxuICBmdW5jdGlvbiBzZXR1cEVsZW1lbnQoKSB7XG4gICAgLy8gc2V0IGlkXG4gICAgY29uc3QgaWQgPSBldFVJLnV0aWxzLmdldFJhbmRvbVVJSUQobmFtZSk7XG4gICAgY29uc3QgdGl0bGVJZCA9IGV0VUkudXRpbHMuZ2V0UmFuZG9tVUlJRChuYW1lICsgJy10aXQnKVxuXG4gICAgLy8gYTExeVxuICAgIGV0VUkudXRpbHMuc2V0UHJvcGVydHkoJHRhcmdldCwgJ3JvbGUnLCAnZGlhbG9nJyk7XG4gICAgZXRVSS51dGlscy5zZXRQcm9wZXJ0eSgkdGFyZ2V0LCAnYXJpYS1tb2RhbCcsICd0cnVlJyk7XG4gICAgZXRVSS51dGlscy5zZXRQcm9wZXJ0eSgkdGFyZ2V0LCAnaWQnLCBpZCk7XG4gICAgaWYoJG1vZGFsVGl0bGUpIGV0VUkudXRpbHMuc2V0UHJvcGVydHkoJG1vZGFsVGl0bGUsICdpZCcsIHRpdGxlSWQpO1xuICAgIGV0VUkudXRpbHMuc2V0UHJvcGVydHkoJHRhcmdldCwgJ2FyaWEtbGFiZWxsZWRieScsIHRpdGxlSWQpO1xuICAgIGV0VUkudXRpbHMuc2V0UHJvcGVydHkoJHRhcmdldCwgJ3RhYmluZGV4JywgJy0xJyk7XG4gIH1cblxuICBmdW5jdGlvbiBzZXR1cEFjdGlvbnMoKXtcbiAgICBjb25zdCB7IGdldFRvcERlcHRoLCBzZXRMYXllck9wYWNpdHkgfSA9IGV0VUkuaG9va3MudXNlTGF5ZXIoJ21vZGFsJyk7XG5cbiAgICBhY3Rpb25zLmZvY3VzQWN0aXZhdGUgPSAoKSA9PiB7XG4gICAgfVxuXG4gICAgYWN0aW9ucy5mb2N1c0RlYWN0aXZhdGUgPSAoKSA9PiB7XG4gICAgICBjbG9zZSgpO1xuICAgICAgLy8gYWN0aW9ucy5jbG9zZSgpO1xuICAgIH1cblxuICAgIGFjdGlvbnMub3BlbiA9ICgpID0+IHtcbiAgICAgIGNvbnN0IHpJbmRleCA9IGdldFRvcERlcHRoKCk7XG5cbiAgICAgICR0YXJnZXQuc3R5bGUuZGlzcGxheSA9ICdibG9jaydcbiAgICAgICR0YXJnZXQuc3R5bGUuekluZGV4ID0gekluZGV4XG5cbiAgICAgIHNldExheWVyT3BhY2l0eShESU1NX09QQUNJVFkpO1xuXG4gICAgICBnc2FwLnRpbWVsaW5lKClcbiAgICAgICAgLnRvKCRtb2RhbERpbW0sIHtkdXJhdGlvbjogMCwgZGlzcGxheTogJ2Jsb2NrJywgb3BhY2l0eTogMH0pXG4gICAgICAgIC50bygkbW9kYWxEaW1tLCB7ZHVyYXRpb246IDAuMTUsIG9wYWNpdHk6IDF9KVxuXG4gICAgICBnc2FwLnRpbWVsaW5lKClcbiAgICAgICAgLnRvKCRtb2RhbENvbnRhaW5lciwge2R1cmF0aW9uOiAwLCBkaXNwbGF5OiAnYmxvY2snLCBvcGFjaXR5OiAwLCBzY2FsZTogMC45NSwgeVBlcmNlbnQ6IDJ9KVxuICAgICAgICAudG8oJG1vZGFsQ29udGFpbmVyLCB7ZHVyYXRpb246IDAuMTUsIG9wYWNpdHk6IDEsIHNjYWxlOiAxLCB5UGVyY2VudDogMCwgZWFzZTogJ1Bvd2VyMi5lYXNlT3V0J30pXG4gICAgfVxuXG4gICAgYWN0aW9ucy5jbG9zZSA9ICgpID0+IHtcbiAgICAgIGdzYXAudGltZWxpbmUoKVxuICAgICAgICAudG8oJG1vZGFsRGltbSwge2R1cmF0aW9uOiAwLjE1LCBvcGFjaXR5OiAwLCBvbkNvbXBsZXRlKCl7XG4gICAgICAgICAgICAkbW9kYWxEaW1tLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgICAgfX0pXG5cbiAgICAgIGdzYXAudGltZWxpbmUoKVxuICAgICAgICAudG8oJG1vZGFsQ29udGFpbmVyLCB7ZHVyYXRpb246IDAuMTUsIG9wYWNpdHk6IDAsIHNjYWxlOiAwLjk1LCB5UGVyY2VudDogMiwgZWFzZTogJ1Bvd2VyMi5lYXNlT3V0Jywgb25Db21wbGV0ZSgpe1xuICAgICAgICAgICAgJG1vZGFsQ29udGFpbmVyLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgICAgICAkdGFyZ2V0LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgICAgICAkdGFyZ2V0LnN0eWxlLnpJbmRleCA9IG51bGxcblxuICAgICAgICAgICAgc2V0TGF5ZXJPcGFjaXR5KERJTU1fT1BBQ0lUWSk7XG4gICAgICAgICAgfX0pXG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gc2V0RXZlbnQoKSB7XG4gICAgYWRkRXZlbnQoJ2NsaWNrJywgbW9kYWxDbG9zZUJ0blNlbGVjdG9yLCBjbG9zZSk7XG5cbiAgICBpZihwcm9wcy5kaW1tQ2xpY2spe1xuICAgICAgYWRkRXZlbnQoJ2NsaWNrJywgbW9kYWxEaW1tU2VsZWN0b3IsIGNsb3NlKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgY29uc3QgaXNPcGVuZWQgPSBzdGF0ZS5zdGF0ZSA9PT0gJ29wZW4nO1xuXG4gICAgaWYoaXNPcGVuZWQpe1xuICAgICAgYWN0aW9ucy5vcGVuKClcblxuICAgICAgZm9jdXNUcmFwSW5zdGFuY2UuYWN0aXZhdGUoKTtcbiAgICB9ZWxzZXtcbiAgICAgIGFjdGlvbnMuY2xvc2UoKVxuXG4gICAgICBmb2N1c1RyYXBJbnN0YW5jZS5kZWFjdGl2YXRlKCk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gb3Blbigpe1xuICAgIHNldFN0YXRlKHtzdGF0ZTogJ29wZW4nfSk7XG4gIH1cblxuICBmdW5jdGlvbiBjbG9zZSgpe1xuICAgIHNldFN0YXRlKHtzdGF0ZTogJ2Nsb3NlJ30pO1xuICB9XG5cbiAgY29tcG9uZW50ID0ge1xuICAgIGNvcmU6IHtcbiAgICAgIHN0YXRlLFxuICAgICAgcHJvcHMsXG5cbiAgICAgIGluaXQsXG4gICAgICByZW1vdmVFdmVudCxcbiAgICAgIGRlc3Ryb3ksXG4gICAgfSxcbiAgICB1cGRhdGUsXG4gICAgb3BlbixcbiAgICBjbG9zZSxcbiAgfTtcblxuICByZXR1cm4gY29tcG9uZW50O1xufVxuIiwiZnVuY3Rpb24gU2VsZWN0Qm94KCkge1xuICBjb25zdCB7IGFjdGlvbnMsIHByb3BzLCBzdGF0ZSwgc2V0UHJvcHMsIHNldFN0YXRlLCBzZXRUYXJnZXQsIGFkZEV2ZW50LCByZW1vdmVFdmVudCB9ID0gZXRVSS5ob29rcy51c2VDb3JlKFxuICAgIHtcbiAgICAgIHR5cGU6IFwiY3VzdG9tXCIsXG4gICAgICBsYWJlbDogXCJcIixcbiAgICAgIGRlZmF1bHQ6IFwiXCIsXG4gICAgICBpdGVtczogW10sXG4gICAgICBzZWxlY3RlZEluZGV4OiAwLFxuICAgICAgdHJhbnNpdGlvbjogXCJub3JtYWxcIixcbiAgICAgIHNjcm9sbFRvOiBmYWxzZSxcbiAgICAgIGdzYXBPcHRpb246IHt9LFxuICAgICAgc3RhdGU6IFwiY2xvc2VcIixcbiAgICB9LFxuICAgIHt9LFxuICAgIHJlbmRlcixcbiAgKTtcbiAgY29uc3QgeyAkdGVtcGxhdGVDdXN0b21IVE1MLCAkdGVtcGxhdGVCYXNpY0hUTUwgfSA9IHVzZVNlbGVjdEJveFRlbXAoKTtcbiAgY29uc3QgeyB1c2VTZWxlY3RTaG93IH0gPSB1c2VUcmFuc2l0aW9uKCk7XG5cbiAgLy8gY29uc3RhbnRcbiAgY29uc3QgTUFSR0lOID0gMjA7XG5cbiAgLy8gdmFyaWFibGVcbiAgY29uc3QgbmFtZSA9IFwic2VsZWN0XCI7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBwcmVmZXItY29uc3RcbiAgbGV0IGNvbXBvbmVudCA9IHt9O1xuICBsZXQgJHRhcmdldCxcbiAgICAvLyDsmpTshozqtIDroKgg67OA7IiY65OkXG4gICAgc2VsZWN0TGFiZWwsXG4gICAgc2VsZWN0Q29tYm9Cb3gsXG4gICAgc2VsZWN0TGlzdEJveCxcbiAgICBzZWxlY3RPcHRpb24sXG4gICAgdGltZWxpbmU7XG5cbiAge1xuICAgIGZ1bmN0aW9uIGluaXQoXyR0YXJnZXQsIF9wcm9wcykge1xuICAgICAgaWYgKHR5cGVvZiBfJHRhcmdldCA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICAkdGFyZ2V0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihfJHRhcmdldCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAkdGFyZ2V0ID0gXyR0YXJnZXQ7XG4gICAgICB9XG5cbiAgICAgIGlmICghJHRhcmdldCkge1xuICAgICAgICB0aHJvdyBFcnJvcihcInRhcmdldOydtCDsobTsnqztlZjsp4Ag7JWK7Iq164uI64ukLlwiKTtcbiAgICAgIH1cblxuICAgICAgc2V0VGFyZ2V0KCR0YXJnZXQpO1xuICAgICAgc2V0UHJvcHMoeyAuLi5wcm9wcywgLi4uX3Byb3BzIH0pO1xuXG4gICAgICBpZiAoJHRhcmdldC51aSkgcmV0dXJuO1xuICAgICAgJHRhcmdldC51aSA9IGNvbXBvbmVudDtcblxuICAgICAgc2V0dXAoKTtcbiAgICAgIHNldEV2ZW50KCk7XG5cbiAgICAgICR0YXJnZXQuc2V0QXR0cmlidXRlKFwiZGF0YS1pbml0XCIsIFwidHJ1ZVwiKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzZXR1cCgpIHtcbiAgICAgIHNldHVwVGVtcGxhdGUoKTtcblxuICAgICAgaWYgKHByb3BzLnR5cGUgPT09IFwiYmFzaWNcIikgcmV0dXJuO1xuXG4gICAgICBzZXR1cFNlbGVjdG9yKCk7XG4gICAgICBzZXR1cEVsZW1lbnQoKTtcbiAgICAgIHNldHVwQWN0aW9ucygpO1xuXG4gICAgICAvLyBlZmZlY3RcbiAgICAgIHRpbWVsaW5lID0gdXNlU2VsZWN0U2hvdygkdGFyZ2V0LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0TGlzdEJveCksIHByb3BzLnRyYW5zaXRpb24sIHByb3BzLmdzYXBPcHRpb24pLnRpbWVsaW5lO1xuXG4gICAgICAvLyBzdGF0ZVxuICAgICAgYWN0aW9uc1twcm9wcy5zdGF0ZSB8fCBzdGF0ZS5zdGF0ZV0/LigpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHVwZGF0ZShfcHJvcHMpIHtcbiAgICAgIGlmIChfcHJvcHMgJiYgZXRVSS51dGlscy5zaGFsbG93Q29tcGFyZShwcm9wcywgX3Byb3BzKSAmJiAhJHRhcmdldC5nZXRBdHRyaWJ1dGUoXCJkYXRhLWluaXRcIikpIHJldHVybjtcbiAgICAgIGRlc3Ryb3koKTtcbiAgICAgIHNldFByb3BzKHsgLi4ucHJvcHMsIC4uLl9wcm9wcyB9KTtcbiAgICAgIHNldHVwKCk7XG4gICAgICBzZXRFdmVudCgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGRlc3Ryb3koKSB7XG4gICAgICByZW1vdmVFdmVudCgpO1xuICAgICAgJHRhcmdldC51aSA9IG51bGw7XG4gICAgICAkdGFyZ2V0LnJlbW92ZUF0dHJpYnV0ZShcImRhdGEtaW5pdFwiKTtcbiAgICB9XG4gIH1cblxuICAvLyBmcmVxdWVuY3lcbiAgZnVuY3Rpb24gc2V0dXBUZW1wbGF0ZSgpIHtcbiAgICBpZiAocHJvcHMuaXRlbXMubGVuZ3RoIDwgMSkgcmV0dXJuO1xuICAgIGlmIChwcm9wcy50eXBlID09PSBcImN1c3RvbVwiKSB7XG4gICAgICBjb25zdCB7IHNlbGVjdGVkSW5kZXggfSA9IHByb3BzO1xuICAgICAgY29uc3QgaXRlbUxpc3RUZW1wID0gcHJvcHMuaXRlbXMubWFwKChpdGVtKSA9PiAkdGVtcGxhdGVDdXN0b21IVE1MLml0ZW1zKGl0ZW0pKS5qb2luKFwiXCIpO1xuXG4gICAgICAkdGFyZ2V0LmlubmVySFRNTCA9IGBcbiAgICAgICAgJHtwcm9wcy5sYWJlbCAmJiAkdGVtcGxhdGVDdXN0b21IVE1MLmxhYmVsKHByb3BzLmxhYmVsKX1cbiAgICAgICAgJHtwcm9wcy5kZWZhdWx0ID8gJHRlbXBsYXRlQ3VzdG9tSFRNTC5zZWxlY3RCdG4ocHJvcHMuZGVmYXVsdCkgOiAkdGVtcGxhdGVDdXN0b21IVE1MLnNlbGVjdEJ0bihwcm9wcy5pdGVtcy5maW5kKChpdGVtKSA9PiBpdGVtLnZhbHVlID09IHByb3BzLml0ZW1zW3NlbGVjdGVkSW5kZXhdLnZhbHVlKS50ZXh0KX1cbiAgICAgICAgJHtwcm9wcy5pdGVtcyAmJiAkdGVtcGxhdGVDdXN0b21IVE1MLml0ZW1zV3JhcChpdGVtTGlzdFRlbXApfVxuICAgICAgYDtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3Qgc2VsZWN0QnRuVGVtcCA9ICR0ZW1wbGF0ZUJhc2ljSFRNTC5zZWxlY3RCdG4ocHJvcHMuZGVmYXVsdCk7XG4gICAgICBjb25zdCBpdGVtTGlzdFRlbXAgPSBwcm9wcy5pdGVtcy5tYXAoKGl0ZW0pID0+ICR0ZW1wbGF0ZUJhc2ljSFRNTC5pdGVtcyhpdGVtKSkuam9pbihcIlwiKTtcblxuICAgICAgJHRhcmdldC5pbm5lckhUTUwgPSBgXG4gICAgICAgICR7cHJvcHMubGFiZWwgJiYgJHRlbXBsYXRlQmFzaWNIVE1MLmxhYmVsKHByb3BzLmxhYmVsKX1cbiAgICAgICAgJHtwcm9wcy5pdGVtcyAmJiAkdGVtcGxhdGVCYXNpY0hUTUwuaXRlbXNXcmFwKHNlbGVjdEJ0blRlbXAgKyBpdGVtTGlzdFRlbXApfVxuICAgICAgYDtcbiAgICB9XG4gIH1cbiAgZnVuY3Rpb24gc2V0dXBTZWxlY3RvcigpIHtcbiAgICBzZWxlY3RMYWJlbCA9IFwiLmNvbWJvLWxhYmVsXCI7XG4gICAgc2VsZWN0Q29tYm9Cb3ggPSBcIi5zZWxlY3QtYm94XCI7XG4gICAgc2VsZWN0TGlzdEJveCA9IFwiLnNlbGVjdC1vcHRpb25zXCI7XG4gICAgc2VsZWN0T3B0aW9uID0gXCIub3B0aW9uXCI7XG4gIH1cblxuICBmdW5jdGlvbiBzZXR1cEVsZW1lbnQoKSB7XG4gICAgLy8gaWRcbiAgICBjb25zdCBsYWJlbElkID0gZXRVSS51dGlscy5nZXRSYW5kb21VSUlEKG5hbWUpO1xuICAgIGNvbnN0IGNvbWJvQm94SWQgPSBldFVJLnV0aWxzLmdldFJhbmRvbVVJSUQoXCJjb21ib2JveFwiKTtcbiAgICBjb25zdCBsaXN0Qm94SWQgPSBldFVJLnV0aWxzLmdldFJhbmRvbVVJSUQoXCJsaXN0Ym94XCIpO1xuXG4gICAgLy8gYTExeVxuICAgIGV0VUkudXRpbHMuc2V0UHJvcGVydHkoJHRhcmdldCwgc2VsZWN0TGFiZWwsIFwiaWRcIiwgbGFiZWxJZCk7XG4gICAgZXRVSS51dGlscy5zZXRQcm9wZXJ0eSgkdGFyZ2V0LCBzZWxlY3RDb21ib0JveCwgXCJpZFwiLCBjb21ib0JveElkKTtcbiAgICBldFVJLnV0aWxzLnNldFByb3BlcnR5KCR0YXJnZXQsIHNlbGVjdENvbWJvQm94LCBcInJvbGVcIiwgXCJjb21ib2JveFwiKTtcbiAgICBldFVJLnV0aWxzLnNldFByb3BlcnR5KCR0YXJnZXQsIHNlbGVjdENvbWJvQm94LCBcImFyaWEtbGFiZWxsZWRieVwiLCBsYWJlbElkKTtcbiAgICBldFVJLnV0aWxzLnNldFByb3BlcnR5KCR0YXJnZXQsIHNlbGVjdENvbWJvQm94LCBcImFyaWEtY29udHJvbHNcIiwgbGlzdEJveElkKTtcbiAgICBldFVJLnV0aWxzLnNldFByb3BlcnR5KCR0YXJnZXQsIHNlbGVjdExpc3RCb3gsIFwiaWRcIiwgbGlzdEJveElkKTtcbiAgICBldFVJLnV0aWxzLnNldFByb3BlcnR5KCR0YXJnZXQsIHNlbGVjdExpc3RCb3gsIFwicm9sZVwiLCBcImxpc3Rib3hcIik7XG4gICAgZXRVSS51dGlscy5zZXRQcm9wZXJ0eSgkdGFyZ2V0LCBzZWxlY3RMaXN0Qm94LCBcImFyaWEtbGFiZWxsZWRieVwiLCBsYWJlbElkKTtcbiAgICBldFVJLnV0aWxzLnNldFByb3BlcnR5KCR0YXJnZXQsIHNlbGVjdExpc3RCb3gsIFwidGFiaW5kZXhcIiwgLTEpO1xuXG4gICAgLy8gc2VsZWN0IHByb3BlcnR5XG4gICAgY29uc3Qgb3B0aW9ucyA9ICR0YXJnZXQucXVlcnlTZWxlY3RvckFsbChzZWxlY3RPcHRpb24pO1xuICAgIG9wdGlvbnMuZm9yRWFjaCgoZWwsIGluZGV4KSA9PiB7XG4gICAgICBjb25zdCBvcHRpb25JZCA9IGV0VUkudXRpbHMuZ2V0UmFuZG9tVUlJRChcIm9wdGlvblwiKTtcblxuICAgICAgJHRhcmdldFtpbmRleF0gPSBlbDtcbiAgICAgIGVsW1wiaW5kZXhcIl0gPSBpbmRleDtcbiAgICAgIGVsLnNldEF0dHJpYnV0ZShcImlkXCIsIG9wdGlvbklkKTtcbiAgICAgIGVsLnNldEF0dHJpYnV0ZShcInJvbGVcIiwgXCJvcHRpb25cIik7XG4gICAgICBlbC5zZXRBdHRyaWJ1dGUoXCJhcmlhLXNlbGVjdGVkXCIsIGZhbHNlKTtcblxuICAgICAgcHJvcHMuaXRlbXNbaW5kZXhdPy5kaXNhYmxlZCAmJiBlbC5zZXRBdHRyaWJ1dGUoXCJkaXNhYmxlZFwiLCBcIlwiKTtcblxuICAgICAgaWYgKCEkdGFyZ2V0W1wib3B0aW9uc1wiXSkgJHRhcmdldFtcIm9wdGlvbnNcIl0gPSBbXTtcbiAgICAgICR0YXJnZXRbXCJvcHRpb25zXCJdW2luZGV4XSA9IGVsO1xuICAgIH0pO1xuXG4gICAgIXByb3BzLmRlZmF1bHQgJiYgc2VsZWN0SXRlbShvcHRpb25zW3Byb3BzLnNlbGVjdGVkSW5kZXhdKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldHVwQWN0aW9ucygpIHtcbiAgICBsZXQgc2VsZWN0SW5kZXggPSBpc05hTigkdGFyZ2V0LnNlbGVjdGVkSW5kZXgpID8gLTEgOiAkdGFyZ2V0LnNlbGVjdGVkSW5kZXg7XG5cbiAgICBmdW5jdGlvbiB1cGRhdGVJbmRleChzdGF0ZSkge1xuICAgICAgaWYgKCFzdGF0ZSkgcmV0dXJuO1xuICAgICAgc2VsZWN0SW5kZXggPSBpc05hTigkdGFyZ2V0LnNlbGVjdGVkSW5kZXgpID8gLTEgOiAkdGFyZ2V0LnNlbGVjdGVkSW5kZXg7XG4gICAgICB1cGRhdGVDdXJyZW50Q2xhc3MoJHRhcmdldFtzZWxlY3RJbmRleF0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGtleUV2ZW50Q2FsbGJhY2soKSB7XG4gICAgICB1cGRhdGVDdXJyZW50Q2xhc3MoJHRhcmdldFtzZWxlY3RJbmRleF0pO1xuICAgICAgZXRVSS51dGlscy5zZXRQcm9wZXJ0eSgkdGFyZ2V0LCBzZWxlY3RDb21ib0JveCwgXCJhcmlhLWFjdGl2ZWRlc2NlbmRhbnRcIiwgJHRhcmdldFtzZWxlY3RJbmRleF0uaWQpO1xuICAgICAgJHRhcmdldC5xdWVyeVNlbGVjdG9yKGAke3NlbGVjdENvbWJvQm94fSA6bGFzdC1jaGlsZGApLnRleHRDb250ZW50ID0gJHRhcmdldFtzZWxlY3RJbmRleF0udGV4dENvbnRlbnQ7XG4gICAgfVxuXG4gICAgYWN0aW9ucy5vcGVuID0gKCkgPT4ge1xuICAgICAgJHRhcmdldC5xdWVyeVNlbGVjdG9yKHNlbGVjdENvbWJvQm94KT8uZm9jdXMoKTtcbiAgICAgIG9wZW5TdGF0ZSgpO1xuICAgICAgdXBkYXRlSW5kZXgodHJ1ZSk7XG4gICAgfTtcbiAgICBhY3Rpb25zLmNsb3NlID0gKCkgPT4ge1xuICAgICAgJHRhcmdldC5xdWVyeVNlbGVjdG9yKGAke3NlbGVjdENvbWJvQm94fSA6bGFzdC1jaGlsZGApLnRleHRDb250ZW50ID0gJHRhcmdldFtcIm9wdGlvbnNcIl1bJHRhcmdldC5zZWxlY3RlZEluZGV4XT8udGV4dENvbnRlbnQgPz8gcHJvcHMuZGVmYXVsdDtcbiAgICAgIGNsb3NlU3RhdGUoKTtcbiAgICB9O1xuICAgIGFjdGlvbnMuc2VsZWN0ID0gKCkgPT4ge1xuICAgICAgY29uc3QgY3VycmVudEVsID0gJHRhcmdldC5xdWVyeVNlbGVjdG9yKFwiLmN1cnJlbnRcIik7XG4gICAgICBzZWxlY3RJdGVtKGN1cnJlbnRFbCk7XG4gICAgICBjbG9zZVN0YXRlKCk7XG4gICAgfTtcblxuICAgIGFjdGlvbnMuZmlyc3QgPSAoKSA9PiB7XG4gICAgICBzZWxlY3RJbmRleCA9IDA7XG4gICAgICBrZXlFdmVudENhbGxiYWNrKCk7XG4gICAgfTtcbiAgICBhY3Rpb25zLmxhc3QgPSAoKSA9PiB7XG4gICAgICBzZWxlY3RJbmRleCA9ICR0YXJnZXRbXCJvcHRpb25zXCJdLmxlbmd0aCAtIDE7XG4gICAgICBrZXlFdmVudENhbGxiYWNrKCk7XG4gICAgfTtcbiAgICBhY3Rpb25zLnVwID0gKCkgPT4ge1xuICAgICAgc2VsZWN0SW5kZXggPSBNYXRoLm1heCgtLXNlbGVjdEluZGV4LCAwKTtcbiAgICAgIGtleUV2ZW50Q2FsbGJhY2soKTtcbiAgICB9O1xuICAgIGFjdGlvbnMuZG93biA9ICgpID0+IHtcbiAgICAgIHNlbGVjdEluZGV4ID0gTWF0aC5taW4oKytzZWxlY3RJbmRleCwgJHRhcmdldFtcIm9wdGlvbnNcIl0ubGVuZ3RoIC0gMSk7XG4gICAgICBrZXlFdmVudENhbGxiYWNrKCk7XG4gICAgfTtcblxuICAgIGNvbXBvbmVudC5vcGVuID0gYWN0aW9ucy5vcGVuO1xuICAgIGNvbXBvbmVudC5jbG9zZSA9IGFjdGlvbnMuY2xvc2U7XG4gIH1cblxuICBmdW5jdGlvbiBzZXRFdmVudCgpIHtcbiAgICBpZiAocHJvcHMudHlwZSA9PT0gXCJiYXNpY1wiKSByZXR1cm47XG5cbiAgICAvLyBhMTF5XG4gICAgY29uc3QgYWN0aW9uTGlzdCA9IHtcbiAgICAgIHVwOiBbXCJBcnJvd1VwXCJdLFxuICAgICAgZG93bjogW1wiQXJyb3dEb3duXCJdLFxuICAgICAgZmlyc3Q6IFtcIkhvbWVcIiwgXCJQYWdlVXBcIl0sXG4gICAgICBsYXN0OiBbXCJFbmRcIiwgXCJQYWdlRG93blwiXSxcbiAgICAgIGNsb3NlOiBbXCJFc2NhcGVcIl0sXG4gICAgICBzZWxlY3Q6IFtcIkVudGVyXCIsIFwiIFwiXSxcbiAgICB9O1xuXG4gICAgYWRkRXZlbnQoXCJibHVyXCIsIHNlbGVjdENvbWJvQm94LCAoZSkgPT4ge1xuICAgICAgaWYgKGUucmVsYXRlZFRhcmdldD8ucm9sZSA9PT0gXCJsaXN0Ym94XCIpIHJldHVybjtcbiAgICAgIGFjdGlvbnMuY2xvc2UoKTtcbiAgICB9KTtcblxuICAgIGFkZEV2ZW50KFwiY2xpY2tcIiwgc2VsZWN0Q29tYm9Cb3gsICh7IHRhcmdldCB9KSA9PiB7XG4gICAgICBjb25zdCB0b2dnbGVTdGF0ZSA9IHN0YXRlLnN0YXRlID09PSBcIm9wZW5cIiA/IFwiY2xvc2VcIiA6IFwib3BlblwiO1xuICAgICAgYWN0aW9uc1t0b2dnbGVTdGF0ZV0/LigpO1xuICAgIH0pO1xuXG4gICAgLy8gYTExeVxuICAgIGFkZEV2ZW50KFwia2V5ZG93blwiLCBzZWxlY3RDb21ib0JveCwgKGUpID0+IHtcbiAgICAgIGlmIChzdGF0ZS5zdGF0ZSA9PT0gXCJjbG9zZVwiKSByZXR1cm47XG5cbiAgICAgIGNvbnN0IHsga2V5IH0gPSBlO1xuICAgICAgY29uc3QgYWN0aW9uID0gT2JqZWN0LmVudHJpZXMoYWN0aW9uTGlzdCkuZmluZCgoW18sIGtleXNdKSA9PiBrZXlzLmluY2x1ZGVzKGtleSkpO1xuXG4gICAgICBpZiAoYWN0aW9uKSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgY29uc3QgW2FjdGlvbk5hbWVdID0gYWN0aW9uO1xuICAgICAgICBhY3Rpb25zW2FjdGlvbk5hbWVdPy4oKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGFkZEV2ZW50KFwiY2xpY2tcIiwgc2VsZWN0TGlzdEJveCwgKHsgdGFyZ2V0IH0pID0+IHtcbiAgICAgIGlmICghdGFyZ2V0LnJvbGUgPT09IFwib3B0aW9uXCIpIHJldHVybjtcbiAgICAgIHVwZGF0ZUN1cnJlbnRDbGFzcyh0YXJnZXQpO1xuICAgICAgYWN0aW9ucy5zZWxlY3QoKTtcbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICBjb25zdCBpc09wZW5lZCA9IHN0YXRlLnN0YXRlID09PSBcIm9wZW5cIjtcblxuICAgIHByb3BzLnRyYW5zaXRpb24gJiYgdGltZWxpbmUoaXNPcGVuZWQpO1xuICAgIGNoZWNrT3BlbkRpcihpc09wZW5lZCk7XG5cbiAgICBldFVJLnV0aWxzLnNldFByb3BlcnR5KCR0YXJnZXQsIHNlbGVjdENvbWJvQm94LCBcImFyaWEtZXhwYW5kZWRcIiwgaXNPcGVuZWQpO1xuXG4gICAgY29uc3Qgc2VsZWN0ZWRFbCA9ICR0YXJnZXQucXVlcnlTZWxlY3RvcignW2FyaWEtc2VsZWN0ZWQ9XCJ0cnVlXCJdJyk7XG4gICAgaWYgKGlzT3BlbmVkKSBldFVJLnV0aWxzLnNldFByb3BlcnR5KCR0YXJnZXQsIHNlbGVjdENvbWJvQm94LCBcImFyaWEtYWN0aXZlZGVzY2VuZGFudFwiLCBzZWxlY3RlZEVsPy5pZCA/PyBcIlwiKTtcbiAgICBlbHNlIGV0VUkudXRpbHMuc2V0UHJvcGVydHkoJHRhcmdldCwgc2VsZWN0Q29tYm9Cb3gsIFwiYXJpYS1hY3RpdmVkZXNjZW5kYW50XCIsIFwiXCIpO1xuICB9XG5cbiAgLy8gY3VzdG9tXG4gIGZ1bmN0aW9uIGNoZWNrT3BlbkRpcihzdGF0ZSkge1xuICAgIGlmICghc3RhdGUgfHwgcHJvcHMuc2Nyb2xsVG8pIHJldHVybjsgLy8gZmFsc2XsnbTqsbDrgpggc2Nyb2xsVG8g6riw64qlIOyeiOydhCDrlYwgLSDslYTrnpjroZwg7Je066a8XG5cbiAgICBjb25zdCB7IGhlaWdodDogbGlzdEhlaWdodCB9ID0gZXRVSS5ob29rcy51c2VHZXRDbGllbnRSZWN0KCR0YXJnZXQsIHNlbGVjdExpc3RCb3gpO1xuICAgIGNvbnN0IHsgaGVpZ2h0OiBjb21ib0hlaWdodCwgYm90dG9tOiBjb21ib0JvdHRvbSB9ID0gZXRVSS5ob29rcy51c2VHZXRDbGllbnRSZWN0KCR0YXJnZXQsIHNlbGVjdENvbWJvQm94KTtcbiAgICBjb25zdCByb2xlID0gd2luZG93LmlubmVySGVpZ2h0IC0gTUFSR0lOIDwgY29tYm9Cb3R0b20gKyBsaXN0SGVpZ2h0O1xuXG4gICAgZXRVSS51dGlscy5zZXRTdHlsZSgkdGFyZ2V0LCBzZWxlY3RMaXN0Qm94LCBcImJvdHRvbVwiLCByb2xlID8gY29tYm9IZWlnaHQgKyBcInB4XCIgOiBcIlwiKTtcbiAgfVxuXG4gIC8vIHVwZGF0ZSAuY3VycmVudCBjbGFzc1xuICBmdW5jdGlvbiB1cGRhdGVDdXJyZW50Q2xhc3MoYWRkQ2xhc3NFbCkge1xuICAgICR0YXJnZXQucXVlcnlTZWxlY3RvcihcIi5jdXJyZW50XCIpPy5jbGFzc0xpc3QucmVtb3ZlKFwiY3VycmVudFwiKTtcbiAgICBhZGRDbGFzc0VsPy5jbGFzc0xpc3QuYWRkKFwiY3VycmVudFwiKTtcbiAgfVxuXG4gIC8vIHNlbGVjdCBpdGVtXG4gIGZ1bmN0aW9uIHNlbGVjdEl0ZW0odGFyZ2V0KSB7XG4gICAgY29uc3QgdGFyZ2V0T3B0aW9uID0gdGFyZ2V0Py5jbG9zZXN0KHNlbGVjdE9wdGlvbik7XG5cbiAgICBpZiAoIXRhcmdldE9wdGlvbikgcmV0dXJuO1xuXG4gICAgJHRhcmdldC5zZWxlY3RlZEluZGV4ID0gdGFyZ2V0T3B0aW9uW1wiaW5kZXhcIl07XG4gICAgJHRhcmdldC52YWx1ZSA9IHRhcmdldE9wdGlvbi5nZXRBdHRyaWJ1dGUoXCJkYXRhLXZhbHVlXCIpO1xuXG4gICAgZXRVSS51dGlscy5zZXRQcm9wZXJ0eSgkdGFyZ2V0LCAnW2FyaWEtc2VsZWN0ZWQ9XCJ0cnVlXCJdJywgXCJhcmlhLXNlbGVjdGVkXCIsIGZhbHNlKTtcbiAgICB0YXJnZXRPcHRpb24uc2V0QXR0cmlidXRlKFwiYXJpYS1zZWxlY3RlZFwiLCB0cnVlKTtcblxuICAgIHVwZGF0ZUN1cnJlbnRDbGFzcygkdGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoJ1thcmlhLXNlbGVjdGVkPVwidHJ1ZVwiXScpKTtcbiAgICAkdGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoYCR7c2VsZWN0Q29tYm9Cb3h9IDpsYXN0LWNoaWxkYCkudGV4dENvbnRlbnQgPSB0YXJnZXRPcHRpb24udGV4dENvbnRlbnQ7XG4gIH1cblxuICAvLyBzZWxlY3Qgc3RhdGVcbiAgZnVuY3Rpb24gb3BlblN0YXRlKCkge1xuICAgIHNldFN0YXRlKHsgc3RhdGU6IFwib3BlblwiIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gY2xvc2VTdGF0ZSgpIHtcbiAgICBzZXRTdGF0ZSh7IHN0YXRlOiBcImNsb3NlXCIgfSk7XG4gIH1cblxuICBjb21wb25lbnQgPSB7XG4gICAgY29yZToge1xuICAgICAgc3RhdGUsXG4gICAgICBwcm9wcyxcblxuICAgICAgaW5pdCxcbiAgICAgIHJlbW92ZUV2ZW50LFxuICAgICAgZGVzdHJveSxcbiAgICB9LFxuXG4gICAgdXBkYXRlLFxuICAgIG9wZW4sXG4gICAgY2xvc2UsXG4gIH07XG5cbiAgcmV0dXJuIGNvbXBvbmVudDtcbn1cbiIsIi8qKlxuICogU2tlbFxuICogLy8gaW5pdCwgc2V0dXAsIHVwZGF0ZSwgZGVzdHJveVxuICogLy8gc2V0dXBUZW1wbGF0ZSwgc2V0dXBTZWxlY3Rvciwgc2V0dXBFbGVtZW50LCBzZXR1cEFjdGlvbnMsXG4gKiAgICAgIHNldEV2ZW50LCByZW5kZXIsIGN1c3RvbUZuLCBjYWxsYWJsZVxuICpcbiAqICAgICAgZG9t66eMIOydtOyaqe2VtOyEnCB1aSDstIjquLDtmZRcbiAqICAgICAgICBkYXRhLXByb3BzLW9wdDEsIGRhdGEtcHJvcHMtb3B0MiwgZGF0YS1wcm9wcy1vcHQzXG4gKiAgICAgIOqzoOq4ieyYteyFmFxuICogICAgICAgIGRhdGEtaW5pdD1mYWxzZVxuICogICAgICAgIGNvbnN0IGluc3RhbmNlID0gbmV3IFNrZWwoKTtcbiAqICAgICAgICBpbnN0YW5jZS5jb3JlLmluaXQoJy5zZWxlY3RvcicsIHsgb3B0MTogJ3ZhbHVlJyB9KVxuICpcbiAqICAgICAgZGF0YS1pbml0IOyymOumrFxuICovXG5mdW5jdGlvbiBTa2VsKCkge1xuICBjb25zdCB7XG4gICAgYWN0aW9ucywgcHJvcHMsIHN0YXRlLCBzZXRQcm9wcywgc2V0U3RhdGUsIHNldFRhcmdldCwgYWRkRXZlbnQsIHJlbW92ZUV2ZW50XG4gIH0gPSBldFVJLmhvb2tzLnVzZUNvcmUoe1xuICAgIC8vIHByb3BzXG5cbiAgfSwge1xuICAgIC8vIHN0YXRlXG5cbiAgfSwgcmVuZGVyKTtcblxuICAvLyBjb25zdGFudFxuICBjb25zdCBNQVJHSU4gPSAyMDtcblxuICAvLyB2YXJpYWJsZVxuICBjb25zdCBuYW1lID0gJ3NrZWwnO1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcHJlZmVyLWNvbnN0XG4gIGxldCBjb21wb25lbnQgPSB7fTtcbiAgICAvLyBlbGVtZW50LCBzZWxlY3RvclxuICBsZXQgJHRhcmdldCxcbiAgICBzb21lU2VsZWN0b3IsIG90aGVyU2VsZWN0b3IsXG4gICAgJHRhcmdldEVsczEsICR0YXJnZXRFbHMyXG5cbiAge1xuICAgIC8qKlxuICAgICAqIGluaXRcbiAgICAgKiBAcGFyYW0gXyR0YXJnZXRcbiAgICAgKiBAcGFyYW0gX3Byb3BzXG4gICAgICovXG4gICAgZnVuY3Rpb24gaW5pdChfJHRhcmdldCwgX3Byb3BzKSB7XG4gICAgICBpZih0eXBlb2YgXyR0YXJnZXQgPT09ICdzdHJpbmcnKXtcbiAgICAgICAgJHRhcmdldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXyR0YXJnZXQpXG4gICAgICB9ZWxzZXtcbiAgICAgICAgJHRhcmdldCA9IF8kdGFyZ2V0O1xuICAgICAgfVxuXG4gICAgICBpZighJHRhcmdldCl7XG4gICAgICAgIHRocm93IEVycm9yKCd0YXJnZXTsnbQg7KG07J6s7ZWY7KeAIOyViuyKteuLiOuLpC4nKTtcbiAgICAgIH1cblxuICAgICAgc2V0VGFyZ2V0KCR0YXJnZXQpXG4gICAgICBzZXRQcm9wcyh7Li4ucHJvcHMsIC4uLl9wcm9wc30pO1xuXG4gICAgICBpZiAoJHRhcmdldC51aSkgcmV0dXJuO1xuICAgICAgJHRhcmdldC51aSA9IGNvbXBvbmVudDtcblxuICAgICAgc2V0dXAoKTtcbiAgICAgIHNldEV2ZW50KCk7XG5cbiAgICAgICR0YXJnZXQuc2V0QXR0cmlidXRlKCdkYXRhLWluaXQnLCAndHJ1ZScpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNldHVwKCkge1xuICAgICAgLy8gdGVtcGxhdGUsIHNlbGVjdG9yLCBlbGVtZW50LCBhY3Rpb25zXG4gICAgICBzZXR1cFRlbXBsYXRlKCk7XG4gICAgICBzZXR1cFNlbGVjdG9yKClcbiAgICAgIHNldHVwRWxlbWVudCgpO1xuICAgICAgc2V0dXBBY3Rpb25zKCk7XG5cbiAgICAgIC8vIHN0YXRlXG4gICAgICBzZXRTdGF0ZSh7IHN0YXRlOiBwcm9wcy5zdGF0ZSB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiB1cGRhdGVcbiAgICAgKiBAcGFyYW0gX3Byb3BzXG4gICAgICovXG4gICAgZnVuY3Rpb24gdXBkYXRlKF9wcm9wcykge1xuICAgICAgaWYgKF9wcm9wcyAmJiBldFVJLnV0aWxzLnNoYWxsb3dDb21wYXJlKHByb3BzLCBfcHJvcHMpICYmICEkdGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS1pbml0JykpIHJldHVybjtcbiAgICAgIGRlc3Ryb3koKTtcblxuICAgICAgc2V0UHJvcHMoeyAuLi5wcm9wcywgLi4uX3Byb3BzIH0pO1xuICAgICAgc2V0dXAoKTtcbiAgICAgIHNldEV2ZW50KCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZGVzdHJveSgpIHtcbiAgICAgIHJlbW92ZUV2ZW50KCk7XG4gICAgICAkdGFyZ2V0LnVpID0gbnVsbDtcbiAgICAgICR0YXJnZXQucmVtb3ZlQXR0cmlidXRlKCdkYXRhLWluaXQnKTtcbiAgICB9XG4gIH1cblxuICAvLyBmcmVxdWVuY3lcbiAgZnVuY3Rpb24gc2V0dXBUZW1wbGF0ZSgpIHtcbiAgICAvLyAkdGFyZ2V0LmlubmVySFRNTCA9IGBgO1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0dXBTZWxlY3Rvcigpe1xuICAgICR0YXJnZXRFbHMyID0gJy5lbDInO1xuICAgICR0YXJnZXRFbHMxID0gJy5lbDEnO1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0dXBFbGVtZW50KCkge1xuICAgIC8vIGlkXG4gICAgY29uc3QgbGFiZWxJZCA9IGV0VUkudXRpbHMuZ2V0UmFuZG9tVUlJRChuYW1lKTtcblxuICAgIC8vIGExMXlcbiAgICB1dGlscy5zZXRQcm9wZXJ0eSgkdGFyZ2V0LCAkc2VsZWN0TGFiZWwsICdpZCcsIGxhYmVsSWQpO1xuXG4gICAgLy8gY29tcG9uZW50IGN1c3RvbSBlbGVtZW50XG4gIH1cblxuICBmdW5jdGlvbiBzZXR1cEFjdGlvbnMoKXtcbiAgICBhY3Rpb25zLm9wZW4gPSAoKSA9PiB7XG5cbiAgICB9XG5cbiAgICBhY3Rpb25zLmNsb3NlID0gKCkgPT4ge1xuXG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gc2V0RXZlbnQoKSB7XG4gICAgYWRkRXZlbnQoJ2NsaWNrJywgJHRhcmdldEVsczEsICh7IHRhcmdldCB9KSA9PiB7XG4gICAgICAvLyBoYW5kbGVyXG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgLy8gcmVuZGVyXG4gIH1cblxuICBmdW5jdGlvbiBvcGVuKCkge1xuICB9XG5cbiAgZnVuY3Rpb24gY2xvc2UoKSB7XG4gIH1cblxuICBjb21wb25lbnQgPSB7XG4gICAgY29yZToge1xuICAgICAgc3RhdGUsXG4gICAgICBwcm9wcyxcbiAgICAgIGluaXQsXG4gICAgICByZW1vdmVFdmVudCxcbiAgICAgIGRlc3Ryb3ksXG4gICAgfSxcblxuICAgIC8vIGNhbGxhYmxlXG4gICAgdXBkYXRlLFxuICAgIG9wZW4sXG4gICAgY2xvc2UsXG4gIH1cblxuICByZXR1cm4gY29tcG9uZW50O1xufVxuIiwiZnVuY3Rpb24gU3dpcGVyQ29tcCgpIHtcbiAgY29uc3Qge1xuICAgIGFjdGlvbnMsIHByb3BzLCBzdGF0ZSwgc2V0U3RhdGUsIHNldFByb3BzLCBzZXRUYXJnZXQsIGFkZEV2ZW50LCByZW1vdmVFdmVudFxuICB9ID0gZXRVSS5ob29rcy51c2VDb3JlKFxuICAgIHtcbiAgICAgIGxvb3A6IHRydWUsXG4gICAgICBvbjoge1xuICAgICAgICBzbGlkZUNoYW5nZVRyYW5zaXRpb25FbmQoKSB7XG4gICAgICAgICAgLy8gY29uc29sZS5sb2coYCR7dGhpcy5yZWFsSW5kZXggKyAxfeuyiCDsp7ggc2xpZGVgKTtcbiAgICAgICAgICBzZXRTdGF0ZSh7IGFjdGl2ZUluZGV4OiB0aGlzLnJlYWxJbmRleCArIDEgfSk7XG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0sXG4gICAge1xuICAgICAgc3RhdGU6IFwiXCIsXG4gICAgICBydW5uaW5nOiBcIlwiLFxuICAgICAgYWN0aXZlSW5kZXg6IDAsXG4gICAgfSxcbiAgICByZW5kZXIsXG4gICk7XG5cbiAgLyoqXG4gICAqIGRhdGEtcHJvcHMg66as7Iqk7Yq4XG4gICAqL1xuXG4gICAgLy8gY29uc3RhbnRcbiAgY29uc3QgTUFSR0lOID0gMjA7XG5cbiAgLy8gdmFyaWFibGVcbiAgY29uc3QgbmFtZSA9IFwic3dpcGVyXCI7XG4gIGxldCBjb21wb25lbnQgPSB7fTtcbiAgLy8gZWxlbWVudCwgc2VsZWN0b3JcbiAgbGV0ICR0YXJnZXQsICRzd2lwZXIsICRzd2lwZXJOYXZpZ2F0aW9uLCAkc3dpcGVyUGFnaW5hdGlvbiwgJHN3aXBlckF1dG9wbGF5LCAkc3dpcGVyU2xpZGVUb0J1dHRvbjtcblxuICB7XG4gICAgLyoqXG4gICAgICogaW5pdFxuICAgICAqIEBwYXJhbSBfJHRhcmdldFxuICAgICAqIEBwYXJhbSBfcHJvcHNcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBpbml0KF8kdGFyZ2V0LCBfcHJvcHMpIHtcbiAgICAgIGlmICh0eXBlb2YgXyR0YXJnZXQgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgJHRhcmdldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXyR0YXJnZXQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgJHRhcmdldCA9IF8kdGFyZ2V0O1xuICAgICAgfVxuXG4gICAgICBpZiAoISR0YXJnZXQpIHtcbiAgICAgICAgdGhyb3cgRXJyb3IoXCJ0YXJnZXTsnbQg7KG07J6s7ZWY7KeAIOyViuyKteuLiOuLpC5cIik7XG4gICAgICB9XG5cbiAgICAgIHNldFRhcmdldCgkdGFyZ2V0KTtcbiAgICAgIHNldFByb3BzKHsgLi4ucHJvcHMsIC4uLl9wcm9wcyB9KTtcblxuICAgICAgaWYgKCR0YXJnZXQudWkpIHJldHVybjtcbiAgICAgICR0YXJnZXQudWkgPSBjb21wb25lbnQ7XG5cbiAgICAgIHNldHVwKCk7XG4gICAgICBzZXRFdmVudCgpO1xuXG4gICAgICAkdGFyZ2V0LnNldEF0dHJpYnV0ZShcImRhdGEtaW5pdFwiLCBcInRydWVcIik7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2V0dXAoKSB7XG4gICAgICAvLyB0ZW1wbGF0ZSwgc2VsZWN0b3IsIGVsZW1lbnQsIGFjdGlvbnNcbiAgICAgIHNldHVwVGVtcGxhdGUoKTtcbiAgICAgIHNldHVwU2VsZWN0b3IoKTtcbiAgICAgIHNldHVwRWxlbWVudCgpO1xuICAgICAgc2V0dXBBY3Rpb25zKCk7XG5cbiAgICAgIC8vIHN0YXRlXG4gICAgICBzZXRTdGF0ZSh7IHN0YXRlOiBwcm9wcy5zdGF0ZSB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiB1cGRhdGVcbiAgICAgKiBAcGFyYW0gX3Byb3BzXG4gICAgICovXG4gICAgZnVuY3Rpb24gdXBkYXRlKF9wcm9wcykge1xuICAgICAgaWYgKHByb3BzICYmIHV0aWxzLnNoYWxsb3dDb21wYXJlKHByb3BzLCBfcHJvcHMpICYmICEkdGFyZ2V0LmdldEF0dHJpYnV0ZShcImRhdGEtaW5pdFwiKSkgcmV0dXJuO1xuICAgICAgZGVzdHJveSgpO1xuXG4gICAgICBzZXRQcm9wcyh7IC4uLnByb3BzLCAuLi5fcHJvcHMgfSk7XG4gICAgICBzZXR1cCgpO1xuICAgICAgc2V0RXZlbnQoKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBkZXN0cm95KCkge1xuICAgICAgcmVtb3ZlRXZlbnQoKTtcbiAgICAgICR0YXJnZXQudWkgPSBudWxsO1xuICAgICAgJHRhcmdldC5yZW1vdmVBdHRyaWJ1dGUoXCJkYXRhLWluaXRcIik7XG4gICAgfVxuICB9XG5cbiAgLy8gZnJlcXVlbmN5XG4gIGZ1bmN0aW9uIHNldHVwVGVtcGxhdGUoKSB7XG4gICAgY29uc3QgeyBuYXZpZ2F0aW9uLCBwYWdpbmF0aW9uLCBhdXRvcGxheSB9ID0gcHJvcHM7XG4gICAgY29uc3QgeyAkdGVtcGxhdGVIVE1MIH0gPSB1c2VTd2lwZXJUbXBsKCk7XG4gICAgbGV0IG5hdmlnYXRpb25FbCwgcGFnaW5hdGlvbkVsLCBhdXRvcGxheUVsO1xuXG4gICAgZnVuY3Rpb24gY3JlYXRlSFRNTEVsZW1lbnQoX2NsYXNzTmFtZSwgaHRtbFN0cmluZykge1xuICAgICAgY29uc3QgdGVtcGxhdGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgdGVtcGxhdGUuY2xhc3NMaXN0LmFkZChfY2xhc3NOYW1lKTtcbiAgICAgIHRlbXBsYXRlLmlubmVySFRNTCA9IGh0bWxTdHJpbmc7XG4gICAgICByZXR1cm4gdGVtcGxhdGU7XG4gICAgfVxuXG4gICAgaWYgKG5hdmlnYXRpb24pIHtcbiAgICAgIG5hdmlnYXRpb25FbCA9IGNyZWF0ZUhUTUxFbGVtZW50KFwic3dpcGVyLW5hdmlnYXRpb25cIiwgJHRlbXBsYXRlSFRNTC5uYXZpZ2F0aW9uKCkpO1xuICAgICAgJHRhcmdldC5xdWVyeVNlbGVjdG9yKFwiLnN3aXBlci13cmFwcGVyXCIpLmFmdGVyKG5hdmlnYXRpb25FbCk7XG4gICAgICB0eXBlb2YgbmF2aWdhdGlvbiA9PT0gXCJib29sZWFuXCIgJiZcbiAgICAgIHNldFByb3BzKHtcbiAgICAgICAgbmF2aWdhdGlvbjoge1xuICAgICAgICAgIHByZXZFbDogXCIuc3dpcGVyLWJ1dHRvbi1wcmV2XCIsXG4gICAgICAgICAgbmV4dEVsOiBcIi5zd2lwZXItYnV0dG9uLW5leHRcIixcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmIChwYWdpbmF0aW9uKSB7XG4gICAgICBwYWdpbmF0aW9uRWwgPSBjcmVhdGVIVE1MRWxlbWVudChcInN3aXBlci1wYWdpbmF0aW9uLXdyYXBcIiwgJHRlbXBsYXRlSFRNTC5wYWdpbmF0aW9uKCkpO1xuICAgICAgJHRhcmdldC5xdWVyeVNlbGVjdG9yKFwiLnN3aXBlci13cmFwcGVyXCIpLmFmdGVyKHBhZ2luYXRpb25FbCk7XG4gICAgICB0eXBlb2YgcGFnaW5hdGlvbiA9PT0gXCJib29sZWFuXCIgJiZcbiAgICAgIHNldFByb3BzKHtcbiAgICAgICAgcGFnaW5hdGlvbjoge1xuICAgICAgICAgIGVsOiBcIi5zd2lwZXItcGFnaW5hdGlvblwiLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKGF1dG9wbGF5KSB7XG4gICAgICBhdXRvcGxheUVsID0gY3JlYXRlSFRNTEVsZW1lbnQoXCJzd2lwZXItYXV0b3BsYXktd3JhcFwiLCAkdGVtcGxhdGVIVE1MLmF1dG9wbGF5KCkpO1xuICAgICAgJHRhcmdldC5xdWVyeVNlbGVjdG9yKFwiLnN3aXBlci13cmFwcGVyXCIpLmFmdGVyKGF1dG9wbGF5RWwpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHNldHVwU2VsZWN0b3IoKSB7XG4gICAgJHN3aXBlclBhZ2luYXRpb24gPSBcIi5zd2lwZXItcGFnaW5hdGlvblwiO1xuICAgICRzd2lwZXJOYXZpZ2F0aW9uID0gXCIuc3dpcGVyLW5hdmlnYXRpb25cIjtcbiAgICAkc3dpcGVyQXV0b3BsYXkgPSBcIi5zd2lwZXItYXV0b3BsYXlcIjtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldHVwRWxlbWVudCgpIHtcbiAgICAvLyBpZFxuXG4gICAgLy8gYTExeVxuXG4gICAgLy8gbmV3IFN3aXBlciDsg53shLFcbiAgICAkc3dpcGVyID0gbmV3IFN3aXBlcigkdGFyZ2V0LCB7IC4uLnByb3BzIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0dXBBY3Rpb25zKCkge1xuICAgIC8vIGFjdGlvbnMuc3RhcnQgPSAoKSA9PiB7XG4gICAgLy8gICBwbGF5KCk7XG4gICAgLy8gfTtcbiAgICAvL1xuICAgIC8vIGFjdGlvbnMuc3RvcCA9ICgpID0+IHtcbiAgICAvLyAgIHN0b3AoKTtcbiAgICAvLyB9O1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0RXZlbnQoKSB7XG4gICAgLy8gYXV0b3BsYXkg67KE7Yq8XG4gICAgaWYgKHByb3BzLmF1dG9wbGF5KSB7XG4gICAgICBhZGRFdmVudChcImNsaWNrXCIsICRzd2lwZXJBdXRvcGxheSwgKGV2ZW50KSA9PiB7XG4gICAgICAgIGNvbnN0ICRldmVudFRhcmdldCA9IGV2ZW50LnRhcmdldC5jbG9zZXN0KCRzd2lwZXJBdXRvcGxheSk7XG4gICAgICAgIGhhbmRsZUF1dG9wbGF5KCRldmVudFRhcmdldCk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgLy8gcmVuZGVyXG4gIH1cblxuICAvLyBhdXRvcGxheSDqtIDroKgg7Luk7Iqk7YWAIO2VqOyImFxuICBmdW5jdGlvbiBoYW5kbGVBdXRvcGxheSgkdGFyZ2V0KSB7XG4gICAgJHRhcmdldC5jbGFzc0xpc3QudG9nZ2xlKFwicGxheVwiKTtcbiAgICAkdGFyZ2V0LmNsYXNzTGlzdC50b2dnbGUoXCJzdG9wXCIpO1xuXG4gICAgaWYgKCR0YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKFwic3RvcFwiKSkge1xuICAgICAgc3RvcCgpO1xuICAgIH0gZWxzZSBpZiAoJHRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoXCJwbGF5XCIpKSB7XG4gICAgICBwbGF5KCk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gcGxheSgpIHtcbiAgICAkc3dpcGVyLmF1dG9wbGF5LnN0YXJ0KCk7XG4gIH1cblxuICBmdW5jdGlvbiBzdG9wKCkge1xuICAgICRzd2lwZXIuYXV0b3BsYXkuc3RvcCgpO1xuICB9XG5cbiAgLy8g7Yq57KCVIOyKrOudvOydtOuTnOuhnCDsnbTrj5lcbiAgZnVuY3Rpb24gbW92ZVRvU2xpZGUoaW5kZXgsIHNwZWVkLCBydW5DYWxsYmFja3MpIHtcbiAgICBpZiAocHJvcHMubG9vcCkge1xuICAgICAgJHN3aXBlci5zbGlkZVRvTG9vcChpbmRleCwgc3BlZWQsIHJ1bkNhbGxiYWNrcyk7XG4gICAgfSBlbHNlIHtcbiAgICAgICRzd2lwZXIuc2xpZGVUbyhpbmRleCk7XG4gICAgfVxuICB9XG5cbiAgY29tcG9uZW50ID0ge1xuICAgIGNvcmU6IHtcbiAgICAgIHN0YXRlLFxuICAgICAgcHJvcHMsXG4gICAgICBpbml0LFxuICAgICAgcmVtb3ZlRXZlbnQsXG4gICAgICBkZXN0cm95LFxuICAgIH0sXG4gICAgLy8gY2FsbGFibGVcbiAgICB1cGRhdGUsXG4gICAgZ2V0U3dpcGVySW5zdGFuY2UoKSB7XG4gICAgICByZXR1cm4gJHN3aXBlcjsgLy8gJHN3aXBlciDsnbjsiqTthLTsiqQg67CY7ZmYXG4gICAgfSxcbiAgfTtcblxuICByZXR1cm4gY29tcG9uZW50O1xufVxuIiwiLyoqXG4gKiBTa2VsXG4gKiAvLyBpbml0LCBzZXR1cCwgdXBkYXRlLCBkZXN0cm95XG4gKiAvLyBzZXR1cFRlbXBsYXRlLCBzZXR1cFNlbGVjdG9yLCBzZXR1cEVsZW1lbnQsIHNldHVwQWN0aW9ucyxcbiAqICAgICAgc2V0RXZlbnQsIHJlbmRlciwgY3VzdG9tRm4sIGNhbGxhYmxlXG4gKi9cbmZ1bmN0aW9uIFRhYigpIHtcbiAgY29uc3QgeyBhY3Rpb25zLCBwcm9wcywgc3RhdGUsIHNldFByb3BzLCBzZXRTdGF0ZSwgc2V0VGFyZ2V0LCBhZGRFdmVudCwgcmVtb3ZlRXZlbnQgfSA9IGV0VUkuaG9va3MudXNlQ29yZShcbiAgICB7XG4gICAgICAvLyBwcm9wc1xuICAgIH0sXG4gICAge1xuICAgICAgLy8gc3RhdGVcbiAgICB9LFxuICAgIHJlbmRlcixcbiAgKTtcblxuICAvLyB2YXJpYWJsZVxuICBjb25zdCBuYW1lID0gXCJ0YWJcIjtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHByZWZlci1jb25zdFxuICBsZXQgY29tcG9uZW50ID0ge307XG4gIC8vIGVsZW1lbnQsIHNlbGVjdG9yXG4gIGxldCAkdGFyZ2V0LCB0YWJIZWFkLCAkdGFiSGVhZEVsLCB0YWJCdG4sICR0YWJCdG5FbCwgdGFiQ29udGVudCwgJHRhYkNvbnRlbnRFbDtcblxuICB7XG4gICAgLyoqXG4gICAgICogaW5pdFxuICAgICAqIEBwYXJhbSBfJHRhcmdldFxuICAgICAqIEBwYXJhbSBfcHJvcHNcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBpbml0KF8kdGFyZ2V0LCBfcHJvcHMpIHtcbiAgICAgIGlmICh0eXBlb2YgXyR0YXJnZXQgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgJHRhcmdldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXyR0YXJnZXQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgJHRhcmdldCA9IF8kdGFyZ2V0O1xuICAgICAgfVxuXG4gICAgICBpZiAoISR0YXJnZXQpIHtcbiAgICAgICAgdGhyb3cgRXJyb3IoXCJ0YXJnZXTsnbQg7KG07J6s7ZWY7KeAIOyViuyKteuLiOuLpC5cIik7XG4gICAgICB9XG5cbiAgICAgIHNldFRhcmdldCgkdGFyZ2V0KTtcbiAgICAgIHNldFByb3BzKHsgLi4ucHJvcHMsIC4uLl9wcm9wcyB9KTtcblxuICAgICAgaWYgKCR0YXJnZXQudWkpIHJldHVybjtcbiAgICAgICR0YXJnZXQudWkgPSBjb21wb25lbnQ7XG5cbiAgICAgIHNldHVwKCk7XG4gICAgICBzZXRFdmVudCgpO1xuXG4gICAgICAkdGFyZ2V0LnNldEF0dHJpYnV0ZShcImRhdGEtaW5pdFwiLCBcInRydWVcIik7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2V0dXAoKSB7XG4gICAgICBzZXR1cFRlbXBsYXRlKCk7XG4gICAgICBzZXR1cFNlbGVjdG9yKCk7XG4gICAgICBzZXR1cEVsZW1lbnQoKTtcbiAgICAgIHNldHVwQWN0aW9ucygpO1xuXG4gICAgICAvLyBlZmZlY3RcbiAgICAgIHByb3BzLnN0aWNreSAmJiBzdGlja3lUYWIoKTtcblxuICAgICAgLy8gc3RhdGVcbiAgICAgIHNldFN0YXRlKHsgYWN0aXZlVmFsdWU6IHByb3BzLmFjdGl2ZSA/PyAkdGFiQnRuRWxbMF0uZ2V0QXR0cmlidXRlKFwiZGF0YS10YWItdmFsdWVcIikgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogdXBkYXRlXG4gICAgICogQHBhcmFtIF9wcm9wc1xuICAgICAqL1xuICAgIGZ1bmN0aW9uIHVwZGF0ZShfcHJvcHMpIHtcbiAgICAgIGlmIChfcHJvcHMgJiYgZXRVSS51dGlscy5zaGFsbG93Q29tcGFyZShwcm9wcywgX3Byb3BzKSAmJiAhJHRhcmdldC5nZXRBdHRyaWJ1dGUoXCJkYXRhLWluaXRcIikpIHJldHVybjtcbiAgICAgIGRlc3Ryb3koKTtcblxuICAgICAgc2V0UHJvcHMoeyAuLi5wcm9wcywgLi4uX3Byb3BzIH0pO1xuICAgICAgc2V0dXAoKTtcbiAgICAgIHNldEV2ZW50KCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZGVzdHJveSgpIHtcbiAgICAgIHJlbW92ZUV2ZW50KCk7XG4gICAgICAkdGFyZ2V0LnVpID0gbnVsbDtcbiAgICAgICR0YXJnZXQucmVtb3ZlQXR0cmlidXRlKFwiZGF0YS1pbml0XCIpO1xuICAgIH1cbiAgfVxuXG4gIC8vIGZyZXF1ZW5jeVxuICBmdW5jdGlvbiBzZXR1cFRlbXBsYXRlKCkge1xuICAgIC8vICR0YXJnZXQuaW5uZXJIVE1MID0gYGA7XG4gIH1cblxuICBmdW5jdGlvbiBzZXR1cFNlbGVjdG9yKCkge1xuICAgIC8vIHNlbGVjdG9yXG4gICAgdGFiSGVhZCA9IFwiLnRhYi1oZWFkXCI7XG4gICAgdGFiQnRuID0gXCIudGFiLWxhYmVsXCI7XG4gICAgdGFiQ29udGVudCA9IFwiLnRhYi1jb250ZW50XCI7XG5cbiAgICAvLyBlbGVtZW50XG4gICAgJHRhYkhlYWRFbCA9ICR0YXJnZXQucXVlcnlTZWxlY3Rvcih0YWJIZWFkKTtcbiAgICAkdGFiQnRuRWwgPSAkdGFyZ2V0LnF1ZXJ5U2VsZWN0b3JBbGwodGFiQnRuKTtcbiAgICAkdGFiQ29udGVudEVsID0gJHRhcmdldC5xdWVyeVNlbGVjdG9yQWxsKHRhYkNvbnRlbnQpO1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0dXBFbGVtZW50KCkge1xuICAgIC8vIGlkXG4gICAgLy8gYTExeVxuICAgIGV0VUkudXRpbHMuc2V0UHJvcGVydHkoJHRhcmdldCwgdGFiSGVhZCwgXCJyb2xlXCIsIFwidGFibGlzdFwiKTtcblxuICAgIC8vIGNvbXBvbmVudCBjdXN0b20gZWxlbWVudFxuICAgICR0YWJIZWFkRWwuc3R5bGUudG91Y2hBY3Rpb24gPSBcIm5vbmVcIjtcbiAgICAkdGFiQnRuRWwuZm9yRWFjaCgodGFiLCBpbmRleCkgPT4ge1xuICAgICAgY29uc3QgdGFiQnRuSWQgPSBldFVJLnV0aWxzLmdldFJhbmRvbVVJSUQobmFtZSk7XG4gICAgICBjb25zdCB0YWJDb250ZW50SWQgPSBldFVJLnV0aWxzLmdldFJhbmRvbVVJSUQoXCJ0YWJwYW5lbFwiKTtcblxuICAgICAgdGFiLnNldEF0dHJpYnV0ZShcImlkXCIsIHRhYkJ0bklkKTtcbiAgICAgIHRhYi5zZXRBdHRyaWJ1dGUoXCJyb2xlXCIsIFwidGFiXCIpO1xuICAgICAgdGFiLnNldEF0dHJpYnV0ZShcImFyaWEtc2VsZWN0ZWRcIiwgZmFsc2UpO1xuXG4gICAgICBpZiAoJHRhYkNvbnRlbnRFbFtpbmRleF0pIHtcbiAgICAgICAgJHRhYkNvbnRlbnRFbFtpbmRleF0uc2V0QXR0cmlidXRlKFwiaWRcIiwgdGFiQ29udGVudElkKTtcbiAgICAgICAgJHRhYkNvbnRlbnRFbFtpbmRleF0uc2V0QXR0cmlidXRlKFwicm9sZVwiLCBcInRhYnBhbmVsXCIpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCB0YWJWYWx1ZSA9IHRhYi5nZXRBdHRyaWJ1dGUoXCJkYXRhLXRhYi12YWx1ZVwiKTtcbiAgICAgIGNvbnN0IHRhYkNvbnRlbnRWYWx1ZSA9ICR0YWJDb250ZW50RWxbaW5kZXhdLmdldEF0dHJpYnV0ZShcImRhdGEtdGFiLXZhbHVlXCIpO1xuICAgICAgZXRVSS51dGlscy5zZXRQcm9wZXJ0eSgkdGFyZ2V0LCBgJHt0YWJDb250ZW50fVtkYXRhLXRhYi12YWx1ZT1cIiR7dGFiVmFsdWV9XCJdYCwgXCJhcmlhLWxhYmVsbGVkYnlcIiwgdGFiLmlkKTtcbiAgICAgIGV0VUkudXRpbHMuc2V0UHJvcGVydHkoJHRhcmdldCwgYCR7dGFiQnRufVtkYXRhLXRhYi12YWx1ZT1cIiR7dGFiQ29udGVudFZhbHVlfVwiXWAsIFwiYXJpYS1jb250cm9sc1wiLCAkdGFiQ29udGVudEVsW2luZGV4XS5pZCk7XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBzZXR1cEFjdGlvbnMoKSB7XG4gICAgbGV0IHN0YXJ0WCA9IDA7XG4gICAgbGV0IGVuZFggPSAwO1xuICAgIGxldCBtb3ZlWCA9IDA7XG4gICAgbGV0IHNjcm9sbExlZnQgPSAwO1xuICAgIGxldCBpc1JlYWR5TW92ZSA9IGZhbHNlO1xuICAgIGxldCBjbGlja2FibGUgPSB0cnVlO1xuXG4gICAgYWN0aW9ucy5zZWxlY3QgPSAoZSkgPT4ge1xuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIGNvbnN0IHRhcmdldEJ0biA9IGUudGFyZ2V0LmNsb3Nlc3QodGFiQnRuKTtcbiAgICAgIGlmICghdGFyZ2V0QnRuKSByZXR1cm47XG4gICAgICBpZiAoIWNsaWNrYWJsZSkgcmV0dXJuO1xuICAgICAgc2V0U3RhdGUoeyBhY3RpdmVWYWx1ZTogdGFyZ2V0QnRuLmdldEF0dHJpYnV0ZShcImRhdGEtdGFiLXZhbHVlXCIpIH0pO1xuICAgICAgZ3NhcC50bygkdGFiSGVhZEVsLCB7XG4gICAgICAgIGR1cmF0aW9uOiAwLjUsXG4gICAgICAgIHNjcm9sbExlZnQ6IHRhcmdldEJ0bi5vZmZzZXRMZWZ0LFxuICAgICAgICBvdmVyd3JpdGU6IHRydWUsXG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgYWN0aW9ucy5kcmFnU3RhcnQgPSAoZSkgPT4ge1xuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIGlmIChpc1JlYWR5TW92ZSkgcmV0dXJuO1xuICAgICAgaXNSZWFkeU1vdmUgPSB0cnVlO1xuICAgICAgc3RhcnRYID0gZS54O1xuICAgICAgc2Nyb2xsTGVmdCA9ICR0YWJIZWFkRWwuc2Nyb2xsTGVmdDtcbiAgICB9O1xuICAgIGFjdGlvbnMuZHJhZ01vdmUgPSAoZSkgPT4ge1xuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIGlmICghaXNSZWFkeU1vdmUpIHJldHVybjtcbiAgICAgIG1vdmVYID0gZS54O1xuICAgICAgJHRhYkhlYWRFbC5zY3JvbGxMZWZ0ID0gc2Nyb2xsTGVmdCArIChzdGFydFggLSBtb3ZlWCk7XG4gICAgfTtcbiAgICBhY3Rpb25zLmRyYWdFbmQgPSAoZSkgPT4ge1xuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIGlmICghaXNSZWFkeU1vdmUpIHJldHVybjtcbiAgICAgIGVuZFggPSBlLng7XG4gICAgICBpZiAoTWF0aC5hYnMoc3RhcnRYIC0gZW5kWCkgPCAxMCkgY2xpY2thYmxlID0gdHJ1ZTtcbiAgICAgIGVsc2UgY2xpY2thYmxlID0gZmFsc2U7XG4gICAgICBpc1JlYWR5TW92ZSA9IGZhbHNlO1xuICAgIH07XG4gICAgYWN0aW9ucy5kcmFnTGVhdmUgPSAoZSkgPT4ge1xuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIGlmICghaXNSZWFkeU1vdmUpIHJldHVybjtcblxuICAgICAgLy8gZ3NhcC50bygkdGFiSGVhZEVsLCB7XG4gICAgICAvLyAgIHNjcm9sbExlZnQ6ICR0YXJnZXQucXVlcnlTZWxlY3RvcignW2FyaWEtc2VsZWN0ZWQ9XCJ0cnVlXCJdJykub2Zmc2V0TGVmdCxcbiAgICAgIC8vICAgb3ZlcndyaXRlOiB0cnVlLFxuICAgICAgLy8gfSk7XG5cbiAgICAgIGNsaWNrYWJsZSA9IHRydWU7XG4gICAgICBpc1JlYWR5TW92ZSA9IGZhbHNlO1xuICAgIH07XG5cbiAgICBhY3Rpb25zLnVwID0gKGUpID0+IHtcbiAgICAgIGlmICghZS50YXJnZXQucHJldmlvdXNFbGVtZW50U2libGluZykgcmV0dXJuO1xuICAgICAgc2V0U3RhdGUoeyBhY3RpdmVWYWx1ZTogZS50YXJnZXQucHJldmlvdXNFbGVtZW50U2libGluZy5nZXRBdHRyaWJ1dGUoXCJkYXRhLXRhYi12YWx1ZVwiKSB9KTtcbiAgICAgIGZvY3VzVGFyZ2V0VmFsdWUodGFiQnRuLCBzdGF0ZS5hY3RpdmVWYWx1ZSk7XG4gICAgfTtcbiAgICBhY3Rpb25zLmRvd24gPSAoZSkgPT4ge1xuICAgICAgaWYgKCFlLnRhcmdldC5uZXh0RWxlbWVudFNpYmxpbmcpIHJldHVybjtcbiAgICAgIHNldFN0YXRlKHsgYWN0aXZlVmFsdWU6IGUudGFyZ2V0Lm5leHRFbGVtZW50U2libGluZy5nZXRBdHRyaWJ1dGUoXCJkYXRhLXRhYi12YWx1ZVwiKSB9KTtcbiAgICAgIGZvY3VzVGFyZ2V0VmFsdWUodGFiQnRuLCBzdGF0ZS5hY3RpdmVWYWx1ZSk7XG4gICAgfTtcbiAgICBhY3Rpb25zLmZpcnN0ID0gKCkgPT4ge1xuICAgICAgc2V0U3RhdGUoeyBhY3RpdmVWYWx1ZTogJHRhYkJ0bkVsWzBdLmdldEF0dHJpYnV0ZShcImRhdGEtdGFiLXZhbHVlXCIpIH0pO1xuICAgICAgZm9jdXNUYXJnZXRWYWx1ZSh0YWJCdG4sIHN0YXRlLmFjdGl2ZVZhbHVlKTtcbiAgICB9O1xuICAgIGFjdGlvbnMubGFzdCA9ICgpID0+IHtcbiAgICAgIHNldFN0YXRlKHsgYWN0aXZlVmFsdWU6ICR0YWJCdG5FbFskdGFiQnRuRWwubGVuZ3RoIC0gMV0uZ2V0QXR0cmlidXRlKFwiZGF0YS10YWItdmFsdWVcIikgfSk7XG4gICAgICBmb2N1c1RhcmdldFZhbHVlKHRhYkJ0biwgc3RhdGUuYWN0aXZlVmFsdWUpO1xuICAgIH07XG5cbiAgICBmdW5jdGlvbiBmb2N1c1RhcmdldFZhbHVlKGVsLCB2YWx1ZSkge1xuICAgICAgY29uc3QgZm9jdXNUYXJnZXQgPSAkdGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoYCR7ZWx9W2RhdGEtdGFiLXZhbHVlPVwiJHt2YWx1ZX1cIl1gKTtcbiAgICAgIGZvY3VzVGFyZ2V0Py5mb2N1cygpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHNldEV2ZW50KCkge1xuICAgIGNvbnN0IGFjdGlvbkxpc3QgPSB7XG4gICAgICB1cDogW1wiQXJyb3dMZWZ0XCJdLFxuICAgICAgZG93bjogW1wiQXJyb3dSaWdodFwiXSxcbiAgICAgIGZpcnN0OiBbXCJIb21lXCJdLFxuICAgICAgbGFzdDogW1wiRW5kXCJdLFxuICAgICAgc2VsZWN0OiBbXCJFbnRlclwiLCBcIiBcIl0sXG4gICAgfTtcblxuICAgIGFkZEV2ZW50KFwiY2xpY2tcIiwgdGFiSGVhZCwgYWN0aW9ucy5zZWxlY3QpO1xuICAgIGFkZEV2ZW50KFwicG9pbnRlcmRvd25cIiwgdGFiSGVhZCwgYWN0aW9ucy5kcmFnU3RhcnQpO1xuICAgIGFkZEV2ZW50KFwicG9pbnRlcm1vdmVcIiwgdGFiSGVhZCwgYWN0aW9ucy5kcmFnTW92ZSk7XG4gICAgYWRkRXZlbnQoXCJwb2ludGVydXBcIiwgdGFiSGVhZCwgYWN0aW9ucy5kcmFnRW5kKTtcbiAgICBhZGRFdmVudChcInBvaW50ZXJsZWF2ZVwiLCB0YWJIZWFkLCBhY3Rpb25zLmRyYWdMZWF2ZSk7XG5cbiAgICBhZGRFdmVudChcImtleWRvd25cIiwgdGFiSGVhZCwgKGUpID0+IHtcbiAgICAgIGNvbnN0IHsga2V5IH0gPSBlO1xuICAgICAgY29uc3QgYWN0aW9uID0gT2JqZWN0LmVudHJpZXMoYWN0aW9uTGlzdCkuZmluZCgoW18sIGtleXNdKSA9PiBrZXlzLmluY2x1ZGVzKGtleSkpO1xuXG4gICAgICBpZiAoYWN0aW9uKSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgY29uc3QgW2FjdGlvbk5hbWVdID0gYWN0aW9uO1xuICAgICAgICBhY3Rpb25zW2FjdGlvbk5hbWVdPy4oZSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgY29uc3QgZ2V0SWQgPSAkdGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoYCR7dGFiQnRufVthcmlhLXNlbGVjdGVkPVwidHJ1ZVwiXWApPy5pZDtcblxuICAgIGV0VUkudXRpbHMuc2V0UHJvcGVydHkoJHRhcmdldCwgJ1thcmlhLXNlbGVjdGVkPVwidHJ1ZVwiXScsIFwiYXJpYS1zZWxlY3RlZFwiLCBmYWxzZSk7XG4gICAgZXRVSS51dGlscy5zZXRQcm9wZXJ0eSgkdGFyZ2V0LCBgJHt0YWJCdG59W2RhdGEtdGFiLXZhbHVlPVwiJHtzdGF0ZS5hY3RpdmVWYWx1ZX1cIl1gLCBcImFyaWEtc2VsZWN0ZWRcIiwgdHJ1ZSk7XG5cbiAgICAkdGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoYCR7dGFiQ29udGVudH1bYXJpYS1sYWJlbGxlZGJ5PVwiJHtnZXRJZH1cIl1gKT8uY2xhc3NMaXN0LnJlbW92ZShcInNob3dcIik7XG4gICAgJHRhcmdldC5xdWVyeVNlbGVjdG9yKGAke3RhYkNvbnRlbnR9W2RhdGEtdGFiLXZhbHVlPVwiJHtzdGF0ZS5hY3RpdmVWYWx1ZX1cIl1gKT8uY2xhc3NMaXN0LmFkZChcInNob3dcIik7XG4gIH1cblxuICAvLyBjdXN0b21cbiAgZnVuY3Rpb24gc3RpY2t5VGFiKCkge1xuICAgIGNvbnN0IHsgYm90dG9tIH0gPSBldFVJLmhvb2tzLnVzZUdldENsaWVudFJlY3QoZG9jdW1lbnQsIHByb3BzLnN0aWNreSk7XG5cbiAgICAkdGFyZ2V0LnN0eWxlLnBvc2l0aW9uID0gXCJyZWxhdGl2ZVwiO1xuICAgICR0YWJIZWFkRWwuc3R5bGUucG9zaXRpb24gPSBcInN0aWNreVwiO1xuICAgIGlmICghYm90dG9tKSAkdGFiSGVhZEVsLnN0eWxlLnRvcCA9IDAgKyBcInB4XCI7XG4gICAgZWxzZSAkdGFiSGVhZEVsLnN0eWxlLnRvcCA9IGJvdHRvbSArIFwicHhcIjtcbiAgfVxuXG4gIGNvbXBvbmVudCA9IHtcbiAgICBjb3JlOiB7XG4gICAgICBzdGF0ZSxcbiAgICAgIHByb3BzLFxuICAgICAgaW5pdCxcbiAgICAgIHJlbW92ZUV2ZW50LFxuICAgICAgZGVzdHJveSxcbiAgICB9LFxuICAgIHVwZGF0ZSxcbiAgfTtcblxuICByZXR1cm4gY29tcG9uZW50O1xufVxuXG4vKlxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgZnVuY3Rpb24gKCkge1xuICBjb25zdCAkdGFiQm94ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtY29tcG9uZW50PVwidGFiXCJdJyk7XG4gICR0YWJCb3guZm9yRWFjaCgodGFiQm94KSA9PiB7XG4gICAgY29uc3QgdGFiID0gVGFiKCk7XG4gICAgdGFiLmNvcmUuaW5pdCh0YWJCb3gpO1xuICB9KTtcbn0pO1xuKi9cbiIsIi8vIHByb3Bz64qUIOycoOyggCjsnpHsl4XsnpAp6rCAIOygleydmO2VoCDsiJgg7J6I64qUIOyYteyFmFxuLy8gc3RhdGXripQg64K067aAIOuhnOyngeyXkOyEnCDsnpHrj5nrkJjripQg66Gc7KeBIChleDogc3RhdGUgb3BlbiBjbG9zZSBhcmlhIOuTseuTsS4uLi4gKVxuXG4vLyDtg4DsnoUg7KCV7J2YXG5cbi8qKlxuICogQHR5cGVkZWYge09iamVjdH0gVG9vbHRpcFByb3BzQ29uZmlnXG4gKiBAcHJvcGVydHkge2Jvb2xlYW59IGRpc2FibGVkIC0g7JqU7IaM6rCAIOu5hO2ZnOyEse2ZlCDsg4Htg5zsnbjsp4Drpbwg64KY7YOA64OF64uI64ukLlxuICogQHByb3BlcnR5IHtib29sZWFufSBvbmNlIC0g7J2067Kk7Yq464KYIOyVoeyFmOydhCDtlZwg67KI66eMIOyLpO2Wie2VoOyngCDsl6zrtoDrpbwg6rKw7KCV7ZWp64uI64ukLlxuICogQHByb3BlcnR5IHtmYWxzZSB8IG51bWJlcn0gZHVyYXRpb24gLSDslaDri4jrqZTsnbTshZgg65iQ64qUIOydtOuypO2KuCDsp4Dsho0g7Iuc6rCE7J2EIOuwgOumrOy0iCDri6jsnITroZwg7ISk7KCV7ZWp64uI64ukLiAnZmFsc2Un7J28IOqyveyasCDsp4Dsho0g7Iuc6rCE7J2EIOustOyLnO2VqeuLiOuLpC5cbiAqIEBwcm9wZXJ0eSB7T2JqZWN0fSBvcmlnaW4gLSDsm5DsoJAg65iQ64qUIOyLnOyekSDsp4DsoJDsnYQg64KY7YOA64K064qUIOqwneyytOyeheuLiOuLpC5cbiAqL1xuXG4vKipcbiAqIEB0eXBlZGVmIHtPYmplY3R9IFRvb2x0aXBTdGF0ZUNvbmZpZ1xuICogQHByb3BlcnR5IHsnY2xvc2UnIHwgJ29wZW4nfSBzdGF0ZSAtIO2ItO2MgeydmCDsg4Htg5zqsJIuIGNsb3NlLCBvcGVuIOuRmCDspJHsl5Ag7ZWY64KY7J6F64uI64ukLlxuICogQHByb3BlcnR5IHsnYm90dG9tJyB8ICd0b3AnIHwgJ2xlZnQnIHwgJ3JpZ2h0J30gcG9zaXRpb24gLSDtiLTtjIHsnZgg7JyE7LmY6rCSLiBib3R0b20sIHRvcCwgbGVmdCwgcmlnaHQg7KSR7JeQIO2VmOuCmOyeheuLiOuLpC5cbiAqL1xuXG5mdW5jdGlvbiBUb29sdGlwKCkge1xuICBjb25zdCB7XG4gICAgcHJvcHMsIHN0YXRlLCBzZXRQcm9wcywgc2V0U3RhdGUsIHNldFRhcmdldCwgYWRkRXZlbnQsIHJlbW92ZUV2ZW50XG4gIH0gPSBldFVJLmhvb2tzLnVzZUNvcmUoe1xuXG4gIH0sIHtcblxuICB9LCByZW5kZXIpO1xuXG4gIC8vIHN0YXRlIOuzgOqyvSDsi5wg656c642UIOyerO2YuOy2nFxuICBjb25zdCBuYW1lID0gJ3Rvb2x0aXAnO1xuICBsZXQgY29tcG9uZW50ID0ge307XG4gICAgLyoqIEB0eXBlIHtUb29sdGlwUHJvcHNDb25maWd9ICovXG4gICAgLyoqIEB0eXBlIHtUb29sdGlwU3RhdGVDb25maWd9ICovXG4gICAgLy8g7JqU7IaM6rSA66CoIOuzgOyImOuTpFxuICBsZXQgJHRhcmdldCxcbiAgICAkdG9vbHRpcFRyaWdnZXJCdG4sXG4gICAgJHRvb2x0aXBDbG9zZUJ0bixcbiAgICAkdG9vbHRpcENvbnRhaW5lcjtcblxuICB7XG4gICAgLyoqXG4gICAgICogaW5pdFxuICAgICAqIEBwYXJhbSBfJHRhcmdldFxuICAgICAqIEBwYXJhbSBfcHJvcHNcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBpbml0KF8kdGFyZ2V0LCBfcHJvcHMpIHtcbiAgICAgIGlmICh0eXBlb2YgXyR0YXJnZXQgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICR0YXJnZXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKF8kdGFyZ2V0KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICR0YXJnZXQgPSBfJHRhcmdldDtcbiAgICAgIH1cblxuICAgICAgaWYgKCEkdGFyZ2V0KSB7XG4gICAgICAgIHRocm93IEVycm9yKCd0YXJnZXTsnbQg7KG07J6s7ZWY7KeAIOyViuyKteuLiOuLpC4nKTtcbiAgICAgIH1cblxuICAgICAgc2V0VGFyZ2V0KCR0YXJnZXQpO1xuICAgICAgc2V0UHJvcHMoeyAuLi5wcm9wcywgLi4uX3Byb3BzIH0pO1xuXG4gICAgICBpZiAoJHRhcmdldC51aSkgcmV0dXJuO1xuICAgICAgJHRhcmdldC51aSA9IHRoaXM7XG5cbiAgICAgIHNldHVwKCk7XG4gICAgICBzZXRFdmVudCgpO1xuXG4gICAgICAkdGFyZ2V0LnNldEF0dHJpYnV0ZSgnZGF0YS1pbml0JywgJ3RydWUnKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzZXR1cCgpIHtcbiAgICAgIHNldHVwU2VsZWN0b3IoKTtcbiAgICAgIHNldHVwRWxlbWVudCgpO1xuXG4gICAgICAvLyBmb2N1cyB0cmFwXG4gICAgICBmb2N1c1RyYXBJbnN0YW5jZSA9IGZvY3VzVHJhcC5jcmVhdGVGb2N1c1RyYXAoJHRhcmdldCwge1xuICAgICAgICBvbkFjdGl2YXRlOiAoKSA9PiB7fSxcbiAgICAgICAgb25EZWFjdGl2YXRlOiAoKSA9PiB7XG4gICAgICAgICAgY2xvc2UoKTtcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBzdGF0ZVxuICAgICAgc2V0U3RhdGUoeyBzdGF0ZTogcHJvcHMuc3RhdGUgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogdXBkYXRlXG4gICAgICogQHBhcmFtIF9wcm9wc1xuICAgICAqL1xuICAgIGZ1bmN0aW9uIHVwZGF0ZShfcHJvcHMpIHtcbiAgICAgIGlmIChfcHJvcHMgJiYgZXRVSS51dGlscy5zaGFsbG93Q29tcGFyZShwcm9wcywgX3Byb3BzKSAmJiAhJHRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtaW5pdCcpKSByZXR1cm47XG4gICAgICBkZXN0cm95KCk7XG5cbiAgICAgIHNldFByb3BzKHsgLi4ucHJvcHMsIC4uLl9wcm9wcyB9KTtcbiAgICAgIHNldHVwKCk7XG4gICAgICBzZXRFdmVudCgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGRlc3Ryb3koKSB7XG4gICAgICByZW1vdmVFdmVudCgpO1xuICAgIH1cbiAgfVxuXG4gIC8vIGZyZXF1ZW5jeVxuICBmdW5jdGlvbiBzZXR1cFNlbGVjdG9yKCkge1xuICAgIC8vIGVsZW1lbnRcbiAgICAkdG9vbHRpcENvbnRhaW5lciA9ICR0YXJnZXQucXVlcnlTZWxlY3RvcignLnRvb2x0aXAtY29udGFpbmVyJyk7XG5cbiAgICAvLyBzZWxlY290clxuICAgICR0b29sdGlwVHJpZ2dlckJ0biA9ICcudG9vbHRpcC1idG4nO1xuICAgICR0b29sdGlwQ2xvc2VCdG4gPSAnLmJ0bi1jbG9zZSc7XG4gIH1cblxuICBmdW5jdGlvbiBzZXR1cEVsZW1lbnQoKSB7XG4gICAgLy8gc2V0IGlkXG4gICAgY29uc3QgaWQgPSBldFVJLnV0aWxzLmdldFJhbmRvbVVJSUQobmFtZSk7XG4gICAgY29uc3QgdGl0bGVJZCA9IGV0VUkudXRpbHMuZ2V0UmFuZG9tVUlJRChuYW1lICsgJy10aXQnKTtcblxuICAgIC8vIGExMXlcbiAgICAkdGFyZ2V0LnNldEF0dHJpYnV0ZSgnaWQnLCBpZCk7XG4gICAgJHRhcmdldC5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCAnZmFsc2UnKTtcbiAgICAkdGFyZ2V0LnNldEF0dHJpYnV0ZSgnYXJpYS1jb250cm9scycsIHRpdGxlSWQpO1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0RXZlbnQoKSB7XG4gICAgYWRkRXZlbnQoJ2NsaWNrJywgJHRvb2x0aXBUcmlnZ2VyQnRuLCBvcGVuKTtcbiAgICBhZGRFdmVudCgnY2xpY2snLCAkdG9vbHRpcENsb3NlQnRuLCBjbG9zZSk7XG4gIH1cblxuICBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgY29uc3QgeyB0eXBlIH0gPSBwcm9wcztcbiAgICBjb25zdCBpc1Nob3cgPSBzdGF0ZS5zdGF0ZSA9PT0gJ29wZW4nO1xuICAgIGNvbnN0IGV4cGFuZGVkID0gJHRvb2x0aXBDb250YWluZXIuZ2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJykgPT09ICd0cnVlJztcbiAgICBjb25zdCAkY2xvc2VCdG4gPSAkdGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoJHRvb2x0aXBDbG9zZUJ0bik7XG5cbiAgICAkdG9vbHRpcENvbnRhaW5lci5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCAhZXhwYW5kZWQpO1xuICAgICR0b29sdGlwQ29udGFpbmVyLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCBleHBhbmRlZCk7XG4gICAgaWYgKGlzU2hvdykge1xuICAgICAgaGFuZGxlT3BlbkFuaW1hdGlvbih0eXBlKTtcbiAgICAgICRjbG9zZUJ0bi5mb2N1cygpO1xuICAgIH0gZWxzZSB7XG4gICAgICBoYW5kbGVDbG9zZUFuaW1hdGlvbih0eXBlKTtcbiAgICAgICRjbG9zZUJ0bi5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCAnZmFsc2UnKTtcbiAgICAgICR0b29sdGlwQ29udGFpbmVyLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGhhbmRsZU9wZW5BbmltYXRpb24odHlwZSkge1xuICAgIGNvbnN0IHNldEFuaW1hdGlvbiA9IHsgZHVyYXRpb246IDAsIGRpc3BsYXk6ICdub25lJywgb3BhY2l0eTogMCB9O1xuICAgIGNvbnN0IHNjYWxlID0gcHJvcHMudHJhbnNmb3JtLnNjYWxlLng7XG4gICAgaWYgKHR5cGUgPT09ICdkZWZhdWx0Jykge1xuICAgICAgZ3NhcC50aW1lbGluZSgpLnRvKCR0b29sdGlwQ29udGFpbmVyLCBzZXRBbmltYXRpb24pLnRvKCR0b29sdGlwQ29udGFpbmVyLCB7IGR1cmF0aW9uOiBwcm9wcy5kdXJhdGlvbiwgZGlzcGxheTogJ2Jsb2NrJywgb3BhY2l0eTogMSB9KTtcbiAgICB9XG5cbiAgICBpZiAodHlwZSA9PT0gJ2N1c3RvbScpIHtcbiAgICAgIGdzYXAudGltZWxpbmUoKS50bygkdG9vbHRpcENvbnRhaW5lciwgc2V0QW5pbWF0aW9uKS50bygkdG9vbHRpcENvbnRhaW5lciwgeyBkdXJhdGlvbjogcHJvcHMuZHVyYXRpb24sIHNjYWxlOiAxLCBkaXNwbGF5OiAnYmxvY2snLCBvcGFjaXR5OiAxIH0pO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGhhbmRsZUNsb3NlQW5pbWF0aW9uKHR5cGUpIHtcbiAgICBjb25zdCBzY2FsZSA9IHByb3BzLnRyYW5zZm9ybS5zY2FsZS54O1xuICAgIGlmICh0eXBlID09PSAnZGVmYXVsdCcpIHtcbiAgICAgIGdzYXAudGltZWxpbmUoKS50bygkdG9vbHRpcENvbnRhaW5lciwgeyBkdXJhdGlvbjogcHJvcHMuZHVyYXRpb24sIGRpc3BsYXk6ICdub25lJywgb3BhY2l0eTogMCB9KTtcbiAgICB9XG4gICAgaWYgKHR5cGUgPT09ICdjdXN0b20nKSB7XG4gICAgICBnc2FwLnRpbWVsaW5lKCkudG8oJHRvb2x0aXBDb250YWluZXIsIHsgZHVyYXRpb246IHByb3BzLmR1cmF0aW9uLCBzY2FsZTogc2NhbGUsIGRpc3BsYXk6ICdub25lJywgb3BhY2l0eTogMCB9KTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBvcGVuKCkge1xuICAgIGlmIChzdGF0ZS5zdGF0ZSAhPT0gJ29wZW4nKSB7XG4gICAgICBzZXRTdGF0ZSh7IHN0YXRlOiAnb3BlbicgfSk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gY2xvc2UoKSB7XG4gICAgaWYgKHN0YXRlLnN0YXRlICE9PSAnY2xvc2UnKSB7XG4gICAgICBzZXRTdGF0ZSh7IHN0YXRlOiAnY2xvc2UnIH0pO1xuICAgIH1cbiAgfVxuXG4gIGNvbXBvbmVudCA9IHtcbiAgICBjb3JlOiB7XG4gICAgICBpbml0LFxuICAgICAgZGVzdHJveSxcbiAgICAgIHJlbW92ZUV2ZW50LFxuICAgIH0sXG5cbiAgICB1cGRhdGUsXG4gICAgb3BlbixcbiAgICBjbG9zZSxcbiAgfVxuXG4gIHJldHVybiBjb21wb25lbnQ7XG59XG5cbi8vIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsIGZ1bmN0aW9uICgpIHtcbi8vICAgY29uc3QgJHRvb2x0aXBTZWxlY3RvciA9IGRvY3VtZW50Py5xdWVyeVNlbGVjdG9yQWxsKFwiLmNvbXBvbmVudC10b29sdGlwXCIpO1xuLy8gICAkdG9vbHRpcFNlbGVjdG9yLmZvckVhY2goKHRvb2x0aXApID0+IHtcbi8vICAgICBjb25zdCB0b29sdGlwQ29tcG9uZW50ID0gVG9vbHRpcCgpO1xuLy8gICAgIHRvb2x0aXBDb21wb25lbnQuaW5pdCh0b29sdGlwKTtcbi8vICAgfSk7XG4vLyB9KTtcblxuLy8g6riw7YOAIOyYteyFmOuTpC4uLlxuLy8gZHVyYXRpb246IDMwMCxcbi8vIGhlaWdodDogMjAwLFxuLy8gdHJhbnNmb3JtOiB7XG4vLyAgIHNjYWxlOiB7XG4vLyAgICAgeDogMSxcbi8vICAgICB5OiAxLFxuLy8gICB9LFxuLy8gICB0cmFuc2xhdGU6IHtcbi8vICAgICB4OiAwLFxuLy8gICAgIHk6IDkwLFxuLy8gICB9LFxuLy8gICBkZWxheTogMCxcbi8vICAgZWFzZWluZzogXCJlYXNlLW91dFwiLFxuLy8gfSxcblxuLyoqXG4gKiBTa2VsXG4gKiAvLyBpbml0LCBzZXR1cCwgdXBkYXRlLCBhZGRFdmVudCwgcmVtb3ZlRXZlbnQsIGRlc3Ryb3lcbiAqIC8vIHRlbXBsYXRlLCBzZXR1cFNlbGVjdG9yLCBzZXR1cEVsZW1lbnQsIHNldEV2ZW50LCByZW5kZXIsIGN1c3RvbUZuLCBjYWxsYWJsZVxuICovXG4iLCJcbmV0VUkuY29tcG9uZW50cyA9IHtcblx0QWNjb3JkaW9uLFxuXHREaWFsb2csXG5cdE1vZGFsLFxuXHRTZWxlY3RCb3gsXG5cdFNrZWwsXG5cdFN3aXBlckNvbXAsXG5cdFRhYixcblx0VG9vbHRpcFxufVxuIiwiLy8gaW5pdCBqc1xuZnVuY3Rpb24gaW5pdFVJKCkge1xuICBjb25zdCBjb21wb25lbnRMaXN0ID0gW1xuICAgIHtcbiAgICAgIHNlbGVjdG9yOiBcIi5jb21wb25lbnQtbW9kYWxcIixcbiAgICAgIGZuOiBldFVJLmNvbXBvbmVudHMuTW9kYWwsXG4gICAgfSxcbiAgICB7XG4gICAgICBzZWxlY3RvcjogXCIuY29tcG9uZW50LWFjY29yZGlvblwiLFxuICAgICAgZm46IGV0VUkuY29tcG9uZW50cy5BY2NvcmRpb24sXG4gICAgfSxcbiAgICB7XG4gICAgICBzZWxlY3RvcjogXCIuY29tcG9uZW50LXRvb2x0aXBcIixcbiAgICAgIGZuOiBldFVJLmNvbXBvbmVudHMuVG9vbHRpcCxcbiAgICB9LFxuICAgIHtcbiAgICAgIHNlbGVjdG9yOiAnW2RhdGEtY29tcG9uZW50PVwidGFiXCJdJyxcbiAgICAgIGZuOiBldFVJLmNvbXBvbmVudHMuVGFiLFxuICAgIH0sXG4gICAge1xuICAgICAgc2VsZWN0b3I6ICdbZGF0YS1jb21wb25lbnQ9XCJzZWxlY3QtYm94XCJdJyxcbiAgICAgIGZuOiBldFVJLmNvbXBvbmVudHMuU2VsZWN0Qm94LFxuICAgIH0sXG4gICAge1xuICAgICAgc2VsZWN0b3I6ICdbZGF0YS1jb21wb25lbnQ9XCJzd2lwZXJcIl0nLFxuICAgICAgZm46IGV0VUkuY29tcG9uZW50cy5Td2lwZXJDb21wLFxuICAgIH0sXG4gIF07XG5cbiAgY29tcG9uZW50TGlzdC5mb3JFYWNoKCh7IHNlbGVjdG9yLCBmbiB9KSA9PiB7XG4gICAgLy8gY29uc29sZS5sb2coZm4pO1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpLmZvckVhY2goKGVsKSA9PiB7XG4gICAgICBpZiAoZWwuZGF0YXNldC5pbml0KSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgY29uc3QgY29tcG9uZW50ID0gbmV3IGZuKCk7XG4gICAgICBjb21wb25lbnQuY29yZS5pbml0KGVsLCB7fSwgc2VsZWN0b3IpO1xuICAgIH0pO1xuICB9KTtcblxuICBldFVJLmRpYWxvZyA9IGV0VUkuaG9va3MudXNlRGlhbG9nKCk7XG59XG5cbmV0VUkuaW5pdFVJID0gaW5pdFVJO1xuXG4oZnVuY3Rpb24gYXV0b0luaXQoKSB7XG4gIGNvbnN0ICRzY3JpcHRCbG9jayA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJbZGF0YS1pbml0XVwiKTtcbiAgaWYgKCRzY3JpcHRCbG9jaykge1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgIGluaXRVSSgpO1xuICAgIH0pO1xuICB9XG59KSgpO1xuIl19

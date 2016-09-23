/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmory imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmory exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		Object.defineProperty(exports, name, {
/******/ 			configurable: false,
/******/ 			enumerable: true,
/******/ 			get: getter
/******/ 		});
/******/ 	};

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 144);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function() {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		var result = [];
		for(var i = 0; i < this.length; i++) {
			var item = this[i];
			if(item[2]) {
				result.push("@media " + item[2] + "{" + item[1] + "}");
			} else {
				result.push(item[1]);
			}
		}
		return result.join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};


/***/ },
/* 1 */
/***/ function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
var stylesInDom = {},
	memoize = function(fn) {
		var memo;
		return function () {
			if (typeof memo === "undefined") memo = fn.apply(this, arguments);
			return memo;
		};
	},
	isOldIE = memoize(function() {
		return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
	}),
	getHeadElement = memoize(function () {
		return document.head || document.getElementsByTagName("head")[0];
	}),
	singletonElement = null,
	singletonCounter = 0,
	styleElementsInsertedAtTop = [];

module.exports = function(list, options) {
	if(typeof DEBUG !== "undefined" && DEBUG) {
		if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};
	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (typeof options.singleton === "undefined") options.singleton = isOldIE();

	// By default, add <style> tags to the bottom of <head>.
	if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

	var styles = listToStyles(list);
	addStylesToDom(styles, options);

	return function update(newList) {
		var mayRemove = [];
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			domStyle.refs--;
			mayRemove.push(domStyle);
		}
		if(newList) {
			var newStyles = listToStyles(newList);
			addStylesToDom(newStyles, options);
		}
		for(var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];
			if(domStyle.refs === 0) {
				for(var j = 0; j < domStyle.parts.length; j++)
					domStyle.parts[j]();
				delete stylesInDom[domStyle.id];
			}
		}
	};
}

function addStylesToDom(styles, options) {
	for(var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];
		if(domStyle) {
			domStyle.refs++;
			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}
			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];
			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}
			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles(list) {
	var styles = [];
	var newStyles = {};
	for(var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};
		if(!newStyles[id])
			styles.push(newStyles[id] = {id: id, parts: [part]});
		else
			newStyles[id].parts.push(part);
	}
	return styles;
}

function insertStyleElement(options, styleElement) {
	var head = getHeadElement();
	var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
	if (options.insertAt === "top") {
		if(!lastStyleElementInsertedAtTop) {
			head.insertBefore(styleElement, head.firstChild);
		} else if(lastStyleElementInsertedAtTop.nextSibling) {
			head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			head.appendChild(styleElement);
		}
		styleElementsInsertedAtTop.push(styleElement);
	} else if (options.insertAt === "bottom") {
		head.appendChild(styleElement);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement(styleElement) {
	styleElement.parentNode.removeChild(styleElement);
	var idx = styleElementsInsertedAtTop.indexOf(styleElement);
	if(idx >= 0) {
		styleElementsInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement(options) {
	var styleElement = document.createElement("style");
	styleElement.type = "text/css";
	insertStyleElement(options, styleElement);
	return styleElement;
}

function createLinkElement(options) {
	var linkElement = document.createElement("link");
	linkElement.rel = "stylesheet";
	insertStyleElement(options, linkElement);
	return linkElement;
}

function addStyle(obj, options) {
	var styleElement, update, remove;

	if (options.singleton) {
		var styleIndex = singletonCounter++;
		styleElement = singletonElement || (singletonElement = createStyleElement(options));
		update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
		remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
	} else if(obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function") {
		styleElement = createLinkElement(options);
		update = updateLink.bind(null, styleElement);
		remove = function() {
			removeStyleElement(styleElement);
			if(styleElement.href)
				URL.revokeObjectURL(styleElement.href);
		};
	} else {
		styleElement = createStyleElement(options);
		update = applyToTag.bind(null, styleElement);
		remove = function() {
			removeStyleElement(styleElement);
		};
	}

	update(obj);

	return function updateStyle(newObj) {
		if(newObj) {
			if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
				return;
			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;
		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag(styleElement, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (styleElement.styleSheet) {
		styleElement.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = styleElement.childNodes;
		if (childNodes[index]) styleElement.removeChild(childNodes[index]);
		if (childNodes.length) {
			styleElement.insertBefore(cssNode, childNodes[index]);
		} else {
			styleElement.appendChild(cssNode);
		}
	}
}

function applyToTag(styleElement, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		styleElement.setAttribute("media", media)
	}

	if(styleElement.styleSheet) {
		styleElement.styleSheet.cssText = css;
	} else {
		while(styleElement.firstChild) {
			styleElement.removeChild(styleElement.firstChild);
		}
		styleElement.appendChild(document.createTextNode(css));
	}
}

function updateLink(linkElement, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	if(sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = linkElement.href;

	linkElement.href = URL.createObjectURL(blob);

	if(oldSrc)
		URL.revokeObjectURL(oldSrc);
}


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__store__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__state__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__getters__ = __webpack_require__(47);
/* harmony reexport (binding) */ __webpack_require__.d(exports, "c", function() { return __WEBPACK_IMPORTED_MODULE_1__state__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(exports, "b", function() { return __WEBPACK_IMPORTED_MODULE_2__getters__["a"]; });

/* harmony reexport (module object) */ __webpack_require__.d(exports, "a", function() { return __WEBPACK_IMPORTED_MODULE_0__store__; });





/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_vue__);
/* harmony export (immutable) */ exports["d"] = getTicket;
/* harmony export (immutable) */ exports["a"] = getCharacters;
/* harmony export (immutable) */ exports["b"] = getFriends;
/* harmony export (immutable) */ exports["c"] = getBookmarks;
/* harmony export (immutable) */ exports["e"] = addBookmark;
/* harmony export (immutable) */ exports["f"] = removeBookmark;
/* harmony export (immutable) */ exports["h"] = getProfileURL;
/* harmony export (immutable) */ exports["g"] = getAvatarURL;
/* harmony export (immutable) */ exports["i"] = getExtendedIcon;



var endpoints = {
  login: 'https://www.f-list.net/json/getApiTicket.php',
  characterList: 'https://www.f-list.net/json/api/character-list.php',
  friendList: 'https://www.f-list.net/json/api/friend-list.php',
  bookmarkList: 'https://www.f-list.net/json/api/bookmark-list.php',
  bookmarkAdd: 'https://www.f-list.net/json/api/bookmark-add.php',
  bookmarkRemove: 'https://www.f-list.net/json/api/bookmark-remove.php'
};

function endpointAction(url, data) {
  return __WEBPACK_IMPORTED_MODULE_0_vue___default.a.http.post(url, data).then(function (res) {
    var data = JSON.parse(res.data);
    return data.error ? Promise.reject(data.error) : Promise.resolve(data);
  });
}

function getTicket(account, password) {
  return endpointAction(endpoints.login, { account: account, password: password }).then(function (data) {
    return data.ticket;
  });
}

function getCharacters(account, ticket) {
  return endpointAction(endpoints.characterList, { account: account, ticket: ticket }).then(function (data) {
    return data.characters;
  });
}

function getFriends(account, ticket) {
  return endpointAction(endpoints.friendList, { account: account, ticket: ticket }).then(function (data) {
    return data.friends.map(function (entry) {
      return { you: entry.source, them: entry.dest };
    });
  });
}

function getBookmarks(account, ticket) {
  return endpointAction(endpoints.bookmarkList, { account: account, ticket: ticket }).then(function (data) {
    return data.characters;
  });
}

function addBookmark(account, ticket, name) {
  return endpointAction(endpoints.bookmarkAdd, { account: account, ticket: ticket, name: name });
}

function removeBookmark(account, ticket, name) {
  return endpointAction(endpoints.bookmarkRemove, { account: account, ticket: ticket, name: name });
}

function getProfileURL(name) {
  var encoded = encodeURI(name.toLowerCase());
  return 'https://www.f-list.net/c/' + encoded;
}

function getAvatarURL(name) {
  var encoded = encodeURI(name.toLowerCase());
  return 'https://static.f-list.net/images/avatar/' + encoded + '.png';
}

function getExtendedIcon(icon) {
  return 'https://static.f-list.net/images/eicon/' + icon + '.gif';
}

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__

/* styles */
__webpack_require__(91)

/* script */
__vue_exports__ = __webpack_require__(24)

/* template */
var __vue_template__ = __webpack_require__(132)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (
  typeof __vue_exports__.default === "object" ||
  typeof __vue_exports__.default === "function"
) {
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}
__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns
__vue_options__._scopeId = "data-v-20"

module.exports = __vue_exports__


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process, global) {'use strict';

/*  */

/**
 * Convert a value to a string that is actually rendered.
 */
function _toString (val) {
  return val == null
    ? ''
    : typeof val === 'object'
      ? JSON.stringify(val, null, 2)
      : String(val)
}

/**
 * Convert a input value to a number for persistence.
 * If the conversion fails, return original string.
 */
function toNumber (val) {
  var n = parseFloat(val, 10)
  return (n || n === 0) ? n : val
}

/**
 * Make a map and return a function for checking if a key
 * is in that map.
 */
function makeMap (
  str,
  expectsLowerCase
) {
  var map = Object.create(null)
  var list = str.split(',')
  for (var i = 0; i < list.length; i++) {
    map[list[i]] = true
  }
  return expectsLowerCase
    ? function (val) { return map[val.toLowerCase()]; }
    : function (val) { return map[val]; }
}

/**
 * Check if a tag is a built-in tag.
 */
var isBuiltInTag = makeMap('slot,component', true)

/**
 * Remove an item from an array
 */
function remove (arr, item) {
  if (arr.length) {
    var index = arr.indexOf(item)
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}

/**
 * Check whether the object has the property.
 */
var hasOwnProperty = Object.prototype.hasOwnProperty
function hasOwn (obj, key) {
  return hasOwnProperty.call(obj, key)
}

/**
 * Check if value is primitive
 */
function isPrimitive (value) {
  return typeof value === 'string' || typeof value === 'number'
}

/**
 * Create a cached version of a pure function.
 */
function cached (fn) {
  var cache = Object.create(null)
  return function cachedFn (str) {
    var hit = cache[str]
    return hit || (cache[str] = fn(str))
  }
}

/**
 * Camelize a hyphen-delmited string.
 */
var camelizeRE = /-(\w)/g
var camelize = cached(function (str) {
  return str.replace(camelizeRE, function (_, c) { return c ? c.toUpperCase() : ''; })
})

/**
 * Capitalize a string.
 */
var capitalize = cached(function (str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
})

/**
 * Hyphenate a camelCase string.
 */
var hyphenateRE = /([^-])([A-Z])/g
var hyphenate = cached(function (str) {
  return str
    .replace(hyphenateRE, '$1-$2')
    .replace(hyphenateRE, '$1-$2')
    .toLowerCase()
})

/**
 * Simple bind, faster than native
 */
function bind (fn, ctx) {
  function boundFn (a) {
    var l = arguments.length
    return l
      ? l > 1
        ? fn.apply(ctx, arguments)
        : fn.call(ctx, a)
      : fn.call(ctx)
  }
  // record original fn length
  boundFn._length = fn.length
  return boundFn
}

/**
 * Convert an Array-like object to a real Array.
 */
function toArray (list, start) {
  start = start || 0
  var i = list.length - start
  var ret = new Array(i)
  while (i--) {
    ret[i] = list[i + start]
  }
  return ret
}

/**
 * Mix properties into target object.
 */
function extend (to, _from) {
  for (var key in _from) {
    to[key] = _from[key]
  }
  return to
}

/**
 * Quick object check - this is primarily used to tell
 * Objects from primitive values when we know the value
 * is a JSON-compliant type.
 */
function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}

/**
 * Strict object type check. Only returns true
 * for plain JavaScript objects.
 */
var toString = Object.prototype.toString
var OBJECT_STRING = '[object Object]'
function isPlainObject (obj) {
  return toString.call(obj) === OBJECT_STRING
}

/**
 * Merge an Array of Objects into a single Object.
 */
function toObject (arr) {
  var res = {}
  for (var i = 0; i < arr.length; i++) {
    if (arr[i]) {
      extend(res, arr[i])
    }
  }
  return res
}

/**
 * Perform no operation.
 */
function noop () {}

/**
 * Always return false.
 */
var no = function () { return false; }

/**
 * Generate a static keys string from compiler modules.
 */
function genStaticKeys (modules) {
  return modules.reduce(function (keys, m) {
    return keys.concat(m.staticKeys || [])
  }, []).join(',')
}

/*  */

var config = {
  /**
   * Option merge strategies (used in core/util/options)
   */
  optionMergeStrategies: Object.create(null),

  /**
   * Whether to suppress warnings.
   */
  silent: false,

  /**
   * Whether to enable devtools
   */
  devtools: process.env.NODE_ENV !== 'production',

  /**
   * Error handler for watcher errors
   */
  errorHandler: null,

  /**
   * Ignore certain custom elements
   */
  ignoredElements: null,

  /**
   * Custom user key aliases for v-on
   */
  keyCodes: Object.create(null),

  /**
   * Check if a tag is reserved so that it cannot be registered as a
   * component. This is platform-dependent and may be overwritten.
   */
  isReservedTag: no,

  /**
   * Check if a tag is an unknown element.
   * Platform-dependent.
   */
  isUnknownElement: no,

  /**
   * Get the namespace of an element
   */
  getTagNamespace: noop,

  /**
   * Check if an attribute must be bound using property, e.g. value
   * Platform-dependent.
   */
  mustUseProp: no,

  /**
   * List of asset types that a component can own.
   */
  _assetTypes: [
    'component',
    'directive',
    'filter'
  ],

  /**
   * List of lifecycle hooks.
   */
  _lifecycleHooks: [
    'beforeCreate',
    'created',
    'beforeMount',
    'mounted',
    'beforeUpdate',
    'updated',
    'beforeDestroy',
    'destroyed',
    'activated',
    'deactivated'
  ],

  /**
   * Max circular updates allowed in a scheduler flush cycle.
   */
  _maxUpdateCount: 100,

  /**
   * Server rendering?
   */
  _isServer: process.env.VUE_ENV === 'server'
}

/*  */

/**
 * Check if a string starts with $ or _
 */
function isReserved (str) {
  var c = (str + '').charCodeAt(0)
  return c === 0x24 || c === 0x5F
}

/**
 * Define a property.
 */
function def (obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  })
}

/**
 * Parse simple path.
 */
var bailRE = /[^\w\.\$]/
function parsePath (path) {
  if (bailRE.test(path)) {
    return
  } else {
    var segments = path.split('.')
    return function (obj) {
      for (var i = 0; i < segments.length; i++) {
        if (!obj) return
        obj = obj[segments[i]]
      }
      return obj
    }
  }
}

/*  */

/* global MutationObserver */
// can we use __proto__?
var hasProto = '__proto__' in {}

// Browser environment sniffing
var inBrowser =
  typeof window !== 'undefined' &&
  Object.prototype.toString.call(window) !== '[object Object]'

// detect devtools
var devtools = inBrowser && window.__VUE_DEVTOOLS_GLOBAL_HOOK__

// UA sniffing for working around browser-specific quirks
var UA = inBrowser && window.navigator.userAgent.toLowerCase()
var isIos = UA && /(iphone|ipad|ipod|ios)/i.test(UA)
var iosVersionMatch = UA && isIos && UA.match(/os ([\d_]+)/)
var iosVersion = iosVersionMatch && iosVersionMatch[1].split('_')

// MutationObserver is unreliable in iOS 9.3 UIWebView
// detecting it by checking presence of IndexedDB
// ref #3027
var hasMutationObserverBug =
  iosVersion &&
  Number(iosVersion[0]) >= 9 &&
  Number(iosVersion[1]) >= 3 &&
  !window.indexedDB

/**
 * Defer a task to execute it asynchronously. Ideally this
 * should be executed as a microtask, so we leverage
 * MutationObserver if it's available, and fallback to
 * setTimeout(0).
 *
 * @param {Function} cb
 * @param {Object} ctx
 */
var nextTick = (function () {
  var callbacks = []
  var pending = false
  var timerFunc
  function nextTickHandler () {
    pending = false
    var copies = callbacks.slice(0)
    callbacks = []
    for (var i = 0; i < copies.length; i++) {
      copies[i]()
    }
  }

  /* istanbul ignore else */
  if (typeof MutationObserver !== 'undefined' && !hasMutationObserverBug) {
    var counter = 1
    var observer = new MutationObserver(nextTickHandler)
    var textNode = document.createTextNode(String(counter))
    observer.observe(textNode, {
      characterData: true
    })
    timerFunc = function () {
      counter = (counter + 1) % 2
      textNode.data = String(counter)
    }
  } else {
    // webpack attempts to inject a shim for setImmediate
    // if it is used as a global, so we have to work around that to
    // avoid bundling unnecessary code.
    var context = inBrowser
      ? window
      : typeof global !== 'undefined' ? global : {}
    timerFunc = context.setImmediate || setTimeout
  }
  return function (cb, ctx) {
    var func = ctx
      ? function () { cb.call(ctx) }
      : cb
    callbacks.push(func)
    if (pending) return
    pending = true
    timerFunc(nextTickHandler, 0)
  }
})()

var _Set
/* istanbul ignore if */
if (typeof Set !== 'undefined' && /native code/.test(Set.toString())) {
  // use native Set when available.
  _Set = Set
} else {
  // a non-standard Set polyfill that only works with primitive keys.
  _Set = (function () {
    function Set () {
      this.set = Object.create(null)
    }
    Set.prototype.has = function has (key) {
      return this.set[key] !== undefined
    };
    Set.prototype.add = function add (key) {
      this.set[key] = 1
    };
    Set.prototype.clear = function clear () {
      this.set = Object.create(null)
    };

    return Set;
  }())
}

/* not type checking this file because flow doesn't play well with Proxy */

var hasProxy;
var proxyHandlers;
var initProxy;
if (process.env.NODE_ENV !== 'production') {
  var allowedGlobals = makeMap(
    'Infinity,undefined,NaN,isFinite,isNaN,' +
    'parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,' +
    'Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,' +
    'require' // for Webpack/Browserify
  )

  hasProxy =
    typeof Proxy !== 'undefined' &&
    Proxy.toString().match(/native code/)

  proxyHandlers = {
    has: function has (target, key) {
      var has = key in target
      var isAllowed = allowedGlobals(key) || key.charAt(0) === '_'
      if (!has && !isAllowed) {
        warn(
          "Property or method \"" + key + "\" is not defined on the instance but " +
          "referenced during render. Make sure to declare reactive data " +
          "properties in the data option.",
          target
        )
      }
      return has || !isAllowed
    }
  }

  initProxy = function initProxy (vm) {
    if (hasProxy) {
      vm._renderProxy = new Proxy(vm, proxyHandlers)
    } else {
      vm._renderProxy = vm
    }
  }
}

/*  */


var uid$2 = 0

/**
 * A dep is an observable that can have multiple
 * directives subscribing to it.
 */
var Dep = function Dep () {
  this.id = uid$2++
  this.subs = []
};

Dep.prototype.addSub = function addSub (sub) {
  this.subs.push(sub)
};

Dep.prototype.removeSub = function removeSub (sub) {
  remove(this.subs, sub)
};

Dep.prototype.depend = function depend () {
  if (Dep.target) {
    Dep.target.addDep(this)
  }
};

Dep.prototype.notify = function notify () {
  // stablize the subscriber list first
  var subs = this.subs.slice()
  for (var i = 0, l = subs.length; i < l; i++) {
    subs[i].update()
  }
};

// the current target watcher being evaluated.
// this is globally unique because there could be only one
// watcher being evaluated at any time.
Dep.target = null
var targetStack = []

function pushTarget (_target) {
  if (Dep.target) targetStack.push(Dep.target)
  Dep.target = _target
}

function popTarget () {
  Dep.target = targetStack.pop()
}

/*  */


var queue = []
var has = {}
var circular = {}
var waiting = false
var flushing = false
var index = 0

/**
 * Reset the scheduler's state.
 */
function resetSchedulerState () {
  queue.length = 0
  has = {}
  if (process.env.NODE_ENV !== 'production') {
    circular = {}
  }
  waiting = flushing = false
}

/**
 * Flush both queues and run the watchers.
 */
function flushSchedulerQueue () {
  flushing = true

  // Sort queue before flush.
  // This ensures that:
  // 1. Components are updated from parent to child. (because parent is always
  //    created before the child)
  // 2. A component's user watchers are run before its render watcher (because
  //    user watchers are created before the render watcher)
  // 3. If a component is destroyed during a parent component's watcher run,
  //    its watchers can be skipped.
  queue.sort(function (a, b) { return a.id - b.id; })

  // do not cache length because more watchers might be pushed
  // as we run existing watchers
  for (index = 0; index < queue.length; index++) {
    var watcher = queue[index]
    var id = watcher.id
    has[id] = null
    watcher.run()
    // in dev build, check and stop circular updates.
    if (process.env.NODE_ENV !== 'production' && has[id] != null) {
      circular[id] = (circular[id] || 0) + 1
      if (circular[id] > config._maxUpdateCount) {
        warn(
          'You may have an infinite update loop ' + (
            watcher.user
              ? ("in watcher with expression \"" + (watcher.expression) + "\"")
              : "in a component render function."
          ),
          watcher.vm
        )
        break
      }
    }
  }

  // devtool hook
  /* istanbul ignore if */
  if (devtools && config.devtools) {
    devtools.emit('flush')
  }

  resetSchedulerState()
}

/**
 * Push a watcher into the watcher queue.
 * Jobs with duplicate IDs will be skipped unless it's
 * pushed when the queue is being flushed.
 */
function queueWatcher (watcher) {
  var id = watcher.id
  if (has[id] == null) {
    has[id] = true
    if (!flushing) {
      queue.push(watcher)
    } else {
      // if already flushing, splice the watcher based on its id
      // if already past its id, it will be run next immediately.
      var i = queue.length - 1
      while (i >= 0 && queue[i].id > watcher.id) {
        i--
      }
      queue.splice(Math.max(i, index) + 1, 0, watcher)
    }
    // queue the flush
    if (!waiting) {
      waiting = true
      nextTick(flushSchedulerQueue)
    }
  }
}

/*  */

var uid$1 = 0

/**
 * A watcher parses an expression, collects dependencies,
 * and fires callback when the expression value changes.
 * This is used for both the $watch() api and directives.
 */
var Watcher = function Watcher (
  vm,
  expOrFn,
  cb,
  options
) {
  if ( options === void 0 ) options = {};

  this.vm = vm
  vm._watchers.push(this)
  // options
  this.deep = !!options.deep
  this.user = !!options.user
  this.lazy = !!options.lazy
  this.sync = !!options.sync
  this.expression = expOrFn.toString()
  this.cb = cb
  this.id = ++uid$1 // uid for batching
  this.active = true
  this.dirty = this.lazy // for lazy watchers
  this.deps = []
  this.newDeps = []
  this.depIds = new _Set()
  this.newDepIds = new _Set()
  // parse expression for getter
  if (typeof expOrFn === 'function') {
    this.getter = expOrFn
  } else {
    this.getter = parsePath(expOrFn)
    if (!this.getter) {
      this.getter = function () {}
      process.env.NODE_ENV !== 'production' && warn(
        "Failed watching path: \"" + expOrFn + "\" " +
        'Watcher only accepts simple dot-delimited paths. ' +
        'For full control, use a function instead.',
        vm
      )
    }
  }
  this.value = this.lazy
    ? undefined
    : this.get()
};

/**
 * Evaluate the getter, and re-collect dependencies.
 */
Watcher.prototype.get = function get () {
  pushTarget(this)
  var value = this.getter.call(this.vm, this.vm)
  // "touch" every property so they are all tracked as
  // dependencies for deep watching
  if (this.deep) {
    traverse(value)
  }
  popTarget()
  this.cleanupDeps()
  return value
};

/**
 * Add a dependency to this directive.
 */
Watcher.prototype.addDep = function addDep (dep) {
  var id = dep.id
  if (!this.newDepIds.has(id)) {
    this.newDepIds.add(id)
    this.newDeps.push(dep)
    if (!this.depIds.has(id)) {
      dep.addSub(this)
    }
  }
};

/**
 * Clean up for dependency collection.
 */
Watcher.prototype.cleanupDeps = function cleanupDeps () {
    var this$1 = this;

  var i = this.deps.length
  while (i--) {
    var dep = this$1.deps[i]
    if (!this$1.newDepIds.has(dep.id)) {
      dep.removeSub(this$1)
    }
  }
  var tmp = this.depIds
  this.depIds = this.newDepIds
  this.newDepIds = tmp
  this.newDepIds.clear()
  tmp = this.deps
  this.deps = this.newDeps
  this.newDeps = tmp
  this.newDeps.length = 0
};

/**
 * Subscriber interface.
 * Will be called when a dependency changes.
 */
Watcher.prototype.update = function update () {
  /* istanbul ignore else */
  if (this.lazy) {
    this.dirty = true
  } else if (this.sync) {
    this.run()
  } else {
    queueWatcher(this)
  }
};

/**
 * Scheduler job interface.
 * Will be called by the scheduler.
 */
Watcher.prototype.run = function run () {
  if (this.active) {
    var value = this.get()
      if (
        value !== this.value ||
      // Deep watchers and watchers on Object/Arrays should fire even
      // when the value is the same, because the value may
      // have mutated.
      isObject(value) ||
      this.deep
    ) {
      // set new value
      var oldValue = this.value
      this.value = value
      if (this.user) {
        try {
          this.cb.call(this.vm, value, oldValue)
        } catch (e) {
          process.env.NODE_ENV !== 'production' && warn(
            ("Error in watcher \"" + (this.expression) + "\""),
            this.vm
          )
          /* istanbul ignore else */
          if (config.errorHandler) {
            config.errorHandler.call(null, e, this.vm)
          } else {
            throw e
          }
        }
      } else {
        this.cb.call(this.vm, value, oldValue)
      }
    }
  }
};

/**
 * Evaluate the value of the watcher.
 * This only gets called for lazy watchers.
 */
Watcher.prototype.evaluate = function evaluate () {
  this.value = this.get()
  this.dirty = false
};

/**
 * Depend on all deps collected by this watcher.
 */
Watcher.prototype.depend = function depend () {
    var this$1 = this;

  var i = this.deps.length
  while (i--) {
    this$1.deps[i].depend()
  }
};

/**
 * Remove self from all dependencies' subcriber list.
 */
Watcher.prototype.teardown = function teardown () {
    var this$1 = this;

  if (this.active) {
    // remove self from vm's watcher list
    // this is a somewhat expensive operation so we skip it
    // if the vm is being destroyed or is performing a v-for
    // re-render (the watcher list is then filtered by v-for).
    if (!this.vm._isBeingDestroyed && !this.vm._vForRemoving) {
      remove(this.vm._watchers, this)
    }
    var i = this.deps.length
    while (i--) {
      this$1.deps[i].removeSub(this$1)
    }
    this.active = false
  }
};

/**
 * Recursively traverse an object to evoke all converted
 * getters, so that every nested property inside the object
 * is collected as a "deep" dependency.
 */
var seenObjects = new _Set()
function traverse (val, seen) {
  var i, keys
  if (!seen) {
    seen = seenObjects
    seen.clear()
  }
  var isA = Array.isArray(val)
  var isO = isObject(val)
  if ((isA || isO) && Object.isExtensible(val)) {
    if (val.__ob__) {
      var depId = val.__ob__.dep.id
      if (seen.has(depId)) {
        return
      } else {
        seen.add(depId)
      }
    }
    if (isA) {
      i = val.length
      while (i--) traverse(val[i], seen)
    } else if (isO) {
      keys = Object.keys(val)
      i = keys.length
      while (i--) traverse(val[keys[i]], seen)
    }
  }
}

/*
 * not type checking this file because flow doesn't play well with
 * dynamically accessing methods on Array prototype
 */

var arrayProto = Array.prototype
var arrayMethods = Object.create(arrayProto)

/**
 * Intercept mutating methods and emit events
 */
;[
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
]
.forEach(function (method) {
  // cache original method
  var original = arrayProto[method]
  def(arrayMethods, method, function mutator () {
    var arguments$1 = arguments;

    // avoid leaking arguments:
    // http://jsperf.com/closure-with-arguments
    var i = arguments.length
    var args = new Array(i)
    while (i--) {
      args[i] = arguments$1[i]
    }
    var result = original.apply(this, args)
    var ob = this.__ob__
    var inserted
    switch (method) {
      case 'push':
        inserted = args
        break
      case 'unshift':
        inserted = args
        break
      case 'splice':
        inserted = args.slice(2)
        break
    }
    if (inserted) ob.observeArray(inserted)
    // notify change
    ob.dep.notify()
    return result
  })
})

/*  */

var arrayKeys = Object.getOwnPropertyNames(arrayMethods)

/**
 * By default, when a reactive property is set, the new value is
 * also converted to become reactive. However when passing down props,
 * we don't want to force conversion because the value may be a nested value
 * under a frozen data structure. Converting it would defeat the optimization.
 */
var observerState = {
  shouldConvert: true,
  isSettingProps: false
}

/**
 * Observer class that are attached to each observed
 * object. Once attached, the observer converts target
 * object's property keys into getter/setters that
 * collect dependencies and dispatches updates.
 */
var Observer = function Observer (value) {
  this.value = value
  this.dep = new Dep()
  this.vmCount = 0
  def(value, '__ob__', this)
  if (Array.isArray(value)) {
    var augment = hasProto
      ? protoAugment
      : copyAugment
    augment(value, arrayMethods, arrayKeys)
    this.observeArray(value)
  } else {
    this.walk(value)
  }
};

/**
 * Walk through each property and convert them into
 * getter/setters. This method should only be called when
 * value type is Object.
 */
Observer.prototype.walk = function walk (obj) {
  var keys = Object.keys(obj)
  for (var i = 0; i < keys.length; i++) {
    defineReactive(obj, keys[i], obj[keys[i]])
  }
};

/**
 * Observe a list of Array items.
 */
Observer.prototype.observeArray = function observeArray (items) {
  for (var i = 0, l = items.length; i < l; i++) {
    observe(items[i])
  }
};

// helpers

/**
 * Augment an target Object or Array by intercepting
 * the prototype chain using __proto__
 */
function protoAugment (target, src) {
  /* eslint-disable no-proto */
  target.__proto__ = src
  /* eslint-enable no-proto */
}

/**
 * Augment an target Object or Array by defining
 * hidden properties.
 *
 * istanbul ignore next
 */
function copyAugment (target, src, keys) {
  for (var i = 0, l = keys.length; i < l; i++) {
    var key = keys[i]
    def(target, key, src[key])
  }
}

/**
 * Attempt to create an observer instance for a value,
 * returns the new observer if successfully observed,
 * or the existing observer if the value already has one.
 */
function observe (value) {
  if (!isObject(value)) {
    return
  }
  var ob
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__
  } else if (
    observerState.shouldConvert &&
    !config._isServer &&
    (Array.isArray(value) || isPlainObject(value)) &&
    Object.isExtensible(value) &&
    !value._isVue
  ) {
    ob = new Observer(value)
  }
  return ob
}

/**
 * Define a reactive property on an Object.
 */
function defineReactive (
  obj,
  key,
  val,
  customSetter
) {
  var dep = new Dep()

  var property = Object.getOwnPropertyDescriptor(obj, key)
  if (property && property.configurable === false) {
    return
  }

  // cater for pre-defined getter/setters
  var getter = property && property.get
  var setter = property && property.set

  var childOb = observe(val)
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      var value = getter ? getter.call(obj) : val
      if (Dep.target) {
        dep.depend()
        if (childOb) {
          childOb.dep.depend()
        }
        if (Array.isArray(value)) {
          for (var e, i = 0, l = value.length; i < l; i++) {
            e = value[i]
            e && e.__ob__ && e.__ob__.dep.depend()
          }
        }
      }
      return value
    },
    set: function reactiveSetter (newVal) {
      var value = getter ? getter.call(obj) : val
      if (newVal === value) {
        return
      }
      if (process.env.NODE_ENV !== 'production' && customSetter) {
        customSetter()
      }
      if (setter) {
        setter.call(obj, newVal)
      } else {
        val = newVal
      }
      childOb = observe(newVal)
      dep.notify()
    }
  })
}

/**
 * Set a property on an object. Adds the new property and
 * triggers change notification if the property doesn't
 * already exist.
 */
function set (obj, key, val) {
  if (Array.isArray(obj)) {
    obj.splice(key, 1, val)
    return val
  }
  if (hasOwn(obj, key)) {
    obj[key] = val
    return
  }
  var ob = obj.__ob__
  if (obj._isVue || (ob && ob.vmCount)) {
    process.env.NODE_ENV !== 'production' && warn(
      'Avoid adding reactive properties to a Vue instance or its root $data ' +
      'at runtime - declare it upfront in the data option.'
    )
    return
  }
  if (!ob) {
    obj[key] = val
    return
  }
  defineReactive(ob.value, key, val)
  ob.dep.notify()
  return val
}

/**
 * Delete a property and trigger change if necessary.
 */
function del (obj, key) {
  var ob = obj.__ob__
  if (obj._isVue || (ob && ob.vmCount)) {
    process.env.NODE_ENV !== 'production' && warn(
      'Avoid deleting properties on a Vue instance or its root $data ' +
      '- just set it to null.'
    )
    return
  }
  if (!hasOwn(obj, key)) {
    return
  }
  delete obj[key]
  if (!ob) {
    return
  }
  ob.dep.notify()
}

/*  */

function initState (vm) {
  vm._watchers = []
  initProps(vm)
  initData(vm)
  initComputed(vm)
  initMethods(vm)
  initWatch(vm)
}

function initProps (vm) {
  var props = vm.$options.props
  var propsData = vm.$options.propsData
  if (props) {
    var keys = vm.$options._propKeys = Object.keys(props)
    var isRoot = !vm.$parent
    // root instance props should be converted
    observerState.shouldConvert = isRoot
    var loop = function ( i ) {
      var key = keys[i]
      /* istanbul ignore else */
      if (process.env.NODE_ENV !== 'production') {
        defineReactive(vm, key, validateProp(key, props, propsData, vm), function () {
          if (vm.$parent && !observerState.isSettingProps) {
            warn(
              "Avoid mutating a prop directly since the value will be " +
              "overwritten whenever the parent component re-renders. " +
              "Instead, use a data or computed property based on the prop's " +
              "value. Prop being mutated: \"" + key + "\"",
              vm
            )
          }
        })
      } else {
        defineReactive(vm, key, validateProp(key, props, propsData, vm))
      }
    };

    for (var i = 0; i < keys.length; i++) loop( i );
    observerState.shouldConvert = true
  }
}

function initData (vm) {
  var data = vm.$options.data
  data = vm._data = typeof data === 'function'
    ? data.call(vm)
    : data || {}
  if (!isPlainObject(data)) {
    data = {}
    process.env.NODE_ENV !== 'production' && warn(
      'data functions should return an object.',
      vm
    )
  }
  // proxy data on instance
  var keys = Object.keys(data)
  var props = vm.$options.props
  var i = keys.length
  while (i--) {
    if (props && hasOwn(props, keys[i])) {
      process.env.NODE_ENV !== 'production' && warn(
        "The data property \"" + (keys[i]) + "\" is already declared as a prop. " +
        "Use prop default value instead.",
        vm
      )
    } else {
      proxy(vm, keys[i])
    }
  }
  // observe data
  observe(data)
  data.__ob__ && data.__ob__.vmCount++
}

var computedSharedDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop
}

function initComputed (vm) {
  var computed = vm.$options.computed
  if (computed) {
    for (var key in computed) {
      var userDef = computed[key]
      if (typeof userDef === 'function') {
        computedSharedDefinition.get = makeComputedGetter(userDef, vm)
        computedSharedDefinition.set = noop
      } else {
        computedSharedDefinition.get = userDef.get
          ? userDef.cache !== false
            ? makeComputedGetter(userDef.get, vm)
            : bind(userDef.get, vm)
          : noop
        computedSharedDefinition.set = userDef.set
          ? bind(userDef.set, vm)
          : noop
      }
      Object.defineProperty(vm, key, computedSharedDefinition)
    }
  }
}

function makeComputedGetter (getter, owner) {
  var watcher = new Watcher(owner, getter, noop, {
    lazy: true
  })
  return function computedGetter () {
    if (watcher.dirty) {
      watcher.evaluate()
    }
    if (Dep.target) {
      watcher.depend()
    }
    return watcher.value
  }
}

function initMethods (vm) {
  var methods = vm.$options.methods
  if (methods) {
    for (var key in methods) {
      if (methods[key] != null) {
        vm[key] = bind(methods[key], vm)
      } else if (process.env.NODE_ENV !== 'production') {
        warn(("Method \"" + key + "\" is undefined in options."), vm)
      }
    }
  }
}

function initWatch (vm) {
  var watch = vm.$options.watch
  if (watch) {
    for (var key in watch) {
      var handler = watch[key]
      if (Array.isArray(handler)) {
        for (var i = 0; i < handler.length; i++) {
          createWatcher(vm, key, handler[i])
        }
      } else {
        createWatcher(vm, key, handler)
      }
    }
  }
}

function createWatcher (vm, key, handler) {
  var options
  if (isPlainObject(handler)) {
    options = handler
    handler = handler.handler
  }
  if (typeof handler === 'string') {
    handler = vm[handler]
  }
  vm.$watch(key, handler, options)
}

function stateMixin (Vue) {
  // flow somehow has problems with directly declared definition object
  // when using Object.defineProperty, so we have to procedurally build up
  // the object here.
  var dataDef = {}
  dataDef.get = function () {
    return this._data
  }
  if (process.env.NODE_ENV !== 'production') {
    dataDef.set = function (newData) {
      warn(
        'Avoid replacing instance root $data. ' +
        'Use nested data properties instead.',
        this
      )
    }
  }
  Object.defineProperty(Vue.prototype, '$data', dataDef)

  Vue.prototype.$set = set
  Vue.prototype.$delete = del

  Vue.prototype.$watch = function (
    expOrFn,
    cb,
    options
  ) {
    var vm = this
    options = options || {}
    options.user = true
    var watcher = new Watcher(vm, expOrFn, cb, options)
    if (options.immediate) {
      cb.call(vm, watcher.value)
    }
    return function unwatchFn () {
      watcher.teardown()
    }
  }
}

function proxy (vm, key) {
  if (!isReserved(key)) {
    Object.defineProperty(vm, key, {
      configurable: true,
      enumerable: true,
      get: function proxyGetter () {
        return vm._data[key]
      },
      set: function proxySetter (val) {
        vm._data[key] = val
      }
    })
  }
}

/*  */

var VNode = function VNode (
  tag,
  data,
  children,
  text,
  elm,
  ns,
  context,
  componentOptions
) {
  this.tag = tag
  this.data = data
  this.children = children
  this.text = text
  this.elm = elm
  this.ns = ns
  this.context = context
  this.key = data && data.key
  this.componentOptions = componentOptions
  this.child = undefined
  this.parent = undefined
  this.raw = false
  this.isStatic = false
  this.isRootInsert = true
  this.isComment = false
  this.isCloned = false
  // apply construct hook.
  // this is applied during render, before patch happens.
  // unlike other hooks, this is applied on both client and server.
  var constructHook = data && data.hook && data.hook.construct
  if (constructHook) {
    constructHook(this)
  }
};

var emptyVNode = function () {
  var node = new VNode()
  node.text = ''
  node.isComment = true
  return node
}

// optimized shallow clone
// used for static nodes and slot nodes because they may be reused across
// multiple renders, cloning them avoids errors when DOM manipulations rely
// on their elm reference.
function cloneVNode (vnode) {
  var cloned = new VNode(
    vnode.tag,
    vnode.data,
    vnode.children,
    vnode.text,
    vnode.elm,
    vnode.ns,
    vnode.context,
    vnode.componentOptions
  )
  cloned.isStatic = vnode.isStatic
  cloned.key = vnode.key
  cloned.isCloned = true
  return cloned
}

function cloneVNodes (vnodes) {
  var res = new Array(vnodes.length)
  for (var i = 0; i < vnodes.length; i++) {
    res[i] = cloneVNode(vnodes[i])
  }
  return res
}

/*  */

function normalizeChildren (
  children,
  ns,
  nestedIndex
) {
  if (isPrimitive(children)) {
    return [createTextVNode(children)]
  }
  if (Array.isArray(children)) {
    var res = []
    for (var i = 0, l = children.length; i < l; i++) {
      var c = children[i]
      var last = res[res.length - 1]
      //  nested
      if (Array.isArray(c)) {
        res.push.apply(res, normalizeChildren(c, ns, i))
      } else if (isPrimitive(c)) {
        if (last && last.text) {
          last.text += String(c)
        } else if (c !== '') {
          // convert primitive to vnode
          res.push(createTextVNode(c))
        }
      } else if (c instanceof VNode) {
        if (c.text && last && last.text) {
          last.text += c.text
        } else {
          // inherit parent namespace
          if (ns) {
            applyNS(c, ns)
          }
          // default key for nested array children (likely generated by v-for)
          if (c.key == null && nestedIndex != null) {
            c.key = "__vlist_" + nestedIndex + "_" + i + "__"
          }
          res.push(c)
        }
      }
    }
    return res
  }
}

function createTextVNode (val) {
  return new VNode(undefined, undefined, undefined, String(val))
}

function applyNS (vnode, ns) {
  if (vnode.tag && !vnode.ns) {
    vnode.ns = ns
    if (vnode.children) {
      for (var i = 0, l = vnode.children.length; i < l; i++) {
        applyNS(vnode.children[i], ns)
      }
    }
  }
}

function getFirstComponentChild (children) {
  return children && children.filter(function (c) { return c && c.componentOptions; })[0]
}

function mergeVNodeHook (def, key, hook) {
  var oldHook = def[key]
  if (oldHook) {
    var injectedHash = def.__injected || (def.__injected = {})
    if (!injectedHash[key]) {
      injectedHash[key] = true
      def[key] = function () {
        oldHook.apply(this, arguments)
        hook.apply(this, arguments)
      }
    }
  } else {
    def[key] = hook
  }
}

function updateListeners (
  on,
  oldOn,
  add,
  remove
) {
  var name, cur, old, fn, event, capture
  for (name in on) {
    cur = on[name]
    old = oldOn[name]
    if (!cur) {
      process.env.NODE_ENV !== 'production' && warn(
        ("Handler for event \"" + name + "\" is undefined.")
      )
    } else if (!old) {
      capture = name.charAt(0) === '!'
      event = capture ? name.slice(1) : name
      if (Array.isArray(cur)) {
        add(event, (cur.invoker = arrInvoker(cur)), capture)
      } else {
        if (!cur.invoker) {
          fn = cur
          cur = on[name] = {}
          cur.fn = fn
          cur.invoker = fnInvoker(cur)
        }
        add(event, cur.invoker, capture)
      }
    } else if (cur !== old) {
      if (Array.isArray(old)) {
        old.length = cur.length
        for (var i = 0; i < old.length; i++) old[i] = cur[i]
        on[name] = old
      } else {
        old.fn = cur
        on[name] = old
      }
    }
  }
  for (name in oldOn) {
    if (!on[name]) {
      event = name.charAt(0) === '!' ? name.slice(1) : name
      remove(event, oldOn[name].invoker)
    }
  }
}

function arrInvoker (arr) {
  return function (ev) {
    var arguments$1 = arguments;

    var single = arguments.length === 1
    for (var i = 0; i < arr.length; i++) {
      single ? arr[i](ev) : arr[i].apply(null, arguments$1)
    }
  }
}

function fnInvoker (o) {
  return function (ev) {
    var single = arguments.length === 1
    single ? o.fn(ev) : o.fn.apply(null, arguments)
  }
}

/*  */

var activeInstance = null

function initLifecycle (vm) {
  var options = vm.$options

  // locate first non-abstract parent
  var parent = options.parent
  if (parent && !options.abstract) {
    while (parent.$options.abstract && parent.$parent) {
      parent = parent.$parent
    }
    parent.$children.push(vm)
  }

  vm.$parent = parent
  vm.$root = parent ? parent.$root : vm

  vm.$children = []
  vm.$refs = {}

  vm._watcher = null
  vm._inactive = false
  vm._isMounted = false
  vm._isDestroyed = false
  vm._isBeingDestroyed = false
}

function lifecycleMixin (Vue) {
  Vue.prototype._mount = function (
    el,
    hydrating
  ) {
    var vm = this
    vm.$el = el
    if (!vm.$options.render) {
      vm.$options.render = emptyVNode
      if (process.env.NODE_ENV !== 'production') {
        /* istanbul ignore if */
        if (vm.$options.template) {
          warn(
            'You are using the runtime-only build of Vue where the template ' +
            'option is not available. Either pre-compile the templates into ' +
            'render functions, or use the compiler-included build.',
            vm
          )
        } else {
          warn(
            'Failed to mount component: template or render function not defined.',
            vm
          )
        }
      }
    }
    callHook(vm, 'beforeMount')
    vm._watcher = new Watcher(vm, function () {
      vm._update(vm._render(), hydrating)
    }, noop)
    hydrating = false
    // root instance, call mounted on self
    // mounted is called for child components in its inserted hook
    if (vm.$root === vm) {
      vm._isMounted = true
      callHook(vm, 'mounted')
    }
    return vm
  }

  Vue.prototype._update = function (vnode, hydrating) {
    var vm = this
    if (vm._isMounted) {
      callHook(vm, 'beforeUpdate')
    }
    var prevEl = vm.$el
    var prevActiveInstance = activeInstance
    activeInstance = vm
    var prevVnode = vm._vnode
    vm._vnode = vnode
    if (!prevVnode) {
      // Vue.prototype.__patch__ is injected in entry points
      // based on the rendering backend used.
      vm.$el = vm.__patch__(vm.$el, vnode, hydrating)
    } else {
      vm.$el = vm.__patch__(prevVnode, vnode)
    }
    activeInstance = prevActiveInstance
    // update __vue__ reference
    if (prevEl) {
      prevEl.__vue__ = null
    }
    if (vm.$el) {
      vm.$el.__vue__ = vm
    }
    // if parent is an HOC, update its $el as well
    if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
      vm.$parent.$el = vm.$el
    }
    if (vm._isMounted) {
      callHook(vm, 'updated')
    }
  }

  Vue.prototype._updateFromParent = function (
    propsData,
    listeners,
    parentVnode,
    renderChildren
  ) {
    var vm = this
    var hasChildren = !!(vm.$options._renderChildren || renderChildren)
    vm.$options._parentVnode = parentVnode
    vm.$options._renderChildren = renderChildren
    // update props
    if (propsData && vm.$options.props) {
      observerState.shouldConvert = false
      if (process.env.NODE_ENV !== 'production') {
        observerState.isSettingProps = true
      }
      var propKeys = vm.$options._propKeys || []
      for (var i = 0; i < propKeys.length; i++) {
        var key = propKeys[i]
        vm[key] = validateProp(key, vm.$options.props, propsData, vm)
      }
      observerState.shouldConvert = true
      if (process.env.NODE_ENV !== 'production') {
        observerState.isSettingProps = false
      }
    }
    // update listeners
    if (listeners) {
      var oldListeners = vm.$options._parentListeners
      vm.$options._parentListeners = listeners
      vm._updateListeners(listeners, oldListeners)
    }
    // resolve slots + force update if has children
    if (hasChildren) {
      vm.$slots = resolveSlots(renderChildren)
      vm.$forceUpdate()
    }
  }

  Vue.prototype.$forceUpdate = function () {
    var vm = this
    if (vm._watcher) {
      vm._watcher.update()
    }
  }

  Vue.prototype.$destroy = function () {
    var vm = this
    if (vm._isBeingDestroyed) {
      return
    }
    callHook(vm, 'beforeDestroy')
    vm._isBeingDestroyed = true
    // remove self from parent
    var parent = vm.$parent
    if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) {
      remove(parent.$children, vm)
    }
    // teardown watchers
    if (vm._watcher) {
      vm._watcher.teardown()
    }
    var i = vm._watchers.length
    while (i--) {
      vm._watchers[i].teardown()
    }
    // remove reference from data ob
    // frozen object may not have observer.
    if (vm._data.__ob__) {
      vm._data.__ob__.vmCount--
    }
    // call the last hook...
    vm._isDestroyed = true
    callHook(vm, 'destroyed')
    // turn off all instance listeners.
    vm.$off()
    // remove __vue__ reference
    if (vm.$el) {
      vm.$el.__vue__ = null
    }
  }
}

function callHook (vm, hook) {
  var handlers = vm.$options[hook]
  if (handlers) {
    for (var i = 0, j = handlers.length; i < j; i++) {
      handlers[i].call(vm)
    }
  }
  vm.$emit('hook:' + hook)
}

/*  */

var hooks = { init: init, prepatch: prepatch, insert: insert, destroy: destroy }
var hooksToMerge = Object.keys(hooks)

function createComponent (
  Ctor,
  data,
  context,
  children,
  tag
) {
  if (!Ctor) {
    return
  }

  if (isObject(Ctor)) {
    Ctor = Vue.extend(Ctor)
  }

  if (typeof Ctor !== 'function') {
    if (process.env.NODE_ENV !== 'production') {
      warn(("Invalid Component definition: " + (String(Ctor))), context)
    }
    return
  }

  // async component
  if (!Ctor.cid) {
    if (Ctor.resolved) {
      Ctor = Ctor.resolved
    } else {
      Ctor = resolveAsyncComponent(Ctor, function () {
        // it's ok to queue this on every render because
        // $forceUpdate is buffered by the scheduler.
        context.$forceUpdate()
      })
      if (!Ctor) {
        // return nothing if this is indeed an async component
        // wait for the callback to trigger parent update.
        return
      }
    }
  }

  data = data || {}

  // extract props
  var propsData = extractProps(data, Ctor)

  // functional component
  if (Ctor.options.functional) {
    return createFunctionalComponent(Ctor, propsData, data, context, children)
  }

  // extract listeners, since these needs to be treated as
  // child component listeners instead of DOM listeners
  var listeners = data.on
  // replace with listeners with .native modifier
  data.on = data.nativeOn

  if (Ctor.options.abstract) {
    // abstract components do not keep anything
    // other than props & listeners
    data = {}
  }

  // merge component management hooks onto the placeholder node
  mergeHooks(data)

  // return a placeholder vnode
  var name = Ctor.options.name || tag
  var vnode = new VNode(
    ("vue-component-" + (Ctor.cid) + (name ? ("-" + name) : '')),
    data, undefined, undefined, undefined, undefined, context,
    { Ctor: Ctor, propsData: propsData, listeners: listeners, tag: tag, children: children }
  )
  return vnode
}

function createFunctionalComponent (
  Ctor,
  propsData,
  data,
  context,
  children
) {
  var props = {}
  var propOptions = Ctor.options.props
  if (propOptions) {
    for (var key in propOptions) {
      props[key] = validateProp(key, propOptions, propsData)
    }
  }
  return Ctor.options.render.call(
    null,
    context.$createElement,
    {
      props: props,
      data: data,
      parent: context,
      children: normalizeChildren(children),
      slots: function () { return resolveSlots(children); }
    }
  )
}

function createComponentInstanceForVnode (
  vnode, // we know it's MountedComponentVNode but flow doesn't
  parent // activeInstance in lifecycle state
) {
  var vnodeComponentOptions = vnode.componentOptions
  var options = {
    _isComponent: true,
    parent: parent,
    propsData: vnodeComponentOptions.propsData,
    _componentTag: vnodeComponentOptions.tag,
    _parentVnode: vnode,
    _parentListeners: vnodeComponentOptions.listeners,
    _renderChildren: vnodeComponentOptions.children
  }
  // check inline-template render functions
  var inlineTemplate = vnode.data.inlineTemplate
  if (inlineTemplate) {
    options.render = inlineTemplate.render
    options.staticRenderFns = inlineTemplate.staticRenderFns
  }
  return new vnodeComponentOptions.Ctor(options)
}

function init (vnode, hydrating) {
  if (!vnode.child || vnode.child._isDestroyed) {
    var child = vnode.child = createComponentInstanceForVnode(vnode, activeInstance)
    child.$mount(hydrating ? vnode.elm : undefined, hydrating)
  }
}

function prepatch (
  oldVnode,
  vnode
) {
  var options = vnode.componentOptions
  var child = vnode.child = oldVnode.child
  child._updateFromParent(
    options.propsData, // updated props
    options.listeners, // updated listeners
    vnode, // new parent vnode
    options.children // new children
  )
}

function insert (vnode) {
  if (!vnode.child._isMounted) {
    vnode.child._isMounted = true
    callHook(vnode.child, 'mounted')
  }
  if (vnode.data.keepAlive) {
    vnode.child._inactive = false
    callHook(vnode.child, 'activated')
  }
}

function destroy (vnode) {
  if (!vnode.child._isDestroyed) {
    if (!vnode.data.keepAlive) {
      vnode.child.$destroy()
    } else {
      vnode.child._inactive = true
      callHook(vnode.child, 'deactivated')
    }
  }
}

function resolveAsyncComponent (
  factory,
  cb
) {
  if (factory.requested) {
    // pool callbacks
    factory.pendingCallbacks.push(cb)
  } else {
    factory.requested = true
    var cbs = factory.pendingCallbacks = [cb]
    var sync = true

    var resolve = function (res) {
      if (isObject(res)) {
        res = Vue.extend(res)
      }
      // cache resolved
      factory.resolved = res
      // invoke callbacks only if this is not a synchronous resolve
      // (async resolves are shimmed as synchronous during SSR)
      if (!sync) {
        for (var i = 0, l = cbs.length; i < l; i++) {
          cbs[i](res)
        }
      }
    }

    var reject = function (reason) {
      process.env.NODE_ENV !== 'production' && warn(
        "Failed to resolve async component: " + (String(factory)) +
        (reason ? ("\nReason: " + reason) : '')
      )
    }

    var res = factory(resolve, reject)

    // handle promise
    if (res && typeof res.then === 'function' && !factory.resolved) {
      res.then(resolve, reject)
    }

    sync = false
    // return in case resolved synchronously
    return factory.resolved
  }
}

function extractProps (data, Ctor) {
  // we are only extrating raw values here.
  // validation and default values are handled in the child
  // component itself.
  var propOptions = Ctor.options.props
  if (!propOptions) {
    return
  }
  var res = {}
  var attrs = data.attrs;
  var props = data.props;
  var domProps = data.domProps;
  if (attrs || props || domProps) {
    for (var key in propOptions) {
      var altKey = hyphenate(key)
      checkProp(res, props, key, altKey, true) ||
      checkProp(res, attrs, key, altKey) ||
      checkProp(res, domProps, key, altKey)
    }
  }
  return res
}

function checkProp (
  res,
  hash,
  key,
  altKey,
  preserve
) {
  if (hash) {
    if (hasOwn(hash, key)) {
      res[key] = hash[key]
      if (!preserve) {
        delete hash[key]
      }
      return true
    } else if (hasOwn(hash, altKey)) {
      res[key] = hash[altKey]
      if (!preserve) {
        delete hash[altKey]
      }
      return true
    }
  }
  return false
}

function mergeHooks (data) {
  if (!data.hook) {
    data.hook = {}
  }
  for (var i = 0; i < hooksToMerge.length; i++) {
    var key = hooksToMerge[i]
    var fromParent = data.hook[key]
    var ours = hooks[key]
    data.hook[key] = fromParent ? mergeHook$1(ours, fromParent) : ours
  }
}

function mergeHook$1 (a, b) {
  // since all hooks have at most two args, use fixed args
  // to avoid having to use fn.apply().
  return function (_, __) {
    a(_, __)
    b(_, __)
  }
}

/*  */

// wrapper function for providing a more flexible interface
// without getting yelled at by flow
function createElement (
  tag,
  data,
  children
) {
  if (data && (Array.isArray(data) || typeof data !== 'object')) {
    children = data
    data = undefined
  }
  // make sure to use real instance instead of proxy as context
  return _createElement(this._self, tag, data, children)
}

function _createElement (
  context,
  tag,
  data,
  children
) {
  if (data && data.__ob__) {
    process.env.NODE_ENV !== 'production' && warn(
      "Avoid using observed data object as vnode data: " + (JSON.stringify(data)) + "\n" +
      'Always create fresh vnode data objects in each render!',
      context
    )
    return
  }
  if (!tag) {
    // in case of component :is set to falsy value
    return emptyVNode()
  }
  if (typeof tag === 'string') {
    var Ctor
    var ns = config.getTagNamespace(tag)
    if (config.isReservedTag(tag)) {
      // platform built-in elements
      return new VNode(
        tag, data, normalizeChildren(children, ns),
        undefined, undefined, ns, context
      )
    } else if ((Ctor = resolveAsset(context.$options, 'components', tag))) {
      // component
      return createComponent(Ctor, data, context, children, tag)
    } else {
      // unknown or unlisted namespaced elements
      // check at runtime because it may get assigned a namespace when its
      // parent normalizes children
      return new VNode(
        tag, data, normalizeChildren(children, ns),
        undefined, undefined, ns, context
      )
    }
  } else {
    // direct component options / constructor
    return createComponent(tag, data, context, children)
  }
}

/*  */

function initRender (vm) {
  vm.$vnode = null // the placeholder node in parent tree
  vm._vnode = null // the root of the child tree
  vm._staticTrees = null
  vm.$slots = resolveSlots(vm.$options._renderChildren)
  // bind the public createElement fn to this instance
  // so that we get proper render context inside it.
  vm.$createElement = bind(createElement, vm)
  if (vm.$options.el) {
    vm.$mount(vm.$options.el)
  }
}

function renderMixin (Vue) {
  Vue.prototype.$nextTick = function (fn) {
    nextTick(fn, this)
  }

  Vue.prototype._render = function () {
    var vm = this
    var ref = vm.$options;
    var render = ref.render;
    var staticRenderFns = ref.staticRenderFns;
    var _parentVnode = ref._parentVnode;

    if (vm._isMounted) {
      // clone slot nodes on re-renders
      for (var key in vm.$slots) {
        vm.$slots[key] = cloneVNodes(vm.$slots[key])
      }
    }

    if (staticRenderFns && !vm._staticTrees) {
      vm._staticTrees = []
    }
    // set parent vnode. this allows render functions to have access
    // to the data on the placeholder node.
    vm.$vnode = _parentVnode
    // render self
    var vnode
    try {
      vnode = render.call(vm._renderProxy, vm.$createElement)
    } catch (e) {
      if (process.env.NODE_ENV !== 'production') {
        warn(("Error when rendering " + (formatComponentName(vm)) + ":"))
      }
      /* istanbul ignore else */
      if (config.errorHandler) {
        config.errorHandler.call(null, e, vm)
      } else {
        if (config._isServer) {
          throw e
        } else {
          setTimeout(function () { throw e }, 0)
        }
      }
      // return previous vnode to prevent render error causing blank component
      vnode = vm._vnode
    }
    // return empty vnode in case the render function errored out
    if (!(vnode instanceof VNode)) {
      if (process.env.NODE_ENV !== 'production' && Array.isArray(vnode)) {
        warn(
          'Multiple root nodes returned from render function. Render function ' +
          'should return a single root node.',
          vm
        )
      }
      vnode = emptyVNode()
    }
    // set parent
    vnode.parent = _parentVnode
    return vnode
  }

  // shorthands used in render functions
  Vue.prototype._h = createElement
  // toString for mustaches
  Vue.prototype._s = _toString
  // number conversion
  Vue.prototype._n = toNumber
  // empty vnode
  Vue.prototype._e = emptyVNode

  // render static tree by index
  Vue.prototype._m = function renderStatic (
    index,
    isInFor
  ) {
    var tree = this._staticTrees[index]
    // if has already-rendered static tree and not inside v-for,
    // we can reuse the same tree by doing a shallow clone.
    if (tree && !isInFor) {
      return Array.isArray(tree)
        ? cloneVNodes(tree)
        : cloneVNode(tree)
    }
    // otherwise, render a fresh tree.
    tree = this._staticTrees[index] = this.$options.staticRenderFns[index].call(this._renderProxy)
    if (Array.isArray(tree)) {
      for (var i = 0; i < tree.length; i++) {
        tree[i].isStatic = true
        tree[i].key = "__static__" + index + "_" + i
      }
    } else {
      tree.isStatic = true
      tree.key = "__static__" + index
    }
    return tree
  }

  // filter resolution helper
  var identity = function (_) { return _; }
  Vue.prototype._f = function resolveFilter (id) {
    return resolveAsset(this.$options, 'filters', id, true) || identity
  }

  // render v-for
  Vue.prototype._l = function renderList (
    val,
    render
  ) {
    var ret, i, l, keys, key
    if (Array.isArray(val)) {
      ret = new Array(val.length)
      for (i = 0, l = val.length; i < l; i++) {
        ret[i] = render(val[i], i)
      }
    } else if (typeof val === 'number') {
      ret = new Array(val)
      for (i = 0; i < val; i++) {
        ret[i] = render(i + 1, i)
      }
    } else if (isObject(val)) {
      keys = Object.keys(val)
      ret = new Array(keys.length)
      for (i = 0, l = keys.length; i < l; i++) {
        key = keys[i]
        ret[i] = render(val[key], key, i)
      }
    }
    return ret
  }

  // renderSlot
  Vue.prototype._t = function (
    name,
    fallback
  ) {
    var slotNodes = this.$slots[name]
    // warn duplicate slot usage
    if (slotNodes && process.env.NODE_ENV !== 'production') {
      slotNodes._rendered && warn(
        "Duplicate presence of slot \"" + name + "\" found in the same render tree " +
        "- this will likely cause render errors.",
        this
      )
      slotNodes._rendered = true
    }
    return slotNodes || fallback
  }

  // apply v-bind object
  Vue.prototype._b = function bindProps (
    vnode,
    value,
    asProp) {
    if (value) {
      if (!isObject(value)) {
        process.env.NODE_ENV !== 'production' && warn(
          'v-bind without argument expects an Object or Array value',
          this
        )
      } else {
        if (Array.isArray(value)) {
          value = toObject(value)
        }
        var data = vnode.data
        for (var key in value) {
          if (key === 'class' || key === 'style') {
            data[key] = value[key]
          } else {
            var hash = asProp || config.mustUseProp(key)
              ? data.domProps || (data.domProps = {})
              : data.attrs || (data.attrs = {})
            hash[key] = value[key]
          }
        }
      }
    }
  }

  // expose v-on keyCodes
  Vue.prototype._k = function getKeyCodes (key) {
    return config.keyCodes[key]
  }
}

function resolveSlots (
  renderChildren
) {
  var slots = {}
  if (!renderChildren) {
    return slots
  }
  var children = normalizeChildren(renderChildren) || []
  var defaultSlot = []
  var name, child
  for (var i = 0, l = children.length; i < l; i++) {
    child = children[i]
    if (child.data && (name = child.data.slot)) {
      delete child.data.slot
      var slot = (slots[name] || (slots[name] = []))
      if (child.tag === 'template') {
        slot.push.apply(slot, child.children)
      } else {
        slot.push(child)
      }
    } else {
      defaultSlot.push(child)
    }
  }
  // ignore single whitespace
  if (defaultSlot.length && !(
    defaultSlot.length === 1 &&
    (defaultSlot[0].text === ' ' || defaultSlot[0].isComment)
  )) {
    slots.default = defaultSlot
  }
  return slots
}

/*  */

function initEvents (vm) {
  vm._events = Object.create(null)
  // init parent attached events
  var listeners = vm.$options._parentListeners
  var on = bind(vm.$on, vm)
  var off = bind(vm.$off, vm)
  vm._updateListeners = function (listeners, oldListeners) {
    updateListeners(listeners, oldListeners || {}, on, off)
  }
  if (listeners) {
    vm._updateListeners(listeners)
  }
}

function eventsMixin (Vue) {
  Vue.prototype.$on = function (event, fn) {
    var vm = this
    ;(vm._events[event] || (vm._events[event] = [])).push(fn)
    return vm
  }

  Vue.prototype.$once = function (event, fn) {
    var vm = this
    function on () {
      vm.$off(event, on)
      fn.apply(vm, arguments)
    }
    on.fn = fn
    vm.$on(event, on)
    return vm
  }

  Vue.prototype.$off = function (event, fn) {
    var vm = this
    // all
    if (!arguments.length) {
      vm._events = Object.create(null)
      return vm
    }
    // specific event
    var cbs = vm._events[event]
    if (!cbs) {
      return vm
    }
    if (arguments.length === 1) {
      vm._events[event] = null
      return vm
    }
    // specific handler
    var cb
    var i = cbs.length
    while (i--) {
      cb = cbs[i]
      if (cb === fn || cb.fn === fn) {
        cbs.splice(i, 1)
        break
      }
    }
    return vm
  }

  Vue.prototype.$emit = function (event) {
    var vm = this
    var cbs = vm._events[event]
    if (cbs) {
      cbs = cbs.length > 1 ? toArray(cbs) : cbs
      var args = toArray(arguments, 1)
      for (var i = 0, l = cbs.length; i < l; i++) {
        cbs[i].apply(vm, args)
      }
    }
    return vm
  }
}

/*  */

var uid = 0

function initMixin (Vue) {
  Vue.prototype._init = function (options) {
    var vm = this
    // a uid
    vm._uid = uid++
    // a flag to avoid this being observed
    vm._isVue = true
    // merge options
    if (options && options._isComponent) {
      // optimize internal component instantiation
      // since dynamic options merging is pretty slow, and none of the
      // internal component options needs special treatment.
      initInternalComponent(vm, options)
    } else {
      vm.$options = mergeOptions(
        resolveConstructorOptions(vm),
        options || {},
        vm
      )
    }
    /* istanbul ignore else */
    if (process.env.NODE_ENV !== 'production') {
      initProxy(vm)
    } else {
      vm._renderProxy = vm
    }
    // expose real self
    vm._self = vm
    initLifecycle(vm)
    initEvents(vm)
    callHook(vm, 'beforeCreate')
    initState(vm)
    callHook(vm, 'created')
    initRender(vm)
  }

  function initInternalComponent (vm, options) {
    var opts = vm.$options = Object.create(resolveConstructorOptions(vm))
    // doing this because it's faster than dynamic enumeration.
    opts.parent = options.parent
    opts.propsData = options.propsData
    opts._parentVnode = options._parentVnode
    opts._parentListeners = options._parentListeners
    opts._renderChildren = options._renderChildren
    opts._componentTag = options._componentTag
    if (options.render) {
      opts.render = options.render
      opts.staticRenderFns = options.staticRenderFns
    }
  }

  function resolveConstructorOptions (vm) {
    var Ctor = vm.constructor
    var options = Ctor.options
    if (Ctor.super) {
      var superOptions = Ctor.super.options
      var cachedSuperOptions = Ctor.superOptions
      if (superOptions !== cachedSuperOptions) {
        // super option changed
        Ctor.superOptions = superOptions
        options = Ctor.options = mergeOptions(superOptions, Ctor.extendOptions)
        if (options.name) {
          options.components[options.name] = Ctor
        }
      }
    }
    return options
  }
}

function Vue (options) {
  this._init(options)
}

initMixin(Vue)
stateMixin(Vue)
eventsMixin(Vue)
lifecycleMixin(Vue)
renderMixin(Vue)

var warn
var formatComponentName

if (process.env.NODE_ENV !== 'production') {
  var hasConsole = typeof console !== 'undefined'

  warn = function (msg, vm) {
    if (hasConsole && (!config.silent)) {
      console.error("[Vue warn]: " + msg + " " + (
        vm ? formatLocation(formatComponentName(vm)) : ''
      ))
    }
  }

  formatComponentName = function (vm) {
    if (vm.$root === vm) {
      return 'root instance'
    }
    var name = vm._isVue
      ? vm.$options.name || vm.$options._componentTag
      : vm.name
    return name ? ("component <" + name + ">") : "anonymous component"
  }

  var formatLocation = function (str) {
    if (str === 'anonymous component') {
      str += " - use the \"name\" option for better debugging messages."
    }
    return ("(found in " + str + ")")
  }
}

/*  */

/**
 * Option overwriting strategies are functions that handle
 * how to merge a parent option value and a child option
 * value into the final value.
 */
var strats = config.optionMergeStrategies

/**
 * Options with restrictions
 */
if (process.env.NODE_ENV !== 'production') {
  strats.el = strats.propsData = function (parent, child, vm, key) {
    if (!vm) {
      warn(
        "option \"" + key + "\" can only be used during instance " +
        'creation with the `new` keyword.'
      )
    }
    return defaultStrat(parent, child)
  }

  strats.name = function (parent, child, vm) {
    if (vm && child) {
      warn(
        'options "name" can only be used as a component definition option, ' +
        'not during instance creation.'
      )
    }
    return defaultStrat(parent, child)
  }
}

/**
 * Helper that recursively merges two data objects together.
 */
function mergeData (to, from) {
  var key, toVal, fromVal
  for (key in from) {
    toVal = to[key]
    fromVal = from[key]
    if (!hasOwn(to, key)) {
      set(to, key, fromVal)
    } else if (isObject(toVal) && isObject(fromVal)) {
      mergeData(toVal, fromVal)
    }
  }
  return to
}

/**
 * Data
 */
strats.data = function (
  parentVal,
  childVal,
  vm
) {
  if (!vm) {
    // in a Vue.extend merge, both should be functions
    if (!childVal) {
      return parentVal
    }
    if (typeof childVal !== 'function') {
      process.env.NODE_ENV !== 'production' && warn(
        'The "data" option should be a function ' +
        'that returns a per-instance value in component ' +
        'definitions.',
        vm
      )
      return parentVal
    }
    if (!parentVal) {
      return childVal
    }
    // when parentVal & childVal are both present,
    // we need to return a function that returns the
    // merged result of both functions... no need to
    // check if parentVal is a function here because
    // it has to be a function to pass previous merges.
    return function mergedDataFn () {
      return mergeData(
        childVal.call(this),
        parentVal.call(this)
      )
    }
  } else if (parentVal || childVal) {
    return function mergedInstanceDataFn () {
      // instance merge
      var instanceData = typeof childVal === 'function'
        ? childVal.call(vm)
        : childVal
      var defaultData = typeof parentVal === 'function'
        ? parentVal.call(vm)
        : undefined
      if (instanceData) {
        return mergeData(instanceData, defaultData)
      } else {
        return defaultData
      }
    }
  }
}

/**
 * Hooks and param attributes are merged as arrays.
 */
function mergeHook (
  parentVal,
  childVal
) {
  return childVal
    ? parentVal
      ? parentVal.concat(childVal)
      : Array.isArray(childVal)
        ? childVal
        : [childVal]
    : parentVal
}

config._lifecycleHooks.forEach(function (hook) {
  strats[hook] = mergeHook
})

/**
 * Assets
 *
 * When a vm is present (instance creation), we need to do
 * a three-way merge between constructor options, instance
 * options and parent options.
 */
function mergeAssets (parentVal, childVal) {
  var res = Object.create(parentVal || null)
  return childVal
    ? extend(res, childVal)
    : res
}

config._assetTypes.forEach(function (type) {
  strats[type + 's'] = mergeAssets
})

/**
 * Watchers.
 *
 * Watchers hashes should not overwrite one
 * another, so we merge them as arrays.
 */
strats.watch = function (parentVal, childVal) {
  /* istanbul ignore if */
  if (!childVal) return parentVal
  if (!parentVal) return childVal
  var ret = {}
  extend(ret, parentVal)
  for (var key in childVal) {
    var parent = ret[key]
    var child = childVal[key]
    if (parent && !Array.isArray(parent)) {
      parent = [parent]
    }
    ret[key] = parent
      ? parent.concat(child)
      : [child]
  }
  return ret
}

/**
 * Other object hashes.
 */
strats.props =
strats.methods =
strats.computed = function (parentVal, childVal) {
  if (!childVal) return parentVal
  if (!parentVal) return childVal
  var ret = Object.create(null)
  extend(ret, parentVal)
  extend(ret, childVal)
  return ret
}

/**
 * Default strategy.
 */
var defaultStrat = function (parentVal, childVal) {
  return childVal === undefined
    ? parentVal
    : childVal
}

/**
 * Make sure component options get converted to actual
 * constructors.
 */
function normalizeComponents (options) {
  if (options.components) {
    var components = options.components
    var def
    for (var key in components) {
      var lower = key.toLowerCase()
      if (isBuiltInTag(lower) || config.isReservedTag(lower)) {
        process.env.NODE_ENV !== 'production' && warn(
          'Do not use built-in or reserved HTML elements as component ' +
          'id: ' + key
        )
        continue
      }
      def = components[key]
      if (isPlainObject(def)) {
        components[key] = Vue.extend(def)
      }
    }
  }
}

/**
 * Ensure all props option syntax are normalized into the
 * Object-based format.
 */
function normalizeProps (options) {
  var props = options.props
  if (!props) return
  var res = {}
  var i, val, name
  if (Array.isArray(props)) {
    i = props.length
    while (i--) {
      val = props[i]
      if (typeof val === 'string') {
        name = camelize(val)
        res[name] = { type: null }
      } else if (process.env.NODE_ENV !== 'production') {
        warn('props must be strings when using array syntax.')
      }
    }
  } else if (isPlainObject(props)) {
    for (var key in props) {
      val = props[key]
      name = camelize(key)
      res[name] = isPlainObject(val)
        ? val
        : { type: val }
    }
  }
  options.props = res
}

/**
 * Normalize raw function directives into object format.
 */
function normalizeDirectives (options) {
  var dirs = options.directives
  if (dirs) {
    for (var key in dirs) {
      var def = dirs[key]
      if (typeof def === 'function') {
        dirs[key] = { bind: def, update: def }
      }
    }
  }
}

/**
 * Merge two option objects into a new one.
 * Core utility used in both instantiation and inheritance.
 */
function mergeOptions (
  parent,
  child,
  vm
) {
  normalizeComponents(child)
  normalizeProps(child)
  normalizeDirectives(child)
  var extendsFrom = child.extends
  if (extendsFrom) {
    parent = typeof extendsFrom === 'function'
      ? mergeOptions(parent, extendsFrom.options, vm)
      : mergeOptions(parent, extendsFrom, vm)
  }
  if (child.mixins) {
    for (var i = 0, l = child.mixins.length; i < l; i++) {
      var mixin = child.mixins[i]
      if (mixin.prototype instanceof Vue) {
        mixin = mixin.options
      }
      parent = mergeOptions(parent, mixin, vm)
    }
  }
  var options = {}
  var key
  for (key in parent) {
    mergeField(key)
  }
  for (key in child) {
    if (!hasOwn(parent, key)) {
      mergeField(key)
    }
  }
  function mergeField (key) {
    var strat = strats[key] || defaultStrat
    options[key] = strat(parent[key], child[key], vm, key)
  }
  return options
}

/**
 * Resolve an asset.
 * This function is used because child instances need access
 * to assets defined in its ancestor chain.
 */
function resolveAsset (
  options,
  type,
  id,
  warnMissing
) {
  /* istanbul ignore if */
  if (typeof id !== 'string') {
    return
  }
  var assets = options[type]
  var res = assets[id] ||
    // camelCase ID
    assets[camelize(id)] ||
    // Pascal Case ID
    assets[capitalize(camelize(id))]
  if (process.env.NODE_ENV !== 'production' && warnMissing && !res) {
    warn(
      'Failed to resolve ' + type.slice(0, -1) + ': ' + id,
      options
    )
  }
  return res
}

/*  */

function validateProp (
  key,
  propOptions,
  propsData,
  vm
) {
  /* istanbul ignore if */
  if (!propsData) return
  var prop = propOptions[key]
  var absent = !hasOwn(propsData, key)
  var value = propsData[key]
  // handle boolean props
  if (getType(prop.type) === 'Boolean') {
    if (absent && !hasOwn(prop, 'default')) {
      value = false
    } else if (value === '' || value === hyphenate(key)) {
      value = true
    }
  }
  // check default value
  if (value === undefined) {
    value = getPropDefaultValue(vm, prop, key)
    // since the default value is a fresh copy,
    // make sure to observe it.
    var prevShouldConvert = observerState.shouldConvert
    observerState.shouldConvert = true
    observe(value)
    observerState.shouldConvert = prevShouldConvert
  }
  if (process.env.NODE_ENV !== 'production') {
    assertProp(prop, key, value, vm, absent)
  }
  return value
}

/**
 * Get the default value of a prop.
 */
function getPropDefaultValue (vm, prop, name) {
  // no default, return undefined
  if (!hasOwn(prop, 'default')) {
    return undefined
  }
  var def = prop.default
  // warn against non-factory defaults for Object & Array
  if (isObject(def)) {
    process.env.NODE_ENV !== 'production' && warn(
      'Invalid default value for prop "' + name + '": ' +
      'Props with type Object/Array must use a factory function ' +
      'to return the default value.',
      vm
    )
  }
  // call factory function for non-Function types
  return typeof def === 'function' && prop.type !== Function
    ? def.call(vm)
    : def
}

/**
 * Assert whether a prop is valid.
 */
function assertProp (
  prop,
  name,
  value,
  vm,
  absent
) {
  if (prop.required && absent) {
    warn(
      'Missing required prop: "' + name + '"',
      vm
    )
    return
  }
  if (value == null && !prop.required) {
    return
  }
  var type = prop.type
  var valid = !type || type === true
  var expectedTypes = []
  if (type) {
    if (!Array.isArray(type)) {
      type = [type]
    }
    for (var i = 0; i < type.length && !valid; i++) {
      var assertedType = assertType(value, type[i])
      expectedTypes.push(assertedType.expectedType)
      valid = assertedType.valid
    }
  }
  if (!valid) {
    warn(
      'Invalid prop: type check failed for prop "' + name + '".' +
      ' Expected ' + expectedTypes.map(capitalize).join(', ') +
      ', got ' + Object.prototype.toString.call(value).slice(8, -1) + '.',
      vm
    )
    return
  }
  var validator = prop.validator
  if (validator) {
    if (!validator(value)) {
      warn(
        'Invalid prop: custom validator check failed for prop "' + name + '".',
        vm
      )
    }
  }
}

/**
 * Assert the type of a value
 */
function assertType (value, type) {
  var valid
  var expectedType = getType(type)
  if (expectedType === 'String') {
    valid = typeof value === (expectedType = 'string')
  } else if (expectedType === 'Number') {
    valid = typeof value === (expectedType = 'number')
  } else if (expectedType === 'Boolean') {
    valid = typeof value === (expectedType = 'boolean')
  } else if (expectedType === 'Function') {
    valid = typeof value === (expectedType = 'function')
  } else if (expectedType === 'Object') {
    valid = isPlainObject(value)
  } else if (expectedType === 'Array') {
    valid = Array.isArray(value)
  } else {
    valid = value instanceof type
  }
  return {
    valid: valid,
    expectedType: expectedType
  }
}

/**
 * Use function string name to check built-in types,
 * because a simple equality check will fail when running
 * across different vms / iframes.
 */
function getType (fn) {
  var match = fn && fn.toString().match(/^\s*function (\w+)/)
  return match && match[1]
}



var util = Object.freeze({
	defineReactive: defineReactive,
	_toString: _toString,
	toNumber: toNumber,
	makeMap: makeMap,
	isBuiltInTag: isBuiltInTag,
	remove: remove,
	hasOwn: hasOwn,
	isPrimitive: isPrimitive,
	cached: cached,
	camelize: camelize,
	capitalize: capitalize,
	hyphenate: hyphenate,
	bind: bind,
	toArray: toArray,
	extend: extend,
	isObject: isObject,
	isPlainObject: isPlainObject,
	toObject: toObject,
	noop: noop,
	no: no,
	genStaticKeys: genStaticKeys,
	isReserved: isReserved,
	def: def,
	parsePath: parsePath,
	hasProto: hasProto,
	inBrowser: inBrowser,
	devtools: devtools,
	UA: UA,
	nextTick: nextTick,
	get _Set () { return _Set; },
	mergeOptions: mergeOptions,
	resolveAsset: resolveAsset,
	get warn () { return warn; },
	get formatComponentName () { return formatComponentName; },
	validateProp: validateProp
});

/*  */

function initUse (Vue) {
  Vue.use = function (plugin) {
    /* istanbul ignore if */
    if (plugin.installed) {
      return
    }
    // additional parameters
    var args = toArray(arguments, 1)
    args.unshift(this)
    if (typeof plugin.install === 'function') {
      plugin.install.apply(plugin, args)
    } else {
      plugin.apply(null, args)
    }
    plugin.installed = true
    return this
  }
}

/*  */

function initMixin$1 (Vue) {
  Vue.mixin = function (mixin) {
    Vue.options = mergeOptions(Vue.options, mixin)
  }
}

/*  */

function initExtend (Vue) {
  /**
   * Each instance constructor, including Vue, has a unique
   * cid. This enables us to create wrapped "child
   * constructors" for prototypal inheritance and cache them.
   */
  Vue.cid = 0
  var cid = 1

  /**
   * Class inheritance
   */
  Vue.extend = function (extendOptions) {
    extendOptions = extendOptions || {}
    var Super = this
    var isFirstExtend = Super.cid === 0
    if (isFirstExtend && extendOptions._Ctor) {
      return extendOptions._Ctor
    }
    var name = extendOptions.name || Super.options.name
    if (process.env.NODE_ENV !== 'production') {
      if (!/^[a-zA-Z][\w-]*$/.test(name)) {
        warn(
          'Invalid component name: "' + name + '". Component names ' +
          'can only contain alphanumeric characaters and the hyphen.'
        )
        name = null
      }
    }
    var Sub = function VueComponent (options) {
      this._init(options)
    }
    Sub.prototype = Object.create(Super.prototype)
    Sub.prototype.constructor = Sub
    Sub.cid = cid++
    Sub.options = mergeOptions(
      Super.options,
      extendOptions
    )
    Sub['super'] = Super
    // allow further extension
    Sub.extend = Super.extend
    // create asset registers, so extended classes
    // can have their private assets too.
    config._assetTypes.forEach(function (type) {
      Sub[type] = Super[type]
    })
    // enable recursive self-lookup
    if (name) {
      Sub.options.components[name] = Sub
    }
    // keep a reference to the super options at extension time.
    // later at instantiation we can check if Super's options have
    // been updated.
    Sub.superOptions = Super.options
    Sub.extendOptions = extendOptions
    // cache constructor
    if (isFirstExtend) {
      extendOptions._Ctor = Sub
    }
    return Sub
  }
}

/*  */

function initAssetRegisters (Vue) {
  /**
   * Create asset registration methods.
   */
  config._assetTypes.forEach(function (type) {
    Vue[type] = function (
      id,
      definition
    ) {
      if (!definition) {
        return this.options[type + 's'][id]
      } else {
        /* istanbul ignore if */
        if (process.env.NODE_ENV !== 'production') {
          if (type === 'component' && config.isReservedTag(id)) {
            warn(
              'Do not use built-in or reserved HTML elements as component ' +
              'id: ' + id
            )
          }
        }
        if (type === 'component' && isPlainObject(definition)) {
          definition.name = definition.name || id
          definition = Vue.extend(definition)
        }
        if (type === 'directive' && typeof definition === 'function') {
          definition = { bind: definition, update: definition }
        }
        this.options[type + 's'][id] = definition
        return definition
      }
    }
  })
}

var KeepAlive = {
  name: 'keep-alive',
  abstract: true,
  created: function created () {
    this.cache = Object.create(null)
  },
  render: function render () {
    var vnode = getFirstComponentChild(this.$slots.default)
    if (vnode && vnode.componentOptions) {
      var opts = vnode.componentOptions
      var key = vnode.key == null
        // same constructor may get registered as different local components
        // so cid alone is not enough (#3269)
        ? opts.Ctor.cid + '::' + opts.tag
        : vnode.key
      if (this.cache[key]) {
        vnode.child = this.cache[key].child
      } else {
        this.cache[key] = vnode
      }
      vnode.data.keepAlive = true
    }
    return vnode
  },
  destroyed: function destroyed () {
    var this$1 = this;

    for (var key in this.cache) {
      var vnode = this$1.cache[key]
      callHook(vnode.child, 'deactivated')
      vnode.child.$destroy()
    }
  }
}

var builtInComponents = {
  KeepAlive: KeepAlive
}

/*  */

function initGlobalAPI (Vue) {
  // config
  var configDef = {}
  configDef.get = function () { return config; }
  if (process.env.NODE_ENV !== 'production') {
    configDef.set = function () {
      warn(
        'Do not replace the Vue.config object, set individual fields instead.'
      )
    }
  }
  Object.defineProperty(Vue, 'config', configDef)
  Vue.util = util
  Vue.set = set
  Vue.delete = del
  Vue.nextTick = nextTick

  Vue.options = Object.create(null)
  config._assetTypes.forEach(function (type) {
    Vue.options[type + 's'] = Object.create(null)
  })

  extend(Vue.options.components, builtInComponents)

  initUse(Vue)
  initMixin$1(Vue)
  initExtend(Vue)
  initAssetRegisters(Vue)
}

initGlobalAPI(Vue)

Object.defineProperty(Vue.prototype, '$isServer', {
  get: function () { return config._isServer; }
})

Vue.version = '2.0.0-rc.6'

/*  */

// attributes that should be using props for binding
var mustUseProp = makeMap('value,selected,checked,muted')

var isEnumeratedAttr = makeMap('contenteditable,draggable,spellcheck')

var isBooleanAttr = makeMap(
  'allowfullscreen,async,autofocus,autoplay,checked,compact,controls,declare,' +
  'default,defaultchecked,defaultmuted,defaultselected,defer,disabled,' +
  'enabled,formnovalidate,hidden,indeterminate,inert,ismap,itemscope,loop,multiple,' +
  'muted,nohref,noresize,noshade,novalidate,nowrap,open,pauseonexit,readonly,' +
  'required,reversed,scoped,seamless,selected,sortable,translate,' +
  'truespeed,typemustmatch,visible'
)

var isAttr = makeMap(
  'accept,accept-charset,accesskey,action,align,alt,async,autocomplete,' +
  'autofocus,autoplay,autosave,bgcolor,border,buffered,challenge,charset,' +
  'checked,cite,class,code,codebase,color,cols,colspan,content,http-equiv,' +
  'name,contenteditable,contextmenu,controls,coords,data,datetime,default,' +
  'defer,dir,dirname,disabled,download,draggable,dropzone,enctype,method,for,' +
  'form,formaction,headers,<th>,height,hidden,high,href,hreflang,http-equiv,' +
  'icon,id,ismap,itemprop,keytype,kind,label,lang,language,list,loop,low,' +
  'manifest,max,maxlength,media,method,GET,POST,min,multiple,email,file,' +
  'muted,name,novalidate,open,optimum,pattern,ping,placeholder,poster,' +
  'preload,radiogroup,readonly,rel,required,reversed,rows,rowspan,sandbox,' +
  'scope,scoped,seamless,selected,shape,size,type,text,password,sizes,span,' +
  'spellcheck,src,srcdoc,srclang,srcset,start,step,style,summary,tabindex,' +
  'target,title,type,usemap,value,width,wrap'
)

var xlinkNS = 'http://www.w3.org/1999/xlink'

var isXlink = function (name) {
  return name.charAt(5) === ':' && name.slice(0, 5) === 'xlink'
}

var getXlinkProp = function (name) {
  return isXlink(name) ? name.slice(6, name.length) : ''
}

var isFalsyAttrValue = function (val) {
  return val == null || val === false
}

/*  */

function genClassForVnode (vnode) {
  var data = vnode.data
  var parentNode = vnode
  var childNode = vnode
  while (childNode.child) {
    childNode = childNode.child._vnode
    if (childNode.data) {
      data = mergeClassData(childNode.data, data)
    }
  }
  while ((parentNode = parentNode.parent)) {
    if (parentNode.data) {
      data = mergeClassData(data, parentNode.data)
    }
  }
  return genClassFromData(data)
}

function mergeClassData (child, parent) {
  return {
    staticClass: concat(child.staticClass, parent.staticClass),
    class: child.class
      ? [child.class, parent.class]
      : parent.class
  }
}

function genClassFromData (data) {
  var dynamicClass = data.class
  var staticClass = data.staticClass
  if (staticClass || dynamicClass) {
    return concat(staticClass, stringifyClass(dynamicClass))
  }
  /* istanbul ignore next */
  return ''
}

function concat (a, b) {
  return a ? b ? (a + ' ' + b) : a : (b || '')
}

function stringifyClass (value) {
  var res = ''
  if (!value) {
    return res
  }
  if (typeof value === 'string') {
    return value
  }
  if (Array.isArray(value)) {
    var stringified
    for (var i = 0, l = value.length; i < l; i++) {
      if (value[i]) {
        if ((stringified = stringifyClass(value[i]))) {
          res += stringified + ' '
        }
      }
    }
    return res.slice(0, -1)
  }
  if (isObject(value)) {
    for (var key in value) {
      if (value[key]) res += key + ' '
    }
    return res.slice(0, -1)
  }
  /* istanbul ignore next */
  return res
}

/*  */

var namespaceMap = {
  svg: 'http://www.w3.org/2000/svg',
  math: 'http://www.w3.org/1998/Math/MathML'
}

var isHTMLTag = makeMap(
  'html,body,base,head,link,meta,style,title,' +
  'address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,hgroup,nav,section,' +
  'div,dd,dl,dt,figcaption,figure,hr,img,li,main,ol,p,pre,ul,' +
  'a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby,' +
  's,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,' +
  'embed,object,param,source,canvas,script,noscript,del,ins,' +
  'caption,col,colgroup,table,thead,tbody,td,th,tr,' +
  'button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,' +
  'output,progress,select,textarea,' +
  'details,dialog,menu,menuitem,summary,' +
  'content,element,shadow,template'
)

var isUnaryTag = makeMap(
  'area,base,br,col,embed,frame,hr,img,input,isindex,keygen,' +
  'link,meta,param,source,track,wbr',
  true
)

// Elements that you can, intentionally, leave open
// (and which close themselves)
var canBeLeftOpenTag = makeMap(
  'colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr,source',
  true
)

// HTML5 tags https://html.spec.whatwg.org/multipage/indices.html#elements-3
// Phrasing Content https://html.spec.whatwg.org/multipage/dom.html#phrasing-content
var isNonPhrasingTag = makeMap(
  'address,article,aside,base,blockquote,body,caption,col,colgroup,dd,' +
  'details,dialog,div,dl,dt,fieldset,figcaption,figure,footer,form,' +
  'h1,h2,h3,h4,h5,h6,head,header,hgroup,hr,html,legend,li,menuitem,meta,' +
  'optgroup,option,param,rp,rt,source,style,summary,tbody,td,tfoot,th,thead,' +
  'title,tr,track',
  true
)

// this map is intentionally selective, only covering SVG elements that may
// contain child elements.
var isSVG = makeMap(
  'svg,animate,circle,clippath,cursor,defs,desc,ellipse,filter,font,' +
  'font-face,g,glyph,image,line,marker,mask,missing-glyph,path,pattern,' +
  'polygon,polyline,rect,switch,symbol,text,textpath,tspan,use,view',
  true
)

var isReservedTag = function (tag) {
  return isHTMLTag(tag) || isSVG(tag)
}

function getTagNamespace (tag) {
  if (isSVG(tag)) {
    return 'svg'
  }
  // basic support for MathML
  // note it doesn't support other MathML elements being component roots
  if (tag === 'math') {
    return 'math'
  }
}

var unknownElementCache = Object.create(null)
function isUnknownElement (tag) {
  /* istanbul ignore if */
  if (!inBrowser) {
    return true
  }
  if (isReservedTag(tag)) {
    return false
  }
  tag = tag.toLowerCase()
  /* istanbul ignore if */
  if (unknownElementCache[tag] != null) {
    return unknownElementCache[tag]
  }
  var el = document.createElement(tag)
  if (tag.indexOf('-') > -1) {
    // http://stackoverflow.com/a/28210364/1070244
    return (unknownElementCache[tag] = (
      el.constructor === window.HTMLUnknownElement ||
      el.constructor === window.HTMLElement
    ))
  } else {
    return (unknownElementCache[tag] = /HTMLUnknownElement/.test(el.toString()))
  }
}

/*  */

var UA$1 = inBrowser && window.navigator.userAgent.toLowerCase()
var isIE = UA$1 && /msie|trident/.test(UA$1)
var isIE9 = UA$1 && UA$1.indexOf('msie 9.0') > 0
var isAndroid = UA$1 && UA$1.indexOf('android') > 0

/**
 * Query an element selector if it's not an element already.
 */
function query (el) {
  if (typeof el === 'string') {
    var selector = el
    el = document.querySelector(el)
    if (!el) {
      process.env.NODE_ENV !== 'production' && warn(
        'Cannot find element: ' + selector
      )
      return document.createElement('div')
    }
  }
  return el
}

/*  */

function createElement$1 (tagName) {
  return document.createElement(tagName)
}

function createElementNS (namespace, tagName) {
  return document.createElementNS(namespaceMap[namespace], tagName)
}

function createTextNode (text) {
  return document.createTextNode(text)
}

function createComment (text) {
  return document.createComment(text)
}

function insertBefore (parentNode, newNode, referenceNode) {
  parentNode.insertBefore(newNode, referenceNode)
}

function removeChild (node, child) {
  node.removeChild(child)
}

function appendChild (node, child) {
  node.appendChild(child)
}

function parentNode (node) {
  return node.parentNode
}

function nextSibling (node) {
  return node.nextSibling
}

function tagName (node) {
  return node.tagName
}

function setTextContent (node, text) {
  node.textContent = text
}

function childNodes (node) {
  return node.childNodes
}

function setAttribute (node, key, val) {
  node.setAttribute(key, val)
}


var nodeOps = Object.freeze({
  createElement: createElement$1,
  createElementNS: createElementNS,
  createTextNode: createTextNode,
  createComment: createComment,
  insertBefore: insertBefore,
  removeChild: removeChild,
  appendChild: appendChild,
  parentNode: parentNode,
  nextSibling: nextSibling,
  tagName: tagName,
  setTextContent: setTextContent,
  childNodes: childNodes,
  setAttribute: setAttribute
});

/*  */

var ref = {
  create: function create (_, vnode) {
    registerRef(vnode)
  },
  update: function update (oldVnode, vnode) {
    if (oldVnode.data.ref !== vnode.data.ref) {
      registerRef(oldVnode, true)
      registerRef(vnode)
    }
  },
  destroy: function destroy (vnode) {
    registerRef(vnode, true)
  }
}

function registerRef (vnode, isRemoval) {
  var key = vnode.data.ref
  if (!key) return

  var vm = vnode.context
  var ref = vnode.child || vnode.elm
  var refs = vm.$refs
  if (isRemoval) {
    if (Array.isArray(refs[key])) {
      remove(refs[key], ref)
    } else if (refs[key] === ref) {
      refs[key] = undefined
    }
  } else {
    if (vnode.data.refInFor) {
      if (Array.isArray(refs[key])) {
        refs[key].push(ref)
      } else {
        refs[key] = [ref]
      }
    } else {
      refs[key] = ref
    }
  }
}

/**
 * Virtual DOM patching algorithm based on Snabbdom by
 * Simon Friis Vindum (@paldepind)
 * Licensed under the MIT License
 * https://github.com/paldepind/snabbdom/blob/master/LICENSE
 *
 * modified by Evan You (@yyx990803)
 *

/*
 * Not type-checking this because this file is perf-critical and the cost
 * of making flow understand it is not worth it.
 */

var emptyData = {}
var emptyNode = new VNode('', emptyData, [])
var hooks$1 = ['create', 'update', 'postpatch', 'remove', 'destroy']

function isUndef (s) {
  return s == null
}

function isDef (s) {
  return s != null
}

function sameVnode (vnode1, vnode2) {
  return (
    vnode1.key === vnode2.key &&
    vnode1.tag === vnode2.tag &&
    vnode1.isComment === vnode2.isComment &&
    !vnode1.data === !vnode2.data
  )
}

function createKeyToOldIdx (children, beginIdx, endIdx) {
  var i, key
  var map = {}
  for (i = beginIdx; i <= endIdx; ++i) {
    key = children[i].key
    if (isDef(key)) map[key] = i
  }
  return map
}

function createPatchFunction (backend) {
  var i, j
  var cbs = {}

  var modules = backend.modules;
  var nodeOps = backend.nodeOps;

  for (i = 0; i < hooks$1.length; ++i) {
    cbs[hooks$1[i]] = []
    for (j = 0; j < modules.length; ++j) {
      if (modules[j][hooks$1[i]] !== undefined) cbs[hooks$1[i]].push(modules[j][hooks$1[i]])
    }
  }

  function emptyNodeAt (elm) {
    return new VNode(nodeOps.tagName(elm).toLowerCase(), {}, [], undefined, elm)
  }

  function createRmCb (childElm, listeners) {
    function remove () {
      if (--remove.listeners === 0) {
        removeElement(childElm)
      }
    }
    remove.listeners = listeners
    return remove
  }

  function removeElement (el) {
    var parent = nodeOps.parentNode(el)
    nodeOps.removeChild(parent, el)
  }

  function createElm (vnode, insertedVnodeQueue, nested) {
    var i
    var data = vnode.data
    vnode.isRootInsert = !nested
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.init)) i(vnode)
      // after calling the init hook, if the vnode is a child component
      // it should've created a child instance and mounted it. the child
      // component also has set the placeholder vnode's elm.
      // in that case we can just return the element and be done.
      if (isDef(i = vnode.child)) {
        initComponent(vnode, insertedVnodeQueue)
        return vnode.elm
      }
    }
    var children = vnode.children
    var tag = vnode.tag
    if (isDef(tag)) {
      if (process.env.NODE_ENV !== 'production') {
        if (
          !vnode.ns &&
          !(config.ignoredElements && config.ignoredElements.indexOf(tag) > -1) &&
          config.isUnknownElement(tag)
        ) {
          warn(
            'Unknown custom element: <' + tag + '> - did you ' +
            'register the component correctly? For recursive components, ' +
            'make sure to provide the "name" option.',
            vnode.context
          )
        }
      }
      vnode.elm = vnode.ns
        ? nodeOps.createElementNS(vnode.ns, tag)
        : nodeOps.createElement(tag)
      setScope(vnode)
      createChildren(vnode, children, insertedVnodeQueue)
      if (isDef(data)) {
        invokeCreateHooks(vnode, insertedVnodeQueue)
      }
    } else if (vnode.isComment) {
      vnode.elm = nodeOps.createComment(vnode.text)
    } else {
      vnode.elm = nodeOps.createTextNode(vnode.text)
    }
    return vnode.elm
  }

  function createChildren (vnode, children, insertedVnodeQueue) {
    if (Array.isArray(children)) {
      for (var i = 0; i < children.length; ++i) {
        nodeOps.appendChild(vnode.elm, createElm(children[i], insertedVnodeQueue, true))
      }
    } else if (isPrimitive(vnode.text)) {
      nodeOps.appendChild(vnode.elm, nodeOps.createTextNode(vnode.text))
    }
  }

  function isPatchable (vnode) {
    while (vnode.child) {
      vnode = vnode.child._vnode
    }
    return isDef(vnode.tag)
  }

  function invokeCreateHooks (vnode, insertedVnodeQueue) {
    for (var i$1 = 0; i$1 < cbs.create.length; ++i$1) {
      cbs.create[i$1](emptyNode, vnode)
    }
    i = vnode.data.hook // Reuse variable
    if (isDef(i)) {
      if (i.create) i.create(emptyNode, vnode)
      if (i.insert) insertedVnodeQueue.push(vnode)
    }
  }

  function initComponent (vnode, insertedVnodeQueue) {
    if (vnode.data.pendingInsert) {
      insertedVnodeQueue.push.apply(insertedVnodeQueue, vnode.data.pendingInsert)
    }
    vnode.elm = vnode.child.$el
    if (isPatchable(vnode)) {
      invokeCreateHooks(vnode, insertedVnodeQueue)
      setScope(vnode)
    } else {
      // empty component root.
      // skip all element-related modules except for ref (#3455)
      registerRef(vnode)
      // make sure to invoke the insert hook
      insertedVnodeQueue.push(vnode)
    }
  }

  // set scope id attribute for scoped CSS.
  // this is implemented as a special case to avoid the overhead
  // of going through the normal attribute patching process.
  function setScope (vnode) {
    var i
    if (isDef(i = vnode.context) && isDef(i = i.$options._scopeId)) {
      nodeOps.setAttribute(vnode.elm, i, '')
    }
    if (isDef(i = activeInstance) &&
        i !== vnode.context &&
        isDef(i = i.$options._scopeId)) {
      nodeOps.setAttribute(vnode.elm, i, '')
    }
  }

  function addVnodes (parentElm, before, vnodes, startIdx, endIdx, insertedVnodeQueue) {
    for (; startIdx <= endIdx; ++startIdx) {
      nodeOps.insertBefore(parentElm, createElm(vnodes[startIdx], insertedVnodeQueue), before)
    }
  }

  function invokeDestroyHook (vnode) {
    var i, j
    var data = vnode.data
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.destroy)) i(vnode)
      for (i = 0; i < cbs.destroy.length; ++i) cbs.destroy[i](vnode)
    }
    if (isDef(i = vnode.child) && !data.keepAlive) {
      invokeDestroyHook(i._vnode)
    }
    if (isDef(i = vnode.children)) {
      for (j = 0; j < vnode.children.length; ++j) {
        invokeDestroyHook(vnode.children[j])
      }
    }
  }

  function removeVnodes (parentElm, vnodes, startIdx, endIdx) {
    for (; startIdx <= endIdx; ++startIdx) {
      var ch = vnodes[startIdx]
      if (isDef(ch)) {
        if (isDef(ch.tag)) {
          removeAndInvokeRemoveHook(ch)
          invokeDestroyHook(ch)
        } else { // Text node
          nodeOps.removeChild(parentElm, ch.elm)
        }
      }
    }
  }

  function removeAndInvokeRemoveHook (vnode, rm) {
    if (rm || isDef(vnode.data)) {
      var listeners = cbs.remove.length + 1
      if (!rm) {
        // directly removing
        rm = createRmCb(vnode.elm, listeners)
      } else {
        // we have a recursively passed down rm callback
        // increase the listeners count
        rm.listeners += listeners
      }
      // recursively invoke hooks on child component root node
      if (isDef(i = vnode.child) && isDef(i = i._vnode) && isDef(i.data)) {
        removeAndInvokeRemoveHook(i, rm)
      }
      for (i = 0; i < cbs.remove.length; ++i) {
        cbs.remove[i](vnode, rm)
      }
      if (isDef(i = vnode.data.hook) && isDef(i = i.remove)) {
        i(vnode, rm)
      } else {
        rm()
      }
    } else {
      removeElement(vnode.elm)
    }
  }

  function updateChildren (parentElm, oldCh, newCh, insertedVnodeQueue, removeOnly) {
    var oldStartIdx = 0
    var newStartIdx = 0
    var oldEndIdx = oldCh.length - 1
    var oldStartVnode = oldCh[0]
    var oldEndVnode = oldCh[oldEndIdx]
    var newEndIdx = newCh.length - 1
    var newStartVnode = newCh[0]
    var newEndVnode = newCh[newEndIdx]
    var oldKeyToIdx, idxInOld, elmToMove, before

    // removeOnly is a special flag used only by <transition-group>
    // to ensure removed elements stay in correct relative positions
    // during leaving transitions
    var canMove = !removeOnly

    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
      if (isUndef(oldStartVnode)) {
        oldStartVnode = oldCh[++oldStartIdx] // Vnode has been moved left
      } else if (isUndef(oldEndVnode)) {
        oldEndVnode = oldCh[--oldEndIdx]
      } else if (sameVnode(oldStartVnode, newStartVnode)) {
        patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue)
        oldStartVnode = oldCh[++oldStartIdx]
        newStartVnode = newCh[++newStartIdx]
      } else if (sameVnode(oldEndVnode, newEndVnode)) {
        patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue)
        oldEndVnode = oldCh[--oldEndIdx]
        newEndVnode = newCh[--newEndIdx]
      } else if (sameVnode(oldStartVnode, newEndVnode)) { // Vnode moved right
        patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue)
        canMove && nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm))
        oldStartVnode = oldCh[++oldStartIdx]
        newEndVnode = newCh[--newEndIdx]
      } else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
        patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue)
        canMove && nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm)
        oldEndVnode = oldCh[--oldEndIdx]
        newStartVnode = newCh[++newStartIdx]
      } else {
        if (isUndef(oldKeyToIdx)) oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx)
        idxInOld = isDef(newStartVnode.key) ? oldKeyToIdx[newStartVnode.key] : null
        if (isUndef(idxInOld)) { // New element
          nodeOps.insertBefore(parentElm, createElm(newStartVnode, insertedVnodeQueue), oldStartVnode.elm)
          newStartVnode = newCh[++newStartIdx]
        } else {
          elmToMove = oldCh[idxInOld]
          /* istanbul ignore if */
          if (process.env.NODE_ENV !== 'production' && !elmToMove) {
            warn(
              'It seems there are duplicate keys that is causing an update error. ' +
              'Make sure each v-for item has a unique key.'
            )
          }
          if (elmToMove.tag !== newStartVnode.tag) {
            // same key but different element. treat as new element
            nodeOps.insertBefore(parentElm, createElm(newStartVnode, insertedVnodeQueue), oldStartVnode.elm)
            newStartVnode = newCh[++newStartIdx]
          } else {
            patchVnode(elmToMove, newStartVnode, insertedVnodeQueue)
            oldCh[idxInOld] = undefined
            canMove && nodeOps.insertBefore(parentElm, newStartVnode.elm, oldStartVnode.elm)
            newStartVnode = newCh[++newStartIdx]
          }
        }
      }
    }
    if (oldStartIdx > oldEndIdx) {
      before = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm
      addVnodes(parentElm, before, newCh, newStartIdx, newEndIdx, insertedVnodeQueue)
    } else if (newStartIdx > newEndIdx) {
      removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx)
    }
  }

  function patchVnode (oldVnode, vnode, insertedVnodeQueue, removeOnly) {
    if (oldVnode === vnode) {
      return
    }
    // reuse element for static trees.
    // note we only do this if the vnode is cloned -
    // if the new node is not cloned it means the render functions have been
    // reset by the hot-reload-api and we need to do a proper re-render.
    if (vnode.isStatic &&
        oldVnode.isStatic &&
        vnode.key === oldVnode.key &&
        vnode.isCloned) {
      vnode.elm = oldVnode.elm
      return
    }
    var i, hook
    var hasData = isDef(i = vnode.data)
    if (hasData && isDef(hook = i.hook) && isDef(i = hook.prepatch)) {
      i(oldVnode, vnode)
    }
    var elm = vnode.elm = oldVnode.elm
    var oldCh = oldVnode.children
    var ch = vnode.children
    if (hasData && isPatchable(vnode)) {
      for (i = 0; i < cbs.update.length; ++i) cbs.update[i](oldVnode, vnode)
      if (isDef(hook) && isDef(i = hook.update)) i(oldVnode, vnode)
    }
    if (isUndef(vnode.text)) {
      if (isDef(oldCh) && isDef(ch)) {
        if (oldCh !== ch) updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly)
      } else if (isDef(ch)) {
        if (isDef(oldVnode.text)) nodeOps.setTextContent(elm, '')
        addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue)
      } else if (isDef(oldCh)) {
        removeVnodes(elm, oldCh, 0, oldCh.length - 1)
      } else if (isDef(oldVnode.text)) {
        nodeOps.setTextContent(elm, '')
      }
    } else if (oldVnode.text !== vnode.text) {
      nodeOps.setTextContent(elm, vnode.text)
    }
    if (hasData) {
      for (i = 0; i < cbs.postpatch.length; ++i) cbs.postpatch[i](oldVnode, vnode)
      if (isDef(hook) && isDef(i = hook.postpatch)) i(oldVnode, vnode)
    }
  }

  function invokeInsertHook (vnode, queue, initial) {
    // delay insert hooks for component root nodes, invoke them after the
    // element is really inserted
    if (initial && vnode.parent) {
      vnode.parent.data.pendingInsert = queue
    } else {
      for (var i = 0; i < queue.length; ++i) {
        queue[i].data.hook.insert(queue[i])
      }
    }
  }

  var bailed = false
  function hydrate (elm, vnode, insertedVnodeQueue) {
    if (process.env.NODE_ENV !== 'production') {
      if (!assertNodeMatch(elm, vnode)) {
        return false
      }
    }
    vnode.elm = elm
    var tag = vnode.tag;
    var data = vnode.data;
    var children = vnode.children;
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.init)) i(vnode, true /* hydrating */)
      if (isDef(i = vnode.child)) {
        // child component. it should have hydrated its own tree.
        initComponent(vnode, insertedVnodeQueue)
        return true
      }
    }
    if (isDef(tag)) {
      if (isDef(children)) {
        var childNodes = nodeOps.childNodes(elm)
        // empty element, allow client to pick up and populate children
        if (!childNodes.length) {
          createChildren(vnode, children, insertedVnodeQueue)
        } else {
          var childrenMatch = true
          if (childNodes.length !== children.length) {
            childrenMatch = false
          } else {
            for (var i$1 = 0; i$1 < children.length; i$1++) {
              if (!hydrate(childNodes[i$1], children[i$1], insertedVnodeQueue)) {
                childrenMatch = false
                break
              }
            }
          }
          if (!childrenMatch) {
            if (process.env.NODE_ENV !== 'production' &&
                typeof console !== 'undefined' &&
                !bailed) {
              bailed = true
              console.warn('Parent: ', elm)
              console.warn('Mismatching childNodes vs. VNodes: ', childNodes, children)
            }
            return false
          }
        }
      }
      if (isDef(data)) {
        invokeCreateHooks(vnode, insertedVnodeQueue)
      }
    }
    return true
  }

  function assertNodeMatch (node, vnode) {
    if (vnode.tag) {
      return (
        vnode.tag.indexOf('vue-component') === 0 ||
        vnode.tag === nodeOps.tagName(node).toLowerCase()
      )
    } else {
      return _toString(vnode.text) === node.data
    }
  }

  return function patch (oldVnode, vnode, hydrating, removeOnly) {
    var elm, parent
    var isInitialPatch = false
    var insertedVnodeQueue = []

    if (!oldVnode) {
      // empty mount, create new root element
      isInitialPatch = true
      createElm(vnode, insertedVnodeQueue)
    } else {
      var isRealElement = isDef(oldVnode.nodeType)
      if (!isRealElement && sameVnode(oldVnode, vnode)) {
        patchVnode(oldVnode, vnode, insertedVnodeQueue, removeOnly)
      } else {
        if (isRealElement) {
          // mounting to a real element
          // check if this is server-rendered content and if we can perform
          // a successful hydration.
          if (oldVnode.nodeType === 1 && oldVnode.hasAttribute('server-rendered')) {
            oldVnode.removeAttribute('server-rendered')
            hydrating = true
          }
          if (hydrating) {
            if (hydrate(oldVnode, vnode, insertedVnodeQueue)) {
              invokeInsertHook(vnode, insertedVnodeQueue, true)
              return oldVnode
            } else if (process.env.NODE_ENV !== 'production') {
              warn(
                'The client-side rendered virtual DOM tree is not matching ' +
                'server-rendered content. This is likely caused by incorrect ' +
                'HTML markup, for example nesting block-level elements inside ' +
                '<p>, or missing <tbody>. Bailing hydration and performing ' +
                'full client-side render.'
              )
            }
          }
          // either not server-rendered, or hydration failed.
          // create an empty node and replace it
          oldVnode = emptyNodeAt(oldVnode)
        }
        elm = oldVnode.elm
        parent = nodeOps.parentNode(elm)

        createElm(vnode, insertedVnodeQueue)

        // component root element replaced.
        // update parent placeholder node element.
        if (vnode.parent) {
          vnode.parent.elm = vnode.elm
          if (isPatchable(vnode)) {
            for (var i = 0; i < cbs.create.length; ++i) {
              cbs.create[i](emptyNode, vnode.parent)
            }
          }
        }

        if (parent !== null) {
          nodeOps.insertBefore(parent, vnode.elm, nodeOps.nextSibling(elm))
          removeVnodes(parent, [oldVnode], 0, 0)
        } else if (isDef(oldVnode.tag)) {
          invokeDestroyHook(oldVnode)
        }
      }
    }

    invokeInsertHook(vnode, insertedVnodeQueue, isInitialPatch)
    return vnode.elm
  }
}

/*  */

var directives = {
  create: function bindDirectives (oldVnode, vnode) {
    var hasInsert = false
    forEachDirective(oldVnode, vnode, function (def, dir) {
      callHook$1(def, dir, 'bind', vnode, oldVnode)
      if (def.inserted) {
        hasInsert = true
      }
    })
    if (hasInsert) {
      mergeVNodeHook(vnode.data.hook || (vnode.data.hook = {}), 'insert', function () {
        applyDirectives(oldVnode, vnode, 'inserted')
      })
    }
  },
  update: function updateDirectives (oldVnode, vnode) {
    applyDirectives(oldVnode, vnode, 'update')
    // if old vnode has directives but new vnode doesn't
    // we need to teardown the directives on the old one.
    if (oldVnode.data.directives && !vnode.data.directives) {
      applyDirectives(oldVnode, oldVnode, 'unbind')
    }
  },
  postpatch: function postupdateDirectives (oldVnode, vnode) {
    applyDirectives(oldVnode, vnode, 'componentUpdated')
  },
  destroy: function unbindDirectives (vnode) {
    applyDirectives(vnode, vnode, 'unbind')
  }
}

var emptyModifiers = Object.create(null)

function forEachDirective (
  oldVnode,
  vnode,
  fn
) {
  var dirs = vnode.data.directives
  if (dirs) {
    for (var i = 0; i < dirs.length; i++) {
      var dir = dirs[i]
      var def = resolveAsset(vnode.context.$options, 'directives', dir.name, true)
      if (def) {
        var oldDirs = oldVnode && oldVnode.data.directives
        if (oldDirs) {
          dir.oldValue = oldDirs[i].value
        }
        if (!dir.modifiers) {
          dir.modifiers = emptyModifiers
        }
        fn(def, dir)
      }
    }
  }
}

function applyDirectives (
  oldVnode,
  vnode,
  hook
) {
  forEachDirective(oldVnode, vnode, function (def, dir) {
    callHook$1(def, dir, hook, vnode, oldVnode)
  })
}

function callHook$1 (def, dir, hook, vnode, oldVnode) {
  var fn = def && def[hook]
  if (fn) {
    fn(vnode.elm, dir, vnode, oldVnode)
  }
}

var baseModules = [
  ref,
  directives
]

/*  */

function updateAttrs (oldVnode, vnode) {
  if (!oldVnode.data.attrs && !vnode.data.attrs) {
    return
  }
  var key, cur, old
  var elm = vnode.elm
  var oldAttrs = oldVnode.data.attrs || {}
  var attrs = vnode.data.attrs || {}
  // clone observed objects, as the user probably wants to mutate it
  if (attrs.__ob__) {
    attrs = vnode.data.attrs = extend({}, attrs)
  }

  for (key in attrs) {
    cur = attrs[key]
    old = oldAttrs[key]
    if (old !== cur) {
      setAttr(elm, key, cur)
    }
  }
  for (key in oldAttrs) {
    if (attrs[key] == null) {
      if (isXlink(key)) {
        elm.removeAttributeNS(xlinkNS, getXlinkProp(key))
      } else if (!isEnumeratedAttr(key)) {
        elm.removeAttribute(key)
      }
    }
  }
}

function setAttr (el, key, value) {
  if (isBooleanAttr(key)) {
    // set attribute for blank value
    // e.g. <option disabled>Select one</option>
    if (isFalsyAttrValue(value)) {
      el.removeAttribute(key)
    } else {
      el.setAttribute(key, key)
    }
  } else if (isEnumeratedAttr(key)) {
    el.setAttribute(key, isFalsyAttrValue(value) || value === 'false' ? 'false' : 'true')
  } else if (isXlink(key)) {
    if (isFalsyAttrValue(value)) {
      el.removeAttributeNS(xlinkNS, getXlinkProp(key))
    } else {
      el.setAttributeNS(xlinkNS, key, value)
    }
  } else {
    if (isFalsyAttrValue(value)) {
      el.removeAttribute(key)
    } else {
      el.setAttribute(key, value)
    }
  }
}

var attrs = {
  create: updateAttrs,
  update: updateAttrs
}

/*  */

function updateClass (oldVnode, vnode) {
  var el = vnode.elm
  var data = vnode.data
  var oldData = oldVnode.data
  if (!data.staticClass && !data.class &&
      (!oldData || (!oldData.staticClass && !oldData.class))) {
    return
  }

  var cls = genClassForVnode(vnode)

  // handle transition classes
  var transitionClass = el._transitionClasses
  if (transitionClass) {
    cls = concat(cls, stringifyClass(transitionClass))
  }

  // set the class
  if (cls !== el._prevClass) {
    el.setAttribute('class', cls)
    el._prevClass = cls
  }
}

var klass = {
  create: updateClass,
  update: updateClass
}

// skip type checking this file because we need to attach private properties
// to elements

function updateDOMListeners (oldVnode, vnode) {
  if (!oldVnode.data.on && !vnode.data.on) {
    return
  }
  var on = vnode.data.on || {}
  var oldOn = oldVnode.data.on || {}
  var add = vnode.elm._v_add || (vnode.elm._v_add = function (event, handler, capture) {
    vnode.elm.addEventListener(event, handler, capture)
  })
  var remove = vnode.elm._v_remove || (vnode.elm._v_remove = function (event, handler) {
    vnode.elm.removeEventListener(event, handler)
  })
  updateListeners(on, oldOn, add, remove)
}

var events = {
  create: updateDOMListeners,
  update: updateDOMListeners
}

/*  */

function updateDOMProps (oldVnode, vnode) {
  if (!oldVnode.data.domProps && !vnode.data.domProps) {
    return
  }
  var key, cur
  var elm = vnode.elm
  var oldProps = oldVnode.data.domProps || {}
  var props = vnode.data.domProps || {}
  // clone observed objects, as the user probably wants to mutate it
  if (props.__ob__) {
    props = vnode.data.domProps = extend({}, props)
  }

  for (key in oldProps) {
    if (props[key] == null) {
      elm[key] = undefined
    }
  }
  for (key in props) {
    // ignore children if the node has textContent or innerHTML,
    // as these will throw away existing DOM nodes and cause removal errors
    // on subsequent patches (#3360)
    if ((key === 'textContent' || key === 'innerHTML') && vnode.children) {
      vnode.children.length = 0
    }
    cur = props[key]
    if (key === 'value') {
      // store value as _value as well since
      // non-string values will be stringified
      elm._value = cur
      // avoid resetting cursor position when value is the same
      var strCur = cur == null ? '' : String(cur)
      if (elm.value !== strCur) {
        elm.value = strCur
      }
    } else {
      elm[key] = cur
    }
  }
}

var domProps = {
  create: updateDOMProps,
  update: updateDOMProps
}

/*  */

var prefixes = ['Webkit', 'Moz', 'ms']

var testEl
var normalize = cached(function (prop) {
  testEl = testEl || document.createElement('div')
  prop = camelize(prop)
  if (prop !== 'filter' && (prop in testEl.style)) {
    return prop
  }
  var upper = prop.charAt(0).toUpperCase() + prop.slice(1)
  for (var i = 0; i < prefixes.length; i++) {
    var prefixed = prefixes[i] + upper
    if (prefixed in testEl.style) {
      return prefixed
    }
  }
})

function updateStyle (oldVnode, vnode) {
  if ((!oldVnode.data || !oldVnode.data.style) && !vnode.data.style) {
    return
  }
  var cur, name
  var el = vnode.elm
  var oldStyle = oldVnode.data.style || {}
  var style = vnode.data.style || {}

  // handle string
  if (typeof style === 'string') {
    el.style.cssText = style
    return
  }

  var needClone = style.__ob__

  // handle array syntax
  if (Array.isArray(style)) {
    style = vnode.data.style = toObject(style)
  }

  // clone the style for future updates,
  // in case the user mutates the style object in-place.
  if (needClone) {
    style = vnode.data.style = extend({}, style)
  }

  for (name in oldStyle) {
    if (!style[name]) {
      el.style[normalize(name)] = ''
    }
  }
  for (name in style) {
    cur = style[name]
    if (cur !== oldStyle[name]) {
      // ie9 setting to null has no effect, must use empty string
      el.style[normalize(name)] = cur || ''
    }
  }
}

var style = {
  create: updateStyle,
  update: updateStyle
}

/*  */

/**
 * Add class with compatibility for SVG since classList is not supported on
 * SVG elements in IE
 */
function addClass (el, cls) {
  /* istanbul ignore else */
  if (el.classList) {
    if (cls.indexOf(' ') > -1) {
      cls.split(/\s+/).forEach(function (c) { return el.classList.add(c); })
    } else {
      el.classList.add(cls)
    }
  } else {
    var cur = ' ' + el.getAttribute('class') + ' '
    if (cur.indexOf(' ' + cls + ' ') < 0) {
      el.setAttribute('class', (cur + cls).trim())
    }
  }
}

/**
 * Remove class with compatibility for SVG since classList is not supported on
 * SVG elements in IE
 */
function removeClass (el, cls) {
  /* istanbul ignore else */
  if (el.classList) {
    if (cls.indexOf(' ') > -1) {
      cls.split(/\s+/).forEach(function (c) { return el.classList.remove(c); })
    } else {
      el.classList.remove(cls)
    }
  } else {
    var cur = ' ' + el.getAttribute('class') + ' '
    var tar = ' ' + cls + ' '
    while (cur.indexOf(tar) >= 0) {
      cur = cur.replace(tar, ' ')
    }
    el.setAttribute('class', cur.trim())
  }
}

/*  */

var hasTransition = inBrowser && !isIE9
var TRANSITION = 'transition'
var ANIMATION = 'animation'

// Transition property/event sniffing
var transitionProp = 'transition'
var transitionEndEvent = 'transitionend'
var animationProp = 'animation'
var animationEndEvent = 'animationend'
if (hasTransition) {
  /* istanbul ignore if */
  if (window.ontransitionend === undefined &&
    window.onwebkittransitionend !== undefined) {
    transitionProp = 'WebkitTransition'
    transitionEndEvent = 'webkitTransitionEnd'
  }
  if (window.onanimationend === undefined &&
    window.onwebkitanimationend !== undefined) {
    animationProp = 'WebkitAnimation'
    animationEndEvent = 'webkitAnimationEnd'
  }
}

var raf = (inBrowser && window.requestAnimationFrame) || setTimeout
function nextFrame (fn) {
  raf(function () {
    raf(fn)
  })
}

function addTransitionClass (el, cls) {
  (el._transitionClasses || (el._transitionClasses = [])).push(cls)
  addClass(el, cls)
}

function removeTransitionClass (el, cls) {
  if (el._transitionClasses) {
    remove(el._transitionClasses, cls)
  }
  removeClass(el, cls)
}

function whenTransitionEnds (
  el,
  expectedType,
  cb
) {
  var ref = getTransitionInfo(el, expectedType);
  var type = ref.type;
  var timeout = ref.timeout;
  var propCount = ref.propCount;
  if (!type) return cb()
  var event = type === TRANSITION ? transitionEndEvent : animationEndEvent
  var ended = 0
  var end = function () {
    el.removeEventListener(event, onEnd)
    cb()
  }
  var onEnd = function (e) {
    if (e.target === el) {
      if (++ended >= propCount) {
        end()
      }
    }
  }
  setTimeout(function () {
    if (ended < propCount) {
      end()
    }
  }, timeout + 1)
  el.addEventListener(event, onEnd)
}

var transformRE = /\b(transform|all)(,|$)/

function getTransitionInfo (el, expectedType) {
  var styles = window.getComputedStyle(el)
  var transitioneDelays = styles[transitionProp + 'Delay'].split(', ')
  var transitionDurations = styles[transitionProp + 'Duration'].split(', ')
  var transitionTimeout = getTimeout(transitioneDelays, transitionDurations)
  var animationDelays = styles[animationProp + 'Delay'].split(', ')
  var animationDurations = styles[animationProp + 'Duration'].split(', ')
  var animationTimeout = getTimeout(animationDelays, animationDurations)

  var type
  var timeout = 0
  var propCount = 0
  /* istanbul ignore if */
  if (expectedType === TRANSITION) {
    if (transitionTimeout > 0) {
      type = TRANSITION
      timeout = transitionTimeout
      propCount = transitionDurations.length
    }
  } else if (expectedType === ANIMATION) {
    if (animationTimeout > 0) {
      type = ANIMATION
      timeout = animationTimeout
      propCount = animationDurations.length
    }
  } else {
    timeout = Math.max(transitionTimeout, animationTimeout)
    type = timeout > 0
      ? transitionTimeout > animationTimeout
        ? TRANSITION
        : ANIMATION
      : null
    propCount = type
      ? type === TRANSITION
        ? transitionDurations.length
        : animationDurations.length
      : 0
  }
  var hasTransform =
    type === TRANSITION &&
    transformRE.test(styles[transitionProp + 'Property'])
  return {
    type: type,
    timeout: timeout,
    propCount: propCount,
    hasTransform: hasTransform
  }
}

function getTimeout (delays, durations) {
  return Math.max.apply(null, durations.map(function (d, i) {
    return toMs(d) + toMs(delays[i])
  }))
}

function toMs (s) {
  return Number(s.slice(0, -1)) * 1000
}

/*  */

function enter (vnode) {
  var el = vnode.elm

  // call leave callback now
  if (el._leaveCb) {
    el._leaveCb.cancelled = true
    el._leaveCb()
  }

  var data = resolveTransition(vnode.data.transition)
  if (!data) {
    return
  }

  /* istanbul ignore if */
  if (el._enterCb || el.nodeType !== 1) {
    return
  }

  var css = data.css;
  var type = data.type;
  var enterClass = data.enterClass;
  var enterActiveClass = data.enterActiveClass;
  var appearClass = data.appearClass;
  var appearActiveClass = data.appearActiveClass;
  var beforeEnter = data.beforeEnter;
  var enter = data.enter;
  var afterEnter = data.afterEnter;
  var enterCancelled = data.enterCancelled;
  var beforeAppear = data.beforeAppear;
  var appear = data.appear;
  var afterAppear = data.afterAppear;
  var appearCancelled = data.appearCancelled;

  // activeInstance will always be the <transition> component managing this
  // transition. One edge case to check is when the <transition> is placed
  // as the root node of a child component. In that case we need to check
  // <transition>'s parent for appear check.
  var transitionNode = activeInstance.$vnode
  var context = transitionNode && transitionNode.parent
    ? transitionNode.parent.context
    : activeInstance

  var isAppear = !context._isMounted || !vnode.isRootInsert

  if (isAppear && !appear && appear !== '') {
    return
  }

  var startClass = isAppear ? appearClass : enterClass
  var activeClass = isAppear ? appearActiveClass : enterActiveClass
  var beforeEnterHook = isAppear ? (beforeAppear || beforeEnter) : beforeEnter
  var enterHook = isAppear ? (typeof appear === 'function' ? appear : enter) : enter
  var afterEnterHook = isAppear ? (afterAppear || afterEnter) : afterEnter
  var enterCancelledHook = isAppear ? (appearCancelled || enterCancelled) : enterCancelled

  var expectsCSS = css !== false && !isIE9
  var userWantsControl =
    enterHook &&
    // enterHook may be a bound method which exposes
    // the length of original fn as _length
    (enterHook._length || enterHook.length) > 1

  var cb = el._enterCb = once(function () {
    if (expectsCSS) {
      removeTransitionClass(el, activeClass)
    }
    if (cb.cancelled) {
      if (expectsCSS) {
        removeTransitionClass(el, startClass)
      }
      enterCancelledHook && enterCancelledHook(el)
    } else {
      afterEnterHook && afterEnterHook(el)
    }
    el._enterCb = null
  })

  if (!vnode.data.show) {
    // remove pending leave element on enter by injecting an insert hook
    mergeVNodeHook(vnode.data.hook || (vnode.data.hook = {}), 'insert', function () {
      var parent = el.parentNode
      var pendingNode = parent && parent._pending && parent._pending[vnode.key]
      if (pendingNode && pendingNode.tag === vnode.tag && pendingNode.elm._leaveCb) {
        pendingNode.elm._leaveCb()
      }
      enterHook && enterHook(el, cb)
    })
  }

  // start enter transition
  beforeEnterHook && beforeEnterHook(el)
  if (expectsCSS) {
    addTransitionClass(el, startClass)
    addTransitionClass(el, activeClass)
    nextFrame(function () {
      removeTransitionClass(el, startClass)
      if (!cb.cancelled && !userWantsControl) {
        whenTransitionEnds(el, type, cb)
      }
    })
  }

  if (vnode.data.show) {
    enterHook && enterHook(el, cb)
  }

  if (!expectsCSS && !userWantsControl) {
    cb()
  }
}

function leave (vnode, rm) {
  var el = vnode.elm

  // call enter callback now
  if (el._enterCb) {
    el._enterCb.cancelled = true
    el._enterCb()
  }

  var data = resolveTransition(vnode.data.transition)
  if (!data) {
    return rm()
  }

  /* istanbul ignore if */
  if (el._leaveCb || el.nodeType !== 1) {
    return
  }

  var css = data.css;
  var type = data.type;
  var leaveClass = data.leaveClass;
  var leaveActiveClass = data.leaveActiveClass;
  var beforeLeave = data.beforeLeave;
  var leave = data.leave;
  var afterLeave = data.afterLeave;
  var leaveCancelled = data.leaveCancelled;
  var delayLeave = data.delayLeave;

  var expectsCSS = css !== false && !isIE9
  var userWantsControl =
    leave &&
    // leave hook may be a bound method which exposes
    // the length of original fn as _length
    (leave._length || leave.length) > 1

  var cb = el._leaveCb = once(function () {
    if (el.parentNode && el.parentNode._pending) {
      el.parentNode._pending[vnode.key] = null
    }
    if (expectsCSS) {
      removeTransitionClass(el, leaveActiveClass)
    }
    if (cb.cancelled) {
      if (expectsCSS) {
        removeTransitionClass(el, leaveClass)
      }
      leaveCancelled && leaveCancelled(el)
    } else {
      rm()
      afterLeave && afterLeave(el)
    }
    el._leaveCb = null
  })

  if (delayLeave) {
    delayLeave(performLeave)
  } else {
    performLeave()
  }

  function performLeave () {
    // the delayed leave may have already been cancelled
    if (cb.cancelled) {
      return
    }
    // record leaving element
    if (!vnode.data.show) {
      (el.parentNode._pending || (el.parentNode._pending = {}))[vnode.key] = vnode
    }
    beforeLeave && beforeLeave(el)
    if (expectsCSS) {
      addTransitionClass(el, leaveClass)
      addTransitionClass(el, leaveActiveClass)
      nextFrame(function () {
        removeTransitionClass(el, leaveClass)
        if (!cb.cancelled && !userWantsControl) {
          whenTransitionEnds(el, type, cb)
        }
      })
    }
    leave && leave(el, cb)
    if (!expectsCSS && !userWantsControl) {
      cb()
    }
  }
}

function resolveTransition (def) {
  if (!def) {
    return
  }
  /* istanbul ignore else */
  if (typeof def === 'object') {
    var res = {}
    if (def.css !== false) {
      extend(res, autoCssTransition(def.name || 'v'))
    }
    extend(res, def)
    return res
  } else if (typeof def === 'string') {
    return autoCssTransition(def)
  }
}

var autoCssTransition = cached(function (name) {
  return {
    enterClass: (name + "-enter"),
    leaveClass: (name + "-leave"),
    appearClass: (name + "-enter"),
    enterActiveClass: (name + "-enter-active"),
    leaveActiveClass: (name + "-leave-active"),
    appearActiveClass: (name + "-enter-active")
  }
})

function once (fn) {
  var called = false
  return function () {
    if (!called) {
      called = true
      fn()
    }
  }
}

var transition = inBrowser ? {
  create: function create (_, vnode) {
    if (!vnode.data.show) {
      enter(vnode)
    }
  },
  remove: function remove (vnode, rm) {
    /* istanbul ignore else */
    if (!vnode.data.show) {
      leave(vnode, rm)
    } else {
      rm()
    }
  }
} : {}

var platformModules = [
  attrs,
  klass,
  events,
  domProps,
  style,
  transition
]

/*  */

// the directive module should be applied last, after all
// built-in modules have been applied.
var modules = platformModules.concat(baseModules)

var patch = createPatchFunction({ nodeOps: nodeOps, modules: modules })

/**
 * Not type checking this file because flow doesn't like attaching
 * properties to Elements.
 */

var modelableTagRE = /^input|select|textarea|vue-component-[0-9]+(-[0-9a-zA-Z_\-]*)?$/

/* istanbul ignore if */
if (isIE9) {
  // http://www.matts411.com/post/internet-explorer-9-oninput/
  document.addEventListener('selectionchange', function () {
    var el = document.activeElement
    if (el && el.vmodel) {
      trigger(el, 'input')
    }
  })
}

var model = {
  bind: function bind (el, binding, vnode) {
    if (process.env.NODE_ENV !== 'production') {
      if (!modelableTagRE.test(vnode.tag)) {
        warn(
          "v-model is not supported on element type: <" + (vnode.tag) + ">. " +
          'If you are working with contenteditable, it\'s recommended to ' +
          'wrap a library dedicated for that purpose inside a custom component.',
          vnode.context
        )
      }
    }
    if (vnode.tag === 'select') {
      setSelected(el, binding, vnode.context)
    } else {
      if (!isAndroid) {
        el.addEventListener('compositionstart', onCompositionStart)
        el.addEventListener('compositionend', onCompositionEnd)
      }
      /* istanbul ignore if */
      if (isIE9) {
        el.vmodel = true
      }
    }
  },
  componentUpdated: function componentUpdated (el, binding, vnode) {
    if (vnode.tag === 'select') {
      setSelected(el, binding, vnode.context)
      // in case the options rendered by v-for have changed,
      // it's possible that the value is out-of-sync with the rendered options.
      // detect such cases and filter out values that no longer has a matchig
      // option in the DOM.
      var needReset = el.multiple
        ? binding.value.some(function (v) { return hasNoMatchingOption(v, el.options); })
        : hasNoMatchingOption(binding.value, el.options)
      if (needReset) {
        trigger(el, 'change')
      }
    }
  }
}

function setSelected (el, binding, vm) {
  var value = binding.value
  var isMultiple = el.multiple
  if (isMultiple && !Array.isArray(value)) {
    process.env.NODE_ENV !== 'production' && warn(
      "<select multiple v-model=\"" + (binding.expression) + "\"> " +
      "expects an Array value for its binding, but got " + (Object.prototype.toString.call(value).slice(8, -1)),
      vm
    )
    return
  }
  var selected, option
  for (var i = 0, l = el.options.length; i < l; i++) {
    option = el.options[i]
    if (isMultiple) {
      selected = value.indexOf(getValue(option)) > -1
      if (option.selected !== selected) {
        option.selected = selected
      }
    } else {
      if (getValue(option) === value) {
        if (el.selectedIndex !== i) {
          el.selectedIndex = i
        }
        return
      }
    }
  }
  if (!isMultiple) {
    el.selectedIndex = -1
  }
}

function hasNoMatchingOption (value, options) {
  for (var i = 0, l = options.length; i < l; i++) {
    if (getValue(options[i]) === value) {
      return false
    }
  }
  return true
}

function getValue (option) {
  return '_value' in option
    ? option._value
    : option.value || option.text
}

function onCompositionStart (e) {
  e.target.composing = true
}

function onCompositionEnd (e) {
  e.target.composing = false
  trigger(e.target, 'input')
}

function trigger (el, type) {
  var e = document.createEvent('HTMLEvents')
  e.initEvent(type, true, true)
  el.dispatchEvent(e)
}

/*  */

// recursively search for possible transition defined inside the component root
function locateNode (vnode) {
  return vnode.child && (!vnode.data || !vnode.data.transition)
    ? locateNode(vnode.child._vnode)
    : vnode
}

var show = {
  bind: function bind (el, ref, vnode) {
    var value = ref.value;

    vnode = locateNode(vnode)
    var transition = vnode.data && vnode.data.transition
    if (value && transition && !isIE9) {
      enter(vnode)
    }
    var originalDisplay = el.style.display === 'none' ? '' : el.style.display
    el.style.display = value ? originalDisplay : 'none'
    el.__vOriginalDisplay = originalDisplay
  },
  update: function update (el, ref, vnode) {
    var value = ref.value;
    var oldValue = ref.oldValue;

    /* istanbul ignore if */
    if (value === oldValue) return
    vnode = locateNode(vnode)
    var transition = vnode.data && vnode.data.transition
    if (transition && !isIE9) {
      if (value) {
        enter(vnode)
        el.style.display = el.__vOriginalDisplay
      } else {
        leave(vnode, function () {
          el.style.display = 'none'
        })
      }
    } else {
      el.style.display = value ? el.__vOriginalDisplay : 'none'
    }
  }
}

var platformDirectives = {
  model: model,
  show: show
}

/*  */

// Provides transition support for a single element/component.
// supports transition mode (out-in / in-out)

var transitionProps = {
  name: String,
  appear: Boolean,
  css: Boolean,
  mode: String,
  type: String,
  enterClass: String,
  leaveClass: String,
  enterActiveClass: String,
  leaveActiveClass: String,
  appearClass: String,
  appearActiveClass: String
}

// in case the child is also an abstract component, e.g. <keep-alive>
// we want to recrusively retrieve the real component to be rendered
function getRealChild (vnode) {
  var compOptions = vnode && vnode.componentOptions
  if (compOptions && compOptions.Ctor.options.abstract) {
    return getRealChild(getFirstComponentChild(compOptions.children))
  } else {
    return vnode
  }
}

function extractTransitionData (comp) {
  var data = {}
  var options = comp.$options
  // props
  for (var key in options.propsData) {
    data[key] = comp[key]
  }
  // events.
  // extract listeners and pass them directly to the transition methods
  var listeners = options._parentListeners
  for (var key$1 in listeners) {
    data[camelize(key$1)] = listeners[key$1].fn
  }
  return data
}

function placeholder (h, rawChild) {
  return /\d-keep-alive$/.test(rawChild.tag)
    ? h('keep-alive')
    : null
}

function hasParentTransition (vnode) {
  while ((vnode = vnode.parent)) {
    if (vnode.data.transition) {
      return true
    }
  }
}

var Transition = {
  name: 'transition',
  props: transitionProps,
  abstract: true,
  render: function render (h) {
    var this$1 = this;

    var children = this.$slots.default
    if (!children) {
      return
    }

    // filter out text nodes (possible whitespaces)
    children = children.filter(function (c) { return c.tag; })
    /* istanbul ignore if */
    if (!children.length) {
      return
    }

    // warn multiple elements
    if (process.env.NODE_ENV !== 'production' && children.length > 1) {
      warn(
        '<transition> can only be used on a single element. Use ' +
        '<transition-group> for lists.',
        this.$parent
      )
    }

    var mode = this.mode

    // warn invalid mode
    if (process.env.NODE_ENV !== 'production' &&
        mode && mode !== 'in-out' && mode !== 'out-in') {
      warn(
        'invalid <transition> mode: ' + mode,
        this.$parent
      )
    }

    var rawChild = children[0]

    // if this is a component root node and the component's
    // parent container node also has transition, skip.
    if (hasParentTransition(this.$vnode)) {
      return rawChild
    }

    // apply transition data to child
    // use getRealChild() to ignore abstract components e.g. keep-alive
    var child = getRealChild(rawChild)
    /* istanbul ignore if */
    if (!child) {
      return rawChild
    }

    if (this._leaving) {
      return placeholder(h, rawChild)
    }

    child.key = child.key == null
      ? ("__v" + (child.tag + this._uid) + "__")
      : child.key
    var data = (child.data || (child.data = {})).transition = extractTransitionData(this)
    var oldRawChild = this._vnode
    var oldChild = getRealChild(oldRawChild)

    // mark v-show
    // so that the transition module can hand over the control to the directive
    if (child.data.directives && child.data.directives.some(function (d) { return d.name === 'show'; })) {
      child.data.show = true
    }

    if (oldChild && oldChild.data && oldChild.key !== child.key) {
      // replace old child transition data with fresh one
      // important for dynamic transitions!
      var oldData = oldChild.data.transition = extend({}, data)

      // handle transition mode
      if (mode === 'out-in') {
        // return placeholder node and queue update when leave finishes
        this._leaving = true
        mergeVNodeHook(oldData, 'afterLeave', function () {
          this$1._leaving = false
          this$1.$forceUpdate()
        })
        return placeholder(h, rawChild)
      } else if (mode === 'in-out') {
        var delayedLeave
        var performLeave = function () { delayedLeave() }
        mergeVNodeHook(data, 'afterEnter', performLeave)
        mergeVNodeHook(data, 'enterCancelled', performLeave)
        mergeVNodeHook(oldData, 'delayLeave', function (leave) {
          delayedLeave = leave
        })
      }
    }

    return rawChild
  }
}

/*  */

// Provides transition support for list items.
// supports move transitions using the FLIP technique.

// Because the vdom's children update algorithm is "unstable" - i.e.
// it doesn't guarantee the relative positioning of removed elements,
// we force transition-group to update its children into two passes:
// in the first pass, we remove all nodes that need to be removed,
// triggering their leaving transition; in the second pass, we insert/move
// into the final disired state. This way in the second pass removed
// nodes will remain where they should be.

var props = extend({
  tag: String,
  moveClass: String
}, transitionProps)

delete props.mode

var TransitionGroup = {
  props: props,

  render: function render (h) {
    var tag = this.tag || this.$vnode.data.tag || 'span'
    var map = Object.create(null)
    var prevChildren = this.prevChildren = this.children
    var rawChildren = this.$slots.default || []
    var children = this.children = []
    var transitionData = extractTransitionData(this)

    for (var i = 0; i < rawChildren.length; i++) {
      var c = rawChildren[i]
      if (c.tag) {
        if (c.key != null && String(c.key).indexOf('__vlist') !== 0) {
          children.push(c)
          map[c.key] = c
          ;(c.data || (c.data = {})).transition = transitionData
        } else if (process.env.NODE_ENV !== 'production') {
          var opts = c.componentOptions
          var name = opts
            ? (opts.Ctor.options.name || opts.tag)
            : c.tag
          warn(("<transition-group> children must be keyed: <" + name + ">"))
        }
      }
    }

    if (prevChildren) {
      var kept = []
      var removed = []
      for (var i$1 = 0; i$1 < prevChildren.length; i$1++) {
        var c$1 = prevChildren[i$1]
        c$1.data.transition = transitionData
        c$1.data.pos = c$1.elm.getBoundingClientRect()
        if (map[c$1.key]) {
          kept.push(c$1)
        } else {
          removed.push(c$1)
        }
      }
      this.kept = h(tag, null, kept)
      this.removed = removed
    }

    return h(tag, null, children)
  },

  beforeUpdate: function beforeUpdate () {
    // force removing pass
    this.__patch__(
      this._vnode,
      this.kept,
      false, // hydrating
      true // removeOnly (!important, avoids unnecessary moves)
    )
    this._vnode = this.kept
  },

  updated: function updated () {
    var children = this.prevChildren
    var moveClass = this.moveClass || (this.name + '-move')
    if (!children.length || !this.hasMove(children[0].elm, moveClass)) {
      return
    }

    children.forEach(function (c) {
      /* istanbul ignore if */
      if (c.elm._moveCb) {
        c.elm._moveCb()
      }
      /* istanbul ignore if */
      if (c.elm._enterCb) {
        c.elm._enterCb()
      }
      var oldPos = c.data.pos
      var newPos = c.data.pos = c.elm.getBoundingClientRect()
      var dx = oldPos.left - newPos.left
      var dy = oldPos.top - newPos.top
      if (dx || dy) {
        c.data.moved = true
        var s = c.elm.style
        s.transform = s.WebkitTransform = "translate(" + dx + "px," + dy + "px)"
        s.transitionDuration = '0s'
      }
    })

    // force reflow to put everything in position
    var f = document.body.offsetHeight // eslint-disable-line

    children.forEach(function (c) {
      if (c.data.moved) {
        var el = c.elm
        var s = el.style
        addTransitionClass(el, moveClass)
        s.transform = s.WebkitTransform = s.transitionDuration = ''
        el._moveDest = c.data.pos
        el.addEventListener(transitionEndEvent, el._moveCb = function cb (e) {
          if (!e || /transform$/.test(e.propertyName)) {
            el.removeEventListener(transitionEndEvent, cb)
            el._moveCb = null
            removeTransitionClass(el, moveClass)
          }
        })
      }
    })
  },

  methods: {
    hasMove: function hasMove (el, moveClass) {
      /* istanbul ignore if */
      if (!hasTransition) {
        return false
      }
      if (this._hasMove != null) {
        return this._hasMove
      }
      addTransitionClass(el, moveClass)
      var info = getTransitionInfo(el)
      removeTransitionClass(el, moveClass)
      return (this._hasMove = info.hasTransform)
    }
  }
}

var platformComponents = {
  Transition: Transition,
  TransitionGroup: TransitionGroup
}

/*  */

// install platform specific utils
Vue.config.isUnknownElement = isUnknownElement
Vue.config.isReservedTag = isReservedTag
Vue.config.getTagNamespace = getTagNamespace
Vue.config.mustUseProp = mustUseProp

// install platform runtime directives & components
extend(Vue.options.directives, platformDirectives)
extend(Vue.options.components, platformComponents)

// install platform patch function
Vue.prototype.__patch__ = config._isServer ? noop : patch

// wrap mount
Vue.prototype.$mount = function (
  el,
  hydrating
) {
  el = el && !config._isServer ? query(el) : undefined
  return this._mount(el, hydrating)
}

// devtools global hook
/* istanbul ignore next */
setTimeout(function () {
  if (config.devtools) {
    if (devtools) {
      devtools.emit('init', Vue)
    } else if (
      process.env.NODE_ENV !== 'production' &&
      inBrowser && /Chrome\/\d+/.test(window.navigator.userAgent)
    ) {
      console.log(
        'Download the Vue Devtools for a better development experience:\n' +
        'https://github.com/vuejs/vue-devtools'
      )
    }
  }
}, 0)

module.exports = Vue;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(13), __webpack_require__(10)))

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* unused harmony export assign */
/* harmony export (binding) */ __webpack_require__.d(exports, "b", function() { return values; });
/* unused harmony export capitalize */
/* unused harmony export remove */
/* harmony export (immutable) */ exports["c"] = clamp;
/* harmony export (immutable) */ exports["a"] = mapToObject;
/* unused harmony export pairs */
var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _marked = [pairs].map(regeneratorRuntime.mark);

var assign = Object.assign || function assign(base) {
  for (var _len = arguments.length, rest = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    rest[_key - 1] = arguments[_key];
  }

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = rest[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var obj = _step.value;

      for (var field in obj) {
        base[field] = obj[field];
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return base;
};

var values = Object.values || function values(obj) {
  var result = [];
  for (var field in obj) {
    result.push(obj[field]);
  }
  return result;
};

// uppercase the first letter of a string and lowercase the rest
function capitalize(text) {
  return text.substring(0, 1).toLocaleUpperCase() + text.substring(1).toLocaleLowerCase();
}

// remove an element from an array
function remove(array, item) {
  return array.filter(function (v) {
    return v !== item;
  });
}

// clamp a number between an upper and lower bound
function clamp(n, min, max) {
  return n < min ? min : n > max ? max : n;
}

// map an array to object keys/values
function mapToObject(array, func) {
  var result = {};
  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = array[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var _item = _step2.value;

      var _func = func(_item);

      var _func2 = _slicedToArray(_func, 2);

      var _key2 = _func2[0];
      var value = _func2[1];

      result[_key2] = value;
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2.return) {
        _iterator2.return();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }

  return result;
}

/* eslint no-undef: off */
function pairs(obj) {
  var _key3;

  return regeneratorRuntime.wrap(function pairs$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.t0 = regeneratorRuntime.keys(obj);

        case 1:
          if ((_context.t1 = _context.t0()).done) {
            _context.next = 7;
            break;
          }

          _key3 = _context.t1.value;
          _context.next = 5;
          return [_key3, obj[_key3]];

        case 5:
          _context.next = 1;
          break;

        case 7:
        case "end":
          return _context.stop();
      }
    }
  }, _marked[0], this);
}

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return state; });


var state = {
  appState: 'setup',

  account: '',
  ticket: '',

  userCharacters: [],
  identity: '',

  socket: null,

  onlineCharacters: {},

  friends: {},
  bookmarks: {},
  ignored: {},
  admins: {},

  publicChannelList: [],
  privateChannelList: [],

  channels: {},
  privateChats: {},

  chatTabs: [],
  characterMenuFocus: null,

  notifications: []
};

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__

/* styles */
__webpack_require__(84)

/* script */
__vue_exports__ = __webpack_require__(42)

/* template */
var __vue_template__ = __webpack_require__(125)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (
  typeof __vue_exports__.default === "object" ||
  typeof __vue_exports__.default === "function"
) {
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}
__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns
__vue_options__._scopeId = "data-v-14"

module.exports = __vue_exports__


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__

/* styles */
__webpack_require__(98)

/* script */
__vue_exports__ = __webpack_require__(44)

/* template */
var __vue_template__ = __webpack_require__(139)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (
  typeof __vue_exports__.default === "object" ||
  typeof __vue_exports__.default === "function"
) {
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}
__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns
__vue_options__._scopeId = "data-v-6"

module.exports = __vue_exports__


/***/ },
/* 10 */
/***/ function(module, exports) {

var g;

// This works in non-strict mode
g = (function() { return this; })();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__lib_f_list__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_url__ = __webpack_require__(102);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_url___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_url__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_path__ = __webpack_require__(73);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_path___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_path__);
/* harmony export (immutable) */ exports["a"] = parseBBC;




function parseBBC(input) {
  input = input.replace(/\b((?:http)(?:s)?(?::\/\/)[^\s\}\]\)]+)/gi, function (match, url, offset) {
    var behind = input.substring(offset - 5, offset);
    if (behind !== '[url]' && behind !== '[url=') {
      return formatLink(url, url);
    }
    return match;
  });

  var tags = {
    i: /(?:\[i])([^]*?)(?:\[\/i])/gi,
    b: /(?:\[b])([^]*?)(?:\[\/b])/gi,
    u: /(?:\[u])([^]*?)(?:\[\/u])/gi,
    s: /(?:\[s])([^]*?)(?:\[\/s])/gi,
    sup: /(?:\[sup])([^]*?)(?:\[\/sup])/gi,
    sub: /(?:\[sub])([^]*?)(?:\[\/sub])/gi,
    color: /(?:\[color=)([a-z]+)(?:])([^]*?)(?:\[\/color])/gi,
    url: /(?:\[url])([^]*?)(?:\[\/url])/gi,
    urlhref: /(?:\[url=)(.+?)(?:])([^]*?)(?:\[\/url])/gi,
    channel: /(?:\[channel])([^]+?)(?:\[\/channel])/gi,
    session: /(?:\[session=)(.+?)(?:])([^]*)(?:\[\/session])/gi,
    icon: /(?:\[icon])(.+?)(?:\[\/icon])/gi,
    user: /(?:\[user])(.+?)(?:\[\/user])/gi,
    eicon: /(?:\[eicon])(.+?)(?:\[\/eicon])/gi
  };

  var replacers = {
    i: function i(_, text) {
      return '<span class=\'bbc-italic\'>' + parseBBC(text) + '</span>';
    },
    b: function b(_, text) {
      return '<span class=\'bbc-bold\'>' + parseBBC(text) + '</span>';
    },
    u: function u(_, text) {
      return '<span class=\'bbc-underline\'>' + parseBBC(text) + '</span>';
    },
    s: function s(_, text) {
      return '<span class=\'bbc-strike\'>' + parseBBC(text) + '</span>';
    },
    sup: function sup(_, text) {
      return '<span class=\'bbc-super\'>' + parseBBC(text) + '</span>';
    },
    sub: function sub(_, text) {
      return '<span class=\'bbc-sub\'>' + parseBBC(text) + '</span>';
    },
    color: function color(_, _color, text) {
      return '<span class=\'bbc-color-' + _color + '\'>' + parseBBC(text) + '</span>';
    },
    url: function url(_, _url) {
      return formatLink(_url, _url);
    },
    urlhref: function urlhref(_, url, text) {
      return formatLink(url, text);
    },
    channel: function channel(_, _channel) {
      return formatPublicChannel(_channel);
    },
    session: function session(_, name, id) {
      return formatPrivateChannel(id, name);
    },
    icon: function icon(_, user) {
      return formatUserIcon(user);
    },
    user: function user(_, _user) {
      return formatUserIcon(_user);
    },
    eicon: function eicon(_, icon) {
      return formatExtendedIcon(icon);
    }
  };

  for (var tag in tags) {
    var exp = tags[tag];
    var replacer = replacers[tag];
    input = input.replace(exp, replacer);
  }

  return input;
}

function formatUserIcon(name) {
  var href = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__lib_f_list__["h" /* getProfileURL */])(name);
  var avatar = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__lib_f_list__["g" /* getAvatarURL */])(name);
  var style = 'background-image: url(' + avatar + ')';
  return '<a class=\'bbc-icon\' href=\'' + href + '\' target=\'_blank\' style=\'' + style + '\'></a>';
}

function formatExtendedIcon(icon) {
  var iconURL = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__lib_f_list__["i" /* getExtendedIcon */])(icon);
  return '<div class=\'bbc-icon\' style=\'background-image: url(' + iconURL + ')\'></div>';
}

function formatPublicChannel(id) {
  return '<a href=\'#\' class=\'bbc-channel\' data-channel=\'' + id + '\'>' + ('<i class=\'mdi mdi-earth\'></i> ' + id) + '</a>';
}

function formatPrivateChannel(id, name) {
  return '<a href=\'#\' class=\'bbc-channel\' data-channel=\'' + id + '\'>' + ('<i class=\'mdi mdi-key-variant\'></i> ' + name + '</a>');
}

function formatLink(url, text) {
  var imageExtensions = ['.png', '.jpg', '.jpeg', '.svg', '.gif'];

  var _parseURL = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_url__["parse"])(url);

  var pathname = _parseURL.pathname;

  var ext = pathname ? __WEBPACK_IMPORTED_MODULE_2_path___default.a.extname(pathname) : '';
  var icon = imageExtensions.includes(ext) ? 'image' : 'link-variant';

  return '<a class=\'bbc-link\' href=\'' + url + '\' target=\'_blank\'>' + ('<i class=\'mdi mdi-' + icon + '\'></i> ' + text + '</a>');
}

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {var require;var require;/*!
    localForage -- Offline Storage, Improved
    Version 1.4.2
    https://mozilla.github.io/localForage
    (c) 2013-2015 Mozilla, Apache License 2.0
*/
(function(f){if(true){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.localforage = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return require(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw (f.code="MODULE_NOT_FOUND", f)}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
'use strict';
var immediate = _dereq_(2);

/* istanbul ignore next */
function INTERNAL() {}

var handlers = {};

var REJECTED = ['REJECTED'];
var FULFILLED = ['FULFILLED'];
var PENDING = ['PENDING'];

module.exports = exports = Promise;

function Promise(resolver) {
  if (typeof resolver !== 'function') {
    throw new TypeError('resolver must be a function');
  }
  this.state = PENDING;
  this.queue = [];
  this.outcome = void 0;
  if (resolver !== INTERNAL) {
    safelyResolveThenable(this, resolver);
  }
}

Promise.prototype["catch"] = function (onRejected) {
  return this.then(null, onRejected);
};
Promise.prototype.then = function (onFulfilled, onRejected) {
  if (typeof onFulfilled !== 'function' && this.state === FULFILLED ||
    typeof onRejected !== 'function' && this.state === REJECTED) {
    return this;
  }
  var promise = new this.constructor(INTERNAL);
  if (this.state !== PENDING) {
    var resolver = this.state === FULFILLED ? onFulfilled : onRejected;
    unwrap(promise, resolver, this.outcome);
  } else {
    this.queue.push(new QueueItem(promise, onFulfilled, onRejected));
  }

  return promise;
};
function QueueItem(promise, onFulfilled, onRejected) {
  this.promise = promise;
  if (typeof onFulfilled === 'function') {
    this.onFulfilled = onFulfilled;
    this.callFulfilled = this.otherCallFulfilled;
  }
  if (typeof onRejected === 'function') {
    this.onRejected = onRejected;
    this.callRejected = this.otherCallRejected;
  }
}
QueueItem.prototype.callFulfilled = function (value) {
  handlers.resolve(this.promise, value);
};
QueueItem.prototype.otherCallFulfilled = function (value) {
  unwrap(this.promise, this.onFulfilled, value);
};
QueueItem.prototype.callRejected = function (value) {
  handlers.reject(this.promise, value);
};
QueueItem.prototype.otherCallRejected = function (value) {
  unwrap(this.promise, this.onRejected, value);
};

function unwrap(promise, func, value) {
  immediate(function () {
    var returnValue;
    try {
      returnValue = func(value);
    } catch (e) {
      return handlers.reject(promise, e);
    }
    if (returnValue === promise) {
      handlers.reject(promise, new TypeError('Cannot resolve promise with itself'));
    } else {
      handlers.resolve(promise, returnValue);
    }
  });
}

handlers.resolve = function (self, value) {
  var result = tryCatch(getThen, value);
  if (result.status === 'error') {
    return handlers.reject(self, result.value);
  }
  var thenable = result.value;

  if (thenable) {
    safelyResolveThenable(self, thenable);
  } else {
    self.state = FULFILLED;
    self.outcome = value;
    var i = -1;
    var len = self.queue.length;
    while (++i < len) {
      self.queue[i].callFulfilled(value);
    }
  }
  return self;
};
handlers.reject = function (self, error) {
  self.state = REJECTED;
  self.outcome = error;
  var i = -1;
  var len = self.queue.length;
  while (++i < len) {
    self.queue[i].callRejected(error);
  }
  return self;
};

function getThen(obj) {
  // Make sure we only access the accessor once as required by the spec
  var then = obj && obj.then;
  if (obj && typeof obj === 'object' && typeof then === 'function') {
    return function appyThen() {
      then.apply(obj, arguments);
    };
  }
}

function safelyResolveThenable(self, thenable) {
  // Either fulfill, reject or reject with error
  var called = false;
  function onError(value) {
    if (called) {
      return;
    }
    called = true;
    handlers.reject(self, value);
  }

  function onSuccess(value) {
    if (called) {
      return;
    }
    called = true;
    handlers.resolve(self, value);
  }

  function tryToUnwrap() {
    thenable(onSuccess, onError);
  }

  var result = tryCatch(tryToUnwrap);
  if (result.status === 'error') {
    onError(result.value);
  }
}

function tryCatch(func, value) {
  var out = {};
  try {
    out.value = func(value);
    out.status = 'success';
  } catch (e) {
    out.status = 'error';
    out.value = e;
  }
  return out;
}

exports.resolve = resolve;
function resolve(value) {
  if (value instanceof this) {
    return value;
  }
  return handlers.resolve(new this(INTERNAL), value);
}

exports.reject = reject;
function reject(reason) {
  var promise = new this(INTERNAL);
  return handlers.reject(promise, reason);
}

exports.all = all;
function all(iterable) {
  var self = this;
  if (Object.prototype.toString.call(iterable) !== '[object Array]') {
    return this.reject(new TypeError('must be an array'));
  }

  var len = iterable.length;
  var called = false;
  if (!len) {
    return this.resolve([]);
  }

  var values = new Array(len);
  var resolved = 0;
  var i = -1;
  var promise = new this(INTERNAL);

  while (++i < len) {
    allResolver(iterable[i], i);
  }
  return promise;
  function allResolver(value, i) {
    self.resolve(value).then(resolveFromAll, function (error) {
      if (!called) {
        called = true;
        handlers.reject(promise, error);
      }
    });
    function resolveFromAll(outValue) {
      values[i] = outValue;
      if (++resolved === len && !called) {
        called = true;
        handlers.resolve(promise, values);
      }
    }
  }
}

exports.race = race;
function race(iterable) {
  var self = this;
  if (Object.prototype.toString.call(iterable) !== '[object Array]') {
    return this.reject(new TypeError('must be an array'));
  }

  var len = iterable.length;
  var called = false;
  if (!len) {
    return this.resolve([]);
  }

  var i = -1;
  var promise = new this(INTERNAL);

  while (++i < len) {
    resolver(iterable[i]);
  }
  return promise;
  function resolver(value) {
    self.resolve(value).then(function (response) {
      if (!called) {
        called = true;
        handlers.resolve(promise, response);
      }
    }, function (error) {
      if (!called) {
        called = true;
        handlers.reject(promise, error);
      }
    });
  }
}

},{"2":2}],2:[function(_dereq_,module,exports){
(function (global){
'use strict';
var Mutation = global.MutationObserver || global.WebKitMutationObserver;

var scheduleDrain;

{
  if (Mutation) {
    var called = 0;
    var observer = new Mutation(nextTick);
    var element = global.document.createTextNode('');
    observer.observe(element, {
      characterData: true
    });
    scheduleDrain = function () {
      element.data = (called = ++called % 2);
    };
  } else if (!global.setImmediate && typeof global.MessageChannel !== 'undefined') {
    var channel = new global.MessageChannel();
    channel.port1.onmessage = nextTick;
    scheduleDrain = function () {
      channel.port2.postMessage(0);
    };
  } else if ('document' in global && 'onreadystatechange' in global.document.createElement('script')) {
    scheduleDrain = function () {

      // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
      // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
      var scriptEl = global.document.createElement('script');
      scriptEl.onreadystatechange = function () {
        nextTick();

        scriptEl.onreadystatechange = null;
        scriptEl.parentNode.removeChild(scriptEl);
        scriptEl = null;
      };
      global.document.documentElement.appendChild(scriptEl);
    };
  } else {
    scheduleDrain = function () {
      setTimeout(nextTick, 0);
    };
  }
}

var draining;
var queue = [];
//named nextTick for less confusing stack traces
function nextTick() {
  draining = true;
  var i, oldQueue;
  var len = queue.length;
  while (len) {
    oldQueue = queue;
    queue = [];
    i = -1;
    while (++i < len) {
      oldQueue[i]();
    }
    len = queue.length;
  }
  draining = false;
}

module.exports = immediate;
function immediate(task) {
  if (queue.push(task) === 1 && !draining) {
    scheduleDrain();
  }
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],3:[function(_dereq_,module,exports){
(function (global){
'use strict';
if (typeof global.Promise !== 'function') {
  global.Promise = _dereq_(1);
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"1":1}],4:[function(_dereq_,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function getIDB() {
    /* global indexedDB,webkitIndexedDB,mozIndexedDB,OIndexedDB,msIndexedDB */
    if (typeof indexedDB !== 'undefined') {
        return indexedDB;
    }
    if (typeof webkitIndexedDB !== 'undefined') {
        return webkitIndexedDB;
    }
    if (typeof mozIndexedDB !== 'undefined') {
        return mozIndexedDB;
    }
    if (typeof OIndexedDB !== 'undefined') {
        return OIndexedDB;
    }
    if (typeof msIndexedDB !== 'undefined') {
        return msIndexedDB;
    }
}

var idb = getIDB();

function isIndexedDBValid() {
    try {
        // Initialize IndexedDB; fall back to vendor-prefixed versions
        // if needed.
        if (!idb) {
            return false;
        }
        // We mimic PouchDB here; just UA test for Safari (which, as of
        // iOS 8/Yosemite, doesn't properly support IndexedDB).
        // IndexedDB support is broken and different from Blink's.
        // This is faster than the test case (and it's sync), so we just
        // do this. *SIGH*
        // http://bl.ocks.org/nolanlawson/raw/c83e9039edf2278047e9/
        //
        // We test for openDatabase because IE Mobile identifies itself
        // as Safari. Oh the lulz...
        if (typeof openDatabase !== 'undefined' && typeof navigator !== 'undefined' && navigator.userAgent && /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent)) {
            return false;
        }

        return idb && typeof idb.open === 'function' &&
        // Some Samsung/HTC Android 4.0-4.3 devices
        // have older IndexedDB specs; if this isn't available
        // their IndexedDB is too old for us to use.
        // (Replaces the onupgradeneeded test.)
        typeof IDBKeyRange !== 'undefined';
    } catch (e) {
        return false;
    }
}

function isWebSQLValid() {
    return typeof openDatabase === 'function';
}

function isLocalStorageValid() {
    try {
        return typeof localStorage !== 'undefined' && 'setItem' in localStorage && localStorage.setItem;
    } catch (e) {
        return false;
    }
}

// Abstracts constructing a Blob object, so it also works in older
// browsers that don't support the native Blob constructor. (i.e.
// old QtWebKit versions, at least).
// Abstracts constructing a Blob object, so it also works in older
// browsers that don't support the native Blob constructor. (i.e.
// old QtWebKit versions, at least).
function createBlob(parts, properties) {
    /* global BlobBuilder,MSBlobBuilder,MozBlobBuilder,WebKitBlobBuilder */
    parts = parts || [];
    properties = properties || {};
    try {
        return new Blob(parts, properties);
    } catch (e) {
        if (e.name !== 'TypeError') {
            throw e;
        }
        var Builder = typeof BlobBuilder !== 'undefined' ? BlobBuilder : typeof MSBlobBuilder !== 'undefined' ? MSBlobBuilder : typeof MozBlobBuilder !== 'undefined' ? MozBlobBuilder : WebKitBlobBuilder;
        var builder = new Builder();
        for (var i = 0; i < parts.length; i += 1) {
            builder.append(parts[i]);
        }
        return builder.getBlob(properties.type);
    }
}

// This is CommonJS because lie is an external dependency, so Rollup
// can just ignore it.
if (typeof Promise === 'undefined' && typeof _dereq_ !== 'undefined') {
    _dereq_(3);
}
var Promise$1 = Promise;

function executeCallback(promise, callback) {
    if (callback) {
        promise.then(function (result) {
            callback(null, result);
        }, function (error) {
            callback(error);
        });
    }
}

// Some code originally from async_storage.js in
// [Gaia](https://github.com/mozilla-b2g/gaia).

var DETECT_BLOB_SUPPORT_STORE = 'local-forage-detect-blob-support';
var supportsBlobs;
var dbContexts;

// Transform a binary string to an array buffer, because otherwise
// weird stuff happens when you try to work with the binary string directly.
// It is known.
// From http://stackoverflow.com/questions/14967647/ (continues on next line)
// encode-decode-image-with-base64-breaks-image (2013-04-21)
function _binStringToArrayBuffer(bin) {
    var length = bin.length;
    var buf = new ArrayBuffer(length);
    var arr = new Uint8Array(buf);
    for (var i = 0; i < length; i++) {
        arr[i] = bin.charCodeAt(i);
    }
    return buf;
}

//
// Blobs are not supported in all versions of IndexedDB, notably
// Chrome <37 and Android <5. In those versions, storing a blob will throw.
//
// Various other blob bugs exist in Chrome v37-42 (inclusive).
// Detecting them is expensive and confusing to users, and Chrome 37-42
// is at very low usage worldwide, so we do a hacky userAgent check instead.
//
// content-type bug: https://code.google.com/p/chromium/issues/detail?id=408120
// 404 bug: https://code.google.com/p/chromium/issues/detail?id=447916
// FileReader bug: https://code.google.com/p/chromium/issues/detail?id=447836
//
// Code borrowed from PouchDB. See:
// https://github.com/pouchdb/pouchdb/blob/9c25a23/src/adapters/idb/blobSupport.js
//
function _checkBlobSupportWithoutCaching(txn) {
    return new Promise$1(function (resolve) {
        var blob = createBlob(['']);
        txn.objectStore(DETECT_BLOB_SUPPORT_STORE).put(blob, 'key');

        txn.onabort = function (e) {
            // If the transaction aborts now its due to not being able to
            // write to the database, likely due to the disk being full
            e.preventDefault();
            e.stopPropagation();
            resolve(false);
        };

        txn.oncomplete = function () {
            var matchedChrome = navigator.userAgent.match(/Chrome\/(\d+)/);
            var matchedEdge = navigator.userAgent.match(/Edge\//);
            // MS Edge pretends to be Chrome 42:
            // https://msdn.microsoft.com/en-us/library/hh869301%28v=vs.85%29.aspx
            resolve(matchedEdge || !matchedChrome || parseInt(matchedChrome[1], 10) >= 43);
        };
    })["catch"](function () {
        return false; // error, so assume unsupported
    });
}

function _checkBlobSupport(idb) {
    if (typeof supportsBlobs === 'boolean') {
        return Promise$1.resolve(supportsBlobs);
    }
    return _checkBlobSupportWithoutCaching(idb).then(function (value) {
        supportsBlobs = value;
        return supportsBlobs;
    });
}

function _deferReadiness(dbInfo) {
    var dbContext = dbContexts[dbInfo.name];

    // Create a deferred object representing the current database operation.
    var deferredOperation = {};

    deferredOperation.promise = new Promise$1(function (resolve) {
        deferredOperation.resolve = resolve;
    });

    // Enqueue the deferred operation.
    dbContext.deferredOperations.push(deferredOperation);

    // Chain its promise to the database readiness.
    if (!dbContext.dbReady) {
        dbContext.dbReady = deferredOperation.promise;
    } else {
        dbContext.dbReady = dbContext.dbReady.then(function () {
            return deferredOperation.promise;
        });
    }
}

function _advanceReadiness(dbInfo) {
    var dbContext = dbContexts[dbInfo.name];

    // Dequeue a deferred operation.
    var deferredOperation = dbContext.deferredOperations.pop();

    // Resolve its promise (which is part of the database readiness
    // chain of promises).
    if (deferredOperation) {
        deferredOperation.resolve();
    }
}

function _getConnection(dbInfo, upgradeNeeded) {
    return new Promise$1(function (resolve, reject) {

        if (dbInfo.db) {
            if (upgradeNeeded) {
                _deferReadiness(dbInfo);
                dbInfo.db.close();
            } else {
                return resolve(dbInfo.db);
            }
        }

        var dbArgs = [dbInfo.name];

        if (upgradeNeeded) {
            dbArgs.push(dbInfo.version);
        }

        var openreq = idb.open.apply(idb, dbArgs);

        if (upgradeNeeded) {
            openreq.onupgradeneeded = function (e) {
                var db = openreq.result;
                try {
                    db.createObjectStore(dbInfo.storeName);
                    if (e.oldVersion <= 1) {
                        // Added when support for blob shims was added
                        db.createObjectStore(DETECT_BLOB_SUPPORT_STORE);
                    }
                } catch (ex) {
                    if (ex.name === 'ConstraintError') {
                        console.warn('The database "' + dbInfo.name + '"' + ' has been upgraded from version ' + e.oldVersion + ' to version ' + e.newVersion + ', but the storage "' + dbInfo.storeName + '" already exists.');
                    } else {
                        throw ex;
                    }
                }
            };
        }

        openreq.onerror = function () {
            reject(openreq.error);
        };

        openreq.onsuccess = function () {
            resolve(openreq.result);
            _advanceReadiness(dbInfo);
        };
    });
}

function _getOriginalConnection(dbInfo) {
    return _getConnection(dbInfo, false);
}

function _getUpgradedConnection(dbInfo) {
    return _getConnection(dbInfo, true);
}

function _isUpgradeNeeded(dbInfo, defaultVersion) {
    if (!dbInfo.db) {
        return true;
    }

    var isNewStore = !dbInfo.db.objectStoreNames.contains(dbInfo.storeName);
    var isDowngrade = dbInfo.version < dbInfo.db.version;
    var isUpgrade = dbInfo.version > dbInfo.db.version;

    if (isDowngrade) {
        // If the version is not the default one
        // then warn for impossible downgrade.
        if (dbInfo.version !== defaultVersion) {
            console.warn('The database "' + dbInfo.name + '"' + ' can\'t be downgraded from version ' + dbInfo.db.version + ' to version ' + dbInfo.version + '.');
        }
        // Align the versions to prevent errors.
        dbInfo.version = dbInfo.db.version;
    }

    if (isUpgrade || isNewStore) {
        // If the store is new then increment the version (if needed).
        // This will trigger an "upgradeneeded" event which is required
        // for creating a store.
        if (isNewStore) {
            var incVersion = dbInfo.db.version + 1;
            if (incVersion > dbInfo.version) {
                dbInfo.version = incVersion;
            }
        }

        return true;
    }

    return false;
}

// encode a blob for indexeddb engines that don't support blobs
function _encodeBlob(blob) {
    return new Promise$1(function (resolve, reject) {
        var reader = new FileReader();
        reader.onerror = reject;
        reader.onloadend = function (e) {
            var base64 = btoa(e.target.result || '');
            resolve({
                __local_forage_encoded_blob: true,
                data: base64,
                type: blob.type
            });
        };
        reader.readAsBinaryString(blob);
    });
}

// decode an encoded blob
function _decodeBlob(encodedBlob) {
    var arrayBuff = _binStringToArrayBuffer(atob(encodedBlob.data));
    return createBlob([arrayBuff], { type: encodedBlob.type });
}

// is this one of our fancy encoded blobs?
function _isEncodedBlob(value) {
    return value && value.__local_forage_encoded_blob;
}

// Specialize the default `ready()` function by making it dependent
// on the current database operations. Thus, the driver will be actually
// ready when it's been initialized (default) *and* there are no pending
// operations on the database (initiated by some other instances).
function _fullyReady(callback) {
    var self = this;

    var promise = self._initReady().then(function () {
        var dbContext = dbContexts[self._dbInfo.name];

        if (dbContext && dbContext.dbReady) {
            return dbContext.dbReady;
        }
    });

    promise.then(callback, callback);
    return promise;
}

// Open the IndexedDB database (automatically creates one if one didn't
// previously exist), using any options set in the config.
function _initStorage(options) {
    var self = this;
    var dbInfo = {
        db: null
    };

    if (options) {
        for (var i in options) {
            dbInfo[i] = options[i];
        }
    }

    // Initialize a singleton container for all running localForages.
    if (!dbContexts) {
        dbContexts = {};
    }

    // Get the current context of the database;
    var dbContext = dbContexts[dbInfo.name];

    // ...or create a new context.
    if (!dbContext) {
        dbContext = {
            // Running localForages sharing a database.
            forages: [],
            // Shared database.
            db: null,
            // Database readiness (promise).
            dbReady: null,
            // Deferred operations on the database.
            deferredOperations: []
        };
        // Register the new context in the global container.
        dbContexts[dbInfo.name] = dbContext;
    }

    // Register itself as a running localForage in the current context.
    dbContext.forages.push(self);

    // Replace the default `ready()` function with the specialized one.
    if (!self._initReady) {
        self._initReady = self.ready;
        self.ready = _fullyReady;
    }

    // Create an array of initialization states of the related localForages.
    var initPromises = [];

    function ignoreErrors() {
        // Don't handle errors here,
        // just makes sure related localForages aren't pending.
        return Promise$1.resolve();
    }

    for (var j = 0; j < dbContext.forages.length; j++) {
        var forage = dbContext.forages[j];
        if (forage !== self) {
            // Don't wait for itself...
            initPromises.push(forage._initReady()["catch"](ignoreErrors));
        }
    }

    // Take a snapshot of the related localForages.
    var forages = dbContext.forages.slice(0);

    // Initialize the connection process only when
    // all the related localForages aren't pending.
    return Promise$1.all(initPromises).then(function () {
        dbInfo.db = dbContext.db;
        // Get the connection or open a new one without upgrade.
        return _getOriginalConnection(dbInfo);
    }).then(function (db) {
        dbInfo.db = db;
        if (_isUpgradeNeeded(dbInfo, self._defaultConfig.version)) {
            // Reopen the database for upgrading.
            return _getUpgradedConnection(dbInfo);
        }
        return db;
    }).then(function (db) {
        dbInfo.db = dbContext.db = db;
        self._dbInfo = dbInfo;
        // Share the final connection amongst related localForages.
        for (var k = 0; k < forages.length; k++) {
            var forage = forages[k];
            if (forage !== self) {
                // Self is already up-to-date.
                forage._dbInfo.db = dbInfo.db;
                forage._dbInfo.version = dbInfo.version;
            }
        }
    });
}

function getItem(key, callback) {
    var self = this;

    // Cast the key to a string, as that's all we can set as a key.
    if (typeof key !== 'string') {
        console.warn(key + ' used as a key, but it is not a string.');
        key = String(key);
    }

    var promise = new Promise$1(function (resolve, reject) {
        self.ready().then(function () {
            var dbInfo = self._dbInfo;
            var store = dbInfo.db.transaction(dbInfo.storeName, 'readonly').objectStore(dbInfo.storeName);
            var req = store.get(key);

            req.onsuccess = function () {
                var value = req.result;
                if (value === undefined) {
                    value = null;
                }
                if (_isEncodedBlob(value)) {
                    value = _decodeBlob(value);
                }
                resolve(value);
            };

            req.onerror = function () {
                reject(req.error);
            };
        })["catch"](reject);
    });

    executeCallback(promise, callback);
    return promise;
}

// Iterate over all items stored in database.
function iterate(iterator, callback) {
    var self = this;

    var promise = new Promise$1(function (resolve, reject) {
        self.ready().then(function () {
            var dbInfo = self._dbInfo;
            var store = dbInfo.db.transaction(dbInfo.storeName, 'readonly').objectStore(dbInfo.storeName);

            var req = store.openCursor();
            var iterationNumber = 1;

            req.onsuccess = function () {
                var cursor = req.result;

                if (cursor) {
                    var value = cursor.value;
                    if (_isEncodedBlob(value)) {
                        value = _decodeBlob(value);
                    }
                    var result = iterator(value, cursor.key, iterationNumber++);

                    if (result !== void 0) {
                        resolve(result);
                    } else {
                        cursor["continue"]();
                    }
                } else {
                    resolve();
                }
            };

            req.onerror = function () {
                reject(req.error);
            };
        })["catch"](reject);
    });

    executeCallback(promise, callback);

    return promise;
}

function setItem(key, value, callback) {
    var self = this;

    // Cast the key to a string, as that's all we can set as a key.
    if (typeof key !== 'string') {
        console.warn(key + ' used as a key, but it is not a string.');
        key = String(key);
    }

    var promise = new Promise$1(function (resolve, reject) {
        var dbInfo;
        self.ready().then(function () {
            dbInfo = self._dbInfo;
            if (value instanceof Blob) {
                return _checkBlobSupport(dbInfo.db).then(function (blobSupport) {
                    if (blobSupport) {
                        return value;
                    }
                    return _encodeBlob(value);
                });
            }
            return value;
        }).then(function (value) {
            var transaction = dbInfo.db.transaction(dbInfo.storeName, 'readwrite');
            var store = transaction.objectStore(dbInfo.storeName);

            // The reason we don't _save_ null is because IE 10 does
            // not support saving the `null` type in IndexedDB. How
            // ironic, given the bug below!
            // See: https://github.com/mozilla/localForage/issues/161
            if (value === null) {
                value = undefined;
            }

            transaction.oncomplete = function () {
                // Cast to undefined so the value passed to
                // callback/promise is the same as what one would get out
                // of `getItem()` later. This leads to some weirdness
                // (setItem('foo', undefined) will return `null`), but
                // it's not my fault localStorage is our baseline and that
                // it's weird.
                if (value === undefined) {
                    value = null;
                }

                resolve(value);
            };
            transaction.onabort = transaction.onerror = function () {
                var err = req.error ? req.error : req.transaction.error;
                reject(err);
            };

            var req = store.put(value, key);
        })["catch"](reject);
    });

    executeCallback(promise, callback);
    return promise;
}

function removeItem(key, callback) {
    var self = this;

    // Cast the key to a string, as that's all we can set as a key.
    if (typeof key !== 'string') {
        console.warn(key + ' used as a key, but it is not a string.');
        key = String(key);
    }

    var promise = new Promise$1(function (resolve, reject) {
        self.ready().then(function () {
            var dbInfo = self._dbInfo;
            var transaction = dbInfo.db.transaction(dbInfo.storeName, 'readwrite');
            var store = transaction.objectStore(dbInfo.storeName);

            // We use a Grunt task to make this safe for IE and some
            // versions of Android (including those used by Cordova).
            // Normally IE won't like `.delete()` and will insist on
            // using `['delete']()`, but we have a build step that
            // fixes this for us now.
            var req = store["delete"](key);
            transaction.oncomplete = function () {
                resolve();
            };

            transaction.onerror = function () {
                reject(req.error);
            };

            // The request will be also be aborted if we've exceeded our storage
            // space.
            transaction.onabort = function () {
                var err = req.error ? req.error : req.transaction.error;
                reject(err);
            };
        })["catch"](reject);
    });

    executeCallback(promise, callback);
    return promise;
}

function clear(callback) {
    var self = this;

    var promise = new Promise$1(function (resolve, reject) {
        self.ready().then(function () {
            var dbInfo = self._dbInfo;
            var transaction = dbInfo.db.transaction(dbInfo.storeName, 'readwrite');
            var store = transaction.objectStore(dbInfo.storeName);
            var req = store.clear();

            transaction.oncomplete = function () {
                resolve();
            };

            transaction.onabort = transaction.onerror = function () {
                var err = req.error ? req.error : req.transaction.error;
                reject(err);
            };
        })["catch"](reject);
    });

    executeCallback(promise, callback);
    return promise;
}

function length(callback) {
    var self = this;

    var promise = new Promise$1(function (resolve, reject) {
        self.ready().then(function () {
            var dbInfo = self._dbInfo;
            var store = dbInfo.db.transaction(dbInfo.storeName, 'readonly').objectStore(dbInfo.storeName);
            var req = store.count();

            req.onsuccess = function () {
                resolve(req.result);
            };

            req.onerror = function () {
                reject(req.error);
            };
        })["catch"](reject);
    });

    executeCallback(promise, callback);
    return promise;
}

function key(n, callback) {
    var self = this;

    var promise = new Promise$1(function (resolve, reject) {
        if (n < 0) {
            resolve(null);

            return;
        }

        self.ready().then(function () {
            var dbInfo = self._dbInfo;
            var store = dbInfo.db.transaction(dbInfo.storeName, 'readonly').objectStore(dbInfo.storeName);

            var advanced = false;
            var req = store.openCursor();
            req.onsuccess = function () {
                var cursor = req.result;
                if (!cursor) {
                    // this means there weren't enough keys
                    resolve(null);

                    return;
                }

                if (n === 0) {
                    // We have the first key, return it if that's what they
                    // wanted.
                    resolve(cursor.key);
                } else {
                    if (!advanced) {
                        // Otherwise, ask the cursor to skip ahead n
                        // records.
                        advanced = true;
                        cursor.advance(n);
                    } else {
                        // When we get here, we've got the nth key.
                        resolve(cursor.key);
                    }
                }
            };

            req.onerror = function () {
                reject(req.error);
            };
        })["catch"](reject);
    });

    executeCallback(promise, callback);
    return promise;
}

function keys(callback) {
    var self = this;

    var promise = new Promise$1(function (resolve, reject) {
        self.ready().then(function () {
            var dbInfo = self._dbInfo;
            var store = dbInfo.db.transaction(dbInfo.storeName, 'readonly').objectStore(dbInfo.storeName);

            var req = store.openCursor();
            var keys = [];

            req.onsuccess = function () {
                var cursor = req.result;

                if (!cursor) {
                    resolve(keys);
                    return;
                }

                keys.push(cursor.key);
                cursor["continue"]();
            };

            req.onerror = function () {
                reject(req.error);
            };
        })["catch"](reject);
    });

    executeCallback(promise, callback);
    return promise;
}

var asyncStorage = {
    _driver: 'asyncStorage',
    _initStorage: _initStorage,
    iterate: iterate,
    getItem: getItem,
    setItem: setItem,
    removeItem: removeItem,
    clear: clear,
    length: length,
    key: key,
    keys: keys
};

// Sadly, the best way to save binary data in WebSQL/localStorage is serializing
// it to Base64, so this is how we store it to prevent very strange errors with less
// verbose ways of binary <-> string data storage.
var BASE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

var BLOB_TYPE_PREFIX = '~~local_forage_type~';
var BLOB_TYPE_PREFIX_REGEX = /^~~local_forage_type~([^~]+)~/;

var SERIALIZED_MARKER = '__lfsc__:';
var SERIALIZED_MARKER_LENGTH = SERIALIZED_MARKER.length;

// OMG the serializations!
var TYPE_ARRAYBUFFER = 'arbf';
var TYPE_BLOB = 'blob';
var TYPE_INT8ARRAY = 'si08';
var TYPE_UINT8ARRAY = 'ui08';
var TYPE_UINT8CLAMPEDARRAY = 'uic8';
var TYPE_INT16ARRAY = 'si16';
var TYPE_INT32ARRAY = 'si32';
var TYPE_UINT16ARRAY = 'ur16';
var TYPE_UINT32ARRAY = 'ui32';
var TYPE_FLOAT32ARRAY = 'fl32';
var TYPE_FLOAT64ARRAY = 'fl64';
var TYPE_SERIALIZED_MARKER_LENGTH = SERIALIZED_MARKER_LENGTH + TYPE_ARRAYBUFFER.length;

function stringToBuffer(serializedString) {
    // Fill the string into a ArrayBuffer.
    var bufferLength = serializedString.length * 0.75;
    var len = serializedString.length;
    var i;
    var p = 0;
    var encoded1, encoded2, encoded3, encoded4;

    if (serializedString[serializedString.length - 1] === '=') {
        bufferLength--;
        if (serializedString[serializedString.length - 2] === '=') {
            bufferLength--;
        }
    }

    var buffer = new ArrayBuffer(bufferLength);
    var bytes = new Uint8Array(buffer);

    for (i = 0; i < len; i += 4) {
        encoded1 = BASE_CHARS.indexOf(serializedString[i]);
        encoded2 = BASE_CHARS.indexOf(serializedString[i + 1]);
        encoded3 = BASE_CHARS.indexOf(serializedString[i + 2]);
        encoded4 = BASE_CHARS.indexOf(serializedString[i + 3]);

        /*jslint bitwise: true */
        bytes[p++] = encoded1 << 2 | encoded2 >> 4;
        bytes[p++] = (encoded2 & 15) << 4 | encoded3 >> 2;
        bytes[p++] = (encoded3 & 3) << 6 | encoded4 & 63;
    }
    return buffer;
}

// Converts a buffer to a string to store, serialized, in the backend
// storage library.
function bufferToString(buffer) {
    // base64-arraybuffer
    var bytes = new Uint8Array(buffer);
    var base64String = '';
    var i;

    for (i = 0; i < bytes.length; i += 3) {
        /*jslint bitwise: true */
        base64String += BASE_CHARS[bytes[i] >> 2];
        base64String += BASE_CHARS[(bytes[i] & 3) << 4 | bytes[i + 1] >> 4];
        base64String += BASE_CHARS[(bytes[i + 1] & 15) << 2 | bytes[i + 2] >> 6];
        base64String += BASE_CHARS[bytes[i + 2] & 63];
    }

    if (bytes.length % 3 === 2) {
        base64String = base64String.substring(0, base64String.length - 1) + '=';
    } else if (bytes.length % 3 === 1) {
        base64String = base64String.substring(0, base64String.length - 2) + '==';
    }

    return base64String;
}

// Serialize a value, afterwards executing a callback (which usually
// instructs the `setItem()` callback/promise to be executed). This is how
// we store binary data with localStorage.
function serialize(value, callback) {
    var valueString = '';
    if (value) {
        valueString = value.toString();
    }

    // Cannot use `value instanceof ArrayBuffer` or such here, as these
    // checks fail when running the tests using casper.js...
    //
    // TODO: See why those tests fail and use a better solution.
    if (value && (value.toString() === '[object ArrayBuffer]' || value.buffer && value.buffer.toString() === '[object ArrayBuffer]')) {
        // Convert binary arrays to a string and prefix the string with
        // a special marker.
        var buffer;
        var marker = SERIALIZED_MARKER;

        if (value instanceof ArrayBuffer) {
            buffer = value;
            marker += TYPE_ARRAYBUFFER;
        } else {
            buffer = value.buffer;

            if (valueString === '[object Int8Array]') {
                marker += TYPE_INT8ARRAY;
            } else if (valueString === '[object Uint8Array]') {
                marker += TYPE_UINT8ARRAY;
            } else if (valueString === '[object Uint8ClampedArray]') {
                marker += TYPE_UINT8CLAMPEDARRAY;
            } else if (valueString === '[object Int16Array]') {
                marker += TYPE_INT16ARRAY;
            } else if (valueString === '[object Uint16Array]') {
                marker += TYPE_UINT16ARRAY;
            } else if (valueString === '[object Int32Array]') {
                marker += TYPE_INT32ARRAY;
            } else if (valueString === '[object Uint32Array]') {
                marker += TYPE_UINT32ARRAY;
            } else if (valueString === '[object Float32Array]') {
                marker += TYPE_FLOAT32ARRAY;
            } else if (valueString === '[object Float64Array]') {
                marker += TYPE_FLOAT64ARRAY;
            } else {
                callback(new Error('Failed to get type for BinaryArray'));
            }
        }

        callback(marker + bufferToString(buffer));
    } else if (valueString === '[object Blob]') {
        // Conver the blob to a binaryArray and then to a string.
        var fileReader = new FileReader();

        fileReader.onload = function () {
            // Backwards-compatible prefix for the blob type.
            var str = BLOB_TYPE_PREFIX + value.type + '~' + bufferToString(this.result);

            callback(SERIALIZED_MARKER + TYPE_BLOB + str);
        };

        fileReader.readAsArrayBuffer(value);
    } else {
        try {
            callback(JSON.stringify(value));
        } catch (e) {
            console.error("Couldn't convert value into a JSON string: ", value);

            callback(null, e);
        }
    }
}

// Deserialize data we've inserted into a value column/field. We place
// special markers into our strings to mark them as encoded; this isn't
// as nice as a meta field, but it's the only sane thing we can do whilst
// keeping localStorage support intact.
//
// Oftentimes this will just deserialize JSON content, but if we have a
// special marker (SERIALIZED_MARKER, defined above), we will extract
// some kind of arraybuffer/binary data/typed array out of the string.
function deserialize(value) {
    // If we haven't marked this string as being specially serialized (i.e.
    // something other than serialized JSON), we can just return it and be
    // done with it.
    if (value.substring(0, SERIALIZED_MARKER_LENGTH) !== SERIALIZED_MARKER) {
        return JSON.parse(value);
    }

    // The following code deals with deserializing some kind of Blob or
    // TypedArray. First we separate out the type of data we're dealing
    // with from the data itself.
    var serializedString = value.substring(TYPE_SERIALIZED_MARKER_LENGTH);
    var type = value.substring(SERIALIZED_MARKER_LENGTH, TYPE_SERIALIZED_MARKER_LENGTH);

    var blobType;
    // Backwards-compatible blob type serialization strategy.
    // DBs created with older versions of localForage will simply not have the blob type.
    if (type === TYPE_BLOB && BLOB_TYPE_PREFIX_REGEX.test(serializedString)) {
        var matcher = serializedString.match(BLOB_TYPE_PREFIX_REGEX);
        blobType = matcher[1];
        serializedString = serializedString.substring(matcher[0].length);
    }
    var buffer = stringToBuffer(serializedString);

    // Return the right type based on the code/type set during
    // serialization.
    switch (type) {
        case TYPE_ARRAYBUFFER:
            return buffer;
        case TYPE_BLOB:
            return createBlob([buffer], { type: blobType });
        case TYPE_INT8ARRAY:
            return new Int8Array(buffer);
        case TYPE_UINT8ARRAY:
            return new Uint8Array(buffer);
        case TYPE_UINT8CLAMPEDARRAY:
            return new Uint8ClampedArray(buffer);
        case TYPE_INT16ARRAY:
            return new Int16Array(buffer);
        case TYPE_UINT16ARRAY:
            return new Uint16Array(buffer);
        case TYPE_INT32ARRAY:
            return new Int32Array(buffer);
        case TYPE_UINT32ARRAY:
            return new Uint32Array(buffer);
        case TYPE_FLOAT32ARRAY:
            return new Float32Array(buffer);
        case TYPE_FLOAT64ARRAY:
            return new Float64Array(buffer);
        default:
            throw new Error('Unkown type: ' + type);
    }
}

var localforageSerializer = {
    serialize: serialize,
    deserialize: deserialize,
    stringToBuffer: stringToBuffer,
    bufferToString: bufferToString
};

/*
 * Includes code from:
 *
 * base64-arraybuffer
 * https://github.com/niklasvh/base64-arraybuffer
 *
 * Copyright (c) 2012 Niklas von Hertzen
 * Licensed under the MIT license.
 */
// Open the WebSQL database (automatically creates one if one didn't
// previously exist), using any options set in the config.
function _initStorage$1(options) {
    var self = this;
    var dbInfo = {
        db: null
    };

    if (options) {
        for (var i in options) {
            dbInfo[i] = typeof options[i] !== 'string' ? options[i].toString() : options[i];
        }
    }

    var dbInfoPromise = new Promise$1(function (resolve, reject) {
        // Open the database; the openDatabase API will automatically
        // create it for us if it doesn't exist.
        try {
            dbInfo.db = openDatabase(dbInfo.name, String(dbInfo.version), dbInfo.description, dbInfo.size);
        } catch (e) {
            return reject(e);
        }

        // Create our key/value table if it doesn't exist.
        dbInfo.db.transaction(function (t) {
            t.executeSql('CREATE TABLE IF NOT EXISTS ' + dbInfo.storeName + ' (id INTEGER PRIMARY KEY, key unique, value)', [], function () {
                self._dbInfo = dbInfo;
                resolve();
            }, function (t, error) {
                reject(error);
            });
        });
    });

    dbInfo.serializer = localforageSerializer;
    return dbInfoPromise;
}

function getItem$1(key, callback) {
    var self = this;

    // Cast the key to a string, as that's all we can set as a key.
    if (typeof key !== 'string') {
        console.warn(key + ' used as a key, but it is not a string.');
        key = String(key);
    }

    var promise = new Promise$1(function (resolve, reject) {
        self.ready().then(function () {
            var dbInfo = self._dbInfo;
            dbInfo.db.transaction(function (t) {
                t.executeSql('SELECT * FROM ' + dbInfo.storeName + ' WHERE key = ? LIMIT 1', [key], function (t, results) {
                    var result = results.rows.length ? results.rows.item(0).value : null;

                    // Check to see if this is serialized content we need to
                    // unpack.
                    if (result) {
                        result = dbInfo.serializer.deserialize(result);
                    }

                    resolve(result);
                }, function (t, error) {

                    reject(error);
                });
            });
        })["catch"](reject);
    });

    executeCallback(promise, callback);
    return promise;
}

function iterate$1(iterator, callback) {
    var self = this;

    var promise = new Promise$1(function (resolve, reject) {
        self.ready().then(function () {
            var dbInfo = self._dbInfo;

            dbInfo.db.transaction(function (t) {
                t.executeSql('SELECT * FROM ' + dbInfo.storeName, [], function (t, results) {
                    var rows = results.rows;
                    var length = rows.length;

                    for (var i = 0; i < length; i++) {
                        var item = rows.item(i);
                        var result = item.value;

                        // Check to see if this is serialized content
                        // we need to unpack.
                        if (result) {
                            result = dbInfo.serializer.deserialize(result);
                        }

                        result = iterator(result, item.key, i + 1);

                        // void(0) prevents problems with redefinition
                        // of `undefined`.
                        if (result !== void 0) {
                            resolve(result);
                            return;
                        }
                    }

                    resolve();
                }, function (t, error) {
                    reject(error);
                });
            });
        })["catch"](reject);
    });

    executeCallback(promise, callback);
    return promise;
}

function setItem$1(key, value, callback) {
    var self = this;

    // Cast the key to a string, as that's all we can set as a key.
    if (typeof key !== 'string') {
        console.warn(key + ' used as a key, but it is not a string.');
        key = String(key);
    }

    var promise = new Promise$1(function (resolve, reject) {
        self.ready().then(function () {
            // The localStorage API doesn't return undefined values in an
            // "expected" way, so undefined is always cast to null in all
            // drivers. See: https://github.com/mozilla/localForage/pull/42
            if (value === undefined) {
                value = null;
            }

            // Save the original value to pass to the callback.
            var originalValue = value;

            var dbInfo = self._dbInfo;
            dbInfo.serializer.serialize(value, function (value, error) {
                if (error) {
                    reject(error);
                } else {
                    dbInfo.db.transaction(function (t) {
                        t.executeSql('INSERT OR REPLACE INTO ' + dbInfo.storeName + ' (key, value) VALUES (?, ?)', [key, value], function () {
                            resolve(originalValue);
                        }, function (t, error) {
                            reject(error);
                        });
                    }, function (sqlError) {
                        // The transaction failed; check
                        // to see if it's a quota error.
                        if (sqlError.code === sqlError.QUOTA_ERR) {
                            // We reject the callback outright for now, but
                            // it's worth trying to re-run the transaction.
                            // Even if the user accepts the prompt to use
                            // more storage on Safari, this error will
                            // be called.
                            //
                            // TODO: Try to re-run the transaction.
                            reject(sqlError);
                        }
                    });
                }
            });
        })["catch"](reject);
    });

    executeCallback(promise, callback);
    return promise;
}

function removeItem$1(key, callback) {
    var self = this;

    // Cast the key to a string, as that's all we can set as a key.
    if (typeof key !== 'string') {
        console.warn(key + ' used as a key, but it is not a string.');
        key = String(key);
    }

    var promise = new Promise$1(function (resolve, reject) {
        self.ready().then(function () {
            var dbInfo = self._dbInfo;
            dbInfo.db.transaction(function (t) {
                t.executeSql('DELETE FROM ' + dbInfo.storeName + ' WHERE key = ?', [key], function () {
                    resolve();
                }, function (t, error) {

                    reject(error);
                });
            });
        })["catch"](reject);
    });

    executeCallback(promise, callback);
    return promise;
}

// Deletes every item in the table.
// TODO: Find out if this resets the AUTO_INCREMENT number.
function clear$1(callback) {
    var self = this;

    var promise = new Promise$1(function (resolve, reject) {
        self.ready().then(function () {
            var dbInfo = self._dbInfo;
            dbInfo.db.transaction(function (t) {
                t.executeSql('DELETE FROM ' + dbInfo.storeName, [], function () {
                    resolve();
                }, function (t, error) {
                    reject(error);
                });
            });
        })["catch"](reject);
    });

    executeCallback(promise, callback);
    return promise;
}

// Does a simple `COUNT(key)` to get the number of items stored in
// localForage.
function length$1(callback) {
    var self = this;

    var promise = new Promise$1(function (resolve, reject) {
        self.ready().then(function () {
            var dbInfo = self._dbInfo;
            dbInfo.db.transaction(function (t) {
                // Ahhh, SQL makes this one soooooo easy.
                t.executeSql('SELECT COUNT(key) as c FROM ' + dbInfo.storeName, [], function (t, results) {
                    var result = results.rows.item(0).c;

                    resolve(result);
                }, function (t, error) {

                    reject(error);
                });
            });
        })["catch"](reject);
    });

    executeCallback(promise, callback);
    return promise;
}

// Return the key located at key index X; essentially gets the key from a
// `WHERE id = ?`. This is the most efficient way I can think to implement
// this rarely-used (in my experience) part of the API, but it can seem
// inconsistent, because we do `INSERT OR REPLACE INTO` on `setItem()`, so
// the ID of each key will change every time it's updated. Perhaps a stored
// procedure for the `setItem()` SQL would solve this problem?
// TODO: Don't change ID on `setItem()`.
function key$1(n, callback) {
    var self = this;

    var promise = new Promise$1(function (resolve, reject) {
        self.ready().then(function () {
            var dbInfo = self._dbInfo;
            dbInfo.db.transaction(function (t) {
                t.executeSql('SELECT key FROM ' + dbInfo.storeName + ' WHERE id = ? LIMIT 1', [n + 1], function (t, results) {
                    var result = results.rows.length ? results.rows.item(0).key : null;
                    resolve(result);
                }, function (t, error) {
                    reject(error);
                });
            });
        })["catch"](reject);
    });

    executeCallback(promise, callback);
    return promise;
}

function keys$1(callback) {
    var self = this;

    var promise = new Promise$1(function (resolve, reject) {
        self.ready().then(function () {
            var dbInfo = self._dbInfo;
            dbInfo.db.transaction(function (t) {
                t.executeSql('SELECT key FROM ' + dbInfo.storeName, [], function (t, results) {
                    var keys = [];

                    for (var i = 0; i < results.rows.length; i++) {
                        keys.push(results.rows.item(i).key);
                    }

                    resolve(keys);
                }, function (t, error) {

                    reject(error);
                });
            });
        })["catch"](reject);
    });

    executeCallback(promise, callback);
    return promise;
}

var webSQLStorage = {
    _driver: 'webSQLStorage',
    _initStorage: _initStorage$1,
    iterate: iterate$1,
    getItem: getItem$1,
    setItem: setItem$1,
    removeItem: removeItem$1,
    clear: clear$1,
    length: length$1,
    key: key$1,
    keys: keys$1
};

// Config the localStorage backend, using options set in the config.
function _initStorage$2(options) {
    var self = this;
    var dbInfo = {};
    if (options) {
        for (var i in options) {
            dbInfo[i] = options[i];
        }
    }

    dbInfo.keyPrefix = dbInfo.name + '/';

    if (dbInfo.storeName !== self._defaultConfig.storeName) {
        dbInfo.keyPrefix += dbInfo.storeName + '/';
    }

    self._dbInfo = dbInfo;
    dbInfo.serializer = localforageSerializer;

    return Promise$1.resolve();
}

// Remove all keys from the datastore, effectively destroying all data in
// the app's key/value store!
function clear$2(callback) {
    var self = this;
    var promise = self.ready().then(function () {
        var keyPrefix = self._dbInfo.keyPrefix;

        for (var i = localStorage.length - 1; i >= 0; i--) {
            var key = localStorage.key(i);

            if (key.indexOf(keyPrefix) === 0) {
                localStorage.removeItem(key);
            }
        }
    });

    executeCallback(promise, callback);
    return promise;
}

// Retrieve an item from the store. Unlike the original async_storage
// library in Gaia, we don't modify return values at all. If a key's value
// is `undefined`, we pass that value to the callback function.
function getItem$2(key, callback) {
    var self = this;

    // Cast the key to a string, as that's all we can set as a key.
    if (typeof key !== 'string') {
        console.warn(key + ' used as a key, but it is not a string.');
        key = String(key);
    }

    var promise = self.ready().then(function () {
        var dbInfo = self._dbInfo;
        var result = localStorage.getItem(dbInfo.keyPrefix + key);

        // If a result was found, parse it from the serialized
        // string into a JS object. If result isn't truthy, the key
        // is likely undefined and we'll pass it straight to the
        // callback.
        if (result) {
            result = dbInfo.serializer.deserialize(result);
        }

        return result;
    });

    executeCallback(promise, callback);
    return promise;
}

// Iterate over all items in the store.
function iterate$2(iterator, callback) {
    var self = this;

    var promise = self.ready().then(function () {
        var dbInfo = self._dbInfo;
        var keyPrefix = dbInfo.keyPrefix;
        var keyPrefixLength = keyPrefix.length;
        var length = localStorage.length;

        // We use a dedicated iterator instead of the `i` variable below
        // so other keys we fetch in localStorage aren't counted in
        // the `iterationNumber` argument passed to the `iterate()`
        // callback.
        //
        // See: github.com/mozilla/localForage/pull/435#discussion_r38061530
        var iterationNumber = 1;

        for (var i = 0; i < length; i++) {
            var key = localStorage.key(i);
            if (key.indexOf(keyPrefix) !== 0) {
                continue;
            }
            var value = localStorage.getItem(key);

            // If a result was found, parse it from the serialized
            // string into a JS object. If result isn't truthy, the
            // key is likely undefined and we'll pass it straight
            // to the iterator.
            if (value) {
                value = dbInfo.serializer.deserialize(value);
            }

            value = iterator(value, key.substring(keyPrefixLength), iterationNumber++);

            if (value !== void 0) {
                return value;
            }
        }
    });

    executeCallback(promise, callback);
    return promise;
}

// Same as localStorage's key() method, except takes a callback.
function key$2(n, callback) {
    var self = this;
    var promise = self.ready().then(function () {
        var dbInfo = self._dbInfo;
        var result;
        try {
            result = localStorage.key(n);
        } catch (error) {
            result = null;
        }

        // Remove the prefix from the key, if a key is found.
        if (result) {
            result = result.substring(dbInfo.keyPrefix.length);
        }

        return result;
    });

    executeCallback(promise, callback);
    return promise;
}

function keys$2(callback) {
    var self = this;
    var promise = self.ready().then(function () {
        var dbInfo = self._dbInfo;
        var length = localStorage.length;
        var keys = [];

        for (var i = 0; i < length; i++) {
            if (localStorage.key(i).indexOf(dbInfo.keyPrefix) === 0) {
                keys.push(localStorage.key(i).substring(dbInfo.keyPrefix.length));
            }
        }

        return keys;
    });

    executeCallback(promise, callback);
    return promise;
}

// Supply the number of keys in the datastore to the callback function.
function length$2(callback) {
    var self = this;
    var promise = self.keys().then(function (keys) {
        return keys.length;
    });

    executeCallback(promise, callback);
    return promise;
}

// Remove an item from the store, nice and simple.
function removeItem$2(key, callback) {
    var self = this;

    // Cast the key to a string, as that's all we can set as a key.
    if (typeof key !== 'string') {
        console.warn(key + ' used as a key, but it is not a string.');
        key = String(key);
    }

    var promise = self.ready().then(function () {
        var dbInfo = self._dbInfo;
        localStorage.removeItem(dbInfo.keyPrefix + key);
    });

    executeCallback(promise, callback);
    return promise;
}

// Set a key's value and run an optional callback once the value is set.
// Unlike Gaia's implementation, the callback function is passed the value,
// in case you want to operate on that value only after you're sure it
// saved, or something like that.
function setItem$2(key, value, callback) {
    var self = this;

    // Cast the key to a string, as that's all we can set as a key.
    if (typeof key !== 'string') {
        console.warn(key + ' used as a key, but it is not a string.');
        key = String(key);
    }

    var promise = self.ready().then(function () {
        // Convert undefined values to null.
        // https://github.com/mozilla/localForage/pull/42
        if (value === undefined) {
            value = null;
        }

        // Save the original value to pass to the callback.
        var originalValue = value;

        return new Promise$1(function (resolve, reject) {
            var dbInfo = self._dbInfo;
            dbInfo.serializer.serialize(value, function (value, error) {
                if (error) {
                    reject(error);
                } else {
                    try {
                        localStorage.setItem(dbInfo.keyPrefix + key, value);
                        resolve(originalValue);
                    } catch (e) {
                        // localStorage capacity exceeded.
                        // TODO: Make this a specific error/event.
                        if (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
                            reject(e);
                        }
                        reject(e);
                    }
                }
            });
        });
    });

    executeCallback(promise, callback);
    return promise;
}

var localStorageWrapper = {
    _driver: 'localStorageWrapper',
    _initStorage: _initStorage$2,
    // Default API, from Gaia/localStorage.
    iterate: iterate$2,
    getItem: getItem$2,
    setItem: setItem$2,
    removeItem: removeItem$2,
    clear: clear$2,
    length: length$2,
    key: key$2,
    keys: keys$2
};

function executeTwoCallbacks(promise, callback, errorCallback) {
    if (typeof callback === 'function') {
        promise.then(callback);
    }

    if (typeof errorCallback === 'function') {
        promise["catch"](errorCallback);
    }
}

// Custom drivers are stored here when `defineDriver()` is called.
// They are shared across all instances of localForage.
var CustomDrivers = {};

var DriverType = {
    INDEXEDDB: 'asyncStorage',
    LOCALSTORAGE: 'localStorageWrapper',
    WEBSQL: 'webSQLStorage'
};

var DefaultDriverOrder = [DriverType.INDEXEDDB, DriverType.WEBSQL, DriverType.LOCALSTORAGE];

var LibraryMethods = ['clear', 'getItem', 'iterate', 'key', 'keys', 'length', 'removeItem', 'setItem'];

var DefaultConfig = {
    description: '',
    driver: DefaultDriverOrder.slice(),
    name: 'localforage',
    // Default DB size is _JUST UNDER_ 5MB, as it's the highest size
    // we can use without a prompt.
    size: 4980736,
    storeName: 'keyvaluepairs',
    version: 1.0
};

var driverSupport = {};
// Check to see if IndexedDB is available and if it is the latest
// implementation; it's our preferred backend library. We use "_spec_test"
// as the name of the database because it's not the one we'll operate on,
// but it's useful to make sure its using the right spec.
// See: https://github.com/mozilla/localForage/issues/128
driverSupport[DriverType.INDEXEDDB] = isIndexedDBValid();

driverSupport[DriverType.WEBSQL] = isWebSQLValid();

driverSupport[DriverType.LOCALSTORAGE] = isLocalStorageValid();

var isArray = Array.isArray || function (arg) {
    return Object.prototype.toString.call(arg) === '[object Array]';
};

function callWhenReady(localForageInstance, libraryMethod) {
    localForageInstance[libraryMethod] = function () {
        var _args = arguments;
        return localForageInstance.ready().then(function () {
            return localForageInstance[libraryMethod].apply(localForageInstance, _args);
        });
    };
}

function extend() {
    for (var i = 1; i < arguments.length; i++) {
        var arg = arguments[i];

        if (arg) {
            for (var key in arg) {
                if (arg.hasOwnProperty(key)) {
                    if (isArray(arg[key])) {
                        arguments[0][key] = arg[key].slice();
                    } else {
                        arguments[0][key] = arg[key];
                    }
                }
            }
        }
    }

    return arguments[0];
}

function isLibraryDriver(driverName) {
    for (var driver in DriverType) {
        if (DriverType.hasOwnProperty(driver) && DriverType[driver] === driverName) {
            return true;
        }
    }

    return false;
}

var LocalForage = function () {
    function LocalForage(options) {
        _classCallCheck(this, LocalForage);

        this.INDEXEDDB = DriverType.INDEXEDDB;
        this.LOCALSTORAGE = DriverType.LOCALSTORAGE;
        this.WEBSQL = DriverType.WEBSQL;

        this._defaultConfig = extend({}, DefaultConfig);
        this._config = extend({}, this._defaultConfig, options);
        this._driverSet = null;
        this._initDriver = null;
        this._ready = false;
        this._dbInfo = null;

        this._wrapLibraryMethodsWithReady();
        this.setDriver(this._config.driver);
    }

    // Set any config values for localForage; can be called anytime before
    // the first API call (e.g. `getItem`, `setItem`).
    // We loop through options so we don't overwrite existing config
    // values.


    LocalForage.prototype.config = function config(options) {
        // If the options argument is an object, we use it to set values.
        // Otherwise, we return either a specified config value or all
        // config values.
        if ((typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object') {
            // If localforage is ready and fully initialized, we can't set
            // any new configuration values. Instead, we return an error.
            if (this._ready) {
                return new Error("Can't call config() after localforage " + 'has been used.');
            }

            for (var i in options) {
                if (i === 'storeName') {
                    options[i] = options[i].replace(/\W/g, '_');
                }

                this._config[i] = options[i];
            }

            // after all config options are set and
            // the driver option is used, try setting it
            if ('driver' in options && options.driver) {
                this.setDriver(this._config.driver);
            }

            return true;
        } else if (typeof options === 'string') {
            return this._config[options];
        } else {
            return this._config;
        }
    };

    // Used to define a custom driver, shared across all instances of
    // localForage.


    LocalForage.prototype.defineDriver = function defineDriver(driverObject, callback, errorCallback) {
        var promise = new Promise$1(function (resolve, reject) {
            try {
                var driverName = driverObject._driver;
                var complianceError = new Error('Custom driver not compliant; see ' + 'https://mozilla.github.io/localForage/#definedriver');
                var namingError = new Error('Custom driver name already in use: ' + driverObject._driver);

                // A driver name should be defined and not overlap with the
                // library-defined, default drivers.
                if (!driverObject._driver) {
                    reject(complianceError);
                    return;
                }
                if (isLibraryDriver(driverObject._driver)) {
                    reject(namingError);
                    return;
                }

                var customDriverMethods = LibraryMethods.concat('_initStorage');
                for (var i = 0; i < customDriverMethods.length; i++) {
                    var customDriverMethod = customDriverMethods[i];
                    if (!customDriverMethod || !driverObject[customDriverMethod] || typeof driverObject[customDriverMethod] !== 'function') {
                        reject(complianceError);
                        return;
                    }
                }

                var supportPromise = Promise$1.resolve(true);
                if ('_support' in driverObject) {
                    if (driverObject._support && typeof driverObject._support === 'function') {
                        supportPromise = driverObject._support();
                    } else {
                        supportPromise = Promise$1.resolve(!!driverObject._support);
                    }
                }

                supportPromise.then(function (supportResult) {
                    driverSupport[driverName] = supportResult;
                    CustomDrivers[driverName] = driverObject;
                    resolve();
                }, reject);
            } catch (e) {
                reject(e);
            }
        });

        executeTwoCallbacks(promise, callback, errorCallback);
        return promise;
    };

    LocalForage.prototype.driver = function driver() {
        return this._driver || null;
    };

    LocalForage.prototype.getDriver = function getDriver(driverName, callback, errorCallback) {
        var self = this;
        var getDriverPromise = Promise$1.resolve().then(function () {
            if (isLibraryDriver(driverName)) {
                switch (driverName) {
                    case self.INDEXEDDB:
                        return asyncStorage;
                    case self.LOCALSTORAGE:
                        return localStorageWrapper;
                    case self.WEBSQL:
                        return webSQLStorage;
                }
            } else if (CustomDrivers[driverName]) {
                return CustomDrivers[driverName];
            } else {
                throw new Error('Driver not found.');
            }
        });
        executeTwoCallbacks(getDriverPromise, callback, errorCallback);
        return getDriverPromise;
    };

    LocalForage.prototype.getSerializer = function getSerializer(callback) {
        var serializerPromise = Promise$1.resolve(localforageSerializer);
        executeTwoCallbacks(serializerPromise, callback);
        return serializerPromise;
    };

    LocalForage.prototype.ready = function ready(callback) {
        var self = this;

        var promise = self._driverSet.then(function () {
            if (self._ready === null) {
                self._ready = self._initDriver();
            }

            return self._ready;
        });

        executeTwoCallbacks(promise, callback, callback);
        return promise;
    };

    LocalForage.prototype.setDriver = function setDriver(drivers, callback, errorCallback) {
        var self = this;

        if (!isArray(drivers)) {
            drivers = [drivers];
        }

        var supportedDrivers = this._getSupportedDrivers(drivers);

        function setDriverToConfig() {
            self._config.driver = self.driver();
        }

        function initDriver(supportedDrivers) {
            return function () {
                var currentDriverIndex = 0;

                function driverPromiseLoop() {
                    while (currentDriverIndex < supportedDrivers.length) {
                        var driverName = supportedDrivers[currentDriverIndex];
                        currentDriverIndex++;

                        self._dbInfo = null;
                        self._ready = null;

                        return self.getDriver(driverName).then(function (driver) {
                            self._extend(driver);
                            setDriverToConfig();

                            self._ready = self._initStorage(self._config);
                            return self._ready;
                        })["catch"](driverPromiseLoop);
                    }

                    setDriverToConfig();
                    var error = new Error('No available storage method found.');
                    self._driverSet = Promise$1.reject(error);
                    return self._driverSet;
                }

                return driverPromiseLoop();
            };
        }

        // There might be a driver initialization in progress
        // so wait for it to finish in order to avoid a possible
        // race condition to set _dbInfo
        var oldDriverSetDone = this._driverSet !== null ? this._driverSet["catch"](function () {
            return Promise$1.resolve();
        }) : Promise$1.resolve();

        this._driverSet = oldDriverSetDone.then(function () {
            var driverName = supportedDrivers[0];
            self._dbInfo = null;
            self._ready = null;

            return self.getDriver(driverName).then(function (driver) {
                self._driver = driver._driver;
                setDriverToConfig();
                self._wrapLibraryMethodsWithReady();
                self._initDriver = initDriver(supportedDrivers);
            });
        })["catch"](function () {
            setDriverToConfig();
            var error = new Error('No available storage method found.');
            self._driverSet = Promise$1.reject(error);
            return self._driverSet;
        });

        executeTwoCallbacks(this._driverSet, callback, errorCallback);
        return this._driverSet;
    };

    LocalForage.prototype.supports = function supports(driverName) {
        return !!driverSupport[driverName];
    };

    LocalForage.prototype._extend = function _extend(libraryMethodsAndProperties) {
        extend(this, libraryMethodsAndProperties);
    };

    LocalForage.prototype._getSupportedDrivers = function _getSupportedDrivers(drivers) {
        var supportedDrivers = [];
        for (var i = 0, len = drivers.length; i < len; i++) {
            var driverName = drivers[i];
            if (this.supports(driverName)) {
                supportedDrivers.push(driverName);
            }
        }
        return supportedDrivers;
    };

    LocalForage.prototype._wrapLibraryMethodsWithReady = function _wrapLibraryMethodsWithReady() {
        // Add a stub for each driver API method that delays the call to the
        // corresponding driver method until localForage is ready. These stubs
        // will be replaced by the driver methods as soon as the driver is
        // loaded, so there is no performance impact.
        for (var i = 0; i < LibraryMethods.length; i++) {
            callWhenReady(this, LibraryMethods[i]);
        }
    };

    LocalForage.prototype.createInstance = function createInstance(options) {
        return new LocalForage(options);
    };

    return LocalForage;
}();

// The actual localForage object that we expose as a module or via a
// global. It's extended by pulling in one of our other libraries.


var localforage_js = new LocalForage();

module.exports = localforage_js;

},{"3":3}]},{},[4])(4)
});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(10)))

/***/ },
/* 13 */
/***/ function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__

/* styles */
__webpack_require__(99)

/* script */
__vue_exports__ = __webpack_require__(26)

/* template */
var __vue_template__ = __webpack_require__(140)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (
  typeof __vue_exports__.default === "object" ||
  typeof __vue_exports__.default === "function"
) {
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}
__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns
__vue_options__._scopeId = "data-v-7"

module.exports = __vue_exports__


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ exports["a"] = newCharacter;
/* harmony export (immutable) */ exports["d"] = newMessage;
/* harmony export (immutable) */ exports["b"] = newChannel;
/* harmony export (immutable) */ exports["e"] = newChannelInfo;
/* harmony export (immutable) */ exports["c"] = newPrivateChat;


function newCharacter(name, gender) {
  var status = arguments.length <= 2 || arguments[2] === undefined ? 'online' : arguments[2];
  var statusmsg = arguments.length <= 3 || arguments[3] === undefined ? '' : arguments[3];

  return { name: name, gender: gender, status: status, statusmsg: statusmsg };
}


function newMessage(sender, message, type) {
  return { sender: sender, type: type, message: message, time: Date.now() };
}

function newChannel(id, name) {
  return {
    id: id,
    name: name,
    description: '',
    mode: 'both', // either 'both', 'chat', or 'ads'
    users: [],
    ops: [],
    messages: []
  };
}

function newChannelInfo(id, name, userCount, mode) {
  return { id: id, name: name, userCount: userCount, mode: mode };
}

function newPrivateChat(partner) {
  return {
    partner: partner,
    messages: [],
    typing: 'clear'
  };
}

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__lib_constructors__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__state__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__lib_util__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__server_commands__ = __webpack_require__(48);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__lib_f_list__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__package_json__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__package_json___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5__package_json__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_vue__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_localforage__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_localforage___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_localforage__);
/* harmony export (immutable) */ exports["initialize"] = initialize;
/* harmony export (immutable) */ exports["fetchUserData"] = fetchUserData;
/* harmony export (immutable) */ exports["login"] = login;
/* harmony export (immutable) */ exports["setAuthInfo"] = setAuthInfo;
/* harmony export (immutable) */ exports["chooseCharacter"] = chooseCharacter;
/* harmony export (immutable) */ exports["saveChatTabs"] = saveChatTabs;
/* harmony export (immutable) */ exports["loadChatTabs"] = loadChatTabs;
/* harmony export (immutable) */ exports["connectToChatServer"] = connectToChatServer;
/* harmony export (immutable) */ exports["handleServerCommand"] = handleServerCommand;
/* harmony export (immutable) */ exports["sendCommand"] = sendCommand;
/* harmony export (immutable) */ exports["addCharacterBatch"] = addCharacterBatch;
/* harmony export (immutable) */ exports["fetchChannelList"] = fetchChannelList;
/* harmony export (immutable) */ exports["joinChannel"] = joinChannel;
/* harmony export (immutable) */ exports["leaveChannel"] = leaveChannel;
/* harmony export (immutable) */ exports["isChannelJoined"] = isChannelJoined;
/* harmony export (immutable) */ exports["openPrivateChat"] = openPrivateChat;
/* harmony export (immutable) */ exports["closePrivateChat"] = closePrivateChat;
/* harmony export (immutable) */ exports["isPrivateChatOpened"] = isPrivateChatOpened;
/* harmony export (immutable) */ exports["sendChannelMessage"] = sendChannelMessage;
/* harmony export (immutable) */ exports["sendPrivateMessage"] = sendPrivateMessage;
/* harmony export (immutable) */ exports["addBookmark"] = addBookmark;
/* harmony export (immutable) */ exports["removeBookmark"] = removeBookmark;
/* harmony export (immutable) */ exports["updateStatus"] = updateStatus;
/* harmony export (immutable) */ exports["setCharacterFocus"] = setCharacterFocus;
/* harmony export (immutable) */ exports["isFriend"] = isFriend;
/* harmony export (immutable) */ exports["isBookmark"] = isBookmark;
/* harmony export (immutable) */ exports["isAdmin"] = isAdmin;
var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();











function mapFriends(friends) {
  var map = {};
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = friends[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var _step$value = _step.value;
      var you = _step$value.you;
      var them = _step$value.them;

      map[them] = map[them] || [];
      map[them].push(you);
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return map;
}

function initialize() {
  __WEBPACK_IMPORTED_MODULE_1__state__["a" /* state */].appState = 'setup';
  __WEBPACK_IMPORTED_MODULE_7_localforage___default.a.getItem('auth').then(function (auth) {
    return auth || Promise.reject();
  }).then(function (auth) {
    return fetchUserData(auth.account, auth.ticket);
  }).then(function () {
    __WEBPACK_IMPORTED_MODULE_1__state__["a" /* state */].appState = 'character-select';
  }).catch(function () {
    __WEBPACK_IMPORTED_MODULE_1__state__["a" /* state */].appState = 'login';
  });
}

function fetchUserData(account, ticket) {
  return Promise.all([__WEBPACK_IMPORTED_MODULE_4__lib_f_list__["a" /* getCharacters */](account, ticket), __WEBPACK_IMPORTED_MODULE_4__lib_f_list__["b" /* getFriends */](account, ticket), __WEBPACK_IMPORTED_MODULE_4__lib_f_list__["c" /* getBookmarks */](account, ticket)]).then(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 3);

    var characters = _ref2[0];
    var friends = _ref2[1];
    var bookmarks = _ref2[2];

    setAuthInfo(account, ticket);
    __WEBPACK_IMPORTED_MODULE_1__state__["a" /* state */].userCharacters = characters;
    __WEBPACK_IMPORTED_MODULE_1__state__["a" /* state */].friends = mapFriends(friends);
    __WEBPACK_IMPORTED_MODULE_1__state__["a" /* state */].bookmarks = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__lib_util__["a" /* mapToObject */])(bookmarks, function (name) {
      return [name, true];
    });
  });
}

function login(account, password, remember) {
  var _this = this;

  __WEBPACK_IMPORTED_MODULE_1__state__["a" /* state */].appState = 'logging-in';

  return __WEBPACK_IMPORTED_MODULE_4__lib_f_list__["d" /* getTicket */](account, password).then(function (ticket) {
    if (remember) {
      __WEBPACK_IMPORTED_MODULE_7_localforage___default.a.setItem('auth', { account: account, ticket: ticket });
    } else {
      __WEBPACK_IMPORTED_MODULE_7_localforage___default.a.clear();
    }
    return _this.fetchUserData(account, ticket);
  }).then(function () {
    __WEBPACK_IMPORTED_MODULE_1__state__["a" /* state */].appState = 'character-select';
  }).catch(function (err) {
    return Promise.reject(err || '\n      Could not connect to the F-list website.\n      Either they\'re doing maintenance,\n      or someone spilled coke on the servers again.\n    ');
  });
}

function setAuthInfo(account, ticket) {
  __WEBPACK_IMPORTED_MODULE_1__state__["a" /* state */].account = account;
  __WEBPACK_IMPORTED_MODULE_1__state__["a" /* state */].ticket = ticket;
}

function chooseCharacter(name) {
  __WEBPACK_IMPORTED_MODULE_1__state__["a" /* state */].identity = name;
  connectToChatServer();
}

function saveChatTabs(identity) {
  var data = __WEBPACK_IMPORTED_MODULE_1__state__["a" /* state */].chatTabs.map(function (tab) {
    if (tab.channel) {
      return { channel: tab.channel.id, name: tab.channel.name };
    } else if (tab.privateChat) {
      return { privateChat: tab.privateChat.partner.name };
    }
  });
  __WEBPACK_IMPORTED_MODULE_7_localforage___default.a.setItem('tabs:' + identity, data);
}

function loadChatTabs(identity) {
  var _this2 = this;

  __WEBPACK_IMPORTED_MODULE_1__state__["a" /* state */].chatTabs = [];
  __WEBPACK_IMPORTED_MODULE_7_localforage___default.a.getItem('tabs:' + identity).then(function (tabs) {
    if (!tabs) return;
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = tabs[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var tab = _step2.value;

        if (tab.channel) {
          _this2.joinChannel(tab.channel, tab.name);
        }
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2.return) {
          _iterator2.return();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }
  });
}

function connectToChatServer() {
  if (__WEBPACK_IMPORTED_MODULE_1__state__["a" /* state */].socket) {
    __WEBPACK_IMPORTED_MODULE_1__state__["a" /* state */].socket.onclose = function () {};
    __WEBPACK_IMPORTED_MODULE_1__state__["a" /* state */].socket.close();
  }

  __WEBPACK_IMPORTED_MODULE_1__state__["a" /* state */].appState = 'connecting';

  var socket = new window.WebSocket('wss://chat.f-list.net:9799');

  socket.onopen = function () {
    console.log('Socket opened');
    __WEBPACK_IMPORTED_MODULE_1__state__["a" /* state */].appState = 'identifying';
    sendCommand('IDN', {
      method: 'ticket',
      account: __WEBPACK_IMPORTED_MODULE_1__state__["a" /* state */].account,
      ticket: __WEBPACK_IMPORTED_MODULE_1__state__["a" /* state */].ticket,
      character: __WEBPACK_IMPORTED_MODULE_1__state__["a" /* state */].identity,
      cname: __WEBPACK_IMPORTED_MODULE_5__package_json___default.a.name,
      cversion: __WEBPACK_IMPORTED_MODULE_5__package_json___default.a.version
    });
  };

  socket.onclose = function () {
    console.log('Socket closed');
    initialize();
  };

  socket.onerror = function (err) {
    console.error('Socket error:', err);
  };

  socket.onmessage = function (msg) {
    var data = msg.data;

    var cmd = data.substring(0, 3);
    var params = data.length > 3 ? JSON.parse(data.substring(4)) : {};
    handleServerCommand(cmd, params);
  };

  __WEBPACK_IMPORTED_MODULE_1__state__["a" /* state */].socket = socket;
}

function handleServerCommand(cmd, params) {
  var handler = __WEBPACK_IMPORTED_MODULE_3__server_commands__[cmd];
  handler ? handler(params) : console.info('Unknown socket command', cmd, params);
}

function sendCommand(cmd, params) {
  if (__WEBPACK_IMPORTED_MODULE_1__state__["a" /* state */].socket) {
    if (params) {
      __WEBPACK_IMPORTED_MODULE_1__state__["a" /* state */].socket.send(cmd + ' ' + JSON.stringify(params));
    } else {
      __WEBPACK_IMPORTED_MODULE_1__state__["a" /* state */].socket.send(cmd);
    }
  }
}

function addCharacterBatch(batch) {
  var map = {};
  var _iteratorNormalCompletion3 = true;
  var _didIteratorError3 = false;
  var _iteratorError3 = undefined;

  try {
    for (var _iterator3 = batch[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
      var _step3$value = _slicedToArray(_step3.value, 4);

      var name = _step3$value[0];
      var gender = _step3$value[1];
      var status = _step3$value[2];
      var statusmsg = _step3$value[3];

      map[name] = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__lib_constructors__["a" /* newCharacter */])(name, gender, status, statusmsg);
    }
  } catch (err) {
    _didIteratorError3 = true;
    _iteratorError3 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion3 && _iterator3.return) {
        _iterator3.return();
      }
    } finally {
      if (_didIteratorError3) {
        throw _iteratorError3;
      }
    }
  }

  __WEBPACK_IMPORTED_MODULE_1__state__["a" /* state */].onlineCharacters = _extends({}, __WEBPACK_IMPORTED_MODULE_1__state__["a" /* state */].onlineCharacters, map);
}

function fetchChannelList() {
  this.sendCommand('CHA');
  this.sendCommand('ORS');
}

function joinChannel(id, name) {
  var channel = __WEBPACK_IMPORTED_MODULE_1__state__["a" /* state */].channels[id] || __WEBPACK_IMPORTED_MODULE_6_vue___default.a.set(__WEBPACK_IMPORTED_MODULE_1__state__["a" /* state */].channels, id, __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__lib_constructors__["b" /* newChannel */])(id, name));
  __WEBPACK_IMPORTED_MODULE_1__state__["a" /* state */].chatTabs.push({ channel: channel });
  this.saveChatTabs(__WEBPACK_IMPORTED_MODULE_1__state__["a" /* state */].identity);
  this.sendCommand('JCH', { channel: id });
}

function leaveChannel(id) {
  __WEBPACK_IMPORTED_MODULE_1__state__["a" /* state */].chatTabs = __WEBPACK_IMPORTED_MODULE_1__state__["a" /* state */].chatTabs.filter(function (tab) {
    return !(tab.channel && tab.channel.id === id);
  });
  this.saveChatTabs(__WEBPACK_IMPORTED_MODULE_1__state__["a" /* state */].identity);
  this.sendCommand('LCH', { channel: id });
}

function isChannelJoined(id) {
  return __WEBPACK_IMPORTED_MODULE_1__state__["a" /* state */].chatTabs.some(function (tab) {
    return tab.channel && tab.channel.id === id;
  });
}

function openPrivateChat(partner) {
  var char = __WEBPACK_IMPORTED_MODULE_1__state__["a" /* state */].onlineCharacters[partner];
  var privateChat = __WEBPACK_IMPORTED_MODULE_1__state__["a" /* state */].privateChats[partner] || __WEBPACK_IMPORTED_MODULE_6_vue___default.a.set(__WEBPACK_IMPORTED_MODULE_1__state__["a" /* state */].privateChats, partner, __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__lib_constructors__["c" /* newPrivateChat */])(char));
  __WEBPACK_IMPORTED_MODULE_1__state__["a" /* state */].chatTabs.push({ privateChat: privateChat });
  return privateChat;
}

function closePrivateChat(partner) {
  var filter = function filter(tab) {
    return !(tab.privateChat && tab.privateChat.partner.name === partner);
  };
  __WEBPACK_IMPORTED_MODULE_1__state__["a" /* state */].chatTabs = __WEBPACK_IMPORTED_MODULE_1__state__["a" /* state */].chatTabs.filter(filter);
}

function isPrivateChatOpened(partner) {
  return __WEBPACK_IMPORTED_MODULE_1__state__["a" /* state */].chatTabs.some(function (tab) {
    return tab.privateChat && tab.privateChat.partner.name === partner;
  });
}

function sendChannelMessage(id, message) {
  var char = __WEBPACK_IMPORTED_MODULE_1__state__["a" /* state */].onlineCharacters[__WEBPACK_IMPORTED_MODULE_1__state__["a" /* state */].identity];
  __WEBPACK_IMPORTED_MODULE_1__state__["a" /* state */].channels[id].messages.push(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__lib_constructors__["d" /* newMessage */])(char, message, 'self'));
  sendCommand('MSG', { channel: id, message: message });
}

function sendPrivateMessage(partner, message) {
  var char = __WEBPACK_IMPORTED_MODULE_1__state__["a" /* state */].onlineCharacters[__WEBPACK_IMPORTED_MODULE_1__state__["a" /* state */].identity];
  __WEBPACK_IMPORTED_MODULE_1__state__["a" /* state */].privateChats[partner].messages.push(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__lib_constructors__["d" /* newMessage */])(char, message, 'self'));
  sendCommand('PRI', { recipient: partner, message: message });
}

function addBookmark(name) {
  __WEBPACK_IMPORTED_MODULE_6_vue___default.a.set(__WEBPACK_IMPORTED_MODULE_1__state__["a" /* state */].bookmarks, name, true);
  __WEBPACK_IMPORTED_MODULE_4__lib_f_list__["e" /* addBookmark */](__WEBPACK_IMPORTED_MODULE_1__state__["a" /* state */].account, __WEBPACK_IMPORTED_MODULE_1__state__["a" /* state */].ticket, name);
}

function removeBookmark(name) {
  __WEBPACK_IMPORTED_MODULE_6_vue___default.a.delete(__WEBPACK_IMPORTED_MODULE_1__state__["a" /* state */].bookmarks, name);
  __WEBPACK_IMPORTED_MODULE_4__lib_f_list__["f" /* removeBookmark */](__WEBPACK_IMPORTED_MODULE_1__state__["a" /* state */].account, __WEBPACK_IMPORTED_MODULE_1__state__["a" /* state */].ticket, name);
}

function updateStatus(status, statusmsg) {
  sendCommand('STA', { status: status, statusmsg: statusmsg });
}

function setCharacterFocus(name) {
  __WEBPACK_IMPORTED_MODULE_1__state__["a" /* state */].characterMenuFocus = name ? __WEBPACK_IMPORTED_MODULE_1__state__["a" /* state */].onlineCharacters[name] : null;
}

function isFriend(name) {
  return __WEBPACK_IMPORTED_MODULE_1__state__["a" /* state */].friends[name] != null;
}
function isBookmark(name) {
  return __WEBPACK_IMPORTED_MODULE_1__state__["a" /* state */].bookmarks[name] != null;
}
function isAdmin(name) {
  return __WEBPACK_IMPORTED_MODULE_1__state__["a" /* state */].admins[name] != null;
}

/***/ },
/* 17 */
/***/ function(module, exports) {

module.exports = {
	"name": "fchat-next",
	"version": "0.7.0",
	"description": "a modernized f-chat client",
	"author": "Kingdaro <kingdaro@gmail.com>",
	"license": "MIT",
	"repository": "http://github.com/Kingdaro/fchat",
	"devDependencies": {
		"babel-core": "^6.14.0",
		"babel-eslint": "^6.1.2",
		"babel-loader": "^6.2.5",
		"babel-plugin-transform-export-extensions": "^6.8.0",
		"babel-plugin-transform-flow-strip-types": "^6.14.0",
		"babel-plugin-transform-object-rest-spread": "^6.8.0",
		"babel-plugin-transform-remove-console": "^6.8.0",
		"babel-preset-babili": "0.0.3",
		"babel-preset-latest": "^6.14.0",
		"css-loader": "^0.23.1",
		"eslint": "^3.5.0",
		"eslint-plugin-flowtype": "^2.19.0",
		"eslint-plugin-html": "^1.5.2",
		"flow-bin": "^0.32.0",
		"howler": "^2.0.0",
		"json-loader": "^0.5.4",
		"localforage": "^1.4.2",
		"style-loader": "^0.13.1",
		"stylus": "^0.54.5",
		"stylus-loader": "^2.3.1",
		"vue": "^2.0.0-rc.6",
		"vue-loader": "^9.5.0",
		"vue-resource": "^0.9.3",
		"vue-template-compiler": "^2.0.0-rc.6",
		"webpack": "^2.1.0-beta.25",
		"webpack-dev-server": "^2.1.0-beta.5"
	}
};

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__

/* styles */
__webpack_require__(93)

/* script */
__vue_exports__ = __webpack_require__(40)

/* template */
var __vue_template__ = __webpack_require__(135)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (
  typeof __vue_exports__.default === "object" ||
  typeof __vue_exports__.default === "function"
) {
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}
__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns
__vue_options__._scopeId = "data-v-23"

module.exports = __vue_exports__


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__

/* script */
__vue_exports__ = __webpack_require__(41)

/* template */
var __vue_template__ = __webpack_require__(133)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (
  typeof __vue_exports__.default === "object" ||
  typeof __vue_exports__.default === "function"
) {
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}
__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns

module.exports = __vue_exports__


/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global, process) {/**
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * https://raw.github.com/facebook/regenerator/master/LICENSE file. An
 * additional grant of patent rights can be found in the PATENTS file in
 * the same directory.
 */

!(function(global) {
  "use strict";

  var hasOwn = Object.prototype.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  var inModule = typeof module === "object";
  var runtime = global.regeneratorRuntime;
  if (runtime) {
    if (inModule) {
      // If regeneratorRuntime is defined globally and we're in a module,
      // make the exports object identical to regeneratorRuntime.
      module.exports = runtime;
    }
    // Don't bother evaluating the rest of this file if the runtime was
    // already defined globally.
    return;
  }

  // Define the runtime globally (as expected by generated code) as either
  // module.exports (if we're in a module) or a new, empty object.
  runtime = global.regeneratorRuntime = inModule ? module.exports : {};

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided, then outerFn.prototype instanceof Generator.
    var generator = Object.create((outerFn || Generator).prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  runtime.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype;
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] = GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  runtime.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  runtime.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `value instanceof AwaitArgument` to determine if the yielded value is
  // meant to be awaited. Some may consider the name of this method too
  // cutesy, but they are curmudgeons.
  runtime.awrap = function(arg) {
    return new AwaitArgument(arg);
  };

  function AwaitArgument(arg) {
    this.arg = arg;
  }

  function AsyncIterator(generator) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value instanceof AwaitArgument) {
          return Promise.resolve(value.arg).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return Promise.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration. If the Promise is rejected, however, the
          // result for this iteration will be rejected with the same
          // reason. Note that rejections of yielded Promises are not
          // thrown back into the generator function, as is the case
          // when an awaited Promise is rejected. This difference in
          // behavior between yield and await is important, because it
          // allows the consumer to decide what to do with the yielded
          // rejection (swallow it and continue, manually .throw it back
          // into the generator, abandon iteration, whatever). With
          // await, by contrast, there is no opportunity to examine the
          // rejection reason outside the generator function, so the
          // only option is to throw it from the await expression, and
          // let the generator function handle the exception.
          result.value = unwrapped;
          resolve(result);
        }, reject);
      }
    }

    if (typeof process === "object" && process.domain) {
      invoke = process.domain.bind(invoke);
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new Promise(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  runtime.async = function(innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList)
    );

    return runtime.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          if (method === "return" ||
              (method === "throw" && delegate.iterator[method] === undefined)) {
            // A return or throw (when the delegate iterator has no throw
            // method) always terminates the yield* loop.
            context.delegate = null;

            // If the delegate iterator has a return method, give it a
            // chance to clean up.
            var returnMethod = delegate.iterator["return"];
            if (returnMethod) {
              var record = tryCatch(returnMethod, delegate.iterator, arg);
              if (record.type === "throw") {
                // If the return method threw an exception, let that
                // exception prevail over the original return or throw.
                method = "throw";
                arg = record.arg;
                continue;
              }
            }

            if (method === "return") {
              // Continue with the outer return, now that the delegate
              // iterator has been terminated.
              continue;
            }
          }

          var record = tryCatch(
            delegate.iterator[method],
            delegate.iterator,
            arg
          );

          if (record.type === "throw") {
            context.delegate = null;

            // Like returning generator.throw(uncaught), but without the
            // overhead of an extra function call.
            method = "throw";
            arg = record.arg;
            continue;
          }

          // Delegate generator ran and handled its own exceptions so
          // regardless of what the method was, we continue as if it is
          // "next" with an undefined arg.
          method = "next";
          arg = undefined;

          var info = record.arg;
          if (info.done) {
            context[delegate.resultName] = info.value;
            context.next = delegate.nextLoc;
          } else {
            state = GenStateSuspendedYield;
            return info;
          }

          context.delegate = null;
        }

        if (method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = arg;

        } else if (method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw arg;
          }

          if (context.dispatchException(arg)) {
            // If the dispatched exception was caught by a catch block,
            // then let that catch block handle the exception normally.
            method = "next";
            arg = undefined;
          }

        } else if (method === "return") {
          context.abrupt("return", arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          var info = {
            value: record.arg,
            done: context.done
          };

          if (record.arg === ContinueSentinel) {
            if (context.delegate && method === "next") {
              // Deliberately forget the last sent value so that we don't
              // accidentally pass it on to the delegate.
              arg = undefined;
            }
          } else {
            return info;
          }

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(arg) call above.
          method = "throw";
          arg = record.arg;
        }
      }
    };
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp[toStringTagSymbol] = "Generator";

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  runtime.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  runtime.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;
        return !!caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.next = finallyEntry.finallyLoc;
      } else {
        this.complete(record);
      }

      return ContinueSentinel;
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = record.arg;
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      return ContinueSentinel;
    }
  };
})(
  // Among the various tricks for obtaining a reference to the global
  // object, this seems to be the most reliable technique that does not
  // use indirect eval (which violates Content Security Policy).
  typeof global === "object" ? global :
  typeof window === "object" ? window :
  typeof self === "object" ? self : this
);

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(10), __webpack_require__(13)))

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__

/* styles */
__webpack_require__(79)
__webpack_require__(78)

/* script */
__vue_exports__ = __webpack_require__(23)

/* template */
var __vue_template__ = __webpack_require__(120)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (
  typeof __vue_exports__.default === "object" ||
  typeof __vue_exports__.default === "function"
) {
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}
__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns
__vue_options__._scopeId = "data-v-1"

module.exports = __vue_exports__


/***/ },
/* 22 */
/***/ function(module, exports) {

"use strict";
/*!
 * vue-resource v0.9.3
 * https://github.com/vuejs/vue-resource
 * Released under the MIT License.
 */

'use strict';

/**
 * Promises/A+ polyfill v1.1.4 (https://github.com/bramstein/promis)
 */

var RESOLVED = 0;
var REJECTED = 1;
var PENDING = 2;

function Promise$2(executor) {

    this.state = PENDING;
    this.value = undefined;
    this.deferred = [];

    var promise = this;

    try {
        executor(function (x) {
            promise.resolve(x);
        }, function (r) {
            promise.reject(r);
        });
    } catch (e) {
        promise.reject(e);
    }
}

Promise$2.reject = function (r) {
    return new Promise$2(function (resolve, reject) {
        reject(r);
    });
};

Promise$2.resolve = function (x) {
    return new Promise$2(function (resolve, reject) {
        resolve(x);
    });
};

Promise$2.all = function all(iterable) {
    return new Promise$2(function (resolve, reject) {
        var count = 0,
            result = [];

        if (iterable.length === 0) {
            resolve(result);
        }

        function resolver(i) {
            return function (x) {
                result[i] = x;
                count += 1;

                if (count === iterable.length) {
                    resolve(result);
                }
            };
        }

        for (var i = 0; i < iterable.length; i += 1) {
            Promise$2.resolve(iterable[i]).then(resolver(i), reject);
        }
    });
};

Promise$2.race = function race(iterable) {
    return new Promise$2(function (resolve, reject) {
        for (var i = 0; i < iterable.length; i += 1) {
            Promise$2.resolve(iterable[i]).then(resolve, reject);
        }
    });
};

var p$1 = Promise$2.prototype;

p$1.resolve = function resolve(x) {
    var promise = this;

    if (promise.state === PENDING) {
        if (x === promise) {
            throw new TypeError('Promise settled with itself.');
        }

        var called = false;

        try {
            var then = x && x['then'];

            if (x !== null && typeof x === 'object' && typeof then === 'function') {
                then.call(x, function (x) {
                    if (!called) {
                        promise.resolve(x);
                    }
                    called = true;
                }, function (r) {
                    if (!called) {
                        promise.reject(r);
                    }
                    called = true;
                });
                return;
            }
        } catch (e) {
            if (!called) {
                promise.reject(e);
            }
            return;
        }

        promise.state = RESOLVED;
        promise.value = x;
        promise.notify();
    }
};

p$1.reject = function reject(reason) {
    var promise = this;

    if (promise.state === PENDING) {
        if (reason === promise) {
            throw new TypeError('Promise settled with itself.');
        }

        promise.state = REJECTED;
        promise.value = reason;
        promise.notify();
    }
};

p$1.notify = function notify() {
    var promise = this;

    nextTick(function () {
        if (promise.state !== PENDING) {
            while (promise.deferred.length) {
                var deferred = promise.deferred.shift(),
                    onResolved = deferred[0],
                    onRejected = deferred[1],
                    resolve = deferred[2],
                    reject = deferred[3];

                try {
                    if (promise.state === RESOLVED) {
                        if (typeof onResolved === 'function') {
                            resolve(onResolved.call(undefined, promise.value));
                        } else {
                            resolve(promise.value);
                        }
                    } else if (promise.state === REJECTED) {
                        if (typeof onRejected === 'function') {
                            resolve(onRejected.call(undefined, promise.value));
                        } else {
                            reject(promise.value);
                        }
                    }
                } catch (e) {
                    reject(e);
                }
            }
        }
    });
};

p$1.then = function then(onResolved, onRejected) {
    var promise = this;

    return new Promise$2(function (resolve, reject) {
        promise.deferred.push([onResolved, onRejected, resolve, reject]);
        promise.notify();
    });
};

p$1.catch = function (onRejected) {
    return this.then(undefined, onRejected);
};

var PromiseObj = window.Promise || Promise$2;

function Promise$1(executor, context) {

    if (executor instanceof PromiseObj) {
        this.promise = executor;
    } else {
        this.promise = new PromiseObj(executor.bind(context));
    }

    this.context = context;
}

Promise$1.all = function (iterable, context) {
    return new Promise$1(PromiseObj.all(iterable), context);
};

Promise$1.resolve = function (value, context) {
    return new Promise$1(PromiseObj.resolve(value), context);
};

Promise$1.reject = function (reason, context) {
    return new Promise$1(PromiseObj.reject(reason), context);
};

Promise$1.race = function (iterable, context) {
    return new Promise$1(PromiseObj.race(iterable), context);
};

var p = Promise$1.prototype;

p.bind = function (context) {
    this.context = context;
    return this;
};

p.then = function (fulfilled, rejected) {

    if (fulfilled && fulfilled.bind && this.context) {
        fulfilled = fulfilled.bind(this.context);
    }

    if (rejected && rejected.bind && this.context) {
        rejected = rejected.bind(this.context);
    }

    return new Promise$1(this.promise.then(fulfilled, rejected), this.context);
};

p.catch = function (rejected) {

    if (rejected && rejected.bind && this.context) {
        rejected = rejected.bind(this.context);
    }

    return new Promise$1(this.promise.catch(rejected), this.context);
};

p.finally = function (callback) {

    return this.then(function (value) {
        callback.call(this);
        return value;
    }, function (reason) {
        callback.call(this);
        return PromiseObj.reject(reason);
    });
};

var debug = false;
var util = {};
var array = [];
function Util (Vue) {
    util = Vue.util;
    debug = Vue.config.debug || !Vue.config.silent;
}

function warn(msg) {
    if (typeof console !== 'undefined' && debug) {
        console.warn('[VueResource warn]: ' + msg);
    }
}

function error(msg) {
    if (typeof console !== 'undefined') {
        console.error(msg);
    }
}

function nextTick(cb, ctx) {
    return util.nextTick(cb, ctx);
}

function trim(str) {
    return str.replace(/^\s*|\s*$/g, '');
}

var isArray = Array.isArray;

function isString(val) {
    return typeof val === 'string';
}

function isBoolean(val) {
    return val === true || val === false;
}

function isFunction(val) {
    return typeof val === 'function';
}

function isObject(obj) {
    return obj !== null && typeof obj === 'object';
}

function isPlainObject(obj) {
    return isObject(obj) && Object.getPrototypeOf(obj) == Object.prototype;
}

function isFormData(obj) {
    return typeof FormData !== 'undefined' && obj instanceof FormData;
}

function when(value, fulfilled, rejected) {

    var promise = Promise$1.resolve(value);

    if (arguments.length < 2) {
        return promise;
    }

    return promise.then(fulfilled, rejected);
}

function options(fn, obj, opts) {

    opts = opts || {};

    if (isFunction(opts)) {
        opts = opts.call(obj);
    }

    return merge(fn.bind({ $vm: obj, $options: opts }), fn, { $options: opts });
}

function each(obj, iterator) {

    var i, key;

    if (typeof obj.length == 'number') {
        for (i = 0; i < obj.length; i++) {
            iterator.call(obj[i], obj[i], i);
        }
    } else if (isObject(obj)) {
        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                iterator.call(obj[key], obj[key], key);
            }
        }
    }

    return obj;
}

var assign = Object.assign || _assign;

function merge(target) {

    var args = array.slice.call(arguments, 1);

    args.forEach(function (source) {
        _merge(target, source, true);
    });

    return target;
}

function defaults(target) {

    var args = array.slice.call(arguments, 1);

    args.forEach(function (source) {

        for (var key in source) {
            if (target[key] === undefined) {
                target[key] = source[key];
            }
        }
    });

    return target;
}

function _assign(target) {

    var args = array.slice.call(arguments, 1);

    args.forEach(function (source) {
        _merge(target, source);
    });

    return target;
}

function _merge(target, source, deep) {
    for (var key in source) {
        if (deep && (isPlainObject(source[key]) || isArray(source[key]))) {
            if (isPlainObject(source[key]) && !isPlainObject(target[key])) {
                target[key] = {};
            }
            if (isArray(source[key]) && !isArray(target[key])) {
                target[key] = [];
            }
            _merge(target[key], source[key], deep);
        } else if (source[key] !== undefined) {
            target[key] = source[key];
        }
    }
}

function root (options, next) {

    var url = next(options);

    if (isString(options.root) && !url.match(/^(https?:)?\//)) {
        url = options.root + '/' + url;
    }

    return url;
}

function query (options, next) {

    var urlParams = Object.keys(Url.options.params),
        query = {},
        url = next(options);

    each(options.params, function (value, key) {
        if (urlParams.indexOf(key) === -1) {
            query[key] = value;
        }
    });

    query = Url.params(query);

    if (query) {
        url += (url.indexOf('?') == -1 ? '?' : '&') + query;
    }

    return url;
}

/**
 * URL Template v2.0.6 (https://github.com/bramstein/url-template)
 */

function expand(url, params, variables) {

    var tmpl = parse(url),
        expanded = tmpl.expand(params);

    if (variables) {
        variables.push.apply(variables, tmpl.vars);
    }

    return expanded;
}

function parse(template) {

    var operators = ['+', '#', '.', '/', ';', '?', '&'],
        variables = [];

    return {
        vars: variables,
        expand: function (context) {
            return template.replace(/\{([^\{\}]+)\}|([^\{\}]+)/g, function (_, expression, literal) {
                if (expression) {

                    var operator = null,
                        values = [];

                    if (operators.indexOf(expression.charAt(0)) !== -1) {
                        operator = expression.charAt(0);
                        expression = expression.substr(1);
                    }

                    expression.split(/,/g).forEach(function (variable) {
                        var tmp = /([^:\*]*)(?::(\d+)|(\*))?/.exec(variable);
                        values.push.apply(values, getValues(context, operator, tmp[1], tmp[2] || tmp[3]));
                        variables.push(tmp[1]);
                    });

                    if (operator && operator !== '+') {

                        var separator = ',';

                        if (operator === '?') {
                            separator = '&';
                        } else if (operator !== '#') {
                            separator = operator;
                        }

                        return (values.length !== 0 ? operator : '') + values.join(separator);
                    } else {
                        return values.join(',');
                    }
                } else {
                    return encodeReserved(literal);
                }
            });
        }
    };
}

function getValues(context, operator, key, modifier) {

    var value = context[key],
        result = [];

    if (isDefined(value) && value !== '') {
        if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
            value = value.toString();

            if (modifier && modifier !== '*') {
                value = value.substring(0, parseInt(modifier, 10));
            }

            result.push(encodeValue(operator, value, isKeyOperator(operator) ? key : null));
        } else {
            if (modifier === '*') {
                if (Array.isArray(value)) {
                    value.filter(isDefined).forEach(function (value) {
                        result.push(encodeValue(operator, value, isKeyOperator(operator) ? key : null));
                    });
                } else {
                    Object.keys(value).forEach(function (k) {
                        if (isDefined(value[k])) {
                            result.push(encodeValue(operator, value[k], k));
                        }
                    });
                }
            } else {
                var tmp = [];

                if (Array.isArray(value)) {
                    value.filter(isDefined).forEach(function (value) {
                        tmp.push(encodeValue(operator, value));
                    });
                } else {
                    Object.keys(value).forEach(function (k) {
                        if (isDefined(value[k])) {
                            tmp.push(encodeURIComponent(k));
                            tmp.push(encodeValue(operator, value[k].toString()));
                        }
                    });
                }

                if (isKeyOperator(operator)) {
                    result.push(encodeURIComponent(key) + '=' + tmp.join(','));
                } else if (tmp.length !== 0) {
                    result.push(tmp.join(','));
                }
            }
        }
    } else {
        if (operator === ';') {
            result.push(encodeURIComponent(key));
        } else if (value === '' && (operator === '&' || operator === '?')) {
            result.push(encodeURIComponent(key) + '=');
        } else if (value === '') {
            result.push('');
        }
    }

    return result;
}

function isDefined(value) {
    return value !== undefined && value !== null;
}

function isKeyOperator(operator) {
    return operator === ';' || operator === '&' || operator === '?';
}

function encodeValue(operator, value, key) {

    value = operator === '+' || operator === '#' ? encodeReserved(value) : encodeURIComponent(value);

    if (key) {
        return encodeURIComponent(key) + '=' + value;
    } else {
        return value;
    }
}

function encodeReserved(str) {
    return str.split(/(%[0-9A-Fa-f]{2})/g).map(function (part) {
        if (!/%[0-9A-Fa-f]/.test(part)) {
            part = encodeURI(part);
        }
        return part;
    }).join('');
}

function template (options) {

    var variables = [],
        url = expand(options.url, options.params, variables);

    variables.forEach(function (key) {
        delete options.params[key];
    });

    return url;
}

/**
 * Service for URL templating.
 */

var ie = document.documentMode;
var el = document.createElement('a');

function Url(url, params) {

    var self = this || {},
        options = url,
        transform;

    if (isString(url)) {
        options = { url: url, params: params };
    }

    options = merge({}, Url.options, self.$options, options);

    Url.transforms.forEach(function (handler) {
        transform = factory(handler, transform, self.$vm);
    });

    return transform(options);
}

/**
 * Url options.
 */

Url.options = {
    url: '',
    root: null,
    params: {}
};

/**
 * Url transforms.
 */

Url.transforms = [template, query, root];

/**
 * Encodes a Url parameter string.
 *
 * @param {Object} obj
 */

Url.params = function (obj) {

    var params = [],
        escape = encodeURIComponent;

    params.add = function (key, value) {

        if (isFunction(value)) {
            value = value();
        }

        if (value === null) {
            value = '';
        }

        this.push(escape(key) + '=' + escape(value));
    };

    serialize(params, obj);

    return params.join('&').replace(/%20/g, '+');
};

/**
 * Parse a URL and return its components.
 *
 * @param {String} url
 */

Url.parse = function (url) {

    if (ie) {
        el.href = url;
        url = el.href;
    }

    el.href = url;

    return {
        href: el.href,
        protocol: el.protocol ? el.protocol.replace(/:$/, '') : '',
        port: el.port,
        host: el.host,
        hostname: el.hostname,
        pathname: el.pathname.charAt(0) === '/' ? el.pathname : '/' + el.pathname,
        search: el.search ? el.search.replace(/^\?/, '') : '',
        hash: el.hash ? el.hash.replace(/^#/, '') : ''
    };
};

function factory(handler, next, vm) {
    return function (options) {
        return handler.call(vm, options, next);
    };
}

function serialize(params, obj, scope) {

    var array = isArray(obj),
        plain = isPlainObject(obj),
        hash;

    each(obj, function (value, key) {

        hash = isObject(value) || isArray(value);

        if (scope) {
            key = scope + '[' + (plain || hash ? key : '') + ']';
        }

        if (!scope && array) {
            params.add(value.name, value.value);
        } else if (hash) {
            serialize(params, value, key);
        } else {
            params.add(key, value);
        }
    });
}

function xdrClient (request) {
    return new Promise$1(function (resolve) {

        var xdr = new XDomainRequest(),
            handler = function (event) {

            var response = request.respondWith(xdr.responseText, {
                status: xdr.status,
                statusText: xdr.statusText
            });

            resolve(response);
        };

        request.abort = function () {
            return xdr.abort();
        };

        xdr.open(request.method, request.getUrl(), true);
        xdr.timeout = 0;
        xdr.onload = handler;
        xdr.onerror = handler;
        xdr.ontimeout = function () {};
        xdr.onprogress = function () {};
        xdr.send(request.getBody());
    });
}

var ORIGIN_URL = Url.parse(location.href);
var SUPPORTS_CORS = 'withCredentials' in new XMLHttpRequest();

function cors (request, next) {

    if (!isBoolean(request.crossOrigin) && crossOrigin(request)) {
        request.crossOrigin = true;
    }

    if (request.crossOrigin) {

        if (!SUPPORTS_CORS) {
            request.client = xdrClient;
        }

        delete request.emulateHTTP;
    }

    next();
}

function crossOrigin(request) {

    var requestUrl = Url.parse(Url(request));

    return requestUrl.protocol !== ORIGIN_URL.protocol || requestUrl.host !== ORIGIN_URL.host;
}

function body (request, next) {

    if (request.emulateJSON && isPlainObject(request.body)) {
        request.body = Url.params(request.body);
        request.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    }

    if (isFormData(request.body)) {
        delete request.headers['Content-Type'];
    }

    if (isPlainObject(request.body)) {
        request.body = JSON.stringify(request.body);
    }

    next(function (response) {

        var contentType = response.headers['Content-Type'];

        if (isString(contentType) && contentType.indexOf('application/json') === 0) {

            try {
                response.data = response.json();
            } catch (e) {
                response.data = null;
            }
        } else {
            response.data = response.text();
        }
    });
}

function jsonpClient (request) {
    return new Promise$1(function (resolve) {

        var name = request.jsonp || 'callback',
            callback = '_jsonp' + Math.random().toString(36).substr(2),
            body = null,
            handler,
            script;

        handler = function (event) {

            var status = 0;

            if (event.type === 'load' && body !== null) {
                status = 200;
            } else if (event.type === 'error') {
                status = 404;
            }

            resolve(request.respondWith(body, { status: status }));

            delete window[callback];
            document.body.removeChild(script);
        };

        request.params[name] = callback;

        window[callback] = function (result) {
            body = JSON.stringify(result);
        };

        script = document.createElement('script');
        script.src = request.getUrl();
        script.type = 'text/javascript';
        script.async = true;
        script.onload = handler;
        script.onerror = handler;

        document.body.appendChild(script);
    });
}

function jsonp (request, next) {

    if (request.method == 'JSONP') {
        request.client = jsonpClient;
    }

    next(function (response) {

        if (request.method == 'JSONP') {
            response.data = response.json();
        }
    });
}

function before (request, next) {

    if (isFunction(request.before)) {
        request.before.call(this, request);
    }

    next();
}

/**
 * HTTP method override Interceptor.
 */

function method (request, next) {

    if (request.emulateHTTP && /^(PUT|PATCH|DELETE)$/i.test(request.method)) {
        request.headers['X-HTTP-Method-Override'] = request.method;
        request.method = 'POST';
    }

    next();
}

function header (request, next) {

    request.method = request.method.toUpperCase();
    request.headers = assign({}, Http.headers.common, !request.crossOrigin ? Http.headers.custom : {}, Http.headers[request.method.toLowerCase()], request.headers);

    next();
}

/**
 * Timeout Interceptor.
 */

function timeout (request, next) {

    var timeout;

    if (request.timeout) {
        timeout = setTimeout(function () {
            request.abort();
        }, request.timeout);
    }

    next(function (response) {

        clearTimeout(timeout);
    });
}

function xhrClient (request) {
    return new Promise$1(function (resolve) {

        var xhr = new XMLHttpRequest(),
            handler = function (event) {

            var response = request.respondWith('response' in xhr ? xhr.response : xhr.responseText, {
                status: xhr.status === 1223 ? 204 : xhr.status, // IE9 status bug
                statusText: xhr.status === 1223 ? 'No Content' : trim(xhr.statusText),
                headers: parseHeaders(xhr.getAllResponseHeaders())
            });

            resolve(response);
        };

        request.abort = function () {
            return xhr.abort();
        };

        xhr.open(request.method, request.getUrl(), true);
        xhr.timeout = 0;
        xhr.onload = handler;
        xhr.onerror = handler;

        if (request.progress) {
            if (request.method === 'GET') {
                xhr.addEventListener('progress', request.progress);
            } else if (/^(POST|PUT)$/i.test(request.method)) {
                xhr.upload.addEventListener('progress', request.progress);
            }
        }

        if (request.credentials === true) {
            xhr.withCredentials = true;
        }

        each(request.headers || {}, function (value, header) {
            xhr.setRequestHeader(header, value);
        });

        xhr.send(request.getBody());
    });
}

function parseHeaders(str) {

    var headers = {},
        value,
        name,
        i;

    each(trim(str).split('\n'), function (row) {

        i = row.indexOf(':');
        name = trim(row.slice(0, i));
        value = trim(row.slice(i + 1));

        if (headers[name]) {

            if (isArray(headers[name])) {
                headers[name].push(value);
            } else {
                headers[name] = [headers[name], value];
            }
        } else {

            headers[name] = value;
        }
    });

    return headers;
}

function Client (context) {

    var reqHandlers = [sendRequest],
        resHandlers = [],
        handler;

    if (!isObject(context)) {
        context = null;
    }

    function Client(request) {
        return new Promise$1(function (resolve) {

            function exec() {

                handler = reqHandlers.pop();

                if (isFunction(handler)) {
                    handler.call(context, request, next);
                } else {
                    warn('Invalid interceptor of type ' + typeof handler + ', must be a function');
                    next();
                }
            }

            function next(response) {

                if (isFunction(response)) {

                    resHandlers.unshift(response);
                } else if (isObject(response)) {

                    resHandlers.forEach(function (handler) {
                        response = when(response, function (response) {
                            return handler.call(context, response) || response;
                        });
                    });

                    when(response, resolve);

                    return;
                }

                exec();
            }

            exec();
        }, context);
    }

    Client.use = function (handler) {
        reqHandlers.push(handler);
    };

    return Client;
}

function sendRequest(request, resolve) {

    var client = request.client || xhrClient;

    resolve(client(request));
}

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

/**
 * HTTP Response.
 */

var Response = function () {
    function Response(body, _ref) {
        var url = _ref.url;
        var headers = _ref.headers;
        var status = _ref.status;
        var statusText = _ref.statusText;
        classCallCheck(this, Response);


        this.url = url;
        this.body = body;
        this.headers = headers || {};
        this.status = status || 0;
        this.statusText = statusText || '';
        this.ok = status >= 200 && status < 300;
    }

    Response.prototype.text = function text() {
        return this.body;
    };

    Response.prototype.blob = function blob() {
        return new Blob([this.body]);
    };

    Response.prototype.json = function json() {
        return JSON.parse(this.body);
    };

    return Response;
}();

var Request = function () {
    function Request(options) {
        classCallCheck(this, Request);


        this.method = 'GET';
        this.body = null;
        this.params = {};
        this.headers = {};

        assign(this, options);
    }

    Request.prototype.getUrl = function getUrl() {
        return Url(this);
    };

    Request.prototype.getBody = function getBody() {
        return this.body;
    };

    Request.prototype.respondWith = function respondWith(body, options) {
        return new Response(body, assign(options || {}, { url: this.getUrl() }));
    };

    return Request;
}();

/**
 * Service for sending network requests.
 */

var CUSTOM_HEADERS = { 'X-Requested-With': 'XMLHttpRequest' };
var COMMON_HEADERS = { 'Accept': 'application/json, text/plain, */*' };
var JSON_CONTENT_TYPE = { 'Content-Type': 'application/json;charset=utf-8' };

function Http(options) {

    var self = this || {},
        client = Client(self.$vm);

    defaults(options || {}, self.$options, Http.options);

    Http.interceptors.forEach(function (handler) {
        client.use(handler);
    });

    return client(new Request(options)).then(function (response) {

        return response.ok ? response : Promise$1.reject(response);
    }, function (response) {

        if (response instanceof Error) {
            error(response);
        }

        return Promise$1.reject(response);
    });
}

Http.options = {};

Http.headers = {
    put: JSON_CONTENT_TYPE,
    post: JSON_CONTENT_TYPE,
    patch: JSON_CONTENT_TYPE,
    delete: JSON_CONTENT_TYPE,
    custom: CUSTOM_HEADERS,
    common: COMMON_HEADERS
};

Http.interceptors = [before, timeout, method, body, jsonp, header, cors];

['get', 'delete', 'head', 'jsonp'].forEach(function (method) {

    Http[method] = function (url, options) {
        return this(assign(options || {}, { url: url, method: method }));
    };
});

['post', 'put', 'patch'].forEach(function (method) {

    Http[method] = function (url, body, options) {
        return this(assign(options || {}, { url: url, method: method, body: body }));
    };
});

function Resource(url, params, actions, options) {

    var self = this || {},
        resource = {};

    actions = assign({}, Resource.actions, actions);

    each(actions, function (action, name) {

        action = merge({ url: url, params: params || {} }, options, action);

        resource[name] = function () {
            return (self.$http || Http)(opts(action, arguments));
        };
    });

    return resource;
}

function opts(action, args) {

    var options = assign({}, action),
        params = {},
        body;

    switch (args.length) {

        case 2:

            params = args[0];
            body = args[1];

            break;

        case 1:

            if (/^(POST|PUT|PATCH)$/i.test(options.method)) {
                body = args[0];
            } else {
                params = args[0];
            }

            break;

        case 0:

            break;

        default:

            throw 'Expected up to 4 arguments [params, body], got ' + args.length + ' arguments';
    }

    options.body = body;
    options.params = assign({}, options.params, params);

    return options;
}

Resource.actions = {

    get: { method: 'GET' },
    save: { method: 'POST' },
    query: { method: 'GET' },
    update: { method: 'PUT' },
    remove: { method: 'DELETE' },
    delete: { method: 'DELETE' }

};

function plugin(Vue) {

    if (plugin.installed) {
        return;
    }

    Util(Vue);

    Vue.url = Url;
    Vue.http = Http;
    Vue.resource = Resource;
    Vue.Promise = Promise$1;

    Object.defineProperties(Vue.prototype, {

        $url: {
            get: function () {
                return options(Vue.url, this, this.$options.url);
            }
        },

        $http: {
            get: function () {
                return options(Vue.http, this, this.$options.http);
            }
        },

        $resource: {
            get: function () {
                return Vue.resource.bind(this);
            }
        },

        $promise: {
            get: function () {
                var _this = this;

                return function (executor) {
                    return new Vue.Promise(executor, _this);
                };
            }
        }

    });
}

if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(plugin);
}

module.exports = plugin;

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Login_vue__ = __webpack_require__(115);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Login_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__Login_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__CharacterList_vue__ = __webpack_require__(105);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__CharacterList_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__CharacterList_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Chat_vue__ = __webpack_require__(107);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Chat_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__Chat_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__Loading_vue__ = __webpack_require__(114);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__Loading_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__Loading_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__store__ = __webpack_require__(2);
var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

//
//
//
//
//
//
//
//
//
//
//








/* harmony default export */ exports["default"] = {
  components: {
    Loading: __WEBPACK_IMPORTED_MODULE_3__Loading_vue___default.a
  },
  computed: _extends({}, __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__store__["b" /* getters */])(['appState']), {
    currentView: function currentView() {
      var views = {
        'login': __WEBPACK_IMPORTED_MODULE_0__Login_vue___default.a,
        'character-select': __WEBPACK_IMPORTED_MODULE_1__CharacterList_vue___default.a,
        'online': __WEBPACK_IMPORTED_MODULE_2__Chat_vue___default.a
      };
      return views[this.appState];
    },
    loadingMessage: function loadingMessage() {
      var messages = {
        'setup': 'Setting things up...',
        'logging-in': 'Logging in...',
        'connecting': 'Connecting...',
        'identifying': 'Identifying...'
      };
      return messages[this.appState];
    }
  })
};

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__lib_f_list__ = __webpack_require__(3);
//
//
//
//



/* harmony default export */ exports["default"] = {
  props: {
    name: String,
    size: String,
    shadow: Boolean
  },
  computed: {
    style: function style() {
      return '\n        width: ' + (this.size || '100px') + ';\n        height: ' + (this.size || '100px') + ';\n        background-image: url(' + __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__lib_f_list__["g" /* getAvatarURL */])(this.name) + ');\n        background-size: cover;\n      ';
    }
  }
};

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Overlay_vue__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Overlay_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__Overlay_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__store__ = __webpack_require__(2);
var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




function lower(str) {
  return str.toLocaleLowerCase();
}

/* harmony default export */ exports["default"] = {
  components: {
    Overlay: __WEBPACK_IMPORTED_MODULE_0__Overlay_vue___default.a
  },
  created: function created() {
    __WEBPACK_IMPORTED_MODULE_1__store__["a" /* store */].fetchChannelList();
  },
  data: function data() {
    return {
      searchText: ''
    };
  },

  computed: _extends({}, __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__store__["b" /* getters */])(['publicChannelList', 'privateChannelList']), {
    publicChannels: function publicChannels() {
      return this.publicChannelList.filter(this.channelFilter).sort(this.channelOrder);
    },
    privateChannels: function privateChannels() {
      return this.privateChannelList.filter(this.channelFilter).sort(this.channelOrder).slice(0, 200);
    }
  }),
  methods: {
    channelFilter: function channelFilter(ch) {
      return lower(ch.name).includes(lower(this.searchText));
    },
    channelOrder: function channelOrder(a, b) {
      return b.userCount - a.userCount;
    },
    channelHighlight: function channelHighlight(ch) {
      return __WEBPACK_IMPORTED_MODULE_1__store__["a" /* store */].isChannelJoined(ch.id) && 'channel-joined';
    }
  }
};

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
//
//
//
//
//
//
//

/* harmony default export */ exports["default"] = {
  props: {
    name: { type: String, required: true },
    gender: { type: String, default: 'none' },
    status: String
  },
  computed: {
    statusClass: function statusClass() {
      return 'character-status-' + this.status.toLowerCase();
    },
    genderClass: function genderClass() {
      return 'character-gender-' + this.gender.toLowerCase();
    }
  }
};

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__lib_f_list__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__store__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_localforage__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_localforage___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_localforage__);
var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//





/* harmony default export */ exports["default"] = {
  data: function data() {
    return {
      current: ''
    };
  },
  mounted: function mounted() {
    var _this = this;

    __WEBPACK_IMPORTED_MODULE_2_localforage__["getItem"]('character').then(function (value) {
      if (value) _this.current = value;
    });
  },

  methods: {
    select: function select(name) {
      this.current = name;
      __WEBPACK_IMPORTED_MODULE_2_localforage__["setItem"]('character', name);
    },
    submit: function submit() {
      __WEBPACK_IMPORTED_MODULE_1__store__["a" /* store */].chooseCharacter(this.current);
    }
  },
  computed: _extends({}, __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__store__["b" /* getters */])({
    characters: 'userCharacters'
  }), {
    avatarURL: function avatarURL() {
      return this.current && __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__lib_f_list__["g" /* getAvatarURL */])(this.current);
    }
  })
};

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Avatar_vue__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Avatar_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__Avatar_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Status_vue__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Status_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__Status_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ProfileLink_vue__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ProfileLink_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__ProfileLink_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__store__ = __webpack_require__(2);
var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//






/* harmony default export */ exports["default"] = {
  components: {
    Avatar: __WEBPACK_IMPORTED_MODULE_0__Avatar_vue___default.a,
    Status: __WEBPACK_IMPORTED_MODULE_1__Status_vue___default.a,
    ProfileLink: __WEBPACK_IMPORTED_MODULE_2__ProfileLink_vue___default.a
  },
  computed: _extends({}, __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__store__["b" /* getters */])({
    friends: 'friends',
    character: 'characterMenuFocus'
  }), {
    menuOptions: function menuOptions() {
      return [{ label: 'Send Message', icon: 'comment', action: this.openPrivateChat }, {
        label: this.isBookmark ? 'Unbookmark' : 'Bookmark',
        icon: this.isBookmark ? 'bookmark' : 'bookmark-outline',
        action: this.toggleBookmark
      }, { label: 'Ignore', icon: 'minus-circle-outline' }, { label: 'View Profile', icon: 'link-variant' }];
    },
    name: function name() {
      return this.character.name;
    },
    gender: function gender() {
      return this.character.gender;
    },
    status: function status() {
      return this.character.status;
    },
    statusmsg: function statusmsg() {
      return this.character.statusmsg;
    },
    isBookmark: function isBookmark() {
      return __WEBPACK_IMPORTED_MODULE_3__store__["a" /* store */].isBookmark(this.name);
    },
    isIgnored: function isIgnored() {
      return __WEBPACK_IMPORTED_MODULE_3__store__["a" /* store */].isIgnored(this.name);
    }
  }),
  methods: {
    openPrivateChat: function openPrivateChat() {
      this.$emit('private-chat-opened', this.character.name);
      this.$emit('closed');
    },
    toggleBookmark: function toggleBookmark() {
      if (this.isBookmark) {
        __WEBPACK_IMPORTED_MODULE_3__store__["a" /* store */].removeBookmark(this.name);
      } else {
        __WEBPACK_IMPORTED_MODULE_3__store__["a" /* store */].addBookmark(this.name);
      }
    }
  }
};

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Toggle_vue__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Toggle_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__Toggle_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Character_vue__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Character_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__Character_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Chatbox_vue__ = __webpack_require__(112);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Chatbox_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__Chatbox_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__Message_vue__ = __webpack_require__(116);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__Message_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__Message_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ChatTab_vue__ = __webpack_require__(111);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ChatTab_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4__ChatTab_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__UserList_vue__ = __webpack_require__(119);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__UserList_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5__UserList_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__ChannelList_vue__ = __webpack_require__(104);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__ChannelList_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6__ChannelList_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__CharacterMenu_vue__ = __webpack_require__(106);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__CharacterMenu_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7__CharacterMenu_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__Status_vue__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__Status_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_8__Status_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__ChatHeader_vue__ = __webpack_require__(110);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__ChatHeader_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_9__ChatHeader_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__ChatFilter_vue__ = __webpack_require__(109);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__ChatFilter_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_10__ChatFilter_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__ChatDescription_vue__ = __webpack_require__(108);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__ChatDescription_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_11__ChatDescription_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__OnlineCharacters_vue__ = __webpack_require__(117);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__OnlineCharacters_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_12__OnlineCharacters_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__StatusOverlay_vue__ = __webpack_require__(118);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__StatusOverlay_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_13__StatusOverlay_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__store__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__lib_util__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__directives__ = __webpack_require__(46);
var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




















/* harmony default export */ exports["default"] = {
  components: {
    Toggle: __WEBPACK_IMPORTED_MODULE_0__Toggle_vue___default.a,
    Character: __WEBPACK_IMPORTED_MODULE_1__Character_vue___default.a,
    Chatbox: __WEBPACK_IMPORTED_MODULE_2__Chatbox_vue___default.a,
    Message: __WEBPACK_IMPORTED_MODULE_3__Message_vue___default.a,
    ChatTab: __WEBPACK_IMPORTED_MODULE_4__ChatTab_vue___default.a,
    UserList: __WEBPACK_IMPORTED_MODULE_5__UserList_vue___default.a,
    Status: __WEBPACK_IMPORTED_MODULE_8__Status_vue___default.a,
    ChatHeader: __WEBPACK_IMPORTED_MODULE_9__ChatHeader_vue___default.a,
    ChatFilter: __WEBPACK_IMPORTED_MODULE_10__ChatFilter_vue___default.a,
    ChatDescription: __WEBPACK_IMPORTED_MODULE_11__ChatDescription_vue___default.a,
    OnlineCharacters: __WEBPACK_IMPORTED_MODULE_12__OnlineCharacters_vue___default.a
  },
  directives: {
    bottomScroll: __WEBPACK_IMPORTED_MODULE_16__directives__["a" /* bottomScroll */]
  },
  data: function data() {
    return {
      currentTabIndex: 0,
      overlays: [],
      filters: {
        chat: true,
        lfrp: true,
        admin: true,
        friend: true,
        self: true
      }
    };
  },

  computed: _extends({}, __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_14__store__["b" /* getters */])({ identity: 'identity', tabs: 'chatTabs' }), {
    currentTab: function currentTab() {
      var index = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_15__lib_util__["c" /* clamp */])(this.currentTabIndex, 0, this.tabs.length);
      return this.tabs[index] || {};
    },
    channel: function channel() {
      return this.currentTab.channel;
    },
    privateChat: function privateChat() {
      return this.currentTab.privateChat;
    },
    messages: function messages() {
      var tab = this.channel || this.privateChat || {};
      return tab.messages || [];
    },
    headerOptions: function headerOptions() {
      var _this = this;

      var openOverlay = function openOverlay(which) {
        return function () {
          return _this.overlays.push(which);
        };
      };
      return [{
        info: 'Join a Channel',
        icon: 'forum',
        action: openOverlay(__WEBPACK_IMPORTED_MODULE_6__ChannelList_vue___default.a)
      }, {
        info: 'Browse Online Characters',
        icon: 'heart',
        action: openOverlay(__WEBPACK_IMPORTED_MODULE_12__OnlineCharacters_vue___default.a)
      }, {
        info: 'Update Your Status',
        icon: 'account-settings',
        action: openOverlay(__WEBPACK_IMPORTED_MODULE_13__StatusOverlay_vue___default.a)
      }];
    },
    filterLabels: function filterLabels() {
      return [{ filter: 'chat', label: 'Chat', tooltip: 'Normal Messages' }, { filter: 'lfrp', label: 'LFRP', tooltip: 'RP Ads' }, { filter: 'admin', label: 'Admin', tooltip: 'Red Admin Messages' }, { filter: 'friend', label: 'Friend', tooltip: 'Friend and Bookmark Messages' }, { filter: 'self', label: 'Self', tooltip: 'Your Messages' }];
    }
  }),
  methods: {
    setCharacterFocus: __WEBPACK_IMPORTED_MODULE_14__store__["a" /* store */].setCharacterFocus,
    toggleChannel: function toggleChannel(ch) {
      __WEBPACK_IMPORTED_MODULE_14__store__["a" /* store */].joinChannel(ch.id, ch.name);
    },
    closeTab: function closeTab(tab) {
      if (tab.channel) {
        __WEBPACK_IMPORTED_MODULE_14__store__["a" /* store */].leaveChannel(tab.channel.id);
      } else if (tab.privateChat) {
        __WEBPACK_IMPORTED_MODULE_14__store__["a" /* store */].closePrivateChat(tab.privateChat.partner.name);
      }
    },
    checkData: function checkData(event) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = event.path[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var el = _step.value;

          if (el.dataset && el.dataset.character) {
            __WEBPACK_IMPORTED_MODULE_14__store__["a" /* store */].setCharacterFocus(el.dataset.character);
            this.overlays.push(__WEBPACK_IMPORTED_MODULE_7__CharacterMenu_vue___default.a);
            break;
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    },
    openPrivateChat: function openPrivateChat(name) {
      __WEBPACK_IMPORTED_MODULE_14__store__["a" /* store */].openPrivateChat(name);
      __WEBPACK_IMPORTED_MODULE_14__store__["a" /* store */].setCharacterFocus(null);
      this.currentTabIndex = this.tabs.length - 1;
    },
    isFilterDisabled: function isFilterDisabled(filter) {
      var channel = this.currentTab.channel;

      if (channel) {
        var modes = {
          both: false,
          ads: true,
          chat: filter === 'lfrp'
        };
        return modes[channel.mode] || false;
      }
    },
    chatboxSubmit: function chatboxSubmit(message) {
      var _currentTab = this.currentTab;
      var channel = _currentTab.channel;
      var privateChat = _currentTab.privateChat;

      if (channel) {
        __WEBPACK_IMPORTED_MODULE_14__store__["a" /* store */].sendChannelMessage(channel.id, message);
      } else if (privateChat) {
        __WEBPACK_IMPORTED_MODULE_14__store__["a" /* store */].sendPrivateMessage(privateChat.partner.name, message);
      }
    }
  }
};

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Status_vue__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Status_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__Status_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__lib_bbc__ = __webpack_require__(11);
//
//
//
//
//
//
//
//
//
//




/* harmony default export */ exports["default"] = {
  props: {
    channel: Object,
    privateChat: Object
  },
  components: {
    Status: __WEBPACK_IMPORTED_MODULE_0__Status_vue___default.a
  },
  methods: {
    parseBBC: __WEBPACK_IMPORTED_MODULE_1__lib_bbc__["a" /* parseBBC */]
  }
};

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Toggle_vue__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Toggle_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__Toggle_vue__);
//
//
//
//
//
//



/* harmony default export */ exports["default"] = {
  props: {
    value: Boolean,
    disabled: Boolean,
    tooltip: String
  },
  components: {
    Toggle: __WEBPACK_IMPORTED_MODULE_0__Toggle_vue___default.a
  }
};

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__package_json__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__package_json___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__package_json__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//



/* harmony default export */ exports["default"] = {
  props: {
    options: Array
  },
  data: function data() {
    return { version: __WEBPACK_IMPORTED_MODULE_0__package_json__["version"] };
  }
};

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Avatar_vue__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Avatar_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__Avatar_vue__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//



/* harmony default export */ exports["default"] = {
  props: {
    tab: Object,
    active: Boolean
  },
  components: {
    Avatar: __WEBPACK_IMPORTED_MODULE_0__Avatar_vue___default.a
  }
};

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
//
//
//
//

/* harmony default export */ exports["default"] = {
  data: function data() {
    return { message: '' };
  },

  methods: {
    submit: function submit() {
      this.$emit('submit', this.message);
      this.message = '';
    }
  }
};

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ exports["default"] = {
  props: {
    options: Array,
    value: String
  },
  data: function data() {
    return { open: false };
  },

  computed: {
    currentOption: function currentOption() {
      var _this = this;

      return this.options.find(function (opt) {
        return opt.value === _this.value;
      }) || {};
    },
    currentLabel: function currentLabel() {
      return this.currentOption.label || '';
    }
  },
  methods: {
    setValue: function setValue(value) {
      this.$emit('input', value);
      this.open = false;
    }
  }
};

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ exports["default"] = {};

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Toggle_vue__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Toggle_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__Toggle_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__lib_f_list__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_localforage__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_localforage___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_localforage__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__store__ = __webpack_require__(2);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//






/* harmony default export */ exports["default"] = {
  components: {
    Toggle: __WEBPACK_IMPORTED_MODULE_0__Toggle_vue___default.a
  },
  data: function data() {
    return {
      account: '',
      password: '',
      remember: false,
      status: ''
    };
  },
  created: function created() {
    var _this = this;

    __WEBPACK_IMPORTED_MODULE_2_localforage__["getItem"]('auth').then(function (value) {
      if (value) {
        _this.account = value.account;
        _this.remember = true;
      }
    });
  },

  methods: {
    submit: function submit() {
      var _this2 = this;

      this.status = '';
      __WEBPACK_IMPORTED_MODULE_3__store__["a" /* store */].login(this.account, this.password, this.remember).catch(function (err) {
        _this2.status = err;
      });
    }
  }
};

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Character_vue__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Character_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__Character_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Avatar_vue__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Avatar_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__Avatar_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__lib_f_list__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__lib_bbc__ = __webpack_require__(11);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//







/* harmony default export */ exports["default"] = {
  props: {
    sender: Object,
    message: String,
    type: String,
    time: Number
  },
  components: {
    Character: __WEBPACK_IMPORTED_MODULE_0__Character_vue___default.a,
    Avatar: __WEBPACK_IMPORTED_MODULE_1__Avatar_vue___default.a
  },
  computed: {
    avatar: function avatar() {
      return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__lib_f_list__["g" /* getAvatarURL */])(this.sender.name);
    },
    avatarStyle: function avatarStyle() {
      return { 'background-image': 'url(' + this.avatar + ')' };
    },
    isAction: function isAction() {
      return this.message.substring(0, 3) === '/me';
    },
    actionClass: function actionClass() {
      return { 'message-action': this.isAction };
    },
    parsedMessage: function parsedMessage() {
      return this.isAction ? __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__lib_bbc__["a" /* parseBBC */])(this.message.substring(4)) : __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__lib_bbc__["a" /* parseBBC */])(this.message);
    },
    parsedTime: function parsedTime() {
      if (this.time) {
        var time = new Date(this.time);
        return time.toLocaleTimeString();
      }
    }
  }
};

/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Avatar_vue__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Avatar_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__Avatar_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Status_vue__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Status_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__Status_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Toggle_vue__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Toggle_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__Toggle_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__store__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__lib_util__ = __webpack_require__(6);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//







/* harmony default export */ exports["default"] = {
  components: {
    Avatar: __WEBPACK_IMPORTED_MODULE_0__Avatar_vue___default.a,
    Status: __WEBPACK_IMPORTED_MODULE_1__Status_vue___default.a,
    Toggle: __WEBPACK_IMPORTED_MODULE_2__Toggle_vue___default.a
  },
  data: function data() {
    return {
      searchText: '',
      characters: []
    };
  },
  mounted: function mounted() {
    var _this = this;

    var timeout = void 0;
    this.$watch('searchText', function () {
      if (timeout) window.clearTimeout(timeout);
      timeout = window.setTimeout(_this.getCharacterList, 1000);
    });
    this.getCharacterList();
  },

  methods: {
    getSortWeight: function getSortWeight(char) {
      var name = char.name;
      var status = char.status;

      return __WEBPACK_IMPORTED_MODULE_3__store__["a" /* store */].isFriend(name) ? 0 : __WEBPACK_IMPORTED_MODULE_3__store__["a" /* store */].isBookmark(name) ? 1 : status === 'looking' ? 2 : 3;
    },
    compareCharacters: function compareCharacters(a, b) {
      var diff = this.getSortWeight(a) - this.getSortWeight(b);
      return diff !== 0 ? diff : a.name.localeCompare(b.name);
    },
    nameHighlight: function nameHighlight(char) {
      return __WEBPACK_IMPORTED_MODULE_3__store__["a" /* store */].isFriend(char.name) ? 'name-highlight-friend' : __WEBPACK_IMPORTED_MODULE_3__store__["a" /* store */].isBookmark(char.name) ? 'name-highlight-bookmark' : '';
    },
    characterIcon: function characterIcon(char) {
      return __WEBPACK_IMPORTED_MODULE_3__store__["a" /* store */].isFriend(char.name) ? 'heart' : __WEBPACK_IMPORTED_MODULE_3__store__["a" /* store */].isBookmark(char.name) ? 'star' : '';
    },
    getSearchQuery: function getSearchQuery(char) {
      return [char.name, char.gender, char.status, char.statusmsg, __WEBPACK_IMPORTED_MODULE_3__store__["a" /* store */].isFriend(char.name) ? 'friends' : '', __WEBPACK_IMPORTED_MODULE_3__store__["a" /* store */].isBookmark(char.name) ? 'bookmarks' : ''].join(' ').toLowerCase();
    },
    filterCharacter: function filterCharacter(char) {
      return this.getSearchQuery(char).includes(this.searchText.toLowerCase());
    },
    getCharacterList: function getCharacterList() {
      this.characters = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__lib_util__["b" /* values */])(__WEBPACK_IMPORTED_MODULE_3__store__["c" /* state */].onlineCharacters).filter(this.filterCharacter).sort(this.compareCharacters).slice(0, 200);
    }
  }
};

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ exports["default"] = {
  props: {
    header: String
  }
};

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__lib_f_list__ = __webpack_require__(3);
//
//
//
//
//
//



/* harmony default export */ exports["default"] = {
  props: {
    name: String
  },
  computed: {
    href: function href() {
      return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__lib_f_list__["h" /* getProfileURL */])(this.name);
    }
  }
};

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__lib_bbc__ = __webpack_require__(11);
//
//
//
//
//
//
//



/* harmony default export */ exports["default"] = {
  props: {
    status: String,
    statusmsg: String
  },
  computed: {
    parsedStatus: function parsedStatus() {
      return this.statusmsg ? '- ' + __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__lib_bbc__["a" /* parseBBC */])(this.statusmsg) : '';
    }
  }
};

/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Overlay_vue__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Overlay_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__Overlay_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Avatar_vue__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Avatar_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__Avatar_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ProfileLink_vue__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ProfileLink_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__ProfileLink_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__Dropdown_vue__ = __webpack_require__(113);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__Dropdown_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__Dropdown_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__store__ = __webpack_require__(2);
var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//







/* harmony default export */ exports["default"] = {
  components: {
    Overlay: __WEBPACK_IMPORTED_MODULE_0__Overlay_vue___default.a,
    Avatar: __WEBPACK_IMPORTED_MODULE_1__Avatar_vue___default.a,
    Dropdown: __WEBPACK_IMPORTED_MODULE_3__Dropdown_vue___default.a,
    ProfileLink: __WEBPACK_IMPORTED_MODULE_2__ProfileLink_vue___default.a
  },
  data: function data() {
    return {
      status: 'online',
      statusmsg: ''
    };
  },
  created: function created() {
    var char = this.onlineCharacters[this.identity];
    this.status = char.status;
    this.statusmsg = char.statusmsg;
  },

  computed: _extends({}, __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__store__["b" /* getters */])(['onlineCharacters', 'identity']), {
    statusOptions: function statusOptions() {
      return [{ value: 'online', label: 'Online' }, { value: 'looking', label: 'Looking' }, { value: 'busy', label: 'Busy' }, { value: 'away', label: 'Away' }, { value: 'dnd', label: 'DND' }];
    },
    greeting: function greeting() {
      return 'Hi, ' + this.identity.split(' ')[0] + '!';
    }
  }),
  methods: {
    submit: function submit() {
      __WEBPACK_IMPORTED_MODULE_4__store__["a" /* store */].updateStatus(this.status, this.statusmsg);
    }
  }
};

/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
//
//
//
//
//
//

/* harmony default export */ exports["default"] = {
  props: {
    value: Boolean,
    disabled: Boolean
  },
  computed: {
    iconClass: function iconClass() {
      return this.value ? 'mdi-checkbox-marked-outline' : 'mdi-checkbox-blank-outline';
    },
    toggleClass: function toggleClass() {
      return {
        checked: this.value,
        disabled: this.disabled
      };
    }
  }
};

/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Character_vue__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Character_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__Character_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__store__ = __webpack_require__(2);
//
//
//
//
//
//
//
//
//
//
//
//




/* harmony default export */ exports["default"] = {
  props: {
    users: Array,
    ops: Array
  },
  components: {
    Character: __WEBPACK_IMPORTED_MODULE_0__Character_vue___default.a
  },
  methods: {
    getSortWeight: function getSortWeight(char) {
      var name = char.name;
      var status = char.status;


      return __WEBPACK_IMPORTED_MODULE_1__store__["a" /* store */].isFriend(name) ? 0 : __WEBPACK_IMPORTED_MODULE_1__store__["a" /* store */].isBookmark(name) ? 1 : __WEBPACK_IMPORTED_MODULE_1__store__["a" /* store */].isAdmin(name) ? 2 : this.ops.includes(name) ? 3 : status === 'looking' ? 4 : 5;
    },
    getHighlight: function getHighlight(_ref) {
      var name = _ref.name;

      return __WEBPACK_IMPORTED_MODULE_1__store__["a" /* store */].isFriend(name) ? 'user-list-friend' : __WEBPACK_IMPORTED_MODULE_1__store__["a" /* store */].isBookmark(name) ? 'user-list-bookmark' : __WEBPACK_IMPORTED_MODULE_1__store__["a" /* store */].isAdmin(name) ? 'user-list-admin' : this.ops.includes(name) ? 'user-list-op' : '';
    },
    getIcon: function getIcon(_ref2) {
      var name = _ref2.name;

      return __WEBPACK_IMPORTED_MODULE_1__store__["a" /* store */].isFriend(name) ? 'heart' : __WEBPACK_IMPORTED_MODULE_1__store__["a" /* store */].isBookmark(name) ? 'star' : '';
    }
  },
  computed: {
    sortedUsers: function sortedUsers() {
      var _this = this;

      return this.users.slice().sort(function (a, b) {
        var diff = _this.getSortWeight(a) - _this.getSortWeight(b);
        return diff !== 0 ? diff : a.name.localeCompare(b.name);
      });
    }
  }
};

/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return bottomScroll; });
function scrollToBottom(event) {
  var el = event.target;
  el.dataset.bottomScrollEnabled = el.scrollHeight - el.scrollTop === el.clientHeight ? 'true' : 'false';
}

var bottomScroll = {
  bind: function bind(el) {
    el.dataset.bottomScrollEnabled = 'true';
    el.addEventListener('scroll', scrollToBottom);
  },
  update: function update(el) {
    if (el.dataset.bottomScrollEnabled === 'true') {
      window.requestAnimationFrame(function () {
        el.scrollTop = el.scrollHeight;
      });
    }
  },
  unbind: function unbind(el) {
    el.removeEventListener('scroll', scrollToBottom);
  }
};

/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__state__ = __webpack_require__(7);
/* harmony export (immutable) */ exports["a"] = getters;


function getters(props) {
  var result = {};
  if (Array.isArray(props)) {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      var _loop = function _loop() {
        var name = _step.value;

        result[name] = function () {
          return __WEBPACK_IMPORTED_MODULE_0__state__["a" /* state */][name];
        };
      };

      for (var _iterator = props[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        _loop();
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
  } else {
    var _loop2 = function _loop2(_name) {
      result[_name] = function () {
        return __WEBPACK_IMPORTED_MODULE_0__state__["a" /* state */][props[_name]];
      };
    };

    for (var _name in props) {
      _loop2(_name);
    }
  }
  return result;
}

/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__state__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__lib_util__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__lib_constructors__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__store__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_vue__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_vue__);
/* harmony export (immutable) */ exports["IDN"] = IDN;
/* harmony export (immutable) */ exports["HLO"] = HLO;
/* harmony export (immutable) */ exports["PIN"] = PIN;
/* harmony export (immutable) */ exports["ERR"] = ERR;
/* harmony export (immutable) */ exports["CON"] = CON;
/* harmony export (immutable) */ exports["FRL"] = FRL;
/* harmony export (immutable) */ exports["IGN"] = IGN;
/* harmony export (immutable) */ exports["ADL"] = ADL;
/* harmony export (immutable) */ exports["AOP"] = AOP;
/* harmony export (immutable) */ exports["LIS"] = LIS;
/* harmony export (immutable) */ exports["NLN"] = NLN;
/* harmony export (immutable) */ exports["FLN"] = FLN;
/* harmony export (immutable) */ exports["STA"] = STA;
/* harmony export (immutable) */ exports["CHA"] = CHA;
/* harmony export (immutable) */ exports["ORS"] = ORS;
/* harmony export (immutable) */ exports["JCH"] = JCH;
/* harmony export (immutable) */ exports["LCH"] = LCH;
/* harmony export (immutable) */ exports["COL"] = COL;
/* harmony export (immutable) */ exports["ICH"] = ICH;
/* harmony export (immutable) */ exports["CDS"] = CDS;
/* harmony export (immutable) */ exports["RMO"] = RMO;
/* harmony export (immutable) */ exports["MSG"] = MSG;
/* harmony export (immutable) */ exports["LRP"] = LRP;
/* harmony export (immutable) */ exports["PRI"] = PRI;
/* harmony export (immutable) */ exports["TPN"] = TPN;
/* harmony export (immutable) */ exports["RLL"] = RLL;
/* harmony export (immutable) */ exports["BRO"] = BRO;
/* harmony export (immutable) */ exports["CIU"] = CIU;
/* harmony export (immutable) */ exports["CKU"] = CKU;
/* harmony export (immutable) */ exports["COA"] = COA;
/* harmony export (immutable) */ exports["COR"] = COR;
/* harmony export (immutable) */ exports["CSO"] = CSO;
/* harmony export (immutable) */ exports["CTU"] = CTU;
/* harmony export (immutable) */ exports["DOP"] = DOP;
/* harmony export (immutable) */ exports["FKS"] = FKS;
/* harmony export (immutable) */ exports["KID"] = KID;
/* harmony export (immutable) */ exports["PRD"] = PRD;
/* harmony export (immutable) */ exports["RTB"] = RTB;
/* harmony export (immutable) */ exports["SFC"] = SFC;
/* harmony export (immutable) */ exports["SYS"] = SYS;


// reference: https://wiki.f-list.net/F-Chat_Server_Commands
/* eslint no-unused-vars: off */






function IDN() {
  console.info('Successfully identified with server.');
  __WEBPACK_IMPORTED_MODULE_0__state__["a" /* state */].appState = 'online';
  __WEBPACK_IMPORTED_MODULE_3__store__["loadChatTabs"](__WEBPACK_IMPORTED_MODULE_0__state__["a" /* state */].identity);
}

function HLO(params) {
  console.info(params.message);
}

/* ping~! */
function PIN() {
  __WEBPACK_IMPORTED_MODULE_3__store__["sendCommand"]('PIN'); /* pong ~! */
}

function ERR(params) {
  console.info('Socket error', params.message);
}

// ignored
function CON() {}

// ignored; we get friends from f-list
function FRL() {}

function IGN(_ref) {
  var action = _ref.action;
  var name = _ref.character;
  var characters = _ref.characters;

  function initIgnoredList() {
    __WEBPACK_IMPORTED_MODULE_0__state__["a" /* state */].ignored = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__lib_util__["a" /* mapToObject */])(characters, function (name) {
      return [name, true];
    });
  }

  function addIgnored() {
    __WEBPACK_IMPORTED_MODULE_4_vue___default.a.set(__WEBPACK_IMPORTED_MODULE_0__state__["a" /* state */].ignored, name, true);
  }

  function deleteIgnored() {
    __WEBPACK_IMPORTED_MODULE_4_vue___default.a.delete(__WEBPACK_IMPORTED_MODULE_0__state__["a" /* state */].ignored, name);
  }

  var actions = {
    init: initIgnoredList,
    list: initIgnoredList,
    notify: initIgnoredList,
    add: addIgnored,
    delete: deleteIgnored
  };

  actions[action]();
}

function ADL(params) {
  __WEBPACK_IMPORTED_MODULE_0__state__["a" /* state */].admins = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__lib_util__["a" /* mapToObject */])(params.ops, function (name) {
    return [name, true];
  });
}

function AOP(_ref2) {
  var character = _ref2.character;

  __WEBPACK_IMPORTED_MODULE_4_vue___default.a.set(__WEBPACK_IMPORTED_MODULE_0__state__["a" /* state */].admins, character, true);
}

function LIS(params) {
  __WEBPACK_IMPORTED_MODULE_3__store__["addCharacterBatch"](params.characters);
}

function NLN(_ref3) {
  var identity = _ref3.identity;
  var gender = _ref3.gender;

  __WEBPACK_IMPORTED_MODULE_4_vue___default.a.set(__WEBPACK_IMPORTED_MODULE_0__state__["a" /* state */].onlineCharacters, identity, __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__lib_constructors__["a" /* newCharacter */])(identity, gender));
}

function FLN(_ref4) {
  var name = _ref4.character;
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__lib_util__["b" /* values */])(__WEBPACK_IMPORTED_MODULE_0__state__["a" /* state */].channels)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var ch = _step.value;

      if (ch instanceof Object) {
        ch.users = ch.users.filter(function (u) {
          return u != null && u.name !== name;
        });
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  delete __WEBPACK_IMPORTED_MODULE_0__state__["a" /* state */].onlineCharacters[name];
}

function STA(_ref5) {
  var character = _ref5.character;
  var status = _ref5.status;
  var statusmsg = _ref5.statusmsg;

  var char = __WEBPACK_IMPORTED_MODULE_0__state__["a" /* state */].onlineCharacters[character];
  char.status = status;
  char.statusmsg = statusmsg;
}

function mapChannelInfo(channels) {
  return channels.map(function (ch) {
    return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__lib_constructors__["e" /* newChannelInfo */])(ch.name, ch.title || ch.name, ch.characters, ch.mode);
  });
}

function CHA(_ref6) {
  var channels = _ref6.channels;

  __WEBPACK_IMPORTED_MODULE_0__state__["a" /* state */].publicChannelList = mapChannelInfo(channels);
}

function ORS(_ref7) {
  var channels = _ref7.channels;

  __WEBPACK_IMPORTED_MODULE_0__state__["a" /* state */].privateChannelList = mapChannelInfo(channels);
}

function JCH(_ref8) {
  var id = _ref8.channel;
  var title = _ref8.title;
  var name = _ref8.character.identity;

  __WEBPACK_IMPORTED_MODULE_0__state__["a" /* state */].channels[id].name = title;
  __WEBPACK_IMPORTED_MODULE_0__state__["a" /* state */].channels[id].users.push(__WEBPACK_IMPORTED_MODULE_0__state__["a" /* state */].onlineCharacters[name]);
}

function LCH(_ref9) {
  var id = _ref9.channel;
  var name = _ref9.character;

  var channel = __WEBPACK_IMPORTED_MODULE_0__state__["a" /* state */].channels[id];
  channel.users = channel.users.filter(function (char) {
    return char.name !== name;
  });
}

function COL(_ref10) {
  var id = _ref10.channel;
  var oplist = _ref10.oplist;

  __WEBPACK_IMPORTED_MODULE_0__state__["a" /* state */].channels[id].ops = oplist;
}

function ICH(_ref11) {
  var id = _ref11.channel;
  var mode = _ref11.mode;
  var users = _ref11.users;

  var channel = __WEBPACK_IMPORTED_MODULE_0__state__["a" /* state */].channels[id];
  var userlist = users.map(function (_ref12) {
    var identity = _ref12.identity;
    return __WEBPACK_IMPORTED_MODULE_0__state__["a" /* state */].onlineCharacters[identity];
  });
  channel.mode = mode;
  channel.users = userlist;
}

function CDS(_ref13) {
  var id = _ref13.channel;
  var description = _ref13.description;

  __WEBPACK_IMPORTED_MODULE_0__state__["a" /* state */].channels[id].description = description;
}

function RMO(_ref14) {
  var mode = _ref14.mode;
  var id = _ref14.channel;

  __WEBPACK_IMPORTED_MODULE_0__state__["a" /* state */].channels[id].mode = mode;
}

function MSG(_ref15) {
  var id = _ref15.channel;
  var name = _ref15.character;
  var message = _ref15.message;

  var char = __WEBPACK_IMPORTED_MODULE_0__state__["a" /* state */].onlineCharacters[name];
  __WEBPACK_IMPORTED_MODULE_0__state__["a" /* state */].channels[id].messages.push(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__lib_constructors__["d" /* newMessage */])(char, message, 'chat'));
}

function LRP(_ref16) {
  var id = _ref16.channel;
  var name = _ref16.character;
  var message = _ref16.message;

  var char = __WEBPACK_IMPORTED_MODULE_0__state__["a" /* state */].onlineCharacters[name];
  __WEBPACK_IMPORTED_MODULE_0__state__["a" /* state */].channels[id].messages.push(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__lib_constructors__["d" /* newMessage */])(char, message, 'lfrp'));
}

function PRI(_ref17) {
  var name = _ref17.character;
  var message = _ref17.message;

  var chat = __WEBPACK_IMPORTED_MODULE_0__state__["a" /* state */].privateChats[name] || __WEBPACK_IMPORTED_MODULE_3__store__["openPrivateChat"](name);
  var char = __WEBPACK_IMPORTED_MODULE_0__state__["a" /* state */].onlineCharacters[name];
  chat.messages.push(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__lib_constructors__["d" /* newMessage */])(char, message, 'chat'));
}

function TPN(_ref18) {
  var name = _ref18.character;
  var status = _ref18.status;

  var chat = __WEBPACK_IMPORTED_MODULE_0__state__["a" /* state */].privateChats[name];
  if (chat) {
    chat.typing = status;
  }
}

var rolltypes = {
  dice: function dice(_ref19) {
    var name = _ref19.name;
    var results = _ref19.results;
    var rolls = _ref19.rolls;
    var endresult = _ref19.endresult;

    return name + ' rolled ' + rolls.join(', ') + ': ' + endresult + ' (' + results.join(', ') + ')';
  },
  bottle: function bottle(_ref20) {
    var name = _ref20.name;
    var target = _ref20.target;

    return name + ' spun the bottle. It landed on: ' + target;
  }
};

function RLL(params) {
  var type = params.type;
  var id = params.channel;
  var name = params.character;

  var char = __WEBPACK_IMPORTED_MODULE_0__state__["a" /* state */].onlineCharacters[name];
  var message = rolltypes[type](params);
  __WEBPACK_IMPORTED_MODULE_0__state__["a" /* state */].channels[id].messages.push(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__lib_constructors__["d" /* newMessage */])(char, message, type));
}

function BRO(_ref21) {
  var text = _ref21.message;

  __WEBPACK_IMPORTED_MODULE_0__state__["a" /* state */].notifications.push({ text: text, time: Date.now() });
}

function CIU(_ref22) {
  // show confirmation bubble

  var sender = _ref22.sender;
  var title = _ref22.title;
  var name = _ref22.name;
}

function CKU(_ref23) {
  var operator = _ref23.operator;
  var id = _ref23.channel;
  var name = _ref23.character;

  var channel = __WEBPACK_IMPORTED_MODULE_0__state__["a" /* state */].channels[id];
  channel.users = channel.users.filter(function (u) {
    return u.name !== name;
  });
}

function COA(_ref24) {
  var name = _ref24.character;
  var id = _ref24.channel;

  __WEBPACK_IMPORTED_MODULE_0__state__["a" /* state */].channels[id].ops.push(name);
}

function COR(_ref25) {
  var name = _ref25.character;
  var id = _ref25.channel;

  var channel = __WEBPACK_IMPORTED_MODULE_0__state__["a" /* state */].channels[id];
  channel.ops = channel.ops.filter(function (op) {
    return op !== name;
  });
}

function CSO(_ref26) {
  // ???

  var name = _ref26.character;
  var id = _ref26.channel;
}

function CTU(_ref27) {
  var id = _ref27.channel;
  var length = _ref27.length;
  var name = _ref27.character;

  var channel = __WEBPACK_IMPORTED_MODULE_0__state__["a" /* state */].channels[id];
  channel.users = channel.users.filter(function (u) {
    return u.name !== name;
  });
}

function DOP(_ref28) {
  var name = _ref28.character;

  __WEBPACK_IMPORTED_MODULE_0__state__["a" /* state */].admins[name] = false;
}

function FKS() {
  // deal with this later
}

function KID() {
  // probably just set state.onlineCharacters[name].kinks or something
}

function PRD() {
  // *definitely* do something with this
}

function RTB() {
  // probably more notifications
}

function SFC() {
  // hm...
}

function SYS() {
  // again, notification
}

/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, "\n.link {\n  color: #c8dcf0;\n  border-bottom: 1px solid rgba(200,220,240,0.3);\n  opacity: 1;\n  transition: 0.2s ease all;\n}\n.link:hover {\n  opacity: 0.8;\n}\n* {\n  margin: 0;\n  padding: 0;\n  box-sizing: border-box;\n}\n:root {\n  color: #ecf0f1;\n  font: 14pt Roboto, sans-serif;\n}\n:focus {\n  outline: none;\n}\na {\n  color: inherit;\n  text-decoration: none;\n}\nh1,\nh2,\nh3,\nh4,\nh5,\nh6 {\n  font-family: 'Roboto Condensed';\n  font-weight: 300;\n  opacity: 0.9;\n}\nh1 {\n  font-size: 2.4em;\n}\nh2 {\n  font-size: 1.8em;\n}\nh3 {\n  font-size: 1.5em;\n}\nh4 {\n  font-size: 1.2em;\n}\nh5 {\n  font-size: 1.1em;\n}\nh6 {\n  font-size: 0.9em;\n}\ninput,\nbutton,\ntextarea {\n  font: inherit;\n  color: inherit;\n  background: none;\n  border: none;\n}\ntextarea {\n  resize: none;\n}\nfieldset {\n  border: none;\n  margin-bottom: 0.8em;\n}\nul,\nol,\nli {\n  list-style: none;\n}\n::-webkit-scrollbar {\n  width: 10px;\n  height: 10px;\n}\n::-webkit-scrollbar-track {\n  background: #15314c;\n}\n::-webkit-scrollbar-thumb {\n  background: #2b6399;\n}\n.chat-icon {\n  width: 40px;\n  height: 40px;\n  display: inline-block;\n  background-size: contain;\n  vertical-align: text-top;\n}\n", ""]);

// exports


/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, "\n.flex-row[data-v-1] {\n  display: flex;\n  flex-direction: row;\n}\n.flex-column[data-v-1] {\n  display: flex;\n  flex-direction: column;\n}\n.flex-grow[data-v-1] {\n  flex-grow: 1;\n}\n.flex-fixed[data-v-1] {\n  flex-shrink: 0;\n}\n.flex-justify-center[data-v-1] {\n  display: flex;\n  justify-content: center;\n}\n.fade-enter-active[data-v-1] {\n  animation: fade 0.3s ease;\n}\n.fade-leave-active[data-v-1] {\n  animation: fade 0.3s ease reverse;\n}\n@-moz-keyframes fade {\nfrom {\n    opacity: 0;\n}\nto {\n    opacity: 1;\n}\n}\n@-webkit-keyframes fade {\nfrom {\n    opacity: 0;\n}\nto {\n    opacity: 1;\n}\n}\n@-o-keyframes fade {\nfrom {\n    opacity: 0;\n}\nto {\n    opacity: 1;\n}\n}\n@keyframes fade {\nfrom {\n    opacity: 0;\n}\nto {\n    opacity: 1;\n}\n}\nbody[data-v-1] {\n  position: absolute;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  display: flex;\n  flex-direction: row;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  background: #23517e;\n}\n", ""]);

// exports


/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, "\n.user-list-friend[data-v-10] {\n  background: rgba(39,174,96,0.2);\n  color: #3dd37c;\n}\n.user-list-bookmark[data-v-10] {\n  background: rgba(52,152,219,0.2);\n  color: #5dade2;\n}\n.user-list-admin[data-v-10] {\n  background: rgba(231,76,60,0.2);\n  color: #ec7063;\n}\n.user-list-op[data-v-10] {\n  background: rgba(241,196,15,0.2);\n  color: #f4d03f;\n}\n.user-list-count[data-v-10] {\n  background: #1c4165;\n  padding: 0.3em 0.6em;\n}\n.user-list-user[data-v-10] {\n  padding: 0.15em 0.3em 0.15em;\n}\n.user-list-user-icon[data-v-10] {\n  opacity: 0.8;\n  float: right;\n}\n", ""]);

// exports


/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, "\n.chat-tab[data-v-11] {\n  display: block;\n  padding: 0.4em 0.4em;\n  opacity: 0.5;\n  border-left: 2px solid #536888;\n  transition: 0.2s ease all;\n}\n.chat-tab[data-v-11]:focus {\n  border-left-color: #8194b2;\n}\n.chat-tab[data-v-11]:hover {\n  background: #1c4165;\n}\n.chat-tab-active[data-v-11] {\n  opacity: 1;\n  background: #1c4165;\n}\n[data-v-11]:not(.chat-tab-active) {\n  border-color: transparent;\n}\n.chat-tab-close[data-v-11] {\n  opacity: 0.3;\n  float: right;\n}\n.chat-tab-close[data-v-11]:hover {\n  opacity: 0.8;\n}\n.tab-text[data-v-11] {\n  margin-left: 0.2em;\n}\n", ""]);

// exports


/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, "\n.character-status-online[data-v-12] {\n  color: #2196f3;\n}\n.character-status-looking[data-v-12] {\n  color: #20df6d;\n}\n.character-status-busy[data-v-12] {\n  color: #ff9800;\n}\n.character-status-away[data-v-12] {\n  color: #fff176;\n}\n.character-status-dnd[data-v-12] {\n  color: #c6675d;\n}\n.character-status-idle[data-v-12] {\n  color: #ab7cff;\n}\n.character-status-offline[data-v-12] {\n  color: rgba(62,62,62,0.3);\n}\n.character-gender-male[data-v-12] {\n  color: #69c;\n}\n.character-gender-female[data-v-12] {\n  color: #f99d94;\n}\n.character-gender-transgender[data-v-12] {\n  color: #dba457;\n}\n.character-gender-herm[data-v-12] {\n  color: #b07cf3;\n}\n.character-gender-shemale[data-v-12] {\n  color: #e58bda;\n}\n.character-gender-cunt-boy[data-v-12] {\n  color: #60d27b;\n}\n.character-gender-male-herm[data-v-12] {\n  color: #527dff;\n}\n.character-gender-none[data-v-12] {\n  color: #e3da91;\n}\n.flex-row[data-v-12] {\n  display: flex;\n  flex-direction: row;\n}\n.flex-column[data-v-12] {\n  display: flex;\n  flex-direction: column;\n}\n.flex-grow[data-v-12] {\n  flex-grow: 1;\n}\n.flex-fixed[data-v-12] {\n  flex-shrink: 0;\n}\n.flex-justify-center[data-v-12] {\n  display: flex;\n  justify-content: center;\n}\n.fade-enter-active[data-v-12] {\n  animation: fade 0.3s ease;\n}\n.fade-leave-active[data-v-12] {\n  animation: fade 0.3s ease reverse;\n}\n@-moz-keyframes fade {\nfrom {\n    opacity: 0;\n}\nto {\n    opacity: 1;\n}\n}\n@-webkit-keyframes fade {\nfrom {\n    opacity: 0;\n}\nto {\n    opacity: 1;\n}\n}\n@-o-keyframes fade {\nfrom {\n    opacity: 0;\n}\nto {\n    opacity: 1;\n}\n}\n@keyframes fade {\nfrom {\n    opacity: 0;\n}\nto {\n    opacity: 1;\n}\n}\n.slide-right-enter-active[data-v-12] {\n  animation: slide-right 0.3s ease;\n}\n.slide-right-leave-active[data-v-12] {\n  animation: slide-right 0.3s ease reverse;\n}\n@-moz-keyframes slide-right {\nfrom {\n    transform: translateX(100%);\n}\nto {\n    transform: translateX(0);\n}\n}\n@-webkit-keyframes slide-right {\nfrom {\n    transform: translateX(100%);\n}\nto {\n    transform: translateX(0);\n}\n}\n@-o-keyframes slide-right {\nfrom {\n    transform: translateX(100%);\n}\nto {\n    transform: translateX(0);\n}\n}\n@keyframes slide-right {\nfrom {\n    transform: translateX(100%);\n}\nto {\n    transform: translateX(0);\n}\n}\n.ease-down-enter-active[data-v-12] {\n  animation: ease-down 0.3s;\n}\n.ease-down-leave-active[data-v-12] {\n  animation: ease-down 0.3s reverse;\n}\n@-moz-keyframes ease-down {\nfrom {\n    transform: translateY(-4em);\n}\nto {\n    transform: translateY(0);\n}\n}\n@-webkit-keyframes ease-down {\nfrom {\n    transform: translateY(-4em);\n}\nto {\n    transform: translateY(0);\n}\n}\n@-o-keyframes ease-down {\nfrom {\n    transform: translateY(-4em);\n}\nto {\n    transform: translateY(0);\n}\n}\n@keyframes ease-down {\nfrom {\n    transform: translateY(-4em);\n}\nto {\n    transform: translateY(0);\n}\n}\n.overlay-panel[data-v-12] {\n  background: #23517e;\n  width: max-content;\n  box-shadow: 0px 2px 6px rgba(0,0,0,0.5);\n  position: relative;\n}\n.overlay-shade[data-v-12] {\n  background: rgba(0,0,0,0.5);\n  position: absolute;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n.overlay-enter-active[data-v-12] {\n  animation: fade 0.3s ease;\n}\n.overlay-enter-active .overlay-ease-down[data-v-12] {\n  animation: ease-down 0.3s ease;\n}\n.overlay-enter-active .overlay-slide-right[data-v-12] {\n  animation: slide-right 0.3s ease;\n}\n.overlay-leave-active[data-v-12] {\n  animation: fade 0.3s ease reverse;\n}\n.overlay-leave-active .overlay-ease-down[data-v-12] {\n  animation: ease-down 0.3s ease reverse;\n}\n.overlay-leave-active .overlay-slide-right[data-v-12] {\n  animation: slide-right 0.3s ease reverse;\n}\n.overlay-panel[data-v-12] {\n  background: #1c4165;\n  position: absolute;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  position: fixed;\n  width: 12em;\n}\n.info[data-v-12] {\n  background: #23517e;\n  padding: 0.75em 1em 0.1em;\n}\n.status[data-v-12] {\n  background: #1c4165;\n  font-size: 80%;\n  font-style: italic;\n  padding: 0.3rem 0.6rem;\n}\n.friend[data-v-12] {\n  font-size: 80%;\n  font-style: italic;\n  padding: 0.3em 0.6em;\n  background: rgba(39,174,96,0.2);\n  color: #3dd37c;\n}\n.friend i[data-v-12] {\n  opacity: 0.7;\n}\nnav a[data-v-12] {\n  display: block;\n  padding: 0.5em 0.6em;\n  background: #183958;\n  transition: 0.2s ease all;\n}\nnav a[data-v-12]:hover {\n  background: #132d45;\n}\nnav i[data-v-12] {\n  width: 1.2em;\n}\n", ""]);

// exports


/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, "\n.form-input[data-v-13] {\n  transform: scale(1);\n  display: inline-block;\n  transition: 0.2s ease all;\n  width: 10em;\n  background: #1a3d5f;\n  padding: 0.3em 0.6em;\n  font-size: 90%;\n  border-bottom: 2px solid #536888;\n}\n.form-input[data-v-13]:active {\n  transform: scale(0.95);\n  transition-duration: 0s;\n}\n.form-input[data-v-13]:focus {\n  border-bottom-color: #8194b2;\n}\n.form-button[data-v-13] {\n  width: 10em;\n  background: #1a3d5f;\n  padding: 0.3em 0.6em;\n  font-size: 90%;\n  width: min-content;\n  min-width: 4em;\n  cursor: pointer;\n  transform: scale(1);\n  display: inline-block;\n  transition: 0.2s ease all;\n}\n.form-button[data-v-13]:hover {\n  transform: translateY(-0.2em);\n}\n.form-button[data-v-13]:active {\n  transform: scale(0.95);\n  transition-duration: 0s;\n}\n.form-textarea[data-v-13] {\n  width: 10em;\n  background: #1a3d5f;\n  padding: 0.3em 0.6em;\n  font-size: 90%;\n  border-bottom: 2px solid #536888;\n  transition: 0.25s;\n}\n.form-textarea[data-v-13]:focus {\n  border-bottom-color: #8194b2;\n}\n.form-icon-input[data-v-13] {\n  transform: scale(1);\n  display: inline-block;\n  transition: 0.2s ease all;\n  position: relative;\n}\n.form-icon-input[data-v-13]:active {\n  transform: scale(0.95);\n  transition-duration: 0s;\n}\n.form-icon-input i[data-v-13] {\n  position: absolute;\n  padding: 0.3em 0.5em;\n  pointer-events: none;\n  opacity: 0.5;\n}\n.form-icon-input input[data-v-13],\n.form-icon-input textarea[data-v-13] {\n  width: 10em;\n  background: #1a3d5f;\n  padding: 0.3em 0.6em;\n  font-size: 90%;\n  border-bottom: 2px solid #536888;\n  transition: 0.25s;\n  padding-left: 2em;\n}\n.form-icon-input input[data-v-13]:focus,\n.form-icon-input textarea[data-v-13]:focus {\n  border-bottom-color: #8194b2;\n}\n.form-selection-list[data-v-13] {\n  display: inline-block;\n  width: 14em;\n  height: 20em;\n  background: #1c4165;\n  overflow-y: auto;\n}\n.form-selection-list a[data-v-13] {\n  transform: scale(1);\n  display: inline-block;\n  transition: 0.2s ease all;\n  display: block;\n  padding: 0.35em 0.6em;\n}\n.form-selection-list a[data-v-13]:active {\n  transform: scale(0.95);\n  transition-duration: 0s;\n}\n.form-selection-list a.active[data-v-13] {\n  background: rgba(39,174,96,0.2);\n  color: #3dd37c;\n}\nform[data-v-13] {\n  text-align: center;\n}\n.form-selection-list[data-v-13] {\n  text-align: left;\n  width: 22em;\n  height: calc(100vh - 14em);\n}\n.channel-user-count[data-v-13] {\n  float: right;\n}\n.channel-id[data-v-13] {\n  margin-left: 1.3rem;\n  color: #367dc2;\n}\n.channel-joined[data-v-13] {\n  background: rgba(39,174,96,0.2);\n  color: #3dd37c;\n}\n", ""]);

// exports


/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, "\n.character-status-online[data-v-14] {\n  color: #2196f3;\n}\n.character-status-looking[data-v-14] {\n  color: #20df6d;\n}\n.character-status-busy[data-v-14] {\n  color: #ff9800;\n}\n.character-status-away[data-v-14] {\n  color: #fff176;\n}\n.character-status-dnd[data-v-14] {\n  color: #c6675d;\n}\n.character-status-idle[data-v-14] {\n  color: #ab7cff;\n}\n.character-status-offline[data-v-14] {\n  color: rgba(62,62,62,0.3);\n}\n.character-gender-male[data-v-14] {\n  color: #69c;\n}\n.character-gender-female[data-v-14] {\n  color: #f99d94;\n}\n.character-gender-transgender[data-v-14] {\n  color: #dba457;\n}\n.character-gender-herm[data-v-14] {\n  color: #b07cf3;\n}\n.character-gender-shemale[data-v-14] {\n  color: #e58bda;\n}\n.character-gender-cunt-boy[data-v-14] {\n  color: #60d27b;\n}\n.character-gender-male-herm[data-v-14] {\n  color: #527dff;\n}\n.character-gender-none[data-v-14] {\n  color: #e3da91;\n}\n", ""]);

// exports


/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, "\n[data-tooltip][data-v-15] {\n  position: relative;\n}\n[data-tooltip][data-v-15]::after {\n  content: attr(data-tooltip);\n  background: #11293f;\n  font-size: 0.9rem;\n  position: absolute;\n  padding: 0.3em 0.6em;\n  width: max-content;\n  max-width: 10em;\n  text-align: center;\n  border-radius: 0.15em;\n  pointer-events: none;\n  opacity: 0;\n  z-index: 9999;\n  transition: 0.3s;\n}\n[data-tooltip][data-v-15]:hover::after {\n  opacity: 1;\n  transition-delay: 0.3s;\n}\n[data-tooltip].tooltip-right[data-v-15]::after {\n  top: 50%;\n  transform: translateY(-50%);\n}\n[data-tooltip].tooltip-right[data-v-15]:hover::after {\n  transform: translateY(-50%) translateX(0.5em);\n}\n[data-tooltip].tooltip-bottom[data-v-15]::after {\n  top: 100%;\n  left: 50%;\n  transform: translateX(-50%);\n}\n[data-tooltip].tooltip-bottom[data-v-15]:hover::after {\n  transform: translateX(-50%) translateY(0.3em);\n}\n.flex-row[data-v-15] {\n  display: flex;\n  flex-direction: row;\n}\n.flex-column[data-v-15] {\n  display: flex;\n  flex-direction: column;\n}\n.flex-grow[data-v-15] {\n  flex-grow: 1;\n}\n.flex-fixed[data-v-15] {\n  flex-shrink: 0;\n}\n.flex-justify-center[data-v-15] {\n  display: flex;\n  justify-content: center;\n}\nheader[data-v-15] {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\nheader nav[data-v-15] {\n  text-align: right;\n}\nheader nav a[data-v-15] {\n  transform: scale(1);\n  display: inline-block;\n  transition: 0.2s ease all;\n  font-size: 130%;\n  margin-left: 0.6em;\n}\nheader nav a[data-v-15]:active {\n  transform: scale(0.95);\n  transition-duration: 0s;\n}\n", ""]);

// exports


/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, "\n[data-tooltip][data-v-16] {\n  position: relative;\n}\n[data-tooltip][data-v-16]::after {\n  content: attr(data-tooltip);\n  background: #11293f;\n  font-size: 0.9rem;\n  position: absolute;\n  padding: 0.3em 0.6em;\n  width: max-content;\n  max-width: 10em;\n  text-align: center;\n  border-radius: 0.15em;\n  pointer-events: none;\n  opacity: 0;\n  z-index: 9999;\n  transition: 0.3s;\n}\n[data-tooltip][data-v-16]:hover::after {\n  opacity: 1;\n  transition-delay: 0.3s;\n}\n[data-tooltip].tooltip-right[data-v-16]::after {\n  top: 50%;\n  transform: translateY(-50%);\n}\n[data-tooltip].tooltip-right[data-v-16]:hover::after {\n  transform: translateY(-50%) translateX(0.5em);\n}\n[data-tooltip].tooltip-bottom[data-v-16]::after {\n  top: 100%;\n  left: 50%;\n  transform: translateX(-50%);\n}\n[data-tooltip].tooltip-bottom[data-v-16]:hover::after {\n  transform: translateX(-50%) translateY(0.3em);\n}\n", ""]);

// exports


/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, "\n.description[data-v-17] {\n  white-space: pre-wrap;\n}\n", ""]);

// exports


/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, "\n.flex-row[data-v-18] {\n  display: flex;\n  flex-direction: row;\n}\n.flex-column[data-v-18] {\n  display: flex;\n  flex-direction: column;\n}\n.flex-grow[data-v-18] {\n  flex-grow: 1;\n}\n.flex-fixed[data-v-18] {\n  flex-shrink: 0;\n}\n.flex-justify-center[data-v-18] {\n  display: flex;\n  justify-content: center;\n}\n.character-status-online[data-v-18] {\n  color: #2196f3;\n}\n.character-status-looking[data-v-18] {\n  color: #20df6d;\n}\n.character-status-busy[data-v-18] {\n  color: #ff9800;\n}\n.character-status-away[data-v-18] {\n  color: #fff176;\n}\n.character-status-dnd[data-v-18] {\n  color: #c6675d;\n}\n.character-status-idle[data-v-18] {\n  color: #ab7cff;\n}\n.character-status-offline[data-v-18] {\n  color: rgba(62,62,62,0.3);\n}\n.character-gender-male[data-v-18] {\n  color: #69c;\n}\n.character-gender-female[data-v-18] {\n  color: #f99d94;\n}\n.character-gender-transgender[data-v-18] {\n  color: #dba457;\n}\n.character-gender-herm[data-v-18] {\n  color: #b07cf3;\n}\n.character-gender-shemale[data-v-18] {\n  color: #e58bda;\n}\n.character-gender-cunt-boy[data-v-18] {\n  color: #60d27b;\n}\n.character-gender-male-herm[data-v-18] {\n  color: #527dff;\n}\n.character-gender-none[data-v-18] {\n  color: #e3da91;\n}\n.form-input[data-v-18] {\n  transform: scale(1);\n  display: inline-block;\n  transition: 0.2s ease all;\n  width: 10em;\n  background: #1a3d5f;\n  padding: 0.3em 0.6em;\n  font-size: 90%;\n  border-bottom: 2px solid #536888;\n}\n.form-input[data-v-18]:active {\n  transform: scale(0.95);\n  transition-duration: 0s;\n}\n.form-input[data-v-18]:focus {\n  border-bottom-color: #8194b2;\n}\n.form-button[data-v-18] {\n  width: 10em;\n  background: #1a3d5f;\n  padding: 0.3em 0.6em;\n  font-size: 90%;\n  width: min-content;\n  min-width: 4em;\n  cursor: pointer;\n  transform: scale(1);\n  display: inline-block;\n  transition: 0.2s ease all;\n}\n.form-button[data-v-18]:hover {\n  transform: translateY(-0.2em);\n}\n.form-button[data-v-18]:active {\n  transform: scale(0.95);\n  transition-duration: 0s;\n}\n.form-textarea[data-v-18] {\n  width: 10em;\n  background: #1a3d5f;\n  padding: 0.3em 0.6em;\n  font-size: 90%;\n  border-bottom: 2px solid #536888;\n  transition: 0.25s;\n}\n.form-textarea[data-v-18]:focus {\n  border-bottom-color: #8194b2;\n}\n.form-icon-input[data-v-18] {\n  transform: scale(1);\n  display: inline-block;\n  transition: 0.2s ease all;\n  position: relative;\n}\n.form-icon-input[data-v-18]:active {\n  transform: scale(0.95);\n  transition-duration: 0s;\n}\n.form-icon-input i[data-v-18] {\n  position: absolute;\n  padding: 0.3em 0.5em;\n  pointer-events: none;\n  opacity: 0.5;\n}\n.form-icon-input input[data-v-18],\n.form-icon-input textarea[data-v-18] {\n  width: 10em;\n  background: #1a3d5f;\n  padding: 0.3em 0.6em;\n  font-size: 90%;\n  border-bottom: 2px solid #536888;\n  transition: 0.25s;\n  padding-left: 2em;\n}\n.form-icon-input input[data-v-18]:focus,\n.form-icon-input textarea[data-v-18]:focus {\n  border-bottom-color: #8194b2;\n}\n.form-selection-list[data-v-18] {\n  display: inline-block;\n  width: 14em;\n  height: 20em;\n  background: #1c4165;\n  overflow-y: auto;\n}\n.form-selection-list a[data-v-18] {\n  transform: scale(1);\n  display: inline-block;\n  transition: 0.2s ease all;\n  display: block;\n  padding: 0.35em 0.6em;\n}\n.form-selection-list a[data-v-18]:active {\n  transform: scale(0.95);\n  transition-duration: 0s;\n}\n.form-selection-list a.active[data-v-18] {\n  background: rgba(39,174,96,0.2);\n  color: #3dd37c;\n}\n.link[data-v-18] {\n  color: #c8dcf0;\n  border-bottom: 1px solid rgba(200,220,240,0.3);\n  opacity: 1;\n  transition: 0.2s ease all;\n}\n.link[data-v-18]:hover {\n  opacity: 0.8;\n}\n.shade[data-v-18] {\n  position: absolute;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  display: flex;\n  justify-content: center;\n  align-items: flex-start;\n  background: rgba(0,0,0,0.8);\n  flex-wrap: wrap;\n  overflow-y: auto;\n  padding: 1em 1em 4em;\n  align-content: flex-start;\n}\n.header[data-v-18] {\n  position: absolute;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  position: fixed;\n  background: #23517e;\n  padding: 0.5em 1em;\n  box-shadow: 0px 0px 8px rgba(0,0,0,0.8);\n  text-align: center;\n}\n.category[data-v-18] {\n  margin-right: 0.8em;\n}\n.character[data-v-18] {\n  background: #23517e;\n  margin: 0.7em;\n  box-sizing: content-box;\n  border-bottom: 2px solid #536888;\n  transition: 0.2s ease all;\n}\n.character[data-v-18]:focus {\n  border-bottom-color: #8194b2;\n}\n.character[data-v-18]:hover {\n  transform: translateY(-0.3em);\n}\n.user-info[data-v-18] {\n  width: 10em;\n  height: 6em;\n}\n.name[data-v-18] {\n  background: #11293f;\n}\n.name-text[data-v-18] {\n  padding: 0.3em 0.6em;\n}\n.name-icon[data-v-18] {\n  float: right;\n}\n.name-highlight-friend[data-v-18] {\n  background: rgba(39,174,96,0.2);\n  color: #3dd37c;\n}\n.name-highlight-bookmark[data-v-18] {\n  background: rgba(52,152,219,0.2);\n  color: #5dade2;\n}\n.status[data-v-18] {\n  padding: 0.3em 0.6em;\n  background: #1c4165;\n  font-size: 80%;\n  font-style: italic;\n  overflow-y: auto;\n  min-height: 0;\n}\n", ""]);

// exports


/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, "\n.flex-row[data-v-19] {\n  display: flex;\n  flex-direction: row;\n}\n.flex-column[data-v-19] {\n  display: flex;\n  flex-direction: column;\n}\n.flex-grow[data-v-19] {\n  flex-grow: 1;\n}\n.flex-fixed[data-v-19] {\n  flex-shrink: 0;\n}\n.flex-justify-center[data-v-19] {\n  display: flex;\n  justify-content: center;\n}\n.fade-enter-active[data-v-19] {\n  animation: fade 0.3s ease;\n}\n.fade-leave-active[data-v-19] {\n  animation: fade 0.3s ease reverse;\n}\n@-moz-keyframes fade {\nfrom {\n    opacity: 0;\n}\nto {\n    opacity: 1;\n}\n}\n@-webkit-keyframes fade {\nfrom {\n    opacity: 0;\n}\nto {\n    opacity: 1;\n}\n}\n@-o-keyframes fade {\nfrom {\n    opacity: 0;\n}\nto {\n    opacity: 1;\n}\n}\n@keyframes fade {\nfrom {\n    opacity: 0;\n}\nto {\n    opacity: 1;\n}\n}\n.slide-right-enter-active[data-v-19] {\n  animation: slide-right 0.3s ease;\n}\n.slide-right-leave-active[data-v-19] {\n  animation: slide-right 0.3s ease reverse;\n}\n@-moz-keyframes slide-right {\nfrom {\n    transform: translateX(100%);\n}\nto {\n    transform: translateX(0);\n}\n}\n@-webkit-keyframes slide-right {\nfrom {\n    transform: translateX(100%);\n}\nto {\n    transform: translateX(0);\n}\n}\n@-o-keyframes slide-right {\nfrom {\n    transform: translateX(100%);\n}\nto {\n    transform: translateX(0);\n}\n}\n@keyframes slide-right {\nfrom {\n    transform: translateX(100%);\n}\nto {\n    transform: translateX(0);\n}\n}\n.ease-down-enter-active[data-v-19] {\n  animation: ease-down 0.3s;\n}\n.ease-down-leave-active[data-v-19] {\n  animation: ease-down 0.3s reverse;\n}\n@-moz-keyframes ease-down {\nfrom {\n    transform: translateY(-4em);\n}\nto {\n    transform: translateY(0);\n}\n}\n@-webkit-keyframes ease-down {\nfrom {\n    transform: translateY(-4em);\n}\nto {\n    transform: translateY(0);\n}\n}\n@-o-keyframes ease-down {\nfrom {\n    transform: translateY(-4em);\n}\nto {\n    transform: translateY(0);\n}\n}\n@keyframes ease-down {\nfrom {\n    transform: translateY(-4em);\n}\nto {\n    transform: translateY(0);\n}\n}\n.overlay-panel[data-v-19] {\n  background: #23517e;\n  width: max-content;\n  box-shadow: 0px 2px 6px rgba(0,0,0,0.5);\n  position: relative;\n}\n.overlay-shade[data-v-19] {\n  background: rgba(0,0,0,0.5);\n  position: absolute;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n.overlay-enter-active[data-v-19] {\n  animation: fade 0.3s ease;\n}\n.overlay-enter-active .overlay-ease-down[data-v-19] {\n  animation: ease-down 0.3s ease;\n}\n.overlay-enter-active .overlay-slide-right[data-v-19] {\n  animation: slide-right 0.3s ease;\n}\n.overlay-leave-active[data-v-19] {\n  animation: fade 0.3s ease reverse;\n}\n.overlay-leave-active .overlay-ease-down[data-v-19] {\n  animation: ease-down 0.3s ease reverse;\n}\n.overlay-leave-active .overlay-slide-right[data-v-19] {\n  animation: slide-right 0.3s ease reverse;\n}\n.form-input[data-v-19] {\n  transform: scale(1);\n  display: inline-block;\n  transition: 0.2s ease all;\n  width: 10em;\n  background: #1a3d5f;\n  padding: 0.3em 0.6em;\n  font-size: 90%;\n  border-bottom: 2px solid #536888;\n}\n.form-input[data-v-19]:active {\n  transform: scale(0.95);\n  transition-duration: 0s;\n}\n.form-input[data-v-19]:focus {\n  border-bottom-color: #8194b2;\n}\n.form-button[data-v-19] {\n  width: 10em;\n  background: #1a3d5f;\n  padding: 0.3em 0.6em;\n  font-size: 90%;\n  width: min-content;\n  min-width: 4em;\n  cursor: pointer;\n  transform: scale(1);\n  display: inline-block;\n  transition: 0.2s ease all;\n}\n.form-button[data-v-19]:hover {\n  transform: translateY(-0.2em);\n}\n.form-button[data-v-19]:active {\n  transform: scale(0.95);\n  transition-duration: 0s;\n}\n.form-textarea[data-v-19] {\n  width: 10em;\n  background: #1a3d5f;\n  padding: 0.3em 0.6em;\n  font-size: 90%;\n  border-bottom: 2px solid #536888;\n  transition: 0.25s;\n}\n.form-textarea[data-v-19]:focus {\n  border-bottom-color: #8194b2;\n}\n.form-icon-input[data-v-19] {\n  transform: scale(1);\n  display: inline-block;\n  transition: 0.2s ease all;\n  position: relative;\n}\n.form-icon-input[data-v-19]:active {\n  transform: scale(0.95);\n  transition-duration: 0s;\n}\n.form-icon-input i[data-v-19] {\n  position: absolute;\n  padding: 0.3em 0.5em;\n  pointer-events: none;\n  opacity: 0.5;\n}\n.form-icon-input input[data-v-19],\n.form-icon-input textarea[data-v-19] {\n  width: 10em;\n  background: #1a3d5f;\n  padding: 0.3em 0.6em;\n  font-size: 90%;\n  border-bottom: 2px solid #536888;\n  transition: 0.25s;\n  padding-left: 2em;\n}\n.form-icon-input input[data-v-19]:focus,\n.form-icon-input textarea[data-v-19]:focus {\n  border-bottom-color: #8194b2;\n}\n.form-selection-list[data-v-19] {\n  display: inline-block;\n  width: 14em;\n  height: 20em;\n  background: #1c4165;\n  overflow-y: auto;\n}\n.form-selection-list a[data-v-19] {\n  transform: scale(1);\n  display: inline-block;\n  transition: 0.2s ease all;\n  display: block;\n  padding: 0.35em 0.6em;\n}\n.form-selection-list a[data-v-19]:active {\n  transform: scale(0.95);\n  transition-duration: 0s;\n}\n.form-selection-list a.active[data-v-19] {\n  background: rgba(39,174,96,0.2);\n  color: #3dd37c;\n}\n.greeting[data-v-19] {\n  text-align: center;\n}\n.greeting-subtext[data-v-19] {\n  font-size: 80%;\n  opacity: 0.5;\n}\n.content-container[data-v-19] {\n  margin: 1em 1em 0;\n}\n.avatar-container[data-v-19] {\n  margin-top: 1em;\n  margin-right: 1em;\n}\n.form-container[data-v-19] {\n  margin-top: 1em;\n}\n.status-message[data-v-19] {\n  width: 12em !important;\n  height: 5em !important;\n}\n", ""]);

// exports


/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, "\n.form-input[data-v-2] {\n  transform: scale(1);\n  display: inline-block;\n  transition: 0.2s ease all;\n  width: 10em;\n  background: #1a3d5f;\n  padding: 0.3em 0.6em;\n  font-size: 90%;\n  border-bottom: 2px solid #536888;\n}\n.form-input[data-v-2]:active {\n  transform: scale(0.95);\n  transition-duration: 0s;\n}\n.form-input[data-v-2]:focus {\n  border-bottom-color: #8194b2;\n}\n.form-button[data-v-2] {\n  width: 10em;\n  background: #1a3d5f;\n  padding: 0.3em 0.6em;\n  font-size: 90%;\n  width: min-content;\n  min-width: 4em;\n  cursor: pointer;\n  transform: scale(1);\n  display: inline-block;\n  transition: 0.2s ease all;\n}\n.form-button[data-v-2]:hover {\n  transform: translateY(-0.2em);\n}\n.form-button[data-v-2]:active {\n  transform: scale(0.95);\n  transition-duration: 0s;\n}\n.form-textarea[data-v-2] {\n  width: 10em;\n  background: #1a3d5f;\n  padding: 0.3em 0.6em;\n  font-size: 90%;\n  border-bottom: 2px solid #536888;\n  transition: 0.25s;\n}\n.form-textarea[data-v-2]:focus {\n  border-bottom-color: #8194b2;\n}\n.form-icon-input[data-v-2] {\n  transform: scale(1);\n  display: inline-block;\n  transition: 0.2s ease all;\n  position: relative;\n}\n.form-icon-input[data-v-2]:active {\n  transform: scale(0.95);\n  transition-duration: 0s;\n}\n.form-icon-input i[data-v-2] {\n  position: absolute;\n  padding: 0.3em 0.5em;\n  pointer-events: none;\n  opacity: 0.5;\n}\n.form-icon-input input[data-v-2],\n.form-icon-input textarea[data-v-2] {\n  width: 10em;\n  background: #1a3d5f;\n  padding: 0.3em 0.6em;\n  font-size: 90%;\n  border-bottom: 2px solid #536888;\n  transition: 0.25s;\n  padding-left: 2em;\n}\n.form-icon-input input[data-v-2]:focus,\n.form-icon-input textarea[data-v-2]:focus {\n  border-bottom-color: #8194b2;\n}\n.form-selection-list[data-v-2] {\n  display: inline-block;\n  width: 14em;\n  height: 20em;\n  background: #1c4165;\n  overflow-y: auto;\n}\n.form-selection-list a[data-v-2] {\n  transform: scale(1);\n  display: inline-block;\n  transition: 0.2s ease all;\n  display: block;\n  padding: 0.35em 0.6em;\n}\n.form-selection-list a[data-v-2]:active {\n  transform: scale(0.95);\n  transition-duration: 0s;\n}\n.form-selection-list a.active[data-v-2] {\n  background: rgba(39,174,96,0.2);\n  color: #3dd37c;\n}\nform[data-v-2] {\n  text-align: center;\n}\n.status[data-v-2] {\n  max-width: 16em;\n}\n", ""]);

// exports


/***/ },
/* 62 */
/***/ function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, "\n.avatar[data-v-20] {\n  display: inline-block;\n}\n.shadow[data-v-20] {\n  filter: drop-shadow(0em 0.1em 0.15em rgba(0,0,0,0.5));\n}\n", ""]);

// exports


/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, "\n.fade-enter-active[data-v-22] {\n  animation: fade 0.3s ease;\n}\n.fade-leave-active[data-v-22] {\n  animation: fade 0.3s ease reverse;\n}\n@-moz-keyframes fade {\nfrom {\n    opacity: 0;\n}\nto {\n    opacity: 1;\n}\n}\n@-webkit-keyframes fade {\nfrom {\n    opacity: 0;\n}\nto {\n    opacity: 1;\n}\n}\n@-o-keyframes fade {\nfrom {\n    opacity: 0;\n}\nto {\n    opacity: 1;\n}\n}\n@keyframes fade {\nfrom {\n    opacity: 0;\n}\nto {\n    opacity: 1;\n}\n}\n.current[data-v-22] {\n  width: 10em;\n  background: #1a3d5f;\n  padding: 0.3em 0.6em;\n  font-size: 90%;\n  transform: scale(1);\n  display: inline-block;\n  transition: 0.2s ease all;\n  border-bottom: 2px solid #536888;\n}\n.current[data-v-22]:active {\n  transform: scale(0.95);\n  transition-duration: 0s;\n}\n.current[data-v-22]:focus {\n  border-bottom-color: #8194b2;\n}\n.option-list[data-v-22] {\n  width: 10em;\n  background: #1a3d5f;\n  padding: 0.3em 0.6em;\n  font-size: 90%;\n  border-bottom: 2px solid #536888;\n  padding: 0;\n  position: absolute;\n  z-index: 9999;\n  transform: translateY(-50%);\n}\n.option-list[data-v-22]:focus {\n  border-bottom-color: #8194b2;\n}\n.option[data-v-22] {\n  width: 10em;\n  background: #1a3d5f;\n  padding: 0.3em 0.6em;\n  font-size: 90%;\n  transform: scale(1);\n  display: inline-block;\n  transition: 0.2s ease all;\n  display: block;\n}\n.option[data-v-22]:active {\n  transform: scale(0.95);\n  transition-duration: 0s;\n}\n", ""]);

// exports


/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, "\n.flex-row[data-v-23] {\n  display: flex;\n  flex-direction: row;\n}\n.flex-column[data-v-23] {\n  display: flex;\n  flex-direction: column;\n}\n.flex-grow[data-v-23] {\n  flex-grow: 1;\n}\n.flex-fixed[data-v-23] {\n  flex-shrink: 0;\n}\n.flex-justify-center[data-v-23] {\n  display: flex;\n  justify-content: center;\n}\n.fade-enter-active[data-v-23] {\n  animation: fade 0.3s ease;\n}\n.fade-leave-active[data-v-23] {\n  animation: fade 0.3s ease reverse;\n}\n@-moz-keyframes fade {\nfrom {\n    opacity: 0;\n}\nto {\n    opacity: 1;\n}\n}\n@-webkit-keyframes fade {\nfrom {\n    opacity: 0;\n}\nto {\n    opacity: 1;\n}\n}\n@-o-keyframes fade {\nfrom {\n    opacity: 0;\n}\nto {\n    opacity: 1;\n}\n}\n@keyframes fade {\nfrom {\n    opacity: 0;\n}\nto {\n    opacity: 1;\n}\n}\n.slide-right-enter-active[data-v-23] {\n  animation: slide-right 0.3s ease;\n}\n.slide-right-leave-active[data-v-23] {\n  animation: slide-right 0.3s ease reverse;\n}\n@-moz-keyframes slide-right {\nfrom {\n    transform: translateX(100%);\n}\nto {\n    transform: translateX(0);\n}\n}\n@-webkit-keyframes slide-right {\nfrom {\n    transform: translateX(100%);\n}\nto {\n    transform: translateX(0);\n}\n}\n@-o-keyframes slide-right {\nfrom {\n    transform: translateX(100%);\n}\nto {\n    transform: translateX(0);\n}\n}\n@keyframes slide-right {\nfrom {\n    transform: translateX(100%);\n}\nto {\n    transform: translateX(0);\n}\n}\n.ease-down-enter-active[data-v-23] {\n  animation: ease-down 0.3s;\n}\n.ease-down-leave-active[data-v-23] {\n  animation: ease-down 0.3s reverse;\n}\n@-moz-keyframes ease-down {\nfrom {\n    transform: translateY(-4em);\n}\nto {\n    transform: translateY(0);\n}\n}\n@-webkit-keyframes ease-down {\nfrom {\n    transform: translateY(-4em);\n}\nto {\n    transform: translateY(0);\n}\n}\n@-o-keyframes ease-down {\nfrom {\n    transform: translateY(-4em);\n}\nto {\n    transform: translateY(0);\n}\n}\n@keyframes ease-down {\nfrom {\n    transform: translateY(-4em);\n}\nto {\n    transform: translateY(0);\n}\n}\n.overlay-panel[data-v-23] {\n  background: #23517e;\n  width: max-content;\n  box-shadow: 0px 2px 6px rgba(0,0,0,0.5);\n  position: relative;\n}\n.overlay-shade[data-v-23] {\n  background: rgba(0,0,0,0.5);\n  position: absolute;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n.overlay-enter-active[data-v-23] {\n  animation: fade 0.3s ease;\n}\n.overlay-enter-active .overlay-ease-down[data-v-23] {\n  animation: ease-down 0.3s ease;\n}\n.overlay-enter-active .overlay-slide-right[data-v-23] {\n  animation: slide-right 0.3s ease;\n}\n.overlay-leave-active[data-v-23] {\n  animation: fade 0.3s ease reverse;\n}\n.overlay-leave-active .overlay-ease-down[data-v-23] {\n  animation: ease-down 0.3s ease reverse;\n}\n.overlay-leave-active .overlay-slide-right[data-v-23] {\n  animation: slide-right 0.3s ease reverse;\n}\n.header[data-v-23] {\n  background: #204971;\n  padding: 0.5em 1em;\n  text-align: center;\n  border-bottom: 2px solid #536888;\n}\n.header[data-v-23]:focus {\n  border-bottom-color: #8194b2;\n}\n.overlay-close[data-v-23] {\n  padding: 0.3em 0.5em;\n  opacity: 0.3;\n  position: absolute;\n  top: 0;\n  right: 0;\n  transition: 0.2s ease all;\n}\n.overlay-close[data-v-23]:hover {\n  opacity: 0.7;\n}\n", ""]);

// exports


/***/ },
/* 65 */
/***/ function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, "\n.form-input[data-v-3] {\n  transform: scale(1);\n  display: inline-block;\n  transition: 0.2s ease all;\n  width: 10em;\n  background: #1a3d5f;\n  padding: 0.3em 0.6em;\n  font-size: 90%;\n  border-bottom: 2px solid #536888;\n}\n.form-input[data-v-3]:active {\n  transform: scale(0.95);\n  transition-duration: 0s;\n}\n.form-input[data-v-3]:focus {\n  border-bottom-color: #8194b2;\n}\n.form-button[data-v-3] {\n  width: 10em;\n  background: #1a3d5f;\n  padding: 0.3em 0.6em;\n  font-size: 90%;\n  width: min-content;\n  min-width: 4em;\n  cursor: pointer;\n  transform: scale(1);\n  display: inline-block;\n  transition: 0.2s ease all;\n}\n.form-button[data-v-3]:hover {\n  transform: translateY(-0.2em);\n}\n.form-button[data-v-3]:active {\n  transform: scale(0.95);\n  transition-duration: 0s;\n}\n.form-textarea[data-v-3] {\n  width: 10em;\n  background: #1a3d5f;\n  padding: 0.3em 0.6em;\n  font-size: 90%;\n  border-bottom: 2px solid #536888;\n  transition: 0.25s;\n}\n.form-textarea[data-v-3]:focus {\n  border-bottom-color: #8194b2;\n}\n.form-icon-input[data-v-3] {\n  transform: scale(1);\n  display: inline-block;\n  transition: 0.2s ease all;\n  position: relative;\n}\n.form-icon-input[data-v-3]:active {\n  transform: scale(0.95);\n  transition-duration: 0s;\n}\n.form-icon-input i[data-v-3] {\n  position: absolute;\n  padding: 0.3em 0.5em;\n  pointer-events: none;\n  opacity: 0.5;\n}\n.form-icon-input input[data-v-3],\n.form-icon-input textarea[data-v-3] {\n  width: 10em;\n  background: #1a3d5f;\n  padding: 0.3em 0.6em;\n  font-size: 90%;\n  border-bottom: 2px solid #536888;\n  transition: 0.25s;\n  padding-left: 2em;\n}\n.form-icon-input input[data-v-3]:focus,\n.form-icon-input textarea[data-v-3]:focus {\n  border-bottom-color: #8194b2;\n}\n.form-selection-list[data-v-3] {\n  display: inline-block;\n  width: 14em;\n  height: 20em;\n  background: #1c4165;\n  overflow-y: auto;\n}\n.form-selection-list a[data-v-3] {\n  transform: scale(1);\n  display: inline-block;\n  transition: 0.2s ease all;\n  display: block;\n  padding: 0.35em 0.6em;\n}\n.form-selection-list a[data-v-3]:active {\n  transform: scale(0.95);\n  transition-duration: 0s;\n}\n.form-selection-list a.active[data-v-3] {\n  background: rgba(39,174,96,0.2);\n  color: #3dd37c;\n}\n.character-list[data-v-3] {\n  text-align: center;\n}\n.character-list-avatar[data-v-3] {\n  width: 100px;\n  height: 100px;\n  margin: 0.3em;\n  display: inline-block;\n  filter: drop-shadow(0px 2px 4px rgba(0,0,0,0.5));\n}\n.form-selection-list[data-v-3] {\n  width: 12em;\n}\n", ""]);

// exports


/***/ },
/* 66 */
/***/ function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, "\n.flex-row[data-v-4] {\n  display: flex;\n  flex-direction: row;\n}\n.flex-column[data-v-4] {\n  display: flex;\n  flex-direction: column;\n}\n.flex-grow[data-v-4] {\n  flex-grow: 1;\n}\n.flex-fixed[data-v-4] {\n  flex-shrink: 0;\n}\n.flex-justify-center[data-v-4] {\n  display: flex;\n  justify-content: center;\n}\n.shade[data-v-4] {\n  position: absolute;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  display: flex;\n  flex-direction: column;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  background: rgba(0,0,0,0.5);\n}\n.icon[data-v-4] {\n  font-size: 500%;\n  animation: loading-animation 3s infinite;\n}\n.text[data-v-4] {\n  font-style: italic;\n}\n@-moz-keyframes loading-animation {\n0% {\n    transform: perspective(120px) rotateX(0) rotateY(0);\n}\n25% {\n    transform: perspective(120px) rotateX(0.5turn) rotateY(0);\n}\n50% {\n    transform: perspective(120px) rotateX(0.5turn) rotateY(0.5turn);\n}\n75% {\n    transform: perspective(120px) rotateX(1turn) rotateY(0.5turn);\n}\n100% {\n    transform: perspective(120px) rotateX(1turn) rotateY(1turn);\n}\n}\n@-webkit-keyframes loading-animation {\n0% {\n    transform: perspective(120px) rotateX(0) rotateY(0);\n}\n25% {\n    transform: perspective(120px) rotateX(0.5turn) rotateY(0);\n}\n50% {\n    transform: perspective(120px) rotateX(0.5turn) rotateY(0.5turn);\n}\n75% {\n    transform: perspective(120px) rotateX(1turn) rotateY(0.5turn);\n}\n100% {\n    transform: perspective(120px) rotateX(1turn) rotateY(1turn);\n}\n}\n@-o-keyframes loading-animation {\n0% {\n    transform: perspective(120px) rotateX(0) rotateY(0);\n}\n25% {\n    transform: perspective(120px) rotateX(0.5turn) rotateY(0);\n}\n50% {\n    transform: perspective(120px) rotateX(0.5turn) rotateY(0.5turn);\n}\n75% {\n    transform: perspective(120px) rotateX(1turn) rotateY(0.5turn);\n}\n100% {\n    transform: perspective(120px) rotateX(1turn) rotateY(1turn);\n}\n}\n@keyframes loading-animation {\n0% {\n    transform: perspective(120px) rotateX(0) rotateY(0);\n}\n25% {\n    transform: perspective(120px) rotateX(0.5turn) rotateY(0);\n}\n50% {\n    transform: perspective(120px) rotateX(0.5turn) rotateY(0.5turn);\n}\n75% {\n    transform: perspective(120px) rotateX(1turn) rotateY(0.5turn);\n}\n100% {\n    transform: perspective(120px) rotateX(1turn) rotateY(1turn);\n}\n}\n", ""]);

// exports


/***/ },
/* 67 */
/***/ function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, "\n.bbc-italic {\n  font-style: italic;\n}\n.bbc-bold {\n  font-weight: bold;\n}\n.bbc-underline {\n  text-decoration: underline;\n}\n.bbc-strike {\n  text-decoration: line-through;\n}\n.bbc-sub {\n  font-size: 80%;\n}\n.bbc-super {\n  font-size: 80%;\n  vertical-align: super;\n}\n.bbc-icon {\n  display: inline-block;\n  width: 2em;\n  height: 2em;\n  background-size: contain;\n  vertical-align: text-top;\n}\n.bbc-link,\n.bbc-channel {\n  border-bottom: 1px solid rgba(236,240,241,0.3);\n  text-shadow: 0px 1px 2px rgba(0,0,0,0.6);\n  color: #c8dcf0;\n  display: inline-block;\n  transition: 0.2s ease all;\n  transition: 0.2s ease all;\n}\n.bbc-link:hover,\n.bbc-channel:hover {\n  border-color: rgba(236,240,241,0.8);\n}\n.bbc-link:active,\n.bbc-channel:active {\n  transform: translateY(0.1em);\n  transition-duration: 0s;\n}\n.bbc-color-white {\n  color: #ecf0f1;\n  text-shadow: 0px 1px 2px rgba(0,0,0,0.6);\n}\n.bbc-color-black {\n  color: #34495e;\n  text-shadow: 0px 1px 2px rgba(0,0,0,0.6);\n}\n.bbc-color-red {\n  color: #e74c3c;\n  text-shadow: 0px 1px 2px rgba(0,0,0,0.6);\n}\n.bbc-color-blue {\n  color: #3498db;\n  text-shadow: 0px 1px 2px rgba(0,0,0,0.6);\n}\n.bbc-color-yellow {\n  color: #f1c40f;\n  text-shadow: 0px 1px 2px rgba(0,0,0,0.6);\n}\n.bbc-color-green {\n  color: #2ecc71;\n  text-shadow: 0px 1px 2px rgba(0,0,0,0.6);\n}\n.bbc-color-pink {\n  color: #ffa49c;\n  text-shadow: 0px 1px 2px rgba(0,0,0,0.6);\n}\n.bbc-color-gray {\n  color: #95a5a6;\n  text-shadow: 0px 1px 2px rgba(0,0,0,0.6);\n}\n.bbc-color-orange {\n  color: #e67e22;\n  text-shadow: 0px 1px 2px rgba(0,0,0,0.6);\n}\n.bbc-color-purple {\n  color: #c987e4;\n  text-shadow: 0px 1px 2px rgba(0,0,0,0.6);\n}\n.bbc-color-brown {\n  color: #d35400;\n  text-shadow: 0px 1px 2px rgba(0,0,0,0.6);\n}\n.bbc-color-cyan {\n  color: #55afec;\n  text-shadow: 0px 1px 2px rgba(0,0,0,0.6);\n}\n", ""]);

// exports


/***/ },
/* 68 */
/***/ function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, "\n.flex-row[data-v-5] {\n  display: flex;\n  flex-direction: row;\n}\n.flex-column[data-v-5] {\n  display: flex;\n  flex-direction: column;\n}\n.flex-grow[data-v-5] {\n  flex-grow: 1;\n}\n.flex-fixed[data-v-5] {\n  flex-shrink: 0;\n}\n.flex-justify-center[data-v-5] {\n  display: flex;\n  justify-content: center;\n}\n[data-tooltip][data-v-5] {\n  position: relative;\n}\n[data-tooltip][data-v-5]::after {\n  content: attr(data-tooltip);\n  background: #11293f;\n  font-size: 0.9rem;\n  position: absolute;\n  padding: 0.3em 0.6em;\n  width: max-content;\n  max-width: 10em;\n  text-align: center;\n  border-radius: 0.15em;\n  pointer-events: none;\n  opacity: 0;\n  z-index: 9999;\n  transition: 0.3s;\n}\n[data-tooltip][data-v-5]:hover::after {\n  opacity: 1;\n  transition-delay: 0.3s;\n}\n[data-tooltip].tooltip-right[data-v-5]::after {\n  top: 50%;\n  transform: translateY(-50%);\n}\n[data-tooltip].tooltip-right[data-v-5]:hover::after {\n  transform: translateY(-50%) translateX(0.5em);\n}\n[data-tooltip].tooltip-bottom[data-v-5]::after {\n  top: 100%;\n  left: 50%;\n  transform: translateX(-50%);\n}\n[data-tooltip].tooltip-bottom[data-v-5]:hover::after {\n  transform: translateX(-50%) translateY(0.3em);\n}\n.fade-enter-active[data-v-5] {\n  animation: fade 0.3s ease;\n}\n.fade-leave-active[data-v-5] {\n  animation: fade 0.3s ease reverse;\n}\n@-moz-keyframes fade {\nfrom {\n    opacity: 0;\n}\nto {\n    opacity: 1;\n}\n}\n@-webkit-keyframes fade {\nfrom {\n    opacity: 0;\n}\nto {\n    opacity: 1;\n}\n}\n@-o-keyframes fade {\nfrom {\n    opacity: 0;\n}\nto {\n    opacity: 1;\n}\n}\n@keyframes fade {\nfrom {\n    opacity: 0;\n}\nto {\n    opacity: 1;\n}\n}\n.slide-right-enter-active[data-v-5] {\n  animation: slide-right 0.3s ease;\n}\n.slide-right-leave-active[data-v-5] {\n  animation: slide-right 0.3s ease reverse;\n}\n@-moz-keyframes slide-right {\nfrom {\n    transform: translateX(100%);\n}\nto {\n    transform: translateX(0);\n}\n}\n@-webkit-keyframes slide-right {\nfrom {\n    transform: translateX(100%);\n}\nto {\n    transform: translateX(0);\n}\n}\n@-o-keyframes slide-right {\nfrom {\n    transform: translateX(100%);\n}\nto {\n    transform: translateX(0);\n}\n}\n@keyframes slide-right {\nfrom {\n    transform: translateX(100%);\n}\nto {\n    transform: translateX(0);\n}\n}\n.ease-down-enter-active[data-v-5] {\n  animation: ease-down 0.3s;\n}\n.ease-down-leave-active[data-v-5] {\n  animation: ease-down 0.3s reverse;\n}\n@-moz-keyframes ease-down {\nfrom {\n    transform: translateY(-4em);\n}\nto {\n    transform: translateY(0);\n}\n}\n@-webkit-keyframes ease-down {\nfrom {\n    transform: translateY(-4em);\n}\nto {\n    transform: translateY(0);\n}\n}\n@-o-keyframes ease-down {\nfrom {\n    transform: translateY(-4em);\n}\nto {\n    transform: translateY(0);\n}\n}\n@keyframes ease-down {\nfrom {\n    transform: translateY(-4em);\n}\nto {\n    transform: translateY(0);\n}\n}\n.overlay-panel[data-v-5] {\n  background: #23517e;\n  width: max-content;\n  box-shadow: 0px 2px 6px rgba(0,0,0,0.5);\n  position: relative;\n}\n.overlay-shade[data-v-5] {\n  background: rgba(0,0,0,0.5);\n  position: absolute;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n.overlay-enter-active[data-v-5] {\n  animation: fade 0.3s ease;\n}\n.overlay-enter-active .overlay-ease-down[data-v-5] {\n  animation: ease-down 0.3s ease;\n}\n.overlay-enter-active .overlay-slide-right[data-v-5] {\n  animation: slide-right 0.3s ease;\n}\n.overlay-leave-active[data-v-5] {\n  animation: fade 0.3s ease reverse;\n}\n.overlay-leave-active .overlay-ease-down[data-v-5] {\n  animation: ease-down 0.3s ease reverse;\n}\n.overlay-leave-active .overlay-slide-right[data-v-5] {\n  animation: slide-right 0.3s ease reverse;\n}\n.divider[data-v-5] {\n  width: 3px;\n  height: 3px;\n  visibility: hidden;\n  flex-shrink: 0;\n}\n.chat[data-v-5] {\n  position: absolute;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  position: fixed;\n  background: #11293f;\n}\n.header[data-v-5] {\n  background: #204971;\n  padding: 0.4em 0.7em;\n}\n.chat-tabs[data-v-5] {\n  background: #23517e;\n  width: 12em;\n  min-width: 6em;\n  max-width: 20em;\n  overflow-y: auto;\n}\n.user-list[data-v-5] {\n  background: #23517e;\n  width: 12em;\n  min-width: 6em;\n  max-width: 20em;\n  overflow-y: auto;\n}\n.room-filters[data-v-5] {\n  background: #183958;\n}\n.room-filters .filter[data-v-5] {\n  margin: 0.4em 0 0.4em 0.7em;\n}\n.chat-messages[data-v-5] {\n  background: #183958;\n  overflow-y: auto;\n  min-height: 0;\n}\n.chat-messages .chat-message[data-v-5]:nth-child(2n) {\n  background: #1c4165;\n}\n.description[data-v-5] {\n  background: #204971;\n  max-height: 5em;\n  padding: 0.3em 0.6em;\n  overflow-y: auto;\n}\n.chat-input[data-v-5] {\n  background: #204971;\n  height: 5em;\n}\n.chat-input textarea[data-v-5] {\n  display: block;\n  width: 100%;\n  height: 100%;\n}\n", ""]);

// exports


/***/ },
/* 69 */
/***/ function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, "\n.toggle[data-v-6] {\n  font-size: 90%;\n  opacity: 0.7;\n  border-bottom: 1px solid transparent;\n  transition: 0.2s ease all;\n  transform: scale(1);\n  display: inline-block;\n  transition: 0.2s ease all;\n}\n.toggle[data-v-6]:hover {\n  opacity: 1;\n  border-bottom-color: rgba(236,240,241,0.3);\n}\n.toggle[data-v-6]:active {\n  transform: scale(0.95);\n  transition-duration: 0s;\n}\n.toggle.checked[data-v-6] {\n  opacity: 0.8;\n}\n.toggle.disabled[data-v-6] {\n  opacity: 0.3;\n  pointer-events: none;\n}\n", ""]);

// exports


/***/ },
/* 70 */
/***/ function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, "\n.character-status-online[data-v-7] {\n  color: #2196f3;\n}\n.character-status-looking[data-v-7] {\n  color: #20df6d;\n}\n.character-status-busy[data-v-7] {\n  color: #ff9800;\n}\n.character-status-away[data-v-7] {\n  color: #fff176;\n}\n.character-status-dnd[data-v-7] {\n  color: #c6675d;\n}\n.character-status-idle[data-v-7] {\n  color: #ab7cff;\n}\n.character-status-offline[data-v-7] {\n  color: rgba(62,62,62,0.3);\n}\n.character-gender-male[data-v-7] {\n  color: #69c;\n}\n.character-gender-female[data-v-7] {\n  color: #f99d94;\n}\n.character-gender-transgender[data-v-7] {\n  color: #dba457;\n}\n.character-gender-herm[data-v-7] {\n  color: #b07cf3;\n}\n.character-gender-shemale[data-v-7] {\n  color: #e58bda;\n}\n.character-gender-cunt-boy[data-v-7] {\n  color: #60d27b;\n}\n.character-gender-male-herm[data-v-7] {\n  color: #527dff;\n}\n.character-gender-none[data-v-7] {\n  color: #e3da91;\n}\n.character[data-v-7] {\n  font-weight: bold;\n}\n.ignored[data-v-7] {\n  opacity: 0.5;\n}\n", ""]);

// exports


/***/ },
/* 71 */
/***/ function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, "\ntextarea[data-v-8] {\n  padding: 0.3em 0.6em;\n  transition: 0.2s ease all;\n}\ntextarea[data-v-8]:focus {\n  background: #15314c;\n}\n", ""]);

// exports


/***/ },
/* 72 */
/***/ function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, "\n.flex-row[data-v-9] {\n  display: flex;\n  flex-direction: row;\n}\n.flex-column[data-v-9] {\n  display: flex;\n  flex-direction: column;\n}\n.flex-grow[data-v-9] {\n  flex-grow: 1;\n}\n.flex-fixed[data-v-9] {\n  flex-shrink: 0;\n}\n.flex-justify-center[data-v-9] {\n  display: flex;\n  justify-content: center;\n}\n.message[data-v-9] {\n  padding: 0.4em 0.5em;\n  border-bottom: 1px solid #15314c;\n}\n.avatar[data-v-9] {\n  margin: 0.1em 0.3em 0.1em 0;\n}\n.sender[data-v-9] {\n  margin-right: 0.25em;\n}\n.message-text[data-v-9] {\n  white-space: pre-wrap;\n}\n.timestamp[data-v-9] {\n  font-size: 70%;\n  opacity: 0.5;\n  float: right;\n  padding-left: 1em;\n}\n.message-action[data-v-9] {\n  font-style: italic;\n}\n.message-type-lfrp[data-v-9] {\n  background: rgba(39,174,96,0.2);\n  color: #3dd37c;\n}\n.message-type-self[data-v-9] {\n  background: #15314c;\n  border-bottom: 1px solid #11293f;\n}\n", ""]);

// exports


/***/ },
/* 73 */
/***/ function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process) {// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe =
    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
var splitPath = function(filename) {
  return splitPathRe.exec(filename).slice(1);
};

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};


// path.relative(from, to)
// posix version
exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function(path) {
  var result = splitPath(path),
      root = result[0],
      dir = result[1];

  if (!root && !dir) {
    // No dirname whatsoever
    return '.';
  }

  if (dir) {
    // It has a dirname, strip trailing slash
    dir = dir.substr(0, dir.length - 1);
  }

  return root + dir;
};


exports.basename = function(path, ext) {
  var f = splitPath(path)[2];
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};


exports.extname = function(path) {
  return splitPath(path)[3];
};

function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b'
    ? function (str, start, len) { return str.substr(start, len) }
    : function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(13)))

/***/ },
/* 74 */
/***/ function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module, global) {var __WEBPACK_AMD_DEFINE_RESULT__;/*! https://mths.be/punycode v1.4.1 by @mathias */
;(function(root) {

	/** Detect free variables */
	var freeExports = typeof exports == 'object' && exports &&
		!exports.nodeType && exports;
	var freeModule = typeof module == 'object' && module &&
		!module.nodeType && module;
	var freeGlobal = typeof global == 'object' && global;
	if (
		freeGlobal.global === freeGlobal ||
		freeGlobal.window === freeGlobal ||
		freeGlobal.self === freeGlobal
	) {
		root = freeGlobal;
	}

	/**
	 * The `punycode` object.
	 * @name punycode
	 * @type Object
	 */
	var punycode,

	/** Highest positive signed 32-bit float value */
	maxInt = 2147483647, // aka. 0x7FFFFFFF or 2^31-1

	/** Bootstring parameters */
	base = 36,
	tMin = 1,
	tMax = 26,
	skew = 38,
	damp = 700,
	initialBias = 72,
	initialN = 128, // 0x80
	delimiter = '-', // '\x2D'

	/** Regular expressions */
	regexPunycode = /^xn--/,
	regexNonASCII = /[^\x20-\x7E]/, // unprintable ASCII chars + non-ASCII chars
	regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g, // RFC 3490 separators

	/** Error messages */
	errors = {
		'overflow': 'Overflow: input needs wider integers to process',
		'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
		'invalid-input': 'Invalid input'
	},

	/** Convenience shortcuts */
	baseMinusTMin = base - tMin,
	floor = Math.floor,
	stringFromCharCode = String.fromCharCode,

	/** Temporary variable */
	key;

	/*--------------------------------------------------------------------------*/

	/**
	 * A generic error utility function.
	 * @private
	 * @param {String} type The error type.
	 * @returns {Error} Throws a `RangeError` with the applicable error message.
	 */
	function error(type) {
		throw new RangeError(errors[type]);
	}

	/**
	 * A generic `Array#map` utility function.
	 * @private
	 * @param {Array} array The array to iterate over.
	 * @param {Function} callback The function that gets called for every array
	 * item.
	 * @returns {Array} A new array of values returned by the callback function.
	 */
	function map(array, fn) {
		var length = array.length;
		var result = [];
		while (length--) {
			result[length] = fn(array[length]);
		}
		return result;
	}

	/**
	 * A simple `Array#map`-like wrapper to work with domain name strings or email
	 * addresses.
	 * @private
	 * @param {String} domain The domain name or email address.
	 * @param {Function} callback The function that gets called for every
	 * character.
	 * @returns {Array} A new string of characters returned by the callback
	 * function.
	 */
	function mapDomain(string, fn) {
		var parts = string.split('@');
		var result = '';
		if (parts.length > 1) {
			// In email addresses, only the domain name should be punycoded. Leave
			// the local part (i.e. everything up to `@`) intact.
			result = parts[0] + '@';
			string = parts[1];
		}
		// Avoid `split(regex)` for IE8 compatibility. See #17.
		string = string.replace(regexSeparators, '\x2E');
		var labels = string.split('.');
		var encoded = map(labels, fn).join('.');
		return result + encoded;
	}

	/**
	 * Creates an array containing the numeric code points of each Unicode
	 * character in the string. While JavaScript uses UCS-2 internally,
	 * this function will convert a pair of surrogate halves (each of which
	 * UCS-2 exposes as separate characters) into a single code point,
	 * matching UTF-16.
	 * @see `punycode.ucs2.encode`
	 * @see <https://mathiasbynens.be/notes/javascript-encoding>
	 * @memberOf punycode.ucs2
	 * @name decode
	 * @param {String} string The Unicode input string (UCS-2).
	 * @returns {Array} The new array of code points.
	 */
	function ucs2decode(string) {
		var output = [],
		    counter = 0,
		    length = string.length,
		    value,
		    extra;
		while (counter < length) {
			value = string.charCodeAt(counter++);
			if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
				// high surrogate, and there is a next character
				extra = string.charCodeAt(counter++);
				if ((extra & 0xFC00) == 0xDC00) { // low surrogate
					output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
				} else {
					// unmatched surrogate; only append this code unit, in case the next
					// code unit is the high surrogate of a surrogate pair
					output.push(value);
					counter--;
				}
			} else {
				output.push(value);
			}
		}
		return output;
	}

	/**
	 * Creates a string based on an array of numeric code points.
	 * @see `punycode.ucs2.decode`
	 * @memberOf punycode.ucs2
	 * @name encode
	 * @param {Array} codePoints The array of numeric code points.
	 * @returns {String} The new Unicode string (UCS-2).
	 */
	function ucs2encode(array) {
		return map(array, function(value) {
			var output = '';
			if (value > 0xFFFF) {
				value -= 0x10000;
				output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
				value = 0xDC00 | value & 0x3FF;
			}
			output += stringFromCharCode(value);
			return output;
		}).join('');
	}

	/**
	 * Converts a basic code point into a digit/integer.
	 * @see `digitToBasic()`
	 * @private
	 * @param {Number} codePoint The basic numeric code point value.
	 * @returns {Number} The numeric value of a basic code point (for use in
	 * representing integers) in the range `0` to `base - 1`, or `base` if
	 * the code point does not represent a value.
	 */
	function basicToDigit(codePoint) {
		if (codePoint - 48 < 10) {
			return codePoint - 22;
		}
		if (codePoint - 65 < 26) {
			return codePoint - 65;
		}
		if (codePoint - 97 < 26) {
			return codePoint - 97;
		}
		return base;
	}

	/**
	 * Converts a digit/integer into a basic code point.
	 * @see `basicToDigit()`
	 * @private
	 * @param {Number} digit The numeric value of a basic code point.
	 * @returns {Number} The basic code point whose value (when used for
	 * representing integers) is `digit`, which needs to be in the range
	 * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
	 * used; else, the lowercase form is used. The behavior is undefined
	 * if `flag` is non-zero and `digit` has no uppercase form.
	 */
	function digitToBasic(digit, flag) {
		//  0..25 map to ASCII a..z or A..Z
		// 26..35 map to ASCII 0..9
		return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
	}

	/**
	 * Bias adaptation function as per section 3.4 of RFC 3492.
	 * https://tools.ietf.org/html/rfc3492#section-3.4
	 * @private
	 */
	function adapt(delta, numPoints, firstTime) {
		var k = 0;
		delta = firstTime ? floor(delta / damp) : delta >> 1;
		delta += floor(delta / numPoints);
		for (/* no initialization */; delta > baseMinusTMin * tMax >> 1; k += base) {
			delta = floor(delta / baseMinusTMin);
		}
		return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
	}

	/**
	 * Converts a Punycode string of ASCII-only symbols to a string of Unicode
	 * symbols.
	 * @memberOf punycode
	 * @param {String} input The Punycode string of ASCII-only symbols.
	 * @returns {String} The resulting string of Unicode symbols.
	 */
	function decode(input) {
		// Don't use UCS-2
		var output = [],
		    inputLength = input.length,
		    out,
		    i = 0,
		    n = initialN,
		    bias = initialBias,
		    basic,
		    j,
		    index,
		    oldi,
		    w,
		    k,
		    digit,
		    t,
		    /** Cached calculation results */
		    baseMinusT;

		// Handle the basic code points: let `basic` be the number of input code
		// points before the last delimiter, or `0` if there is none, then copy
		// the first basic code points to the output.

		basic = input.lastIndexOf(delimiter);
		if (basic < 0) {
			basic = 0;
		}

		for (j = 0; j < basic; ++j) {
			// if it's not a basic code point
			if (input.charCodeAt(j) >= 0x80) {
				error('not-basic');
			}
			output.push(input.charCodeAt(j));
		}

		// Main decoding loop: start just after the last delimiter if any basic code
		// points were copied; start at the beginning otherwise.

		for (index = basic > 0 ? basic + 1 : 0; index < inputLength; /* no final expression */) {

			// `index` is the index of the next character to be consumed.
			// Decode a generalized variable-length integer into `delta`,
			// which gets added to `i`. The overflow checking is easier
			// if we increase `i` as we go, then subtract off its starting
			// value at the end to obtain `delta`.
			for (oldi = i, w = 1, k = base; /* no condition */; k += base) {

				if (index >= inputLength) {
					error('invalid-input');
				}

				digit = basicToDigit(input.charCodeAt(index++));

				if (digit >= base || digit > floor((maxInt - i) / w)) {
					error('overflow');
				}

				i += digit * w;
				t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);

				if (digit < t) {
					break;
				}

				baseMinusT = base - t;
				if (w > floor(maxInt / baseMinusT)) {
					error('overflow');
				}

				w *= baseMinusT;

			}

			out = output.length + 1;
			bias = adapt(i - oldi, out, oldi == 0);

			// `i` was supposed to wrap around from `out` to `0`,
			// incrementing `n` each time, so we'll fix that now:
			if (floor(i / out) > maxInt - n) {
				error('overflow');
			}

			n += floor(i / out);
			i %= out;

			// Insert `n` at position `i` of the output
			output.splice(i++, 0, n);

		}

		return ucs2encode(output);
	}

	/**
	 * Converts a string of Unicode symbols (e.g. a domain name label) to a
	 * Punycode string of ASCII-only symbols.
	 * @memberOf punycode
	 * @param {String} input The string of Unicode symbols.
	 * @returns {String} The resulting Punycode string of ASCII-only symbols.
	 */
	function encode(input) {
		var n,
		    delta,
		    handledCPCount,
		    basicLength,
		    bias,
		    j,
		    m,
		    q,
		    k,
		    t,
		    currentValue,
		    output = [],
		    /** `inputLength` will hold the number of code points in `input`. */
		    inputLength,
		    /** Cached calculation results */
		    handledCPCountPlusOne,
		    baseMinusT,
		    qMinusT;

		// Convert the input in UCS-2 to Unicode
		input = ucs2decode(input);

		// Cache the length
		inputLength = input.length;

		// Initialize the state
		n = initialN;
		delta = 0;
		bias = initialBias;

		// Handle the basic code points
		for (j = 0; j < inputLength; ++j) {
			currentValue = input[j];
			if (currentValue < 0x80) {
				output.push(stringFromCharCode(currentValue));
			}
		}

		handledCPCount = basicLength = output.length;

		// `handledCPCount` is the number of code points that have been handled;
		// `basicLength` is the number of basic code points.

		// Finish the basic string - if it is not empty - with a delimiter
		if (basicLength) {
			output.push(delimiter);
		}

		// Main encoding loop:
		while (handledCPCount < inputLength) {

			// All non-basic code points < n have been handled already. Find the next
			// larger one:
			for (m = maxInt, j = 0; j < inputLength; ++j) {
				currentValue = input[j];
				if (currentValue >= n && currentValue < m) {
					m = currentValue;
				}
			}

			// Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
			// but guard against overflow
			handledCPCountPlusOne = handledCPCount + 1;
			if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
				error('overflow');
			}

			delta += (m - n) * handledCPCountPlusOne;
			n = m;

			for (j = 0; j < inputLength; ++j) {
				currentValue = input[j];

				if (currentValue < n && ++delta > maxInt) {
					error('overflow');
				}

				if (currentValue == n) {
					// Represent delta as a generalized variable-length integer
					for (q = delta, k = base; /* no condition */; k += base) {
						t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
						if (q < t) {
							break;
						}
						qMinusT = q - t;
						baseMinusT = base - t;
						output.push(
							stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0))
						);
						q = floor(qMinusT / baseMinusT);
					}

					output.push(stringFromCharCode(digitToBasic(q, 0)));
					bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
					delta = 0;
					++handledCPCount;
				}
			}

			++delta;
			++n;

		}
		return output.join('');
	}

	/**
	 * Converts a Punycode string representing a domain name or an email address
	 * to Unicode. Only the Punycoded parts of the input will be converted, i.e.
	 * it doesn't matter if you call it on a string that has already been
	 * converted to Unicode.
	 * @memberOf punycode
	 * @param {String} input The Punycoded domain name or email address to
	 * convert to Unicode.
	 * @returns {String} The Unicode representation of the given Punycode
	 * string.
	 */
	function toUnicode(input) {
		return mapDomain(input, function(string) {
			return regexPunycode.test(string)
				? decode(string.slice(4).toLowerCase())
				: string;
		});
	}

	/**
	 * Converts a Unicode string representing a domain name or an email address to
	 * Punycode. Only the non-ASCII parts of the domain name will be converted,
	 * i.e. it doesn't matter if you call it with a domain that's already in
	 * ASCII.
	 * @memberOf punycode
	 * @param {String} input The domain name or email address to convert, as a
	 * Unicode string.
	 * @returns {String} The Punycode representation of the given domain name or
	 * email address.
	 */
	function toASCII(input) {
		return mapDomain(input, function(string) {
			return regexNonASCII.test(string)
				? 'xn--' + encode(string)
				: string;
		});
	}

	/*--------------------------------------------------------------------------*/

	/** Define the public API */
	punycode = {
		/**
		 * A string representing the current Punycode.js version number.
		 * @memberOf punycode
		 * @type String
		 */
		'version': '1.4.1',
		/**
		 * An object of methods to convert from JavaScript's internal character
		 * representation (UCS-2) to Unicode code points, and back.
		 * @see <https://mathiasbynens.be/notes/javascript-encoding>
		 * @memberOf punycode
		 * @type Object
		 */
		'ucs2': {
			'decode': ucs2decode,
			'encode': ucs2encode
		},
		'decode': decode,
		'encode': encode,
		'toASCII': toASCII,
		'toUnicode': toUnicode
	};

	/** Expose `punycode` */
	// Some AMD build optimizers, like r.js, check for specific condition patterns
	// like the following:
	if (
		true
	) {
		!(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
			return punycode;
		}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else if (freeExports && freeModule) {
		if (module.exports == freeExports) {
			// in Node.js, io.js, or RingoJS v0.8.0+
			freeModule.exports = punycode;
		} else {
			// in Narwhal or RingoJS v0.7.0-
			for (key in punycode) {
				punycode.hasOwnProperty(key) && (freeExports[key] = punycode[key]);
			}
		}
	} else {
		// in Rhino or a web browser
		root.punycode = punycode;
	}

}(this));

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(143)(module), __webpack_require__(10)))

/***/ },
/* 75 */
/***/ function(module, exports) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

module.exports = function(qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);

  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length;
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr, vstr, k, v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!hasOwnProperty(obj, k)) {
      obj[k] = v;
    } else if (isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};


/***/ },
/* 76 */
/***/ function(module, exports) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

var stringifyPrimitive = function(v) {
  switch (typeof v) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
};

module.exports = function(obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  if (obj === null) {
    obj = undefined;
  }

  if (typeof obj === 'object') {
    return map(objectKeys(obj), function(k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (isArray(obj[k])) {
        return map(obj[k], function(v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);

  }

  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq +
         encodeURIComponent(stringifyPrimitive(obj));
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

function map (xs, f) {
  if (xs.map) return xs.map(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    res.push(f(xs[i], i));
  }
  return res;
}

var objectKeys = Object.keys || function (obj) {
  var res = [];
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
  }
  return res;
};


/***/ },
/* 77 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

exports.decode = exports.parse = __webpack_require__(75);
exports.encode = exports.stringify = __webpack_require__(76);


/***/ },
/* 78 */
/***/ function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(49);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-1!./../../../node_modules/stylus-loader/index.js?paths=src/app/styles!./../../../node_modules/vue-loader/lib/selector.js?type=styles&index=1!./App.vue", function() {
			var newContent = require("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-1!./../../../node_modules/stylus-loader/index.js?paths=src/app/styles!./../../../node_modules/vue-loader/lib/selector.js?type=styles&index=1!./App.vue");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ },
/* 79 */
/***/ function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(50);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-1&scoped=true!./../../../node_modules/stylus-loader/index.js?paths=src/app/styles!./../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./App.vue", function() {
			var newContent = require("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-1&scoped=true!./../../../node_modules/stylus-loader/index.js?paths=src/app/styles!./../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./App.vue");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ },
/* 80 */
/***/ function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(51);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-10&scoped=true!./../../../node_modules/stylus-loader/index.js?paths=src/app/styles!./../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./UserList.vue", function() {
			var newContent = require("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-10&scoped=true!./../../../node_modules/stylus-loader/index.js?paths=src/app/styles!./../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./UserList.vue");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ },
/* 81 */
/***/ function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(52);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-11&scoped=true!./../../../node_modules/stylus-loader/index.js?paths=src/app/styles!./../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./ChatTab.vue", function() {
			var newContent = require("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-11&scoped=true!./../../../node_modules/stylus-loader/index.js?paths=src/app/styles!./../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./ChatTab.vue");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ },
/* 82 */
/***/ function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(53);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-12&scoped=true!./../../../node_modules/stylus-loader/index.js?paths=src/app/styles!./../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./CharacterMenu.vue", function() {
			var newContent = require("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-12&scoped=true!./../../../node_modules/stylus-loader/index.js?paths=src/app/styles!./../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./CharacterMenu.vue");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ },
/* 83 */
/***/ function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(54);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-13&scoped=true!./../../../node_modules/stylus-loader/index.js?paths=src/app/styles!./../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./ChannelList.vue", function() {
			var newContent = require("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-13&scoped=true!./../../../node_modules/stylus-loader/index.js?paths=src/app/styles!./../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./ChannelList.vue");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ },
/* 84 */
/***/ function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(55);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-14&scoped=true!./../../../node_modules/stylus-loader/index.js?paths=src/app/styles!./../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Status.vue", function() {
			var newContent = require("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-14&scoped=true!./../../../node_modules/stylus-loader/index.js?paths=src/app/styles!./../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Status.vue");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ },
/* 85 */
/***/ function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(56);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-15&scoped=true!./../../../node_modules/stylus-loader/index.js?paths=src/app/styles!./../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./ChatHeader.vue", function() {
			var newContent = require("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-15&scoped=true!./../../../node_modules/stylus-loader/index.js?paths=src/app/styles!./../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./ChatHeader.vue");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ },
/* 86 */
/***/ function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(57);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-16&scoped=true!./../../../node_modules/stylus-loader/index.js?paths=src/app/styles!./../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./ChatFilter.vue", function() {
			var newContent = require("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-16&scoped=true!./../../../node_modules/stylus-loader/index.js?paths=src/app/styles!./../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./ChatFilter.vue");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ },
/* 87 */
/***/ function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(58);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-17&scoped=true!./../../../node_modules/stylus-loader/index.js?paths=src/app/styles!./../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./ChatDescription.vue", function() {
			var newContent = require("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-17&scoped=true!./../../../node_modules/stylus-loader/index.js?paths=src/app/styles!./../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./ChatDescription.vue");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ },
/* 88 */
/***/ function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(59);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-18&scoped=true!./../../../node_modules/stylus-loader/index.js?paths=src/app/styles!./../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./OnlineCharacters.vue", function() {
			var newContent = require("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-18&scoped=true!./../../../node_modules/stylus-loader/index.js?paths=src/app/styles!./../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./OnlineCharacters.vue");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ },
/* 89 */
/***/ function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(60);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-19&scoped=true!./../../../node_modules/stylus-loader/index.js?paths=src/app/styles!./../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./StatusOverlay.vue", function() {
			var newContent = require("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-19&scoped=true!./../../../node_modules/stylus-loader/index.js?paths=src/app/styles!./../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./StatusOverlay.vue");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ },
/* 90 */
/***/ function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(61);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-2&scoped=true!./../../../node_modules/stylus-loader/index.js?paths=src/app/styles!./../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Login.vue", function() {
			var newContent = require("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-2&scoped=true!./../../../node_modules/stylus-loader/index.js?paths=src/app/styles!./../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Login.vue");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ },
/* 91 */
/***/ function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(62);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-20&scoped=true!./../../../node_modules/stylus-loader/index.js?paths=src/app/styles!./../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Avatar.vue", function() {
			var newContent = require("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-20&scoped=true!./../../../node_modules/stylus-loader/index.js?paths=src/app/styles!./../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Avatar.vue");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ },
/* 92 */
/***/ function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(63);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-22&scoped=true!./../../../node_modules/stylus-loader/index.js?paths=src/app/styles!./../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Dropdown.vue", function() {
			var newContent = require("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-22&scoped=true!./../../../node_modules/stylus-loader/index.js?paths=src/app/styles!./../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Dropdown.vue");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ },
/* 93 */
/***/ function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(64);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-23&scoped=true!./../../../node_modules/stylus-loader/index.js?paths=src/app/styles!./../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Overlay.vue", function() {
			var newContent = require("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-23&scoped=true!./../../../node_modules/stylus-loader/index.js?paths=src/app/styles!./../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Overlay.vue");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ },
/* 94 */
/***/ function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(65);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-3&scoped=true!./../../../node_modules/stylus-loader/index.js?paths=src/app/styles!./../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./CharacterList.vue", function() {
			var newContent = require("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-3&scoped=true!./../../../node_modules/stylus-loader/index.js?paths=src/app/styles!./../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./CharacterList.vue");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ },
/* 95 */
/***/ function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(66);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-4&scoped=true!./../../../node_modules/stylus-loader/index.js?paths=src/app/styles!./../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Loading.vue", function() {
			var newContent = require("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-4&scoped=true!./../../../node_modules/stylus-loader/index.js?paths=src/app/styles!./../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Loading.vue");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ },
/* 96 */
/***/ function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(67);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-5!./../../../node_modules/stylus-loader/index.js?paths=src/app/styles!./../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Chat.vue", function() {
			var newContent = require("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-5!./../../../node_modules/stylus-loader/index.js?paths=src/app/styles!./../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Chat.vue");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ },
/* 97 */
/***/ function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(68);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-5&scoped=true!./../../../node_modules/stylus-loader/index.js?paths=src/app/styles!./../../../node_modules/vue-loader/lib/selector.js?type=styles&index=1!./Chat.vue", function() {
			var newContent = require("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-5&scoped=true!./../../../node_modules/stylus-loader/index.js?paths=src/app/styles!./../../../node_modules/vue-loader/lib/selector.js?type=styles&index=1!./Chat.vue");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ },
/* 98 */
/***/ function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(69);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-6&scoped=true!./../../../node_modules/stylus-loader/index.js?paths=src/app/styles!./../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Toggle.vue", function() {
			var newContent = require("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-6&scoped=true!./../../../node_modules/stylus-loader/index.js?paths=src/app/styles!./../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Toggle.vue");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ },
/* 99 */
/***/ function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(70);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-7&scoped=true!./../../../node_modules/stylus-loader/index.js?paths=src/app/styles!./../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Character.vue", function() {
			var newContent = require("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-7&scoped=true!./../../../node_modules/stylus-loader/index.js?paths=src/app/styles!./../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Character.vue");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ },
/* 100 */
/***/ function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(71);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-8&scoped=true!./../../../node_modules/stylus-loader/index.js?paths=src/app/styles!./../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Chatbox.vue", function() {
			var newContent = require("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-8&scoped=true!./../../../node_modules/stylus-loader/index.js?paths=src/app/styles!./../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Chatbox.vue");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ },
/* 101 */
/***/ function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(72);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-9&scoped=true!./../../../node_modules/stylus-loader/index.js?paths=src/app/styles!./../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Message.vue", function() {
			var newContent = require("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-9&scoped=true!./../../../node_modules/stylus-loader/index.js?paths=src/app/styles!./../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Message.vue");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ },
/* 102 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

var punycode = __webpack_require__(74);
var util = __webpack_require__(103);

exports.parse = urlParse;
exports.resolve = urlResolve;
exports.resolveObject = urlResolveObject;
exports.format = urlFormat;

exports.Url = Url;

function Url() {
  this.protocol = null;
  this.slashes = null;
  this.auth = null;
  this.host = null;
  this.port = null;
  this.hostname = null;
  this.hash = null;
  this.search = null;
  this.query = null;
  this.pathname = null;
  this.path = null;
  this.href = null;
}

// Reference: RFC 3986, RFC 1808, RFC 2396

// define these here so at least they only have to be
// compiled once on the first module load.
var protocolPattern = /^([a-z0-9.+-]+:)/i,
    portPattern = /:[0-9]*$/,

    // Special case for a simple path URL
    simplePathPattern = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/,

    // RFC 2396: characters reserved for delimiting URLs.
    // We actually just auto-escape these.
    delims = ['<', '>', '"', '`', ' ', '\r', '\n', '\t'],

    // RFC 2396: characters not allowed for various reasons.
    unwise = ['{', '}', '|', '\\', '^', '`'].concat(delims),

    // Allowed by RFCs, but cause of XSS attacks.  Always escape these.
    autoEscape = ['\''].concat(unwise),
    // Characters that are never ever allowed in a hostname.
    // Note that any invalid chars are also handled, but these
    // are the ones that are *expected* to be seen, so we fast-path
    // them.
    nonHostChars = ['%', '/', '?', ';', '#'].concat(autoEscape),
    hostEndingChars = ['/', '?', '#'],
    hostnameMaxLen = 255,
    hostnamePartPattern = /^[+a-z0-9A-Z_-]{0,63}$/,
    hostnamePartStart = /^([+a-z0-9A-Z_-]{0,63})(.*)$/,
    // protocols that can allow "unsafe" and "unwise" chars.
    unsafeProtocol = {
      'javascript': true,
      'javascript:': true
    },
    // protocols that never have a hostname.
    hostlessProtocol = {
      'javascript': true,
      'javascript:': true
    },
    // protocols that always contain a // bit.
    slashedProtocol = {
      'http': true,
      'https': true,
      'ftp': true,
      'gopher': true,
      'file': true,
      'http:': true,
      'https:': true,
      'ftp:': true,
      'gopher:': true,
      'file:': true
    },
    querystring = __webpack_require__(77);

function urlParse(url, parseQueryString, slashesDenoteHost) {
  if (url && util.isObject(url) && url instanceof Url) return url;

  var u = new Url;
  u.parse(url, parseQueryString, slashesDenoteHost);
  return u;
}

Url.prototype.parse = function(url, parseQueryString, slashesDenoteHost) {
  if (!util.isString(url)) {
    throw new TypeError("Parameter 'url' must be a string, not " + typeof url);
  }

  // Copy chrome, IE, opera backslash-handling behavior.
  // Back slashes before the query string get converted to forward slashes
  // See: https://code.google.com/p/chromium/issues/detail?id=25916
  var queryIndex = url.indexOf('?'),
      splitter =
          (queryIndex !== -1 && queryIndex < url.indexOf('#')) ? '?' : '#',
      uSplit = url.split(splitter),
      slashRegex = /\\/g;
  uSplit[0] = uSplit[0].replace(slashRegex, '/');
  url = uSplit.join(splitter);

  var rest = url;

  // trim before proceeding.
  // This is to support parse stuff like "  http://foo.com  \n"
  rest = rest.trim();

  if (!slashesDenoteHost && url.split('#').length === 1) {
    // Try fast path regexp
    var simplePath = simplePathPattern.exec(rest);
    if (simplePath) {
      this.path = rest;
      this.href = rest;
      this.pathname = simplePath[1];
      if (simplePath[2]) {
        this.search = simplePath[2];
        if (parseQueryString) {
          this.query = querystring.parse(this.search.substr(1));
        } else {
          this.query = this.search.substr(1);
        }
      } else if (parseQueryString) {
        this.search = '';
        this.query = {};
      }
      return this;
    }
  }

  var proto = protocolPattern.exec(rest);
  if (proto) {
    proto = proto[0];
    var lowerProto = proto.toLowerCase();
    this.protocol = lowerProto;
    rest = rest.substr(proto.length);
  }

  // figure out if it's got a host
  // user@server is *always* interpreted as a hostname, and url
  // resolution will treat //foo/bar as host=foo,path=bar because that's
  // how the browser resolves relative URLs.
  if (slashesDenoteHost || proto || rest.match(/^\/\/[^@\/]+@[^@\/]+/)) {
    var slashes = rest.substr(0, 2) === '//';
    if (slashes && !(proto && hostlessProtocol[proto])) {
      rest = rest.substr(2);
      this.slashes = true;
    }
  }

  if (!hostlessProtocol[proto] &&
      (slashes || (proto && !slashedProtocol[proto]))) {

    // there's a hostname.
    // the first instance of /, ?, ;, or # ends the host.
    //
    // If there is an @ in the hostname, then non-host chars *are* allowed
    // to the left of the last @ sign, unless some host-ending character
    // comes *before* the @-sign.
    // URLs are obnoxious.
    //
    // ex:
    // http://a@b@c/ => user:a@b host:c
    // http://a@b?@c => user:a host:c path:/?@c

    // v0.12 TODO(isaacs): This is not quite how Chrome does things.
    // Review our test case against browsers more comprehensively.

    // find the first instance of any hostEndingChars
    var hostEnd = -1;
    for (var i = 0; i < hostEndingChars.length; i++) {
      var hec = rest.indexOf(hostEndingChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
        hostEnd = hec;
    }

    // at this point, either we have an explicit point where the
    // auth portion cannot go past, or the last @ char is the decider.
    var auth, atSign;
    if (hostEnd === -1) {
      // atSign can be anywhere.
      atSign = rest.lastIndexOf('@');
    } else {
      // atSign must be in auth portion.
      // http://a@b/c@d => host:b auth:a path:/c@d
      atSign = rest.lastIndexOf('@', hostEnd);
    }

    // Now we have a portion which is definitely the auth.
    // Pull that off.
    if (atSign !== -1) {
      auth = rest.slice(0, atSign);
      rest = rest.slice(atSign + 1);
      this.auth = decodeURIComponent(auth);
    }

    // the host is the remaining to the left of the first non-host char
    hostEnd = -1;
    for (var i = 0; i < nonHostChars.length; i++) {
      var hec = rest.indexOf(nonHostChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
        hostEnd = hec;
    }
    // if we still have not hit it, then the entire thing is a host.
    if (hostEnd === -1)
      hostEnd = rest.length;

    this.host = rest.slice(0, hostEnd);
    rest = rest.slice(hostEnd);

    // pull out port.
    this.parseHost();

    // we've indicated that there is a hostname,
    // so even if it's empty, it has to be present.
    this.hostname = this.hostname || '';

    // if hostname begins with [ and ends with ]
    // assume that it's an IPv6 address.
    var ipv6Hostname = this.hostname[0] === '[' &&
        this.hostname[this.hostname.length - 1] === ']';

    // validate a little.
    if (!ipv6Hostname) {
      var hostparts = this.hostname.split(/\./);
      for (var i = 0, l = hostparts.length; i < l; i++) {
        var part = hostparts[i];
        if (!part) continue;
        if (!part.match(hostnamePartPattern)) {
          var newpart = '';
          for (var j = 0, k = part.length; j < k; j++) {
            if (part.charCodeAt(j) > 127) {
              // we replace non-ASCII char with a temporary placeholder
              // we need this to make sure size of hostname is not
              // broken by replacing non-ASCII by nothing
              newpart += 'x';
            } else {
              newpart += part[j];
            }
          }
          // we test again with ASCII char only
          if (!newpart.match(hostnamePartPattern)) {
            var validParts = hostparts.slice(0, i);
            var notHost = hostparts.slice(i + 1);
            var bit = part.match(hostnamePartStart);
            if (bit) {
              validParts.push(bit[1]);
              notHost.unshift(bit[2]);
            }
            if (notHost.length) {
              rest = '/' + notHost.join('.') + rest;
            }
            this.hostname = validParts.join('.');
            break;
          }
        }
      }
    }

    if (this.hostname.length > hostnameMaxLen) {
      this.hostname = '';
    } else {
      // hostnames are always lower case.
      this.hostname = this.hostname.toLowerCase();
    }

    if (!ipv6Hostname) {
      // IDNA Support: Returns a punycoded representation of "domain".
      // It only converts parts of the domain name that
      // have non-ASCII characters, i.e. it doesn't matter if
      // you call it with a domain that already is ASCII-only.
      this.hostname = punycode.toASCII(this.hostname);
    }

    var p = this.port ? ':' + this.port : '';
    var h = this.hostname || '';
    this.host = h + p;
    this.href += this.host;

    // strip [ and ] from the hostname
    // the host field still retains them, though
    if (ipv6Hostname) {
      this.hostname = this.hostname.substr(1, this.hostname.length - 2);
      if (rest[0] !== '/') {
        rest = '/' + rest;
      }
    }
  }

  // now rest is set to the post-host stuff.
  // chop off any delim chars.
  if (!unsafeProtocol[lowerProto]) {

    // First, make 100% sure that any "autoEscape" chars get
    // escaped, even if encodeURIComponent doesn't think they
    // need to be.
    for (var i = 0, l = autoEscape.length; i < l; i++) {
      var ae = autoEscape[i];
      if (rest.indexOf(ae) === -1)
        continue;
      var esc = encodeURIComponent(ae);
      if (esc === ae) {
        esc = escape(ae);
      }
      rest = rest.split(ae).join(esc);
    }
  }


  // chop off from the tail first.
  var hash = rest.indexOf('#');
  if (hash !== -1) {
    // got a fragment string.
    this.hash = rest.substr(hash);
    rest = rest.slice(0, hash);
  }
  var qm = rest.indexOf('?');
  if (qm !== -1) {
    this.search = rest.substr(qm);
    this.query = rest.substr(qm + 1);
    if (parseQueryString) {
      this.query = querystring.parse(this.query);
    }
    rest = rest.slice(0, qm);
  } else if (parseQueryString) {
    // no query string, but parseQueryString still requested
    this.search = '';
    this.query = {};
  }
  if (rest) this.pathname = rest;
  if (slashedProtocol[lowerProto] &&
      this.hostname && !this.pathname) {
    this.pathname = '/';
  }

  //to support http.request
  if (this.pathname || this.search) {
    var p = this.pathname || '';
    var s = this.search || '';
    this.path = p + s;
  }

  // finally, reconstruct the href based on what has been validated.
  this.href = this.format();
  return this;
};

// format a parsed object into a url string
function urlFormat(obj) {
  // ensure it's an object, and not a string url.
  // If it's an obj, this is a no-op.
  // this way, you can call url_format() on strings
  // to clean up potentially wonky urls.
  if (util.isString(obj)) obj = urlParse(obj);
  if (!(obj instanceof Url)) return Url.prototype.format.call(obj);
  return obj.format();
}

Url.prototype.format = function() {
  var auth = this.auth || '';
  if (auth) {
    auth = encodeURIComponent(auth);
    auth = auth.replace(/%3A/i, ':');
    auth += '@';
  }

  var protocol = this.protocol || '',
      pathname = this.pathname || '',
      hash = this.hash || '',
      host = false,
      query = '';

  if (this.host) {
    host = auth + this.host;
  } else if (this.hostname) {
    host = auth + (this.hostname.indexOf(':') === -1 ?
        this.hostname :
        '[' + this.hostname + ']');
    if (this.port) {
      host += ':' + this.port;
    }
  }

  if (this.query &&
      util.isObject(this.query) &&
      Object.keys(this.query).length) {
    query = querystring.stringify(this.query);
  }

  var search = this.search || (query && ('?' + query)) || '';

  if (protocol && protocol.substr(-1) !== ':') protocol += ':';

  // only the slashedProtocols get the //.  Not mailto:, xmpp:, etc.
  // unless they had them to begin with.
  if (this.slashes ||
      (!protocol || slashedProtocol[protocol]) && host !== false) {
    host = '//' + (host || '');
    if (pathname && pathname.charAt(0) !== '/') pathname = '/' + pathname;
  } else if (!host) {
    host = '';
  }

  if (hash && hash.charAt(0) !== '#') hash = '#' + hash;
  if (search && search.charAt(0) !== '?') search = '?' + search;

  pathname = pathname.replace(/[?#]/g, function(match) {
    return encodeURIComponent(match);
  });
  search = search.replace('#', '%23');

  return protocol + host + pathname + search + hash;
};

function urlResolve(source, relative) {
  return urlParse(source, false, true).resolve(relative);
}

Url.prototype.resolve = function(relative) {
  return this.resolveObject(urlParse(relative, false, true)).format();
};

function urlResolveObject(source, relative) {
  if (!source) return relative;
  return urlParse(source, false, true).resolveObject(relative);
}

Url.prototype.resolveObject = function(relative) {
  if (util.isString(relative)) {
    var rel = new Url();
    rel.parse(relative, false, true);
    relative = rel;
  }

  var result = new Url();
  var tkeys = Object.keys(this);
  for (var tk = 0; tk < tkeys.length; tk++) {
    var tkey = tkeys[tk];
    result[tkey] = this[tkey];
  }

  // hash is always overridden, no matter what.
  // even href="" will remove it.
  result.hash = relative.hash;

  // if the relative url is empty, then there's nothing left to do here.
  if (relative.href === '') {
    result.href = result.format();
    return result;
  }

  // hrefs like //foo/bar always cut to the protocol.
  if (relative.slashes && !relative.protocol) {
    // take everything except the protocol from relative
    var rkeys = Object.keys(relative);
    for (var rk = 0; rk < rkeys.length; rk++) {
      var rkey = rkeys[rk];
      if (rkey !== 'protocol')
        result[rkey] = relative[rkey];
    }

    //urlParse appends trailing / to urls like http://www.example.com
    if (slashedProtocol[result.protocol] &&
        result.hostname && !result.pathname) {
      result.path = result.pathname = '/';
    }

    result.href = result.format();
    return result;
  }

  if (relative.protocol && relative.protocol !== result.protocol) {
    // if it's a known url protocol, then changing
    // the protocol does weird things
    // first, if it's not file:, then we MUST have a host,
    // and if there was a path
    // to begin with, then we MUST have a path.
    // if it is file:, then the host is dropped,
    // because that's known to be hostless.
    // anything else is assumed to be absolute.
    if (!slashedProtocol[relative.protocol]) {
      var keys = Object.keys(relative);
      for (var v = 0; v < keys.length; v++) {
        var k = keys[v];
        result[k] = relative[k];
      }
      result.href = result.format();
      return result;
    }

    result.protocol = relative.protocol;
    if (!relative.host && !hostlessProtocol[relative.protocol]) {
      var relPath = (relative.pathname || '').split('/');
      while (relPath.length && !(relative.host = relPath.shift()));
      if (!relative.host) relative.host = '';
      if (!relative.hostname) relative.hostname = '';
      if (relPath[0] !== '') relPath.unshift('');
      if (relPath.length < 2) relPath.unshift('');
      result.pathname = relPath.join('/');
    } else {
      result.pathname = relative.pathname;
    }
    result.search = relative.search;
    result.query = relative.query;
    result.host = relative.host || '';
    result.auth = relative.auth;
    result.hostname = relative.hostname || relative.host;
    result.port = relative.port;
    // to support http.request
    if (result.pathname || result.search) {
      var p = result.pathname || '';
      var s = result.search || '';
      result.path = p + s;
    }
    result.slashes = result.slashes || relative.slashes;
    result.href = result.format();
    return result;
  }

  var isSourceAbs = (result.pathname && result.pathname.charAt(0) === '/'),
      isRelAbs = (
          relative.host ||
          relative.pathname && relative.pathname.charAt(0) === '/'
      ),
      mustEndAbs = (isRelAbs || isSourceAbs ||
                    (result.host && relative.pathname)),
      removeAllDots = mustEndAbs,
      srcPath = result.pathname && result.pathname.split('/') || [],
      relPath = relative.pathname && relative.pathname.split('/') || [],
      psychotic = result.protocol && !slashedProtocol[result.protocol];

  // if the url is a non-slashed url, then relative
  // links like ../.. should be able
  // to crawl up to the hostname, as well.  This is strange.
  // result.protocol has already been set by now.
  // Later on, put the first path part into the host field.
  if (psychotic) {
    result.hostname = '';
    result.port = null;
    if (result.host) {
      if (srcPath[0] === '') srcPath[0] = result.host;
      else srcPath.unshift(result.host);
    }
    result.host = '';
    if (relative.protocol) {
      relative.hostname = null;
      relative.port = null;
      if (relative.host) {
        if (relPath[0] === '') relPath[0] = relative.host;
        else relPath.unshift(relative.host);
      }
      relative.host = null;
    }
    mustEndAbs = mustEndAbs && (relPath[0] === '' || srcPath[0] === '');
  }

  if (isRelAbs) {
    // it's absolute.
    result.host = (relative.host || relative.host === '') ?
                  relative.host : result.host;
    result.hostname = (relative.hostname || relative.hostname === '') ?
                      relative.hostname : result.hostname;
    result.search = relative.search;
    result.query = relative.query;
    srcPath = relPath;
    // fall through to the dot-handling below.
  } else if (relPath.length) {
    // it's relative
    // throw away the existing file, and take the new path instead.
    if (!srcPath) srcPath = [];
    srcPath.pop();
    srcPath = srcPath.concat(relPath);
    result.search = relative.search;
    result.query = relative.query;
  } else if (!util.isNullOrUndefined(relative.search)) {
    // just pull out the search.
    // like href='?foo'.
    // Put this after the other two cases because it simplifies the booleans
    if (psychotic) {
      result.hostname = result.host = srcPath.shift();
      //occationaly the auth can get stuck only in host
      //this especially happens in cases like
      //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
      var authInHost = result.host && result.host.indexOf('@') > 0 ?
                       result.host.split('@') : false;
      if (authInHost) {
        result.auth = authInHost.shift();
        result.host = result.hostname = authInHost.shift();
      }
    }
    result.search = relative.search;
    result.query = relative.query;
    //to support http.request
    if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
      result.path = (result.pathname ? result.pathname : '') +
                    (result.search ? result.search : '');
    }
    result.href = result.format();
    return result;
  }

  if (!srcPath.length) {
    // no path at all.  easy.
    // we've already handled the other stuff above.
    result.pathname = null;
    //to support http.request
    if (result.search) {
      result.path = '/' + result.search;
    } else {
      result.path = null;
    }
    result.href = result.format();
    return result;
  }

  // if a url ENDs in . or .., then it must get a trailing slash.
  // however, if it ends in anything else non-slashy,
  // then it must NOT get a trailing slash.
  var last = srcPath.slice(-1)[0];
  var hasTrailingSlash = (
      (result.host || relative.host || srcPath.length > 1) &&
      (last === '.' || last === '..') || last === '');

  // strip single dots, resolve double dots to parent dir
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = srcPath.length; i >= 0; i--) {
    last = srcPath[i];
    if (last === '.') {
      srcPath.splice(i, 1);
    } else if (last === '..') {
      srcPath.splice(i, 1);
      up++;
    } else if (up) {
      srcPath.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (!mustEndAbs && !removeAllDots) {
    for (; up--; up) {
      srcPath.unshift('..');
    }
  }

  if (mustEndAbs && srcPath[0] !== '' &&
      (!srcPath[0] || srcPath[0].charAt(0) !== '/')) {
    srcPath.unshift('');
  }

  if (hasTrailingSlash && (srcPath.join('/').substr(-1) !== '/')) {
    srcPath.push('');
  }

  var isAbsolute = srcPath[0] === '' ||
      (srcPath[0] && srcPath[0].charAt(0) === '/');

  // put the host back
  if (psychotic) {
    result.hostname = result.host = isAbsolute ? '' :
                                    srcPath.length ? srcPath.shift() : '';
    //occationaly the auth can get stuck only in host
    //this especially happens in cases like
    //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
    var authInHost = result.host && result.host.indexOf('@') > 0 ?
                     result.host.split('@') : false;
    if (authInHost) {
      result.auth = authInHost.shift();
      result.host = result.hostname = authInHost.shift();
    }
  }

  mustEndAbs = mustEndAbs || (result.host && srcPath.length);

  if (mustEndAbs && !isAbsolute) {
    srcPath.unshift('');
  }

  if (!srcPath.length) {
    result.pathname = null;
    result.path = null;
  } else {
    result.pathname = srcPath.join('/');
  }

  //to support request.http
  if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
    result.path = (result.pathname ? result.pathname : '') +
                  (result.search ? result.search : '');
  }
  result.auth = relative.auth || result.auth;
  result.slashes = result.slashes || relative.slashes;
  result.href = result.format();
  return result;
};

Url.prototype.parseHost = function() {
  var host = this.host;
  var port = portPattern.exec(host);
  if (port) {
    port = port[0];
    if (port !== ':') {
      this.port = port.substr(1);
    }
    host = host.substr(0, host.length - port.length);
  }
  if (host) this.hostname = host;
};


/***/ },
/* 103 */
/***/ function(module, exports) {

"use strict";
'use strict';

module.exports = {
  isString: function(arg) {
    return typeof(arg) === 'string';
  },
  isObject: function(arg) {
    return typeof(arg) === 'object' && arg !== null;
  },
  isNull: function(arg) {
    return arg === null;
  },
  isNullOrUndefined: function(arg) {
    return arg == null;
  }
};


/***/ },
/* 104 */
/***/ function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__

/* styles */
__webpack_require__(83)

/* script */
__vue_exports__ = __webpack_require__(25)

/* template */
var __vue_template__ = __webpack_require__(124)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (
  typeof __vue_exports__.default === "object" ||
  typeof __vue_exports__.default === "function"
) {
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}
__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns
__vue_options__._scopeId = "data-v-13"

module.exports = __vue_exports__


/***/ },
/* 105 */
/***/ function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__

/* styles */
__webpack_require__(94)

/* script */
__vue_exports__ = __webpack_require__(27)

/* template */
var __vue_template__ = __webpack_require__(136)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (
  typeof __vue_exports__.default === "object" ||
  typeof __vue_exports__.default === "function"
) {
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}
__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns
__vue_options__._scopeId = "data-v-3"

module.exports = __vue_exports__


/***/ },
/* 106 */
/***/ function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__

/* styles */
__webpack_require__(82)

/* script */
__vue_exports__ = __webpack_require__(28)

/* template */
var __vue_template__ = __webpack_require__(123)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (
  typeof __vue_exports__.default === "object" ||
  typeof __vue_exports__.default === "function"
) {
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}
__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns
__vue_options__._scopeId = "data-v-12"

module.exports = __vue_exports__


/***/ },
/* 107 */
/***/ function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__

/* styles */
__webpack_require__(96)
__webpack_require__(97)

/* script */
__vue_exports__ = __webpack_require__(29)

/* template */
var __vue_template__ = __webpack_require__(138)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (
  typeof __vue_exports__.default === "object" ||
  typeof __vue_exports__.default === "function"
) {
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}
__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns
__vue_options__._scopeId = "data-v-5"

module.exports = __vue_exports__


/***/ },
/* 108 */
/***/ function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__

/* styles */
__webpack_require__(87)

/* script */
__vue_exports__ = __webpack_require__(30)

/* template */
var __vue_template__ = __webpack_require__(128)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (
  typeof __vue_exports__.default === "object" ||
  typeof __vue_exports__.default === "function"
) {
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}
__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns
__vue_options__._scopeId = "data-v-17"

module.exports = __vue_exports__


/***/ },
/* 109 */
/***/ function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__

/* styles */
__webpack_require__(86)

/* script */
__vue_exports__ = __webpack_require__(31)

/* template */
var __vue_template__ = __webpack_require__(127)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (
  typeof __vue_exports__.default === "object" ||
  typeof __vue_exports__.default === "function"
) {
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}
__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns
__vue_options__._scopeId = "data-v-16"

module.exports = __vue_exports__


/***/ },
/* 110 */
/***/ function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__

/* styles */
__webpack_require__(85)

/* script */
__vue_exports__ = __webpack_require__(32)

/* template */
var __vue_template__ = __webpack_require__(126)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (
  typeof __vue_exports__.default === "object" ||
  typeof __vue_exports__.default === "function"
) {
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}
__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns
__vue_options__._scopeId = "data-v-15"

module.exports = __vue_exports__


/***/ },
/* 111 */
/***/ function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__

/* styles */
__webpack_require__(81)

/* script */
__vue_exports__ = __webpack_require__(33)

/* template */
var __vue_template__ = __webpack_require__(122)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (
  typeof __vue_exports__.default === "object" ||
  typeof __vue_exports__.default === "function"
) {
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}
__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns
__vue_options__._scopeId = "data-v-11"

module.exports = __vue_exports__


/***/ },
/* 112 */
/***/ function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__

/* styles */
__webpack_require__(100)

/* script */
__vue_exports__ = __webpack_require__(34)

/* template */
var __vue_template__ = __webpack_require__(141)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (
  typeof __vue_exports__.default === "object" ||
  typeof __vue_exports__.default === "function"
) {
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}
__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns
__vue_options__._scopeId = "data-v-8"

module.exports = __vue_exports__


/***/ },
/* 113 */
/***/ function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__

/* styles */
__webpack_require__(92)

/* script */
__vue_exports__ = __webpack_require__(35)

/* template */
var __vue_template__ = __webpack_require__(134)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (
  typeof __vue_exports__.default === "object" ||
  typeof __vue_exports__.default === "function"
) {
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}
__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns
__vue_options__._scopeId = "data-v-22"

module.exports = __vue_exports__


/***/ },
/* 114 */
/***/ function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__

/* styles */
__webpack_require__(95)

/* script */
__vue_exports__ = __webpack_require__(36)

/* template */
var __vue_template__ = __webpack_require__(137)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (
  typeof __vue_exports__.default === "object" ||
  typeof __vue_exports__.default === "function"
) {
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}
__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns
__vue_options__._scopeId = "data-v-4"

module.exports = __vue_exports__


/***/ },
/* 115 */
/***/ function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__

/* styles */
__webpack_require__(90)

/* script */
__vue_exports__ = __webpack_require__(37)

/* template */
var __vue_template__ = __webpack_require__(131)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (
  typeof __vue_exports__.default === "object" ||
  typeof __vue_exports__.default === "function"
) {
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}
__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns
__vue_options__._scopeId = "data-v-2"

module.exports = __vue_exports__


/***/ },
/* 116 */
/***/ function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__

/* styles */
__webpack_require__(101)

/* script */
__vue_exports__ = __webpack_require__(38)

/* template */
var __vue_template__ = __webpack_require__(142)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (
  typeof __vue_exports__.default === "object" ||
  typeof __vue_exports__.default === "function"
) {
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}
__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns
__vue_options__._scopeId = "data-v-9"

module.exports = __vue_exports__


/***/ },
/* 117 */
/***/ function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__

/* styles */
__webpack_require__(88)

/* script */
__vue_exports__ = __webpack_require__(39)

/* template */
var __vue_template__ = __webpack_require__(129)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (
  typeof __vue_exports__.default === "object" ||
  typeof __vue_exports__.default === "function"
) {
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}
__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns
__vue_options__._scopeId = "data-v-18"

module.exports = __vue_exports__


/***/ },
/* 118 */
/***/ function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__

/* styles */
__webpack_require__(89)

/* script */
__vue_exports__ = __webpack_require__(43)

/* template */
var __vue_template__ = __webpack_require__(130)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (
  typeof __vue_exports__.default === "object" ||
  typeof __vue_exports__.default === "function"
) {
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}
__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns
__vue_options__._scopeId = "data-v-19"

module.exports = __vue_exports__


/***/ },
/* 119 */
/***/ function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__

/* styles */
__webpack_require__(80)

/* script */
__vue_exports__ = __webpack_require__(45)

/* template */
var __vue_template__ = __webpack_require__(121)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (
  typeof __vue_exports__.default === "object" ||
  typeof __vue_exports__.default === "function"
) {
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}
__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns
__vue_options__._scopeId = "data-v-10"

module.exports = __vue_exports__


/***/ },
/* 120 */
/***/ function(module, exports) {

module.exports={render:function (){with(this) {
  return _h('body', [_h('transition', {
    attrs: {
      "name": "fade",
      "mode": "out-in",
      "appear": ""
    }
  }, [(currentView) ? _h(currentView, {
    tag: "component"
  }) : _e()]), " ", _h('transition', {
    attrs: {
      "name": "fade",
      "appear": ""
    }
  }, [(loadingMessage) ? _h('Loading', [_s(loadingMessage)]) : _e()])])
}},staticRenderFns: []}

/***/ },
/* 121 */
/***/ function(module, exports) {

module.exports={render:function (){with(this) {
  return _h('div', [_h('div', {
    staticClass: "user-list-count"
  }, ["Users: " + _s(users.length)]), " ", (sortedUsers) && _l((sortedUsers), function(user) {
    return _h('div', {
      staticClass: "user-list-user",
      class: getHighlight(user)
    }, [_h('span', {
      staticClass: "user-list-user-icon"
    }, [_h('i', {
      class: 'mdi mdi-' + getIcon(user)
    })]), " ", _h('Character', {
      attrs: {
        "name": user.name,
        "gender": user.gender,
        "status": user.status
      }
    })])
  })])
}},staticRenderFns: []}

/***/ },
/* 122 */
/***/ function(module, exports) {

module.exports={render:function (){with(this) {
  return _h('a', {
    staticClass: "chat-tab",
    class: active && 'chat-tab-active',
    attrs: {
      "href": "#"
    },
    on: {
      "click": function($event) {
        $emit('selected')
      }
    }
  }, [(tab.channel) ? [(tab.channel.name === tab.channel.id) ? _h('i', {
    staticClass: "mdi mdi-earth"
  }) : _h('i', {
    staticClass: "mdi mdi-key-variant"
  }), " ", " ", _h('span', {
    staticClass: "tab-text"
  }, [_s(tab.channel.name)])] : _e(), " ", (tab.privateChat) ? [_h('Avatar', {
    attrs: {
      "name": tab.privateChat.partner.name,
      "size": "1em"
    }
  }), " ", _h('span', {
    staticClass: "tab-text"
  }, [_s(tab.privateChat.partner.name)])] : _e(), " ", _h('a', {
    staticClass: "chat-tab-close",
    attrs: {
      "href": "#"
    },
    on: {
      "click": function($event) {
        $event.stopPropagation();
        $emit('closed')
      }
    }
  }, [_m(0)])])
}},staticRenderFns: [function (){with(this) {
  return _h('i', {
    staticClass: "mdi mdi-close"
  })
}}]}

/***/ },
/* 123 */
/***/ function(module, exports) {

module.exports={render:function (){with(this) {
  return _h('div', {
    staticClass: "overlay-shade",
    on: {
      "click": function($event) {
        if ($event.target !== $event.currentTarget) return;
        $emit('closed')
      }
    }
  }, [_h('div', {
    staticClass: "overlay-panel overlay-slide-right"
  }, [_h('form', {
    staticClass: "info"
  }, [_h('fieldset', [_h('h3', [_h('ProfileLink', {
    attrs: {
      "name": name
    }
  })]), " ", _h('small', {
    class: 'character-gender-' + gender.toLowerCase()
  }, ["\n          " + _s(gender) + "\n        "])]), " ", _h('fieldset', [_h('ProfileLink', {
    attrs: {
      "name": name
    }
  }, [_h('Avatar', {
    attrs: {
      "name": name,
      "shadow": ""
    }
  })])]), " ", _h('fieldset', [_h('div', {
    staticClass: "status"
  }, [_h('Status', {
    attrs: {
      "status": status,
      "statusmsg": statusmsg
    }
  })])]), " ", (friends[name] || []) && _l((friends[name] || []), function(friend) {
    return _h('fieldset', [_h('ProfileLink', {
      attrs: {
        "name": friend
      }
    }, [_h('div', {
      staticClass: "friend"
    }, [_m(0), "\n            " + _s(friend) + "\n          "])])])
  })]), " ", _h('nav', [(menuOptions) && _l((menuOptions), function(opt) {
    return _h('a', {
      attrs: {
        "href": "#"
      },
      on: {
        "click": function($event) {
          opt.action && opt.action()
        }
      }
    }, [_h('i', {
      class: 'mdi mdi-' + opt.icon
    }), " " + _s(opt.label) + "\n      "])
  })])])])
}},staticRenderFns: [function (){with(this) {
  return _h('i', {
    staticClass: "mdi mdi-heart"
  })
}}]}

/***/ },
/* 124 */
/***/ function(module, exports) {

module.exports={render:function (){with(this) {
  return _h('Overlay', {
    attrs: {
      "header": "Channel List"
    },
    on: {
      "closed": function($event) {
        $emit('closed')
      }
    }
  }, [_h('form', {
    on: {
      "submit": function($event) {
        $event.preventDefault();
      }
    }
  }, [_h('fieldset', [_h('div', {
    staticClass: "form-selection-list"
  }, [(publicChannels) && _l((publicChannels), function(ch) {
    return _h('div', {
      class: channelHighlight(ch)
    }, [_h('a', {
      attrs: {
        "href": "#"
      },
      on: {
        "click": function($event) {
          $emit('channel-toggled', ch)
        }
      }
    }, [_m(0), " ", _h('span', {
      staticClass: "channel-user-count"
    }, [_s(ch.userCount)]), " ", _h('span', {
      staticClass: "channel-name"
    }, [_s(ch.name)])])])
  }), " ", (privateChannels) && _l((privateChannels), function(ch) {
    return _h('div', {
      class: channelHighlight(ch)
    }, [_h('a', {
      attrs: {
        "href": "#"
      },
      on: {
        "click": function($event) {
          $emit('channel-toggled', ch)
        }
      }
    }, [_h('div', [_m(1), " ", _h('span', {
      staticClass: "channel-user-count"
    }, [_s(ch.userCount)]), " ", _h('span', {
      staticClass: "channel-name",
      domProps: {
        "innerHTML": _s(ch.name)
      }
    })]), " ", _h('small', {
      staticClass: "channel-id"
    }, [_s(ch.id)])])])
  })])]), " ", _h('fieldset', [_h('div', {
    staticClass: "form-icon-input"
  }, [_m(2), " ", _h('input', {
    directives: [{
      name: "model",
      value: (searchText),
      expression: "searchText"
    }],
    attrs: {
      "type": "text",
      "placeholder": "Search..."
    },
    domProps: {
      "value": _s(searchText)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) return;
        searchText = $event.target.value
      }
    }
  })])])])])
}},staticRenderFns: [function (){with(this) {
  return _h('i', {
    staticClass: "mdi mdi-earth"
  })
}},function (){with(this) {
  return _h('i', {
    staticClass: "mdi mdi-key-variant"
  })
}},function (){with(this) {
  return _h('i', {
    staticClass: "mdi mdi-magnify"
  })
}}]}

/***/ },
/* 125 */
/***/ function(module, exports) {

module.exports={render:function (){with(this) {
  return _h('span', [_h('span', {
    class: 'character-status-' + status
  }, [_s(status)]), " ", (parsedStatus) ? _h('span', {
    domProps: {
      "innerHTML": _s(parsedStatus)
    }
  }) : _e()])
}},staticRenderFns: []}

/***/ },
/* 126 */
/***/ function(module, exports) {

module.exports={render:function (){with(this) {
  return _h('header', {
    staticClass: "flex-row"
  }, [_h('div', {
    staticClass: "flex-fixed"
  }, [_m(0), " ", _h('span', ["v" + _s(version)]), " "]), " ", _h('nav', {
    staticClass: "flex-grow"
  }, [(options) && _l((options), function(option) {
    return _h('a', {
      staticClass: "tooltip-bottom",
      attrs: {
        "href": "#",
        "data-tooltip": option.info
      },
      on: {
        "click": function($event) {
          option.action && option.action()
        }
      }
    }, [_h('i', {
      class: 'mdi mdi-' + option.icon
    })])
  })])])
}},staticRenderFns: [function (){with(this) {
  return _h('span', ["F-Chat Next"])
}}]}

/***/ },
/* 127 */
/***/ function(module, exports) {

module.exports={render:function (){with(this) {
  return _h('Toggle', {
    staticClass: "tooltip-bottom",
    attrs: {
      "disabled": disabled,
      "data-tooltip": tooltip
    },
    domProps: {
      "value": disabled || value
    },
    on: {
      "input": function($event) {
        $emit('input', !value)
      }
    }
  }, [_t("default")])
}},staticRenderFns: []}

/***/ },
/* 128 */
/***/ function(module, exports) {

module.exports={render:function (){with(this) {
  return _h('span', {
    staticClass: "description"
  }, [(channel) ? _h('span', {
    domProps: {
      "innerHTML": _s(parseBBC(channel.description))
    }
  }) : _e(), " ", (privateChat) ? _h('span', [_h('Status', {
    attrs: {
      "status": privateChat.partner.status,
      "statusmsg": privateChat.partner.statusmsg
    }
  })]) : _e()])
}},staticRenderFns: []}

/***/ },
/* 129 */
/***/ function(module, exports) {

module.exports={render:function (){with(this) {
  return _h('div', {
    staticClass: "shade",
    on: {
      "click": function($event) {
        if ($event.target !== $event.currentTarget) return;
        $emit('closed')
      }
    }
  }, [(characters) && _l((characters), function(char) {
    return _h('a', {
      staticClass: "character",
      attrs: {
        "href": "#",
        "data-character": char.name
      }
    }, [_h('div', {
      staticClass: "flex-row"
    }, [_h('Avatar', {
      attrs: {
        "name": char.name,
        "size": "6em"
      }
    }), " ", _h('div', {
      staticClass: "user-info flex-column"
    }, [_h('div', {
      staticClass: "name flex-fixed"
    }, [_h('h4', {
      staticClass: "name-text",
      class: nameHighlight(char)
    }, [_h('span', {
      staticClass: "name-icon"
    }, [(characterIcon(char)) ? _h('i', {
      class: 'mdi mdi-' + characterIcon(char)
    }) : _e()]), " ", _h('span', {
      class: 'character-gender-' + char.gender.toLowerCase()
    }, ["\n              " + _s(char.name) + "\n            "])])]), " ", _h('div', {
      staticClass: "status flex-grow"
    }, [_h('Status', {
      attrs: {
        "status": char.status,
        "statusmsg": char.statusmsg
      }
    })])])])])
  }), " ", _h('div', {
    staticClass: "header"
  }, [_h('div', {
    staticClass: "search form-icon-input"
  }, [_m(0), " ", _h('input', {
    directives: [{
      name: "model",
      value: (searchText),
      expression: "searchText"
    }],
    attrs: {
      "placeholder": "Search..."
    },
    domProps: {
      "value": _s(searchText)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) return;
        searchText = $event.target.value
      }
    }
  })])])])
}},staticRenderFns: [function (){with(this) {
  return _h('i', {
    staticClass: "mdi mdi-magnify"
  })
}}]}

/***/ },
/* 130 */
/***/ function(module, exports) {

module.exports={render:function (){with(this) {
  return _h('Overlay', {
    on: {
      "closed": function($event) {
        $emit('closed')
      }
    }
  }, [_h('div', {
    staticClass: "content-container"
  }, [_h('div', {
    staticClass: "greeting"
  }, [_h('h3', [_s(greeting)]), " ", _m(0)]), " ", _h('div', {
    staticClass: "flex-row"
  }, [_h('div', {
    staticClass: "flex-fixed avatar-container"
  }, [_h('ProfileLink', {
    attrs: {
      "name": identity
    }
  }, [_h('Avatar', {
    attrs: {
      "name": identity,
      "shadow": ""
    }
  })])]), " ", _h('form', {
    staticClass: "flex-fixed form-container",
    on: {
      "submit": function($event) {
        $event.preventDefault();
        submit($event)
      }
    }
  }, [_h('fieldset', [_h('Dropdown', {
    directives: [{
      name: "model",
      value: (status),
      expression: "status"
    }],
    attrs: {
      "options": statusOptions
    },
    domProps: {
      "value": (status)
    },
    on: {
      "input": function($event) {
        status = $event
      }
    }
  })]), " ", _h('fieldset', [_h('div', {
    staticClass: "form-icon-input"
  }, [_m(1), " ", _h('textarea', {
    directives: [{
      name: "model",
      value: (statusmsg),
      expression: "statusmsg"
    }],
    staticClass: "status-message",
    domProps: {
      "value": _s(statusmsg)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) return;
        statusmsg = $event.target.value
      }
    }
  })])]), " ", _m(2)])])])])
}},staticRenderFns: [function (){with(this) {
  return _h('span', {
    staticClass: "greeting-subtext"
  }, ["Up for some play?"])
}},function (){with(this) {
  return _h('i', {
    staticClass: "mdi mdi-pencil"
  })
}},function (){with(this) {
  return _h('fieldset', [_h('button', {
    staticClass: "form-button"
  }, ["Update"])])
}}]}

/***/ },
/* 131 */
/***/ function(module, exports) {

module.exports={render:function (){with(this) {
  return _h('form', {
    on: {
      "submit": function($event) {
        $event.preventDefault();
        submit($event)
      }
    }
  }, [_m(0), " ", _h('fieldset', [_h('div', {
    staticClass: "form-icon-input"
  }, [_m(1), " ", _h('input', {
    directives: [{
      name: "model",
      value: (account),
      expression: "account"
    }],
    attrs: {
      "type": "text",
      "placeholder": "Username"
    },
    domProps: {
      "value": _s(account)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) return;
        account = $event.target.value
      }
    }
  })])]), " ", _h('fieldset', [_h('div', {
    staticClass: "form-icon-input"
  }, [_m(2), " ", _h('input', {
    directives: [{
      name: "model",
      value: (password),
      expression: "password"
    }],
    attrs: {
      "type": "password",
      "placeholder": "••••••••"
    },
    domProps: {
      "value": _s(password)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) return;
        password = $event.target.value
      }
    }
  })])]), " ", _h('fieldset', [_h('toggle', {
    directives: [{
      name: "model",
      value: (remember),
      expression: "remember"
    }],
    domProps: {
      "value": (remember)
    },
    on: {
      "input": function($event) {
        remember = $event
      }
    }
  }, ["Remember me"])]), " ", _m(3), " ", _h('fieldset', [_h('div', {
    staticClass: "status"
  }, ["\n      " + _s(status) + "\n    "])])])
}},staticRenderFns: [function (){with(this) {
  return _h('fieldset', [_h('h2', ["Hello, beautiful."])])
}},function (){with(this) {
  return _h('i', {
    staticClass: "mdi mdi-account-circle"
  })
}},function (){with(this) {
  return _h('i', {
    staticClass: "mdi mdi-lock"
  })
}},function (){with(this) {
  return _h('fieldset', [_h('button', {
    staticClass: "form-button",
    attrs: {
      "action": "submit"
    }
  }, ["Go"])])
}}]}

/***/ },
/* 132 */
/***/ function(module, exports) {

module.exports={render:function (){with(this) {
  return _h('span', {
    staticClass: "avatar",
    class: shadow && 'shadow',
    style: (style)
  })
}},staticRenderFns: []}

/***/ },
/* 133 */
/***/ function(module, exports) {

module.exports={render:function (){with(this) {
  return _h('a', {
    attrs: {
      "href": href,
      "target": "_blank"
    }
  }, [_t("default", [_s(name)])])
}},staticRenderFns: []}

/***/ },
/* 134 */
/***/ function(module, exports) {

module.exports={render:function (){with(this) {
  return _h('div', {
    staticClass: "dropdown"
  }, [_h('a', {
    staticClass: "current",
    attrs: {
      "href": "#"
    },
    on: {
      "click": function($event) {
        open = !open
      }
    }
  }, [_m(0), "\n    " + _s(currentLabel) + "\n  "]), " ", _h('transition', {
    attrs: {
      "name": "fade"
    }
  }, [(open) ? _h('div', {
    staticClass: "option-list"
  }, [(options) && _l((options), function(opt) {
    return _h('a', {
      staticClass: "option",
      attrs: {
        "href": "#"
      },
      on: {
        "click": function($event) {
          setValue(opt.value)
        }
      }
    }, ["\n        " + _s(opt.label) + "\n      "])
  })]) : _e()])])
}},staticRenderFns: [function (){with(this) {
  return _h('i', {
    staticClass: "mdi mdi-chevron-down"
  })
}}]}

/***/ },
/* 135 */
/***/ function(module, exports) {

module.exports={render:function (){with(this) {
  return _h('div', {
    staticClass: "overlay-shade",
    on: {
      "click": function($event) {
        if ($event.target !== $event.currentTarget) return;
        $emit('closed')
      }
    }
  }, [_h('div', {
    staticClass: "overlay-panel overlay-ease-down"
  }, [_h('a', {
    staticClass: "overlay-close",
    attrs: {
      "href": "#"
    },
    on: {
      "click": function($event) {
        $emit('closed')
      }
    }
  }, [_m(0)]), " ", (header) ? _h('div', {
    staticClass: "header"
  }, [_h('h2', [_s(header)])]) : _e(), " ", _h('div', {
    staticClass: "content"
  }, [_t("default")])])])
}},staticRenderFns: [function (){with(this) {
  return _h('i', {
    staticClass: "mdi mdi-close"
  })
}}]}

/***/ },
/* 136 */
/***/ function(module, exports) {

module.exports={render:function (){with(this) {
  return _h('form', {
    staticClass: "character-list",
    on: {
      "submit": function($event) {
        $event.preventDefault();
        submit($event)
      }
    }
  }, [_m(0), " ", _h('fieldset', [_h('div', {
    staticClass: "character-list-avatar",
    style: ({
      'background-image': 'url(' + avatarURL + ')'
    })
  })]), " ", _h('fieldset', [_h('div', {
    staticClass: "form-selection-list"
  }, [(characters) && _l((characters), function(name) {
    return _h('a', {
      class: name === current && 'active',
      attrs: {
        "href": "#"
      },
      on: {
        "click": function($event) {
          $event.preventDefault();
          select(name)
        },
        "focus": function($event) {
          select(name)
        }
      }
    }, ["\n        " + _s(name) + "\n      "])
  })])]), " ", _m(1)])
}},staticRenderFns: [function (){with(this) {
  return _h('fieldset', [_h('h2', ["Select a Character"])])
}},function (){with(this) {
  return _h('fieldset', [_h('button', {
    staticClass: "form-button",
    attrs: {
      "action": "submit"
    }
  }, ["Go"])])
}}]}

/***/ },
/* 137 */
/***/ function(module, exports) {

module.exports={render:function (){with(this) {
  return _h('div', {
    staticClass: "shade"
  }, [_m(0), " ", _h('h3', {
    staticClass: "text"
  }, [_t("default")])])
}},staticRenderFns: [function (){with(this) {
  return _h('div', {
    staticClass: "icon"
  }, [_h('i', {
    staticClass: "mdi mdi-paw"
  })])
}}]}

/***/ },
/* 138 */
/***/ function(module, exports) {

module.exports={render:function (){with(this) {
  return _h('div', {
    staticClass: "chat flex-column",
    on: {
      "click": function($event) {
        checkData($event)
      }
    }
  }, [_h('div', {
    staticClass: "flex-fixed"
  }, [_h('ChatHeader', {
    staticClass: "header",
    attrs: {
      "options": headerOptions
    }
  })]), " ", _m(0), " ", _h('div', {
    staticClass: "flex-grow flex-row"
  }, [_h('div', {
    staticClass: "chat-tabs flex-fixed"
  }, [(tabs) && _l((tabs), function(tab, index) {
    return _h('ChatTab', {
      attrs: {
        "tab": tab,
        "active": tab === currentTab
      },
      on: {
        "selected": function($event) {
          currentTabIndex = index
        },
        "closed": function($event) {
          closeTab(tab)
        }
      }
    })
  })]), " ", _m(1), " ", _h('div', {
    staticClass: "flex-grow flex-column"
  }, [(channel) ? [_h('div', {
    staticClass: "room-filters flex-fixed"
  }, [(filterLabels) && _l((filterLabels), function(label) {
    return _h('ChatFilter', {
      directives: [{
        name: "model",
        value: (filters[label.filter]),
        expression: "filters[label.filter]"
      }],
      staticClass: "filter",
      attrs: {
        "disabled": isFilterDisabled(label.filter),
        "tooltip": label.tooltip
      },
      domProps: {
        "value": (filters[label.filter])
      },
      on: {
        "input": function($event) {
          filters[label.filter] = $event
        }
      }
    }, ["\n            " + _s(label.label) + "\n          "])
  })]), " ", _m(2)] : _e(), " ", _h('ChatDescription', {
    staticClass: "description flex-fixed",
    attrs: {
      "channel": channel,
      "private-chat": privateChat
    }
  }), " ", _m(3), " ", _h('div', {
    directives: [{
      name: "bottom-scroll"
    }],
    staticClass: "chat-messages flex-grow"
  }, [(messages) && _l((messages), function(msg) {
    return _h('div', {
      staticClass: "chat-message"
    }, [_h('Message', {
      attrs: {
        "sender": msg.sender,
        "message": msg.message,
        "type": msg.type,
        "time": msg.time
      }
    })])
  })]), " ", _m(4), " ", _h('div', {
    staticClass: "chat-input flex-fixed"
  }, [_h('Chatbox', {
    attrs: {
      "placeholder": 'Chatting as ' + identity
    },
    on: {
      "submit": chatboxSubmit
    }
  })])]), " ", (channel) ? [_m(5), " ", _h('UserList', {
    staticClass: "user-list flex-fixed",
    attrs: {
      "users": channel.users,
      "ops": channel.ops
    }
  })] : _e(), " ", (overlays) && _l((overlays), function(overlay) {
    return _h('transition', {
      attrs: {
        "name": "overlay",
        "appear": ""
      }
    }, [_h(overlay, {
      tag: "component",
      on: {
        "closed": function($event) {
          overlays.pop()
        },
        "channel-toggled": toggleChannel,
        "private-chat-opened": openPrivateChat
      }
    })])
  })])])
}},staticRenderFns: [function (){with(this) {
  return _h('div', {
    staticClass: "divider"
  })
}},function (){with(this) {
  return _h('div', {
    staticClass: "divider"
  })
}},function (){with(this) {
  return _h('div', {
    staticClass: "divider"
  })
}},function (){with(this) {
  return _h('div', {
    staticClass: "divider"
  })
}},function (){with(this) {
  return _h('div', {
    staticClass: "divider"
  })
}},function (){with(this) {
  return _h('div', {
    staticClass: "divider"
  })
}}]}

/***/ },
/* 139 */
/***/ function(module, exports) {

module.exports={render:function (){with(this) {
  return _h('a', {
    staticClass: "toggle",
    class: toggleClass,
    attrs: {
      "href": "#"
    },
    on: {
      "click": function($event) {
        $event.preventDefault();
        $emit('input', !value)
      }
    }
  }, [_h('i', {
    staticClass: "mdi",
    class: iconClass
  }), " ", _t("default")])
}},staticRenderFns: []}

/***/ },
/* 140 */
/***/ function(module, exports) {

module.exports={render:function (){with(this) {
  return _h('a', {
    staticClass: "character",
    attrs: {
      "href": "#",
      "data-character": name
    }
  }, [(status) ? _h('span', {
    class: statusClass
  }, ["●"]) : _e(), " ", _h('span', {
    class: genderClass
  }, [_s(name)])])
}},staticRenderFns: []}

/***/ },
/* 141 */
/***/ function(module, exports) {

module.exports={render:function (){with(this) {
  return _h('textarea', {
    directives: [{
      name: "model",
      value: (message),
      expression: "message"
    }],
    domProps: {
      "value": _s(message)
    },
    on: {
      "keydown": function($event) {
        if ($event.keyCode !== 13) return;
        $event.preventDefault();
        submit($event)
      },
      "input": function($event) {
        if ($event.target.composing) return;
        message = $event.target.value
      }
    }
  })
}},staticRenderFns: []}

/***/ },
/* 142 */
/***/ function(module, exports) {

module.exports={render:function (){with(this) {
  return _h('div', {
    staticClass: "message flex-row",
    class: type && 'message-type-' + type
  }, [_h('div', {
    staticClass: "flex-fixed"
  }, [_h('div', {
    staticClass: "avatar"
  }, [_h('a', {
    attrs: {
      "href": "#",
      "data-character": sender.name
    }
  }, [_h('Avatar', {
    attrs: {
      "name": sender.name,
      "size": "2.25em",
      "shadow": ""
    }
  })])])]), " ", _h('div', {
    staticClass: "flex-grow"
  }, [_h('span', {
    staticClass: "timestamp"
  }, [_s(parsedTime)]), " ", _h('span', {
    class: actionClass
  }, [_h('span', {
    staticClass: "sender"
  }, [_h('Character', {
    attrs: {
      "name": sender.name,
      "gender": sender.gender,
      "status": sender.status
    }
  })]), " ", _h('span', {
    staticClass: "message-text",
    domProps: {
      "innerHTML": _s(parsedMessage)
    }
  })])])])
}},staticRenderFns: []}

/***/ },
/* 143 */
/***/ function(module, exports) {

module.exports = function(module) {
	if(!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if(!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			configurable: false,
			get: function() { return module.l; }
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			configurable: false,
			get: function() { return module.i; }
		});
		module.webpackPolyfill = 1;
	}
	return module;
}


/***/ },
/* 144 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_regenerator_runtime_runtime__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_regenerator_runtime_runtime___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_regenerator_runtime_runtime__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_vue__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_vue_resource__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_vue_resource___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_vue_resource__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__components_App_vue__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__components_App_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__components_App_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__store__ = __webpack_require__(2);






// configure keycodes
__WEBPACK_IMPORTED_MODULE_1_vue___default.a.config.keyCodes = {
  enter: 13,
  space: 32
};

// configure vue resource
__WEBPACK_IMPORTED_MODULE_1_vue___default.a.use(__WEBPACK_IMPORTED_MODULE_2_vue_resource___default.a);
__WEBPACK_IMPORTED_MODULE_1_vue___default.a.http.options.emulateJSON = true;

// initialize the application store (jumpstart the app)
__WEBPACK_IMPORTED_MODULE_4__store__["a" /* store */].initialize();

// create vue instance
/* eslint no-new: off */
new __WEBPACK_IMPORTED_MODULE_1_vue___default.a({
  el: 'body',
  render: function render(h) {
    return h(__WEBPACK_IMPORTED_MODULE_3__components_App_vue___default.a);
  },
  data: { state: __WEBPACK_IMPORTED_MODULE_4__store__["c" /* state */] }
});

/***/ }
/******/ ]);
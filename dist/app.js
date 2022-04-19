/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/app/app.js":
/*!************************!*\
  !*** ./src/app/app.js ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"dynamicHTML\": () => (/* binding */ dynamicHTML)\n/* harmony export */ });\nvar dynamicHTML = {\n  init: function init() {\n    this.queryDOM();\n    this.bindEvents();\n  },\n  queryDOM: function queryDOM() {\n    // queries (couldn't cache dom i guess)\n    this.taskContainer = document.querySelector('.l-container__tasks');\n    this.setupTaskWdw = document.querySelector('.m-setup-wdw');\n    this.addTaskBtn = document.querySelector('.c-add-task-btn');\n    this.breakSlider = this.setupTaskWdw.querySelector('#taskBreak');\n    this.breakText = this.setupTaskWdw.querySelector('.c-setup-wdw__break-duration-text');\n  },\n  bindEvents: function bindEvents() {\n    this.breakSlider.addEventListener('change', this.changeSliderText.bind(this));\n    this.taskContainer.addEventListener('click', function (e) {\n      this.hideSetupWdw(e);\n      this.displayDropdown(e);\n      this.switchCountBtn(e);\n    }.bind(this));\n    this.addTaskBtn.addEventListener('click', this.showSetupWdw.bind(this));\n  },\n  changeSliderText: function changeSliderText() {\n    var breakSetup = this.breakSlider.valueAsNumber;\n\n    switch (breakSetup) {\n      case 2:\n        this.breakText.textContent = 'Long';\n        break;\n\n      case 3:\n        this.breakText.textContent = 'Medium';\n        break;\n\n      case 4:\n        this.breakText.textContent = 'Short';\n        break;\n\n      case 5:\n        this.breakText.textContent = 'Very Short';\n        break;\n    }\n  },\n  hideSetupWdw: function hideSetupWdw(e) {\n    var elementClasses = e.target.classList; // Is setupTaskWdw currently displayed:\n\n    if (!this.setupTaskWdw.classList.contains('m-setup-wdw--display-none')) {\n      // Checks for buttons or task container classes\n      var isAButton = elementClasses.contains('c-setup-wdw__btn');\n      var isOutsideWdw = elementClasses.contains('l-container__tasks');\n\n      if (isAButton || isOutsideWdw) {\n        this.setupTaskWdw.classList.add('m-setup-wdw--display-none');\n        this.setupTaskWdw.reset();\n      }\n    } // To remember the last slider value and text\n\n\n    this.changeSliderText();\n  },\n  displayDropdown: function displayDropdown(e) {\n    var elementClasses = e.target.classList; // Show/Hide dropdown\n\n    if (elementClasses.contains('c-task__dropdown-arrow')) {\n      // Closest finds parent of the target then the dropdown children with a class\n      var task = e.target.closest('.m-task');\n      var dropdownClassList = task.querySelector('.o-task__dropdown').classList; // Hide or show dropdown\n\n      dropdownClassList.toggle('o-task__dropdown--hidden'); // Changes dropdown arrow direction (image)\n\n      var dropdownBtn = task.querySelector('.c-task__dropdown-arrow');\n\n      if (dropdownClassList.contains('o-task__dropdown--hidden')) {\n        dropdownBtn.innerHTML = '<img src=\"../assets/angulo-pequeno-hacia-abajo.svg\" alt=\"Arrow pointing down\" class=\"c-task__icon-arrow-down c-task__dropdown-arrow\">';\n      } else if (!dropdownClassList.contains('o-task__dropdown--hidden')) {\n        dropdownBtn.innerHTML = '<img src=\"../assets/angulo-pequeno-hacia-arriba.svg\" alt=\"Arrow pointing up\" class=\"c-task__icon-arrow-up c-task__dropdown-arrow\">';\n      }\n    }\n  },\n  switchCountBtn: function switchCountBtn(e) {\n    var elementClasses = e.target.classList; // Switch stop/start buttons\n    // Is running\n\n    if (elementClasses.contains('c-task__btn--is-active')) {\n      elementClasses.remove('c-task__btn--is-active');\n      elementClasses.add('c-task__btn--is-unactive');\n      e.target.textContent = 'Start'; // Stopped\n    } else if (elementClasses.contains('c-task__btn--is-unactive')) {\n      elementClasses.remove('c-task__btn--is-unactive');\n      elementClasses.add('c-task__btn--is-active');\n      e.target.textContent = 'Stop';\n    }\n  },\n  showSetupWdw: function showSetupWdw() {\n    this.setupTaskWdw.classList.remove('m-setup-wdw--display-none');\n  }\n};\ndynamicHTML.init();\n\n\n//# sourceURL=webpack://flowtime/./src/app/app.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/app/app.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;
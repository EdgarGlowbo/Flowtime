import "../styles/style.scss";
import { endOfDay } from 'date-fns';
import { dynamicHTML } from "./app.js";
import { Task, categoriesObj } from "./task.js";

const taskInstances = {
  taskObjs: [],    
  init() {
    this.queryDOM();
    this.bindEvents();
    this.resetDailyAddFocusTime();
  },
  bindEvents() {
    dynamicHTML.setupTaskWdw.addEventListener('click', this.addTask.bind(this));    
  },
  queryDOM() {    
    this.taskNameInput = dynamicHTML.setupTaskWdw.querySelector('#taskName');
    this.taskCategoryInput = dynamicHTML.setupTaskWdw.querySelector('#taskCategory');
    this.temp1 = document.querySelector('#taskTemplate').content;       
  },
  addTask(e) {
    e.preventDefault();
    if (e.target.classList.contains('c-setup-wdw__btn-ok')) {
       // Get input values from m-setup-task form
      const name = this.taskNameInput.value;
      const category = this.taskCategoryInput.value;
      const breakSetup = dynamicHTML.breakSlider.valueAsNumber;
      // Creates task template      
      const taskTemplate = document.importNode(this.temp1, true);
      // Name and task queries
      const taskNameQ = taskTemplate.querySelector('.c-task__name');
      const taskCategoryQ = taskTemplate.querySelector('.c-category-btn');
      // If name and category aren't empty
      if (name.length > 0 && category.length > 0) {
        const capName = this.capitalize(name);
        const capCategory = this.capitalize(category);
        // Creates Task object instance 
        const taskObj = new Task(capName, capCategory, breakSetup, this.taskObjs.length);
        this.taskObjs.push(taskObj);
        taskNameQ.textContent = capName;
        taskCategoryQ.textContent = capCategory;   
        dynamicHTML.taskContainer.appendChild(taskTemplate);
        // Clear red borders
        this.taskNameInput.classList.remove('c-input-field--border-red');
        this.taskCategoryInput.classList.remove('c-input-field--border-red');
        // sets property to categoriesObj
        if (typeof categoriesObj[capCategory] === 'undefined') {
          categoriesObj[capCategory] = { addedFocusTime: 0, goal: 5 };      
        }  
        // Hide wdw
        dynamicHTML.hideSetupWdw(e);
      } else {
        // If it is empty border color is red
        if (!name.length > 0) {
          this.taskNameInput.classList.add('c-input-field--border-red');
        }
        if (!category.length > 0) {
          this.taskCategoryInput.classList.add('c-input-field--border-red')
        }
      }      
    }         
  },
  capitalize(str) {
    const lower = str.toLowerCase();
    const firstCharUpper = str[0].toUpperCase();
    const capitalized = firstCharUpper + lower.slice(1);
    return capitalized;
  },
  resetDailyAddFocusTime() {
    const date = new Date();
    const now = date.getTime();
    const endOfTheDay = endOfDay(date).getTime();
    // ms left till end of the day
    const timeLeft = endOfTheDay - now;  
    
    // Resets addedFocusTime values at the end of a day
    setTimeout(() => {
      // Get arr of keys for categoriesObj
      const arrKeys = Object.keys(categoriesObj);
      arrKeys.forEach(category => {
        categoriesObj[category]['addedFocusTime'] = 0;
      });    
    }, timeLeft);
  },
  getTaskObjIndex(e) {      
    const tasks = document.querySelectorAll('.m-task');    
    const closestTask = e.target.closest('.m-task');    
    if (closestTask !== null) {
      // Finds closestTask in tasks nodeList calling a method from arrays
      const objIndex = Array.prototype.indexOf.call(tasks, closestTask);      
      const taskObj = this.taskObjs[objIndex];
      taskObj.setTime(e.target.classList, closestTask);      
      taskObj.deleteTask(e.target.classList, tasks, objIndex);
    }
  },  
}

taskInstances.init();
export { taskInstances };
// Queries
// const countdownDisplay = document.querySelector('.js-count-down');

// // Event listeners for the setup-wdw

// // getTaskObjIndex


// addTaskHTML() {
//   taskContainer.innerHTML += `
//   <div class="m-task">
//     <div class="o-task__display">
//       <span class="c-task__name c-text__span js-task__name">${this.name}</span>
//       <button class="c-task__btn c-category-btn c-btn">${this.category}</button>
//       <button class="c-task__btn c-btn js-btn c-task__btn--is-unactive">Start</button>
//       <span class="c-task__count-up c-task__count-up--is-active c-text__span">00:00</span>
//     </div>
//     <div class="o-task__dropdown o-task__dropdown--hidden">
//       <div class="o-task-set-time-container">
//         <div class="o-task__start-time">
//           <span class="c-task__label c-text__span">Start time:</span>
//           <input type="text" class="c-task__start-time c-input-field" readonly="readonly" value="" name="startTime0">            
//         </div>
//         <div class="o-task__stop-time">
//           <span class="c-task__label c-text__span">Stop time:</span>
//           <input type="text" class="c-task__stop-time c-input-field" readonly="readonly" value="" name="stopTime0">
//         </div>
//         <div class="c-btn c-btn--no-margin"><img src="../assets/circulo-cruzado.svg" alt="delete button" class="c-task__delete"></div>        
//       </div>
//     </div>
//     <div class="c-task__dropdown-arrow"><img src="../assets/angulo-pequeno-hacia-abajo.svg" alt="Arrow pointing down" class="c-task__icon-arrow-down c-task__dropdown-arrow"></div>
//   </div>
// `   
// }

 
// countUp(targetClassList, targetElement, taskParentElement) {
//   let s = 0;
//   let m = 0;        
//   let h = 0;        

//   const countUpDisplayElement = taskParentElement.querySelector('.c-task__count-up');    

//   // if count up is not active (btn is green)     
//   if (targetClassList.contains('c-task__btn--is-unactive')) {      
//     const countUpStart = new Date().getTime();
//     this.intervalID = setInterval(() => {
//       const countUpCurrent = new Date().getTime();
//       // this.focusTime is set every second to the difference of time between countUpCurrent (fixed time) and countUpStart (updated every second)
//       this.focusTime = countUpCurrent - countUpStart;
//       const dateTimer = new Date(this.focusTime);
//       s = dateTimer.getSeconds();
//       m = dateTimer.getMinutes();                
//       h = Math.floor(this.focusTime / 3600000);
      
      
//       // slice is to only get the last two digits of the string
//       countUpDisplayElement.innerHTML = `0${m}`.slice(-2) + ':' + `0${s}`.slice(-2);
//       if (h > 0) {
//         countUpDisplayElement.innerHTML = `0${h}`.slice(-2) + ':' + `0${m}`.slice(-2) + ':' + `0${s}`.slice(-2);          
//       }
      
//     }, 1000);      
//   } else if (targetClassList.contains('c-task__btn--is-active')) {      
//     clearInterval(this.intervalID);
//     countUpDisplayElement.innerHTML = '00:00';    
//     // Adds focusTime to addedFocusTime  property in categoriesObj 
//     categoriesObj[this.category]['addedFocusTime'] += this.focusTime;      
//   }
//   switchCountBtn(targetClassList, targetElement);    
// }

// breakTimer(targetClasses) {
    
//   if (targetClasses.contains('c-task__btn--is-unactive')) {
//     this.breakDuration += Math.ceil(this.focusTime / this.breakSetup);
    
    
//     // First time definition so it gets displayed instantly on click event
//     let dateBreakDuration = new Date(this.breakDuration);
//     let m = dateBreakDuration.getMinutes();
//     let s = dateBreakDuration.getSeconds();
//     let h = Math.floor(this.breakDuration / 3600000);
//     countdownDisplay.textContent = h > 0 ?  `0${h}`.slice(-2) + ':' + `0${m}`.slice(-2) + ':' + `0${s}`.slice(-2) : `0${m}`.slice(-2) + ':' + `0${s}`.slice(-2);          

//     // Interval updates timer to countdown
//     this.breakIntervalID = setInterval(() => {
//       dateBreakDuration = new Date(this.breakDuration);    
//       m = dateBreakDuration.getMinutes();
//       s = dateBreakDuration.getSeconds();
//       h = Math.floor(this.breakDuration / 3600000);
//       countdownDisplay.textContent = h > 0 ? `0${h}`.slice(-2) + ':' + `0${m}`.slice(-2) + ':' + `0${s}`.slice(-2) : `0${m}`.slice(-2) + ':' + `0${s}`.slice(-2);          
//       this.breakDuration = this.breakDuration - 1000;

//       // Stops count down to avoid negative values
//       if (this.breakDuration <= 0) {
//         clearInterval(this.breakIntervalID);
//         this.breakDuration = 0;                
//         countdownDisplay.textContent = '00:00';          
//       }        
//     }, 1000)      

//   } else if (targetClasses.contains('c-task__btn--is-active')) {
//     // Pause countdown when task starts (focusTime)
//     clearInterval(this.breakIntervalID);      
//   }
// }

  // checks if given category already exists (so it doesn't overwrite the addedFocusTime value)
    // if (typeof categoriesObj[category] === 'undefined') {
    //   categoriesObj[category] = { addedFocusTime: 0 };
    // }  
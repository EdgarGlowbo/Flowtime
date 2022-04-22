import "../styles/style.scss";
import { endOfDay } from 'date-fns';
import { dynamicHTML } from "./app.js";
import { Task, categoriesObj } from "./task.js";

const taskInstances = {
  taskObjs: [],
  breakDuration: 0,
  focusTime: 0,    
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
    this.breakDisplay = document.querySelector('.js-count-down');
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
          categoriesObj[capCategory] = { addedFocusTime: 0, goal: 300000 };      
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
      dynamicHTML.switchCountBtn(e.target.classList, taskObj, e);
      this.breakTimer(taskObj, e.target.classList);
      this.countUp(e.target.classList, closestTask, taskObj);      
    }
  },
  countUp(elementClasses, parentElement, obj) {
    if (elementClasses.contains('c-task__btn')) {      
      let [s, m, h] = [0, 0, 0];             
      const countUpElement = parentElement.querySelector('.c-task__count-up');
      if (!obj.isActive) {
        clearInterval(this.intervalID);      
        const countUpStart = new Date().getTime();
        this.intervalID = setInterval(() => {
          const countUpCurrent = new Date().getTime();          
          this.focusTime = countUpCurrent - countUpStart;
          const dateTimer = new Date(this.focusTime);
          s = dateTimer.getSeconds();
          m = dateTimer.getMinutes();                
          h = Math.floor(this.focusTime / 3600000);                              
          countUpElement
            .innerHTML = `0${m}`.slice(-2) + ':' + `0${s}`.slice(-2);
          if (h > 0) {
            countUpElement
              .innerHTML = `0${h}`.slice(-2) + ':' + `0${m}`.slice(-2) + ':' + `0${s}`.slice(-2);          
          }          
        }, 1000);
        obj.isActive = true;        
      } else {
        clearInterval(this.intervalID);        
        countUpElement.innerHTML = '00:00';            
        categoriesObj[obj.category]['addedFocusTime'] += this.focusTime;
        obj.isActive = false;  
      }               
    }              
  },
  breakTimer(obj, elementClasses) {
    if (elementClasses.contains('c-task__btn')) {
      if (obj.isActive) {
        this.breakDuration += Math.ceil(this.focusTime / obj.breakSetup);                  
        let dateBreakDuration = new Date(this.breakDuration);
        let m = dateBreakDuration.getMinutes();
        let s = dateBreakDuration.getSeconds();
        let h = Math.floor(this.breakDuration / 3600000);      
        this.breakDisplay.textContent = h > 0 ?  `0${h}`.slice(-2) + ':' + `0${m}`.slice(-2) + ':' + `0${s}`.slice(-2) : `0${m}`.slice(-2) + ':' + `0${s}`.slice(-2);  
        // Interval updates timer to countdown
        this.breakIntervalID = setInterval(() => {   
          this.breakDuration = this.breakDuration - 1000;
          dateBreakDuration = new Date(this.breakDuration);    
          m = dateBreakDuration.getMinutes();
          s = dateBreakDuration.getSeconds();
          h = Math.floor(this.breakDuration / 3600000);          
          this.breakDisplay.textContent = h > 0 ?  `0${h}`.slice(-2) + ':' + `0${m}`.slice(-2) + ':' + `0${s}`.slice(-2) : `0${m}`.slice(-2) + ':' + `0${s}`.slice(-2);;  
          // Stops count down to avoid negative values
          if (this.breakDuration <= 0) {
            clearInterval(this.breakIntervalID);
            this.breakDuration = 0;                
            this.breakDisplay.textContent = '00:00';          
          }        
        }, 1000)        
      } else {
        // Pause countdown when task starts (focusTime)
        clearInterval(this.breakIntervalID);      
      }
    }    
  }
}
taskInstances.init();
export { taskInstances };
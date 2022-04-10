import "./styles/style.scss"
import { format } from 'date-fns'
// Queries
const countdownDisplay = document.querySelector('.js-count-down');


// Classes

class Task {
  constructor (name, category, breakSetup) {
    this.name = name;
    this.category = category;
    this.breakSetup = breakSetup;    
  }
  focusTime = 0;
  addedFocusTime;
  intervalID;
  breakIntervalID;
  breakDuration = 0;

  addTaskHTML() {
    taskContainer.innerHTML += `
    <div class="m-task">
      <div class="o-task__display">
        <span class="c-task__name c-text__span js-task__name">${this.name}</span>
        <button class="c-task__btn c-category-btn c-btn">${this.category}</button>
        <button class="c-task__btn c-btn js-btn c-task__btn--is-unactive">Start</button>
        <span class="c-task__count-up c-task__count-up--is-active c-text__span">00:00</span>
      </div>
      <div class="o-task__dropdown o-task__dropdown--hidden">
        <div class="o-task-set-time-container">
          <div class="o-task__start-time">
            <span class="c-task__label c-text__span">Start time:</span>
            <input type="text" class="c-task__start-time c-input-field" readonly="readonly" value="" name="startTime0">            
          </div>
          <div class="o-task__stop-time">
            <span class="c-task__label c-text__span">Stop time:</span>
            <input type="text" class="c-task__stop-time c-input-field" readonly="readonly" value="" name="stopTime0">
          </div>
          <div class="c-btn c-btn--no-margin"><img src="/assets/circulo-cruzado.svg" alt="delete button" class="c-task__delete"></div>        
        </div>
      </div>
      <div class="c-task__dropdown-arrow"><img src="../assets/angulo-pequeno-hacia-abajo.svg" alt="Arrow pointing down" class="c-task__icon-arrow-down c-task__dropdown-arrow"></div>
    </div>
  `   
  }
  countUp(targetClassList, targetElement, taskParentElement) {
    let s = 0;
    let m = 0;        
    let h = 0;        

    const countUpDisplayElement = taskParentElement.querySelector('.c-task__count-up');    
  
    // if count up is not active (btn is green)     
    if (targetClassList.contains('c-task__btn--is-unactive')) {      
      const countUpStart = new Date().getTime();
      this.intervalID = setInterval(() => {
        const countUpCurrent = new Date().getTime();
        // this.focusTime is set every second to the difference of time between countUpCurrent (fixed time) and countUpStart (updated every second)
        this.focusTime = countUpCurrent - countUpStart;
        const dateTimer = new Date(this.focusTime);
        s = dateTimer.getSeconds();
        m = dateTimer.getMinutes();                
        h = Math.floor(this.focusTime / 3600000);
        
        
        // slice is to only get the last two digits of the string
        countUpDisplayElement.innerHTML = `0${m}`.slice(-2) + ':' + `0${s}`.slice(-2);
        if (h > 0) {
          countUpDisplayElement.innerHTML = `0${h}`.slice(-2) + ':' + `0${m}`.slice(-2) + ':' + `0${s}`.slice(-2);          
        }
        
      }, 1000);      
    } else if (targetClassList.contains('c-task__btn--is-active')) {      
      clearInterval(this.intervalID);
      countUpDisplayElement.innerHTML = '00:00';
      this.addedFocusTime += this.focusTime;      
    }
    switchCountBtn(targetClassList, targetElement);    
  }
  // Sets start or stoptime
  setTime(targetClasses, targetElement, parentElement) {
    const currentDate = format(new Date(), 'kk:mm');
    const dropdownContainer = parentElement.querySelector('.o-task__dropdown');
    let startTimeInput = parentElement.querySelectorAll('.c-task__start-time');
    const stopTimeInput = parentElement.querySelectorAll('.c-task__stop-time');

    // Gets last element index in startTimeInput node list
    let lastRow = startTimeInput.length - 1;

    if (targetClasses.contains('c-task__btn--is-active')) {      
      // Checks if startTimeInput is not empty anymore      
      if (startTimeInput[lastRow].value.length > 0) {
        
        // Adds addtional row of start/stopTime        
        dropdownContainer.innerHTML += `
          <div class="o-task-set-time-container">
            <div class="o-task__start-time">
              <span class="c-task__label c-text__span">Start time:</span>
              <input type="text" class="c-task__start-time c-input-field" readonly="readonly" value="" name="startTime${lastRow + 1}">            
            </div>
            <div class="o-task__stop-time">
              <span class="c-task__label c-text__span">Stop time:</span>
              <input type="text" class="c-task__stop-time c-input-field" readonly="readonly" value="" name="stopTime${lastRow + 1}">
            </div>        
          </div>
        `;      
        // Updates the nodeList once html template added
        startTimeInput = parentElement.querySelectorAll('.c-task__start-time');        
        lastRow = startTimeInput.length - 1;
      }      
      startTimeInput[lastRow].setAttribute('value', currentDate);
    } else if (targetClasses.contains('c-task__btn--is-unactive')) {          
      stopTimeInput[lastRow].setAttribute('value', currentDate);
    }    
  }
  breakTimer(targetClasses) {
    
    if (targetClasses.contains('c-task__btn--is-unactive')) {
      this.breakDuration += Math.ceil(this.focusTime / this.breakSetup);
      
      
      // First time definition so it gets displayed instantly on click event
      let dateBreakDuration = new Date(this.breakDuration);
      let m = dateBreakDuration.getMinutes();
      let s = dateBreakDuration.getSeconds();
      let h = Math.floor(this.breakDuration / 3600000);
      countdownDisplay.textContent = h > 0 ?  `0${h}`.slice(-2) + ':' + `0${m}`.slice(-2) + ':' + `0${s}`.slice(-2) : `0${m}`.slice(-2) + ':' + `0${s}`.slice(-2);          

      // Interval updates timer to countdown
      this.breakIntervalID = setInterval(() => {
        dateBreakDuration = new Date(this.breakDuration);    
        m = dateBreakDuration.getMinutes();
        s = dateBreakDuration.getSeconds();
        h = Math.floor(this.breakDuration / 3600000);
        countdownDisplay.textContent = h > 0 ? `0${h}`.slice(-2) + ':' + `0${m}`.slice(-2) + ':' + `0${s}`.slice(-2) : `0${m}`.slice(-2) + ':' + `0${s}`.slice(-2);          
        this.breakDuration = this.breakDuration - 1000;

        // Stops count down to avoid negative values
        if (this.breakDuration <= 0) {
          clearInterval(this.breakIntervalID);
          this.breakDuration = 0;                
          countdownDisplay.textContent = '00:00';          
        }        
      }, 1000)      

    } else if (targetClasses.contains('c-task__btn--is-active')) {
      // Pause countdown when task starts (focusTime)
      clearInterval(this.breakIntervalID);      
    }
  }
  deleteTask(targetClasses, tasksNodeList, index) {    
    if (targetClasses.contains('c-task__delete')) {
      const targetTask = tasksNodeList[index];
      // Removes html from targetTask      
      targetTask.remove();
      // Splice method removes 1 element from taskObjs arr starting from current task index
      taskObjs.splice(this.index, 1);                 
    }    
  }
}

const taskObjs = [];
// Creates Task obj instances and pushes them to taskObjs array
const addTask = (name, category, breakSetup) => {
  
  const taskObj = new Task(name, category, breakSetup, taskObjs.length);
  taskObjs.push(taskObj);
  const lastTaskObj = taskObjs.length - 1;  
  taskObjs[lastTaskObj].addTaskHTML();  
}


// Event listeners for the setup-wdw
setupTaskWdw.addEventListener('click', e => {
  e.preventDefault();
  const targetClassList = e.target.classList;
  
  // Checks if target is ok btn
  if (targetClassList.contains('c-setup-wdw__btn-ok')) {

    const name = document.querySelector('#taskName').value.trim();    
    const category = document.querySelector('#taskCategory').value.trim();    
    const breakSetup = breakSlider.valueAsNumber;    
    
    // Checks if name and category are not empty
    if (name.length !== 0 && category.length !== 0) {
      addTask(name, category, breakSetup);
      hideSetupWdw(targetClassList); 
    } else if (name.length === 0 || category.length === 0) {
      console.log('You must choose a name and category');
    }
  // Checks if target is cancel button
  } else if (targetClassList.contains('c-setup-wdw__btn-cancel')){
    hideSetupWdw(targetClassList); 
  }  
});


taskContainer.addEventListener('click', e => {
  const targetElement = e.target;
  const targetClassList = e.target.classList;
  const tasks = document.querySelectorAll('.m-task');
  // Finds closest m-task class
  const closestTask = targetElement.closest('.m-task');
  // if closestTask is null then it doesn't do anything
  if (closestTask !== null) {
    // Gets index of closestTask (.m-task element) from tasks node list making it an arr and using call to use indexOf method
    const objIndex = Array.prototype.indexOf.call(tasks, closestTask);        
    // Gets an specific obj from taskObjs array. Same index as tasks Node List.
    const taskObj = taskObjs[objIndex];
  
    taskObj.countUp(targetClassList, targetElement, closestTask);    
    taskObj.setTime(targetClassList, targetElement, closestTask);
    taskObj.breakTimer(targetClassList);
    taskObj.deleteTask(targetClassList, tasks, objIndex);
  }
});
import "./styles/style.scss"

// Queries


// Classes

class Task {
  constructor (name, category, breakSetup, index) {
    this.name = name;
    this.category = category;
    this.breakSetup = breakSetup;
    this.index = index;
  }
  focusSeconds = 0;
  focusMinutes = 0;
  focusHours = 0;

  addTaskHTML() {
    taskContainer.innerHTML += `
    <div class="m-task" id="${this.index}">
      <div class="o-task__display">
        <span class="c-task__name c-text__span js-task__name">${this.name}</span>
        <button class="c-task__btn c-btn js-btn c-task__btn--is-unactive">Start</button>
        <span class="c-task__count-up c-task__count-up--is-active c-text__span">00:00</span>
      </div>
      <div class="o-task__dropdown o-task__dropdown--hidden">
        <div class="o-task__start-time">
          <span class="c-task__label c-text__span">Start time:</span>
          <input type="text" value="" class="c-task__start-time c-input-field" readonly="readonly">            
        </div>
        <div class="o-task__stop-time">
          <span class="c-task__label c-text__span">Stop time:</span>
          <input type="text" value="" class="c-task__stop-time c-input-field" readonly="readonly">            
        </div>
        <button class="c-task__btn c-category-btn c-btn">${this.category}</button>
      </div>
      <div class="c-task__dropdown-arrow"><img src="../assets/angulo-pequeno-hacia-abajo.svg" alt="Arrow pointing down" class="c-task__icon-arrow-down c-task__dropdown-arrow"></div>
    </div>
  `   
  }
  countUp(targetClassList, targetElement) {
    if (targetClassList.contains('c-task__btn--is-unactive')) {
      let h = this.focusHours;
      let m = this.focusMinutes;
      let s = this.focusSeconds;
      h++;
      console.log(h, this.focusHours);
      // Switch stop/start button style
      switchCountBtn(targetClassList, targetElement);
    }   
  }
  setStartTime() {

  }
  setStopTime() {
    
  }
  deleteTask() {

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
  }  
});


taskContainer.addEventListener('click', e => {
  const targetElement = e.target;
  const targetClassList = e.target.classList;
  // Finds closest m-task class
  const closestTask = targetElement.closest('.m-task');
  // if closestTask is null then it doesn't do anything
  if (closestTask !== null) {
    const objIndex = parseInt(closestTask.id);
    const taskObj = taskObjs[objIndex];
    taskObj.countUp(targetClassList, targetElement);    
  }
});
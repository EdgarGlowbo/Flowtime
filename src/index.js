import "./styles/style.scss"

// Queries


// Classes

class Task {
  constructor (name, category, breakSetup) {
    this.name = name;
    this.category = category;
    this.breakSetup = breakSetup
  }
  focusDuration = 0;

  addTaskHTML() {
    taskContainer.innerHTML += `
    <div class="m-task">
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
  countUp() {

  }
  setStartTime() {

  }
  setStopTime() {
    
  }
  deleteTask() {

  }
}

const taskObjs = [];
const addTask = (name, category, breakSetup) => {
  const taskObj = new Task(name, category, breakSetup);
  taskObjs.push(taskObj);
  const lastTaskObj = taskObjs.length - 1
  taskObjs[lastTaskObj].addTaskHTML();
}



setupTaskWdw.addEventListener('click', e => {
  const targetClassList = e.target.classList;
  
  // Checks if target is ok btn
  if (targetClassList.contains('c-setup-wdw__btn-ok')) {
    const name = document.querySelector('#taskName').value;    
    const category = document.querySelector('#taskCategory').value;    
    const breakSetup = breakSlider.valueAsNumber;
    console.log(targetClassList);
  
    addTask(name, category, breakSetup);
    hideSetupWdw(targetClassList);
  }
});
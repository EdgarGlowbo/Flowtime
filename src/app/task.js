// Classes
class Task {
  constructor (name, category, breakSetup) {
    this.name = name;
    this.category = category;
    this.breakSetup = breakSetup;    
  }
  focusTime = 0;
  intervalID;
  // breakIntervalID;
  // breakDuration = 0;
 
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
const categoriesObj = new Object();

export { Task, categoriesObj }
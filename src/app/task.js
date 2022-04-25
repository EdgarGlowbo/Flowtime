import { format } from "date-fns";
// Classes
class Task {
  constructor (name, category, breakSetup) {
    this.name = name;
    this.category = category;
    this.breakSetup = breakSetup;    
  }  
  isActive = false;  

  // Sets start or stoptime
  setTime(elementClasses, parentElement) {  
    const currentDate = format(new Date(), 'kk:mm');
    // Queries closestTask
    const dropdownContainer = parentElement.querySelector('.o-task__dropdown');
    let startTimeInput = parentElement.querySelectorAll('.c-task__start-time');
    const stopTimeInput = parentElement.querySelectorAll('.c-task__stop-time');    
    let lastRow = startTimeInput.length - 1;
    if (elementClasses.contains('c-task__btn--is-unactive')) {      
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
    } else if (elementClasses.contains('c-task__btn--is-active')) {          
      stopTimeInput[lastRow].setAttribute('value', currentDate);
    }    
  }  
}
const categoriesObj = new Object();

export { Task, categoriesObj }
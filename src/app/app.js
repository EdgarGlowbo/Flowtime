  import { taskInstances } from "./index.js";
  const dynamicHTML = {
    init() {
      this.queryDOM();
      this.bindEvents();
    },
    queryDOM() {
      // queries (couldn't cache dom i guess)
      this.taskContainer = document.querySelector('.l-container__tasks');
      this.setupTaskWdw = document.querySelector('.m-setup-wdw');
      this.addTaskBtn = document.querySelector('.c-add-task-btn');
      this.breakSlider = this.setupTaskWdw.querySelector('#taskBreak');
      this.breakText = this.setupTaskWdw.querySelector('.c-setup-wdw__break-duration-text');       
    },
    bindEvents() {      
      this.breakSlider.addEventListener('change', this.changeSliderText.bind(this));
      this.taskContainer.addEventListener('click', function(e) {
        this.hideSetupWdw(e);
        this.displayDropdown(e);        
        taskInstances.getTaskObjIndex(e); 
      }.bind(this));
      this.addTaskBtn.addEventListener('click', this.showSetupWdw.bind(this));
    }, 
    changeSliderText() {
      const breakSetup = this.breakSlider.valueAsNumber;      
      switch (breakSetup) {
        case 2:
          this.breakText.textContent = 'Long';
          break;
        case 3:
          this.breakText.textContent = 'Medium';
          break;
        case 4:
          this.breakText.textContent = 'Short';
          break;
        case 5:
          this.breakText.textContent = 'Very Short';
          break;
      }  
    },
    hideSetupWdw(e) {      
      const elementClasses = e.target.classList;      
      // Is setupTaskWdw currently displayed:
      if (!this.setupTaskWdw.classList.contains('m-setup-wdw--display-none')) {
        // Checks for buttons or task container classes
        const isAButton = elementClasses.contains('c-setup-wdw__btn');
        const isOutsideWdw = elementClasses.contains('l-container__tasks');
        if ( isAButton || isOutsideWdw ) {
          this.setupTaskWdw.classList.add('m-setup-wdw--display-none');
          this.setupTaskWdw.reset();
        }
      }
      // To remember the last slider value and text
      this.changeSliderText();      
    },
    displayDropdown(e) {      
      const elementClasses = e.target.classList;
      // Show/Hide dropdown
      if (elementClasses.contains('c-task__dropdown-arrow')) {
        // Closest finds parent of the target then the dropdown children with a class
        const task =  e.target.closest('.m-task');
        const dropdownClassList = task.querySelector('.o-task__dropdown').classList;      
        // Hide or show dropdown
        dropdownClassList.toggle('o-task__dropdown--hidden');
        // Changes dropdown arrow direction (image)
        const dropdownBtn = task.querySelector('.c-task__dropdown-arrow');    

        if (dropdownClassList.contains('o-task__dropdown--hidden')) {
          dropdownBtn.innerHTML = '<img src="../assets/angulo-pequeno-hacia-abajo.svg" alt="Arrow pointing down" class="c-task__icon-arrow-down c-task__dropdown-arrow">';
        } else if (!dropdownClassList.contains('o-task__dropdown--hidden')) {
          dropdownBtn.innerHTML = '<img src="../assets/angulo-pequeno-hacia-arriba.svg" alt="Arrow pointing up" class="c-task__icon-arrow-up c-task__dropdown-arrow">';
        }
      }
    },
    switchCountBtn (elementClasses, obj, e) {
      if (elementClasses.contains('c-task__btn')) {
        // Is running
        if (obj.isActive) {
          elementClasses.remove('c-task__btn--is-active');
          elementClasses.add('c-task__btn--is-unactive');
          e.target.textContent = 'Start';      
        // Stopped
        } else {
          elementClasses.remove('c-task__btn--is-unactive');
          elementClasses.add('c-task__btn--is-active');
          e.target.textContent = 'Stop';        
        }
      }      
    },
    showSetupWdw() {      
      this.setupTaskWdw.classList.remove('m-setup-wdw--display-none');      
    }  
  }

dynamicHTML.init();  
export { dynamicHTML };
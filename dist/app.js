// Queries
const taskContainer = document.querySelector('.l-container__tasks');
const addTaskBtn = document.querySelector('.c-add-task-btn');
const setupTaskWdw = document.querySelector('.m-setup-wdw');
const breakSlider = document.querySelector('#taskBreak');

const hideSetupWdw = target => {
   // Hides setupTask Window
  // If setupwdw doesn't have that class then it adds that class
  if (!setupTaskWdw.classList.contains('m-setup-wdw--display-none')) {
    // Checks for buttons or task container classes
    if (target.contains('c-setup-wdw__btn') || target.contains('l-container__tasks')) {
      setupTaskWdw.classList.add('m-setup-wdw--display-none');
      setupTaskWdw.reset();
    }
  }
}

const displayDropdown = (targetClassList, target) => {
  // Show/Hide dropdown
  if (targetClassList.contains('c-task__dropdown-arrow')) {
    // Closest finds parent of the target then the dropdown children with a class
    const taskDropdownClassList = target.closest('.m-task').querySelector('.o-task__dropdown').classList;      
    // Hide or show dropdown
    taskDropdownClassList.toggle('o-task__dropdown--hidden');
    // Changes dropdown arrow direction (image)
    const dropdownBtn = target.closest('.m-task').querySelector('.c-task__dropdown-arrow');    

    if (taskDropdownClassList.contains('o-task__dropdown--hidden')) {
      dropdownBtn.innerHTML = '<img src="../assets/angulo-pequeno-hacia-abajo.svg" alt="Arrow pointing down" class="c-task__icon-arrow-down c-task__dropdown-arrow"></img>';
    } else if (!taskDropdownClassList.contains('o-task__dropdown--hidden')) {
      dropdownBtn.innerHTML = '<img src="../assets/angulo-pequeno-hacia-arriba.svg" alt="Arrow pointing up" class="c-task__icon-arrow-up c-task__dropdown-arrow">';
    }
  }
}

const switchCountBtn = (targetClassList, target) => {
    // Switch stop/start buttons
    if (targetClassList.contains('c-task__btn--is-active')) {
      targetClassList.remove('c-task__btn--is-active');
      targetClassList.add('c-task__btn--is-unactive');
      target.textContent = 'Start';
    } else if (targetClassList.contains('c-task__btn--is-unactive')) {
      targetClassList.remove('c-task__btn--is-unactive');
      targetClassList.add('c-task__btn--is-active');
      target.textContent = 'Stop';
    }
  
}


taskContainer.addEventListener('click', e => {  
  const targetClassList = e.target.classList;
  const targetElement = e.target;

  // Hide setup-wdw when clicked outside of it
  hideSetupWdw(targetClassList);
  // Shows/hide dropdown
  displayDropdown(targetClassList, targetElement);

});

// Show setupTask window
addTaskBtn.addEventListener('click', e => {
  const elementClassList = e.target.classList;
  if(elementClassList.contains('js-add-task-btn')) {
    setupTaskWdw.classList.remove('m-setup-wdw--display-none');
  }
});
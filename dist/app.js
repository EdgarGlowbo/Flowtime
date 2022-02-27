// Queries
const taskContainer = document.querySelector('.l-container__tasks');
const addTaskBtn = document.querySelector('.c-add-task-btn');
const setupTaskWdw = document.querySelector('.m-setup-wdw');

taskContainer.addEventListener('click', e => {
  e.stopPropagation();
  const elementClassList = e.target.classList;


  // Show/Hide dropdown
  if (elementClassList.contains('c-task__dropdown-arrow')) {
    // Closest finds parent of the target then the dropdown children with a class
    const taskDropdownClassList = e.target.closest('.m-task').querySelector('.o-task__dropdown').classList;      
    // Hide or show dropdown
    taskDropdownClassList.toggle('o-task__dropdown--hidden');
    // Changes dropdown arrow direction (image)
    const dropdownBtn = e.target.closest('.m-task').querySelector('.c-task__dropdown-arrow');    

    if (taskDropdownClassList.contains('o-task__dropdown--hidden')) {
      dropdownBtn.innerHTML = '<img src="../assets/angulo-pequeno-hacia-abajo.svg" alt="Arrow pointing down" class="c-task__icon-arrow-down c-task__dropdown-arrow"></img>';
    } else if (!taskDropdownClassList.contains('o-task__dropdown--hidden')) {
      dropdownBtn.innerHTML = '<img src="../assets/angulo-pequeno-hacia-arriba.svg" alt="Arrow pointing up" class="c-task__icon-arrow-up c-task__dropdown-arrow">';
    }
  }

  // Hides setupTask Window
  // If setupwdw doesn't have that class then it adds that class
  if (!setupTaskWdw.classList.contains('m-setup-wdw--display-none')) {
    // Checks for buttons or task container classes
    if (elementClassList.contains('c-setup-wdw__btn') || elementClassList.contains('l-container__tasks')) {
      setupTaskWdw.classList.add('m-setup-wdw--display-none');
    }
  }
  
  // Switch stop/start buttons
  if (elementClassList.contains('c-task__btn--is-active')) {
    elementClassList.remove('c-task__btn--is-active');
    elementClassList.add('c-task__btn--is-unactive');
    e.target.textContent = 'Start';
  } else if (elementClassList.contains('c-task__btn--is-unactive')) {
    elementClassList.remove('c-task__btn--is-unactive');
    elementClassList.add('c-task__btn--is-active');
    e.target.textContent = 'Stop';
  }

  // Changes dropdown button arrow direction
  if (elementClassList.contains('c-task__dropdown-arrow')) {
    if (elementClassList.contains('c-task__dropdown-arrow--dropdown-hidden')) {
      

    }

  }
});

// Show setupTask window
addTaskBtn.addEventListener('click', e => {
  const elementClassList = e.target.classList;
  if(elementClassList.contains('js-add-task-btn')) {
    setupTaskWdw.classList.remove('m-setup-wdw--display-none');
  }
});


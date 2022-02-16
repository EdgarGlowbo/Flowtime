import "./styles/style.scss"

class Task {
  constructor (name, category, breakSetup) {
    this.name = name;
    this.category = category;
    this.breakSetup = breakSetup
  }
  focusDuration = 0;

  addTaskHTML() {

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

const currentTasks = [];
const taskSetupWindow = () => {
  
}
const addTask = () => {
  const taskObj = new Task('name', 'coding', '4');

}
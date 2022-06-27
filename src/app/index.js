import 'regenerator-runtime/runtime';
import "../styles/style.scss";
import 
{ getYear, getMonth, getDate, 
  format
} from 'date-fns';
import { dynamicHTML } from "./app.js";
import { Task } from "./task.js";

import { initializeApp } from "firebase/app";
import { 
    getFirestore, collection, addDoc,
    deleteDoc, doc, getDoc, getDocs,
    setDoc, updateDoc, increment, arrayUnion,    
  } 
from "firebase/firestore";
import { getAuth, signInAnonymously } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyCwUJfVaRIommAPOtOH1_1ki8v7PzjDKqE",
  authDomain: "flowtime-5eb6c.firebaseapp.com",
  projectId: "flowtime-5eb6c",
  storageBucket: "flowtime-5eb6c.appspot.com",
  messagingSenderId: "702197938017",
  appId: "1:702197938017:web:bf2b96491eb626599b7720"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();



const taskInstances = {
  taskObjs: [],
  breakDuration: 0,
  focusTime: 0,
  timePassed: 0,
  
  init() {
    this.queryDOM();
    this.bindEvents();    
    this.createUserDoc();    
    this.breakCountdown(localStorage.getItem('then'), localStorage.getItem('breakDuration'));
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
        const taskObj = new Task(capName, capCategory, breakSetup);
        this.taskToDB(taskObj);
        this.taskObjs.push(taskObj);
        taskNameQ.textContent = capName;
        taskCategoryQ.textContent = capCategory;   
        dynamicHTML.taskContainer.appendChild(taskTemplate);
        // Clear red borders
        this.taskNameInput.classList.remove('c-input-field--border-red');
        this.taskCategoryInput.classList.remove('c-input-field--border-red');
        this.updateFocusTimeDB(taskObj);  
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
  getTaskObjIndex(e) {      
    const tasks = document.querySelectorAll('.m-task');    
    const closestTask = e.target.closest('.m-task');    
    if (closestTask !== null) {
      // Finds closestTask in tasks nodeList calling a method from arrays
      const objIndex = Array.prototype.indexOf.call(tasks, closestTask);      
      const taskObj = this.taskObjs[objIndex];
      taskObj.setTime(e.target.classList, closestTask);      
      this.deleteTask(e.target.classList, tasks, objIndex);
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
        }, 200);
        obj.isActive = true;        
      } else {
        clearInterval(this.intervalID);        
        countUpElement.innerHTML = '00:00';                
        this.updateFocusTimeDB(obj);
        obj.isActive = false;  
      }               
    }              
  },
  breakTimer(obj, elementClasses) {     
    if (elementClasses.contains('c-task__btn')) {      
      if (obj.isActive) {        
        this.breakDuration += Math.ceil(this.focusTime / obj.breakSetup);
        localStorage.setItem('breakDuration', this.breakDuration);
        const dateBreakDuration = new Date(this.breakDuration);
        const m = dateBreakDuration.getMinutes();
        const s = dateBreakDuration.getSeconds();
        const h = Math.floor(this.breakDuration / 3600000);      
        this.breakDisplay.textContent = h > 0 ?  `0${h}`.slice(-2) + ':' + `0${m}`.slice(-2) + ':' + `0${s}`.slice(-2) : `0${m}`.slice(-2) + ':' + `0${s}`.slice(-2);  
        // Interval updates timer to countdown
        const then = new Date().getTime();
        localStorage.setItem('then', then);
        this.breakCountdown(then, this.breakDuration);
      } else {        
        // Pause countdown when task starts (focusTime)
        clearInterval(this.breakIntervalID);
        this.breakDuration -= this.timePassed;
        this.timePassed = 0;        
      }
    }    
  },
  async deleteTask(elementClasses, tasksNodeList, index) {    
    if (elementClasses.contains('c-task__delete')) {
      const targetTask = tasksNodeList[index];
      // Removes html from targetTask      
      targetTask.remove();
      // Removes task from db
      const taskID = this.taskObjs[index].id;      
      const docRef = doc(db, "users", this.userID, "tasks", taskID);      
      await deleteDoc(docRef);      
      // Splice method removes 1 element from taskObjs arr starting from current task index      
      this.taskObjs.splice(index, 1);           
    }    
  },
  createUserDoc() {
    signInAnonymously(auth)
      .then((data) => {
        // add userID prop and set uid from anon auth  
        taskInstances.userID = data.user.uid;        
        this.tasksColRef = collection(db, "users", this.userID, "tasks");          
        this.goalsColRef = collection(db, "users", this.userID, "goals"); 
        this.retrieveTasks();         
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage);
      });    
  },
  async taskToDB(obj) {
    const docRef = await addDoc(this.tasksColRef, JSON.parse(JSON.stringify(obj)));
    const docSnap = await getDoc(docRef);    
    if (docSnap.exists()) {
      obj.id = docSnap.id;
    } else {      
      console.log("No such document!");
    }    
  },
  async retrieveTasks() {
    const querySnapshot = await getDocs(this.tasksColRef);
      querySnapshot.forEach((doc) => {             
        this.addTaskFromDB(doc.data(), doc.id);
      });   
  },
  addTaskFromDB(taskData, docID) {
    // Creates task template      
    const taskTemplate = document.importNode(this.temp1, true);
    // Name and task queries
    const taskNameQ = taskTemplate.querySelector('.c-task__name');
    const taskCategoryQ = taskTemplate.querySelector('.c-category-btn');
    const taskObj = new Task(taskData.name, taskData.category, taskData.breakSetup);
    taskObj.id = docID;    
    this.taskObjs.push(taskObj);
    taskNameQ.textContent = taskObj.name;
    taskCategoryQ.textContent = taskObj.category;
    dynamicHTML.taskContainer.appendChild(taskTemplate);
  },
  breakCountdown(then, breakDuration) {
    this.breakIntervalID = setInterval(() => {
      if (typeof then !== 'undefined') {
        const now = new Date().getTime();
        this.timePassed = now - then;        
        const timeLeft = breakDuration - this.timePassed;
        // Stops count down to avoid negative values
        if (timeLeft <= 0) {            
          clearInterval(this.breakIntervalID);
          this.breakDuration = 0;
          this.timePassed = 0;                
          this.breakDisplay.textContent = '00:00';
          localStorage.removeItem('then');
          localStorage.removeItem('breakDuration');
        } else {
          const dateBreakDuration = new Date(timeLeft);    
          const m = dateBreakDuration.getMinutes();
          const s = dateBreakDuration.getSeconds();
          const h = Math.floor(timeLeft / 3600000);          
          this.breakDisplay.textContent = h > 0 ?  `0${h}`.slice(-2) + ':' + `0${m}`.slice(-2) + ':' + `0${s}`.slice(-2) : `0${m}`.slice(-2) + ':' + `0${s}`.slice(-2);
        }
      }  
    }, 200);      
  },
  async updateFocusTimeDB(obj) {
    const date = new Date();
    const dateAsString = format(date, "ddMMyyyy"); // doc's name (id)  
    const dailyDocRef = doc(db, "users", this.userID, "goals", "progress", obj.category, dateAsString);    
    const docSnap = await getDoc(dailyDocRef);
    
    if (docSnap.exists()) {
      // Updates focusTime if doc already exists at stop count up
      await updateDoc(dailyDocRef, { addedFocusTime: increment(this.focusTime) });      
    } else { 
      // Creates new category doc in progress/goals collection when task is added
      await setDoc(dailyDocRef, {
        goal: 300000,
        addedFocusTime: 0,
        goalCompletion: 0,      
        year: getYear(date),
        month: getMonth(date),
        day: getDate(date)
        
      });
      // Adds new category key to categories progress doc field
      this.updateCategories(obj);
    }          
  },
  async updateCategories(obj) {            
    const progressDocRef = doc(db, "users", this.userID, "goals", "progress");
    const docSnap = await getDoc(progressDocRef);    
    if (docSnap.exists()) {            
      // Adds category string to arr in progress doc if it exists
      await updateDoc(progressDocRef, { "categories": arrayUnion(obj.category) });
    } else {
      // If progress doc doesn't exists
      await setDoc(progressDocRef, {
        categories: [ obj.category ]
      });            
    }          
  }
}
taskInstances.init();
export { taskInstances };
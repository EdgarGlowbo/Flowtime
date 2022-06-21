import { calendar } from './index.js';
import { initializeApp } from "firebase/app";
import { 
    getFirestore, collection,
    doc, getDoc, updateDoc,
    arrayRemove, setDoc, query,
    where, getDocs, deleteDoc
  } 
from "firebase/firestore";
import { getAuth, signInAnonymously } from "firebase/auth";
import { getYear, getMonth, getDate, format } from "date-fns"

const firebaseConfig = {
  apiKey: "AIzaSyCwUJfVaRIommAPOtOH1_1ki8v7PzjDKqE",
  authDomain: "flowtime-5eb6c.firebaseapp.com",
  projectId: "flowtime-5eb6c",
  storageBucket: "flowtime-5eb6c.appspot.com",
  messagingSenderId: "702197938017",
  appId: "1:702197938017:web:bf2b96491eb626599b7720"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();
const history = {
  i: 0,
  init() {
    this.createUserDoc();
    this.queryDOM();
    this.bindEvents();    
    
  },
  queryDOM() {
    this.categoryPanel = document.querySelector('.l-container__category-panel');
    this.categoryBtn = this.categoryPanel.querySelector('.c-switch-category__category');
    this.dailyGoalInput = this.categoryPanel.querySelector('.c-switch-category__input');
    this.daysOfMonth = calendar.daysContainer.getElementsByClassName('c-cal__day');
    this.daysPrevMonth = calendar.daysContainer.querySelectorAll('.c-prev-date');
    this.daysNextMonth = calendar.daysContainer.querySelectorAll('.c-next-date');    
  },
  bindEvents() {
    this.categoryPanel.addEventListener('click', function(e) {
      this.switchCategory(e);
      this.deleteCategory(e);      
    }.bind(this));
    calendar.calHeader.addEventListener('click', this.switchMonth.bind(this))
    this.dailyGoalInput.addEventListener('keyup', this.updateGoal.bind(this));
  },
  async retrieveCategoriesDB() {
    this.progressDocRef = doc(db, "users", this.userID, "goals", "progress");

    const docSnap = await getDoc(this.progressDocRef);
    if (docSnap.exists()) {
      // sets this.categories to the array of categories keys in db
      this.categories = docSnap.data().categories;      
    } else {
      setDoc(this.progressDocRef, { categories: [] });
      this.categories = [];
    }
    
    this.calcGoalCompletion(); // sets the current day status
    
  },
  createUserDoc() {
    signInAnonymously(auth)
      .then((data) => {
        // add userID prop and set uid from anon auth  
        this.userID = data.user.uid;        
        this.tasksColRef = collection(db, "users", this.userID, "tasks");          
        this.goalsColRef = collection(db, "users", this.userID, "goals"); 
        this.retrieveCategoriesDB();
        
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage);
      });    
  },
  switchCategory(e) {          
    if (e.target.classList.contains('c-switch-category__btn-right')) {      
      this.i++;
      if (this.i > this.categories.length - 1) { this.i = 0 }      
    } else if (e.target.classList.contains('c-switch-category__btn-left')) {      
      this.i--;
      if (this.i < 0) { this.i = this.categories.length - 1 }  
    }
    this.calcGoalCompletion();            
  },
  async showCategory(i = 0) {    
    if (typeof this.categories[i] !== 'undefined') {
      const chosenCategory = this.categories[i];
      const docSnap = await getDoc(this.dailyDocRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        const goal = data.goal;
        this.categoryBtn.textContent = chosenCategory;    
        this.dailyGoalInput.value = (goal / 60000); 
      }           
    } else {
      this.categoryBtn.textContent = 'No category';    
      this.dailyGoalInput.value = 0;       
    }    
  },
  async updateGoal() {    
    // updates goal field in daily doc on keyup event (multiplies by 60000 to ms)     
    await updateDoc(this.dailyDocRef, { "goal": (this.dailyGoalInput.value) * 60000 });
  },
  async deleteCategory(e) {    
    if (e.target.classList.contains('c-delete-category-btn')) {            
      const categoryKey = this.categories[this.i];      
      this.categories.splice(this.i, 1); // deletes element from categories array (display tag)                  
      // delete category string from categories array in DB
      await updateDoc(this.progressDocRef, { "categories": arrayRemove(categoryKey) });
      // delete category collection from db
      const q = query(this.catColRef);
      const querySnap = await getDocs(q);
      querySnap.forEach(async doc => {        
        await deleteDoc(doc.ref);
      });                
      this.calcGoalCompletion(); // displays first category or no category
    }
  },
  async calcGoalCompletion() { 
    if (typeof this.categories[this.i] !== 'undefined') {      
      const date = new Date();
      const dateAsString = format(date, "ddMMyyyy"); // doc's name (id)       
      this.dailyDocRef = doc(db, "users", this.userID, "goals", "progress", this.categories[this.i], dateAsString);  
      const docSnap = await getDoc(this.dailyDocRef);
      // goalCompletion is calculated and updated to DB
      if (docSnap.exists()) {
        const data = docSnap.data();
        const goal = data.goal;
        const focusTime = data.addedFocusTime;
        const goalCompletion = focusTime / goal;
        await updateDoc(this.dailyDocRef, { "goalCompletion": goalCompletion });
      } else {
        // Creates new category doc in progress/goals collection
        await setDoc(this.dailyDocRef, {
          goal: 300000,
          addedFocusTime: 0,
          goalCompletion: 0,        
          year: getYear(date),
          month: getMonth(date),
          day: getDate(date)          
        });
              
      }      
      this.setDayStatus();           
    } 
    this.showCategory(this.i); // updates category btn to show first category    
  },
  async setDayStatus() {
    if (typeof this.categories[this.i] !== 'undefined') {
      let prevMonthLength = this.daysPrevMonth.length; // To even the nodeList indexes with the days in DB
      this.catColRef = collection(db, "users", this.userID, "goals", "progress", this.categories[this.i]);    
      const month = calendar.displayedMonth;
      const year = calendar.displayedYear;    
      const q = query(this.catColRef, where("month", "==", month), where("year", "==", year));
      const querySnapshot = await getDocs(q);    
      querySnapshot.forEach((doc) => {
        // -1 because is 0 based + index to ignore the prevDays
        const data = doc.data();
        const index = (data.day - 1) + prevMonthLength;
        const goalStat = data.goalCompletion;      
        if (goalStat >= 1) {        
          this.daysOfMonth[index].classList.value = 'c-cal__day c-cal__day--one';        
        } else if (goalStat >= (5/6)) {        
          this.daysOfMonth[index].classList.value = 'c-cal__day c-cal__day--two';        
        } else if (goalStat >= (4/6)) {        
          this.daysOfMonth[index].classList.value = 'c-cal__day c-cal__day--three';                         
        } else if (goalStat >= (3/6)) {        
          this.daysOfMonth[index].classList.value = 'c-cal__day c-cal__day--four';                
        } else if (goalStat >= (2/6)) {        
          this.daysOfMonth[index].classList.value = 'c-cal__day c-cal__day--five';      
        } else if (goalStat >= (1/6)) {        
          this.daysOfMonth[index].classList.value = 'c-cal__day c-cal__day--six';         
        } else {        
          this.daysOfMonth[index].classList.value = 'c-cal__day c-cal__day--six';        
        }            
      });   
    }               
  },
  switchMonth(e) {
    const elementClasses = e.target.classList;
    if (elementClasses.contains('c-cal__arrow-right') || elementClasses.contains('c-icon__arrow-right')) {  
      const nextMonth = calendar.date.setMonth(calendar.date.getMonth() + 1);            
      calendar.displayedMonth = getMonth(nextMonth);
      calendar.displayedYear = getYear(nextMonth);       
      calendar.renderCal();
      this.setDayStatus();
    } else if (elementClasses.contains('c-cal__arrow-left') || elementClasses.contains('c-icon__arrow-left')) {
      const prevMonth = calendar.date.setMonth(calendar.date.getMonth() - 1);          
      calendar.displayedMonth = getMonth(prevMonth);
      calendar.displayedYear = getYear(prevMonth);      
      calendar.renderCal();
      this.setDayStatus();
    }
  }
}

history.init();
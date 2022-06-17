import { calendar } from './index.js';
import { initializeApp } from "firebase/app";
import { 
    getFirestore, collection,
    doc, getDoc, updateDoc,
    arrayRemove
  } 
from "firebase/firestore";
import { getAuth, signInAnonymously } from "firebase/auth";
import { getYear, getMonth, getDate } from "date-fns"

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
    this.daysOfMonth = calendar.daysContainer.querySelectorAll('.c-cal__day'); // console log it to make sure is nodeList
  },
  bindEvents() {
    this.categoryPanel.addEventListener('click', function(e) {
      this.switchCategory(e);
      this.deleteCategory(e);
    }.bind(this));
    this.dailyGoalInput.addEventListener('keyup', this.updateGoal.bind(this));
  },
  async retrieveCategoriesDB() {
    this.progressDocRef = doc(db, "users", this.userID, "goals", "progress");
    const docSnap = await getDoc(this.progressDocRef);
    if (docSnap.exists()) {
      // sets this.categories to the array of categories keys in db
      this.categories = docSnap.data().categories;      
    } else {
      console.log("No such document");
    }
    
    this.calcGoalCompletion(); // sets the current day status
    this.showCategory(); // updates category btn to show first category
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
    this.showCategory(this.i);         
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
      const progressDocRef = doc(db, "users", this.userID, "goals", "progress");
      const catColRef = collection(db, "users", this.userID, "goals", "progress", this.categories[this.i]);
      const categoryKey = this.categories[this.i];      
      this.categories.splice(this.i, 1); // deletes element from categories array (display tag)                  
      // delete category string from categories array in DB
      await updateDoc(progressDocRef, { "categories": arrayRemove(categoryKey) });
      // delete category collection from db
     
      this.showCategory(); // displays first category or no category
    }
  },
  async calcGoalCompletion() { 
    if (typeof this.categories[this.i] !== 'undefined') {      
      const date = new Date();
      const dateAsString = date.getDate().toString();  // doc name is today's date (1, 2... 15, 31)
      this.dailyDocRef = doc(db, "users", this.userID, "goals", "progress", this.categories[this.i], dateAsString);  
      const docSnap = await getDoc(this.dailyDocRef);
      // goalCompletion is calculated and updated to DB
      if (docSnap.exists()) {
        const data = docSnap.data();
        const goal = data.goal;
        const focusTime = data.addedFocusTime;
        const goalCompletion = focusTime / goal;
        await updateDoc(this.dailyDocRef, { "goalCompletion": goalCompletion });
      }                      
      // this.setDayStatus(currCategory);           
    }    
  },
  dayStatusFromDB() {

    
  },
  setDayStatus(currCategory) {    
    const goalStat = currCategory.goalCompletion;
    console.log(this.daysOfMonth);
    let index = 0;
    
    // If month visited is before the startDate.month then index is 0 and the processing stops at the end of the month
    // Only sets index different to 0 if startDate month is equal to displayedMonth.
    
    
    if (goalStat >= 1) {
      this.daysOfMonth[0].classList.add('.c-cal__day--one '); // Unsure of index
    } else if (goalStat >= (5/6)) {

    } else if (goalStat >= (4/6)) {

    } else if (goalStat >= (3/6)) {

    } else if (goalStat >= (2/6)) {

    } else if (goalStat >= (1/6)) {

    } else {

    }
  }
}

history.init();
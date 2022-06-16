import { calendar } from './index.js';
import { initializeApp } from "firebase/app";
import { 
    getFirestore, collection,
    doc, getDoc, updateDoc,
    deleteField, setDoc
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
    this.catObjRef = doc(db, "users", this.userID, "goals", "categoriesObj");
    const docSnap = await getDoc(this.catObjRef);
    if (docSnap.exists()) {
      this.categoriesObj = JSON.parse(JSON.stringify(docSnap.data()));
    } else {      
      console.log("No such document!");
    }
    this.categories = Object.keys(this.categoriesObj);
    this.showCategory(); // updates category btn to show first category
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
    this.showCategory(this.i);         
  },
  showCategory(i = 0) {
    
    if (typeof this.categories[i] !== 'undefined') {
      const chosenCategory = this.categories[i];
      const goal = this.categoriesObj[chosenCategory].goal;
      this.categoryBtn.textContent = chosenCategory;    
      this.dailyGoalInput.value = (goal / 60000); 
    } else {
      this.categoryBtn.textContent = 'No category';    
      this.dailyGoalInput.value = 0;       
    }    
  },
  async updateGoal() {
    const catKey = this.categories[this.i];
    const currCategory = this.categoriesObj[catKey]; // Access to current category (key) displayed from categoriesObj
    currCategory.goal = (this.dailyGoalInput.value) * 60000;
    const catGoalDot = catKey + ".goal";  // String to access nested goal field in catKey                             
    updateDoc(this.catObjRef, { [catGoalDot]: currCategory.goal });  // Square brackets so its value (string) is used, not the var name itself    
  },
  deleteCategory(e) {
    if (e.target.classList.contains('c-delete-category-btn')) {
      const categoryKey = this.categories[this.i];      
      this.categories.splice(this.i, 1); // deletes element from categories array (display tag)      
      delete this.categoriesObj[categoryKey]; // deletes property from categoriesObj ()
      const docRef = doc(db, "users", this.userID, "goals", "categoriesObj");
      updateDoc(docRef, {
        [categoryKey]: deleteField() // deletes from db
      })
      this.showCategory(); // displays first category or no category
    }
  },
  async calcGoalCompletion() { 
    if (typeof this.categories[this.i] !== 'undefined') {
      const currCategory = this.categoriesObj[this.categories[this.i]]; // Access to current category (key) displayed from categoriesObj 
  
      const goal = currCategory.goal;
      const focusTime = currCategory.addedFocusTime;
      currCategory.goalCompletion = focusTime / goal;
      const date = new Date();
      const dateAsString = date.getDate().toString();            
      
      const docRef = doc(db, "users", this.userID, "goals", "progress", this.categories[this.i], dateAsString);
      console.log(docRef);
      // doc name is today's date (1, 2... 15, 31)
      await setDoc(docRef, {
        goal: goal,
        addedFocusTime: focusTime,
        goalCompletion: currCategory.goalCompletion,
        date: date
      });
                  
      this.setDayStatus(currCategory);           
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
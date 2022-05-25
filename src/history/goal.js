import { calendar } from './index.js';
import { initializeApp } from "firebase/app";
import { 
    getFirestore, collection,
    doc, getDoc, updateDoc,
    deleteField
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
    const chosenCategory = this.categories[i];     
    const goal = this.categoriesObj[chosenCategory].goal;
    this.categoryBtn.textContent = chosenCategory;    
    this.dailyGoalInput.value = (goal / 60000); 
  },
  updateGoal() {
    const currCategory = this.categoriesObj[this.categories[this.i]]; // Access to current category (key) displayed from categoriesObj
    currCategory.goal = (this.dailyGoalInput.value) * 60000;
    updateDoc(this.catObjRef, { [this.categories[this.i]]: { goal: currCategory.goal }})     
  },
  async deleteCategory(e) {
    if (e.target.classList.contains('c-delete-category-btn')) {
      const categoryKey = this.categories[this.i];      
      this.categories.splice(this.i);
      delete this.categoriesObj[categoryKey];
      const docRef = doc(db, "users", this.userID, "goals", "categoriesObj");
      await updateDoc(docRef, {
        [categoryKey]: deleteField()
      })
    }
  }
}

history.init();
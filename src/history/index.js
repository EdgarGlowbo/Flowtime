import "../styles/style.scss";
import 
{ 
  format, getDay, getMonth,
  getYear, collection
} from 'date-fns';


const calendar = {
  monthsArr: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ],
  date: new Date(),  
  init() {
    this.queryDOM();
    this.bindEvents();
    this.renderCal();    
  },  
  queryDOM() {
    this.calContainer = document.querySelector('.m-cal');
    this.calHeader = this.calContainer.querySelector('.o-cal__header');
    this.currDate = this.calHeader.querySelector('.c-current-date');
    this.monthHeader = this.calHeader.querySelector('.c-month');
    this.daysContainer = this.calContainer.querySelector('.o-cal__days');
    this.daysOfMonth = this.daysContainer.getElementsByClassName('c-cal__day');
    this.daysPrevMonth = this.daysContainer.querySelectorAll('.c-prev-date');
    this.daysNextMonth = this.daysContainer.querySelectorAll('.c-next-date');
  },
  bindEvents() {
    this.calContainer.addEventListener('click', this.switchMonth.bind(this));
  },
  displayMonth() {
    const year = this.date.getFullYear();
    const monthIndex = this.date.getMonth();
    this.monthHeader.textContent = this.monthsArr[monthIndex] + " " + year;
    this.displayedMonth = monthIndex; // date of the current month
    this.displayedYear = year; // date of the current year
  },
  displayCurrentDate () {
    const todayDate = new Date();
    const fullDate = format(todayDate, 'PPPP');
    this.currDate.textContent = fullDate;
  },
  displayMonthDays() {
    let monthDays = "";
    const firstDayDate = new Date (
      this.date.getFullYear(),
      this.date.getMonth(),
      1
    );        
    const lastDayDate = new Date (
      this.date.getFullYear(), 
      this.date.getMonth() + 1, 
      0
    );
    // Gets weekday index of the 1st of current month (e.g. fri = 5)
    const firstWeekDayIndex = getDay(firstDayDate);
    // last of current month weekday index
    const lastWeekDayIndex = getDay(lastDayDate);
    // lastDay is an integer. No. of days in the current month
    const lastDay = lastDayDate.getDate();
    const previousMonthLastDay = new Date (
      this.date.getFullYear(), 
      this.date.getMonth(), 
      0
    ).getDate();    
    // Adds previous days of previous month if weekDayIndex from the 1st isn't 0 (or sunday)
    for (let i = previousMonthLastDay - firstWeekDayIndex; i < previousMonthLastDay; i++) {
      monthDays += `<div class="c-prev-date c-cal__day">${i + 1}</div>`;
    }
    
    // Displays days of the month from 1 to lastDay
    for (let i = 0; i < lastDay; i++) {
      monthDays += `<div class="c-cal__day">${i + 1}</div>`;      
    }

    // Adds next days if lastWeekDayIndex < 6 (or saturday)
    let j = 1;
    for (let i = lastWeekDayIndex; i < 6; i++) {      
      monthDays += `<div class="c-next-date c-cal__day">${j}</div>`;
      j++;
    }
    this.daysContainer.innerHTML = monthDays;        
  },
  renderCal() {  
    this.displayMonth();
    this.displayCurrentDate();
    this.displayMonthDays();
  },
  switchMonth(e) {
    const elementClasses = e.target.classList;
    if (elementClasses.contains('c-cal__arrow-right') || elementClasses.contains('c-icon__arrow-right')) {  
      const nextMonth = this.date.setMonth(this.date.getMonth() + 1);       
      this.displayedMonth = getMonth(nextMonth);
      this.displayedYear = getYear(nextMonth);       
      this.renderCal();
    } else if (elementClasses.contains('c-cal__arrow-left') || elementClasses.contains('c-icon__arrow-left')) {
      const prevMonth = this.date.setMonth(this.date.getMonth() - 1);      
      this.displayedMonth = getMonth(prevMonth);
      this.displayedYear = getYear(prevMonth);      
      this.renderCal();
    }
  },
  async setDayStatus() {            
    let prevMonthLength = this.daysPrevMonth.length; // To even the nodeList indexes with the days in DB
    this.catColRef = collection(db, "users", this.userID, "goals", "progress", this.categories[this.i]);    
    const month = this.displayedMonth;
    const year = this.displayedYear;    
    const q = query(this.catColRef, where("month", "==", month), where("year", "==", year));
    const querySnapshot = await getDocs(q);    
    querySnapshot.forEach((doc) => {
      // -1 because is 0 based + index to ignore the prevDays
      const data = doc.data();
      const index = (data.day - 1) + prevMonthLength;
      const goalStat = data.goalCompletion;
      
      if (goalStat >= 1) {
        this.daysOfMonth[index].classList.add('c-cal__day--one'); 
      } else if (goalStat >= (5/6)) {
        this.daysOfMonth[index].classList.add('c-cal__day--two'); 
      } else if (goalStat >= (4/6)) {
        this.daysOfMonth[index].classList.add('c-cal__day--three'); 
      } else if (goalStat >= (3/6)) {
        this.daysOfMonth[index].classList.add('c-cal__day--four'); 
      } else if (goalStat >= (2/6)) {
        this.daysOfMonth[index].classList.add('c-cal__day--five'); 
      } else if (goalStat >= (1/6)) {
        this.daysOfMonth[index].classList.add('c-cal__day--six'); 
      } else {
        this.daysOfMonth[index].classList.add('c-cal__day--six');      
      }
      
    });    
  }
}

calendar.init();

export { calendar }
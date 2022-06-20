import "../styles/style.scss";
import 
{ 
  format, getDay, getMonth,
  getYear
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
    this.renderCal();    
  },  
  queryDOM() {
    this.calContainer = document.querySelector('.m-cal');
    this.calHeader = this.calContainer.querySelector('.o-cal__header');
    this.currDate = this.calHeader.querySelector('.c-current-date');
    this.monthHeader = this.calHeader.querySelector('.c-month');
    this.daysContainer = this.calContainer.querySelector('.o-cal__days');  
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
  }    
}

calendar.init();

export { calendar }
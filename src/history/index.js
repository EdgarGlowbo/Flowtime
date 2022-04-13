import "../styles/style.scss"
import { format, getDay } from 'date-fns'

// queries
const calHeader = document.querySelector('.o-cal__header');
const monthHeader = document.querySelector('.c-month');
const currentDateHeader = document.querySelector('.c-current-date');
const daysContainer = document.querySelector('.o-cal__days');


class Calendar {
  constructor(date) {
    this.date = date;
  }
  monthsArr = [
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
  ];
  monthDays = "";
   

  displayMonth() {
    const year = this.date.getFullYear();
    const monthIndex = this.date.getMonth();
    monthHeader.textContent = this.monthsArr[monthIndex] + " " + year;    
  }
  displayCurrentDate () {
    const todayDate = new Date();
    const fullDate = format(todayDate, 'PPPP');
    currentDateHeader.textContent = fullDate;    
  }
  displayMonthDays() {
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
      this.monthDays += `<div class="c-prev-date c-cal__day">${i + 1}</div>`;
    }
    
    // Displays days of the month from 1 to lastDay
    for (let i = 0; i < lastDay; i++) {
      this.monthDays += `<div class="c-cal__day">${i + 1}</div>`;      
    }

    // Adds next days if lastWeekDayIndex < 6 (or saturday)
    let j = 1;
    for (let i = lastWeekDayIndex; i < 6; i++) {      
      this.monthDays += `<div class="c-next-date c-cal__day">${j}</div>`;
      j++;
    }

    daysContainer.innerHTML = this.monthDays;        
  }
}
const date = new Date();
calHeader.addEventListener('click', e => {  
  const targetClasses = e.target.classList;
  
  if (targetClasses.contains('c-cal__arrow-right') || targetClasses.contains('c-icon__arrow-right')) {  
    date.setMonth(date.getMonth() + 1);       
    renderCal();
  } else if (targetClasses.contains('c-cal__arrow-left') || targetClasses.contains('c-icon__arrow-left')) {
    date.setMonth(date.getMonth() - 1);      
    renderCal();
  }   
});

// Runs at start
const renderCal = () => {  
  const calendar = new Calendar(date);
  calendar.displayMonth();
  calendar.displayCurrentDate();
  calendar.displayMonthDays();
}
renderCal();
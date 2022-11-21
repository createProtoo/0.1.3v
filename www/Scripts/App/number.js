var pages = document.querySelector('.pages');

var locale = window.navigator.language || 'zh_ch';

var dayNum="0";//月份
var monthName="今日订单";

var iii=0;
setInterval(function () {
$('.pages').empty();
iii++;
getNewDate(iii);
renderPage();

},2000);


function getNewDate(howNum) {
    
    
    dayNum = howNum;
    monthName = "今日订单";
}

function handleClick(e) {
  getNewDate();
  updateCalendar(e.target);
}


function updateCalendar(target) {
    if (target && target.classList.contains('page')) {
        target.classList.add('tear');
        setTimeout(function () {
            pages.removeChild(target);
        }, 800);
    } else {
        return;
    }
    renderPage();
}

function renderPage() {
    var newPage = document.createElement('div');
    newPage.classList.add('page');
    newPage.innerHTML =  '\n    <p class="month">' +
  monthName + '</p>\n    <p class="day">' +
  dayNum + '</p>\n     ';

    pages.appendChild(newPage);
}

renderPage();

pages.addEventListener('click', handleClick);
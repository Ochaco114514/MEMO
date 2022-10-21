let today = new Date();
let year = today.getFullYear();//获得年份
let month = today.getMonth() + 1;//获得月份，getMonth是从0-11的
let day = today.getDate();//获得当前日
let days = 0;
//先判断每个月应该有的天数
function count() {
    if (month != 2) {
        if ((month == 4) || (month == 6) || (month == 9) || (month == 11)) {
            days = 30;
        } else {
            days = 31;
        }
    } else {
        if ((year % 4) == 0 && (year % 100) != 0 || year % 400 == 0) {
            days = 29;
        } else {
            days = 28;
        }
    }
}
// ----------- 输出当前日期 ----------- 
function showMonth() {
    let year_month = year + "年" + month + "月" + day + "日";
    document.getElementById("dqrq").innerHTML = year_month;
    // document.getElementById("dqrq").style.fontWeight = bold;
}

//  ----------- 输出日历  ----------- 
function showDate() {
    showMonth();
    count();
    let firstdate = new Date(year, month - 1, 1); // 获取对应year、month的第一天
    // console.log(firstdate); //调试
    let xq = firstdate.getDay();  //获取对应的星期
    // console.log(xq); //调试
    let daterow = document.getElementById("day");
    daterow.innerHTML = "";
    if (xq != 0) {
        for (let i = 0; i < xq; i++) {
            let dayElement = document.createElement("div");
            dayElement.className = "everyday";
            daterow.appendChild(dayElement);
        }
    }
    for (let j = 1; j <= days; j++) {
        let dayElement = document.createElement("div");
        dayElement.className = "everyday";
        dayElement.innerHTML = j + "";
        if (j == day) {
            dayElement.style.color = "red";
        }
        dayElement.style.cursor = 'pointer';
        daterow.appendChild(dayElement);
        //  ----------- 为每个日期添加点击事件  ----------- 
        let newPage;
        // localStorage.clear();
        dayElement.onclick = function () {
            // 向服务器发送点击的日期
            // $.ajax({
            //     url: "http://192.168.191.26:5000/todo/tasks/getlist" + "/year=" + year.toString() + "/month=" + month.toString() + "/day=" + j.toString(),
            //     type: "GET",
            //     dataType: "json",
            //     contentType: "application/json",
            //     data: JSON.stringify({
            //         "year": year,
            //         "month": month,
            //         "day": j,
            //     }),
            //     success: function (resp) {
            //         console.log("get successfully");
            //         console.log(resp);
            //     },
            // });

            // $.ajax({
            //     url: "http://192.168.191.26:5000/todo/tasks/add",
            //     type: "POST",
            //     dataType: "json",
            //     contentType: "application/json", // 要写
            //     data: JSON.stringify({
            //         "year": year,
            //         "month": month,
            //         "day": j,
            //         "title": "test_post",
            //     }),
            //     success: function (resp) {
            //         console.log("post successfully");
            //         console.log(resp);
            //     },
            // });

            localStorage.setItem("year", year);
            localStorage.setItem("month", month);
            localStorage.setItem("day", j);
            newPage = window.open('create_blank.html');
        }
    }
}
// ----------- 上个月 ----------- 
function lastMonth() {
    if (month > 1) {
        month = month - 1;
    } else {
        month = 12;
        year = year - 1;
    }
    showDate();
}
// ----------- 下个月 ----------- 
function nextMonth() {
    if (month < 12) {
        month = month + 1;
    } else {
        month = 1;
        year = year + 1;
    }
    showDate();
}
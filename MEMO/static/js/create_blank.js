// ---------- 保持小时、分钟、秒为两位数 ----------
function addzero(m) {
    return m < 10 ? '0' + m : m;
}

function getTime() {
    let time = new Date();
    let hour = time.getHours();
    let minute = time.getMinutes();
    let second = time.getSeconds();
    return addzero(hour) + ":" + addzero(minute) + ":" + addzero(second);
}


// ---------- 显示时间 ----------
let showdate = document.getElementById('date');
let year = localStorage.getItem("year");
let month = localStorage.getItem("month");
let day = localStorage.getItem("day");
// console.log(`${year}`);
// console.log(`${month}`);
// console.log(`${day}`);

setInterval(function () {
    let res = year + "-" + addzero(month) + "-" + addzero(day);
    showdate.innerHTML = `${res}`;
}, 100)


// ---------- 日期判断 ----------
function judge(year, month, day) { //页面日期小于当前日期，返回0；否则返回1
    let time = new Date();
    // console.log(`${year}`);
    // console.log(`${month}`);
    // console.log(`${day}`);
    // console.log(`${time.getFullYear()}`);
    // console.log(`${time.getMonth() + 1}`);
    // console.log(`${time.getDate()}`);
    if (year < time.getFullYear()) return 0;
    if (year == time.getFullYear() && month < (time.getMonth() + 1)) return 0;
    if (year == time.getFullYear() && month == (time.getMonth() + 1) && day < time.getDate()) return 0;

    return 1;
};

//如果页面日期小于当前日期，则不显示创建按钮及输入框
// console.log(`${judge(year, month, day)}`);
if (judge(year, month, day) === 0) {
    let create_input = document.querySelector('.create input');
    let create_button = document.querySelector('.create button');
    create_input.style.display = "none";
    create_button.style.display = "none";
}




// ---------- 实现创建新任务功能 ----------
// 1. 获取按钮
let addTaskButton = document.querySelector('.create button');
// 2. 给按钮注册一个点击事件
addTaskButton.onclick = function () {
    // 3. 获取输入框的内容
    let input = document.querySelector('.create input');
    let taskContent = input.value;
    if (taskContent == '') {
        console.log("任务内容为空，请输入新任务内容");
        return;
    }

    // 4. 为输入的任务创建对应的元素
    let task = document.createElement('div');
    task.className = 'newtask';
    task.style.backgroundColor = 'rgba(230, 230, 230, 0.8)';
    let tag = document.createElement('div');
    tag.className = 'tag';
    let check = document.createElement('input');
    check.type = 'checkbox';
    let content = document.createElement('span');
    content.innerHTML = taskContent;
    content.className = 'taskName';
    // 为内容添加点击事件
    content.style.cursor = 'pointer';
    content.onclick = function () {
        let taskDetail = document.createElement('a');
        taskDetail.href = "javascript:void(0)";
        taskDetail.onclick = displayWindow();
    }

    let deleteButton = document.createElement('button');
    let trashIcon = document.createElement('img');
    trashIcon.className = 'trashIcon';
    trashIcon.src = "/static/images/trash_icon1.png";
    deleteButton.appendChild(trashIcon);
    // deleteButton.innerHTML = 'delete';
    let date = document.createElement('span');
    date.className = 'taskDate';
    date.style.color = 'red';
    date.innerHTML = `${getTime()}`; //任务创建时间

    // 5. 把这些元素挂到DOM树上
    task.appendChild(tag);
    task.appendChild(check);
    task.appendChild(content);
    task.appendChild(date);
    task.appendChild(deleteButton);
    let todo = document.querySelector('.todo');
    todo.appendChild(task);

    // 6. 清空输入框
    input.value = '';


    // ---------- 创建任务，给服务器发送记录 ----------
    $.ajax({
        url: "http://192.168.191.26:5000/todo/tasks/add",
        type: "POST",
        dataType: "json",
        contentType: "application/json", // 要写
        data: JSON.stringify({
            "year": parseInt(year),
            "month": parseInt(month),
            "day": parseInt(day),
            "title": taskContent,
            "create": `${getTime()}`,
        }),
        success: function (resp) {
            console.log("add successfully");
            console.log(resp);
            window.location.reload(); //创建成功，刷新页面，获取id
        },
    });



    // ---------- 实现已完成功能，给check添加一个点击事件 ----------
    check.onclick = function () {
        // 操作task对象，根据check的状态决定放到todo还是done里
        if (check.checked) {
            // 选中，task放到done里
            date.style.color = 'yellowgreen';
            tag.style.backgroundColor = 'yellowgreen';
            date.innerHTML = `${getTime()}`;
            let target = document.querySelector('.done');
            target.appendChild(task);
        } else {
            // 未选中，task放到todo里
            date.style.color = 'red';
            tag.style.backgroundColor = 'red';
            date.innerHTML = `${getTime()}`;
            let target = document.querySelector('.todo');
            target.appendChild(task);
        }
    }

    // ---------- 实现删除功能，给删除按钮添加一个点击事件 ----------
    deleteButton.onclick = function () {
        // 要删除的是task这个元素，它可能在todo里，也可能在done里
        // 直接通过parentNode属性获得其父元素
        let parent = task.parentNode;
        parent.removeChild(task);
    }
}




// ----------- 从服务器获取记录并加载到页面 ------------

$(function () {
    $.ajax({
        url: "http://192.168.191.26:5000/todo/tasks/getlist" + "/year=" + year.toString() + "/month=" + month.toString() + "/day=" + day.toString(),
        type: "GET",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify({
            "year": year,
            "month": month,
            "day": day,
        }),
        success: function (resp) {
            //测试开始
            console.log("get successfully");
            console.log(resp);
            // console.log(resp.data);
            // console.log(resp.data[0]);
            // console.log(resp.data[0].title);
            // console.log(resp.data.title);  // 上面的正常输出，但这个是undefined

            // console.log(resp.data.length);
            // console.log(`${resp.data[0].year}`);
            // console.log(`${addzero(resp.data[0].month)}`);
            // console.log(resp.data[0].start[0] + resp.data[0].start[1]);
            // console.log(resp.data[0].finish);
            //测试结束


            // ---------- 将收到的数据渲染到页面上 ----------

            for (let k = 0; k < resp.data.length; k++) {

                if (resp.data[k].title === "") {  //如果记录没有标题，忽略
                    continue;
                }

                // 为记录中的任务创建对应的元素
                let task_record = document.createElement('div');
                task_record.className = 'newtask';
                task_record.style.backgroundColor = 'rgba(230, 230, 230, 0.8)';
                let tag_record = document.createElement('div');
                tag_record.className = 'tag';
                let check_record = document.createElement('input');
                check_record.type = 'checkbox';
                check_record.id = resp.data[k].id; //将记录的id同时赋给勾选按钮
                let content_record = document.createElement('span');
                content_record.innerHTML = resp.data[k].title;  //第k个任务title
                content_record.className = 'taskName';
                // 为内容添加点击事件 —— 悬浮窗口
                content_record.style.cursor = 'pointer';
                content_record.onclick = function () {
                    let taskDetail = document.createElement('a');
                    taskDetail.href = "javascript:void(0)";
                    taskDetail.onclick = displayWindow();
                    //将内容加载到悬浮窗口
                    //id: 存在，但不显示
                    let floatingWindow_index = document.querySelector('.index');
                    floatingWindow_index.innerHTML = resp.data[k].id;
                    //标题
                    let floatingWindow_input_record = document.querySelector('.task_name input');
                    floatingWindow_input_record.value = resp.data[k].title;
                    //内容：通过js修改textarea的value来实现
                    document.getElementById("task_content").value = resp.data[k].content;
                    //开始时间
                    let floatingWindow_start_record = document.querySelector('.start input');
                    let floatingWindow_start_hour_record = resp.data[k].start[0] + resp.data[k].start[1];
                    let floatingWindow_start_minute_record = resp.data[k].start[3] + resp.data[k].start[4];
                    let floatingWindow_start_year_record = resp.data[k].start_date[0] + resp.data[k].start_date[1] + resp.data[k].start_date[2] + resp.data[k].start_date[3];
                    let floatingWindow_start_month_record = resp.data[k].start_date[5] + resp.data[k].start_date[6];
                    let floatingWindow_start_day_record = resp.data[k].start_date[8] + resp.data[k].start_date[9];
                    floatingWindow_start_record.value = floatingWindow_start_year_record + "-" + floatingWindow_start_month_record + "-" + floatingWindow_start_day_record + "T" + floatingWindow_start_hour_record + ":" + floatingWindow_start_minute_record;
                    //结束时间
                    let floatingWindow_finish_hour_record = resp.data[k].finish[0] + resp.data[k].finish[1];
                    let floatingWindow_finish_minute_record = resp.data[k].finish[3] + resp.data[k].finish[4];
                    let floatingWindow_finish_record = document.querySelector('.finish input');
                    let floatingWindow_finish_year_record = resp.data[k].finish_date[0] + resp.data[k].finish_date[1] + resp.data[k].finish_date[2] + resp.data[k].finish_date[3];
                    let floatingWindow_finish_month_record = resp.data[k].finish_date[5] + resp.data[k].finish_date[6];
                    let floatingWindow_finish_day_record = resp.data[k].finish_date[8] + resp.data[k].finish_date[9];
                    floatingWindow_finish_record.value = floatingWindow_finish_year_record + "-" + floatingWindow_finish_month_record + "-" + floatingWindow_finish_day_record + "T" + floatingWindow_finish_hour_record + ":" + floatingWindow_finish_minute_record;
                }

                let deleteButton_record = document.createElement('button');
                deleteButton_record.id = resp.data[k].id;
                let trashIcon_record = document.createElement('img');
                trashIcon_record.className = 'trashIcon';
                trashIcon_record.src = "/static/images/trash_icon1.png";
                deleteButton_record.appendChild(trashIcon_record);
                let date_record = document.createElement('span');
                date_record.className = 'taskDate';
                date_record.style.color = 'red';
                date_record.innerHTML = `${resp.data[k].create} `;  //第k个任务的创建时间

                // 把这些元素挂到DOM树上
                task_record.appendChild(tag_record);
                task_record.appendChild(check_record);
                task_record.appendChild(content_record);
                task_record.appendChild(date_record);
                // task_record.appendChild(index_record);
                task_record.appendChild(deleteButton_record);
                if (resp.data[k].done) {  // 任务完成
                    let state_record = document.querySelector('.done');
                    //修改已完成任务记录显示的颜色及状态
                    date_record.style.color = 'yellowgreen';
                    tag_record.style.backgroundColor = 'yellowgreen';
                    check_record.checked = true;
                    state_record.appendChild(task_record);
                } else {  // 任务未完成
                    let state_record = document.querySelector('.todo');
                    state_record.appendChild(task_record);
                }

                // ---------- 实现修改是否完成功能，给check_record添加一个点击事件 ----------
                check_record.onclick = function () {
                    // 操作task对象，根据check的状态决定放到todo还是done里
                    if (check_record.checked) {
                        // 选中，task放到done里
                        date_record.style.color = 'yellowgreen';
                        tag_record.style.backgroundColor = 'yellowgreen';
                        date_record.innerHTML = `${getTime()} `;
                        let target_record = document.querySelector('.done');
                        target_record.appendChild(task_record);
                    } else {
                        // 未选中，task放到todo里
                        date_record.style.color = 'red';
                        tag_record.style.backgroundColor = 'red';
                        date_record.innerHTML = `${getTime()} `;
                        let target_record = document.querySelector('.todo');
                        target_record.appendChild(task_record);
                    }
                    //通知服务器修改done
                    let id = parseInt(check_record.id);
                    console.log(`${id}`);
                    $.ajax({
                        url: "http://192.168.191.26:5000/todo/tasks/update",
                        type: "POST",
                        dataType: "json",
                        contentType: "application/json", // 要写
                        data: JSON.stringify({
                            "id": id,
                            "done": check_record.checked,
                        }),
                        success: function (resp) {
                            console.log("check successfully");
                            console.log(resp);
                        },
                    });
                }

                // ---------- 实现记录删除功能，给删除按钮添加一个点击事件 ----------
                deleteButton_record.onclick = function () {
                    let id = parseInt(deleteButton_record.id);
                    // ---------- 删除记录，向服务器发送 ----------
                    $.ajax({
                        url: "http://192.168.191.26:5000/todo/tasks/delete" + "/id=" + id.toString(),
                        type: "GET",
                        dataType: "json",
                        contentType: "application/json",
                        data: JSON.stringify({
                            "id": id,
                        }),
                        success: function (resp) {
                            console.log("delete successfully");
                            console.log(resp);
                            // 要删除的是task这个元素，它可能在todo里，也可能在done里
                            // 直接通过parentNode属性获得其父元素
                            let parent_record = task_record.parentNode;
                            parent_record.removeChild(task_record);
                        },
                    });

                }


                // ---------- 悬浮窗口中update按钮的点击事件 ----------
                let updateTaskButton = document.querySelector('.update_task');
                updateTaskButton.onclick = function () {
                    let update_title = document.querySelector('.task_name input').value;
                    let update_content = document.querySelector('.task_content').value;
                    let update_start = document.querySelector('.start input').value;
                    let update_finish = document.querySelector('.finish input').value;
                    // let update_done = check_record.checked;
                    let id = parseInt(document.querySelector('.index').innerHTML);
                    console.log("调试信息：");
                    console.log(`title: ${update_title}`);
                    console.log(`content: ${update_content}`);
                    console.log(`start: ${update_start}`);
                    console.log(`finish: ${update_finish}`);
                    console.log(`id: ${id}`);
                    console.log("------------");
                    $.ajax({
                        url: "http://192.168.191.26:5000/todo/tasks/update",
                        type: "POST",
                        dataType: "json",
                        contentType: "application/json", // 要写
                        data: JSON.stringify({
                            "year": parseInt(year),
                            "month": parseInt(month),
                            "day": parseInt(day),
                            "id": id,
                            "title": update_title,
                            "content": update_content,
                            "start": update_start,
                            "finish": update_finish,
                        }),
                        success: function (resp) {
                            console.log("update successfully");
                            console.log(resp);
                            //修改完成后刷新页面
                            window.location.reload();
                        },
                    });
                }
            }
        },
    });
})

// ---------------------------------------------------

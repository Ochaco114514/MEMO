# MEMO——备忘录网站

<figure>
    <div style="text-align:center">
    <img src="README.assets\aaa72645ad34598287fae14f49f431adcaef8472.jpg" width=50%>
    </div>
</figure>



> 希望东半球最强法务部不要找我麻烦，我只是做个作业而已啊

前端用三件套实现，后端用flask实现。

和大多数备忘录app一样，支持在某天进行备忘录的增删改查，包括：

* 点击日历上某天跳转到该日的备忘录页面
* 输入标题点击create创建一条信息
* 点击某条信息书写或更改具体内容（标题、内容、开始时间、结束时间）
* 点击某条信息前的勾选框更改完成状态（已完成/未完成）
* 点击某条消息后的垃圾桶图标删除该信息

由于后端同学较懒，外加确实用不到登录注册，就不写数据库了，服务器一关数据全部没掉捏。

## 效果图

以下是部分效果图：

* 主页
  <img src="README.assets\QQ图片20221021194003.png">

* 日历页
  <img src="README.assets\QQ图片20221021194723.png">
  
* 创建页
  <img src="README.assets\QQ图片20221021195540.png">
  <img src="README.assets\QQ图片20221021195544.png">

* 联系我们
  <img src="README.assets\QQ图片20221021194213.png">

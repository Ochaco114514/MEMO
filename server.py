#!flask/bin/python
from flask import Flask, jsonify
from gevent import pywsgi
from flask import abort
from flask import make_response
from flask import request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy


app = Flask(__name__)
CORS(app,resource=r'/*')

tasks = [
    
]

@app.route('/todo/tasks/getlist', methods=['GET'])#获取全部列表
def get_tasks1():
    return jsonify({'status':0,'message':"OK",'data':tasks})

@app.route('/todo/tasks/getlist/year=<int:year>/month=<int:month>/day=<int:day>', methods=['GET'])#获取某个日期的列表 点日历后跳转到具体时间页时请求
def get_tasks2(year,month,day):
    t=[]
    for task in tasks:
        if task['year']==year and task['month']==month and task['day']==day:
            t.append(task)
    return jsonify({'status':0,'message':"OK",'data':t})

@app.route('/todo/tasks/add', methods=['POST'])#上传列表 点create，得有title，其他默认
def create_task():
    if not request.json or not 'title' in request.json:
      return jsonify({'status':404,'message':"Not Found",'data':tasks})
    if len(tasks)==0:
        id=0
    else:
        id=tasks[-1]['id'] + 1
    task = {
        'id':id,
        'title': request.json['title'],  # type: ignore
        'content': request.json.get('content', ""),  # type: ignore
        'done': False,
        'start':"",
        'start_date':"",
        'finish':"",
        'finish_date':"",
        'create':request.json.get("create",""),  # type: ignore
        'year':request.json.get("year",""),  # type: ignore
        'month':request.json.get("month",''),  # type: ignore
        'day':request.json.get('day',''),  # type: ignore 2022-10-16T11:45
    }
    tasks.append(task)
    return jsonify({'status':0,'message':"OK",'data':tasks})

@app.route('/todo/tasks/update', methods=['POST'])#修改完成状态 可用json 点击打钩框实现
def update_task1():
    if not request.json or not 'id' in request.json:
      return jsonify({'status':404,'message':"Not Found",'data':tasks})
    
    for task in tasks:
        if task['id']==request.json['id']:
            if not 'start' in request.json and not 'finish' in request.json:
                sta=[task['start_date'],task['start']]
                fin=[task['finish_date'],task['finish']]
            else:
                sta=request.json['start'].split("T")
                fin=request.json['finish'].split("T")
            task['title']=request.json.get('title',task['title'])
            task['content']=request.json.get('content',task['content'])
            task['done']=request.json.get('done',task['done'])
            task['start']=sta[1]
            task['start_date']=sta[0]
            task['finish']=fin[1]
            task['finish_date']=fin[0]
            return jsonify({'status':0,'message':"OK",'data':tasks})

    return jsonify({'status':404,'message':"Not Found",'data':tasks})


@app.route('/todo/tasks/delete/id=<int:id>', methods=['GET'])#删除某个
def delete_task2(id):
    task = list(filter(lambda t: t['id'] == id, tasks))
    #print(task)
    if len(task) == 0:
        return jsonify({'status':404,'message':"Not Found",'data':tasks})
    tasks.remove(task[0])
    return jsonify({'status':0,'message':"OK",'data':tasks})

if __name__ == '__main__':
    server = pywsgi.WSGIServer(('0.0.0.0', 5000), app)
    server.serve_forever()
    app.run(port=5000,debug=True)

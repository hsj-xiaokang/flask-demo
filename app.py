#!/usr/bin/env python
# encoding: utf-8
'''
@author: heshengjin-何胜金
@contact: 2356899074@qq.com
@software: pycharm
@file: v.py
@time: 2018/12/20 17:45
@desc:第一个flask程序

如果报错的话：
ssl 'module' object has no attribute 'SSLContext'
则参考Stack Overflow：
SSLContext was introduced in 2.7.9, you're using an old version of Python so it doesn't have this attribute.


    # POST:
    # request.form获得所有post参数放在一个类似dict类中,to_dict()是字典化
    # 单个参数可以通过request.form.to_dict().get("xxx","")获得
    # ----------------------------------------------------
    # GET:
    # request.args获得所有get参数放在一个类似dict类中,to_dict()是字典化
    # 单个参数可以通过request.args.to_dict().get('xxx',"")获得
'''
from flask import Flask,session
from flask import render_template
from flask import json
from flask import jsonify
from datetime import timedelta
import os

from flask import request
from flask import make_response, Response

from filterDef import do_listreverse
from responseWrap import  Response_headers,allow_cross_domain
from mysqlOp import mysql

app = Flask(__name__)
app.config['SECRET_KEY']=os.urandom(24)   #设置为24位的字符,每次运行服务器都是不同的，所以服务器启动一次上次的session就清除。
app.config['PERMANENT_SESSION_LIFETIME']=timedelta(days=7) #设置session的保存时间。#默认session的时间持续31天


# 使用before_request来做权限
@app.before_request
def before_request():
    ip = request.remote_addr
    url = request.url
    print u'获取ip地址%s' % (ip)
    print u'获取url地址%s' % (url)
    if request.method == 'GET':
        print 'GET'
        print request.args.to_dict()
    else:
        print 'POST'
        print request.form.to_dict()


@app.after_request
def after_request():
    print u'after_request-请求离开'

#获取session
@app.route('/get/session')
def get():
    return  session.get('username')

#删除session
@app.route('/delete/session')
def delete():
    print(session.get('username'))
    session.pop('username')
    print(session.get('username'))
    return 'delete'
#清楚session
@app.route('/clear/session')
def clear():
    print(session.get('username'))
    session.clear()
    print(session.get('username'))
    return 'clear'


# restful-api
@app.route('/')
@allow_cross_domain
def hello_world():
    session.permanent=True
    session['username'] = 'hsj'
    return Response(json.dumps({'a': 1, 'b': 1, 'c': u'JSON数据返回'}), content_type='application/json')


# restful-api
@app.route('/hsj_test_flask')
@allow_cross_domain
def hsj_test_flask():
    return jsonify({'a': 1, 'b': u'hsj_test_flask,第一个flask程序!'})


@app.route('/html')
@allow_cross_domain
def index():
    list1 = list(range(10))
    my_list = [{"id": 1, "value": u"我爱工作"},
               {"id": 2, "value": u"工作使人快乐"},
               {"id": 3, "value": u"沉迷于工作无法自拔"},
               {"id": 4, "value": u"日渐消瘦"},
               {"id": 5, "value": u"以梦为马，越骑越傻"}]
    return render_template(
        # 渲染模板语言
        'index.html',
        title=u'测试返回页面',
        list2=list1,
        my_list=my_list
    )


# 测试post
@app.route('/ajaxPost', methods=['POST'])
@allow_cross_domain
def ajaxPost():
    resp = Response_headers(request.form.to_dict())
    return resp


# mysql操作
@app.route('/mysqlOp', methods=['GET','POST'])
@allow_cross_domain
def mysqlOp():
    id=request.args.to_dict().get('id',8)#获取相应的值
    with mysql() as cursor:
        row_count = cursor.execute("select * from auth_user where id=%s", (id))
        row_1 = cursor.fetchone()
        return Response_headers(row_1)


#  添加自定义过滤器
app.add_template_filter(do_listreverse, 'listreverse')

@app.errorhandler(403)
def page_not_found(error):
    content = json.dumps({u"error_code": "403"})
    resp = Response_headers(content)
    return resp

@app.errorhandler(404)
def page_not_found(error):
    content = json.dumps({u"error_code": "404"})
    resp = Response_headers(content)
    return resp

@app.errorhandler(400)
def page_not_found(error):
     content = json.dumps({u"error_code": "400"})
     resp = Response_headers(content)
     return resp

@app.errorhandler(500)
def page_not_found(error):
     content = json.dumps({u"error_code": "500"})
     resp = Response_headers(content)
     return resp

if __name__ == '__main__':
    app.run()

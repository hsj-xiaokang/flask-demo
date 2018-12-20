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
'''
from flask import Flask

app = Flask(__name__)

# restful-api
@app.route('/')
def hello_world():
    return 'Hello World!'

# restful-api
@app.route('/hsj_test_flask')
def hsj_test_flask():
    return 'hsj_test_flask,第一个flask程序!'


if __name__ == '__main__':
    app.run()

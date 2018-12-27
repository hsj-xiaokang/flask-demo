#!/usr/bin/env python
# encoding: utf-8
'''
@author: heshengjin-何胜金
@contact: 2356899074@qq.com
@software: pycharm
@file: responseWrap.py
@time: 2018/12/27 10:29
@desc:f返回封装
'''
from exceptions import Exception

from flask import request,session
from flask import make_response, Response
from flask import json
from flask import jsonify
from functools import wraps


# 跨域请求
def Response_headers(content):
    resp = Response(json.dumps(content), content_type='application/json')
    resp.headers['Access-Control-Allow-Origin'] = '*'
    return resp

def allow_cross_domain(fun):
    @wraps(fun)
    def wrapper_fun(*args, **kwargs):
        # print args #tuple
        # print kwargs #dict-copy-just like c/c++
        # print session.get('username')
        rst = make_response(fun(*args, **kwargs))
        rst.headers['Access-Control-Allow-Origin'] = '*'
        rst.headers['Access-Control-Allow-Methods'] = 'PUT,GET,POST,DELETE'
        allow_headers = "Referer,Accept,Origin,User-Agent"
        rst.headers['Access-Control-Allow-Headers'] = allow_headers
        return rst
    return wrapper_fun
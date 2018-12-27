#!/usr/bin/env python
# encoding: utf-8
'''
@author: heshengjin-何胜金
@contact: 2356899074@qq.com
@software: pycharm
@file: filterDef.py
@time: 2018/12/27 10:29
@desc:自定义过滤器
'''
from flask import Flask


# step1 定义过滤器
def do_listreverse(li):
    temp_li = list(li)
    temp_li.reverse()
    return temp_li


# # step2 添加自定义过滤器
# app.add_template_filter(do_listreverse, 'listreverse')
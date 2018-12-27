#!/usr/bin/env python
# encoding: utf-8
'''
@author: heshengjin-何胜金
@contact: 2356899074@qq.com
@software: pycharm
@file: mysqlOp.py
@time: 2018/12/27 10:40
@desc:mysql操作
'''

from flask import Flask, jsonify, request
import json
import pymysql

import contextlib


#定义上下文管理器，连接后自动关闭连接-获取mysql链接
@contextlib.contextmanager
def mysql(host='127.0.0.1', port=3306, user='root', passwd='HSJissmart1', db='djangodemonew',charset='utf8'):
    conn = pymysql.connect(host=host, port=port, user=user, passwd=passwd, db=db, charset=charset)
    cursor = conn.cursor(cursor=pymysql.cursors.DictCursor)
    try:
        yield cursor
    finally:
        conn.commit()
        cursor.close()
        conn.close()
        print 'close conn-cursor'
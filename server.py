import os, os.path
import random
import string
from threading import Thread, Lock
import threading
import json
import serial
import sys
import time

import cherrypy

class Index(object):
    @cherrypy.expose
    def index(self):
        return open('./tests/playground.html')

class COISA(object):
    exposed = True
    # @cherrypy.tools.accept(media='text/plain')
    # @cherrypy.tools.json_out()
    def GET(self, user_id):
        # return cherrypy.session['userID']
        # print(self.sensor.users[user_id].data)
        return "1"
        # return "1"
        
    # @cherrypy.tools.json_out()
    # @cherrypy.tools.json_in()
    def POST(self):
        return "1"

    def PUT(self, another_string):
        pass

    def DELETE(self):
        pass

if __name__ == '__main__':
    conf = {
        '/': {
            'tools.sessions.on': True,
            'tools.staticdir.root': os.path.abspath(os.getcwd()),
            'tools.staticdir.on': True,
            'tools.staticdir.dir': '.'
        },
        '/COISA': {
            'request.dispatch': cherrypy.dispatch.MethodDispatcher(),
            'tools.response_headers.on': True,
            'tools.response_headers.headers': [('Content-Type', 'text/plain')],
            # 'tools.response_headers.headers': [('Content-Type', 'json')],
        }
    }
    print 
    cherrypy.config.update(
        {'server.socket_host': '0.0.0.0'} )
    webapp = Index()
    webapp.COISA = COISA()
    # webapp.generator.sensor.serialPolling("K")
    cherrypy.quickstart(webapp, '/', conf)
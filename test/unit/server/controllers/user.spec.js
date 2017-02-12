import request from 'supertest'
import passport, { Strategy } from 'passport'
import util from 'util'

import server from '../../../../server/server'
import User from '../../../../server/models/User'

describe('UserController', () => {
  describe('POST /api/login', () => {
    before(() => {
      function MockStrategy(verify) {
        this.name = 'local'
        this._verify = verify // eslint-disable-line no-underscore-dangle
      }

      util.inherits(MockStrategy, Strategy)

      MockStrategy.prototype.authenticate = function authenticate(req) {
        const verfied = (err, user, info) => {
          if (err) {
            return this.error(err)
          }
          if (!user) {
            return this.fail(info)
          }
          return this.success(user, info)
        }

        // eslint-disable-next-line no-underscore-dangle
        this._verify(req.body.username, req.body.password, verfied)
      }

      passport.use(new MockStrategy((username, password, done) => {
        if (username === 'admin' && password === 'password') {
          return done(null, {
            id: 'some-user-id',
          })
        }
        return done(null, false, { message: 'Invalid username or password.' })
      }))
    })

    it('should return 400 Bad Request when parameters are missing', (done) => {
      request(server)
        .post('/api/login')
        .expect(400, done)
    })

    it('should return 401 Unauthorized when credentials are incorrect', (done) => {
      request(server)
        .post('/api/login')
        .send({
          username: 'admin',
          password: 'incorrect-password',
        })
        .expect(401, done)
    })

    it('should return 200 OK when credentials are correct', (done) => {
      request(server)
        .post('/api/login')
        .send({
          username: 'admin',
          password: 'password',
        })
        .expect(200, done)
    })
  })

  describe('GET /api/logout', () => {
    it('should return 200 OK', (done) => {
      request(server)
        .get('/api/logout')
        .expect(200, done)
    })
  })

  describe('GET /api/profile/password', () => {
    it('should return 401 Unauthorized when an user has not logged in', (done) => {
      request(server)
        .post('/api/profile/password')
        .expect(401, done)
    })

    it('should return 400 Bad Request when parameters are missing', (done) => {
      const http = require('http') // eslint-disable-line global-require
      http.IncomingMessage.prototype.user = {
        id: 'some-user-id',
      }

      request(server)
        .post('/api/profile/password')
        .expect(400, done)
    })

    it('should return 200 OK after successful update', (done) => {
      const http = require('http') // eslint-disable-line global-require
      http.IncomingMessage.prototype.user = {
        id: 'some-user-id',
      }

      User.findById = (id, cb) => {
        cb(null, {
          save: (callback) => {
            callback(null)
          },
        })
      }

      request(server)
        .post('/api/profile/password')
        .send({
          password: 'new-password',
        })
        .expect(200, done)
    })
  })
})

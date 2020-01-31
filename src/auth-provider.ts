/* Copyright 2017, Google, Inc.
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * This auth is going to use the Authorization Code flow, described in the docs:
 * https://developers.google.com/actions/identity/oauth2-code-flow
 */

import * as express from 'express'
import * as util from 'util'
import { Headers } from 'actions-on-google'

import * as Firestore from './firestore'

/**
 * A function that gets the user id from an access token.
 * Replace this functionality with your own OAuth provider.
 *
 * @param headers HTTP request headers
 * @return The user id
 */
export async function getUser(headers: Headers): Promise<string> {
  const authorization = headers.authorization
  const accessToken = (authorization as string).substr(7)
  return await Firestore.getUserId(accessToken)
}

/**
 * A function that adds /login, /fakeauth, /faketoken endpoints to an
 * Express server. Replace this with your own OAuth endpoints.
 *
 * @param expressApp Express app
 */
export async function registerAuthEndpoints(expressApp: express.Express) {
  expressApp.use('/login', express.static('./frontend/login.html'))

  expressApp.post('/login', async (req, res) => {
    const {username, password} = req.body
    console.log('/login ', username, password)
    // Here, you should validate the user account.
    // In this sample, we do not do that.
    return res.redirect(util.format(
      '%s?client_id=%s&redirect_uri=%s&state=%s&response_type=code',
      '/frontend', req.body.client_id,
      encodeURIComponent(req.body.redirect_uri), req.body.state))
  })

  expressApp.get('/fakeauth', async (req, res) => {
    const responseurl = util.format('%s?code=%s&state=%s',
      decodeURIComponent(req.query.redirect_uri), 'xxxxxx',
      req.query.state)
    console.log(responseurl)
    return res.redirect(responseurl)
  })

  expressApp.all('/faketoken', async (req, res) => {
    const grantType = req.query.grant_type
      ? req.query.grant_type : req.body.grant_type
    const secondsInDay = 86400 // 60 * 60 * 24
    const HTTP_STATUS_OK = 200
    console.log(`Grant type ${grantType}`)

    let obj
    if (grantType === 'authorization_code') {
      obj = {
        token_type: 'bearer',
        access_token: '123access',
        refresh_token: '123refresh',
        expires_in: secondsInDay,
      }
    } else if (grantType === 'refresh_token') {
      obj = {
        token_type: 'bearer',
        access_token: '123access',
        expires_in: secondsInDay,
      }
    }
    res.status(HTTP_STATUS_OK).json(obj)
  })
}

const { TwitterApi } = require('twitter-api-v2');
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;
const appKey = process.env.TWITTER_APP_KEY;
const appSecret = process.env.TWITTER_APP_SECRET;
const twitterCallback = process.env.TWITTER_CALLBACK_URL;

const Users = require('../models/Users');

const controller = {
  users: async (req,res) => {
    const response = await Users.findAll()
    .then((data) => {
      const res = { success: true, data: data }
      return res;
    })
    .catch(error =>{
      const res = { success: false, error: error }
      return res;
    })

    res.json(response);
  },
  update: async (req,res) => {
    if (!req.authUser) {
      return res.json({ success: false, error: 'Unauthorized' });
    }

    const { nemAddress, symbolAddress } = req.body;
    const user = await Users.update({
      nemAddress,
      symbolAddress
    },
      {
        where: {
          twitterName: req.authUser.screenName
        }
      });

      if (!user) {
        res.json({
          success: false,
        });
      }
      res.json({
        success: true
      });
  },
  requestToken: async (req,res) => {
    const twitterClient = new TwitterApi({
			appKey,
			appSecret
		});

    try {
			const result = await twitterClient.generateAuthLink(twitterCallback);

      if ('true' === result.oauth_callback_confirmed) {
        res.send(result);
      }
		} catch (error) {
      console.log('error :>> ', error);
      res.json({
        success: false,
      });
			// throw Error('fail to request twitter token');
		}
  },
  verifyToken: async (req,res) => {
    const { oauthToken, oauthTokenSecret, oauthVerifier } = req.query;

    const twitterClient = new TwitterApi({
			appKey,
			appSecret,
			accessToken: oauthToken,
			accessSecret: oauthTokenSecret
		});

		try {
			const { client, ...info } = await twitterClient.login(oauthVerifier);

      const token = jwt.sign(info, secret, {
        expiresIn: '7d'
      });

      const user = await Users.findOne({
        where: { twitterName: info.screenName },
      })

      // Create user if not exist
      if (!user) {
        await Users.create({
          twitterName: info.screenName,
          nemAddress: '',
          symbolAddress: ''
        });
      }

      // set 7 days cookie
      res.cookie('authorizeToken', token, { httpOnly: true, maxAge: 604800 * 1000 }).json({ success: true });
		} catch (error) {
      console.log('error :>> ', error);
      res.json({
        success: false,
      });
		}
  },
  verifyUser: async (req,res) => {
    res.json({ data: req.authUser, success: true });
  },
  logout: async (req,res) => {
    res.clearCookie('authorizeToken').json({ success: true });
  }
}

module.exports = controller;

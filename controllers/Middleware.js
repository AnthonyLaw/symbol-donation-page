const jwt = require('jsonwebtoken');
const secret = 'mysecretsshhh';

const middleware = {
    withAuth: (req, res, next) => {
        const { authorizeToken } = req.cookies;

        if (!authorizeToken) {
            res.status(401).send('Unauthorized: No token provided');
          } else {
            jwt.verify(authorizeToken, secret, (err, decoded) => {
              if (err) {
                res.status(401).send('Unauthorized: Invalid token');
              } else {
                req.authUser = decoded;
                next();
              }
            });
          }
    }
}

module.exports = middleware;
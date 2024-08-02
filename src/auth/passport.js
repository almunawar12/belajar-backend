const passport = require('passport');
const prisma = require('../db');
// const passportJwt = require('passport-jwt');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
// const { ExtractJwt } = passportJwt;

passport.use(
  'user',
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    },
    async (jwtPayload, done) => {
      try {
        // console.log('passport',jwtPayload);
        if (jwtPayload.roleuserId != null) {
          const user = await prisma.user.findUnique({
            where: {
              id: jwtPayload.id,
            },
          });

          if (user) {
            done(null, user);
          } else {
            done(null, false);
          }
        } else {
          done(null, false);
        }
      } catch (error) {
        done(error);
      }
    },
  ),
);

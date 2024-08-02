/* eslint-disable consistent-return */
// const jwt = require('jsonwebtoken');

// const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { compare } = require('bcrypt');
const prisma = require('../../db');

const { exclude } = require('../../middlewares');
// const { checkPhoneAndEmail } = require('../../middleware/checkEmailAndPhone');

module.exports = {
  loginUser: async (req, res, next) => {
    try {
      const { email, password } = req.body;

      console.log(req.body);

      const user = await prisma.user.findUnique({
        where: {
          email,
          trash: 0,
        },
        include: {
          Role: true,
        },
      });

      // console.log(clientOwner);

      if (!user) {
        res.status(400).json({ message: 'Email or password does not match!' });
      } else {
        const checkPassword = await compare(
          password,
          user.password,
        );

        console.log(checkPassword);

        if (!checkPassword) {
          return res
            .status(400)
            .json({ message: 'Email or password does not match!' });
        }
        const secret = process.env.JWT_SECRET;

        // const expiresIn = 60 * 60 * 1;

        const excludePassword = exclude(user, ['password', 'trash', 'createdAt', 'updatedAt']);

        const token = jwt.sign(excludePassword, secret);

        res.status(201).json({
          success: true,
          message: 'success',
          token,
        });
      }
    } catch (error) {
      console.error('Error retrieving products:', error);
      res.status(500).json({ error: 'Internal server error', message: error.message, success: false });
      next(error);
    }
  },

};

const bcrypt = require("bcryptjs");
const prisma = require("../../db");

const checkPhoneAndEmail = async (phone, email) => {
  try {
    // CHECK PHONE
    const checkPhoneAdmin = await prisma.user.findUnique({
      where: {
        phone,
      },
    });

    if (checkPhoneAdmin) {
      throw new Error("Phone has been used");
    }

    // CHECK EMAIL
    const checkEmailAdmin = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (checkEmailAdmin) {
      throw new Error("Email has been used");
    }

    return true;
  } catch (error) {
    return false;
  }
};

module.exports = {
  // Create new user
  create: async (req, res) => {
    const { name, phone, email, password, roleId } = req.body;

    try {
      await prisma.$transaction(async (prisma) => {
        const result = await checkPhoneAndEmail(phone, email);
        if (!result) {
          return res.status(409).json({
            success: false,
            message: 'Phone or Email has been used',
          });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        if (hashedPassword) {
          const newUser = await prisma.user.create({
            data: {
              name,
              password: hashedPassword,
              phone,
              email,
              trash: 0,
              roleId: roleId || null,
            },
          });

          if (newUser) {
            res.status(201).json({
              success: true,
              message: 'User created successfully',
            });
          }
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
      console.log(error);
    } finally {
      await prisma.$disconnect();
    }
  },

  // Get all users or get user by id
  get: async (req, res, next) => {
    try {
      const { id } = req.query;

      if (!id) {
        const response = await prisma.user.findMany({
          where: {
            trash: 0,
          },
          include: {
            Role: true,
          },
        });
        if (response) {
          res.status(200).json({
            success: true,
            message: "Users fetched successfully",
            data: response,
          });
        }
      } else {
        const response = await prisma.user.findUnique({
          where: {
            id,
          },
          include: {
            Role: true,
          },
        });

        if (response) {
          res.status(200).json({
            success: true,
            message: "User fetched successfully",
            data: response,
          });
        }
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
      next(error);
    }
  },

  // Update user by id
  put: async (req, res) => {
    const { name, roleId } = req.body;

    try {
      const response = await prisma.user.update({
        where: {
          id: req.params.id,
        },
        data: {
          name,
          trash: 0,
          Role: {
            connect: {
              id: roleId,
            },
          },
        },
      });

      if (response) {
        res.status(200).json({
          success: true,
          message: "User updated successfully",
          data: response,
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },

  // Remove user by id
  remove: async (req, res) => {
    try {
      const response = await prisma.user.delete({
        where: {
          id: req.params.id,
        },
      });

      if (response) {
        res.status(200).json({
          success: true,
          message: "User deleted successfully",
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
};

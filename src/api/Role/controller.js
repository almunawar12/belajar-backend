/* eslint-disable consistent-return */
// const jwt = require('jsonwebtoken');

const bcrypt = require("bcryptjs");
const prisma = require("../../db");
const { put } = require("./router");
// const { PrismaClient } = require('@prisma/client')

// const prisma = new PrismaClient();
module.exports = {
  // Create new role
  create: async (req, res) => {
    const data = req.body;

    try {
      const result = await prisma.role.create({
        data: {
          name: data.name,
        },
      });

      if (result) {
        res.status(201).json({
          success: true,
          message: "create success",
        });
      }
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
      console.log(error);
    }
  },

  //   Get all roles or get role by id
  get: async (req, res, next) => {
    try {
      const { id } = req.query;

      if (!id) {
        const response = await prisma.role.findMany({
          where: {
            trash: 0,
          },
        });
        if (response) {
          res.status(200).json({
            success: true,
            message: "Success",
            data: response,
          });
        }
      } else {
        const response = await prisma.user.findUnique({
          where: {
            id,
            trash: 0,
          },
        });

        if (response) {
          res.status(200).json({
            success: true,
            message: "Success",
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

  //   Update role by id
  put: async (req, res) => {
    // const { id } = req.query;
    const data = req.body;

    try {
      const response = await prisma.role.update({
        where: {
          id: req.params.id,
        },
        data: {
          name: data.name,
          trash: 0,
        },
      });

      if (response) {
        res.status(200).json({
          success: true,
          message: "Success",
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },

  //   Remove role by id
  remove: async (req, res) => {
    // const { id } = req.query;

    try {
      const response = await prisma.role.delete({
        where: {
          id: req.params.id,
        },
      });

      if (response) {
        res.status(200).json({
          success: true,
          message: "Success",
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

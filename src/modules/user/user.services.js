const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

const find = async () => {
  return await prisma.user.findMany({});
};

const findById = async (id) => {
  return await prisma.user.findUnique({ where: { id: Number(id) } });
};

const create = async (name, email, password) => {
  const salt = bcrypt.genSaltSync(12);
  const hash = bcrypt.hashSync(password, salt);

  return await prisma.user.create({ data: { name, email, hash } });
};

const login = async (email, password) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (bcrypt.compareSync(password, user.hash)) {
    return user;
  }
  return null;
};

const update = async (id, name) => {
  return await prisma.user.update({
    where: { id: Number(id) },
    data: { name },
  });
};

const remove = async (id) => {
  return await prisma.user.delete({
    where: {
      id: Number(id),
    },
  });
};

module.exports = {
  find,
  findById,
  create,
  update,
  login,
  remove,
};

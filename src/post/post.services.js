const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const find = async () => {
  return await prisma.post.findMany({});
};

const findById = async (id) => {
  return await prisma.post.findUnique({ where: { id: Number(id) } });
};

const create = async (title, content) => {
  return await prisma.post.create({
    data: { title, content },
  });
};

const update = async (id, title, content) => {
  return await prisma.post.update({
    where: { id: Number(id) },
    data: { title, content },
  });
};

const updatePublished = async (id, title, content) => {
  return await prisma.post.update({
    where: { id: Number(id) },
    data: { published: true },
  });
};

const remove = async (id) => {
  return await prisma.post.delete({
    where: { id: Number(id) },
  });
};

module.exports = { find, findById, create, update, updatePublished, remove };

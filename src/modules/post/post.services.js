const { PrismaClient } = require('@prisma/client');
const userServices = require('../user/user.services');
const prisma = new PrismaClient();

const find = async () => {
  return await prisma.post.findMany({});
};

const findById = async (id) => {
  const post = await prisma.post.findUnique({ where: { id: Number(id) } });
  const author = await prisma.post
    .findUnique({ where: { id: Number(id) } })
    .author();
  return {
    ...post,
    author: {
      id: author.id,
      name: author.name,
      email: author.email,
    },
  };
};

const create = async (title, content, authorId) => {
  return await prisma.post.create({
    data: { title, content, author: { connect: { id: Number(authorId) } } },
  });
};

const update = async (id, title, content, published) => {
  return await prisma.post.update({
    where: { id: Number(id) },
    data: { title, content, published },
  });
};

const remove = async (id) => {
  return await prisma.post.delete({
    where: { id: Number(id) },
  });
};

module.exports = { find, findById, create, update, remove };

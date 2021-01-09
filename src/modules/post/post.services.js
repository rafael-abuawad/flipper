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

const create = async (title, description, minutesPerBlock, authorId) => {
  return await prisma.post.create({
    data: {
      title,
      description,
      minutesPerBlock: Number(minutesPerBlock),
      author: { connect: { id: Number(authorId) } },
    },
  });
};

const update = async (id, title, content, published) => {
  return await prisma.post.update({
    where: { id: Number(id) },
    data: { title, content, published },
  });
};

const updateCompleted = async (id, authorId) => {
  const post = await prisma.post.findUnique({ where: { id: Number(id) } });
  const blocksCompleted = post.blocksCompleted + 1;

  if (post.authorId === Number(authorId)) {
    if (blocksCompleted <= 9) {
      return await prisma.post.update({
        where: { id: Number(id) },
        data: { blocksCompleted: blocksCompleted },
      });
    } else {
      // Set the hasNext flag to true
      await prisma.post.update({
        where: { id: Number(id) },
        data: { hasNext: true },
      });
      // Create a new PostNote with the same data
      return await prisma.post.create({
        data: {
          title: post.title,
          description: post.description,
          minutesPerBlock: post.minPerBlock,
          blocksCompleted: 1,
          author: { connect: { id: Number(authorId) } },
        },
      });
    }
  } else {
    throw new Error('User is not authorized to complete this operation')
  }
};

const remove = async (id) => {
  return await prisma.post.delete({
    where: { id: Number(id) },
  });
};

module.exports = { find, findById, create, update, updateCompleted, remove };

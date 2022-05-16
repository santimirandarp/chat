async function find(coll, skip, limit) {
  return await coll
    .find({})
    .sort({ createdAt: -1 })
    .skip(parseInt(skip))
    .limit(parseInt(limit));
}

function update(coll, id, msg) {
  return coll.update(
    { _id: id },
    {
      msg: msg,
      createdAt: Date(),
    }
  );
}

function save(coll, msg) {
  return coll.insertOne(msg);
}

function del(coll, id) {
  return coll.deleteOne({ _id: id });
}

export {
  find as findMessages,
  save as saveMessage,
  update as updateMessage,
  del as deleteMessage,
};

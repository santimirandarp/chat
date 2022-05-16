async function find(coll, skip, limit) {
  return coll
    .find({})
    .sort({ createdAt: -1 })
    .skip(parseInt(skip))
    .limit(parseInt(limit));
}

function update(coll, {_id, msg}) {
  return coll.updateOne(
    { _id },
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

async function findMessages(req, res) {
  const { skip, limit } = req.params;
  try {
    await db;
    const doc = await find(db.collection("messages"), skip, limit);
    console.log("exec find messages", doc);
    res.json(doc);
  } catch (e) {
    console.error(e);
    res.status(500).json({ err: e.message });
  }
}

export {
  findMessages,
  save as saveMessage,
  update as updateMessage,
  del as deleteMessage,
};

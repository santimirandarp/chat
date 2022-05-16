import { connectDB } from "./connectDB.js";

let db = connectDB(); //preconnect

function find(coll, skip, limit) {
  return coll
    .find({})
    .sort({ createdAt: -1 })
    .skip(parseInt(skip))
    .limit(parseInt(limit))
    .toArray()
}

function update(coll, { _id, msg }) {
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
    let coll = (await db).collection("messages");
    const doc = await find(coll, skip, limit);
    console.log(doc)
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

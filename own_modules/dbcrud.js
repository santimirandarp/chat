const find = async (coll, skip, limit) => {
    return await coll
        .find({})
        .sort({ createdAt: -1 })
        .skip(parseInt(skip))
        .limit(parseInt(limit))
};

const update = async(coll, id, msg) => {
    return coll.update(
        { _id: id },
        {
            msg: msg,
            createdAt: Date(),
        },
    )};

const save = async (coll, msg) => await coll.insertOne(msg)

const del = async (coll, id) => await coll.deleteOne({ _id: id })

export {
    find as findMessages,
    save as saveMessage,
    update as updateMessage,
    del as deleteMessage,
};

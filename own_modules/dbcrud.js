import { msgModel } from "./model.js";

const find = (skip, limit, done) => {
    msgModel
        .find({})
        .sort({ createdAt: -1 })
        .skip(parseInt(skip))
        .limit(parseInt(limit))
        .exec(done);
};

const update = (id, msg, done) =>
    msgModel.update(
        { _id: id },
        {
            msg: msg,
            createdAt: Date(),
        },
        done
    );

const save = (msg, done) => new msgModel(msg).save(done);

const del = (id, done) => msgModel({ _id: id }).deleteOne(done);

export {
    find as findMessages,
    save as saveMessage,
    update as updateMessage,
    del as deleteMessage,
};

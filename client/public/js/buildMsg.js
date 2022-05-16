import { msgDate, htmlCreate, createSelect } from "./utils.js";
export class Message {
    constructor(data) {
        const { _id, tid, createdAt, msg } = data;
        if (_id) this._id = _id;
        if (tid) this.tid = tid;
        if (createdAt instanceof Date) {
            this.createdAt = createdAt;
        } else {
            this.createdAt = new Date();
        }
        this.msg = msg;
    }
}
/** Create a list item from message.
 * This function is triggered by different actions.
 * 1. when sender hits submit:`msg,createdAt,tid` are defined.
 * 2. when received from DB. `msg, createdAt, _id` are defined.
 * Once this is linked with a unique username/socket,
 * they will be able to act on the message.
 */
export const msgToHTML = (data) => {
    const { msg: m, createdAt, _id, tid, own } = data;
    // we build up the message HTML
    const msg = htmlCreate("li", {
        "data-id": _id || "",
        "data-tid": tid || "",
    });
    const date = htmlCreate("span", { class: "time" });
    date.innerText = msgDate(createdAt);
    const msgBody = document.createElement("span");
    msgBody.innerText = m;
    //prepend elements to list item
    msg.prepend(date, msgBody);
    if (!own) return msg;
    msg.append(createSelect());
    return msg;
};
export const HTMLToDOM = (html, target, type = "append") =>
    type === "prepend" ? target.prepend(html) : target.append(html);

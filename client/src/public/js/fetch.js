import { HTMLToDOM, msgToHTML } from "./buildMsg.js";

const ul = document.getElementById("messages");

async function getMsgsAsync(uri, skip, limit) {
    const route = uri + "/" + skip.toString(10) + "/" + limit.toString(10);
    const msgs = await fetch(route).then((d) => d.json());
    msgs.forEach((msg) => HTMLToDOM(msgToHTML(msg), ul, "prepend"));
}

async function getLastMsgsAsync(uri) {
    return await getMsgsAsync(uri, 0, 10);
}

export { getMsgsAsync, getLastMsgsAsync };

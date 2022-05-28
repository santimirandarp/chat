import io from "socket.io-client";

import { Message, msgToHTML, HTMLToDOM } from "./buildMsg.js";
import { getLastMsgsAsync, getMsgsAsync } from "./fetch.js";
import { tempId } from "./utils.js";

const form = document.querySelector("form");
const ul = document.getElementById("messages");
const messages = ul.children;
const input = document.getElementById("m");
const prevMsgs = document.querySelector("button#wantMore");

const uri = "http://localhost:3000";

async function main() {
    //open socket to uri
    const socket = io();

    await getLastMsgsAsync(uri + "/messages");

    prevMsgs.click(() => {
        const l = parseInt(ul.children.length);
        getMsgsAsync(`${uri}/messages`, l, l + 10);
    });

    form.onsubmit = function (e) {
        /*
       on input submit append msg to DOM and
       send to server. On server OK add _id
       and enable + CRUD operations
       */
        e.preventDefault();

        //1. collect the value and reset field
        const msg = input.value;
                    console.log(_id)
        if (!msg) return;
        input.value = "";

        //2. create the HTML list item
        const toSave = new Message({ msg, tid: tempId(messages) });

        const li = msgToHTML({ ...toSave, own: true });

        //3.A for the sender, append right away, as a preview
        ul.append(li);
        //readjust height
        this.scrollTo(0, this.scrollHeight);

        //4.emit the message to server
        socket.emit("save", { msg: toSave.msg, tid: toSave.tid });

        //LI interaction
        let msgOptions = li.querySelector(".messageItem_select");
        msgOptions.onchange = function () {
            //'this' is the current element target
            let li = this.parentElement;
            const _id = li.getAttribute("data-id");
            if (this.value === "delete") {
                socket.emit("delete", _id);
                io.on("deleted", (_id) => {
                    console.log(_id)
                    const em = document.createElement("em");
                    em.innerText =
                        "Message was deleted. It will dissapear in 5 seconds.";
                    li.append(em);
                    const ulSlice = messages.slice(-50);
                    const toRemove = ulSlice.querySelector(
                        `[data-id='${_id}']`
                    );
                    setTimeout(() => toRemove.remove(), 1000);
                });
            } else {
                console.log("nothing yet");
            }
        };
    };

    //5.change temporary id to permanent
    socket.on("saved", ({ _id, tid }) => {
        for (
            let i = messages.length - 1;
            i > messages.length - 200 && i > 0;
            i--
        ) {
            if (messages[i].getAttribute("data-tid") === tid) {
                messages[i].setAttribute("data-id", _id);
                messages[i].removeAttribute("data-tid");
                break;
            }
        }
    });

    // client listens for new messages
    socket.on("new", (data) => {
        HTMLToDOM(msgToHTML(data));
        form.scrollTo(0, form.scrollHeight);
    });
    //end main
}
main().catch((e) => console.log(e));

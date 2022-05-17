import io from "socket.io-client";

import { messages, form, ul, prevMsgs, input } from "./elements.js";
import { Message, msgToHTML, HTMLToDOM } from "./buildMsg.js";
import { getLastMsgsAsync, getMsgsAsync } from "./fetch.js";
import { tempId } from "./utils.js";

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
        socket.emit("save message", { msg: toSave.msg, tid: toSave.tid });

        //LI interaction
        let msgOptions = li.querySelector(".msgOpts");
        console.log(msgOptions);
        msgOptions.onchange = function () {
            //'this' is the current element target
            let li = this.parentElement;
            const _id = li.getAttribute("data-id");
            if (this.value === "delete") {
                //  if (!li.children('em')) li.append('<em>DELETING...</em>');
                socket.emit("delete message", _id);
                socket.on("message deleted", (msg) => {
                    const em = document.createElement("em");
                    em.innerText = msg;
                    li.append(em);
                });
            } else {
                console.log("nothing yet");
            }
        };
    };

    //5.change temporary id to permanent
    socket.on("message saved", ({ _id, tid }) => {
        for (
            let i = messages.length - 1;
            i > messages.length - 1000 && i > 0;
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
    socket.on("new message", (data) => {
        HTMLToDOM(msgToHTML(data));
        form.scrollTo(0, form.scrollHeight);
    });
    //end main
}
main().catch((e) => console.log(e));

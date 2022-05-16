import { io } from 'socket.io-client';
import { messages, form, ul, prevMsgs, input } from './elements.js';
import { Message, msgToHTML, HTMLToDOM } from './buildMsg.js';
import { getLastMsgsAsync, getMsgsAsync } from './fetch.js';
import { replaceTId, messageSelectInteraction, tempId } from './utils.js';
const uri = 'http://localhost:3000';
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        //open socket to uri
        const socket = io();
        yield getLastMsgsAsync(uri + '/messages');
        prevMsgs.click = () => {
            const l = ul.children.length;
            getMsgsAsync(`${uri}/messages`, l, l + 10);
        };
        /*
           on input submit append msg to DOM and
           send to server. On server OK add _id
           and enable + CRUD operations
         */
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            //1. collect the value and reset field
            const msg = input.value;
            if (!msg)
                return;
            input.value = '';
            //2. create the HTML list item
            const toSave = new Message({ msg, tid: tempId(messages) });
            const li = msgToHTML(Object.assign(Object.assign({}, toSave), { own: true }));
            //3.A for the sender, append right away, as a preview
            ul.append(li);
            //readjust height
            ul.scrollTo(0, ul.scrollHeight);
            //4.emit the message to server
            socket.emit('save message', { msg: toSave.msg, tid: toSave.tid });
            // Append an event listener to that message
            const msgOptions = li.querySelector('.msgOpts');
            msgOptions.addEventListener('change', messageSelectInteraction(socket));
        });
        //5.change temporary id to permanent
        socket.on('message saved', ({ _id, tid }) => {
            const l = messages.length;
            for (let i = 1; i < 100; i++) {
                console.log(messages[l - i].getAttribute('data-tid'), typeof (tid));
                if (i > l) {
                    return;
                }
                else if (messages[l - i].getAttribute('data-tid') === tid) {
                    return replaceTId(messages[l - i], _id);
                }
            }
            return;
        });
        // client listens for new messages
        socket.on('new message', (data) => {
            HTMLToDOM(msgToHTML(data), ul);
            ul.scrollTo(0, ul.scrollHeight);
        });
    });
}
main().catch((e) => console.log(e));

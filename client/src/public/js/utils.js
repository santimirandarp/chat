/*
 * first 5 symbols (i.e 00:12)
 * @param createdAt - date of message creation
 * @returns `hour:minute` of creation
 */
//first 5 symbols (0,1,2,3,4)
export function msgDate(createdAt) {
    return new Date(createdAt).toTimeString().substr(0, 5);
}
/**
 * Creates html element with attributes
 * @param name - html string name
 * attributes object with key values
 * @returns html element
 */
export function htmlCreate(name, attributes = {}) {
    const element = document.createElement(name);
    for (const attr in attributes) {
        element.setAttribute(attr, attributes[attr]);
    }
    return element;
}

// Creates the <select> element for the messgaes
export function createSelect() {
    const select = htmlCreate("select", {
        class: "messageItem_select",
        name: "messageItemSelect",
    });
    const options = ["*", "delete", "update"];
    options.forEach((option) => {
        const element = htmlCreate("option", { value: option });
        element.innerText = option.charAt(0).toUpperCase() + option.slice(1);
        select.append(element);
    });
    return select;
}

/*
 * When user presses any action like `delete` on a message item,
 * it sends a socket-message to server and gets response
 */
export function messageSelectInteraction(socket) {
    return function (e) {
        const select = e.currentTarget;
        let li = select.parentElement;
        const _id = li.getAttribute("data-id") || undefined;
        if (_id && select.value === "delete") {
            socket.emit("delete", _id);
            socket.on("deleted", (ok) => {
                let em = document.createElement("em");
                em.textContent = ok;
                li.innerHTML = "";
                li.append(em);
            });
        } else {
            console.log("nothing yet");
        }
    };
}

/**
 * Takes an li html element and sets the data-tid attribute
 * to a temporary id it makes sure that it is not repeated in the last 100 items.
 * this value is used to locate the element and add a database unique _id upon saving
 * @param items - html li elements. It should receive the last 100 items
 * @returns - temporary id
 */
export function tempId(items) {
    const tid = Math.random().toString(10);
    if (!Array.isArray(items) || items.length == 0) return tid;
    else {
        const match = items.some(
            (item) => item.getAttribute("data-tid") === tid
        );
        if (!match) return tid;
        else {
            return tempId(items);
        }
    }
}

/* replaces the temporary id for a permanent one generated
 * at the database*/
export function replaceTId(element, _id) {
    element.setAttribute("data-id", _id);
    element.removeAttribute("data-tid");
}

export function messageItemInteraction (socket, select) {
return () => {
    //'this' is the current element target
    let li = select.parentElement;
    const _id = li.getAttribute('data-id')
    if ( _id!=="" && select.value === "delete") {
        socket.emit("delete", _id);
        socket.on("deleted", () => {
            const em = document.createElement("em");
            em.innerText =
                "Message was deleted. It will dissapear in 5 seconds.";
            li.append(em);
            setTimeout(() => li.remove(), 3000);
        });
    } else {
        console.log("Item not saved yet");
    }
}}

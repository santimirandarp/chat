/**
 * Takes an li html element and sets the data-tid attribute
 * to a temporary id it makes sure that it is not repeated in the last 100 items.
 * this value is used to locate the element and add a database unique _id upon saving
 * @param items - html elements. It should receive the last 100 items
 */
export function tempId(items) {
    const tid = Math.random().toString(10);
    if (!Array.isArray(items) || items.length == 0)  return tid;
     else {
        const match = items.some(item=>item.getAttribute("data-tid")===tid) 
        if (!match) return tid;
        else {
            return tempId(items);
        }
    } 
}

//first 5 symbols (0,1,2,3,4)
export const msgDate = (createdAt) =>
    new Date(createdAt).toTimeString().substr(0, 5);
/**
 * Creates html element with attributes
 * @param name - html string name
 * attributes object with key values
 * @returns html element
 */
export function htmlCreate(name, attributes) {
    const element = document.createElement(name);
    const keys = attributes instanceof Object && Object.keys(attributes);
    if (Array.isArray(keys) && keys.length !== 0) {
        keys.forEach((attr) => element.setAttribute(attr, attributes[attr]));
    }
    return element;
}
// Creates the <select> element for the messgaes
export function createSelect() {
    const select = htmlCreate("select", {
        class: "msgOpts",
        name: "operations",
    });
    const options = ["*", "delete", "update"];
    options.forEach((option) => {
        const element = htmlCreate("option", { value: option });
        element.innerText = option[0].toUpperCase() + option.slice(1);
        select.append(element);
    });
    return select;
}
export function messageSelectInteraction(socket) {
    return function (e) {
        const select = e.currentTarget;
        let li = select.parentElement;
        const _id = li.getAttribute("data-id") || undefined;
        if (_id && select.value === "delete") {
            socket.emit("delete message", _id);
            socket.on("message deleted", (ok) => {
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
export function replaceTId(element, _id) {
    element.setAttribute("data-id", _id);
    element.removeAttribute("data-tid");
}

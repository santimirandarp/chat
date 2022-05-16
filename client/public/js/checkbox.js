const checkbox = document.getElementById("seepwd");
const password = document.getElementById("password");

const togglePasswordToText = (element) =>
    element.type === "password"
        ? (element.type = "text")
        : (element.type = "password");

checkbox.addEventListener("click", () => togglePasswordToText(password));

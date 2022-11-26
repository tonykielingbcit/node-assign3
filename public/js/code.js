const submitBt = document.getElementById("submitButton");
const txtArea = document.getElementById("txtArea");
const message = document.getElementById("message");
let changesOnTxtArea = false;

txtArea && txtArea.addEventListener("input", _ => changesOnTxtArea = true );

submitBt && submitBt.addEventListener("click", e => {
    if (!changesOnTxtArea)  {
        e.preventDefault();
        txtArea.style.border = "4px solid red";
        message.textContent = "Please, type something.";
        message.style.color = "red";
        txtArea.focus();
    }
});

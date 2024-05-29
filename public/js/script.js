// Show Alert
const showAlert = document.getElementById("alert");
const inAlert = document.querySelector("[show-alert]");
if(inAlert){
    const exit = document.querySelector("[exit]");
    console.log(exit);
    const time = parseInt(inAlert.getAttribute('time'));
    setTimeout(() => {
        showAlert.classList.add("hidden-alert");
    },time);
    exit.addEventListener("click", () => {
        showAlert.classList.add("hidden-alert");
    })
}
// End Show Alert
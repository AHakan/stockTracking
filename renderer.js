const electron = require("electron");
const { ipcRenderer } = electron;

let openAdd = document.querySelector("#openAddProduct");
openAdd.addEventListener("click", ()=>{
    ipcRenderer.send("add:Open");
})
let openCatalog = document.querySelector("#openCatalogProduct");
openCatalog.addEventListener("click", ()=>{
    ipcRenderer.send("catalog:Open");
})
let openSearch = document.querySelector("#openSearchProduct");
openSearch.addEventListener("click", ()=>{
    ipcRenderer.send("search:Open");
})
let closeButton = document.querySelector("#butonCikis");
closeButton.addEventListener("click", ()=> {
    ipcRenderer.send("index:Close")
});


ipcRenderer.on("eklemeOnay", (e, mesaj)=>{

    const container = document.querySelector(".container")

    const div = document.createElement("div")
    div.className = "alert alert-success"
    div.role = "alert"
    div.innerText = mesaj;
    
    container.appendChild(div);
    setTimeout(function(){
        container.removeChild(div)
    },5000);
})

ipcRenderer.on("eklemeOlmadi", (e, mesaj2)=>{
    const container = document.querySelector(".container")

    const div2 = document.createElement("div")
    div2.className = "alert alert-danger"
    div2.role = "alert"
    div2.innerText = mesaj2;
    
    container.appendChild(div2);
    setTimeout(function(){
        container.removeChild(div2)
    },5000);
})
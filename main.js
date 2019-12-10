// Modules to control application life and create native browser window
const {app, BrowserWindow, ipcMain} = require('electron')

const db = require("./lib/connection").db

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let addWindow;
let catalogWindow;
let searchWindow;
var addItemList=[]
var i="'";

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 1000,
    frame: false,
    fullscreen: false,
    webPreferences: {
      nodeIntegration: true
    },
    icon: "assets/logo.png"
  })
  
  // and load the index.html of the app.
  mainWindow.loadFile('index.html')
  mainWindow.setResizable(false);
  mainWindow.on('closed', function () {
    mainWindow = null
  })

  ipcMain.on("index:Close", ()=> {
    mainWindow.close();
    mainWindow = null
  })
  ipcMain.on("add:Open", () =>{
    addProductWindow()
  })
  ipcMain.on("add:Close", () =>{
    addWindow.close();
    addWindow = null
  })
  ipcMain.on("add:Item1", (err, data) =>{
    addItemList.push(data)
  })
  ipcMain.on("add:Item2", (err, data) =>{
    addItemList.push(data)
  })
    ipcMain.on("add:Item3", (err, data) =>{
      addItemList.push(data)
  })
  ipcMain.on("add:Item4", (err, data) =>{
    addItemList.push(data)
  })
  ipcMain.on("add:Item5", (err, data) =>{
    addItemList.push(data)
  })
  ipcMain.on("add:Item6", (err, data) =>{
    addItemList.push(data);
    addWindow.close();
    addWindow = null
    db.query("INSERT INTO Products (UrunAd, UrunMarka, BarkodNo, UrunAdet, UrunSKT, UrunFiyat) VALUES ( ? )", [addItemList], (error, result)=>{
      if(result!=undefined){
        mainWindow.webContents.send("eklemeOnay", "Ürün başarıyla eklendi.")
      }
      else{
        mainWindow.webContents.send("eklemeOlmadi", "Aynı barkod numarasına sahip ürün vardır.")
      }
    })
    addItemList=[]
  })


// Catalog Window bolumu baslangic
  ipcMain.on("catalog:Open", () =>{
    productCatalogWindow()
  })
  ipcMain.on("catalog:Close", () =>{
    catalogWindow.close();
    catalogWindow = null
  })
  
  ipcMain.on("remove:Data", (err, data)=>{
    db.query("DELETE FROM Products WHERE BarkodNo = ?", data, (e,r,f)=>{
      //catalogWindow.webContents.send("silmeOldu", "Ürün silindi.") //HATALI BÖLÜM
      catalogWindow.close();
      catalogWindow = null
      productCatalogWindow()
      
    })
  })
// Catalog Window bolumu bitis

// Search Window bolumu baslangic

  ipcMain.on("search:Open", ()=>{
    searchProductWindow();
  })
  ipcMain.on("search:Close", () =>{
    searchWindow.close();
    searchWindow = null
  })

  ipcMain.on("search:Barkod", (e, data)=>{
    db.query("SELECT * FROM Products WHERE BarkodNo = ?", data, (e,r,f)=>{
      searchWindow.webContents.send("searchSonuc", r);
    })
  })


}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

function addProductWindow() {
  addWindow = new BrowserWindow({
    width: 400,
    height: 750,
    frame: false,
    webPreferences: {
      nodeIntegration: true
    }
  })

  // and load the index.html of the app.
  addWindow.loadFile('html/addWindow.html')
  addWindow.setResizable(false);

}
function productCatalogWindow() {
  catalogWindow = new BrowserWindow({
    width: 1100,
    height: 500,
    frame: false,
    webPreferences: {
      nodeIntegration: true
    }
  })

  // and load the index.html of the app.
  catalogWindow.loadFile('html/catalogWindow.html')
  catalogWindow.setResizable(false);

  // Veritabanı baslangic
  catalogWindow.webContents.once("dom-ready", ()=>{
    db.query("SELECT * FROM Products", (error, results, fields)=>{ 
      catalogWindow.webContents.send("initApp", results)
    });
    db.query("SELECT count(BarkodNo) as Adet FROM Products", (error, rescount, fields)=>{ 
      catalogWindow.webContents.send("data:Count", rescount)
    })
  });

}
function searchProductWindow() {
  searchWindow = new BrowserWindow({
    width: 1100,
    height: 300,
    frame: false,
    webPreferences: {
      nodeIntegration: true
    }
  })

  // and load the index.html of the app.
  searchWindow.loadFile('html/searchWindow.html')
  searchWindow.setResizable(false);


}
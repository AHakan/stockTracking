
const {app, BrowserWindow, ipcMain} = require('electron')

const db = require("./lib/connection").db


let mainWindow;
let addWindow;
let catalogWindow;
let searchWindow;
let editWindow;
let categoriesWindow;
let userWindow;
var addItemList=[]
var editItemList=[]
var i="'";


function createWindow () {

  mainWindow = new BrowserWindow({
    width: 1300,
    height: 768,
    frame: false,
    fullscreen: false,
    webPreferences: {
      nodeIntegration: true
    },
    icon: "assets/logo.ico"
  })
  

  mainWindow.loadFile('index.html')
  mainWindow.setResizable(false);
  mainWindow.on('closed', function () {
    mainWindow = null
  })

  ipcMain.on("index:Close", ()=> {
    app.quit();
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
    addItemList.push(data)
  })
  ipcMain.on("add:Item7", (err, data) =>{
    addItemList.push(data);
    addItemList.push("1");
    addWindow.close();
    addWindow = null
    db.query("INSERT INTO Products (UrunAd, UrunMarka, BarkodNo, UrunAdet, UrunSKT, UrunFiyat, catID, userID) VALUES ( ? )", [addItemList], (error, result)=>{
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
    console.log(data)
    db.query("DELETE FROM Products WHERE BarkodNo = ?", data, (e,r,f)=>{
      editWindow.close();
      editWindow = null
      catalogWindow.close();
      catalogWindow = null
      mainWindow.webContents.send("eklemeOnay", "Ürün başarıyla silindi.")
      productCatalogWindow()
      
    })
  })

  // Urun Duzenleme Sayfasi Baslangic
  ipcMain.on("edit:Data", (err, data)=>{
    editProductWindow()
    editWindow.webContents.once("dom-ready", ()=>{
      db.query("SELECT * FROM Products as p, Categories as c, Users as u WHERE p.catID=c.id and p.userID=u.UserID and p.BarkodNo = ? ", data, (e,result,f)=>{
        editWindow.webContents.send("eskiVeri", result);
      })
    });
  })

  ipcMain.on("edit:Close", (err, data)=>{
    editWindow.close();
    editWindow = null
  })


  ipcMain.on("edit:Item1", (err, data) =>{
    editItemList.push(data)
  })
  ipcMain.on("edit:Item2", (err, data) =>{
    editItemList.push(data)
  })
  ipcMain.on("edit:Item3", (err, data) =>{
    editItemList.push(data)
  })
  ipcMain.on("edit:Item4", (err, data) =>{
    editItemList.push(data)
  })
  ipcMain.on("edit:Item5", (err, data) =>{
    editItemList.push(data)
    db.query("UPDATE Products (UrunAd, UrunMarka, BarkodNo, UrunAdet, UrunFiyat) SET ( ? )", [editItemList], (error, result)=>{
      console.log(error)
      console.log(editItemList)
      console.log(result)
      if(result!=undefined){
        mainWindow.webContents.send("eklemeOnay", "Ürün başarıyla düzenlendi")
      }
      else{
        mainWindow.webContents.send("eklemeOlmadi", "Ürün düzenleme de hata oluştu.")
      }
    })
    addItemList=[]
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
    db.query("SELECT * FROM Products as p, Categories as c, Users as u WHERE p.catID=c.id and p.userID=u.UserID and p.BarkodNo = ? ", data, (e,r,f)=>{
      searchWindow.webContents.send("searchSonuc", r);
    })
  })


  //Kategori Window bolumu baslangic

  ipcMain.on("categories:Open", ()=>{
    productCategoriesWindow();
  })

  ipcMain.on("categories:Close", ()=>{
    categoriesWindow.close();
    categoriesWindow = null
  })

  ipcMain.on("categories:newAdd", (e, data)=>{
    db.query("SELECT name FROM Categories WHERE name= ?", data, (e,result,f)=>{
      if(result[0]==undefined){
        db.query("INSERT INTO Categories (name) VALUES ( ? )", data, (error, result)=>{
          if(result!=undefined){
            mainWindow.webContents.send("eklemeOnay", "Kategori başarıyla eklendi.")
            categoriesWindow.close();
            categoriesWindow = null
            productCategoriesWindow();
          }
        })
      }
      else if(result[0].name==data){
        mainWindow.webContents.send("eklemeOlmadi", "Eklemek istediğiniz kategori zaten vardır.")
      }
      else{
        db.query("INSERT INTO Categories (name) VALUES ( ? )", data, (error, result)=>{
          if(result!=undefined){
            mainWindow.webContents.send("eklemeOnay", "Kategori başarıyla eklendi.")
            categoriesWindow.close();
            categoriesWindow = null
            productCategoriesWindow();
          }
        })
      }
    })

  })


  ipcMain.on("user:Open", ()=>{
    userPanelWindow();
  })
  ipcMain.on("user:Close", ()=>{
    userWindow.close();
    userWindow = null
  })
}

app.on('ready', createWindow)


app.on('window-all-closed', function () {

  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {

  if (mainWindow === null) {
    createWindow()
  }
})

function addProductWindow() {
  addWindow = new BrowserWindow({
    width: 400,
    height: 600,
    frame: false,
    webPreferences: {
      nodeIntegration: true
    }
  })

  addWindow.loadFile('html/addWindow.html')
  addWindow.setResizable(false);

  addWindow.webContents.once("dom-ready", ()=>{
    db.query("SELECT * FROM Categories ", (error, results, fields)=>{ 
      addWindow.webContents.send("categories:addWindow", results)
    });
  });
}
function productCatalogWindow() {
  catalogWindow = new BrowserWindow({
    width: 1200,
    height: 500,
    frame: false,
    webPreferences: {
      nodeIntegration: true
    }
  })


  catalogWindow.loadFile('html/catalogWindow.html')
  catalogWindow.setResizable(false);

  // Veritabanı baslangic
  catalogWindow.webContents.once("dom-ready", ()=>{
    db.query("SELECT * FROM Products as p, Categories as c, Users as u WHERE p.catID=c.id and p.userID=u.UserID", (error, results, fields)=>{ 
      catalogWindow.webContents.send("initApp", results)
    });
    db.query("SELECT count(p.BarkodNo) as Adet FROM Products as p WHERE p.BarkodNo!=''", (error, rescount, fields)=>{ 
      catalogWindow.webContents.send("data:Count", rescount)
    })
  });

}
function searchProductWindow() {
  searchWindow = new BrowserWindow({
    width: 1200,
    height: 300,
    frame: false,
    webPreferences: {
      nodeIntegration: true
    }
  })


  searchWindow.loadFile('html/searchWindow.html')
  searchWindow.setResizable(false);

}


function editProductWindow(){
  editWindow = new BrowserWindow({
    width: 1200,
    height: 210,
    frame: false,
    webPreferences:{
      nodeIntegration: true
    }
  })
  editWindow.loadFile('html/editWindow.html')
  editWindow.setResizable(false);
}


function productCategoriesWindow(){
  categoriesWindow = new BrowserWindow({
    width: 400,
    height: 600,
    frame: false,
    webPreferences:{
      nodeIntegration: true
    }
  })

  categoriesWindow.loadFile('html/categoriesWindow.html')
  categoriesWindow.setResizable(false);

  categoriesWindow.webContents.once("dom-ready", ()=>{
    db.query("SELECT * FROM Categories ", (error, results, fields)=>{ 
      categoriesWindow.webContents.send("categories", results)
    });
  });
}

function userPanelWindow(){
  userWindow = new BrowserWindow({
    width: 400,
    height: 600,
    frame: false,
    webPreferences:{
      nodeIntegration: true
    }
  })

  userWindow.loadFile('html/userWindow.html')
  userWindow.setResizable(false);

  userWindow.webContents.once("dom-ready", ()=>{
    db.query("SELECT * FROM Users ", (error, results, fields)=>{ 
      userWindow.webContents.send("users", results)
    });
  });
}
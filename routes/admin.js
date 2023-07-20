var express = require('express');
var router = express.Router();
var productHelpers = require("../helpers/product-helpers");
var folder = require("../config/folder");
var lowercase = require('@stdlib/string-lowercase');





/* GET users listing. */
router.get('/', function (req, res, next) {   
  productHelpers.getProducts().then((products)=>{
    res.render("admin/products", { admin: true, products })
  })
});

router.get("/products", (req, res) => {
  productHelpers.getProducts().then((products)=>{
    res.redirect("/admin")
  })
})

router.get("/add-product", (req, res) => {
  res.render("admin/add-products", { admin: true })
})

router.post("/add-product", (req, res) => {
  // console.log(req.body);
  // console.log(req.files.image);
  let features = req.body.key_features;
  req.body.key_features = features.split(",")
  let tags = req.body.tags;
      tags = lowercase(tags)
  req.body.tags = tags.split(",")
  // console.log(req.body);
  
  productHelpers.addProduct(req.body).then((response) => {
    let images = req.files.image;
    let id = response.insertedId;
    let category = lowercase(req.body.category);
    // console.log(images);
    let directory1 = "./public/images/product/"
    folder.createFolderWithId(category, directory1);
    let directory2 = "./public/images/product/" + category + "/";
    folder.createFolderWithId(id, directory2);
    for (let i = 0; i < images.length; i++) {
      images[i].mv(directory2 + "/" + id + "/" + i + ".jpg", (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log("Successfully Inserted Laptop");
        }
      })
    }
    res.redirect("/admin/add-product");
  })
})

router.get("/best-seller/:id",(req,res)=>{
  productHelpers.addtoBestSeller(req.params.id).then((response)=>{
    res.redirect("/admin/products")
  })
})

router.get("/best-sellers",(req,res)=>{
  productHelpers.getBestSellers().then((products)=>{
    res.render("admin/best-seller",{admin: true,products})
  })
})

router.get("/new-arrivals/:id",(req,res)=>{
  productHelpers.addtoNewArivals(req.params.id).then((response)=>{
    res.redirect("/admin/products")
  })
})

router.get("/new-arrivals",(req,res)=>{
  productHelpers.getNewArivals().then((products)=>{
    res.render("admin/new-arrivals",{admin: true,products})
  })
})

router.get("/delete-product/:id",(req,res)=>{
  productHelpers.deleteProduct(req.params.id).then((response)=>{
    res.redirect("/admin/products")
  })
})

router.get("/remove-product-bestseller/:id",(req,res)=>{
  // console.log(req.params.id);
  productHelpers.deleteFromBestSellers(req.params.id).then((response)=>{
    res.redirect("/admin/best-sellers")
  })
})

router.get("/remove-product-newarrivals/:id",(req,res)=>{
  // console.log(req.params.id);
  productHelpers.deleteFromNewArrivals(req.params.id).then((response)=>{
    res.redirect("/admin/best-sellers")
  })
})

router.get("/orders",async(req,res)=>{
  let orders = await productHelpers.getOrders()
  console.log(orders);
   orders = orders.reverse()
    orders.forEach(order=>{
      order.products.forEach(item=>{
        item.products.forEach(product=>{
          product.name = product.name.slice(0, 15);
        })
      })
    })
    // console.log(orders);
    console.log("reversed array");
    console.log(orders);

    res.render("admin/orders",{admin:true,orders})
})

router.get("/users",(req,res)=>{
  productHelpers.getUsers().then((users)=>{
    console.log(users);
    res.render('admin/users',{admin:true, users})
  })
})

router.get("/blocked-users",(req,res)=>{
  res.render('admin/blocked-users',{admin:true})
})



module.exports = router;



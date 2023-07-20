var express = require("express");
var router = express.Router();
var userHelpers = require("../helpers/user-helpers");
var productHelpers = require("../helpers/product-helpers");
const { route } = require("./admin");
var ObjectId = require("mongodb").ObjectId;

const verifyLogin = (req, res, next) => {
    if (req.session.user && !req.session.admin) {
        next();
    } else {
        res.redirect("/");
    }
};

/* GET home page. */
router.get("/", async function (req, res, next) {
    let user = req.session.user;
    let cartCount = null;
    let listCount = null;
    let miniCart = [];
    let cartProducts;
    let totalAmount;
    if (user) {
        cartCount = await userHelpers.getCartCount(user._id);
        listCount = await userHelpers.getListCount(user._id);
        cartProducts = await userHelpers.getCartProducts(user._id);
        totalAmount = await userHelpers.getTotalAmount(user._id);
        totalAmount = totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 });
        cartProducts.forEach((item) => {
            item.products[0].quantity = item.quantity;
            miniCart.push(item.products[0]);
        });
        miniCart.forEach((product) => {
            product.name = product.name.slice(0, 15);
        });
        miniCart = miniCart.slice(0, 2);
    }
    // products = products.slice(0,1)
    // console.log(miniCart);

    let bestSellers = await productHelpers.getBestSellers();
    bestSellers.forEach((product) => {
        product.name = product.name.slice(0, 29);
    });
    let newArrivals = await productHelpers.getNewArivals();
    newArrivals.forEach((product) => {
        product.name = product.name.slice(0, 29);
    });
    userHelpers.getProducts().then((products) => {
        let laptops = [];
        let mobiles = [];
        products.forEach((product) => {
            product.name = product.name.slice(0, 29);
            if (product.category === "laptop") {
                laptops.push(product);
            } else if (product.category === "mobile") {
                mobiles.push(product);
            }
        });

        res.render("user/index", {
            user,
            laptops,
            mobiles,
            cartCount,
            listCount,
            miniCart,
            totalAmount,
            bestSellers,
            newArrivals,
        });
    });
});

router.post("/signup", (req, res) => {
    // console.log(req.body);
    userHelpers
        .doUserSignup(req.body)
        .then((response) => {
            // console.log(response);
            req.session.user = response.user;
            req.session.userLoggedIn = true;
            req.session.isAdmin = false;
            response.status = true;
            res.json(response);
        })
        .catch((err) => {
            console.log(err);
            res.json({ status: false, errMsg: err });
        });
});

router.post("/login", (req, res) => {
    // console.log(req.body);
    userHelpers
        .doUserLogin(req.body)
        .then((response) => {
            req.session.user = response.user;
            req.session.userLoggedIn = true;
            req.session.isAdmin = false;
            console.log("Login Successful");
            response.status = true;
            res.json(response);
        })
        .catch((err) => {
            console.log(err);

            res.json({ status: false, errMsg: err });
        });
});

router.get("/logout", (req, res) => {
    req.session.user = null;
    req.session.userLoggedIn = false;
    req.session.cartCount = null;
    req.session.listCount = null;
    // res.redirect("/")
    res.json({ status: true });
});

router.post("/add-to-cart", (req, res) => {
    let user = req.session.user;
    // console.log(req.body);
    // console.log(user._id);
    if (user) {
        userHelpers.addToCart(req.body.prodId, req.body.category, user._id).then(async (response) => {
            let cartItems = await userHelpers.getCartProducts(user._id);
            let totalAmount = await userHelpers.getTotalAmount(user._id);
            totalAmount = totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 });
            console.log(totalAmount);
            let miniCart = [];
            cartItems.forEach((item) => {
                item.products[0].quantity = item.quantity;
                miniCart.push(item.products[0]);
            });
            miniCart.forEach((product) => {
                product.name = product.name.slice(0, 15);
            });

            miniCart = miniCart.slice(0, 2);
            res.json({ status: true, minicart: miniCart, user, totalAmount });
        });
    } else {
        res.json({ status: false });
    }
});

router.post("/add-to-list", (req, res) => {
    // console.log(req.body);
    let user = req.session.user;
    // console.log(user);
    if (user) {
        userHelpers.addToList(req.body.prodId, user._id).then((response) => {
            res.json({ status: true });
        });
    } else {
        res.json({ status: false });
    }
});

router.get("/shopping-cart", async (req, res) => {
    let user = req.session.user;
    // console.log(user);
    let cartCount = null;
    let listCount = null;
    let miniCart = [];
    let totalAmount;
    if (user) {
        cartCount = await userHelpers.getCartCount(user._id);
        listCount = await userHelpers.getListCount(user._id);
        let cartProducts = await userHelpers.getCartProducts(user._id);
        totalAmount = await userHelpers.getTotalAmount(user._id);
        totalAmount = totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 });
        // console.log(cartProducts);
        let products = [];
        cartProducts.forEach((item) => {
            item.products[0].quantity = item.quantity;
            item.products[0].prodPrice =
                parseFloat(item.products[0].price.replace(/,/g, "")) * parseFloat(item.products[0].quantity);
            item.products[0].prodPrice = item.products[0].prodPrice.toLocaleString(undefined, { minimumFractionDigits: 2 });
            products.push(item.products[0]);
            miniCart.push(item.products[0]);
        });
        products.forEach((product) => {
            product.name = product.name.slice(0, 15);
        });
        miniCart = miniCart.slice(0, 2);

        // console.log(products);
        res.render("user/cart", { user, products, cartCount, listCount, miniCart, totalAmount });
    } else {
        res.render("user/cart", { user, cartCount, listCount, totalAmount });
    }
});

router.get("/wishlist", async (req, res) => {
    let user = req.session.user;
    // console.log(user);
    let cartCount = null;
    let listCount = null;
    let miniCart = [];
    let products;
    let totalAmount;
    if (user) {
        cartCount = await userHelpers.getCartCount(user._id);
        listCount = await userHelpers.getListCount(user._id);
        products = await userHelpers.getCartProducts(user._id);
        totalAmount = await userHelpers.getTotalAmount(user._id);
        totalAmount = totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 });
        // console.log(products);
        products.forEach((item) => {
            item.products[0].quantity = item.quantity;
            miniCart.push(item.products[0]);
        });
        miniCart.forEach((product) => {
            product.name = product.name.slice(0, 15);
        });
        miniCart = miniCart.slice(0, 2);

        let listProducts = await userHelpers.getListProducts(user._id);
        // console.log(listProducts);
        listProducts.forEach((product) => {
            product.name = product.name.slice(0, 15);
        });
        res.render("user/wishlist", { user, listProducts, cartCount, listCount, miniCart, totalAmount });
    } else {
        res.render("user/wishlist", { user, cartCount, listCount, totalAmount });
    }
});

router.post("/remove-from-cart", (req, res) => {
    let user = req.session.user;
    userHelpers.removeCartProduct(req.body.userId, req.body.prodId).then(async (response) => {
        let cartItems = await userHelpers.getCartProducts(user._id);
        let totalAmount = await userHelpers.getTotalAmount(user._id);
        let cartCount = await userHelpers.getCartCount(user._id);
        totalAmount = totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 });
        console.log(cartItems);
        let miniCart = [];
        let cart = [];
        cartItems.forEach((item) => {
            item.products[0].quantity = item.quantity;
            item.products[0].prodPrice =
                parseFloat(item.products[0].price.replace(/,/g, "")) * parseFloat(item.products[0].quantity);
            item.products[0].prodPrice = item.products[0].prodPrice.toLocaleString(undefined, { minimumFractionDigits: 2 });
            miniCart.push(item.products[0]);
            cart.push(item.products[0]);
        });
        miniCart.forEach((product) => {
            product.name = product.name.slice(0, 15);
        });

        miniCart = miniCart.slice(0, 2);
        res.json({ status: true, minicart: miniCart, user, totalAmount, cartCount, cart });
    });
});

router.post("/remove-from-list", (req, res) => {
    userHelpers.removeListProduct(req.body.userId, req.body.prodId).then((response) => {
        res.json({ status: true });
    });
});

router.post("/change-qty", (req, res) => {
    // console.log(req.body);
    userHelpers.changeQty(req.body).then((response) => {
        res.json(response);
    });
});

router.get("/single-product/:id", async (req, res) => {
    // console.log(req.params.id);
    let related = [];
    let user = req.session.user;
    let cartCount = null;
    let listCount = null;
    let miniCart = [];
    let product;
    let totalAmount;
    if (user) {
        cartCount = await userHelpers.getCartCount(user._id);
        listCount = await userHelpers.getListCount(user._id);
        product = await userHelpers.getCartProducts(user._id);
        totalAmount = await userHelpers.getTotalAmount(user._id);
        totalAmount = totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 });
        // console.log(products);
        product.forEach((item) => {
            item.products[0].quantity = item.quantity;
            miniCart.push(item.products[0]);
        });
        miniCart.forEach((product) => {
            product.name = product.name.slice(0, 15);
        });
        miniCart = miniCart.slice(0, 2);
    }
    userHelpers.getSingleProduct(req.params.id).then(async (product) => {
        // console.log(product);
        let reviews = await userHelpers.getReviews(req.params.id);
        // console.log(reviews);
        userHelpers.getSimilarProducts(product.category).then((response) => {
            response.forEach((product) => {
                product.name = product.name.slice(0, 29);
                related.push(product);
            });
        });
        // console.log(related);
        res.render("user/single-product", { user, cartCount, listCount, product, related, miniCart, totalAmount, reviews });
    });
});

router.get("/shop/:category", async (req, res) => {
    // console.log(req.params.id);
    let user = req.session.user;
    let cartCount = null;
    let listCount = null;
    let miniCart = [];
    let product;
    let totalAmount;
    if (user) {
        cartCount = await userHelpers.getCartCount(user._id);
        listCount = await userHelpers.getListCount(user._id);
        product = await userHelpers.getCartProducts(user._id);
        totalAmount = await userHelpers.getTotalAmount(user._id);
        totalAmount = totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 });
        // console.log(products);
        product.forEach((item) => {
            item.products[0].quantity = item.quantity;
            miniCart.push(item.products[0]);
        });
        miniCart.forEach((product) => {
            product.name = product.name.slice(0, 15);
        });
        miniCart = miniCart.slice(0, 2);
    }
    let products = await userHelpers.getProductsCategory(req.params.category);
    products.forEach((product) => {
        product.name = product.name.slice(0, 35);
    });
    let details = {
        category: req.params.category,
        length: products.length,
    };
    // console.log(products);
    res.render("user/products", { user, cartCount, listCount, products, details, miniCart, totalAmount });
});

router.get("/products", async (req, res) => {
    let query = {
        category: req.query.category === "all" ? "" : req.query.category,
        search: req.query.search,
    };
    console.log(query);
    let user = req.session.user;
    let cartCount = null;
    let listCount = null;
    let miniCart = [];
    let product;
    let totalAmount;
    if (user) {
        cartCount = await userHelpers.getCartCount(user._id);
        listCount = await userHelpers.getListCount(user._id);
        product = await userHelpers.getCartProducts(user._id);
        totalAmount = await userHelpers.getTotalAmount(user._id);
        totalAmount = totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 });
        // console.log(products);
        product.forEach((item) => {
            item.products[0].quantity = item.quantity;
            miniCart.push(item.products[0]);
        });
        miniCart.forEach((product) => {
            product.name = product.name.slice(0, 15);
        });
        miniCart = miniCart.slice(0, 2);
    }
    // console.log(req.body);
    let searchProducts = await userHelpers.searchProducts(query);
    searchProducts.forEach((product) => {
        product.name = product.name.slice(0, 35);
    });
    let details = {
        category: req.query.category === "all" ? "All Products" : req.query.category,
        length: searchProducts.length,
    };
    let search = {
        category: capitalizeFirstLetter(req.query.category),
        search: req.query.search,
    };
    function capitalizeFirstLetter(word) {
        return word.charAt(0).toUpperCase() + word.slice(1);
    }
    console.log(search);
    console.log(searchProducts);
    res.render("user/searched-products", { user, searchProducts, listCount, cartCount, miniCart, details, totalAmount,search });
});

// router.get("/search-products/:category/:search", async (req, res) => {
//     // console.log(req.params);
//     let query ={
//         category: req.params.category === "all" ? false : req.params.category,
//         search: req.params.search
//     }
// console.log(query);
// let searchProducts = await userHelpers.searchProducts(query);
// searchProducts.forEach((product) => {
//     product.name = product.name.slice(0, 35);
// });
// let details = {
//     category: query.category === false ? "All Products" : req.params.category ,
//     length: searchProducts.length,
// };
// let response = {
//     status:true,
//     products:searchProducts,
//     details:details
// }
// console.log(response);
// res.json(response)
// })

router.post("/product-modal", (req, res) => {
    userHelpers.getSingleProduct(req.body.prodId).then((response) => {
        console.log(response);
        res.json(response);
    });
});

router.get("/my-account", async (req, res) => {
    let user = req.session.user;
    let cartCount = null;
    let listCount = null;
    let miniCart = [];
    let product;
    let totalAmount;
    let orders;
    if (user) {
        cartCount = await userHelpers.getCartCount(user._id);
        listCount = await userHelpers.getListCount(user._id);
        product = await userHelpers.getCartProducts(user._id);
        totalAmount = await userHelpers.getTotalAmount(user._id);
        totalAmount = totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 });
        orders = await userHelpers.getMyOrders(user._id);
        pendingOrders = await userHelpers.getPendingOrders(user._id);
        orders = orders.reverse().slice(0, 5);
        pendingOrders = pendingOrders.reverse().slice(0, 5);
        orders.forEach((order) => {
            order.price = order.price.toLocaleString(undefined, { minimumFractionDigits: 2 });
        });
        pendingOrders.forEach((order) => {
            order.price = order.price.toLocaleString(undefined, { minimumFractionDigits: 2 });
        });
        product.forEach((item) => {
            item.products[0].quantity = item.quantity;
            miniCart.push(item.products[0]);
        });
        miniCart.forEach((product) => {
            product.name = product.name.slice(0, 15);
        });
        miniCart = miniCart.slice(0, 2);
        // console.log(orders[0].products);
        res.render("user/my-account", { user, listCount, cartCount, totalAmount, miniCart, orders, pendingOrders });
    } else {
        res.redirect("/");
    }
});

router.post("/update-profile", (req, res) => {
    let user = req.session.user;
    // console.log(req.body);
    userHelpers.updateUserProfile(req.body, user._id).then((response) => {
        // console.log(response);
        req.session.user = response;
        // console.log(user);
        res.redirect("/my-account");
    });
});

router.post("/update-address", (req, res) => {
    let user = req.session.user;
    console.log(req.body);
    userHelpers.updateUserAddress(req.body, user._id).then((response) => {
        // console.log(response);
        req.session.user = response;
        res.json({ status: true });
    });
});

router.post("/change-email", (req, res) => {
    let user = req.session.user;
    // console.log(req.body);
    userHelpers
        .changeEmail(req.body, user._id)
        .then((response) => {
            console.log(response);
            req.session.user = response;
            res.redirect("/my-account");
        })
        .catch((err) => {
            console.log(err);
            res.redirect("/my-account");
        });
});

router.post("/change-password", (req, res) => {
    let user = req.session.user;
    // console.log(req.body);
    userHelpers
        .changePassword(req.body, user._id)
        .then((response) => {
            // console.log(response);
            req.session.user = null;
            req.session.userLoggedIn = false;
            req.session.cartCount = null;
            req.session.listCount = null;
            res.redirect("/");
        })
        .catch((err) => {
            console.log(err);
            res.redirect("/my-account");
        });
});

router.get("/checkout", async (req, res) => {
    let user = req.session.user;
    let cartCount = null;
    let listCount = null;
    let miniCart = [];
    let cartProducts;
    let checkoutPrducts = [];
    let totalAmount;
    if (user) {
        cartCount = await userHelpers.getCartCount(user._id);
        listCount = await userHelpers.getListCount(user._id);
        cartProducts = await userHelpers.getCartProducts(user._id);
        totalAmount = await userHelpers.getTotalAmount(user._id);
        totalAmount = totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 });
        // console.log(products);
        cartProducts.forEach((item) => {
            item.products[0].quantity = item.quantity;
            item.products[0].prodPrice =
                parseFloat(item.products[0].price.replace(/,/g, "")) * parseFloat(item.products[0].quantity);
            item.products[0].prodPrice = item.products[0].prodPrice.toLocaleString(undefined, { minimumFractionDigits: 2 });
            miniCart.push(item.products[0]);
        });
        // console.log(cartProducts);
        // console.log(products);
        miniCart.forEach((product) => {
            product.name = product.name.slice(0, 15);
            checkoutPrducts.push(product);
        });
        miniCart = miniCart.slice(0, 2);
        res.render("user/checkout", { user, listCount, cartCount, totalAmount, miniCart, checkoutPrducts });
    } else {
        res.redirect("/");
    }
});

router.post("/checkout", verifyLogin, async (req, res) => {
    let user = req.session.user;
    req.body.payment = req.body.payment.split("=")[1];
    //   console.log(req.body);
    req.body.totalAmount = parseFloat(req.body.totalAmount.replace(/[^0-9.-]+/g, ""));

    let address = {
        flatNo: req.body["form_data[checkout_flatNo]"],
        area: req.body["form_data[checkout_area]"],
        pincode: req.body["form_data[checkout_pincode]"],
        landmark: req.body["form_data[checkout_landmark]"],
        district: req.body["form_data[checkout_district]"],
        state: req.body["form_data[checkout_state]"],
    };

    // console.log(address);
    console.log(user);

    userHelpers.updateUserAddress(address, user._id).then((response) => {
        // console.log(response);
        req.session.user = response;
    });

    console.log(user);

    let products = await userHelpers.getCartProducts(user._id);
    // console.log(products);

    userHelpers.placeOrder(req.body, products, user._id).then((response) => {
        // console.log(response);
        if (req.body.payment === "COD") {
            res.json({ response: { codSuccess: true } });
        } else {
            userHelpers.generateRazorPay(response.orderId, response.price).then((response) => {
                res.json({
                    response: response,
                    user: user,
                });
            });
        }
    });
});

router.post("/verify-payment", (req, res) => {
    let user = req.session.user;
    //  console.log(req.body);
    userHelpers
        .verifyPayment(req.body)
        .then(() => {
            console.log("paymet Success");
            let status = "Order Placed";
            userHelpers.changeOrderStatus(req.body["order[receipt]"], status).then((response) => {
                res.json({ status: true });
            });
        })
        .catch((err) => {
            console.log("payment failed");
            res.json({ status: false, errMsg: "Payment Failed" });
        });
});

router.post("/orderd-products", (req, res) => {
    userHelpers.getOrderdProduct(req.body.orderId).then((response) => {
        response.forEach((item) => {
            item.products[0].name = item.products[0].name.slice(0, 15);
        });
        res.json(response);
    });
});

router.get("/faq", async (req, res) => {
    let user = req.session.user;
    let cartCount = null;
    let listCount = null;
    let miniCart = [];
    let product;
    let totalAmount;
    let orders;
    if (user) {
        cartCount = await userHelpers.getCartCount(user._id);
        listCount = await userHelpers.getListCount(user._id);
        product = await userHelpers.getCartProducts(user._id);
        totalAmount = await userHelpers.getTotalAmount(user._id);
        totalAmount = totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 });
        orders = await userHelpers.getMyOrders(user._id);
        orders = orders.reverse().slice(0, 5);
        orders.forEach((order) => {
            order.price = order.price.toLocaleString(undefined, { minimumFractionDigits: 2 });
        });
        product.forEach((item) => {
            item.products[0].quantity = item.quantity;
            miniCart.push(item.products[0]);
        });
        miniCart.forEach((product) => {
            product.name = product.name.slice(0, 15);
        });
        miniCart = miniCart.slice(0, 2);
        // console.log(orders[0].products);
    }
    res.render("user/faq", { user, listCount, cartCount, miniCart, totalAmount });
});

router.post("/delete-pending-order", (req, res) => {
    userHelpers.deletePendingOrder(req.body.orderId).then((response) => {
        // console.log(response);
        res.json({ status: true });
    });
});

router.post("/submit-review", (req, res) => {
    console.log(req.body);
    if (req.body.comment != "" && req.body.author != "" && req.body.author_email != "") {
        userHelpers.addReview(req.body).then(async (response) => {
            let reviews = await userHelpers.getReviews(req.body.prodId);
            res.json({ status: true, reviews });
        });
    }
});

router.get("/contact", async (req, res) => {
    let user = req.session.user;
    let cartCount = null;
    let listCount = null;
    let miniCart = [];
    let product;
    let totalAmount;
    let orders;
    if (user) {
        cartCount = await userHelpers.getCartCount(user._id);
        listCount = await userHelpers.getListCount(user._id);
        product = await userHelpers.getCartProducts(user._id);
        totalAmount = await userHelpers.getTotalAmount(user._id);
        totalAmount = totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 });
        orders = await userHelpers.getMyOrders(user._id);
        orders = orders.reverse().slice(0, 5);
        orders.forEach((order) => {
            order.price = order.price.toLocaleString(undefined, { minimumFractionDigits: 2 });
        });
        product.forEach((item) => {
            item.products[0].quantity = item.quantity;
            miniCart.push(item.products[0]);
        });
        miniCart.forEach((product) => {
            product.name = product.name.slice(0, 15);
        });
        miniCart = miniCart.slice(0, 2);
    }
    res.render("user/contact", { user, listCount, cartCount, miniCart, totalAmount });
});

router.get("/about", async (req, res) => {
    let user = req.session.user;
    let cartCount = null;
    let listCount = null;
    let miniCart = [];
    let product;
    let totalAmount;
    let orders;
    if (user) {
        cartCount = await userHelpers.getCartCount(user._id);
        listCount = await userHelpers.getListCount(user._id);
        product = await userHelpers.getCartProducts(user._id);
        totalAmount = await userHelpers.getTotalAmount(user._id);
        totalAmount = totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 });
        orders = await userHelpers.getMyOrders(user._id);
        orders = orders.reverse().slice(0, 5);
        orders.forEach((order) => {
            order.price = order.price.toLocaleString(undefined, { minimumFractionDigits: 2 });
        });
        product.forEach((item) => {
            item.products[0].quantity = item.quantity;
            miniCart.push(item.products[0]);
        });
        miniCart.forEach((product) => {
            product.name = product.name.slice(0, 15);
        });
        miniCart = miniCart.slice(0, 2);
    }
    res.render("user/about", { user, listCount, cartCount, miniCart, totalAmount });
});

router.post("/pay-online", (req, res) => {
    let user = req.session.user;
    console.log(req.body);
    req.body.price = parseFloat(req.body.price.replace(/[^0-9.-]+/g, ""));
    console.log(req.body);
    userHelpers.generateRazorPay(req.body.orderId, req.body.price).then((response) => {
        res.json({
            response: response,
            user: user,
        });
    });
});

router.post("/changeorderStatus", (req, res) => {
    userHelpers.changeOrderStatus(req.body.orderId, req.body.status);
});

module.exports = router;

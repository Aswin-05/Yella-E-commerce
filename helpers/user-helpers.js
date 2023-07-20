require('dotenv').config()
var db = require("../config/connection");
var collection = require("../config/collection");
var ObjectId = require("mongodb").ObjectId;
var bcrypt = require("bcrypt");
const { response } = require("express");
var saltRounds = 10;
var lowercase = require("@stdlib/string-lowercase");
const Razorpay = require("razorpay");

var instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SERECT,
});

module.exports = {
    doUserLogin: (userData) => {
        return new Promise(async (resolve, reject) => {
            let user = await db.get().collection(collection.USER_COLLECTION).findOne({ email: userData.email });
            if (user) {
                let response = {};
                bcrypt.compare(userData.password, user.password).then((status) => {
                    if (status) {
                        response.status = true;
                        response.user = user;
                        resolve(response);
                    } else {
                        reject("Incorrect Password");
                    }
                });
            } else {
                reject("User not found");
            }
        });
    },

    doUserSignup: (userData) => {
        return new Promise(async (resolve, reject) => {
            let user = await db.get().collection(collection.USER_COLLECTION).findOne({ email: userData.email });

            if (user) {
                reject("User Exists! Please login.");
            } else {
                let response = {};
                userData.password_confirm = "";
                userData.password = await bcrypt.hash(userData.password, saltRounds);

                db.get()
                    .collection(collection.USER_COLLECTION)
                    .insertOne(userData)
                    .then((status) => {
                        // console.log(status);
                        if (status) {
                            response.status = true;
                            response.user = {
                                fname: userData.fname,
                                email: userData.email,
                                _id: status.insertedId,
                            };
                            // console.log(response);
                            resolve(response);
                        }
                    });
            }
        });
    },

    getProducts: () => {
        return new Promise(async (resolve, reject) => {
            await db
                .get()
                .collection(collection.SHOP_COLLECTION)
                .find()
                .toArray()
                .then((response) => {
                    resolve(response);
                });
        });
    },

    addToCart: (prodId, name, userId) => {
        // console.log(prodId, category, userId);
        let prodObj = {
            item: new ObjectId(prodId),
            name: name,
            quantity: 1,
        };
        // console.log(prodObj);
        return new Promise(async (resolve, reject) => {
            let userCart = await db
                .get()
                .collection(collection.CART_COLLECTION)
                .findOne({ user: new ObjectId(userId) });
            if (userCart) {
                //check for existing product in cart and update the count of that particular product by 1
                let prodExist = userCart.products.findIndex((product) => product.item == prodId);
                // console.log(prodExist);
                if (prodExist != -1) {
                    await db
                        .get()
                        .collection(collection.CART_COLLECTION)
                        .findOneAndUpdate(
                            { user: new ObjectId(userId), "products.item": new ObjectId(prodId) },
                            {
                                $inc: { "products.$[elem].quantity": 1 },
                            },
                            {
                                arrayFilters: [{ "elem.item": new ObjectId(prodId) }],
                            }
                        )
                        .then(() => {
                            resolve();
                        });
                } else {
                    db.get()
                        .collection(collection.CART_COLLECTION)
                        .updateOne(
                            { user: new ObjectId(userId) },
                            {
                                $push: {
                                    products: prodObj,
                                },
                            }
                        )
                        .then(() => {
                            resolve();
                        });
                }
            } else {
                // console.log("not found");
                let cartObj = {
                    user: new ObjectId(userId),
                    products: [prodObj],
                };
                db.get()
                    .collection(collection.CART_COLLECTION)
                    .insertOne(cartObj)
                    .then((response) => {
                        // console.log(response);
                        resolve(response);
                    });
            }
        });
    },

    addToList: (prodId, userId) => {
        // console.log(prodId, userId);

        let item = new ObjectId(prodId);

        return new Promise(async (resolve, reject) => {
            let userList = await db
                .get()
                .collection(collection.LIST_COLLECTION)
                .findOne({ user: new ObjectId(userId) });
            if (userList) {
                //check for existing product in list
                let prodExist = userList.products.findIndex((product) => product == prodId);
                if (prodExist == -1) {
                    db.get()
                        .collection(collection.LIST_COLLECTION)
                        .updateOne(
                            { user: new ObjectId(userId) },
                            {
                                $push: {
                                    products: item,
                                },
                            }
                        )
                        .then(() => {
                            resolve();
                        });
                }
            } else {
                console.log("not found");
                let listObj = {
                    user: new ObjectId(userId),
                    products: [item],
                };
                // console.log(listObj);
                db.get()
                    .collection(collection.LIST_COLLECTION)
                    .insertOne(listObj)
                    .then((response) => {
                        // console.log(response);
                        resolve(response);
                    });
            }
        });
    },

    getCartProducts: (userId) => {
        // console.log(userId);
        return new Promise(async (resolve, reject) => {
            let cartItems = await db
                .get()
                .collection(collection.CART_COLLECTION)
                .aggregate([
                    {
                        $match: { user: new ObjectId(userId) },
                    },
                    {
                        $unwind: "$products",
                    },
                    {
                        $project: {
                            item: "$products.item",
                            quantity: "$products.quantity",
                        },
                    },
                    {
                        $lookup: {
                            from: collection.SHOP_COLLECTION,
                            localField: "item",
                            foreignField: "_id",
                            as: "products",
                        },
                    },
                    {
                        $project: {
                            _id: 0,
                            quantity: 1,
                            products: 1,
                        },
                    },
                ])
                .toArray();
            //  console.log(cartItems);
            resolve(cartItems);
        });
    },
    getListProducts: (userId) => {
        // console.log("id is  "+userId);
        return new Promise(async (resolve, reject) => {
            let list = await db
                .get()
                .collection(collection.LIST_COLLECTION)
                .findOne({ user: new ObjectId(userId) });
            // console.log(list);
            let listItems = [];
            if (list) {
                listItems = await db
                    .get()
                    .collection(collection.LIST_COLLECTION)
                    .aggregate([
                        {
                            $match: { user: new ObjectId(userId) },
                        },
                        {
                            $project: {
                                _id: 1,
                                products: 1,
                            },
                        },
                        {
                            $lookup: {
                                from: collection.SHOP_COLLECTION,
                                let: { prodList: "$products" },
                                pipeline: [
                                    {
                                        $match: {
                                            $expr: {
                                                $in: ["$_id", "$$prodList"],
                                            },
                                        },
                                    },
                                ],
                                as: "products",
                            },
                        },
                        {
                            $project: { _id: 0, products: 1 },
                        },
                    ])
                    .toArray();
                resolve(listItems[0].products);
            } else {
                resolve(listItems);
            }
        });
    },
    getCartCount: (userId) => {
        return new Promise(async (resolve, reject) => {
            let count = 0;
            let cart = await db
                .get()
                .collection(collection.CART_COLLECTION)
                .findOne({ user: new ObjectId(userId) });
            if (cart) {
                for (let i = 0; i < cart.products.length; i++) {
                    count += cart.products[i].quantity;
                }
            }
            resolve(count);
        });
    },
    getListCount: (userId) => {
        return new Promise(async (resolve, reject) => {
            let count = 0;
            let cart = await db
                .get()
                .collection(collection.LIST_COLLECTION)
                .findOne({ user: new ObjectId(userId) });
            if (cart) {
                count = cart.products.length;
            }
            resolve(count);
        });
    },
    removeCartProduct: (userId, prodId) => {
        return new Promise((resolve, reject) => {
            db.get()
                .collection(collection.CART_COLLECTION)
                .updateOne(
                    { user: new ObjectId(userId), "products.item": new ObjectId(prodId) },
                    {
                        $pull: {
                            products: {
                                item: new ObjectId(prodId),
                            },
                        },
                    }
                )
                .then((response) => {
                    resolve(response);
                });
        });
    },
    removeListProduct: (userId, prodId) => {
        // console.log(userId,prodId);
        return new Promise((resolve, reject) => {
            db.get()
                .collection(collection.LIST_COLLECTION)
                .updateOne(
                    { user: new ObjectId(userId), products: new ObjectId(prodId) },
                    {
                        $pull: {
                            products: new ObjectId(prodId),
                        },
                    }
                )
                .then((response) => {
                    // console.log(response);
                    resolve(response);
                });
        });
    },
    changeQty: (details) => {
        console.log(details);
        details.count = parseInt(details.count);
        return new Promise((resolve, reject) => {
            if (details.quantity == 1 && details.count === -1) {
                db.get()
                    .collection(collection.CART_COLLECTION)
                    .updateOne(
                        { user: new ObjectId(details.userId), "products.item": new ObjectId(details.prodId) },
                        {
                            $pull: {
                                products: {
                                    item: new ObjectId(details.prodId),
                                },
                            },
                        }
                    )
                    .then((response) => {
                        resolve({ removeProduct: true });
                    });
            } else {
                db.get()
                    .collection(collection.CART_COLLECTION)
                    .findOneAndUpdate(
                        { user: new ObjectId(details.userId), "products.item": new ObjectId(details.prodId) },
                        {
                            $inc: { "products.$.quantity": details.count },
                        }
                    )
                    .then((response) => {
                        resolve(response);
                    });
            }
        });
    },
    getSingleProduct: (prodId) => {
        return new Promise((resolve, reject) => {
            db.get()
                .collection(collection.SHOP_COLLECTION)
                .findOne({ _id: new ObjectId(prodId) })
                .then((response) => {
                    resolve(response);
                });
        });
    },
    getSimilarProducts: (category) => {
        // console.log(category);
        return new Promise((resolve, reject) => {
            db.get()
                .collection(collection.SHOP_COLLECTION)
                .find({ category: { $eq: category } })
                .toArray()
                .then((response) => {
                    resolve(response);
                });
        });
    },
    getProductsCategory: (category) => {
        return new Promise((resolve, reject) => {
            db.get()
                .collection(collection.SHOP_COLLECTION)
                .find({ category: { $regex: new RegExp(category, "i") } })
                .toArray()
                .then((response) => {
                    resolve(response);
                });
        });
    },
    searchProducts: (details) => {
        // console.log(details);
        db.get().collection(collection.SHOP_COLLECTION).createIndex({ name: "text", description: "text" });
        return new Promise((resolve, reject) => {
            if (details.category) {
                db.get()
                    .collection(collection.SHOP_COLLECTION)
                    .find({
                        $text: { $search: details.search },
                        category: details.category,
                    })
                    .toArray()
                    .then((response) => {
                        resolve(response);
                    });
            } else {
                db.get()
                    .collection(collection.SHOP_COLLECTION)
                    .find({
                        $text: { $search: details.search },
                    })
                    .toArray()
                    .then((response) => {
                        resolve(response);
                    });
            }
        });
    },

    // searchProducts: (details) => {
    //     return new Promise((resolve, reject) => {
    //       if (details.category) {
    //         db.get()
    //           .collection(collection.SHOP_COLLECTION)
    //           .find({
    //             $and: [
    //               { $text: { $search: details.search } },
    //               { category: details.category }
    //             ]
    //           })
    //           .toArray()
    //           .then((response) => {
    //             resolve(response);
    //           })
    //           .catch((error) => {
    //             reject(error);
    //           });
    //       } else {
    //         db.get()
    //           .collection(collection.SHOP_COLLECTION)
    //           .find({
    //             name: { $regex: new RegExp(`\\b${details.search}\\b`, "i") }
    //           })
    //           .toArray()
    //           .then((response) => {
    //             resolve(response);
    //           })
    //           .catch((error) => {
    //             reject(error);
    //           });
    //       }
    //     });
    //   },            
                        

    getTotalAmount: (userId) => {
        return new Promise(async (resolve, reject) => {
            let cart = await db
                .get()
                .collection(collection.CART_COLLECTION)
                .findOne({ user: new ObjectId(userId) });
            // console.log(cart.user);
            if (cart) {
                db.get()
                    .collection(collection.CART_COLLECTION)
                    .aggregate([
                        {
                            $match: { user: new ObjectId(userId) },
                        },
                        {
                            $project: {
                                item: "$products.item",
                                quantity: "$products.quantity",
                            },
                        },
                        {
                            $lookup: {
                                from: collection.SHOP_COLLECTION,
                                localField: "item",
                                foreignField: "_id",
                                as: "product",
                            },
                        },
                        {
                            $project: {
                                _id: 1,
                                quantity: 1,
                                product: 1,
                            },
                        },
                        {
                            $group: {
                                _id: null,
                                total: {
                                    $sum: {
                                        $reduce: {
                                            input: "$product.price",
                                            initialValue: 0,
                                            in: {
                                                $add: [
                                                    "$$value",
                                                    {
                                                        $multiply: [
                                                            {
                                                                $toDouble: {
                                                                    $replaceAll: {
                                                                        input: "$$this",
                                                                        find: ",",
                                                                        replacement: "",
                                                                    },
                                                                },
                                                            },
                                                            {
                                                                $toInt: {
                                                                    $arrayElemAt: [
                                                                        "$quantity",
                                                                        { $indexOfArray: ["$product.price", "$$this"] },
                                                                    ],
                                                                },
                                                            },
                                                        ],
                                                    },
                                                ],
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    ])
                    .toArray()
                    .then((response) => {
                        resolve(response[0].total);
                    });
            } else {
                resolve(0);
            }
        });
    },
    updateUserProfile: (userData, userId) => {
        return new Promise((resolve, reject) => {
            db.get()
                .collection(collection.USER_COLLECTION)
                .updateOne(
                    { _id: new ObjectId(userId) },
                    {
                        $set: {
                            fname: userData.fname,
                            lname: userData.lname,
                            phone: userData.phone,
                            flatNo: userData.flatNo,
                            area: userData.area,
                            pincode: userData.pincode,
                            landmark: userData.landmark,
                            district: userData.district,
                            state: userData.state,
                        },
                    },
                    { upsert: true }
                )
                .then((response) => {
                    resolve(userData);
                });
        });
    },
    updateUserAddress: (address, userId) => {
        console.log(address);
        return new Promise((resolve, reject) => {
            db.get()
                .collection(collection.USER_COLLECTION)
                .updateOne(
                    { _id: new ObjectId(userId) },
                    {
                        $set: {
                            flatNo: address.flatNo,
                            area: address.area,
                            pincode: address.pincode,
                            landmark: address.landmark,
                            district: address.district,
                            state: address.state,
                        },
                    }
                )
                .then(() => {
                    db.get()
                        .collection(collection.USER_COLLECTION)
                        .findOne({ _id: new ObjectId(userId) })
                        .then((response) => {
                            // console.log(response);
                            resolve(response);
                        });
                });
        });
    },
    changeEmail: (data, userId) => {
        // console.log(data);
        return new Promise(async (resolve, reject) => {
            let emailExist = await db.get().collection(collection.USER_COLLECTION).findOne({ email: data.newEmail });
            if (!emailExist) {
                let user = await db
                    .get()
                    .collection(collection.USER_COLLECTION)
                    .findOne({ _id: new ObjectId(userId) });
                bcrypt.compare(data.password, user.password).then((status) => {
                    if (status) {
                        db.get()
                            .collection(collection.USER_COLLECTION)
                            .updateOne(
                                { _id: new ObjectId(userId) },
                                {
                                    $set: { email: data.newEmail },
                                }
                            )
                            .then(() => {
                                db.get()
                                    .collection(collection.USER_COLLECTION)
                                    .findOne({ _id: new ObjectId(userId) })
                                    .then((response) => {
                                        // console.log(response);
                                        resolve(response);
                                    });
                            });
                    } else {
                        reject("Current Password is incorrect");
                    }
                });
            }
        });
    },
    changePassword: (data, userId) => {
        return new Promise(async (resolve, reject) => {
            data.newPassword = await bcrypt.hash(data.newPassword, saltRounds);
            let user = await db
                .get()
                .collection(collection.USER_COLLECTION)
                .findOne({ _id: new ObjectId(userId) });
            bcrypt.compare(data.currentPassword, user.password).then((status) => {
                // console.log(status);
                if (status) {
                    db.get()
                        .collection(collection.USER_COLLECTION)
                        .updateOne(
                            { _id: new ObjectId(userId) },
                            {
                                $set: {
                                    password: data.newPassword,
                                },
                            }
                        )
                        .then((response) => {
                            resolve(response);
                        });
                } else {
                    reject("Current Password is incorrect");
                }
            });
        });
    },
    placeOrder: (order, products, userId) => {
        // console.log(order)
        // console.log(products);
        return new Promise((resolve, reject) => {
            let response = {};
            let status = order.payment === "COD" ? "Order Placed" : "Order Pending";
            let orderObj = {
                userId: new ObjectId(userId),
                deliveryDetails: {
                    firstName: order["form_data[checkout_fname]"],
                    lastName: order["form_data[checkout_lname]"],
                    flatNumber: order["form_data[checkout_flatNo]"],
                    area: order["form_data[checkout_area]"],
                    pincode: order["form_data[checkout_pincode]"],
                    landmark: order["form_data[checkout_landmark]"],
                    district: order["form_data[checkout_district]"],
                    state: order["form_data[checkout_state]"],
                    country: order["form_data[checkout_country]"],
                    email: order["form_data[checkout_email]"],
                    phone: order["form_data[checkout_phone]"],
                },
                price: order.totalAmount,
                products: products,
                paymentMethod: order.payment,
                orderStatus: status,
                date: new Date().toLocaleString()
            };

            db.get()
                .collection(collection.ORDER_COLLECTION)
                .insertOne(orderObj)
                .then((status) => {
                    // console.log(status);
                    // if(order.payment === "COD"){
                    db.get()
                        .collection(collection.CART_COLLECTION)
                        .deleteOne({ user: new ObjectId(userId) });
                    // };
                    response.orderId = status.insertedId;
                    response.price = order.totalAmount;
                    resolve(response);
                });
        });
    },
    generateRazorPay: (orderId, price) => {
        // console.log(orderId.toString());
        // console.log(price);
        return new Promise((resolve, reject) => {
            var options = {
                amount: price * 100, // amount in the smallest currency unit
                currency: "INR",
                receipt: orderId.toString(),
            };
            instance.orders.create(options).then((response) => {
                resolve(response);
            });
        });
    },
    verifyPayment: (details) => {
        return new Promise((resolve, reject) => {
            const crypto = require("crypto");
            var hmac = crypto.createHmac("sha256", "8GFlDiJOqHNGMxflGF2uJ7CP");
            hmac.update(details["payment[razorpay_order_id]"] + "|" + details["payment[razorpay_payment_id]"]);
            hmac = hmac.digest("hex");
            if (hmac === details["payment[razorpay_signature]"]) {
                resolve();
            } else {
                reject();
            }
        });
    },
    changeOrderStatus: (orderId,status) => {
        return new Promise((resolve, reject) => {
            db.get()
                .collection(collection.ORDER_COLLECTION)
                .updateOne(
                    { _id: new ObjectId(orderId) },
                    {
                        $set: { orderStatus: status },
                    }
                )
                .then((response) => {
                    //   db.get().collection(collection.CART_COLLECTION).deleteOne({user: new ObjectId(userId)})
                    resolve(response);
                });
        });
    },
    getMyOrders: (userId) => {
        return new Promise((resolve, reject) => {
            db.get()
                .collection(collection.ORDER_COLLECTION)
                .find({ userId: new ObjectId(userId), orderStatus: { $ne: 'Order Pending' } })
                .toArray()
                .then((response) => {
                    resolve(response);
                });
        });
    },
    getPendingOrders: (userId) => {
        return new Promise((resolve, reject) => {
            db.get()
                .collection(collection.ORDER_COLLECTION)
                .find({ userId: new ObjectId(userId), orderStatus: "Order Pending" })
                .toArray()
                .then((response) => {
                    resolve(response);
                });
        });
    },
    getOrderdProduct: (orderId) => {
        return new Promise(async (resolve, reject) => {
            await db
                .get()
                .collection(collection.ORDER_COLLECTION)
                .aggregate([
                    {
                        $match: { _id: new ObjectId(orderId) },
                    },
                    {
                        $project: {
                            _id: 0,
                            products: 1,
                        },
                    },
                ])
                .toArray()
                .then((response) => {
                    resolve(response[0].products);
                });
        });
    },
    deletePendingOrder: (orderId) => {
        return new Promise((resolve, reject) => {
            db.get()
                .collection(collection.ORDER_COLLECTION)
                .deleteOne({ _id: new ObjectId(orderId) })
                .then((response) => {
                    resolve(response);
                });
        });
    },
    addReview: (details) => {
        console.log(details);
        return new Promise((resolve, reject) => {
            let reviewObj = {
                prodId: new ObjectId(details.prodId),
                name: details.author,
                email: details.author_email,
                comment: details.comment,
            };
            db.get()
                .collection(collection.REVIEW_COLLECTION)
                .insertOne(reviewObj)
                .then((response) => {
                    resolve(response);
                });
        });
    },
    getReviews: (prodId) => {
        console.log(prodId);
        return new Promise((resolve, reject) => {
            db.get()
                .collection(collection.REVIEW_COLLECTION)
                .find({ prodId: new ObjectId(prodId) })
                .toArray()
                .then((response) => {
                    // console.log(response);
                    resolve(response);
                });
        });
    },
};

// let dbcollections = await db.get().listCollections().toArray()
// const collections = [
//   {
//     name: dbcollections[0].name,
//     localField: 'item',
//     foreignField: '_id',
//     as: 'product1'
//   },
//   {
//     name: dbcollections[1].name,
//     localField: 'item',
//     foreignField: '_id',
//     as: 'product2'
//   },
//   {
//     name: dbcollections[2].name,
//     localField: 'item',
//     foreignField: '_id',
//     as: 'product3'
//   },
//   {
//     name: dbcollections[3].name,
//     localField: 'item',
//     foreignField: '_id',
//     as: 'product4'
//   },
//   {
//     name: dbcollections[4].name,
//     localField: 'item',
//     foreignField: '_id',
//     as: 'product5'
//   }
// ]

// const pipeline = [
//   {
//     $match: { user: new ObjectId(userId) }
//   },
//   {
//     $unwind: "$products"
//   },
//   {
//     $project: {
//       item: "$products.item",
//       quantity: "$products.quantity"
//     }
//   },

// ];

// collections.forEach(collection => {
//   const lookupStage = {
//     $lookup: {
//       from: collection.name,
//       localField: collection.localField,
//       foreignField: collection.foreignField,
//       as: collection.as
//     }
//   };
//   pipeline.push(lookupStage);
// });

// const projectStage = {
//   $project: {
//     mergedResult: {
//       $mergeObjects: {
//         $arrayElemAt: ['$project1', 0] // Assuming there's only one result per lookup
//       },
//       $arrayElemAt: ['$project2', 0]
//       // Add more lookup results as needed
//     }
//   }
// };
// pipeline.push(projectStage);

// await db.get().collection('cart').aggregate(pipeline).toArray().then((result) => {
//   // console.log(result[0].laptops);
//   resolve(result)
// })

// for (let i = 0; i < dbcollections.length; i++) {
//   var collection =
// {
//   name: dbcollections[i].name,
//   localField: 'item',
//   foreignField: '_id',
//   as: dbcollections[i].name
// }
//   collections.push(collection)
// }

// const projectionStage = {
//   $project: collections.reduce(
//     (projection, collection) => ({
//       ...projection,
//       [collection.as]: 1
//     }),
//     {
//       _id: 1,
//       quantity:1
//     }
//   )
// };
// pipeline.push(projectionStage);

// search query
// { manufacture: { $regex: new RegExp(details.search, "i") } }
// Add more fields as needed for your search (e.g., category, tags, etc.)

// db.get().collection(collection.SHOP_COLLECTION).find({
//   $or: [
//     { name: { $regex: new RegExp(details.search, "i") } },
//     { name: { $in:  words.map(word => new RegExp(word, 'i')) } }
//     // { description:{ $in:  words.map(word => new RegExp(word, 'i')) } },
//     // { tags: { $in:  words.map(word => new RegExp(word, 'i')) } },
//     // { price: { $in:  words.map(word => new RegExp(word, 'i')) } },
//     // { manufacture: { $in:  words.map(word => new RegExp(word, 'i')) } }
//     // Add more fields as needed for your search (e.g., category, tags, etc.)
//   ]

//   //  name: {
//   //       $in: words.map(word => new RegExp(word, 'i'))
//   //     }

// })

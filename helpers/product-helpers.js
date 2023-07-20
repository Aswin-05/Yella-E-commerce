var db = require("../config/connection");
var collection = require("../config/collection");
var lowercase = require('@stdlib/string-lowercase');
const { response } = require("../app");
var ObjectId = require("mongodb").ObjectId;

module.exports = {

  addProduct: (product) => {
    console.log(product);

    return new Promise((resolve, reject) => {
      db.get().collection(collection.SHOP_COLLECTION).insertOne(product).then((response)=>{
        resolve(response)
      })
     
    })
  },

  getProducts:()=>{
    return new Promise(async(resolve,reject)=>{
      db.get().collection(collection.SHOP_COLLECTION).find().toArray().then((response)=>{
        // console.log(response);
        resolve(response);
      })
    })
  },

  addtoBestSeller:(prodId)=>{
    return new Promise(async(resolve,reject)=>{
      let bestSeller =await db.get().collection(collection.BEST_SELLER_COLLECTION).findOne({prodId: new ObjectId(prodId)})
      // console.log(bestSeller);
      if(!bestSeller){
        db.get().collection(collection.BEST_SELLER_COLLECTION).insertOne({prodId: new ObjectId(prodId)}).then((response)=>{
          resolve(response)
        })
      }else{
        resolve()
      }
    })
  },

  getBestSellers:()=>{
    return new Promise(async(resolve,reject)=>{
      let products =await db.get().collection(collection.BEST_SELLER_COLLECTION).aggregate([
        {
          $lookup:{
            from:collection.SHOP_COLLECTION,
            localField:"prodId",
            foreignField:"_id",
            as:"Products"
          }
        },
        {
          $project:{
            _id:0,
            Products:{$arrayElemAt:["$Products", 0]}
          }  
        },
        {
          $replaceRoot: {
            newRoot: "$Products"
          }
        }
      ]).toArray()
      // console.log(products);
      resolve(products)
    })
  },

  addtoNewArivals:(prodId)=>{
    return new Promise(async(resolve,reject)=>{
      let newArrivals =await db.get().collection(collection.NEW_ARRIVALS_COLLECTION).findOne({prodId: new ObjectId(prodId)})
      // console.log(newArrivals);
      if(!newArrivals){
        db.get().collection(collection.NEW_ARRIVALS_COLLECTION).insertOne({prodId: new ObjectId(prodId)}).then((response)=>{
          resolve(response)
        })
      }else{
        resolve()
      }
    })
  },

  getNewArivals:()=>{
    return new Promise(async(resolve,reject)=>{
      let products =await db.get().collection(collection.NEW_ARRIVALS_COLLECTION).aggregate([
        {
          $lookup:{
            from:collection.SHOP_COLLECTION,
            localField:"prodId",
            foreignField:"_id",
            as:"Products"
          }
        },
        {
          $project:{
            _id:0,
            Products:{$arrayElemAt:["$Products", 0]}
          }  
        },
        {
          $replaceRoot: {
            newRoot: "$Products"
          }
        }
      ]).toArray()
      // console.log(products);
      resolve(products)
    })
  },

  deleteProduct:(prodId)=>{
    return new Promise((resolve,reject)=>{
      db.get().collection(collection.SHOP_COLLECTION).deleteOne({_id: new ObjectId(prodId)}).then((response)=>{
        resolve(response)
      })
    })
  },

  deleteFromBestSellers:(prodId)=>{
    return new Promise((resolve,reject)=>{
      db.get().collection(collection.BEST_SELLER_COLLECTION).deleteOne({prodId: new ObjectId(prodId)}).then((response)=>{
        // console.log(response);
        resolve(response)
      })
    })
  },

  deleteFromNewArrivals:(prodId)=>{
    return new Promise((resolve,reject)=>{
      db.get().collection(collection.NEW_ARRIVALS_COLLECTION).deleteOne({prodId: new ObjectId(prodId)}).then((response)=>{
        // console.log(response);
        resolve(response)
      })
    })
  },

  getOrders:()=>{
    return new Promise((resolve,reject)=>{
      db.get().collection(collection.ORDER_COLLECTION).find({ orderStatus: { $ne: 'Order Pending' }}).toArray().then((response)=>{
        resolve(response)
      })
    })
  },

  getUsers:()=>{
    return new Promise((resolve,reject)=>{
      db.get().collection(collection.USER_COLLECTION).find().toArray().then((response)=>{
        resolve(response)
      })
    })
  }

}
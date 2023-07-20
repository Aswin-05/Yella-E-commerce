var db = require("../config/connection");
var collection = require("../config/collection");
const moment = require('moment');
const cron = require('node-cron');



cron.schedule('0 0 * * *', async () => {
 
  try {
    // Calculate the date one day ago
    const oneDayAgo = moment().subtract(1, 'day').toDate();

    // Delete the documents matching the criteria

    await db.get().collection(collection.ORDER_COLLECTION).deleteMany({
      orderStatus: 'Order Pending',
      createdAt: { $lt: oneDayAgo }
    })
    // const deleteResult = await collection.deleteMany({
    //   orderStatus: 'Order Pending',
    //   createdAt: { $lt: oneDayAgo }
    // });
  } catch (error) {
    console.error('Error deleting documents:', error);
  }
});
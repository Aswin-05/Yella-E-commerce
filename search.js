// 

// const MongoClient = require('mongodb').MongoClient;

// // Connection URL and database name
// const url = 'mongodb://localhost:27017';
// const dbName = 'yourDatabaseName';

// // Connect to the MongoDB server
// MongoClient.connect(url, function(err, client) {
//   if (err) {
//     console.log('Error connecting to MongoDB:', err);
//     return;
//   }

//   console.log('Connected successfully to the MongoDB server');

//   // Select the database
//   const db = client.db(dbName);

  // Specify the collections to perform lookups
  const collections = [
    {
      name: 'collection1',
      localField: 'field1',
      foreignField: 'field2',
      as: 'output1'
    },
    {
      name: 'collection2',
      localField: 'field3',
      foreignField: 'field4',
      as: 'output2'
    },
    // Add more collections and lookup stages as needed
  ];

  // Build the aggregation pipeline dynamically
  const pipeline = [
    {
      $match: {
        // Add match conditions if needed
      }
    }
  ];

  // Dynamically add the lookup stages to the pipeline
  collections.forEach(collection => {
    const lookupStage = {
      $lookup: {
        from: collection.name,
        localField: collection.localField,
        foreignField: collection.foreignField,
        as: collection.as
      }
    };
    pipeline.push(lookupStage);
  });

  // Execute the aggregation pipeline
  db.collection('yourSourceCollection').aggregate(pipeline).toArray(function(err, result) {
    if (err) {
      console.log('Error executing aggregation:', err);
      return;
    }

    // Process the aggregation result
    console.log('Aggregation result:', result);

    // Close the MongoDB connection
    client.close();
  });
// });


db.collection.find({ category: { $regex: /your_category_here/i } })

// If you want to find documents with a category similar to a given value (e.g., case-insensitive matching or partial matching),
//  you can use regular expressions with the $regex operator. Here's an example:
// In this query, /your_category_here/i is a regular expression where your_category_here is the pattern to match, 
// and the i flag makes the matching case-insensitive. This query will retrieve documents where the category field matches the specified pattern.
// Remember to replace collection with the actual name of your collection in MongoDB.


function searchProducts(event) {
  event.preventDefault();

  $.ajax({
    url: "/search-products",
    method: "post",
    data: {
      category: event.target.category.value,
      search: event.target.search.value
    },
    success: function (response) {
      if (response.status) {
        // Construct the HTML content to append
        var htmlContent = `
          <!-- Begin Li's Breadcrumb Area -->
          <div class="breadcrumb-area">
              <div class="container">
                  <div class="breadcrumb-content">
                      <ul>
                          <li><a href="/">Home</a></li>
                          ${
                            response.details.category
                              ? `<li class="active">${response.details.category}</li>`
                              : '<li class="active">All Products</li>'
                          }
                      </ul>
                  </div>
              </div>
          </div>
          <!-- Li's Breadcrumb Area End Here -->
          <!-- Begin Li's Content Wraper Area -->
          <div class="content-wraper pt-60 pb-60 pt-sm-30 pt-xs-30">
              <div class="container">
                  <div class="row">
                      <div class="col-lg-12 order-2 order-lg-1 order-sm-1">
                          ${
                            response.searchProducts
                              ? `
                                <!-- shop-top-bar start -->
                                <div class="shop-top-bar mt-30">
                                    <!-- Rest of the shop-top-bar content -->
                                </div>
                                <!-- shop-top-bar end -->
                                <!-- shop-products-wrapper start -->
                                <div class="shop-products-wrapper">
                                    <div class="tab-content">
                                        <div id="grid-view" class="tab-pane fade active show" role="tabpanel">
                                            <div class="product-area shop-product-area">
                                                <div class="row">
                                                    ${
                                                      response.searchProducts.map(
                                                        product => `
                                                        <!-- single-product-wrap start -->
                                                        <div class="col-lg-3 col-md-3 col-sm-6 mt-40">
                                                            <!-- Rest of the single-product-wrap content -->
                                                        </div>
                                                        <!-- single-product-wrap end -->
                                                        `
                                                      ).join('')
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                        <!-- Rest of the tab content -->
                                    </div>
                                </div>
                                <!-- shop-products-wrapper end -->
                                `
                              : `
                                <div class="toolbar-amount text-muted">
                                    <span>No Results Found..</span>
                                </div>
                                `
                          }
                      </div>
                      <!-- Rest of the content -->
                  </div>
              </div>
          </div>
          <!-- Content Wraper Area End Here -->
        `;

        // Append the constructed HTML content to the element with the ID "main"
        $("#main").append(htmlContent);
      }
    },
    error: function (xhr, status, error) {
      // Handle error if needed
    }
  });
}

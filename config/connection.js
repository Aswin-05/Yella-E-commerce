const MongoClient = require("mongodb").MongoClient;

const state={
  db:null
}

module.exports.connect = function(done){
  const url = "mongodb://0.0.0.0:27017"
  const dbname = "Yella"

  MongoClient.connect(url)
  .then((data)=>{
    state.db = data.db(dbname)
  })
  .catch((err)=>{
    return done(err)
  })
  done();
}

module.exports.get = function(){
  return state.db
}
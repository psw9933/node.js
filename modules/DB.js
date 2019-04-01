var MongoClient=require('mongodb').MongoClient;
var DbName='app';
var DbUrl='mongodb://localhost:27017/'+DbName;
var ObjectID = require('mongodb').ObjectID;

function  connectDb(callback){
    MongoClient.connect(DbUrl,function(err,db){
        if(err){
            console.log('connect failed!');
            return;
        }
        console.log('connect success!');
          callback(db);
    })
}

//export modules
exports.ObjectID=ObjectID;
exports.find=function(collectionname,json,callback){
    console.log(json);
    connectDb(function(db){
        var DB = db.db(DbName);
        DB.collection(collectionname).find(json).toArray(function(err, result) { 
            if (err) console.log('find failed!');
            callback(err,result);
        });
        db.close();
    });
}

exports.insert=function(collectionname,json,callback){
    connectDb(function(db){
        var DB = db.db(DbName);
        DB.collection(collectionname).insertOne(json,function(err,data){
            if (err) console.log('insert failed!');
            callback(err,data);
        })
    })
}

exports.update=function(collectionname,json1,json2,callback){
    connectDb(function(db){
        var DB = db.db(DbName);
        DB.collection(collectionname).updateOne(json1,{$set:json2},function(err,data){
            if (err) console.log('updata failed!');
            callback(err,data);
        })
    })
}

exports.deleteOne=function(collectionname,json,callback){
    connectDb(function(db){
        var DB = db.db(DbName);
        DB.collection(collectionname).deleteOne(json,function(err,data){
            if (err) console.log('delete failed!');
            callback(err,data);
        })
    })
}
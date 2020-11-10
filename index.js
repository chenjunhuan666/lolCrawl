// let mongodb = require('mongodb')
// let MongoClient = mongodb.MongoClient;
// // let ObjetcId = mongodb.ObjectID

// var url = "mongodb://localhost:27017/"
// MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true}, (err, database) => {

//     if (err) throw err

//     var db = database.db('lol')

//     // var obj = { "user":"张三", "pwd": "123"}
//     // db.collection('lol').insertOne(obj, (err, result) => {
//     //     if (err) throw err
//     //     console.log("文档插入成功")
//     //     database.close()
//     // })
//     let where = {"user": '张三'}
//     let update = {$set:{ "pwd" : 666777}}
//     db.collection('lol').updateOne(where, update,(err, result) => {
//         if (err) throw err
//         console.log('更新成功')
//         database.close()
//     })
    
   
// })
 //https://game.gtimg.cn/images/lol/act/img/js/hero/1.js

 let axios = require('axios')

 // 插入多条数据
 function insetMany(collection, arr){
     return new Promise((resolve, reject) => {
        let MongoClient = require('mongodb').MongoClient
        var url = 'mongodb://localhost:27017/'
        MongoClient.connect(url, { useUnifiedTopology: true, useNewUrlParser: true}, (err, data) => {
            if (err) throw err
            var db = data.db('lol')
            db.collection(collection).insertMany(arr, (err, res) => {
                if(err) throw err
                console.log('插入的文档数量：'+res.insertedCount)
                data.close()
                resolve()   
            })
        })
     })
 }
 // 插入单条数据
 function insetOne(collection, arr){
     return new Promise((resolve, reject) => {
         let MongoClient = require('mongodb').MongoClient
         let url = 'mongodb://localhost:27017/'
         MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true}, (err, data) => {
             if(err) throw err
             var db = data.db('lol')
             db.collection(collection).insertOne(arr, (err, res) => {
                 if(err) throw err
                 console.log('文档插入成功')
                 data.close()
                 resolve()
             })
         })
     })
 }
 // 获取英雄列表
async function getHeroList(){
    let httpUrl = 'https://game.gtimg.cn/images/lol/act/img/js/heroList/hero_list.js'
    let result = await axios.get(httpUrl)
    // console.log(result.data.hero)
    await insetMany('herolist',result.data.hero)
    return result.data.hero 
}
// getHeroList()

// 获取英雄信息
async function getHeroInfo(heroId){
    let httpUrl = `https://game.gtimg.cn/images/lol/act/img/js/hero/${heroId}.js`
    let result = await axios.get(httpUrl)
    // console.log(result.data.hero)
    await insetOne('heroInfo',result.data.hero)
    return result.data
}

// 定义主函数，先获取所有英雄列表，并循环英雄列表将所有英雄详情内容载入。
async function run(){
    let herolist = await getHeroList()
    await herolist.reduce(async(prev, item, i) =>{
        await prev
        return new Promise(async (resolve, reject) => {
            await getHeroInfo(item.heroId)
            resolve()
        }),Promise.resolve()
    })
}
run()
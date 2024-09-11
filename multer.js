const multer = require('multer')

const storage = multer.memoryStorage()

function fileFilter(req,file,cb){
    let acceptable =[
        'image/png','image/jpeg','image/webp','image/svg'
    ]

    if(acceptable.indexOf(file.mimetype)!==-1){
        cb(null,true);
    } else{
        const newNames= acceptable.map((e)=>{
             return e.split("image/")[1];
        })
        cb(new Error(`only ${newNames.join(",")} are accepted.`),false)
    }


}
module.exports=multer({storage:storage,fileFilter:fileFilter,limits: { fileSize: 5 * 1024 * 1024 }}) //5MB
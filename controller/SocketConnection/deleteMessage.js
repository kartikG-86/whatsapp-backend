const messageModel = require('../../models/message')

const deleteMessage = async (req,res) => {
    const {msgId,deleteType} = req.body;
    console.log(req.body)
    try{
        const message = await messageModel.findOne({msgId:msgId})
        if(!message){
            return res.status(400).json({
                success:false,
                message:"Message doesn't exist"
            })
        }
        
        const updateMessage = await messageModel.updateOne({msgId:msgId},{deleteType:deleteType})

        if(updateMessage.modifiedCount > 0){
            return res.json({
                success:true,
                message:'Message Deleted successfully'
            })
        }

    }catch(err){
        return res.status(400).json({
            success:false,
            message:"Error generated while deleting message"
        })
    }
}

module.exports = deleteMessage
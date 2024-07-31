const groupModel = require('../../models/group')
const mongoose = require('mongoose')

const getGroupMember = async (req,res) => {
    const groupId = req.params.groupId
   const aggregation = [
    {
      '$match': {
        '_id': new mongoose.Types.ObjectId(groupId)
      }
    }, {
      '$unwind': {
        'path': '$memberUserIds', 
        'preserveNullAndEmptyArrays': false
      }
    }, {
      '$lookup': {
        'from': 'users', 
        'localField': 'memberUserIds', 
        'foreignField': '_id', 
        'as': 'user'
      }
    }, {
      '$group': {
        '_id': '$adminUserId', 
        'members': {
          '$push': '$$ROOT'
        }
      }
    }
  ]
  
  try{
      const members = await groupModel.aggregate(aggregation)
      
      if(members && members.length > 0){
        return res.json({
            success:true,
            message:"Your group member list",
            members:members
        })
      }else{
        return res.json({
            success:true,
            message:"No member exist",
            members:[]
        })
      }
  }catch(err){
     return res.status(400).json({
        success:false,
        message:"Error generated while fetching members list"
     })
  }

}

module.exports = getGroupMember
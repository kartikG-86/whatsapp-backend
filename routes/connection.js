const express = require('express')
const router = express.Router()

// create one to one connection
router.post('/createOnetoOne', require('../controller/SocketConnection/createOneToOneConnection'))

// getUser
router.get('/getUser/:id', require('../controller/SocketConnection/getUser'))

// search user
router.get('/searchUser/:userName', require('../controller/SocketConnection/searchUser'))

// prev messages
router.get('/prevMessages/:fromUserId/:toUserId', require('../controller/SocketConnection/fetchMessages'))

// user list
router.get('/userList/:userId', require('../controller/SocketConnection/chatUserList'))

// group
router.post('/createGroup', require('../controller/SocketConnection/createGroup'))
router.get('/getMemberList/:groupId', require('../controller/SocketConnection/getGroupMembers'))

module.exports = router
const express = require('express')
const router = express.Router()
const Browser = require('../models/Browser')

// Get all documents from DB
router.get('/', async (req, res) => {
    try {
        const posts = await Browser.find()
        res.json(posts)
        console.log(posts[0].title)
    } catch (err) {
        res.json({ message: err })
    }
})

// Get a specific document from DB by their id
router.get('/:postId', async (req, res) => {
    try {
        const post = await Browser.findById(req.params.postId)
        res.json(post)
    } catch (err) {
        res.json({ message: err })
    }
})

// Get a specific document from DB by their URL
router.get('/rooms/:roomURL', async (req, res) => {
    try {
        const post = await Browser.find({ url: req.params.roomURL })
        res.json(post)
    } catch (err) {
        res.json({ message: err })
    }
})

// Delete a document from DB
router.delete('/:postId', async (req, res) => {
    try {
        const removedPost = await Browser.remove({ _id: req.params.postId })
        res.json(removedPost)
    } catch (err) {
        res.json({ message: err })
    }
})

// Update a document in DB
router.patch('/:postId', async (req, res) => {
    try {
        const updatedPost = await Browser.updateOne(
            { _id: req.params.postId },
            {
                $set: {
                    title: req.body.title,
                    privacy: req.body.privacy,
                    visibility: req.body.visibility,
                    maxusers: req.body.maxusers,
                    connusers: req.body.connusers,
                    url: req.body.url,
                    userList: req.body.userList,
                    password: req.body.password
                }
            })
        res.json(updatedPost)
    } catch (err) {
        res.json({ message: err })
    }
})

router.post('/', async (req, res) => {
    const browser = new Browser({
        title: req.body.title,
        privacy: req.body.privacy,
        visibility: req.body.visibility,
        maxusers: req.body.maxusers,
        connusers: req.body.connusers,
        url: req.body.url,
        userList: req.body.userList,
        password: req.body.password
    })

    try {
        const savedPost = await browser.save()
        res.json(savedPost)
    } catch (err) {
        res.json({ message: err })
    }
})

module.exports = router
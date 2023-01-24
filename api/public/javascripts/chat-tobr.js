var jsonStream = require('duplex-json-stream')
var wrtcSwarm = require('webrtc-swarm')
var streamSet = require('stream-set')
var signalhub = require('signalhub')
var cuid = require('cuid')
const Automerge = require('automerge')

if (window.username === undefined || window.username == null) {
    var prompt_user = prompt("Please enter a username:", "")
    if (prompt_user == null || prompt_user == "") {
        location.reload()
    } else {
        window.username = prompt_user
    }
}

var pathURL = window.location.pathname.split('/')
if (pathURL[2] !== undefined) {
    // Declaring an available signalhub server that serves as a relay for peer-to-peer connections
    var hub = signalhub(pathURL[2], [
        'https://signalhub.pear-chat.com'
    ])
    var swarm = wrtcSwarm(hub)
    var streams = streamSet()
    var seq = 0
    var logs = {}
    var joinedStatus = false

    var splitPathname = window.location.pathname.split('/')
    var completePathname = '/' + splitPathname[1] + '/' + splitPathname[2]

    var room = {}
    var newRoom = {}

    const brUrl = "https://api.pear-chat.com/browser"

    // Adding before unload event listener on top to avoid issues
    window.addEventListener("beforeunload", (e) => {
        e.preventDefault();
        window.chat(window.username + " disconnected", "disconnect");
        swarm.close();

        // Remove current user from the list
        // Set PATCH method for before unload event fetch
        const requestOptions = {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newRoom)
        }

        fetch(brUrl + '/' + room._id, requestOptions);

        return null;
    });

    // Fetch the information for the first time
    setTimeout(() => {
        fetch(brUrl + completePathname)
        .then((response) => {
            return response.json()  // Convert the response object to JSON data
        })
        .then((res) => {            // Get the result of JSON response data
            if (res[0] !== undefined)
                room = res[0]
        })
        .then(() => {
            // Push new users to the user list div
            var userListHTML = ""

            room.userList.forEach((user) => {
                if (user === window.username) {
                    userListHTML = userListHTML + '<li>' + user + " (You)</li>"
                } else {
                    userListHTML = userListHTML + '<li>' + user + "</li>"
                }
            })
            $("#userList").html(userListHTML)
        })
        .then(() => {
            // Construct new modified room element for before unload event
            newRoom = {
                title: room.title,
                privacy: room.privacy,
                visibility: room.visibility,
                maxusers: room.maxusers,
                connusers: room.connusers - 1,
                url: room.url,
                userList: room.userList,
                password: (room.password) ? room.password : ""
            }

            // Remove user from userList
            for (var i = 0; i < newRoom.userList.length; i++) {
                if (newRoom.userList[i] === window.username) {
                    newRoom.userList.splice(i, 1)
                }
            }
        })
    }, 500) // Added a timer because sometimes this request is executed before the username is added to the user list

    // Initializing automerge document
    let remoteDoc = Automerge.from({ cards: [] })

    // Event triggered on connection
    swarm.on('peer', function (socket) {
        socket = jsonStream(socket)
        streams.add(socket)
        if (joinedStatus === false) {
            window.chat(window.username + " joined the chat", "welcome")
            joinedStatus = true

            // Fetch the information for current room every time a new user connects
            fetch(brUrl + completePathname)
                .then((response) => {
                    return response.json()  // Convert the response object to JSON data
                })
                .then((res) => {            // Get the result of JSON response data
                    if (res[0] !== undefined)
                        room = res[0]
                })
                .then(() => {
                    // Push new users to the user list div
                    var userListHTML = ""

                    room.userList.forEach((user) => {
                        if (user === window.username) {
                            userListHTML = userListHTML + '<li>' + user + " (You)</li>"
                        } else {
                            userListHTML = userListHTML + '<li>' + user + "</li>"
                        }
                    })
                    $("#userList").html(userListHTML)
                })
                .then(() => {
                    // Construct new modified room element for before unload event
                    newRoom = {
                        title: room.title,
                        privacy: room.privacy,
                        visibility: room.visibility,
                        maxusers: room.maxusers,
                        connusers: room.connusers - 1,
                        url: room.url,
                        userList: room.userList,
                        password: (room.password) ? room.password : ""
                    }

                    // Remove user from userList
                    for (var i = 0; i < newRoom.userList.length; i++) {
                        if (newRoom.userList[i] === window.username) {
                            newRoom.userList.splice(i, 1)
                        }
                    }
                })
        }
        socket.on('data', function (data) {
            // Avoid messages loops
            if (logs[data.log] <= data.seq) return

            // Get latest sequence number and send messages before disconnection
            if (data.seq < seq) {
                streams.forEach(function (otherFriend) {
                    var userConnected = false
                    for (let i = 0; i < remoteDoc.cards.length; i++) {
                        if (data.username === remoteDoc.cards[i].username) {
                            userConnected = true
                        }

                        if (userConnected === true) {
                            otherFriend.write(remoteDoc.cards[i])
                        }
                    }
                })
                data.seq = remoteDoc.cards[remoteDoc.cards.length - 1].seq + 1
            }
            logs[data.log] = data.seq

            if (data.type === "message") {
                // Write messages in a textbox for all connected users
                if (data.username == window.username) {
                    $("#chatbox").append('<div class="my-1 d-flex flex-column align-self-end"><div class="rounded px-2 py-1 bg-primary text-white">' + data.message + '</div><div class="text-muted small text-right">You at ' + data.date + '</div></div>')
                } else {
                    $("#chatbox").append('<div class="my-1 d-flex flex-column"><div class="rounded px-2 py-1 border">' + data.message + '</div><div class="text-muted small">From ' + data.username + ' at ' + data.date + '</div></div>')
                }
            } else if (data.type === "welcome") {
                // Write connection notification
                if (data.username != window.username) {
                    $("#chatbox").append('<div class="my-1 d-flex flex-column"><div class="text-center small"><strong>' + data.message + '</strong></div></div>')
                } else {
                    $("#chatbox").append('<div class="my-1 d-flex flex-column align-self-end"><div class="text-center small"><strong>You joined the chat</strong></div></div>')
                }
            } else if (data.type === "disconnect") {
                // Write disconnection notification
                if (data.username != window.username) {
                    $("#chatbox").append('<div class="my-1 d-flex flex-column"><div class="text-center small"><strong>' + data.message + '</strong></div></div>')
                } else {
                    $("#chatbox").append('<div class="my-1 d-flex flex-column align-self-end"><div class="text-center small"><strong>You disconnected</strong></div></div>')
                }
            }

            // Send message to other users
            streams.forEach(function (otherFriend) {
                otherFriend.write(data)
            })

            // Saving message in Automerge document for CRDTs purposes
            remoteDoc = Automerge.change(remoteDoc, 'Add card data', doc => {
                doc.cards.push(data)
            })

            // Saving latest sequence
            seq = data.seq
        })
    })

    swarm.on('disconnect', function (socket) {
        // Update the user list when someone is disconnected
        fetch(brUrl + completePathname)
            .then((response) => {
                return response.json()  // Convert the response object to JSON data
            })
            .then((res) => {            // Get the result of JSON response data
                if (res[0] !== undefined)
                    room = res[0]
            })
            .then(() => {
                // Push new users to the user list div
                var userListHTML = ""

                room.userList.forEach((user) => {
                    if (user === window.username) {
                        userListHTML = userListHTML + '<li>' + user + " (You)</li>"
                    } else {
                        userListHTML = userListHTML + '<li>' + user + "</li>"
                    }
                })
                $("#userList").html(userListHTML)
            })
            .then(() => {
                // Construct new modified room element for before unload event
                newRoom = {
                    title: room.title,
                    privacy: room.privacy,
                    visibility: room.visibility,
                    maxusers: room.maxusers,
                    connusers: room.connusers - 1,
                    url: room.url,
                    userList: room.userList,
                    password: (room.password) ? room.password : ""
                }

                // Remove user from userList
                for (var i = 0; i < newRoom.userList.length; i++) {
                    if (newRoom.userList[i] === window.username) {
                        newRoom.userList.splice(i, 1)
                    }
                }
            })

        joinedStatus = false
    })

    window.chat = function (message, type) {
        seq++
        var id = Math.random() // Generate a random id
        streams.forEach(function (socket) {
            data = {
                log: id,
                seq: seq,
                username: window.username,
                message: message,
                date: new Date().toLocaleString(),
                type: type
            }
            socket.write(data)
        })
    }
}
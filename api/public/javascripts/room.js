var pathURL = window.location.pathname.split('/')
var loaded = 0

$(document).ready(function () {
    $("#user-define").submit(function () {
        window.username = $("#user").val()
        $("#usertoshow").html(window.username)
        return false
    })

    $("#room-sel").submit(function () {
        var chatRedirect = document.getElementById("channel").value.toLowerCase()
        if (window.username === undefined) {
            alert("Please enter a username before entering a room")
            return false;
        }
        // Simulate an HTTP redirect:
        window.history.pushState(md5(chatRedirect), "", "/room/" + md5(chatRedirect))
        $.get(
            '/frontend/chat.html',
            false,
            function (data) {
                $("#chat").html(data)
            },
            'html'
        )
        return false;
    })

    if (pathURL.length > 1) {
        if (pathURL[2] !== 'undefined' && pathURL[2].length !== 0) {
            console.log("Path is defined and ready to go")
            $.get(
                '/frontend/chat.html',
                false,
                function (data) {
                    $("#chat").html(data)
                },
                'html'
            )
        }
    }
})
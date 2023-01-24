$(document).ready(function () {
    $("#msg-send").submit(function () {
        if (window.username === undefined) {
            alert("Please enter a username before proceeding")
        } else {
            window.chat($("#msgtosend").val(), "message")
        }
        return false
    })
})
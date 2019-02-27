$(document).ready(function () {

    var mailRoot = CONFIG.serverRoot + CONFIG.mailRoot;
    //var mailRoot = 'http://localhost:8080/mail/';

    console.log("loaded");
    $("#messageToSend").val('rtertgertgertg');
    $('button').on('click', '#mailContact', function (event) {
        event.preventDefault();
        console.log('sendMail clicked');
        var contactId = $('body').find('#contactId').val();

        var message = {
            message: $('body').find('#messageToSend').val()
        }

        $.ajax({
            url: mailRoot + contactId,
            method: 'post',
            async: false, //wait for response
            xhrFields: {
                withCredentials: true
            },
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify(message),
            success: function (data, textStatus, xhr) {
                console.log('sucess');
            },
            error: function (xhr, textStatus) {
                console.log(' error status code ' + xhr.status);
            }
        }).done(function (data) {
        }).fail(function (data) {
        });
    });
});
$(document).ready(function () {

    var logoutLink = CONFIG.serverRoot + CONFIG.logoutLink;
    //var logoutLink = ('http://localhost:8080/logout');
    var contactRoot = CONFIG.serverRoot + CONFIG.contactRoot;
    //var contactRoot = ('http://localhost:8080/front-user/contact');
    var roleSplitCharacter = CONFIG.roleSplitCharacter;
    //var roleSplitCharacter = '|';
    var mailRoot = CONFIG.serverRoot + CONFIG.mailRoot;
    var smsRoot = CONFIG.serverRoot + CONFIG.smsRoot;

    /*SET USER*/

    var showUser = $.cookie('USER') + ' CONTACTS';

    var role = $.cookie('ROLE');
    var rolesSplited = role.split(roleSplitCharacter);

    if (rolesSplited.indexOf("ROLE_ADMIN") > -1) {
        console.log("adding navBar link to admin page");
        $('body').find('a#logout').removeClass();
        $('body').find('ul#navBar').append("<li><a id=\"users\" class=\"active\" href=\"../admin.html\">ADMIN</a></li>");
    }

    //Add link for admin to admin page

    $('body').find('#user').text(showUser.toUpperCase());

    function sendMessagePopup(contactId) {

        console.log('Contact id ' + contactId);

        var loc = window.location.origin + window.location.pathname;
        var path = loc.substring(0, loc.lastIndexOf('/'));

        var head = "<title>Mail Contact</title>";
        head += '<link rel="stylesheet" type="text/css" href="' + path + '/css/mail.css">';

        var content = '<div id="content">';
        content += '<div hidden>';
        content += '<input id="contactId" type="text" value="' + contactId + '">';
        content += '</div>';

        content += '<div id="add-content" class="center-div">';
        content += '<div class="box row">';
        content += '<textarea id="messageToSend" rows="4" cols="50">Write your message here</textarea>';
        content += '</div>';
        content += '</div>';

        content += '<div id="add-content" class="center-div">';
        content += '<div class="box row">';
        content += '<button id="mailContact" >Send Mail</button>';
        content += '</div>';
        content += '<div class="box row"><p>&nbsp&nbsp&nbsp&nbsp</p>';
        content += '</div>';
        content += '<div class="box row">';
        content += '<button id="smsContact" >Send SMS</button>';
        content += '</div>';
        content += '</div>';

/*        content += '<div id="add-content" class="center-div">';
        content += '<div class="box row">';
        content += '<button id="smsContact" >Send SMS</button>';
        content += '</div>';
        content += '</div>';*/

        content += '</div>';

        var w = 640;
        var h = 160;
        var left = (screen.width / 2) - (w / 2);
        var top = (screen.height / 2) - (h / 2);
        var mywindow = window.open('', 'title', 'toolbar=no, location=yes, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);
        $(mywindow.document.head).html(head);
        $(mywindow.document.body).html(content/*+scriptContent*/);
        sendMail(mywindow);
        return true;
    }

    /*GET CONTACTS*/

    function getContacts() {

        $.ajax({
            url: contactRoot,
            method: 'GET',
            xhrFields: {
                withCredentials: true
            },
            contentType: 'application/json',
            success: function (response) {
                console.log(response);
                $.each(response, function (index, contacts) {


                    var html = '<div id="student-content" class="center-div">';

                    html += '<div hidden>';
                    html += '<input id="contactId" type="text" value="' + contacts.id + '">';
                    html += '</div>';

                    html += '<div class="box row">';
                    html += '<input id="firstName" type="text" value="' + contacts.firstName + '">';
                    html += '</div>';

                    html += '<div class="box row">';
                    html += '<input id="lastName" type="text" value="' + contacts.lastName + '">';
                    html += '</div>';

                    html += '<div class="box row">';
                    html += '<input id="streetAdress" type="text" value="' + contacts.streetAdress + '">';
                    html += '</div>';

                    html += '<div class="box row">';
                    html += '<input id="zipCode" type="text" value="' + contacts.zipCode + '">';
                    html += '</div>';
                    html += '<div class="box row">';
                    html += '<input id="aptNumber" type="text" value="' + contacts.aptNumber + '">';
                    html += '</div>';

                    html += '<div class="box row">';
                    html += '<input id="telephone" type="text" value="' + contacts.telephone + '">';
                    html += '</div>';

                    html += '<div class="box row">';
                    html += '<input id="email" type="text" value="' + contacts.email + '">';
                    html += '</div>';


                    html += '<div class="box row button">';
                    html += '<button id="modify">Update</button>';
                    html += '</div>';

                    html += '<div class="box row button" >';
                    html += '<button id="delete">&nbsp Delete &nbsp</button>';
                    html += '</div>';

                    html += '<div class="box row button" >';
                    html += '<button id="sendMail">&nbsp Message &nbsp </button>';
                    html += '</div>';

                    html += '</div>';

                    $('#content').prepend(html);

                });
            }
        });
    }


    getContacts();


    /*ADD*/

    $('body').on('click', 'button#add', function (event) {
        console.log('add clicked');

        var contact = {
            firstName: $(this).closest('.center-div').find('#firstName').val(),
            lastName: $(this).closest('.center-div').find('#lastName').val(),
            streetAdress: $(this).closest('.center-div').find('#streetAdress').val(),
            zipCode: $(this).closest('.center-div').find('#zipCode').val(),
            aptNumber: $(this).closest('.center-div').find('#aptNumber').val(),
            telephone: $(this).closest('.center-div').find('#telephone').val(),
            email: $(this).closest('.center-div').find('#email').val(),
        }
        console.log(JSON.stringify(contact));
        $.ajax({
            url: contactRoot,
            method: 'post',
            async: false, //wait for response
            xhrFields: {
                withCredentials: true
            },
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify(contact)
        });

        $('#add-content').find('#firstName').val('');
        $('#add-content').find('#lastName').val('');
        $('#add-content').find('#streetAdress').val('');
        $('#add-content').find('#zipCode').val('');
        $('#add-content').find('#aptNumber').val('');
        $('#add-content').find('#telephone').val('');
        $('#add-content').find('#email').val('');

        location.reload();
    });


    /*MODIFY*/
    $('body').on('click', 'button#modify', function (event) {
        console.log('modify clicked');

        var contact = {
            id: $(this).closest('.center-div').find('#contactId').val(),
            firstName: $(this).closest('.center-div').find('#firstName').val(),
            lastName: $(this).closest('.center-div').find('#lastName').val(),
            streetAdress: $(this).closest('.center-div').find('#streetAdress').val(),
            zipCode: $(this).closest('.center-div').find('#zipCode').val(),
            aptNumber: $(this).closest('.center-div').find('#aptNumber').val(),
            telephone: $(this).closest('.center-div').find('#telephone').val(),
            email: $(this).closest('.center-div').find('#email').val(),
        }

        $.ajax({
            url: contactRoot,
            method: 'put',
            async: false, //wait for response
            xhrFields: {
                withCredentials: true
            },
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify(contact)
        });
        location.reload();
    });

    /*DELETE*/
    $('body').on('click', 'button#delete', function (event) {
        console.log('delete clicked');
        var id = {
            id: $(this).closest('.center-div').find('#contactId').val()
        }
        console.log($(this).closest('.center-div').find('#userId').val());
        $.ajax({
            url: contactRoot + '?' + $.param(id),
            method: 'DELETE',
            async: false, //wait for response
            xhrFields: {
                withCredentials: true
            },
            contentType: 'application/json',
        });
        location.reload();
    });


    /*LOGOUT*/
    $('body').on('click', 'a#logout', function (event) {
        event.preventDefault();
        $.ajax({
            url: logoutLink,
            method: 'GET',
            xhrFields: {
                withCredentials: true
            },
            success: window.location = "login.html"
        });
    });

    /*POPUP sendMail Popup*/
    $('body').on('click', '#sendMail', function (event) {
        console.log("sendMail clicked");
        var contactId = $(this).closest('.center-div').find('#contactId').val();
        sendMessagePopup(contactId);

    });

    function sendMail(mywindow) {
        $(mywindow.document).ready(function () {
            //$(mywindow.document).contents().find('#tdProduct').html('2');

            //var mailRoot = 'http://localhost:8080/mail/';

            console.log("loaded");
            //$("#messageToSend").val('rtertgertgertg');

            //SEND mail message button action

            $(mywindow.document).contents().on('click', '#mailContact', function (event) {
                event.preventDefault();
                console.log('sendMail clicked');

                var mailWindowContent = $(mywindow.document).contents();
                var contactId = mailWindowContent.find('#contactId').val();
                var sendMessage = {
                    message: mailWindowContent.find('#messageToSend').val()
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
                    data: JSON.stringify(sendMessage),
                    success: function (response) {
                        console.log(response["message"]);

                        sendResult = '<div id="add-content" class="center-div">';
                        sendResult += '<div class="box row">';
                        sendResult += '<p>' + response["message"] + '</p>';
                        sendResult += '</div>';
                        sendResult += '</div>';

                        mailWindowContent.find('#content').append(sendResult);
                    },
                    error: function (xhr, textStatus) {
                        console.log(' error status code ' + xhr.status);
                    }
                }).done(function (data) {
                }).fail(function (data) {
                });
            });


            //SEND sms message button action
            $(mywindow.document).contents().on('click', '#smsContact', function (event) {
                event.preventDefault();
                console.log('sendSms clicked');

                var mailWindowContent = $(mywindow.document).contents();
                var contactId = mailWindowContent.find('#contactId').val();
                var sendMessage = {
                    message: mailWindowContent.find('#messageToSend').val()
                }

                $.ajax({
                    url: smsRoot + contactId,
                    method: 'post',
                    async: false, //wait for response
                    xhrFields: {
                        withCredentials: true
                    },
                    contentType: 'application/json',
                    dataType: 'json',
                    data: JSON.stringify(sendMessage),
                    success: function (response) {
                        console.log(response["message"]);

                        sendResult = '<div id="add-content" class="center-div">';
                        sendResult += '<div class="box row">';
                        sendResult += '<p>' + response["message"] + '</p>';
                        sendResult += '</div>';
                        sendResult += '</div>';

                        mailWindowContent.find('#content').append(sendResult);
                    },
                    error: function (xhr, textStatus) {
                        console.log(' error status code ' + xhr.status);
                    }
                }).done(function (data) {
                }).fail(function (data) {
                });
            });





        });
    }
});
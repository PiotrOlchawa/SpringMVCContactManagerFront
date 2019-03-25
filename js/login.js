$(document).ready(function () {

    var roleSplitCharacter = CONFIG.roleSplitCharacter;
    //var roleSplitCharacter = '|';
    var adminSucessfulLogin = CONFIG.adminSucessfulLogin;
    //var adminSucessfulLogin = "admin.html";
    var userSucessfulLogin = CONFIG.userSucessfulLogin;
    //var userSucessfulLogin = "users.html";

    $('#login-form').attr('action', CONFIG.serverRoot + '/login');


    function make_base_auth(user, password) {
        var tok = user + ':' + password;
        var hash = btoa(tok);
        return 'Basic ' + hash;
    }

    function checkLoginStatusCode(code) {
        if (code == '401') {
            alert('Incorrect username or password');
        } else {
            alert('Network connection Error');
        }
    }

    function chooseActionBaseOnLoginRole(role) {

        var rolesSplited = role.split(roleSplitCharacter);
        console.log("first role " + rolesSplited[0]);

        if (rolesSplited.indexOf("ROLE_ADMIN") > -1) {
            console.log("redirect admin");
            $(location).attr('href', adminSucessfulLogin);
        } else if (rolesSplited.indexOf("ROLE_USER") > -1) {
            console.log("redirect user");
            $(location).attr('href', userSucessfulLogin);
        }
    };

    $('body').on('click', 'button#login', function (event) {
        event.preventDefault();
        console.log('login clicked');
        var form = $('body').find('form');

        $.ajax({
            type: form.attr('method'),
            url: form.attr('action'),
            data: form.serialize(),
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            success: function (data, textStatus, xhr) {
                console.log(' metoda ' + form.attr('method') + ' akcja ' + form.attr('action'));
                console.log(' status code ' + xhr.status);
                console.log('role ' + xhr.getResponseHeader('User-Role'));

                chooseActionBaseOnLoginRole(xhr.getResponseHeader('User-Role'));
            },
            error: function (xhr, textStatus) {
                console.log(' error status code ' + xhr.status);
                checkLoginStatusCode(xhr.status);
            }
        }).done(function (data) {
        }).fail(function (data) {
        });
    });


});
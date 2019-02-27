$(document).ready(function () {

    var usersRoot = ('http://localhost:8080/front-admin/user');
    var facadeRoot = ('http://localhost:8080/front-admin/user');
    var logoutLink = ('http://localhost:8080/logout');
    var roleSplitCharacter = '|';

    function getUsers() {
        $.ajax({
            url: usersRoot,
            method: 'GET',
            xhrFields: {
                withCredentials: true
            },
            contentType: 'application/json',
            success: function (response) {
                console.log(response);
                $.each(response, function (index, users) {
                    var authority = '';
                    $.each(users.authorities, function (index, auth) {
                        console.log('auth ' + auth.authority);
                        console.log(users.authorities.length + ' ' + index);
                        authority += auth.authority;
                        if (index < users.authorities.length - 1) {
                            authority += ',';
                        }
                    });

                    var html = '<div id="student-content" class="center-div">';

                    html += '<div hidden>';
                    html += '<input id="userId" type="text" value="' + users.id + '">';
                    html += '</div>';

                    html += '<div class="box row">';
                    html += '<input id="username" type="text" value="' + users.username + '">';
                    html += '</div>';

                    html += '<div class="box row">';
                    html += '<input id="password" type="text" value="' + users.password + '">';
                    html += '</div>';

                    html += '<div class="box row">';
                    html += '<input id="authorities" type="text" value="' + authority + '">';
                    html += '</div>';

                    html += '<div class="box row button">';
                    html += '<button id="modify">Aktualizuj</button>';
                    html += '</div>';

                    html += '<div class="box row button" >';
                    html += '<button id="delete">Usun</button>';
                    html += '</div>';

                    html += '</div>';

                    $('#content').prepend(html);

                });
            }
        });
    }

    getUsers();

    /*ADD*/

    $('body').on('click', 'button#add', function (event) {
        console.log('add clicked');

        authoritiesSplited = $(this).closest('.center-div').find('#authorities').val().split(roleSplitCharacter);
        var auths = [];
        $.each(authoritiesSplited, function (index, value) {
            auths.push({authority: value});
        });

        var user = {
            username: $(this).closest('.center-div').find('#username').val(),
            password: $(this).closest('.center-div').find('#password').val(),
            //adressBook : $(this).closest('.center-div').find('#adressBook').val(),
            authorities: auths
        }
        console.log(user);
        $.ajax({
            url: facadeRoot,
            method: 'post',
            async: false, //wait for response
            xhrFields: {
                withCredentials: true
            },
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify(user)
        });

        location.reload();
        /*wyczyszczenie pol add*/
        /*    $('#add-content').find('#pesel').val('');
            $('#add-content').find('#birdthDate').val('');
            $('#add-content').find('#firstName').val('');
            $('#add-content').find('#secondName').val('');
            reloadStudentContent();*/
    });

    /*MODIFY*/
    $('body').on('click', 'button#modify', function (event) {
        console.log('modify clicked');

        authoritiesSplited = $(this).closest('.center-div').find('#authorities').val().split(roleSplitCharacter);

        var auths = [];

        $.each(authoritiesSplited, function (index, value) {
            auths.push({authority: value});
        });

        var user = {
            id: $(this).closest('.center-div').find('#userId').val(),
            username: $(this).closest('.center-div').find('#username').val(),
            password: $(this).closest('.center-div').find('#password').val(),
            //adressBook : $(this).closest('.center-div').find('#adressBook').val(),
            authorities: auths
        }
        console.log("user id" + $(this).closest('.center-div').find('#userId').val());
        $.ajax({
            url: facadeRoot,
            method: 'put',
            async: false, //wait for response
            xhrFields: {
                withCredentials: true
            },
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify(user)
        });
        location.reload();
    });

    /*DELETE*/
    $('body').on('click', 'button#delete', function (event) {
        console.log('delete clicked');
        var id = {
            id: $(this).closest('.center-div').find('#userId').val()
        }
        console.log($(this).closest('.center-div').find('#userId').val());
        $.ajax({
            url: facadeRoot + '?' + $.param(id),
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
            //contentType: 'application/json',
            success: window.location = "login.html"
        });
    });
});
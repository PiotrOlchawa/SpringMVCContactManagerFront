$(document).ready(function () {

    function reloadStudentContent() {

        $('div[id=student-content]').each(function (index) {
            console.log(index);
            $(this).remove();
        });

        getStudentsFromDatabase();
    }

    const usersRoot = ('http://localhost:8080/admin/users')


    /*LOAD STUDENT CONTENET*/

    function getStudentsFromDatabase() {

        $.ajax({
            url: usersRoot,
            method: 'GET',
            contentType: 'application/json',
            success: function (response) {
                console.log(response);
                $.each(response, function (index, users) {

                    var html = '<div id="student-content" class="center-div">';

                    html += '<div hidden>';
                    html += '<input id="userId" type="text" value="' + users.id + '">';
                    html += '</div>';

                    html += '<div class="box row">';
                    html += '<input id="firstName" type="text" value="' + users.username + '">';
                    html += '</div>';

                    html += '<div class="box row">';
                    html += '<input id="secondName" type="text" value="' + users.password + '">';
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

    getStudentsFromDatabase();

    /*ADD*/

    $('body').on('click', 'div #add', function (event) {
        console.log('add clicked');
        var student = {
            firstName: $(this).closest('.center-div').find('#firstName').val(),
            secondName: $(this).closest('.center-div').find('#secondName').val(),
            birthDate: $(this).closest('.center-div').find('#birdthDate').val(),
            pesel: $(this).closest('.center-div').find('#pesel').val()
        }
        console.log(firstName);
        $.ajax({
            url: apiRoot,
            method: 'post',
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify(student)
        });

        /*wyczyszczenie pol add*/
        $('#add-content').find('#pesel').val('');
        $('#add-content').find('#birdthDate').val('');
        $('#add-content').find('#firstName').val('');
        $('#add-content').find('#secondName').val('');
        reloadStudentContent();

    });

    /*MODIFY*/


    $('body').on('click', 'div #modify', function (event) {

        var student = {
            id: $(this).closest('.center-div').find('#studentId').val(),
            firstName: $(this).closest('.center-div').find('#firstName').val(),
            secondName: $(this).closest('.center-div').find('#secondName').val(),
            birthDate: $(this).closest('.center-div').find('#birdthDate').val(),
            pesel: $(this).closest('.center-div').find('#pesel').val()
        }

        console.log(student);

        $.ajax({
            url: apiRoot,
            method: 'put',
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify(student),
        });

        reloadStudentContent();

    });


    /*DELETE*/

    $('body').on('click', 'button#delete', function (event) {

        console.log('delete clicked');

        var id = {
            id: $(this).closest('.center-div').find('#studentId').val()
        }

        console.log($(this).closest('.center-div').find('#studentId').val());

        $.ajax({
            url: apiRoot + '?' + $.param(id),
            method: 'DELETE',
            contentType: 'application/json',
        });

        location.reload();

    });

});
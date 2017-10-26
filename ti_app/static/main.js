
// function to read cookies
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}

// setup ajax to include djangos CSRF Token
$.ajaxSetup({
    beforeSend: function(xhr, settings) {
        var csrftoken = getCookie('csrftoken');
        if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
    }
});

$(function() {

    // links to navigate between home and logs
    $(document).on('click', '#home_link', function (e) {
        e.preventDefault();
        $('#logs').hide();
        $('#home').show();
    });

    $(document).on('click', '#logs_link', function (e) {
        e.preventDefault();
        $('#home').hide();
        $('#logs').show();

        // update logs
        $.ajax({
            type: 'GET',
            url: '/logs_ajax/'
        }).done(function (html) {
            $('#logs_rows').html(html);
        });
    });

    // default page vars
    var page = 1,
        pages = 1;

    // pagination next page
    $(document).on('click', '#next_page', function (e) {
        e.preventDefault();
        if (page >= pages)
            page = pages;
        else
            page = page + 1;
        load_users_list(page);
    });

    // pagination previous page
    $(document).on('click', '#prev_page', function (e) {
        e.preventDefault();
        if (page <= 1)
            page = 1;
        else
            page = page - 1;
        load_users_list(page);
    });

    var users_url = '/api/users/',
        request_type = 'GET';

    // change between CRUD options
    $('#form_options').on('change', 'input', function (e) {
        e.preventDefault();
        request_type = $(this).val();
        $('#form_groups').find('.row').hide();
        $('#form_' + request_type.toLowerCase()).show();
    });

    // load users list
    function load_users_list(page) {
        $.ajax({
            type: "GET",
            url: users_url + '?page=' + page
        }).done(function(json) {
            var html = '',
                count = json.count;

            // compute the number of pages
            pages = Math.ceil(count/10);

            // create the users table
            $.each(json.results, function(i,user) {
                html += '<tr>\n' +
                    '<td>' + user.id + '</td>\n' +
                    '<td>' + user.first_name + '</td>\n' +
                    '<td>' + user.last_name + '</td>\n' +
                    '<td>' + user.username + '</td>\n' +
                    '<td>' + user.email + '</td>\n' +
                    '</tr>';
            });

            // print users table
            $('#user_rows').html(html);
            $('#page_index').html(page + ' / ' + pages);
        });
    }

    // preliminary users list load
    load_users_list(1);

    // update response container function
    function update_response(response) {
        $("#ajax_response").html( JSON.stringify(response, null, 4) );
        // update users list after changes
        load_users_list(page);
    }

    // handle user CRUD events
    $(document).on('submit', '.crud_forms', function (e) {
        e.preventDefault();

        var url = users_url;

        // if reading/updating/deleting user
        if (request_type !== 'POST') {
            // get User ID
            var user_id = $(this).find('#UserID').val();
            // update url to include User ID
            url = users_url + user_id + '/';

            // confirm the action when deleting
            if (request_type === 'DELETE' && !confirm('Are you sure you want to delete this user?')) {
               return false;
            }
        }

        $.ajax({
            type: request_type,
            url: url,
            data: $(this).serialize(),
            statusCode: {
                404: update_response,
                204: update_response
            }
        }).done(update_response);
        return false;
    });

});
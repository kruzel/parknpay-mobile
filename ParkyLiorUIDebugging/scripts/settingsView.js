// JavaScript Document
function settingsViewInit() {  
    if (auth_token==null)
    {
        //not logged in
        $("#signupView").show();
        $("#signinView").show();
        
        $("#signoutView").hide();
        $("#updateView").hide();
        $("#scanview").hide();
        $("#addCarView").hide();
        $("#remindersView").hide();
        $("#scanView").hide();
        $("#prepaidView").hide();
        
    } else {
        $("#signupView").hide();
        $("#signinView").hide();
        
        $("#signoutView").show();
        $("#updateView").show();
        $("#scanview").show();
        $("#addCarView").show();
        $("#remindersView").show();
        $("#scanView").show();
        $("#prepaidView").show();
    }
    
    $('#scanview').click(function() 
    {
			window.plugins.barcodeScanner.scan(function(result) {
			alert("We got a barcode\n" +
				  "Result: " + result.text + "\n" +
				  "Format: " + result.format + "\n" +
				  "Cancelled: " + result.cancelled);
		}, function(error) {
			alert("Scanning failed: " + error);
		}
		);

		return false;
	});
    
    $('#sign_out').click(function() {
        closeModalViewSignOut();
    });
}
    
///////////////////////////
//  CAR MANAGEMENT STUFF //
///////////////////////////

///////////////////////////
//  SETTINGS RELATED STUFF //
///////////////////////////


function closeModalAddCar() 
{
    $("#modalview-addCar").kendoMobileView("close");
}

    
function closeViewSignOut() 
{
    auth_token = null;
    window.localStorage.removeItem("auth_token");
    $("#modalview-signout").kendoMobileModalView("close");
    settingsViewInit();
}
        
function closeViewSignUp() 
{
    var firstname = $("#firstname").val();
    var lastname = $("#lastname").val();
    var phone = $("#phone").val();
    var credit_card_number = $("#credit_card_number").val();
    var id_card_number = $("#id_card_number").val();
    var email = $("#email-signup").val();
    var password = $("#password-signup").val();
    
    //TODO: add phone and credit_card_number to server, add as accessible attr
    user_data = {user: {email: email, password: password, password_confirmation: password, firstname: firstname, lastname: lastname } } //, phone: phone, credit_card_number: credit_card_number, id_card_number: id_card_number
    user_data_str = JSON.stringify(user_data);
    window.localStorage.setItem("user_data",user_data_str);
    
    $.ajax({
		url: "http://inigo.com.au/users.json",
		dataType: "json",
		type: "post",
		cache: false,
		data: user_data,
		success: function(response) 
        {
            auth_token = response.data.auth_token;
            window.localStorage.setItem("auth_token",auth_token);
            console.log('auth_token: ' + auth_token);
            $("#modalview-signup").kendoMobileView("close");
            settingsViewInit();
            
		},
		error: function(jqXHR, textStatus, errorThrown) 
        {
			console.log(jqXHR, textStatus, errorThrown);
            window.localStorage.removeItem("auth_token");
            alert('Signup Failed');  
	   }
	});
}

function closeViewSignIn() 
{
    var email = $("#email-signin").val();
    var password = $("#password-signin").val();
    
    //Get fresh data
	$.ajax({
        url: "http://inigo.com.au/users/sign_in.json",
        dataType: "json",
        type: "post",
        cache: false,
        data: {user:{email:email, password:password}},
        success: function(response) {
            console.log(response.session);
            auth_token = response.session.auth_token;
            window.localStorage.setItem("auth_token",auth_token);
            console.log('auth_token: ' + auth_token);
            $("#modalview-signin").kendoMobileModalView("close");
            settingsViewInit();
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(jqXHR, textStatus, errorThrown);
            window.localStorage.removeItem("auth_token");
            alert('Sign in failed');
            $("#view-signin").close();
            settingsViewInit();
       }
    });
}



// JavaScript Document
function settingsViewInit() {  
        
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
    //$("#modalview-signout").kendoMobileModalView("close");
    app.navigate("#login");
    //app.navigate("../index.html");
}
        



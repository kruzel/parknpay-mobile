// JavaScript Document
function settingsViewInit() {  
    
    console.log("settingsViewInit");
    $('#scanView').click(function() 
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
    
    /*
    $('#smallImage').click(function() 
    {
        console.log("smallImage - click function ");
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
    */    
    
}
    
///////////////////////////
//  CAR MANAGEMENT STUFF //
///////////////////////////

///////////////////////////
//  SETTINGS RELATED STUFF //
///////////////////////////




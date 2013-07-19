function serverApi() {
    this.serverUrl = "http://ozpark.com.au";
    this.auth_token = null;

    this.init();
};

serverApi.prototype = {

    init: function() {
        this.auth_token = window.localStorage.getItem("auth_token");
    },

    get_token: function() {
        return this.auth_token;
    },

    is_signed_in: function() {
        return this.auth_token != null;
    },

    // params should include success, error callback function
    // params['data'], should include {user: {email: email, password: password, password_confirmation: password, firstname: firstname, lastname: lastname } } //later:, phone: phone, credit_card_number: credit_card_number, id_card_number: id_card_number
    sign_in: function(params) {
        $.ajax({
            url: this.serverUrl + "/users/sign_in.json",
            dataType: "json",
            type: "post",
            cache: false,
            data: params['data'],
            success: function(response, textStatus, jqXHR)
            {
                console.log(response.session);
                _serverApi.auth_token = response.session.auth_token;
                window.localStorage.setItem("auth_token",_serverApi.auth_token);
                params['success'](_serverApi.auth_token); //callback function
            },
            error: function(jqXHR, textStatus, errorThrown)
            {
                console.log(jqXHR, textStatus, errorThrown);
                window.localStorage.removeItem("auth_token");
                params['error'](errorThrown);  //callback function
            }
        });
    },

    // params should include success, error callback function
    // params['data'], should include {user: {email: email, password: password} }
    sign_up: function(params) {
         $.ajax({
            url: this.serverUrl + "/users.json",
            dataType: "json",
            type: "post",
            cache: false,
            data: params['data'],
            success: function(response, textStatus, jqXHR)
            {
                _serverApi.auth_token = response.data.auth_token;
                window.localStorage.setItem("auth_token",_serverApi.auth_token);
                console.log('auth_token: ' + _serverApi.auth_token);
                params['success'](_serverApi.auth_token); //callback function
            },
            error: function(jqXHR, textStatus, errorThrown)
            {
                console.log(jqXHR, textStatus, errorThrown);
                window.localStorage.removeItem("auth_token");
                params['error'](errorThrown);  //callback function
            }
        });
    },

    // no input params
    sign_out: function () {
        this.auth_token = null;
        window.localStorage.removeItem("auth_token");
    },

    // params should include success, error callback function only
    // response: {user: {firstname: firstname, lastname: lastname ,email: email,......} }
    get_user: function(params) {
        $.ajax({
            url: this.serverUrl + "/api/v1/users/0.json?auth_token=" + this.auth_token,
            dataType: "json",
            type: "get",
            cache: false,
            success: function(response, textStatus, jqXHR)
            {
                var user = response;
                params['success'](user); //callback function
            },
            error: function(jqXHR, textStatus, errorThrown)
            {
                console.log(jqXHR, textStatus, errorThrown);
                params['error'](errorThrown);  //callback function
            }
        });
    },

    // params should include only success, error callback function
    // returned value on success: json with cities->areas->rates
    get_rates: function(params) {
        $.ajax({
            url: this.serverUrl + "api/v1/cities/get_rates.json?auth_token=" + this.auth_token,
            dataType: "json",
            type: "get",
            cache: false,
            success: function(response, textStatus, jqXHR)
            {
                var cities = response;
                params['success'](cities); //callback function
            },
            error: function(jqXHR, textStatus, errorThrown)
            {
                console.log(jqXHR, textStatus, errorThrown);
                params['error'](errorThrown);  //callback function
            }
        });
    },

    // params should include success, error callback function
    // params['data']  include {car: {license_plate: license_plate, car_description: car_description, car_image: car_image}}    car_image is optional
    // returned value on success: nested json with cities->areas->rates
    add_cars: function(params) {
        $.ajax({
            url: this.serverUrl + "/api/v1/users/0/cars.json?auth_token=" + this.auth_token,
            dataType: "json",
            type: "post",
            data: params['data'],
            cache: false,
            success: function(response, textStatus, jqXHR) {
                var car = response;
                params['success'](car); //callback function
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(jqXHR, textStatus, errorThrown);
                params['error'](errorThrown);  //callback function
            }
        });
    },
    
    upload_car_image: function(car_id, imageURI, win, fail) {
    	var url = this.serverUrl + "/api/v1/users/0/cars/" + car_id + "/upload_image.json?auth_token=" + this.auth_token;
    	
    	var options = new FileUploadOptions();
	 options.chunkedMode = false;
	 options.fileKey="file";
	 options.fileName=imageURI.substr(imageURI.lastIndexOf('/')+1);
	 options.mimeType="image/jpeg";

	 var params = new Object();
	 params.value1 = "test";
	 params.value2 = "param";

	 options.params = params;

	 var ft = new FileTransfer();
	 ft.upload(imageURI, url ,win, fail, options);
    },
    update_cars: function(params) {
        $.ajax({
            url: this.serverUrl + "/api/v1/users/0/cars/" + params['car_id'] + ".json?auth_token=" + this.auth_token,
            dataType: "json",
            type: "put",
            data: params['data'],
            cache: false,
            success: function(response, textStatus, jqXHR) {
                var car = response;
                params['success'](car); //callback function
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(jqXHR, textStatus, errorThrown);
                params['error'](errorThrown);  //callback function
            }
        });
    },
    get_cars: function(params) {
        $.ajax({
            url: this.serverUrl + "/api/v1/users/0/cars.json?auth_token=" + this.auth_token,
            dataType: "json",
            type: "get",
            cache: false,
            success: function(response, textStatus, jqXHR) {
                var cars = response;
                params['success'](cars); //callback function
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(jqXHR, textStatus, errorThrown);
                params['error'](errorThrown);  //callback function
            }
        });
    },
    // params should include success, error callback function
    // params['data']  include { payment: { x_pos: x_pos, y_pos: y_pos, area_id: area_id, rate_id: rate_id, user_id: user_id, start_time: start_time}}
    // returned value on success: { payment: { id: id, x_pos: x_pos, y_pos: y_pos, area_id: area_id, rate_id: rate_id, user_id: user_id, start_time: start_time}}
    add_payment: function(params) {
        $.ajax({
            url: this.serverUrl + "/api/v1/payments.json?auth_token=" + this.auth_token,
            dataType: "json",
            type: "post",
            data: params['data'],
            cache: false,
            success: function(response, textStatus, jqXHR) {
                var car = response;
                params['success'](car); //callback function
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(jqXHR, textStatus, errorThrown);
                params['error'](errorThrown);  //callback function
            }
        });
    },
    // params should include success, error callback function
    // params['data']  include { payment: { id: id, end_time: end_time}}
    // returned value on success:
    update_payment: function(params) {
        $.ajax({
            url: this.serverUrl + "/api/v1/payments.json?auth_token=" + this.auth_token,
            dataType: "json",
            type: "put",
            data: params['data'],
            cache: false,
            success: function(response, textStatus, jqXHR) {
                var car = response;
                params['success'](car); //callback function
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(jqXHR, textStatus, errorThrown);
                params['error'](errorThrown);  //callback function
            }
        });
    },
    // params should include success, error callback function only
    // returned value on success: array of current user payments
    get_payments: function(params) {
        $.ajax({
            url: this.serverUrl + "/api/v1/payments/users_payments.json?auth_token=" + this.auth_token,
            dataType: "json",
            type: "get",
            cache: false,
            success: function(response, textStatus, jqXHR) {
                var cars = response;
                params['success'](cars); //callback function
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(jqXHR, textStatus, errorThrown);
                params['error'](errorThrown);  //callback function
            }
        });
    }
}

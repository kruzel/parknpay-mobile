function serverApi() {
    this.init();
};

serverApi.prototype = {
    serverUrl: "http://ozpark.com.au",
    auth_token: null,

    init: function() {
        this.auth_token = window.localStorage.getItem("auth_token");
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
                this.auth_token = response.session.auth_token;
                window.localStorage.setItem("auth_token",this.auth_token);
                params['success'](this.auth_token); //callback function
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
                this.auth_token = response.data.auth_token;
                window.localStorage.setItem("auth_token",auth_token);
                console.log('auth_token: ' + auth_token);
                params['success'](this.auth_token); //callback function
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
    // params['data']                                                                               may be needed later:  include {user_id: user_id }
    // returned value on success: nested json with cities->areas->rates
    get_cars: function(params) {
        $.ajax({
            url: this.serverUrl + "api/v1/users/0/cars.json?auth_token=" + this.auth_token,
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
            url: server_url + "/api/v1/users/0/cars.json?auth_token=" + this.auth_token,
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

    get_cars: function(params) {
        $.ajax({
            url: server_url + "/api/v1/users/0/cars.json?auth_token=" + this.auth_token,
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

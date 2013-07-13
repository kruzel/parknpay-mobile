function serverApi() {
    this.init();
};

serverApi.prototype = {
    serverUrl: "http://ozpark.com.au",
    auth_token: null,

    init: function() {
        this.auth_token = window.localStorage.getItem("auth_token");
    },

    sign_in: function(params) {
        $.ajax({
            url: this.serverUrl + "/users/sign_in.json",
            dataType: "json",
            type: "post",
            cache: false,
            data: params['data'],
            success: function(response)
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
    sign_up: function(params) {
         $.ajax({
            url: this.serverUrl + "/users.json",
            dataType: "json",
            type: "post",
            cache: false,
            data: params['data'],
            success: function(response)
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
    sign_out: function () {
        this.auth_token = null;
        window.localStorage.removeItem("auth_token");
    }

}

(function($, console, doc) {
	var announcementViewModel,
    	carsViewModel,
    	AddCarViewModel,
    	CarsViewModelBase,
    	SingleCarViewModel,
    	RewardsViewModel;
        
	AddCarViewModel = kendo.data.ObservableObject.extend({
		carNumber: null,
        
		init: function() {
			kendo.data.ObservableObject.fn.init.apply(this, [this]);
			var that = this;
			that.set("carNumber", null);
		},
        
        resetView: function() {
            var that = this;
            
            that._reset(); 
            
            $("#carNumberField").keyup(function(e) {
                if(that._checkIsValid(e.target.value)) {
                    $("#buttonAddNewCarView").removeClass("isCarValid");
                } else {
                    $("#buttonAddNewCarView").addClass("isCarValid");
                }
            });
        },

		addNewCar: function() {
			var that = this,
    			carNumberValue = $('#carNumberField').val(),
    			newCar = that._generateRandomCar(carNumberValue),
                positionAdded = carsViewModel.cars.push(newCar) - 1;
			
			carsViewModel.carNumbers()[carNumberValue] = positionAdded;
                
			app.navigate("views/carsView.html");	
		},

		carIdChanged: function(e) {

			var that = this, 
    			carForAddId = e.currentTarget.value,
    			isValidCarNumber = that._checkIsValid(carForAddId);
                
			that.set("canAddCar", isValidCarNumber);
		},

		_generateRandomCar: function(carNumberValue) {
			    var currentAmount = Math.floor((Math.random() * 100) + 10),
        			totalParkingTime = Math.floor(Math.random() * 100),
        			currentDate = new Date(),    
                    expireDate = new Date(currentDate.setFullYear(currentDate.getFullYear() + 2)),
                    carToAdd;

			carToAdd = {
				carNumber : carNumberValue,
				amount: currentAmount,
				totalParkingTime: totalParkingTime,
				expireDate: kendo.toString(expireDate, "yyyy/MM/dd")
			};
                
			return carToAdd;
		},

		_checkIsValid: function(typedCarId) {
			var that = this;
                
			return that._validateCarNumber(typedCarId) && !that._isDublicateNumber(typedCarId);
		},

		_validateCarNumber: function(carNumberValue) {
			var validateNumberRegex = /^[0-9]{9}$/,
			    isValidCarNumber = validateNumberRegex.test(carNumberValue);
                
			return isValidCarNumber;
		},

		_isDublicateNumber: function (carNumberValue) {
			var isDublicate = carsViewModel.carNumbers().hasOwnProperty(carNumberValue);
			
            return isDublicate;
		},
        
        _reset: function() {
            var $carNumberFild = $('#carNumberField'),
            $buttonAddNewCar = $('#buttonAddNewCarView');
            
            $carNumberFild.focus();
            $carNumberFild.val("");
            $($buttonAddNewCar).addClass("isCarValid");
        }
	});

	CarsViewModelBase = kendo.data.ObservableObject.extend({
		init: function() {
			var that = this;
			
            kendo.data.ObservableObject.fn.init.apply(that, [that]);
		},
        
		_generateBarcodeUrl: function(carId) {
			var size = "130",
    			urlSizeParameter = "chs=" + size + "x" + size,
    			urlQrParameter = "cht=qr",
    			urlDataParameter = "chl=" + carId,
    			urlBase = "https://chart.googleapis.com/chart?",
    			imageRequestString = urlBase + urlSizeParameter + "&" + urlQrParameter + "&" + urlDataParameter; 
                
			return imageRequestString;
		},
        
		appendCarFadeEffect: function ($carFront, $carBack) {
			//debugger;
            $carFront.bind('touchend', function(e) {
				console.log("clickFront");
				$(e.currentTarget).fadeOut(500, "linear", function() {
					$carBack.fadeIn(500, "linear");
				});
            
			});
                
			$carBack.bind('touchend', function(e) {
				console.log("clickBack");
				$(e.currentTarget).fadeOut(500, "linear", function() {
					$carFront.fadeIn(500, "linear");
				});
			});
		}
	});

	SingleCarViewModel = CarsViewModelBase.extend({
		barcodeUrl : "",
		carId : "",
		carAmount : "",
		currentDate : "",
		carStatus: "",
        
		setValues: function(carNumber, totalParkingTime, carAmount) {
			var that = this;
			
			if (1 < 50) {
				that.set("carStatus", "silver");
			}
			else {
				that.set("carStatus", "gold");
			}
            
			that.set("carId", carNumber);
			that.set("barcodeUrl", that._generateBarcodeUrl(carNumber));
			that.set("carId", "#" + carNumber);
			that.set("carAmount", kendo.toString(parseFloat(carAmount), "c"));
			that.set("barcodeURL", totalParkingTime);
			that.set("currentDate", kendo.toString(new Date(), "yyyy/MM/dd hh:mm tt"));
		},
        
		deleteCar: function() {
			var that = this, 
    			carIdString = that.carId,
    			carIdLength = that.carId.length,
    			realCarId = carIdString.substring(1, carIdLength);

			that._processDeleteCar(realCarId);
            
			app.navigate('views/carsView.html');
		},
        
		_processDeleteCar: function(carId) {
			var allCarsArray = carsViewModel.cars;
    
			for (var i = -1, len = allCarsArray.length; ++i < len;) {
				if (allCarsArray[i].carNumber === carId) {
					allCarsArray.splice(i, 1);
					delete carsViewModel.carNumbers()[carId];
					break;
				}
			} 
		}
	});

	RewardsViewModel = CarsViewModelBase.extend({
        /* TODO: ofer - insert call to API to get parking history */
		_parkingsForCar : {
            gold : [
				{reward: "parking_date1 parking_place total_amount"},
				{reward: "parking_date2 parking_place total_amount"},
				{reward: "parking_date3 parking_place total_amount"},
				{reward: "parking_date4 parking_place total_amount"}			
		]},
		carStatus: "",
		rewards: [],
		totalParkingTime: "",
		barcodeURL: "",
		currentDate: "",
		carNumber: "",
    
		setValues: function(carNumber, totalParkingTime) {
			var that = this;			
		
			that.set("carStatus", "silver");
            
			that.set("rewards", that._parkingsForCar["gold"]);
          
			var barcode = that._generateBarcodeUrl(carNumber);
            
			that.set("carNumber", "#" + carNumber);
			that.set("totalParkingTime", "Total Park Time" + " 2:32:14 ");
			that.set("barcodeURL", barcode);
			that.set("currentDate", kendo.toString(new Date(), "yyyy/MM/dd hh:mm tt"))
		}
	});
    
	announcementViewModel = kendo.observable({
		announcements: [],
        
		load: function(announcements) {
			var that = this;
			that.set("announcements", announcements);
		}
	});

	carsViewModel = kendo.observable({
		cars : [],
		_carNumbers: {},
        
		loadFromLocalStorage: function() {
			var that = this;
			var i;
			var cars = [];

			if (window.localStorage.getItem("cars") !== null) {
				cars = JSON.parse(window.localStorage.getItem("cars"));
			}

			for (i = 0; i < cars.length; i+=1) {
				this._carNumbers[cars[i].carNumber] = i;
			}
        
			that.set("cars", cars);
			that.cars.bind("change", that.writeIntoLocalStorage);
		},

		carNumbers: function(value) {
			if (value) {
				this._carNumbers = value;
			}
			else {
				return this._carNumbers;
			}
		},
        
		writeIntoLocalStorage: function(e) {
			var dataToWrite = JSON.stringify(carsViewModel.cars);
			window.localStorage.setItem("cars", dataToWrite);
		},
        
		addCars: function() {
            
		}
	});

	$.extend(window, {
		singleCarViewModel: new SingleCarViewModel(),
		rewardsViewModel: new RewardsViewModel(),
		addCarViewModel: new AddCarViewModel(),
		announcementViewModel: announcementViewModel,
		carsViewModel: carsViewModel
	});
    
})(jQuery, console, document);
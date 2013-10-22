enyo.kind({
    name: "mapContainer",
    rendered: function(){
    	console.log("mapContainer");
        this.inherited(arguments);
        
        //Initialize the map
        this.map = L.map(this.id);
        this.map.setView([44.981313, -93.266569],13);
	L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    			attribution: '',
   			 maxZoom: 18
		}).addTo( this.map);
        
        /*
        this.map = L.map(this.id).setView([44.981313, -93.266569],13);
		L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            {attribution: "Map data &copy; OpenStreetMap contributors"}
        ).addTo(this.map);
        */
        //Initilize the marker and popup
        /*
        var mark = new L.marker([44.981014, -93.270520]).addTo(this.map);
		var popDiv = L.DomUtil.create("div");
		var pop = new L.popup();
		mark.bindPopup(pop);

        //Initilize the enyo button and control
		var ctrl = new enyo.Control({
			myHandler: function(){
				console.log("The foo button was tapped");
			}
		});
        var button = new enyo.Button({
            name: "thefoobutton",
            content: "foo",
            ontap: "myHandler",
            owner: ctrl,
        });
        
        //Add click handler
        //inspired by https://github.com/NBTSolutions/Leaflet/commit/466c0e3507cf0934a9d1441af151df2324a4537b#L2R129
        function forward(e){
            if (window.enyo && window.enyo.$ && e.srcElement && e.srcElement.id && window.enyo.$[e.srcElement.id]){
                    window.enyo.$[e.srcElement.id].bubble("ontap", e);
            }
        }
        this.map.on("popupopen", function (e){
            if (! e.popup.hasForwarder){ //Note: this check may not be needed. The L.DomEvent.on() seems to handle multiple adds of named functions
                L.DomEvent.on(pop._contentNode, "click", forward, this);
                e.popup.hasForwarder = true;
            }
        }, this);
        
        
        button.renderInto(popDiv);
	pop.setContent(popDiv);
        mark.openPopup();
        */
    },
    
});

enyo.kind({
		name: "MapView",
		classes: "mapview",
		components: [
			{kind: "Signals",
				onMainNavTap: "mainNavTap",
				onPositionChange: "positionChanged"
			},
			{name: "mapArea", kind: "FittableRows",  classes: "enyo-fit map-area"}
		],
		mainNavTap: function (source, event) {
			console.log("mainNavTap");
			if (!this.$.mapArea.$.map) {
				this.map = this.$.mapArea.createComponent({
					name: "map",
					kind: "LeafletMap",
					classes: "map"
				}).render();
			}
		},
		positionChanged: function (source, coords) {
			if (this.map) {
				this.map.setCenter(coords.latitude, coords.longitude);
			}
		}
	});

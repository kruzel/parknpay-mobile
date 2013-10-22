/* an item button that contains icon and a label */
enyo.kind({
	name: "PulloutItem",
	published: {
		label: "",
		icon: ""
	},
	components: [
		{name: "icon", kind: "Image", classes: "labeled-item-icon"},
		{name: "label", kind: "Control"},
	],
	create: function() {
		this.inherited(arguments);
		this.labelChanged();
		this.iconChanged();
	},
	labelChanged: function() {
		this.$.label.setContent(this.label);
	},
	iconChanged: function() {
		this.$.icon.setSrc(this.icon);
	},
});

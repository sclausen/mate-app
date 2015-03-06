Crates = new Meteor.Collection('crates');

Crates.attachSchema(new SimpleSchema({
  content: {
    type: String,
    label: "Content",
    max: 20
  },
  volume: {
    type: Number,
    label: "Volume"
  },
  pricePerBottle: {
    type: Number,
    label: "Price per Bottle in ct.",
    min: 0
  },
  boughtAt: {
    type: Date,
    label: "Date this crate was bought at"
  },
  depletedAt: {
    type: Date,
    label: "Date this crate was depleted at",
    optional: true
  },
  roomNo: {
    type: String,
    label: "Room Number",
    optional: true,
    max: 20
  }
}));

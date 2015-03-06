News = new Meteor.Collection('news');

News.attachSchema(new SimpleSchema({
  headline: {
    type: String,
    label: "Headline",
    max: 20
  },
  locale: {
    type: String,
    label: "Locale",
    max: 2,
    min: 2
  },
  text: {
    type: String,
    label: "Text"

  },
  date: {
    type: Date,
    label: "Updated"
  },
  createdAt: {
    type: Date,
    label: "Created",
    optional: true
  },
  updatedAt: {
    type: Date,
    label: "Updated",
    optional: true
  }
}));

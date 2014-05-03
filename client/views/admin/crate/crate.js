Router.map(function() {
  this.route('admin_crate', {
    path: '/:language?/admin/crates/:_id',
    waitOn: function() {
      return [Meteor.subscribe("users"), Meteor.subscribe("transactions"), Meteor.subscribe("crates")];
    },
    controller: AdminController,
    onBeforeAction: function() {
      if (!Meteor.loggingIn() && !Roles.userIsInRole(Meteor.user(), ['crates:read'])) {
        this.redirect('/');
      }
    },
    data: function() {
      if (this.ready()) {
        var crate = Crates.findOne(this.params._id);

        var transactions = Transactions.find({
          "crate._id": this.params._id
        }, {
          sort: {
            bought: -1
          }
        }).fetch();

        var consumers = Meteor.users.find({}, {
          sort: {
            username: 1
          }
        }).fetch();

        return {
          transactions: transactions || [],
          crate: crate || null,
          consumers: consumers || []
        };
      }
    }
  });
});

Template.admin_crate.rendered = function() {

  $('.bought').datetimepicker({
    pick12HourFormat: false,
    pickSeconds: false
  });

  $('.depleted').datetimepicker({
    pick12HourFormat: false,
    pickSeconds: false
  });

  var crateId = Router.current().params._id;

  if (!crateId) {
    return false
  }

  var data = Transactions.find({
    "crate._id": crateId
  }, {
    sort: {
      bought: 1
    }
  }).map(function(tx) {
    return {
      x: Math.floor((+tx.bought) / 1000),
      y: tx.crate.volume
    }
  });


  if (!data.length) {
    return false;
  }
  var chartElement = document.getElementById("chart");

  var graph = new Rickshaw.Graph({
    element: chartElement,
    renderer: "line",
    interpolation: "step-after",
    series: [{
      color: '#777',
      data: data
    }]
  });

  var xAxis = new Rickshaw.Graph.Axis.Time({
    graph: graph
  });

  var yAxis = new Rickshaw.Graph.Axis.Y({
    graph: graph,
    orientation: 'left',
    tickFormat: Rickshaw.Fixtures.Number.formatKMBT,
    element: document.getElementById("yaxis")
  });
  graph.render();


};

Template.admin_crate.boughtPlaceholder = function() {
  return new Date();
};

Template.admin_crate.events({
  'click .save': function(event) {
    var options = {
      _id: $(event.currentTarget).attr("crate-id"),
      content: $("#content").val(),
      volume: parseInt($("#volume").val()),
      pricePerBottle: parseInt($("#pricePerBottle").val()),
      bought: $("#bought").val(),
      roomNo: $("#roomNo").val()
    }

    Meteor.call(
      "save-crate",
      options,
      function(error, result) {
        if (error && error.reason) {
          FlashMessages.sendError(__(error.reason));
        } else {
          FlashMessages.sendSuccess(__("crate_saved"));
          Router.go("admin_crates", {
            language: Meteor.getLocale()
          });
        }
      }
    );
    $("html, body").animate({
      scrollTop: 0
    }, "fast");
  },
  'click .cancel': function() {
    history.back();
  }
});
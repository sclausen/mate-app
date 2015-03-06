Template.admin_crate.rendered = function() {
  $('.boughtAt').datetimepicker({
    pick12HourFormat: false,
    pickSeconds: false
  });

  $('.depleted').datetimepicker({
    pick12HourFormat: false,
    pickSeconds: false
  });

  var crateId = Router.current().params._id;

  if (!crateId) {
    return false;
  }

  var data = Transactions.find({
    "crate._id": crateId
  }, {
    sort: {
      boughtAt: 1
    }
  }).map(function(tx) {
    return {
      x: Math.floor((+tx.boughtAt) / 1000),
      y: tx.crate.volume
    };
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

    crateId = $(event.currentTarget).attr("crate-id");

    var crate = {
      content: $("#content").val(),
      volume: parseInt($("#volume").val()),
      pricePerBottle: parseInt($("#pricePerBottle").val()),
      boughtAt: moment($("#boughtAt").val())._d,
      roomNo: $("#roomNo").val()
    };
    var depletedAt = moment($("#depletedAt").val());

    if (depletedAt.isValid()) {
      crate.depletedAt = depletedAt._d;
    }

    if (crateId) {
      Crates.update(crateId, {
        $set: crate
      }, function(error) {
        if (error) {
          FlashMessages.sendError({
            text: error.message
          });
        }
        Router.go("admin_crates");
      });
    } else {
      Crates.insert(crate, function(error) {
        if (error) {
          FlashMessages.sendError({
            text: error.message
          });
        }
        Router.go("admin_crates");
      });
    }

    // Meteor.call(
    //   "save-crate",
    //   options,
    //   function (error) {
    //     if (error && error.reason) {
    //       FlashMessages.sendError(__(error.reason));
    //     } else {
    //       FlashMessages.sendSuccess(__("crate_saved"));
    //       Router.go("/admin/crates");
    //     }
    //   }
    // );
    // $("html, body").animate({
    //   scrollTop: 0
    // }, "fast");
  },
  'click .cancel': function() {
    history.back();
  }
});

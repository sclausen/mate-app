Template.admin_statistics.rendered = function() {
  var self = this;
  self.consumptionNode = self.find("#admin-statistics-consumption");
  self.balanceNode = self.find("#admin-statistics-balance");

  var transactions = Transactions.find({
    crate: {
      $exists: true
    }
  }).fetch();

  var datax = _.countBy(transactions, function(entry) {
    return entry.userId;
  });

  var consumptionData = [];
  var pairs = _.pairs(datax);

  _.each(pairs, function(pair) {
    var user = Meteor.users.findOne({
      _id: pair[0]
    });
    if (user) {
      consumptionData.push({
        name: user.username,
        value: pair[1]
      });
    }
  });

  var users = Meteor.users.find().fetch();

  var balanceData = [];
  _.each(users, function(user) {
    balanceData.push({
      name: user.username,
      value: user.profile.balance / 100
    });
  });

  drawStatistics(self.consumptionNode, consumptionData);
  drawStatistics(self.balanceNode, balanceData, {
    formatCurrency: true
  });
};

function drawStatistics(node, data, options) {
  var valueLabelWidth = 40; // space reserved for value labels (right)
  var barHeight = 20; // height of one bar
  var barLabelWidth = 100; // space reserved for bar labels
  var barLabelPadding = 5; // padding between bar and bar labels (left)
  var gridLabelHeight = 18; // space reserved for gridline labels
  var gridChartOffset = 3; // space between start of grid and first bar
  var maxBarWidth = 420; // width of the bar with the max value

  // accessor functions
  var barLabel = function(d) {
    return d.name;
  };
  var barValue = function(d) {
    return d.value;
  };

  // sorting
  var sortedData = data.sort(function(a, b) {
    return d3.descending(barValue(a), barValue(b));
  });

  // scales
  var yScale = d3.scale.ordinal().domain(d3.range(0, sortedData.length)).rangeBands([0, sortedData.length * barHeight]);
  var y = function(d, i) {
    return yScale(i);
  };
  var yText = function(d, i) {
    return y(d, i) + yScale.rangeBand() / 2;
  };
  var x = d3.scale.linear().domain([0, d3.max(sortedData, barValue)]).range([0, maxBarWidth]);
  // svg container element
  var chart = d3.select(node)
    .attr('width', maxBarWidth + barLabelWidth + valueLabelWidth)
    .attr('height', gridLabelHeight + gridChartOffset + sortedData.length * barHeight);
  // grid line labels
  var gridContainer = chart.append('g')
    .attr('transform', 'translate(' + barLabelWidth + ',' + gridLabelHeight + ')');
  gridContainer.selectAll("text").data(x.ticks(10)).enter().append("text")
    .attr("x", x)
    .attr("dy", -3)
    .attr("text-anchor", "middle")
    .text(String);
  // vertical grid lines
  gridContainer.selectAll("line").data(x.ticks(10)).enter().append("line")
    .attr("x1", x)
    .attr("x2", x)
    .attr("y1", 0)
    .attr("y2", yScale.rangeExtent()[1] + gridChartOffset)
    .style("stroke", "#ccc");
  // bar labels
  var labelsContainer = chart.append('g')
    .attr('transform', 'translate(' + (barLabelWidth - barLabelPadding) + ',' + (gridLabelHeight + gridChartOffset) + ')');
  labelsContainer.selectAll('text').data(sortedData).enter().append('text')
    .attr('y', yText)
    .attr('stroke', 'none')
    .attr('fill', 'black')
    .attr("dy", ".35em") // vertical-align: middle
    .attr('text-anchor', 'end')
    .text(barLabel);
  // bars
  var barsContainer = chart.append('g')
    .attr('transform', 'translate(' + barLabelWidth + ',' + (gridLabelHeight + gridChartOffset) + ')');
  barsContainer.selectAll("rect").data(sortedData).enter().append("rect")
    .attr('y', y)
    .attr('height', yScale.rangeBand())
    .attr('width', function(d) {
      return x(barValue(d));
    })
    .attr('stroke', 'white')
    .attr('fill', '#777');
  // bar value labels
  barsContainer.selectAll("text").data(sortedData).enter().append("text")
    .attr("x", function(d) {
      return x(barValue(d));
    })
    .attr("y", yText)
    .attr("dx", 3) // padding-left
    .attr("dy", ".35em") // vertical-align: middle
    .attr("text-anchor", "start") // text-align: right
    .attr("fill", "black")
    .attr("stroke", "none")
    .text(function(d) {
      if (options && options.formatCurrency && options.formatCurrency === true) {
        return formatCurrency(d.value * 100);
      } else {
        return barValue(d);
      }
    });
  // start line
  barsContainer.append("line")
    .attr("y1", -gridChartOffset)
    .attr("y2", yScale.rangeExtent()[1] + gridChartOffset)
    .style("stroke", "#000");
}

Template.admin_statistics.helpers({
  balance: function() {
    var totalValue = 0;
    Crates.find({
      depleted: {
        $exists: false
      }
    }).map(function(crate) {
      totalValue -= (crate.volume * crate.pricePerBottle);
    });

    Meteor.users.find().map(function(user) {
      totalValue += user.profile.balance;
    });

    return totalValue;
  }
});

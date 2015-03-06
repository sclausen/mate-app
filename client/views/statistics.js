Template.statistics.rendered = function() {
  var self = this;
  self.node = self.find("svg");

  if (!self.handle) {
    self.handle = Deps.autorun(function() {

      var transactions = Transactions.find({
        userId: Meteor.userId()
      }, {
        sort: {
          bought: 1
        }
      }).fetch();

      var data = [];

      var lastValue = 0;
      _.each(transactions, function(transaction) {
        var newValue = lastValue + transaction.value;
        lastValue = newValue;
        data.push({
          date: transaction.bought,
          value: newValue
        });
      });

      var margin = {
        top: 20,
        right: 20,
        bottom: 30,
        left: 50
      },
        width = 1200 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

      var x = d3.time.scale()
        .range([0, width]);

      var y = d3.scale.linear()
        .range([height, 0]);

      var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .tickFormat(d3.time.format('%d.%m.'))

      var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

      var line = d3.svg.line()
        .interpolate("step-after")
        .x(function(d) {
          return x(d.date);
        })
        .y(function(d) {
          return y(d.value);
        });

      var svg = d3.select(self.node)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

      x.domain(d3.extent(data, function(d) {
        return d.date;
      }));
      y.domain(d3.extent(data, function(d) {
        return d.value;
      }));

      svg.append("g")
        .attr("class", "grid")
        .attr("transform", "translate(" + 0 + "," + height + ")")
        .call(d3.svg.axis()
          .scale(x)
          .orient("bottom")
          .ticks(d3.time.days, 1)
          // .ticks(data.length)
          .tickSize(-height, 0, 0)
          .tickFormat("")
      );

      svg.append("g")
        .attr("class", "grid")
        .call(d3.svg.axis()
          .scale(y)
          .orient("left")
          // .ticks(10)
          .tickSize(-width, 0, 0)
          .tickFormat("")
      );

      svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

      svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text(__("balance") + " (€)");

      svg.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("d", line);

      svg.selectAll("dot")
        .data(data)
        .enter().append("circle")
        .attr("r", 3.5)
        .attr("cx", function(d) {
          return x(d.date);
        })
        .attr("cy", function(d) {
          return y(d.value);
        });
    });
  }
};

Template.statistics.destroyed = function() {
  this.handle && this.handle.stop();
};

subs = new SubsManager({
  cacheLimit: 10,
  expireIn: 1
});

Router.configure({
  layoutTemplate: 'layout',
  notFoundTemplate: 'not_found'
});

Router.map(function() {
  this.route('transactions', {
    controller: 'TransactionsController'
  });

  this.route('profile', {
    waitOn: function() {
      return subs.subscribe('users');
    },
    data: function() {
      return Meteor.user();
    }
  });
  this.route('logout', {
    template: 'login',
    onAfterAction: function() {
      var self = this;
      Meteor.logout(function(error) {
        if (error && error.reason) {
          FlashMessages.sendError(error.reason);
        }
        self.redirect('login');
      });
    }
  });
  this.route('statistics');

  this.route('/terms-of-use', {
    name: 'terms-of-use',
    template: 'termsAndConditions',
    waitOn: function() {
      return Meteor.subscribe('pages', {
        name: 'termsAndConditions',
        locale: Session.get('locale')
      });
    },
    data: function() {
      return Pages.findOne({
        name: "termsAndConditions",
        locale: Session.get('locale')
      });
    }
  });

  this.route('/', {
    name: 'news',
    controller: 'NewsController'
  });

  this.route('legalnotice', {
    waitOn: function() {
      return Meteor.subscribe("pages", {
        name: "legalnotice",
        locale: Session.get('locale')
      });
    },
    data: function() {
      if (this.ready()) {
        return Pages.findOne({
          name: "legalnotice",
          locale: Session.get('locale')
        });
      }
    }
  });

  this.route('help', {
    waitOn: function() {
      return Meteor.subscribe("pages", {
        name: "help",
        locale: Session.get('locale')
      });
    },
    data: function() {
      if (this.ready()) {
        return Pages.findOne({
          name: "help",
          locale: Session.get('locale')
        });
      }
    }
  });

  this.route('crates', {
    controller: 'CratesController'
  });

  this.route('/admin/consumers', {
    name: 'admin_consumers',
    template: 'admin_consumers',
    controller: 'AdminConsumersController'
  });

  this.route('/admin/consumers/:_id', {
    name: 'admin_consumer',
    template: 'admin_consumer_detail',
    waitOn: function() {
      return subs.subscribe("singleUser", this.params._id);
    },
    onBeforeAction: function() {
      if (!Meteor.loggingIn() && !Roles.userIsInRole(Meteor.user(), ['users:update'])) {
        this.redirect('/');
      } else {
        this.next();
      }
    },
    data: function() {
      var user = Meteor.users.findOne(this.params._id);
      if (user === undefined) {
        return null;
      }
      return user;
    },
    action: function() {
      if (this.ready()) {
        this.render();
      } else {
        this.next();
      }
    }
  });

  this.route('/admin/crates/:_id', {
    name: 'admin_crate',
    template: 'admin_crate',
    controller: 'AdminCrateController'
  });

  this.route('/admin/crates', {
    name: 'admin_crates',
    template: 'admin_crates',
    controller: 'AdminCratesController'
  });

  this.route('/admin/transactions', {
    name: 'admin_transactions',
    template: 'admin_transactions',
    controller: 'AdminTransactionsController'
  });

  this.route('/admin/news', {
    name: 'admin_news',
    template: 'admin_news',
    controller: 'AdminNewsController'
  });

  this.route('/admin/news/:_id', {
    name: 'admin_news_edit',
    template: 'admin_news_edit',
    controller: 'AdminNewsEditController'
  });

  this.route('/admin/pages', {
    name: 'admin_pages',
    template: 'admin_pages',
    controller: 'AdminPagesController'
  });

  this.route('/admin/pages/:_id', {
    name: 'admin_page_edit',
    template: 'admin_page_edit',
    controller: 'AdminPageEditController'
  });

  this.route('admin_statistics', {
    path: '/admin/statistics',
    template: 'admin_statistics',
    controller: 'AdminStatisticsController'
  });

});

Router.plugin('ensureSignedIn', {
  except: ['atSignIn', 'atSignUp', 'atForgotPassword', 'privacy', 'legalnotice', 'terms-of-use', 'verify']
});

var ensureAdmin = function() {
  if (!Meteor.userId() || !Roles.userIsInRole(Meteor.user(), ['admin'])) {
    this.redirect('/');
  } else {
    this.next();
  }
};

Router.onBeforeAction(ensureAdmin, {
  only: [
    'admin/publications',
    'admin/users',
    'admin_consumer',
    'admin_consumers',
    'admin_crate',
    'admin_crates',
    'admin_news_edit',
    'admin_news',
    'admin_pages_edit',
    'admin_pages',
    'admin_statistics',
    'admin_transactions'
  ]
});

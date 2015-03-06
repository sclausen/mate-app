AccountsTemplates.configure({
  // Behaviour
  confirmPassword: true,
  enablePasswordChange: false,
  forbidClientAccountCreation: false,
  overrideLoginErrors: true,
  sendVerificationEmail: false,

  // Appearance
  showAddRemoveServices: false,
  //showForgotPasswordLink: true,
  showLabels: true,
  showPlaceholders: true,

  // Client-side Validation
  continuousValidation: false,
  negativeFeedback: false,
  negativeValidation: true,
  positiveValidation: true,
  positiveFeedback: true,

  // Privacy Policy and Terms of Use
  // privacyUrl: 'privacy',
  // termsUrl: '/terms-of-use',

  // Redirects
  homeRoutePath: 'news',
  redirectTimeout: 4000,
  texts: {
    socialIcons: {
      bgx: "icon-bilfinger"
    }
  }
});

AccountsTemplates.configureRoute('signIn', {
  name: 'login',
  path: 'login',
  redirect: function () {
    var user = Meteor.user();
    if (user) {
      Router.go('news');
    }
  }
});

AccountsTemplates.configureRoute('signUp', {
  name: 'register',
  path: 'register',
  redirect: '/'
});

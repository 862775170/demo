export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [{
      path: '/user',
      redirect: '/user/login'
    },
    {
      path: '/user/login',
      name: 'login',
      component: './User/Login'
    },
    {
      path: '/user/register',
      name: 'register',
      component: './User/Register'
    },
    {
      path: '/user/register-result',
      name: 'register.result',
      component: './User/RegisterResult',
    },
    {
      component: '404',
    },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    // authority: ['sysadmin', 'bizadmin', 'accountmgr'],
    routes: [
      {
        path: '/',
        redirect: '/friendsCore'
      },
      {
        // 好友中心
        path: '/friendsCore',
        name: 'friendsCore',
        icon: 'user',
        component: './core/friendsCore',
      },
      {
        // 规则中心
        path: '/ruleCore',
        name: 'ruleCore',
        icon: 'environment',
        component: './core/ruleCore',
      },
      {
        // 任务中心
        path: '/taskCore',
        name: 'taskCore',
        icon: 'crown',
        component: './core/taskCore',
      },
      {
        name: 'account',
        icon: 'crown',
        path: '/account',
        routes: [
          {
            path: '/account/settings',
            name: 'settings',
            component: './Account/Settings/Info',
            routes: [
              {
                path: '/account/settings',
                redirect: '/account/settings/base',
              },
              {
                path: '/account/settings/base',
                component: './Account/Settings/BaseView',
              },
              {
                path: '/account/settings/security',
                component: './Account/Settings/SecurityView',
              },
              {
                path: '/account/settings/binding',
                component: './Account/Settings/BindingView',
              },
              {
                path: '/account/settings/notification',
                component: './Account/Settings/NotificationView',
              },
            ],
          },
        ],
      },
      {
        path: '/exception',
        routes: [
          {
            path: '/exception/500',
            component: './Exception/500',
          },
          {
            path: '/exception/403',
            component: './Exception/403',
          }

        ]

      },


      {
        component: '404',
      },
    ],
  },


];

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

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
        component: './FriendCenter/FriendsCore',
      },
      {
        // 规则中心
        path: '/ruleCore',
        name: 'ruleCore',
        icon: 'environment',
        component: './RuleCenter/RuleCore',
      },
      {
        // 文件中心
        path: '/fileCore',
        name: 'fileCore',
        icon: 'crown',
        component: './FileCenter/FileCore',
      },
      {
        // 搜索
        path: '/search',
        name: 'search',
        icon: 'crown',
        component: './FileCenter/FileCore',
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

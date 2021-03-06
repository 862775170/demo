import { routerRedux } from 'dva/router';
// import { stringify } from 'qs';
import { accountLogin, getFakeCaptcha } from '@/services/api';
import { switchRole } from '@/services/user';
import { setAuth,setChageRole,setRootIds,setToken,setUserId,setUserInfo } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import { reloadAuthorized } from '@/utils/Authorized';

export default {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(accountLogin, payload);
      response.currentUser = response.result.info;
      // response.type = 'account';
      // response.status = 'ok';
      yield put({
        type: 'changeLoginStatus', 
        payload: response,
      });
      // Login successfully
      const {result} = response;
      if (result) {
        console.log(111);
        
        setAuth(result.info.auth);
        
        setToken(result.token);
        console.log(11);
        setUserInfo(result.info);
        setUserId(result.info.id);
        setRootIds(result.info.root_ids);
        setChageRole(true);
        
        reloadAuthorized();
        
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params;
        
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = redirect;
            return;
          }
        }
        yield put(routerRedux.replace(redirect || '/'));
      }
    },

    *getCaptcha({ payload }, { call }) {
      yield call(getFakeCaptcha, payload);
    },

    *logout(_, { put }) {
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: false,
          currentAuthority: 'guest',
        },
      });
      reloadAuthorized();
      // yield put(
      //   routerRedux.replace({
      //     pathname: '/platform/',
      //     // search: stringify({
      //     //   redirect: window.location.href,
      //     // }),
      //   })
      // );
      window.location.href = "/";
      sessionStorage.removeItem('Authorization');
    },
    // 切换角色
    *switchRole({ payload }, { call, put }) {
      const response = yield call(switchRole, payload);
      response.currentAuthority = response.data.roleKey;
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      });
      reloadAuthorized();
      const urlParams = new URL(window.location.href);
      const params = getPageQuery();
      let { redirect } = params;
      if (redirect) {
        const redirectUrlParams = new URL(redirect);
        if (redirectUrlParams.origin === urlParams.origin) {
          redirect = redirect.substr(urlParams.origin.length);
          if (redirect.match(/^\/.*#/)) {
            redirect = redirect.substr(redirect.indexOf('#') + 1);
          }
        } else {
          window.location.href = redirect;
          // window.location.reload();
          return;
        }
      }
      yield put(routerRedux.replace(redirect || '/'));
      window.location.reload();

    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      // setAuthority(payload.currentAuthority);
      const currentUser = payload
      return {
        ...state,
        currentUser,
        status: payload.status,
        type: payload.type,
      };
    },
  },
};

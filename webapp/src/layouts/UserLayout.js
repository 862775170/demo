import React, { Component, Fragment } from 'react';
// import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import Link from 'umi/link';
import { Icon } from 'antd';
import GlobalFooter from '@/components/GlobalFooter';
import DocumentTitle from 'react-document-title';
import SelectLang from '@/components/SelectLang';
import styles from './UserLayout.less';
// import logo from '../assets/logo.svg';
import logo from '../assets/flogo.png';
import getPageTitle from '@/utils/getPageTitle';

// const links = [
//   {
//     key: 'help',
//     title: formatMessage({ id: 'layout.user.link.help' }),
//     href: '',
//   },
//   {
//     key: 'privacy',
//     title: formatMessage({ id: 'layout.user.link.privacy' }),
//     href: '',
//   },
//   {
//     key: 'terms',
//     title: formatMessage({ id: 'layout.user.link.terms' }),
//     href: '',
//   },
// ];

const copyright = (
  <Fragment>
    Copyright <Icon type="copyright" /> 2019 深证通·金融云业务运营支撑系统 V0.0.1
  </Fragment>
);

class UserLayout extends Component {
  componentDidMount() {
    const {
      dispatch,
      route: { routes, authority },
    } = this.props;
    dispatch({
      type: 'menu/getMenuData',
      payload: { routes, authority },
    });
  }

  render() {
    const {
      children,
      location: { pathname },
      breadcrumbNameMap,
    } = this.props;
    return (
      <DocumentTitle title={getPageTitle(pathname, breadcrumbNameMap)}>
        <div className={styles.container}>
          <div className={styles.lang}>
            <SelectLang />
          </div>
          <div className={styles.content}>
            <div className={styles.top}>
              <div className={styles.header}>
                <Link to="/">                  
                  <img alt="logo" className={styles.logo} src={logo} style={{width:'200px',height:'50px'}} />                  
                </Link>
              </div>
              <div className={styles.desc}>金融云业务运营支撑管理系统</div>
            </div>
            {children}
          </div>
          <GlobalFooter copyright={copyright} />
        </div>
      </DocumentTitle>
    );
  }
}

export default connect(({ menu: menuModel }) => ({
  menuData: menuModel.menuData,
  breadcrumbNameMap: menuModel.breadcrumbNameMap,
}))(UserLayout);
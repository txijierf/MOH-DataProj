import React, {Component, Suspense} from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';
import {Container} from '@material-ui/core'

import {
  AppHeader,
  AppSidebar,
  AppSidebarFooter,
  AppSidebarForm,
  AppSidebarHeader,
  AppSidebarMinimizer,
  AppSidebarNav,
} from '@coreui/react';
// sidebar nav config
import navigationData from '../../_nav';
// routes config
import routes from '../../routes';
import {lastUrl, setLastUrl, isLoggedIn, logout} from "../../controller/userManager";
import CustomSnackbarContent from "../../views/AttCat/components/CustomSnackbarContent";
import {Snackbar} from "@material-ui/core";
import {withStyles} from "@material-ui/core/styles";
import AppBreadcrumb from '../AppBreadcrumb';
import Loading from '../../views/components/Loading';

const DefaultHeader = React.lazy(() => import('./DefaultHeader'));

const styles = {
  container: {
    paddingLeft: 12,
    paddingRight: 12,
  },
  main: {
    backgroundColor: '#f3f4fd'
  }
};

const Logout = () => (
  <Suspense fallback={<Loading/>}>
    <DefaultHeader onLogout={() => logout()}/>
  </Suspense>
);

const AccountMenu = () => (
  <AppHeader fixed>
    <Logout/>
  </AppHeader>
);

const SideBarContent = (props) => (
  <Suspense>
    <AppSidebarNav navConfig={navigationData} {...props} />
  </Suspense>
);

const SideBar = (props) => (
  <AppSidebar fixed display="lg">
    <AppSidebarHeader/>
    <AppSidebarForm/>
    <SideBarContent {...props}/>
    <AppSidebarFooter/>
    <AppSidebarMinimizer/>
  </AppSidebar>
);

const AppRoutes = ({ showMessage }) => {
  const Routes = routes.map((route, idx) => (
    route.component && 
      <Route key={idx} path={route.path} exact={route.exact} name={route.name}
        render={props => <route.component showMessage={showMessage} params={route.params ? route.params : {}} {...props} />}
      />
  ));

  return (
    <Switch>
      {Routes}
      <Redirect from="/" to="/profile"/>
    </Switch>
  );
};

const RoutesLoader = ({ showMessage }) => (
  <Suspense fallback={<Loading/>}>
    <AppRoutes showMessage={showMessage}/>
  </Suspense>
);

const RouteContent = ({ showMessage, props }) => (
  <Container maxWidth="xl" className={props.classes.container}>
    <RoutesLoader showMessage={showMessage}/>
  </Container>
);

const AppContent = ({ showMessage, props }) => (
  <div className={props.classes.main + ' main'}>
    <AppBreadcrumb appRoutes={routes}/>
    <RouteContent showMessage={showMessage} props={props}/>
  </div>
);

const AppBody = ({ showMessage, props }) => (
  <div className="app-body">
    <SideBar {...props}/>
    <AppContent showMessage={showMessage} props={props}/>
  </div>
);


class DefaultLayout extends Component {
  constructor(props) {
    super(props);
    isLoggedIn()
      .then(IsSignedIn => {
        if (!IsSignedIn) {
          setLastUrl(window.location.hash.replace('#', ''));
          props.history.push('/login');
        }
      })
      .catch(err => this.showMessage(err.message + ': Cannot reach backend server', 'error'));
    // for snackbar
    this.queue = [];
    this.state = {
      openSnackbar: false, messageInfo: {}
    };
  }

  componentDidMount() {
    // go to the page before login
    if (lastUrl) {
      this.props.history.push(lastUrl);
      setLastUrl(null);
    }
  }

  loading = () => <Loading/>;

  /**
   * Snackbar methods
   * @param message
   * @param {'success'|'error'|'info'|'warning'} variant
   */
  showMessage = (message, variant) => {
    this.queue.push({
      message,
      variant,
      key: new Date().getTime(),
    });

    if (this.state.openSnackbar) {
      // immediately begin dismissing current message
      // to start showing new one
      this.setState({openSnackbar: false});
    } else {
      this.processQueue();
    }
  };

  processQueue = () => {
    if (this.queue.length > 0) {
      this.setState({
        messageInfo: this.queue.shift(),
        openSnackbar: true,
      });
    }
  };

  handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({openSnackbar: false});
  };

  handleExitedSnackbar = () => {
    this.processQueue();
  };

  render() {
    if (this.state.hasError) {

    }

    const anchorOrigin = {
      vertical: 'bottom',
      horizontal: 'left',
    };

    return (
      <div className="app">
        <AccountMenu/>
        <AppBody showMessage={this.showMessage} props={this.props}/>
        <Snackbar
          anchorOrigin={anchorOrigin}
          open={this.state.openSnackbar}
          autoHideDuration={6000}
          onClose={this.handleCloseSnackbar}
          onExited={this.handleExitedSnackbar}
        >
        <CustomSnackbarContent
          onClose={this.handleCloseSnackbar}
          variant={this.state.messageInfo.variant}
          message={this.state.messageInfo.message}
        />
        </Snackbar>
      </div>
    );
  }
}

export default withStyles(styles)(DefaultLayout);

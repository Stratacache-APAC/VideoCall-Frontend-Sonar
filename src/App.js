// import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useParams
} from 'react-router-dom';
import { useEffect } from 'react';
import { connectWithWebSocket } from './utils/wssConnection/wssConnection';
import Dashboard from './Dashboard/Dashboard';
import LoginPage from './LoginPage/LoginPage';
import ForgotPage from './LoginPage/ForgotPage';
import MachineLogin from './MachineLogin/MachineLogin';
import MainDashboard from './MainDashboard/MainDashboard';
import OperatorList from './Admin/OperatorList';
import EditRole from './Admin/editRole';
import AuditList from './Admin/AuditList';
import UserProfile from './Admin/component/UserProfile';
import OperatorEdit from './Admin/OperatorEdit';
import AuditListInit from './Admin/AuditListInit';
import CallLog from './Admin/CallLog';
import ManageRoles from './Admin/ManageRoles.js';
import reports from './Admin/reports.js';
import selectedCallLog from './Admin/selectedCallLog';
import PrivateRoute from './utils/routing/PrivateRoute';
import PublicRoute from './utils/routing/PublicRoute';

import Thankyou from './Dashboard/components/ThankyouScreen/Thankyou'

function App () {
  useEffect(() => {
    connectWithWebSocket();
  }, []);

  return (
    // <Router>
    //   {/* <NavbarLocal /> */}
    //   <Switch>
    //     <Route path='/dashboard'>
    //       <Dashboard />
    //     </Route>
    //     {/* <Route path='/dashboard/:MachineFlag'>
    //       <Dashboard />
    //     </Route> */}
    //     <Route path='/login'>
    //       <LoginPage />
    //     </Route>
    //     <Route path="/main/:userid/:userreason">
    //       <MainDashboard />
    //     </Route>
    //     <Route path='/operatorlist'>
    //       <OperatorList />
    //     </Route>
    //     <Route path='/operatorEdit/:userid'>
    //       <OperatorEdit />
    //     </Route>
    //     <Route path='/'>
    //       <OperatorEdit />
    //     </Route>
    //     {/* <Route path='/'>
    //       <LoginPage />
    //     </Route> */}
    //     {/* <Route path='/machine'>
    //       <MachineLogin />
    //     </Route> */}
       
    //   </Switch>
    // </Router>
    <Router>
      <Switch>
        <Route exact path="/" component={LoginPage} />
        <PublicRoute path="/login" component={LoginPage} />
        <PublicRoute path="/forgot" component={ForgotPage} />
        <PublicRoute path="/thankyou" component={Thankyou} />
        <PublicRoute path="/main/:userid/:userreason/:kioskSessionId" component={MainDashboard} />
        <PublicRoute path="/editRole/:roleName" component={EditRole} />
        {/* <PublicRoute path="/main/:userid/:userreason/:kioskID" component={MainDashboard} /> */}
        <PrivateRoute path="/dashboard" component={Dashboard} />
        <PrivateRoute path="/operatorlist" component={OperatorList} />
        <PrivateRoute path="/Auditlist" component={AuditList} />
        <PrivateRoute path="/userprofile" component={UserProfile} />
        <PrivateRoute path="/Auditlistinit" component={AuditListInit} />
        <PrivateRoute path="/operatorEdit/:userid" component={OperatorEdit} />
        <PrivateRoute path="/operatorEdit/" component={OperatorEdit} />
        <PrivateRoute path="/calllog/:sessionId" component={CallLog} />
        <PrivateRoute path="/manage-roles" component={ManageRoles} />
        <PrivateRoute path="/reports" component={reports} />
        <PrivateRoute path="/selectedCalllog/:sessionId" component={selectedCallLog} />
      </Switch>
    </Router>
  );
}

export default App;

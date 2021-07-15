import logo from './logo.svg';
import './App.css';
import React from 'react';
import Home from './Home.js';
import Login from './Login.js';
import AddBlog from './addBlog.js';
import Signup from './Signup.js'
import { BrowserRouter as Router , Route, Link, Switch ,Redirect} from 'react-router-dom';


//import { withRouter } from 'react-router-dom';

const routes = [
 
  {
    path: "/",
    exact:true,
    component: Home
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/signup',
    component: Signup
  },
  {
    path:'/addBlog',
    component:AddBlog
  },
  {
    path: '*',
    render: () => <Redirect to="/" />
  }
];
export default class App extends React.Component {
  constructor(props){
    super(props)
    }
 
  render(){
    return (
        <div >
          <Router>
            <Switch>
              {routes.map((route, index) => (
              <Route key={index} {...route} />
              )
              )}
            </Switch>
          </Router>
        </div>
        );
     }
}
 




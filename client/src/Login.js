import React from 'react';
import {Link, Redirect} from 'react-router-dom';
import Signup from './Signup.js';
import { withRouter } from 'react-router-dom';
import './home.css';

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state={
          username:'',
          password:'',
          error:null,
          login:false
        }
      }
 handleChange=(event)=> {
    this.setState({[event.target.name]: event.target.value});
 }
    
submitform = (e) => {
      e.preventDefault()
      let username=this.state.username
      let password=this.state.password
      
     
        //logic magic
        const requestOptions = {
            method: 'POST',

            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ username: username, password: password })
        };
        fetch('/login', requestOptions)
            .then(response => response.json()).then(data=> {
              console.log(data)
              let userId = data._id
              if(data){
                localStorage.setItem("username",username)
                localStorage.setItem("userId",userId)
                this.setState({
                    login:true
                })
              }
              else{
                this.setState({
                  error:'something went wrong',
                })
               }
            })
          }

render() {
     let userId = localStorage.getItem('userId')
      if(userId){
          return <Redirect to='/' />
      }
      return (
        <div class="login-form" >
            <div>{this.state.error}</div>
            <h1>Login Form</h1>
            <form   onSubmit={this.submitform} autocomplete="off">
              <label>
              <input type="text" className="form-control" name="username"  placeholder="Username" value={this.state.username} onChange={this.handleChange} required /><br></br>
              <input type="password" className="form-control" name="password" placeholder="password" value={this.state.password}  onChange={this.handleChange} required/><br></br>
              <input class="btn btn-primary" type="submit" />
             </label>
            </form>
            <h5>new user ? <Link to="/signup">signup</Link></h5>
           
        </div>


    )
  }
}
export default Login;
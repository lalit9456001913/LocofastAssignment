import React from 'react';
import { Redirect } from 'react-router-dom';
import { BrowserRouter , Route, Link, Switch } from 'react-router-dom';
import './home.css';

class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    	error:'',
    	username:'',
    	password:'',
    	email:'',
    	};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({[event.target.name]: event.target.value});
  }

 

  handleSubmit(event) {

     event.preventDefault();
     let user={
         username:this.state.username,
         password:this.state.password,
         email:this.state.email
     }
     const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({user:user})
    };

    
     fetch('/updateUser', requestOptions)
        .then(response=>{
        	if(response.ok){
                this.props.history.push('/login')
              }
              else{
                this.setState({
                  error:'some thing went wrong',
                })
		    }
        })
   }

  render() {
    return (

    <div>
    	<br></br>
        <h1 className="signup-heading">signup</h1>
    <div>{this.state.error}</div>
      <form className="signup-form" onSubmit={this.handleSubmit} autocomplete="off">
        <label>
          <input type="text" class="form-control" name="username" value={this.state.username} placeholder="name" onChange={this.handleChange} required/><br></br>
          <input type="email" class="form-control"  name="email" placeholder="email" value={this.state.email} onChange={this.handleChange}  required/><br></br>
          <input type="password" class="form-control" name="password" placeholder="password" value={this.state.password} onChange={this.handleChange} required/><br></br>
          <input class="btn btn-primary" type="submit" value="Submit" />
		</label>
        
      </form>
    </div>
    );
  }
}

export default Signup;
import React from 'react';
import { BrowserRouter as Router, Route, Link, Switch, Redirect } from 'react-router-dom';
import './home.css';

class Navbar extends React.Component{
	constructor(){
		super()
		this.state={
			login:true,
            searchValue:''
		  }
		}
handleChange=(event)=>{
    this.setState({
        [event.target.name]:event.target.value
    })
}
search=()=>{
    let search=this.state.searchValue
    console.log(this.state.searchValue)
    fetch('/searchBlog/'+search).then(response=>response.json())
    .then(data=>{
        if(data){
            this.props.search(data)
        }
    })
}
onlogout=()=>{
	fetch('/logout').then(response=>{
        if(response.ok){
            localStorage.clear()
            this.setState({
                login:false
            })
        }
    })
    
  }

render(){
    if(!this.state.login){
        return <Redirect to='/login' />
    }
	return (    
              <>
				<nav>
                  <ul class="nav nav-pills pull-right">
                    <li><input type="text" value={this.state.searchValue} name="searchValue" onChange={this.handleChange} placeholder="Search here..." /></li>
                    <li><button onClick={this.search} >search<i class="fa fa-search"></i></button></li>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/addBlog">Add</Link></li>
                    <li><div id="logout"><a href='javascript:;' onClick={this.onlogout}>Logout </a></div></li>
                  </ul>
                </nav>
			  </>
		)
	}
}		          
		          	
  

export default Navbar;



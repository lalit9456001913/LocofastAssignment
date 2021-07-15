
import React from 'react';
import Login from './Login';
import './home.css'
import Edit from './Edit.js'
import { Redirect, BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import Navbar from './Navbar.js';

class Home extends React.Component{
    constructor(props){
        super(props)
        let login=false
        let userId = localStorage.getItem('userId')
        login=userId?true:false
        this.state={
          allUserBlogs:[],
          updateObj:'',
          showUpdateDialogueBox:false,
          login:login
        }
        this.handleOnChange = this.handleOnChange.bind(this);
    }
    componentDidMount(){
        let userId = localStorage.getItem('userId')
        fetch('/getAllBlogs/'+userId).then(response=>response.json()).then(data=>{
            console.log('data......',data)
              this.setState({
                  allUserBlogs:data,
              })
         })
    }
    handleOnChange(event){
        this.setState({
            [event.target.name]:event.target.value
        })
    }
    
    delete=(blog)=>{
        const requestOptions = {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({_id: blog._id })
         };
       
         fetch('/deleteBlog',requestOptions).then(response=>{
            if(response.ok){
                let temp = this.state.allUserBlogs.filter(userBlog=>userBlog._id!==blog._id)
                this.setState({
                  allUserBlogs:temp
                })
            }
         }) 
    }
    showUpdateDialogueBoxFlag=()=>{
      let userId = localStorage.getItem('userId')
        fetch('/getAllBlogs/'+userId).then(response=>response.json()).then(data=>{
              console.log('data......',data)
                this.setState({
                    showUpdateDialogueBox:false,
                    allUserBlogs:data
                })
           })
    }
    edit=(blog)=>{
        console.log('insode edit')
        this.setState({
            showUpdateDialogueBox:true,
            updateObj:blog
        })
    }
    search=(value)=>{
      this.setState({
        allUserBlogs:value
      })
    }
    // submitForm=(e)=>{
    //     e.preventDefault()
    //     const requestOptions = {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'Accept': 'application/json'
    //         },
    //         body: JSON.stringify({ })
    //     };
        
    //     fetch('/getAllBlogs', requestOptions)
    //         .then(response=> {
    //             console.log(response)
    //             if(response.ok){
    //                 this.setState({
                        
    //                 })
    //             }
    //         })
    //     }

    render(){
       if(!this.state.login){
           return <Redirect to='/login' />
       }
    
      if(this.state.showUpdateDialogueBox){
          return <Edit showUpdateDialogueBoxFlag={this.showUpdateDialogueBoxFlag}  blog={this.state.updateObj} />
      }
       return(
         <>
       <Navbar search={this.search} />
          <h2 className="home-heading">all user blog</h2>
    <table className="table table-striped">
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Subject</th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {
                this.state.allUserBlogs.map((blog,index)=> {
                   return <tr key={index} >
                            <td>{index+1}</td>
                            <td>{blog.title}</td>
                            <td>{blog.author.username}</td>
                            <td>
                              <span className="glyphicon glyphicon-pencil" onClick={(e)=>this.edit(blog)}></span>
                            </td>
                            <td>
                              <span className="glyphicon glyphicon-remove" onClick={(e)=>this.delete(blog)}></span>
                            </td>
                          </tr>
                })
              }
            </tbody>
</table>
</>
           
       )
    }
}
export default Home;
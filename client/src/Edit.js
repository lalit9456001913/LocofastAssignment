import React from 'react';
import { Redirect } from 'react-router';
// import { Redirect, BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';

import './home.css'

class Edit extends React.Component{
    constructor(props){
        console.log(props)
        super(props)
        this.state={
              blog:this.props.blog,
              title:this.props.blog.title,
              content:this.props.blog.content,
              goToHome:false
          }
        this.handleOnChange = this.handleOnChange.bind(this);
    }

    handleOnChange(event) {
        this.setState({[event.target.name]: event.target.value});
      }

    update=(e)=>{
        console.log('inside update')
        e.preventDefault()
        let blog = {
            _id:this.state.blog._id,
            title:this.state.title,
            content:this.state.content,
            author:this.state.blog.author
        }
        console.log(blog)
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({blog:blog})
        };
        console.log(requestOptions)
        fetch('/updateBlog', requestOptions)
         .then(response=> {
            console.log('response...',response)
            if(response.ok){
              this.props.showUpdateDialogueBoxFlag(false)
            }else{
                this.setState({
                    goToHome:false
                })
            }
        })
    }
    

    
    render(){

      
        return (
            <>
            <br></br>

            <div>
                <h3>update blog</h3>
                <form onSubmit={this.update}>
                    <div className="form-group">
                        <label for="title">Title</label>
                        <input value={this.state.title} type="text" onChange={this.handleOnChange} className="form-control" id="title" name="title" placeholder="Title" required />
                    </div>
                    
                    <div className="form-group">
                        <label for="content">Content</label>
                        <textarea value={this.state.content} className="form-control"  name="content" onChange={this.handleOnChange} type="textarea" id="content" placeholder="Content" maxlength="140" rows="7"></textarea>
                    </div>
                    <input type="submit" value="submit" class="btn btn-primary" />
                </form>
                {this.state.showError?<div className="showError">something went wrong</div>:null}
                
            </div>
            </>
        )
    }
}
export default Edit;


import React from 'react';

import { Redirect, BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';


class ReadBlog extends React.Component{
    constructor(props){
        console.log(props)
        super(props)
        this.state={
              blog:this.props.blog,
              title:this.props.blog.title,
              content:this.props.blog.content,
              goToHome:false
          }
        }
    goToHome=()=>{
        this.props.goBack()
    }

    render(){
        return (
            <>
            <br></br>

            <div>
                <h3>blog content</h3>
                
                    <div className="form-group">
                        <label for="title">Title</label>
                        <br></br>
                            {this.state.title}
                    </div>
                       
                    
                    <div className="form-group">
                        <label for="content">Content</label>
                        <br></br>
                         {this.state.content}
                    </div>
                    
            </div>
            <button onClick={this.goToHome}>go to Home Page</button>
            </>
        )
    }
}
export default ReadBlog;


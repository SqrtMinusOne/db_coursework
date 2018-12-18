import React, { Component } from 'react';
import '../App.css'

export class Header extends Component{
	render(){
		//const button_class = 'w3-button w3-theme-d2 w3-margin-left';
		return(
			<div className={"w3-top"}>
				<div className={"w3-bar w3-theme-d1"}>
					<button className={"w3-bar-item w3-left w3-button w3-xlarge"} onClick={this.props.toggleSidebar}
					        style={{display: this.props.isSidebarShown ? "block" : "none"}}>&#9776;</button>
					<h3 className={"w3-bar-item header"}>Автобусный парк</h3>
				</div>
			</div>
		)
	}
}

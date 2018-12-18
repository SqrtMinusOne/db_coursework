import React, { Component } from 'react';
import '../App.css'

export class Sidebar extends Component{
	constructor(props){
		super(props);
		this.handleButton = this.handleButton.bind(this)
	}

	handleButton(new_page){
		this.props.buttonClick(new_page);
	}

	render(){
		const button_class="w3-button w3-hover-blue w3-bar-item w3-bar-block w3-theme-d3";
		return(
			<div className={"w3-top"}>
				<div className={"w3-sidebar w3-bar-block w3-card w3-animate-left w3-theme-l1"}
				     style={{
				     	 display: this.props.isShown ? 'inline' : 'none',
					     width: "25%"
				     }}>
					<button className={button_class} onClick={this.props.toggle}>
						Закрыть &times;
					</button>
					{
						Object.keys(this.props.buttons).map((key, index)=>(
							<button className={button_class} key={index}
							        onClick={this.handleButton.bind(this, key)}>
								{this.props.buttons[key]}
							</button>
						))
					}
				</div>
			</div>
		)
	}
}

import React, {Component} from 'react'
import '../App.css'

export class Collapsible extends Component{
	constructor(props) {
		super(props);
		this.state = {
			toggled: false
		};
		this.handleToggle = this.handleToggle.bind(this);
	}

	handleToggle(){
		this.setState((oldState)=>{
			oldState.toggled = !oldState.toggled;
			return oldState;
		})
	}

	render() {
		let arrow = this.state.toggled ? "▲ " : "▼";
		return(
			<div className={this.props.className}>
				<button className={"w3-button w3-theme-d5 w3-animate-left w3-display-container"}
				        onClick={this.handleToggle}>
					<div className={"w3-display-right w3-margin-right"}>
						{arrow}
					</div>
					<div style={{paddingRight: 20}}>
						{this.props.header}
					</div>
				</button>
				<SimpleCollapsible toggled={this.state.toggled}>
					{this.props.children}
				</SimpleCollapsible>
			</div>
		)
	}
}

function SimpleCollapsible(props) {
	return (
		<div style={{display: props.toggled ? "block" : "none"}} className={"w3-animate-zoom"}>
			{props.children}
		</div>
	)
}
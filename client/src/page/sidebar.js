import React, { Component } from 'react';
import '../App.css'

export class Sidebar extends Component{
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
							<ButtonDropDown key={index} label={key} buttons={this.props.buttons[key]}
							                handleButton={this.props.buttonClick}/>
						))
					}
				</div>
			</div>
		)
	}
}

class ButtonDropDown extends Component{
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
		let label = this.props.label;
		let arrow = this.state.toggled ? "▲ " : "▼";
		if (label === ""){
			return(<ButtonList buttons={this.props.buttons} handleButton={this.props.handleButton}
				theme={"w3-theme-d1"} spaces={0}/>)
		}
		return (
			<div className={"w3-dropdown-click w3-theme-l1"}>
				<button onClick={this.handleToggle} className={"w3-button w3-theme-d2 w3-display-container"}
						style={{outline: 0}}>
					{label}
					<div className={"w3-display-right w3-margin-right"}>
						{arrow}
					</div>
				</button>
				<div className={"w3-dropdown-content w3-bar-block w3-animate-left " +
								(this.state.toggled ? 'w3-show': '')}>
					<ButtonList buttons={this.props.buttons} handleButton={this.props.handleButton} spaces={4} />
				</div>
			</div>
		)
	}
}


function ButtonList(props){
	return(
		<div>
			{
				Object.keys(props.buttons).map((key, index)=>(
					<button key={index} onClick={props.handleButton.bind(this, key)}
					        className={"w3-bar-item w3-button " + (props.theme ? props.theme : 'w3-theme')}>
						{'\u00A0'.repeat(props.spaces) + props.buttons[key]}
					</button>
				))
			}
		</div>
	)
}
import React from 'react';
import '../App.css'

export function MessageModal(props){
	if (!props.header || !props.content){
		return (<div/>);
	}
	return(
		<div className={"w3-modal"} style={{display: "block"}}>
			<div className={"w3-modal-content w3-container w3-theme"}>
				<span className={"w3-button w3-display-topright"} onClick={props.onClose}>&times;</span>
				<header>
					<h3>{props.header}</h3>
				</header>
				<div className={"w3-margin-bottom"}>
					{props.content.split('\n').map((item, key) => {
						return <span key={key}>{item}<br/></span>
					})}
				</div>
				<button className={"w3-button w3-theme-d5 w3-margin-bottom"} onClick={props.onClose}>ОК</button>
			</div>
		</div>
	)
}


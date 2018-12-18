import React, { Component } from 'react';
import "../App.css"

export function Card(props) {
	return (
		<div>
			<div className='w3-card w3-theme-l3 w3-display-container w3-animate-top'>
				{(props.onClose !== undefined) &&
				<span className="w3-button w3-display-topright" onClick={props.onClose}>×</span>
				}
				<header className='w3-container w3-theme'>
					{props.header && <h1>{props.header}</h1>}
				</header>
				<div className='card_content'>
					{props.children}
				</div>
				<footer className='w3-container w3-theme'>
					{props.footer && <h5>{props.footer}</h5>}
				</footer>
			</div>
			<br />
		</div>
	)
}

export function HalfWidth(props) {
	return (
		<div className='w3-container w3-col s12 m6'>
			{props.children}
		</div>
	)
}
import React, { Component } from 'react';
import '../App.css'

export class EditModal extends Component{
	constructor(props){
		super(props);
		let data = [];
		for(let i = 0; i < this.props.heads.length; i++){
			data[i] = {
				'text': this.props.heads[i],
				'value': this.props.data && this.props.data[i]
			};
			let opts = this.getOpts(data[i], this.props.opt_fields);
			if (opts){
				data[i].type = 'select';
				data[i].values = opts;
				data[i].value = data[i].value || data[i].values[0][0];
				continue;
			}
			if (!this.props.data)
				continue;
			data[i].type = typeof(data[i].value);
			let value = data[i].value;
			let timeReg = /^([0-2][0-9]|[0-9]):[0-5][0-9]:[0-5][0-9]$/;
			if (typeof(value) === 'string' && data[i].value.match(timeReg)){
				if (data[i].value.match(/^[1-9]:/)){
					data[i].value = "0" + data[i].value;
				}
				data[i].type = "time";
			}
		}
		this.state = {
			data: data,
		};
		this.handleChange = this.handleChange.bind(this);
		this.handleClose = this.handleClose.bind(this);
		this.handleSave = this.handleSave.bind(this);
	}

	getOpts(field, opt_fields){
		if (opt_fields) {
			for (let opt_field of opt_fields) {
				if (opt_field.field === field.text) {
					return opt_field.values;
				}
			}
		}
	}

	handleChange(event){
		const target = event.target;
		const value = target.value;
		const row = parseInt(target.name);
		this.setState((oldState)=>{
			let state = oldState;
			state.data[row].value = value;
			return state;
		});
		console.log(this.state.data)
	}

	handleClose(){
		this.props.onClose();
	}

	handleSave(){
		this.props.onChange(this.state.data);
	}

	render() {
		return(
			<div className={"w3-modal"} style={{display: "block"}}>
				<div className={"w3-modal-content w3-container w3-theme"}>
					<span className={"w3-button w3-display-topright"} onClick={this.handleClose}>&times;</span>
					<header>
						<h3>Редактирование</h3>
					</header>
					<div>
						{
							this.state.data.map((field, index)=>{
								let input;
								if (field.type !== 'select'){
									input = (
										<input className={"w3-input w3-margin-bottom"} type={field.type}
										       name={index} defaultValue={field.value} onChange={this.handleChange}/>
									)
								} else{
									input = (
										<GroupSelect defaultValue={field.value} name={index}
										             onChange={this.handleChange} values={field.values}>
										</GroupSelect>
									)
								}
								return(
									<div key={index}>
										<label>{field.text}</label>
										{input}
									</div>
								)})
						}
					</div>
					<button className={"w3-button w3-orange w3-margin-bottom"} onClick={this.handleSave}>Сохранить</button>
				</div>
			</div>)
	}
}

function GroupSelect(props){
	let fields = [];
	let global_key = 0;
	let defaultValue = props.defaultValue;
	for (let value_group of props.values){
		if (value_group.name !== '%all%' && value_group.name.length !== 0)
			fields.push(<option key={global_key++} disabled>{value_group.name}</option>);
		for (let value of value_group.values){
			fields.push(<option key={global_key++} value={value[0]}>{value[1]}</option>)
			if (value[0] === 'NULL' && !defaultValue){
				defaultValue = value[0];
			}
		}
	}
	return(
		<select className={"w3-select w3-margin-bottom"} defaultValue={defaultValue} name={props.name}
		        onChange={props.onChange}>
			{fields.map((field)=>(field))}
		</select>
	)
}
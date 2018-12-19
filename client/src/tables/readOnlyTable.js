import React, { Component } from 'react';
import $ from 'jquery';
import '../App.css'
import {Card} from "../page/cards";
import {LoadingPage} from "../page/loading";
import {Table} from "./table";

export class ReadOnlyTable extends Component{
	constructor(props){
		super(props);
		this.state = {
			isLoading: true,
			data: null,
			header: null,
			params: this.props.params!=undefined,
			params_list: [],
			params_entered: false,
			marked_rows: [],
		};
		this.getInfo = this.getInfo.bind(this);
		this.updateInfo = this.updateInfo.bind(this);
		this.handleSaveParams = this.handleSaveParams.bind(this);
		this.handleChangeParams = this.handleChangeParams.bind(this);
		this.handleRowClick = this.handleRowClick.bind(this);
		this.request_pending = false
	}

	componentWillMount() {
		this.updateInfo();
	}

	componentWillReceiveProps(nextProps, nextContext) {
		this.updateInfo();
	}

	updateInfo(){
		if (!this.state.params || this.state.params_entered)
			this.getInfo(this.props.tableName);
		else{
			this.setState({isLoading: false, params: false})
		}
	}

	getInfo(tableName){
		if (this.request_pending)
			return;
		this.request_pending = true;
		let url = `http://127.0.0.1:5000/table?table_name=${tableName}`;
		console.log(this.state.params_list);
		for (let i=0; i < this.state.params_list.length; i++)
			url += `&${i}=${this.state.params_list[i]}`;

		$.ajax({
			url: url,
			method: 'GET',
			crossDomain: true,
		}).then(function (response) {
			if (response.ok){
				let data = JSON.parse(response.data);
				console.log(data);
				let header = data[0];
				data.splice(0, 1);
				this.setState({
					isLoading: false,
					data: data,
					header: header,
					opt_fields: response.types,
					params: true
				});
			}
			else{
				alert("Ошибка получения данных")
			}
			this.request_pending = false;
		}.bind(this))
	}

	handleRowClick(row, index){
		this.props.onRowClick && this.props.onRowClick(index);
	}

	handleSaveParams(){
		this.setState({
			params_entered: true,
			isLoading: true,
		});
		this.getInfo(this.props.tableName);
	}

	handleChangeParams(event){
		const target = event.target;
		const value = target.value;
		const name = target.name;
		this.setState((oldState)=>{
			let state = oldState;
			state.params_list[parseInt(name)] = value;
			return state;
		})
	}

	render(){
		let params_input;
		if (this.state.isLoading)
			return (<LoadingPage/>);
		let buttons = [];
		if (this.props.updateButton){
			buttons.push(<button className={"w3-button w3-theme-d3 w3-margin-bottom w3-margin-right"}
			                     onClick={this.updateInfo}>Обновить</button>)
		}
		if (this.props.params){
			params_input =  (
				<div>
					{
						this.props.params.map((param, index)=>(
							<span className={"w3-container w3-margin-bottom"} key={index}>
								<label className={"w3-margin-right"} style={{float: "left", marginTop: "8px"}}>{param}</label>
								<input className={"w3-input"} style={{float: "left", width: "30%"}}
								       name={index} onChange={this.handleChangeParams}/>
								<button className={"w3-button w3-theme-d5 w3-margin-left"} style={{float: "left"}}
								        onClick={this.handleSaveParams}>Отправить</button>
							</span>))
					}
				</div>
			)
		}
		return(
			<div>
				<Card header={this.props.header} footer="Корытов Павел, 6304">
					<span>{params_input}{buttons}</span>
					{(!this.props.params || (this.state.params && this.props.params)) &&
					<Table data={this.state.data} header={this.state.header} onRowClick={this.handleRowClick}/>
					}
				</Card>
			</div>
		)
	}
}
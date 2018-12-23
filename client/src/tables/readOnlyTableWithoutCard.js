import React, {Component} from 'react';
import $ from 'jquery';
import '../App.css'
import {LoadingPage} from "../page/loading";
import {Table} from "./table";

export class ReadOnlyTableWithoutCard extends Component{
	constructor(props){
		super(props);
		this.state = {
			isLoading: !this.props.params,
			data: null,
			header: null,
			params_entered: !this.props.params,
			params_list: []
		};
		this.getInfo = this.getInfo.bind(this);
		this.canLoad = this.canLoad.bind(this);
		this.handleRowClick = this.handleRowClick.bind(this);
		this.handleGetNewInfo = this.handleGetNewInfo.bind(this);
		this.handleChangeParams = this.handleChangeParams.bind(this);
		this.handleSaveParams = this.handleSaveParams.bind(this);
		this.formParamFields = this.formParamFields.bind(this);
		this.request_pending = false;
		this.getInfo(this.props.tableName);
	}

	canLoad(){
		if (!this.props.params)
			return true;
		if (this.request_pending)
			return false;
		return this.state.params_entered;
	}

	componentWillMount() {
		this.getInfo(this.props.tableName);
	}

	componentWillReceiveProps(nextProps, nextContext) {
		if (this.props.tableName !== nextProps.tableName){
			this.setState({
				isLoading: !nextProps.params,
				data: null,
				header: null,
				params_entered: !nextProps.params,
				params_list: []
			}, ()=>{
				this.getInfo(nextProps.tableName);
			})
		}
		else{
			this.getInfo(nextProps.tableName)
		}

	}

	handleGetNewInfo(){
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

	handleSaveParams(){
		this.setState({
			params_entered: true,
			isLoading: true
		}, ()=>{
			this.getInfo(this.props.tableName)
		})
	}

	getInfo(tableName){
		if (!this.canLoad())
			return;
		this.request_pending = true;
		let url = `http://127.0.0.1:5000/table?table_name=${tableName}`;
		for (let i=0; i < this.state.params_list.length; i++)
			url += `&${i}=${this.state.params_list[i]}`;
		$.ajax({
			url: url,
			method: 'GET',
			crossDomain: true,
		}).then(function (response) {
			if (response.ok){
				let data = JSON.parse(response.data);
				let header = data[0];
				data.splice(0, 1);
				this.setState({
					isLoading: false,
					data: data,
					header: header
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

	render(){
		if (this.state.isLoading)
			return (<LoadingPage/>);
		let fields;
		let buttons = [];
		if (this.props.updateButton){
			buttons.push(<button key={0} className={"w3-button w3-theme-d3 w3-margin-bottom w3-margin-right"}
			                     onClick={this.handleGetNewInfo}>Обновить</button>)
		}
		if (this.props.params){
			fields = this.formParamFields();
			buttons.push(<button key={1} className={"w3-button w3-theme-d3 w3-margin-bottom w3-margin-right"}
			                     onClick={this.handleSaveParams}>Отправить</button>);
		}
		let button_group = (
			<div>
				{buttons.map((button)=>(
					button
				))}
			</div>
		);
		let controls = (
			<span>{fields}{button_group}</span>
		);
		return(
			<div>
				{controls}
				{this.state.data &&
				<Table data={this.state.data} header={this.state.header}
				       onRowClick={this.handleRowClick}/>
				}
			</div>
		)
	}

	formParamFields() {
		return (
			<div>
				{
					this.props.params.map((param, index) => (
						<span className={"w3-margin-bottom"} key={index}>
								<label className={"w3-margin-right"}
								       style={{float: "left", marginTop: "8px"}}>{param}</label>
								<input className={"w3-input w3-margin-right"} style={{float: "left", width: "30%"}}
								       name={index} onChange={this.handleChangeParams}/>
							</span>))
				}
			</div>
		);
	}
}
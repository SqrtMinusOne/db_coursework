import React, {Component} from 'react';
import $ from 'jquery';
import '../App.css'
import {LoadingPage} from "../page/loading";
import {Table} from "./table";
import {MessageModal} from "../modals/messageModal";

export class ReadOnlyTableWithoutCard extends Component{
	constructor(props){
		super(props);
		this.state = {
			isLoading: !this.props.params,
			data: null,
			header: null,
			params_entered: !this.props.params,
			params_list: [],
			message: null
		};
		this.getInfo = this.getInfo.bind(this);
		this.canLoad = this.canLoad.bind(this);
		this.handleRowClick = this.handleRowClick.bind(this);
		this.handleGetNewInfo = this.handleGetNewInfo.bind(this);
		this.handleChangeParams = this.handleChangeParams.bind(this);
		this.handleSaveParams = this.handleSaveParams.bind(this);
		this.handleCloseMessage = this.handleCloseMessage.bind(this);
		this.request_pending = false;
		//this.getInfo(this.props.tableName);
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
		console.log(value, name);
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
				this.setState({
					message: `Ошибка получения данных: ${response.message}`
				});
				if (this.props.params)
					this.setState({
						isLoading: !this.props.params,
						data: null,
						header: null,
						params_entered: !this.props.params,
						params_list: []
					})
			}
			this.request_pending = false;
		}.bind(this))
	}

	handleCloseMessage() {
		this.setState({
			message: null
		})
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
			fields = <ParamFields params={this.props.params} onChange={this.handleChangeParams}
			                      param_list={this.state.params_list} />;
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
				<MessageModal header={"Cообщение"} content={this.state.message} onClose={this.handleCloseMessage}/>
				{this.state.data &&
				<Table data={this.state.data} header={this.state.header}
				       onRowClick={this.handleRowClick}/>
				}
			</div>
		)
	}
}

export class ParamFields extends Component{
	constructor(props) {
		super(props);

		let text_fields = 0;
		for (let param of this.props.params){
			if (param[1] === '%text%'){
				text_fields++
			}
		}

		this.state = {
			params: this.props.params,
			param_values: {},
			params_downloaded: text_fields,
			message: null
		};
		this.getInfo = this.getInfo.bind(this);
		this.makeFakeEvent = this.makeFakeEvent.bind(this);
		this.getAllInfo = this.getAllInfo.bind(this);
		this.forceFake = false;
	}

	getAllInfo(params) {
		for (let param of params) {
			this.getInfo(param[1])
		}
	}

	componentWillMount() {
		this.getAllInfo(this.props.params)
	}

	componentWillReceiveProps(nextProps, nextContext) {
		if (JSON.stringify(nextProps.params) !== JSON.stringify(this.props.params)){
			this.forceFake = true;
		}
		this.getAllInfo(nextProps.params)

	}

	getInfo(type_name){
		$.ajax({
			url: `http://127.0.0.1:5000/types?type=${type_name}`,
			method: 'GET',
			crossDomain: true,
		}).then(function (response) {
			if (response.ok){
				let data = response;
				this.setState((oldState)=>{
					oldState.param_values[type_name] = [];
					for (let type_group of data.types){
						oldState.param_values[type_name].push.apply(oldState.param_values[type_name], type_group.values)
					}
					oldState.params_downloaded++;
					return oldState;
				},()=>{
					if (this.state.params_downloaded >= this.state.params.length){
						this.makeFakeEvent();
					}
				})
			}
			else{
				this.setState({
					message: `Ошибка получения данных: ${response.message}`
				});
			}
		}.bind(this))
	}

	makeFakeEvent(){
		for (let i = 0; i < this.state.params.length; i++) {
			const param = this.state.params[i];
			if (!this.props.param_list[i] || this.forceFake){
				let fake_event = {};
				fake_event.target = {
					value: this.state.param_values[param[1]][0][0],
					name: i
				};
				this.props.onChange(fake_event)
			}
		}
		this.forceFake = false;
	}

	render(){
		if (this.state.params_downloaded < this.state.params.length){
			return (<b>Loading...</b>)
		}
		let self = this;
		return (
			<div>
				{
					this.props.params.map((param, index) => {
						if (param[1] === '%text')
							return (
								<span className={"w3-margin-bottom"} key={index}>
									<label className={"w3-margin-right"}
									       style={{float: "left", marginTop: "8px"}}>{param[0]}</label>
									<input className={"w3-input w3-margin-right"} style={{float: "left", width: "30%"}}
									       name={index} onChange={self.props.onChange}/>
								</span>);
						else {
							let defaultValue;
							if (self.props.param_list[index]){
								defaultValue = self.props.param_list[index]
							}
							else {
								defaultValue = self.state.param_values[self.state.params[index][1]][0][0];
							}
							if (!self.state.param_values[param[1]]) {
								return (<b>Please reload page</b>);
							}
							return (
								<span className={"w3-margin-bottom"} key={index}>
									<label className={"w3-margin-right"}
									       style={{float: "left", marginTop: "8px"}}>{param[0]}</label>
									<select className={"w3-input w3-margin-right"} style={{float: "left", width: "30%"}}
									        name={index} onChange={self.props.onChange}
									        defaultValue={defaultValue}>
										{
											self.state.param_values[param[1]].map((value) => (
												<option value={value[0]} key={value[0]}>{value[1]}</option>
											))
										}
									</select>
								</span>
							)
						}
					})
				}
			</div>
		)
	}

}
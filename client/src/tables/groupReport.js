import React, { Component } from 'react';
import '../App.css'
import $ from "jquery";
import {LoadingPage} from "../page/loading";
import {Card} from "../page/cards";
import {ReadOnlyTableWithoutCard} from "./readOnlyTableWithoutCard";


export class GroupReport extends Component{
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
		this.request_pending = false
	}

	componentWillMount() {
		this.updateInfo();
	}

	componentWillReceiveProps(nextProps, nextContext) {
		this.updateInfo();
	}

	updateInfo(){
		this.getInfo();
	}

	getInfo(){
		if (this.request_pending)
			return;
		this.request_pending = true;
		let url = `http://127.0.0.1:5000/table?table_name=routes`;
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

	render(){
		if (this.state.isLoading)
			return (<LoadingPage/>);
		return(
			<div>
				<Card header="Общий отчёт" footer="Корытов Павел, 6304">
					{(!this.props.params || (this.state.params && this.props.params)) &&
					<RouteGroupTable data={this.state.data} header={this.state.header}/>
					}
				</Card>
			</div>
		)
	}
}

class RouteGroupTable extends Component{
	constructor(props) {
		super(props);
		this.getRowClass = this.getRowClass.bind(this);
	}
	getRowClass(index){
		let color = '';
		if (this.props.marked && this.props.marked.indexOf(index)>=0){
			color =  'w3-red';
		}
		else
			color = index % 2 === 0 ? 'w3-theme-l3' : 'w3-theme';
		if (this.props.onRowClick || this.props.onRowContextMenu)
			color += ' w3-hover-deep-orange';
		return color;
	}
	render(){
		return(
			<table className={"w3-table w3-border w3-bordered w3-striped"}>
				<thead>
				<tr className={"w3-theme-d5"}>
					{
						this.props.header.map((col_name)=>(
							<th key={col_name}>{col_name}</th>
						))
					}
				</tr>
				</thead>
				{
					this.props.data.map((row, index)=>{
						let rowClass = this.getRowClass(index);
						return (
							<tbody key={index}>
								<tr className={rowClass}>
									{
										row.map((column, col_index)=>(
											<td key={(index+1)*col_index}>{column}</td>
										))
									}
								</tr>
								<tr className={rowClass}>
									<td colSpan={row.length}>
										<b>Водители на маршруте</b>
										<ReadOnlyTableWithoutCard tableName={`get_drivers_on_route&0=${row[0]}`}/>
									</td>
								</tr>
								<tr className={rowClass}>
									<td colSpan={row.length}>
										<b>Автобусы на маршруте</b>
										<ReadOnlyTableWithoutCard tableName={`get_buses_on_route&0=${row[0]}`}/>
									</td>
								</tr>
							</tbody>
						)
					})
				}
			</table>
		)
	}
}
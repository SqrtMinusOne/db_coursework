import React, { Component } from 'react';
import '../App.css'
import $ from "jquery";
import {LoadingPage} from "../page/loading";
import {Card} from "../page/cards";
import {ReadOnlyTableWithoutCard} from "./readOnlyTableWithoutCard";
import {MessageModal} from "../modals/messageModal";
import {Collapsible} from "../page/collapsible";


export class GroupReport extends Component{
	constructor(props){
		super(props);
		this.state = {
			isLoading: true,
			data: null,
			header: null,
			message: null
		};
		this.getInfo = this.getInfo.bind(this);
		this.updateInfo = this.updateInfo.bind(this);
		this.handleCloseMessage = this.handleCloseMessage.bind(this);
		this.getRowClass = this.getRowClass.bind(this);
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
		let url = `http://127.0.0.1:5000/table?table_name=bus_types`;
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
				this.setState({
					message: `Ошибка получения данных: ${response.message}`
				});
			}
			this.request_pending = false;
		}.bind(this))
	}

	handleCloseMessage() {
		this.setState({
			message: null
		})
	}

	getRowClass(index){
		let color = '';
		if (this.props.marked && this.props.marked.indexOf(index)>=0){
			color =  'w3-red';
		}
		else
			color = index % 2 === 0 ? 'w3-theme-l1' : 'w3-theme-d2';
		if (this.props.onRowClick || this.props.onRowContextMenu)
			color += ' w3-hover-deep-orange';
		return color;
	}

	render(){
		if (this.state.isLoading)
			return (<LoadingPage/>);
		return(
			<div>
				<MessageModal header={"Cообщение"} content={this.state.message} onClose={this.handleCloseMessage}/>
				<Card header="Общий отчёт" footer="Корытов Павел, 6304">
					<table className={"w3-table w3-border w3-bordered w3-striped"}>
						<thead>

						</thead>
						{
							this.state.data.map((row, index)=>{
								let rowClass = this.getRowClass(index);
								return (
									<tbody key={index}>
									<TableHeader header={this.state.header}/>
									<tr className={rowClass}>
										{
											row.map((column, col_index)=>(
												<td key={(index+1)*col_index}>{column}</td>
											))
										}
									</tr>
									<tr className={rowClass}>
										<td colSpan={row.length} className={"w3-container"}>
											<RouteGroupReportByBus busType={row[0]}/>
										</td>
									</tr>
									</tbody>
								)
							})
						}
					</table>
				</Card>
			</div>
		)
	}
}


function RouteGroupReportByBus(props){
	return (<RouteGroupReport drivers={"get_drivers_on_route_with_bus_type"}
			buses={'get_buses_on_route_with_type'} end={`&1=${props.busType}`}
			routes={`http://127.0.0.1:5000/table?table_name=get_routes_on_type&0=${props.busType}`}/>)
}


class RouteGroupReport extends Component{
	constructor(props) {
		super(props);
		this.getRowClass = this.getRowClass.bind(this);
		this.getInfo = this.getInfo.bind(this);
		this.state = {
			isLoading: true,
			data: null,
			header: null,
		}
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
		let url = this.props.routes;
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
				this.setState({
					message: `Ошибка получения данных: ${response.message}`
				});
			}
			this.request_pending = false;
		}.bind(this))
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
		if (this.state.isLoading)
			return (<LoadingPage/>);

		return(
			<table className={"w3-table w3-border w3-bordered w3-striped"}>
				<thead>
				<TableHeader header={this.state.header}/>
				</thead>
				{
					this.state.data.map((row, index)=>{
						let rowClass = this.getRowClass(index);
						let end_str = this.props.end ? this.props.end : "";
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
									<div className={"w3-bar "}>
										<Collapsible header={"Водители на маршруте"} className={"w3-bar-item"}>
											<ReadOnlyTableWithoutCard tableName={`${this.props.drivers}&0=${row[0]}${end_str}`}/>
										</Collapsible>
										<Collapsible header={"Автобусы на маршруте"} className={"w3-bar-item"}>
											<ReadOnlyTableWithoutCard tableName={`${this.props.buses}&0=${row[0]}${end_str}`}/>
										</Collapsible>
									</div>
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

function TableHeader(props){
	return (
		<tr className={"w3-theme-d5"}>
			{
				props.header.map((col_name)=>(
					<th key={col_name}>{col_name}</th>
				))
			}
		</tr>
	)
}
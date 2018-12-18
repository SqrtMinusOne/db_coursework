import React, { Component } from 'react';
import '../App.css'
import $ from "jquery";

export class Table extends Component{
	constructor(props){
		super(props);
		this.getRowClass = this.getRowClass.bind(this);
	}
	onRowClick(row, index){
		this.props.onRowClick && this.props.onRowClick(row, index);
	}
	onRowContextMenu(row, index, event){
		console.log(row, index);
		event.preventDefault();
		this.props.onRowContextMenu && this.props.onRowContextMenu(row, index)
	}
	getRowClass(index){
		if (this.props.marked.indexOf(index)>=0){
			return 'w3-red w3-hover-deep-orange';
		}
		return index % 2 === 0 ? 'w3-theme-l3 w3-hover-deep-orange' : 'w3-theme w3-hover-deep-orange';
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
				<tbody>
					{
						this.props.data.map((row, index)=>{
							let rowClass = this.getRowClass(index);
							return (
								<tr className={rowClass} key={index} onClick={this.onRowClick.bind(this, row, index)}
									onContextMenu={this.onRowContextMenu.bind(this, row, index)}>
									{
										row.map((column, col_index)=>(
											<td key={(index+1)*col_index}>{column}</td>
										))
									}
								</tr>
							)
						})
					}
				</tbody>
			</table>
		)
	}
}

export function getInfo(table_name){
	$.ajax({
		url: `http://127.0.0.1:5000/table?table_name=${table_name}`,
		method: 'GET',
		crossDomain: true,
	}).then(function (response) {
		console.log(response);
		if (response.ok){
			let data = response.data;
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
	}.bind(this))
}
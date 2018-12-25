import React, { Component } from 'react';
import $ from 'jquery';
import '../App.css'
import {Card} from "../page/cards";
import {LoadingPage} from "../page/loading";
import {Table} from "./table";
import {EditModal} from "../modals/editModal";
import {MessageModal} from "../modals/messageModal";

export class EditableTable extends Component{
	constructor(props){
		super(props);
		this.state = {
			isLoading: true,
			data: null,
			header: null,
			editing: null,
			opt_fields: null,
			wasEdited: false,
			marked_rows: [],
			message: null,
		};
		this.getInfo = this.getInfo.bind(this);
		this.handleRowClick = this.handleRowClick.bind(this);
		this.handleRowContextMenu = this.handleRowContextMenu.bind(this);
		this.handleFinishEdit = this.handleFinishEdit.bind(this);
		this.handleUpdate = this.handleUpdate.bind(this);
		this.handleCancel = this.handleCancel.bind(this);
		this.handleAddModal = this.handleAddModal.bind(this);
		//this.getInfo(this.props.tableName);
		this.handleGetNewInfo = this.handleGetNewInfo.bind(this);
		this.handleCloseMessage = this.handleCloseMessage.bind(this);
	}

	componentWillMount() {
		this.getInfo(this.props.tableName);
	}

	componentWillReceiveProps(nextProps, nextContext) {
		this.getInfo(nextProps.tableName);
	}

	handleGetNewInfo(){
		this.getInfo(this.props.tableName);
	}

	getInfo(tableName){
		$.ajax({
			url: `http://127.0.0.1:5000/table?table_name=${tableName}`,
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
					header: header,
					opt_fields: response.types
				});
			}
			else{
				this.setState({
					message: `Ошибка получения данных: ${response.message}`
				});
			}
		}.bind(this))
	}

	handleRowClick(row, index){
		this.setState({
			editing: index
		})
	}

	handleRowContextMenu(row, index){
		this.setState((oldState)=>{
			let index_in_marked = oldState.marked_rows.indexOf(index);
			if (index_in_marked >= 0){
				oldState.marked_rows.splice(index_in_marked, 1)
			}
			else{
				oldState.marked_rows.push(index);
			}
			oldState.wasEdited = oldState.marked_rows.length > 0;
			return oldState;
		})
	}

	handleFinishEdit(new_row){
		if (new_row){
			this.setState((oldState)=>{
				let state = oldState;
				let new_data_row = [];
				for (let field of new_row){
					if (field.type === 'number')
						field.value = parseInt(field.value);
					if (field.type === 'time' && field.value.length < 8)
						field.value = field.value + ":00";
					new_data_row.push(field.value);
				}
				state.data[state.editing] = new_data_row;
				state.wasEdited = true;
				return state;
			});
		}
		this.setState({
			editing: null,
		})
	}

	handleUpdate(){
		let new_data = [];
		for (let i = 0; i < this.state.data.length; i++) {
			if (this.state.marked_rows.indexOf(i) < 0)
				new_data.push(this.state.data[i]);
			else
				new_data.push('%DELETE THIS%')

		}
		$.ajax({
			url: `http://127.0.0.1:5000/table_alter`,
			method: 'POST',
			contentType: 'application/json',
			processData: false,
			crossDomain: true,
			dataType: 'json',
			data: JSON.stringify({
				header: this.state.header,
				data: new_data,
				table: this.props.tableName
			})
		}).then(function (response) {
			if (response.ok){
				this.getInfo(this.props.tableName);
				this.setState({
					wasEdited: false,
					marked_rows: [],
					message: response.message
				}, ()=>{
					if (this.props.onUpdate){
						this.props.onUpdate();
					}
				})
			}
			else{
				this.setState({
					message: response.message
				})
			}
		}.bind(this))
	}

	handleCancel(){
		this.getInfo(this.props.tableName);
		this.setState({
			wasEdited: false,
			marked_rows: [],
		})
	}

	handleAddModal() {
		this.setState({
			editing: this.state.data.length
		})
	}

	handleCloseMessage() {
		this.setState({
			message: null
		})
	}

	render(){
		if (this.state.isLoading)
			return (<LoadingPage/>);
		let modal = null;
		if (this.state.editing !== null){
			modal = (<EditModal heads={this.state.header} data={this.state.data[this.state.editing]}
			                    opt_fields={this.state.opt_fields} onClose={this.handleFinishEdit} onChange={this.handleFinishEdit}/>)
		}
		let buttons = [(<button className={"w3-button w3-theme-d5 w3-margin-bottom w3-margin-right"}
								onClick={this.handleAddModal} key={'a'}>Добавить</button>)];
		if (this.props.updateButton){
			buttons.push(<button className={"w3-button w3-theme-d3 w3-margin-bottom w3-margin-right"}
			onClick={this.handleGetNewInfo}>Обновить</button>)
		}
		if (this.state.wasEdited){
			buttons.push(<button className={"w3-button w3-orange w3-margin-bottom w3-margin-right"}
			                     onClick={this.handleUpdate} key={'b'}>Сохранить</button>);
			buttons.push(<button className={"w3-button w3-gray w3-margin-bottom"}
			                     onClick={this.handleCancel} key={'c'}>Отменить</button>)
		}
		return(
			<div>
				<MessageModal header={"Сообщение"} content={this.state.message} onClose={this.handleCloseMessage}/>
				{modal}
				<Card header={this.props.header} footer="Корытов Павел, 6304">
					{buttons.map((button)=>(
						button
					))}
					<Table data={this.state.data} header={this.state.header} marked={this.state.marked_rows}
					       onRowClick={this.handleRowClick} onRowContextMenu={this.handleRowContextMenu}/>
				</Card>
			</div>
		)
	}
}
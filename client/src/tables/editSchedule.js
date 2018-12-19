import React, { Component } from 'react';
import {Card, HalfWidth} from "../page/cards";
import {ReadOnlyTable} from "./readOnlyTable";
import $ from 'jquery'
import {EditableTable} from "./editableTable";

export class EditSchedule extends Component{
	constructor(props){
		super(props);
		this.handleCreateSchedule = this.handleCreateSchedule.bind(this);
	}

	handleCreateSchedule() {
		$.ajax({
			url: `http://127.0.0.1:5000/table?table_name=create_day_schedule`,
			method: 'GET',
			crossDomain: true,
		}).then(function (response) {
			this.forceUpdate();
		}.bind(this))

	}

	render() {
		const button_class = 'w3-button w3-bar-item w3-theme-d2 w3-margin-right w3-margin-bottom';
		return(
			<div>
				<HalfWidth>
					<EditableTable tableName="day_schedule" header="Расписание на день" updateButton={true}/>
				</HalfWidth>
				<HalfWidth>
					<ReadOnlyTable tableName="routes_not_fully_covered_today" header="Непокрытые маршруты"
						updateButton={true}/>
					<Card header="Управление">
						<div className='w3-bar w3-margin-top'>
							<button className={button_class} onClick={this.handleCreateSchedule}>Составить расписание</button>
						</div>
					</Card>
				</HalfWidth>
			</div>
		)
	}
}
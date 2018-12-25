import React, {Component} from 'react'
import {HalfWidth} from "../page/cards";
import {EditableTable} from "./editableTable";
import {ReadOnlyTable} from "./readOnlyTable";

export class EditPreferred extends Component{
	constructor(props) {
		super(props);
		this.handleUpdate = this.handleUpdate.bind(this);
	}

	handleUpdate(){
		this.forceUpdate();
	}

	render(){
		return(
			<div>
				<HalfWidth>
					<EditableTable tableName="preferred" header="Предпочитают водить" onUpdate={this.handleUpdate}/>
				</HalfWidth>
				<HalfWidth>
					<ReadOnlyTable tableName="preferred_statistics" header="Статистика"/>
					<ReadOnlyTable tableName="routes_assigned" header="Водителей на маршрутах"/>
				</HalfWidth>
			</div>
		)
	}
}
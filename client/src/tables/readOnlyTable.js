import React, { Component } from 'react'
import {Card} from "../page/cards";
import {ReadOnlyTableWithoutCard} from "./readOnlyTableWithoutCard";

export class ReadOnlyTable extends Component{
	render() {
		return(
			<Card header={this.props.header}>
				<ReadOnlyTableWithoutCard tableName={this.props.tableName} header={this.props.header}
				                          params={this.props.params} updateButton={this.props.updateButton}/>
			</Card>
		)
	}
}
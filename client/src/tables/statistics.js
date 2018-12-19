import React, { Component } from 'react';
import '../App.css'
import {ReadOnlyTable} from "./readOnlyTable";


export function Statistics(props){
	return(
		<div>
			<ReadOnlyTable tableName={"avg_drivers"} header={"Статистика по водителям"}/>
			<ReadOnlyTable tableName={"max_experience"} header={"Водитель с максимальным опытом"}/>
			<ReadOnlyTable tableName={"total_distance"} header={"Общая дистанция"}/>
		</div>
	)
}
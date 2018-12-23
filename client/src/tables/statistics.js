import React from 'react';
import '../App.css'
import {ReadOnlyTable} from "./readOnlyTable";


export function Statistics(props){
	return(
		<div>
			<ReadOnlyTable tableName={"statistics"} header={"Общая статистика"}/>
			<ReadOnlyTable tableName={"max_experience"} header={"Водитель с максимальным опытом"}/>
			<ReadOnlyTable tableName={"buses_by_type"} header={"Виды автобусов"}/>
			<ReadOnlyTable tableName={"drivers_by_class"} header={"Классы водителей"}/>
		</div>
	)
}
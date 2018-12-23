import React, { Component } from 'react';
import {$} from 'jquery';
import {Header} from "./page/header";
import './App.css';
import {Sidebar} from "./page/sidebar";
import {EditableTable} from "./tables/editableTable";
import {ReadOnlyTable} from "./tables/readOnlyTable";
import {EditSchedule} from "./tables/editSchedule";
import {Statistics} from "./tables/statistics";
import {GroupReport} from "./tables/groupReport";
import {EditPreferred} from "./tables/editPreferred";

class App extends Component {
	constructor(props){
		super(props);
		this.state = {
			sidebarToggled: false,
			currentPage: 'buses'
		};
		this.buttons = {
			"Автобусы": {
				buses: 'Список автобусов',
				bus_types: 'Типы автобусов',
				buses_by_type: 'Статистика по типам',
				buses_on_route: 'Автобусы на маршруте',
			},
			"Водители": {
				drivers: 'Список водителей',
				drivers_by_class: 'Статистика по классам',
				drivers_on_route: 'Водители на маршруте',
			},
			"Машруты": {
				routes: 'Список маршрутов',
				routes_not_fully_covered_today: 'Непокрытые маршруты',
				routes_in_point: 'Машруты через точку',
			},
			"Выплаты": {
				class_coef: 'Коэффициенты классов',
				experience_coef: 'Коэффициенты стажа',
				calculate_salaries: 'Зарплаты',
			},
			"Автопарк": {
				buses_info: "Автобусы с водителями",
				preferred: 'Предпочитают водить',
				schedule: 'Составление расписания',
			},
			"":{
				statistics: 'Общая статистика',
				group: 'Общий отчёт',
			}

		}

		this.toggleSidebar = this.toggleSidebar.bind(this);
		this.handleButton = this.handleButton.bind(this);
	}

	componentWillMount() {
		document.body.className = 'w3-theme-d5'
	}

	toggleSidebar(){
		this.setState((state)=>({
			sidebarToggled: !state.sidebarToggled
		}))
	}

	handleButton(new_page){
		this.setState({currentPage: new_page, sidebarToggled: false})
	}

	render() {
		function getPage(page) {
			switch (page){
				case 'buses': return (<EditableTable tableName="buses" header="Автобусы"/>);
				case 'drivers': return(<EditableTable tableName="drivers" header="Водители"/>);
				case 'routes': return(<EditableTable tableName="routes" header="Маршруты"/>);
				case 'class_coef': return(<EditableTable tableName="class_coef" header="Коэффициент класса"/>);
				case 'experience_coef': return(<EditableTable tableName="experience_coef" header="Коэффициенты стажа"/>);
				case 'bus_types': return (<EditableTable tableName="bus_types" header="Типы автобусов"/>);
				case 'preferred': return (<EditPreferred/>);
				case 'buses_by_type': return(<ReadOnlyTable tableName="buses_by_type" header="Статистика по типам"/>);
				case 'drivers_by_class': return(<ReadOnlyTable tableName="drivers_by_class" header="Статистика по классам"/>);
				case 'routes_not_fully_covered_today': return(<ReadOnlyTable tableName="routes_not_fully_covered_today"
				                                                             header="Непокрытые маршруты"/>);
				case 'calculate_salaries': return (<ReadOnlyTable tableName="calculate_salaries" header="Зарплаты"/>);
				case 'buses_on_route': return (<ReadOnlyTable tableName="get_buses_on_route" header="Автобусы на маршруте"
				                                              params={['Номер маршрута']}/>);
				case 'drivers_on_route': return (<ReadOnlyTable tableName="get_drivers_on_route" header="Водители на маршруте"
				                                                params={['Номер маршрута']}/>);
				case 'routes_in_point': return (<ReadOnlyTable tableName="get_routes_in_point" header="Маршруты через точку"
				                                               params={['Название остановки']}/>);
				case 'buses_info': return (<ReadOnlyTable tableName="buses_info" header="Автобусы с водителями" />);
				case 'schedule': return (<EditSchedule/>);
				case 'statistics': return (<Statistics/>);
				case 'group': return (<GroupReport/>);
				default: return (
					<b>Ошибка</b>
				)

			}
		}

		let mainContentStyle = this.state.sidebarToggled ? { marginLeft: "25%" } : { marginLeft : "0%" };
		let mainContentClassName = this.state.sidebarToggled ? "w3-animate-left" : "";

		return (
			<div>
				<Sidebar isShown={this.state.sidebarToggled} toggle={this.toggleSidebar} buttons={this.buttons}
				         buttonClick={this.handleButton}/>
				<div style={mainContentStyle} className={mainContentClassName}>
					<Header isSidebarShown={!this.state.sidebarToggled} toggleSidebar={this.toggleSidebar}/>
					<div className={"main_content w3-container"}>
						{getPage.bind(this, this.state.currentPage)()}
					</div>
				</div>
			</div>
		);
	}
}

export default App;

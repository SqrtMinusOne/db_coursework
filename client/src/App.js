import React, { Component } from 'react';
import {$} from 'jquery';
import {Header} from "./page/header";
import './App.css';
import {Sidebar} from "./page/sidebar";
import {EditableTable} from "./tables/editableTable";

class App extends Component {
    constructor(props){
        super(props);
        this.state = {
            sidebarToggled: false,
            currentPage: 'buses'
        };

	    this.buttons = {
		    buses: 'Список автобусов',
		    drivers: 'Список водителей',
		    routes: 'Список маршрутов'
	    };

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
		this.setState({currentPage: new_page})
	}

	render() {
		function getMainContent() {
			switch (this.state.currentPage){
				case 'buses': return (
					<EditableTable tableName="buses" header="Автобусы"/>
				);
				case 'drivers': return(
					<EditableTable tableName="drivers" header="Водители"/>
				);
				case 'routes': return(
					<EditableTable tableName="routes" header="Маршруты"/>
				);
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
                        {getMainContent.bind(this)()}
                    </div>
                </div>
            </div>
        );
    }
}

export default App;

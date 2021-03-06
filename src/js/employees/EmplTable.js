import React, {Component} from "react"
import "../../css/App.css"

import {ModalWindowUpdateEmpl} from "../components/Modal"

class EmplTable extends Component{
    constructor(){
        super();
        this.state={
            updateItemIndex: 0
        };
        this.deleteById = this.deleteById.bind(this);
        this.onUpdateClick = this.onUpdateClick.bind(this);
        this.updateElement = this.updateElement.bind(this);
    }
    deleteById(id){
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        const options = {
            method: "DELETE",
            headers,
        };
        const request = new Request("/back/employees/"+id, options);
        fetch(request).then(resp => {
            if (resp.status === 200){
                this.props.action();
            }
        });

    }
    onUpdateClick(index){
        this.setState({
            updateItemIndex: index
        });
        this.props.action();
    }
    updateElement(item){
        event.preventDefault();
        console.log(item);
        const headers = new Headers();
        let new_item = {
            id: this.props.data[this.state.updateItemIndex].id,
            name: item.name,
            orgId: item.orgId,
            bossId: item.bossId
        };
        headers.append("Content-Type", "application/json");
        const options ={
            method: "PUT",
            headers: headers,
            credential: "include",
            body: JSON.stringify(new_item)
        };
        const request = new Request("/back/employees/"+new_item.id, options);
        fetch(request).then(resp =>{
            if(resp.status === 200){
                this.props.action();
            }
        });
    }
    render() {
        if (!this.props.isLoaded){
            return <div className="TestTable">Loading...</div>;
        }
        else {
            const tableBody = this.props.data.slice(this.props.offset,this.props.pageSize+this.props.offset)
                .map((item,index) =>{
                    return(
                        <tr key={index}>
                            <th scope={"row"}>{item.id}</th>
                            <td>{item.name}</td>
                            <td>{(item.orgId != null) ? item.orgName : "null"}</td>
                            <td>{(item.bossId != null) ? item.bossName: "null"}</td>
                            <td>
                                <button type="button" className="btn btn-outline-primary mr-1"
                                        data-toggle="modal" data-target="#updateModal"
                                        onClick={this.onUpdateClick.bind(this,index+this.props.offset)}
                                >Update
                                </button>
                                <button type={"button"} className={"btn btn-outline-danger"}
                                        onClick={this.deleteById.bind(this, item.id)}>Delete</button>
                            </td>
                        </tr>
                    )});
            let item = this.props.data[this.state.updateItemIndex];
            return(
                <div>
                    <table className={"table mt-2"}>
                        <thead>
                        <tr>
                            <th scope={"col"}>id</th>
                            <th>name</th>
                            <th>Organization Name</th>
                            <th>Boss Name</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {tableBody}
                        </tbody>
                    </table>
                    <ModalWindowUpdateEmpl onUpdateAction = {this.updateElement}
                                           name={item.name} orgId={item.orgId} bossId={item.bossId}
                                           orgs={this.props.orgs} empls={this.props.data}/>
                </div>
            );
        }
    }
}

export default EmplTable;
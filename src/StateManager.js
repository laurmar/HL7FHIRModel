import React from 'react';
import {SelectModel, MapToOptions} from './FormHelper'
import Button from 'react-bootstrap/Button';

/**
 * State manager exists to implement the user interface for MainComponent state changes. 
 * First it allows the users to show or hide its contents with a "Show/Hide State Manager button"
 * 
 * When showing its contents two drop down menus are shown to either allow the user to choose an element to delete or choose an element that you want
 * to add related resources to. In both cases information about the chosen option is then sent back to the mainComponent to be handled.
 */
class StateManager extends React.Component{
    /**
   * This created the show/hide functionality and binds functions for use
   * @param {*} props Information from MainComponent
   */
    constructor(props){
        super(props)
        this.state = {isHiding: true};
      
        this.showOrHide = this.showOrHide.bind(this);
        this.callDelete= this.callDelete.bind(this)
        this.callAdd= this.callAdd.bind(this)
        this.mainComponentDelete= this.props.passDelete.bind(this);
        this.mainComponentAddChildren= this.props.passAddChildren.bind(this);
    }

    //-------------------------------------------------------------------------------------------------------------------------------------------
    //DELETING
    //-------------------------------------------------------------------------------------------------------------------------------------------

    /**
     * This takes the list of resources from main component and makes a drop down menu where the users can select a resource to be removed
     */
    deleteAResource(){
      let list= Object.keys(this.props.state)
      list.unshift("select an item")
      let options= <MapToOptions selectArray={list}/>
      return <SelectModel className="Main" label="Delete an item: " name="selectedDelete" value={this.state.selected} handleFunction={this.callDelete}  options={options}/>
  
      
    }

    /**
     * Once an element has been selected this outputs a confirmation window and then sends the name of the selected item back to the mainComponent to be deleted
     * @param {*} event selection occuring in deleteAResource
     */
    callDelete(event){
      let value=[event.target.value]
      if (value !== "select an item" && window.confirm('Are you sure you wish to delete '+ value+'?')){
          this.mainComponentDelete(event.target.value) 
      } 
    
    } 


    //-------------------------------------------------------------------------------------------------------------------------------------------
    //ADDING IN RELATED RESOURCES
    //-------------------------------------------------------------------------------------------------------------------------------------------

    /**
     * This makes a list of submitted resources from mainComponents state and converts them into a drop down menu where users can select elements
     */
    AddInConnections(){
      let list= Object.keys(this.props.state)
      list.unshift("select an item")
      let options= <MapToOptions selectArray={list}/>
      return <SelectModel className="Main" label="Add Related Resources to: " name="selectedAdd" value={this.state.selectedAdd} handleFunction={this.callAdd}  options={options}/>
  
      
    }

       /**
     * Once the user has selected an item to add this captures that value and sends it to the main components add related resources functions
     * @param {*} event The user selecting an item in AddInConnections
     */
    callAdd(event){
      let value=[event.target.value]
      if (value !== "select an item"){
        this.mainComponentAddChildren(event.target.value) 
      } 
    }

    //-------------------------------------------------------------------------------------------------------------------------------------------
    //DEVELOPING CONTENTS
    //-------------------------------------------------------------------------------------------------------------------------------------------

    /**
     * This switches the value of state's isHiding value to the opposite of its current value
     */
    showOrHide() {
        this.setState(state => ({
          isHiding: !state.isHiding
        }));
    }


    /**
 * Taking information from state's isHiding, this either shows the contents of deleteAResource and addInConnections or hides them
 */
    toggleContents(){
      let results;
      this.state.isHiding? results=<></> : results= <>{this.deleteAResource()} <br/> {this.AddInConnections()}</>;
      return results; 
    }

    //-------------------------------------------------------------------------------------------------------------------------------------------
    //RENDERING
    //-------------------------------------------------------------------------------------------------------------------------------------------

    /**
     * This makes a new show and hide button for the state managers and handles whether the contents are displayed
     */
    render(){
       return (
        <>
            <Button  variant="info" onClick={this.showOrHide}>
            {this.state.isHiding ? 'Show State Manager': 'Hide State Manager'}
            </Button>
            <br/>
            {this.toggleContents()}  

        </>
       );
    }

}

export {StateManager}
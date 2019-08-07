import React from 'react';
import {ResourceFormatter } from './ResourceFormatter'
import {ResourceListDescriptions} from './ResourceForms'


/**
 * Form Builder is designed to handle all the interactions that occur on a resource form. All the interactions are submitted into the state, and upon
 * submission the data from the interactions is pushed to mainComponent. 
 */
class FormBuilder extends React.Component {

  /**  This constructor takes in information from the instantiation of a Form and uses it to set the starting state of the application.
   * Within this.state:
   *    contents= the place where we log all the information that we wish to print and push to the parent
   *    id= identifier for the form 
   *    resourceType= the string title of the resource being made. This helps ensure that the correct resource form is being created
   *    identifier= additional identification to seperate resources of the same type
   * Additionally the constructor binds multuple functions to ensure that interactions with this component are managed effectively
  */
    constructor(props) {  
      super(props)
      this.state = { 
        "resourceType" :  props.resourceType,
     }
    this.handleFormChanges = this.handleFormChanges.bind(this)
    this.handleSubmitForm = this.handleSubmitForm.bind(this)
    this.sendDataToMain= this.props.sendDataToMain.bind(this); 
    this.makeNewButtonFunctionality= this.makeNewButtonFunctionality.bind(this)
    this.modifyListElements= this.modifyListElements.bind(this)
    this.setUpLists= this.setUpLists.bind(this)


     // Current Resource Object represents an object of information on identifying classnames and id's to help
     // navigate the creation of lists and the appending and deppending from those lists.
    this.currentResourceObject= ResourceListDescriptions[this.props.resourceType]
    this.listObjectArray=this.currentResourceObject["list"];
    this.objectItemArray=this.currentResourceObject["elements"];
    this.connectedResourcesObject=this.currentResourceObject["child"];
    }
  


    //-------------------------------------------------------------------------------------------------------------------------------------------
    //SET UP
    //-------------------------------------------------------------------------------------------------------------------------------------------
    /**
     * The goal of this function is set up the initial state of the lists and values in this.state
     */
    componentDidMount(){   
      this.setUpState();
      this.setUpLists();
    }


    /**
    * This function is designed to take in information about the lists desired for the given HL7 resource and set up the necessary spaces
    * for the data to be placed within
    */
    setUpLists(){  
      if(this.listObjectArray){
        for (var y of this.listObjectArray){
          this.fakeSetState(y, [{}] ) 
        }
      }  

      if(this.objectItemArray){
        for (var m of this.objectItemArray){
          this.fakeSetState(m, {} )
        } 
      }
      

      if(this.connectedResourcesObject){
        let idNameList= Object.keys(this.connectedResourcesObject)
        let newList = idNameList.filter(e => !e.includes(" "));
        for (var current of newList){
            this.fakeSetState(current, [] )
        } 
      }
    }


    /**This provides values to core aspects of the state upon initialization */
    setUpState(){  
      this.state.contents={}
      this.state.id= this.props.resourceType
      this.state.identifier=[{}]
    }

    /**
    * This function is designed to link with "Make a new.." to refresh the form and the contents of this.state
    */
    makeNewButtonFunctionality(){  
    this.setUpState()
    this.setUpLists()
    document.getElementById(this.props.resourceType+"form").reset();
    };
    


    //-------------------------------------------------------------------------------------------------------------------------------------------
    //HANDLE CHANGE
    //-------------------------------------------------------------------------------------------------------------------------------------------

    /*This function is designed to work with setCorrectState. Its job is to identify the state key being modified in the case that a list
    is being modified. There are 3 different list types:
    -2. An Object is being added to a list
    -3. An object is being made containing new key-value pairs
    
    Thus after the user interacts with the current item, either currentList, currentElement or none are modified. This 
    sets up setCorrectState as a maximum of one of the variables is truthy, allowing it to inact the correct action to take on the state. 
    */
    handleFormChanges(event) {  
    let currentList = null;
    let currentElement= null;
    let currentName= event.target.className
    let classname = null;

    let listResult= this.setValuesInFormChanges(this.listObjectArray, currentName)
    if(listResult){
      currentList =this.state[(listResult)];
      classname= listResult;
    }

    let elementResult= this.setValuesInFormChanges(this.objectItemArray, currentName)
    if(elementResult){
      currentElement =this.state[(elementResult)];
      classname= elementResult;
    }
    
    this.setCorrectState(currentList, currentElement, event, classname);

    }


    /**
     * This returns the name of a list that matches what has just been modified
     * @param {*} currentArray the list of listnames
     * @param {*} currentName the name of the list to identify 
     */
    setValuesInFormChanges(currentArray, currentName ){  
      if(currentArray){
        for (var item of currentArray){
          if(currentName.includes(item)){
            return item;
          }
        }
      }
      return null 
    }


    //---------------------------------------------------SETTING THE STATE THROUGH HANDLE CHANGE-----------------------------------------------------

    /* There are 4 different situations that state needs to prepare for:
    - 1. We are adding to a key list where each item is a key value pair where the keys are different
    - 2. We are adding in a new object containing varied key value pairs
    - 3. We are defining a new identifier
    - 4. we are adding a new key value pair
  
    This function ensures that the correct action is taken when adding to state.
    If we are dealing with 1 is a currentVariedList, 2 is currentElement, 3 is an identifier and
    4 is the default option. Each has their own helper functions to call to handle the setting of the state beyond default
    where the setState function is called directly.
  */
    setCorrectState(currentVariedList,  currentElement, event, realClassName){  
      let itemToSet= this.state[realClassName];

      if(currentVariedList){
        this.makeObject(event, itemToSet[itemToSet.length-1])
      }
      else if(currentElement){
        this.makeObject(event, itemToSet); 
      }
      else if(event.target.className.includes("identifier")){
        this.makeObject(event,  this.state.identifier[0])
        this.handleIndentifier(event)
      }
      else{
        this.setState({[event.target.name]:event.target.value});
      }
    }


    //------------------ MAKING OBJECTS ON THE STATE---------------------------------------

    /**
    * This function is called when we are adding to a single object
    * @param {*} event = the event that triggered this function to be called
    */
    makeObject(event, currentObject){ 
      if (currentObject){
        let name= event.target.name;
        let val= event.target.value;
        let wasAddedToEnd= this.addToEnd(name, val, currentObject);
        if(!wasAddedToEnd){
          currentObject[name]= val
        }
      }
    }



    /**
    * This function looks to add new  value  to the end of a known key within varied lists.
    * When it comes across the key that is already within the list it merely adds the value to the end of a list of values.
    * When it can't find the value, it returns undefined.
    * @param {*} currentObject = the name of the current list of different key objects we are looking to append to
    * @param {*} name = key we are looking to add
    * @param {*} val = the value we are looking to link to the key
    */
    addToEnd(name, val, currentObject){  
      let listOfAppends=["daysOfWeek"];
      let isItemAnAddToEnd= listOfAppends.includes(name);
      let previous = currentObject[name]
      if(isItemAnAddToEnd && previous !==undefined){
        currentObject[name]= previous+", "+val
        return true;
      }
      return false;
    }


    //-----------------------------WORKING WITH IDENTIFIERS ON THE STATE-----------------------
    /**
    * This sets the id to a new value containing the name of the resource and the identifier submitted by the user.
    * It then passes the information along to ensure that previously submitted identifiers are managed
    * @param {*} event 
    */
    handleIndentifier(event){  
    let newId= this.state.resourceType+"/"+ event.target.value
    this.state.id= newId
    this.handlePriorSubmitted(newId)

      
    }

    /**
    * This function is designed to pull the contents of a submitted state if its identifier is reentered into a form. This allows the users to
    * edit previous submitted forms. 
    * @param {*} newId new id that is being tested to see if it has been previously submitted
    */
    handlePriorSubmitted(newId){  
      let keys= Object.keys(this.props.mainState)
      if(keys.includes(newId)){
        let submittedData= this.props.mainState[newId]
        this.state= submittedData
        this.state.id= newId
        this.state.contents= {}
      }
    }




    //-------------------------------------------------------------------------------------------------------------------------------------------
    //HANDLE SUBMIT
    //-------------------------------------------------------------------------------------------------------------------------------------------

    // Upon submit current state is pushed to contents and then sent back to the main component in mainComponent
    handleSubmitForm(event) {  
      if (window.confirm('Are you sure you wish to submit this form?')){
        this.pushToContents();
        this.sendDataToMain(this.getContents(), this.state.id) 
      } 
      event.preventDefault();
   
    }

    /**
     * This function is designed to take everything within this.state, besides contents and id, and put it within contents so that it can be shared to the main component
     * We choose not to enter these values because they arent part of the HL7 data format, they are merely used to gather and label the data
     */
    pushToContents(){  
      let allKeys= Object.keys(this.state);

      for(let key of allKeys){
        if(key+""!== 'contents' && key+"" !== 'id'){
          let currentValue=this.state[key]
          this.state.contents[key]= currentValue;
        }
      }
    }



    //-------------------------------------------------------------------------------------------------------------------------------------------
    // MODIFYING LIST ELEMENTS
    //-------------------------------------------------------------------------------------------------------------------------------------------

    /**
    * This function is called when the user presses + or - below an element. It identifies if that button relates
    * back to an array in the state and then allows removeFromList and addToList to handle the request by the users
    * @param {*} event button being pressed
    */
    modifyListElements(event){  
      let buttonPressed= event.target.id
      for(let currentListName of this.listObjectArray){
        if(buttonPressed.includes(currentListName)){
          let listToBeModified= this.state[currentListName]
          let lastObjectInList= listToBeModified[listToBeModified.length-1]

          this.removeFromList(buttonPressed, lastObjectInList, listToBeModified, currentListName);
          this.addToList(listToBeModified, lastObjectInList, buttonPressed);

          
        }
      }
    }


    /**
    * If the contains an element and the - button was pressed then the last item is removed from the listToBeModified
    * @param {*} buttonIdentity this is the button that was pressed to cause the function to be called
    * @param {*} lastObjectInList this is the last item in the list
    * @param {*} listToBeModified this is the list that is to be appended to 
    * @param {*} currentList the name of the list being modified
    */
    removeFromList(buttonIdentity, lastObjectInList, listToBeModified, currentList){  
      if(buttonIdentity.includes("-") && listToBeModified.length >0){
        if (window.confirm('Would you like to delete '+ JSON.stringify(lastObjectInList)+" from " + currentList+"?")){
          listToBeModified.pop()
        } 
      }

    }


    /**
    *  In the list has no elements or the plus button was pressed following the submission of valid data to the listToBeModified then a new object is pushed
    * @param {*} listToBeModified this is the list that is to be appended to 
    * @param {*} lastObjectInList this is the last item in the list
    * @param {*} buttonIdentity this is the button that was pressed to cause the function to be called
    */
    addToList(listToBeModified, lastObjectInList, buttonIdentity){  
      if(listToBeModified.length ===0 || listToBeModified.length >0 && Object.keys(lastObjectInList).length > 0 && buttonIdentity.includes("+")){
        listToBeModified.push({})
      }

    }




   //-------------------------------------------------------------------------------------------------------------------------------------------
   // ADDITIONAL FUNCTIONS
   //-------------------------------------------------------------------------------------------------------------------------------------------

    /**React has problems with setting state directly. Thus to overcome issues with setting state, this function
    * combines all the undesired setting to minimize feedback
    */
    fakeSetState(stateKey, value){  
      this.state[stateKey]= value;
    }


    // This returns the contents of this.state's contents
    getContents(){  
      return this.state.contents;
    } 

    
  //-------------------------------------------------------------------------------------------------------------------------------------------
  // FORM RENDERING 
  //-------------------------------------------------------------------------------------------------------------------------------------------



    /* A new Form object is rendered based on the provided resourceType. 
    Information on functions, and the state are sent to ensure that ResourceForms components react properly to changes in the component. */
    render() {  
      let formType= this.state.resourceType;
      let answer= (<ResourceFormatter 
        form={formType} 
        makeNewButtonFunctionality={this.makeNewButtonFunctionality} 
        handleSubmit= {this.handleSubmitForm} 
        state={this.state} 
        handleChange={this.handleFormChanges} 
        modifyListElements={this.modifyListElements}
        mainState={this.props.mainState}/>);

      return  answer; 
      
    }
  }

 export  { FormBuilder};



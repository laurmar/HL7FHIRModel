import React from 'react';
import {FormBuilder} from './formBuilder'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import {StateManager} from './StateManager'
import {Instructions} from './InstructionsComp'
import { ResourceListDescriptions} from './ResourceForms'
/**
 * The main component is the component that contains the entire program including:  StateManagers, FormBuilders and InstructionComp
 * It also is the main storage location for the submitted data. Thus functionality for updating the submitted resources exist including:
 *    getting new data from form builder
 *    deleting from the state
 *    adding in related resources 
 * 
 * To show the users the submitted data, functions to transform the data into a viewable format also exist
 */
class MainComponent extends React.Component {

  /**
   * This creates a new MainComponent and binds functions to the current object, allowing them to be used with MainComponent's initialized object.
   * State in this case is used to carry all of the submitted information from all the forms. In the case that the information was to be passed in 
   * an HTTP call, this is the information that would be sent. 
   * @param {*} props there are no props sent from index.js, this is to ensure that state can be created
   */
  constructor(props) {
    super(props)
    this.state = {};
    
    this.setDataFromBuilder = this.setDataFromBuilder.bind(this)
    this.deleteFromManager= this.deleteFromManager.bind(this)
    this.addRelatedFromManager= this.addRelatedFromManager.bind(this)

    this.stateKeys= Object.keys(this.state);
  }

   //-------------------------------------------------------------------------------------------------------------------------------------------
   //GENERAL FUNCTIONS
   //-------------------------------------------------------------------------------------------------------------------------------------------
      /**
        * This adds in the submitted data into MainComponents state
        * @param {*} dataFromBuilder the submitted information from the form
        * @param {*} resource the key value the data is linked to. It consists of the resource type and the unique value given by the user
        */
      setDataFromBuilder(dataFromBuilder, resource) {
        let newData= this.cleanState(dataFromBuilder)
        this.setState({[resource]: newData});
      }

      /**
       * This returns the state's key values
       */
      getStateKeys(){
        return Object.keys(this.state);
      }

      /**
       * As Id and contents arent part of the HL7 Fyre JSON format, this function is put in place just to ensure that they are scrubbed from 
       * any new data being sent to the state
       * @param {*} dataToClean new data being sent to state
       */
      cleanState(dataToClean){
        if(dataToClean["id"]){
          delete dataToClean["id"]
        }
        if(dataToClean["contents"]){
          delete dataToClean["contents"]
        }
        return dataToClean
      }

      /**
      * This removes the first half from a keyValue when the keyValue consists of 2 words. 
      * The first word is the spot within the top level of the state data
      * @param {*} key Key value that needs to be updated
      */
      extractResourceKey(key){
        if(key.includes(" ")){
          let spot= key.indexOf(" ")
          key= key.substring(0, spot)
        }
        return key
      }


      /**
       * This function traverses listInStateResourceData and tries to find valueToBeReset within each item in the list and then replaces it with the newValue
       * @param {*} listInStateResourceData List to search through for valueToBeReset
       * @param {*} valueToBeReset The item that is to recieve a new value
       * @param {*} newValue The new value for valueToBeReset
       */
      setValueInResourceListByValue(listInStateResourceData, valueToBeReset, newValue){
        if(listInStateResourceData.length >0){ 
          for(let listItem of listInStateResourceData){
            for (let k in listItem) {
              if (listItem[k] === valueToBeReset) {
                  listItem[k]=newValue
              }
            }
          }
        }
      }

      /**
       * This searches through stateResource for instances of the resourceTypeToBeMatched and adds their keys to a list.
       * This allows a more specific search for resources for functions such as removeFromOtherResources
       * @param {*} resourceTypeToMatch The item to be found 
       * @param {*} resourceToSearch The resource to be searched through
       */
      listKeysWithResourceType(resourceTypeToMatch, resourceToSearch){
        let listToReturn=[]
        let resourceData= this.state[resourceToSearch]
        let objectOfRelatedResources= ResourceListDescriptions[resourceData["resourceType"]]["child"]
        if(objectOfRelatedResources){
          let listOfRelatedKeys= Object.keys(objectOfRelatedResources)
          for(let key of listOfRelatedKeys){
              let value= objectOfRelatedResources[key]
              if(value.includes(resourceTypeToMatch)){
                listToReturn.push(key)
              }
          }
        }
        return listToReturn

      }

      /**
       * This makes a list of all resources submitted to the state that have the same resource type as the resource in the parameter
       * @param {*} resourceType This is a resourceType
       */
      findAllMatchingResourcesInState(resourceType){
          let listOfMatching=[]
          let stateKeys= this.getStateKeys();
          if(stateKeys){
            for(let stateResource of stateKeys){
              let isSameResourceType= stateResource.includes(resourceType+"/");
              if(isSameResourceType){
                listOfMatching.push(stateResource)
              }
            }
          }
          return listOfMatching;
      }


   //-------------------------------------------------------------------------------------------------------------------------------------------
   //CONVERTING TO A STRING
   //-------------------------------------------------------------------------------------------------------------------------------------------

     /**
     * This takes the information from the state and transforms it for printing to the component screen. This allows the users an
     * idea of the information they have compiled. 
     */
     stringifyState(){
      let stringState= this.translateToString()
      let formattedState= JSON.stringify(stringState, undefined, 2);
      formattedState = formattedState.replace(/\"/g,'');
      formattedState = formattedState.replace(/\\/g,'');
      return formattedState;
     }

     /**
     * This function takes data from a submitted resource in state and translates it into a format that is presentable to the user.
     * Objects and arrays often have a hard time being translated with JSON.Stringify when part of a larger object so here we are
     * individually translating them into strings. 
     * @param {*} stringState the current string state being modified
     * @param {*} submittedResource the resource that information is being transfered into a string format
     */
     fillInResourcesString(stringState, submittedResource ){
      let data= this.state[submittedResource]
      let spotToFill= stringState[submittedResource]

      let dataKeys= Object.keys(data)
      if(dataKeys){
        for(let dataKey of dataKeys){
          let dataValue=data[dataKey]
          Array.isArray(dataValue) || typeof dataValue==='object'? dataValue= JSON.stringify(dataValue) : dataValue=dataValue
          spotToFill[dataKey]= dataValue
        }
      }

     }

     /**
     * this translates state into a string version of itself for the MainComponent to print 
     */
     translateToString(){
      let stringState={}
      let stateResources= this.getStateKeys();

      if(stateResources){
        for(let resourceKey of stateResources){
          stringState[resourceKey]= {} // this makes a new area for the information to be sent
          this.fillInResourcesString(stringState, resourceKey)
        }
      }
      return stringState;

     }

   //-------------------------------------------------------------------------------------------------------------------------------------------
   //DELETING FROM STATE
   //-------------------------------------------------------------------------------------------------------------------------------------------

    /**
     * After users have selected a resource to be removed in State Manager, this function takes the information and
     * deletes it both from the state using the key but also from other resources it might be used within
     * @param {*} selectedItem item to be removed
     */
    deleteFromManager(selectedItem){
      delete this.state[selectedItem]
      this.removeFromOtherResources(selectedItem)
      this.forceUpdate()
    }

    /**
     * This removed any instance of the selectedItem from other resources
     * @param {*} selectedItem The item to be removed
     */
    removeFromOtherResources(selectedItem){
      let stateResourceArray= this.getStateKeys();
      let resourceTypeToRemove= selectedItem.substr(0, selectedItem.indexOf("/"))
      if(stateResourceArray){
        for(let stateResource of  stateResourceArray){
          let listOfKeysToCheck= this.listKeysWithResourceType(resourceTypeToRemove, stateResource)
          if(listOfKeysToCheck){
            for(let keyToCheck of listOfKeysToCheck){
              keyToCheck= this.extractResourceKey(keyToCheck)
              let listToSearch= this.state[stateResource][keyToCheck]
              this.setValueInResourceListByValue(listToSearch, selectedItem, "REMOVED")
            }
          }
        }
      }
    }

   //-------------------------------------------------------------------------------------------------------------------------------------------
   //ADDING RELATED RESOURCES TO STATE
   //-------------------------------------------------------------------------------------------------------------------------------------------


    /**
     * This function adds related resources that have been selected in State Manager. 
     * @param {*} selectedItem 
     */
    addRelatedFromManager(selectedItem){
      let selectedStateData= this.state[selectedItem]
      let selectedType= selectedStateData["resourceType"]
      let resource= ResourceListDescriptions[selectedType]
      let selectedRelatedObject= resource["child"];
      this.updateResourceRelated(selectedRelatedObject, selectedStateData)
    }



    /**
     * This function examines each item in the childList and breaks it down into a usable format for addRelatedToResource
     * @param {*} selectedRelatedResourcesDesc = This is an object describing the resources that are related to the selected resource 
     * @param {*} selectedsDataInState = this is the data of the resource from the state where the relation is to be added
     */
    updateResourceRelated(selectedRelatedResourcesDesc, selectedsDataInState){
      if(selectedRelatedResourcesDesc){ 
        let selectedRelatedKeys= Object.keys(selectedRelatedResourcesDesc) 

          for (let keyToAddRelatedTo of selectedRelatedKeys){ // for each key value in the selected data that requests a related resource
            let relationResourceDescription= selectedRelatedResourcesDesc[keyToAddRelatedTo] // get the description of the resources that are looking to be added

            // If there are multiple items that are listed as possible additions to the key, go through each option
            if(relationResourceDescription.includes(" or ")){ 
                  let splitResources= relationResourceDescription.split(" or ") 
                    for( let splitRelatedResource of splitResources){
                      this.promptUserToAdd(splitRelatedResource, selectedsDataInState, keyToAddRelatedTo)
                    }
            }
      
            else{
                  this.promptUserToAdd(relationResourceDescription,  selectedsDataInState,  keyToAddRelatedTo)
            }
          }

      }

    }


    /**
     * This adds a resource to the selected resource from the drop down menu at the key location prompted in the alert banner.
     * 
     * If there is no spaces in the key this means that the resource is being added as an individual so a new object is made.
     * 
     * If there are spaces this means that the resource is being added to an object potentially containing other information
     * so the first part of the key is the key in the state data and the second part is the key within the object itself
     * 
     * @param {*} selectedsDataInState The data of the resource that the user selected
     * @param {*} keyToAddRelatedTo The key where the current resource is to be added
     * @param {*} resourceBeingAdded The resource that is to be added
     */
    addRelatedToResource(selectedsDataInState,  keyToAddRelatedTo, resourceBeingAdded){
      if(keyToAddRelatedTo.includes(" ")){ 
        // A space indicates that the resource is being added to an object that contains other values as well. 
        this.addChildrenToVaried(keyToAddRelatedTo, resourceBeingAdded,  selectedsDataInState)
        
      }
      else{
        // go to the selected Resource's data, then to the key that this reference falls under and then add the new reference to the list
        let contents= {Reference: resourceBeingAdded}
        selectedsDataInState[(keyToAddRelatedTo)].push(contents) 
      }
      this.forceUpdate()
    }



    /**
     * This prompts the user to add or cancel adding all the possible resources listed in the chosen resources description
     * @param {*} resourceTypeToBeAdded This is the type of resource that is looking to be added to the selected resource
     * @param {*} selectedsDataInState This is the data of the item that was selected from the list
     * @param {*} keyToAddRelatedTo this is the key where the information is going to be added 
     */
    promptUserToAdd(resourceTypeToBeAdded, selectedsDataInState,  keyToAddRelatedTo){
      let allResourcesAbleToAdd= this.findAllMatchingResourcesInState(resourceTypeToBeAdded)
      if(allResourcesAbleToAdd.length>0){
        for(let resourceAddingOption of allResourcesAbleToAdd){
          if (window.confirm('Would you like to add'+ [resourceAddingOption]+' to this resource as '+ keyToAddRelatedTo+'?')){
            this.addRelatedToResource(selectedsDataInState, keyToAddRelatedTo, resourceAddingOption)
          } 
        }
      }
    }



    /**
     * This function is designed to split keys that have 2 parts so that the resource being added is assigned so that: 
     *    The resource is added to the list where the key matches the first word in the submitted keyValue
     *    Within that list in the last object the resource is added to the object as the value for a key derived from the second word.
     * 
     * Example for keyValue "Annotation authorResource":
     *      Annotation: [{author: "Marcus", authorReference:"Practitioner/Poppy"}]
     * 
     * @param {*} keyValue This is key value described in the resource description where the first word is the selected data's key and the second word is the key the resource is assigned to
     * @param {*} resourceBeingAdded This is the resource from the state that is being added
     * @param {*} selectedDataInState This is the data in which the resource is being added
     */
    addChildrenToVaried(keyValue, resourceBeingAdded, selectedDataInState){
      let keyInSelected= this.extractResourceKey(keyValue) // This is the top level key in the selected items data
      let keyInObject= keyValue.substr(keyValue.indexOf(" ")+1, keyValue.length) // This is the key that the resource will be a direct value of
      let listToEdit= selectedDataInState[keyInSelected]
      let lastitem= listToEdit[listToEdit.length-1]
      lastitem[keyInObject]= resourceBeingAdded
    }






    //-------------------------------------------------------------------------------------------------------------------------------------------
    //RENDER
    //-------------------------------------------------------------------------------------------------------------------------------------------


  
    //This renders a new component with child components within it
    render () {
      // Bootstrap is added in to provide some styling to each of the components
      let bootStrap = <link
      rel="stylesheet"
      href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
      integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
      crossOrigin="anonymous"
       />; 


       // Currently each Resource is being rendered as an individual, minimizing the linkage between resources
      /**Within FormBuilder:
       *    resourceType= The name of the resource being constructed
       *    mainState= the state of the mainComponent
       *    sendDataToMain= function that allows the Form Builder to send data back to the mainComponent
       */
      return (
        <> 

         {bootStrap}

        <Row className="m-3"><Instructions state={this.state} passDelete={this.deleteFromManager}/></Row>
        <Row>
          <Col className="m-3">
            <FormBuilder  
              resourceType="Practitioner"
              sendDataToMain={this.setDataFromBuilder}
              mainState={this.state}
            /> 


            <FormBuilder 
              resourceType='Location' 
              sendDataToMain={this.setDataFromBuilder}
              mainState={this.state}
            />


            <FormBuilder 
              resourceType='HealthcareService' 
              sendDataToMain={this.setDataFromBuilder}
              mainState={this.state}
            />

            <FormBuilder 
              resourceType='PractitionerRole' 
              sendDataToMain={this.setDataFromBuilder}
              mainState={this.state}
            />

            <FormBuilder 
              resourceType='Schedule' 
              sendDataToMain={this.setDataFromBuilder}
              mainState={this.state}
            />
          </Col>


          <Col className="m-3">
            <FormBuilder 
              resourceType='Slot' 
              sendDataToMain={this.setDataFromBuilder}
              mainState={this.state}
            />

            <FormBuilder 
              resourceType='ServiceRequest' 
              sendDataToMain={this.setDataFromBuilder}
              mainState={this.state}
            />

            <FormBuilder 
              resourceType='Observation' 
              sendDataToMain={this.setDataFromBuilder}
              mainState={this.state}
            />

            <FormBuilder 
              resourceType='Patient' 
              sendDataToMain={this.setDataFromBuilder}
              mainState={this.state}
            />

            <FormBuilder 
              resourceType='Appointment' 
              sendDataToMain={this.setDataFromBuilder}
              mainState={this.state}
            />
          </Col>
        </Row>


        <Row>
          <Col>
            <div className="m-3">
              <StateManager state={this.state} passDelete={this.deleteFromManager} passAddChildren={this.addRelatedFromManager}/>
            </div>
          </Col>
          <Col>
              <p>Submitted Form Data</p>
              <pre>{this.stringifyState()}</pre>
          </Col>
        </Row>
        
        </>
      );
    }
  }
  
  
 
 export default MainComponent;









































 /*  pushToContents(allKeys, allValues, state){
     let i;
      for (i=0; i< allKeys.length; i++){
         let currentKey= allKeys[i]+"";

        if(currentKey!== "contents"){
            let currentValue= allValues[i]+'';
            if(typeof allValues[i]=== 'object'){
                currentValue= '['+currentValue+']';
            }
            state.contents[currentKey]= currentValue;
        }
      } 
  } */



 /*  getContents(state){
    return state.contents;
  } 
 */



  /* There are 3 different situations that state needs to prepare for:
      - 1. We are adding to a key list where each item is key value pair where the keys are identical
      - 2. We are adding to a key list where each item is a key value pair where the keys are different
      - 3. we are adding a new key value pair
    
      This function ensures that the correct action is taken when adding to state.
      If we are dealing with 1, then it is a currentBasicList, number 2 is a currentVariedList and
      3 is the default option. Formatting is added to ensure the results are as stated in HL7 FHIR
    */
   /* setCorrectState(currentVariedList, currentBasicList, event, state){
    let location= event.target;
    let classname= [location.className];
    let name= [location.name];
    let val= location.value;

    let basicFormat= "{"+classname+": "+ val+"}";
    let variedFormat= "{"+name+": "+ val+"}";

    if(currentBasicList){
      state[classname]= [...currentBasicList, basicFormat]
    }
    else if(currentVariedList){
      state[classname]= [...currentVariedList, variedFormat]
    }
    else{
      state[name]= val
    }

  } */

  /* setUpInitialLists(basicList, variedList, state){
    for (var x in basicList){
      state[basicList[x]]= [];
    }

    for (var x in variedList){
      state[variedList[x]]= []
    }

  } */


  /* prepareForms(locationId, handleChangeFunction, handleSubmitFunction, formType, state){
    let contents;
    if(formType==="Practitioner"){
      contents= <PractitionerFormTemplate state={state} handleChange={handleChangeFunction} />
    }
    else {
      contents= <LocationFormTemplate state={state} handleChange={handleChangeFunction}/>
    }


    return (<BasicSubmission   
        id= {locationId} 
        handleSubmit= {handleSubmitFunction} 
        contents={contents} />);


  } */


  
    
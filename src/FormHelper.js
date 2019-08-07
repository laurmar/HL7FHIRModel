import React from 'react';
import Button from 'react-bootstrap/Button';



/**
 * This file consists of functions that assist in the creation of forms (thus used by SubResourceForms and ResourceForms). 
 * They consist of:
 *    creating regular inputs for the forms
 *    converting lists into a drop down menu
 *    providing headers and buttons to sections within the form
 *    assisting in the creation of classNames
 */


   //-------------------------------------------------------------------------------------------------------------------------------------------
   //FORM INPUT MODELS
   //-------------------------------------------------------------------------------------------------------------------------------------------

    /* This function is designed to aid in the formation of a form. It differenciates between:
        the input type= textarea or input
        is it required on the form
        when should the resource value be taken: onchange or onblur
    the proper form component is created. 
    */
    function TextModel(props){
    let labeltag= <><label>{props.label} </label><br/></>;

    let inputOnChange= <>{labeltag}<input className={props.className} name={props.name} type={props.type} value={props.value} onChange={props.handleFunction} /> <br/></>;
    let textareaOnChange=  <>{labeltag}<textarea  className={props.className} name={props.name} value={props.value} onChange={props.handleFunction}/> <br/></>;
    let inputOnBlur= <>{labeltag}<input className={props.className} name={props.name} type={props.type} value={props.value} onBlur={props.handleFunction} /> <br/></>

    let inputOnChangeRequired= <>{labeltag}<input className={props.className} name={props.name} type={props.type} value={props.value} onChange={props.handleFunction} required/> <br/></>;
    let textareaOnChangeRequired=  <>{labeltag}<textarea  className={props.className} name={props.name} value={props.value} onChange={props.handleFunction} required/> <br/></>;
    let inputOnBlurRequired= <>{labeltag}<input className={props.className} name={props.name} type={props.type} value={props.value} onBlur={props.handleFunction} required/> <br/></>

    if(props.isRequired){
      if(props.type=== "textarea"){return textareaOnChangeRequired;}
      else{
          if (props.needsBlur){return inputOnBlurRequired;}
          else {return inputOnChangeRequired;}
      }
    }
    else{
      if(props.type=== "textarea"){return textareaOnChange;}
      else{
          if (props.needsBlur){return inputOnBlur;}
          else {return inputOnChange;}
      }
    }
    }


    /* This function is designed to aid in the formation of a form using the select model. It differenciates between:
    is it required on the form
    when should the resource value be taken: onchange or onblur
the proper form component is created. 
*/
    function SelectModel(props){
  let labeltag= <><label>{props.label} </label><br/></>;

  let selectOnBlur= <>{labeltag}<select className={props.className} name={props.name} value={props.value} onBlur={props.handleFunction}>   {props.options}   </select> <br/></>;
  let selectOnChange= <>{labeltag}<select className={props.className} name={props.name} value={props.value} onChange={props.handleFunction}>   {props.options}   </select> <br/></>;

  let selectOnBlurRequired= <>{labeltag}<select className={props.className} name={props.name} value={props.value} onBlur={props.handleFunction} required>   {props.options}   </select> <br/></>;
  let selectOnChangeRequired= <>{labeltag}<select className={props.className} name={props.name} value={props.value} onChange={props.handleFunction} required>   {props.options}   </select> <br/></>;

  if(props.isRequired){
    let requiredType;
    props.options && props.needsBlur ? requiredType= selectOnBlurRequired : requiredType= selectOnChangeRequired
    return requiredType
  }

  else{
    let type;
    props.options && props.needsBlur ? type= selectOnBlur : type= selectOnChange
    return type
  }
    }

   //-------------------------------------------------------------------------------------------------------------------------------------------
   //CREATING DROP DOWN SELECTIONS
   //-------------------------------------------------------------------------------------------------------------------------------------------

    // When given a list of options to choose from in the form, this function helps create the visibility. 
    function MapToOptions(props){
        var array = props.selectArray;
          var options = array.map( (item) =>
              <option value ={item} key={array.indexOf(item)}>{item}</option>
          );
          return options;
    }

    // When given a object with key values pairs this convers the keys into a usable drop down and the values into the submitted data
    function MapToCodeableConcepts(props){
        let allKeys= Object.keys(props.inputCode);
        let allValues= Object.values(props.inputCode);
          var options = allValues.map( (item) =>
              <option name={allKeys[allValues.indexOf(item)]} value ={item} key={allValues.indexOf(item)}>{allKeys[allValues.indexOf(item)]}</option>
          );
          return options;
    }

   //-------------------------------------------------------------------------------------------------------------------------------------------
   //SUB SECTIONS WITHIN THE FORMS
   //-------------------------------------------------------------------------------------------------------------------------------------------

    // This is a header applied to subsections to distinguish them from the rest of the contents
    function SubSectionHead(props){
        return <><p className="font-weight-bold">{props.sectionHeader}</p></>
    }

    /* These are the buttons that allow users to add and delete from a subsection list*/
    function SubSectionButton(props){

      let button=<> <Button id={props.id +" +"} variant="success" size="sm" onClick={props.clickFunction} > +</Button>
                    <Button id={props.id +" -"} variant="warning" size="sm" onClick={props.clickFunction} > -</Button><br/> <br/> </>
      return button;
    }

   //-------------------------------------------------------------------------------------------------------------------------------------------
   //MISCELLANEOUS
   //-------------------------------------------------------------------------------------------------------------------------------------------

    /**
     * This adds a new value to a classname
     * @param {*} currentName current classname
     * @param {*} addedName new text to append to the classname
     */
    function AppendClassName(currentName, addedName){
      let newName=[currentName, addedName].join(' ');
      return newName;
    }








export {  TextModel,  MapToOptions, MapToCodeableConcepts, SubSectionHead, AppendClassName, SelectModel, SubSectionButton };
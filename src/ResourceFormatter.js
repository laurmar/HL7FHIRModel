import React from 'react';
import Button from 'react-bootstrap/Button';
import {LocationFormTemplate, PractitionerFormTemplate, HeathcareServiceFormTemplate, PractitionerRoleFormTemplate, ScheduleFormTemplate, SlotFormTemplate,
        ServiceRequestFormTemplate,ObservationFormTemplate,PatientFormTemplate, AppointmentFormTemplate, } from './ResourceForms'
import {Identifier}  from './SubResourceForms'
import {TextModel} from './FormHelper'




/**
 * This class is designed to format each form with its necessary buttons. Specifically it creates all the show/hide buttons, creates submission buttons,
 * pulls each form from ResourceForms.js, and creates the make a new button within each form. 
 */
class ResourceFormatter extends React.Component {

    /**
     * This constructor is designed to take the information from formbuilder and bind functionality to the form with buttons
     * @param {*} props Input from Form Builder
     */
    constructor(props) {
      super(props);
      this.state = {isHiding: true};
  
      this.showContents = this.showContents.bind(this);
      this.makeNewButtonBuilderFunction= this.props.makeNewButtonFunctionality.bind(this);
    }



    /** This sets the value of isHidden to the opposite of its previous value */
    showContents() {
      this.setState(state => ({ isHiding: !state.isHiding }));
    }
  

    /**
     * Taking input from the state.isHidden, this either removes the values of the form or adds them, along with buttons for adding new items and submitting
     */
    toggleContents(){
      if(this.state.isHiding){
        return <></>;
      }
      else{
        let main= this.createContents(this.props.form);

        return <>
            <br/>
            {this.showMakeNewButton()}
            <Identifier className={this.props.className} state={this.props.state} handleChange={this.props.handleChange} /> 
            {main} 
            <TextModel type="submit" value={this.props.state.trials} /> 
        </> ;
      }
    }


    /**
     * This creates a button that the user can use to create new submissions from a form they have already used. 
     * This uses a function from form builder to clean the form and also clean the data so that the new form is clear for the new input
     */
    showMakeNewButton(){
      let listSubmittedResources= Object.keys(this.props.mainState);
      let currentForm= this.props.form+"/" // Note the slash is used to ensure that similar resource types are handled such as practitioner and practitioner role
      if(listSubmittedResources){
        for(let currentSubmittedResource of listSubmittedResources){
          if(currentSubmittedResource.includes(currentForm)){
            return <Button variant="warning" onClick={this.makeNewButtonBuilderFunction}>Make a new {this.props.form}</Button>
          }
        }
      }
      return <></>;
    }
    

    /** This creates the right form from all of ResourceForms.js and passes it the right information */
    createContents(formType){
      let s= this.props.state
      let hc= this.props.handleChange
      let hs= this.props.modifyListElements
      let options={
        "Practitioner":      <PractitionerFormTemplate state={s} handleChange={hc} resourceName={formType} subButton= {hs}/>,
        "Location":          <LocationFormTemplate state={s} handleChange={hc} resourceName={formType} subButton= {hs}/>,
        "HealthcareService": <HeathcareServiceFormTemplate state={s} handleChange={hc} resourceName={formType} subButton= {hs}/>,
        "PractitionerRole":  <PractitionerRoleFormTemplate state={s} handleChange={hc} resourceName={formType} subButton= {hs}/>,
        "Schedule":          <ScheduleFormTemplate state={s} handleChange={hc} resourceName={formType} subButton= {hs}/>,
        "Slot":              <SlotFormTemplate state={s} handleChange={hc} resourceName={formType} subButton= {hs}/>,
        "ServiceRequest":    <ServiceRequestFormTemplate state={s} handleChange={hc} resourceName={formType} subButton= {hs}/>,
        "Observation":       <ObservationFormTemplate state={s} handleChange={hc} resourceName={formType} subButton= {hs}/>,
        "Patient":           <PatientFormTemplate state={s} handleChange={hc} resourceName={formType} subButton= {hs}/>,
        "Appointment":       <AppointmentFormTemplate state={s} handleChange={hc} resourceName={formType} subButton= {hs}/>,
      }

      let response;
      options.hasOwnProperty(formType) ? response= options[formType]: response= null;
      return response;

    }
  
    /**
     * This actually renders the form and the show/hide button for each of the forms
     */
    render() {
      return (
        <>
            <>
                <Button  variant="outline-primary" onClick={this.showContents} block>
                {this.state.isHiding ? 'Show '+this.props.form +" form": 'Hide '+this.props.form+" form"}
                </Button>
                <br/>
                <form  id={this.props.form+"form"}onSubmit={this.props.handleSubmit}> {this.toggleContents()}  </form>

            </>
            <br/>
        </>
      );
    }
  }


 export { ResourceFormatter};
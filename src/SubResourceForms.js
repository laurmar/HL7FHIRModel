import React from 'react';
import {TextModel, MapToOptions, MapToCodeableConcepts, SubSectionHead, AppendClassName, SelectModel, SubSectionButton} from './FormHelper'
const textarea= "textarea";
const yes=true;
const date="date";
const hoursOfOp="hoursOfOperation";

/**These represent repeated sections of forms that exist across Resources. They then can be added into ResourceForms in a 
 * modular fashion.
 */


 
/**
 * This form is designed to help with organizing lists of information. Specifically lists of names, contact information, and addresses.
 * HL7 deems these to often be lists of data, so this section is made to combine these three common list data points for reusability.
 * @param {*} props This is inputted information
 */
function NamePhoneAddressList(props){  
    let hc= props.handleChange;
    let cf= props.clickFunction
    let cn= props.className
    return(
        <>
            <TextModel className= {AppendClassName(cn, 'name' )} label="Name: " name="text" type= "text" value={props.state.nameItem} handleFunction={hc} needsBlur={yes}/>
            <SubSectionButton id= {AppendClassName(cn, 'name' )} clickFunction={cf}/>
            <Telecom className={cn} state={props.state} handleChange={hc}  clickFunction={cf}/>
            <Address className={cn} state={props.state} handleChange={hc}  clickFunction={cf}/>
            </>
    );
}

/**
 * This represents a list of addresses form allowing the user to submit an address and then append or remove from that list with buttons
 * @param {*} props This is inputted information
 */
function Address(props){  
    let hc= props.handleChange;
    let cf= props.clickFunction
    let cn= props.className
    let newClassName= AppendClassName(cn, 'address' )
    const addressList= <MapToOptions selectArray={ ['home', 'work', 'temp', 'old', 'billing']}/>
    return(
        <>
            <SubSectionHead sectionHeader="Address: "/>
            <TextModel className={newClassName} label="Address: " name="text"    value={props.state.addresspart} handleFunction={hc} needsBlur={yes}/>
            <SelectModel className= {newClassName} label="Purpose of this Address: " name="use"  value={props.state.use} handleFunction={hc} options={addressList}/> 
            <SubSectionButton id={newClassName} clickFunction={cf}/>
        </>
    );

}

/**
 * This represents a list of contact details form allowing the user to submit an contact point and then append or remove from that list with buttons
 * @param {*} props This is inputted information
 */
function Telecom(props){  
    let hc= props.handleChange;
    let cf= props.clickFunction
    let newClassName= AppendClassName(props.className, 'telecom' )
    const systemList= <MapToOptions selectArray={ ['phone',' fax', 'email', 'pager',' url', 'sms', 'other']}/>
    const useList= <MapToOptions selectArray={ ['home', 'work', 'temp', 'old', 'mobile']}/>
    return(
        <>
            <SubSectionHead sectionHeader="Contact Information: "/> 
            <SelectModel className= {newClassName} label="System: " name="system"  value={props.state.system} handleFunction={hc} options={systemList}/> 
            <TextModel className={newClassName} label="Contact Point Details: " name="value"    value={props.state.telecomValue} handleFunction={hc} needsBlur={yes}/>
            <SelectModel className= {newClassName} label="Purpose of this contact point: " name="use"  value={props.state.use} handleFunction={hc} options={useList}/> 
            <SubSectionButton id={newClassName} clickFunction={cf}/>
        </>
    );

}


/**
 * This represents the form and submission information necessary for basic information for people resources
 * @param {*} props This is inputted information
 */
function BasicPeopleInfo(props){  
    let hc= props.handleChange;
    const genderList= <MapToOptions selectArray={ ["unknown", "male", "female", "other"]}/>
    return(
        <>
            <NamePhoneAddressList className= {props.className} state={props.state} handleChange={hc}  clickFunction={props.clickFunction}/>
            <TextModel className= {props.className} label="Birth Date: " name="birthDate" type={date} value={props.state.birthDate} handleFunction={hc}/>
            <SelectModel className= {props.className} label="Gender: " name="gender"  value={props.state.gender} handleFunction={hc} options={genderList}/> 
        </>
    );
}



/**
 * This form is designed to represent "availableTime" or "hoursOfOperation" objects specified in the HL7 Fyre documentation
 * @param {*} props This is inputted information
 */
function HoursOfOperation(props){   
    let hc= props.handleChange;
    const newClassName= AppendClassName(props.className, hoursOfOp);
    const boolList= <MapToOptions selectArray={["Unknown", "True", "False"]}/>
    const daysOfWeek=< MapToOptions selectArray={["mon", "tue", "wed", "thu", "fri",  "sat", "sun"]}/>

      
    return(
        <div  > 
            <SubSectionHead sectionHeader="Hours of Operation: "/>
            <SelectModel className= {newClassName} label="All Day?: " name="allDay " value={props.state.allDay} handleFunction={hc}  options={boolList}/>
            <SelectModel className= {newClassName} label="Days of Week: " name="daysOfWeek" value={props.state.daysOfWeek} handleFunction={hc}  isMultiple={true} options={daysOfWeek}/>
            <TextModel className= {newClassName} label="Opening Time: " name="availableStartTime" type="time" value={props.state.openingTime} handleFunction={hc} />
            <TextModel className= {newClassName} label="Closing Time: " name="availableEndTime" type="time" value={props.state.closingTime} handleFunction={hc}/>
            <SubSectionButton id={newClassName} clickFunction={props.clickFunction}/>

        </div>


    );
}


/**This form is designed to help gather data on a period within a resource
 * @param {*} props This is inputted information
 */
function Period(props){  
    let hc= props.handleChange;
    let newClassName= AppendClassName(props.className, "Period")
    return(
        <div  >
            <SubSectionHead sectionHeader="Period: "/>
            <TextModel className= {newClassName} label="Starting date: " name="start" type="date" value={props.state.startPeriod} handleFunction={hc} />
            <TextModel className= {newClassName}  label="Ending date: " name="end" type="date" value={props.state.endPeriod} handleFunction={hc}/>
        </div>



    );

}

/**This form gathers data for the JSON Data object list Annotation
 * @param {*} props This is inputted information
 */
function Annotation(props){  
    let hc= props.handleChange;
    let newClassName= AppendClassName(props.className,"Annotation")
    return (
        <div  >
         <SubSectionHead sectionHeader="Annotation: "/>
         <TextModel className= {newClassName} label="Annotation Date: " name="date" type="datetime-local" value={props.state.annotationDate} handleFunction={hc} />
         <TextModel className={newClassName} label="Annotation Text Description: " name="text" type={textarea}  value={props.state.textAnnotation} handleFunction={hc} needsBlur={yes}/>
         <AnnotationAuthor className= {newClassName} state={props.state} handleChange={hc}/>
         <SubSectionButton id={newClassName} title="Annotation" clickFunction={props.clickFunction}/>
        </div>
    );
}

/**This form gathers data for the author of the Annotation JSON Object list
 * @param {*} props This is inputted information
 */
function AnnotationAuthor(props){  
    let hc= props.handleChange;
    let newClassName= AppendClassName(props.className, "Author")
    return (
        <div  >
             <SubSectionHead sectionHeader="Annotation Author: "/>
            <TextModel className={newClassName} label="Author: " name="author"  value={props.state.authorString} handleFunction={hc} needsBlur={yes}/>
        </div>
    );
}

/**This form gathers data for Contact JSON Object list
 * @param {*} props This is inputted information
 */
function Contact(props){    
    let hc= props.handleChange;
    const genderList= <MapToOptions selectArray={ ["unknown", "male", "female", "other"]}/>
    const systemList= <MapToOptions selectArray={ ['phone',' fax', 'email', 'pager',' url', 'sms', 'other']}/>
    const useList= <MapToOptions selectArray={ ['home', 'work', 'temp', 'old', 'mobile']}/>
    const contactClassName= AppendClassName(props.className, "contact")

    // Here the key is displayed and the value is what is sent into the data
    let contactCode={
        "Unknown":"U",
        "Emergency Contact": 'C', 
        "Employer":"E", 
        "Federal Agency": "F",
        "Insurance Company": "I",
        "Next-of-Kin": "N" , 
        "State Agency": "S" };

    const test= <MapToCodeableConcepts inputCode={contactCode}/>
    return(
        <div  >
             <SubSectionHead sectionHeader="Contact: "/>
            <SelectModel className={contactClassName} label="Relationship: " name="relationship" value={props.state.relationship} handleFunction={hc}  options={test}/>
            <TextModel className={contactClassName} label="Name: " name="name"   value={props.state.nameContract} handleFunction={hc} needsBlur= {yes}/>
            <SelectModel className= {contactClassName} label="System: " name="system"  value={props.state.system} handleFunction={hc} options={systemList}/> 
            <TextModel className={contactClassName} label="Contact Point Details: " name="value"    value={props.state.telecomValue} handleFunction={hc} needsBlur={yes}/>
            <SelectModel className= {contactClassName} label="Purpose of this contact point: " name="use"  value={props.state.use} handleFunction={hc} options={useList}/> 
            <TextModel className={contactClassName} label="Address: " name="address"    value={props.state.addressContact} handleFunction={hc}/> 
            <SelectModel className={contactClassName} label="Gender: " name="gender"  value={props.state.genderContact} handleFunction={hc} options={genderList}/> 
            <SubSectionButton id={contactClassName} title="Contact" clickFunction={props.clickFunction}/>
        </div>);
}


/**This form gathers data for Participant JSON Object list
 * @param {*} props This is inputted information
 */
function Participant(props){    
    let hc= props.handleChange;
    const participantClassName= AppendClassName(props.className, "participant")
    const requiredList= <MapToOptions selectArray={ ['required', 'optional', 'information-only']}/>
    const statusList= <MapToOptions selectArray={ [ '', 'accepted', 'declined', 'tentative', 'needs-action']}/> // note the first item is left blank so it can be seen as required by the system
    return(
    <div  >
        <SubSectionHead sectionHeader="Participant: "/>
        <SelectModel className={participantClassName} label="Required: " name="required"  value={props.state.required} handleFunction={hc} options={requiredList}/> 
        <SelectModel className={participantClassName} label="Status: " name="status"  value={props.state.statusParticipant} handleFunction={hc} options={statusList} isRequired={true}/> 
        <SubSectionButton id={participantClassName} title="Participant" clickFunction={props.clickFunction}/>
    </div>);
}

/**This form gathers data for Identifier, which is required by every resource form
 * @param {*} props This is inputted information
 */
function Identifier(props){   
    let hc= props.handleChange;
    const identifierClassName= AppendClassName(props.className, "identifier")
    return (
        <div  >
            <SubSectionHead sectionHeader="Identifier: "/>
            <TextModel className={identifierClassName} label="Unique Value: " name="value"   value={props.state.value} handleFunction={hc} needsBlur={yes} isRequired={yes}/>
        </div>);
}

export {Identifier, Telecom, HoursOfOperation, BasicPeopleInfo, Period, Annotation, Contact, Participant}
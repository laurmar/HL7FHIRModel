import React from 'react';
import {TextModel, MapToOptions, MapToCodeableConcepts, AppendClassName, SelectModel} from './FormHelper'
import {Telecom, HoursOfOperation, BasicPeopleInfo, Period, Annotation, Contact, Participant} from './SubResourceForms'



//-------------------------------------------------------------------------------------------------------------------------
// specific templates below
// Each represents the form for one resource, often using the templates above
//-------------------------------------------------------------------------------------------------------------------------

const boolList= <MapToOptions selectArray={["Unknown", "True", "False"]}/>

//Location form outline
function LocationFormTemplate(props){  //COMPLETED REFACTORING
    let rn= props.resourceName;
    let hc= props.handleChange;
    let contents=
        <div>
            <TextModel className={rn} label="Name: " name="name"   value={props.state.name} handleFunction={hc}/>
            <Telecom className={AppendClassName( rn, "telecom")} state={props.state} handleChange={hc}  clickFunction={props.subButton}/>
            <TextModel className={rn} label="Address: " name="address"    value={props.state.address} handleFunction={hc}/> 
            <TextModel className={rn} label="Additional Details: " name="description" type="textarea"  value={props.state.description} handleFunction={hc} />
            <TextModel className={rn} label="Availability Exceptions: " name="exceptions" type="textarea"  value={props.state.exceptions} handleFunction={hc}/>
            <HoursOfOperation className={rn} state={props.state} handleChange={hc} clickFunction={props.subButton}/>
            
        </div>;
    return contents;

}

// practitioner form outline
function PractitionerFormTemplate(props){  
    let rn= props.resourceName;
    let hc= props.handleChange;
    let formContents= <BasicPeopleInfo className={rn} state={props.state} handleChange={hc}  clickFunction={props.subButton}/> ;
    return formContents;
        
}

// healthcare service form outline
function HeathcareServiceFormTemplate(props){  
    let rn= props.resourceName;
    let hc= props.handleChange;

    let formContents=
        <div>
            <TextModel className={rn} label="Name: " name="name"   value={props.state.name} handleFunction={hc}/>
            <TextModel className={rn} label="Image: " name="photo"    value={props.state.photo} handleFunction={hc}/>
            <Telecom className={AppendClassName( rn, "telecom")} state={props.state} handleChange={hc}  clickFunction={props.subButton}/>
            <SelectModel className={rn} label="Appointment Required?: " name="appointmentRequired " value={props.state.appointmentRequired} handleFunction={hc}  options={boolList}/>
            <TextModel className={rn} label="Comments: " name="comments" type="textarea"  value={props.state.comments} handleFunction={hc} />
            <TextModel className={rn} label="Availability Exceptions: " name="exceptions" type="textarea"  value={props.state.exceptions} handleFunction={hc}/>
            <HoursOfOperation className={rn} state={props.state} handleChange={hc} clickFunction={props.subButton}/> 
        </div>
    return formContents;
}

// practictioner role form outline
function PractitionerRoleFormTemplate(props){  
    let rn= props.resourceName;
    let hc= props.handleChange;

    let practitionerRoleCode={
        "Unknown": '0000000', 
        "Doctor":"doctor", 
        "Specialized dentist": 21365001,
        "Public health dentist": 68867008,
        "Oral pathologist": 66476003 , 
        "Pediatric dentist": 90201008 ,
        "Restorative dentist":309460000};
    const roleOptions= <MapToCodeableConcepts inputCode={practitionerRoleCode}/>

    let formContents=
    <div>
         <SelectModel className={AppendClassName(rn,"code")} label="Role: " name="role " value={props.state.roleCode} handleFunction={hc}  options={roleOptions}/>
         <Telecom className={AppendClassName( rn, "telecom")} state={props.state} handleChange={hc}  clickFunction={props.subButton}/>
         <TextModel className={rn} label="Availability Exceptions: " name="exceptions" type="textarea"  value={props.state.exceptions} handleFunction={hc}/>
         <HoursOfOperation className={rn} state={props.state} handleChange={hc} clickFunction={props.subButton}/> 
    </div>
    return formContents;
}

// schedule form outline
function ScheduleFormTemplate(props){  
    let rn= props.resourceName;
    let hc= props.handleChange;
   
    let formContents=
    <div>
        <Period className={rn} state={props.state} handleChange={hc}/>
        <TextModel className={rn} label="comment: " name="comment" type="textarea"  value={props.state.comment} handleFunction={hc}/>
    </div>;

    return formContents;

}

// slot form template
function SlotFormTemplate(props){  
    let rn= props.resourceName;
    let hc= props.handleChange;

    let statusList= <MapToOptions selectArray={['', "busy", "free", "busy-unavailable", "busy-tentative", "entered-in-error"]}/> // first option is empty to ensure that it is required
    let typeList= <MapToOptions selectArray={["CHECKUP", "EMERGENCY", "FOLLOWUP", "ROUTINE", "WALKIN" ]}/>
    let formContents=
    <div>
        <SelectModel className={rn} label="Appointment Type: " name="appointmentType" value={props.state.appointmentType} handleFunction={hc}  options={typeList}/>
        <SelectModel className={rn} label="Status: " name="status" value={props.state.status} handleFunction={hc}  options={statusList} isRequired={true}/>
        <SelectModel className={rn} label="Overbooked?: " name="overbooked" value={props.state.overbooked} handleFunction={hc}  options={boolList}/>
        <TextModel className={rn} label="Start: " name="start" type="datetime-local" value={props.state.start} handleFunction={hc} isRequired={true}/>
        <TextModel className={rn} label="End: " name="end" type="datetime-local" value={props.state.end} handleFunction={hc} isRequired={true}/>
        <TextModel className={rn} label="Comments: " name="comments" type="textarea"  value={props.state.comments} handleFunction={hc} />
        
    </div>;

    return formContents;

}

// service request form template
function ServiceRequestFormTemplate(props){  
    let rn= props.resourceName;
    let hc= props.handleChange;

    const statusList= <MapToOptions selectArray={[ '',"draft", "active", "suspended", "completed", "entered-in-error", "cancelled"]}/> // first option is empty to ensure that it is required
    const intentList= <MapToOptions selectArray={['',"proposal", "plan", "order"]}/> // first option is empty to ensure that it is required
    const priorityList= <MapToOptions selectArray={["routine", "urgent", "asap", "stat"]}/>
    let formContents=
    <div>
         <SelectModel className={rn} label="Status: " name="status" value={props.state.status} handleFunction={hc}  options={statusList} isRequired={true}/>
         <SelectModel className={rn} label="Intent: " name="intent" value={props.state.intent} handleFunction={hc}  options={intentList} isRequired={true}/>
         <SelectModel className={rn} label="Priority: " name="priority" value={props.state.priority} handleFunction={hc}  options={priorityList}/>
         <TextModel className={rn} label="Occurring Date and Time: " name="occuringDateTime" type="datetime-local" value={props.state.occuringDateTime} handleFunction={hc} />
         <TextModel className={rn} label="Authored On: " name="authoredOn" type="datetime-local" value={props.state.authoredOn} handleFunction={hc} />
         <TextModel className={rn} label="Patient Instructions: " name="patientInstruction" type="textarea"  value={props.state.patientInstruction} handleFunction={hc} />
         <Annotation className={rn} state={props.state} handleChange={hc} clickFunction={props.subButton}/>
        
    </div>;
    return formContents;
    
}

// observation form outline
function ObservationFormTemplate(props){  
    let rn= props.resourceName;
    let hc= props.handleChange;

    const statusList= <MapToOptions selectArray={[ '',"registered", "preliminary", "final", "amended"]}/>
    let observationCode={
        " ": "",
        "Unknown": '0000000',
        "Physical findings of Mouth and Throat and Teeth Narrative": '10201-2'
        };

    const test= <MapToCodeableConcepts inputCode={observationCode}/>

    let formContents=
    <div>
        <SelectModel className={AppendClassName(rn, "code")} label="Type of Observation: " name="code" value={props.state.typeCode} handleFunction={hc}  options={test} isRequired={true}/>
        <SelectModel className={rn} label="Status: " name="status" value={props.state.status} handleFunction={hc}  options={statusList} isRequired={true}/>
        <TextModel className={rn} label="Effective Instant: " name="effectiveInstant" type="datetime-local" value={props.state.effectiveInstant} handleFunction={hc} />
        <TextModel className={rn} label="Issued: " name="issued" type="datetime-local" value={props.state.issued} handleFunction={hc} />
        <Annotation className={rn} state={props.state} handleChange={hc} clickFunction={props.subButton}/>      
    </div>
    return formContents;

}


// patient form template
function PatientFormTemplate(props){  
    let rn= props.resourceName;
    let hc= props.handleChange;
    let maritalStatusCode={
        "Unknown": 'UNK', 
        "Annulled":"A",
        "Divorced":"D",
        "Interlocutory":"I",
        "Legally Seperated":"L",
        "Married":"M",
        "Polygamous":"P",
        "Never Married":"S",
        "Domestic partner":"T",
        "unmarried":"U",
        "Widowed":"W"};

    const test= <MapToCodeableConcepts inputCode={maritalStatusCode}/>

    let formContents=
    <div>
        <SelectModel className={rn} label="Marital Status: " name="maritalStatus " value={props.state.maritalStatus} handleFunction={hc}  options={test}/>
        <SelectModel className={rn} label="Active: " name="active" value={props.state.active} handleFunction={hc}  options={boolList}/>
        <BasicPeopleInfo className={rn} state={props.state} handleChange={hc}  clickFunction={props.subButton}/>
        <SelectModel className={rn} label="Is Twin?: " name="multipleBirthBoolean " value={props.state.multipleBirthBoolean} handleFunction={hc}  options={boolList}/>
        <Contact className={rn} state={props.state} handleChange={hc} clickFunction={props.subButton}/>
    </div>;
    return formContents;
}

// appointment form template
function AppointmentFormTemplate(props){  
    let rn= props.resourceName;
    let hc= props.handleChange;

    const statusList= <MapToOptions selectArray={['','proposed', 'pending', 'booked', 'arrived', 'fulfilled', 'cancelled', 'noshow', 'entered-in-error', 'checked-in', 'waitlist']}/>
    
    let appointmentType={
        "A routine check-up, such as an annual physical":"CHECKUP",
        "Emergency appointment":"EMERGENCY",
        " A follow up visit from a previous appointment":"FOLLOWUP",
        "Routine appointment - default if not valued":"ROUTINE",
        "A previously unscheduled walk-in visit":"WALKIN"}
    let appointment= <MapToCodeableConcepts inputCode={appointmentType}/>


    let formContents=
    <div>
        <SelectModel className={rn} label="Status: " name="status" value={props.state.status} handleFunction={hc}  options={statusList} isRequired={true}/>
        <SelectModel className={rn} label="Appointment Type: " name="appointmentType" value={props.state.appointmentType} handleFunction={hc}  options={appointment}/>
        <TextModel className={rn} label="Appointment Start: " name="start" type="datetime-local" value={props.state.start} handleFunction={hc} />
        <TextModel className={rn} label="Appointment End: " name="end" type="datetime-local" value={props.state.end} handleFunction={hc}/>
        <TextModel className={rn} label="Duration: " name="duration" value={props.state.duration} handleFunction={hc}/>
        <TextModel className={rn} label="Created at: " name="created" type="datetime-local" value={props.state.created} handleFunction={hc} />
        <TextModel className={rn} label="Description of Appointment: " name="description" type="textarea"  value={props.state.description} handleFunction={hc} />
        <TextModel className={rn} label="Comments: " name="comments" type="textarea"  value={props.state.comments} handleFunction={hc} />
        <TextModel className={rn} label="Patient Instructions: " name="patientInstruction" type="textarea"  value={props.state.patientInstruction} handleFunction={hc} />
        <Participant className={rn} state={props.state} handleChange={hc} isRequired={true} clickFunction={props.subButton}/>
        
    </div>
    return formContents;
}




/**
 * Many resources described on HL7 Fyre documentation describe certain values being lists, objects, or references.
 * This is to keep track of which values are treated as lists, objects, or references so that the user's input
 * can be handled properly. 
 * Note that 
 *      - elements describe objects 
 *      - child are references with the key being the key for the input and the value being the resource being added.
 *              - When there is a space in the key such as "Annotation authorReference" then the first word is the container
 *                and the second word is the key. So in this case under Annotation (which is a list), the reference would
 *                be placed under the key authorReference in an object
 *              - If the value contains "or" then multiple resources can fulfill the requirements
 */
const ResourceListDescriptions= { 
    Practitioner:{ 
        list: ["address", "name", "telecom"]
    },
    Location:{
        list:["hoursOfOperation", "telecom"]
    },
    HealthcareService:{
        list:["hoursOfOperation", "notAvailable", "telecom"],
        child:{"location":"Location"},
    },
    PractitionerRole:{
        list:["hoursOfOperation", "notAvailable", "telecom", "code"],
        child:{"location":"Location", 
        "healthcareService":"HealthcareService", 
        "practitioner":"Practitioner"}
    },
    Schedule:{
        elements:["Period"],
        child:{"actor":"Location or Practitioner"}
    },
    Slot:{
        child:{"schedule":"Schedule"}
    },
    ServiceRequest:{
        list:["Annotation"],
        child:{"subject":"Patient", 
        "requester":"Practitioner or PractitionerRole or Patient",
        "performer": "Practitioner or PractitionerRole",
        "locationReference":"Location", 
        "reasonReference":"Observation",
        "Annotation authorReference": "Practitioner or Patient"}
    },
    Observation:{
        list:["Annotation"],
        child:{"basedOn":"ServiceRequest", 
        "subject":"Patient", 
        "Annotation authorReference": "Practitioner or Patient"}
    },
    Patient:{
        list:["contact", "address", "name", "telecom"],
    },
    Appointment:{
        list:["participant"],
        elements:["appointmentType"],
        child:{"basedOn":"Service Request", 
        "slot":"Slot",
        "reasonReference": "Observation", 
        "Participant actor": "Patient or Practitioner or PractitionerRole or HealthcareService or Location"}
    }
};

export {LocationFormTemplate, 
    PractitionerFormTemplate, 
    HeathcareServiceFormTemplate, 
    PractitionerRoleFormTemplate, 
    ScheduleFormTemplate, 
    SlotFormTemplate, 
    ServiceRequestFormTemplate,
    ObservationFormTemplate,
    PatientFormTemplate,
    AppointmentFormTemplate,
    ResourceListDescriptions,
};

import React from 'react';
import Button from 'react-bootstrap/Button';
import image from './program_image.png';

class Instructions extends React.Component{

      /**
     * This sets up the basic functionality of the instructions component
     * @param {*} props Information from the Main Component
     */
      constructor(props){
          super(props)
          this.state = {isHiding: true};
        
          this.clickInstructions = this.clickInstructions.bind(this);
      }

      /**
       * This switches state's isHiding value to its opposite
       */
      clickInstructions() {
          this.setState(state => ({
            isHiding: !state.isHiding
          }));
      }


      /**
       * this takes information from state on isHiding and uses it to determine the contents of InstructionComp 
       */
      toggleContents(){
        if(this.state.isHiding){
          return <></>;
        }
        else{
         
          return<>{this.createInstructions()}</>     }
      }


      /**
       * These are the instructions to be shown 
       */
     createInstructions(){
       let introduction=<div>
              <h3>Introduction</h3>
              <p>The goal of this demonstation is to show a subset of Resource relations that show the HL7 Fyre JSON code 
              for the situation "Dentistry Appointment Developed from Observational Cause".</p>

              <p>Using the HL7 Fyre documentation I extracted a subset of resource and data points that would simulate the most simplistic
                version of appointment data derived from an observational event. After examining the necessary connections that exist between
                each of these resources I then developed forms for each of the resources from the JSON formatting described on the HL7 website. 
              </p>

              <img src={image} alt="resource connections"/>

              <p>With the current design of the program, each resource exists individually upon initial creation. This allows the user more control over 
                the resources that are connected and how the overall form structure develops overtime. 
              </p>
        </div>

       let instructions=<div>  
              
              <h3>Usage</h3>

              <p> To begin, select a form. After filling it out, press the submit form to ensure that the data is represented below "Submitted Form Data".
                Keeping the "Unique Value" the same allows you to edit this resource, even appending and removing from data areas that are followed with
                 "+" and "-" buttons. Keep adding and changing until the resource data submission represents the desired resource. Until you have finished 
                 your resource form  take care not to change the identity field as this is how your form submission is identified in the submission.
              </p>
              <p>When completing "Days of Week: " select a day and submit before selecting another day. In the visualized data section the days should be appended 
                next to each other. 
              </p>

              <p> To start a new form, either select a new form  or press the "Make a new"  button at the top of the current form. 
                Always make sure to press "Make a new"  when you are filling out a form field you have previously used to prevent the previous form
                data from contaminating your new submission.
              </p>

              <p>In the case you want to edit a form you have previously submitted, press the "Make a new" button at the top of the matching resource form
                then enter in the identifier that matches the submitted identifier. Then make any desired changes to the resource. </p>

              <p>Be sure to submit regularly to see the data progression and press "Make a new" before beginning any new resources.</p>

              <p> At the bottom of the program "Show State Manager" allows you to delete resource submissions and add resource connections between submitted resources.</p>
          
        </div>

        let combinedText=<> <h2>Welcome to HL7 Fyre Form Demonstration</h2>  {introduction}{instructions}</>
        return combinedText
    
       
      }
    
       

      /**
       * This creates the button and contents of instructions
       */
      render(){
        return (
          <>
              <Button  variant="outline-info" onClick={this.clickInstructions} block>
              {this.state.isHiding ? 'Show Instructions for HL7 Form Composition': 'Hide Instructions for HL7 Form Composition'}
              </Button>
              <br/>
              {this.toggleContents()}  

          </>
        );
      }
}

export {Instructions}
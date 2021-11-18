import React from "react";
import { Button, Header, Icon, Modal, Transition, Form, Divider } from "semantic-ui-react";
import { displayDateRange } from "../../utils/strings";

class GiveawayModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      giveaway_id: props.giveaway_id === undefined ? "" : props.giveaway_id,
      event_name: props.event_name === undefined ? "" : props.event_name,
      message: props.message === undefined ? "" : props.message,
      start_time: props.start_time === undefined ? "" : props.start_time,
      end_time: props.end_time === undefined ? "" : props.end_time,
      student_id: props.student_id === undefined ? "" : props.student_id,
      phone_number: "",
      password: ""
    };
  }

  isEntryValid = () => {
    /*if(this.state.giveaway_id === null || this.state.giveaway_id === undefined || this.state.giveaway_id === ""){
      return false;
    }*/
    if(this.state.student_id === null || this.state.student_id === undefined || this.state.student_id === ""){
      return false;
    }
    if(this.state.phone_number === null || this.state.phone_number === undefined || this.state.phone_number === ""){
      return false;
    }
    return this.isStudentIDValid(this.state.student_id) && this.isPhoneNumber(this.state.phone_number);
  } 

  isStudentIDValid(str){
    const regexStudentID = /^[0-9]{7}$/im;
    return str.match(regexStudentID);
  }

  isPhoneNumber(str) {
    const regexPhoneNumber = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
    return str.match(regexPhoneNumber);
  }

  submitEntry(){
    if(!this.isEntryValid()){
      return;
    }

    const giveawayReq = {
      student_id: this.state.student_id,
      phone_number: this.state.phone_number,
    };

    const postOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(giveawayReq),
    };

    fetch("https://api.cusmartevents.com/api/giveaway/" + this.state.giveaway_id + "/entries", postOptions)
    .then((res) => res.json())
    .then(
      (res) => {
        if (res.status !== "success") {
          alert("Error with giveaway entry");
        } 
        this.setState({ open: false })
      },
      (err) => {
        alert("Error with giveaway entry");
        console.error(err)
      }
    );
  }

  render() {
    return (
      <Transition visible={this.state.open} animation='scale' duration={200}>
        <Modal
          onClose={() => this.setState({ open: false })}
          onOpen={() => this.setState({ open: true })}
          size='mini'
          open={this.state.open}
        >
          <Modal.Header>Giveaway</Modal.Header>
          <Modal.Content>
            <Modal.Description>
              <Header>{this.state.event_name}</Header>
              <div style={{display: 'flex', flexDirection: 'column'}}>
                <p style={{ whiteSpace: 'pre-line', marginLeft: 10}}>{this.state.message}</p>
                <div style={{display: 'flex'}}>
                    <Icon name="clock" />
                    {
                      //displayDateRange(this.state.start_time, this.state.end_time)
                      `${this.state.start_time} - ${this.state.end_time}`
                    }
                </div>
              </div>
              <Divider />
              <div style={{display: 'flex', flexDirection: 'column', marginTop: 10}}>
                  <Form>
                    <Form.Field 
                      label='Student ID' 
                      control='input' 
                      type='number' 
                      name='student-id'
                      value={this.state.student_id}
                      onChange={(e) => 
                        {
                          let newValue = e.target.value;
                          let numberCheck = new RegExp("^[0-9]*$");
                          if(!numberCheck.test(newValue)){
                            return;
                          }
                          this.setState({ student_id: e.target.value })
                        }
                      }
                      error={!this.isStudentIDValid(this.state.student_id) ? "Invalid Student ID" : false}
                    />
                    <Form.Field 
                      label='Phone Number' 
                      control='input' 
                      type='tel' 
                      icon='phone'
                      name='phone'
                      value={this.state.phone_number}
                      onChange={(e) => 
                        {
                          let newValue = e.target.value;
                          let numberCheck = new RegExp("^[0-9-() ]*$");
                          if(!numberCheck.test(newValue)){
                            return;
                          }
                          this.setState({ phone_number: e.target.value })
                        }
                      }
                      error={!this.isPhoneNumber(this.state.phone_number) ? "Invalid Phone Number" : false}
                    />
                  </Form>
                </div>
            </Modal.Description>
          </Modal.Content>
          <Modal.Actions>
            <Button
              content="Enter"
              labelPosition="right"
              icon="checkmark"
              onClick={() => this.submitEntry()}
              color="green"
              disabled={!this.isEntryValid()}
            />
            <Button
              content="Cancel"
              labelPosition="right"
              icon="close"
              onClick={() => this.setState({ open: false })}
              color="red"
            />
          </Modal.Actions>
        </Modal>
      </Transition>
    );
  }
}

export default GiveawayModal;

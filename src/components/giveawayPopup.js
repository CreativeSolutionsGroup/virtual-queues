import React from "react";
import {createRef} from "react";

import { Message, Transition, Button } from "semantic-ui-react";
import GiveawayModal from "./modals/giveawalModal";

export default class GiveawayPopup extends React.Component {
  giveawayModal = createRef();
  
  constructor(props) {
    super(props);

    this.state = {
      open: props.open,
      giveaway_id: "",
      event_name: "",
      giveaway_message: "",
      start_time: "",
      end_time: "",
      student_id: ""
    };
  }

  componentDidMount() {
    // get the student ID
    if(window.localStorage.getItem("StudentID")){
      let id = window.localStorage.getItem("StudentID");
      this.setState({student_id: id})
      //this.handleProfileRefresh();
    }
    this.checkForGiveaway();
    setInterval(this.checkForGiveaway(),  5 * 60 * 1000); //Check for giveaway every 5 mins
  }

  checkForGiveaway = () => {
    if(this.state.open){
      return;
    }
    console.log("Checking for giveaway...");
    //Get List of giveaways

    let now = new Date();

    /*fetch(this.apiBaseURL + "/giveaway")
    .then((res) => res.json())
    .then(
      (res) => {
        if (res.status !== "success") {
          console.error("Failed to retrieve attractions");
          console.error("Error:", res.message);
          return;
        }
        
        let sortedGiveaways = res.data.sort((a, b) => 
        (new Date(a.end_time).getTime() - new Date(b.end_time).getTime())
        );
        
        sortedGiveaways.forEach((giveaway) => {
          if(new Date(giveaway.start_time).getTime() <= now.getTime() && new Date(giveaway.end_time).getTime() >= now.getTime()){
            //Found a giveaway
            let name = getEventName(giveaway.event_id);
            this.setState({
              open: true,
              giveaway_id: giveaway.id,
              event_name: name,
              giveaway_message: giveaway.message,
              start_time: giveaway.start_time,
              end_time: giveaway.end_time
            });
          }
        })
      });*/
      this.setState({
        open: true,
        giveaway_id: "2",//giveaway.id,
        event_name: "Test Giveaway",
        giveaway_message: "This is a giveaway!",
        start_time: "8:00 PM",
        end_time: "10:00 PM"
      });
    }
    
  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleDismiss = (e) => {
    // Don't allow parent card to receive the onClick
    e.stopPropagation();

    this.setState({ open: false });
  };

  render() {
    return (
      <div>
      <Transition visible={this.state.open} animation='fade up' duration={800}>
        <div
          style={{
            position: 'fixed',
            width: '100%',
            top: '90%',
            left: 10,
            zIndex: 2000,
          }}
        >
          <Message
            compact
            floating
            onDismiss={this.handleDismiss}
            positive
            header={this.state.header}
            content={
              <Button 
                color="green"
                onClick={() => {
                  this.giveawayModal.current.setState({ 
                    open: true, 
                    giveaway_id: this.state.giveaway_id,
                    event_name: this.state.event_name,
                    message: this.state.giveaway_message,
                    start_time: this.state.start_time,
                    end_time: this.state.end_time,
                    student_id: this.state.student_id, 
                    phone_number: ""
                  });
                }}
              >
                Enter Giveaway
              </Button>
            }
            hidden={!this.state.open}
          />
        </div>
      </Transition>
      <GiveawayModal ref={this.giveawayModal} open={false} />
      </div>
    );
  }
}

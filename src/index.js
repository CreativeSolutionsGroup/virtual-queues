import React, { createRef } from "react";
import ReactDOM from "react-dom";

import { Sticky } from "semantic-ui-react";

import TitleBar from "./components/titlebar";
import Events from "./components/events";
import StudentModal from "./components/modals/studentProfile";
import HelpModal from "./components/modals/help";
import AttractionModal from "./components/modals/attraction";
import Toast from "./components/toast";

import "./index.css";
import "semantic-ui-css/semantic.min.css";

class App extends React.Component {
  contextRef = createRef();
  profileRef = createRef();
  helpModalRef = createRef();
  attractionModalRef = createRef();
  toastRef = createRef();

  state = {
    error: null,
    loadedAttractions: false,
    loadedSlots: false,
    student: {
      id: undefined,
      tickets: [],
    },
    attractions: {},
    slots: {},
  };
  apiBaseURL = "https://api.cusmartevents.com/api";

  constructor(props) {
    super(props);

    // Modals
    this.showStudentModal = this.showStudentModal.bind(this);
    this.showHelpModal = this.showHelpModal.bind(this);
    this.showHelpModal = this.showHelpModal.bind(this);
    this.handleAttractionClick = this.handleAttractionClick.bind(this);

    // General data retrieval
    this.getAttractionSlots = this.getAttractionSlots.bind(this);
    this.getAllAttractions = this.getAllAttractions.bind(this);

    // Handlers for student profile
    this.handleModalIdSubmit = this.handleModalIdSubmit.bind(this);
    this.handleProfileRefresh = this.handleProfileRefresh.bind(this);
    this.handleTicketRemove = this.handleTicketRemove.bind(this);

    // Handlers related to attractions
    this.handleTicketReserve = this.handleTicketReserve.bind(this);
    this.isStudentSignedIn = this.isStudentSignedIn.bind(this);
  }

  isStudentSignedIn() {
    return this.state.student.id !== undefined;
  }

  showHelpModal() {
    this.helpModalRef.current.setState({ open: true });
  }

  /**
   * Opens the student account modal
   */
  showStudentModal() {
    if (this.state.student.id !== undefined) {
      // Only retrieve new tickets if the user ID is set
      this.handleProfileRefresh();
    }

    // Retrieve tickes and then update the modal with the current app state
    this.profileRef.current.setState({ open: true });
  }

  /**
   * Retrieve tickets based on user ID
   *
   * @returns Promise from API retrieval
   */
  getStudentTickets() {
    return fetch(`${this.apiBaseURL}/tickets/`)
      .then((res) => res.json())
      .then(
        (res) => {
          console.log("Received tickets:", res);

          // Filter tickets specific to this student
          const userTickets = res.data.filter(
            (val) => val.student_id.toString() === this.state.student.id
          );

          // Update state
          this.setState((prevState) => ({
            student: { ...prevState.student, tickets: userTickets },
          }));
        },
        (err) => console.error(err)
      );
  }

  getAttractionSlots() {
    fetch(this.apiBaseURL + "/slots")
      .then((res) => res.json())
      .then(
        (res) => {
          if (res.status !== "success") {
            console.error("Failed to retrieve slots");
            console.error("Error:", res.message);
            return;
          }

          // Reduce array to object with attraction ID as key and all slots
          // for each attraction
          let initVal = {};
          let slots = res.data.reduce(
            (acc, val) => ({
              ...acc,
              [val.attraction_id]: [...(acc[val.attraction_id] || []), val],
            }),
            initVal
          );
          console.debug("Slots:", slots);

          // Update with retrieved slots
          this.setState({
            loadedSlots: true,
            error: "",
            slots: slots,
          });
        },
        (err) => {
          console.error("Failed to retrieve slots");
          console.error(err);
          this.setState({ loadedSlots: true, err: "Failed to load slots" });
        }
      );
  }

  getAllAttractions() {
    // Get current attractions
    fetch(this.apiBaseURL + "/attractions")
      .then((res) => res.json())
      .then(
        (res) => {
          if (res.status !== "success") {
            console.error("Failed to retrieve attractions");
            console.error("Error:", res.message);
            return;
          }

          // Indicate attractions have been loaded
          console.debug("Attractions:", res.data);
          let attractions = res.data.reduce((acc, val) => {
            acc[val._id] = val;
            return acc;
          }, {});
          this.setState({
            loadedAttractions: true,
            attractions: attractions,
          });
        },
        (err) => {
          console.error("Failed to retrieve attractions");
          console.error(err);
          this.setState({
            loadedAttractions: true,
            attractions: {},
            error: "Failed to load attractions",
          });
        }
      );
  }

  /**
   * Updates app's student ID
   *
   * @param {string} id New student ID string
   */
  handleModalIdSubmit(id) {
    // Update local state with new student ID, retrieving new tickets after
    this.setState(
      (prevState) => ({
        student: { ...prevState.student, id: id },
      }),
      this.handleProfileRefresh
    );
  }

  handleProfileRefresh() {
    if (this.state.student.id === undefined) {
      return;
    }

    // Update modal's state with current attractions, tickets, and student ID
    this.getStudentTickets().then(() => {
      this.profileRef.current.setState((prevState) => ({
        ...prevState,
        slots: this.state.slots,
        attractions: this.state.attractions,
        tickets: this.state.student.tickets,
        studentId: this.state.student.id,
      }));
    });
  }

  handleTicketRemove(id) {
    console.log("Removing ticket w/ ID", id);
    fetch(`${this.apiBaseURL}/tickets/${id}`, { method: "DELETE" })
      .then((res) => res.json())
      .then(
        (res) => {
          if (res.status !== "success") {
            console.error("Failed to remove ticket w/ ID", id);
            console.error("Error:", res.message);
            return;
          }

          // Filter out removed ticket
          const newTickets = [
            ...this.state.student.tickets.filter((tic) => tic._id !== id),
          ];
          this.setState(
            (prevState) => ({
              student: { ...prevState.student, tickets: newTickets },
            }),
            this.handleProfileRefresh
          );

          console.log("Removed ticket", res.data);
        },
        (err) => {
          console.error("Failed to remove ticket w/ ID", id);
          console.error(err);
        }
      );
  }

  handleAttractionClick(id) {
    const attraction = this.state.attractions[id];
    const now = Date.now();
    const start = new Date(Date.parse(attraction.start_time));
    const end = new Date(Date.parse(attraction.end_time));
    const isActive = now >= start && end >= now;

    this.attractionModalRef.current.setState({
      name: attraction.name,
      description: attraction.description,
      img: attraction.image_url,
      isActive: isActive,
      startTime: attraction.start_time,
      endTime: attraction.end_time,
      slots: this.state.slots[id] || [],
      open: true,
    });
  }

  handleTicketReserve(slotId) {
    const ticketReq = {
      student_id: this.state.student.id,
      slot_id: slotId,
    };

    const postOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ticketReq),
    };

    fetch("https://api.cusmartevents.com/api/tickets/", postOptions)
      .then((res) => res.json())
      .then(
        (res) => {
          console.log("Request Result:", res);
          if (res.status !== "success") {
            // TODO: Make this user-friendly (likely need to log in)
            this.toastRef.current.setState({
              success: false,
              message: res.message._message,
              header: "Error",
            });
          } else {
            this.toastRef.current.setState({
              success: true,
              message: `Successfully retrieved ticket with ID ${res.data._id}!`,
              header: "Success!",
            });
          }

          this.toastRef.current.handleOpen();
        },
        (err) => console.error(err)
      );
  }

  render() {
    const { error, loadedAttractions, loadedSlots } = this.state;

    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!loadedAttractions) {
      this.getAllAttractions();
    } else if (loadedAttractions && !loadedSlots) {
      // Get slots available for attractions based on attraction ID
      this.getAttractionSlots();
    }

    return (
      <div ref={this.contextRef}>
        <StudentModal
          header="Student Profile"
          ref={this.profileRef}
          onIdSubmit={this.handleModalIdSubmit}
          onRefresh={this.handleProfileRefresh}
          onTicketRemove={this.handleTicketRemove}
        />
        <HelpModal ref={this.helpModalRef} />
        <AttractionModal
          ref={this.attractionModalRef}
          open={this.state.showModal} //Tries to update open within CardModal
          name={this.name}
          description={this.description}
          isActive={this.active}
          available={this.available}
          maxAvailable={this.maxAvailable}
          image={this.img}
          onReserve={this.handleTicketReserve}
          isStudentSignedIn={this.isStudentSignedIn}
        />
        {/* TODO: Resolve bounce when scrolling */}
        <Sticky context={this.contextRef}>
          <TitleBar
            onHelpClick={this.showHelpModal}
            onProfileClick={this.showStudentModal}
          />
        </Sticky>
        <Events
          onAttractionClick={this.handleAttractionClick}
          {...this.state}
        />
        {/*
          TODO: Convert this to a Portal to allow the toast to actually hover
        */}
        <Toast ref={this.toastRef} open={false} />
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<App />, document.getElementById("root"));

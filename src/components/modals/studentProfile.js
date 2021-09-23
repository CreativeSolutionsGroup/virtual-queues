import React, { createRef } from "react";
import { Header, Modal, Table, Button, Segment, Icon, Transition } from "semantic-ui-react";
import QRCode from "react-qr-code";

import StudentIdInput from "./studentIdInput";
import { displayDate } from "../../utils/strings";

class StudentModal extends React.Component {
  idRef = createRef();

  constructor(props) {
    super(props);

    // Event handlers
    this.handleIdSubmit = props.onIdSubmit;
    this.handleRefresh = props.onRefresh;
    this.handleTicketRemove = props.onTicketRemove;

    // Props and state
    this.header = props.header;
    this.state = {
      slots: {},
      attractions: {},
      tickets: props.tickets === undefined ? [] : props.tickets,
      open: props.open === undefined ? false : props.open,
      studentId: props.studentId === undefined ? "000000" : props.studentId,
      successfulIdChange: false
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
  }

  handleRemove(id) {
    this.handleTicketRemove(id);
  }

  handleSubmit() {
    const newId = this.idRef.current.getId();
    if (this.state.studentId === newId) {
      // No changes were made, do nothing
      this.setState({successfulIdChange: false});
      return;
    }

    // The ID changed, update state and retrieved tickets
    this.handleIdSubmit(newId);
    this.setState({successfulIdChange: true});

    setTimeout(() => {this.setState({successfulIdChange: false}); }, 3000);
  }

  render() {
    const now = Date.now();
    //Sort Tickets
    let ticketSlots = {}
    let slotNames = {}

    this.state.tickets.forEach((ticket) => {
      for (const attractionId in this.state.slots) {
        const slots = this.state.slots[attractionId];
        let ticketSlot = slots.find((slot) => slot._id === ticket.slot_id);
        if(ticketSlot !== undefined){
          ticketSlots[ticket._id] = ticketSlot;
          if(this.state.attractions[ticketSlot.attraction_id] !== undefined){
            slotNames[ticket._id] = this.state.attractions[ticketSlot.attraction_id]
              .name;
          }
        }
      }
    })

    let sortedTickets = this.state.tickets.sort((a, b) => {
      let timeA = ticketSlots[a._id] === undefined ? undefined : new Date(ticketSlots[a._id].hide_time).getTime();
      let timeB = ticketSlots[b._id] === undefined ? undefined : new Date(ticketSlots[b._id].hide_time).getTime();
      return timeA - timeB;
    })
    return (
      <Transition visible={this.state.open} animation='scale' duration={200}>
        <Modal
          closeIcon
          size="large"
          onClose={() => this.setState({ open: false })}
          onOpen={() => this.setState({ open: true })}
          open={this.state.open}
        >
          <Modal.Header>
            <Icon name="user outline" />
            {this.header}
          </Modal.Header>
          <Modal.Content>
            <Header>Student ID</Header>
            <div style={{display: 'flex'}}>
            <StudentIdInput
              onSubmit={this.handleSubmit}
              studentId={this.state.studentId}
              ref={this.idRef}
              onChange={()=> this.setState({successfulIdChange: false})}
            />
            {this.state.successfulIdChange ? <div style={{color: 'green', marginLeft: 5, marginTop: 'auto', marginBottom: 'auto'}}>ID updated</div> : ""}
            </div>
            <Segment clearing>
              <Header floated="left">Tickets Available</Header>
              <Header floated="right">
                <Button onClick={this.handleRefresh}>
                  <Icon fitted name="refresh" />
                </Button>
              </Header>
              <Table celled padded>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>Event</Table.HeaderCell>
                    <Table.HeaderCell>Ticket</Table.HeaderCell>
                    <Table.HeaderCell />
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {sortedTickets.map((val) => {
                    // NOTE: This loop's performance likely could be improved with
                    //       some form of caching so we're not looking up names
                    //       every time.
                    // val.slot_id gives a slot ID which is used to search
                    // available slots to get the event name
                    let slotName = "UNKNOWN ATTRACTION";
                    let ticketSlot = ticketSlots[val._id];
                    
                    if(slotNames[val._id] !== undefined){
                      slotName = slotNames[val._id];
                    }

                    if(ticketSlot === undefined || ticketSlot === null){
                      return "";
                    }

                    // TODO: Just return null if it's not a valid reservation
                    //       anymore
                    // Disable if the hide time is in the past
                    const hideTime = new Date(Date.parse(ticketSlot.hide_time));

                    return (
                      <Table.Row key={val._id}>
                        <Table.Cell disabled={hideTime <= now} collapsing>
                          <div style={{display: 'flex', flexDirection: 'column'}}>
                            <div style={{marginLeft: 'auto', marginRight: 'auto', marginBottom: 5, marginTop: 5}} >
                              <h3>{
                                slotName
                              }</h3>
                            </div>
                            <div style={{marginLeft: 'auto', marginRight: 'auto', marginBottom: 5, marginTop: 5}} >
                              <h3>{
                                displayDate(hideTime)
                              }</h3>
                            </div>
                          </div>
                        </Table.Cell>
                        <Table.Cell disabled={hideTime <= now} style={{display: 'flex'}}>
                          <div style={{display: 'flex', flexDirection: 'column', marginLeft: 'auto', marginRight: 'auto'}} >
                            <div style={{marginLeft: 'auto', marginRight: 'auto'}} >
                              {val.scanned ? "Ticket Scanned" : <QRCode value={val._id} />}
                            </div>
                          </div>
                        </Table.Cell>
                        <Table.Cell collapsing>
                          <Button
                            icon="delete"
                            onClick={() => this.handleRemove(val._id)}
                          />
                        </Table.Cell>
                      </Table.Row>
                    );
                  })}
                </Table.Body>
              </Table>
            </Segment>
          </Modal.Content>
        </Modal>
      </Transition>
    );
  }
}

export default StudentModal;

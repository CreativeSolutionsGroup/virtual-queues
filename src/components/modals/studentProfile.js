import React, { createRef } from "react";
import { Header, Modal, Table, Button, Segment, Icon } from "semantic-ui-react";

import StudentIdInput from "./studentIdInput";

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
      return;
    }

    // The ID changed, update state and retrieved tickets
    this.handleIdSubmit(newId);
  }

  render() {
    const now = Date.now();

    return (
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
          <StudentIdInput
            onSubmit={this.handleSubmit}
            studentId={this.state.studentId}
            ref={this.idRef}
          />
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
                  <Table.HeaderCell>Ticket ID</Table.HeaderCell>
                  <Table.HeaderCell />
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {this.state.tickets.map((val) => {
                  // NOTE: This loop's performance likely could be improved with
                  //       some form of caching so we're not looking up names
                  //       every time.
                  // val.slot_id gives a slot ID which is used to search
                  // available slots to get the event name
                  let slotName = "UNKNOWN ATTRACTION";
                  let ticketSlot = null;
                  for (const attractionId in this.state.slots) {
                    const slots = this.state.slots[attractionId];

                    // Attempt to find based on slot ID
                    ticketSlot = slots.find((slot) => slot._id === val.slot_id);
                    if (ticketSlot === undefined) {
                      continue;
                    }

                    // Retrieved slot name, break out of loop now
                    if(this.state.attractions[ticketSlot.attraction_id] !== undefined){
                      slotName = this.state.attractions[ticketSlot.attraction_id]
                        .name;
                    }
                    break;
                  }

                  if(ticketSlot === undefined){
                    return "";
                  }

                  // TODO: Just return null if it's not a valid reservation
                  //       anymore
                  // Disable if the hide time is in the past
                  const hideTime = new Date(Date.parse(ticketSlot.hide_time));

                  return (
                    <Table.Row disabled={hideTime <= now} key={val._id}>
                      <Table.Cell>{slotName}</Table.Cell>
                      <Table.Cell>{val._id}</Table.Cell>
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
    );
  }
}

export default StudentModal;

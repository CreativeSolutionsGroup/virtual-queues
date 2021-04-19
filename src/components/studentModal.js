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
    return (
      <Modal
        closeIcon
        size="small"
        onClose={() => this.setState({ open: false })}
        onOpen={() => this.setState({ open: true })}
        open={this.state.open}
      >
        <Modal.Header>{this.header}</Modal.Header>
        <Modal.Content>
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
                  // val.slot_id gives a slot ID which is used to search available slots to get the event name
                  // TODO: Rework slots to avoid having to search for attraction every time
                  var slotName = "UNKNOWN ATTRACTION";
                  for (const attractionId in this.state.slots) {
                    const slots = this.state.slots[attractionId];

                    // Attempt to find based on slot ID
                    const ticketSlot = slots.find(
                      (slot) => slot._id === val.slot_id
                    );
                    if (ticketSlot === undefined) {
                      continue;
                    }

                    slotName = this.state.attractions[ticketSlot.attraction_id]
                      .name;
                  }

                  return (
                    <Table.Row key={val._id}>
                      <Table.Cell>{slotName}</Table.Cell>
                      <Table.Cell>{val._id}</Table.Cell>
                      <Table.Cell collapsing>
                        <Button icon="delete" />
                      </Table.Cell>
                    </Table.Row>
                  );
                })}
              </Table.Body>
            </Table>
          </Segment>
          <Header>Student ID</Header>
          <StudentIdInput
            onSubmit={this.handleSubmit}
            studentId={this.state.studentId}
            ref={this.idRef}
          />
        </Modal.Content>
      </Modal>
    );
  }
}

export default StudentModal;

import React from "react";
import { Card, Icon, Image } from "semantic-ui-react";
import { displayDate, displayDateRange } from "../utils/strings";
import AsyncImage from "./async_image";

export default class Attraction extends React.Component {
  constructor(props) {
    super(props);

    this.id = props.id;
    this.name = props.name;
    this.about = props.about;
    this.description = props.description;
    this.active = props.isActive;
    this.img = props.imageURL;
    this.startTime = props.startTime;
    this.endTime = props.endTime;
    this.location = props.location;

    let slots = [];
    if (props.slots !== undefined) {
      slots = props.slots.map((slot) => {
        slot.taken = 0;
        return slot;
      });
    }
    this.state = {
      slots: slots,
    };

    this.getTicketsAvailable = this.getTicketsAvailable.bind(this);
  }

  componentDidMount() {
    this.getTicketsAvailable();
  }

  getTicketsAvailable() {
    this.state.slots.forEach(({ _id }, idx) => {
      fetch(`https://api.cusmartevents.com/api/slots/${_id}/tickets/`)
        .then((res) => res.json())
        .then(
          (res) => {
            if (res.status !== "success") {
              console.log("Failed to retrieve available tickets");
              console.log(res.message);
            }

            console.debug("Taken:", this.state.slotsTaken);
            console.debug("Slot ID:", this.id);
            console.debug("Retrieved:", res.data);

            // Get copy of slots array
            const newSlots = this.state.slots.slice();
            newSlots[idx].taken = res.data.length;

            this.setState({ slots: newSlots });
          },
          (err) => {
            console.error("Failed to retrieve available tickets");
            console.error(err);
          }
        );
    });
  }

  render() {
    const now = Date.now();

    let [maxCapacity, takenSlots, numSlots] = this.state.slots.reduce(
      (acc, slot) => {
        const hideTime = new Date(Date.parse(slot.hide_time));
        return hideTime <= now
          ? [acc[0], acc[1], acc[2]]
          : [acc[0] + slot.ticket_capacity, acc[1] + slot.taken, acc[2] + 1];
      },
      [0, 0, 0]
    );

    let hasSlots = this.state.slots.length > 0;
    return (
      <Card fluid onClick={() => this.props.onClick(this.id)}>
        <AsyncImage src={this.img} wrapped disabled={!this.active} alt={this.name} size='large'/>
        <Card.Content>
          <Card.Header>
            <div style={{ display: 'flex' }}>
              {this.name}
              {hasSlots ? <Icon name="ticket" size='large' style={{ marginLeft: 'auto', marginRight: 5, marginTop: 'auto', marginBottom: 'auto' }} /> : ""}
            </div>
          </Card.Header>
          <Card.Description><p style={{ whiteSpace: 'pre-line'}}>{this.description}</p></Card.Description>
        </Card.Content>
        <Card.Content extra style={{color: 'black'}}>
          {hasSlots ? <div>
            <Icon name="ticket" />
            {maxCapacity - takenSlots}/{maxCapacity} available in {numSlots}{" "}
            slots
          </div> : ""}
          <div>
            <Icon name="clock" />
            {/*Events without slots should display length of event and events with slots just need to show when it ends*/}
            {hasSlots ? "End Time: "+displayDate(this.endTime) : displayDateRange(this.startTime, this.endTime)}
          </div>
          {(this.location !== "" && this.location !== undefined && this.location !== "N/A") ?
            <div>
              <Icon name="map marker alternate" />
              {this.location}
            </div>
           : ""}
        </Card.Content>
      </Card>
    );
  }
}

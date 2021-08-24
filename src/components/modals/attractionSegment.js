import { Card, Segment, Icon, Button, Popup } from "semantic-ui-react";


const AttractionsSegment = (props) => {
  
  return (
    <Segment>
      <Card.Group>
        {props.slots.map((slot) => {
          const now = Date.now();
          const hideTime = new Date(Date.parse(slot.hide_time));

          if (hideTime <= now) {
            return null;
          }

          const hasTicket = props.hasTicket(props.studentTickets, slot._id);

          const hoverMsg = props.disabled
            ? "Please sign in with your student ID first!"
            : hasTicket ? "Ticket already reserved" : "Reserve a new ticket";

          const takenCount = props.slotTicketsTaken !== undefined ? (props.slotTicketsTaken[slot._id] !== undefined ? props.slotTicketsTaken[slot._id] : 0) : 0;
          return (
            <Card key={slot._id}>
              <Card.Content>
                <Card.Header>
                  <Icon name="clock outline" />
                  {hideTime.toLocaleString("en-US")}
                </Card.Header>
                <div>
                  <Icon name="ticket" />
                  {slot.ticket_capacity - takenCount}/{slot.ticket_capacity}{" "}
                  tickets available!
                </div>
              </Card.Content> 
              <Card.Content extra>
                <Popup
                      trigger={
                        <div>
                          <Button
                            disabled={props.disabled || hasTicket}
                            content="Reserve a ticket"
                            labelPosition="right"
                            icon="ticket"
                            onClick={() => props.onReserve(slot._id)}
                            positive
                          />
                        </div>
                      }
                      content={hoverMsg} />
              </Card.Content>
            </Card>
          );
        })}
      </Card.Group>
    </Segment>
  );
};

export default AttractionsSegment;

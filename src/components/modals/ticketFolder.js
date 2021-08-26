import React from "react";
import { Button, Card, Header, Image, Modal } from "semantic-ui-react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import QRCode from "react-qr-code";

class TicketFolderModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      tickets: props.tickets === undefined ? [] : props.tickets,
      slots: props.slots === undefined ? {} : props.slots,
      attractions: props.attractions === undefined ? {} : props.attractions
    };
  }

  responsive = {
      desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: 1
      },
      tablet: {
        breakpoint: { max: 1024, min: 464 },
        items: 1
      },
      mobile: {
        breakpoint: { max: 464, min: 0 },
        items: 1
      }
  };

  render() {
    return (
      <Modal
            basic
            closeIcon
            onClose={() => this.setState({ open: false })}
            onOpen={() => this.setState({ open: true })}
            open={this.state.open}
        >
            <div>
            <Carousel
                    responsive={this.responsive}
                    showDots={true}
                    removeArrowOnDeviceType={["tablet", "mobile"]}
                >
                {
                    this.state.tickets.map((ticket) => {
                        let slotName = "UNKNOWN ATTRACTION";
                        let ticketSlot = null;
                        
                        for (const attractionId in this.state.slots) {
                            const slots = this.state.slots[attractionId];
                            ticketSlot = slots.find((slot) => slot._id === ticket.slot_id);
                            if (ticketSlot === undefined) {
                                continue;
                            }

                            if(this.state.attractions[ticketSlot.attraction_id] !== undefined){
                                slotName = this.state.attractions[ticketSlot.attraction_id]
                                    .name;
                            }
                        }
                        
                        
                        let hideTime = "UNKNOWN TIME";
                        if(ticketSlot !=null){
                            hideTime = new Date(Date.parse(ticketSlot.hide_time)).toLocaleString("en-US");
                        }

                        return (
                            <div style={{display: 'flex', marginBottom: 20, marginTop: 20, color: 'black'}}>
                                <Card style={{marginLeft: 'auto', marginRight: 'auto'}}>
                                    <div>
                                        <div style={{display: 'flex'}} >
                                            <div style={{marginLeft: 'auto', marginRight: 'auto', marginTop: 10, marginBottom: 5}}>
                                                {ticket.scanned ? "Ticket Scanned" : <QRCode value={ticket._id} />}
                                            </div>
                                        </div>
                                        {<Card.Content>
                                            <Card.Header>
                                                <div style={{display: 'flex', flexDirection: 'column'}}>
                                                    <div style={{marginLeft: 'auto', marginRight: 'auto', marginBottom: 5, marginTop: 5}} >
                                                        <h3>{slotName}</h3>
                                                    </div>
                                                    <div style={{marginLeft: 'auto', marginRight: 'auto', marginBottom: 5, marginTop: 5}} >
                                                        <h3>{hideTime}</h3>
                                                    </div>
                                                </div>
                                            </Card.Header>
                                        </Card.Content>}
                                    </div>
                                </Card>
                            </div>
                        );
                    })
                }
                </Carousel >
                </div>
        </Modal>
    );
  }
}

export default TicketFolderModal;

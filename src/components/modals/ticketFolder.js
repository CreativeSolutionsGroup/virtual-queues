import React from "react";
import { Card, Modal, Transition } from "semantic-ui-react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import QRCode from "react-qr-code";
import { displayDate } from "../../utils/strings";

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

    componentDidMount(){
        
    }

    render() {
        //Sort Tickets
        //Sort Tickets
        let ticketSlots = {}
        let slotNames = {}

        this.state.tickets.forEach((ticket) => {
            for (const attractionId in this.state.slots) {
                const slots = this.state.slots[attractionId];
                let ticketSlot = slots.find((slot) => slot._id === ticket.slot_id);
                if(ticketSlot != undefined){
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
            <Transition visible={this.state.open} animation='fade up' duration={1000}>
                <Modal
                    basic
                    closeIcon
                    onClose={() => this.setState({ open: false })}
                    onOpen={() => this.setState({ open: true })}
                    open={this.state.open}
                >
                    <div>
                        {
                            sortedTickets.length === 0
                                ?
                                <div style={{ display: 'flex', color: 'black' }}>
                                    <Card style={{ margin: 'auto' }}>
                                        <Card.Content style={{ marginLeft: 'auto', marginRight: 'auto' }}>
                                            You have no scannable tickets available
                                        </Card.Content>
                                    </Card>
                                </div>
                                :
                                <Carousel
                                    responsive={this.responsive}
                                    showDots={true}
                                    removeArrowOnDeviceType={["tablet", "mobile"]}
                                >
                                    {
                                        sortedTickets.map((ticket) => {
                                            let slotName = "UNKNOWN ATTRACTION";
                                            let ticketSlot = ticketSlots[ticket._id];
                                            
                                            if(slotNames[ticket._id] !== undefined){
                                                slotName = slotNames[ticket._id];
                                            }

                                            if(ticketSlot === undefined || ticketSlot === null){
                                                return "";
                                            }

                                            let hideTime = "UNKNOWN TIME";
                                            if (ticketSlot != null) {
                                                hideTime = displayDate(new Date(Date.parse(ticketSlot.hide_time)));
                                            }

                                            return (
                                                <div style={{ display: 'flex', marginBottom: 20, marginTop: 20, color: 'black' }}>
                                                    <Card style={{ marginLeft: 'auto', marginRight: 'auto' }}>
                                                        <div>
                                                            <div style={{ display: 'flex' }} >
                                                                <div style={{ marginLeft: 'auto', marginRight: 'auto', marginTop: 10, marginBottom: 5 }}>
                                                                    {ticket.scanned ? "Ticket Scanned" : <QRCode value={ticket._id} />}
                                                                </div>
                                                            </div>
                                                            {<Card.Content>
                                                                <Card.Header>
                                                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                                        <div style={{ marginLeft: 'auto', marginRight: 'auto', marginBottom: 5, marginTop: 5 }} >
                                                                            <h3>{slotName}</h3>
                                                                        </div>
                                                                        <div style={{ marginLeft: 'auto', marginRight: 'auto', marginBottom: 5, marginTop: 5 }} >
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
                        }
                    </div>
                </Modal>
            </Transition>
        );
    }
}

export default TicketFolderModal;

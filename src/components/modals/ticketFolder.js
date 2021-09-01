import React from "react";
import { Card, Modal, Transition } from "semantic-ui-react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import QRCode from "react-qr-code";
import QRTicket from "../qrTicket"

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
                            this.state.tickets.length === 0
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
                                        this.state.tickets.map((ticket) => {
                                            let slotName = "UNKNOWN ATTRACTION";
                                            let ticketSlot = null;
                                            let attractionImage = "";

                                            for (const attractionId in this.state.slots) {
                                                const slots = this.state.slots[attractionId];
                                                ticketSlot = slots.find((slot) => slot._id === ticket.slot_id);
                                                if (ticketSlot === undefined) {
                                                    continue;
                                                }

                                                if (this.state.attractions[ticketSlot.attraction_id] !== undefined) {
                                                    slotName = this.state.attractions[ticketSlot.attraction_id]
                                                        .name;
                                                    attractionImage = this.state.attractions[ticketSlot.attraction_id]
                                                        .image_url;
                                                    console.log(attractionImage);
                                                }
                                            }


                                            let hideTime = "UNKNOWN TIME";
                                            if (ticketSlot != null) {
                                                hideTime = new Date(Date.parse(ticketSlot.hide_time)).toLocaleString("en-US");
                                            }

                                            return (
                                                <div style={{ display: 'flex', marginBottom: 20, marginTop: 20, color: 'black' }}>
                                                    <div style={{marginLeft: 'auto',marginRight: 'auto'}}>
                                                        <QRTicket ticketID={ticket._id} imgURL={attractionImage} startTime={hideTime} name={slotName} description=""></QRTicket>
                                                    </div>
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

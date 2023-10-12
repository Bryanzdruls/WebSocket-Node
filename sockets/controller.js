const TicketControl = require("../models/ticket-control");

const ticketControl = new TicketControl();
const socketController = (socket) => {
    //Cuando un cliente se conecta
    socket.emit('last-ticket', ticketControl.last)
    socket.emit('lastFour-tickets', ticketControl.lastFour);
    socket.emit('tickets-rest', ticketControl.tickets.length);
    
    socket.on('next-ticket', (payload, callback)=>{
        const next =ticketControl.next();
        callback(next);
        //Notificar nuevo ticket pendiente 
        socket.broadcast.emit('send-msg', payload);
        socket.broadcast.emit('tickets-rest', ticketControl.tickets.length);
    })

    socket.on('serve-ticket',({desktop},callback)=>{

        if (!desktop) {
            return callback({
                ok:false,
                msg:'Desktop is a must'
            })
        }
        const ticket = ticketControl.serveTicket(desktop);
        //TODO notificar cambio en los ultimos 4
        socket.broadcast.emit('lastFour-tickets', ticketControl.lastFour);
        socket.broadcast.emit('tickets-rest', ticketControl.tickets.length);
        socket.emit('tickets-rest', ticketControl.tickets.length);

        if (!ticket) {
            callback({
                ok:false,
                msg:'There is not pending tickets'
            })
        }else{
            callback({
                ok:true,
                ticket
            })
        }
    })
}
module.exports = {
    socketController
}
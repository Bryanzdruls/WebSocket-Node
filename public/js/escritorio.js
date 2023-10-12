//Referencias html
const lblDesktop = document.querySelector('h1');
const lblTicket = document.querySelector('small')
const btnServe = document.querySelector('button');
const divAlert = document.querySelector('.alert');
const lblPendientes = document.querySelector('#lblPendientes');

const searchParams =new URLSearchParams(window.location.search);

if (!searchParams.has('escritorio')) {
    window.location = 'index.html';
    throw new Error('Desktop is mandatory');
}
const desktop = searchParams.get('escritorio');
lblDesktop.innerText = desktop;
divAlert.style.display= 'none';


const socket = io();
socket.on('connect', () => {
    // console.log('Conectado');
    btnServe.disabled = false;
    
});

socket.on('disconnect', () => {
    // console.log('Desconectado del servidor');
    btnServe.disabled = true;
});


socket.on( 'tickets-rest', ( count ) => {
    lblPendientes.innerText = count;
});

btnServe.addEventListener( 'click', () => {

    socket.emit('serve-ticket',{desktop}, ({ok,ticket,msg}) =>{
        if (!ok) {
            lblTicket.innerText = `Nobody`;
            return divAlert.style.display = '';
        }
        lblTicket.innerText = `Ticket ${ticket.number}`;
    })
    /*socket.emit( 'next-ticket', null, ( ticket ) => {
        lblNewTicket.innerText =ticket;
    });*/
});
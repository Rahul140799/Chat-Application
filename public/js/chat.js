const socket = io()

// Variables
const $messageForm = document.querySelector('#message-form');
const $messageFormInput = $messageForm.querySelector('input');
const $messageFormButton = $messageForm.querySelector('button');
const $sendLocationButton = document.querySelector('#send-location');
const $messages = document.querySelector('#messages');

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML;
const locationTemplate = document.querySelector('#location-template').innerHTML;

socket.on('message',(message)=>{
    console.log(message);

    const html = Mustache.render(messageTemplate,{
        message : message.text,
        createdAt : moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend',html);
})

socket.on('locationMessage',(message)=>{
    console.log(message);

    const html = Mustache.render(locationTemplate,{
        link : message.url,
        createdAt : moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend',html);
})

$messageForm.addEventListener('submit',(e)=>{
    e.preventDefault();

    $messageFormButton.setAttribute('disabled','disabled');

    const message = e.target.elements.message.value;
    socket.emit('sendMessage',message,(error) => {
        $messageFormButton.removeAttribute('disabled');
        $messageFormInput.value = '';
        $messageFormInput.focus();

        if(error){
            return console.log(error);
        }

        console.log('Message Delivered !!!')
    });
})

$sendLocationButton.addEventListener('click',() =>{
    if(!navigator.geolocation){
        return alert('Not Supported. Sorry!!!');
    }

    $sendLocationButton.setAttribute('diabled','disabled');

    navigator.geolocation.getCurrentPosition((position)=>{
        socket.emit('sendLocation',{
            latitude  : position.coords.latitude,
            longitude : position.coords.longitude 
        },()=>{
            $sendLocationButton.removeAttribute('disabled');    
            console.log("Location Shared !!!")
        });
    })
})

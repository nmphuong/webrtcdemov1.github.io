const socket = io('https://webrtc-demo-v1.herokuapp.com/');

$('#divChat').hide();
socket.on('Danh_sach_online', arrUserInfo => {
    $('#divChat').show();
    $('#divDangKi').hide();

    arrUserInfo.forEach(user => {
        const { ten, peerId} = user;
        $('#ulUser').append(`<li id="${peerId}">${ten}</li>`);
    });

    socket.on('Co_nguoi_dung_moi', user => {
        const { ten, peerId} = user;
            $('#ulUser').append(`<li id="${peerId}">${ten}</li>`);
    });
    socket.on('ngat_ket_noi', peerId => {
        $(`#${peerId}`).remove();
    })
});
socket.on('Dang_ki_that_bai', () => alert('Vui long chon username khac!'));

function openStream(){
    const config = { audio: false, video: true};
    return navigator.mediaDevices.getUserMedia(config);
}

function playStream(idVideoTag, stream){
    const video = document.getElementById(idVideoTag);
    video.srcObject = stream;
    video.play();
}

// openStream().then(stream => playStream('localStream', stream));
const peer = new Peer({key: 'lwjd5qra8257b9'});

peer.on('open', id => {
    $('#my-peer').append(id);
    $('#btnSignUp').click(() => {
        const username = $('#txtUsername').val();
        socket.emit('Nguoi_dung_dang_ki', {ten: username, peerId: id});
    });
});


//Caller
$('#btnCall').click(() => {
    const id = $('#remoteId').val();
    openStream()
    .then(stream => {
        playStream('localStream', stream);
        const call = peer.call(id, stream);
        call.on('stream', remoteStream => playStream('remoteStream', remoteStream));
    });
});

//Remoter
peer.on('call', call =>{
    openStream()
    .then(stream => {
        call.answer(stream);
        playStream('localStream', stream);
        call.on('stream', remoteStream => playStream('remoteStream', remoteStream));
    });
});

$('#ulUser').on('click', 'li', function(){
    const id = $(this).attr('id');
    openStream()
    .then(stream => {
        playStream('localStream', stream);
        const call = peer.call(id, stream);
        call.on('stream', remoteStream => playStream('remoteStream', remoteStream));
    });
});
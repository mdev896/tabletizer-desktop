async function createServer() {
    const result = await window.electronAPI.createServer();
    computer_id.innerHTML = "Computer ID: " + result.id;
    recieved_message.innerHTML = "Recieved mesasge: " + result.msg;
}

window.electronAPI.onSendDataToRenderer((data) => {
    client_status.innerHTML = data;
});

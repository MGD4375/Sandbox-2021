self.addEventListener('message', function (event) {
    var uInt8Array = new Uint32Array(event.data);
    setTimeout(function () {
        postMessage(event.data);
    }, 300)

});
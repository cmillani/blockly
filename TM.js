var myCharacteristic;

function state() {
  var bufferOut;
	var expected = "";
	var end;
	
	this.start = function(buffer, expectation) {
	  end = 0;
	  bufferOut = buffer;
	  expected = expectation;
	  sendNext(4);
	};
	
	var sendNext = function(sz) {
    var buffer = new ArrayBuffer(sz);
    var view = new Uint8Array(buffer);
    for (var i = 0; i < sz; i++) {
      view[i] = bufferOut[end + i];
    }
    end += sz;
    console.log("AWUQIEU");
    console.log(view);
    myCharacteristic.writeValue(buffer)
    .catch(error => {
      console.log('Argh! ' + error);
    });
	};
	
	this.verify = function(received) {
	  if (received == expected) {
	    if (expected == "RD-OK") expected = "k";
	    sendNext(1);
	    return true;
	  }
	  else return false;
	};
}

var TM = new state();

var sendX = function(binary) {
  TM.expected = "RD-OK";
  if (!myCharacteristic) {
    console.log('Argh! ' + 'No connection active!!');
    return;
  }
  var buffer = new ArrayBuffer(binary.length + 4);
  var view = new Uint8Array(buffer);
  view[0] = 82; //Send command in ASCII
  view[1] = 68;
  view[2] = binary.length & 0xFF;
  view[3] = (binary.length >> 8) & 0xFF;
  for (var i in binary) {
    view[i+4] = binary[i];
  }
  console.log(view);
  TM.start(view, "RD-OK");
};

function onStartButtonClick() {
  let serviceUuid = '0x2020';
  if (serviceUuid.startsWith('0x')) {
    serviceUuid = parseInt(serviceUuid, 16);
  }

  let characteristicUuid = '0x2021';
  if (characteristicUuid.startsWith('0x')) {
    characteristicUuid = parseInt(characteristicUuid, 16);
  }

  console.log('Requesting Bluetooth Device...');
  navigator.bluetooth.requestDevice({filters: [{services: [serviceUuid]}]})
  .then(device => device.gatt.connect())
  .then(server => server.getPrimaryService(serviceUuid))
  .then(service => service.getCharacteristic(characteristicUuid))
  .then(characteristic => {
    myCharacteristic = characteristic;
    return myCharacteristic.startNotifications().then(_ => {
      console.log('> Notifications started');
      myCharacteristic.addEventListener('characteristicvaluechanged',
        handleNotifications);
    });
  })
  .catch(error => {
    console.log('Argh! ' + error);
  });
}

function onStopButtonClick() {
  if (myCharacteristic) {
    myCharacteristic.stopNotifications().then(_ => {
      console.log('> Notifications stopped');
      myCharacteristic.removeEventListener('characteristicvaluechanged',
        handleNotifications);
    });
  }
}

function handleNotifications(event) {
  let value = event.target.value;
  let a = [];
  // Convert raw data bytes to hex values just for the sake of showing something.
  // In the "real" world, you'd use data.getUint8, data.getUint16 or even
  // TextDecoder to process raw data bytes.
  for (var i = 0; i < value.byteLength; i++) {
    a.push(String.fromCharCode(value.getUint8(i)));
  }
  var response = a.join('');
  console.log(response);
  TM.verify(response);
}
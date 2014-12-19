module.exports={
    get:function(id, device, callback)
    {
        var command=id;
        var socket=$('net').createConnection({port:8102, allowHalfOpen:true, host:device}, function(){ console.log('connected'); });
        var responseSent=false;
        var commandSent=false;
        var firstRReceived=false;
        socket.on('data', function(data){ 
            if(!commandSent || responseSent)
                console.log(data);
            else
            {
                if(!firstRReceived && data=='R\r\n')
                {
                    firstRReceived=true;
                }
                else
                {
                    responseSent=true; 
                    if(!firstRReceived)
                        data=data.replace(/R/, '');
                    data=data.replace(/[\r\n]+/g, '');
                    console.log(new Buffer(data, 'ASCII'));
                    callback(data);
                    socket.end();
                }
            }
        });
        socket.setEncoding('ASCII');
        socket.on('error', callback);
        socket.write('\r');
        setTimeout(function(){
            socket.write('\r'+command+'\r');
            commandSent=true;
        },100);
     },
     VL:function(id, device, callback)
     {
        var volume=(id*185/100);
        volume='000'.substring(0,volume.toString().length)+volume;
        module.exports.get.command(volume+'VL', device, function(error, data){
            if(error)
            {
                console.log(error);
                callback(500);
            }
            else
                callback(data);
            });
     }
 };
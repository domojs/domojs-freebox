deviceTypes.freebox={
    name:'freebox',
    onChange:function(){
        var device=$('<li class="form-group">')
            .append('<label class="col-sm-2 control-label" for="code">Code télécommande</label>')
            .append('<div class="col-sm-10"><input class="form-control" placeholder="Code" id="code" name="code"></select></div>')
            .appendTo('#commands');
        var device=$('<li class="form-group">')
            .append('<label class="col-sm-2 control-label" for="blaster">Blast through (hd1/hd2/...)</label>')
            .append('<div class="col-sm-10"><input class="form-control" id="freebox_name" name="freebox_name"></input></div>')
            .appendTo('#commands');
        return 'dynamic';
    },
    onAdd:function(){
    }, 
    onSave:function(data){
        data.append('code', $('#code').val());
        data.append('fbxName', $('#freebox_name').val())
    },
    onServerSave:function(device, body){
        var ptType={
            subdevices:[
                {
                    name:"power",
                    type:'switch',
                    category:'actuator',
                    commands:
                    {
                        'on':'http://'+body.fbxName+'.freebox.fr/pub/remote_control?code='+body.code+'&key=power',
                        'off':'http://'+body.fbxName+'.freebox.fr/pub/remote_control?code='+body.code+'&key=power',
                    }
                },
                {
                    name:"mute",
                    type:'switch',
                    category:'actuator',
                    commands:
                    {
                        'on':'http://'+body.fbxName+'.freebox.fr/pub/remote_control?code='+body.code+'&key=mute',
                        'off':'http://'+body.fbxName+'.freebox.fr/pub/remote_control?code='+body.code+'&key=mute',
                    }
                },
                {
                    name:"volume",
                    type:'analogic',
                    category:'actuator',
                    commands:
                    {
                        'up':'http://'+body.fbxName+'.freebox.fr/pub/remote_control?code='+body.code+'&key=vol_inc',
                        'down':'http://'+body.fbxName+'.freebox.fr/pub/remote_control?code='+body.code+'&key=vol_dec',
                    },
                },
                {
                    name:"channels",
                    type:'values',
                    category:'actuator',
                    commands:
                    {
                        
                    },
                },
            ],
            commands:{}
        };
        
        $.map([
            'power','tv','list','0','1','2','3','4','5','6','7','8','9','info', 'mail','help','pip','epg','media','options','vol_inc','vol_dec','prgm_inc','prgm_dec',
            'ok','up','left','right','down','mute','home','rec','bwd','prev','play','fwd','next','red','yellow','green','blue'], function(item){
           var obj={};
           ptType.commands[item]='http://'+body.fbxName+'.freebox.fr/pub/remote_control?code='+body.code+'&key='+item+'&long=false';
           return obj;
        });
        for(var i=1;i<1000;i++)
        {
            if(i<10)
            {
                ptType.subdevices[3].commands[i]='http://'+body.fbxName+'.freebox.fr/pub/remote_control?code='+body.code+'&key='+i+'&long=false';
            }
            else
            {
                ptType.subdevices[3].commands[i]=[];
                for(j=i;Math.floor(j)>0;j=j/10)
                {
                    var long=(j>10).toString().toLowerCase();
                    ptType.subdevices[3].commands[i].unshift('http://'+body.fbxName+'.freebox.fr/pub/remote_control?code='+body.code+'&key='+Math.floor(j%10)+'&long='+long);
                }
            }
        }
        $.extend(device, ptType);
    }
};  
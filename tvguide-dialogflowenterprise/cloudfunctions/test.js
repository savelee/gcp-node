var testObj = {
    "4": [
    {
    "titel": "Cartoons",
    "datum_start": "2017-05-23 15:00:00"
    },
    {
    "titel": "Nieuws",
    "datum_start": "2017-05-23 16:00:00"
    },
    {
    "titel": "Batman",
    "datum_start": "2017-05-23 16:05:00"
    },
    {
    "titel": "RTL Live",
    "datum_start": "2017-05-23 17:00:00"
    },
    {
    "titel": "Nieuws",
    "datum_start": "2017-05-23 18:00:00"
    },
    {
    "titel": "Editie NL",
    "datum_start": "2017-05-23 18:15:00"
    },
    {
    "titel": "Weer",
    "datum_start": "2017-05-23 18:35:00"
    },
    {
    "titel": "Boulevard",
    "datum_start": "2017-05-23 18:35:00"
    },
    {
    "titel": "Nieuws",
    "datum_start": "2017-05-23 19:30:00"
    },
    {
    "titel": "Weer",
    "datum_start": "2017-05-23 19:57:00"
    },
    {
    "titel": "Goede tijden, slechte tijden",
    "datum_start": "2017-05-23 20:00:00"
    },
    {
    "titel": "Thor",
    "datum_start": "2017-05-23 20:30:00"
    },
    {
    "titel": "Hotel SynDroom",
    "datum_start": "2017-05-23 21:35:00"
    },
    {
    "titel": "Late night",
    "datum_start": "2017-05-23 22:30:00"
    },
    {
    "titel": "Nieuws",
    "datum_start": "2017-05-23 23:30:00"
    }
    ],
    "success": true,
    "date": "2018-05-02T14:21:32.939Z"
    };


    const getChannelName = function(channel){
        var channels = new Map();
        channels.set('1', 'Nederland 1');
        channels.set('2', 'Nederland 2');
        channels.set('3', 'Nederland 3');
        channels.set('4', 'RTL 4');
        channels.set('25', 'MTV');
        channels.set('31', 'RTL 5');
        channels.set('37', 'Net 5');
        channels.set('46', 'RTL 7');
        channels.set('92', 'RTL 8');
    
        return channels.get(channel);
    }

var channelInfo = testObj[4];
console.log(getChannelName('3'));



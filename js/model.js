// Viewmodel for Discovering Midtown-Reno app
var locations = ko.observableArray([
        {   title: '40 Mile Saloon',
            location:{lat: 39.509838, lng: -119.805449},
            visible: ko.observable(true)
        },
        {   title: 'The Brewers Cabinet',
            location:{lat: 39.520518, lng: -119.817287},
            visible: ko.observable(true)
        },
        {   title: 'Plumas Park',
            location:{lat: 39.513312, lng: -119.814212},
            visible: ko.observable(true)
        },
        {   title: 'The Melting Pot',
            location:{lat: 39.513929, lng: -119.80733},
            visible: ko.observable(true)
        },
        {   title: 'The Studio',
            location:{lat: 39.513131, lng: -119.807137},
            visible: ko.observable(true)
        }
]);
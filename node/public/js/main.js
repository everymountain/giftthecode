var url = 'http://localhost/api';
document.getElementById("bgVideo").playbackRate = 1.25;

// Youtube api: AIzaSyBWoJsAtQVYq60JIrSvg32GoHonnfKqiE8

var mockdata = [
    {
        id : 'card1',
        url : 'https://www.youtube.com/embed/umnSjBBUn1Y',
        name : 'Darlene',
        bio : 'Lorem ipsum'
    },
    {
        id : 'card2',
        url : 'https://www.youtube.com/embed/IsqDZNtWpeI',
        name : 'Hannah',
        bio : 'Lorem ipsum'
    }
];

// GET https://www.googleapis.com/youtube/v3/search?part=snippet&channelId={YOUR_CHANNEL_ID}&key={YOUR_API_KEY}

angular.module("EveryMountain", [])
.config(function($sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist([
        'self',
        'https://www.youtube.com/**'
    ]);
})
.controller("GroundCtrl", ["$http", function($http) {
    var self = this;

    self.world = "World"
    self.cards = mockdata;

    self.getCardUrl = function(card) {
        return card.url + "?rel=0&autoplay=1&loop=1";
    }

    self.getCardVolume = function(card) {
        return 0;
    }

    self.showModal = function(card) {
        $(".modal").modal('show');
        self.cards.forEach(
            function(card) {
                $("#" + card.id).mute();
            }
        );
    }
    //
    // for (var i = 0; i < self.cards.length; i++) {
    //     //$("#"+self.cards[i].id)[0].mute();
    // }

    $http.put(url + '/myindex/mytype/12345', {abc:1, b:2}).then(function(res) {
        console.dir(res);


        // Example of a search

        $http.post(url + '/search', {
            index : 'myindex',
            body: {
                query: {
                    match: {
                        abc: 123
                    }
                }
            }
        }).then(function(response) {
            response.data.forEach(function(item) {
                console.log("search result", item);
            });
        });


        //
        // Example of fetching one record by id:
        //
        $http.get(url + '/myindex/mytype/12345').then(function(res) {
            console.log("item fetched:", res.data);
        })

    })

}])
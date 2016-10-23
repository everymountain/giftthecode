var url = 'http://localhost/api';
var log = console.log;


var Keys = {
    channelId : 'UCMABz0K2kvC7YF6GwYfDB0w',
    playlistId : 'PLD475BA4B0793FF8B',
    youtubeApiKey : 'AIzaSyBWoJsAtQVYq60JIrSvg32GoHonnfKqiE8'
}

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

    self.cards = [];



    self.getCardUrl = function(card) {
        return card.url + "?rel=0&autoplay=0&loop=1";
    }

    self.getCardVolume = function(card) {
        return 0;
    }

    self.showCallModal = function(card) {
        $("#callModal").modal('show');
        self.cards.forEach(
            function(card) {
                $("#" + card.id).mute();
            }
        );
    };

    self.showBecomeAMemberModal = function() {
        $("#becomeAMemberModal").modal('show');

    };

    (function getCards(pageToken) {

        var url = "https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails%2Csnippet&playlistId=" +
            Keys.playlistId +
            "&key=" +
            Keys.youtubeApiKey;

        if (pageToken) {
            url += "&pageToken=" + pageToken;
        }

        $http.get(url).then(function(response) {
            log(response.data);
            if (!response || !response.data) {
                return
            }
            var pageToken = response.data.nextPageToken;
            var items =  response.data.items;

            if (items) {
                items.forEach(function(item) {
                    console.log(item);
                    if (item.kind != "youtube#playlistItem") {
                        return;
                    }
                    var card = {
                        url : 'https://www.youtube.com/embed/' + item.contentDetails.videoId,
                        name : item.snippet.title,
                        bio : item.snippet.description
                    };
                    log(item.contentDetails.videoId);

                    self.cards.push(card)
                });

                console.log(pageToken);
                if (pageToken) {
                    getCards(pageToken);
                }

            }

        });
    })();



    // $http.put(url + '/myindex/mytype/12345', {abc:1, b:2}).then(function(res) {
    //     console.dir(res);
    //
    //
    //     // Example of a search
    //
    //     $http.post(url + '/search', {
    //         index : 'myindex',
    //         body: {
    //             query: {
    //                 match: {
    //                     abc: 123
    //                 }
    //             }
    //         }
    //     }).then(function(response) {
    //         response.data.forEach(function(item) {
    //             console.log("search result", item);
    //         });
    //     });
    //
    //
    //     //
    //     // Example of fetching one record by id:
    //     //
    //     $http.get(url + '/myindex/mytype/12345').then(function(res) {
    //         console.log("item fetched:", res.data);
    //     })
    //
    // })
    //
    //
    // //
    // // for (var i = 0; i < self.cards.length; i++) {
    // //     //$("#"+self.cards[i].id)[0].mute();
    // // }
    //
    // $http.put(url + '/myindex/mytype/12345', {abc:1, b:2}).then(function(res) {
    //     console.dir(res);
    //
    //
    //     // Example of a search
    //
    //     $http.post(url + '/search', {
    //         index : 'myindex',
    //         body: {
    //             query: {
    //                 match: {
    //                     abc: 123
    //                 }
    //             }
    //         }
    //     }).then(function(response) {
    //         response.data.forEach(function(item) {
    //             console.log("search result", item);
    //         });
    //     });
    //
    //
    //     //
    //     // Example of fetching one record by id:
    //     //
    //     $http.get(url + '/myindex/mytype/12345').then(function(res) {
    //         console.log("item fetched:", res.data);
    //     })
    //
    // })

}])
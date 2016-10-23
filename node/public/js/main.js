// TODO Add phone number
// TODO Add video URL option


var url = '/api';
var log = console.log;


var Keys = {
    channelId : 'UCMABz0K2kvC7YF6GwYfDB0w',
    playlistId : 'PLD475BA4B0793FF8B',
    youtubeApiKey : 'AIzaSyBWoJsAtQVYq60JIrSvg32GoHonnfKqiE8'
}

var vid = document.getElementById("bgVideo")
if (vid) {
    vid.playbackRate = 1.25;
}

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

angular.module("EveryMountain", ["angularRandomString"])
.config(function($sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist([
        'self',
        'https://www.youtube.com/**'
    ]);
})
.controller("GroundCtrl", ["$http", "$scope", "randomString", function($http, $scope, randomString) {
    var self = this;

    self.cards = [];
    self.fileUpload = null;
    self.uploadComplete = false;
    self.profileId = null;
    self.profilePicPath = "";
    self.mentorYoutubeUrl = "";
    self.mentorPhoneNumber = "";


    self.getCardUrl = function(card) {
        return card.url + "?rel=0&showinfo=0&loop=1";
    }

    self.getCardVolume = function(card) {
        return 0;
    }

    self.showCallModal = function(card) {
        console.log("Loading call modal")
        $("#callModal").modal('show');
        $("#callModalNameHolder").text(card.name);
        var pn = $("#phoneNumber");
        pn.attr('href', 'callto://+' + card.phoneNumber);
        pn.text(card.phoneNumber);
    };

    self.showBecomeAMemberModal = function() {
        $("#becomeAMemberModal").modal('show');
    };

    self.openFileUploadDialog = function() {
        $('#upload-input').click();
        $('.progress').attr('value', '0');
        self.uploadComplete = false;
    };

    self.isVideoCard = function(card) {
        return !self.isPictureCard(card);
    };

    self.isPictureCard = function(card) {
        return card.type == 'picture';
    };

    self.disallowMentorSubmit = function() {
        console.log("self.uploadComplete ", self.uploadComplete )
        console.log("self.mentorYoutubeUrl ", self.mentorYoutubeUrl )
        return !(self.uploadComplete || self.mentorYoutubeUrl);
    };

    self.hasPhoneNumber = function(card) {
        return !!card.phoneNumber;
    };

    $scope.fileNameChanged = function(element) {
        console.log("select file");

        var files = element.files;

        console.log(files);
        if (files.length > 0){
            // One or more files selected, process the file upload

            // create a FormData object which will be sent as the data payload in the
            // AJAX request
            var formData = new FormData();

            // loop through all the selected files
            var file = files[0];

            // add the files to formData object for the data payload
            formData.append('uploads[]', file, file.name);
            var dotIndex = file.name.indexOf(".");
            var extension = file.name.substr(dotIndex);

            var userId = randomString(20);

            $.ajax({
                url: '/api/upload/' + userId,
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: function(data){
                    console.log('upload successful!');
                },
                xhr: function() {
                    // create an XMLHttpRequest
                    var xhr = new XMLHttpRequest();

                    // listen to the 'progress' event
                    xhr.upload.addEventListener('progress', function(evt) {

                        if (evt.lengthComputable) {
                            // calculate the percentage of upload completed
                            var percentComplete = evt.loaded / evt.total;
                            percentComplete = parseInt(percentComplete * 100);

                            // update the Bootstrap progress bar with the new percentage
                            $('.progress').attr('value', percentComplete);

                            // once the upload reaches 100%, set the progress bar text to done
                            if (percentComplete === 100) {
                                $scope.$apply(function() {
                                    self.uploadComplete = true;
                                    setTimeout(function() {
                                        $scope.$apply(function() {
                                            self.profileId = userId;
                                            self.profilePicPath = "images/uploads/" + userId + extension;

                                        });
                                    }, 1000);
                                });

                                console.log("Done")
                            }

                        }

                    }, false);

                    return xhr;
                }
            });

        }

    };


    self.uploadBio = function() {
        console.log("Uploading bio");

        var card = {

            name: $("#mentorName").val(),
            bio: $("#mentorBio").val(),
            type: self.mentorYoutubeUrl ? 'video' : 'picture',
            src: self.profilePicPath,
            phoneNumber : self.mentorPhoneNumber
        };

        var videoId = "";
        var videoUrl = self.mentorYoutubeUrl;
        if (videoUrl) {
            var dotIndex = videoUrl.lastIndexOf("/");
            videoId = videoUrl.substr(dotIndex + 1);
            var qIndex = videoUrl.lastIndexOf("?");
            if (qIndex >= 0) {
                videoId = videoUrl.substr(qIndex + 1);
            }
            url: "https://www.youtube.com/embed/"

            card.videoId = videoId;
            card.url = "https://www.youtube.com/embed/" + videoId;
        }

        if (!self.profileId) {
            self.profileId = randomString(20);
        }

        $http.put(url + '/bios/bio/' + self.profileId, card).then(function (res) {

            // Example of a search

            self.cards.unshift(card);

            console.log(res.data);

            $("#becomeAMemberModal").modal("hide");
        });
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
            //log(response.data);
            if (!response || !response.data) {
                return
            }
            var pageToken = response.data.nextPageToken;
            var items =  response.data.items;

            if (items) {
                items.forEach(function(item) {
                    // console.log(item);
                    if (item.kind != "youtube#playlistItem") {
                        return;
                    }
                    var card = {
                        url : 'https://www.youtube.com/embed/' + item.contentDetails.videoId,
                        name : item.snippet.title,
                        bio : item.snippet.description,
                        phoneNumber : self.mentorPhoneNumber
                    };
                    // log(item.contentDetails.videoId);

                    self.cards.push(card)
                });

                // console.log(pageToken);
                if (pageToken) {
                    getCards(pageToken);
                }

            }

        });
    })();


    (function getDbCards() {

        $http.post(url + '/search', {
            index : 'bios',
        }).then(function(response) {
            console.log("Loaded " + response.data.length + " items");

            response.data.forEach(function(item) {
                var src = item._source;
                // console.log("search result", src);
                var card = {
                    name : src.name,
                    bio : src.bio,
                    type : src.type,
                    src : src.src,
                    videoId : src.videoId,
                    url : src.url,
                    phoneNumber : src.phoneNumber
                };
                self.cards.unshift(card);
            });
        });
    })();


    //
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


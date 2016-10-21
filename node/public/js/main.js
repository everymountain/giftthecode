var url = 'http://localhost/api';
document.getElementById("bgVideo").playbackRate = 1.25;

angular.module("EveryMountain", [])


.controller("GroundCtrl", ["$http", function($http) {
    this.world = "World"


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
                },
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
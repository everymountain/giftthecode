var express = require('express');
var elasticsearch = require('elasticsearch');
var router = express.Router();
var p = console.log;

var handleResults = function(res) {
    return (err, results) => {
        if (err) console.error(err);
        res.send(results);
    }
}

var client = new elasticsearch.Client({
  host: 'https://search-pflag-ec4gvq53t4tkw6hwmt66jceaxu.us-east-1.es.amazonaws.com/',
  log: 'trace'
});

setTimeout(function() {
    client.ping({
      requestTimeout: 30000,

      // undocumented params are appended to the query string
      hello: "elasticsearch"
    }, function (error) {
      if (error) {
        console.error('elasticsearch cluster is down!');
      } else {
        console.log('All is well');
      }
    });
}, 0);


p("#########################       EveryMountain        ########################")
p("Loaded.  Start testing now.")

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send({'api':'online'});
});


/**
 * Perform search, returning an array of results if found.
 * Note: This call is not appropriate for paged results.
 */
router.post('/search', (req, res, next) => {
    client.search(req.body).then(
        results => {
            if (results && results.hits && results.hits.total > 0) {
                res.send(results.hits.hits);
            } else {
                res.send([]);
            }
        },
        error => {
            console.trace(error.message);
            res.send([]);
        }
    );
})

/**
 * Add a document
 */
router.put('/:index/:type/:id', (req, res, next) => {
    client.index({
        index : req.params.index,
        type : req.params.type,
        id : req.params.id,
        body : req.body
    }, handleResults(res))
});


/**
 * Get a document
 */
router.get('/:index/:type/:id', (req, res, next) => {
    client.get({
        index : req.params.index,
        type : req.params.type,
        id : req.params.id
    }, function(err, results) {
        if (results && results.found) {
            res.send(results._source);
        } else {
            res.send({found:false});
        }
    });
});

module.exports = router;

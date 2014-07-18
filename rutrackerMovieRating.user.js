// ==UserScript==
// @name        Rutracker Movie Rating
// @namespace   http://heymexa.ru/
// @description Рейтинг фильмов на rutracker.org
// @include     http://rutracker.org/forum/viewtopic.php*
// @downloadURL https://github.com/HeyMeXa/rutracker-movie-rating/raw/master/rutrackerMovieRating.user.js
// @updateURL   https://github.com/HeyMeXa/rutracker-movie-rating/raw/master/rutrackerMovieRating.user.js
// @grant       none
// @version     1.0
// ==/UserScript==

(function () {
    /**
     * @const {string}
     */
    var API_URL = 'http://www.omdbapi.com/?t=%movie_name%';

    /**
     * @public
     */
    function init() {
        initImdbRating();
    }

    /**
     * @public
     */
    function initImdbRating() {
        var movieName = getMovieName();
        if (movieName) {
            getImdbRating(movieName);
        }
        console.log(movieName);
    }

    /**
     * @public
     * @param {string} movieName
     */
    function getImdbRating(movieName) {
        var xmlHttp = new XMLHttpRequest();
        if (!xmlHttp) {
            return;
        }
        xmlHttp.open('GET', API_URL.replace('%movie_name%', movieName), true);
        xmlHttp.onreadystatechange = function () {
            if (xmlHttp.status === 200 && xmlHttp.readyState === 4) {
                try {
                    var imdbInfo = JSON.parse(xmlHttp.responseText);
                    console.log(imdbInfo);
                    showImdbRating(imdbInfo)
                } catch (e) {

                }
            }
        };
        xmlHttp.send(null);
    }

    /**
     * @public
     * @param {Object} imdbInfo
     */
    function showImdbRating(imdbInfo) {
        var node = getRatingPlace();
        node.innerHTML += '<a style="display: block; width: 102px;" href="http://www.imdb.com/title/' + imdbInfo.imdbID + '/" target="_blank" title="Всего голосов: '+ imdbInfo.imdbVotes +'"><img src="http://imdb.snick.ru/ratefor/03/' + imdbInfo.imdbID + '.png"></a>';
    }

    /**
     * @returns {HTMLElement}
     */
    function getRatingPlace() {
        return document.querySelector('h1.maintitle');
    }

    /**
     * @public
     * @returns {string}
     */
    function getMovieName() {
        var titleNode = document.querySelector('h1.maintitle');
        if (!titleNode) {
            return '';
        }
        try {
            return /^(.*?) \/ ([\w\d.:\-\s,]+) \(/.exec(titleNode.textContent)[2];
        } catch (e) {
            if (console && console.log) {
                console.log('can\'t find the movie title');
            }
            return '';
        }
    }

    init();
})();

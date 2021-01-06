$(document).ready(function () {

    // DOM Variables
    const voteBtnEl = $('#vote-btn');
    const favBtnEl = $('#fav-btn');

    // functions
    async function vote(designId) {
        const result = await $.ajax({
            url: `/vote/${designId}`,
            method: 'POST',
        })
        if (result.message === 'Vote successful') {
            window.location = `/vote/${designId}`;
        }
    };

    async function fav(designId) {
        const result = await $.ajax({
            url: `/fav/${designId}`,
            method: 'POST',
        })
        if (result.message === 'Favorite successful') {
            window.location = `/vote/${designId}`;
        }
    }

    voteBtnEl.on('click', (e) => {
    // $('main').on('click', '#vote-btn', (e) => {
        e.preventDefault();
        // console.log('vote');
        const designId = voteBtnEl.attr('data-designid');
        // console.log(designId);
        vote(designId);
    });

    favBtnEl.on('click', (e) => {
        e.preventDefault();
        // console.log('fav');
        const designId = favBtnEl.attr('data-designid');
        // console.log(designId);
        fav(designId);
    });

});
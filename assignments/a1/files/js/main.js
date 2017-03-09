let buttons = [];
let map = null;
let marker = null;
let selectedArticle = null;

const update = () => {
    fetch('files/data.json')
        .then(response => {
        return response.json();
})
.then(articles => {
        let html = '<div class="card-deck">';
    for (let [index, article] of articles.entries()) {
        html += `
                        <article class="card">
                            <img class="card-img-top" src="${article.thumbnail}" alt="">
                            <div class="card-block">
                                <h3 class="card-title">${article.title}</h3>
                                <p class="card-text">${article.details}</p>
                            </div>
                            <div class="card-footer">
                                <p><a href="#" class="btn btn-primary" data-toggle="modal" data-target="#myModal" role="button" data-index="${index}">View</a></p>
                            </div>
                        </article>
                        `;
    }
    document.querySelector('#content').innerHTML = html+'</div>';
    // console.log(JSON.parse(document.querySelector('#content a').dataset.crd));
    buttons = document.querySelectorAll('#content article a');
    for (let button of buttons) {
        button.addEventListener('click', (evt) => {
            evt.preventDefault();
        // console.log(evt.target);
        selectedArticle = articles[evt.target.dataset.index];
        document.querySelector('.modal-body img').src = selectedArticle.image;
        document.querySelector('.modal-title').innerHTML = selectedArticle.title;
        $('#myModal').on('shown.bs.modal', resetMap);
    });
    }

});
};

const initMap = () => {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 11
    });
    marker = new google.maps.Marker({
        map: map
    });
    update();
}

const resetMap = () => {
    const coords = selectedArticle.coordinates;
    console.log(coords);
    google.maps.event.trigger(map, "resize");
    map.panTo(coords);
    marker.setOptions({
        position: coords
    });
};


document.querySelector('#map').addEventListener('transitionend', resetMap);
initMap();






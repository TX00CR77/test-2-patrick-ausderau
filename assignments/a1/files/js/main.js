let buttons = [];
let map = null;
let marker = null;
let selectedArticle = null;

// get the modal by ID
const myModal = document.getElementById('details');

const update = () => {
    fetch('files/data.json')
        .then(response => {
            return response.json();
        })
        .then(articles => {
            let html = '<div class="card-group">';
            for (let [index, article] of articles.entries()) {
                html += `
                        <article class="card">
                            <img class="card-img-top" src="${article.thumbnail}" alt="${article.title}">
                            <div class="card-block">
                                <div class="row">
                                    <div class="col">
                                        <h3 class="card-title">${article.title}</h3>
                                    </div>
                                    <div class="col">
                                        <small class="text-muted">${article.time}</small>
                                    </div>
                                </div>
                                <p class="card-text">${article.details}</p>
                            </div>
                            <div class="card-footer">
                                <p><a class="btn btn-primary" id="myModalTrigger" data-toggle="modal" href="#myModal" data-index="${index}">View</a></p>
                            </div>
                        </article>
                        `;
            }
            html += '</div>';
            document.querySelector('#content').innerHTML = html;
            buttons = document.querySelectorAll('#content article a');
            for (let button of buttons) {
                button.addEventListener('click', (evt) => {
                    evt.preventDefault();
                    selectedArticle = articles[evt.target.dataset.index];
                    const options = {
                        content: `<div class="modal-header">
                                        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span
                                                aria-hidden="true">&times;</span></button>
                                        <h4 class="modal-title">${selectedArticle.title}</h4>
                                    </div>
                                    <div class="modal-body">
                                        <figure>
                                            <a href="${selectedArticle.original}"><img src="${selectedArticle.image}" alt="${selectedArticle.title}"></a>
                                            <div id="map" class="small-map"></div>
                                        </figure>
                                    </div>
                                    <div class="modal-footer">
                                        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                                    </div>`,
                        backdrop: 'true',
                        keyboard: true
                    };
                    const myModalInstance = new Modal(myModal, options);
                    initMap();
                    document.querySelector('#map').addEventListener('transitionend', resetMap);
                    myModalInstance.show();
                    console.log(myModalInstance);
                    myModal.addEventListener('shown.bs.modal', resetMap, false);
                    myModal.addEventListener('hidden.bs.modal', hideStreetView, false);
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
};

const resetMap = () => {
    const coords = selectedArticle.coordinates;
    console.log(coords);
    google.maps.event.trigger(map, "resize");
    map.panTo(coords);
    marker.setOptions({
        position: coords
    });
};

const hideStreetView = () => {
    map.getStreetView().setVisible(false);
};



update();




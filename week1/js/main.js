'use strict';
let catArray = [];
let categoryArray = [];
let currentCat;
let map;

const getCats = () => {
    const  myRequest = new Request('./data.json');

    fetch(myRequest).then((response) => {
        return response.json();
    }).then((json) => {
        catArray = json.data;
        getCategories();
        populate('All');
    });
};

const modalContentTemplate = () => {
    return `
        <!-- Modal content-->
        <div class="modal-content">
          <div class="modal-header" >
            <button type="button" class="close" data-dismiss="modal">&times;</button>
            <h4 class="modal-title">${currentCat.title} </h4>
          </div>
          <div class="modal-body">
            <img src="${currentCat.image}">
            <p>Date: ${currentCat.time}</p>
            <div id="map"> </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
          </div>
        </div>
        `
};

const catCardTemplate = (index,title,details,category,thumbnail) => {
    return `
            <div class="card">
                <img class="card-img-top" src="${thumbnail}" alt="Card image cap">
                <p>${category}</p>
                <div class="card-block">
                    <h4 class="card-title">${title}</h4>
                    <p class="card-text">${details}</p>
                </div>
                <a href="#" ><button type="button" class="btn btn-primary" id="btn${index}" data-target="#myModal" data-toggle="modal">View</button> </a>
            </div>
            `;
};


const initMap = () => {
    if(currentCat != null) {
        map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: currentCat.coordinates.lat, lng: currentCat.coordinates.lng},
            zoom: 10,
            mapType: google.maps.MapTypeId.ROADMAP,
        });
        let marker = new google.maps.Marker({
            position: {lat: currentCat.coordinates.lat, lng: currentCat.coordinates.lng},
            map: map,
            title: currentCat.title,
        });
        marker.setMap(map);
    }
};

const getCategories = () => {
    for (const i in catArray) {
        if (categoryArray.length < 1) {
            categoryArray.push(catArray[i].category);
        }
        for (const a in categoryArray) {
            if (categoryArray[a] != catArray[i].category) {
                categoryArray.push(catArray[i].category);
            }
        }
    }
    document.querySelector('#categories').innerHTML += `<a href="#"><button type="button" class="btn btn-primary" onClick="populate('All')">All</button> </a>`;

    for (const x in categoryArray){
        document.querySelector('#categories').innerHTML += `<a href="#"><button type="button" id="categoryBtn${x}" class="btn btn-primary">${categoryArray[x]}</button> </a>`;
    }

    // need to have a second loop because if this snip is included above, onClicks for the elements won't work
    for (const x in categoryArray){
        $('#categoryBtn'+ x).on('click', () => {
            populate(categoryArray[x]);
        });
    }
};

const populate = (t) => {

    document.querySelector('#cardList').innerHTML = '';
    for (const i in catArray) {
        if(catArray[i].category == t || t == 'All'){
            document.querySelector('#cardList').innerHTML += catCardTemplate(i, catArray[i].title, catArray[i].details, catArray[i].category, catArray[i].thumbnail);

        }
    }
    // need to have a second loop because if this snip is included above, onclicks won't work
    for (const i in catArray) {
        $('#btn'+ i).on('click', () => {
            loadModal(i);
        });
    }

};

const loadModal = (index) =>{

    $('myModal').modal('show');
    currentCat = catArray[index];

    document.querySelector('#modalContent').innerHTML = modalContentTemplate();

    setTimeout(() => {
        initMap();
    }, 500);

};

getCats();

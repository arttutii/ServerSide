'use strict';
let catArray = [];
let currentCat;

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

const loadModal = (index) =>{

    $('myModal').modal('show');
    currentCat = catArray[index];

    document.querySelector('#modalContent').innerHTML = `
        <!-- Modal content-->
        <div class="modal-content">
          <div class="modal-header" >
            <button type="button" class="close" data-dismiss="modal">&times;</button>
            <h4 class="modal-title" style="text-align: center;" >${catArray[index].title} </h4>
          </div>
          <div class="modal-body">
            <img style="max-width: 100%;" src="${catArray[index].image}">
            <p>Date: ${catArray[index].time}</p>
            <div id="map" style="width: 100%; height: 200px;"> </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
          </div>
        </div>
        `;

    setTimeout(() => {
        initMap();
    }, 500);

};

let map;
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

let categoryArray = [];
const getCategories = () => {
    for (let i in catArray) {
        if (categoryArray.length < 1) {
            categoryArray.push(catArray[i].category);
        }
        for (let a in categoryArray) {
            if (categoryArray[a] != catArray[i].category) {
                categoryArray.push(catArray[i].category);
            }
        }
    }
    document.querySelector('#categories').innerHTML += `<a href="#"><button type="button" class="btn btn-primary" onClick="populate('All')">All</button> </a>`;

    for (let x in categoryArray){
        document.querySelector('#categories').innerHTML += `<a href="#"><button type="button" class="btn btn-primary" onClick="populate('${categoryArray[x]}')">${categoryArray[x]}</button> </a>`
    }
};

const populate = (t) => {

    document.querySelector('#cardList').innerHTML = '';
    for (let i in catArray) {
        if(catArray[i].category == t || t == 'All'){
            document.querySelector('#cardList').innerHTML += `
            <div class="card" style="max-width: 33%; text-align: center;">
                <img style="max-width: 100%;" class="card-img-top" src="${catArray[i].thumbnail}" alt="Card image cap">
                <p style="text-align: center;">${catArray[i].category}</p>
                <div class="card-block">
                    <h4 class="card-title">${catArray[i].title}</h4>
                    <p class="card-text">${catArray[i].details}</p>
                </div>
                <a href="#" ><button type="button" class="btn btn-primary" data-target="#myModal" data-toggle="modal" onClick="loadModal(` + i + `)">View</button> </a>
            </div>
            `;
        }
        $('.card').on('mouseenter','img', () =>{
            console.log("click");
        });
    }

};

getCats();

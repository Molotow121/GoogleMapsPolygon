import {Mongo} from 'meteor/mongo';
import {Template} from 'meteor/templating';
import {GeoZones} from '/imports/api/GeoZones';

import "./main.html";
import {Meteor} from "meteor/meteor";
import {ReactiveVar} from "meteor/reactive-var";


let triangleCoords = [
    {lat: 50.847573, lng: 31.28356},
    {lat: 51.103522, lng: 31.997681},
    {lat: 51.182786, lng: 31.349487}
];
if (Meteor.isClient) {

    Meteor.startup(function () {
        GoogleMaps.load({v: '3', key: 'AIzaSyCWuy1zQVFmWkO7EtcWqoGMAickeXQB0E8', libraries: 'drawing'});
        // let coords = GeoZones.find({}).fetch();
        // console.log(coords);
    });
}

Template.body.helpers({
    exampleMapOptions: function () {
        if (GoogleMaps.loaded()) {
            return {
                center: new google.maps.LatLng(50.454, 30.523),
                zoom: 8,
            };
        }
    }
});

Template.body.onCreated(function () {
createPolygon();
});

export function createPolygon( coords = null, load = null){

    GoogleMaps.ready('exampleMap', function (map) {

        let marker = new google.maps.Marker({
            position: map.options.center,
            map: map.instance
        });
        let bermudaTriangle = new google.maps.Polygon({
            paths: coords ? coords : triangleCoords,
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.35
        });
        bermudaTriangle.setMap(map.instance);
        console.log(222);
        /* if(load === true) {
            let loadAlls = LoadAll();
            console.log(222);
            loadAlls.forEach((element) => {
                polygonArray = element;
                bermudaTriangle = new google.maps.Polygon({
                    paths: polygonArray,
                    strokeColor: '#0816ff',
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                    fillColor: '#FF0000',
                    fillOpacity: 0.35
                });
                bermudaTriangle.setMap(map.instance);
                console.log(loadAll);
            });
        }*/
        if(!coords ) {
        let drawingManager = new google.maps.drawing.DrawingManager({
            drawingMode: google.maps.drawing.OverlayType.MARKER,
            drawingControl: true,
            drawingControlOptions: {
                position: google.maps.ControlPosition.TOP_CENTER,
                drawingModes: ['marker', 'circle', 'polygon', 'polyline', 'rectangle',]
            },
            markerOptions: {icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'},
            circleOptions: {
                fillColor: '#ff1b37',
                fillOpacity: 0.3,
                strokeWeight: 5,
                clickable: false,
                editable: true,
                zIndex: 1
            },
            polygon: {
                paths: triangleCoords
            }
        });
        drawingManager.setMap(map.instance);

        let polygonArray = [];
        console.log(load);

        google.maps.event.addListener(drawingManager, 'polygoncomplete', function (polygon) {
            polygonArray = [];
            for (let i = 0; i < polygon.getPath().getLength(); i++) {
                /*console.log(polygon.getPath().getAt(i).toUrlValue(6));*/
                let str = polygon.getPath().getAt(i).toUrlValue(6);
                let strSplit = str.split(',');
                polygonArray.push({lat: +strSplit[0], lng: +strSplit[1]});
            }
            EnterName(polygonArray);

        });
        }
    });
}

function EnterName(polygonArray) {
    let polygonObject = {};
    let polygonName = prompt('Enter location Name');
    if (!polygonName)
        EnterName();
    else
        polygonObject = {name: polygonName, coords: polygonArray}
    save(polygonObject);
}

function MongoClear() {
    GeoZonesMongo.find().forEach(function (doc) {
        GeoZonesMongo.remove({_id: doc._id});
    });
}

function save(polygonObject) {
    /*Meteor.call('geoZones.insert', polygonObject);*/
    GeoZones.insert(polygonObject);
}

function LoadAll(){
    let array = [];
    GeoZones.find().forEach(function (doc) {
        array.push(doc.coords)
    });

    return array;
}

Template.googleMaps.onCreated(function helloOnCreated() {
    // counter starts at 0
    this.counter = new ReactiveVar(0);

});

Template.googleMaps.helpers({
    getZones() {
        console.log(GeoZones.find({}).fetch());
        return GeoZones.find({}).fetch();
    },
    counter() {
        return Template.instance().counter.get();
    },
});

Template.googleMaps.events({
    'click .loadAll'(event, instance) {
       /* instance.counter.set(instance.counter.get() + 1);*/
       console.log(1);
        createPolygon(null, true);
    },

    'click .polygonInfo'(event, instance) {
        createPolygon(this.coords);
       console.log(this);
    },

});





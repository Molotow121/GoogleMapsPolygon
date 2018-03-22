import {Mongo} from 'meteor/mongo';
import {Template} from 'meteor/templating';
import {GeoZones} from '/imports/api/GeoZones';

import "./main.html";
import {Meteor} from "meteor/meteor";
import {ReactiveVar} from "meteor/reactive-var";


if (Meteor.isClient) {
    Meteor.startup(function () {

    });
}

Template.googleMapsBody.helpers({
    exampleMapOptions: function () {
        if (GoogleMaps.loaded()) {
            return {
                center: new google.maps.LatLng(50.454, 30.523),
                zoom: 8,
            };
        }
    }
});

Template.googleMapsBody.onCreated(function () {
createPolygon();
});

export function createPolygon( coords = null, load = null){

    GoogleMaps.load({v: '3', key: 'AIzaSyCWuy1zQVFmWkO7EtcWqoGMAickeXQB0E8', libraries: 'drawing'});

    GoogleMaps.ready('exampleMap', function (map) {
        console.log(coords);
        let marker = new google.maps.Marker({
            position: map.options.center,
            map: map.instance,
            animation: google.maps.Animation.DROP,
        });
        if(coords) {
            bermudaTriangle = new google.maps.Polygon({
                paths: coords,
                strokeColor: '#0816ff',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#FF0000',
                fillOpacity: 0.35
            });
            bermudaTriangle.setMap(map.instance);
        }
         if(load) {
             load.forEach((element) => {
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
            });
        }
        if(!coords && !load) {
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
        });
        drawingManager.setMap(map.instance);

        let polygonArray = [];
        // console.log(load);

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
    console.log('loadAll');
    let array = [];
    GeoZones.find({}).forEach(function (doc) {
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
        return GeoZones.find({}).fetch();
    },
    counter() {
        return Template.instance().counter.get();
    },
});

Template.googleMaps.events({

    'click .loadAll'(event, instance) {
       /* instance.counter.set(instance.counter.get() + 1);*/
        let array = [];
        GeoZones.find({}).forEach(function (doc) {
            array.push(doc.coords)
        });
        createPolygon(null, array);
    },

    'click .polygonInfo'(event, instance) {
        createPolygon(this.coords, null);
       console.log(this);
    },

});






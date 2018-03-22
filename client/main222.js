/*
import { Mongo } from 'meteor/mongo';
import { Template } from 'meteor/templating';
import { GeoZones } from '/imports/api/GeoZones';

import './main.html';
export const GeoZonesMongo = new Mongo.Collection('geoZones');


let triangleCoords = [
/!*
    {lat: 50.493, lng: 30.430},
    {lat: 50.497, lng: 30.553},
    {lat: 50.417, lng: 30.464},
    {lat: 50.493, lng: 30.430},
*!/
    {lat: 50.847573, lng: 31.28356},
    {lat: 51.103522, lng: 31.997681},
    {lat: 51.182786, lng: 31.349487}
];
if (Meteor.isClient) {
    Meteor.startup(function() {
        GoogleMaps.load({ v: '3', key: 'AIzaSyCWuy1zQVFmWkO7EtcWqoGMAickeXQB0E8', libraries: 'drawing' });
        console.log(getZones());
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
    GoogleMaps.ready('exampleMap', function (map) {
        let marker = new google.maps.Marker({
            position: map.options.center,
            map: map.instance
        });
        let bermudaTriangle = new google.maps.Polygon({
            paths: triangleCoords,
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.35
        });
        bermudaTriangle.setMap(map.instance);

        let drawingManager = new google.maps.drawing.DrawingManager({
            drawingMode: google.maps.drawing.OverlayType.MARKER,
            drawingControl: true,
            drawingControlOptions: {
                position: google.maps.ControlPosition.TOP_CENTER,
                drawingModes: ['marker', 'circle', 'polygon', 'polyline', 'rectangle']
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

        google.maps.event.addListener(drawingManager, 'polygoncomplete', function (polygon) {

            for (let i = 0; i < polygon.getPath().getLength(); i++) {
                /!*console.log(polygon.getPath().getAt(i).toUrlValue(6));*!/
                let str = polygon.getPath().getAt(i).toUrlValue(6);
                let strSplit = str.split(',');
                polygonArray.push({lat: +strSplit[0], lng: +strSplit[1]});
            }
            EnterName(polygonArray);
        });
    });
});

function EnterName(polygonArray){
    let polygonObject = {};
    let polygonName = prompt('Enter location Name');
    if( !polygonName )
        EnterName();
    else
        polygonObject = {name: polygonName, coords: polygonArray}
    saveZones(polygonObject);
}

function saveZones(polygonObject) {
    GeoZonesMongo.insert(polygonObject);
}

function MongoClear() {
    GeoZonesMongo.find().forEach(function (doc) {
        GeoZonesMongo.remove({_id: doc._id});
    });
}

function getZones() {
    return GeoZonesMongo.find().fetch();
}



*/

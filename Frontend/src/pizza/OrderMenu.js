var API = require("../API");
var PizzaCart = require("./PizzaCart");
var Storage=require('../Storage');

var nameIsOk = false;
var telIsOk = false;
var adressIsOk = false;

var patternName = /^[ІіЇїЁёа-яА-Яa-zA-Z\s]+$/;
var patternTel = /^[+]{0,1}\d{4,15}$/;
var patternAdress = /^.{5,}$/;

var nameField = $("#inputName");
var telField = $("#inputPhone");
var adressField = $("#inputAddress");

var messageName = $(".name-help-block");
var messageTel = $(".phone-help-block");
var messageAdress = $("#address-help-block");

var errorName =  "Введіть тільки власне ім’я, без цифр";
var errorTel = " Введіть номер телефону у форматі +380 або почніть з 0";
var errorAdress = "Введіть адресу доставки піци";

var orderInfo = $(".order-info");

function initOrderPage() {
    if(document.getElementById("googleMap")){
        google.maps.event.addDomListener(window,'load',function()	{
            var directionsDisplay = new google.maps.DirectionsRenderer();
            var directionService =	new	google.maps.DirectionsService();
            var geocoder	=	new	google.maps.Geocoder();
            //Тут починаємо працювати з картою
            var mapProp =	{
                center:	new	google.maps.LatLng(50.464379,30.519131),
                zoom:	11
            };
            var html_element =	document.getElementById("googleMap");
            var map	=	new	google.maps.Map(html_element,	 mapProp);
            directionsDisplay.setMap(map);
            directionsDisplay.setOptions( { suppressMarkers: true } );
            //Карта створена і показана
            var point	=	new	google.maps.LatLng(50.464379,30.519131);
            var homeMarker;
            var marker	=	new	google.maps.Marker({
                position:	point,
                map:	map,  //map	- це змінна карти створена за допомогою new google.maps.Map(...)
                icon:	"assets/images/map-icon.png"
            });
            google.maps.event.addListener(map, 'click',function(me){
                createPath(me.latLng,true);
            });
            var run_id = false;
            adressField.on("keyup",function() {
                if(run_id)
                    clearTimeout(run_id);
                run_id=false;
                if(adressIsOk){
                    orderInfo.find(".order-adress").text(adressField.val());
                    run_id = setTimeout(function () {
                        geocodeAddress(adressField.val(),function(err,coordinates){
                            if(!err){
                                createPath(coordinates,false);
                            }else{
                                cantFindAdress();
                                //console.log(err);
                            }
                        });
                    },500);
                }else{
                    cantFindAdress();
                    orderInfo.find(".order-adress").text("невідома");
                    orderInfo.find(".order-time").text("невідомий");
                }
            });
            function createPath(coordinates, updateAdress){
                //console.log("coords:"+coordinates);
                geocodeLatLng(coordinates,	function(err,adress){
                    //console.log("adress:"+adress);
                    if(!err){//Дізналися адресу
                        console.log(adress);
                        if(updateAdress){
                            adressField.val(""+adress);
                            checkAdress();
                        }
                        if(!homeMarker){
                            homeMarker = new google.maps.Marker({
                                position: coordinates,
                                map: map,
                                icon: "assets/images/home-icon.png"
                            });
                        }else{
                            homeMarker.setMap(map);
                            homeMarker.setPosition(coordinates);
                        }
                        calculateRoute(point,coordinates,function(err,result){
                            if(!err){
                                orderInfo.find(".order-time").text(""+result.duration.text);
                                orderInfo.find(".order-adress").text(adressField.val());
                            }else{
                                cantFindAdress();
                                //console.log(err);
                            }
                        });
                    }else{
                        cantFindAdress();
                        //console.log("Немає адреси\n"+err);
                    }
                });
            }
            function cantFindAdress(err){
                directionsDisplay.setMap(null);
                if(homeMarker)
                    homeMarker.setMap(null);
                orderInfo.find(".order-time").text("невідомий");
            }
            function calculateRoute(A_latlng,B_latlng,callback)	{
                directionsDisplay.setMap(map);
                directionService.route({
                    origin:	A_latlng,
                    destination:	B_latlng,
                    travelMode:	google.maps.TravelMode["DRIVING"]
                },	function(response,	status)	{
                    if	(	status	==	google.maps.DirectionsStatus.OK )	{
                        directionsDisplay.setDirections(response);
                        var leg	=	response.routes[	0	].legs[	0	];
                        callback(null,	{
                            duration:	leg.duration
                        });
                    }	else	{
                        callback(new	Error("Can'	not	find	direction"));
                    }
                });
            }
            function	geocodeLatLng(latlng,	 callback){//Модуль за роботу з адресою
                geocoder.geocode({'location':	latlng},	function(results,	status)	{
                    if	(status	===	google.maps.GeocoderStatus.OK&&	results[1])	{
                        var adress =	results[1].formatted_address;
                        callback(null,	adress);
                    }	else	{
                        callback(new	Error("Can't	find	adress"));
                    }
                });
            }
            function	geocodeAddress(adress,	 callback)	{
                geocoder.geocode({'address':	adress},	function(results,	status)	{
                    if	(status	===	google.maps.GeocoderStatus.OK&&	results[0])	{
                        var coordinates	=	results[0].geometry.location;
                        callback(null,	coordinates);
                    }	else	{
                        callback(new	Error("Can	not	find	the	adress"));
                    }
                });
            }
        });
    }
}
$(".left").ready(function(){

    nameField.on("input",function(){
        checkName();
    });

    telField.on("input",function() {
        checkTel();
    });

    adressField.on("input",function() {
        checkAdress();
    });
});
function checkName(){
    nameIsOk = fieldValidation(nameField, patternName,messageName,errorName);
    $(".next-step-button").attr('disabled',!(nameIsOk && telIsOk && adressIsOk));
}
function checkTel(){
    telIsOk = fieldValidation(telField, patternTel, messageTel,errorTel);
    $(".next-step-button").attr('disabled',!(nameIsOk && telIsOk && adressIsOk));
}
function checkAdress(){
    adressIsOk = fieldValidation(adressField, patternAdress, messageAdress, errorAdress);
    $(".next-step-button").attr('disabled',!(nameIsOk && telIsOk && adressIsOk));
}
$(".next-step-button").click(function() {
    var totalPrice = 0;
    PizzaCart.getPizzaInCart().forEach(function(cart_item){
        totalPrice += cart_item.quantity * cart_item.pizza[cart_item.size].price
    });

    API.createOrder({
        name: $('#inputName').val(),
        phone: $('#inputPhone').val(),
        address: $('#inputAddress').val(),
        pizza: PizzaCart.getPizzaInCart(),
        price: totalPrice
    }, function(err, result){
        if(err) {
            alert("Can't create order");
        } else {
              $.ajax({
                  method:"POST",
                  url: "/api/newOrder",
                  data: result.data,
                  success: function(res) {
                      window.location = "/"
                  }
              })
        }
    });
});
function fieldValidation(field,pattern,message,messText){
    if(field.val() != ''){
        if(pattern.test(field.val())){
            message.text("");
            field.addClass("ok");
            field.removeClass("error");
            return true;
        }else{
            message.text(messText);
            field.addClass("error");
            field.removeClass("ok");
        }
    }else{
        message.text("Це поле не може бути пустим!");
        field.addClass("error");
        field.removeClass("ok");
    }
    return false;
}

exports.initOrderPage = initOrderPage;
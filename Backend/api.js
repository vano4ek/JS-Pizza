/**
 * Created by chaika on 09.02.16.
 */
var Pizza_List = require('./data/Pizza_List');

exports.createOrder = function(req, res) {
    var order_info = req.body;
    console.log("Creating Order", order_info);
    var transaction_descript = "";
    order_info.pizza.forEach(function(item){
        console.log(item.quantity);
        console.log(item.size);
        console.log(item.pizza.title);
        transaction_descript += "(" + item.quantity+ " pizza(s)) " + "[" + item.size + "] "
            + item.pizza.title + "\n";
    });
    var description= "Name: " + order_info.name + "\n" + "Address: " + order_info.address + "\n" +
    "Phone: " + order_info.phone + "\n" + "Order: " + transaction_descript;
    var data = description;
    res.send({
        success: true,
        data: data
    });
};

exports.getPizzaList = function(req, res) {
    res.send(Pizza_List);
};
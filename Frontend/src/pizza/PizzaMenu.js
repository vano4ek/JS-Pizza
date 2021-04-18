/**
 * Created by chaika on 02.02.16.
 */
var Templates = require('../Templates');
var PizzaCart = require('./PizzaCart');
// var Pizza_List = require('../Pizza_List');
var API = require('../API');

//HTML едемент куди будуть додаватися піци
var $pizza_list = $(".template-pizza");

function showPizzaList(list) {
    //Очищаємо старі піци в кошику
    $pizza_list.html("");

    //Онволення однієї піци
    function showOnePizza(pizza) {
        var html = Templates.PizzaMenu_OneItem({pizza: pizza});

        var $node = $(html);

        $node.find(".buy-big").click(function () {
            PizzaCart.addToCart(pizza, PizzaCart.PizzaSize.Big);
        });
        $node.find(".buy-small").click(function () {
            PizzaCart.addToCart(pizza, PizzaCart.PizzaSize.Small);
        });

        $pizza_list.append($node);
    }

    list.forEach(showOnePizza);
}

function filterPizza(filter) {
    //Масив куди потраплять піци які треба показати
    var showPizza = [];

    var numberFilter = 0;
    if (filter === "all") showPizza = Pizza_List;
    else if (filter === "vega") {
        Pizza_List.forEach(function (pizza) {
            if (pizza.type === 'Вега піца') {
                showPizza.push(pizza);
                numberFilter++;
            }
        });
    } else if (filter === "meat") {
        Pizza_List.forEach(function (pizza) {
            if (pizza.type === 'М’ясна піца') {
                showPizza.push(pizza);
                numberFilter++;
            }
        });
    } else if (filter === "pineapple") {
        Pizza_List.forEach(function (pizza) {
            if (pizza.content.pineapple) {
                showPizza.push(pizza);
                numberFilter++;
            }
        });
    } else if (filter === "mushroom") {
        Pizza_List.forEach(function (pizza) {
            if (pizza.content.mushroom) {
                showPizza.push(pizza);
                numberFilter++;
            }
        });
    } else if (filter === "ocean") {
        Pizza_List.forEach(function (pizza) {
            if (pizza.content.ocean) {
                showPizza.push(pizza);
                numberFilter++;
            }
        });
    }
    //Показати відфільтровані піци
    showPizzaList(showPizza);
}

$("li").click(function () {
    $("li").removeClass("active");
    $(this).addClass("active");
});

$("#all").click(function () {
    $(".center").html("Усі піци " + '<span class="badge">' + 8 + '</span>');

    filterPizza('all');
});

$("#meat").click(function () {
    $(".center").html("М'ясні піци " + '<div class="badge">' + 5 + '</div>');
    filterPizza("meat");
});


$("#pineapple").click(function () {
    $(".center").html('Піци з ананасами ' + '<div class="badge">' + 3 + '</div>');
    filterPizza('pineapple');
});


$("#mushroom").click(function () {
    $(".center").html('Піци з грибами ' + '<div class="badge">' + 3 + '</div>');
    filterPizza('mushroom');
});


$("#ocean").click(function () {
    $(".center").html('Піци з морепродуктами ' + '<div class="badge">' + 2 + '</div>');
    filterPizza('ocean');
});


$("#vega").click(function () {
    $(".center").html('Вегетаріанські піци ' + '<div class="badge">' + 1 + '</div>');
    filterPizza('vega');
});

function initialiseMenu() {
    //Показуємо усі піци
    API.getPizzaList(function (err, list) {
        if (err)
            alert("Can't load pizzas!" + err.toString());
        else {
            showPizzaList(list);
        }
    });
}

exports.filterPizza = filterPizza;
exports.initialiseMenu = initialiseMenu;
/**
 * Created by chaika on 02.02.16.
 */
var Templates = require('../Templates');
var PizzaCart = require('./PizzaCart');
var Pizza_List = require('../Pizza_List');

//HTML едемент куди будуть додаватися піци
var $pizza_list = $("#pizza_list");
var count;
var $filterName = $(".filter-name");

$(".filter-buttons").find("button").click(function () {
    $(".hovered").removeClass("hovered");
    $(this).addClass("hovered");
});

$(".all").click(function () {
    showPizzaList(Pizza_List);
    count=8;
    $filterName.text("Усі");
    $(".filter-amount").text(count);
});
$(".meat").click(function () {
    filterPizza('М’ясна піца');
});
$(".pineapple").click(function () {
    filterPizza('pineapple');
    $filterName.text("З ананасами");
});
$(".mushrooms").click(function () {
    filterPizza('mushroom');
    $filterName.text("З грибами");
});
$(".seafood").click(function () {
    filterPizza('Морська піца');
});
$(".vega").click(function () {
    $(".hovered").removeClass(".hovered");
    $(this).addClass(".hovered");
    filterPizza('Вега піца');
});


function showPizzaList(list) {
    //Очищаємо старі піци в кошику
    $pizza_list.html("");


    //Онволення однієї піци
    function showOnePizza(pizza) {
        var html_code = Templates.PizzaMenu_OneItem({pizza: pizza});

        var $node = $(html_code);

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
    count=0;
    //Масив куди потраплять піци які треба показати
    var pizza_shown = [];
    Pizza_List.forEach(function (pizza) {
        //Якщо піка відповідає фільтру
        if (pizza.type==filter||pizza.content[filter]) {
            count++;
            pizza_shown.push(pizza);
        }
    });

    //Показати відфільтровані піци
    showPizzaList(pizza_shown);
    $filterName.text(filter);
    $(".filter-amount").text(count);
}



function initialiseMenu() {
    //Показуємо усі піци
    showPizzaList(Pizza_List);
}

exports.filterPizza = filterPizza;
exports.initialiseMenu = initialiseMenu;
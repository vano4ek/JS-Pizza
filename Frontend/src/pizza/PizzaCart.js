/**
 * Created by chaika on 02.02.16.
 */
var Templates = require('../Templates');
var Storage=require('../Storage');

//Перелік розмірів піци
var PizzaSize = {
    Big: "big_size",
    Small: "small_size"
};

//Змінна в якій зберігаються перелік піц в кошику
var Cart = [];
var total=0;

//HTML едемент куди будуть додаватися піци
var $cart = $(".bucket-template");

function addToCart(pizza, size) {
    //Додавання однієї піци в кошик покупок

    //Приклад реалізації, можна робити будь-яким іншим способом
    var addNew=true;
    for (var a = 0; a < Cart.length; a++) {
        if ((pizza.id === Cart[a].pizza.id) && (size === Cart[a].size)) {
            Cart[a].quantity += 1;
            addNew = false;
        }
    }
    if(addNew){
        Cart.push({
            pizza: pizza,
            size: size,
            quantity: 1
        });
    }

    //Оновити вміст кошика на сторінці
    total += pizza[size].price;
    $(".ordered").text(Cart.length);
    $(".amount-number").text(total+" грн");
    updateCart();
}

function removeFromCart(item) {
    //Видалити піцу з кошика
    var html = Templates.PizzaCart_OneItem(item);

    var $node = $(html);
    $node.find(".remove").click(function(){
        $node.remove();
    });
    Cart.splice(Cart.indexOf(item), 1);
    //Після видалення оновити відображення
    updateCart();
}

function initialiseCart() {
    var saved=Storage.get('cart');
    if(saved){
        Cart=saved;
    }
    var savedAmount=Storage.get('amount-number');
    if(savedAmount){
        $(".amount-number").text(savedAmount+" грн");
        total=parseInt($(".amount-number").text());
    }
    var savedOrder= Storage.get('ordered');
    $(".ordered").text(savedOrder);
    //Фукнція віпрацьвуватиме при завантаженні сторінки
    //Тут можна наприклад, зчитати вміст корзини який збережено в Local Storage то показати його

    updateCart();
}

function getPizzaInCart() {
    //Повертає піци які зберігаються в кошику
    return Cart;
}
$('.delete-order').click(function() {
    Cart = [];
    $(".ordered").text(Cart.length);
    total = 0;
    $(".amount-number").text(total+" грн");
    updateCart();
});


function updateCart() {
    //Функція викликається при зміні вмісту кошика
    //Тут можна наприклад показати оновлений кошик на екрані та зберегти вміт кошика в Local Storage
    //Очищаємо старі піци в кошику
    $cart.html("");
    if (Cart.length === 0)
        $(".btn-lg").attr("class", "btn btn-warning btn-lg disabled");
    else
        $(".btn-lg").attr("class", "btn btn-warning btn-lg");

    //Онволення однієї піци
    function showOnePizzaInCart(item) {
        var html = Templates.PizzaCart_OneItem(item);

        var $node = $(html);
        var pricePizza = parseInt($node.find(".price").text());
        var countPizza = parseInt($node.find(".quantity").text());
        if($("button").hasClass("btn-back-order")){
            $node.find(".plus").hide();
            $node.find(".minus").hide();
            $node.find(".remove").hide();
            if(countPizza===1) {
                $node.find(".quantity").text(countPizza + " піца");
            }
            else if(countPizza>=2&&countPizza<=4) {
                $node.find(".quantity").text(countPizza + " піци");
            }
            else{
                $node.find(".quantity").text(countPizza + " піц");
            }

        }
        $node.find(".plus").click(function () {
            //Збільшуємо кількість замовлених піц
            item.quantity++;
            total += pricePizza;
            $(".amount-number").text(total + " грн");

            //Оновлюємо відображення
            updateCart();
        });

        if (item.quantity >= 1) {
            $node.find(".minus").click(function () {
                //Збільшуємо кількість замовлених піц
                if(item.quantity == 1) {
                    removeFromCart(item);
                    $(".ordered").text(Cart.length);
                    total -= pricePizza;
                    $(".amount-number").text(total + " грн");
                    updateCart();
                    return;
                }
                item.quantity --;
                total -= pricePizza;
                $(".amount-number").text(total + " грн");

                //Оновлюємо відображення
                updateCart();
            });
        }
        $cart.append($node);

        $node.find(".remove").click(function () {
            removeFromCart(item);
            total -= pricePizza * countPizza;
            $(".amount-number").text(total + " грн");
            $(".ordered").text(Cart.length);
            updateCart();
        });
    }
    Cart.forEach(showOnePizzaInCart);
    Storage.set("amount-number",total);
    Storage.set("cart",Cart);
    Storage.set("ordered",Cart.length);
}

// function createOrder(callback) {
//     API.createOrder({
//             name: "Client name",
//             phone: "123456789",
//             order: Cart
//         },
//         function (err, result) {
//             if (err) {
//                 return callback(err);
//             }
//             callback(null, result);
//         }
//     )
// }


exports.removeFromCart = removeFromCart;
exports.addToCart = addToCart;

exports.getPizzaInCart = getPizzaInCart;
exports.initialiseCart = initialiseCart;

exports.PizzaSize = PizzaSize;

// exports.createOrder = createOrder;
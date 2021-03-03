/**
 * Created by chaika on 02.02.16.
 */
var Templates = require('../Templates');
var Storage = require('../storage');

//Перелік розмірів піци
var PizzaSize = {
    Big: "big_size",
    Small: "small_size"
};

//Змінна в якій зберігаються перелік піц в кошику
var Cart = [];

//HTML едемент куди будуть додаватися піци
var $cart = $("#cart");
var $cartAmount = $(".special-amount");
var cartAmount = 0;
var $orderPrice = $(".order-price");
var orderPrice = 0;
function addToCart(pizza, size) {
    //Додавання однієї піци в кошик покупок
    var elem = Cart.find(val => val.pizza==pizza&&val.size==size);
    if (elem) {
        elem.quantity++;
         orderPrice += elem.pizza[size].price;
    }
    //Приклад реалізації, можна робити будь-яким іншим способом
    else {
        Cart.push({
            pizza: pizza,
            size: size,
            quantity: 1
        });
        orderPrice+=pizza[size].price;
    }
    cartAmount++;
    $cartAmount.text(cartAmount);
    //Оновити вміст кошика на сторінці
    updateCart();
}

function removeFromCart(cart_item) {
    //Видалити піцу з кошика
    var ind = Cart.indexOf(cart_item);
    if (ind>-1)
        Cart.splice(ind, 1);
    cartAmount-=cart_item.quantity;

    //Після видалення оновити відображення
    updateCart();
}

function initialiseCart() {
    //Фукнція віпрацьвуватиме при завантаженні сторінки
    //Тут можна наприклад, зчитати вміст корзини який збережено в Local Storage то показати його
    var savedCart = Storage.get('cart');
    if(savedCart){
        Cart = savedCart;
        orderPrice = Storage.get('totalPrice');
        cartAmount = Storage.get('orderAmount');
    }

    updateCart();
}

function getPizzaInCart() {
    //Повертає піци які зберігаються в кошику
    return Cart;
}

function updateCart() {
    //Функція викликається при зміні вмісту кошика
    //Тут можна наприклад показати оновлений кошик на екрані та зберегти вміт кошика в Local Storage
    $orderPrice.text(orderPrice + 'грн');
    $cartAmount.text(cartAmount);
    //Очищаємо старі піци в кошику
    $cart.html("");

    //Онволення однієї піци
    function showOnePizzaInCart(cart_item) {
        var html_code = Templates.PizzaCart_OneItem(cart_item);
        var $node = $(html_code);
        var price = parseInt($node.find('.price').text());

        $node.find(".plus").click(function () {
            //Збільшуємо кількість замовлених піц
            cart_item.quantity += 1;
            cartAmount++;
            orderPrice+=price;

            //Оновлюємо відображення
            updateCart();
        });
        $node.find(".minus").click(function () {
            if (cart_item.quantity==1) {
                removeFromCart(cart_item);
            }
            else {
                cart_item.quantity -= 1;
                cartAmount--;
            }
            orderPrice-=price;
            //Оновлюємо відображення
            updateCart();
        });
        $node.find(".del").click(function () {
                orderPrice-=cart_item.quantity*price;
                removeFromCart(cart_item);
            //Оновлюємо відображення
            updateCart();
        });
        $(".reset-order").click(function () {
            Cart.length=0;
            cartAmount=0;
            orderPrice=0;

            updateCart();
        });

        $cart.append($node);
    }

    Cart.forEach(showOnePizzaInCart);
    Storage.set('cart', Cart);
    Storage.set('totalPrice', orderPrice);
    Storage.set('orderAmount', cartAmount);
}


exports.removeFromCart = removeFromCart;
exports.addToCart = addToCart;

exports.getPizzaInCart = getPizzaInCart;
exports.initialiseCart = initialiseCart;

exports.PizzaSize = PizzaSize;
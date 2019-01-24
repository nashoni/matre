const path = require('path');



const express = require('express');

const shopController = require('../controllers/shop');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

router.get('/products/:productId', shopController.getProduct);

router.get('/cart', isAuth, shopController.getCart);

router.post('/cart', isAuth, shopController.postCart);

router.post('/cart-delete-item', isAuth, shopController.postCartDeleteProduct);

router.post('/go-to-checkout', (req, res, next) => {
    req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      const products = user.cart.items;
      let total = 0;
      products.forEach(p => {
        total += p.quantity * p.productId.price;
      });
    });
      next();
});

router.post('/checkout', (req, res, next) => {
    var options = {
        host: "https://checkout.onepay.co.zm",
        path: "/v1",
        method: "POST",
        headers: {
        "channel_id":1001,
        "currency":"ZMW",
        "amount":total * 100,
        "transaction_reference":user.datetime(),
        "secret_key":"P-1I7]62}NJsdC",
        "signature":sha256(channel_id + currency + amount + transaction_reference + secret_key)
        }
    };
});

router.post('/create-order', isAuth, shopController.postOrder);

router.get('/orders', isAuth, shopController.getOrders);

router.get('/orders/:orderId', isAuth, shopController.getInvoice);

module.exports = router;

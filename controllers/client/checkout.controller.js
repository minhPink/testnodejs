const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");
const Order = require("../../models/order.model");
const productHelper = require("../../helpers/product");

//[GET] /checkout
module.exports.index = async (req, res) => {
    const cartId = req.cookies.cartId;

    const cart = await Cart.findOne({
        _id: cartId
    });

    if(cart.products.length > 0) {
        for (const item of cart.products) {
            const productId = item.product_id;

            const productInfo = await Product.findOne({
                _id: productId
            });

            productInfo.newPrice = productHelper.priceNewProduct(productInfo);

            item.productInfo = productInfo;

            item.totalPrice = item.quantity * productInfo.newPrice;
        }
    };
    //Tong tien ca gio hang
    cart.totalPrice = cart.products.reduce((sum, item) => sum + item.totalPrice, 0);

    res.render("client/pages/checkout/index", {
        pageTitle: "Dat hang",
        cart: cart
    })
};

//[GET] /checkout/order
module.exports.order = async (req, res) => {
    const cartId = req.cookies.cartId;
    const userInfo = req.body;
    const cart = await Cart.findOne({
        _id: cartId
    });

    let products = [];

    for (const item of cart.products) {
        const objectProducts = {
            product_id: item.product_id,
            price: 0,
            discountPercentage: 0,
            quantity: item.quantity
        }
        const productInfo = await Product.findOne({
            _id: item.product_id
        })
        objectProducts.price = productInfo.price;
        objectProducts.discountPercentage = productInfo.discountPercentage;

        products.push(objectProducts);
    };
    const objectOrder = {
        // user_id: String,
        cart_id: cartId,
        userInfo: userInfo,
        products: products
    };

    const order = new Order(objectOrder);
    await order.save();
    //Cap nhat lai gio hang sau khi dat hang thanh cong , xoa het products
    await Cart.updateOne({ _id: cartId}, {products: []});

    res.redirect(`/checkout/success/${order.id}`);
};

//[GET] /checkout/success/:id
module.exports.success = async (req, res) => {
    const order = await Order.findOne({
        _id: req.params.id,
    });

    for(const product of order.products) {
        const productInfo = await Product.findOne({
            _id: product.product_id
        }).select("title thumbnail");

        console.log(productInfo);

        product.productInfo = productInfo;
        
        product.newPrice = productHelper.priceNewProduct(product);

        product.totalPrice = product.quantity * product.newPrice;
    };

    //Tong tien 
    order.totalPrice = order.products.reduce((sum, item) => sum + item.totalPrice, 0);

    res.render("client/pages/checkout/success", {
        pageTitle: "Dat hang thanh cong",
        order : order
    })
}
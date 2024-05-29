const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");
const productHelper = require("../../helpers/product");
// [GET] /cart
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

    res.render("client/pages/cart/index", {
        pageTitle: "Gio hang",
        cart: cart
    });

};

// [POST] /add/:productId
module.exports.addPost = async (req, res) => {
    const cartId = req.cookies.cartId;
    const productId = req.params.productId; 
    const quantity  = parseInt(req.body.quantity);

    const cart = await Cart.findOne({
        _id: cartId
    });

    const exitsProductInCart = cart.products.find(item => item.product_id == productId);

    if(exitsProductInCart) {
        const newQuantity = quantity + exitsProductInCart.quantity;

        await Cart.updateOne(
            {
                _id: cartId,
                'products.product_id': productId
            },
            {
                'products.$.quantity': newQuantity
            }
        );
    } else {
        const objectCart = {
            product_id: productId,
            quantity: quantity
        };
    
        await Cart.updateOne(
            {
                _id: cartId,
            },
            {
                $push: { products : objectCart}
            }
        )
        req.flash("success", "Thêm sản phẩm vào giot hàng thành công !");
    };
    
    
    
    res.redirect("back");
}

// [GET] /deleted/:productId
module.exports.delete = async (req, res) => {
    const productId = req.params.productId;
    const cartId = req.cookies.cartId;

    console.log(productId);

    await Cart.updateOne(
        {
            _id:cartId
        },
        {
            "$pull": {products: {"product_id": productId}}
        }
    );

    req.flash("success", "Da xoa san pham khoi gio hang thanh cong !");

    res.redirect("back");
};

// [GET] /update/:productId/:quantity
module.exports.update = async (req, res) => {
    const cartId = req.cookies.cartId;
    const productId = req.params.productId; 
    const quantity  = req.params.quantity;

    console.log(quantity);

    await Cart.updateOne(
        {
            _id: cartId,
            'products.product_id': productId
        },
        {
            'products.$.quantity': quantity
        }
    );
    req.flash("success", "Da cap nhat so luong thanh cong !");

    res.redirect("back");
}
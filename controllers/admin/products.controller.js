
const Product = require("../../models/product.model");
const filterStatusHelper = require("../../helpers/filterStaus");
const formSearchHelper = require("../../helpers/formSearch");
const navigationHelper = require("../../helpers/navigation");
const configSystem = require("../../config/system");
// [GET] admin/products
module.exports.index = async (req, res) => {
    const filterStatus = filterStatusHelper(req.query);
    const formSearch = formSearchHelper(req.query);
    
    const find = {
        deleted: false
    };
    if(req.query.status){
        find.status = req.query.status
    } 

    if(formSearch.regex){
        find.title = formSearch.regex;
    }
    
    //pagination
    const countPage = await Product.countDocuments(find);
    const objectPagination = navigationHelper(
        {
        currentPage: 1,
        limitProduct: 5
        },
        req.query,
        countPage
    )
    
    
    //pagination

    //sort-select
    let sort = {};

    if(req.query.sortKey && req.query.sortValue){
        sort[req.query.sortKey] = req.query.sortValue
    } 
    else{
        sort.position = "desc"
    }
    
    //sort-select
    const products = await Product.find(find).sort(sort).limit(objectPagination.limitProduct).skip(objectPagination.indexProduct);



    res.render("admin/pages/products/index", {
        pageTitle: "Danh sach san pham",
        products: products,
        filterStatus: filterStatus,
        keyword: formSearch.keyword,
        objectPagination: objectPagination
    })
};

// [PATH] admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    const status = req.params.status;
    const id = req.params.id;
    await Product.updateOne({_id: id}, {status: status});

    req.flash('success', 'Bạn đã cập nhật thành công');

    res.redirect("back");
}

// [PATH] admin/products/change/multi
module.exports.changeMulti = async (req, res) => {
    try {
        const type = req.body.type;
    const ids = req.body.ids.split(", ");
    switch (type) {
        case "active":
            await Product.updateMany({ _id: { $in: ids } },{ status: "active" });
            req.flash('success', 'Bạn đã cập nhật thành công');
            break;
        case "inactive":
            await Product.updateMany({ _id: { $in: ids } },{ status: "inactive" });
            req.flash('success', 'Bạn đã cập nhật thành công');
            break;
        case "delete-all":
            await Product.updateMany({_id: { $in: ids } }, { 
                deleted: "true",
                deletedAt: new Date()
            })
            req.flash('success', 'Bạn đã xóa thành công');
            break;
        case "change-position":
            for (const item of ids) {
                let[id, position] = item.split("-");
                position = parseInt(position);
                // console.log(id);
                // console.log(position);
                await Product.updateOne({_id: id}, { position: position});
            }
            req.flash('success', 'Bạn đã thay đổi thành công');
            break;
        default:
            break;
    }
    res.redirect("back");
    } catch (error) {
        res.redirect(`${configSystem.prefixAdmin}/products`);
    } 
}

// [DELTE] admin/products/delete/:id
module.exports.deleteItem = async (req, res) => {
    const id = req.params.id;
    // await Product.deleteOne({_id: id});(Xoa cung , xoa vinh vien trong database);
    await Product.updateOne({_id: id}, {
        deleted: true,
        deletedAt: new Date()
    });
    req.flash('success', 'Bạn đã xóa thành công');
    res.redirect("back");
}

// [GET] admin/products/create
module.exports.createItem = async (req, res) => {
    res.render("admin/pages/products/create", {
        pageTitle: "Them moi san pham",
    })
}

// [POST] admin/products/create
module.exports.createPost = async (req, res) => {
    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);
    if(req.body.position == ''){
        const count = await Product.countDocuments();
        req.body.position = count + 1;
    } else {
        req.body.position = parseInt(req.body.position);
    }

    if(req.file){
        req.body.thumbnail = `/uploads/${req.file.filename}`;
    }

    const product = new Product(req.body);
    product.save();
    res.redirect(`${configSystem.prefixAdmin}/products`);
}

// [GET] admin/products/edit/:id
module.exports.editGetItem = async (req, res) => {
    try {
        const id = req.params.id;
    const find = {
        deleted: false,
        _id: id
    }

    const product = await Product.findOne(find);
    res.render("admin/pages/products/edit", {
        pageTitle: "Trang chỉnh sửa sản phẩm",
        product: product
    })
    } catch (error) {
        res.redirect(`${configSystem.prefixAdmin}/products`)
    }
}

// [PATCH] admin/products/edit/:id
module.exports.editPatchItem = async (req, res) => {
    try {
        const id = req.params.id;
        req.body.price = parseInt(req.body.price);
        req.body.discountPercentage = parseInt(req.body.discountPercentage);
        req.body.stock = parseInt(req.body.stock);
        req.body.position = parseInt(req.body.position);

        if(req.file){
            req.body.thumbnail = `/uploads/${req.file.filename}`;
        }
        
        await Product.updateOne({_id: id}, req.body);
        res.redirect("back");
        req.flash('success', 'Bạn đã thay đổi thành công');
    } catch (error) {
        req.flash('error', 'Cập nhật không thành công !');
        res.redirect("back");
    }
}

// [GET] admin/products/detail/:id
module.exports.detailItem = async (req, res) => {
    try {
        const id = req.params.id;
    const find = {
        deleted: false,
        _id: id
    }

    const product = await Product.findOne(find);

    console.log(product);
    res.render("admin/pages/products/detail", {
        pageTitle: product.title,
        product: product
    })
    } catch (error) {
        res.redirect(`${configSystem.prefixAdmin}/products`)
    }
}
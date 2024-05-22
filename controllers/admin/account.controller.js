const Account = require("../../models/account.model");
const Role = require("../../models/role.model.js");
const configSystem = require("../../config/system");

const md5 = require("md5");

// [GET] admin/accounts
module.exports.index = async (req, res) => {
    let find = {
        deleted: false
    };

    const records = await Account.find(find).select("-password -token");

    for(const record of records) {
        const role = await Role.findOne({
            _id: record.role_id,
            deleted: false
        });
        record.role = role;
    }
    res.render("admin/pages/accounts/index", {
        pageTitle: "Danh sach tai khoan",
        records: records
    })
};


// [GET] admin/accounts/create
module.exports.create = async (req, res) => {
    const find = {
        deleted: false
    }

    const roles = await Role.find(find);
    res.render("admin/pages/accounts/create", {
        pageTitle: "Them moi tai khoan",
        roles: roles
    })
};

// [POST] admin/accounts/create
module.exports.createPost = async (req, res) => {
    const checkEmail = await Account.findOne({
        email: req.body.email,
        deleted: false
    });

    if(checkEmail){
        req.flash('error', `Email đã tồn tại !`);
        res.redirect("back");
    } else {
        req.body.password = md5(req.body.password);

        const records = new Account(req.body);
        await records.save();

        res.redirect(`${configSystem.prefixAdmin}/accounts`)
    }
    
};
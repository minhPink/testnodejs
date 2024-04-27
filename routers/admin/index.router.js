const dashboardRoutes = require("./dashboard.router");

const productsRoutes = require("./products.router");

const systemConfig = require("../../config/system");


module.exports = (app) => {
    const PATH_ADMIN = systemConfig.prefixAdmin;

    app.use(PATH_ADMIN + "/dashboard", dashboardRoutes);

    app.use(PATH_ADMIN + "/products", productsRoutes);
}
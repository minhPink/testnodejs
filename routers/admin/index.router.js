const dashboardRoutes = require("./dashboard.router");

const productsRoutes = require("./products.router");

const categoryRoutes = require("./products-category.router");

const systemConfig = require("../../config/system");

const roleRouter = require("./roles.router");

const accountRouter = require("./account.route");




module.exports = (app) => {
    const PATH_ADMIN = systemConfig.prefixAdmin;

    app.use(PATH_ADMIN + "/dashboard", dashboardRoutes);

    app.use(PATH_ADMIN + "/products", productsRoutes);

    app.use(PATH_ADMIN + "/products-category", categoryRoutes);

    app.use(PATH_ADMIN + "/roles", roleRouter);

    app.use(PATH_ADMIN + "/accounts", accountRouter);
}
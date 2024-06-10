const dashboardRoutes = require("./dashboard.router");

const productsRoutes = require("./products.router");

const categoryRoutes = require("./products-category.router");

const systemConfig = require("../../config/system");

const roleRouter = require("./roles.router");

const authRouter = require("./auth.route");

const accountRouter = require("./account.route");

const myAccountdRoutes = require("./my-account.route");

const settingRoutes = require("./setting.route");

const authMiddleware = require("../../middlewares/admin/auth.middlewares");

const authController = require("../../controllers/admin/auth.controller");



module.exports = (app) => {
    const PATH_ADMIN = systemConfig.prefixAdmin;

    app.get(PATH_ADMIN, authController.login);

    app.use(
        PATH_ADMIN + "/dashboard",
        authMiddleware.requireAuth,
        dashboardRoutes
    );

    app.use(
        PATH_ADMIN + "/products", 
        authMiddleware.requireAuth,productsRoutes
    );

    app.use(
        PATH_ADMIN + "/products-category", 
        authMiddleware.requireAuth,
        categoryRoutes
    );

    app.use(
        PATH_ADMIN + "/roles",
        authMiddleware.requireAuth, 
        roleRouter
    );

    app.use(
        PATH_ADMIN + "/accounts",
        authMiddleware.requireAuth, 
        accountRouter
    );

    app.use(PATH_ADMIN + "/auth", authRouter);

    app.use(
        PATH_ADMIN + "/my-account",
        authMiddleware.requireAuth,
        myAccountdRoutes
    );

    app.use(
        PATH_ADMIN + "/setting",
        authMiddleware.requireAuth,
        settingRoutes
    );
}
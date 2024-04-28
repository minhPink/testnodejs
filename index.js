const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const flash = require('express-flash');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const bodyParser = require('body-parser');
const database = require("./config/database");

require('dotenv').config();

const route = require('./routers/client/index.route');
const routerAdmin = require('./routers/admin/index.router');

const systemConfig = require("./config/system");

database.connect();

const app = express();
const port = process.env.PORT;
app.use(methodOverride('_method'));
app.set('views', `${__dirname}/views`);
app.set('view engine', 'pug');

app.use(express.static(`${__dirname}/public`));

// App Locals Variable
app.locals.prefixAdmin = systemConfig.prefixAdmin;

// Flash
app.use(cookieParser('HHSDHSDHHSH'));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());
// End Flash

//TinyMCE
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));
//End TinyMCE

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

//Route
route(app);
//RouteAdmin
routerAdmin(app);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
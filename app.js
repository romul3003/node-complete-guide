const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const { engine } = require('express-handlebars');

const app = express();

app.engine('hbs', engine({
  layoutsDir: 'views/layouts/',
  defaultLayout: 'main-layout',
  extname: '.hbs',
}));
app.set('view engine', 'hbs');
app.set('views', 'views');

const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');

// Middleware to parse incoming request bodies
app.use(bodyParser.urlencoded({ extended: false }));
// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminData.routes);
app.use(shopRoutes);

app.use((req, res, next) => {
  res.status(404).render('404', { pageTitle: 'Page Not Found' });
});

app.listen(3000);

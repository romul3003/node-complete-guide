const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use((req, res, next) => {
  res.locals.path = req.originalUrl; // now `path` is available in EJS templates
  next();
});

// Middleware to parse incoming request bodies
app.use(bodyParser.urlencoded({ extended: false }));
// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

app.listen(3000);

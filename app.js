require('dotenv').config();
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const mongoConnect = require('./util/database').mongoConnect;
const User = require('./models/user');

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

app.use((req, res, next) => {
  User.findById('69c65b90144384b3e0a50c48')
    .then((user) => {
      req.user = new User(user.name, user.email, user.cart, user._id);
      next();
    })
    .catch((err) => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoConnect(() => {
  console.log('Server is running on port 3000');
  app.listen(3000);
});

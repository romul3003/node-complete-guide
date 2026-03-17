const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
  });
};

exports.postAddProduct = (req, res, next) => {
  const { title, imageUrl, description, price } = req.body;

  req.user
    .createProduct({
      title,
      imageUrl,
      description,
      price,
    })
    .then(() => {
      console.log('Product created successfully');
      res.redirect('/admin/products');
    })
    .catch((err) => {
      console.error('Error creating product:', err);
    });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit === 'true';

  if (!editMode) {
    return res.redirect('/');
  }

  const prodId = req.params.productId;
  req.user
    .getProducts({ where: { id: prodId } })
    .then((products) => {
      const product = products[0];

      if (!product) {
        return res.redirect('/');
      }

      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product,
      });
    })
    .catch((err) => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
  const { productId, title, imageUrl, description, price } = req.body;

  Product.findByPk(productId)
    .then((product) => {
      if (!product) {
        return res.redirect('/');
      }

      product.title = title;
      product.imageUrl = imageUrl;
      product.description = description;
      product.price = price;

      return product.save();
    })
    .then(() => {
      console.log('Product updated successfully');
      res.redirect('/admin/products');
    })
    .catch((err) => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
  const { productId } = req.body;

  Product.findByPk(productId)
    .then((product) => {
      if (!product) {
        return res.redirect('/');
      }

      return product.destroy();
    })
    .then(() => {
      console.log('Product deleted successfully');
      res.redirect('/admin/products');
    })
    .catch((err) => console.log(err));
};

exports.getProducts = (req, res, next) => {
  req.user
    .getProducts()
    .then((products) => {
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products',
      });
    })
    .catch((err) => console.log(err));
};

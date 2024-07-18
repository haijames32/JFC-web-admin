const db = require('./db');
const mongooseDelete = require('mongoose-delete');

const userSchema = new db.mongoose.Schema(
   {
      name: { type: String, required: true },
      username: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: Number, required: true },
      passwd: { type: String, required: true },
      dateOfBirth: { type: String, required: true },
      addressDefault: { type: db.mongoose.Schema.Types.ObjectId, ref: 'addressModel', required: false },
   },
   {
      collection: 'user',
      timestamps: true
   },
);

const productSchema = new db.mongoose.Schema(
   {
      name: { type: String, required: true },
      price: { type: Number, required: true },
      image: { type: String, required: true },
      description: { type: String, required: false },
      category: { type: db.mongoose.Schema.Types.ObjectId, ref: 'categoryModel', required: true },
      imageId: { type: String, required: true }
   },
   {
      collection: 'product',
      timestamps: true
   },
);

const categorySchema = new db.mongoose.Schema(
   {
      name: { type: String, required: true },
      image: { type: String, required: true },
   },
   {
      collection: 'category',
      timestamps: true
   },
);

const cartSchema = new db.mongoose.Schema(
   {
      productId: { type: db.mongoose.Schema.Types.ObjectId, ref: 'productModel' },
      userId: { type: db.mongoose.Schema.Types.ObjectId, ref: 'userModel' },
      numOfProduct: { type: Number, required: true },
      total: { type: Number, required: true },
   },
   {
      collection: 'cart',
      timestamps: true
   },
);

const orderSchema = new db.mongoose.Schema(
   {
      userId: { type: db.mongoose.Schema.Types.ObjectId, ref: 'userModel', required: true },
      date: { type: String, required: true },
      status: { type: String, required: true },
      paymentMethod: { type: String, required: true },
      total: { type: Number, required: true },
   },
   {
      collection: 'order',
      timestamps: true
   },
);

const orderDetailsSchema = new db.mongoose.Schema(
   {
      orderId: { type: db.mongoose.Schema.Types.ObjectId, ref: 'orderModel', required: true },
      productId: { type: db.mongoose.Schema.Types.ObjectId, ref: 'productModel', required: true },
      priceOfItem: { type: Number, required: true },
      numOfItem: { type: Number, required: true },
      totalOfItem: { type: Number, required: true },
   },
   {
      collection: 'orderdetails',
      timestamps: true
   },
);

const addressSchema = new db.mongoose.Schema(
   {
      userId: { type: db.mongoose.Schema.Types.ObjectId, ref: 'userModel', required: true },
      street: { type: String, required: true },
      commune: { type: String, required: true },
      district: { type: String, required: true },
      city: { type: String, required: true },
   },
   {
      collection: 'address',
      timestamps: true
   },
);

// Plugin
productSchema.plugin(mongooseDelete, {
   deletedAt: true,
   overrideMethods: 'all'
})

categorySchema.plugin(mongooseDelete, {
   deletedAt: true,
   overrideMethods: 'all'
})

// Create Model
const userModel = db.mongoose.model('userModel', userSchema);
const productModel = db.mongoose.model('productModel', productSchema);
const categoryModel = db.mongoose.model('categoryModel', categorySchema);
const cartModel = db.mongoose.model('cartModel', cartSchema);
const orderModel = db.mongoose.model('orderModel', orderSchema);
const orderDetailsModel = db.mongoose.model('orderDetailsModel', orderDetailsSchema);
const addressModel = db.mongoose.model('addressModel', addressSchema);

module.exports = {
   userModel,
   productModel,
   categoryModel,
   cartModel,
   orderModel,
   orderDetailsModel,
   addressModel
}
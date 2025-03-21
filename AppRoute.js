import express from 'express'
import * as ProductController from './controllers/ProductController'
import * as CategoryController from './controllers/CategoryController'
import * as BrandController from './controllers/BrandController'
import * as OrderController from './controllers/OrderController'
import * as OrderDetailController from './controllers/OrderDetailController'
import asyncHandler from './middlewares/asyncHandler'
const router = express.Router()
export function AppRoute(app) {
  // products
  router.get('/products', ProductController.getProducts)
  router.get('/products/:id', ProductController.getProductById)
  router.post('/products', asyncHandler(ProductController.insertProduct))
  router.put('/products/:id', ProductController.updateProduct)
  router.delete('/products/:id', ProductController.deleteProduct)
  // category
  router.get('/categories', CategoryController.getCategories);
  router.get('/categories/:id', CategoryController.getCategoryById);
  router.post('/categories', CategoryController.insertCategory);
  router.put('/categories/:id', CategoryController.updateCategory);
  router.delete('/categories/:id', CategoryController.deleteCategory);
  // brand
  router.get('/brands', BrandController.getBrands);
  router.get('/brands/:id', BrandController.getBrandById);
  router.post('/brands', BrandController.insertBrand);
  router.put('/brands/:id', BrandController.updateBrand);
  router.delete('/brands/:id', BrandController.deleteBrand);
  // order
  router.get('/orders', OrderController.getOrders);
  router.get('/orders/:id', OrderController.getOrderById);
  router.post('/orders', OrderController.insertOrder);
  router.put('/orders/:id', OrderController.updateOrder);
  router.delete('/orders/:id', OrderController.deleteOrder);
  // order detail
  router.get('/order-details', OrderDetailController.getOrderDetails);
  router.get('/order-details/:id', OrderDetailController.getOrderDetailById);
  router.post('/order-details', OrderDetailController.insertOrderDetail);
  router.put('/order-details/:id', OrderDetailController.updateOrderDetail);
  router.delete('/order-details/:id', OrderDetailController.deleteOrderDetail);
  app.use(router)
}
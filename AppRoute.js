import express from 'express'
import * as UserController from './controllers/UserController'
import * as ProductController from './controllers/ProductController'
import * as CategoryController from './controllers/CategoryController'
import * as BrandController from './controllers/BrandController'
import * as OrderController from './controllers/OrderController'
import * as OrderDetailController from './controllers/OrderDetailController'
import asyncHandler from './middlewares/asyncHandler'
import validate from './middlewares/validate'
import InsertProductRequest from './dtos/requests/product/InsertProductRequest'
import UpdateProductRequest from './dtos/requests/product/UpdateProductRequest'
import InsertOrderRequest from './dtos/requests/order/InserOrderRequest'
import InsertUserRequest from './dtos/requests/user/InsertUserRequest'
const router = express.Router()
export function AppRoute(app) {
  // user
  router.post('/users',
    validate(InsertUserRequest),
    asyncHandler(UserController.insertUser)
  );
  // products
  router.get('/products', asyncHandler(ProductController.getProducts));
  router.get('/products/:id', asyncHandler(ProductController.getProductById));
  router.post('/products',
    validate(InsertProductRequest),
    asyncHandler(ProductController.insertProduct)
  );
  router.put('/products/:id',
    validate(UpdateProductRequest),
    asyncHandler(ProductController.updateProduct));
  router.delete('/products/:id', asyncHandler(ProductController.deleteProduct));

  // category
  router.get('/categories', asyncHandler(CategoryController.getCategories));
  router.get('/categories/:id', asyncHandler(CategoryController.getCategoryById));
  router.post('/categories', asyncHandler(CategoryController.insertCategory));
  router.put('/categories/:id', asyncHandler(CategoryController.updateCategory));
  router.delete('/categories/:id', asyncHandler(CategoryController.deleteCategory));

  // brand
  router.get('/brands', asyncHandler(BrandController.getBrands));
  router.get('/brands/:id', asyncHandler(BrandController.getBrandById));
  router.post('/brands', asyncHandler(BrandController.insertBrand));
  router.put('/brands/:id', asyncHandler(BrandController.updateBrand));
  router.delete('/brands/:id', asyncHandler(BrandController.deleteBrand));

  // order
  router.get('/orders', asyncHandler(OrderController.getOrders));
  router.get('/orders/:id', asyncHandler(OrderController.getOrderById));
  router.post('/orders', 
    validate(InsertOrderRequest),
    asyncHandler(OrderController.insertOrder));
  router.put('/orders/:id', asyncHandler(OrderController.updateOrder));
  router.delete('/orders/:id', asyncHandler(OrderController.deleteOrder));

  // order detail
  router.get('/order-details', asyncHandler(OrderDetailController.getOrderDetails));
  router.get('/order-details/:id', asyncHandler(OrderDetailController.getOrderDetailById));
  router.post('/order-details', asyncHandler(OrderDetailController.insertOrderDetail));
  router.put('/order-details/:id', asyncHandler(OrderDetailController.updateOrderDetail));
  router.delete('/order-details/:id', asyncHandler(OrderDetailController.deleteOrderDetail));
  app.use(router)
}
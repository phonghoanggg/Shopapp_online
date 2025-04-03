import express from 'express'
import * as UserController from './controllers/UserController'
import * as ProductController from './controllers/ProductController'
import * as CategoryController from './controllers/CategoryController'
import * as BrandController from './controllers/BrandController'
import * as OrderController from './controllers/OrderController'
import * as OrderDetailController from './controllers/OrderDetailController'
import * as NewsController from './controllers/NewController'
import * as NewsDetailController from './controllers/NewDetailController'
import * as BannerController from './controllers/BannerController'
import * as BannerDetailController from './controllers/BannerDetailController'
import * as ImagesController from './controllers/ImageController'
import * as ProductImagesController from './controllers/ProductImagesController'
import * as CartController from './controllers/CartController'
import * as CartItemController from './controllers/CartItemController'

// validate dto
import asyncHandler from './middlewares/asyncHandler'
import validate from './middlewares/validate'
import InsertProductRequest from './dtos/requests/product/InsertProductRequest'
import UpdateProductRequest from './dtos/requests/product/UpdateProductRequest'
import InsertOrderRequest from './dtos/requests/order/InserOrderRequest'
import InsertUserRequest from './dtos/requests/user/InsertUserRequest'
import InsertNewsRequest from './dtos/requests/news/InsertNewsRequest'
import InsertNewsDetailRequest from './dtos/requests/newDetail/InsertNewsDetailRequest'
import UpdateNewsRequest from './dtos/requests/news/UpdateNewsRequest'
import InsertBannerRequest from './dtos/requests/banner/InsertBannerRequest'
import InsertBannerDetailRequest from './dtos/requests/bannerDetail/InsertBannerDetailRequest'
import validateImageExitsts from './middlewares/validateImageExitsts'
import InsertProductImagesRequest from './dtos/requests/product_images/InsertProductImagesRequest'
import InsertCartRequest from './dtos/requests/cart/InsertCartRequest'
import InsertCartItemRequest from './dtos/requests/cartItem/InsertCartItemRequest'
import UpdateOrderRequest from './dtos/requests/order/UpdateOrderRequest'
import upload from './middlewares/imageUpload'
import { UserRole } from './constants'
import { requireRoles } from './middlewares/jwtMiddlewares'

const router = express.Router()
export function AppRoute(app) {
  // user
  router.post('/users/register',
    validate(InsertUserRequest),
    asyncHandler(UserController.registerUser)
  );
  router.post('/users/login',
    validate(InsertUserRequest),
    asyncHandler(UserController.loginUser)
  );
  // products
  router.get('/products', asyncHandler(ProductController.getProducts));
  router.get('/products/:id', asyncHandler(ProductController.getProductById));
  router.post('/products',
    requireRoles([UserRole.ADMIN]),
    validateImageExitsts,
    validate(InsertProductRequest),
    asyncHandler(ProductController.insertProduct)
  );
  router.put('/products/:id',
    requireRoles([UserRole.ADMIN]),
    validate(UpdateProductRequest),
    validateImageExitsts,
    asyncHandler(ProductController.updateProduct));
  router.delete('/products/:id', 
    requireRoles([UserRole.ADMIN]),
    asyncHandler(ProductController.deleteProduct));

  // category
  router.get('/categories', asyncHandler(CategoryController.getCategories));
  router.get('/categories/:id', asyncHandler(CategoryController.getCategoryById));
  router.post('/categories',
    requireRoles([UserRole.ADMIN]),
    validateImageExitsts, 
    asyncHandler(CategoryController.insertCategory));
  router.put('/categories/:id', 
    requireRoles([UserRole.ADMIN]),
    validateImageExitsts, 
    asyncHandler(CategoryController.updateCategory));
  router.delete('/categories/:id', 
    requireRoles([UserRole.ADMIN]),
    asyncHandler(CategoryController.deleteCategory));

  // brand
  router.get('/brands', asyncHandler(BrandController.getBrands));
  router.get('/brands/:id', asyncHandler(BrandController.getBrandById));
  router.post('/brands',validateImageExitsts, asyncHandler(BrandController.insertBrand));
  router.put('/brands/:id', validateImageExitsts, asyncHandler(BrandController.updateBrand));
  router.delete('/brands/:id', 
    requireRoles([UserRole.ADMIN]),
    asyncHandler(BrandController.deleteBrand));

  // order
  router.get('/orders', asyncHandler(OrderController.getOrders));
  router.get('/orders/:id', asyncHandler(OrderController.getOrderById));
  // router.post('/orders', 
  //   validate(InsertOrderRequest),
  //   asyncHandler(OrderController.insertOrder));
  router.put('/orders/:id',
    requireRoles([UserRole.ADMIN, UserRole.USER]),
    validate(UpdateOrderRequest),
    asyncHandler(OrderController.updateOrder));
  router.delete('/orders/:id', 
    requireRoles([UserRole.ADMIN]),
    asyncHandler(OrderController.deleteOrder));

  // order detail
  router.get('/order-details', asyncHandler(OrderDetailController.getOrderDetails));
  router.get('/order-details/:id', asyncHandler(OrderDetailController.getOrderDetailById));
  router.post('/order-details', 
    requireRoles([UserRole.ADMIN]),
    asyncHandler(OrderDetailController.insertOrderDetail));
  router.put('/order-details/:id', asyncHandler(OrderDetailController.updateOrderDetail));
  router.delete('/order-details/:id', 
    requireRoles([UserRole.ADMIN]),
    asyncHandler(OrderDetailController.deleteOrderDetail));

  // Cart routes
  router.get('/carts', asyncHandler(CartController.getCarts));
  router.get('/carts/:id', asyncHandler(CartController.getCartById));
  router.post('/carts',
    requireRoles([UserRole.ADMIN]),
    validate(InsertCartRequest),
    asyncHandler(CartController.insertCart));
  router.post('/carts/checkout', asyncHandler(CartController.checkoutCart));
  router.delete('/carts/:id', 
    requireRoles([UserRole.USER]),
    asyncHandler(CartController.deleteCart));


  // CartItem routes
  router.get('/cart-items', asyncHandler(CartItemController.getCartItems));
  router.get('/cart-items/:id', asyncHandler(CartItemController.getCartItemsByCartId));
  router.get('/cart-items/carts/:cart_id', asyncHandler(CartItemController.getCartItemsByCartId));
  router.post('/cart-items',
    requireRoles([UserRole.USER]),
    validate(InsertCartItemRequest),
    asyncHandler(CartItemController.insertCartItem));
  router.put('/cart-items/:id', 
    requireRoles([UserRole.USER]),
    asyncHandler(CartItemController.updateCartItem));
  router.delete('/cart-items/:id', 
    requireRoles([UserRole.USER, UserRole.ADMIN]),
    asyncHandler(CartItemController.deleteCartItem));

  // news
  router.get('/news', asyncHandler(NewsController.getNews));
  router.get('/news/:id', asyncHandler(NewsController.getNewsById));
  router.post('/news',
    requireRoles([UserRole.USER, UserRole.ADMIN]),
    validateImageExitsts,
    validate(InsertNewsRequest),
    asyncHandler(NewsController.insertNews));
  router.put('/news/:id', 
    requireRoles([UserRole.USER, UserRole.ADMIN]),
    validate(UpdateNewsRequest),
    validateImageExitsts, 
    asyncHandler(NewsController.updateNews));
  router.delete('/news/:id', 
    requireRoles([UserRole.USER, UserRole.ADMIN]),
    asyncHandler(NewsController.deleteNews));
  app.use(router)
}
// News Detail
  router.get("/news-details", asyncHandler(NewsDetailController.getNewsDetails));
  router.get("/news-details/:id", asyncHandler(NewsDetailController.getNewsDetailById));
  router.post("/news-details", 
    requireRoles([UserRole.USER, UserRole.ADMIN]),
    validate(InsertNewsDetailRequest),
    asyncHandler(NewsDetailController.insertNewsDetail));
  router.put("/news-details/:id",
    requireRoles([UserRole.USER, UserRole.ADMIN]),
    validate(UpdateNewsRequest),
    asyncHandler(NewsDetailController.updateNewsDetail));
  router.delete("/news-details/:id", 
    requireRoles([UserRole.ADMIN]),
    asyncHandler(NewsDetailController.deleteNewsDetail));

  // banner
  router.get('/banners', asyncHandler(BannerController.getBanners));
  router.get('/banners/:id', asyncHandler(BannerController.getBannerById));
  router.post('/banners', 
    requireRoles([UserRole.ADMIN]),
    validate(InsertBannerRequest),
    validateImageExitsts,
    asyncHandler(BannerController.insertBanner));
  router.put('/banners/:id', 
    requireRoles([UserRole.ADMIN]),
    validateImageExitsts,
    asyncHandler(BannerController.updateBanner));
  router.delete('/banners/:id', 
    requireRoles([UserRole.ADMIN]),
    asyncHandler(BannerController.deleteBanner));

  // banner detail
  router.get('/banner-details', asyncHandler(BannerDetailController.getBannerDetails));
  router.get('/banner-details/:id', asyncHandler(BannerDetailController.getBannerDetailById));
  router.post('/banner-details',
    requireRoles([UserRole.ADMIN]),
     validate(InsertBannerDetailRequest),
     asyncHandler(BannerDetailController.insertBannerDetail));
  router.put('/banner-details/:id', 
    asyncHandler(BannerDetailController.updateBannerDetail));
  router.delete('/banner-details/:id', 
    requireRoles([UserRole.ADMIN]),
    asyncHandler(BannerDetailController.deleteBannerDetail));

  // Upload file
  router.post('/images/upload', upload.array('images', 5),asyncHandler(ImagesController.uploadImages))
  router.get('/images/:fileName', asyncHandler(ImagesController.viewImage));
  router.get('/images/:id', asyncHandler(ImagesController.deleteImages));

  // product images
  router.get("/product-images", asyncHandler(ProductImagesController.getProductImages));
  router.get("/product-images/:id", asyncHandler(ProductImagesController.getProductImageById));
  router.post("/product-images",
    requireRoles([UserRole.ADMIN]),
    validate(InsertProductImagesRequest),
    asyncHandler(ProductImagesController.insertProductImage));
  router.delete("/product-images/:id", asyncHandler(ProductImagesController.deleteProductImage));
  
  export default router;
  
from django.urls import path,include
from rest_framework_nested import routers
from . import views
from pprint import pprint
from .views import CartItemViewSet

router=routers.DefaultRouter()
router.register('products',views.productViewSet,basename='products')
router.register('collections',views.collectionViewSet)
router.register('customer',views.CustomerViewSet)
router.register('cart',views.CartViewSet,basename='cart')
router.register('orders',views.OrderViewSet,basename='orders')
router.register('customer-reviews',views.CustomerReviewsViewSet)

product_router=routers.NestedDefaultRouter(router,'products',lookup='product')
product_router.register('reviews',views.ReviewsViewSet,basename='product-reviews')
product_router.register('images',views.ProductImageViewSet,basename='product-images')

cart_router=routers.NestedDefaultRouter(router,'cart',lookup='cart')
cart_router.register('items',views.CartItemViewSet,basename='cart-items')

#pprint(router.urls)



urlpatterns = [
    path('',include(router.urls)),
    path('',include(product_router.urls)),
    path('',include(cart_router.urls)),
    path('emails/',views.SendEmails.as_view())
    #path('cart/<str:cart_pk>/items/<str:method>/', views.CartItemViewSet.as_view({'post': 'get_serializer_contex'}), name='cart-item-create'),
    

    
   
]


'''[<URLPattern '^product/$' [name='product-list']>,
 <URLPattern '^product/(?P<pk>[^/.]+)/$' [name='product-detail']>,
 <URLPattern '^collections/$' [name='collection-list']>,
 <URLPattern '^collections/(?P<pk>[^/.]+)/$' [name='collection-detail']>]'''
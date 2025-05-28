from django.shortcuts import render,get_object_or_404
from django.db.models import Count
from rest_framework.response import Response
from rest_framework.decorators import api_view,action
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated,IsAdminUser,AllowAny
from rest_framework import status
from rest_framework.generics import ListCreateAPIView,mixins,GenericAPIView
from rest_framework.viewsets import ModelViewSet,GenericViewSet
from .models import Product,Collection,OrderItem,Customer,Order,Reviews,Cart,CartItem,ProductImage
from .serializer import CustomerSerializerGet,CustomerImageSerializer,productSerializer,collectionSerializer,\
                        CustomerSerializer,SpecialCartItemSerializer,\
                        OrderSerializer,ReviewsSerializer,CartSerializer,\
                        CartItemSerializer,AddCartItemsSerializer,CreateOrderSerializer,UpdateOrderSerializer,ProductImageSerializer,CustomerReviewSerializer
from .permission import IsAdminAndReadOnly,IsAdminIsAuthenticatedAndReadOnly
from django_filters.rest_framework import DjangoFilterBackend 
from rest_framework.filters import SearchFilter,OrderingFilter
from .filters import ProductFilter
from templated_mail.mail import BaseEmailMessage




class productViewSet(ModelViewSet):
    queryset=Product.objects.all()
    serializer_class=productSerializer
    permission_classes=[IsAdminAndReadOnly]
    filter_backends=[DjangoFilterBackend,SearchFilter,OrderingFilter]
    filterset_class=ProductFilter
    search_fields = ['title']
    ordering_fields = ['unit_price']



    def get_serializer_context(self):
        return{'request':self.request,'method':self.kwargs.get('method')}
   
    def destroy(self, request, *args, **kwargs):
        if Product.objects.filter(orderitem__product_id=kwargs['pk']).count()>0:
            return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)
        return  super().destroy(request,{'w':'product deletd'}, *args, **kwargs)


class ProductImageViewSet(ModelViewSet):
    serializer_class=ProductImageSerializer

    def get_queryset(self):
        return ProductImage.objects.filter(product=self.kwargs['product_pk'])
    
    def get_serializer_context(self):
        return {'product_id':self.kwargs['product_pk']}
    

    

    '''def delete(self,request,id):
        product=get_object_or_404(Product,pk=id)
        if product.orderitem_set.count()>0:
            return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)
        serialize=product.delete()
        return Response({'error':'Product is deleted'})'''
    



class collectionViewSet(ModelViewSet):
    queryset=Collection.objects.annotate(product_count=Count('products')).all()
    serializer_class=collectionSerializer
    permission_classes=[IsAdminAndReadOnly]

    def delete(self,request,pk):
        collection=get_object_or_404(Collection,pk=pk)
        if collection.products.count()>0:
            return Response({'warning':'cannot be deleted'},status=status.HTTP_405_METHOD_NOT_ALLOWED)
        collection.delete()
        return Response({'error':'Product is deleted'})
    


class CustomerViewSet(ModelViewSet):
     queryset=Customer.objects.all()
     serializer_class=CustomerSerializer
     permission_classes=[IsAdminUser]


         

     @action(detail=False,methods=['GET','PUT','PATCH'],permission_classes=[IsAuthenticated])
     def me(self,request):
          (customer,create)=Customer.objects.get_or_create(user_id=request.user.id)
          if request.method=='GET':
            serialize=CustomerSerializerGet(customer)
            return Response(serialize.data)
          
          elif request.method=='PUT':
              serialize=CustomerSerializer(customer,data=request.data)
              serialize.is_valid(raise_exception=True)
              serialize.save()
              return Response(serialize.data)
          elif request.method=='PATCH':
              serialize=CustomerImageSerializer(customer,data=request.data)
              serialize.is_valid(raise_exception=True)
              serialize.save()
              return Response(serialize.data)

     @action(detail=True)     
     def myprofile(self,request):
         return Response('Ok')
        
          

class ReviewsViewSet(ModelViewSet):
    #permission_classes=[IsAdminIsAuthenticatedAndReadOnly]
    serializer_class=ReviewsSerializer
    
    def get_queryset(self):
        return Reviews.objects.filter(product_id=self.kwargs['product_pk'])
    
    def get_serializer_context(self):
        user_id=self.request.user.id
        return {'product_pk':self.kwargs['product_pk'],'user_id':user_id}
    

class CartViewSet(mixins.CreateModelMixin,mixins.RetrieveModelMixin,GenericViewSet,mixins.DestroyModelMixin):
    queryset=Cart.objects.prefetch_related('items__product')
    serializer_class=CartSerializer
    
    def create(self, request, *args, **kwargs):
        serializer=CartSerializer(data=request.data,context={'user_id':self.request.user.id})
        serializer.is_valid(raise_exception=True)
        cart=serializer.save()
        serializer=CartSerializer(cart)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    '''def get_serializer_class(self):
        if self.request.method=='POST':
            return CartCreateSerializer
        return CartSerializer'''
    

    
    '''def get_serializer_context(self):
        return {"user_id":self.request.user.id}'''
              
    


class CartItemViewSet(ModelViewSet):
    http_method_names=['get','post','patch','delete']
    def get_queryset(self):
        return CartItem.objects.filter(cart_id=self.kwargs['cart_pk']).select_related('product')
    
    def get_serializer_class(self):
        
        if self.request.method=='POST':
            return AddCartItemsSerializer
        elif self.request.method=='PATCH':
            return SpecialCartItemSerializer
        return CartItemSerializer

    def get_serializer_context(self):
        return {'cart_id':self.kwargs['cart_pk']}
    

class OrderViewSet(ModelViewSet):

    http_method_names=['get','post','patch','delete','head','options']

    def get_queryset(self):
        if self.request.user.is_staff:
            return Order.objects.all()
        (customer,created)=Customer.objects.get_or_create(user_id=self.request.user.id)
        return Order.objects.filter(customer=customer)
    
    def create(self, request, *args, **kwargs):
        serializer=CreateOrderSerializer(data=request.data,context={'user_id':self.request.user.id})
        serializer.is_valid(raise_exception=True)
        order=serializer.save()
        print(order)
        serializer=OrderSerializer(order)
        return Response(serializer.data)

    
    def get_serializer_class(self):
        if self.request.method=='POST':
            return CreateOrderSerializer
        elif self.request.method=="PATCH":
            return UpdateOrderSerializer
        return OrderSerializer
    
    def get_permissions(self):
        if self.request.method in ['DELETE','PATCH']:
            return [IsAdminUser()]
        return [IsAuthenticated()]
    

class CustomerReviewsViewSet( mixins.ListModelMixin,GenericViewSet):
    serializer_class=CustomerReviewSerializer
    queryset=Customer.objects.all()


def Send_Email(request):
    queryset=Product.objects.filter(collection_id=3)

    return render(request, 'hello.html', {'products': queryset})

class SendEmails(APIView):
    def post(self,request,format=None):
            user_id=self.request.user.email
            user_name=self.request.user.first_name
            
            print(user_id)

            
            try:
                message=BaseEmailMessage(template_name='Emails/email.html',context={'name':user_name})
                message.send([f"{user_id}"])
            except :
                    pass
            return Response(f'{user_id}')
    











'''
class ProductName(APIView):
    def get(self,request,id):
        product=get_object_or_404(Product,pk=id)
        serialize=productSerializer(product,context={'request': request})
        return Response(serialize.data)
    
    def put(self,request,id):
        product=get_object_or_404(Product,pk=id)
        serialize=productSerializer(product,data=request.data)
        serialize.is_valid(raise_exception=True)
        serialize.save()
        return Response(serialize.data,status=status.HTTP_426_UPGRADE_REQUIRED)
    
    def delete(self,request,id):
        product=get_object_or_404(Product,pk=id)
        if product.orderitem_set.count()>0:
            return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)
        serialize=product.delete()
        return Response({'error':'Product is deleted'})'''



'''class ProductList(ListCreateAPIView):
    queryset=Product.objects.select_related('collection').all()
    serializer_class=productSerializer
    #def get_queryset(self):
            #return Product.objects.select_related('collection').all()
        
    #def get_serializer_class(self):
            #return productSerializer
        
    def get_serializer_context(self):
            return {'request':self.request}'''
        
'''class ProductList(APIView):
    def get(self,request):
        product=Product.objects.select_related('collection').all()
        serialize=productSerializer(product,many=True,context={'request': request})
        return Response(serialize.data)
    
    def post(self,request):
        serialize=productSerializer(data=request.data)
        serialize.is_valid(raise_exception=True)
        serialize.save()
        return Response(serialize.data)'''








'''@api_view(['GET','PUT','DELETE'])
def collection_details(request,pk):
    collection=get_object_or_404(Collection,pk=pk)
    if request.method=='GET':
        serialize=collectionSerializer(collection)
        return Response(serialize.data)
    
    if request.method=='PUT':
        serialize=collectionSerializer(collection,data=request.data)
        serialize.is_valid(raise_exception=True)
        serialize.save()
        return Response(serialize.data,status=status.HTTP_426_UPGRADE_REQUIRED)
    
    if request.method=='DELETE':
        if collection.products.count()>0:
            return Response({'warning':'cannot be deleted'},status=status.HTTP_405_METHOD_NOT_ALLOWED)

        collection.delete()
        return Response({'error':'Item is deleted'})


    

class CollectionList(ListCreateAPIView):

    queryset=Collection.objects.annotate(product_count=Count('products')).all()
    serializer_class=collectionSerializer'''
    







'''@api_view(['GET','POST'])
def Collection_list(request):
    collection=Collection.objects.annotate(product_count=Count('product')).all()
    if request.method=="GET":
        serialize=collectionSerializer(collection,many=True)
        return Response(serialize.data)
    
    elif request.method=='POST':
        serialize=collectionSerializer(request.data)
        serialize.is_valid(raise_exception=True)
        serialize.save()
        return Response(serialize.data,status=status.HTTP_201_CREATED)'''


        
    




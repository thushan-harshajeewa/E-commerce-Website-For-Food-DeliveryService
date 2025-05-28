from django.db import transaction
from rest_framework import serializers
from .models import Product,Collection,Customer,Order,OrderItem,Reviews,Cart,CartItem,ProductImage
from decimal import Decimal
from core.serializers import UserSerializer



class collectionSerializer(serializers.ModelSerializer):
    class Meta:
        model=Collection
        fields=['id','title','product_count']
    product_count=serializers.IntegerField(read_only=True)
    


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model=ProductImage
        fields=['id','image']

    def create(self, validated_data):
        product_id=self.context['product_id']
        return ProductImage.objects.create(product_id=product_id,**validated_data)


class productSerializer(serializers.ModelSerializer):

    images=ProductImageSerializer(many=True,read_only=True)

    class Meta:
        model=Product
        fields=['id','title','unit_price','description','collection','full_price','slug','inventory','unit_price_with_tax','images']
    

    #price=serializers.DecimalField(max_digits=10,decimal_places=7,source='unit_price')
    unit_price_with_tax=serializers.SerializerMethodField(method_name='get_unit_price_with_tax')
    #collection=serializers.HyperlinkedRelatedField(queryset=Collection.objects.all()
                                                   #, view_name='collection_details')

   

    def get_unit_price_with_tax(self, product:Product):
        return product.unit_price * Decimal(2.5)
    
class CustomerReviewSerializer(serializers.ModelSerializer):
    
    user=UserSerializer(read_only=True)

    class Meta:
        model=Customer 
        
        fields=['id','phone','birth_date','membership','image','user']    

class ReviewsSerializer(serializers.ModelSerializer):
    
    customer=CustomerReviewSerializer(read_only=True)
    
    class Meta:
        model=Reviews
        fields=['id','description','date','customer']

    def create(self, validated_data):
        customer_id=Customer.objects.get(user_id=self.context['user_id'])
        return Reviews.objects.create(product_id=self.context['product_pk'],customer=customer_id,**validated_data)


class CustomerSerializerGet(serializers.ModelSerializer):
    user_id=serializers.IntegerField(read_only=True) 
    
    
    class Meta:
        model=Customer 
        
        fields=['id','user_id','phone','birth_date','address','membership','image']

class CustomerSerializer(serializers.ModelSerializer):
    user_id=serializers.IntegerField(read_only=True) 
    
    
    class Meta:
        model=Customer 
        
        fields=['id','user_id','phone','birth_date','address','membership']

class CustomerImageSerializer(serializers.ModelSerializer):
    
    class Meta:
        model=Customer 
        
        fields=['image']

class CustomerReviewSerializer(serializers.ModelSerializer):
    
    

    class Meta:
        model=Customer 
        
        fields=['id','user_id','phone','birth_date','membership']








    
class CartProductSerializer(serializers.ModelSerializer):
    class Meta:
        model=Product
        fields=['id','title','unit_price','full_price']    


class CartItemSerializer(serializers.ModelSerializer):
    product=productSerializer(read_only=True)
    Total_price=serializers.SerializerMethodField()
    
    

    def get_Total_price(self,cartitem:CartItem):
        return cartitem.quantity*cartitem.unit_price
    
    class Meta:
        model=CartItem
        fields=['id','quantity','product','unit_price','item_price_method','Total_price']




class CartSerializer(serializers.ModelSerializer):
    items=CartItemSerializer(many=True,read_only=True)
    id=serializers.UUIDField(read_only=True)
    Total_price=serializers.SerializerMethodField()
    
    

    def get_Total_price(self,cart:Cart):
        return sum([item.quantity*item.unit_price for item in cart.items.all()])


    class Meta:
        model=Cart
        fields=['id','created_at','items','Total_price']
    
    def save(self, **kwargs):
        with transaction.atomic():
            user=self.context['user_id']
            if user:
                (customer,create)=Customer.objects.get_or_create(user_id=user)
                (cart,create)=Cart.objects.get_or_create(customer=customer)
                return cart
            cart=Cart.objects.create(customer=None)
            return cart






            



                
            

    
            


class AddCartItemsSerializer(serializers.ModelSerializer):
    product_id=serializers.IntegerField()
    unit_price=serializers.DecimalField(max_digits=10,decimal_places=3,read_only=True)

    def validate_product_id(self,value):
        if not Product.objects.filter(pk=value).exists():
            raise serializers.ValidationError('No Product With the Id')
        return value

    class Meta:
        model=CartItem
        fields=['id','product_id','quantity','unit_price','item_price_method']

    def save(self, **kwargs):
        cart_id=self.context['cart_id']
        product_id=self.validated_data['product_id']
        quantity=self.validated_data['quantity']
        method=self.validated_data['item_price_method']
        product=Product.objects.get(id=product_id)

        try:
            cart_item=CartItem.objects.get(cart_id=cart_id,product_id=product_id,item_price_method=method)
            cart_item.quantity+=quantity
            cart_item.save()
            self.instance=cart_item
            return self.instance

        except:
            if method=='normal':
                cart_item=CartItem.objects.create(cart_id=cart_id,unit_price=product.unit_price,**self.validated_data)
            elif method=='full':
                cart_item=CartItem.objects.create(cart_id=cart_id,unit_price=product.full_price,**self.validated_data)
            self.instance=cart_item
            return self.instance
  
class SpecialCartItemSerializer(serializers.ModelSerializer):
    class Meta:
        model=CartItem
        fields=['quantity']


class OrderItemSerializer(serializers.ModelSerializer):
    product=CartProductSerializer()
    class Meta:
        model=OrderItem
        fields=['id','product','quantity','unit_price','order_id','item_price_method'] 



class OrderSerializer(serializers.ModelSerializer):
    items=OrderItemSerializer(many=True)
    customer_id=serializers.IntegerField(read_only=True)
    Total_price=serializers.SerializerMethodField()
    
    

    def get_Total_price(self,order:Order):
        return sum([item.quantity*item.unit_price for item in order.items.all()])

    class Meta:
        model=Order
        fields=['id','placed_at','order_status','customer_id','items','Total_price']

class CreateOrderSerializer(serializers.Serializer):
    cart_id=serializers.UUIDField()
    address=serializers.CharField()


        
    def validate_cart_id(self, data):
        if not Cart.objects.filter(pk=data).exists():
            raise serializers.ValidationError('No Cart ID')
        if CartItem.objects.filter(cart=data).count()==0:
            raise serializers.ValidationError('Cart has no Items')
        return data
    

    
    def save(self, **kwargs):

        with transaction.atomic():
            (customer,created)=Customer.objects.get_or_create(user_id=self.context['user_id'])
            order=Order.objects.create(customer=customer,address=self.validated_data['address'])
            cartitem=CartItem.objects.select_related('product').filter(cart=self.validated_data['cart_id'])
            #[OrderItem.objects.create(order=order,quantity=item.quantity,
                                    #unit_price=item.product.unit_price,product_id=item.product.pk) for item in cartitem]
            item_list=[OrderItem(order=order,quantity=item.quantity,
                                    unit_price=item.unit_price,product=item.product,item_price_method=item.item_price_method) for item in cartitem]
            OrderItem.objects.bulk_create(item_list)
            Cart.objects.get(pk=self.validated_data['cart_id']).delete()
            return order
        
class UpdateOrderSerializer(serializers.ModelSerializer):
    class Meta:
        model=Order
        fields=['payment_status']
        
        


    
    
     
    





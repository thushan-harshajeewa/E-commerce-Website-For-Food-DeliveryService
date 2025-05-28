from djoser.serializers import  UserCreateSerializer as BaseUserCreateSerializer,UserSerializer as BaseUserSerializeer

class UserCreateSerializer(BaseUserCreateSerializer):
    class Meta(BaseUserCreateSerializer.Meta):
        fields=['id','first_name','last_name','email','password']
        read_only_fields = ('id',)
        


class UserSerializer(BaseUserSerializeer):
    class Meta(BaseUserSerializeer.Meta):
        fields=['id','first_name','last_name','email']
        read_only_fields = ('id',)
        


from rest_framework import serializers
from .models import User, Business, Payment

# serializers.py
from rest_framework import serializers
from .models import User
from rest_framework import serializers
from .models import User

class BusinessSerializer(serializers.ModelSerializer):
    class Meta:
        model = Business
        fields = "__all__"

class AdminUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'first_name',
            'last_name',
            'address',
            'role'
        ]



class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'address', 'role', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)  # <-- this hashes it
        user.save()
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance
    



class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ['id','business','amount','payment_date','status']


class AdminPaymentSerializer(serializers.ModelSerializer):
    business_name = serializers.CharField(
        source="business.business_name",
        read_only=True
    )
    first_name = serializers.CharField(
        source="business.user.first_name",
        read_only=True
    )
    last_name = serializers.CharField(
        source="business.user.last_name",
        read_only=True
    )

    class Meta:
        model = Payment
        fields = [
            "id",
            "business_name",
            "first_name",
            "last_name",
            "amount",
            "status",
            "payment_date",
        ]


# serializers.py
class BusinessPaymentStatusSerializer(serializers.ModelSerializer):
    user_first_name = serializers.CharField(source='user.first_name', read_only=True)
    user_last_name = serializers.CharField(source='user.last_name', read_only=True)
    amount = serializers.SerializerMethodField()

    class Meta:
        model = Business
        fields = ['id', 'business_name', 'status', 'user_first_name', 'user_last_name', 'amount']

    def get_amount(self, obj):
        # toa amount ya last payment kama ipo
        last_payment = obj.payments.order_by('-payment_date').first()
        return last_payment.amount if last_payment else 0


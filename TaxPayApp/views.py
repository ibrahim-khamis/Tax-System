from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated

from django.shortcuts import render
from django.db.models import Sum
from rest_framework import viewsets
from .models import User, Business, Payment
from .serializers import UserSerializer, BusinessSerializer, PaymentSerializer
from .models import User
from .serializers import (
    UserSerializer,
    BusinessSerializer,
    PaymentSerializer,
    AdminUserSerializer,  
    AdminPaymentSerializer,
    
)

from .serializers import BusinessPaymentStatusSerializer


# API endpoints

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from .serializers import UserSerializer
from rest_framework.authtoken.models import Token


from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import User, Business, Payment
from rest_framework.authentication import TokenAuthentication


class IsAdminRole(IsAuthenticated):
    def has_permission(self, request, view):
        if not super().has_permission(request, view):
            return False
        user = request.user
        return bool(getattr(user, "is_superuser", False) or getattr(user, "is_staff", False) or getattr(user, "role", None) == "admin")

class LoginAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        if not username or not password:
            return Response({"error": "Username and password are required"}, status=status.HTTP_400_BAD_REQUEST)

        username = str(username).strip()
        password = str(password)

        # authenticate user
        user = authenticate(username=username, password=password)

        if not user:
            user = User.objects.filter(username__iexact=username).first()
            if not user or not user.check_password(password):
                user = None

        if user:
            effective_role = "admin" if (user.is_superuser or user.is_staff) else user.role
            if effective_role == "admin" and user.role != "admin":
                user.role = "admin"
                user.save(update_fields=["role"])
            # token
            token, created = Token.objects.get_or_create(user=user)
            return Response({
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "role": effective_role
                },
                "token": token.key
            })

        return Response({"error": "Invalid username or password"}, status=status.HTTP_401_UNAUTHORIZED)


class UserProfileAPIView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        effective_role = "admin" if (user.is_superuser or user.is_staff) else user.role

        # Business info
        businesses = user.businesses.all().values(
            'id','business_name', 'business_type', 'location', 'status'
        )

        # Payments
        payments = []
        for b in user.businesses.all():
            for p in b.payments.all():
                payments.append({
                    'business_name': b.business_name,
                    'amount': p.amount,
                    'date': p.payment_date,
                    'status': p.status
                })

        data = {
            'id': user.id,
            'username': user.username,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'address': user.address,
            'role': effective_role,
            'businesses': list(businesses),
            'payments': payments
        }

        return Response(data)


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        user = self.request.user
        if self.action in {"create", "update", "partial_update"}:
            return UserSerializer
        if user.is_authenticated and (user.is_superuser or user.is_staff or user.role == "admin"):
            return AdminUserSerializer
        return UserSerializer


class BusinessViewSet(viewsets.ModelViewSet):
    queryset = Business.objects.all()
    serializer_class = BusinessSerializer

class PaymentViewSet(viewsets.ModelViewSet):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    queryset = Payment.objects.select_related(
        "business",
        "business__user"
    )

    def get_serializer_class(self):
        user = self.request.user
        if user.is_superuser or user.is_staff or user.role == "admin":
            return AdminPaymentSerializer
        return PaymentSerializer


    def perform_create(self, serializer):
        payment = serializer.save()
        business = payment.business
        business.status = "paid"
        business.save()



class AdminDashboardStatsAPIView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAdminRole]

    def get(self, request):
        user = request.user

        total_users = User.objects.count()
        paid_businesses = Business.objects.filter(status="paid").count()
        unpaid_businesses = Business.objects.filter(status="not paid").count()

        total_revenue = (
            Payment.objects
            .filter(status="paid")
            .aggregate(total=Sum("amount"))["total"] or 0
        )

        return Response({
            "total_users": total_users,
            "paid": paid_businesses,
            "unpaid": unpaid_businesses,
            "total_revenue": total_revenue
        })
    

class AdminBusinessStatusViewSet(viewsets.ReadOnlyModelViewSet):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAdminRole]

    queryset = Business.objects.select_related('user').all() 
    serializer_class = BusinessPaymentStatusSerializer





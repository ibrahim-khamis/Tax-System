# app/urls.py
from django.urls import path
from .views import UserProfileAPIView
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, BusinessViewSet, PaymentViewSet, LoginAPIView
from .views import AdminDashboardStatsAPIView
from .views import AdminBusinessStatusViewSet

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'businesses', BusinessViewSet)  # only once
router.register(r'payments', PaymentViewSet)
router.register(
    r'admin-business-status',
    AdminBusinessStatusViewSet,
    basename='admin-business-status'
)


urlpatterns = [
    path("login/", LoginAPIView.as_view(), name="login"),
    path("profile/", UserProfileAPIView.as_view(), name="profile"),  
    path("dashboard-stats/", AdminDashboardStatsAPIView.as_view()),
]

urlpatterns += router.urls

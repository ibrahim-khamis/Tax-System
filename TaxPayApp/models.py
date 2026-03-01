from django.db import models

from django.db import models
from django.contrib.auth.models import AbstractUser

# ========================
# User model (profile + auth)
# ========================
class User(AbstractUser):
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('customer', 'Customer'),
    )
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    address = models.TextField()
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='customer')

    def __str__(self):
        return f"{self.first_name} {self.last_name}"


# ========================
# Business model
# ========================
class Business(models.Model):
    STATUS_CHOICES = (
        ('paid', 'Paid'),
        ('not paid', 'Not Paid'),
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='businesses')
    business_name = models.CharField(max_length=100)
    business_type = models.CharField(max_length=50)
    location = models.CharField(max_length=100)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='not paid')

    def __str__(self):
        return f"{self.business_name} ({self.status})"


# ========================
# Payment model
# ========================
class Payment(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('paid', 'Paid'),
    )
    business = models.ForeignKey(Business, on_delete=models.CASCADE, related_name='payments')
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    payment_date = models.DateField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')

    def __str__(self):
        return f"{self.business.business_name} - {self.status} - {self.amount}"

# Create your models here.

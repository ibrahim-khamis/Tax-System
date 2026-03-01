from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as DjangoUserAdmin

from .models import User, Business, Payment


@admin.register(User)
class UserAdmin(DjangoUserAdmin):
    model = User
    list_display = ("username", "first_name", "last_name", "role", "is_staff", "is_superuser")
    list_filter = ("role", "is_staff", "is_superuser", "is_active")
    fieldsets = DjangoUserAdmin.fieldsets + (
        ("Profile", {"fields": ("address", "role")}),
    )
    add_fieldsets = DjangoUserAdmin.add_fieldsets + (
        ("Profile", {"fields": ("first_name", "last_name", "address", "role")}),
    )


admin.site.register(Business)
admin.site.register(Payment)


# Register your models here.

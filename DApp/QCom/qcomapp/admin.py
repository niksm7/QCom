from django.contrib import admin
from .models import WebUser, Cart, Orders,Transaction
# Register your models here.

admin.site.register(WebUser)
admin.site.register(Cart)
admin.site.register(Orders)
admin.site.register(Transaction)
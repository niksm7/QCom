# Generated by Django 3.2.9 on 2024-10-26 12:04

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='WebUser',
            fields=[
                ('id', models.TextField(primary_key=True, serialize=False)),
                ('full_name', models.CharField(max_length=100)),
                ('request_seller', models.BooleanField(default=False)),
                ('seller_id', models.CharField(blank=True, default='', max_length=200, null=True)),
                ('aadhaar_link', models.URLField(blank=True, default='', null=True)),
                ('account_address', models.CharField(blank=True, default='', max_length=50, null=True)),
                ('group', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='auth.group')),
            ],
        ),
        migrations.CreateModel(
            name='Orders',
            fields=[
                ('seller_address', models.CharField(default='', max_length=50)),
                ('buyer_address', models.CharField(default='', max_length=50)),
                ('order_id', models.CharField(max_length=100, primary_key=True, serialize=False)),
                ('items_json', models.CharField(max_length=5000)),
                ('item_ids', models.TextField(default='')),
                ('amount', models.FloatField(default=0)),
                ('name', models.CharField(max_length=90)),
                ('email', models.CharField(max_length=111)),
                ('address', models.CharField(max_length=111)),
                ('city', models.CharField(max_length=111)),
                ('state', models.CharField(max_length=111)),
                ('zip_code', models.CharField(max_length=111)),
                ('phone', models.CharField(default='', max_length=111)),
                ('buyer_delivered', models.BooleanField(default=False)),
                ('seller_delivered', models.BooleanField(default=False)),
                ('order_date', models.DateTimeField(auto_now_add=True)),
                ('user', models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='qcomapp.webuser')),
            ],
        ),
        migrations.CreateModel(
            name='Cart',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('cart', models.TextField(blank=True, null=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='qcomapp.webuser')),
            ],
        ),
    ]
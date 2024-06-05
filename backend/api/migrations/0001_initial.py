# Generated by Django 5.0.6 on 2024-06-05 03:00

import django.core.validators
import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Chain',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
            ],
        ),
        migrations.CreateModel(
            name='ChainUser',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('order', models.PositiveIntegerField()),
                ('chain', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.chain')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ['order'],
            },
        ),
        migrations.AddField(
            model_name='chain',
            name='users',
            field=models.ManyToManyField(through='api.ChainUser', to=settings.AUTH_USER_MODEL),
        ),
        migrations.CreateModel(
            name='Description',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('description', models.TextField(max_length=100)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('author', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='descriptions', to=settings.AUTH_USER_MODEL)),
                ('chain', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.chain')),
            ],
        ),
        migrations.CreateModel(
            name='Drawing',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('drawing', models.FileField(upload_to='')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('author', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='drawings', to=settings.AUTH_USER_MODEL)),
                ('chain', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.chain')),
            ],
        ),
        migrations.CreateModel(
            name='Session',
            fields=[
                ('game_code', models.IntegerField(default=0, primary_key=True, serialize=False, unique=True, validators=[django.core.validators.MinValueValidator(0), django.core.validators.MaxValueValidator(999999)])),
                ('draw_time', models.IntegerField(choices=[(30, '30 seconds'), (45, '45 seconds'), (60, '60 seconds')])),
                ('desc_time', models.IntegerField(choices=[(15, '15 seconds'), (30, '30 seconds'), (45, '45 seconds')])),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('round', models.IntegerField(default=-1, validators=[django.core.validators.MinValueValidator(-2), django.core.validators.MaxValueValidator(10)])),
                ('last_modified', models.DateTimeField(auto_now=True)),
                ('users', models.ManyToManyField(related_name='sessions', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AddField(
            model_name='chain',
            name='session',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='chains', to='api.session'),
        ),
    ]

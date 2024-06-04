from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator
from django.core.files.base import ContentFile
from random import randint

# Create your models here.
class Drawing(models.Model):
    drawing = models.FileField()
    chain = models.ForeignKey('Chain', on_delete=models.CASCADE)
    created_at = models.DateTimeField()
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='drawings')

    def save(self, *args, **kwargs):
        # Save the instance to the database to get an id
        self.drawing = None
        super().save(*args, **kwargs)

        # Save the file with the correct name
        file_content = self.drawing.file.read()
        self.drawing.save(f'{self.id}.svg', ContentFile(file_content), save=False)

        # Save the instance again
        super().save(*args, **kwargs)

    def __str__(self):
        return self.id
    
class Description(models.Model):
    description = models.TextField(max_length=100)
    chain = models.ForeignKey('Chain', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='descriptions')

    def __str__(self):
        return self.id
    
class Chain(models.Model):
    session = models.ForeignKey('Session', on_delete=models.CASCADE, related_name='chains')

class Session(models.Model):
    game_code = models.IntegerField(unique=True, default=0, validators=[MinValueValidator(0), MaxValueValidator(999999)], primary_key=True)
    draw_time = models.IntegerField(choices=[30, 45, 60])
    desc_time = models.IntegerField(choices=[15, 30, 45])
    created_at = models.DateTimeField(auto_now_add=True)
    users = models.ManyToManyField(User, related_name='sessions')
    round = models.IntegerField(default=0, validators=[MinValueValidator(-1), MaxValueValidator(10)])
    # round: 0 is lobby, 1-10 is drawing/word guessing, -1 is game over

    def save(self, *args, **kwargs):
        if not self.game_code:
            self.game_code = self.generate_unique_code()
        super().save(*args, **kwargs)

    def generate_unique_code(self):
        while True:
            code = randint(0, 999999)
            if not Session.objects.filter(game_code=code).exists():
                return code
            
    def add_user(self, user):
        self.users.add(user)
        self.save()
    
    def __str__(self):
        return str(self.game_code)
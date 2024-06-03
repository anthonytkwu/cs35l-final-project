from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator

# Create your models here.
class Drawing(models.Model):
    drawing = models.FileField(upload_to='drawings/')
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
    game_code = models.IntegerField(auto_created=True, unique=True, default=0, validators=[MinValueValidator(0), MaxValueValidator(999999)])
    created_at = models.DateTimeField(auto_now_add=True)
    master_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='master_sessions')
    users = models.ManyToManyField(User, related_name='sessions')

    def __str__(self):
        return self.game_code
from django.db import models
from django.contrib.auth.models import User
from django.db.models import Count

class Game(models.Model):
    players = models.ManyToManyField(User, related_name='games')
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"Game {self.id} started at {self.created_at}"

class Player(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    current_game = models.ForeignKey(Game, on_delete=models.SET_NULL, null=True, related_name='current_players')

    def __str__(self):
        return self.user.username

class Round(models.Model):
    game = models.ForeignKey(Game, on_delete=models.CASCADE, related_name='rounds')
    phrase = models.CharField(max_length=255, blank=True, null=True)
    drawing = models.ForeignKey('Drawing', on_delete=models.SET_NULL, null=True, related_name='rounds')

    def __str__(self):
        return f"Round in Game {self.game.id}"

class Drawing(models.Model):
    image = models.ImageField(upload_to='drawings/')
    creator = models.ForeignKey(Player, on_delete=models.CASCADE, related_name='drawings')

    def __str__(self):
        return f"Drawing by {self.creator.user.username} for Game {self.game.id}"

class Phrase(models.Model):
    text = models.CharField(max_length=255)
    suggested_by = models.ForeignKey(Player, on_delete=models.CASCADE, related_name='phrases')

    def __str__(self):
        return self.text


'''
  const [name, setName] = useState('');
  const [gameID, setGameID] = useState('');
  const [file, setFile] = useState(null);
'''

'''
if odd number of players, the game starts by a player writing a line, then the line gets passed to draw

if even number of players, the game starts by a player writing a line AND drawing the drawing, then the 
drawing gets passed to the guesser

should be a number of rounds equal to the amount of players in the game
'''
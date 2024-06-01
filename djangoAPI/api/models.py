from django.db import models
from django.contrib.auth.models import User

class Game(models.Model):
    game_id = models.IntegerField(default=0)
    players = models.ManyToManyField(User, related_name='games', null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)   

    def __str__(self):
        return f"Game {self.id} started at {self.created_at}"

class Player(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    current_game = models.ForeignKey(Game, on_delete=models.SET_NULL, null=True, related_name='current_players')

    def __str__(self):
        return self.user.username

class DrawingPhrasePair(models.Model):
    prompt = models.CharField(max_length = 255)
    author = models.ForeignKey(Player, on_delete=models.CASCADE, related_name = 'prompts')
    image = models.ImageField(upload_to='drawings/', null=True)
    artist = models.ForeignKey(Player, on_delete=models.CASCADE, related_name = 'drawings', null=True)
    previous_pair = models.ForeignKey('self', on_delete=models.CASCADE, null=True, related_name = 'next_pair')
    starter = models.BooleanField(default=False)

class Chain(models.Model):
    starter = models.ForeignKey(Player, on_delete=models.CASCADE, related_name = 'started_chains')
    game = models.ForeignKey(Game, on_delete=models.CASCADE, related_name= 'chains')

'''
The way this database works currently:
Each game has x players
Each player creates a DrawingPhrasePair to start the game (or with an odd number of people, a DrawingPhrasePair 
with a null ImageField)
Each DrawingPhrasePair keeps track of the next DrawingPhrasePair, and we know which DrawingPhrasePair is a starter
in the game
In the event of a game with an even number of players, we want the first person to write a phrase AND draw it (to
make sure that the last person that goes is writing the phrase)
In the event of a game with an odd number of player, we want the first person to write the phrase, and then the
phrase to get passed to the next player.
The last DrawingPhrasePair in a chain should have a null image and artist field, but the prompt and author fields
should never be null
'''

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
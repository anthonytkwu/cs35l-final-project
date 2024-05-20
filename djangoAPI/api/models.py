from django.db import models

class Image(models.Model):
    name = models.CharField(max_length=255, blank=True)
    image = models.ImageField(upload_to='images/')
    gameID = models.IntegerField(max_length=6, blank=True, default=000000)

'''
  const [name, setName] = useState('');
  const [gameID, setGameID] = useState('');
  const [file, setFile] = useState(null);
'''
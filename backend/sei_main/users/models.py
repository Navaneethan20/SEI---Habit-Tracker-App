
# Create your models here.
from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    pass  # default user fields are enough for now

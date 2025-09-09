from django.contrib import admin
from .models import Habit, HabitLog, Badge

admin.site.register(Habit)
admin.site.register(HabitLog)
admin.site.register(Badge)

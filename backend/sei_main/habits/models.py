from django.db import models
from django.conf import settings

class Habit(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="habits")
    name = models.CharField(max_length=120)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.user.username})"

class HabitLog(models.Model):
    habit = models.ForeignKey(Habit, on_delete=models.CASCADE, related_name="logs")
    date = models.DateField()
    completed = models.BooleanField(default=False)

    class Meta:
        unique_together = ("habit", "date")
        ordering = ["-date"]

    def __str__(self):
        return f"{self.habit.name} - {self.date} - {self.completed}"

class Badge(models.Model):
    title = models.CharField(max_length=80)
    criteria = models.CharField(max_length=200)  # e.g., "7-day streak"
    icon = models.CharField(max_length=200, blank=True)  # icon name or URL

    def __str__(self):
        return self.title

class UserBadge(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="user_badges")
    badge = models.ForeignKey(Badge, on_delete=models.CASCADE)
    awarded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "badge")

    def __str__(self):
        return f"{self.user.username} - {self.badge.title}"

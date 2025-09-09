from rest_framework import serializers
from .models import Habit, HabitLog, Badge, UserBadge

class HabitLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = HabitLog
        fields = ("id", "habit", "date", "completed")
        read_only_fields = ("id", "habit")

class HabitSerializer(serializers.ModelSerializer):
    logs = HabitLogSerializer(many=True, read_only=True)

    class Meta:
        model = Habit
        fields = ("id", "user", "name", "description", "created_at", "logs")
        read_only_fields = ("id", "user", "created_at", "logs")

class BadgeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Badge
        fields = ("id", "title", "criteria", "icon")

class UserBadgeSerializer(serializers.ModelSerializer):
    badge = BadgeSerializer()

    class Meta:
        model = UserBadge
        fields = ("id", "badge", "awarded_at")

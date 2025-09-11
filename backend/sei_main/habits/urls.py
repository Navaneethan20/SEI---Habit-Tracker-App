from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import HabitViewSet, BadgeViewSet, streaks_view, user_badges_view

router = DefaultRouter()
router.register(r"", HabitViewSet, basename="habit")
router.register(r"badges", BadgeViewSet, basename="badge")

urlpatterns = [
    path("streaks/", streaks_view, name="streaks"),
    path("mybadges/", user_badges_view, name="user_badges"),
    path("", include(router.urls)),
]

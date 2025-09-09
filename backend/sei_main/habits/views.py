from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action, api_view, permission_classes
from .models import Habit, HabitLog, Badge, UserBadge
from .serializers import HabitSerializer, HabitLogSerializer, BadgeSerializer, UserBadgeSerializer
from datetime import date, timedelta

# ---------- streak helpers ----------
def compute_current_streak(habit):
    logs = habit.logs.filter(completed=True).values_list("date", flat=True)
    if not logs:
        return 0
    dates = set(logs)
    today = date.today()
    streak = 0
    cursor = today
    while cursor in dates:
        streak += 1
        cursor = cursor - timedelta(days=1)
    return streak

def compute_best_streak(habit):
    completed_dates = list(habit.logs.filter(completed=True).order_by("date").values_list("date", flat=True))
    if not completed_dates:
        return 0
    best, current = 0, 1
    for i in range(1, len(completed_dates)):
        if completed_dates[i] - completed_dates[i-1] == timedelta(days=1):
            current += 1
        else:
            best = max(best, current)
            current = 1
    return max(best, current)

# ---------- Badge awarding logic ----------
def check_and_award_badges(user, streak_count):
    
    milestones = {
        7: "Bronze Streaker",
        30: "Silver Streaker",
        100: "Gold Streaker",
    }

    for days, title in milestones.items():
        if streak_count >= days:
            badge, _ = Badge.objects.get_or_create(
                title=title,
                defaults={"criteria": f"{days}-day streak", "icon": f"{title.lower().replace(' ', '_')}.png"}
            )
            UserBadge.objects.get_or_create(user=user, badge=badge)

# ---------- Views ----------
class HabitViewSet(viewsets.ModelViewSet):
    serializer_class = HabitSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Habit.objects.filter(user=self.request.user).order_by("-created_at")

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=["get", "post"], url_path="logs")
    def logs(self, request, pk=None):
        habit = self.get_object()
        if request.method == "GET":
            queryset = habit.logs.all().order_by("-date")
            serializer = HabitLogSerializer(queryset, many=True)
            return Response(serializer.data)
        else:
            serializer = HabitLogSerializer(data=request.data)
            if serializer.is_valid():
                log_date = serializer.validated_data.get("date")
                completed = serializer.validated_data.get("completed", True)
                log, created = HabitLog.objects.update_or_create(
                    habit=habit, date=log_date,
                    defaults={"completed": completed}
                )
                # check streak after update
                streak = compute_current_streak(habit)
                check_and_award_badges(request.user, streak)
                return Response(HabitLogSerializer(log).data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class BadgeViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Badge.objects.all()
    serializer_class = BadgeSerializer
    permission_classes = [permissions.AllowAny]

@api_view(["GET"])
@permission_classes([permissions.IsAuthenticated])
def streaks_view(request):
    habits = Habit.objects.filter(user=request.user)
    data = []
    for h in habits:
        current = compute_current_streak(h)
        best = compute_best_streak(h)
        check_and_award_badges(request.user, current)  # also check here
        data.append({
            "id": h.id,
            "name": h.name,
            "current_streak": current,
            "best_streak": best,
        })
    return Response(data)

@api_view(["GET"])
@permission_classes([permissions.IsAuthenticated])
def user_badges_view(request):
    badges = UserBadge.objects.filter(user=request.user)
    serializer = UserBadgeSerializer(badges, many=True)
    return Response(serializer.data)

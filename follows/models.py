from django.db import models
from users.models import User
from django.db.models import F, Q

# Create your models here.
class Follow(models.Model):
    from_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='following_relations')
    to_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='follower_relations')
    creation_date = models.DateField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['from_user', 'to_user'],
                name='unique_follow'
            ),

            models.CheckConstraint(
                condition=~Q(from_user=F('to_user')),
                name='prevent_self_follow'
            )
        ]
    
    def __str__(self) -> str:
        return f'follow from {self.from_user} to {self.to_user}'
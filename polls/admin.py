from django.contrib import admin

# Register your models here.
from polls.models import Question, Choice

class ChoiceInline(admin.StackedInline):
	model = Choice
	extra = 3

class QuestionAdmin(admin.ModelAdmin):
	list_display = ('question_text', 'pub_date')
	fieldsets = [
	(None, {'fields':['question_text']}),
	('Date information', {'fields':['pub_date']})
	]
	inlines = [ChoiceInline]

admin.site.register(Question, QuestionAdmin)
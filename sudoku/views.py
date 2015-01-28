from django.shortcuts import render
from django.http import HttpResponse

from sudoku.sudoku_resolver import random_puzzle
# Create your views here.

def index(request):
    return render(request,'sudoku/index.html')

def puzzle(request):
	result = random_puzzle(35);
	return HttpResponse(result);
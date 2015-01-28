from django.shortcuts import render
from django.http import HttpResponse

from sudoku.sudoku_resolver import random_puzzle, solved, grid_values
# Create your views here.

def index(request):
    return render(request,'sudoku/index.html')

def puzzle(request, hard):
	result = random_puzzle(60-int(hard));
	return HttpResponse(result);

def solve(request, puzzle):
	try:
		if solved(grid_values(puzzle)):
			return HttpResponse("CONGRATUATIONS")
		else:
			return HttpResponse("Not yet")
	except (TypeError):
		return HttpResponse("Not yet")

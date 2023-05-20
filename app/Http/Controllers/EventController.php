<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Event;

class EventController extends Controller
{
    public function index()
    {
        $events = Event::all();

        return response()->json($events);
    }

    public function create()
    {
        return view('add-event');
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'title' => 'required',
            'date' => 'required|date',
            'time' => 'required|date_format:H:i',
        ]);

        $event = new Event;
        $event->title = $validatedData['title'];
        $event->start = $validatedData['date'] . ' ' . $validatedData['time'];
        $event->end = date('Y-m-d H:i:s', strtotime('+1 hour', strtotime($event->start)));
        $event->save();
    }
}

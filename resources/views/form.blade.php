<form action="/events" method="POST">
    @csrf
    <input type="text" name="title" placeholder="Event Title" required>
    <input type="date" name="date" required>
    <input type="time" name="time" required>
    <button type="submit" id="addEventButton">Add Event</button>
</form>

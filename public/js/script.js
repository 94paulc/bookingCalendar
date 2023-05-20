$(document).ready(function() {
    var calendar = $('#calendar').fullCalendar();

    $.ajax({
        type: 'GET',
        url: '/events',
        success: function(response) {
            var events = [];

            response.forEach(function(event) {
                events.push({
                    title: event.title,
                    start: event.start + 'T' + event.end
                });
            });

            calendar.fullCalendar('renderEvents', events, true);
        },
        error: function(xhr, status, error) {
            console.error(xhr.responseText);
        }
    });

    $('#addEventButton').click(function(e) {
        e.preventDefault();

        var eventTitle = $('input[name="title"]').val();
        var eventDate = $('input[name="date"]').val();
        var eventTime = $('input[name="time"]').val();

        if (!eventTitle || !eventDate || !eventTime) {
            alert('Please enter all the event details.');
            return;
        }

        var selectedDate = moment(eventDate).isoWeekday();
        if (selectedDate < 1 || selectedDate > 5) {
            alert('Events can only be added from Monday to Friday.');
            return;
        }

        var selectedTime = moment(eventTime, 'HH:mm');
        var startTime1 = moment('09:00', 'HH:mm');
        var endTime1 = moment('13:00', 'HH:mm');
        var startTime2 = moment('15:30', 'HH:mm');
        var endTime2 = moment('21:00', 'HH:mm');

        if (
            !(selectedTime.isBetween(startTime1, endTime1) || selectedTime.isBetween(startTime2, endTime2))
        ) {
            alert('Events can only be added between 09:00-13:00 and 15:30-21:00.');
            return;
        }

        var calendar = $('#calendar');
        var events = calendar.fullCalendar('clientEvents');
        var newEventStart = moment(eventDate + ' ' + eventTime);
        var newEventEnd = moment(newEventStart).add(1, 'hour');

        for (var i = 0; i < events.length; i++) {
            var existingEventStart = moment(events[i].start);
            var existingEventEnd = moment(events[i].end);

            if (
                (newEventStart.isAfter(existingEventStart) && newEventStart.isBefore(existingEventEnd)) ||
                (newEventEnd.isAfter(existingEventStart) && newEventEnd.isBefore(existingEventEnd)) ||
                (newEventStart.isSame(existingEventStart) || newEventEnd.isSame(existingEventEnd))
            ) {
                alert('There is a conflict with an existing event.');
                return;
            }

            if (newEventStart.diff(existingEventEnd, 'minutes') < 30) {
                alert('There must be at least 30 minutes between events.');
                return;
            }
        }

        var event = {
            title: eventTitle,
            start: newEventStart,
            end: newEventEnd
        };

        calendar.fullCalendar('renderEvent', event, true);

        $.ajax({
            type: 'POST',
            url: '/events',
            data: {
                _token: '{{ csrf_token() }}',
                title: eventTitle,
                date: eventDate,
                time: eventTime
            },
            success: function(response) {
                console.log(response);
            },
            error: function(xhr, status, error) {
                console.error(xhr.responseText);
            }
        });
    });
});

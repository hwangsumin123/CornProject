<template>

<FullCalendar :options="calendarOptions" />

</template>

<script>

import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'

export default {

props:[
    "schedules"
],

components:{
    FullCalendar
},

computed:{

    calendarEvents(){
        return this.schedules.map(schedule => ({
            id: schedule.id,
            title: schedule.title,
            start: schedule.date + "T" + schedule.time,
            extendedProps: {
                place: schedule.place
            }
        }));
    },

    calendarOptions(){
        return {
            plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
            initialView: "dayGridMonth",
            locale: "ko",
            events: this.calendarEvents
        };
    }

}

}

</script>
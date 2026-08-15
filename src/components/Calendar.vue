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
            events: this.calendarEvents,
            height: 560,
            dayMaxEventRows: 2,
            headerToolbar: {
                left: "",
                center: "title",
                right: "today prev,next"
            }
        };
    }

}

}

</script>

<style scoped>
:deep(.fc-header-toolbar) {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 8px;
  margin-bottom: 12px !important;
}

/* 제목이 들어있는 줄(가운데) */
:deep(.fc-toolbar-chunk:has(.fc-toolbar-title)) {
  display: flex;
  justify-content: center;
}

/* today, </> 버튼이 들어있는 줄(오른쪽) */
:deep(.fc-toolbar-chunk:has(.fc-button-group)) {
  display: flex;
  justify-content: flex-end;
}

/* 상단 "2026년 8월" 타이틀 */
:deep(.fc-toolbar-title) {
  font-size: 22px;
  font-weight: 800;
  color: #6a4c93;
  letter-spacing: -0.5px;
  padding: 3px 12px;
  border-radius: 16px;
  white-space: nowrap;
}

/* 이전/다음/오늘 버튼도 색상 통일 + 크기 축소 */
:deep(.fc-button-primary) {
  background-color: #b39ddb;
  border-color: #b39ddb;
  font-size: 12px;
  padding: 3px 8px;
}

:deep(.fc-button-primary:hover) {
  background-color: #9575cd;
  border-color: #9575cd;
}

/* today, prev/next 버튼 사이 간격 */
:deep(.fc-toolbar-chunk:last-child .fc-button-group) {
  margin-left: 6px;
}

/* 날짜 숫자("1일" 등) 왼쪽 정렬 */
:deep(.fc-daygrid-day-top) {
  flex-direction: row !important;
  justify-content: flex-start;
  padding: 4px 6px;
}

:deep(.fc-daygrid-day-number) {
  color: #6a4c93;
  font-weight: 600;
  font-size: 12px;
}

:deep(.fc-col-header-cell-cushion) {
  font-size: 12px;
  padding: 5px 0 !important;
}

/* 요일 헤더(일,월,화...) 색상 */
:deep(.fc-col-header-cell) {
  background-color: #b39ddb;
}

:deep(.fc-col-header-cell-cushion) {
  color: white;
  font-weight: bold;
  padding: 8px 0;
}

/* 오늘 날짜 강조 */
:deep(.fc-daygrid-day.fc-day-today) {
  background-color: #f0e6fa;
}

/* 테두리 색 + 둥근 모서리 */
:deep(.fc-theme-standard td),
:deep(.fc-theme-standard th) {
  border-color: #e6d9f5;
}

:deep(.fc-scrollgrid) {
  border-radius: 12px;
  overflow: hidden;
}
</style>
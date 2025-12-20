import { Component, inject, OnInit } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { AppointmentHttpService } from '@/pages/core/roles/owner/services';
import { CustomMessageService } from '@utils/services';
import { Dialog } from 'primeng/dialog';

@Component({
    selector: 'app-appointments',
    imports: [FullCalendarModule, Dialog],
    templateUrl: './appointments.html',
    styleUrl: './appointments.scss'
})
export class Appointments implements OnInit {
    options!: CalendarOptions;
    private customMessageService = inject(CustomMessageService);
    private appointmentHttpService = inject(AppointmentHttpService);
    showDialog = false;
    selectedEvent: any;

    serviceColors: Record<string, string> = {
        pending: '#ffff00',
        confirmed: '#00ec00',
        cancelled: '#ef4444',
        completed: '#00008b'
    };

    async ngOnInit() {
        await this.loadAppointments();
    }

    async loadAppointments() {
        const appointments = await this.appointmentHttpService.findAppointments();

        if (!appointments) {
            this.customMessageService.showError({ summary: 'No existen citas', detail: 'Vuelva a intentar más tarde' });
            return;
        }

        const events = appointments.map((a: any) => ({
            title: a.service,
            start: a.date?.toDate ? a.date.toDate() : a.date,
            color: this.serviceColors[a.state] ?? '#2563eb',
            textColor: '#ffffff',
            backgroundColor: this.serviceColors[a.status] ?? '#2563eb',
            borderColor: this.serviceColors[a.status] ?? '#2563eb',
            extendedProps: { customer: a.name }
        }));

        this.options = {
            plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
            initialView: 'dayGridMonth',
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
            },
            selectable: true,
            editable: true,
            events,
            dateClick: (info) => {
                console.log('click date', info.dateStr);
            },
            eventClick: (info) => {
                this.selectedEvent = info.event.extendedProps;
            }
        };
    }
}

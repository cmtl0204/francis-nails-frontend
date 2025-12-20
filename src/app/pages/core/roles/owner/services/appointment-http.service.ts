import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { CoreService, CustomMessageService } from '@utils/services';
import { addDoc, collection, Firestore, getDocs, limit, query, updateDoc, where } from '@angular/fire/firestore';
import { doc } from 'firebase/firestore';

@Injectable({
    providedIn: 'root'
})
export class AppointmentHttpService {
    private readonly _httpClient = inject(HttpClient);
    private readonly _apiUrl = `${environment.API_URL}/core/external/process-parks`;
    private readonly _customMessageService = inject(CustomMessageService);
    private readonly coreService = inject(CoreService);
    private firestore = inject(Firestore);

    async findByIdentification(identification: string) {
        identification = identification.trim();

        const q = query(collection(this.firestore, 'customers'), where('identification', '==', identification), limit(1));

        const snap = await getDocs(q);
        if (snap.empty) return null;

        const d = snap.docs[0];

        return d.data();
    }

    async createAppointment(appointment: any) {
        this.coreService.showProcessing();

        await this.saveCustomer(appointment);

        const col = collection(this.firestore, 'appointments');

        const ident = String(appointment.identification).trim();

        const docRef = await addDoc(col, {
            customer: {
                identification: ident,
                name: appointment.name ?? null,
                email: appointment.email ?? null,
                phone: appointment.phone ?? null
            },
            service: appointment.service,
            date: appointment.date,
            state: 'pending',
            createdAt: new Date(),
            updatedAt: new Date()
        });

        this.coreService.hideProcessing();

        this._customMessageService.showInfo({ summary: 'Cita Agendada', detail: 'Su cita fue agendada correctamente' });

        return docRef.id;
    }

    async findAppointments() {

        const q = query(collection(this.firestore, 'appointments'));
        const snap = await getDocs(q);

        if (snap.empty) return [];

        return snap.docs.map((doc) => ({
            ...doc.data()
        }));
    }

    private async saveCustomer(customer: any) {
        const ident = String(customer.identification).trim();
        const col = collection(this.firestore, 'customers');

        const q = query(col, where('identification', '==', ident), limit(1));
        const snap = await getDocs(q);

        if (!snap.empty) {
            const existing = snap.docs[0];
            await updateDoc(doc(this.firestore, `customers/${existing.id}`), {
                name: customer.name ?? null,
                email: customer.email ?? null,
                phone: customer.phone ?? null,
                updatedAt: new Date()
            });
            return existing.id;
        }

        const docRef = await addDoc(col, {
            identification: ident,
            name: customer.name ?? null,
            email: customer.email ?? null,
            phone: customer.phone ?? null,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        return docRef.id;
    }
}

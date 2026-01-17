import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { CoreService, CustomMessageService } from '@utils/services';

@Injectable({
    providedIn: 'root'
})
export class AppointmentHttpService {
    private readonly _httpClient = inject(HttpClient);
    private readonly _apiUrl = `${environment.API_URL}/core/external/process-parks`;
    private readonly _customMessageService = inject(CustomMessageService);
    private readonly coreService = inject(CoreService);
}

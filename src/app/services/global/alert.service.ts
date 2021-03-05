import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(
    private messageService: MessageService
    ) { }

  addSingle() {
    this.messageService.add({ severity: 'success', summary: 'Service Message', detail: 'Via MessageService' });
  }

  addMultiple() {
    this.messageService.addAll([{ severity: 'success', summary: 'Service Message', detail: 'Via MessageService' },
    { severity: 'info', summary: 'Info Message', detail: 'Via MessageService' }]);
  }

  clear() {
    this.messageService.clear();
  }

  warning(message: string) {
    this.clear();
    this.messageService.add({ severity: 'warn', summary: 'Warning', detail: message });
  }

  success(message: string) {
    this.clear();
    this.messageService.add({ severity: 'success', summary: 'Success', detail: message });
  }

  error(message: string) {
    this.clear();
    this.messageService.add({ severity: 'error', summary: 'Error', detail: message });
  }

  message(message: string) {
    this.clear();
    this.messageService.add({ severity: 'info', summary: 'Info', detail: message });
  }
}

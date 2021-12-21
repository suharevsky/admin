import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, delay, finalize, tap } from 'rxjs/operators';
import {UserService} from '../../../_services';
import {ReportAbuseService} from '../../../_services/report-abuse.service';

@Component({
  selector: 'app-delete-report-abuse-modal',
  templateUrl: './delete-report-abuse-modal.component.html',
  styleUrls: ['./delete-report-abuse-modal.component.scss']
})
export class DeleteReportAbuseModalComponent implements OnInit, OnDestroy {
  @Input() ids: number[];
  isLoading = false;
  subscriptions: Subscription[] = [];

  constructor(private reportAbuseService: ReportAbuseService, public modal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  deleteReports() {
    this.isLoading = true;
    const sb = this.reportAbuseService.deleteItems(this.ids).pipe(
      tap(() => this.modal.close()),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(undefined);
      }),
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe();
    this.subscriptions.push(sb);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}

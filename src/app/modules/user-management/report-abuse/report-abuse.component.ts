import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Subscription} from 'rxjs';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {
    GroupingState,
    PaginatorState,
    SortState,
    ISortView,
    IFilterView,
    IGroupingView,
    ISearchView,
} from '../../../_metronic/shared/crud-table';
import {ReportAbuseService} from '../_services/report-abuse.service';
import {DeleteReportAbuseModalComponent} from './components/delete-report-abuse-modal/delete-report-abuse-modal.component';


@Component({
    selector: 'app-report-abuse',
    templateUrl: './report-abuse.component.html',
    styleUrls: ['./report-abuse.component.scss'],
})
export class ReportAbuseComponent
    implements OnInit,
        OnDestroy,
        ISortView,
        IFilterView,
        IGroupingView,
        ISearchView,
        IFilterView {
    paginator: PaginatorState;
    sorting: SortState;
    grouping: GroupingState;
    isLoading: boolean;
    filterGroup: FormGroup;
    searchGroup: FormGroup;
    private subscriptions: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

    constructor(
        private fb: FormBuilder,
        public reportAbuseService: ReportAbuseService,
        private modalService: NgbModal,

    ) {
    }

    // angular lifecircle hooks
    ngOnInit(): void {
        this.filterForm();
        this.searchForm();
        this.reportAbuseService.fetch();
        this.grouping = this.reportAbuseService.grouping;
        this.paginator = this.reportAbuseService.paginator;
        this.sorting = this.reportAbuseService.sorting;
        const sb = this.reportAbuseService.isLoading$.subscribe(res => this.isLoading = res);
        this.subscriptions.push(sb);
    }

    ngOnDestroy() {
        this.subscriptions.forEach((sb) => sb.unsubscribe());
    }

    // filtration
    filterForm() {
        this.filterGroup = this.fb.group({
            status: [''],
            type: [''],
            searchTerm: [''],
        });
        this.subscriptions.push(
            this.filterGroup.controls.status.valueChanges.subscribe(() =>
                this.filter()
            )
        );
        this.subscriptions.push(
            this.filterGroup.controls.type.valueChanges.subscribe(() => this.filter())
        );
    }

    filter() {
        const filter = {};
        const status = this.filterGroup.get('status').value;
        if (status) {
            filter['status'] = status;
        }

        const type = this.filterGroup.get('type').value;
        if (type) {
            filter['type'] = type;
        }
        this.reportAbuseService.patchState({filter});
    }


    deleteSelected() {
        const modalRef = this.modalService.open(DeleteReportAbuseModalComponent);
        modalRef.componentInstance.ids = this.grouping.getSelectedRows();
        modalRef.result.then(() => this.reportAbuseService.fetch(), () => {
        });
    }

    // search
    searchForm() {
        this.searchGroup = this.fb.group({
            searchTerm: [''],
        });
        const searchEvent = this.searchGroup.controls.searchTerm.valueChanges
            .pipe(
                /*
              The user can type quite quickly in the input box, and that could trigger a lot of server requests. With this operator,
              we are limiting the amount of server requests emitted to a maximum of one every 150ms
              */
                debounceTime(150),
                distinctUntilChanged()
            )
            .subscribe((val) => this.search(val));
        this.subscriptions.push(searchEvent);
    }

    search(searchTerm: string) {
        searchTerm = searchTerm.toLowerCase();
        this.reportAbuseService.patchState({searchTerm});
    }

    // sorting
    sort(column: string) {
        const sorting = this.sorting;
        const isActiveColumn = sorting.column === column;
        console.log(column);
        if (!isActiveColumn) {
            sorting.column = column;
            sorting.direction = 'asc';
        } else {
            sorting.direction = sorting.direction === 'asc' ? 'desc' : 'asc';
        }
        this.reportAbuseService.patchState({sorting});
    }

    // pagination
    paginate(paginator: PaginatorState) {
        this.reportAbuseService.patchState({paginator});
    }
}


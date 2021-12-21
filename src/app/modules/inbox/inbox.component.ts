import {Component, OnDestroy, OnInit} from '@angular/core';
import {
    GroupingState,
    IFilterView,
    IGroupingView,
    ISearchView,
    ISortView,
    PaginatorState,
    SortState
} from '../../_metronic/shared/crud-table';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Subscription} from 'rxjs';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {InboxService} from './_services/inbox.service';

@Component({
    selector: 'app-contacts',
    templateUrl: './inbox.component.html',
})
export class InboxComponent implements OnInit,
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
        private modalService: NgbModal,
        public inboxService: InboxService,
    ) {
    }

    ngOnInit(): void {
        this.filterForm();
        this.searchForm();
        this.inboxService.fetch();
        this.grouping = this.inboxService.grouping;
        this.paginator = this.inboxService.paginator;
        this.sorting = this.inboxService.sorting;
        const sb = this.inboxService.isLoading$.subscribe(res => this.isLoading = res);
        this.subscriptions.push(sb);
    }

    ngOnDestroy() {
        this.subscriptions.forEach((sb) => sb.unsubscribe());
    }

    // filtration
    filterForm() {
        this.filterGroup = this.fb.group({
            adminExists: [''],
            searchTerm: [''],
        });

        this.subscriptions.push(
            this.filterGroup.controls.adminExists.valueChanges.subscribe(() => this.filter())
        );
    }

    filter() {
        const filter = {};

        const adminExists = this.filterGroup.get('adminExists').value;
        if (adminExists) {
            filter['adminExists'] = adminExists;
        }
        this.inboxService.patchState({filter});
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
        this.inboxService.patchState({searchTerm});
    }

    // sorting
    sort(column: string) {
        const sorting = this.sorting;
        const isActiveColumn = sorting.column === column;
        if (!isActiveColumn) {
            sorting.column = column;
            sorting.direction = 'asc';
        } else {
            sorting.direction = sorting.direction === 'asc' ? 'desc' : 'asc';
        }
        this.inboxService.patchState({sorting});
    }

    // pagination
    paginate(paginator: PaginatorState) {
        this.inboxService.patchState({paginator});
    }
}

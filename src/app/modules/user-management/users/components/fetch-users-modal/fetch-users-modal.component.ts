import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { User } from '../../../_models/user.model';
import {UserService} from '../../../_services';

@Component({
  selector: 'app-fetch-users-modal',
  templateUrl: './fetch-users-modal.component.html',
  styleUrls: ['./fetch-users-modal.component.scss']
})
export class FetchUsersModalComponent implements OnInit, OnDestroy {
  @Input() ids: number[];
  users: User[] = [];
  isLoading = false;
  subscriptions: Subscription[] = [];

  constructor(private userService: UserService, public modal: NgbActiveModal) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    const sb = this.userService.items$.pipe(
      first()
    ).subscribe((res: User[]) => {
      this.users = res.filter(c => this.ids.indexOf(c.id) > -1);
    });
    this.subscriptions.push(sb);
  }

  fetchSelected() {
    this.isLoading = true;
    // just imitation, call server for fetching data
    setTimeout(() => {
      this.isLoading = false;
      this.modal.close();
    }, 1000);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}

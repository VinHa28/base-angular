import { Component } from '@angular/core';
import { UserProfileComponent } from '../user-profile/user-profile';

@Component({
  selector: 'app-user-profile-container',
  standalone: true,
  imports: [UserProfileComponent],
  templateUrl: './user-profile-container.html',
})
export class UserProfileContainer {
  parentUser = { name: 'Nguyễn Văn A', age: 20 };

  editDirectly() {
    this.parentUser.name = 'Trần Văn B';
  }

  createNewObject() {
    this.parentUser = { ...this.parentUser, name: 'Trần Văn B' };
  }
}

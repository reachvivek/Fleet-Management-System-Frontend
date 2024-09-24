import { Component } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { BulkUploadService, History } from '../../../../swagger';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrl: './history.component.scss',
})
export class HistoryComponent {
  showLoader: boolean = false;
  history: History[] = [];

  constructor(private bulkUploadService: BulkUploadService) {}

  async ngOnInit(): Promise<void> {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    await this.loadUploadHistory();
  }

  async loadUploadHistory() {
    this.showLoader = true;
    try {
      const res = await firstValueFrom(
        this.bulkUploadService.bulkUploadGetUploadHistoryGet()
      );
      if (res && res.length) {
        this.history = res;
      }
    } catch (err: any) {
      console.log(err);
    }
    this.showLoader = false;
  }
}

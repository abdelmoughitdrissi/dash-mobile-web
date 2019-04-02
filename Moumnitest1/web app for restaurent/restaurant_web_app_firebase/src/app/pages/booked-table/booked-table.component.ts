import { Component, OnInit } from '@angular/core';
import { BookedTableService } from './booked-table.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-booked-table',
  templateUrl: './booked-table.component.html',
  styleUrls: ['./booked-table.component.scss'],
  providers: [ BookedTableService ]
})
export class BookedTableComponent implements OnInit {
  
  bookedTable:Array<any> = [];

  constructor(private restService:BookedTableService, private toastr : ToastrService ) {
     this.getBookedTableData();
   }
  
  getBookedTableData(){
    this.restService.getBookedTablesData().valueChanges().subscribe(
      (res) => {
        this.bookedTable = res;
        this.bookedTable = this.bookedTable.reverse();
      },() => {
        this.toastr.error("Error","Could not get Booking information",{timeOut:3000});
      }
    )
  }

  ngOnInit() {
  }

}

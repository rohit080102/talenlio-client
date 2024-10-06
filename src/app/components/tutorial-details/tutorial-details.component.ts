import { Component, OnInit, Input, OnChanges, SimpleChanges, EventEmitter, Output } from '@angular/core';
import { TutorialService } from 'src/app/services/tutorial.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Tutorial } from 'src/app/models/tutorial.model';
declare let $: any;
import Swal from 'sweetalert2'

@Component({
  selector: 'app-tutorial-details',
  templateUrl: './tutorial-details.component.html',
  styleUrls: ['./tutorial-details.component.css']
})
export class TutorialDetailsComponent implements OnInit, OnChanges {

  @Input() viewMode = false;

  @Input() currentTutorial: Tutorial = {
    title: '',
    description: ''
  };
  @Output() modalUpdate = new EventEmitter<any>();

  message = '';

  constructor(
    private tutorialService: TutorialService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    if (!this.viewMode) {
      this.message = '';
      $('#myModal').modal('show')

    }

  }
  ngOnChanges(): void {
    if (!this.viewMode) {
      $('#myModal').modal('show')
    }

  }




  updateTutorial(): void {
    this.message = '';

    this.tutorialService.update(this.currentTutorial.id, this.currentTutorial)
      .subscribe({
        next: (res) => {
          console.log(res);
          this.message = res.message ? res.message : 'This tutorial was updated successfully!';
          $("#myModal").modal('hide');
          this.modalUpdate.emit(true);
          Swal.fire({
            toast: true,
            icon: 'success',
            title: ' Update successfully',
            animation: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer)
              toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
          });
        },
        error: (e) => console.error(e)
      });
  }

}

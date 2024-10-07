import { Component, OnInit } from '@angular/core';
import { Tutorial } from 'src/app/models/tutorial.model';
import { TutorialService } from 'src/app/services/tutorial.service';
declare let $: any;
import Swal from 'sweetalert2';



@Component({
  selector: 'app-tutorials-list',
  templateUrl: './tutorials-list.component.html',
  styleUrls: ['./tutorials-list.component.css']
})
export class TutorialsListComponent implements OnInit {


  tutorials?: Tutorial[];
  currentTutorial: Tutorial = {};
  currentIndex = -1;
  title = '';
  JSON: any;
  limit: any;

  constructor(private tutorialService: TutorialService,

  ) { }

  ngOnInit(): void {
    this.retrieveTutorials();
  }


  handleRelod(val: any) {
    if (val) {
      console.log(val)
      this.retrieveTutorials();
    }

  }





  retrieveTutorials(): void {
    this.tutorialService.getAll()
      .subscribe({
        next: (data) => {
          this.tutorials = data;
          console.log(data);
          if (this.tutorials.length > 10) {

          }
        },
        error: (e) => console.error(e)
      });
  }
  refreshList(): void {
    this.retrieveTutorials();
    this.currentTutorial = {};
    this.currentIndex = -1;
  }

  setActiveTutorial(tutorial: Tutorial, index: number): void {
    this.currentTutorial = JSON.parse(JSON.stringify(tutorial))
    // this.currentIndex = index;
    $("#myModal").modal('show')
  }

  removeAllTutorials(): void {
    this.tutorialService.deleteAll()
      .subscribe({
        next: (res) => {
          console.log(res);
          this.refreshList();
        },
        error: (e) => console.error(e)
      });
  }

  datial(data: any) {
    $('#detailModal').modal('show')
    this.currentTutorial = data
  }


  searchTitle(): void {
    this.currentTutorial = {};
    this.currentIndex = -1;

    this.tutorialService.findByTitle(this.title)
      .subscribe({
        next: (data) => {
          this.tutorials = data;
          console.log(data);
        },
        error: (e) => console.error(e)
      });
  }


  message: any;
  updatePublished(status: boolean, id: any): void {
    const data = {
      title: this.currentTutorial.title,
      description: this.currentTutorial.description,
      published: status
    };


    this.tutorialService.update(id, data)
      .subscribe({
        next: (res) => {
          console.log(res);
          this.currentTutorial.published = status;
          Swal.fire({
            toast: true,
            icon: 'success',
            title: status ? ' Unpublish successfully' : ' Publish successfully',
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
          this.retrieveTutorials();
        },
        error: (e) => console.error(e)

      }
      );
  }


  deleteTutorial(id: any): void {

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {

        this.tutorialService.delete(id)
          .subscribe({
            next: (res) => {
              console.log(res);
              this.retrieveTutorials();
            },
            error: (e) => console.error(e)
          });
        Swal.fire({
          title: "Deleted!",
          text: "Tutorial has been deleted.",
          icon: "success"
        });
      }
    });




  }


}

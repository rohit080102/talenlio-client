import { Component, OnInit } from '@angular/core';
import { Tutorial } from 'src/app/models/tutorial.model';
import { TutorialService } from 'src/app/services/tutorial.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-add-tutorial',
  templateUrl: './add-tutorial.component.html',
  styleUrls: ['./add-tutorial.component.css']
})
export class AddTutorialComponent implements OnInit {

  ngOnInit(): void {
    this.retrieveTutorials();
    // console.log(this.tutorials);

  }

  tutorial: Tutorial = {
    title: '',
    description: '',
    published: false
  };
  submitted = false;

  constructor(private tutorialService: TutorialService) { }

  saveTutorial(): void {
    const data = {
      title: this.tutorial.title,
      description: this.tutorial.description
    };

    console.log(this.tutorials.length);
    if (data.title != '' && data.description != '') {


      if (this.tutorials.length < 10) {
        this.tutorialService.create(data)
          .subscribe({
            next: (res) => {
              console.log(res);
              this.submitted = true;
              Swal.fire("Added Successfully");
              this.newTutorial()
              this.retrieveTutorials();

            },
            error: (e) => console.error(e)
          });
      } else {
        Swal.fire({
          icon: "error",
          title: "Limit Exceed",
          text: "Delete some record to add new"
        });
      }
    } else {
      Swal.fire({
        title: "Both Field is required",
        // text: "That thing is still around?",
        icon: "warning"
      });
    }

  }

  tutorials: any;

  retrieveTutorials() {
    this.tutorialService.getAll()
      .subscribe({
        next: (data) => {
          this.tutorials = data;
          console.log(data.length);
        },
        error: (e) => console.error(e)
      });
  }

  newTutorial(): void {
    this.submitted = false;
    this.tutorial = {
      title: '',
      description: '',
      published: false
    };
  }


}

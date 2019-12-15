import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  constructor(
    private route : ActivatedRoute
  ) { }

  ngOnInit() {
    this.getProject();
  }

  getProject() {
    const id = this.route.snapshot.paramMap.get('id');
    console.log(id, 'id');
  }
}

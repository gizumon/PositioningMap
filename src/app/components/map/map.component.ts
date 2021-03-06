import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IProject, IPlot } from 'src/app/templates/template';
import { MapService } from 'src/app/services/map.service';
import { LoginService } from 'src/app/services/login.service';
import { ContainerService } from 'src/app/services/container.service';
import { ModalService, IModalConfig, IOnOk } from 'src/app/services/modal.service';
import { GraphqlClientService } from 'src/app/services/graphql-client.service';
import { ValidationService } from 'src/app/services/validation.service';

import * as PIXI from "pixi.js";

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, AfterViewInit {
  @ViewChild('pixiContainer', {static: false}) canvasArea: ElementRef<HTMLElement>;
  private pixiApp: PIXI.Application;
  private mapContainer: PIXI.Container;
  private axisContainer: PIXI.Container;
  private labelContainer: PIXI.Container;
  private plotsContainerMap: Map<string, PIXI.Container> = new Map();
  // TODO: MapService で持たせる
  private plotsIndex: Map<string, number> = new Map(); // this.projects.plots[this.plotsIndex[id]];
  public project: IProject;
  public selectedPlot =  {
    id: '',
    name: '',
    x: 0,
    y: 0
  };
  
  private config = {
    size: {
      ratio: 0.75,
      max: 800,
      min: 350
    },
    pixi: {
      width: 0, // variable by window size
      height: 0, // variable by window size
      backgroundColor: 0xe7e1e6, //rgb(231,225,230)
      antialias: true,
      transparent: false,
      resolution: 1
    },
    draw: {
      margin: {
        x: 50,
        y: 50
      },
      text: {
        "align": "center",
        "breakWords": true,
        "dropShadow": true,
        "dropShadowAlpha": 0.3,
        "dropShadowAngle": 0.5,
        "dropShadowBlur": 3,
        "fill": "#004080",
        "fontFamily": "Tahoma, Geneva, sans-serif",
        "fontSize": 20,
        "fontWeight": 700,
        "letterSpacing": -1,
        "lineJoin": "round",
        "miterLimit": 1,
        "stroke": "#000040",
        "strokeThickness": 1,
        "wordWrap": true,
        "wordWrapWidth": 150
      },
      circle: {
        radius: 4,
        color: 0x484296
      },
      axis: {
        weight: 5,
        color: 0xFFFFFF,
        arrow: 30
      },
      label: {
        fontSize: 10,
        fontStyle: 'normal',
        fontWeight: '400',
        wordWrap: true,
        wordWrapWidth: 100,
        align: "center",
        breakWords: false,
        fontVariant: "small-caps",
        letterSpacing: -1,
      }
    }
  };

  constructor(
    private route : ActivatedRoute,
    private mapService: MapService,
    private loginService: LoginService,
    private containerService: ContainerService,
    private modalService: ModalService,
    private graphql: GraphqlClientService,
    private valid: ValidationService
  ) {
    this.config.pixi.width = this.checkWindowSize(window.innerWidth);
    this.config.pixi.height = this.checkWindowSize(window.innerWidth);
  }
  
  ngOnInit() {
    this.initialize();
    this.containerService.resizeObserve().subscribe(e => {
      this.pixiApp.renderer.resize(this.checkWindowSize(window.innerWidth), this.checkWindowSize(window.innerWidth));
    });
  }

  ngAfterViewInit() {
    this.pixiApp = new PIXI.Application(this.config.pixi);
    this.canvasArea.nativeElement.appendChild(this.pixiApp.view);
    this.drawMap();
  }

  initialize() {
    const projectId = this.route.snapshot.paramMap.get('id');
    this.project = this.mapService.getProjectById(projectId);
    this.setPlotsIndex();
    // detection for adding plots
    this.modalService.onOkSubject.subscribe((params: IOnOk) => {
      console.log(params);
      if (params && params.type === 'plot' && params.data) { this.addPlot(params.data); }
    });
    // detection for change projects
    this.mapService.projectsSubject.subscribe((projects) => {
      projects.forEach(project => {
        if (project.id === this.project.id) {
          console.log('detect update', project);
          this.project = project;
          this.drawPlots();
          this.setPlotsIndex();
        }
      });
    })
  }

  setPlotsIndex() {
    console.log('set', this.project.plots)
    this.project.plots.forEach((plot, index) => {
      this.plotsIndex.set(plot.id, index);
    });
  }

  checkWindowSize(val): number {
    return this.config.size.min;
    // const size = this.config.size;
    // return val * size.ratio > size.max ? size.max
    //      : val * size.ratio < size.min ? size.min
     //      : val * size.ratio;
  }

  drawMap() {
    this.axisContainer = new PIXI.Container();
    this.labelContainer = new PIXI.Container();
    this.mapContainer = new PIXI.Container();
    this.mapContainer.setTransform(
      this.pixiApp.screen.width / 2, // X軸を中心にオフセット
      this.pixiApp.screen.height / 2, // Y軸を中心にオフセット
      this.pixiApp.screen.width / 200, // -100 < x < 100
      -1 * this.pixiApp.screen.height / 200 // -100 < y < 100 (y軸反転)
    );
    // this.mapContainer.interactive = true;
    // this.mapContainer.buttonMode = true;
    // this.mapContainer.on('pointerdown', this.clearPlot.bind(this));
    this.drawAxis();
    this.drawAxisLabel();
    this.drawPlots();
    this.pixiApp.stage.addChild(this.axisContainer);
    this.pixiApp.stage.addChild(this.mapContainer);
    this.pixiApp.stage.addChild(this.labelContainer);
    console.log(this.pixiApp, 'after');
  }

  drawAxisLabel() {
    let labelConfigs = [{
      name: 'xMin',
      label: this.project.label_x_min,
      anchor: {
        x: 0,
        y: 0.5
      },
      transform: {
        x: this.config.draw.axis.arrow + 5,
        y: this.pixiApp.screen.height/2,
      }
    },{
      name: 'xMax',
      label: this.project.label_x_max,
      anchor: {
        x: 1,
        y: 0.5
      },
      transform: {
        x: this.pixiApp.screen.width - (this.config.draw.axis.arrow + 5),
        y: this.pixiApp.screen.height/2,
      }
    },{
      name: 'yMin',
      label: this.project.label_y_min,
      anchor: {
        x: 0.5,
        y: 1
      },
      transform: {
        x: this.pixiApp.screen.width/2,
        y: this.pixiApp.screen.height - this.config.draw.axis.arrow,
      }
    },{
      name: 'yMax',
      label: this.project.label_y_max,
      anchor: {
        x: 0.5,
        y: 0
      },
      transform: {
        x: this.pixiApp.screen.width/2,
        y: this.config.draw.axis.arrow,
      }
    }];

    labelConfigs.forEach((conf) => {
      let text = new PIXI.Text(conf.label, this.config.draw.text);
      text.anchor.set(conf.anchor.x, conf.anchor.y);
      text.setTransform(conf.transform.x, conf.transform.y);
      this.labelContainer.addChild(text);
    });
  }

  drawAxis() {
    let x = new PIXI.Graphics();
    let y = new PIXI.Graphics();
    const length = this.pixiApp.screen.width;
    const axis = this.config.draw.axis;

    x.setTransform(0, this.pixiApp.screen.height / 2);
    y.setTransform(this.pixiApp.screen.width/2, 0);

    x.lineStyle(axis.weight, axis.color, 1)
     .moveTo(0, 0).lineTo(length, 0).beginFill(axis.color) // 直線
     .lineTo(length - axis.arrow, axis.arrow / 2).lineTo(length - axis.arrow, -1 * axis.arrow / 2).lineTo(length, 0)
     .closePath().endFill();
    y.lineStyle(axis.weight, axis.color, 1)
     .moveTo(0, length).lineTo(0, 0).beginFill(axis.color)
     .lineTo(axis.arrow / 2, axis.arrow).lineTo(-1 * axis.arrow / 2, axis.arrow).lineTo(0, 0)
     .closePath().endFill();

    this.axisContainer.addChild(x, y);
  }

  drawPlots() {
    this.mapContainer.removeChildren();
    let plots = this.project.plots;
    plots.forEach(plot => {
      let p = new PIXI.Graphics();
      p.name = plot.id;
      p.interactive = true;
      p.buttonMode = true;
      p.beginFill(this.config.draw.circle.color, 1);
      p.drawCircle(0, 0, this.config.draw.circle.radius);
      p.hitArea = new PIXI.Circle(0, 0, this.config.draw.circle.radius + 5);
      p.endFill();
      p.on('pointerdown', this.onDragStart)
       .on('pointerdown', this.showPlots.bind(this))
       .on('pointerup', this.onDragEnd)
       .on('pointerupoutside', this.onDragEnd)
       .on('pointermove', this.onDragMove)
       .on('pointerup', this.updatePlot.bind(this))
       .on('pointerupoutside', this.updatePlot.bind(this));
      p.position.set(plot.x, plot.y);
      
      // let name = plot.name;
      // let text = new PIXI.Text(name, this.config.draw.label);
      // text.anchor.set(0.5, 1);
      // text.position.set(plot.x, plot.y);

      this.mapContainer.addChild(p);
      this.plotsContainerMap.set(plot.id, p);
    });
  }

  public showPlots(e: PIXI.interaction.InteractionEvent) {
    if (this.selectedPlot.id === e.currentTarget.name) {
      this.clearPlot();
    } else {
      this.selectedPlot.x = e.currentTarget.x;
      this.selectedPlot.y = e.currentTarget.y;
      this.selectedPlot.id = e.currentTarget.name;
      console.log('selected', this.project.plots[this.plotsIndex.get(this.selectedPlot.id)]);
      this.selectedPlot.name = this.project.plots[this.plotsIndex.get(this.selectedPlot.id)].name;
      console.log('selected', this.selectedPlot);
      // console.log('selected', this.project.plots[this.plotsIndex.get(this.selectedPlot.id)]);
    }
  }

  public openNewPlot() {
    const newPlot: IPlot = {
      name: 'new plot',
      x: 0,
      y: 0,
      // z: 0,
      project_id: this.project.id,
      created_user_id: this.mapService.getUser().id
    };
    this.modalService.openModal({
      type: 'plot',
      data: newPlot,
      isOpen: true,
    });
  }

  private addPlot(plot: IPlot) {
    const {data , isValid} = this.valid.validPlot(plot, 'ADD');
    if(!isValid) {
      this.modalService.openSnackBar({
        message: `Please fill all inputs: ${plot.name}`,
        action: 'OK'
      });
      return;
    }
    this.graphql.addPlot(data).subscribe((res) => {
      console.log('Got data', res);
      this.modalService.openSnackBar({
        message: `Success add plot: ${data.name}`,
        action: 'OK'
      });
    },(error) => {
      console.log('There was an error sending the query', error);
      this.modalService.openSnackBar({
        message: `Failed add plot: ${data.name}`,
        action: 'OK'
      });
    });
  }

  updatePlot(e) {
    console.log(e, 'update data');
  }

  clearPlot() {
    this.selectedPlot =  {
      id: '',
      name: '',
      x: 0,
      y: 0
    };
  }

  private onDragStart = function(e) {
    console.log(e, 'drag start');
    console.log(this);
    this.data = e.data;
    this.alpha = 0.5;
    this.dragging = true;
  }

  private onDragEnd = function(e) {
    console.log(e, 'drag end');
    console.log(this);
    this.alpha = 1;
    this.dragging = false;
    // set the interaction data to null
    this.data = null;
  }

  private onDragMove = function(e) {
    // console.log(e, 'dragging');
    if (this.dragging) {
      const newPosition = this.data.getLocalPosition(this.parent);
      this.x = Math.round(newPosition.x);
      this.y = Math.round(newPosition.y);
    }
  }

  public onChangeSelectedPlot = function() {
    console.log(`onChange selectedPlot`);
    const id = this.selectedPlot.id;
    this.project.plots[this.plotsIndex.get(id)].name = this.selectedPlot.name;
    this.project.plots[this.plotsIndex.get(id)].x = this.selectedPlot.x;
    this.project.plots[this.plotsIndex.get(id)].y = this.selectedPlot.y;
    this.drawPlots();
  }
}

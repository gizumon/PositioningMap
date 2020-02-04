import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IProject } from 'src/app/templates/template';
import { MapService } from 'src/app/services/map.service';
import { UserService } from 'src/app/services/user.service';

import * as PIXI from "pixi.js";
import { ContainerService } from 'src/app/services/container.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, AfterViewInit {
  @ViewChild('pixiContainer', {static: false}) canvasArea: ElementRef<HTMLElement>;
  pixiApp: PIXI.Application;
  mapContainer: PIXI.Container;
  axisContainer: PIXI.Container;
  labelContainer: PIXI.Container;
  project: IProject;
  // plots: PIXI.Container[] = [];
  plot =  {
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
        fontFamily: "\"Arial Black\", Gadget, sans-serif",
        fontSize: 20,
        fontStyle: 'normal',
        fontWeight: '600',
        fill: ['#4286f4', '#373B44'], // gradient
        stroke: '#FFF',
        strokeThickness: 1,
        dropShadow: true,
        dropShadowColor: '#000000',
        dropShadowBlur: 10,
        dropShadowAngle: Math.PI / 6,
        dropShadowDistance: 7,
        wordWrap: true,
        wordWrapWidth: 100,
        align: "center",
        breakWords: true,
        fontVariant: "small-caps",
        letterSpacing: -1,
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
    private userService: UserService,
    private containerService: ContainerService
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
    const project_id = this.route.snapshot.paramMap.get('id');
    this.project = this.mapService.getProject(this.userService.getUser().id, project_id);
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
      label: this.project.label.x[0],
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
      label: this.project.label.x[1],
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
      label: this.project.label.y[0],
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
      label: this.project.label.y[1],
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
    let plots = this.project.plots;
    plots.forEach(plot => {
      let p = new PIXI.Graphics();
      p.name = plot.id;
      p.interactive = true;
      p.buttonMode = true;
      p.beginFill(this.config.draw.circle.color, 1);
      p.drawCircle(0, 0, this.config.draw.circle.radius);
      p.endFill();
      p.on('pointerdown', this.onDragStart)
       .on('pointerdown', this.showPlots.bind(this))
       .on('pointerup', this.onDragEnd)
       .on('pointerupoutside', this.onDragEnd)
       .on('pointermove', this.onDragMove)
       .on('pointerup', this.updatePlot.bind(this))
       .on('pointerupoutside', this.updatePlot.bind(this));
      p.position.set(plot.coordinate.x, plot.coordinate.y);
      
      // let name = this.project.plots.filter((plot) => {
      //   return p.name === plot.id;
      // })[0].name;
      // let text = new PIXI.Text(name, this.config.draw.label);
      // text.anchor.set(0.5, 1);
      // text.position.set(plot.coordinate.x, plot.coordinate.y);

      this.mapContainer.addChild(p);
      // this.plots.push(p);
    });
  }

  showPlots(e: PIXI.interaction.InteractionEvent) {
    if (this.plot.id === e.currentTarget.name) {
      this.clearPlot();
    } else {
      this.plot.x = e.currentTarget.x;
      this.plot.y = e.currentTarget.y;
      this.plot.id = e.currentTarget.name;
      console.log(this.plot);
      this.plot.name = this.project.plots.filter((plot) => {
        return plot.id === this.plot.id;
      })[0].name;
    }
  }

  updatePlot(e) {
    console.log(e, 'update data');
  }

  clearPlot() {
    this.plot =  {
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
}

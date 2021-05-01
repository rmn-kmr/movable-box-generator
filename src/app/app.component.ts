import { Component, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { fromEvent } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None

})
export class AppComponent {
  boxList: Box[] = []; // box container
  selectedBox: Box; // selected box ref
  isControlEnable: boolean = false; // box intraction flag
  buttonSubscription: Subscription; // key event subscription
  translateBy: number = 10; // box translationby on each keypress

  // create new box object and store in boxlist 
  addNewBox() {
    let newBox = this.getNewBox();
    newBox.id = this.boxList.length;
    newBox.zIndex = this.boxList.length * 5;
    this.boxList.push(newBox)
    setTimeout(()=>{
      const children = document.getElementById(newBox.id + "");
      if(children)
      children.style.boxShadow = `black ${newBox.id * 2}px ${newBox.id * 2}px ${newBox.id * 6}px ${newBox.id}px` 
    }, 10)
  }

  // control change listener 
  controlSwitch(event) {
    this.isControlEnable = event.target.checked;
    if (this.isControlEnable) {
      // subscribed keyup event if switch control is enable
      this.buttonSubscription = fromEvent(document, 'keyup')
        .subscribe((event: KeyboardEvent) => {
          if (event.key === 'Delete' && this.selectedBox) {
            this.boxList = this.boxList.filter((box: Box) => box.id != this.selectedBox.id);
          } else if (this.isControlEnable) {
            let yTranslation = 0, xTranslation = 0;
            if (event.key === Direction.Up) {
              yTranslation = -this.translateBy;
            } else if (event.key === Direction.Down) {
              yTranslation = this.translateBy;
            } else if (event.key === Direction.Left) {
              xTranslation = -this.translateBy;
            } else if (event.key === Direction.Right) {
              xTranslation = this.translateBy
            }
            this.translateBox(xTranslation, yTranslation)
          }
        });
    } else {
      // unsubscribed keyup event if switch control is disabled
      this.buttonSubscription.unsubscribe();
      this.selectedBox = undefined;
    }
  }

  // box translation controller
  translateBox(xTranslation : number, yTranslation: number) {
    if (this.selectedBox && (xTranslation != 0 || yTranslation != 0)) {
      this.selectedBox.positionX += xTranslation;
      this.selectedBox.positionY += yTranslation;
      if (this.selectedBox.positionX < 0) {
        this.selectedBox.positionX = 0
      }
      if (this.selectedBox.positionY < 0) {
        this.selectedBox.positionY = 0
      }
      const children = document.getElementById(this.selectedBox.id + "");
      children.style.transform = `translate(${this.selectedBox.positionX}px, ${this.selectedBox.positionY}px)`;
    }
  }

  // box clicked listener
  boxClicked(box: Box) {
    if(this.isControlEnable){
      this.selectedBox = box;
    }
  }

  // genrating new Box
  getNewBox(): Box {
    const box: Box = {
      id: 0,
      positionX: 0,
      positionY: 0,
      zIndex: 0,
      selected: false
    }
    return box;
  }

}

interface Box {
  id: number,
  positionX: number,
  positionY: number,
  zIndex: number,
  selected: boolean
}
enum Direction {
  Up = "w",
  Down = "s",
  Left = "a",
  Right = "d",
}

import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appHighligth]'
})
export class HighligthDirective {

  @HostListener('mouseenter') onMouseEnter(){
    this.element.nativeElement.style.backgroundColor = 'red';
  }

  @HostListener('mouseleave') onMouseLeave(){
    this.element.nativeElement.style.backgroundColor = 'white';
  }

  constructor(
    private element : ElementRef
  ) {

  }

}

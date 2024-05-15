import { Directive, ElementRef, HostListener } from '@angular/core';
import { ImageServiceService } from '../services/image-service.service';

@Directive({
  selector: '[loadImg]'
})
export class LoadImgDirective {

  constructor(private elRef: ElementRef,private imageService: ImageServiceService) {
    imageService.imageLoading(elRef.nativeElement);
  }
  @HostListener('load')
  onLoad() {
    this.imageService.imageLoadedOrError(this.elRef.nativeElement);
  }

  @HostListener('error')
  onError() {
    this.imageService.imageLoadedOrError(this.elRef.nativeElement);
  }
}

import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { LoaderService } from 'src/app/shared/services/loader.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoaderComponent{

  public readonly loader$;
  
  constructor(private readonly loaderService: LoaderService) { 
    this.loader$ = this.loaderService.loader$;
  }

}

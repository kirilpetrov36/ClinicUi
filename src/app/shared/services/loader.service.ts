import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private readonly isShowLoaderSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  public readonly loader$: Observable<boolean> = this.isShowLoaderSubject.asObservable();

  public showLoader(): void {
    this.isShowLoaderSubject.next(true);
  }

  public hideLoader(): void {
    this.isShowLoaderSubject.next(false);
  }
}

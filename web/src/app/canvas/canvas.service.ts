import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { TrackerModel } from '../models/tracker.model';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AuthService } from '../auth/auth.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CanvasService {

  private trackerUrl = `${environment.apiUrl}/tracker`;
  private updatedTracker: BehaviorSubject<string>;
  private readonly updatedTrackerLabelId$: Observable<string>;

  constructor(
    private authService: AuthService,
    private http: HttpClient) {
    this.updatedTracker = new BehaviorSubject("");
    this.updatedTrackerLabelId$ = this.updatedTracker.asObservable();
  }

  getTrackingInformation(id: string): Observable<TrackerModel> {
    const url = `${this.trackerUrl}/${id}`;
    return this.http.get<TrackerModel>(url)
      .pipe(catchError(this.handleError<TrackerModel>(`getTrackers trackerId=${id}`)));
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T): (error: any) => Observable<T> {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      // this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  updateTrackerModel(model: TrackerModel) {
    const url = `${this.trackerUrl}/update/${model.id}`;
    return this.http.put(url, model).subscribe(val => {
        alert("Tracking saved successfully");
        this.updatedTracker.next(model.labelId);
        return val;
      },
      response => {
        console.log("PUT call in error", response);
      },
      () => {
        console.log("The PUT observable is now completed.");
      });
  }

  getUpdatedTrackerLabelId$(): Observable<string> {
    return this.updatedTrackerLabelId$;
  }
}

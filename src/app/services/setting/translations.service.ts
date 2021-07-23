import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { TranslateLoader } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';

export class TranslationsCustom implements TranslateLoader {
  baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) {

  }

  getTranslation(langCountry: string): Observable<any> {
    debugger;
    return forkJoin(
      this.http.post(
          this.baseUrl + 'api/languageSetting', {
          method: 'translate',
          langCountry: langCountry
        }
        // '/assets/i18n/' + langCountry + '.json'
      ))
      .pipe(map(data => {
        const res = {};
        // const rolePrograms: any[] = JSON.parse(data.toString());
        data.forEach((obj) => {
          Object.assign(res, JSON.parse(obj.toString()));
        });
        return res;
      }));
  }

  getTranslation2(lang?: string) {
    debugger;
    return Observable.create(observer => {
      this.http.post(this.baseUrl + 'api/languageSetting',
        {
          method: 'translate',
          langCountry: lang
        }).subscribe((res: Response) => {
          observer.next(res);
          observer.complete();
        });
    });
  }

}

import { AuthorizationService } from './services/authorization/authorization.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MessageService } from 'primeng/api';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/shared/layout/header/header.component';
import { SidebarComponent } from './components/shared/layout/sidebar/sidebar.component';
import { FooterComponent } from './components/shared/layout/footer/footer.component';
import { HomeComponent } from './components/home/home.component';
import { PagenotfoundComponent } from './components/shared/pagenotfound/pagenotfound.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { LocalstorageService } from './services/global/localstorage.service';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ToastModule } from 'primeng/toast';
import { AlertService } from './services/global/alert.service';
import { AlertComponent } from './components/shared/layout/alert/alert.component';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { MassagesComponent } from './components/shared/layout/massages/massages.component';
import { MassagesService } from './services/global/massages.service';
import { MeetingroomService } from './services/meetingroom/meetingroom.service';
import { ProjectplanService } from './services/projectplan/projectplan.service';
import { BookingcarService } from './services/bookingcar/bookingcar.service';
import { DatePipe } from '@angular/common';
import { LoginComponent } from './components/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JwtInterceptor } from './helpers/jwt.interceptor';
import { ErrorInterceptor } from './helpers/error.interceptor';
import { MainDataService } from './services/maindata/maindata.service';
import { ReportService } from './services/report/report.service';
import { GalleriaModule } from 'primeng/galleria';
import { FullCalendarModule } from 'primeng/fullcalendar';
import { CalendarHolidayComponent } from './components/shared/layout/calendar-holiday/calendar-holiday.component';
import { TableModule } from 'primeng/table';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { UserRoleService } from './services/user-role/user-role.service';
import { FilterDistinctProgramGroupPipe, FilterProgramGroupPipe } from './components/shared/layout/sidebar/filter-program-group.pipe';
import { CalendarMeetingComponent } from './components/calendar-meeting/calendar-meeting.component';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ApprovalService } from './services/approval/approval.service';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslationsCustom } from './services/setting/translations.service';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    HomeComponent,
    PagenotfoundComponent,
    AlertComponent,
    MassagesComponent,
    LoginComponent,
    CalendarHolidayComponent,
    FilterProgramGroupPipe,
    FilterDistinctProgramGroupPipe,
    CalendarMeetingComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NgxSpinnerModule,
    ToastModule,
    MessagesModule,
    MessageModule,
    FormsModule,
    ReactiveFormsModule,
    GalleriaModule,
    FullCalendarModule,
    TableModule,
    CheckboxModule,
    DialogModule,
    InputSwitchModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useClass: TranslationsCustom,
        deps: [HttpClient]
      }
    }),
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    // { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    MessageService,
    LocalstorageService,
    AlertService,
    MassagesService,
    MeetingroomService,
    ProjectplanService,
    BookingcarService,
    DatePipe,
    AuthorizationService,
    MainDataService,
    ReportService,
    UserRoleService,
    ApprovalService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }



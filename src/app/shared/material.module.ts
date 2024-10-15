import {CommonModule} from "@angular/common";
import {NgModule} from "@angular/core";
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatSelectModule} from '@angular/material/select';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatTabsModule} from '@angular/material/tabs';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatDialogModule} from '@angular/material/dialog';
import {MatSliderModule} from '@angular/material/slider';
import {MatBadgeModule} from '@angular/material/badge';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatExpansionModule} from '@angular/material/expansion';
import {FormsModule} from '@angular/forms';
import {MatGridListModule} from '@angular/material/grid-list';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {MatStepperModule} from '@angular/material/stepper';
import {MatMenuModule} from '@angular/material/menu';
import {MatRadioModule} from '@angular/material/radio';
import {MatListModule} from '@angular/material/list';
import { MatFormFieldModule } from "@angular/material/form-field";
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatDividerModule} from '@angular/material/divider';
import {MatChipsModule} from '@angular/material/chips';
import {MatProgressBarModule} from '@angular/material/progress-bar';


const matirealmodule = [
        CommonModule,
        MatInputModule,
        MatButtonModule,
        MatSelectModule,
        MatToolbarModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatCardModule,
        MatIconModule,
        MatSlideToggleModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatProgressSpinnerModule,
        MatTabsModule,
        MatCheckboxModule,
        MatDialogModule,
        MatSliderModule,
        MatBadgeModule,
        MatSidenavModule,
        MatExpansionModule,
        FormsModule,
        MatGridListModule,
        DragDropModule,
        MatStepperModule,
        MatMenuModule,
        MatRadioModule,
        MatListModule,
        MatFormFieldModule,
        MatTooltipModule,
        MatDividerModule,
        MatChipsModule,
        MatProgressBarModule
]
@NgModule({
    imports: [
        matirealmodule
    ],
    exports: [
        matirealmodule
    ]
})
export class MaterialModule { }

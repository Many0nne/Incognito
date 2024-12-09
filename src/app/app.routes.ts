import { Routes } from '@angular/router';
import { LobbyComponent } from './lobby/lobby.component';
import { RoomComponent } from './room/room.component';
import { EndGameComponent } from './end-game/end-game.component';

export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' }, 
    { path: 'home', component: LobbyComponent, pathMatch: 'full' },
    { path: 'room/:room', component: RoomComponent, pathMatch: 'full'},
    { path: 'endgame', component: EndGameComponent, pathMatch: 'full'}
];

export class AppRoutingModule { }
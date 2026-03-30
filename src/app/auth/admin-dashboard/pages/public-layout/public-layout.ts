import { Component } from '@angular/core';
import { NavBar } from "../../../../pages/nav-bar/nav-bar";
import { RouterOutlet } from "@angular/router";
import { Footer } from "../../../../pages/footer/footer";
import { ChatWidget } from "../../../../pages/chat-widget/chat-widget";

@Component({
  selector: 'app-public-layout',
  imports: [NavBar, RouterOutlet, Footer, ChatWidget],
  templateUrl: './public-layout.html',
})
export class PublicLayout { }

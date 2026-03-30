import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat-widget',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-widget.html',
})
export class ChatWidget {
  open = false;
  input = '';
  cargando = false;
  mensajes: { tipo: 'user' | 'bot'; texto: string }[] = [
    { tipo: 'bot', texto: '¡Hola! 🎂 Soy el asistente de Ana\'s Bakery. ¿Qué tipo de tarta te apetece hoy?' }
  ];

  constructor(private http: HttpClient) {}

  toggleChat() { this.open = !this.open; }

  enviar() {
    if (!this.input.trim() || this.cargando) return;

    const texto = this.input.trim();
    this.mensajes.push({ tipo: 'user', texto });
    this.input = '';
    this.cargando = true;

    this.http.post<string>('http://localhost:8080/api/chat', {
      mensaje: texto,
      historial: this.mensajes.filter(m => m.tipo === 'user').map(m => m.texto)
    }, {
      responseType: 'text' as 'json',
      headers: { 'Content-Type': 'application/json' }
    }).subscribe({
      next: (res: any) => {
        this.mensajes.push({ tipo: 'bot', texto: res });
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error chat:', err); 
        this.mensajes.push({ tipo: 'bot', texto: '⚠️ Error al conectar con el asistente.' });
        this.cargando = false;
      }
    });
  }
}

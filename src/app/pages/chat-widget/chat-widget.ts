import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
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

  private http = inject (HttpClient);
  private cdr = inject (ChangeDetectorRef);

  toggleChat() { this.open = !this.open; }

  enviar() {
    if (!this.input.trim() || this.cargando) return;

    const texto = this.input.trim();
    this.mensajes.push({ tipo: 'user', texto });
    this.input = '';
    this.cargando = true;
    this.cdr.detectChanges();

    this.http.post<string>('http://localhost:8080/api/chat', {
      mensaje: texto,
      historial: this.mensajes.map(m => ({
        role: m.tipo === 'user' ? 'user' : 'assistant',
        content: m.texto
      }))
    }, {
      responseType: 'text' as 'json',
      headers: { 'Content-Type': 'application/json' }
    }).subscribe({
      next: (res: any) => {
        this.cargando = false;
        this.simularEscritura(res);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error chat:', err);
        this.mensajes.push({ tipo: 'bot', texto: 'Error al conectar con el asistente.' });
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  private simularEscritura(texto: string) {
  let i = 0;
  const mensajeBot = { tipo: 'bot' as const, texto: '' };
  this.mensajes.push(mensajeBot);

  const intervalo = setInterval(() => {
    mensajeBot.texto += texto[i];
    i++;
    this.cdr.detectChanges();

    if (i >= texto.length) {
      clearInterval(intervalo);
    }
  }, 18);
}
}

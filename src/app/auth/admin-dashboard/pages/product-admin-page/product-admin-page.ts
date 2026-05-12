import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductoBase } from '../../../../models/producto-base.model';
import { ProductoService } from '../../../../services/producto.service';

type CampoImagen = 'imgPaso1' | 'imgPaso2' | 'imgPaso3' | 'imgPaso4' | 'imgPaso5';

@Component({
  selector: 'app-product-admin-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './product-admin-page.html',
})
export class ProductAdminPage implements OnInit {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productoService = inject(ProductoService);

  producto = signal<ProductoBase | null>(null);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) return;

    this.productoService.getProductoById(id).subscribe({
      next: (data) => this.producto.set(data),
      error: (err) => console.error(err)
    });
  }

  getImagenUrl(ruta?: string | null): string {
    if (!ruta || ruta.trim() === '') {
      return 'assets/img/placeholder.png';
    }

    if (ruta.startsWith('http://') || ruta.startsWith('https://')) {
      return ruta;
    }

    if (ruta.startsWith('assets/')) {
      return ruta;
    }

    if (ruta.startsWith('/assets/')) {
      return ruta.substring(1);
    }

    if (ruta.startsWith('uploads/')) {
      return 'http://localhost:8080/' + ruta;
    }

    if (ruta.startsWith('/uploads/')) {
      return 'http://localhost:8080' + ruta;
    }

    return 'http://localhost:8080/' + ruta;
  }

  guardarProducto() {
    const productoActual = this.producto();

    if (!productoActual) return;

    this.productoService
      .updateProducto(productoActual.id, productoActual)
      .subscribe(() => {
        alert('Producto actualizado');
        this.router.navigate(['/admin/products']);
      });
  }

  uploadImagen(event: Event, campo: CampoImagen) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    fetch('http://localhost:8080/api/upload', {
      method: 'POST',
      body: formData
    })
      .then(res => res.text())
      .then(path => {
        const productoActual = this.producto();

        if (!productoActual) return;

        const actualizado = { ...productoActual, [campo]: path };

        this.producto.set(actualizado);
      });
  }
}

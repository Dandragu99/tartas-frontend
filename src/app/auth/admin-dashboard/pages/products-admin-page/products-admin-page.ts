import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductoBase } from '../../../../models/producto-base.model';
import { ProductoService } from '../../../../services/producto.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-products-admin-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './products-admin-page.html',
})
export class ProductsAdminPage implements OnInit {

  private productoService = inject(ProductoService);

  productos = signal<ProductoBase[]>([]);
  previews: Record<string, string> = {};

  nuevoProducto: ProductoBase = {
    nombre: '',
    descripcion: '',
    precioBase: 0,
    imgPaso1: '',
    imgPaso2: '',
    imgPaso3: '',
    imgPaso4: '',
    imgPaso5: ''
  } as ProductoBase;

  ngOnInit() {
    this.cargarProductos();
  }

  cargarProductos() {
    this.productoService.getProductosBase().subscribe(data => {
      this.productos.set(data.reverse());
    });
  }

  crearProducto() {
    this.productoService.createProducto(this.nuevoProducto).subscribe(() => {

      this.cargarProductos();

      this.nuevoProducto = {
        id: 0,
        nombre: '',
        descripcion: '',
        precioBase: 0,
        imgPaso1: '',
        imgPaso2: '',
        imgPaso3: '',
        imgPaso4: '',
        imgPaso5: ''
      };
    });
  }

  uploadImagen(event: Event, campo: 'imgPaso1' | 'imgPaso2' | 'imgPaso3') {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      this.previews[campo] = e.target?.result as string;
    };
    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append('file', file);

    fetch('http://localhost:8080/api/upload', {
      method: 'POST',
      body: formData
    })
      .then(res => res.text())
      .then(path => {
        this.nuevoProducto = { ...this.nuevoProducto, [campo]: path };
      });
  }

  eliminarProducto(id: number) {

    if (!confirm("¿Eliminar producto?")) return;

    this.productoService.deleteProducto(id).subscribe(() => {
      this.cargarProductos();
    });

  }

}

import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductoBase } from '../../../../models/producto-base.model';
import { ProductoService } from '../../../../services/producto.service';


@Component({
  selector: 'app-product-admin-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
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

  guardarProducto() {

    const productoActual = this.producto();

    if (!productoActual) return;

    this.productoService
      .updateProducto(productoActual.id, productoActual)
      .subscribe(() => {

        alert("Producto actualizado");

        this.router.navigate(['/admin/products']);

      });

  }



  uploadImagen(event: any, campo: 'imgPaso1' | 'imgPaso2' | 'imgPaso3') {

    const file = event.target.files[0];
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


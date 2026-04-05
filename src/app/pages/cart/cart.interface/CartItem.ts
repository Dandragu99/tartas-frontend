export interface CartItem {
  cartId: string;        
  nombre: string;
  imagen: string;
  bizcocho?: string;
  relleno?: string;
  cobertura?: string;
  tamano?: number;
  pisos: number;
  extras: string[];
  mensaje?: string;
  alergias?: string;
  comentarios?: string;
  precioUnitario: number;
  cantidad: number;
}

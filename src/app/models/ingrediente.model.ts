export interface Ingrediente {
  id: number;
  nombre: string;
  tipo: 'BIZCOCHO' | 'RELLENO' | 'COBERTURA' | 'EXTRA'; // Esto lo necesito para el enum de JAVA
  precioAdicional: number;
  disponible: boolean;
}
